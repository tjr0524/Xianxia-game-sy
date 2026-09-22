(()=>{
'use strict';

const VERSION='11.51.67';
const AREAS=['qingyun','blackwind','blood','thunder','marsh','taixu'];
const AREA_NAME={qingyun:'청운산 후산',blackwind:'흑풍곡',blood:'적혈비경',thunder:'천뢰봉',marsh:'자운택',taixu:'태허유적'};
const TYPE_NAME={charging_boar:'돌진형',ranged_toad:'원거리형',exploding_beetle:'폭렬형',command_ape:'호령형',shield_pangolin:'호체형',sword_sentinel:'검위',formation_warden:'진위',taixu_boss:'태허진령'};
const OBJECTIVES={
  qingyun:['첫 무사 귀환','한 원정에서 영초 8개 회수','요수 군락 3단계에서 대형 무리 격파','강화·희귀 요수 격파 후 귀환','생태 노드 3종 4단계 이상에서 귀환'],
  blackwind:['산수·비보를 목격하고 귀환','산수에게 빼앗기기 전에 비보 확보','인연 3단계 이상에서 비보 확보','인연 4단계 이상에서 강화 무리와 비보 확보','인연 5단계 쟁탈을 완수하고 생환'],
  blood:['영맥을 발견하고 귀환','영맥 하나를 완전 채굴','영맥 3단계 수호전 완수','영맥 4단계 대형 영맥 확보','영맥 5단계 다중 방어전 완수'],
  thunder:['천뢰에 1회 직격하고 귀환','한 원정에서 천뢰에 2회 직격','낙뢰 3단계에서 천뢰 직격 2회 후 귀환','낙뢰 4단계 연속 천뢰 직격 3회','낙뢰 5단계에서 천뢰 직격 3회와 정예 무리 돌파'],
  marsh:['폭렬형 격파','폭발 피해 없이 폭렬형 무리 격파','폭렬형·호령형 혼합 무리 격파','호체형이 포함된 특수 조합 격파','특수 3종 정예 무리를 돌파하고 생환'],
  taixu:['진안 수성 1회 완수','진안 수성 중 수호령 5체 이상 격파','진법 결절 1개 이상 파괴 후 수성 완수','모든 결절을 파괴하고 진법 완전 해체','태허진령 격파']
};

const rank=(api,id,area=api.state.area)=>Math.max(0,Math.min(5,Math.round(+api.state.zones?.[area]?.tree?.[id]||0)));
const FOUNDATION_AREAS=new Set(['thunder','marsh','taixu']);
const daoReward=area=>FOUNDATION_AREAS.has(area)?3:1;
const daoCompletionBonus=area=>FOUNDATION_AREAS.has(area)?0:2;
const AREA_COMPLETION_REWARD=1;
const daoRewardFor=(area,index)=>daoReward(area)+(index===4?daoCompletionBonus(area):0);
const rawMarks=(M,area)=>M?.mastery?.areas?.[area]?.marks?.reduce((a,b)=>a+(b?1:0),0)||0;
const rawClaimed=(M,area)=>M?.mastery?.areas?.[area]?.claimed?.reduce((a,b)=>a+(b?1:0),0)||0;
const objectiveMaxDaoMarks=AREAS.reduce((sum,area)=>sum+Array.from({length:5},(_,i)=>daoRewardFor(area,i)).reduce((a,b)=>a+b,0),0);
const completedObjectiveDaoMarks=M=>AREAS.reduce((sum,area)=>sum+Array.from({length:5},(_,i)=>M?.mastery?.areas?.[area]?.marks?.[i]?daoRewardFor(area,i):0).reduce((a,b)=>a+b,0),0);
const claimedObjectiveDaoMarks=M=>AREAS.reduce((sum,area)=>sum+Array.from({length:5},(_,i)=>M?.mastery?.areas?.[area]?.claimed?.[i]?daoRewardFor(area,i):0).reduce((a,b)=>a+b,0),0);
const completedAreaCount=M=>AREAS.reduce((sum,area)=>sum+(rawMarks(M,area)>=5?1:0),0);
const claimedAreaCompletionCount=M=>AREAS.reduce((sum,area)=>sum+(M?.mastery?.areas?.[area]?.areaCompletionClaimed?1:0),0);
const maxDaoMarks=objectiveMaxDaoMarks+AREAS.length*AREA_COMPLETION_REWARD;
const completedDaoMarks=M=>completedObjectiveDaoMarks(M)+completedAreaCount(M)*AREA_COMPLETION_REWARD;
const claimedDaoMarks=M=>claimedObjectiveDaoMarks(M)+claimedAreaCompletionCount(M)*AREA_COMPLETION_REWARD;
const legacyEarnedDaoMarks=M=>AREAS.reduce((sum,area)=>sum+rawMarks(M,area)*(FOUNDATION_AREAS.has(area)?2:1),0);
function ensure(M){
  M.mastery||={version:2,areas:{}};
  M.mastery.version=2;M.mastery.areas||={};
  for(const area of AREAS){
    const row=M.mastery.areas[area]||(M.mastery.areas[area]={marks:[0,0,0,0,0],claimed:[0,0,0,0,0]});
    row.marks=Array.from({length:5},(_,i)=>row.marks?.[i]?1:0);
    row.claimed=Array.from({length:5},(_,i)=>row.claimed?.[i]?1:0);
    row.areaCompletionClaimed=row.areaCompletionClaimed?1:0;
  }
  M.formationSkills||={version:1,daoMarks:0,ranks:{},traits:{}};
  M.formationSkills.daoMarks=Math.max(0,Math.round(+M.formationSkills.daoMarks||0));
  // Old builds paid mastery rewards immediately. First normalize their balance to the
  // 66-mark economy, then mark already completed records as claimed so the journal
  // cannot pay them a second time.
  if((M.formationSkills.daoEconomyVersion||0)<2){
    const delta=Math.max(0,completedObjectiveDaoMarks(M)-legacyEarnedDaoMarks(M));
    M.formationSkills.daoMarks+=delta;
    M.formationSkills.daoEconomyVersion=2;
  }
  if((M.formationSkills.daoJournalVersion||0)<1){
    for(const area of AREAS){
      const row=M.mastery.areas[area];
      row.claimed=Array.from({length:5},(_,i)=>row.marks[i]?1:0);
    }
    M.formationSkills.daoJournalVersion=1;
  }
  // The Taixu Sovereign now lives in the separate Core Formation trial.
  // Backfill saves that already cleared that trial so Taixu mastery V is not lost.
  if(M.events?.jiedanTrialCompleted&&!M.mastery.areas.taixu.marks[4]){
    M.mastery.areas.taixu.marks[4]=1;
    M.mastery.areas.taixu.claimed[4]=0;
  }
  return M.mastery;
}
function settleCompletionRewards(M,onlyArea){
  ensure(M);
  const targets=onlyArea&&AREAS.includes(onlyArea)?[onlyArea]:AREAS;
  let reward=0;
  for(const area of targets){
    const row=M.mastery.areas[area];
    if(rawMarks(M,area)<5||row.areaCompletionClaimed)continue;
    row.areaCompletionClaimed=1;
    reward+=AREA_COMPLETION_REWARD;
  }
  if(reward)M.formationSkills.daoMarks=(+M.formationSkills.daoMarks||0)+reward;
  return reward;
}
function marks(M,area){ensure(M);return rawMarks(M,area)}
function daoists(M){return AREAS.reduce((sum,area)=>sum+(marks(M,area)>=5?1:0),0)}
function killed(run,type){return +run?.mastery?.kills?.[type]||0}
function anyRare(run){return !!run?.mastery?.rareKill}
function safeData(api){const run=api.run||{},m=run.mastery||{};return{run,m,kills:+run.kills||0,herbs:(+run.h0||0)+(+run.h1||0)+(+run.h2||0)}}
function predicates(area,api){
  const {run,m,kills,herbs}=safeData(api),damage=run.damageBySource||{},explosionDamage=Object.entries(damage).some(([key,value])=>key.includes('exploding_beetle:explosion')&&value>0);
  if(area==='qingyun')return[true,herbs>=8,rank(api,'eco2')>=3&&kills>=5,anyRare(run),['eco1','eco2','eco3'].every(id=>rank(api,id)>=4)];
  if(area==='blackwind')return[(run.thieves||run.treasures)>0,run.treasures>0,rank(api,'fate1')>=3&&run.treasures>0,rank(api,'fate2')>=4&&run.treasures>0&&anyRare(run),rank(api,'fate3')>=5&&run.treasures>0&&run.fateContestDone];
  if(area==='blood')return[!!run.veinSeen,!!run.veinMined,rank(api,'res1')>=3&&!!run.veinMined,rank(api,'res2')>=4&&!!run.largeVein,rank(api,'res3')>=5&&!!run.veinDefenseComplete];
  if(area==='thunder')return[(run.lightningHits||0)>=1,(run.lightningHits||0)>=2,rank(api,'storm1')>=3&&(run.lightningHits||0)>=2,rank(api,'storm2')>=4&&(run.lightningHits||0)>=3,rank(api,'storm3')>=5&&(run.lightningHits||0)>=3&&anyRare(run)&&m.specialKinds>=2];
  if(area==='marsh')return[killed(run,'exploding_beetle')>0,killed(run,'exploding_beetle')>=2&&!explosionDamage,killed(run,'exploding_beetle')>0&&killed(run,'command_ape')>0,killed(run,'shield_pangolin')>0&&m.specialKinds>=2,killed(run,'exploding_beetle')>0&&killed(run,'command_ape')>0&&killed(run,'shield_pangolin')>0&&anyRare(run)];
  if(area==='taixu'){
    const trial=run.foundation?.taixuTrial,complete=(run.taixuTrials||0)>=1,allNodes=(trial?.nodesTotal||0)>0&&(trial?.nodesDestroyed||0)>=(trial?.nodesTotal||0);
    return[complete,complete&&kills>=5,complete&&m.formationNodes>=1,complete&&allNodes&&kills>=6,false];
  }
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
  if(reason!=='return')return'';
  const M=api.state;
  if(M.area==='jiedan_trial'&&api.run?.foundation?.bossKilled){
    ensure(M);
    const row=M.mastery.areas.taixu;
    if(row.marks[4])return'';
    row.marks[4]=1;row.claimed[4]=0;
    const reward=daoRewardFor('taixu',4),completionReward=settleCompletionRewards(M,'taixu');
    api.save?.();
    return `<div class="event"><b>비경 숙련 Ⅴ 기록</b><br>${AREA_NAME.taixu}: ${OBJECTIVES.taixu[4]}<br>도행록에서 도흔 +${reward} 수령 가능 · 숙련 ${marks(M,'taixu')}/5${completionReward?`<br><b>비경 숙련 완성</b> · 도흔 +${completionReward} 자동 지급`:''}</div>`;
  }
  if(!AREAS.includes(M.area))return'';
  const area=M.area;ensure(M);
  const row=M.mastery.areas[area],checks=predicates(area,api);
  let gained=-1;
  for(let i=0;i<5;i++)if(!row.marks[i]&&checks[i]){row.marks[i]=1;gained=i;break}
  if(gained<0)return'';
  const reward=daoRewardFor(area,gained),completionReward=settleCompletionRewards(M,area);
  api.save?.();
  return `<div class="event"><b>비경 숙련 ${['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ'][gained]} 기록</b><br>${AREA_NAME[area]}: ${OBJECTIVES[area][gained]}<br>도행록에서 도흔 +${reward} 수령 가능 · 숙련 ${marks(M,area)}/5${completionReward?`<br><b>비경 숙련 완성</b> · 도흔 +${completionReward} 자동 지급`:''}</div>`;
}
function claim(M,area,index){
  ensure(M);
  if(!AREAS.includes(area)||index<0||index>4)return 0;
  const row=M.mastery.areas[area];
  if(!row.marks[index]||row.claimed[index])return 0;
  const reward=daoRewardFor(area,index);
  row.claimed[index]=1;
  M.formationSkills.daoMarks=(+M.formationSkills.daoMarks||0)+reward;
  return reward;
}
function summary(M){
  ensure(M);
  const completed=completedDaoMarks(M),claimed=claimedDaoMarks(M);
  return{
    daoMarks:+M.formationSkills.daoMarks||0,
    earnedDaoMarks:claimed,
    completedDaoMarks:completed,
    pendingDaoMarks:Math.max(0,completed-claimed),
    maxDaoMarks,
    daoRewardByArea:Object.fromEntries(AREAS.map(area=>[area,daoReward(area)])),
    daoCompletionBonusByArea:Object.fromEntries(AREAS.map(area=>[area,daoCompletionBonus(area)])),
    daoists:daoists(M),
    areas:Object.fromEntries(AREAS.map(area=>{
      const row=M.mastery.areas[area],completedCount=rawMarks(M,area),claimedCount=rawClaimed(M,area),areaComplete=completedCount>=5,areaCompletionClaimed=!!row.areaCompletionClaimed;
      const totalReward=Array.from({length:5},(_,i)=>daoRewardFor(area,i)).reduce((a,b)=>a+b,0)+AREA_COMPLETION_REWARD;
      const claimedReward=Array.from({length:5},(_,i)=>row.claimed[i]?daoRewardFor(area,i):0).reduce((a,b)=>a+b,0)+(areaCompletionClaimed?AREA_COMPLETION_REWARD:0);
      const pendingReward=Array.from({length:5},(_,i)=>row.marks[i]&&!row.claimed[i]?daoRewardFor(area,i):0).reduce((a,b)=>a+b,0)+(areaComplete&&!areaCompletionClaimed?AREA_COMPLETION_REWARD:0);
      return[area,{name:AREA_NAME[area],marks:completedCount,claimed:claimedCount,totalReward,claimedReward,pendingReward,rewardPerMark:daoReward(area),completionBonus:daoCompletionBonus(area),areaComplete,areaCompletionReward:AREA_COMPLETION_REWARD,areaCompletionClaimed,objectives:OBJECTIVES[area],done:[...row.marks],claimedFlags:[...row.claimed],rewards:Array.from({length:5},(_,i)=>daoRewardFor(area,i))}]
    }))
  };
}

window.__xianxiaMastery={version:VERSION,areas:AREAS,objectives:OBJECTIVES,ensure,marks,daoists,daoReward,daoCompletionBonus,daoRewardFor,areaCompletionReward:AREA_COMPLETION_REWARD,maxDaoMarks,settleCompletionRewards,claim,summary,onBegin,onKill,onFinish};
})();

//# sourceURL=mastery_runtime_v11_51.js
