(()=>{
'use strict';
const VERSION='11.44.0';
if(window.__xianxiaTreeCameraGesture?.version===VERSION)return;
window.__xianxiaTreeCameraGesture={version:VERSION};

const CONFIG={
  asc:{view:'#ascViewport',world:'#ascWorld',w:1200,h:1780,min:.28,max:1.7,focusScale:.86},
  map:{view:'#mapViewport',world:'#mapWorld',w:1200,h:820,min:.28,max:1.7,focusScale:.78}
};
const cams={};
const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

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
  const b=bounds(c);if(!b||b.w<40)return;
  c.s=clamp(scale,c.min,c.max);
  c.x=b.w/2-wx*c.s;
  c.y=b.h/2-wy*c.s;
  apply(c);
  c.initialized=true;
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
function initialFocus(){
  const c=makeCam('asc'),m=makeCam('map');
  if(elements(c).view&&!c.initialized){
    syncFromDom(c,true);
    const p=currentTrainingPoint();
    const scale=(window.innerWidth||390)<=560?.86:.96;
    focusPoint(c,p.x,p.y,scale);
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
function interactiveInside(target){return !!target?.closest?.('.camera,.v17float,.detail-popover38,.detail-action,.detail-close38')}

// This listener is loaded before the legacy touch shim and the original camera handlers.
// Owning viewport pointer events here prevents the two independent pointer maps from
// retaining different fingers, which caused ghost pinch/zoom reversals on Safari.
document.addEventListener('pointerdown',e=>{
  const c=cameraForTarget(e.target);if(!c||interactiveInside(e.target))return;
  e.stopImmediatePropagation();
  syncFromDom(c,true);
  const p=localPoint(c,e);
  c.pointers.set(e.pointerId,{x:p.x,y:p.y,startX:p.x,startY:p.y});
  c.moved=false;
  setBaseline(c);
  try{elements(c).view?.setPointerCapture(e.pointerId)}catch{}
},true);

document.addEventListener('pointermove',e=>{
  const c=cameraForTarget(e.target);if(!c||!c.pointers.has(e.pointerId))return;
  e.stopImmediatePropagation();e.preventDefault();
  const p=localPoint(c,e),old=c.pointers.get(e.pointerId);
  old.x=p.x;old.y=p.y;
  if(Math.hypot(p.x-old.startX,p.y-old.startY)>7)c.moved=true;
  const ps=[...c.pointers.values()],base=c.base;
  if(!base)return;
  if(ps.length===1&&base.n===1){
    const q=ps[0];c.x=base.camX+(q.x-base.x);c.y=base.camY+(q.y-base.y);
  }else if(ps.length>=2&&base.n===2){
    const a=ps[0],b=ps[1],cx=(a.x+b.x)/2,cy=(a.y+b.y)/2,d=Math.max(1,Math.hypot(a.x-b.x,a.y-b.y));
    const ns=clamp(base.s*d/base.d,c.min,c.max);
    c.x=cx-base.wx*ns;c.y=cy-base.wy*ns;c.s=ns;c.moved=true;
  }else{
    setBaseline(c);return;
  }
  apply(c);
},true);

function pointerEnd(e){
  const c=cameraForTarget(e.target);if(!c||!c.pointers.has(e.pointerId))return;
  e.stopImmediatePropagation();
  c.pointers.delete(e.pointerId);
  if(c.moved){c.dragUntil=performance.now()+420;c.userAdjusted=true;c.initialized=true}
  setBaseline(c);
  if(!c.pointers.size)c.moved=false;
  try{elements(c).view?.releasePointerCapture(e.pointerId)}catch{}
}
document.addEventListener('pointerup',pointerEnd,true);
document.addEventListener('pointercancel',pointerEnd,true);
document.addEventListener('lostpointercapture',pointerEnd,true);

// Suppress only the click generated by an actual drag/pinch. A plain node tap is left
// alone so the normal detail-window logic continues to work.
document.addEventListener('click',e=>{
  const c=cameraForTarget(e.target);if(!c)return;
  if(performance.now()<c.dragUntil){
    e.preventDefault();e.stopImmediatePropagation();c.dragUntil=0;return;
  }
  const btn=e.target.closest?.('.camera button');
  if(btn){
    e.preventDefault();e.stopImmediatePropagation();
    const action=btn.dataset.c||btn.dataset.m;
    if(action==='fit')fit(c);else if(action==='in')zoom(c,1.2);else if(action==='out')zoom(c,1/1.2);
    return;
  }
  const stage=e.target.closest?.('#ascWorld .asc-stage');
  if(stage&&c.kind==='asc'){
    const p=nodePoint(stage);if(!p)return;
    const keep=Math.max(c.s,(window.innerWidth||390)<=560?.86:.96);
    requestAnimationFrame(()=>focusPoint(c,p.x,p.y,keep));
  }
},true);

// The old tab handler recentres the whole tree every time the tab is pressed. Restore
// the user's camera immediately afterwards; first entry is handled by initialFocus().
document.addEventListener('click',e=>{
  const tab=e.target.closest?.('.tab-btn[data-tab="train"],.tab-btn[data-tab="tree"]');if(!tab)return;
  const c=tab.dataset.tab==='train'?makeCam('asc'):makeCam('map');
  if(!c.initialized)return;
  const saved={x:c.x,y:c.y,s:c.s};
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    c.x=saved.x;c.y=saved.y;c.s=saved.s;apply(c);
  }));
},true);

function resetAllPointers(){for(const c of Object.values(cams))clearPointers(c)}
window.addEventListener('blur',resetAllPointers,true);
document.addEventListener('visibilitychange',()=>{if(document.hidden)resetAllPointers()},true);

const style=document.createElement('style');
style.id='tree-camera-gesture-v11-44';
style.textContent=`#ascViewport,#mapViewport{touch-action:none!important;overscroll-behavior:contain!important}#ascViewport .asc-node,#mapViewport .map-node{touch-action:none!important}`;
(document.head||document.documentElement).appendChild(style);

const observer=new MutationObserver(()=>{
  if($('#ascViewport')||$('#mapViewport'))requestAnimationFrame(()=>requestAnimationFrame(initialFocus));
});
observer.observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState!=='loading')requestAnimationFrame(()=>requestAnimationFrame(initialFocus));
else document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(()=>requestAnimationFrame(initialFocus)),{once:true});
})();
