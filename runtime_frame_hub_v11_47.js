(()=>{
'use strict';
const VERSION='11.49.6';
const ACTIVE_FPS=60;
const IDLE_FPS=0;
const FRAME_MS=1000/ACTIVE_FPS;
if(window.__xianxiaFrameHub?.version===VERSION)return;

const subscribers=new Map();
let ordered=[];
let dirty=true;
let rafId=0;
let frames=0;
let rafCallbacks=0;
let snapshots=0;
let skipped=0;
let lastSnapshot=null;
let orderSeq=0;
let lastDispatch=0;
let lastFrameWall=Date.now();
let forceNext=true;

function rebuild(){
  ordered=[...subscribers.values()].sort((a,b)=>a.priority-b.priority||a.order-b.order);
  dirty=false;
}
function subscribe(name,fn,priority=100){
  if(typeof fn!=='function')throw new TypeError('frame subscriber must be a function');
  const key=String(name||`subscriber-${++orderSeq}`);
  subscribers.set(key,{name:key,fn,priority:+priority||0,order:++orderSeq});
  dirty=true;wake();
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
  lastFrameWall=Date.now();

  const wasActive=lastSnapshot?.phase==='run';
  if(wasActive&&!forceNext&&lastDispatch&&now-lastDispatch<FRAME_MS-.35){
    skipped++;
    schedule();
    return;
  }
  forceNext=false;
  lastDispatch=now;
  frames++;
  if(dirty)rebuild();

  const preMeta={now,frame:frames,stage:'pre',targetFps:wasActive?ACTIVE_FPS:IDLE_FPS};
  for(const sub of ordered)if(sub.priority<0)invoke(sub,lastSnapshot,preMeta);

  lastSnapshot=captureSnapshot();
  const active=lastSnapshot?.phase==='run';
  const postMeta={now,frame:frames,stage:'post',targetFps:active?ACTIVE_FPS:IDLE_FPS};
  for(const sub of ordered)if(sub.priority>=0)invoke(sub,lastSnapshot,postMeta);

  if(active)schedule();
}
function stats(){
  if(dirty)rebuild();
  return {
    version:VERSION,frames,rafCallbacks,snapshots,skipped,
    activeFps:ACTIVE_FPS,idleFps:IDLE_FPS,hidden:document.hidden,
    subscribers:ordered.map(x=>({name:x.name,priority:x.priority})),
    running:!!rafId,
    idleEventDriven:IDLE_FPS===0
  };
}
for(const type of ['pointerdown','click','keydown']){
  document.addEventListener(type,()=>{if(lastSnapshot?.phase!=='run')wake()},{capture:true,passive:true});
}
window.addEventListener('resize',wake,{passive:true});
function suspend(){
  if(rafId)cancelAnimationFrame(rafId);
  rafId=0;lastDispatch=0;
}
function resume(){
  lastDispatch=0;lastFrameWall=Date.now();forceNext=true;schedule();
}
document.addEventListener('visibilitychange',()=>document.hidden?suspend():resume());
window.addEventListener('pagehide',suspend,{passive:true});
window.addEventListener('pageshow',resume,{passive:true});
window.addEventListener('focus',resume,{passive:true});

// Safari에서 navigation/BFCache 뒤 rAF가 드물게 멈춘 채 남는 경우를 복구한다.
setInterval(()=>{
  if(document.hidden)return;
  const stale=Date.now()-lastFrameWall>1400;
  if(rafId&&stale){
    cancelAnimationFrame(rafId);
    rafId=0;forceNext=true;schedule();
    return;
  }
  if(!rafId&&lastSnapshot?.phase==='run')schedule();
},700);

window.__xianxiaFrameHub={
  version:VERSION,subscribe,wake,stats,
  get snapshot(){return lastSnapshot}
};
schedule();
})();
