/* GENERATED FLAT RUNTIME 11.45 · source chain: game_v11 -> worldscale_core_v11_34 -> balance_core_v11_36 -> balance_core_v11_37 */
(()=>{
'use strict';

const $=selector=>document.querySelector(selector);
const cv=$('#cv');
const W=1800;
const H=2400;
cv.width=W;cv.height=H;
const g=cv.getContext('2d');
const EXIT={x:900,y:1200,r:27};
const PLAYER_GROUND_OFFSET=23;
const EXIT_APPROACH={x:EXIT.x,y:EXIT.y-PLAYER_GROUND_OFFSET};
const RUN_TIME=25;
const MAJORS=['연기','축기','결단','원영'];
const HN=['하급','중급','상급'];
const VERSION='11';
const foundationContent=()=>window.__xianxiaFoundationContent||null;
const SPATIAL={
  Rview:320,
  sense:{specialTarget:750,threatWarning:600},
  movement:{afterimageLossRelief:.15,shadowlessLossRelief:.25},
  foundation:{envSlowRelief:.10,recoveryStartRelief:.20,castMoveLockRelief:.30}
};
const STORM_BAL={
  period:[6.5,6.0,5.2,5.2,4.8,4.5],
  chain:[1,1,1,2,2,2],
  chainDelay:.22,
  focusRadius:220,
  reward:[0,6,8,10,12,15],
  rewardCap:3,
  r5ZoneChance:.25,
  r5ZoneDuration:1.8
};

const UI={
  game:$('#game'),controls:$('.controls'),ov:$('#ov'),ot:$('#ot'),ox:$('#ox'),start:$('#start'),ret:$('#ret'),
  hp:$('#hp'),hpFill:$('#hpFill'),loot:$('#loot'),time:$('#time'),combo:$('#combo'),
  objective:$('#objective'),notice:$('#notice'),stone:$('#stone'),herb:$('#herb'),
  realm:$('#realm'),realm2:$('#realm2'),realmInfo:$('#realmInfo'),cap:$('#cap'),
  bt:$('#breakthrough'),btTitle:$('#btTitle'),btCost:$('#btCost'),eventInfo:$('#eventInfo'),
  area:$('#area'),desc:$('#desc'),areas:$('#areas'),tree:$('#tree'),treeViewport:$('#treeViewport'),treeWorld:$('#treeWorld'),
  treeZoomOut:$('#treeZoomOut'),treeReset:$('#treeReset'),treeZoomIn:$('#treeZoomIn'),treeDetail:$('#treeDetail'),treeHint:$('#treeHint'),
  nc:$('#nc'),skillTree:$('#skillTree'),skillRun:$('#skillRun'),planChoices:$('#planChoices'),
  atk:$('#atk'),mov:$('#mov'),sen:$('#sen'),hpb:$('#hpb'),
  al:$('#al'),ml:$('#ml'),sl:$('#sl'),hl:$('#hl'),ac:$('#ac'),mc:$('#mc'),sc:$('#sc'),hc:$('#hc'),
  runCount:$('#runCount'),bestStone:$('#bestStone'),bestHerb:$('#bestHerb'),bestKills:$('#bestKills')
};

const AREAS=[
  {id:'qingyun',name:'청운산 후산',desc:'기본 요수전과 이동을 익히는 초입 비경.',enemy:1,reward:1,killStone:11,herbs:10,env:{move:1,pick:1},baseStage:1,rec:'범인~연기 3층',req:{major:0,stage:1,prev:null,nodes:0},palette:['#172e31','#244d48','#6b8f72']},
  {id:'blackwind',name:'흑풍곡',desc:'무리 요수와 산수의 전리품 경쟁이 시작되는 골짜기.',enemy:1,reward:1,killStone:34,herbs:10,env:{move:.86,pick:.75},baseStage:3,rec:'연기 3~6층',req:{major:0,stage:3,prev:'qingyun',nodes:2},palette:['#191f22','#34342a','#6d6042']},
  {id:'blood',name:'적혈비경',desc:'영맥 점유와 정예 수호전이 핵심인 고위 비경.',enemy:1,reward:1,killStone:90,herbs:9,env:{move:.77,pick:.60},baseStage:6,rec:'연기 6~9층',req:{major:0,stage:6,prev:'blackwind',nodes:3},palette:['#291719','#532127','#8c493b']},
  {id:'foundation_trial',name:'축기 시련',desc:'축기에 오르기 전 수문장과 맞서는 단일 보스 시련.',enemy:1,reward:1,rewardTier:2,killStone:90,herbs:9,env:{move:.77,pick:.60},baseStage:9,rec:'연기 9층',req:{major:0,stage:9,prev:'blood',nodes:0},palette:['#171d1c','#32403a','#708574']},
  {id:'thunder',name:'천뢰봉',desc:'낙뢰 전조와 돌진 요수를 함께 읽는 축기 첫 비경.',enemy:1,reward:1,rewardTier:2,killStone:90,herbs:9,env:{move:.77,pick:.60},baseStage:1,rec:'축기 1층 이상',req:{major:1,stage:1,prev:'foundation_trial',nodes:0},palette:['#11182b','#24284b','#555c91']},
  {id:'marsh',name:'자운택',desc:'폭발·호령·수호 특수몹 조합을 공략하는 습지 비경.',enemy:1,reward:1,rewardTier:2,killStone:90,herbs:9,env:{move:.77,pick:.60},baseStage:4,rec:'축기 4층 이상',req:{major:1,stage:4,prev:'thunder',nodes:0},palette:['#172422','#31483f','#758c79']},
  {id:'taixu',name:'태허유적',desc:'움직이는 진법과 수호령, 태허진령이 지키는 최종 비경.',enemy:1,reward:1,rewardTier:2,killStone:90,herbs:9,env:{move:.77,pick:.60},baseStage:7,rec:'축기 7층 이상',req:{major:1,stage:7,prev:'marsh',nodes:0},palette:['#171a24','#30354a','#747b9a']}
];

const TREE={
  eco:[
    {id:'eco1',n:'요수 흔적',d:'R1~2 팩 밀도 증가 · R3 장기전 증원 · R4 인접팩 접근 · R5 주변 1~2팩 연쇄 활성',tier:1,c:{s:1,h:0}},
    {id:'eco2',n:'요수 군락',d:'R1 2체 · R2 2~3체 · R3 3~4체+우두머리 · R4 4~5체 · R5 5~7체 대형 군락',tier:2,p:'eco1',c:{s:1,h:0}},
    {id:'eco3',n:'희귀 요수',d:'R1 희귀 출현 · R3 고유 특성 · R4 강화 희귀 · R5 희귀 무리/우두머리',tier:3,p:'eco2',c:{s:1,h:0}}
  ],
  fate:[
    {id:'fate1',n:'산수의 소문',d:'R1 경쟁자 등장 · R3 실제 전리품 절도 · R5 가치 목표에 경쟁자 집중',tier:1,c:{s:1,h:0}},
    {id:'fate2',n:'보물 쟁탈',d:'R1 비보 산수 · R3 발견 즉시 도주 · R5 비보 쟁탈 사건',tier:2,p:'fate1',c:{s:1,h:0}},
    {id:'fate3',n:'영수의 흔적',d:'R1 영수 등장 · R3 위험지역으로 도주 · R5 제한시간 기연 영수',tier:3,p:'fate2',c:{s:1,h:0}}
  ],
  res:[
    {id:'res1',n:'영맥 감응',d:'R1 영맥 · R3 3초 점유 채굴 · R5 채굴 중 요수 유입',tier:1,c:{s:1,h:0}},
    {id:'res2',n:'수호 영맥',d:'R1 정예 수호수 · R3 정예+일반 요수 · R5 영맥 특수 패턴',tier:2,p:'res1',c:{s:1,h:0}},
    {id:'res3',n:'대형 영맥',d:'R1 대형 영맥 · R3 채굴 파동 · R5 영맥 폭주 미니 디펜스',tier:3,p:'res2',c:{s:1,h:0}}
  ],
  storm:[
    {id:'storm1',n:'뢰흔 개방',d:'R1 6.0초 단발 · R2 5.2초 · R3 2연속(0.22초) · R4 집중 낙뢰 · R5 이동 위험구역',tier:1,c:{s:1,h:0}},
    {id:'storm2',n:'천뢰 예지',d:'낙뢰 전조와 연쇄 방향 정보를 강화한다.',tier:2,p:'storm1',c:{s:1,h:0}},
    {id:'storm3',n:'뇌정 응축',d:'복합 낙뢰 패턴을 개방한다. 보상 구조는 후속 튜닝.',tier:3,p:'storm2',c:{s:1,h:0}}
  ]
};

const NODES=Object.values(TREE).flat();
const SKILLS=[
  {id:'sword',n:'어검술',req:{major:0,stage:1},grade:0,unlock:{s:80,h:3},cd:4.8,desc:'가까운 적을 자동 추적해 베는 주력 검술'},
  {id:'wave',n:'검풍',req:{major:0,stage:3},grade:0,unlock:{s:150,h:5},cd:5.5,desc:'밀집한 요수 무리를 자동 조준해 쓸어내는 범위 검술'},
  {id:'chain',n:'연환비검',req:{major:0,stage:5},grade:1,unlock:{s:180,h:5},cd:6.0,desc:'먼 첫 대상을 포착한 뒤 적 사이를 연속 도약하는 비검'},
  {id:'thunder',n:'낙뢰부',req:{major:0,stage:7},grade:2,unlock:{s:400,h:4},cd:7.0,desc:'가장 밀집한 적 무리를 자동 조준하는 고위 법술'},
  {id:'array',n:'만검진',req:{major:1,stage:1},grade:2,unlock:{s:1200,h:12},cd:10.0,desc:'적이 밀집한 지점에 검진을 펼쳐 세 차례 휩쓴다'}
];

const PLANS=[
  {id:'harvest',icon:'🌿',name:'채집 수행',desc:'영초 +35% · 요수 수 -20%',enemyCount:.8,herbCount:1.35,enemyHp:1,reward:.92,dynamic:.8,vein:1},
  {id:'hunt',icon:'⚔',name:'토벌 수행',desc:'요수 수 +30% · 적 체력 +8% · 영석 +25%',enemyCount:1.3,herbCount:.9,enemyHp:1.08,reward:1.25,dynamic:1.05,vein:1},
  {id:'venture',icon:'✦',name:'기연 수행',desc:'비경 고유 사건 +45% · 영석 +8%',enemyCount:1,herbCount:1,reward:1.08,enemyHp:1,dynamic:1.45,vein:1.35}
];

const BAL={
  enemy:{
    qingyun:{hp:70,hit:22,period:1.25,chaserSpeed:95,total:4,sim:2},
    blackwind:{hp:160,hit:38,period:1.15,chaserSpeed:120,total:5,sim:2},
    blood:{hp:380,hit:95,period:1.10,chaserSpeed:150,total:5,sim:3},
    foundation_trial:{hp:380,hit:95,period:1.10,chaserSpeed:150,total:1,sim:1},
    thunder:{hp:1300,hit:300,period:1.00,chaserSpeed:190,total:6,sim:3},
    marsh:{hp:380,hit:95,period:1.10,chaserSpeed:150,total:5,sim:3},
    taixu:{hp:380,hit:95,period:1.10,chaserSpeed:150,total:5,sim:3}
  },
  ecoTotal:[1,1.15,1.30,1.50,1.75,2.00],
  ecoSim:[0,0,1,1,2,3],
  encounter:{
    packCounts:{qingyun:[8,10,12,15,23,34],blackwind:[10,12,15,19,28,38],blood:[10,12,15,19,25,32],foundation_trial:[1,1,1,1,1,1],thunder:[12,14,17,21,26,30],marsh:[11,13,16,20,25,30],taixu:[9,11,14,17,21,25]},
    packSize:[[1,2],[2,2],[2,3],[3,4],[4,5],[5,7]],
    liveCaps:{qingyun:[5,6,7,9,12,16],blackwind:[6,7,8,11,14,18],blood:[6,7,8,11,14,18],foundation_trial:[1,1,1,1,1,1],thunder:[7,8,10,12,15,18],marsh:[7,8,10,12,15,18],taixu:[6,7,8,10,12,15]},
    attackSlots:{qingyun:2,blackwind:3,blood:3,foundation_trial:1,thunder:3,marsh:3,taixu:3},
    starterPacks:{qingyun:2,blackwind:3,blood:3,foundation_trial:0,thunder:3,marsh:3,taixu:3},
    wakeRadius:[560,570,580,600,620,650],
    minPackGap:[360,330,300,260,210,170],
    chainDelay:[99,99,99,4.5,3.3,2.4],
    chainLimit:[0,0,0,1,1,2],
    chainRadius:[0,0,0,720,900,1100]
  },
  skill:{
    sword:{mult:[0,2.4,3.8,5.2,6.5,7.8],cd:[4.8,4.8,4.5,4.2,4.1,4.0],range:[0,134.4,150.4,166.4,182.4,198.4]},
    wave:{mult:[0,1.2,1.6,2.1,2.7,3.8],cd:[5.5,5.5,5.2,5.0,4.8,4.6],radius:[0,57.6,67.2,76.8,86.4,96.0],acquire:[0,145,165,185,205,225]},
    chain:{mult:[0,1.0,1.35,1.8,2.7,4.0],cd:[6.0,6.0,5.8,5.6,5.4,5.0],count:[3,3,4,4,5,6],jump:[0,57.6,64.0,70.4,76.8,83.2],acquire:[0,150,166,182,200,216]},
    thunder:{mult:[0,1.8,3.0,5.0,6.3,8.0],cd:[7.0,7.0,6.7,6.4,6.1,5.8],radius:[0,51.2,60.8,70.4,80.0,89.6],acquire:[0,210,230,250,270,295]},
    array:{mult:[0,3.0,4.4,6.0,8.0,10.5],cd:[10.0,10.0,9.6,9.2,8.8,8.4],radius:[0,121.6,134.4,147.2,160.0,176.0],acquire:[0,170,195,220,245,275]}
  }
};
const KEY='xianxia_proto_v11';
const OLD=['xianxia_proto_v10','xianxia_proto_v9','xianxia_proto_v8','xianxia_proto_v7','xianxia_proto_v6','xianxia_proto_v5','xianxia_proto_v4'];
const zoneBlank=()=>({tree:{},runs:0,safe:0,eliteWins:0,bestStone:0,bestHerb:0,bestKills:0});
const skillBlank=()=>Object.fromEntries(SKILLS.map(skill=>[skill.id,{u:0,pow:0,range:0,cycle:0}]));
const fresh=()=>({
  stone:0,herb:0,herb2:0,herb3:0,
  realm:{major:-1,stage:0},
  cult:{atk:1,mov:150,sen:1,hp:90},
  skills:skillBlank(),
  area:'qingyun',
  unlocked:{qingyun:1},
  zones:Object.fromEntries(AREAS.map(area=>[area.id,zoneBlank()])),
  events:{foundationInsight:0},
  settings:{plan:'harvest',tab:'train'},
  stats:{totalRuns:0,totalSafe:0,totalKills:0}
});

let M=loadState();
let phase='home';
let last=performance.now();
let elapsed=0;
let fx=[];
let enemies=[];
let objects=[];
let vein=null;
let run=null;
let hazards=[];
let nextEnemyId=1;
let pointerDown=false;
let keys=new Set();
let mobileMenuOpen=false;
let selectedTreeNode='eco1';
const treeCamera={x:0,y:0,scale:1,ready:false,pointers:new Map(),gesture:null,dragged:false,suppressClick:false};
const TREE_SCALE_MIN=.55;
const TREE_SCALE_MAX=1.9;

const P={x:EXIT.x,y:EXIT.y,r:11,hp:36,max:36,tx:EXIT.x,ty:EXIT.y,target:null,cd:0};

function loadState(){
  let state=fresh();
  try{
    let raw=localStorage.getItem(KEY);
    if(!raw){
      for(const key of OLD){
        const candidate=localStorage.getItem(key);
        if(candidate){raw=candidate;break}
      }
    }
    const saved=JSON.parse(raw||'null');
    if(saved){
      state={
        ...state,...saved,
        realm:{...state.realm,...saved.realm},
        cult:{...state.cult,...saved.cult},
        unlocked:{...state.unlocked,...saved.unlocked},
        events:{...state.events,...saved.events},
        settings:{...state.settings,...saved.settings},
        stats:{...state.stats,...saved.stats}
      };
      state.skills=skillBlank();
      for(const id of Object.keys(state.skills)){
        state.skills[id]={...state.skills[id],...(saved.skills?.[id]||{})};
      }
      for(const area of AREAS){
        const oldZone=saved.zones?.[area.id]||zoneBlank();
        const cleanTree={};
        for(const [id,value] of Object.entries(oldZone.tree||{})){
          cleanTree[id]=Math.max(0,Math.min(5,Number(value)||0));
        }
        state.zones[area.id]={...zoneBlank(),...oldZone,tree:cleanTree};
      }
    }
  }catch(error){
    console.warn('save migration failed',error);
  }
  state.stone=Number(state.stone)||0;
  state.herb=Number(state.herb)||0;
  state.herb2=Number(state.herb2)||0;
  state.herb3=Number(state.herb3)||0;
  if(!AREAS.some(area=>area.id===state.area))state.area='qingyun';
  if(!PLANS.some(plan=>plan.id===state.settings.plan))state.settings.plan='harvest';
  if(state.realm.major>=0&&!Object.values(state.skills).some(skill=>skill.u))state.skills.sword.u=1;
  return state;
}

function save(){
  try{localStorage.setItem(KEY,JSON.stringify(M))}catch(error){console.warn('save failed',error)}
}

const A=()=>AREAS.find(area=>area.id===M.area)||AREAS[0];
const Z=(id=M.area)=>M.zones[id];
const currentPlan=()=>PLANS.find(plan=>plan.id===M.settings.plan)||PLANS[0];
const areaIndex=(id=M.area)=>{const area=AREAS.find(item=>item.id===id);return area?.rewardTier??Math.max(0,AREAS.findIndex(item=>item.id===id))};
const isMortal=()=>M.realm.major<0;
const realmName=()=>isMortal()?'범인':`${MAJORS[M.realm.major]||'상위경지'} ${M.realm.stage}층`;
const realmPower=()=>1;
const combatPower=()=>1+(run?.combo||0)*.02;
function areaMoveScale(){
  let s=1;
  if(M.area==='blackwind'){const d=M.realm.major>0?3:clamp((M.realm.stage||3)-3,0,3);s=.86+.04*d}
  else if(['blood','foundation_trial','thunder','marsh','taixu'].includes(M.area)){const d=M.realm.major>0?3:clamp((M.realm.stage||6)-6,0,3);s=.77+.03*d}
  if(M.trainingNodes?.q3_shadow)s+=(1-s)*.05;
  if(M.trainingNodes?.q8_shadow)s+=(1-s)*.25;
  if(M.trainingNodes?.q9_harmony)s+=(1-s)*.03;
  if(M.trainingNodes?.f1_harmony)s+=(1-s)*.10;
  return Math.min(1,s);
}
function areaPickupScale(){
  if(M.area==='qingyun')return 1;
  if(M.area==='blackwind'){const d=M.realm.major>0?3:clamp((M.realm.stage||3)-3,0,3);return Math.min(1.08,.75+.12*d)}
  if(['blood','foundation_trial','thunder','marsh','taixu'].includes(M.area)){const d=M.realm.major>0?3:clamp((M.realm.stage||6)-6,0,3);return .60+.08*d}
  return .60;
}
function autoPickupRange(){return (20+Math.max(0,(M.cult.sen||1)-1)*12)*areaPickupScale()}
function basicDamage(){return 4+12*(M.cult.atk||1)}
function basicInterval(){let t=.65;if(M.trainingNodes?.q2_edge)t*=.92;if(M.trainingNodes?.q9_harmony)t*=.96;return t}
function basicAttackRange(){return 64+Math.max(0,+M.cult.basicRange||0)}
function basicAttackTargets(){return 1+clamp(Math.round(+M.cult.basicHits||0),0,3)}
function skillRank(id){return clamp(Math.round(+M.skills?.[id]?.pow||0),0,5)}
function skillRangeRank(id){return clamp(Math.round(+M.skills?.[id]?.range||0),0,5)}
function skillCycleRank(id){return clamp(Math.round(+M.skills?.[id]?.cycle||0),0,5)}
function skillCooldown(id){const b=BAL.skill[id];return b?b.cd[skillRank(id)]??99:99}
const TRIGGER_MAX_DEPTH=2;
const KILL_TRIGGER_EVENTS=new Set(['onKill','onSpecialKill']);
const triggerHandlers=new Map();
function copyTriggerMeta(meta={}){
  return {
    depth:Math.max(0,Math.floor(+meta.depth||0)),
    originTrait:meta.originTrait?String(meta.originTrait):'',
    source:meta.source?String(meta.source):'',
    chain:Array.isArray(meta.chain)?meta.chain.slice(0,16).map(String):[]
  };
}
function childTriggerMeta(parent={},extra={}){
  const p=copyTriggerMeta(parent);
  return {
    depth:p.depth+1,
    originTrait:extra.originTrait!==undefined?String(extra.originTrait||''):p.originTrait,
    source:extra.source!==undefined?String(extra.source||''):p.source,
    chain:Array.isArray(extra.chain)?extra.chain.slice(0,16).map(String):p.chain.slice()
  };
}
function triggerState(){
  if(!run)return null;
  run.triggers??={counts:{},blocked:{depth:0,recursion:0},icd:{},last:null};
  run.triggers.counts??={};run.triggers.blocked??={depth:0,recursion:0};run.triggers.icd??={};
  return run.triggers;
}
function triggerIcd(key,seconds){
  const state=triggerState();if(!state)return false;
  key=String(key||'');if(!key)return true;
  const until=+state.icd[key]||0;if(elapsed<until)return false;
  state.icd[key]=elapsed+Math.max(0,+seconds||0);return true;
}
function registerTriggerHandler(name,handler){
  if(typeof handler!=='function')return ()=>{};
  const key=String(name||`handler-${triggerHandlers.size+1}`);
  triggerHandlers.set(key,handler);
  return ()=>triggerHandlers.delete(key);
}
function emitTrigger(event,payload={},meta={}){
  if(phase!=='run'||!run)return false;
  event=String(event||'');if(!event)return false;
  const state=triggerState(),m=copyTriggerMeta(meta);
  if(m.depth>TRIGGER_MAX_DEPTH){state.blocked.depth=(state.blocked.depth||0)+1;return false}
  const killKey=m.originTrait&&KILL_TRIGGER_EVENTS.has(event)?`kill:${m.originTrait}`:'';
  if(killKey&&m.chain.includes(killKey)){state.blocked.recursion=(state.blocked.recursion||0)+1;return false}
  if(killKey)m.chain.push(killKey);
  state.counts[event]=(state.counts[event]||0)+1;
  state.last={event,depth:m.depth,originTrait:m.originTrait,source:m.source,time:elapsed};
  const ctx={
    event,depth:m.depth,originTrait:m.originTrait,source:m.source,chain:m.chain.slice(),
    child:extra=>childTriggerMeta(m,extra||{}),
    icd:(key,seconds)=>triggerIcd(`${m.originTrait||m.source||'core'}:${key}`,seconds)
  };
  for(const [name,handler] of triggerHandlers){
    try{handler(payload,ctx,foundationApi())}catch(error){console.warn('[trigger]',name,error)}
  }
  try{foundationContent()?.onTrigger?.(event,payload,ctx,foundationApi())}catch(error){console.warn('[trigger] foundation',event,error)}
  return true;
}
function isSpecialEnemy(enemy){
  return !!enemy&&(!!enemy.boss||!!enemy.rare||enemy.grade==='elite'||!!foundationContent()?.isCombatType?.(enemy.type));
}
function selectedFormationTrait(system,tier){
  return M.formationSkills?.traits?.[system]?.[tier]?.selected||'';
}
function hasFormationTrait(system,id){
  const tiers=M.formationSkills?.traits?.[system];
  return !!tiers&&Object.values(tiers).some(row=>row?.selected===id);
}
function effectiveSkillCooldown(id){
  let cd=skillCooldown(id);
  if(id==='sword'&&hasFormationTrait('sword','heavy'))cd*=1.25;
  return cd;
}
function enemyStrengthScore(enemy){
  if(!enemy||enemy.hp<=0)return -Infinity;
  return (enemy.boss?1e9:0)+(enemy.grade==='elite'||enemy.rare?2e8:0)+(enemy.shield>0?8e7:0)+(enemy.max||enemy.hp||0)*100+(enemy.hp||0);
}
function swordCandidateScore(enemy,origin=P){
  let score=-distance(origin,enemy);
  if(hasFormationTrait('sword','break')&&(enemy.shield>0||isSpecialEnemy(enemy)))score+=250000;
  if(hasFormationTrait('sword','heavy'))score+=enemyStrengthScore(enemy);
  return score;
}
function swordCandidates(range,origin=P){
  return enemies.filter(e=>e.type!=='spirit'&&e.hp>0&&distance(origin,e)<range).sort((a,b)=>swordCandidateScore(b,origin)-swordCandidateScore(a,origin));
}
function swordHit(enemy,baseDamage,scale=1,source='sword',meta={},from=P){
  if(!enemy||enemy.hp<=0)return 0;
  let damage=baseDamage*scale;
  if(hasFormationTrait('sword','mark')){
    enemy._swordMarkCount=Math.max(0,Math.floor(enemy._swordMarkCount||0));
    if(enemy._swordMarkPrimed){damage*=1.35;enemy._swordMarkPrimed=0;pop(enemy.x,enemy.y-20,'검흔 폭발','#d8f2ff',.55)}
  }
  if(hasFormationTrait('sword','break')&&(enemy.shield>0||isSpecialEnemy(enemy)))damage*=1.5;
  const dealt=dealEnemyDamage(enemy,damage,source,meta);
  if(dealt>0&&hasFormationTrait('sword','mark')){
    enemy._swordMarkCount=(enemy._swordMarkCount||0)+1;
    if(enemy._swordMarkCount>=3){enemy._swordMarkCount=0;enemy._swordMarkPrimed=1}
  }
  slash(from.x,from.y,enemy.x,enemy.y,source==='sword'?'#eef6ff':'#c9efff');
  return dealt;
}
function swordTraitMeta(parent,traitId,source){
  return childTriggerMeta(parent||{},{originTrait:`sword:${traitId}`,source:source||`sword:${traitId}`});
}
function swordVolleyFrom(origin,count,scale,source,meta,range=null,preferDirection=null){
  const r=range||BAL.skill.sword.range[skillRank('sword')]||160;
  let pool=enemies.filter(e=>e.type!=='spirit'&&e.hp>0&&distance(origin,e)<r*1.45);
  if(preferDirection){
    const n=Math.hypot(preferDirection.x,preferDirection.y)||1,dx=preferDirection.x/n,dy=preferDirection.y/n;
    pool.sort((a,b)=>{
      const ax=a.x-origin.x,ay=a.y-origin.y,bx=b.x-origin.x,by=b.y-origin.y;
      const ad=(ax*dx+ay*dy)/(Math.hypot(ax,ay)||1),bd=(bx*dx+by*dy)/(Math.hypot(bx,by)||1);
      const as=ad*180-distance(origin,a),bs=bd*180-distance(origin,b);
      return bs-as;
    });
  }else pool.sort((a,b)=>swordCandidateScore(b,origin)-swordCandidateScore(a,origin));
  if(!pool.length)return 0;
  const base=basicDamage()*BAL.skill.sword.mult[skillRank('sword')],used=new Map();let hits=0;
  for(let i=0;i<count;i++){
    const target=pool[i%pool.length];if(!target||target.hp<=0)continue;
    const duplicate=used.get(target.id)||0,eff=duplicate?scale*.60:scale;
    if(swordHit(target,base,eff,source,meta,origin)>0){hits++;used.set(target.id,duplicate+1)}
  }
  if(hits){run.triggeredCasts.sword=(run.triggeredCasts.sword||0)+1;emitTrigger('onCast',{skillId:'sword',rank:skillRank('sword'),powerScale:scale,triggered:true,hits},meta)}
  return hits;
}
function handleSwordTraitTrigger(payload,ctx){
  if(ctx.event==='onKill'&&payload?.source==='sword'){
    const origin={x:payload.enemy?.x??P.x,y:payload.enemy?.y??P.y};
    if(hasFormationTrait('sword','scatter')){
      const meta=swordTraitMeta(ctx,'scatter','sword:scatter');
      swordVolleyFrom(origin,2,.35,'sword:scatter',meta);
    }
    if(hasFormationTrait('sword','kill')&&Math.random()<.35){
      const meta=swordTraitMeta(ctx,'kill','sword:kill');
      swordVolleyFrom(origin,1,.50,'sword:kill',meta);
    }
  }
  if(ctx.event==='onDash'&&hasFormationTrait('sword','dash')&&triggerIcd('sword:dash',1.0)){
    const from=payload?.from||P,to=payload?.to||P,dir={x:to.x-from.x,y:to.y-from.y};
    const meta=swordTraitMeta(ctx,'dash','sword:dash');
    swordVolleyFrom(to,3,.40,'sword:dash',meta,null,dir);
  }
}
registerTriggerHandler('sword-traits',handleSwordTraitTrigger);
function beastConfig(){return BAL.enemy[M.area]||BAL.enemy.qingyun}
function playerProgressTier(){return M.realm.major>0?9+(M.realm.stage||1):(M.realm.stage||1)}
function areaBaseTier(){return({qingyun:1,blackwind:3,blood:6,foundation_trial:9,thunder:10,marsh:11,taixu:16}[M.area]||1)}
function areaOverlevelGap(){return Math.max(0,playerProgressTier()-areaBaseTier())}
function incomingDamageScale(){const slots=Math.max(1,({qingyun:2,blackwind:3,blood:3,foundation_trial:1,thunder:3,marsh:3,taixu:3}[M.area]||3));const multi=1/(1+.25*(slots-1));const over=Math.pow(.85,areaOverlevelGap());return multi*over}
function takePlayerDamage(dmg,grantGrace=false,source='enemy'){
  dmg=Math.max(0,+dmg||0);
  dmg=foundationContent()?.modifyPlayerDamage?.(dmg,source,foundationApi())??dmg;
  if(!dmg)return;
  const effective=Math.min(Math.max(0,P.hp),dmg);
  P.hp-=dmg;
  if(run){
    run.minHp=Math.min(run.minHp,P.hp);
    run.lastDamageAt=elapsed;
    run.regenPulse=0;
    run.damageTaken=(run.damageTaken||0)+effective;
    run.lastDamageSource=source||'enemy';
    run.damageBySource=run.damageBySource||{};
    run.damageBySource[run.lastDamageSource]=(run.damageBySource[run.lastDamageSource]||0)+effective;
  }
  if(grantGrace)P.hitGrace=1.15;
}
function dealEnemyDamage(enemy,amount,source='unknown',triggerMeta=null){
  amount=Math.max(0,+amount||0);
  amount=foundationContent()?.modifyEnemyDamage?.(enemy,amount,source,foundationApi())??amount;
  if(!enemy||enemy.hp<=0||!amount)return 0;
  const effective=Math.min(enemy.hp,amount),meta=copyTriggerMeta(triggerMeta||{});
  if(!meta.source)meta.source=source;
  enemy.hp-=amount;
  enemy._lastHit={source,meta:copyTriggerMeta(meta)};
  if(run){
    run.skillDamage=run.skillDamage||{};
    run.skillDamage[source]=(run.skillDamage[source]||0)+effective;
  }
  emitTrigger('onHit',{enemy,amount:effective,source,lethal:enemy.hp<=0},meta);
  return effective;
}
function updateNonCombatRecovery(dt){
  if(!M.trainingNodes?.f1_harmony||P.hp<=0||P.hp>=P.max)return;
  const before=P.hp;
  P.hp=Math.min(P.max,P.hp+P.max*.025*dt);
  run.regenPulse=(run.regenPulse||0)+dt;
  if(run.regenPulse>=1.25&&P.hp>before){
    run.regenPulse=0;
    pop(P.x,P.y-22,`기혈 회복 +${Math.max(1,Math.round(P.max*.025*1.25))}`,'#79b98f',.65);
  }
}
const cap=()=>isMortal()?1:2+M.realm.major*9+(M.realm.stage-1);
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const totalHerbs=r=>(r?.h0||0)+(r?.h1||0)+(r?.h2||0);

function meets(req){
  if(isMortal())return false;
  return M.realm.major>req.major||(M.realm.major===req.major&&M.realm.stage>=req.stage);
}

function herbKey(grade){return grade===0?'herb':grade===1?'herb2':'herb3'}
function herbHave(grade){return Number(M[herbKey(grade)])||0}
function herbSpend(grade,amount){M[herbKey(grade)]-=amount}
function herbAdd(grade,amount){M[herbKey(grade)]+=amount}

function branches(id=M.area){
  if(id==='qingyun')return ['eco'];
  if(id==='blackwind')return ['eco','fate'];
  if(id==='blood')return ['eco','fate','res'];
  if(id==='thunder')return ['eco','fate','res','storm'];
  return [];
}

function branchOf(id){
  if(id.startsWith('eco'))return 'eco';
  if(id.startsWith('fate'))return 'fate';
  if(id.startsWith('res'))return 'res';
  return 'storm';
}

function allowedNode(id,area=M.area){return branches(area).includes(branchOf(id))}
function rank(id,area=M.area){
  if(!allowedNode(id,area))return 0;
  return clamp(Number(Z(area).tree[id])||0,0,5);
}
function treeCount(id=M.area){return NODES.filter(node=>allowedNode(node.id,id)&&rank(node.id,id)>0).length}
function treeLevels(id=M.area){return NODES.reduce((sum,node)=>sum+(allowedNode(node.id,id)?rank(node.id,id):0),0)}
function nodeReq(node){
  const area=A();
  return {major:area.req.major,stage:area.baseStage+node.tier-1};
}
function nodeReady(node){
  return allowedNode(node.id)&&rank(node.id)<5&&meets(nodeReq(node))&&(!node.p||rank(node.p)>=3);
}
function nodeCost(node){
  const level=rank(node.id);
  const mul=[1,3,8,16][areaIndex()]||16;
  const grow=1+level*.7;
  return {
    s:Math.ceil(node.c.s*mul*grow),
    h:Math.ceil(node.c.h*(1+areaIndex()*.5)*grow),
    hg:Math.min(2,areaIndex())
  };
}
function areaReady(area){
  return !!M.unlocked[area.id]||(meets(area.req)&&(!area.req.prev||treeCount(area.req.prev)>=area.req.nodes));
}
function areaRequirement(area){
  if(M.unlocked[area.id])return `개척 ${treeCount(area.id)}노드 · 강화 ${treeLevels(area.id)}`;
  if(!meets(area.req))return `${MAJORS[area.req.major]} ${area.req.stage}층 필요`;
  if(area.req.prev&&treeCount(area.req.prev)<area.req.nodes){
    const previous=AREAS.find(item=>item.id===area.req.prev);
    return `${previous.name} 인연 ${area.req.nodes}노드 필요`;
  }
  return '개방 가능';
}

function skillState(id){return M.skills[id]}
function skillOpen(skill){return meets(skill.req)}
function skillCap(skill){
  if(!skillOpen(skill))return 0;
  if(M.realm.major>skill.req.major)return 5;
  return clamp(M.realm.stage-skill.req.stage+1,1,5);
}
function skillCost(skill,key,next){
  const tier=SKILLS.indexOf(skill)+1;
  return {
    s:Math.ceil((18+tier*18)*1.58**(next-1)),
    h:key==='cycle'?Math.ceil((tier+next)/2):0,
    hg:skill.grade
  };
}
function trainCost(key){
  const level=M.cult[key];
  const major=Math.max(0,M.realm.major);
  const base={atk:24,mov:28,sen:5,hp:7}[key];
  if(key==='sen'||key==='hp'){
    return {s:0,h:Math.ceil(base*1.78**(level-1)*(1+major*1.35)),hg:Math.min(2,Math.floor(level/3))};
  }
  return {s:Math.ceil(base*2.08**(level-1)*(1+major*4)),h:0,hg:0};
}
function breakthroughCost(){
  if(isMortal())return {s:0,h:8,hg:0,init:1};
  const costs={
    '0:1':{s:80,h:10,hg:0},
    '0:2':{s:180,h:14,hg:0},
    '0:3':{s:300,h:10,hg:1},
    '0:4':{s:450,h:14,hg:1},
    '0:5':{s:800,h:18,hg:1},
    '0:6':{s:1300,h:15,hg:2},
    '0:7':{s:1800,h:20,hg:2},
    '0:8':{s:2600,h:28,hg:2},
    '0:9':{s:4500,h:40,hg:2,major:1},
    '1:1':{s:5400,h:50,hg:2},
    '1:2':{s:6800,h:60,hg:2},
    '1:3':{s:8400,h:75,hg:2},
    '1:4':{s:11000,h:100,hg:2},
    '1:5':{s:13400,h:120,hg:2},
    '1:6':{s:16300,h:145,hg:2},
    '1:7':{s:21100,h:190,hg:2},
    '1:8':{s:27200,h:240,hg:2}
  };
  return costs[`${M.realm.major}:${M.realm.stage}`]||{s:999999999,h:999999,hg:2};
}

function planAvailable(id){
  if(isMortal())return id==='harvest';
  if(id!=='venture')return true;
  if(M.area==='blackwind')return rank('fate1')>0;
  if(M.area==='blood')return rank('res1')>0;
  return true;
}
function ensurePlan(){
  if(!planAvailable(M.settings.plan)){
    M.settings.plan=PLANS.find(plan=>planAvailable(plan.id))?.id||'harvest';
  }
}
function ventureCopy(){
  if(M.area==='qingyun')return ['무상 귀환','체력 70% 이상으로 귀환 · 혼합 보상'];
  if(M.area==='blackwind')return ['산수 추적','산수·탐보서 1명 격파 · 혼합 보상'];
  if(M.area==='blood')return ['영맥 잠행','영맥에서 영석 10개 채굴 · 혼합 보상'];
  return ['천뢰 수행','낙뢰 2회 회피 · 혼합 보상'];
}
function planCopy(plan){
  if(plan.id!=='venture')return [plan.name,plan.desc];
  return ventureCopy();
}

function objectiveData(){
  const index=areaIndex();
  if(M.settings.plan==='harvest'){
    const target=index===2?6:5+index*2;
    return {label:'영초 채집',value:totalHerbs(run),target,reward:`${HN[Math.min(2,index)]} 영초 +${2+index}`};
  }
  if(M.settings.plan==='hunt'){
    return {label:'요수 토벌',value:run?.beastKills||0,target:3+index,reward:`영석 +${Math.ceil(18*A().reward)}`};
  }
  if(M.area==='qingyun'){
    return {label:'무상 귀환',value:run&&P.hp/P.max>=.7?1:0,target:1,reward:'영석과 영초'};
  }
  if(M.area==='blackwind'){
    return {label:'산수 추적',value:run?.thieves||0,target:1,reward:'영석과 영초'};
  }
  if(M.area==='blood'){
    return {label:'영맥 잠행',value:run?.mined||0,target:10,reward:'영석과 영초'};
  }
  return {label:'천뢰 수행',value:run?.dodges||0,target:2,reward:'영석과 영초'};
}
function objectiveMet(){
  const objective=objectiveData();
  return objective.value>=objective.target;
}
function objectiveReward(){
  const index=areaIndex();
  if(M.settings.plan==='harvest'){
    const amount=2+index;
    herbAdd(Math.min(2,index),amount);
    return `${HN[Math.min(2,index)]} 영초 +${amount}`;
  }
  if(M.settings.plan==='hunt'){
    const amount=Math.ceil(18*A().reward);
    M.stone+=amount;
    return `영석 +${amount}`;
  }
  const stone=Math.ceil(10*A().reward);
  const herbs=1+Math.floor(index/2);
  M.stone+=stone;
  herbAdd(Math.min(2,index),herbs);
  return `영석 +${stone} · ${HN[Math.min(2,index)]} 영초 +${herbs}`;
}

function render(){
  ensurePlan();
  UI.stone.textContent=Math.floor(M.stone);
  UI.herb.textContent=`下${M.herb} · 中${M.herb2} · 上${M.herb3}`;
  UI.realm.textContent=UI.realm2.textContent=realmName();
  UI.area.textContent=A().name;
  UI.desc.textContent=`${A().desc} · 이동 ${Math.round(A().env.move*100)}% / 감응 ${Math.round(A().env.pick*100)}%`;
  const currentCap=cap();
  UI.cap.textContent=isMortal()?'수련 잠김':`상한 Lv.${currentCap}`;
  UI.realmInfo.textContent=isMortal()
    ?'아직 영기를 다룰 수 없습니다. 청운산에서 영초를 모아 수선에 입문하세요.'
    :'강해진 수치뿐 아니라 새 법술과 비경 기믹이 경지에 따라 열립니다.';

  for(const [key,button,label,cost] of [
    ['atk',UI.atk,UI.al,UI.ac],['mov',UI.mov,UI.ml,UI.mc],
    ['sen',UI.sen,UI.sl,UI.sc],['hp',UI.hpb,UI.hl,UI.hc]
  ]){
    const price=trainCost(key);
    const value=M.cult[key];
    const capped=value>=currentCap;
    label.textContent=isMortal()?'잠김':`Lv.${value}/${currentCap}`;
    cost.textContent=isMortal()?'입문 후 가능':capped?'현재 경지 상한':price.h
      ?`${HN[price.hg]} 영초 ${price.h}`
      :`영석 ${price.s}`;
    button.disabled=phase==='run'||isMortal()||capped;
  }

  const breakthrough=breakthroughCost();
  const needsEvent=breakthrough.major&&M.realm.major===0&&!M.events.foundationInsight;
  UI.btTitle.textContent=breakthrough.init?'수선 입문':breakthrough.major
    ?`${MAJORS[M.realm.major+1]||'다음 대경지'} 돌파`
    :'소경지 돌파';
  UI.btCost.textContent=breakthrough.init
    ?`하급 영초 ${breakthrough.h}`
    :`영석 ${breakthrough.s} · ${HN[breakthrough.hg]} 영초 ${breakthrough.h}${needsEvent?' · 축기의 실마리 필요':''}`;
  UI.bt.disabled=phase==='run'||needsEvent;
  UI.eventInfo.style.display=breakthrough.major?'block':'none';
  if(breakthrough.major){
    UI.eventInfo.innerHTML=M.realm.major===0
      ?M.events.foundationInsight
        ?'✓ <b>축기의 실마리 확보</b>'
        :'연기 9층에서 적혈비경 정예 수호수를 격파하고 무사 귀환해야 합니다.'
      :'대경지 돌파는 막대한 영기와 상급 영초를 요구합니다.';
  }

  const zone=Z();
  UI.runCount.textContent=`${zone.safe}/${zone.runs}회 귀환`;
  UI.bestStone.textContent=zone.bestStone||0;
  UI.bestHerb.textContent=zone.bestHerb||0;
  UI.bestKills.textContent=zone.bestKills||0;

  renderPlans();
  renderAreas();
  renderTree();
  renderSkills();
  activateTab(M.settings.tab||'train',false);
  if(phase==='home')syncHud();
  save();
}

function renderPlans(){
  UI.planChoices.innerHTML='';
  for(const plan of PLANS){
    const available=planAvailable(plan.id);
    const [name,description]=planCopy(plan);
    const button=document.createElement('button');
    button.className='plan-card'+(M.settings.plan===plan.id?' active':'');
    button.innerHTML=`<b>${plan.icon} ${name}</b><span>${available?description:isMortal()?'수선 입문 후 선택 가능':'해당 인연을 먼저 해금해야 합니다.'}</span>`;
    button.disabled=phase==='run'||!available;
    button.onclick=()=>{
      M.settings.plan=plan.id;
      UI.notice.textContent=`${name}을 이번 원정 방침으로 선택했습니다.`;
      render();
    };
    UI.planChoices.appendChild(button);
  }
}

function renderAreas(){
  UI.areas.innerHTML='';
  for(const area of AREAS){
    const unlocked=!!M.unlocked[area.id];
    const ready=areaReady(area);
    const button=document.createElement('button');
    button.className='area-btn'+(M.area===area.id?' active':'')+(!unlocked&&!ready?' locked':'')+(ready&&!unlocked?' ready':'');
    button.innerHTML=`<strong>${M.area===area.id?'▶ ':''}${area.name}</strong><span class="meta">${area.rec}</span><small>${areaRequirement(area)}</small>`;
    button.disabled=phase==='run';
    button.onclick=()=>{
      if(!unlocked&&!ready){
        UI.notice.textContent=areaRequirement(area);
        return;
      }
      if(!unlocked)M.unlocked[area.id]=1;
      M.area=area.id;
      treeCamera.ready=false;
      ensurePlan();
      UI.notice.textContent=`${area.name} 선택. 이 비경의 인연과 기록이 복원되었습니다.`;
      render();
      draw();
    };
    UI.areas.appendChild(button);
  }
}

function renderTree(){
  UI.tree.innerHTML='';
  const activeBranches=branches();
  const activeNodes=NODES.filter(node=>allowedNode(node.id));
  if(!activeNodes.some(node=>node.id===selectedTreeNode))selectedTreeNode=activeNodes[0]?.id||'eco1';
  UI.tree.style.gridTemplateColumns=`repeat(${activeBranches.length},minmax(90px,1fr))`;
  UI.tree.style.setProperty?.('--branch-count',activeBranches.length);
  const names={
    eco:['생태','🩸'],fate:['산수·기연','✦'],res:['영맥','⛏'],storm:['천뢰','⚡']
  };
  for(const key of activeBranches){
    const branch=document.createElement('div');
    branch.className='branch';
    branch.innerHTML=`<div class="branch-title">${names[key][1]} ${names[key][0]}</div>`;
    for(const node of TREE[key]){
      const level=rank(node.id);
      const ready=nodeReady(node);
      const wrap=document.createElement('div');
      wrap.className='tree-node-wrap'+(level?' reached':'')+(level>=5?' complete':'');
      const button=document.createElement('button');
      button.className='tree-node'+(level?' on':'')+(level>=5?' complete':ready?' available':' locked')+(selectedTreeNode===node.id?' selected':'');
      button.innerHTML=`<span class="node-glyph">${level>=5?'完':['Ⅰ','Ⅱ','Ⅲ'][node.tier-1]}</span>`;
      button.title=`${node.n} · ${node.d}`;
      button.setAttribute?.('aria-label',`${node.n} ${level}/5`);
      button.setAttribute?.('aria-pressed',String(selectedTreeNode===node.id));
      button.onclick=()=>{selectedTreeNode=node.id;renderTree()};
      const label=document.createElement('div');
      label.className='node-name';
      label.textContent=node.n;
      const rankLabel=document.createElement('div');
      rankLabel.className='node-rank';
      rankLabel.textContent=`${level}/5`;
      const pips=document.createElement('div');
      pips.className='node-pips';
      pips.innerHTML=Array.from({length:5},(_,index)=>`<i class="${index<level?'on':''}"></i>`).join('');
      wrap.appendChild(button);wrap.appendChild(label);wrap.appendChild(rankLabel);wrap.appendChild(pips);
      branch.appendChild(wrap);
    }
    UI.tree.appendChild(branch);
  }

  const selected=NODES.find(node=>node.id===selectedTreeNode)||activeNodes[0];
  if(selected){
    const level=rank(selected.id);
    const price=nodeCost(selected);
    const ready=nodeReady(selected);
    const req=nodeReq(selected);
    let status;
    if(level>=5)status='이 인연은 완성되었습니다.';
    else if(!meets(req))status=`해금 조건 · ${MAJORS[req.major]} ${req.stage}층`;
    else if(selected.p&&rank(selected.p)<3)status=`선행 조건 · ${NODES.find(node=>node.id===selected.p)?.n||'이전 노드'} 3/5`;
    else status=`다음 단계 비용 · 영석 ${price.s}${price.h?` · ${HN[price.hg]} 영초 ${price.h}`:''}`;
    UI.treeDetail.innerHTML=`<div class="tree-detail-head"><b>${selected.n}</b><span>${level}/5 · ${names[branchOf(selected.id)][0]}</span></div><p>${selected.d}</p><div class="tree-detail-state">${status}</div>`;
    const upgrade=document.createElement('button');
    upgrade.className='tree-upgrade'+(ready?' ready':'');
    upgrade.textContent=level>=5?'인연 완성':ready?`${level+1}단계 강화`:'조건 미충족';
    upgrade.disabled=phase==='run'||!ready;
    upgrade.onclick=()=>buyNode(selected);
    UI.treeDetail.appendChild(upgrade);
  }
  requestAnimationFrame(()=>{if(!treeCamera.ready)resetTreeView()});
  const max=activeBranches.length*3;
  UI.nc.textContent=`${treeCount()}/${max}노드 · 강화 ${treeLevels()}/${max*5}`;
  UI.treeHint.textContent=M.area==='qingyun'
    ?'청운산: 요수 생태만 존재'
    :M.area==='blackwind'
      ?'흑풍곡: 요수 + 산수·탐보서'
      :M.area==='blood'
        ?'적혈비경: 요수 + 산수 + 영맥·정예'
        :'천뢰봉: 요수 + 산수 + 영맥 + 낙뢰 회피';
}

function applyTreeCamera(){
  UI.treeWorld.style.transform=`translate(${treeCamera.x}px,${treeCamera.y}px) scale(${treeCamera.scale})`;
}

function resetTreeView(){
  const width=UI.treeViewport.clientWidth;
  const height=UI.treeViewport.clientHeight;
  const worldWidth=UI.treeWorld.scrollWidth;
  const worldHeight=UI.treeWorld.scrollHeight;
  if(width<40||height<40||worldWidth<40)return;
  treeCamera.scale=clamp(Math.min(1,(width-18)/worldWidth,(height-18)/worldHeight),TREE_SCALE_MIN,1);
  treeCamera.x=Math.max(8,(width-worldWidth*treeCamera.scale)/2);
  treeCamera.y=Math.max(8,(height-worldHeight*treeCamera.scale)/2);
  treeCamera.ready=true;
  applyTreeCamera();
}

function zoomTreeAt(clientX,clientY,factor){
  const bounds=UI.treeViewport.getBoundingClientRect();
  const px=clientX-bounds.left;
  const py=clientY-bounds.top;
  const next=clamp(treeCamera.scale*factor,TREE_SCALE_MIN,TREE_SCALE_MAX);
  const contentX=(px-treeCamera.x)/treeCamera.scale;
  const contentY=(py-treeCamera.y)/treeCamera.scale;
  treeCamera.x=px-contentX*next;
  treeCamera.y=py-contentY*next;
  treeCamera.scale=next;
  treeCamera.ready=true;
  applyTreeCamera();
}

function zoomTreeCenter(factor){
  const bounds=UI.treeViewport.getBoundingClientRect();
  zoomTreeAt(bounds.left+bounds.width/2,bounds.top+bounds.height/2,factor);
}

function treeGesture(){
  const points=[...treeCamera.pointers.values()];
  if(!points.length)return null;
  const center={x:points.reduce((sum,point)=>sum+point.x,0)/points.length,y:points.reduce((sum,point)=>sum+point.y,0)/points.length};
  const distance=points.length>1?Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y):0;
  return {count:points.length,center,distance};
}

function buyNode(node){
  if(!allowedNode(node.id)){
    UI.notice.textContent='이 비경에는 해당 계통이 없습니다.';
    return;
  }
  if(!nodeReady(node))return;
  const price=nodeCost(node);
  if(M.stone<price.s||herbHave(price.hg)<price.h){
    UI.notice.textContent='인연 강화 자원이 부족합니다.';
    return;
  }
  M.stone-=price.s;
  if(price.h)herbSpend(price.hg,price.h);
  Z().tree[node.id]=rank(node.id)+1;
  UI.notice.textContent=`${node.n} ${rank(node.id)}/5 강화. 다음 원정부터 비경이 변화합니다.`;
  render();
}

function renderSkills(){
  UI.skillTree.innerHTML='';
  for(const skill of SKILLS){
    const state=skillState(skill.id);
    const open=skillOpen(skill);
    const currentCap=skillCap(skill);
    const card=document.createElement('div');
    card.className='skill-card'+(state.u?'':' lock');
    card.innerHTML=`<div class="skill-head"><b>${skill.n}</b><span>${MAJORS[skill.req.major]} ${skill.req.stage}층</span></div><p>${skill.desc}</p>`;
    if(!state.u){
      const button=document.createElement('button');
      button.className='skill-btn skill-unlock';
      button.textContent=open
        ?`해금 · ${skill.unlock.s} 영석 · ${HN[skill.grade]} 영초 ${skill.unlock.h}`
        :`잠김 · ${MAJORS[skill.req.major]} ${skill.req.stage}층 필요`;
      button.disabled=phase==='run'||!open;
      button.onclick=()=>unlockSkill(skill);
      card.appendChild(button);
    }else{
      const upgrades=document.createElement('div');
      upgrades.className='skill-ups';
      for(const key of ['pow','range','cycle']){
        const name={pow:'위력',range:'범위/타수',cycle:'순환'}[key];
        const level=state[key];
        const button=document.createElement('button');
        button.className='skill-btn';
        if(level>=currentCap)button.textContent=`${name}\n${level}/${currentCap}`;
        else{
          const price=skillCost(skill,key,level+1);
          button.textContent=`${name} ${level}/${currentCap}\n${price.s}석${price.h?` · ${HN[price.hg]} ${price.h}초`:''}`;
        }
        button.disabled=phase==='run'||level>=currentCap;
        button.onclick=()=>upgradeSkill(skill,key);
        upgrades.appendChild(button);
      }
      card.appendChild(upgrades);
    }
    UI.skillTree.appendChild(card);
  }
}

function unlockSkill(skill){
  const state=skillState(skill.id);
  if(!skillOpen(skill)||state.u)return;
  if(M.stone<skill.unlock.s||herbHave(skill.grade)<skill.unlock.h){
    UI.notice.textContent='법술 해금 자원이 부족합니다.';
    return;
  }
  M.stone-=skill.unlock.s;
  herbSpend(skill.grade,skill.unlock.h);
  state.u=1;
  UI.notice.textContent=`${skill.n} 해금. 다음 원정부터 독립 쿨타임으로 자동 발동합니다.`;
  render();
}

function upgradeSkill(skill,key){
  const state=skillState(skill.id);
  const currentCap=skillCap(skill);
  if(!state.u||state[key]>=currentCap)return;
  const price=skillCost(skill,key,state[key]+1);
  if(M.stone<price.s||herbHave(price.hg)<price.h){
    UI.notice.textContent='법술 강화 자원이 부족합니다.';
    return;
  }
  M.stone-=price.s;
  if(price.h)herbSpend(price.hg,price.h);
  state[key]++;
  UI.notice.textContent=`${skill.n} ${key==='pow'?'위력':key==='range'?'범위/타수':'순환'} 강화.`;
  render();
}

function buyTrain(key){
  if(phase==='run'||isMortal()||M.cult[key]>=cap())return;
  const price=trainCost(key);
  if(price.h){
    if(herbHave(price.hg)<price.h){
      UI.notice.textContent=`${HN[price.hg]} 영초가 부족합니다.`;
      return;
    }
    herbSpend(price.hg,price.h);
  }else{
    if(M.stone<price.s){
      UI.notice.textContent='영석이 부족합니다.';
      return;
    }
    M.stone-=price.s;
  }
  M.cult[key]++;
  render();
}

function breakthrough(){
  if(phase==='run')return;
  const price=breakthroughCost();
  const needsEvent=price.major&&M.realm.major===0&&!M.events.foundationInsight;
  if(needsEvent){
    UI.notice.textContent='축기 시련의 수문장을 넘어야 합니다.';
    return;
  }
  if(M.stone<price.s||herbHave(price.hg)<price.h){
    UI.notice.textContent='돌파 자원이 부족합니다.';
    return;
  }
  M.stone-=price.s;
  if(price.h)herbSpend(price.hg,price.h);
  if(price.init){
    M.realm={major:0,stage:1};
    M.skills.sword.u=1;
  }
  else if(M.realm.stage<9)M.realm.stage++;
  else M.realm={major:M.realm.major+1,stage:1};
  if(price.init)UI.notice.textContent=`수선 입문 성공 — ${realmName()}. 입문 검결 어검술을 전승받았습니다.`;
  else if(isMortal()===false&&M.settings.plan==='harvest')UI.notice.textContent=`돌파 성공 — ${realmName()}. 이제 토벌과 기연 수행도 선택할 수 있습니다.`;
  else UI.notice.textContent=`돌파 성공 — ${realmName()}`;
  render();
  draw();
}

function randomPoint(margin=34){
  return {x:margin+Math.random()*(W-margin*2),y:margin+Math.random()*(H-margin*2-18)};
}
function edgePoint(){
  const angle=Math.random()*Math.PI*2,radius=260+Math.random()*220;
  return {x:clamp(P.x+Math.cos(angle)*radius,64,W-64),y:clamp(P.y+Math.sin(angle)*radius,64,H-64)};
}
function pop(x,y,text,color='#fff',life=.85){
  fx.push({kind:'text',x,y,text,color,t:life,ttl:life});
}
function ring(x,y,r,color,life=.32){
  fx.push({kind:'ring',x,y,r,color,t:life,ttl:life});
}
function slash(x1,y1,x2,y2,color='#e9f4ff'){
  fx.push({kind:'slash',x:x1,y:y1,x2,y2,color,t:.16,ttl:.16});
}
function drop(type,x,y,value=1,grade=null){
  if(type==='h'&&grade==null){
    const index=areaIndex();
    grade=index===0?0:index===1?(Math.random()<.78?1:0):index===2?(Math.random()<.12?2:1):(Math.random()<.72?2:1);
  }
  objects.push({type,x,y,r:type==='h'?8:7,value,grade,pulse:Math.random()*6.28});
}
function randomHerb(){const point=randomPoint();drop('h',point.x,point.y,1)}

function actor(type,options={}){
  const point=options.p||edgePoint();
  const cfg=beastConfig();
  const isBeast=['basic','guard','chaser','attacker','elite'].includes(type)||!!foundationContent()?.isCombatType?.(type);
  const role={basic:{hp:1,atk:1,speed:1},guard:{hp:1.2,atk:1.1,speed:.8},chaser:{hp:.85,atk:.9,speed:1.25},attacker:{hp:1,atk:1.3,speed:1},elite:{hp:4,atk:1.55,speed:.95}}[type]||{hp:1,atk:1,speed:1};
  const baseSpeed=cfg.chaserSpeed/1.25;
  let grade=options.grade||((type==='elite')?'elite':'normal');
  if(isBeast&&type!=='elite'&&!options.grade){
    const er=rank('eco3'),u=Math.random();
    const rareChance=[0,.04,.06,.09,.12,.16][er]||0;
    const enhancedChance=[0,.04,.07,.09,.12,.15][er]||0;
    if(u<rareChance)grade='rare';else if(u<rareChance+enhancedChance)grade='enhanced';
  }
  const gm={normal:{hp:1,atk:1,speed:1,reward:1},enhanced:{hp:1.35,atk:1.15,speed:1.05,reward:1.5},rare:{hp:1.8,atk:1.25,speed:1.08,reward:2.5},elite:{hp:1,atk:1,speed:1,reward:6}}[grade]||{hp:1,atk:1,speed:1,reward:1};
  const hp=isBeast?cfg.hp*role.hp*gm.hp:(type==='spirit'?1:type==='rogue'?80:type==='rat'?35:60);
  const enemy={id:nextEnemyId++,type,x:point.x,y:point.y,r:type==='elite'?23:type==='spirit'?10:type==='rat'?9:12,hp,max:hp,cd:isBeast?Math.random()*cfg.period*.85:0,aggressive:0,homeX:options.homeX??point.x,homeY:options.homeY??point.y,vx:(Math.random()-.5)*45,vy:(Math.random()-.5)*45,escape:0,bond:0,rare:grade==='rare'?1:0,grade,treasure:0,carry:[],stealCd:0,attack:cfg.hit*role.atk*gm.atk,attackPeriod:cfg.period,speed:isBeast?baseSpeed*role.speed*gm.speed:(type==='spirit'?92:type==='rogue'?105:type==='rat'?125:90),rewardMult:gm.reward,rareTrait:null,windup:0,pendingStrike:0,packId:options.packId??null,slotAngle:Math.random()*Math.PI*2,packLeader:options.packLeader?1:0};
  if(options.packLeader&&isBeast){enemy.hp*=1.15;enemy.max=enemy.hp;enemy.attack*=1.10;enemy.rewardMult*=1.15;enemy.r+=2}
  if(grade==='rare'){
    const er=rank('eco3');
    if(er>=4){enemy.hp*=1.10;enemy.max=enemy.hp;enemy.attack*=1.08}
    if(er>=3){const traits=er>=5?['frenzy','iron','howl','devour']:['frenzy','iron','howl'];enemy.rareTrait=traits[Math.floor(Math.random()*traits.length)];if(enemy.rareTrait==='iron'){enemy.hp*=1.18;enemy.max=enemy.hp}}
  }
  if(type==='rogue')enemy.treasure=Math.random()<.18+rank('fate2')*.10;
  foundationContent()?.configureEnemy?.(enemy,type,options,foundationApi());
  enemies.push(enemy);
  return enemy;
}

function spawnBeast(point=null,options={}){
  const mix={qingyun:[['basic',.55],['guard',.25],['chaser',.20],['attacker',0]],blackwind:[['basic',.25],['guard',.25],['chaser',.35],['attacker',.15]],blood:[['basic',.15],['guard',.30],['chaser',.25],['attacker',.30]],thunder:[['basic',.10],['guard',.20],['chaser',.35],['attacker',.35]]}[M.area]||[['basic',1]];
  let u=Math.random(),type=mix[mix.length-1][0];for(const [t,p] of mix){if(u<p){type=t;break}u-=p}
  type=foundationContent()?.spawnType?.(M.area,M.realm,type,foundationApi())||type;
  const p=point||edgePoint();return actor(type,{...options,p,homeX:options.homeX??p.x,homeY:options.homeY??p.y});
}
function encounterConfig(){return BAL.encounter}
function encounterBeast(e){return e&&(['basic','guard','chaser','attacker','elite'].includes(e.type)||!!foundationContent()?.isCombatType?.(e.type))&&e.hp>0}
function encounterRank(){return Math.max(0,Math.min(5,rank('eco1')))}
function encounterPackCount(){const e=encounterConfig(),r=encounterRank();return e.packCounts[M.area]?.[r]??e.packCounts.qingyun[r]}
function encounterPackSize(){const e=encounterConfig(),r=Math.max(0,Math.min(5,rank('eco2'))),v=e.packSize[r]||e.packSize[0],lo=v[0],hi=v[1];return lo+Math.floor(Math.random()*(hi-lo+1))}
function encounterLiveCap(){const e=encounterConfig(),r=encounterRank();return e.liveCaps[M.area]?.[r]??8}
function attackSlotCap(){return encounterConfig().attackSlots[M.area]||3}
function encounterLiveCount(){let n=0;for(const e of enemies)if(encounterBeast(e))n++;return n}
function encounterPoint(existing,starterIndex=-1,starterCount=0){
  const e=encounterConfig(),r=encounterRank();
  if(starterIndex>=0){const base=Math.random()*Math.PI*2,angle=base+starterIndex*Math.PI*2/Math.max(1,starterCount),radius=320+Math.random()*110;return{x:clamp(P.x+Math.cos(angle)*radius,100,W-100),y:clamp(P.y+Math.sin(angle)*radius,100,H-100)}}
  const gap=e.minPackGap[r]||220;for(let a=0;a<80;a++){const p={x:100+Math.random()*(W-200),y:100+Math.random()*(H-200)};if(distance(p,EXIT_APPROACH)<260)continue;if(existing.every(q=>Math.hypot(p.x-q.x,p.y-q.y)>=gap))return p}return{x:100+Math.random()*(W-200),y:100+Math.random()*(H-200)}
}
function activateEncounterPack(pack,force=false){
  if(!pack||pack.active)return false;const cap=encounterLiveCap(),live=encounterLiveCount();if(!force&&live+pack.size>cap)return false;pack.active=1;pack.activatedAt=elapsed;run.packActivated=(run.packActivated||0)+1;const rarePack=rank('eco3')>=5&&Math.random()<.10;
  for(let i=0;i<pack.size;i++){const angle=i/Math.max(1,pack.size)*Math.PI*2+Math.random()*.45,radius=18+Math.random()*48,p={x:clamp(pack.x+Math.cos(angle)*radius,64,W-64),y:clamp(pack.y+Math.sin(angle)*radius,64,H-64)},leader=rank('eco2')>=3&&i===0;let grade=null;if(rarePack)grade=i===0?'rare':(Math.random()<.45?'rare':'enhanced');spawnBeast(p,{packId:pack.id,packLeader:leader,grade})}return true
}
function nearestDormantEncounterPack(maxRange){let best=null,bd=maxRange;for(const p of run.packs||[]){if(p.active)continue;const d=distance(P,p);if(d<bd){bd=d;best=p}}return best}
function initEncounterPacks(){
  const e=encounterConfig(),count=encounterPackCount(),starter=Math.min(count,e.starterPacks[M.area]||2),packs=[];run.packs=packs;run.packActivated=0;run.chainUsed=0;run.chainTimer=e.chainDelay[encounterRank()]||99;run.calmTimer=0;
  for(let i=0;i<count;i++){const p=encounterPoint(packs,i<starter?i:-1,starter);packs.push({id:i,x:p.x,y:p.y,size:encounterPackSize(),active:0,starter:i<starter})}
  if(starter>0)activateEncounterPack(packs[0],true)
}
function updateEncounterPacks(dt){
  if(!run?.packs)return;const e=encounterConfig(),r=encounterRank(),wake=e.wakeRadius[r]||600;const nearby=run.packs.filter(p=>!p.active&&distance(P,p)<=(p.starter?Math.min(260,wake):wake)).sort((a,b)=>distance(P,a)-distance(P,b));for(const p of nearby){if(encounterLiveCount()>=encounterLiveCap())break;activateEncounterPack(p,false)}
  const combat=enemies.some(x=>encounterBeast(x)&&distance(P,x)<280);if(combat&&r>=3){run.calmTimer=0;run.chainTimer-=dt;const limit=e.chainLimit[r]||0;if(run.chainTimer<=0&&run.chainUsed<limit){const p=nearestDormantEncounterPack(e.chainRadius[r]||0);if(p&&activateEncounterPack(p,false)){run.chainUsed++;run.chainTimer=e.chainDelay[r]||99}else run.chainTimer=.8}}else{run.calmTimer=(run.calmTimer||0)+dt;if(run.calmTimer>1.2){run.chainUsed=0;run.chainTimer=e.chainDelay[r]||99}}
}
function attackStrikeSet(){const cap=attackSlotCap(),list=enemies.filter(e=>encounterBeast(e)&&e.aggressive).sort((a,b)=>distance(P,a)-distance(P,b));return new Set(list.slice(0,cap))}

function setupVein(){
  if(!branches().includes('res')||rank('res1')<=0)return;
  const point={x:W*.15+Math.random()*W*.70,y:H*.15+Math.random()*H*.70};
  const r1=rank('res1'),r2=rank('res2'),r3=rank('res3');
  vein={x:point.x,y:point.y,r:26,stock:Math.round((55+r1*15+r3*30)*currentPlan().vein),progress:0,cleared:r2?0:1,waveStage:0};
  if(r2>0){const angle=Math.random()*6.28,guardPoint={x:point.x+Math.cos(angle)*90,y:point.y+Math.sin(angle)*90};const elite=actor('elite',{p:guardPoint,homeX:guardPoint.x,homeY:guardPoint.y});elite.mineGuard=1;if(r2>=3){for(let i=0;i<2+(r2>=5?1:0);i++){const a=Math.random()*6.28,p={x:point.x+Math.cos(a)*(110+Math.random()*40),y:point.y+Math.sin(a)*(110+Math.random()*40)};actor(i%2?'guard':'chaser',{p,homeX:p.x,homeY:p.y})}}}
}

function foundationApi(){
  return {
    get state(){return M},get player(){return P},get run(){return run},get enemies(){return enemies},get hazards(){return hazards},get objects(){return objects},
    get phase(){return phase},get elapsed(){return elapsed},W,H,EXIT,clamp,distance,moveToward,
    spawn:(type,options={})=>actor(type,options),
    addHazard:hazard=>hazards.push(hazard),
    damagePlayer:(amount,source='foundation')=>takePlayerDamage(amount,true,source),
    damageEnemy:(enemy,amount,source='foundation',triggerMeta=null)=>dealEnemyDamage(enemy,amount,source,triggerMeta),
    trigger:(event,payload={},meta={})=>emitTrigger(event,payload,meta),
    childTriggerMeta,
    triggerIcd,
    castSpell:(id,options={})=>{const skill=SKILLS.find(item=>item.id===id);return skill?cast(skill,options):false},
    gainStone,gainHerb,drop,pop,ring,slash,
    finish,
    save
  };
}

function begin(){
  if(phase==='run')return;
  ensurePlan();
  phase='run';
  elapsed=0;
  enemies=[];
  objects=[];
  fx=[];
  hazards=[];
  vein=null;
  const plan=currentPlan();
  const herbTotal=Math.max(3,Math.round(A().herbs*plan.herbCount));
  const herbInitial=Math.ceil(herbTotal*.72);
  const beastTotal=0,beastInitial=0;
  run={
    s:0,h0:0,h1:0,h2:0,left:0,minHp:1,kills:0,beastKills:0,elite:0,
    thieves:0,treasures:0,mined:0,dodges:0,combo:0,comboTime:0,bestCombo:0,
    herbLeft:herbTotal-herbInitial,beastLeft:beastTotal-beastInitial,
    herbTimer:7+Math.random()*3,beastTimer:4.2+Math.random()*1.8,rogueTimer:6,
    lightningTimer:M.area==='thunder'?2.2:999,
    lastDamageAt:-999,regenPulse:0,damageTaken:0,lastDamageSource:'',damageBySource:{},
    skillDamage:{basic:0,sword:0,wave:0,chain:0,thunder:0,array:0},
    skillCasts:{basic:0,sword:0,wave:0,chain:0,thunder:0,array:0},
    skillCooldowns:Object.fromEntries(SKILLS.map(skill=>[skill.id,0])),scheduledHits:[],
    triggers:{counts:{},blocked:{depth:0,recursion:0},icd:{},last:null},triggeredCasts:{}
  };
  run.limit=foundationContent()?.runLimit?.(M.area,M.realm)||RUN_TIME;
  P.x=P.tx=EXIT_APPROACH.x;
  P.y=P.ty=EXIT_APPROACH.y;
  P.target=null;
  P.max=Math.max(1,Math.round(M.cult.hp||90));
  P.hp=P.max;
  P.cd=0;
  run.minHp=P.max;
  for(let i=0;i<herbInitial;i++)randomHerb();
  if(!foundationContent()?.bossOnly?.(M.area,M.realm))initEncounterPacks();else run.packs=[];
  if(branches().includes('fate')&&rank('fate3')){
    for(let i=0;i<1+Math.floor((rank('fate3')-1)/2);i++)actor('spirit');
  }
  setupVein();
  foundationContent()?.onBegin?.(foundationApi());
  UI.ov.classList.add('hide');
  if(window.matchMedia?.('(max-width:920px)').matches)setMenuOpen(false);
  UI.ret.disabled=false;
  UI.notice.textContent=`${planCopy(plan)[0]} 시작. 배치를 읽고 목표와 귀환 동선을 함께 잡으세요.`;
  syncHud();
  window.__xianxiaFrameHub?.wake?.();
}

function gainStone(amount,x=P.x,y=P.y){
  amount=Math.max(1,Math.floor(amount));
  run.s+=amount;
  pop(x,y,`+${amount} 영석`,'#d5e8ff');
}
function gainHerb(amount,grade,x,y){
  amount=Math.max(1,Math.floor(amount));
  run[`h${grade}`]+=amount;
  pop(x,y,`+${amount} ${HN[grade]} 영초`,['#83e39b','#72ddc1','#c4a1ff'][grade]);
}
function spillCarry(enemy){
  if(!enemy.carry?.length)return;
  const count=enemy.carry.length;
  enemy.carry.forEach((item,index)=>{
    const angle=index/count*Math.PI*2;
    const radius=14+4*(index%2);
    drop(item.type,enemy.x+Math.cos(angle)*radius,enemy.y+Math.sin(angle)*radius,item.value,item.grade);
  });
  pop(enemy.x,enemy.y-14,`훔친 전리품 ${count}개 회수 가능`,'#ffe59a',1);
  enemy.carry=[];
}
function registerKill(enemy){
  run.kills++;
  M.stats.totalKills++;
  run.combo=clamp(run.combo+1,1,5);
  run.comboTime=4.2;
  run.bestCombo=Math.max(run.bestCombo,run.combo);
  if(enemy.type!=='rogue'&&enemy.type!=='rat')run.beastKills++;
  pop(enemy.x,enemy.y+18,`검세 ${run.combo}단`,'#8fe7d1',.65);
}
function reward(enemy){
  const plan=currentPlan();
  const handled=foundationContent()?.rewardEnemy?.(enemy,foundationApi());
  if(handled){
    // Content module owns the reward, while the shared kill/combo accounting stays here.
  }else if(['basic','guard','chaser','attacker'].includes(enemy.type)){
    gainStone(Math.ceil(A().killStone*plan.reward*(enemy.rewardMult||1)),enemy.x,enemy.y);
  }else if(enemy.type==='elite'){
    run.elite=1;gainStone(Math.ceil(A().killStone*6*plan.reward),enemy.x,enemy.y);gainHerb(2+rank('res3'),Math.min(2,areaIndex()),enemy.x+10,enemy.y);if(vein){vein.cleared=1;vein.stock+=20+rank('res3')*8}
  }else if(enemy.type==='rogue'||enemy.type==='rat'){
    run.thieves++;spillCarry(enemy);gainStone(Math.ceil((enemy.type==='rogue'?A().killStone*.65:A().killStone*.28)*plan.reward),enemy.x,enemy.y);
    if(enemy.type==='rogue'&&enemy.treasure){const bonus=Math.ceil(A().killStone*(1.2+rank('fate2')*.35));gainStone(bonus,enemy.x+8,enemy.y-5);gainHerb(1+Math.floor(rank('fate2')/3),Math.min(2,areaIndex()),enemy.x-8,enemy.y);run.treasures++;pop(enemy.x,enemy.y-20,'✦ 비보 확보','#ffe28a',1.25)}
  }
  if(enemy.type!=='spirit'){
    for(const other of enemies){if(other!==enemy&&other.rareTrait==='devour'&&other.hp>0&&distance(other,enemy)<150)other.hp=Math.min(other.max,other.hp+other.max*.12)}
    registerKill(enemy);
  }
}

function bestClusterTarget(acquire,radius){
  const candidates=enemies.filter(e=>e.type!=='spirit'&&e.hp>0&&distance(P,e)<acquire);
  if(!candidates.length)return null;
  let target=candidates[0],best=-1,nearest=Infinity;
  for(const e of candidates){
    const crowd=candidates.filter(o=>distance(e,o)<radius*1.35).length,d=distance(P,e);
    if(crowd>best||(crowd===best&&d<nearest)){best=crowd;nearest=d;target=e}
  }
  return target;
}
function cast(skill,options={}){
  const st=skillState(skill.id),r=skillRank(skill.id),rr=skillRangeRank(skill.id),b=BAL.skill[skill.id];if(!st.u||!r||!b)return false;
  const sr=r,B=basicDamage(),powerScale=options.powerScale===undefined?1:Math.max(0,+options.powerScale||0),source=options.source||skill.id,meta=copyTriggerMeta(options.triggerMeta||{}),damage=B*b.mult[r]*powerScale;
  if(!meta.source)meta.source=source;
  const done=extra=>{if(options.triggered){run.triggeredCasts[skill.id]=(run.triggeredCasts[skill.id]||0)+1}emitTrigger('onCast',{skillId:skill.id,rank:r,powerScale,triggered:!!options.triggered,...(extra||{})},meta);return true};
  if(skill.id==='sword'){
    const range=b.range[sr],targets=swordCandidates(range,P);if(!targets.length)return false;
    const t1=selectedFormationTrait('sword',1),primary=targets[0];let hits=0;
    if(t1==='split'){
      const used=new Map();
      for(let i=0;i<3;i++){
        const target=targets[i%targets.length],dup=used.get(target.id)||0,scale=dup?.45*.60:.45;
        if(swordHit(target,damage,scale,source,meta,P)>0){hits++;used.set(target.id,dup+1)}
      }
    }else if(t1==='pierce'){
      const dx=primary.x-P.x,dy=primary.y-P.y,n=Math.hypot(dx,dy)||1,ux=dx/n,uy=dy/n;
      const lineEnd={x:P.x+ux*range,y:P.y+uy*range};
      const pierced=targets.filter(e=>{
        const vx=lineEnd.x-P.x,vy=lineEnd.y-P.y,wx=e.x-P.x,wy=e.y-P.y,ll=vx*vx+vy*vy,t=ll?clamp((wx*vx+wy*vy)/ll,0,1):0;
        return Math.hypot(e.x-(P.x+vx*t),e.y-(P.y+vy*t))<Math.max(18,e.r+8);
      }).sort((a,b)=>distance(P,a)-distance(P,b)).slice(0,3);
      for(const target of pierced)if(swordHit(target,damage,.90,source,meta,P)>0)hits++;
    }else{
      const scale=t1==='heavy'?1.55:1;
      if(swordHit(primary,damage,scale,source,meta,P)>0)hits++;
    }
    if(!hits)return false;
    if(hasFormationTrait('sword','return')&&targets.length===1&&primary.hp>0){
      const rmeta=swordTraitMeta(meta,'return','sword:return');
      swordHit(primary,damage,.60,'sword:return',rmeta,P);hits++;
    }
    pop(primary.x,primary.y,`어검 ×${hits}`,'#f4f6ff');
    return done({target:primary,hits});
  }
  if(skill.id==='wave'){
    const radius=b.radius[sr],target=bestClusterTarget(b.acquire[sr],radius);if(!target)return false;let hits=0;for(const e of enemies){if(e.type==='spirit'||e.hp<=0||distance(target,e)>=radius)continue;dealEnemyDamage(e,damage,source,meta);hits++}if(!hits)return false;pop(target.x,target.y,'검풍 ×'+hits,'#9fdfff');ring(target.x,target.y,radius,'#9fdfff');return done({target,hits});
  }
  if(skill.id==='chain'){
    const candidates=enemies.filter(e=>e.type!=='spirit'&&e.hp>0),max=b.count[rr],jump=b.jump[sr],acquire=b.acquire[sr];let current=P,used=new Set(),hits=0;for(let i=0;i<max;i++){let target=null,near=Infinity;for(const e of candidates){if(used.has(e))continue;const d=distance(current,e),allowed=i===0?acquire:jump;if(d<allowed&&d<near){near=d;target=e}}if(!target)break;dealEnemyDamage(target,damage,source,meta);slash(current.x,current.y,target.x,target.y,'#c6d6ff');used.add(target);current=target;hits++}return hits>0?done({target:current,hits}):false;
  }
  if(skill.id==='thunder'){
    const radius=b.radius[sr],target=bestClusterTarget(b.acquire[sr],radius);if(!target)return false;let hits=0;for(const e of enemies){if(e.type!=='spirit'&&e.hp>0&&distance(target,e)<radius){dealEnemyDamage(e,damage,source,meta);hits++}}if(!hits)return false;pop(target.x,target.y,'낙뢰 ×'+hits,'#d7c8ff');ring(target.x,target.y,radius,'#d7c8ff',.4);return done({target,hits});
  }
  if(skill.id==='array'){
    const radius=b.radius[sr],target=bestClusterTarget(b.acquire[sr],radius);if(!target)return false;const pulse=damage/3;run.scheduledHits.push({kind:'array',source,t:0.02,x:target.x,y:target.y,r:radius,damage:pulse,triggerMeta:copyTriggerMeta(meta)},{kind:'array',source,t:.36,x:target.x,y:target.y,r:radius,damage:pulse,triggerMeta:copyTriggerMeta(meta)},{kind:'array',source,t:.70,x:target.x,y:target.y,r:radius,damage:pulse,triggerMeta:copyTriggerMeta(meta)});pop(target.x,target.y,'만검진','#ffe9a8');ring(target.x,target.y,radius,'#ffe9a8',.24);return done({target});
  }
  return false;
}

function moveToward(actor,x,y,speed,dt){
  const dx=x-actor.x;
  const dy=y-actor.y;
  const d=Math.hypot(dx,dy);
  if(d<2)return;
  actor.x+=dx/d*speed*dt;
  actor.y+=dy/d*speed*dt;
}

function spawnLightning(){
  const level=rank('storm1');
  const foresight=rank('storm2');
  hazards.push({
    x:clamp(P.x+(Math.random()-.5)*70,45,W-45),
    y:clamp(P.y+(Math.random()-.5)*70,45,H-45),
    r:36+foresight*2,
    t:.82+foresight*.075,
    ttl:.82+foresight*.075,
    struck:0,
    reward:STORM_BAL.reward[level]||0
  });
}

function updateHazards(dt){
  foundationContent()?.updateHazards?.(dt,foundationApi());
  if(M.area==='thunder'&&M.realm.major>=1&&(M.realm.stage||0)>=3){run.lightningTimer-=dt;if(run.lightningTimer<=0){const level=rank('storm1'),chain=STORM_BAL.chain[level]||1;for(let i=0;i<chain;i++)setTimeout(()=>{if(phase==='run')spawnLightning()},i*STORM_BAL.chainDelay*1000);run.lightningTimer=STORM_BAL.period[level]||6.5}}
  for(const h of hazards){if(h.visualOwner==='foundation')continue;h.t-=dt;if(h.t<=0&&!h.struck){h.struck=1;h.t=.28;h.ttl=.28;if(distance(P,h)<h.r){let dmg=Math.ceil(beastConfig().hit*.55);takePlayerDamage(dmg,false,'lightning');pop(P.x,P.y,'천뢰 -'+dmg,'#ff9fa0',1)}else{run.dodges++;if((run.stormRewardCount||0)<STORM_BAL.rewardCap&&h.reward>0){run.stormRewardCount=(run.stormRewardCount||0)+1;drop('s',h.x,h.y,h.reward)}pop(h.x,h.y,'천뢰 회피','#bfc5ff',.9)}ring(h.x,h.y,h.r,'#d6d5ff',.3)}}hazards=hazards.filter(h=>h.t>0)
}

function update(dt){
  if(phase!=='run')return;elapsed+=dt;const limit=run?.limit||RUN_TIME;if(elapsed>=limit){finish('collapse');return}
  P.cd=Math.max(0,P.cd-dt);P.hitGrace=Math.max(0,(P.hitGrace||0)-dt);
  if(run.combo>0){run.comboTime-=dt;if(run.comboTime<=0){run.combo=0;run.comboTime=0}}
  for(const id of Object.keys(run.skillCooldowns))run.skillCooldowns[id]=Math.max(0,run.skillCooldowns[id]-dt);
  if(run.scheduledHits?.length){for(const h of run.scheduledHits){h.t-=dt;if(h.t<=0&&!h.done){h.done=1;for(const e of enemies)if(e.type!=='spirit'&&distance(h,e)<h.r)dealEnemyDamage(e,h.damage,h.source||h.kind||'array',h.triggerMeta||null);ring(h.x,h.y,h.r,'#ffe9a8',.28)}}run.scheduledHits=run.scheduledHits.filter(h=>!h.done)}
  const activeTargets=[...enemies,...objects,...(vein?[vein]:[])];if(P.target&&!activeTargets.includes(P.target))P.target=null;if(P.target){P.tx=P.target.x;P.ty=P.target.y}
  foundationContent()?.updateRun?.(dt,foundationApi());
  const speed=(isMortal()?150:(M.cult.mov||150))*areaMoveScale()*(1+run.combo*.005);
  const horizontal=(keys.has('arrowright')||keys.has('d')?1:0)-(keys.has('arrowleft')||keys.has('a')?1:0),vertical=(keys.has('arrowdown')||keys.has('s')?1:0)-(keys.has('arrowup')||keys.has('w')?1:0);
  if(horizontal||vertical){P.target=null;const norm=Math.hypot(horizontal,vertical)||1;P.x+=horizontal/norm*speed*dt;P.y+=vertical/norm*speed*dt;P.tx=P.x;P.ty=P.y}else moveToward(P,P.tx,P.ty,speed,dt);P.x=clamp(P.x,11,W-11);P.y=clamp(P.y,11,H-11);
  const exitDistance=Math.hypot(P.x-EXIT.x,P.y+PLAYER_GROUND_OFFSET-EXIT.y);if(exitDistance>68)run.left=1;if(run.left&&exitDistance<EXIT.r+9){finish('return');return}
  run.herbTimer-=dt;if(run.herbLeft>0&&run.herbTimer<=0){randomHerb();run.herbLeft--;run.herbTimer=7+Math.random()*3}
  updateEncounterPacks(dt);
  if(branches().includes('fate')&&rank('fate1')>0){run.rogueTimer-=dt;if(run.rogueTimer<=0){actor(Math.random()<.68?'rogue':'rat');run.rogueTimer=Math.max(4.2,10-rank('fate1')*.75)}}
  const pr=autoPickupRange();objects=objects.filter(o=>{if(distance(P,o)<pr+o.r){if(o.type==='h')gainHerb(o.value,o.grade,o.x,o.y);else gainStone(o.value,o.x,o.y);return false}return true});
  if(vein&&vein.stock>0&&distance(P,vein)<vein.r+P.r+10){vein.progress+=dt;const r3=rank('res3');if(r3>=3&&vein.waveStage<1&&vein.progress>=1){vein.waveStage=1;for(let i=0;i<2;i++){const a=Math.random()*6.28,p={x:vein.x+Math.cos(a)*130,y:vein.y+Math.sin(a)*130};actor(i?'chaser':'guard',{p,homeX:p.x,homeY:p.y})}}if(r3>=3&&vein.waveStage<2&&vein.progress>=2){vein.waveStage=2;for(let i=0;i<2+(r3>=5?2:0);i++){const a=Math.random()*6.28,p={x:vein.x+Math.cos(a)*(130+Math.random()*40),y:vein.y+Math.sin(a)*(130+Math.random()*40)};actor(i%2?'attacker':'chaser',{p,homeX:p.x,homeY:p.y})}}if(vein.progress>=3){const mined=vein.stock,x=vein.x,y=vein.y,doneVein=vein;run.mined+=mined;gainStone(mined,x,y);pop(x,y-34,'영맥 채굴 완료','#b8d7ef',1.1);if(P.target===doneVein)P.target=null;vein=null}}
  const strikeSet=attackStrikeSet();
  for(const enemy of enemies){
    enemy.cd=Math.max(0,enemy.cd-dt);
    if(foundationContent()?.updateEnemy?.(enemy,dt,foundationApi()))continue;
    if(enemy.type==='attacker'&&enemy.windup>0){enemy.windup-=dt;if(enemy.windup<=0&&enemy.pendingStrike){enemy.pendingStrike=0;if(distance(enemy,P)<P.r+enemy.r+16){let dmg=(enemy.attack||beastConfig().hit)*incomingDamageScale();if(enemies.some(o=>o!==enemy&&o.rareTrait==='howl'&&o.hp>0&&distance(o,enemy)<130))dmg*=1.15;if(P.hitGrace>0&&M.trainingNodes?.q6_spirit)dmg*=M.trainingNodes?.q9_harmony ? .90 : .92;dmg=Math.ceil(dmg);takePlayerDamage(dmg,true,'attacker');ring(P.x,P.y,P.r+9,'#c96893',.20)}}}
    if(enemy.type==='spirit'){const d=distance(enemy,P);if(d<40){enemy.bond+=dt;if(enemy.bond>1.3){const ai=areaIndex(),grade=Math.min(2,ai),bonus=ai>=3?(Math.random()<.35?1:0):ai>=2?(Math.random()<.25?1:0):0,reward=8+Math.floor(Math.random()*5)+bonus;gainHerb(reward,grade,enemy.x,enemy.y);pop(enemy.x,enemy.y-28,bonus?'영수 포획 · 기연 보너스!':'영수 포획 성공','#79ded6',1);enemy.hp=0}}else enemy.bond=Math.max(0,enemy.bond-dt*.3);if(rank('fate3')>=3&&d<130){const dx=enemy.x-P.x,dy=enemy.y-P.y,n=Math.hypot(dx,dy)||1;enemy.vx=dx/n*enemy.speed;enemy.vy=dy/n*enemy.speed}enemy.x=clamp(enemy.x+enemy.vx*dt,18,W-18);enemy.y=clamp(enemy.y+enemy.vy*dt,18,H-18);continue}
    if(enemy.type==='rogue'||enemy.type==='rat'){enemy.stealCd=Math.max(0,enemy.stealCd-dt);const dP=distance(enemy,P);if(enemy.type==='rogue'&&enemy.treasure&&rank('fate2')>=3&&dP<170)enemy.escape=1;let target=null,nearest=Infinity;if(!enemy.escape&&rank('fate1')>=3){for(const o of objects){const d=distance(enemy,o);if(d<nearest){nearest=d;target=o}}}if(target){moveToward(enemy,target.x,target.y,enemy.speed,dt);if(nearest<enemy.r+target.r+4&&enemy.stealCd<=0){const idx=objects.indexOf(target);if(idx>=0){objects.splice(idx,1);enemy.carry.push({type:target.type,value:target.value,grade:target.grade});enemy.stealCd=.35;if(enemy.type==='rat'||enemy.carry.length>=2)enemy.escape=1}}}else if(enemy.carry.length)enemy.escape=1;else if(!enemy.escape){enemy.x=clamp(enemy.x+enemy.vx*dt,18,W-18);enemy.y=clamp(enemy.y+enemy.vy*dt,18,H-18)}if(elapsed>21)enemy.escape=1;if(enemy.escape)moveToward(enemy,enemy.x<W/2?-30:W+30,enemy.y,enemy.speed*1.2,dt);continue}
    const d=distance(enemy,P),home=Math.hypot(enemy.x-enemy.homeX,enemy.y-enemy.homeY),aggro=enemy.type==='chaser'?220:enemy.type==='elite'?105:120;
    if(enemy.type==='chaser'){if(d<aggro)enemy.aggressive=1;if(d>aggro*1.45)enemy.aggressive=0}else{if(d<aggro)enemy.aggressive=1;if(home>210&&d>aggro)enemy.aggressive=0}
    let speedMul=1,period=enemy.attackPeriod||1;if(enemy.rareTrait==='frenzy'&&enemy.hp/enemy.max<.5){speedMul=1.15;period*=.8}if(enemy.aggressive){if(strikeSet.has(enemy))moveToward(enemy,P.x,P.y,enemy.speed*speedMul,dt);else{const rr=58+(enemy.r||12),tx=P.x+Math.cos(enemy.slotAngle||0)*rr,ty=P.y+Math.sin(enemy.slotAngle||0)*rr;moveToward(enemy,tx,ty,enemy.speed*.82*speedMul,dt)}}else if(home>5)moveToward(enemy,enemy.homeX,enemy.homeY,enemy.speed*.55,dt);
    if(strikeSet.has(enemy)&&d<P.r+enemy.r+3&&enemy.cd<=0){if(enemy.type==='attacker'){enemy.windup=.55;enemy.pendingStrike=1;enemy.cd=period+.55;ring(enemy.x,enemy.y,enemy.r+18,'#c96893',.55)}else{let dmg=(enemy.attack||beastConfig().hit)*incomingDamageScale();if(enemies.some(o=>o!==enemy&&o.rareTrait==='howl'&&o.hp>0&&distance(o,enemy)<130))dmg*=1.15;if(P.hitGrace>0&&M.trainingNodes?.q6_spirit)dmg*=M.trainingNodes?.q9_harmony ? .90 : .92;dmg=Math.ceil(dmg);takePlayerDamage(dmg,true,'enemy_melee');enemy.cd=period;ring(P.x,P.y,P.r+7,'#f47b6f',.16)}}
  }
  enemies=enemies.filter(e=>{
    if((e.type==='rogue'||e.type==='rat')&&(e.x<-10||e.x>W+10))return false;
    if(e.hp<=0){
      foundationContent()?.beforeEnemyDeath?.(e,foundationApi());
      if(e.type!=='spirit'){
        const hit=e._lastHit||{source:'unknown',meta:{}},meta=copyTriggerMeta(hit.meta||{});
        if(!meta.source)meta.source=hit.source||'unknown';
        const payload={enemy:e,source:hit.source||meta.source,special:isSpecialEnemy(e)};
        emitTrigger('onKill',payload,meta);
        if(payload.special)emitTrigger('onSpecialKill',payload,meta);
        reward(e);
      }
      return false;
    }
    return true;
  });
  if(!isMortal()&&P.cd<=0){const range=basicAttackRange(),targets=enemies.filter(e=>e.type!=='spirit'&&e.hp>0&&distance(P,e)<range).sort((a,b)=>distance(P,a)-distance(P,b)).slice(0,basicAttackTargets());if(targets.length){const dmg=basicDamage()*combatPower(),scales=[1,.62,.48,.36];targets.forEach((target,i)=>{dealEnemyDamage(target,dmg*(scales[i]||.32),'basic');slash(P.x,P.y,target.x,target.y,i?'#e8d6a5':'#f7e5ad')});run.skillCasts.basic=(run.skillCasts.basic||0)+1;P.cd=basicInterval()}}
  for(const skill of SKILLS){const st=skillState(skill.id);if(!st.u)continue;if(run.skillCooldowns[skill.id]<=0&&cast(skill)){run.skillCasts[skill.id]=(run.skillCasts[skill.id]||0)+1;run.skillCooldowns[skill.id]=effectiveSkillCooldown(skill.id)}}
  updateHazards(dt);updateNonCombatRecovery(dt);if(P.hp<=0){P.hp=0;finish('dead');return}syncHud();
}

function fortune(reason){
  if(reason!=='return'||isMortal())return '';
  const pool=[];
  if(run.minHp/P.max<.3)pool.push(['생사의 깨달음','빈사 상태에서 돌아오며 기혈 운용을 깨달았습니다.',0,2]);
  if(run.beastKills>=4)pool.push(['살의 속 오도','연이은 요수전 속에서 검의 흐름을 깨달았습니다.',Math.ceil(8*A().reward),0]);
  if(run.elite)pool.push(['영맥의 잔향','정예 수호수의 영기가 단전에 남았습니다.',Math.ceil(10*A().reward),2]);
  if(run.bestCombo>=5)pool.push(['검세 관통','끊기지 않은 검세가 새로운 감각을 남겼습니다.',Math.ceil(7*A().reward),1]);
  if(!pool.length||Math.random()>.48)return '';
  const event=pool[Math.floor(Math.random()*pool.length)];
  M.stone+=event[2];
  if(event[3])herbAdd(Math.min(2,areaIndex()),event[3]);
  return `<div class="event"><b>기연 · ${event[0]}</b><br>${event[1]}<br>${event[2]?`영석 +${event[2]} `:''}${event[3]?`${HN[Math.min(2,areaIndex())]} 영초 +${event[3]}`:''}</div>`;
}

function finish(reason){
  if(phase!=='run')return;
  phase='home';
  UI.game.classList.remove('danger');
  const safe=reason==='return';
  const ratio=safe?1:.4;
  const stone=Math.floor(run.s*ratio);
  const h0=Math.floor(run.h0*ratio);
  const h1=Math.floor(run.h1*ratio);
  const h2=Math.floor(run.h2*ratio);
  M.stone+=stone;
  M.herb+=h0;
  M.herb2+=h1;
  M.herb3+=h2;

  const zone=Z();
  zone.runs++;
  M.stats.totalRuns++;
  if(safe){zone.safe++;M.stats.totalSafe++}
  if(run.elite)zone.eliteWins++;
  zone.bestStone=Math.max(zone.bestStone||0,stone);
  zone.bestHerb=Math.max(zone.bestHerb||0,h0+h1+h2);
  zone.bestKills=Math.max(zone.bestKills||0,run.kills);

  let event='';
  event+=foundationContent()?.onFinish?.(reason,foundationApi())||'';
  event+=fortune(reason);

  let objective='';
  if(safe&&objectiveMet()){
    const rewardText=objectiveReward();
    objective=`<div class="event"><b>수행 완수 · ${objectiveData().label}</b><br>${rewardText}</div>`;
  }

  UI.ov.classList.remove('hide');
  UI.ret.disabled=true;
  UI.ot.textContent=safe?'무사 귀환':reason==='dead'?'육신 중상':'비경 붕괴 · 강제 이탈';
  const resultLead=safe?'전리품 전량 확보':reason==='dead'?'전투 불능 · 전리품 40% 회수':'비경이 무너지며 강제로 튕겨났습니다.<br><b>전리품 60% 소실</b> · 40%만 회수';
  UI.ox.innerHTML=`${resultLead}<br><b>영석 ${stone} · 영초 下${h0} 中${h1} 上${h2}</b>${objective}${event}`;
  render();
  draw();
  window.__xianxiaFrameHub?.wake?.();
}

function syncHud(){
  UI.hp.textContent=`${Math.ceil(P.hp)} / ${P.max}`;
  UI.hpFill.style.width=`${Math.max(0,P.hp/P.max)*100}%`;
  UI.loot.textContent=`영석 ${run?.s||0} · 영초 ${totalHerbs(run)}`;
  const remaining=Math.max(0,(run?.limit||RUN_TIME)-elapsed);
  UI.time.textContent=`${remaining.toFixed(1)}초`;
  UI.time.style.color=phase==='run'&&remaining<=5?'#ff776c':phase==='run'&&remaining<=10?'#e8a06f':'';
  UI.game.classList.toggle('danger',phase==='run'&&remaining<=10);
  UI.combo.textContent=run?.combo?`${run.combo}단 · ${run.comboTime.toFixed(1)}초`:'0단';

  if(run){
    const objective=objectiveData();
    const complete=objective.value>=objective.target;
    UI.objective.innerHTML=`<b>${currentPlan().icon} ${objective.label}</b> · ${Math.min(objective.value,objective.target)}/${objective.target} ${complete?'✓ 완수':'· 귀환 시 '+objective.reward}`;
    const active=SKILLS.filter(skill=>skillState(skill.id).u).map(skill=>{
      const cooldown=run.skillCooldowns[skill.id];
      return `${skill.n} ${cooldown>0?cooldown.toFixed(1):'준비'}`;
    });
    UI.skillRun.textContent=active.length?active.join(' · '):'해금된 법술 없음 · 기본 검격만 사용';
  }else{
    const [name,description]=planCopy(currentPlan());
    UI.objective.innerHTML=`<b>${currentPlan().icon} ${name}</b> · ${description}`;
    UI.skillRun.textContent='법술 탭에서 해금한 법술은 모두 자동 발동합니다.';
  }
}

function drawBackground(){
  const palette=A().palette;
  const gradient=g.createLinearGradient(0,0,0,H);
  gradient.addColorStop(0,palette[0]);
  gradient.addColorStop(.55,palette[1]);
  gradient.addColorStop(1,'#081014');
  g.fillStyle=gradient;
  g.fillRect(0,0,W,H);

  g.globalAlpha=.28;
  for(let layer=0;layer<3;layer++){
    g.fillStyle=layer===0?palette[2]:layer===1?palette[1]:'#0a1518';
    g.beginPath();
    g.moveTo(0,190+layer*55);
    for(let x=0;x<=W;x+=70){
      const y=160+layer*65+Math.sin(x*.018+layer*1.7)*35+(x%140?22:0);
      g.lineTo(x,y);
    }
    g.lineTo(W,H);g.lineTo(0,H);g.closePath();g.fill();
  }
  g.globalAlpha=1;

  if(M.area==='qingyun'){
    g.strokeStyle='#b6e2ca1c';g.lineWidth=2;
    for(let i=0;i<9;i++){
      const x=40+i*82;
      g.beginPath();g.moveTo(x,70);g.lineTo(x-10,205);g.stroke();
      for(let y=95;y<190;y+=22){g.beginPath();g.moveTo(x-4,y);g.lineTo(x-23,y+15);g.stroke()}
    }
  }else if(M.area==='blackwind'){
    g.strokeStyle='#d9c48b17';g.lineWidth=2;
    for(let i=0;i<11;i++){
      const y=40+i*34;
      g.beginPath();g.moveTo((elapsed*22+i*51)%W,y);g.bezierCurveTo(230,y-13,450,y+14,690,y-2);g.stroke();
    }
  }else if(M.area==='blood'){
    g.strokeStyle='#e8736230';g.lineWidth=1.5;
    for(let i=0;i<12;i++){
      const x=28+i*61;
      g.beginPath();g.moveTo(x,H);g.lineTo(x+18,330);g.lineTo(x-4,290);g.stroke();
    }
  }else{
    g.fillStyle='#d4dcff55';
    for(let i=0;i<34;i++){
      const x=(i*97)%W,y=(i*53)%260;
      g.fillRect(x,y,1.5,1.5);
    }
    g.strokeStyle='#b8c3ff19';
    for(let i=0;i<7;i++){
      const x=55+i*103;
      g.beginPath();g.moveTo(x,0);g.lineTo(x+18,45);g.lineTo(x-5,75);g.stroke();
    }
  }

  g.strokeStyle='#ffffff0b';g.lineWidth=1;
  for(let x=0;x<W;x+=35){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke()}
  for(let y=0;y<H;y+=35){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke()}
}

function drawExit(){
  g.save();
  g.translate(EXIT.x,EXIT.y);
  g.strokeStyle='#8fe1b2';
  g.lineWidth=2;
  g.globalAlpha=.8;
  g.beginPath();g.arc(0,0,29,Math.PI,Math.PI*2);g.stroke();
  g.beginPath();g.arc(0,0,20,Math.PI,Math.PI*2);g.stroke();
  for(let i=0;i<5;i++){
    const x=-24+i*12;
    g.beginPath();g.moveTo(x,-3);g.lineTo(x+5,-12);g.lineTo(x+10,-3);g.stroke();
  }
  g.fillStyle='#b9efd0';
  g.font='11px sans-serif';
  g.textAlign='center';
  g.fillText('귀환진',0,-34);
  g.restore();
}

function drawHerb(object){
  const colors=['#58c576','#55cbb1','#ae85e9'];
  g.save();
  g.translate(object.x,object.y);
  const sway=Math.sin(elapsed*2+object.pulse)*2;
  g.strokeStyle='#bfe8c2aa';
  g.lineWidth=1.5;
  g.beginPath();g.moveTo(0,7);g.quadraticCurveTo(sway,-1,0,-8);g.stroke();
  g.fillStyle=colors[object.grade||0];
  g.beginPath();g.ellipse(-4+sway*.2,-2,5,2.8,-.5,0,6.28);g.fill();
  g.beginPath();g.ellipse(4+sway*.2,-5,5,2.8,.5,0,6.28);g.fill();
  g.shadowColor=colors[object.grade||0];g.shadowBlur=8;
  g.beginPath();g.arc(0,-7,2.2,0,6.28);g.fill();
  g.restore();
}

function drawStone(object){
  g.save();g.translate(object.x,object.y);g.rotate(.4);
  g.fillStyle='#b8d7ef';g.strokeStyle='#eef7ff';g.lineWidth=1;
  g.beginPath();g.moveTo(0,-8);g.lineTo(6,-1);g.lineTo(3,7);g.lineTo(-5,5);g.lineTo(-6,-2);g.closePath();g.fill();g.stroke();
  g.restore();
}

function drawVein(){
  if(!vein||vein.stock<=0)return;
  g.save();g.translate(vein.x,vein.y);
  g.shadowColor='#8ab6ff';g.shadowBlur=18;
  const color=vein.cleared?'#8bd9d0':'#718ec8';
  g.fillStyle=color;g.strokeStyle='#d9e8ff';g.lineWidth=1;
  for(const [x,y,s] of [[-11,4,12],[2,-4,17],[13,5,10]]){
    g.beginPath();g.moveTo(x,y-s);g.lineTo(x+s*.45,y);g.lineTo(x,y+s*.55);g.lineTo(x-s*.45,y);g.closePath();g.fill();g.stroke();
  }
  const progress=clamp((vein.progress||0)/3,0,1);
  g.shadowBlur=0;g.textAlign='center';
  g.fillStyle='#081016aa';g.fillRect(-30,30,60,7);
  g.fillStyle='#8bd9d0';g.fillRect(-29,31,58*progress,5);
  g.strokeStyle='#d9e8ff88';g.strokeRect(-30,30,60,7);
  g.fillStyle='#e7f0ff';g.font='10px sans-serif';
  g.fillText(`영맥 ${vein.stock} · 채굴 ${Math.round(progress*100)}%`,0,49);
  g.restore();
}

function drawEnemy(enemy){
  g.save();g.translate(enemy.x,enemy.y);
  if(enemy.rare){g.shadowColor='#ffd27a';g.shadowBlur=13}
  if(['basic','guard','chaser','attacker','elite'].includes(enemy.type)){
    const color=enemy.type==='elite'?'#7d2627':enemy.type==='chaser'?'#d2763d':enemy.type==='attacker'?'#8d3e63':enemy.type==='guard'?'#8b4d38':'#a84443';
    g.fillStyle=color;g.strokeStyle=enemy.rare?'#ffd27a':'#e7a19a';g.lineWidth=1.3;
    g.beginPath();
    const points=enemy.type==='elite'?8:6;
    for(let i=0;i<points;i++){
      const angle=-Math.PI/2+i*Math.PI*2/points;
      const radius=enemy.r*(i%2?.82:1);
      const x=Math.cos(angle)*radius,y=Math.sin(angle)*radius;
      i?g.lineTo(x,y):g.moveTo(x,y);
    }
    g.closePath();g.fill();g.stroke();
    g.fillStyle='#ffe6a9';g.beginPath();g.arc(-4,-2,1.7,0,6.28);g.arc(4,-2,1.7,0,6.28);g.fill();
  }else if(enemy.type==='rogue'){
    g.fillStyle='#8c62b9';g.beginPath();g.arc(0,-7,5,0,6.28);g.fill();
    g.beginPath();g.moveTo(-9,12);g.lineTo(0,-3);g.lineTo(9,12);g.closePath();g.fill();
    g.strokeStyle='#d7baff';g.beginPath();g.moveTo(6,-1);g.lineTo(13,-12);g.stroke();
  }else if(enemy.type==='rat'){
    g.fillStyle='#d4bd58';g.beginPath();g.ellipse(0,1,9,6,0,0,6.28);g.fill();
    g.beginPath();g.arc(-5,-5,3,0,6.28);g.arc(4,-5,3,0,6.28);g.fill();
    g.strokeStyle='#e8db91';g.beginPath();g.moveTo(8,2);g.quadraticCurveTo(16,5,17,11);g.stroke();
  }else{
    g.fillStyle='#77d9dc';g.shadowColor='#77d9dc';g.shadowBlur=18;
    g.beginPath();g.arc(0,0,enemy.r,0,6.28);g.fill();
    g.strokeStyle='#d9ffff';g.beginPath();g.arc(0,0,enemy.r+4+Math.sin(elapsed*3)*2,0,6.28);g.stroke();
  }
  g.restore();

  if(enemy.type==='spirit'){
    const capture=clamp((enemy.bond||0)/1.3,0,1),near=distance(P,enemy)<40;
    const width=46,y=enemy.y-enemy.r-18;
    g.fillStyle='#061012b8';g.fillRect(enemy.x-width/2,y,width,6);
    g.fillStyle=near||capture>0?'#79ded6':'#829b99';g.fillRect(enemy.x-width/2+1,y+1,(width-2)*capture,4);
    g.strokeStyle='#d9ffffaa';g.strokeRect(enemy.x-width/2,y,width,6);
    g.fillStyle='#d9ffff';g.font='bold 9px sans-serif';g.textAlign='center';
    g.fillText(capture>0?`포획 ${Math.round(capture*100)}%`:'영수 · 접근해 포획',enemy.x,enemy.y+enemy.r+19);
    g.textAlign='left';
  }
  if(enemy.type!=='spirit'){
    const width=enemy.type==='elite'?48:36;
    g.fillStyle='#04080aa8';g.fillRect(enemy.x-width/2,enemy.y-enemy.r-13,width,5);
    g.fillStyle=enemy.rare?'#ffd079':'#f0dbd7';
    g.fillRect(enemy.x-width/2,enemy.y-enemy.r-13,width*clamp(enemy.hp/enemy.max,0,1),5);
  }
  if(enemy.type==='rogue'||enemy.type==='rat'){
    g.fillStyle=enemy.type==='rogue'?'#d9b8ff':'#f5dd72';
    g.font='bold 10px sans-serif';g.textAlign='center';
    g.fillText((enemy.type==='rogue'?'산수':'탐보서')+(enemy.carry.length?` · 전리품 ${enemy.carry.length}`:''),enemy.x,enemy.y+enemy.r+15);
    g.textAlign='left';
  }
}

function drawPlayer(){
  g.save();g.translate(P.x,P.y);
  const aura=isMortal()?'#a8b0b4':'#78d4c0';
  g.strokeStyle=aura+'66';g.lineWidth=1.5;
  g.beginPath();g.arc(0,0,P.r+6+Math.sin(elapsed*4)*2,0,6.28);g.stroke();
  g.fillStyle=isMortal()?'#6f777c':'#2d7b73';
  g.beginPath();g.moveTo(-10,12);g.lineTo(0,-5);g.lineTo(10,12);g.closePath();g.fill();
  g.fillStyle='#e1c7a4';g.beginPath();g.arc(0,-8,5,0,6.28);g.fill();
  if(!isMortal()){
    const angle=elapsed*4.5;
    g.save();g.rotate(angle);g.translate(18,0);g.rotate(1.2);
    g.strokeStyle='#f2df9f';g.lineWidth=2;g.beginPath();g.moveTo(-7,0);g.lineTo(8,0);g.stroke();
    g.fillStyle='#f2df9f';g.beginPath();g.moveTo(8,0);g.lineTo(4,-3);g.lineTo(4,3);g.closePath();g.fill();
    g.restore();
  }
  g.restore();

  const pickupRange=autoPickupRange();
  g.strokeStyle='#8ac8dc2c';g.lineWidth=1;
  g.beginPath();g.arc(P.x,P.y,pickupRange,0,6.28);g.stroke();
  if(Math.hypot(P.tx-P.x,P.ty-P.y)>5){
    g.strokeStyle='#d8e9c966';
    g.beginPath();g.arc(P.tx,P.ty,8+Math.sin(elapsed*6)*2,0,6.28);g.stroke();
  }
}

function drawHazards(){
  for(const hazard of hazards){
    g.save();
    const charging=!hazard.struck;
    const progress=charging?1-hazard.t/hazard.ttl:1;
    g.strokeStyle=charging?`rgba(205,210,255,${.35+progress*.6})`:'#f4f1ff';
    g.lineWidth=charging?2:4;
    g.setLineDash(charging?[6,5]:[]);
    g.beginPath();g.arc(hazard.x,hazard.y,hazard.r,0,6.28);g.stroke();
    g.setLineDash([]);
    if(!charging){
      g.strokeStyle='#eef0ff';g.lineWidth=5;
      g.beginPath();g.moveTo(hazard.x-8,0);g.lineTo(hazard.x+5,hazard.y-40);g.lineTo(hazard.x-2,hazard.y-18);g.lineTo(hazard.x+10,hazard.y);g.stroke();
    }
    g.restore();
  }
}

function drawFx(){
  for(const effect of fx){
    g.save();
    g.globalAlpha=Math.min(1,effect.t/.16);
    if(effect.kind==='ring'){
      g.strokeStyle=effect.color;g.lineWidth=3;
      const progress=1-effect.t/effect.ttl;
      g.beginPath();g.arc(effect.x,effect.y,effect.r*(.82+progress*.18),0,6.28);g.stroke();
    }else if(effect.kind==='slash'){
      g.strokeStyle=effect.color;g.lineWidth=2.5;
      g.beginPath();g.moveTo(effect.x,effect.y);g.lineTo(effect.x2,effect.y2);g.stroke();
    }else{
      g.fillStyle=effect.color;g.font='bold 12px sans-serif';g.textAlign='center';
      g.fillText(effect.text,effect.x,effect.y);g.textAlign='left';
    }
    g.restore();
  }
}

function draw(){
  drawBackground();
  drawExit();
  drawHazards();
  if(vein)drawVein();
  for(const object of objects)object.type==='h'?drawHerb(object):drawStone(object);
  for(const enemy of enemies)drawEnemy(enemy);
  drawPlayer();
  drawFx();
}

function frameStep(_snapshot,meta){
  const now=meta?.now??performance.now();
  const dt=Math.min(.035,Math.max(0,(now-last)/1000));
  last=now;
  if(phase!=='run')return;
  for(const effect of fx){
    effect.t-=dt;
    if(effect.kind==='text')effect.y-=21*dt;
  }
  fx=fx.filter(effect=>effect.t>0);
  update(dt);
}

function pointFromEvent(event){
  const bounds=cv.getBoundingClientRect();
  return {x:(event.clientX-bounds.left)*W/bounds.width,y:(event.clientY-bounds.top)*H/bounds.height};
}
function setDestination(point,allowTarget=true){
  let target=null,nearest=Infinity;
  if(allowTarget){
    for(const candidate of [...enemies,...objects,...(vein?[vein]:[])]){
      const d=distance(point,candidate);
      const hitRadius=candidate===vein?60:candidate.type==='spirit'?46:32;
      if(d<hitRadius&&d<nearest){nearest=d;target=candidate}
    }
  }
  P.target=target;
  P.tx=target?target.x:point.x;
  P.ty=target?target.y:point.y;
}

function activateTab(name,persist=true,toggleMenu=false){
  const valid=['train','skills','areas','tree'].includes(name)?name:'train';
  const previous=M.settings.tab||'train';
  const compact=!!window.matchMedia?.('(max-width:920px)').matches;
  if(compact&&toggleMenu)mobileMenuOpen=valid===previous?!mobileMenuOpen:true;
  UI.controls.classList.toggle('open',compact?mobileMenuOpen:true);
  document.querySelectorAll('.tab-btn').forEach(button=>{
    const active=button.dataset.tab===valid;
    button.classList.toggle('active',active);
    button.setAttribute?.('aria-expanded',String(active&&(!compact||mobileMenuOpen)));
  });
  document.querySelectorAll('.panel').forEach(panel=>panel.classList.toggle('active',panel.dataset.panel===valid));
  if(valid==='tree'&&(!compact||mobileMenuOpen))requestAnimationFrame(()=>{if(!treeCamera.ready)resetTreeView()});
  if(persist){M.settings.tab=valid;save()}
}

function setMenuOpen(open){
  const compact=!!window.matchMedia?.('(max-width:920px)').matches;
  mobileMenuOpen=compact?!!open:true;
  UI.controls.classList.toggle('open',compact?mobileMenuOpen:true);
  document.querySelectorAll('.tab-btn').forEach(button=>button.setAttribute?.('aria-expanded',String(button.classList.contains('active')&&(!compact||mobileMenuOpen))));
  UI.controls.dispatchEvent(new CustomEvent('xianxia:panel-open',{detail:{open:compact?mobileMenuOpen:true}}));
}

UI.atk.onclick=()=>buyTrain('atk');
UI.mov.onclick=()=>buyTrain('mov');
UI.sen.onclick=()=>buyTrain('sen');
UI.hpb.onclick=()=>buyTrain('hp');
UI.bt.onclick=breakthrough;
UI.start.onclick=begin;
UI.ret.onclick=()=>{
  if(phase!=='run')return;
  P.target=null;
  P.tx=EXIT_APPROACH.x;P.ty=EXIT_APPROACH.y;
  UI.notice.textContent='귀환진으로 복귀합니다. 도중의 전리품은 경로 위에서만 수집됩니다.';
};
$('#devReset').onclick=()=>{
  if(!confirm('모든 진행사항을 삭제하고 범인부터 다시 시작할까요?'))return;
  localStorage.removeItem(KEY);
  for(const key of OLD)localStorage.removeItem(key);
  location.reload();
};
document.querySelectorAll('.tab-btn').forEach(button=>{
  button.onclick=()=>activateTab(button.dataset.tab,true,true);
});
cv.addEventListener('pointerdown',event=>{
  if(phase!=='run')return;
  event.preventDefault();
  pointerDown=true;
  cv.setPointerCapture?.(event.pointerId);
  setDestination(pointFromEvent(event),true);
},{passive:false});
cv.addEventListener('pointermove',event=>{
  if(phase!=='run'||!pointerDown)return;
  event.preventDefault();
  setDestination(pointFromEvent(event),false);
},{passive:false});
cv.addEventListener('pointerup',()=>{pointerDown=false});
cv.addEventListener('pointercancel',()=>{pointerDown=false});
window.addEventListener('keydown',event=>{
  const key=event.key.toLowerCase();
  if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(key)){
    keys.add(key);
    if(phase==='run')event.preventDefault();
  }
});
window.addEventListener('keyup',event=>keys.delete(event.key.toLowerCase()));
window.addEventListener('blur',()=>keys.clear());
window.addEventListener('resize',()=>{
  const compact=!!window.matchMedia?.('(max-width:920px)').matches;
  UI.controls.classList.toggle('open',compact?mobileMenuOpen:true);
  if(!compact||mobileMenuOpen){treeCamera.ready=false;requestAnimationFrame(resetTreeView)}
});

