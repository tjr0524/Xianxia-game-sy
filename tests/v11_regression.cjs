const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

class ClassList{
  constructor(){this.values=new Set()}
  add(...names){names.forEach(name=>this.values.add(name))}
  remove(...names){names.forEach(name=>this.values.delete(name))}
  toggle(name,force){
    const add=force===undefined?!this.values.has(name):force;
    if(add)this.values.add(name);else this.values.delete(name);
    return add;
  }
  contains(name){return this.values.has(name)}
}

class Element{
  constructor(id=''){
    this.id=id;
    this.textContent='';
    this.innerHTML='';
    this.style={};
    this.style.setProperty=()=>{};
    this.classList=new ClassList();
    this.dataset={};
    this.children=[];
    this.disabled=false;
    this.onclick=null;
    this.clientWidth=700;
    this.clientHeight=460;
    this.scrollWidth=700;
    this.scrollHeight=460;
  }
  appendChild(child){this.children.push(child);return child}
  addEventListener(){}
  closest(){return this}
  setAttribute(){}
  getBoundingClientRect(){return {left:0,top:0,width:700,height:460}}
  setPointerCapture(){}
}

const elements=new Map();
const element=id=>{
  if(!elements.has(id))elements.set(id,new Element(id));
  return elements.get(id);
};
const canvas=element('cv');
const gradient={addColorStop(){}};
const context=new Proxy({}, {get:(target,key)=>{
  if(key==='createLinearGradient'||key==='createRadialGradient')return ()=>gradient;
  if(key==='measureText')return text=>({width:String(text).length*7});
  if(!(key in target))target[key]=()=>{};
  return target[key];
},set:(target,key,value)=>{target[key]=value;return true}});
canvas.getContext=()=>context;

const tabNames=['train','skills','areas','tree'];
const tabs=tabNames.map(name=>{const node=new Element();node.dataset.tab=name;return node});
const panels=tabNames.map(name=>{const node=new Element();node.dataset.panel=name;return node});
global.document={
  querySelector(selector){return selector.startsWith('#')?element(selector.slice(1)):selector==='.controls'?element('controls'):null},
  querySelectorAll(selector){return selector==='.tab-btn'?tabs:selector==='.panel'?panels:[]},
  createElement(){return new Element()},
  addEventListener(){}
};

const storage=new Map();
global.localStorage={
  getItem:key=>storage.has(key)?storage.get(key):null,
  setItem:(key,value)=>storage.set(key,String(value)),
  removeItem:key=>storage.delete(key)
};
global.window=global;
global.window.addEventListener=()=>{};
global.window.matchMedia=()=>({matches:false});
global.location={reload(){}};
global.confirm=()=>true;
global.requestAnimationFrame=()=>0;

let randomSeed=24681357;
Math.random=()=>{
  randomSeed=(randomSeed*1664525+1013904223)>>>0;
  return randomSeed/4294967296;
};

storage.set('xianxia_proto_v10',JSON.stringify({
  stone:321,herb:17,herb2:4,herb3:1,
  realm:{major:0,stage:6},cult:{atk:3,mov:2,sen:2,hp:2},
  skills:{sword:{u:1,pow:2,range:1,cycle:1}},
  area:'blood',unlocked:{qingyun:1,blackwind:1,blood:1},
  zones:{
    qingyun:{tree:{eco1:3},runs:4,safe:3},
    blackwind:{tree:{fate1:2,fate2:1},runs:2,safe:1},
    blood:{tree:{res1:2,res2:1},runs:1,safe:1}
  },
  events:{foundationInsight:0},settings:{tab:'areas'},stats:{totalRuns:7,totalSafe:5,totalKills:20}
}));

const code=fs.readFileSync(new URL('../game_v11.js',`file://${__filename}`),'utf8');
vm.runInThisContext(code,{filename:'game_v11.js'});
const debug=global.__xianxiaDebug;

function snapshot(){return debug.snapshot()}
function step(seconds,dt=.025){
  for(let t=0;t<seconds;t+=dt)debug.tick(Math.min(dt,seconds-t));
}
function baseState(overrides={}){
  return {
    stone:0,herb:0,herb2:0,herb3:0,
    realm:{major:0,stage:9},
    cult:{atk:5,mov:5,sen:5,hp:5},
    skills:{sword:{u:1,pow:2,range:2,cycle:2}},
    area:'qingyun',unlocked:{qingyun:1,blackwind:1,blood:1,thunder:1},
    zones:{
      qingyun:{tree:{eco1:3,eco2:3,eco3:1}},
      blackwind:{tree:{eco1:2,fate1:3,fate2:2,fate3:1}},
      blood:{tree:{eco1:2,fate1:2,res1:3,res2:2,res3:1}},
      thunder:{tree:{eco1:2,fate1:2,res1:2,storm1:2,storm2:1}}
    },
    events:{foundationInsight:1},settings:{plan:'harvest',tab:'train'},stats:{},
    ...overrides
  };
}

