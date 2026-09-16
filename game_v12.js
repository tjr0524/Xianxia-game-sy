(()=>{
'use strict';

const $=selector=>document.querySelector(selector);
const cv=$('#cv');
const g=cv.getContext('2d');
const W=700;
const H=460;
const EXIT={x:350,y:438,r:27};
const RUN_TIME=25;
const MAJORS=['연기','축기','결단','원영'];
const HN=['하급','중급','상급'];
const VERSION='12';

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
  {
    id:'qingyun',name:'청운산 후산',desc:'요수만 존재하는 초입 비경.',
    enemy:1,reward:1,herbs:10,env:{move:1,pick:1},baseStage:1,rec:'범인~연기 3층',
    req:{major:0,stage:1,prev:null,nodes:0},palette:['#172e31','#244d48','#6b8f72']
  },
  {
    id:'blackwind',name:'흑풍곡',desc:'산수와 탐보서가 전리품을 노리는 거친 골짜기.',
    enemy:2.05,reward:2.8,herbs:13,env:{move:.72,pick:.62},baseStage:3,rec:'연기 3~6층',
    req:{major:0,stage:3,prev:'qingyun',nodes:2},palette:['#191f22','#34342a','#6d6042']
  },
  {
    id:'blood',name:'적혈비경',desc:'영맥과 정예 수호수가 버티는 고위 비경.',
    enemy:3.9,reward:6.4,herbs:16,env:{move:.55,pick:.42},baseStage:6,rec:'연기 6~9층',
    req:{major:0,stage:6,prev:'blackwind',nodes:3},palette:['#291719','#532127','#8c493b']
  },
  {
    id:'thunder',name:'천뢰봉',desc:'낙뢰를 피하며 뇌정을 회수하는 축기 비경.',
    enemy:6.5,reward:12.5,herbs:18,env:{move:.48,pick:.38},baseStage:1,rec:'축기 1층 이상',
    req:{major:1,stage:1,prev:'blood',nodes:4},palette:['#11182b','#24284b','#555c91']
  }
];

const TREE={
  eco:[
    {id:'eco1',n:'요수 흔적',d:'요수 총량과 영석 보상 증가',tier:1,c:{s:18,h:0}},
    {id:'eco2',n:'요수 군락',d:'요수가 무리로 배치될 확률 증가',tier:2,p:'eco1',c:{s:45,h:2}},
    {id:'eco3',n:'희귀 요수',d:'강한 변이 개체와 고보상 등장',tier:3,p:'eco2',c:{s:110,h:4}}
  ],
  fate:[
    {id:'fate1',n:'산수의 소문',d:'산수·탐보서가 비경에 유입',tier:1,c:{s:40,h:2}},
    {id:'fate2',n:'보물 쟁탈',d:'산수가 실물 비보를 지닐 확률과 보상 증가',tier:2,p:'fate1',c:{s:95,h:4}},
    {id:'fate3',n:'영수의 흔적',d:'붙잡으면 영초를 주는 영수가 등장',tier:3,p:'fate2',c:{s:180,h:6}}
  ],
  res:[
    {id:'res1',n:'영맥 감응',d:'영맥 위치가 드러나고 영석 채굴 가능',tier:1,c:{s:90,h:3}},
    {id:'res2',n:'수호 영맥',d:'정예 수호수와 풍부한 영맥 등장',tier:2,p:'res1',c:{s:190,h:6}},
    {id:'res3',n:'대형 영맥',d:'영맥·정예 강화와 대량 보상',tier:3,p:'res2',c:{s:420,h:9}}
  ],
  storm:[
    {id:'storm1',n:'뢰흔 개방',d:'낙뢰가 잦아지고 회피 보상이 증가',tier:1,c:{s:650,h:5}},
    {id:'storm2',n:'천뢰 예지',d:'낙뢰 예고가 길어지고 피격 피해 감소',tier:2,p:'storm1',c:{s:1300,h:8}},
    {id:'storm3',n:'뇌정 응축',d:'낙뢰 회피 시 상급 영초 획득 가능',tier:3,p:'storm2',c:{s:2600,h:12}}
  ]
};

const NODES=Object.values(TREE).flat();
const SKILLS=[
  {id:'sword',n:'어검술',req:{major:0,stage:1},grade:0,unlock:{s:18,h:2},cd:4.8,desc:'가장 가까운 적 하나를 강하게 참격'},
  {id:'wave',n:'검풍',req:{major:0,stage:3},grade:0,unlock:{s:70,h:5},cd:5.4,desc:'넓은 범위의 적을 동시에 타격'},
  {id:'chain',n:'연환비검',req:{major:0,stage:5},grade:1,unlock:{s:180,h:4},cd:6.1,desc:'여러 적 사이를 비검이 연속 도약'},
  {id:'thunder',n:'낙뢰부',req:{major:0,stage:7},grade:2,unlock:{s:420,h:5},cd:7.2,desc:'가장 밀집된 적 무리에 낙뢰 폭발'},
  {id:'array',n:'만검진',req:{major:1,stage:1},grade:2,unlock:{s:1200,h:10},cd:9,desc:'넓은 전장을 검진이 휩씀'}
];

const PLANS=[
  {id:'harvest',icon:'🌿',name:'채집 수행',desc:'영초 +35% · 요수 수 -20%',enemyCount:.8,herbCount:1.35,enemyHp:1,reward:.92,dynamic:.8,vein:1},
  {id:'hunt',icon:'⚔',name:'토벌 수행',desc:'요수 수 +30% · 적 체력 +8% · 영석 +25%',enemyCount:1.3,herbCount:.9,enemyHp:1.08,reward:1.25,dynamic:1.05,vein:1},
  {id:'venture',icon:'✦',name:'기연 수행',desc:'비경 고유 사건 +45% · 영석 +8%',enemyCount:1,herbCount:1,reward:1.08,enemyHp:1,dynamic:1.45,vein:1.35}
];

const KEY='xianxia_proto_v12';
const OLD=['xianxia_proto_v11','xianxia_proto_v10','xianxia_proto_v9','xianxia_proto_v8','xianxia_proto_v7','xianxia_proto_v6','xianxia_proto_v5','xianxia_proto_v4'];
const zoneBlank=()=>({tree:{},runs:0,safe:0,eliteWins:0,bestStone:0,bestHerb:0,bestKills:0});
const skillBlank=()=>Object.fromEntries(SKILLS.map(skill=>[skill.id,{u:0,pow:0,range:0,cycle:0}]));
const fresh=()=>({
  stone:0,herb:0,herb2:0,herb3:0,
  realm:{major:-1,stage:0},
  cult:{atk:1,mov:1,sen:1,hp:1},
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
  if(!['train','areas'].includes(state.settings.tab))state.settings.tab='train';
  return state;
}

function save(){
  try{localStorage.setItem(KEY,JSON.stringify(M))}catch(error){console.warn('save failed',error)}
}

const A=()=>AREAS.find(area=>area.id===M.area)||AREAS[0];
const Z=(id=M.area)=>M.zones[id];
const currentPlan=()=>PLANS.find(plan=>plan.id===M.settings.plan)||PLANS[0];
const areaIndex=(id=M.area)=>Math.max(0,AREAS.findIndex(area=>area.id===id));
const isMortal=()=>M.realm.major<0;
const realmName=()=>isMortal()?'범인':`${MAJORS[M.realm.major]||'상위경지'} ${M.realm.stage}층`;
const realmPower=()=>isMortal()?.42:1+M.realm.major*1.18+(M.realm.stage-1)*.11;
const combatPower=()=>realmPower()*(1+(run?.combo||0)*.045);
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
  return ['eco','fate','res','storm'];
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
function areaUnlockCost(area){
  const i=Math.max(0,AREAS.findIndex(a=>a.id===area.id));
  return i===0?{s:0,h:0,hg:0}:i===1?{s:90,h:6,hg:0}:i===2?{s:420,h:7,hg:1}:{s:1800,h:9,hg:2};
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
  const q=areaUnlockCost(area);
  return `개방 가능 · 영석 ${q.s}${q.h?` · ${HN[q.hg]} 영초 ${q.h}`:''}`;
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
  const major=M.realm.major;
  const stage=M.realm.stage;
  if(stage<9){
    return {
      s:Math.ceil(120*(1+major*5)*1.62**(stage-1)),
      h:Math.ceil(16*(1+major*1.4)*1.27**(stage-1)),
      hg:Math.min(2,Math.floor((stage-1)/3))
    };
  }
  return {s:Math.ceil(4800*(1+major*3.5)),h:Math.ceil(75*(1+major*1.8)),hg:2,major:1};
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
    return {label:'영초 채집',value:totalHerbs(run),target:5+index*2,reward:`${HN[Math.min(2,index)]} 영초 +${2+index}`};
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
      if(!unlocked){
        const q=areaUnlockCost(area);
        if(M.stone<q.s||herbHave(q.hg)<q.h){UI.notice.textContent='비경 개방 재료가 부족합니다.';return}
        M.stone-=q.s;if(q.h)herbSpend(q.hg,q.h);M.unlocked[area.id]=1;
      }
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
    UI.notice.textContent='적혈비경에서 축기의 실마리를 얻어야 합니다.';
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
  }
  else if(M.realm.stage<9)M.realm.stage++;
  else M.realm={major:M.realm.major+1,stage:1};
  if(price.init)UI.notice.textContent=`수선 입문 성공 — ${realmName()}. 수련 트리에서 검결과 법술을 직접 개척할 수 있습니다.`;
  else if(isMortal()===false&&M.settings.plan==='harvest')UI.notice.textContent=`돌파 성공 — ${realmName()}. 이제 토벌과 기연 수행도 선택할 수 있습니다.`;
  else UI.notice.textContent=`돌파 성공 — ${realmName()}`;
  render();
  draw();
}

function randomPoint(margin=34){
  return {x:margin+Math.random()*(W-margin*2),y:margin+Math.random()*(H-margin*2-18)};
}
function edgePoint(){
  const edge=Math.floor(Math.random()*3);
  const margin=22;
  if(edge===0)return {x:margin,y:58+Math.random()*342};
  if(edge===1)return {x:W-margin,y:58+Math.random()*342};
  return {x:42+Math.random()*616,y:margin};
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
    grade=index===0?0:index===1?(Math.random()<.78?1:0):(Math.random()<.72?2:1);
  }
  objects.push({type,x,y,r:type==='h'?8:7,value,grade,pulse:Math.random()*6.28});
}
function randomHerb(){const point=randomPoint();drop('h',point.x,point.y,1)}