UI.treeZoomOut.onclick=()=>zoomTreeCenter(1/1.2);
UI.treeZoomIn.onclick=()=>zoomTreeCenter(1.2);
UI.treeReset.onclick=resetTreeView;
UI.treeViewport.addEventListener('wheel',event=>{
  event.preventDefault();
  zoomTreeAt(event.clientX,event.clientY,event.deltaY<0?1.12:1/1.12);
},{passive:false});
UI.treeViewport.addEventListener('dblclick',event=>{
  event.preventDefault();
  event.stopPropagation();
  zoomTreeAt(event.clientX,event.clientY,1.3);
},{passive:false});
UI.treeViewport.addEventListener('pointerdown',event=>{
  if(event.pointerType==='mouse'&&event.button!==0)return;
  if(event.target.closest?.('.tree-camera'))return;
  treeCamera.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
  treeCamera.gesture=treeGesture();
  treeCamera.dragged=false;
  UI.treeViewport.classList.add('dragging');
},{passive:false});
UI.treeViewport.addEventListener('pointermove',event=>{
  if(!treeCamera.pointers.has(event.pointerId))return;
  event.preventDefault();
  const previous=treeCamera.gesture;
  treeCamera.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
  const next=treeGesture();
  if(previous&&next){
    const dx=next.center.x-previous.center.x;
    const dy=next.center.y-previous.center.y;
    if(Math.hypot(dx,dy)>1){
      treeCamera.dragged=true;
      UI.treeViewport.setPointerCapture?.(event.pointerId);
    }
    if(previous.count>1&&next.count>1&&previous.distance>0){
      const bounds=UI.treeViewport.getBoundingClientRect();
      const oldScale=treeCamera.scale;
      const newScale=clamp(oldScale*next.distance/previous.distance,TREE_SCALE_MIN,TREE_SCALE_MAX);
      const oldX=previous.center.x-bounds.left;
      const oldY=previous.center.y-bounds.top;
      const newX=next.center.x-bounds.left;
      const newY=next.center.y-bounds.top;
      const contentX=(oldX-treeCamera.x)/oldScale;
      const contentY=(oldY-treeCamera.y)/oldScale;
      treeCamera.x=newX-contentX*newScale;
      treeCamera.y=newY-contentY*newScale;
      treeCamera.scale=newScale;
      if(Math.abs(next.distance-previous.distance)>1)treeCamera.dragged=true;
    }else{
      treeCamera.x+=dx;
      treeCamera.y+=dy;
    }
    treeCamera.ready=true;
    applyTreeCamera();
  }
  treeCamera.gesture=next;
},{passive:false});
const endTreePointer=event=>{
  if(!treeCamera.pointers.has(event.pointerId))return;
  treeCamera.pointers.delete(event.pointerId);
  treeCamera.gesture=treeGesture();
  if(treeCamera.dragged){
    treeCamera.suppressClick=true;
    requestAnimationFrame(()=>{treeCamera.suppressClick=false});
  }
  if(!treeCamera.pointers.size)UI.treeViewport.classList.remove('dragging');
};
UI.treeViewport.addEventListener('pointerup',endTreePointer);
UI.treeViewport.addEventListener('pointercancel',endTreePointer);
UI.treeViewport.addEventListener('click',event=>{
  if(!treeCamera.suppressClick)return;
  event.preventDefault();
  event.stopPropagation();
},{capture:true});