assert.equal(debug.version,'11');
assert.equal(debug.constants.RUN_TIME,25);
assert.equal(debug.constants.AREAS.length,4);
assert.equal(snapshot().M.stone,321,'v10 resource migration');
assert.equal(snapshot().M.skills.sword.pow,2,'v10 skill migration');
assert.equal(snapshot().M.zones.blackwind.tree.fate2,1,'v10 per-area tree migration');
assert.ok(snapshot().M.zones.thunder,'new area added to old save');

debug.replaceState(baseState({realm:{major:0,stage:1},skills:{}}));
assert.equal(snapshot().M.skills.sword.u,1,'an initiated save always receives the starter sword art');

debug.replaceState(baseState({realm:{major:-1,stage:0},settings:{plan:'hunt',tab:'train'}}));
debug.selectPlan('hunt');
assert.equal(snapshot().M.settings.plan,'harvest','mortal is restricted to gathering');

debug.replaceState(baseState());
debug.selectArea('qingyun');
debug.selectPlan('hunt');
debug.begin();
let state=snapshot();
assert.ok(state.enemies.length>=1);
assert.ok(state.enemies.every(enemy=>['guard','chaser'].includes(enemy.type)),'Qingyun starts with beasts only');
assert.equal(state.vein,null,'Qingyun has no vein');
debug.finish('collapse');

debug.replaceState(baseState({stone:0,herb:0,herb2:0,herb3:0}));
debug.selectArea('blood');
debug.selectPlan('venture');
debug.begin();
state=snapshot();
assert.ok(state.vein&&state.vein.stock>0,'Blood realm has a mineable vein');
assert.ok(state.enemies.some(enemy=>enemy.type==='elite'),'upgraded Blood vein has an elite guard');
debug.finish('collapse');

debug.replaceState(baseState({realm:{major:1,stage:1}}));
debug.selectArea('thunder');
debug.selectPlan('venture');
debug.begin();
step(2.25);
state=snapshot();
assert.ok(state.hazards.length>0,'Thunder Peak creates telegraphed lightning');
const warning=state.hazards[0];
debug.moveTo(warning.x>350?20:680,warning.y>230?20:420);
step(1.2);
state=snapshot();
assert.ok(state.run.dodges>=1||state.P.hp<state.P.max,'lightning resolves as dodge or hit');
debug.finish('collapse');

debug.replaceState(baseState({stone:0,herb:0,herb2:0,herb3:0}));
debug.selectArea('qingyun');
debug.selectPlan('harvest');
debug.begin();
let live=snapshot();
const herb=live.objects.find(object=>object.type==='h');
assert.ok(herb,'run starts with collectable herbs');
debug.moveTo(herb.x,herb.y);
step(6);
live=snapshot();
assert.ok(live.run.h0+live.run.h1+live.run.h2>0,'tap movement can collect a herb');
const carried=live.run.h0+live.run.h1+live.run.h2;
debug.finish('collapse');
state=snapshot();
assert.equal(state.M.herb+state.M.herb2+state.M.herb3,Math.floor(carried*.4),'collapse retains exactly 40% of carried herbs');

debug.replaceState(baseState());
debug.selectArea('qingyun');
debug.begin();
step(25.1);
assert.equal(snapshot().phase,'home','run automatically ends at 25 seconds');

// A simple novice controller repeatedly walks to the nearest herb, then returns.
// This is deliberately less capable than a human and guards against a punishing first run.
let mortalReturns=0;
let mortalProgress=0;
for(let attempt=0;attempt<24;attempt++){
  randomSeed=1000+attempt*97;
  debug.replaceState(baseState({
    realm:{major:-1,stage:0},cult:{atk:1,mov:1,sen:1,hp:1},skills:{},
    stone:0,herb:0,herb2:0,herb3:0,
    area:'qingyun',unlocked:{qingyun:1},zones:{qingyun:{tree:{}}},
    events:{},settings:{plan:'harvest',tab:'train'},stats:{}
  }));
  debug.begin();
  for(let decision=0;decision<120&&snapshot().phase==='run';decision++){
    const current=snapshot();
    if(current.elapsed>16){
      debug.moveTo(350,438);
    }else{
      const herbs=current.objects.filter(object=>object.type==='h');
      herbs.sort((left,right)=>
        Math.hypot(left.x-current.P.x,left.y-current.P.y)-Math.hypot(right.x-current.P.x,right.y-current.P.y));
      if(herbs[0])debug.moveTo(herbs[0].x,herbs[0].y);
    }
    step(.2);
  }
  const result=snapshot();
  if(result.phase==='run')debug.finish('collapse');
  const finished=snapshot();
  if(finished.M.stats.totalSafe)mortalReturns++;
  if(finished.M.herb>=8)mortalProgress++;
}
assert.ok(mortalReturns>=15,`first-run safe return rate is viable (${mortalReturns}/24)`);
assert.ok(mortalProgress>=12,`first-run entry progress is viable (${mortalProgress}/24)`);