function actor(type,options={}){
  const point=options.p||edgePoint();
  const plan=currentPlan();
  const base=type==='elite'?300:type==='spirit'?1:type==='rogue'?55:type==='rat'?30:type==='chaser'?50:58;
  const hp=base*A().enemy*plan.enemyHp;
  const enemy={
    type,x:point.x,y:point.y,
    r:type==='elite'?23:type==='spirit'?10:type==='rat'?9:12,
    hp,max:hp,cd:0,aggressive:0,
    homeX:options.homeX??point.x,homeY:options.homeY??point.y,
    vx:(Math.random()-.5)*45,vy:(Math.random()-.5)*45,
    escape:0,bond:0,rare:0,treasure:0,carry:[],stealCd:0
  };
  enemy.speed=type==='chaser'?64:type==='guard'?29:type==='elite'?21:type==='rogue'?58:type==='rat'?78:58;
  if((type==='guard'||type==='chaser')&&rank('eco3')&&Math.random()<.04+rank('eco3')*.055){
    enemy.rare=1;
    enemy.hp*=1.5+rank('eco3')*.1;
    enemy.max=enemy.hp;
    enemy.speed*=1.08;
  }
  if(type==='rogue')enemy.treasure=Math.random()<.28+rank('fate2')*.12;
  enemies.push(enemy);
  return enemy;
}

