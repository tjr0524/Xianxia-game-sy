(()=>{
'use strict';
const PATCH_VERSION='11.36.0';
function load(path){const x=new XMLHttpRequest();x.open('GET',`${path}?v=${encodeURIComponent(PATCH_VERSION)}`,false);x.send(null);if(!((x.status>=200&&x.status<300)||x.status===0))throw new Error(`${path} load failed: ${x.status}`);return x.responseText}
function must(src,re,to,label){if(!re.test(src))throw new Error(`balance core patch missing: ${label}`);return src.replace(re,to)}
function applyBalance(game){
  game=must(game,/const AREAS=\[[\s\S]*?\n\];\n\nconst TREE=/,`const AREAS=[
  {id:'qingyun',name:'청운산 후산',desc:'기본 요수전과 이동을 익히는 초입 비경.',enemy:1,reward:1,killStone:13,herbs:10,env:{move:1,pick:1},baseStage:1,rec:'범인~연기 3층',req:{major:0,stage:1,prev:null,nodes:0},palette:['#172e31','#244d48','#6b8f72']},
  {id:'blackwind',name:'흑풍곡',desc:'무리 요수와 산수의 전리품 경쟁이 시작되는 골짜기.',enemy:1,reward:1,killStone:34,herbs:10,env:{move:.86,pick:.75},baseStage:3,rec:'연기 3~6층',req:{major:0,stage:3,prev:'qingyun',nodes:2},palette:['#191f22','#34342a','#6d6042']},
  {id:'blood',name:'적혈비경',desc:'영맥 점유와 정예 수호전이 핵심인 고위 비경.',enemy:1,reward:1,killStone:90,herbs:9,env:{move:.77,pick:.60},baseStage:6,rec:'연기 6~9층',req:{major:0,stage:6,prev:'blackwind',nodes:3},palette:['#291719','#532127','#8c493b']},
  {id:'thunder',name:'천뢰봉',desc:'환경 낙뢰와 고위 요수전이 겹치는 축기 비경.',enemy:1,reward:1,killStone:210,herbs:12,env:{move:.68,pick:.42},baseStage:1,rec:'축기 1층 이상',req:{major:1,stage:1,prev:'blood',nodes:4},palette:['#11182b','#24284b','#555c91']}
];

const TREE=`, 'areas');

  game=must(game,/const TREE=\{[\s\S]*?\n\};\n\nconst NODES=/,`const TREE={
  eco:[
    {id:'eco1',n:'요수 흔적',d:'R1~2 개체 증가 · R3 장기전 증원 · R4 강화개체 · R5 주변 군집 합류',tier:1,c:{s:1,h:0}},
    {id:'eco2',n:'요수 군락',d:'R1~2 소규모 무리 · R3 3~4체+우두머리 · R4 밀집 · R5 대형 군락 사건',tier:2,p:'eco1',c:{s:1,h:0}},
    {id:'eco3',n:'희귀 요수',d:'R1 희귀 출현 · R3 고유 특성 · R5 희귀 무리/우두머리',tier:3,p:'eco2',c:{s:1,h:0}}
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
    {id:'storm1',n:'뢰흔 개방',d:'낙뢰 출현과 빈도 상승 · R3부터 연속 낙뢰',tier:1,c:{s:1,h:0}},
    {id:'storm2',n:'천뢰 예지',d:'낙뢰 전조와 연쇄 방향 정보를 강화한다.',tier:2,p:'storm1',c:{s:1,h:0}},
    {id:'storm3',n:'뇌정 응축',d:'복합 낙뢰 패턴을 개방한다. 보상 구조는 후속 튜닝.',tier:3,p:'storm2',c:{s:1,h:0}}
  ]
};

const NODES=`, 'tree');

  game=must(game,/const SKILLS=\[[\s\S]*?\n\];\n\nconst PLANS=/,`const SKILLS=[
  {id:'sword',n:'어검술',req:{major:0,stage:1},grade:0,unlock:{s:80,h:3},cd:4.8,desc:'단일 대상 희귀·정예를 빠르게 베는 주력 검술'},
  {id:'wave',n:'검풍',req:{major:0,stage:3},grade:0,unlock:{s:150,h:5},cd:5.5,desc:'가까이 모인 요수 무리를 쓸어내는 범위 검술'},
  {id:'chain',n:'연환비검',req:{major:0,stage:5},grade:1,unlock:{s:180,h:5},cd:6.0,desc:'흩어진 다수의 적 사이를 연속 도약하는 비검'},
  {id:'thunder',n:'낙뢰부',req:{major:0,stage:7},grade:2,unlock:{s:400,h:4},cd:7.0,desc:'정예와 주변 요수를 동시에 압박하는 고위 법술'},
  {id:'array',n:'만검진',req:{major:1,stage:1},grade:2,unlock:{s:1200,h:12},cd:10.0,desc:'넓은 영역을 세 차례 휩쓰는 축기 검진'}
];

const PLANS=`, 'skills');

  game=must(game,/const KEY='xianxia_proto_v11';/,`const BAL={
  enemy:{
    qingyun:{hp:70,hit:22,period:1.25,chaserSpeed:95,total:4,sim:2},
    blackwind:{hp:160,hit:38,period:1.15,chaserSpeed:120,total:5,sim:2},
    blood:{hp:380,hit:95,period:1.10,chaserSpeed:150,total:5,sim:3},
    thunder:{hp:1300,hit:300,period:1.00,chaserSpeed:190,total:6,sim:3}
  },
  ecoTotal:[1,1.15,1.30,1.50,1.75,2.00],
  ecoSim:[0,0,1,1,2,3],
  skill:{
    sword:{mult:[0,2.4,3.8,5.2,6.5,7.8],cd:[0,4.8,4.5,4.2,4.1,4.0],range:[0,93,104,115,126,138]},
    wave:{mult:[0,1.2,1.6,2.1,2.7,3.8],cd:[0,5.5,5.2,5.0,4.8,4.6],range:[0,40,47,53,60,67]},
    chain:{mult:[0,1.0,1.35,1.8,2.7,4.0],cd:[0,6.0,5.8,5.6,5.4,5.0],count:[0,3,3,4,5,6],jump:[0,40,44,49,53,58]},
    thunder:{mult:[0,1.8,3.0,5.0,6.3,8.0],cd:[0,7.0,6.7,6.4,6.1,5.8],radius:[0,36,42,49,56,62]},
    array:{mult:[0,3.0,4.4,6.0,8.0,10.5],cd:[0,10.0,9.6,9.2,8.8,8.4],radius:[0,84,93,102,111,122]}
  }
};
const KEY='xianxia_proto_v11';`, 'balance constants');

  game=must(game,/cult:\{atk:1,mov:1,sen:1,hp:1\}/g,`cult:{atk:1,mov:150,sen:1,hp:90}`, 'fresh stats');
  game=must(game,/const realmPower=\(\)=>isMortal\(\)\?\.42:1\+M\.realm\.major\*1\.18\+\(M\.realm\.stage-1\)\*\.11;\nconst combatPower=\(\)=>realmPower\(\)\*\(1\+\(run\?\.combo\|\|0\)\*\.045\);/,`const realmPower=()=>1;
const combatPower=()=>1+(run?.combo||0)*.02;
function areaMoveScale(){
  let s=1;
  if(M.area==='blackwind'){const d=M.realm.major>0?3:clamp((M.realm.stage||3)-3,0,3);s=.86+.04*d}
  else if(M.area==='blood'){const d=M.realm.major>0?3:clamp((M.realm.stage||6)-6,0,3);s=.77+.03*d}
  else if(M.area==='thunder'){const d=M.realm.major>1?4:M.realm.major===1?clamp((M.realm.stage||1)-1,0,4):0;s=.68+.04*d}
  if(M.trainingNodes?.q3_shadow)s+=(1-s)*.05;
  if(M.trainingNodes?.q9_harmony)s+=(1-s)*.03;
  return Math.min(1,s);
}
function areaPickupScale(){
  if(M.area==='qingyun')return 1;
  if(M.area==='blackwind'){const d=M.realm.major>0?3:clamp((M.realm.stage||3)-3,0,3);return Math.min(1.08,.75+.12*d)}
  if(M.area==='blood'){const d=M.realm.major>0?3:clamp((M.realm.stage||6)-6,0,3);return .60+.08*d}
  return .42;
}
function autoPickupRange(){return (20+Math.max(0,(M.cult.sen||1)-1)*12)*areaPickupScale()}
function basicDamage(){return 4+12*(M.cult.atk||1)}
function basicInterval(){let t=.65;if(M.trainingNodes?.q2_edge)t*=.92;if(M.trainingNodes?.q9_harmony)t*=.96;return t}
function skillRank(id){return clamp(Math.round(+M.skills?.[id]?.pow||0),0,5)}
function skillCooldown(id){const r=skillRank(id),b=BAL.skill[id];return b&&r?b.cd[r]:99}
function beastConfig(){return BAL.enemy[M.area]||BAL.enemy.qingyun}`, 'direct stat formulas');

  game=must(game,/function edgePoint\(\)\{[\s\S]*?\n\}/,`function edgePoint(){
  const angle=Math.random()*Math.PI*2,radius=260+Math.random()*220;
  return {x:clamp(P.x+Math.cos(angle)*radius,64,W-64),y:clamp(P.y+Math.sin(angle)*radius,64,H-64)};
}`, 'local ring spawn');

  game=must(game,/function actor\(type,options=\{\}\)\{[\s\S]*?\n\}\n\nfunction spawnBeast\(\)\{/,`function actor(type,options={}){
  const point=options.p||edgePoint();
  const cfg=beastConfig();
  const isBeast=['basic','guard','chaser','attacker','elite'].includes(type);
  const role={basic:{hp:1,atk:1,speed:1},guard:{hp:1.2,atk:1.1,speed:.8},chaser:{hp:.85,atk:.9,speed:1.25},attacker:{hp:1,atk:1.3,speed:1},elite:{hp:4,atk:1.55,speed:.95}}[type]||{hp:1,atk:1,speed:1};
  const baseSpeed=cfg.chaserSpeed/1.25;
  let grade=options.grade||((type==='elite')?'elite':'normal');
  if(isBeast&&type!=='elite'&&!options.grade){
    const er=rank('eco3'),u=Math.random();
    const rareChance=[0,.05,.07,.10,.13,.16][er]||0;
    const enhancedChance=rank('eco1')>=4?.12+.04*(rank('eco1')-4):0;
    if(u<rareChance)grade='rare';else if(u<rareChance+enhancedChance)grade='enhanced';
  }
  const gm={normal:{hp:1,atk:1,speed:1,reward:1},enhanced:{hp:1.35,atk:1.15,speed:1.05,reward:1.5},rare:{hp:1.8,atk:1.25,speed:1.08,reward:2.5},elite:{hp:1,atk:1,speed:1,reward:6}}[grade]||{hp:1,atk:1,speed:1,reward:1};
  const hp=isBeast?cfg.hp*role.hp*gm.hp:(type==='spirit'?1:type==='rogue'?80:type==='rat'?35:60);
  const enemy={type,x:point.x,y:point.y,r:type==='elite'?23:type==='spirit'?10:type==='rat'?9:12,hp,max:hp,cd:0,aggressive:0,homeX:options.homeX??point.x,homeY:options.homeY??point.y,vx:(Math.random()-.5)*45,vy:(Math.random()-.5)*45,escape:0,bond:0,rare:grade==='rare'?1:0,grade,treasure:0,carry:[],stealCd:0,attack:cfg.hit*role.atk*gm.atk,attackPeriod:cfg.period,speed:isBeast?baseSpeed*role.speed*gm.speed:(type==='spirit'?92:type==='rogue'?105:type==='rat'?125:90),rewardMult:gm.reward,rareTrait:null,windup:0,pendingStrike:0};
  if(grade==='rare'){
    const er=rank('eco3'),traits=er>=5?['frenzy','iron','howl','devour']:er>=3?['frenzy','iron','howl']:['frenzy'];
    enemy.rareTrait=traits[Math.floor(Math.random()*traits.length)];
    if(enemy.rareTrait==='iron'){enemy.hp*=1.18;enemy.max=enemy.hp}
  }
  if(type==='rogue')enemy.treasure=Math.random()<.18+rank('fate2')*.10;
  enemies.push(enemy);
  return enemy;
}

function spawnBeast(){`, 'actor');

  game=must(game,/function spawnBeast\(\)\{[\s\S]*?\n\}\n\nfunction setupVein\(\)\{/,`function spawnBeast(){
  const mix={qingyun:[['basic',.55],['guard',.25],['chaser',.20],['attacker',0]],blackwind:[['basic',.25],['guard',.25],['chaser',.35],['attacker',.15]],blood:[['basic',.15],['guard',.30],['chaser',.25],['attacker',.30]],thunder:[['basic',.10],['guard',.20],['chaser',.35],['attacker',.35]]}[M.area]||[['basic',1]];
  let u=Math.random(),type=mix[mix.length-1][0];for(const [t,p] of mix){if(u<p){type=t;break}u-=p}
  let point=null;
  if(rank('eco2')&&Math.random()<.08+rank('eco2')*.10){const pool=enemies.filter(e=>['basic','guard','chaser','attacker'].includes(e.type));if(pool.length){const anchor=pool[Math.floor(Math.random()*pool.length)],angle=Math.random()*6.28,radius=30+Math.random()*55;point={x:clamp(anchor.x+Math.cos(angle)*radius,64,W-64),y:clamp(anchor.y+Math.sin(angle)*radius,64,H-64)}}}
  return actor(type,point?{p:point,homeX:point.x,homeY:point.y}:{});
}

function setupVein(){`, 'spawn beast');

  game=must(game,/function setupVein\(\)\{[\s\S]*?\n\}\n\nfunction begin\(\)\{/,`function setupVein(){
  if(!branches().includes('res')||rank('res1')<=0)return;
  const point={x:W*.15+Math.random()*W*.70,y:H*.15+Math.random()*H*.70};
  const r1=rank('res1'),r2=rank('res2'),r3=rank('res3');
  vein={x:point.x,y:point.y,r:26,stock:Math.round((55+r1*15+r3*30)*currentPlan().vein),progress:0,cleared:r2?0:1,waveStage:0};
  if(r2>0){const angle=Math.random()*6.28,guardPoint={x:point.x+Math.cos(angle)*90,y:point.y+Math.sin(angle)*90};const elite=actor('elite',{p:guardPoint,homeX:guardPoint.x,homeY:guardPoint.y});elite.mineGuard=1;if(r2>=3){for(let i=0;i<2+(r2>=5?1:0);i++){const a=Math.random()*6.28,p={x:point.x+Math.cos(a)*(110+Math.random()*40),y:point.y+Math.sin(a)*(110+Math.random()*40)};actor(i%2?'guard':'chaser',{p,homeX:p.x,homeY:p.y})}}}
}

function begin(){`, 'vein setup');

  game=must(game,/const herbTotal=Math\.max\(3,Math\.round\(A\(\)\.herbs\*plan\.herbCount\)\);[\s\S]*?const beastInitial=Math\.max\(1,Math\.round\(beastTotal\*\.76\)\);/,`const herbTotal=Math.max(3,Math.round(A().herbs*plan.herbCount));
  const herbInitial=Math.ceil(herbTotal*.72);
  const eco=rank('eco1'),cfg=beastConfig();
  const beastTotal=Math.max(1,Math.round(cfg.total*(BAL.ecoTotal[eco]||1)*plan.enemyCount));
  const beastInitial=Math.min(beastTotal,cfg.sim+(BAL.ecoSim[eco]||0));`, 'run counts');
  game=must(game,/herbTimer:8\+Math\.random\(\)\*3,beastTimer:9\+Math\.random\(\)\*3,rogueTimer:5,/,`herbTimer:7+Math.random()*3,beastTimer:4.2+Math.random()*1.8,rogueTimer:6,`, 'run timers');
  game=must(game,/skillCooldowns:Object\.fromEntries\(SKILLS\.map\(skill=>\[skill\.id,0\]\)\)/,`skillCooldowns:Object.fromEntries(SKILLS.map(skill=>[skill.id,0])),scheduledHits:[]`, 'scheduled hits');
  game=must(game,/P\.max=isMortal\(\)\?36:Math\.floor\(\(90\+\(M\.cult\.hp-1\)\*38\)\*realmPower\(\)\);/,`P.max=Math.max(1,Math.round(M.cult.hp||90));`, 'player hp');

  game=must(game,/function reward\(enemy\)\{[\s\S]*?\n\}\n\nfunction cast\(skill\)\{/,`function reward(enemy){
  const plan=currentPlan();
  if(['basic','guard','chaser','attacker'].includes(enemy.type)){
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

function cast(skill){`, 'reward');

  game=must(game,/function cast\(skill\)\{[\s\S]*?\n\}\n\nfunction moveToward/,`function cast(skill){
  const st=skillState(skill.id),r=skillRank(skill.id),b=BAL.skill[skill.id];if(!st.u||!r||!b)return false;const B=basicDamage(),damage=B*b.mult[r];
  if(skill.id==='sword'){
    const range=b.range[r];let target=null,nearest=Infinity;for(const e of enemies){if(e.type==='spirit')continue;const d=distance(P,e);if(d<range&&d<nearest){nearest=d;target=e}}if(!target)return false;target.hp-=damage;slash(P.x,P.y,target.x,target.y,'#eef6ff');pop(target.x,target.y,'어검 '+Math.round(damage),'#f4f6ff');return true;
  }
  if(skill.id==='wave'){
    const range=b.range[r];let hits=0;for(const e of enemies){if(e.type==='spirit'||distance(P,e)>=range)continue;e.hp-=damage;hits++}if(!hits)return false;pop(P.x,P.y,'검풍 ×'+hits,'#9fdfff');ring(P.x,P.y,range,'#9fdfff');return true;
  }
  if(skill.id==='chain'){
    const candidates=enemies.filter(e=>e.type!=='spirit'),max=b.count[r],jump=b.jump[r];let current=P,used=new Set(),hits=0;for(let i=0;i<max;i++){let target=null,near=Infinity;for(const e of candidates){if(used.has(e))continue;const d=distance(current,e);const allowed=i===0?Math.max(130,jump*2.5):jump;if(d<allowed&&d<near){near=d;target=e}}if(!target)break;target.hp-=damage;slash(current.x,current.y,target.x,target.y,'#c6d6ff');used.add(target);current=target;hits++}return hits>0;
  }
  if(skill.id==='thunder'){
    const candidates=enemies.filter(e=>e.type!=='spirit'&&distance(P,e)<190);if(!candidates.length)return false;let target=candidates[0],best=-1;for(const e of candidates){const crowd=candidates.filter(o=>distance(e,o)<b.radius[r]*1.6).length;if(crowd>best){best=crowd;target=e}}let hits=0;for(const e of enemies){if(e.type!=='spirit'&&distance(target,e)<b.radius[r]){e.hp-=damage;hits++}}pop(target.x,target.y,'낙뢰 ×'+hits,'#d7c8ff');ring(target.x,target.y,b.radius[r],'#d7c8ff',.4);return true;
  }
  if(skill.id==='array'){
    const radius=b.radius[r],pulse=damage/3;run.scheduledHits.push({kind:'array',t:0.02,x:P.x,y:P.y,r:radius,damage:pulse},{kind:'array',t:.36,x:P.x,y:P.y,r:radius,damage:pulse},{kind:'array',t:.70,x:P.x,y:P.y,r:radius,damage:pulse});pop(P.x,P.y,'만검진','#ffe9a8');return true;
  }
  return false;
}

function moveToward`, 'skill cast');

  game=must(game,/function updateHazards\(dt\)\{[\s\S]*?\n\}\n\nfunction update\(dt\)\{[\s\S]*?\n\}\n\nfunction fortune/,`function updateHazards(dt){
  if(M.area!=='thunder')return;run.lightningTimer-=dt;if(run.lightningTimer<=0){const chain=rank('storm1')>=3?2+(rank('storm1')>=5?1:0):1;for(let i=0;i<chain;i++)setTimeout(()=>{if(phase==='run')spawnLightning()},i*180);run.lightningTimer=Math.max(2.7,5.0-rank('storm1')*.32)}
  for(const h of hazards){h.t-=dt;if(h.t<=0&&!h.struck){h.struck=1;h.t=.28;h.ttl=.28;if(distance(P,h)<h.r){let dmg=Math.ceil(beastConfig().hit*.55);P.hp-=dmg;run.minHp=Math.min(run.minHp,P.hp);pop(P.x,P.y,'천뢰 -'+dmg,'#ff9fa0',1)}else{run.dodges++;drop('s',h.x,h.y,h.reward);pop(h.x,h.y,'천뢰 회피','#bfc5ff',.9)}ring(h.x,h.y,h.r,'#d6d5ff',.3)}}hazards=hazards.filter(h=>h.t>0)
}

function update(dt){
  if(phase!=='run')return;elapsed+=dt;if(elapsed>=RUN_TIME){finish('collapse');return}
  P.cd=Math.max(0,P.cd-dt);P.hitGrace=Math.max(0,(P.hitGrace||0)-dt);
  if(run.combo>0){run.comboTime-=dt;if(run.comboTime<=0){run.combo=0;run.comboTime=0}}
  for(const id of Object.keys(run.skillCooldowns))run.skillCooldowns[id]=Math.max(0,run.skillCooldowns[id]-dt);
  if(run.scheduledHits?.length){for(const h of run.scheduledHits){h.t-=dt;if(h.t<=0&&!h.done){h.done=1;for(const e of enemies)if(e.type!=='spirit'&&distance(h,e)<h.r)e.hp-=h.damage;ring(h.x,h.y,h.r,'#ffe9a8',.28)}}run.scheduledHits=run.scheduledHits.filter(h=>!h.done)}
  const activeTargets=[...enemies,...objects,...(vein?[vein]:[])];if(P.target&&!activeTargets.includes(P.target))P.target=null;if(P.target){P.tx=P.target.x;P.ty=P.target.y}
  const speed=(isMortal()?150:(M.cult.mov||150))*areaMoveScale()*(1+run.combo*.005);
  const horizontal=(keys.has('arrowright')||keys.has('d')?1:0)-(keys.has('arrowleft')||keys.has('a')?1:0),vertical=(keys.has('arrowdown')||keys.has('s')?1:0)-(keys.has('arrowup')||keys.has('w')?1:0);
  if(horizontal||vertical){P.target=null;const norm=Math.hypot(horizontal,vertical)||1;P.x+=horizontal/norm*speed*dt;P.y+=vertical/norm*speed*dt;P.tx=P.x;P.ty=P.y}else moveToward(P,P.tx,P.ty,speed,dt);P.x=clamp(P.x,11,W-11);P.y=clamp(P.y,11,H-11);
  const exitDistance=Math.hypot(P.x-EXIT.x,P.y+PLAYER_GROUND_OFFSET-EXIT.y);if(exitDistance>68)run.left=1;if(run.left&&exitDistance<EXIT.r+9){finish('return');return}
  run.herbTimer-=dt;if(run.herbLeft>0&&run.herbTimer<=0){randomHerb();run.herbLeft--;run.herbTimer=7+Math.random()*3}
  run.beastTimer-=dt;if(run.beastLeft>0&&run.beastTimer<=0){spawnBeast();run.beastLeft--;const pressure=rank('eco1')>=3&&enemies.some(e=>e.aggressive&&['basic','guard','chaser','attacker','elite'].includes(e.type));run.beastTimer=pressure?3.0+Math.random()*1.5:5.0+Math.random()*2}
  if(branches().includes('fate')&&rank('fate1')>0){run.rogueTimer-=dt;if(run.rogueTimer<=0){actor(Math.random()<.68?'rogue':'rat');run.rogueTimer=Math.max(4.2,10-rank('fate1')*.75)}}
  const pr=autoPickupRange();objects=objects.filter(o=>{if(distance(P,o)<pr+o.r){if(o.type==='h')gainHerb(o.value,o.grade,o.x,o.y);else gainStone(o.value,o.x,o.y);return false}return true});
  if(vein&&vein.stock>0&&distance(P,vein)<vein.r+P.r+10){vein.progress+=dt;const r3=rank('res3');if(r3>=3&&vein.waveStage<1&&vein.progress>=1){vein.waveStage=1;for(let i=0;i<2;i++){const a=Math.random()*6.28,p={x:vein.x+Math.cos(a)*130,y:vein.y+Math.sin(a)*130};actor(i?'chaser':'guard',{p,homeX:p.x,homeY:p.y})}}if(r3>=3&&vein.waveStage<2&&vein.progress>=2){vein.waveStage=2;for(let i=0;i<2+(r3>=5?2:0);i++){const a=Math.random()*6.28,p={x:vein.x+Math.cos(a)*(130+Math.random()*40),y:vein.y+Math.sin(a)*(130+Math.random()*40)};actor(i%2?'attacker':'chaser',{p,homeX:p.x,homeY:p.y})}}if(vein.progress>=3){const mined=vein.stock;vein.stock=0;run.mined+=mined;gainStone(mined,vein.x,vein.y);pop(vein.x,vein.y-34,'영맥 채굴 완료','#b8d7ef',1.1)}}
  for(const enemy of enemies){
    enemy.cd=Math.max(0,enemy.cd-dt);
    if(enemy.type==='attacker'&&enemy.windup>0){enemy.windup-=dt;if(enemy.windup<=0&&enemy.pendingStrike){enemy.pendingStrike=0;if(distance(enemy,P)<P.r+enemy.r+16){let dmg=enemy.attack||beastConfig().hit;if(enemies.some(o=>o!==enemy&&o.rareTrait==='howl'&&o.hp>0&&distance(o,enemy)<130))dmg*=1.15;if(P.hitGrace>0&&M.trainingNodes?.q6_spirit)dmg*=M.trainingNodes?.q9_harmony ? .90 : .92;dmg=Math.ceil(dmg);P.hp-=dmg;run.minHp=Math.min(run.minHp,P.hp);P.hitGrace=1.15;ring(P.x,P.y,P.r+9,'#c96893',.20)}}}
    if(enemy.type==='spirit'){const d=distance(enemy,P);if(d<40){enemy.bond+=dt;if(enemy.bond>1.3){gainHerb(1+Math.floor(Math.random()*2),Math.min(2,areaIndex()),enemy.x,enemy.y);enemy.hp=0}}else enemy.bond=Math.max(0,enemy.bond-dt*.3);if(rank('fate3')>=3&&d<130){const dx=enemy.x-P.x,dy=enemy.y-P.y,n=Math.hypot(dx,dy)||1;enemy.vx=dx/n*enemy.speed;enemy.vy=dy/n*enemy.speed}enemy.x=clamp(enemy.x+enemy.vx*dt,18,W-18);enemy.y=clamp(enemy.y+enemy.vy*dt,18,H-18);continue}
    if(enemy.type==='rogue'||enemy.type==='rat'){enemy.stealCd=Math.max(0,enemy.stealCd-dt);const dP=distance(enemy,P);if(enemy.type==='rogue'&&enemy.treasure&&rank('fate2')>=3&&dP<170)enemy.escape=1;let target=null,nearest=Infinity;if(!enemy.escape&&rank('fate1')>=3){for(const o of objects){const d=distance(enemy,o);if(d<nearest){nearest=d;target=o}}}if(target){moveToward(enemy,target.x,target.y,enemy.speed,dt);if(nearest<enemy.r+target.r+4&&enemy.stealCd<=0){const idx=objects.indexOf(target);if(idx>=0){objects.splice(idx,1);enemy.carry.push({type:target.type,value:target.value,grade:target.grade});enemy.stealCd=.35;if(enemy.type==='rat'||enemy.carry.length>=2)enemy.escape=1}}}else if(enemy.carry.length)enemy.escape=1;else if(!enemy.escape){enemy.x=clamp(enemy.x+enemy.vx*dt,18,W-18);enemy.y=clamp(enemy.y+enemy.vy*dt,18,H-18)}if(elapsed>21)enemy.escape=1;if(enemy.escape)moveToward(enemy,enemy.x<W/2?-30:W+30,enemy.y,enemy.speed*1.2,dt);continue}
    const d=distance(enemy,P),home=Math.hypot(enemy.x-enemy.homeX,enemy.y-enemy.homeY),aggro=enemy.type==='chaser'?220:enemy.type==='elite'?105:120;
    if(enemy.type==='chaser'){if(d<aggro)enemy.aggressive=1;if(d>aggro*1.45)enemy.aggressive=0}else{if(d<aggro)enemy.aggressive=1;if(home>210&&d>aggro)enemy.aggressive=0}
    let speedMul=1,period=enemy.attackPeriod||1;if(enemy.rareTrait==='frenzy'&&enemy.hp/enemy.max<.5){speedMul=1.15;period*=.8}if(enemy.aggressive)moveToward(enemy,P.x,P.y,enemy.speed*speedMul,dt);else if(home>5)moveToward(enemy,enemy.homeX,enemy.homeY,enemy.speed*.55,dt);
    if(d<P.r+enemy.r+3&&enemy.cd<=0){if(enemy.type==='attacker'){enemy.windup=.55;enemy.pendingStrike=1;enemy.cd=period+.55;ring(enemy.x,enemy.y,enemy.r+18,'#c96893',.55)}else{let dmg=enemy.attack||beastConfig().hit;if(enemies.some(o=>o!==enemy&&o.rareTrait==='howl'&&o.hp>0&&distance(o,enemy)<130))dmg*=1.15;if(P.hitGrace>0&&M.trainingNodes?.q6_spirit)dmg*=M.trainingNodes?.q9_harmony ? .90 : .92;dmg=Math.ceil(dmg);P.hp-=dmg;run.minHp=Math.min(run.minHp,P.hp);P.hitGrace=1.15;enemy.cd=period;ring(P.x,P.y,P.r+7,'#f47b6f',.16)}}
  }
  enemies=enemies.filter(e=>{if((e.type==='rogue'||e.type==='rat')&&(e.x<-10||e.x>W+10))return false;if(e.hp<=0){if(e.type!=='spirit')reward(e);return false}return true});
  if(!isMortal()){let target=null,nearest=Infinity;for(const e of enemies){if(e.type==='spirit')continue;const d=distance(P,e);if(d<nearest){nearest=d;target=e}}if(target&&nearest<52&&P.cd<=0){const dmg=basicDamage()*combatPower();target.hp-=dmg;P.cd=basicInterval();slash(P.x,P.y,target.x,target.y,'#f7e5ad')}}
  for(const skill of SKILLS){const st=skillState(skill.id);if(!st.u)continue;if(run.skillCooldowns[skill.id]<=0&&cast(skill))run.skillCooldowns[skill.id]=skillCooldown(skill.id)}
  updateHazards(dt);if(P.hp<=0){P.hp=0;finish('dead');return}syncHud();
}

function fortune`, 'update loop');

  game=must(game,/const pickupRange=\(22\+\(M\.cult\.sen-1\)\*17\)\*A\(\)\.env\.pick;\n  g\.strokeStyle=/,`const pickupRange=autoPickupRange();
  g.strokeStyle=`, 'pickup draw');
  game=must(game,/if\(enemy\.type==='guard'\|\|enemy\.type==='chaser'\|\|enemy\.type==='elite'\)\{/,`if(['basic','guard','chaser','attacker','elite'].includes(enemy.type)){`, 'enemy draw role');
  game=must(game,/const color=enemy\.type==='elite'\?'#7d2627':enemy\.type==='chaser'\?'#d2763d':'#a84443';/,`const color=enemy.type==='elite'?'#7d2627':enemy.type==='chaser'?'#d2763d':enemy.type==='attacker'?'#8d3e63':enemy.type==='guard'?'#8b4d38':'#a84443';`, 'enemy draw colors');
  return game;
}
window.__xianxiaApplyCoreBalance=applyBalance;
try{
  let shell=load('worldscale_core_v11_34.js');
  const re=/\(0,eval\)\(\`\$\{game\}\\n\/\/# sourceURL=game_v11\.worldscale\.js\`\);/;
  if(!re.test(shell))throw new Error('worldscale eval marker missing');
  shell=shell.replace(re,"game=window.__xianxiaApplyCoreBalance(game);\n  (0,eval)(game+'\\n//# sourceURL=game_v11.worldscale.balance.js');");
  (0,eval)(shell+'\n//# sourceURL=worldscale_core_v11_34.balance-loader.js');
  window.__xianxiaBalance={version:PATCH_VERSION,core:'Core Balance v0.1',spatial:'Spatial v0.1'};
  const e=document.querySelector('#buildVersion');if(e)e.textContent=`BUILD ${PATCH_VERSION} · BALANCE`;
}catch(error){console.error(error);const e=document.querySelector('#buildVersion');if(e)e.textContent=`BUILD ${PATCH_VERSION} · BAL ERR`}
})();