let initiateReturns=0;
let initiateStoneRuns=0;
for(let attempt=0;attempt<24;attempt++){
  randomSeed=9000+attempt*131;
  debug.replaceState(baseState({
    realm:{major:0,stage:1},cult:{atk:1,mov:1,sen:1,hp:1},skills:{},
    stone:0,herb:0,herb2:0,herb3:0,
    area:'qingyun',unlocked:{qingyun:1},zones:{qingyun:{tree:{}}},
    events:{},settings:{plan:'hunt',tab:'train'},stats:{}
  }));
  debug.begin();
  for(let decision=0;decision<120&&snapshot().phase==='run';decision++){
    const current=snapshot();
    if(current.elapsed>17||current.P.hp<=35){
      debug.moveTo(350,438);
    }else{
      const targets=current.enemies.filter(enemy=>enemy.type==='guard'||enemy.type==='chaser');
      targets.sort((left,right)=>
        Math.hypot(left.x-current.P.x,left.y-current.P.y)-Math.hypot(right.x-current.P.x,right.y-current.P.y));
      if(targets[0])debug.moveTo(targets[0].x,targets[0].y);
    }
    step(.2);
  }
  if(snapshot().phase==='run')debug.finish('collapse');
  const finished=snapshot();
  if(finished.M.stats.totalSafe)initiateReturns++;
  if(finished.M.stone>0)initiateStoneRuns++;
}
assert.ok(initiateReturns>=16,`new cultivator can disengage and return (${initiateReturns}/24)`);
assert.ok(initiateStoneRuns>=12,`starter sword art earns spirit stones (${initiateStoneRuns}/24)`);

const html=fs.readFileSync(new URL('../index.html',`file://${__filename}`),'utf8');
const freeExpedition=fs.readFileSync(new URL('../systems_v11_20.js',`file://${__filename}`),'utf8');
const panelUx=fs.readFileSync(new URL('../systems_v11_22.js',`file://${__filename}`),'utf8');
const visualUx=fs.readFileSync(new URL('../visual_v11_23.js',`file://${__filename}`),'utf8');
for(const match of code.matchAll(/\$\('#([^']+)'\)/g)){
  assert.match(html,new RegExp(`id=["']${match[1]}["']`),`HTML contains #${match[1]}`);
}
assert.match(html,/game_v11\.js/);
assert.match(html,/game_v11\.js\?v=11\.23/,'entrypoint uses the current cache-busting version');
assert.match(html,/visual_v11_23\.css\?v=11\.23/,'v11.23 visual theme is loaded');
assert.match(html,/visual_v11_23\.js\?v=11\.23/,'v11.23 visual state layer is loaded last');
assert.doesNotMatch(html,/game_v10\.js|late_warning\.js/);
assert.match(freeExpedition,/#planChoices,.expedition-plan-label,#objective\{display:none!important\}/,'removed expedition plans stay hidden');
assert.match(html,/\.controls\{position:fixed;z-index:30/,'mobile progression menu is a fixed bottom sheet');
assert.match(panelUx,/setOpen\(wasOpen&&wasActive\?false:true\)/,'active mobile tab toggles the bottom sheet');
assert.match(panelUx,/if\(dy>34\)closePanel\(\)/,'mobile panel supports the v11.22 swipe-close gesture');
assert.doesNotMatch(visualUx,/replaceState|localStorage|sessionStorage/,'visual layer does not mutate progression or saves');
assert.match(code,/addEventListener\('dblclick'.*preventDefault/,'double-tap zoom prevention is installed');
assert.match(html,/id="treeDetail" class="tree-detail"/,'affinity tree has a dedicated node detail panel');
assert.match(code,/className='tree-node-wrap'/,'affinity upgrades render as connected nodes');
assert.match(html,/id="treeViewport" class="tree-viewport"/,'affinity tree uses a dedicated pan and zoom viewport');
assert.match(code,/treeCamera\.pointers/,'affinity tree supports pointer pan and pinch state');
assert.match(code,/zoomTreeAt\(event\.clientX,event\.clientY,1\.3\)/,'affinity tree supports double-tap zoom');
assert.match(code,/closest\?\.\('\.tree-camera'\)/,'tree camera buttons are excluded from drag capture');

console.log(`v11 regression: 38 assertions passed; mortal ${mortalReturns}/24 safe, ${mortalProgress}/24 entry-ready; initiate ${initiateReturns}/24 safe, ${initiateStoneRuns}/24 with stones`);
