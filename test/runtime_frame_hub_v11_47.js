(()=>{
'use strict';
const VERSION='11.49.2';
if(window.__xianxiaFrameHub?.version===VERSION)return;

const subscribers=new Map();
let ordered=[];
let dirty=true;
let rafId=0;
let frames=0;
let snapshots=0;
let lastSnapshot=null;
let orderSeq=0;

function rebuild(){
  ordered=[...subscribers.values()].sort((a,b)=>a.priority-b.priority||a.order-b.order);
  dirty=false;
}
function subscribe(name,fn,priority=100){
  if(typeof fn!=='function')throw new TypeError('frame subscriber must be a function');
  const key=String(name||`subscriber-${++orderSeq}`);
  subscribers.set(key,{name:key,fn,priority:+priority||0,order:++orderSeq});
  dirty=true;
  return ()=>{if(subscribers.delete(key))dirty=true};
}
function captureSnapshot(){
  try{
    const D=window.__xianxiaDebug;
    if(!D?.snapshot)return null;
    snapshots++;
    return D.snapshot();
  }catch(error){
    console.warn('[frame-hub] snapshot failed',error);
    return null;
  }
}
function schedule(){rafId=requestAnimationFrame(frame)}
function frame(now){
  frames++;
  if(dirty)rebuild();
  lastSnapshot=captureSnapshot();
  const meta={now,frame:frames};
  for(const sub of ordered){
    try{sub.fn(lastSnapshot,meta)}
    catch(error){console.error(`[frame-hub] ${sub.name} failed`,error)}
  }
  schedule();
}
function stats(){
  if(dirty)rebuild();
  return {
    version:VERSION,
    frames,
    snapshots,
    subscribers:ordered.map(x=>({name:x.name,priority:x.priority})),
    running:!!rafId
  };
}
window.__xianxiaFrameHub={version:VERSION,subscribe,stats,get snapshot(){return lastSnapshot}};
schedule();
})();