// iOS Safari can interpret rapid game taps as a page-zoom gesture even when
// the viewport is locked. Keep every tap available to pointer controls while
// cancelling only the browser's follow-up zoom gesture.
let lastTouchEnd=0;
document.addEventListener('dblclick',event=>event.preventDefault(),{passive:false});
document.addEventListener('touchend',event=>{
  if(!event.target.closest?.('.shell'))return;
  const now=Date.now();
  if(now-lastTouchEnd<350)event.preventDefault();
  lastTouchEnd=now;
},{passive:false});
document.addEventListener('gesturestart',event=>event.preventDefault(),{passive:false});

function frameSnapshot(){
  return {
    M:{...M,realm:{...M.realm},cult:{...M.cult}},
    phase,
    elapsed,
    run:run?{...run}:null,
    P:{...P},
    enemies:enemies.map(enemy=>({id:enemy.id,type:enemy.type,x:enemy.x,y:enemy.y,hp:enemy.hp,max:enemy.max,rare:enemy.rare,rareTrait:enemy.rareTrait,treasure:enemy.treasure,carryCount:enemy.carry?.length||0,bond:enemy.bond||0,captureRange:enemy.type==='spirit'?40:0,visualOwner:enemy.visualOwner||'',action:enemy.action||'idle',facing:enemy.facing||1,shield:enemy.shield||0,shieldMax:enemy.shieldMax||0,commandedUntil:enemy.commandedUntil||0,boss:enemy.boss||0,name:enemy.name||'',...(foundationContent()?.snapshotEnemy?.(enemy)||{})})),
    objects:objects.map(object=>({type:object.type,x:object.x,y:object.y,value:object.value,grade:object.grade})),
    vein:vein?{...vein}:null,
    hazards:hazards.map(hazard=>({...hazard}))
  };
}