function spawnBeast(){
  const type=Math.random()<.62?'guard':'chaser';
  let point=null;
  if(rank('eco2')&&Math.random()<.1+rank('eco2')*.11){
    const pool=enemies.filter(enemy=>enemy.type==='guard'||enemy.type==='chaser');
    if(pool.length){
      const anchor=pool[Math.floor(Math.random()*pool.length)];
      const angle=Math.random()*6.28;
      const radius=28+Math.random()*45;
      point={x:clamp(anchor.x+Math.cos(angle)*radius,24,676),y:clamp(anchor.y+Math.sin(angle)*radius,24,420)};
    }
  }
  return actor(type,point?{p:point,homeX:point.x,homeY:point.y}:{});
}

function setupVein(){
  if(!branches().includes('res')||rank('res1')<=0)return;
  const point={x:150+Math.random()*400,y:105+Math.random()*210};
  vein={
    x:point.x,y:point.y,r:21,
    stock:Math.round((18+rank('res1')*7+rank('res3')*10)*currentPlan().vein),
    progress:0,cleared:0
  };
  if(rank('res2')>0){
    const angle=Math.random()*6.28;
    const guardPoint={x:point.x+Math.cos(angle)*72,y:point.y+Math.sin(angle)*72};
    const elite=actor('elite',{p:guardPoint,homeX:guardPoint.x,homeY:guardPoint.y});
    elite.mineGuard=1;
  }
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
  const herbInitial=Math.ceil(herbTotal*.78);
  const baseBeasts=(isMortal()?3:4)+rank('eco1')+rank('eco2');
  const beastTotal=Math.max(1,Math.round(baseBeasts*plan.enemyCount));
  const beastInitial=Math.max(1,Math.round(beastTotal*.76));
  run={
    s:0,h0:0,h1:0,h2:0,left:0,minHp:1,kills:0,beastKills:0,elite:0,
    thieves:0,treasures:0,mined:0,dodges:0,combo:0,comboTime:0,bestCombo:0,
    herbLeft:herbTotal-herbInitial,beastLeft:beastTotal-beastInitial,
    herbTimer:8+Math.random()*3,beastTimer:9+Math.random()*3,rogueTimer:5,
    lightningTimer:M.area==='thunder'?2.2:999,
    skillCooldowns:Object.fromEntries(SKILLS.map(skill=>[skill.id,0]))
  };
  P.x=P.tx=EXIT.x;
  P.y=P.ty=EXIT.y;
  P.target=null;
  P.max=isMortal()?36:Math.floor((90+(M.cult.hp-1)*38)*realmPower());
  P.hp=P.max;
  P.cd=0;
  run.minHp=P.max;
  for(let i=0;i<herbInitial;i++)randomHerb();
  for(let i=0;i<beastInitial;i++)spawnBeast();
  if(branches().includes('fate')&&rank('fate3')){
    for(let i=0;i<1+Math.floor((rank('fate3')-1)/2);i++)actor('spirit');
  }
  setupVein();
  UI.ov.classList.add('hide');
  if(window.matchMedia?.('(max-width:920px)').matches){
    mobileMenuOpen=false;
    UI.controls.classList.remove('open');
  }
  UI.ret.disabled=false;
  UI.notice.textContent=`${planCopy(plan)[0]} 시작. 배치를 읽고 목표와 귀환 동선을 함께 잡으세요.`;
  syncHud();
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
  if(enemy.type==='guard'||enemy.type==='chaser'){
    const base=enemy.type==='guard'?16:14;
    gainStone(Math.ceil(base*A().reward*plan.reward*(1+rank('eco1')*.03)*(enemy.rare?2.2:1)),enemy.x,enemy.y);
  }else if(enemy.type==='elite'){
    run.elite=1;
    gainStone(Math.ceil((42+rank('res3')*7)*A().reward*plan.reward),enemy.x,enemy.y);
    gainHerb(3+rank('res3'),2,enemy.x+10,enemy.y);
    if(vein){vein.cleared=1;vein.stock+=20+rank('res3')*5}
  }else if(enemy.type==='rogue'||enemy.type==='rat'){
    run.thieves++;
    spillCarry(enemy);
    gainStone(Math.ceil((enemy.type==='rogue'?8:3)*A().reward*plan.reward),enemy.x,enemy.y);
    if(enemy.type==='rogue'&&enemy.treasure){
      const bonus=Math.ceil((12+rank('fate2')*7)*A().reward*plan.reward);
      gainStone(bonus,enemy.x+8,enemy.y-5);
      gainHerb(1+Math.floor(rank('fate2')/3),Math.min(2,areaIndex()),enemy.x-8,enemy.y);
      run.treasures++;
      pop(enemy.x,enemy.y-20,'✦ 비보 확보','#ffe28a',1.25);
    }
  }
  registerKill(enemy);
}

