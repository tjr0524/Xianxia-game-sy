(()=>{
'use strict';
const VERSION='11.50.15-node-native-click';
if(window.__xianxiaTreeCameraGesture?.version===VERSION)return;
window.__xianxiaTreeCameraGesture={version:VERSION};

const CONFIG={
  asc:{view:'#ascViewport',world:'#ascWorld',w:1200,h:1780,min:.28,max:1.7,focusScale:.96},
  map:{view:'#mapViewport',world:'#mapWorld',w:1520,h:820,min:.28,max:1.7,focusScale:.78}
};
const cams={};
const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let blockAutoFitUntil=0;

function makeCam(kind){
  const q=CONFIG[kind];
  return cams[kind]||(cams[kind]={kind,...q,x:0,y:0,s:.6,ready:false,initialized:false,userAdjusted:false,pointers:new Map(),base:null,moved:false,dragUntil:0});
}
function elements(c){return{view:$(c.view),world:$(c.world)}}
function matrixState(world){
  if(!world)return null;
  const raw=getComputedStyle(world).transform;
  if(!raw||raw==='none')return null;
  try{
    const m=new DOMMatrixReadOnly(raw);
    const s=Math.hypot(m.a,m.b)||1;
    return{x:m.e,y:m.f,s};
  }catch{return null}
}
function syncFromDom(c,force=false){
  const {world}=elements(c);if(!world)return false;
  if(c.ready&&!force)return true;
  const m=matrixState(world);
  if(m){c.x=m.x;c.y=m.y;c.s=clamp(m.s,c.min,c.max);c.ready=true;return true}
  return false;
}
function bounds(c){
  const {view}=elements(c);if(!view)return null;
  const r=view.getBoundingClientRect();
  return{w:r.width,h:r.height,r};
}
function constrain(c){
  const b=bounds(c);if(!b||b.w<20||b.h<20)return;
  const margin=56;
  const ww=c.w*c.s,hh=c.h*c.s;
  if(ww<=b.w){c.x=(b.w-ww)/2}else c.x=clamp(c.x,b.w-margin-ww,margin);
  if(hh<=b.h){c.y=(b.h-hh)/2}else c.y=clamp(c.y,b.h-margin-hh,margin);
}
function apply(c){
  const {world}=elements(c);if(!world)return;
  constrain(c);
  world.style.transform=`translate(${c.x}px,${c.y}px) scale(${c.s})`;
  c.ready=true;
}
function focusPoint(c,wx,wy,scale=c.focusScale){
  const b=bounds(c);if(!b||b.w<40)return false;
  c.s=clamp(scale,c.min,c.max);
  c.x=b.w/2-wx*c.s;
  c.y=b.h/2-wy*c.s;
  apply(c);
  c.initialized=true;
  return true;
}
function fit(c){
  const b=bounds(c);if(!b||b.w<40)return;
  c.s=clamp(Math.min(.9,(b.w-18)/c.w,(b.h-18)/c.h),c.min,c.max);
  c.x=(b.w-c.w*c.s)/2;c.y=(b.h-c.h*c.s)/2;
  apply(c);c.userAdjusted=true;c.initialized=true;
}
function zoom(c,factor){
  syncFromDom(c,true);
  const b=bounds(c);if(!b)return;
  const cx=b.w/2,cy=b.h/2;
  const wx=(cx-c.x)/c.s,wy=(cy-c.y)/c.s;
  const ns=clamp(c.s*factor,c.min,c.max);
  c.x=cx-wx*ns;c.y=cy-wy*ns;c.s=ns;
  apply(c);c.userAdjusted=true;c.initialized=true;
}
function nodePoint(node){
  const x=parseFloat(node?.style?.left),y=parseFloat(node?.style?.top);
  return Number.isFinite(x)&&Number.isFinite(y)?{x,y}:null;
}
function currentTrainingPoint(){
  const current=$('#ascWorld .asc-stage.current')||$('#ascWorld .asc-stage.available')||$('#ascWorld .asc-stage.root');
  return nodePoint(current)||{x:600,y:1690};
}
function trainingFocusScale(){return (window.innerWidth||390)<=560?.98:1.05}
function initialFocus(){
  const c=makeCam('asc'),m=makeCam('map');
  if(elements(c).view&&!c.initialized){
    syncFromDom(c,true);
    const p=currentTrainingPoint();
    focusPoint(c,p.x,p.y,trainingFocusScale());
  }
  if(elements(m).view&&!m.initialized){
    syncFromDom(m,true);
    // Keep the map's own area focus on first load; only take ownership of its state.
    if(m.ready)m.initialized=true;
  }
}
function localPoint(c,e){
  const {view}=elements(c);if(!view)return{x:0,y:0};
  const r=view.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};
}
function setBaseline(c){
  const ps=[...c.pointers.values()];
  if(!ps.length){c.base=null;return}
  if(ps.length===1){
    const p=ps[0];c.base={n:1,x:p.x,y:p.y,camX:c.x,camY:c.y,s:c.s};return;
  }
  const a=ps[0],b=ps[1],cx=(a.x+b.x)/2,cy=(a.y+b.y)/2,d=Math.max(1,Math.hypot(a.x-b.x,a.y-b.y));
  c.base={n:2,cx,cy,d,camX:c.x,camY:c.y,s:c.s,wx:(cx-c.x)/c.s,wy:(cy-c.y)/c.s};
}
function clearPointers(c){
  c.pointers.clear();c.base=null;c.moved=false;
}
function cameraForTarget(target){
  if(target?.closest?.('#ascViewport'))return makeCam('asc');
  if(target?.closest?.('#mapViewport'))return makeCam('map');
  return null;
}
function cameraForPointer(e){
  return cameraForTarget(e.target)||Object.values(cams).find(c=>c.pointers.has(e.pointerId))||null;
}
function interactiveInside(target){return !!target?.closest?.('.camera,.v17float,.detail-popover38,.detail-action,.detail-close38')}

// Own viewport pointers before legacy handlers. Safari can otherwise leave one handler
// believing a finger is still down while another has already ended the gesture.
document.addEventListener('pointerdown',e=>{
  const c=cameraForTarget(e.target);if(!c||interactiveInside(e.target))return;
  syncFromDom(c,true);
  const p=localPoint(c,e);
  const startedOnNode=!!e.target.closest?.('.asc-node,.map-node');
  c.pointers.set(e.pointerId,{x:p.x,y:p.y,startX:p.x,startY:p.y,startedOnNode,captured:false});
  c.moved=false;
  setBaseline(c);
  // A plain node tap must reach the native button. Own background drags immediately,
  // but defer node pointer capture until movement crosses the drag threshold.
  if(!startedOnNode){
    e.stopImmediatePropagation();
    try{elements(c).view?.setPointerCapture(e.pointerId);c.pointers.get(e.pointerId).captured=true}catch{}
  }
},true);

document.addEventListener('pointermove',e=>{
  const c=cameraForPointer(e);if(!c||!c.pointers.has(e.pointerId))return;
  const p=localPoint(c,e),old=c.pointers.get(e.pointerId);
  old.x=p.x;old.y=p.y;
  if(Math.hypot(p.x-old.startX,p.y-old.startY)>7){
    c.moved=true;
    if(old.startedOnNode&&!old.captured){
      try{elements(c).view?.setPointerCapture(e.pointerId);old.captured=true}catch{}
    }
  }
  // Before the threshold, leave node pointer events untouched so Safari can synthesize
  // the normal button click. Once it is a real drag, the camera owns the gesture.
  if(!old.startedOnNode||c.moved){e.stopImmediatePropagation();e.preventDefault()}
  const ps=[...c.pointers.values()],base=c.base;
  if(!base)return;
  if(ps.length===1&&base.n===1){
    const q=ps[0];c.x=base.camX+(q.x-base.x);c.y=base.camY+(q.y-base.y);
  }else if(ps.length>=2&&base.n===2){
    const a=ps[0],b=ps[1],cx=(a.x+b.x)/2,cy=(a.y+b.y)/2,d=Math.max(1,Math.hypot(a.x-b.x,a.y-b.y));
    const ns=clamp(base.s*d/base.d,c.min,c.max);
    c.x=cx-base.wx*ns;c.y=cy-base.wy*ns;c.s=ns;c.moved=true;
  }else{
    // Finger count changed (1→2 or 2→1): reset the gesture origin instead of
    // continuing from the stale pinch distance.
    setBaseline(c);return;
  }
  apply(c);
},true);

function pointerEnd(e){
  const c=cameraForPointer(e);if(!c||!c.pointers.has(e.pointerId))return;
  const ended=c.pointers.get(e.pointerId),wasDrag=!!c.moved;
  // Do not swallow pointerup for an unmoved node tap; its native click/onclick must fire.
  if(!ended?.startedOnNode||wasDrag)e.stopImmediatePropagation();
  c.pointers.delete(e.pointerId);
  if(wasDrag){c.dragUntil=performance.now()+420;c.userAdjusted=true;c.initialized=true}
  setBaseline(c);
  if(!c.pointers.size)c.moved=false;
  if(ended?.captured){try{elements(c).view?.releasePointerCapture(e.pointerId)}catch{}}
}
document.addEventListener('pointerup',pointerEnd,true);
document.addEventListener('pointercancel',pointerEnd,true);
document.addEventListener('lostpointercapture',pointerEnd,true);

// Suppress only the click generated by an actual drag/pinch. Manual camera buttons
// still work. The mobile panel code used to synthesize an "전체" click every time a
// bottom tab opened; block only that synthetic fit click so the user's view is kept.
document.addEventListener('click',e=>{
  const c=cameraForTarget(e.target);if(!c)return;
  if(performance.now()<c.dragUntil){
    e.preventDefault();e.stopImmediatePropagation();c.dragUntil=0;return;
  }
  const btn=e.target.closest?.('.camera button');
  if(btn){
    const action=btn.dataset.c||btn.dataset.m;
    if(action==='fit'&&!e.isTrusted&&performance.now()<blockAutoFitUntil){
      e.preventDefault();e.stopImmediatePropagation();return;
    }
    e.preventDefault();e.stopImmediatePropagation();
    if(action==='fit')fit(c);else if(action==='in')zoom(c,1.2);else if(action==='out')zoom(c,1/1.2);
    return;
  }
},true);

// Returning to a bottom tab should preserve the camera. On the first opening only,
// centre the current training realm at a useful close scale instead of fitting all tiers.
document.addEventListener('click',e=>{
  const tab=e.target.closest?.('.tab-btn[data-tab="train"],.tab-btn[data-tab="tree"]');if(!tab)return;
  blockAutoFitUntil=performance.now()+900;
  const c=tab.dataset.tab==='train'?makeCam('asc'):makeCam('map');
  syncFromDom(c,true);
  const hadView=c.initialized;
  const saved={x:c.x,y:c.y,s:c.s};
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    if(hadView){
      c.x=saved.x;c.y=saved.y;c.s=saved.s;apply(c);return;
    }
    if(c.kind==='asc'){
      const p=currentTrainingPoint();
      if(focusPoint(c,p.x,p.y,trainingFocusScale()))return;
    }
    syncFromDom(c,true);c.initialized=true;
  }));
},true);

function resetAllPointers(){for(const c of Object.values(cams))clearPointers(c)}
window.addEventListener('blur',resetAllPointers,true);
document.addEventListener('visibilitychange',()=>{if(document.hidden)resetAllPointers()},true);
window.addEventListener('pagehide',resetAllPointers,true);

const style=document.createElement('style');
style.id='tree-camera-gesture-v11-45';
style.textContent=`#ascViewport,#mapViewport{touch-action:none!important;overscroll-behavior:contain!important}#ascViewport .asc-node,#mapViewport .map-node{touch-action:none!important}`;
(document.head||document.documentElement).appendChild(style);

function scheduleInitialFocus(){
  requestAnimationFrame(()=>requestAnimationFrame(initialFocus));
}
if(document.readyState!=='loading')scheduleInitialFocus();
else document.addEventListener('DOMContentLoaded',scheduleInitialFocus,{once:true});
window.addEventListener('load',scheduleInitialFocus,{once:true});
document.addEventListener('xianxia:panel-open',scheduleInitialFocus,true);
setTimeout(scheduleInitialFocus,250);
setTimeout(scheduleInitialFocus,800);
})();