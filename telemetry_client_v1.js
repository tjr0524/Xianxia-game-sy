(()=> {
'use strict';

const API='https://xianxia-telemetry-api.tjr0524.workers.dev';
const CLIENT_VERSION='1.0.0';
const PLAYER_KEY='xianxia_telemetry_player_v1';
const QUEUE_KEY='xianxia_telemetry_queue_v1';
const OPTOUT_KEY='xianxia_telemetry_optout_v1';
const MAX_QUEUE=80;

let active=null;
let previousPhase=null;
let flushing=false;
let fpsToken=0;

const num=(v,f=0)=>Number.isFinite(Number(v))?Number(v):f;
const int=(v,f=0)=>Math.round(num(v,f));
const nowIso=()=>new Date().toISOString();

function enabled(){try{return localStorage.getItem(OPTOUT_KEY)!=='1'}catch{return true}}
function uuid(){
  if(globalThis.crypto?.randomUUID)return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{
    const r=Math.random()*16|0,v=c==='x'?r:(r&3|8);return v.toString(16);
  });
}
function playerId(){
  try{
    let id=localStorage.getItem(PLAYER_KEY);
    if(!id){id=uuid();localStorage.setItem(PLAYER_KEY,id)}
    return id;
  }catch{return 'session-'+uuid()}
}
function readQueue(){try{const q=JSON.parse(localStorage.getItem(QUEUE_KEY)||'[]');return Array.isArray(q)?q:[]}catch{return []}}
function writeQueue(q){try{localStorage.setItem(QUEUE_KEY,JSON.stringify(q.slice(-MAX_QUEUE)))}catch{}}
function enqueue(path,payload){
  if(!enabled())return;
  const q=readQueue();q.push({path,payload,queued_at:nowIso()});writeQueue(q);flush();
}
async function post(path,payload){
  const res=await fetch(API+path,{
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),
    mode:'cors',credentials:'omit',cache:'no-store',keepalive:true
  });
  if(!res.ok)throw new Error('telemetry http '+res.status);
  const data=await res.json().catch(()=>null);
  if(!data?.ok)throw new Error('telemetry invalid response');
}
async function flush(){
  if(flushing||!enabled()||!navigator.onLine)return;
  flushing=true;
  try{
    let q=readQueue();
    while(q.length){
      try{await post(q[0].path,q[0].payload);q.shift();writeQueue(q)}
      catch{break}
    }
  }finally{flushing=false}
}

function buildVersion(){
  return String(window.__xianxiaRuntime?.build||window.__XIANXIA_BUILD__||
    document.querySelector('#buildVersion')?.textContent?.replace(/^BUILD\s*/,'')||'unknown');
}
function snapshot(){
  try{
    const d=window.__xianxiaDebug;
    return d?.frameSnapshot?.()||d?.snapshot?.()||null;
  }catch{return null}
}
function realmName(s){
  const m=s?.M?.realm||{};
  const majors=['연기','축기','결단','원영'];
  return m.major<0?'범인':`${majors[m.major]||('경지'+m.major)} ${m.stage||1}층`;
}
function runEndReason(s){
  if(num(s?.P?.hp,1)<=0)return 'dead';
  const total=num(window.__xianxiaDebug?.constants?.RUN_TIME,25);
  if(num(s?.elapsed,0)>=total-.05)return 'collapse';
  return 'return';
}
function sanitizedSkills(m){
  const out={};
  for(const [id,v] of Object.entries(m?.skills||{})){
    out[id]={u:int(v?.u),pow:int(v?.pow),range:int(v?.range),cycle:int(v?.cycle)};
  }
  return out;
}
function deviceInfo(){
  return {
    mobile:globalThis.matchMedia?.('(pointer:coarse)')?.matches?1:0,
    screen:[int(globalThis.screen?.width),int(globalThis.screen?.height)],
    viewport:[int(innerWidth),int(innerHeight)],
    dpr:num(devicePixelRatio,1),
    cores:int(navigator.hardwareConcurrency,0),
    memory:num(navigator.deviceMemory,0)
  };
}