function cast(skill){
  const state=skillState(skill.id);
  if(!state.u)return false;
  const attack=M.cult.atk-1;
  if(skill.id==='sword'){
    const range=150+state.range*24;
    let target=null;
    let nearest=Infinity;
    for(const enemy of enemies){
      if(enemy.type==='spirit')continue;
      const d=distance(P,enemy);
      if(d<range&&d<nearest){nearest=d;target=enemy}
    }
    if(!target)return false;
    const damage=(20+attack*9)*(1+state.pow*.25)*combatPower();
    target.hp-=damage;
    slash(P.x,P.y,target.x,target.y,'#eef6ff');
    pop(target.x,target.y,`어검 ${Math.round(damage)}`,'#f4f6ff');
    return true;
  }
  if(skill.id==='wave'){
    const range=180+state.range*30;
    const damage=(16+attack*8)*(1+state.pow*.23)*combatPower();
    let hits=0;
    for(const enemy of enemies){
      if(enemy.type==='spirit'||distance(P,enemy)>=range)continue;
      enemy.hp-=damage;
      hits++;
    }
    if(!hits)return false;
    pop(P.x,P.y,`검풍 ×${hits}`,'#9fdfff');
    ring(P.x,P.y,range,'#9fdfff');
    return true;
  }
  if(skill.id==='chain'){
    const range=220+state.range*24;
    const targets=enemies.filter(enemy=>enemy.type!=='spirit'&&distance(P,enemy)<range).sort((a,b)=>distance(P,a)-distance(P,b));
    const count=Math.min(targets.length,3+state.range);
    if(!count)return false;
    const damage=(15+attack*7)*(1+state.pow*.22)*combatPower();
    let from=P;
    for(let i=0;i<count;i++){
      targets[i].hp-=damage*.9**i;
      slash(from.x,from.y,targets[i].x,targets[i].y,'#c6d6ff');
      pop(targets[i].x,targets[i].y,'비검','#c6d6ff',.5);
      from=targets[i];
    }
    return true;
  }
  if(skill.id==='thunder'){
    const targets=enemies.filter(enemy=>enemy.type!=='spirit'&&distance(P,enemy)<310+state.range*25);
    if(!targets.length)return false;
    let target=targets[0];
    let best=-1;
    for(const enemy of targets){
      const crowd=targets.filter(other=>distance(enemy,other)<80+state.range*15).length;
      if(crowd>best){best=crowd;target=enemy}
    }
    const damage=(28+attack*9)*(1+state.pow*.26)*combatPower();
    const radius=75+state.range*15;
    let hits=0;
    for(const enemy of enemies){
      if(enemy.type!=='spirit'&&distance(target,enemy)<radius){enemy.hp-=damage;hits++}
    }
    pop(target.x,target.y,`낙뢰 ×${hits}`,'#d7c8ff');
    ring(target.x,target.y,radius,'#d7c8ff',.4);
    return true;
  }
  if(skill.id==='array'){
    const range=290+state.range*35;
    const damage=(20+attack*8)*(1+state.pow*.24)*combatPower();
    let hits=0;
    for(const enemy of enemies){
      if(enemy.type!=='spirit'&&distance(P,enemy)<range){enemy.hp-=damage;hits++}
    }
    if(!hits)return false;
    pop(P.x,P.y,`만검진 ×${hits}`,'#ffe9a8');
    ring(P.x,P.y,range,'#ffe9a8',.5);
    return true;
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
    x:clamp(P.x+(Math.random()-.5)*70,45,655),
    y:clamp(P.y+(Math.random()-.5)*70,45,405),
    r:36+foresight*2,
    t:.82+foresight*.075,
    ttl:.82+foresight*.075,
    struck:0,
    reward:4+level*2
  });
}

