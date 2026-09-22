'use strict';
// Execute the shipped simulation and frame hub, including the initial render.
// A live preset change alone misses the saved-area cold-start failure.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(process.argv[2]||path.join(__dirname,'..'));
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const SAVE_KEY='xianxia_proto_v11';

class Element{
  constructor(){
    this.children=[];this.dataset={};this.style={setProperty(){}};
    this.textContent='';this.innerHTML='';this.clientWidth=700;this.clientHeight=460;
    this.scrollWidth=700;this.scrollHeight=460;
    const classes=new Set();
    this.classList={add:(...xs)=>xs.forEach(x=>classes.add(x)),remove:(...xs)=>xs.forEach(x=>classes.delete(x)),
      contains:x=>classes.has(x),toggle(x,on){on=on??!classes.has(x);on?classes.add(x):classes.delete(x);return on}};
    this.listeners=new Map();
  }
  appendChild(x){this.children.push(x);return x}
  append(...xs){this.children.push(...xs)}
  remove(){}
  setAttribute(){}
  addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,[]);this.listeners.get(type).push(fn)}
  dispatchEvent(event){for(const fn of this.listeners.get(event.type)||[])fn(event)}
  getBoundingClientRect(){return {left:0,top:0,width:700,height:460}}
  querySelector(){return null}
  querySelectorAll(){return []}
}

function boot(saved,{failTreeRender=false}={}){
  const elements=new Map();
  const el=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id)};
  const ctx=new Proxy({}, {get:(o,k)=>o[k]??(o[k]=k==='createLinearGradient'||k==='createRadialGradient'
    ?()=>({addColorStop(){}}):k==='measureText'?s=>({width:String(s).length*7}):()=>{})});
  el('cv').getContext=()=>ctx;
  const tabs=['train','skills','areas','tree'].map(tab=>{const e=new Element();e.dataset.tab=tab;return e});
  const panels=tabs.map(t=>{const e=new Element();e.dataset.panel=t.dataset.tab;return e});
  const document=new Element();
  Object.assign(document,{hidden:false,body:new Element(),head:new Element(),readyState:'complete',
    querySelector:s=>s.startsWith('#')?el(s.slice(1)):s==='.controls'?el('controls'):null,
    querySelectorAll:s=>s==='.tab-btn'?tabs:s==='.panel'?panels:[],createElement:()=>new Element()});
  if(failTreeRender)Object.defineProperty(el('tree'),'innerHTML',{set(){throw new Error('injected tree render failure')}});
  const storage=new Map(saved?[[SAVE_KEY,JSON.stringify(saved)]]:[]),raf=new Map(),errors=[];
  let now=100,seq=0,randomSeed=24681357;
  const seededMath=Object.create(Math);
  seededMath.random=()=>{randomSeed=(randomSeed*1664525+1013904223)>>>0;return randomSeed/4294967296};
  const sandbox={document,Math:seededMath,performance:{now:()=>now},
    localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)},
    console:{log(){},info(){},warn:(...xs)=>errors.push(xs.join(' ')),error:(...xs)=>errors.push(xs.join(' '))},
    requestAnimationFrame:fn=>{raf.set(++seq,fn);return seq},cancelAnimationFrame:id=>raf.delete(id),
    setInterval(){},setTimeout(){},clearTimeout(){},matchMedia:()=>({matches:false}),
    addEventListener(){},CustomEvent:class{constructor(type,init={}){this.type=type;this.detail=init.detail}},
    location:{reload(){}},confirm:()=>false};
  sandbox.window=sandbox;
  vm.createContext(sandbox);
  let startupError=null;
  for(const file of ['runtime_frame_hub_v11_47.js','foundation_content_v11_50.js','game_runtime_v11_45.js','mastery_runtime_v11_51.js']){
    try{vm.runInContext(read(file),sandbox,{filename:file,timeout:5000})}catch(e){startupError??=e}
  }
  function frames(count){
    for(let i=0;i<count;i++){
      now+=1000/60;
      const callbacks=[...raf.values()];raf.clear();
      for(const fn of callbacks)fn(now);
    }
  }
  return {D:sandbox.__xianxiaDebug,hub:sandbox.__xianxiaFrameHub,startupError,errors,storage,frames,el,document};
}