window.__xianxiaDebug={
  version:VERSION,
  constants:{W,H,EXIT,EXIT_APPROACH,RUN_TIME,AREAS,TREE,SKILLS,PLANS},
  frameSnapshot,
  snapshot:()=>JSON.parse(JSON.stringify(frameSnapshot())),
  replaceState:value=>{
    M={...fresh(),...value};
    M=loadNormalized(M);
    render();draw();
  },
  selectArea:id=>{
    if(AREAS.some(area=>area.id===id)){M.area=id;M.unlocked[id]=1;ensurePlan();render();draw()}
  },
  selectPlan:id=>{
    if(PLANS.some(plan=>plan.id===id)){M.settings.plan=id;ensurePlan();render()}
  },
  moveTo:(x,y)=>setDestination({x:clamp(x,11,W-11),y:clamp(y,11,H-11)},false),
  begin,
  tick:seconds=>update(seconds),
  finish,
  objectiveData,
  setMenuOpen,
  foundationApi,
  registerTriggerHandler,
  emitTrigger,
  childTriggerMeta,
  triggerSnapshot:()=>run?.triggers?JSON.parse(JSON.stringify(run.triggers)):null
};

function loadNormalized(value){
  const base=fresh();
  const state={
    ...base,...value,
    realm:{...base.realm,...value.realm},
    cult:{...base.cult,...value.cult},
    unlocked:{...base.unlocked,...value.unlocked},
    events:{...base.events,...value.events},
    settings:{...base.settings,...value.settings},
    stats:{...base.stats,...value.stats}
  };
  state.skills=skillBlank();
  for(const id of Object.keys(state.skills))state.skills[id]={...state.skills[id],...(value.skills?.[id]||{})};
  for(const area of AREAS)state.zones[area.id]={...zoneBlank(),...(value.zones?.[area.id]||{}),tree:{...(value.zones?.[area.id]?.tree||{})}};
  if(state.realm.major>=0&&!Object.values(state.skills).some(skill=>skill.u))state.skills.sword.u=1;
  return state;
}

render();
syncHud();
draw();
const frameHub=window.__xianxiaFrameHub;
if(frameHub?.subscribe){
  frameHub.subscribe('game-simulation',frameStep,-100);
  frameHub.wake?.();
}else{
  console.error('[xianxia] shared frame hub missing; simulation not started');
}
})();

//# sourceURL=game_runtime_v11_45.js