function updateHazards(dt){
  if(M.area!=='thunder')return;
  run.lightningTimer-=dt;
  if(run.lightningTimer<=0){
    spawnLightning();
    run.lightningTimer=Math.max(2.6,4.9-rank('storm1')*.32);
  }
  for(const hazard of hazards){
    hazard.t-=dt;
    if(hazard.t<=0&&!hazard.struck){
      hazard.struck=1;
      hazard.t=.28;
      hazard.ttl=.28;
      if(distance(P,hazard)<hazard.r){
        const reduction=1-rank('storm2')*.07;
        const damage=Math.ceil((16+A().enemy*2.2)*reduction);
        P.hp-=damage;
        run.minHp=Math.min(run.minHp,P.hp);
        pop(P.x,P.y,`천뢰 -${damage}`,'#ff9fa0',1);
      }else{
        run.dodges++;
        drop('s',hazard.x,hazard.y,hazard.reward);
        if(rank('storm3')&&Math.random()<.08+rank('storm3')*.07)drop('h',hazard.x+12,hazard.y,1,2);
        pop(hazard.x,hazard.y,'회피 · 뇌정 응축','#bfc5ff',.9);
      }
      ring(hazard.x,hazard.y,hazard.r,'#d6d5ff',.3);
    }
  }
  hazards=hazards.filter(hazard=>hazard.t>0);
}