function startFps(runId){
  const token=++fpsToken;
  let last=performance.now(),bucketStart=last,bucketFrames=0;
  function frame(t){
    if(token!==fpsToken||!active||active.id!==runId)return;
    const dt=t-last;last=t;
    active.fps.frames++;bucketFrames++;
    if(dt>50)active.fps.longFrames++;
    if(dt>active.fps.maxFrameMs)active.fps.maxFrameMs=dt;
    const span=t-bucketStart;
    if(span>=1000){
      const rate=bucketFrames*1000/span;
      if(rate>0)active.fps.min=Math.min(active.fps.min,rate);
      bucketStart=t;bucketFrames=0;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
function beginRun(s){
  const m=s?.M||{},area=m.area||'unknown',zone=m.zones?.[area]||{},tree=zone.tree||{};
  active={
    id:uuid(),startedAt:nowIso(),perfStart:performance.now(),
    maxEnemies:0,maxHazards:0,maxActiveRare:0,tree:{...tree},
    fps:{frames:0,min:Infinity,longFrames:0,maxFrameMs:0},
    initial:{
      area,realm_major:int(m.realm?.major,-1),realm_stage:int(m.realm?.stage,1),
      realm_name:realmName(s),plan:String(m.settings?.plan||''),
      skills:sanitizedSkills(m),
      training_nodes:Object.keys(m.trainingNodes||{}).filter(k=>m.trainingNodes[k])
    }
  };
  startFps(active.id);
}
function sampleRun(s){
  if(!active)return;
  const enemies=Array.isArray(s?.enemies)?s.enemies:[];
  const hazards=Array.isArray(s?.hazards)?s.hazards:[];
  active.maxEnemies=Math.max(active.maxEnemies,enemies.filter(e=>num(e.hp)>0).length);
  active.maxHazards=Math.max(active.maxHazards,hazards.length);
  active.maxActiveRare=Math.max(active.maxActiveRare,enemies.filter(e=>e.rare||e.rareTrait).length);
}
function finishRun(s){
  if(!active)return;
  const a=active;active=null;fpsToken++;
  const r=s?.run||{},m=s?.M||{},area=a.initial.area;
  const elapsedMs=Math.max(0,Math.round(num(s?.elapsed,(performance.now()-a.perfStart)/1000)*1000));
  const fpsElapsed=Math.max(1,performance.now()-a.perfStart);
  const avgFps=a.fps.frames*1000/fpsElapsed;
  const tree=m.zones?.[area]?.tree||a.tree||{};
  enqueue('/run',{
    schema_version:1,run_id:a.id,player_id:playerId(),game_version:buildVersion(),client_version:CLIENT_VERSION,
    client_started_at:a.startedAt,area,realm_major:a.initial.realm_major,realm_stage:a.initial.realm_stage,
    realm_name:a.initial.realm_name,plan:a.initial.plan,end_reason:runEndReason(s),duration_ms:elapsedMs,
    kills_total:int(r.kills),beast_kills:int(r.beastKills),elite_kills:int(r.elite),thieves:int(r.thieves),
    mined:int(r.mined),dodges:int(r.dodges),best_combo:int(r.bestCombo),packs_activated:int(r.packActivated),
    stone_gross:int(r.s),herb0_gross:int(r.h0),herb1_gross:int(r.h1),herb2_gross:int(r.h2),
    damage_taken:num(r.damageTaken),death_source:String(r.lastDamageSource||''),
    max_enemies:int(a.maxEnemies),max_hazards:int(a.maxHazards),
    avg_fps:Math.round(avgFps*10)/10,min_fps:Number.isFinite(a.fps.min)?Math.round(a.fps.min*10)/10:null,
    long_frames:int(a.fps.longFrames),eco1:int(tree.eco1),eco2:int(tree.eco2),eco3:int(tree.eco3),
    unique_rank:Math.max(int(tree.fate1),int(tree.res1),int(tree.storm1),int(tree.unique1)),
    skill_damage:r.skillDamage||{},skill_casts:r.skillCasts||{},damage_by_source:r.damageBySource||{},
    area_tree:tree,build:{skills:a.initial.skills,training_nodes:a.initial.training_nodes},
    device:deviceInfo(),perf:{max_frame_ms:Math.round(a.fps.maxFrameMs*10)/10,max_active_rare:int(a.maxActiveRare)}
  });
}
function tick(){
  if(!enabled())return;
  const s=snapshot();if(!s)return;
  if(previousPhase===null)previousPhase=s.phase;
  if(s.phase==='run'&&previousPhase!=='run')beginRun(s);
  if(s.phase==='run'){if(!active)beginRun(s);sampleRun(s)}
  else if(previousPhase==='run'&&active)finishRun(s);
  previousPhase=s.phase;
}
function event(type,payload={}){
  if(!enabled())return;
  const s=snapshot(),m=s?.M||{};
  enqueue('/event',{
    schema_version:1,event_id:uuid(),player_id:playerId(),game_version:buildVersion(),client_version:CLIENT_VERSION,
    event_type:String(type||'event').slice(0,80),client_created_at:nowIso(),area:String(m.area||''),
    realm_major:int(m.realm?.major,-1),realm_stage:int(m.realm?.stage,1),payload
  });
}
function setEnabled(value){
  try{if(value)localStorage.removeItem(OPTOUT_KEY);else localStorage.setItem(OPTOUT_KEY,'1')}catch{}
  if(value)flush();
}
window.__xianxiaTelemetry={
  version:CLIENT_VERSION,endpoint:API,get enabled(){return enabled()},setEnabled,event,flush,
  pending:()=>readQueue().length,playerId
};
addEventListener('online',flush);
setInterval(tick,500);
setTimeout(()=>{tick();flush()},800);
})();