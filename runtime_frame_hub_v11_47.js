(()=>{
'use strict';
const VERSION='11.49.4';
const ACTIVE_FPS=60;
const IDLE_FPS=8;
if(window.__xianxiaFrameHub?.version===VERSION)return;

const subscribers=new Map();
let ordered=[];
let dirty=true;
let rafId=0;
let frames=0;
let rafCallbacks=0;
let snapshots=0;
let lastSnapshot=null;
let orderSeq=0;
let lastRaf=0;
let accumulator=0;
let forceNext=true;

function rebuild(){
  ordered=[...subscribers.values()].sort((a,b)=>a.priority-b.priority||a.order-b.order);
  dirty=false;
}
function subscribe(name,fn,priority=100){
  if(typeof fn!=='function')throw new TypeError('frame subscriber must be a function');
  const key=String(name||`subscriber-${++orderSeq}`);
  subscribers.set(key,{name:key,fn,priority:+priority||0,order:++orderSeq});
  dirty=true;
  wake();
  return ()=>{if(subscribers.delete(key)){dirty=true;wake()}};
}
function captureSnapshot(){
  try{
    const D=window.__xianxiaDebug;
    if(!D)return null;
    const provider=typeof D.frameSnapshot==='function'?D.frameSnapshot:D.snapshot;
    if(typeof provider!=='function')return null;
    snapshots++;
    return provider.call(D);
  }catch(error){
    console.warn('[frame-hub] snapshot failed',error);
    return null;
  }
}
function invoke(sub,snapshot,meta){
  try{sub.fn(snapshot,meta)}
  catch(error){console.error(`[frame-hub] ${sub.name} failed`,error)}
}
function schedule(){
  if(document.hidden||rafId)return;
  rafId=requestAnimationFrame(frame);
}
function wake(){
  forceNext=true;
  schedule();
}
function frame(now){
  rafId=0;
  if(document.hidden)return;
  rafCallbacks++;
  const delta=lastRaf?Math.min(250,Math.max(0,now-lastRaf)):1000/ACTIVE_FPS;
  lastRaf=now;
  accumulator+=delta;

  const wasActive=lastSnapshot?.phase==='run';
  const interval=1000/(wasActive?ACTIVE_FPS:IDLE_FPS);
  if(!forceNext&&accumulator+.01<interval){
    schedule();
    return;
  }
  accumulator=accumulator>=interval?accumulator%interval:0;
  forceNext=false;
  frames++;
  if(dirty)rebuild();

  const preMeta={now,frame:frames,stage:'pre',targetFps:wasActive?ACTIVE_FPS:IDLE_FPS};
  for(const sub of ordered)if(sub.priority<0)invoke(sub,lastSnapshot,preMeta);

  lastSnapshot=captureSnapshot();
  const active=lastSnapshot?.phase==='run';
  const postMeta={now,frame:frames,stage:'post',targetFps:active?ACTIVE_FPS:IDLE_FPS};
  for(const sub of ordered)if(sub.priority>=0)invoke(sub,lastSnapshot,postMeta);
  schedule();
}
function stats(){
  if(dirty)rebuild();
  return {
    version:VERSION,
    frames,
    rafCallbacks,
    snapshots,
    activeFps:ACTIVE_FPS,
    idleFps:IDLE_FPS,
    hidden:document.hidden,
    subscribers:ordered.map(x=>({name:x.name,priority:x.priority})),
    running:!!rafId
  };
}
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){
    if(rafId)cancelAnimationFrame(rafId);
    rafId=0;
    lastRaf=0;
    accumulator=0;
    return;
  }
  lastRaf=0;
  accumulator=0;
  forceNext=true;
  schedule();
});

window.__xianxiaFrameHub={
  version:VERSION,
  subscribe,
  wake,
  stats,
  get snapshot(){return lastSnapshot}
};
schedule();
})();