function update(dt){
  if(phase!=='run')return;
  elapsed+=dt;
  if(elapsed>=RUN_TIME){finish('collapse');return}

  P.cd=Math.max(0,P.cd-dt);
  if(run.combo>0){
    run.comboTime-=dt;
    if(run.comboTime<=0){run.combo=0;run.comboTime=0}
  }
  for(const id of Object.keys(run.skillCooldowns)){
    run.skillCooldowns[id]=Math.max(0,run.skillCooldowns[id]-dt);
  }

  const activeTargets=[...enemies,...objects,...(vein?[vein]:[])];
  if(P.target&&!activeTargets.includes(P.target))P.target=null;
  if(P.target){P.tx=P.target.x;P.ty=P.target.y}

  const speed=(isMortal()?122:110+(M.cult.mov-1)*35)*Math.pow(Math.max(.7,realmPower()),.16)*A().env.move*(1+run.combo*.015);
  const horizontal=(keys.has('arrowright')||keys.has('d')?1:0)-(keys.has('arrowleft')||keys.has('a')?1:0);
  const vertical=(keys.has('arrowdown')||keys.has('s')?1:0)-(keys.has('arrowup')||keys.has('w')?1:0);
  if(horizontal||vertical){
    P.target=null;
    const norm=Math.hypot(horizontal,vertical)||1;
    P.x+=horizontal/norm*speed*dt;
    P.y+=vertical/norm*speed*dt;
    P.tx=P.x;P.ty=P.y;
  }else{
    moveToward(P,P.tx,P.ty,speed,dt);
  }
  P.x=clamp(P.x,11,689);
  P.y=clamp(P.y,11,449);

  if(distance(P,EXIT)>68)run.left=1;
  if(run.left&&distance(P,EXIT)<EXIT.r){finish('return');return}

  run.herbTimer-=dt;
  if(run.herbLeft>0&&run.herbTimer<=0){
    randomHerb();
    run.herbLeft--;
    run.herbTimer=9+Math.random()*4;
  }
  run.beastTimer-=dt;
  if(run.beastLeft>0&&run.beastTimer<=0){
    spawnBeast();
    run.beastLeft--;
    run.beastTimer=10+Math.random()*4;
  }

  if(branches().includes('fate')&&rank('fate1')>0){
    run.rogueTimer-=dt;
    if(run.rogueTimer<=0){
      actor(Math.random()<.65?'rogue':'rat');
      run.rogueTimer=Math.max(3.2,(8-rank('fate1')*.6)/currentPlan().dynamic);
    }
  }

  const pickupRange=(22+(M.cult.sen-1)*17)*A().env.pick;
  objects=objects.filter(object=>{
    if(distance(P,object)<pickupRange+object.r){
      if(object.type==='h')gainHerb(object.value,object.grade,object.x,object.y);
      else gainStone(object.value,object.x,object.y);
      return false;
    }
    return true;
  });

  if(vein&&vein.stock>0&&distance(P,vein)<vein.r+P.r+7){
    vein.progress+=dt*(vein.cleared?3:1)*currentPlan().vein;
    if(vein.progress>.75){
      vein.progress=0;
      const amount=Math.min(vein.stock,vein.cleared?5:2);
      vein.stock-=amount;
      const mined=Math.max(1,Math.floor(amount*A().reward));
      run.mined+=amount;
      gainStone(mined,vein.x,vein.y);
    }
  }

  for(const enemy of enemies){
    enemy.cd=Math.max(0,enemy.cd-dt);
    if(enemy.type==='spirit'){
      const d=distance(enemy,P);
      if(d<40){
        enemy.bond+=dt;
        if(enemy.bond>1.3){
          gainHerb(1+Math.floor(Math.random()*2),Math.min(2,areaIndex()),enemy.x,enemy.y);
          enemy.hp=0;
        }
      }else enemy.bond=Math.max(0,enemy.bond-dt*.3);
      if(d<120){
        const dx=enemy.x-P.x;
        const dy=enemy.y-P.y;
        const norm=Math.hypot(dx,dy)||1;
        enemy.vx=dx/norm*enemy.speed;
        enemy.vy=dy/norm*enemy.speed;
      }
      enemy.x=clamp(enemy.x+enemy.vx*dt,18,682);
      enemy.y=clamp(enemy.y+enemy.vy*dt,18,420);
      continue;
    }

    if(enemy.type==='rogue'||enemy.type==='rat'){
      enemy.stealCd=Math.max(0,enemy.stealCd-dt);
      let target=null;
      let nearest=Infinity;
      if(!enemy.escape){
        for(const object of objects){
          const d=distance(enemy,object);
          if(d<nearest){nearest=d;target=object}
        }
      }
      if(target){
        moveToward(enemy,target.x,target.y,enemy.speed,dt);
        if(nearest<enemy.r+target.r+4&&enemy.stealCd<=0){
          const index=objects.indexOf(target);
          if(index>=0){
            objects.splice(index,1);
            enemy.carry.push({type:target.type,value:target.value,grade:target.grade});
            enemy.stealCd=.35;
            pop(enemy.x,enemy.y,enemy.type==='rat'?'탐보서가 훔침':'산수가 훔침',enemy.type==='rat'?'#f2d86e':'#d4a9ff',.7);
            if(enemy.type==='rat'||enemy.carry.length>=2)enemy.escape=1;
          }
        }
      }else if(enemy.carry.length)enemy.escape=1;
      if(elapsed>20)enemy.escape=1;
      if(enemy.escape)moveToward(enemy,enemy.x<350?-30:730,enemy.y,enemy.speed*1.2,dt);
      continue;
    }

    const d=distance(enemy,P);
    const home=Math.hypot(enemy.x-enemy.homeX,enemy.y-enemy.homeY);
    const aggroRadius=enemy.type==='elite'?80:92;
    if(enemy.type==='chaser'){
      if(d<190)enemy.aggressive=1;
      if(d>250)enemy.aggressive=0;
    }else{
      if(d<aggroRadius)enemy.aggressive=1;
      if(home>170&&d>aggroRadius)enemy.aggressive=0;
    }
    if(enemy.aggressive)moveToward(enemy,P.x,P.y,enemy.speed*(elapsed>15?1.15:1),dt);
    else if(home>5)moveToward(enemy,enemy.homeX,enemy.homeY,enemy.speed*.55,dt);
    if(d<P.r+enemy.r+2&&enemy.cd<=0){
      const damage=isMortal()
        ?Math.ceil((enemy.type==='chaser'?8:7)*A().enemy)
        :Math.ceil((enemy.type==='elite'?24:enemy.type==='chaser'?11:10)*A().enemy);
      P.hp-=damage;
      run.minHp=Math.min(run.minHp,P.hp);
      enemy.cd=.62;
      ring(P.x,P.y,P.r+7,'#f47b6f',.16);
    }
  }

  enemies=enemies.filter(enemy=>{
    if((enemy.type==='rogue'||enemy.type==='rat')&&(enemy.x<-10||enemy.x>710))return false;
    if(enemy.hp<=0){
      if(enemy.type!=='spirit')reward(enemy);
      return false;
    }
    return true;
  });

  if(!isMortal()){
    let target=null;
    let nearest=Infinity;
    for(const enemy of enemies){
      if(enemy.type==='spirit')continue;
      const d=distance(P,enemy);
      if(d<nearest){nearest=d;target=enemy}
    }
    if(target&&nearest<92&&P.cd<=0){
      const damage=(3.6+(M.cult.atk-1)*4.4)*combatPower();
      target.hp-=damage;
      P.cd=Math.max(.2,.55-(M.cult.atk-1)*.02);
      slash(P.x,P.y,target.x,target.y,'#f7e5ad');
    }
  }

  for(const skill of SKILLS){
    const state=skillState(skill.id);
    if(!state.u)continue;
    if(run.skillCooldowns[skill.id]<=0&&cast(skill)){
      run.skillCooldowns[skill.id]=Math.max(.8,skill.cd*(1-state.cycle*.1));
    }
  }

  updateHazards(dt);
  if(P.hp<=0){
    P.hp=0;
    finish('dead');
    return;
  }
  syncHud();
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
  if(safe&&M.area==='blood'&&run.elite&&M.realm.major===0&&M.realm.stage===9&&!M.events.foundationInsight){
    M.events.foundationInsight=1;
    event='<div class="event"><b>기연 · 축기의 실마리</b><br>적혈 영맥의 기운을 품고 무사 귀환했습니다.</div>';
  }
  event+=fortune(reason);

  let objective='';
  if(safe&&objectiveMet()){
    const rewardText=objectiveReward();
    objective=`<div class="event"><b>수행 완수 · ${objectiveData().label}</b><br>${rewardText}</div>`;
  }

  UI.ov.classList.remove('hide');
  UI.ret.disabled=true;
  UI.ot.textContent=safe?'무사 귀환':reason==='dead'?'육신 중상':'비경 붕괴';
  UI.ox.innerHTML=`${safe?'전리품 전량 확보':'전리품 40% 회수'}<br><b>영석 ${stone} · 영초 下${h0} 中${h1} 上${h2}</b>${objective}${event}`;
  render();
  draw();
}

