(()=>{
'use strict';
const PATCH_VERSION='11.37.0';
const BASE='balance_core_v11_36.js';
function load(path){const x=new XMLHttpRequest();x.open('GET',`${path}?v=${encodeURIComponent(PATCH_VERSION)}`,false);x.send(null);if(!((x.status>=200&&x.status<300)||x.status===0))throw new Error(`${path} load failed: ${x.status}`);return x.responseText}
function once(src,from,to,label){const i=src.indexOf(from);if(i<0)throw new Error(`encounter patch missing: ${label}`);if(src.indexOf(from,i+from.length)>=0)throw new Error(`encounter patch duplicate: ${label}`);return src.slice(0,i)+to+src.slice(i+from.length)}
function insertBefore(src,marker,text,label){const i=src.indexOf(marker);if(i<0)throw new Error(`encounter insert missing: ${label}`);return src.slice(0,i)+text+src.slice(i)}
function transform(src){
  src=once(src,"const PATCH_VERSION='11.36.0';","const PATCH_VERSION='11.37.0';",'version');
  src=once(src,"killStone:13,herbs:10","killStone:11,herbs:10",'qingyun reward');
  src=once(src,"{id:'eco1',n:'요수 흔적',d:'R1~2 개체 증가 · R3 장기전 증원 · R4 강화개체 · R5 주변 군집 합류'","{id:'eco1',n:'요수 흔적',d:'R1~2 팩 밀도 증가 · R3 장기전 증원 · R4 인접팩 접근 · R5 주변 1~2팩 연쇄 활성'",'eco1 copy');
  src=once(src,"{id:'eco2',n:'요수 군락',d:'R1~2 소규모 무리 · R3 3~4체+우두머리 · R4 밀집 · R5 대형 군락 사건'","{id:'eco2',n:'요수 군락',d:'R1 2체 · R2 2~3체 · R3 3~4체+우두머리 · R4 4~5체 · R5 5~7체 대형 군락'",'eco2 copy');
  src=once(src,"{id:'eco3',n:'희귀 요수',d:'R1 희귀 출현 · R3 고유 특성 · R5 희귀 무리/우두머리'","{id:'eco3',n:'희귀 요수',d:'R1 희귀 출현 · R3 고유 특성 · R4 강화 희귀 · R5 희귀 무리/우두머리'",'eco3 copy');
  src=once(src,
"  ecoSim:[0,0,1,1,2,3],",
"  ecoSim:[0,0,1,1,2,3],\n  encounter:{\n    packCounts:{qingyun:[8,10,12,15,23,34],blackwind:[10,12,15,19,28,38],blood:[10,12,15,19,25,32],thunder:[12,14,17,21,26,30]},\n    packSize:[[1,2],[2,2],[2,3],[3,4],[4,5],[5,7]],\n    liveCaps:{qingyun:[5,6,7,9,12,16],blackwind:[6,7,8,11,14,18],blood:[6,7,8,11,14,18],thunder:[7,8,10,12,15,18]},\n    attackSlots:{qingyun:2,blackwind:3,blood:3,thunder:3},\n    starterPacks:{qingyun:2,blackwind:3,blood:3,thunder:3},\n    wakeRadius:[560,570,580,600,620,650],\n    minPackGap:[360,330,300,260,210,170],\n    chainDelay:[99,99,99,4.5,3.3,2.4],\n    chainLimit:[0,0,0,1,1,2],\n    chainRadius:[0,0,0,720,900,1100]\n  },",'encounter constants');

  src=once(src,
"    const rareChance=[0,.05,.07,.10,.13,.16][er]||0;\n    const enhancedChance=rank('eco1')>=4?.12+.04*(rank('eco1')-4):0;\n    if(u<rareChance)grade='rare';else if(u<rareChance+enhancedChance)grade='enhanced';",
"    const rareChance=[0,.04,.06,.09,.12,.16][er]||0;\n    const enhancedChance=[0,.04,.07,.09,.12,.15][er]||0;\n    if(u<rareChance)grade='rare';else if(u<rareChance+enhancedChance)grade='enhanced';",'eco3 grade chance');
  src=once(src,
"rewardMult:gm.reward,rareTrait:null,windup:0,pendingStrike:0};",
"rewardMult:gm.reward,rareTrait:null,windup:0,pendingStrike:0,packId:options.packId??null,slotAngle:Math.random()*Math.PI*2,packLeader:options.packLeader?1:0};\n  if(options.packLeader&&isBeast){enemy.hp*=1.15;enemy.max=enemy.hp;enemy.attack*=1.10;enemy.rewardMult*=1.15;enemy.r+=2}", 'pack actor fields');
  src=once(src,
"  if(grade==='rare'){\n    const er=rank('eco3'),traits=er>=5?['frenzy','iron','howl','devour']:er>=3?['frenzy','iron','howl']:['frenzy'];\n    enemy.rareTrait=traits[Math.floor(Math.random()*traits.length)];\n    if(enemy.rareTrait==='iron'){enemy.hp*=1.18;enemy.max=enemy.hp}\n  }",
"  if(grade==='rare'){\n    const er=rank('eco3');\n    if(er>=4){enemy.hp*=1.10;enemy.max=enemy.hp;enemy.attack*=1.08}\n    if(er>=3){const traits=er>=5?['frenzy','iron','howl','devour']:['frenzy','iron','howl'];enemy.rareTrait=traits[Math.floor(Math.random()*traits.length)];if(enemy.rareTrait==='iron'){enemy.hp*=1.18;enemy.max=enemy.hp}}\n  }",'rare trait gate');

  const encounterPatch=[
"  game=must(game,/function spawnBeast\\(\\)\\{[\\s\\S]*?\\n\\}\\n\\nfunction setupVein\\(\\)\\{/,`function spawnBeast(point=null,options={}){",
"  const mix={qingyun:[['basic',.55],['guard',.25],['chaser',.20],['attacker',0]],blackwind:[['basic',.25],['guard',.25],['chaser',.35],['attacker',.15]],blood:[['basic',.15],['guard',.30],['chaser',.25],['attacker',.30]],thunder:[['basic',.10],['guard',.20],['chaser',.35],['attacker',.35]]}[M.area]||[['basic',1]];",
"  let u=Math.random(),type=mix[mix.length-1][0];for(const [t,p] of mix){if(u<p){type=t;break}u-=p}",
"  const p=point||edgePoint();return actor(type,{...options,p,homeX:options.homeX??p.x,homeY:options.homeY??p.y});",
"}",
"function encounterConfig(){return BAL.encounter}",
"function encounterBeast(e){return e&&['basic','guard','chaser','attacker','elite'].includes(e.type)&&e.hp>0}",
"function encounterRank(){return Math.max(0,Math.min(5,rank('eco1')))}",
"function encounterPackCount(){const e=encounterConfig(),r=encounterRank();return e.packCounts[M.area]?.[r]??e.packCounts.qingyun[r]}",
"function encounterPackSize(){const e=encounterConfig(),r=Math.max(0,Math.min(5,rank('eco2'))),v=e.packSize[r]||e.packSize[0],lo=v[0],hi=v[1];return lo+Math.floor(Math.random()*(hi-lo+1))}",
"function encounterLiveCap(){const e=encounterConfig(),r=encounterRank();return e.liveCaps[M.area]?.[r]??8}",
"function attackSlotCap(){return encounterConfig().attackSlots[M.area]||3}",
"function encounterLiveCount(){let n=0;for(const e of enemies)if(encounterBeast(e))n++;return n}",
"function encounterPoint(existing,starterIndex=-1,starterCount=0){",
"  const e=encounterConfig(),r=encounterRank();",
"  if(starterIndex>=0){const base=Math.random()*Math.PI*2,angle=base+starterIndex*Math.PI*2/Math.max(1,starterCount),radius=320+Math.random()*110;return{x:clamp(P.x+Math.cos(angle)*radius,100,W-100),y:clamp(P.y+Math.sin(angle)*radius,100,H-100)}}",
"  const gap=e.minPackGap[r]||220;for(let a=0;a<80;a++){const p={x:100+Math.random()*(W-200),y:100+Math.random()*(H-200)};if(distance(p,EXIT_APPROACH)<260)continue;if(existing.every(q=>Math.hypot(p.x-q.x,p.y-q.y)>=gap))return p}return randomPoint(100)",
"}",
"function activateEncounterPack(pack,force=false){",
"  if(!pack||pack.active)return false;const cap=encounterLiveCap(),live=encounterLiveCount();if(!force&&live+pack.size>cap)return false;pack.active=1;pack.activatedAt=elapsed;run.packActivated=(run.packActivated||0)+1;const rarePack=rank('eco3')>=5&&Math.random()<.10;",
"  for(let i=0;i<pack.size;i++){const angle=i/Math.max(1,pack.size)*Math.PI*2+Math.random()*.45,radius=18+Math.random()*48,p={x:clamp(pack.x+Math.cos(angle)*radius,64,W-64),y:clamp(pack.y+Math.sin(angle)*radius,64,H-64)},leader=rank('eco2')>=3&&i===0;let grade=null;if(rarePack)grade=i===0?'rare':(Math.random()<.45?'rare':'enhanced');spawnBeast(p,{packId:pack.id,packLeader:leader,grade})}return true",
"}",
"function nearestDormantEncounterPack(maxRange){let best=null,bd=maxRange;for(const p of run.packs||[]){if(p.active)continue;const d=distance(P,p);if(d<bd){bd=d;best=p}}return best}",
"function initEncounterPacks(){",
"  const e=encounterConfig(),count=encounterPackCount(),starter=Math.min(count,e.starterPacks[M.area]||2),packs=[];run.packs=packs;run.packActivated=0;run.chainUsed=0;run.chainTimer=e.chainDelay[encounterRank()]||99;run.calmTimer=0;",
"  for(let i=0;i<count;i++){const p=encounterPoint(packs,i<starter?i:-1,starter);packs.push({id:i,x:p.x,y:p.y,size:encounterPackSize(),active:0,starter:i<starter})}",
"  for(let i=0;i<starter;i++)activateEncounterPack(packs[i],true)",
"}",
"function updateEncounterPacks(dt){",
"  if(!run?.packs)return;const e=encounterConfig(),r=encounterRank(),wake=e.wakeRadius[r]||600;const nearby=run.packs.filter(p=>!p.active&&distance(P,p)<=wake).sort((a,b)=>distance(P,a)-distance(P,b));for(const p of nearby){if(encounterLiveCount()>=encounterLiveCap())break;activateEncounterPack(p,false)}",
"  const combat=enemies.some(x=>encounterBeast(x)&&distance(P,x)<280);if(combat&&r>=3){run.calmTimer=0;run.chainTimer-=dt;const limit=e.chainLimit[r]||0;if(run.chainTimer<=0&&run.chainUsed<limit){const p=nearestDormantEncounterPack(e.chainRadius[r]||0);if(p&&activateEncounterPack(p,false)){run.chainUsed++;run.chainTimer=e.chainDelay[r]||99}else run.chainTimer=.8}}else{run.calmTimer=(run.calmTimer||0)+dt;if(run.calmTimer>1.2){run.chainUsed=0;run.chainTimer=e.chainDelay[r]||99}}",
"}",
"function attackStrikeSet(){const cap=attackSlotCap(),list=enemies.filter(e=>encounterBeast(e)&&e.aggressive).sort((a,b)=>distance(P,a)-distance(P,b));return new Set(list.slice(0,cap))}",
"",
"function setupVein(){`, 'encounter packs');",
""
].join('\n');
  src=insertBefore(src,"  game=must(game,/function setupVein",encounterPatch,'encounter helpers');

  src=once(src,
"  const eco=rank('eco1'),cfg=beastConfig();\n  const beastTotal=Math.max(1,Math.round(cfg.total*(BAL.ecoTotal[eco]||1)*plan.enemyCount));\n  const beastInitial=Math.min(beastTotal,cfg.sim+(BAL.ecoSim[eco]||0));",
"  const beastTotal=0,beastInitial=0;",'legacy run counts disabled');
  src=insertBefore(src,"  game=must(game,/function reward", "  game=must(game,/for\\(let i=0;i<beastInitial;i\\+\\+\\)spawnBeast\\(\\);/,`initEncounterPacks();`, 'pack init');\n\n",'pack init insertion');
  src=once(src,
"  run.beastTimer-=dt;if(run.beastLeft>0&&run.beastTimer<=0){spawnBeast();run.beastLeft--;const pressure=rank('eco1')>=3&&enemies.some(e=>e.aggressive&&['basic','guard','chaser','attacker','elite'].includes(e.type));run.beastTimer=pressure?3.0+Math.random()*1.5:5.0+Math.random()*2}",
"  updateEncounterPacks(dt);",'legacy beast timer');
  src=once(src,"  for(const enemy of enemies){","  const strikeSet=attackStrikeSet();\n  for(const enemy of enemies){",'strike set');
  src=once(src,
"if(enemy.aggressive)moveToward(enemy,P.x,P.y,enemy.speed*speedMul,dt);else if(home>5)moveToward(enemy,enemy.homeX,enemy.homeY,enemy.speed*.55,dt);",
"if(enemy.aggressive){if(strikeSet.has(enemy))moveToward(enemy,P.x,P.y,enemy.speed*speedMul,dt);else{const rr=58+(enemy.r||12),tx=P.x+Math.cos(enemy.slotAngle||0)*rr,ty=P.y+Math.sin(enemy.slotAngle||0)*rr;moveToward(enemy,tx,ty,enemy.speed*.82*speedMul,dt)}}else if(home>5)moveToward(enemy,enemy.homeX,enemy.homeY,enemy.speed*.55,dt);",'attack waiting ring');
  src=once(src,"    if(d<P.r+enemy.r+3&&enemy.cd<=0){","    if(strikeSet.has(enemy)&&d<P.r+enemy.r+3&&enemy.cd<=0){",'attack slots');
  src=once(src,"core:'Core Balance v0.1',spatial:'Spatial v0.1'","core:'Core Balance v0.2',spatial:'Spatial v0.1',encounter:'Encounter Density v0.3'",'balance metadata');
  return src;
}

const API={version:PATCH_VERSION,transform};
if(typeof module!=='undefined'&&module.exports){module.exports=API;return}
try{const src=transform(load(BASE));(0,eval)(src+'\n//# sourceURL=balance_core_v11_37.transformed.js');const e=document.querySelector('#buildVersion');if(e)e.textContent=`BUILD ${PATCH_VERSION} · BALANCE`;window.__xianxiaEncounterPatch=API}catch(error){console.error(error);const e=document.querySelector('#buildVersion');if(e)e.textContent=`BUILD ${PATCH_VERSION} · ENC ERR`}
})();