function savedArea(area,stage){
  const areas=['qingyun','blackwind','blood','foundation_trial','thunder','marsh','taixu'];
  return {stone:12345,herb:17,herb2:4,herb3:3,thunderMark:12,purpleEssence:8,taixuSigil:2,
    area,realm:{major:area==='foundation_trial'?0:1,stage},
    cult:{atk:300,mov:220,sen:30,hp:2190},skills:{sword:{u:1,pow:2}},
    unlocked:Object.fromEntries(areas.map(id=>[id,1])),
    zones:Object.fromEntries(areas.map(id=>[id,{tree:{eco1:3,fate1:3,res1:3,miasma1:3,formation1:3},runs:6,safe:4,eliteWins:2,bestStone:100,bestHerb:10,bestKills:5}])),
    settings:{plan:'hunt',tab:'tree'},events:{foundationInsight:1,foundationTrialCompleted:1},
    stats:{totalRuns:42,totalSafe:28,totalKills:123},trainingNodes:{f1_atk:1},
    formationSkills:{version:1,daoMarks:7,ranks:{shield:2,dash:2,burst:2},traits:{}}};
}

let failed=0;
function test(name,fn){try{fn();console.log('PASS '+name)}catch(e){failed++;console.error('FAIL '+name+'\n'+e.stack)}}
function verifyMovement(runtime){
  const {D,hub,frames}=runtime;
  assert.ok(hub.stats().subscribers.some(s=>s.name==='game-simulation'),'simulation must register on boot');
  D.begin();
  const start=D.snapshot();
  assert.equal(start.phase,'run');
  D.moveTo(start.P.x+300,start.P.y);
  frames(60);
  const after=D.snapshot();
  assert.ok(after.elapsed>.8,'countdown advances through the real frame hub');
  assert.ok(after.P.x>start.P.x+20,'movement advances through the real frame hub');
  assert.notEqual(runtime.el('time').textContent,'25.0초');
  assert.equal(runtime.errors.length,0,runtime.errors.join('\n'));
}

for(const [area,stage] of [['qingyun',1],['blackwind',1],['blood',1],['foundation_trial',9],['thunder',1],['marsh',4],['marsh',6],['taixu',7],['taixu',8],['taixu',9]]){
  test('saved '+area+' / stage '+stage+' cold start, movement, next run and reload',()=>{
    const saved=savedArea(area,stage),runtime=boot(saved);
    assert.ifError(runtime.startupError);
    const restored=runtime.D.snapshot().M;
    for(const key of ['stone','herb','herb2','herb3','thunderMark','purpleEssence','taixuSigil','area'])assert.equal(restored[key],saved[key],'preserve '+key);
    for(const key of ['realm','cult','zones','trainingNodes','formationSkills','stats'])assert.equal(JSON.stringify(restored[key]),JSON.stringify(saved[key]),'preserve '+key);
    verifyMovement(runtime);
    runtime.D.finish('return');
    verifyMovement(runtime);
    const reloaded=boot(JSON.parse(runtime.storage.get(SAVE_KEY)));
    assert.ifError(reloaded.startupError);
    verifyMovement(reloaded);
  });
}
test('fresh mortal save still moves',()=>{const r=boot(null);assert.ifError(r.startupError);verifyMovement(r)});
test('UI failure cannot prevent simulation registration',()=>{
  const r=boot(savedArea('qingyun',1),{failTreeRender:true});
  assert.match(r.startupError?.message||'',/injected tree render failure/);
  verifyMovement(r);
});
test('hidden tab pauses and visible tab resumes without resetting the save',()=>{
  const r=boot(savedArea('thunder',1));assert.ifError(r.startupError);verifyMovement(r);
  const before=r.D.snapshot().elapsed;
  r.document.hidden=true;r.document.dispatchEvent({type:'visibilitychange'});r.frames(120);
  assert.equal(r.D.snapshot().elapsed,before);
  r.document.hidden=false;r.document.dispatchEvent({type:'visibilitychange'});r.frames(10);
  assert.ok(r.D.snapshot().elapsed>before);
  assert.ok(r.D.snapshot().elapsed-before<.4,'no hidden-time catch-up');
});
if(failed)process.exitCode=1;
else console.log('Saved-area startup regression: all checks passed.');
