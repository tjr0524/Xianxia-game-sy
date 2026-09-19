(()=>{
'use strict';

const VERSION='11.50.0';
if(window.__xianxiaFormationSkillsVersion===VERSION)return;
window.__xianxiaFormationSkillsVersion=VERSION;

const D=window.__xianxiaDebug;
const P=window.__xianxiaProgression;
if(!D||!P){console.error('[formation-skills] progression runtime unavailable');return}

const $=s=>document.querySelector(s);
const REALMS=['연기','축기','결단','원영'];
const HERB_KEYS=['herb','herb2','herb3'];
const HERB_NAMES=['하급','중급','상급'];

const A='assets/ink_v1/foundation_trial_v1/ui/node_icons/';
const F='assets/ink_v1/runtime/ui/formation_skills/';

const SYSTEMS=[
  {id:'sword',name:'어검술',short:'어검',kind:'spell',req:{major:0,stage:1},icon:A+'combat_abilities/sword_control_256.png'},
  {id:'wave',name:'검풍',short:'검풍',kind:'spell',req:{major:0,stage:3},icon:A+'combat_abilities/sword_wind_256.png'},
  {id:'chain',name:'연환비검',short:'연환',kind:'spell',req:{major:0,stage:5},icon:A+'combat_abilities/chain_flying_sword_256.png'},
  {id:'thunder',name:'낙뢰부',short:'낙뢰',kind:'spell',req:{major:0,stage:7},icon:A+'combat_abilities/thunder_talisman_256.png'},
  {id:'array',name:'만검진',short:'만검',kind:'spell',req:{major:1,stage:1},icon:A+'combat_abilities/myriad_sword_formation_256.png'},
  {id:'shield',name:'호체막',short:'호체',kind:'art',req:{major:1,stage:1},icon:F+'shield_main.png'},
  {id:'dash',name:'축지술',short:'축지',kind:'art',req:{major:1,stage:1},icon:A+'combat_abilities/evasive_step_256.png'},
  {id:'burst',name:'진기폭주',short:'폭주',kind:'art',req:{major:1,stage:3},icon:F+'burst_main.png'}
];

const SPELL_COST={
  sword:[null,{s:80,h:3,hg:0},{s:70,h:4,hg:0},{s:90,h:5,hg:0},{s:110,h:6,hg:0},{s:130,h:8,hg:0}],
  wave:[null,{s:150,h:5,hg:0},{s:180,h:7,hg:0},{s:210,h:9,hg:0},{s:240,h:12,hg:0},{s:280,h:15,hg:0}],
  chain:[null,{s:180,h:5,hg:1},{s:220,h:7,hg:1},{s:260,h:9,hg:1},{s:320,h:12,hg:1},{s:380,h:15,hg:1}],
  thunder:[null,{s:400,h:4,hg:2},{s:500,h:5,hg:2},{s:650,h:7,hg:2},{s:800,h:10,hg:2},{s:950,h:15,hg:2}],
  array:[null,{s:1200,h:12,hg:2},null,null,null,null]
};

const ART_RANKS={
  shield:[
    {req:{major:1,stage:1},text:'1층 · 층당 HP 22% 흡수 · 재생 12초'},
    {req:{major:1,stage:2},text:'1층 · HP 24% 흡수 · 재생 11.5초 · 파괴 후 가속'},
    {req:{major:1,stage:4},text:'2층 · 층당 HP 20% 흡수 · 재생 11초'},
    {req:{major:1,stage:8},text:'3층 · 층당 HP 18% 흡수 · 재생 10초'},
    {req:{major:1,stage:9},text:'3층 · 층당 HP 20% 흡수 · 재생 9.5초'}
  ],
  dash:[
    {req:{major:1,stage:1},text:'80 world · 1충전 · 회복 5초'},
    {req:{major:1,stage:3},text:'95 world · 1충전 · 회복 4.5초'},
    {req:{major:1,stage:6},text:'105 world · 1충전 · 회복 4초'},
    {req:{major:1,stage:7},text:'110 world · 2충전 · 충전 회복 6초'},
    {req:{major:1,stage:9},text:'120 world · 2충전 · 충전 회복 5초'}
  ],
  burst:[
    {req:{major:1,stage:3},text:'지속 1초 · CD 70초 · 법술 CD 진행 ×6'},
    {req:{major:1,stage:5},text:'지속 1.5초 · CD 50초 · 법술 CD 진행 ×6'},
    {req:{major:1,stage:7},text:'지속 2.5초 · CD 36초 · 법술 CD 진행 ×6.2'},
    {req:{major:1,stage:8},text:'지속 3.5초 · CD 30초 · 법술 CD 진행 ×6.3'},
    {req:{major:1,stage:9},text:'지속 5초 · CD 24초 · 법술 CD 진행 ×6.5'}
  ]
};

const TRAITS={
sword:[
 {req:{major:0,stage:2},o:[
  ['heavy','중검','주 피해 +55% · 기본 발동간격 +25% · 강적 우선'],
  ['split','분검','3발 ×45% · 동일 대상 중복은 60% 효율'],
  ['pierce','관통검','피해 90% · 추가 2체 관통']]},
 {req:{major:0,stage:6},o:[
  ['mark','검흔','같은 대상 3회 적중마다 다음 어검술 피해 +35%'],
  ['scatter','비산','직접 처치 시 2발 ×35% 소형 비검 · 동일 비산 재귀 금지'],
  ['break','파진','수호막·결절·특수 대상 피해 +50% · 타깃 가중']]},
 {req:{major:1,stage:3},o:[
  ['return','귀일','다른 유효 대상이 없으면 추가 비검이 60% 위력으로 강적 타격'],
  ['kill','살생비검','직접 처치 시 35% 확률로 50% 위력 비검 생성 · depth 제한'],
  ['dash','축지비검','축지 사용 시 3발 ×40% · 내부쿨다운 1.0초']]}
],
wave:[
 {req:{major:0,stage:4},o:[
  ['wide','광풍','범위 +45% · 피해 -15%'],
  ['double','쌍풍','2갈래 ×60% · 겹치는 대상 두 번째 적중 50% 효율'],
  ['vortex','회오리','2.5초 지속 · 총 피해 110% · 동일 적 타격간격 제한']]},
 {req:{major:0,stage:8},o:[
  ['weak','쇠약풍','피해 -10% · 이동 -20% · 공격주기 +10% · 2.5초'],
  ['pull','흡인풍','피해 -10% · 중심으로 최대 80 world 당김'],
  ['brand','검인풍','적중 대상 4초 검인 · 다음 검계 법술 첫 적중 +15%']]},
 {req:{major:1,stage:4},o:[
  ['after','잔풍','직접 처치 시 25% 확률 · 원본 35% 작은 검풍 · 최대 3'],
  ['resonate','공명풍','검인 소모 시 25% 위력 검풍 · ICD 0.8초'],
  ['dashtrail','풍행','축지 이동 경로에 1.2초 · 총 60% 위력 검풍']]}
],
chain:[
 {req:{major:0,stage:6},o:[
  ['spread','확산연환','추가 도약 +2 · 각 적중 피해 -25% · 미적중 대상 우선'],
  ['boss','집요연환','한 바퀴 후 동일 강적 재도약 · 재도약 피해 +15% · 최대 3회'],
  ['back','회귀연환','마지막 도약 뒤 첫 대상에 50% 피해로 1회 회귀']]},
 {req:{major:0,stage:9},o:[
  ['ghost','잔영검','각 도약마다 0.6초 뒤 20% 추가타 · 최대 4개'],
  ['seal','연환인','5초간 다른 법술 첫 적중 시 40% 위력 추가 비검'],
  ['dash','추격검','축지 도착 후 가까운 적에게 65% 위력 연환 · ICD 1.0초']]},
 {req:{major:1,stage:5},o:[
  ['endless','무진연환','직접 처치마다 추가 도약 +1 · 한 발동 최대 +4'],
  ['resonate','공명연환','연환인 대상에 다른 법술 적중 시 25% 확률 50% 연환 · ICD 1.5초'],
  ['burst','폭주연환','폭주 중 추가 연환 2개 · 각 55% 위력']]}
],
thunder:[
 {req:{major:0,stage:8},o:[
  ['bolt','천뢰','범위 -35% · 피해 +55% · 강적 우선'],
  ['chain','연뢰','초기 피해 -20% · 추가 3연쇄 ×70%'],
  ['field','뇌역','3초 지속 · 총 피해 120% · 범위 +20%']]},
 {req:{major:1,stage:2},o:[
  ['shock','감전','3초간 받는 자동법술 피해 +12%'],
  ['charge','축전','동일 대상 3회 낙뢰 적중 시 40% 위력 폭발 · ICD 2초'],
  ['dash','뇌보','축지 도착지에 50% 위력 낙뢰 · ICD 1.5초']]},
 {req:{major:1,stage:6},o:[
  ['cloud','뇌운','전투 중 4초마다 35% 위력 자동 낙뢰 · 1개 제한'],
  ['resonate','검뢰공명','검계 법술 6회 적중마다 45% 위력 낙뢰 · ICD 0.8초'],
  ['burst','폭주천겁','폭주 시작 70% 즉시 낙뢰 + 폭주 중 낙뢰부 CD 진행 추가 ×2']]}
],
array:[
 {req:{major:1,stage:2},o:[
  ['focus','집중검진','반경 -35% · 총 피해 +45% · 강적 중심 자동배치'],
  ['wide','광역검진','반경 +50% · 총 피해 -20%'],
  ['follow','호신검진','총 피해 -15% · 플레이어 추종 · 지속 +20%']]},
 {req:{major:1,stage:5},o:[
  ['pull','흡검진','총 피해 -10% · 주기적으로 최대 100 world 당김'],
  ['break','파진','수호막·결절·구조물 피해 +60%'],
  ['dash','축지전개','축지 도착지에 2초간 원본 40% 소형 검진 · 최대 1']]},
 {req:{major:1,stage:8},o:[
  ['return','만검귀종','3초마다 가장 강한 적에게 원본 60% 집중사격'],
  ['multiply','검진증식','직접 처치 25% 확률 · 30% 위력 2초 · 최대 2'],
  ['resonate','만법공명','검진 내부에서 다른 자동법술 발동 시 15% pulse · ICD 0.5초']]}
],
shield:[
 {req:{major:1,stage:4},o:[
  ['unyield','불괴','층당 흡수량 +25% · 해당 층 재생시간 +10%'],
  ['cloud','유운','호체 파괴 시 이속버프 효과 +15%p · 지속 +0.5초'],
  ['reflux','환류','호체 파괴 시 모든 자동법술 남은 CD 8% 감소 · 공격 1회당 1회']]},
 {req:{major:1,stage:8},o:[
  ['diamond','금강','한 공격이 2층 이상 파괴할 때 2층째부터 흡수효율 +20%'],
  ['shadow','무영','호체 파괴 후 1.2초 감속 면역 + 지속피해 -25%'],
  ['reverse','역류','호체 파괴 시 자동법술 남은 CD 12% 감소 · 해당 호체 재생 +15%']]},
 {req:{major:2,stage:1},reserved:true,o:[
  ['futureA','후기 특성 A','결단 이후 확장 슬롯 · 수치 미정'],
  ['futureB','후기 특성 B','결단 이후 확장 슬롯 · 수치 미정'],
  ['futureC','후기 특성 C','결단 이후 확장 슬롯 · 수치 미정']]}
],
dash:[
 {req:{major:1,stage:3},o:[
  ['flow','유영','축지 거리 +25% · 충전 회복 +10%'],
  ['reflux','환류','특수몹 처치 시 축지 충전회복 1.5초'],
  ['guard','호체보','축지 사용 시 가장 오래 재생 중인 호체 1층 재생 2초 당김']]},
 {req:{major:1,stage:6},o:[
  ['step','연보','축지 최대 충전 +1 · 충전 회복시간 +25%'],
  ['kill','살진','축지 후 1.5초 자동법술 CD 진행속도 ×1.35'],
  ['escape','탈진','위험영역 축지 이탈 시 사용 충전 회복시간 35% 환급']]},
 {req:{major:1,stage:9},o:[
  ['long','천리축지','축지 거리 +35% · 충전 회복 -15%'],
  ['array','진법보','축지로 발동되는 법술 파생효과 위력 +40%'],
  ['void','허공보','축지 연계효과 내부쿨다운 -40% · Trigger depth 상한 유지']]}
],
burst:[
 {req:{major:1,stage:5},o:[
  ['peak','극폭','폭주 지속 -25% · CD진행 배율 +40%'],
  ['cycle','순환','지속 +40% · CD -15% · CD진행 배율 -20%'],
  ['kill','살생','특수몹 처치 시 폭주 CD 2초 감소 · 폭주 중이면 지속 +0.3초']]},
 {req:{major:1,stage:7},o:[
  ['spell','법술폭발','폭주 시작 시 준비된 각 자동법술이 60% 위력으로 1회 즉시 반응'],
  ['guard','호체환류','폭주 중 호체 파괴 시 지속 +0.4초 · 1회 최대 +1.2초'],
  ['heaven','천행','폭주 중 축지 충전 회복속도 ×2.5']]},
 {req:{major:2,stage:1},reserved:true,o:[
  ['futureA','후기 특성 A','결단 이후 확장 슬롯 · 수치 미정'],
  ['futureB','후기 특성 B','결단 이후 확장 슬롯 · 수치 미정'],
  ['futureC','후기 특성 C','결단 이후 확장 슬롯 · 수치 미정']]}
]
};

let active={type:'summary'};
let queued=false;
let rootObserver=null;
const view={scale:1,x:0,y:0,pointers:new Map(),gesture:null,dragged:false,suppressClick:false};

function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
function applyView(){
  const board=$('#fs49Board');
  const viewport=$('#fs49Viewport');
  if(!board||!viewport)return;
  board.style.transform=`translate(${view.x}px,${view.y}px) scale(${view.scale})`;
  viewport.classList.toggle('zoomed',view.scale>1.001);
  const label=viewport.querySelector('[data-zoom-label]');
  if(label)label.textContent=`${Math.round(view.scale*100)}%`;
}
function resetView(){view.scale=1;view.x=0;view.y=0;applyView()}
function zoomBy(factor){
  const old=view.scale;
  const next=clamp(old*factor,1,2.2);
  if(Math.abs(next-old)<.001)return;
  const ratio=next/old;
  view.scale=next;
  view.x*=ratio;view.y*=ratio;
  if(next<=1.001){view.x=0;view.y=0}
  applyView();
}
function viewGesture(){
  const pts=[...view.pointers.values()];
  if(!pts.length)return null;
  const center={x:pts.reduce((a,p)=>a+p.x,0)/pts.length,y:pts.reduce((a,p)=>a+p.y,0)/pts.length};
  let distance=0;
  if(pts.length>1)distance=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y);
  return {center,distance,count:pts.length};
}

function snapshot(){return D.snapshot()}
function reached(M,req){
  if(!req)return true;
  const major=M.realm?.major??-1,stage=M.realm?.stage||0;
  return major>req.major||(major===req.major&&stage>=req.stage);
}
function realmLabel(req){
  if(!req)return'';
  return `${REALMS[req.major]||'후기'} ${req.stage}층`;
}
function herbHave(M,g){return +M[HERB_KEYS[g]]||0}
function canPay(M,c){return !!c&&(+M.stone||0)>=c.s&&herbHave(M,c.hg)>=c.h}
function notice(text){const n=$('#notice');if(n)n.textContent=text}
function sys(id){return SYSTEMS.find(x=>x.id===id)}
function spellDef(id){return (P.spellList?.()||D.constants.SKILLS||[]).find(x=>x.id===id)}
function known(M,id){return !!M.skillUnlocks?.[id]||!!M.skills?.[id]?.u}
function spellRank(M,id){return known(M,id)?Math.max(1,Math.min(5,+M.skills?.[id]?.pow||1)):0}
function spellCap(M,s){
  if(!s||!reached(M,s.req))return 0;
  if(s.id==='array')return 1;
  if(s.id==='thunder'&&(M.realm?.major??-1)>0)return 5;
  if((M.realm?.major??-1)>s.req.major)return 5;
  return Math.max(1,Math.min(5,(M.realm?.stage||0)-s.req.stage+1));
}
function artState(M,create=false){
  if(!M.formationSkills&&create)M.formationSkills={version:1,daoMarks:0,ranks:{},traits:{}};
  const x=M.formationSkills||{version:1,daoMarks:0,ranks:{},traits:{}};
  x.ranks||={};x.traits||={};
  return x;
}
function daoMarks(M){return Math.max(0,+artState(M).daoMarks||0)}
function artRank(M,id){return Math.max(0,Math.min(5,+artState(M).ranks?.[id]||0))}
function artCap(M,id){
  const rows=ART_RANKS[id]||[];
  let n=0;
  for(const r of rows)if(reached(M,r.req))n++;
  return n;
}
function mainRank(M,s){return s.kind==='spell'?spellRank(M,s.id):artRank(M,s.id)}
function mainCap(M,s){return s.kind==='spell'?spellCap(M,spellDef(s.id)):artCap(M,s.id)}
function mainUnlocked(M,s){return s.kind==='spell'?known(M,s.id):artRank(M,s.id)>0}
function baseReady(M,s){return reached(M,s.req)}
function traitState(M,id,tier,create=false){
  const f=artState(M,create);
  if(create){
    f.traits[id]??={};
    f.traits[id][tier]??={owned:[],selected:null};
    f.traits[id][tier].owned??=[];
  }
  return f.traits?.[id]?.[tier]||{owned:[],selected:null};
}
function traitStatus(M,s,tierIndex,optId){
  const t=TRAITS[s.id]?.[tierIndex];
  if(!t)return'locked';
  if(!mainUnlocked(M,s)||!reached(M,t.req))return'locked';
  const st=traitState(M,s.id,tierIndex+1);
  if(st.selected===optId)return'selected';
  if(st.owned?.includes(optId))return'owned';
  return'available';
}
function traitLockReason(M,s,tierIndex){
  const t=TRAITS[s.id]?.[tierIndex];
  if(!t)return'특성 데이터 없음';
  const reasons=[];
  if(!reached(M,t.req))reasons.push(`경지 · ${realmLabel(t.req)} 필요`);
  if(!mainUnlocked(M,s)){
    reasons.push(s.kind==='spell'?`본체 · ${s.name} 전승 필요`:`본체 · ${s.name} Rank 1 활성화 필요`);
  }
  if(t.reserved)reasons.push('후기 경지 예약 슬롯 · 밸런스 미정');
  return reasons.join(' · ');
}
function mutation(fn){
  const sh=snapshot();
  if(sh.phase==='run'){notice('원정 중에는 법술 진반을 변경할 수 없습니다.');return false}
  const M=sh.M;
  artState(M,true);
  const ok=fn(M);
  if(ok===false)return false;
  D.replaceState(M);
  schedule();
  return true;
}
function pay(M,c){
  if(!canPay(M,c))return false;
  M.stone-=c.s;
  if(c.h)M[HERB_KEYS[c.hg]]=herbHave(M,c.hg)-c.h;
  return true;
}
function formatCost(c){
  if(!c)return'비용 미정';
  const a=[];
  if(c.s)a.push(`영석 ${c.s.toLocaleString()}`);
  if(c.h)a.push(`${HERB_NAMES[c.hg]} 영초 ${c.h}`);
  return a.join(' · ')||'추가 비용 없음';
}
function upgradeMain(id){
  const s=sys(id);if(!s)return;
  mutation(M=>{
    if(!baseReady(M,s)){notice(`${realmLabel(s.req)}에 개방됩니다.`);return false}
    if(s.kind==='spell'){
      const def=spellDef(id);if(!def)return false;
      if(!known(M,id)){
        const c={s:+def.unlock?.s||0,h:+def.unlock?.h||0,hg:def.grade||0};
        if(!pay(M,c)){notice('법술 전승 재료가 부족합니다.');return false}
        M.skillUnlocks||={};M.skillUnlocks[id]=1;
        M.skills||={};M.skills[id]={u:1,pow:1,range:0,cycle:0};
        notice(`${s.name} 전승 완료.`);
        return true;
      }
      const rank=spellRank(M,id),cap=spellCap(M,def);
      if(rank>=cap){notice(id==='array'?'만검진 Rank 2~5 비용은 아직 밸런스 미정입니다.':'현재 경지의 숙련 상한입니다.');return false}
      const c=SPELL_COST[id]?.[rank+1];
      if(!c){notice('다음 Rank 비용이 아직 확정되지 않았습니다.');return false}
      if(!pay(M,c)){notice('숙련 강화 재료가 부족합니다.');return false}
      M.skills[id]={...(M.skills[id]||{}),u:1,pow:rank+1,range:0,cycle:0};
      notice(`${s.name} Rank ${rank+1} 강화.`);
      return true;
    }
    const cap=artCap(M,id),rank=artRank(M,id);
    if(rank>=cap){notice('현재 경지의 기법 Rank 상한입니다.');return false}
    artState(M,true).ranks[id]=rank+1;
    notice(`${s.name} Rank ${rank+1} 활성화 · 비용은 수련 예산에 포함되어 추가 차감하지 않습니다.`);
    return true;
  });
}
function chooseTrait(id,tier,optId){
  const s=sys(id),t=TRAITS[id]?.[tier-1];
  if(!s||!t)return;
  mutation(M=>{
    if(!mainUnlocked(M,s)||!reached(M,t.req)){notice(`${realmLabel(t.req)} 및 ${s.name} 해금이 필요합니다.`);return false}
    if(t.reserved){notice('후기 경지용 예약 슬롯입니다. 밸런스 수치는 아직 확정하지 않았습니다.');return false}
    const st=traitState(M,id,tier,true);
    if(st.selected===optId){notice('이미 선택 중인 특성입니다.');return false}
    if(st.owned.includes(optId)){
      st.selected=optId;notice(`${s.name} Tier ${tier} 특성을 교체했습니다.`);return true;
    }
    if(st.owned.length===0){
      st.owned.push(optId);st.selected=optId;
      notice(`${s.name} Tier ${tier} 첫 특성을 무료로 영구 해금했습니다.`);
      return true;
    }
    const f=artState(M,true);
    if((+f.daoMarks||0)<1){notice('추가 선택지 해금에는 도흔 1개가 필요합니다.');return false}
    f.daoMarks-=1;st.owned.push(optId);st.selected=optId;
    notice(`${s.name} 특성을 도흔 1개로 영구 해금하고 장착했습니다.`);
    return true;
  });
}
function polygonPoint(radius,angleDeg){
  const a=angleDeg*Math.PI/180;
  return {x:500+Math.cos(a)*radius,y:500+Math.sin(a)*radius};
}
function sidePoints(radius,sideIndex){
  const center=-90+sideIndex*45;
  const p1=polygonPoint(radius,center-22.5),p2=polygonPoint(radius,center+22.5);
  return [.25,.5,.75].map(t=>({x:p1.x+(p2.x-p1.x)*t,y:p1.y+(p2.y-p1.y)*t}));
}
function vertices(radius){
  const pts=[];
  for(let i=0;i<8;i++)pts.push(polygonPoint(radius,-112.5+i*45));
  return pts.map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}
function linePath(){
  let h='';
  for(let i=0;i<8;i++){
    const p=polygonPoint(470,-112.5+i*45);
    h+=`<line x1="500" y1="500" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}"/>`;
  }
  return h;
}
function rankPips(rank,cap){
  let h='';
  for(let i=1;i<=5;i++)h+=`<i class="${i<=rank?'on':i>cap?'cap':''}"></i>`;
  return h;
}
function nodeClass(M,s){
  if(mainUnlocked(M,s))return'mastered';
  return baseReady(M,s)?'available':'locked';
}
function traitDot(M,s,tierIndex,opt,optIndex,p){
  const status=traitStatus(M,s,tierIndex,opt[0]);
  const t=TRAITS[s.id][tierIndex];
  return `<button type="button" class="fs49-trait ${status}${t.reserved?' reserved':''}" style="left:${p.x/10}%;top:${p.y/10}%"
    data-act="trait" data-id="${s.id}" data-tier="${tierIndex+1}" data-opt="${opt[0]}"
    aria-label="${s.name} Tier ${tierIndex+1} ${opt[1]} · ${status}"><span>${optIndex+1}</span></button>`;
}
function mainNode(M,s,index){
  const p=polygonPoint(220,-90+index*45);
  const r=mainRank(M,s),cap=mainCap(M,s);
  return `<button type="button" class="fs49-main ${nodeClass(M,s)} ${active.type==='main'&&active.id===s.id?'active':''}"
      style="left:${p.x/10}%;top:${p.y/10}%" data-act="main" data-id="${s.id}" aria-label="${s.name} Rank ${r}">
    <img src="${s.icon}" alt="">
    <b>${s.short}</b>
    <em>R${r}</em>
    <span class="fs49-rankpips">${rankPips(r,cap)}</span>
  </button>`;
}
function summaryPanel(M){
  const selected=[];
  for(const s of SYSTEMS){
    const bits=[];
    for(let ti=0;ti<3;ti++){
      const st=traitState(M,s.id,ti+1);
      const def=TRAITS[s.id]?.[ti];
      const name=def?.o.find(o=>o[0]===st.selected)?.[1];
      if(name)bits.push(`${['Ⅰ','Ⅱ','Ⅲ'][ti]} ${name}`);
    }
    if(bits.length)selected.push(`<div><b>${s.short}</b><span>${bits.join(' · ')}</span></div>`);
  }
  return `<div class="fs49-detail-head"><b>팔괘 진반</b><span>도흔 ${daoMarks(M)}</span></div>
    <p class="fs49-detail-copy">큰 본체 노드를 누르면 Rank를 강화하고, 각 팔각형 변의 세 점에서 Tier 특성을 선택합니다. 모든 점이 항상 보여서 이 화면 한 장으로 현재 세팅을 확인할 수 있습니다.</p>
    <div class="fs49-build-summary">${selected.join('')||'<small>아직 선택된 특성이 없습니다.</small>'}</div>`;
}
function mainPanel(M,s,phase){
  const rank=mainRank(M,s),cap=mainCap(M,s);
  let nextText='',costText='',actionText='',disabled='';
  if(!baseReady(M,s)){
    nextText=`${realmLabel(s.req)} 개방`;
    actionText='봉인';
    disabled='disabled';
  }else if(s.kind==='spell'){
    const def=spellDef(s.id);
    if(!known(M,s.id)){
      const c={s:+def?.unlock?.s||0,h:+def?.unlock?.h||0,hg:def?.grade||0};
      nextText='법술 전승 후 자동 발동';
      costText=formatCost(c);actionText='법술 전승';
      if(phase==='run'||!canPay(M,c))disabled='disabled';
    }else if(rank<cap){
      const c=SPELL_COST[s.id]?.[rank+1];
      nextText=`Rank ${rank+1} 숙련 강화`;
      costText=formatCost(c);actionText='Rank 강화';
      if(phase==='run'||!c||!canPay(M,c))disabled='disabled';
    }else{
      nextText=s.id==='array'?'현재 데이터는 Rank 1까지만 확정':'현재 경지 Rank 상한';
      actionText='강화 완료';disabled='disabled';
    }
  }else{
    const rows=ART_RANKS[s.id]||[];
    const current=rank?rows[rank-1]?.text:'미활성';
    const next=rank<cap?rows[rank]?.text:null;
    nextText=next?`다음 Rank · ${next}`:current;
    costText='수련 예산에 포함 · 추가 비용 없음';
    actionText=rank<cap?(rank?'Rank 활성화':'기법 활성화'):'현재 경지 상한';
    if(phase==='run'||rank>=cap)disabled='disabled';
  }
  const currentText=s.kind==='art'&&rank?(ART_RANKS[s.id]?.[rank-1]?.text||''):(rank?`숙련 Rank ${rank}`:'미전승');
  return `<div class="fs49-detail-head"><b>${s.name}</b><span>Rank ${rank}/5</span></div>
    <div class="fs49-detail-main"><img src="${s.icon}" alt=""><div><strong>${currentText}</strong><p>${nextText}</p></div></div>
    <div class="fs49-detail-actions"><span>${costText}</span><button type="button" data-act="rank" data-id="${s.id}" ${disabled}>${actionText}</button></div>`;
}
function traitIcon(id,name){
  if(/환류|역류/.test(name))return F+'qi_reflux.png';
  if(/호체보|무영/.test(name))return F+'shield_step.png';
  if(id==='burst')return F+'burst_main.png';
  if(id==='shield')return F+'shield_main.png';
  return sys(id)?.icon||F+'formation_core.png';
}
function traitPanel(M,s,tier,opt,phase){
  const t=TRAITS[s.id][tier-1],status=traitStatus(M,s,tier-1,opt[0]);
  const st=traitState(M,s.id,tier);
  const owned=st.owned?.includes(opt[0]);
  const lockReason=traitLockReason(M,s,tier-1);
  let action='',disabled='';
  if(status==='locked'||t.reserved){action=t.reserved?'후기 슬롯':'잠김';disabled='disabled'}
  else if(status==='selected'){action='선택 중';disabled='disabled'}
  else if(owned){action='장착'}
  else if((st.owned?.length||0)===0){action='무료 해금 · 장착'}
  else{action='도흔 1 · 해금'}
  if(phase==='run')disabled='disabled';
  const statusLabel={locked:'봉인',available:'해금 가능',owned:'보유',selected:'장착 중'}[status]||status;
  const condition=status==='locked'||t.reserved
    ?`<small class="fs49-lock-reason"><b>잠금 조건</b> · ${lockReason||'조건 확인 필요'}</small>`
    :`<small>${realmLabel(t.req)} 개방 · 조건 충족</small>`;
  return `<div class="fs49-detail-head"><b>${s.name} · Tier ${['Ⅰ','Ⅱ','Ⅲ'][tier-1]}</b><span>${statusLabel}</span></div>
    <div class="fs49-detail-main"><img src="${traitIcon(s.id,opt[1])}" alt=""><div><strong>${opt[1]}</strong><p>${opt[2]}</p>${condition}</div></div>
    <div class="fs49-detail-actions"><span>${owned?'영구 보유 · 비경 밖 무료 교체':(st.owned?.length?'추가 선택지 비용: 도흔 1':'해당 Tier 첫 선택 무료')}</span>
    <button type="button" data-act="choose" data-id="${s.id}" data-tier="${tier}" data-opt="${opt[0]}" ${disabled}>${action}</button></div>`;
}
function renderDetail(M,phase){
  const d=$('#fs49Detail');if(!d)return;
  if(active.type==='main'){
    const s=sys(active.id);d.innerHTML=s?mainPanel(M,s,phase):summaryPanel(M);return;
  }
  if(active.type==='trait'){
    const s=sys(active.id),t=TRAITS[active.id]?.[active.tier-1],opt=t?.o.find(o=>o[0]===active.opt);
    d.innerHTML=s&&opt?traitPanel(M,s,active.tier,opt,phase):summaryPanel(M);return;
  }
  d.innerHTML=summaryPanel(M);
}
function render(){
  const root=$('#skillTree');if(!root)return;
  const sh=snapshot(),M=sh.M;
  let mains='',dots='';
  SYSTEMS.forEach((s,i)=>{
    mains+=mainNode(M,s,i);
    const tiers=TRAITS[s.id]||[];
    tiers.forEach((t,ti)=>{
      const points=sidePoints([310,385,460][ti],i);
      t.o.forEach((o,oi)=>dots+=traitDot(M,s,ti,o,oi,points[oi]));
    });
  });
  root.innerHTML=`<div class="formation-board49">
    <div class="fs49-topline"><span>팔괘 진반</span><small>본체=Rank · 내/중/외환=Tier Ⅰ/Ⅱ/Ⅲ · 도흔 ${daoMarks(M)}</small></div>
    <div class="fs49-viewport" id="fs49Viewport">
      <div class="fs49-board" id="fs49Board">
      <svg class="fs49-lines" viewBox="0 0 1000 1000" aria-hidden="true">
        <g class="fs49-sector-lines">${linePath()}</g>
        <polygon class="tier tier1" points="${vertices(310)}"/>
        <polygon class="tier tier2" points="${vertices(385)}"/>
        <polygon class="tier tier3" points="${vertices(460)}"/>
      </svg>
      <div class="fs49-ring-label r1">Ⅰ</div><div class="fs49-ring-label r2">Ⅱ</div><div class="fs49-ring-label r3">Ⅲ</div>
      <button type="button" class="fs49-core" data-act="summary" aria-label="진반 전체 요약"><img src="${F}formation_core.png" alt=""><span>${M.realm?.major<0?'범인':`${REALMS[M.realm.major]} ${M.realm.stage}층`}</span></button>
      ${mains}${dots}
      </div>
      <div class="fs49-zoom-controls" aria-label="진반 확대">
        <button type="button" data-act="zoom-out" aria-label="축소">−</button>
        <button type="button" data-act="zoom-reset" class="fit"><span data-zoom-label>100%</span><small>맞춤</small></button>
        <button type="button" data-act="zoom-in" aria-label="확대">＋</button>
      </div>
    </div>
    <div id="fs49Detail" class="fs49-detail"></div>
  </div>`;
  renderDetail(M,sh.phase);
  applyView();
}
function schedule(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;render()});
}
function bind(){
  const root=$('#skillTree');if(!root)return;
  root.addEventListener('click',e=>{
    if(view.suppressClick){e.preventDefault();e.stopPropagation();return}
    const b=e.target.closest('[data-act]');if(!b)return;
    const act=b.dataset.act;
    if(act==='zoom-in'){zoomBy(1.22);return}
    if(act==='zoom-out'){zoomBy(1/1.22);return}
    if(act==='zoom-reset'){resetView();return}
    if(act==='summary'){active={type:'summary'};const sh=snapshot();renderDetail(sh.M,sh.phase);return}
    if(act==='main'){active={type:'main',id:b.dataset.id};render();return}
    if(act==='trait'){active={type:'trait',id:b.dataset.id,tier:+b.dataset.tier,opt:b.dataset.opt};render();return}
    if(act==='rank'){upgradeMain(b.dataset.id);return}
    if(act==='choose'){chooseTrait(b.dataset.id,+b.dataset.tier,b.dataset.opt);return}
  });
  root.addEventListener('wheel',e=>{
    if(!e.target.closest('.fs49-viewport'))return;
    e.preventDefault();zoomBy(e.deltaY<0?1.12:1/1.12);
  },{passive:false});
  root.addEventListener('dblclick',e=>{
    if(!e.target.closest('.fs49-viewport'))return;
    e.preventDefault();
    if(view.scale>1.05)resetView();else zoomBy(1.6);
  });
  root.addEventListener('pointerdown',e=>{
    const vp=e.target.closest('.fs49-viewport');if(!vp)return;
    if(e.pointerType==='mouse'&&e.button!==0)return;
    view.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    view.gesture=viewGesture();
    view.dragged=false;
    if(view.pointers.size>1)e.preventDefault();
  },{passive:false});
  root.addEventListener('pointermove',e=>{
    if(!view.pointers.has(e.pointerId))return;
    const prev=view.gesture;
    view.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    const next=viewGesture();
    if(prev&&next){
      if(prev.count>1&&next.count>1&&prev.distance>0){
        e.preventDefault();
        const vp=e.target.closest('.fs49-viewport')||$('#fs49Viewport');
        const rect=vp?.getBoundingClientRect();
        const old=view.scale;
        const scale=clamp(old*next.distance/prev.distance,1,2.2);
        if(rect){
          const px=prev.center.x-rect.left-rect.width/2,py=prev.center.y-rect.top-rect.height/2;
          const nx=next.center.x-rect.left-rect.width/2,ny=next.center.y-rect.top-rect.height/2;
          const cx=(px-view.x)/old,cy=(py-view.y)/old;
          view.x=nx-cx*scale;view.y=ny-cy*scale;
        }
        view.scale=scale;
        view.dragged=true;
        applyView();
      }else if(view.scale>1.001){
        const dx=next.center.x-prev.center.x,dy=next.center.y-prev.center.y;
        if(Math.hypot(dx,dy)>1){
          e.preventDefault();
          view.x+=dx;view.y+=dy;view.dragged=true;applyView();
          const vp=e.target.closest('.fs49-viewport');vp?.setPointerCapture?.(e.pointerId);
        }
      }
    }
    view.gesture=next;
  },{passive:false});
  const endPointer=e=>{
    if(!view.pointers.has(e.pointerId))return;
    view.pointers.delete(e.pointerId);
    view.gesture=viewGesture();
    if(view.scale<=1.001){view.x=0;view.y=0;applyView()}
    if(view.dragged){
      view.suppressClick=true;
      requestAnimationFrame(()=>{view.suppressClick=false});
    }
    if(!view.pointers.size)view.dragged=false;
  };
  root.addEventListener('pointerup',endPointer);
  root.addEventListener('pointercancel',endPointer);
  rootObserver=new MutationObserver(()=>{
    if(!root.querySelector('.formation-board49'))schedule();
  });
  rootObserver.observe(root,{childList:true});
  $('.tab-btn[data-tab="skills"]')?.addEventListener('click',schedule);
  document.addEventListener('xianxia:progression-rendered',schedule);
  for(const el of [$('#realm'),$('#stone'),$('#herb')])if(el)new MutationObserver(schedule).observe(el,{childList:true,characterData:true,subtree:true});
}
bind();
schedule();

window.__xianxiaFormationSkills={
  version:VERSION,
  systems:SYSTEMS,
  traits:TRAITS,
  render,
  getState:()=>snapshot().M.formationSkills||null
};
})();
