(()=>{
'use strict';

const VERSION='11.51.0';
const AREAS=['qingyun','blackwind','blood','thunder','marsh','taixu'];
const AREA_NAME={qingyun:'청운산 후산',blackwind:'흑풍곡',blood:'적혈비경',thunder:'천뢰봉',marsh:'자운택',taixu:'태허유적'};
const TYPE_NAME={charging_boar:'돌진형',ranged_toad:'원거리형',exploding_beetle:'폭렬형',command_ape:'호령형',shield_pangolin:'호체형',sword_sentinel:'검위',formation_warden:'진위',taixu_boss:'태허진령'};
const OBJECTIVES={
  qingyun:['첫 무사 귀환','한 원정에서 영초 8개 회수','요수 군락 3단계에서 대형 무리 격파','강화·희귀 요수 격파 후 귀환','생태 노드 3종 4단계 이상에서 귀환'],
  blackwind:['산수·비보를 목격하고 귀환','산수에게 빼앗기기 전에 비보 확보','인연 3단계 이상에서 비보 확보','인연 4단계 이상에서 강화 무리와 비보 확보','인연 5단계 쟁탈을 완수하고 생환'],
  blood:['영맥을 발견하고 귀환','영맥 하나를 완전 채굴','영맥 3단계 수호전 완수','영맥 4단계 대형 영맥 확보','영맥 5단계 다중 방어전 완수'],
  thunder:['돌진형을 격파하고 귀환','돌진형과 원거리형을 한 원정에서 격파','낙뢰 3단계에서 낙뢰를 피하고 귀환','낙뢰 4단계 연속 낙뢰와 특수 혼합 무리 돌파','낙뢰 5단계 정예 무리를 돌파하고 생환'],
  marsh:['폭렬형 격파','폭발 피해 없이 폭렬형 무리 격파','폭렬형·호령형 혼합 무리 격파','호체형이 포함된 특수 조합 격파','특수 3종 정예 무리를 돌파하고 생환'],
  taixu:['검위 또는 진위 격파','장판을 견디고 무리 격파','진법 결절 파괴 후 귀환','진법 4단계에서 결절과 대형 무리 돌파','태허진령 격파']
};

const rank=(api,id,area=api.state.area)=>Math.max(0,Math.min(5,Math.round(+api.state.zones?.[area]?.tree?.[id]||0)));
function ensure(M){
  M.mastery||={version:1,areas:{}};
  M.mastery.version=1;M.mastery.areas||={};
  for(const area of AREAS){const row=M.mastery.areas[area]||(M.mastery.areas[area]={marks:[0,0,0,0,0]});row.marks=Array.from({length:5},(_,i)=>row.marks?.[i]?1:0)}
  M.formationSkills||={version:1,daoMarks:0,ranks:{},traits:{}};
  M.formationSkills.daoMarks=Math.max(0,Math.round(+M.formationSkills.daoMarks||0));
  return M.mastery;
}
function marks(M,area){ensure(M);return M.mastery.areas[area]?.marks?.reduce((a,b)=>a+(b?1:0),0)||0}
function daoists(M){return AREAS.reduce((sum,area)=>sum+(marks(M,area)>=5?1:0),0)}
function killed(run,type){return +run?.mastery?.kills?.[type]||0}
function anyRare(run){return !!run?.mastery?.rareKill}
function safeData(api){const run=api.run||{},m=run.mastery||{};return{run,m,kills:+run.kills||0,herbs:(+run.h0||0)+(+run.h1||0)+(+run.h2||0)}}
function predicates(area,api){
  const {run,m,kills,herbs}=safeData(api),damage=run.damageBySource||{},explosionDamage=Object.entries(damage).some(([key,value])=>key.includes('exploding_beetle:explosion')&&value>0);
  if(area==='qingyun')return[true,herbs>=8,rank(api,'eco2')>=3&&kills>=5,anyRare(run),['eco1','eco2','eco3'].every(id=>rank(api,id)>=4)];
  if(area==='blackwind')return[(run.thieves||run.treasures)>0,run.treasures>0,rank(api,'fate1')>=3&&run.treasures>0,rank(api,'fate2')>=4&&run.treasures>0&&anyRare(run),rank(api,'fate3')>=5&&run.treasures>0&&run.fateContestDone];
  if(area==='blood')return[!!run.veinSeen,!!run.veinMined,rank(api,'res1')>=3&&!!run.veinMined,rank(api,'res2')>=4&&!!run.largeVein,rank(api,'res3')>=5&&!!run.veinDefenseComplete];
  if(area==='thunder')return[killed(run,'charging_boar')>0,killed(run,'charging_boar')>0&&killed(run,'ranged_toad')>0,rank(api,'storm1')>=3&&run.dodges>0,rank(api,'storm2')>=4&&run.dodges>=2&&m.specialKinds>=2,rank(api,'storm3')>=5&&anyRare(run)&&m.specialKinds>=2];
  if(area==='marsh')return[killed(run,'exploding_beetle')>0,killed(run,'exploding_beetle')>=2&&!explosionDamage,killed(run,'exploding_beetle')>0&&killed(run,'command_ape')>0,killed(run,'shield_pangolin')>0&&m.specialKinds>=2,killed(run,'exploding_beetle')>0&&killed(run,'command_ape')>0&&killed(run,'shield_pangolin')>0&&anyRare(run)];
  if(area==='taixu')return[killed(run,'sword_sentinel')+killed(run,'formation_warden')>0,m.zoneExperienced&&kills>=3,m.formationNodes>0,rank(api,'formation2')>=4&&m.formationNodes>=2&&kills>=5,killed(run,'taixu_boss')>0];
  return[false,false,false,false,false];
}
function onBegin(api){
  ensure(api.state);
  api.run.mastery={kills:{},types:{},specialKinds:0,rareKill:0,formationNodes:0,zoneExperienced:0};
}
function onKill(enemy,api){
  const m=api.run?.mastery;if(!m||!enemy)return;
  m.kills[enemy.type]=(m.kills[enemy.type]||0)+1;
  if(TYPE_NAME[enemy.type])m.types[enemy.type]=1;
  m.specialKinds=Object.keys(m.types).length;
  if(enemy.grade==='rare'||enemy.grade==='enhanced'||enemy.rare||enemy.boss)m.rareKill=1;
  if(enemy.formationNode)m.formationNodes++;
  if(enemy.type==='sword_sentinel'||enemy.type==='formation_warden')m.zoneExperienced=1;
}
function onFinish(reason,api){
  if(reason!=='return'||!AREAS.includes(api.state.area))return'';
  const M=api.state,area=M.area;ensure(M);
  const row=M.mastery.areas[area],checks=predicates(area,api);
  let gained=-1;
  for(let i=0;i<5;i++)if(!row.marks[i]&&checks[i]){row.marks[i]=1;gained=i;break}
  if(gained<0)return'';
  M.formationSkills.daoMarks=(+M.formationSkills.daoMarks||0)+1;
  api.save?.();
  return `<div class="event"><b>비경 숙련 ${['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ'][gained]} · 도흔 획득</b><br>${AREA_NAME[area]}: ${OBJECTIVES[area][gained]}<br>도흔 +1 · ${marks(M,area)}/5</div>`;
}
function summary(M){ensure(M);return{daoMarks:+M.formationSkills.daoMarks||0,daoists:daoists(M),areas:Object.fromEntries(AREAS.map(area=>[area,{name:AREA_NAME[area],marks:marks(M,area),objectives:OBJECTIVES[area]}]))}}

window.__xianxiaMastery={version:VERSION,areas:AREAS,objectives:OBJECTIVES,ensure,marks,daoists,summary,onBegin,onKill,onFinish};
})();

//# sourceURL=mastery_runtime_v11_51.js