function syncHud(){
  UI.hp.textContent=`${Math.ceil(P.hp)} / ${P.max}`;
  UI.hpFill.style.width=`${Math.max(0,P.hp/P.max)*100}%`;
  UI.loot.textContent=`영석 ${run?.s||0} · 영초 ${totalHerbs(run)}`;
  const remaining=Math.max(0,RUN_TIME-elapsed);
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
  if(!vein)return;
  g.save();g.translate(vein.x,vein.y);
  g.shadowColor='#8ab6ff';g.shadowBlur=18;
  const color=vein.cleared?'#8bd9d0':'#718ec8';
  g.fillStyle=color;g.strokeStyle='#d9e8ff';g.lineWidth=1;
  for(const [x,y,s] of [[-11,4,12],[2,-4,17],[13,5,10]]){
    g.beginPath();g.moveTo(x,y-s);g.lineTo(x+s*.45,y);g.lineTo(x,y+s*.55);g.lineTo(x-s*.45,y);g.closePath();g.fill();g.stroke();
  }
  g.shadowBlur=0;g.fillStyle='#e7f0ff';g.font='10px sans-serif';g.textAlign='center';
  g.fillText(`영맥 ${vein.stock}`,0,38);
  g.restore();
}

function drawEnemy(enemy){
  g.save();g.translate(enemy.x,enemy.y);
  if(enemy.rare){g.shadowColor='#ffd27a';g.shadowBlur=13}
  if(enemy.type==='guard'||enemy.type==='chaser'||enemy.type==='elite'){
    const color=enemy.type==='elite'?'#7d2627':enemy.type==='chaser'?'#d2763d':'#a84443';
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

  const pickupRange=(22+(M.cult.sen-1)*17)*A().env.pick;
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

function loop(now){
  const dt=Math.min(.035,(now-last)/1000);
  last=now;
  for(const effect of fx){
    effect.t-=dt;
    if(effect.kind==='text')effect.y-=21*dt;
  }
  fx=fx.filter(effect=>effect.t>0);
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function pointFromEvent(event){
  const bounds=cv.getBoundingClientRect();
  return {x:(event.clientX-bounds.left)*W/bounds.width,y:(event.clientY-bounds.top)*H/bounds.height};
}
function setDestination(point,allowTarget=true){
  let target=null;
  let nearest=allowTarget?32:0;
  if(allowTarget){
    for(const candidate of [...enemies,...objects,...(vein?[vein]:[])]){
      const d=distance(point,candidate);
      if(d<nearest){nearest=d;target=candidate}
    }
  }
  P.target=target;
  P.tx=target?target.x:point.x;
  P.ty=target?target.y:point.y;
}

function activateTab(name,persist=true,toggleMenu=false){
  const valid=['train','areas'].includes(name)?name:'train';
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

UI.atk.onclick=()=>buyTrain('atk');
UI.mov.onclick=()=>buyTrain('mov');
UI.sen.onclick=()=>buyTrain('sen');
UI.hpb.onclick=()=>buyTrain('hp');
UI.bt.onclick=breakthrough;
UI.start.onclick=begin;
UI.ret.onclick=()=>{
  if(phase!=='run')return;
  P.target=null;
  P.tx=EXIT.x;P.ty=EXIT.y;
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

window.__xianxiaDebug={
  version:VERSION,
  constants:{RUN_TIME,AREAS,TREE,SKILLS,PLANS},
  snapshot:()=>JSON.parse(JSON.stringify({
    M,phase,elapsed,run,P,
    enemies:enemies.map(enemy=>({type:enemy.type,x:enemy.x,y:enemy.y,hp:enemy.hp,rare:enemy.rare,treasure:enemy.treasure})),
    objects:objects.map(object=>({type:object.type,x:object.x,y:object.y,value:object.value,grade:object.grade})),
    vein,hazards
  })),
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
  moveTo:(x,y)=>setDestination({x:clamp(x,11,689),y:clamp(y,11,449)},false),
  begin,
  tick:seconds=>update(seconds),
  finish,
  objectiveData,
  actions:{buyTrain,breakthrough,unlockSkill,upgradeSkill,buyNode},
  helpers:{rank,treeCount,treeLevels,areaReady,areaRequirement,areaUnlockCost,skillOpen,skillCap,skillCost,trainCost,cap,meets,herbHave},
  rerender:()=>{render();draw()}
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
  return state;
}

render();
syncHud();
draw();
requestAnimationFrame(loop);
})();
