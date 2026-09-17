(()=>{
'use strict';
const VERSION='11.48.0';
const IOS_WEBKIT=/iP(?:hone|ad|od)/.test(navigator.userAgent)&&/WebKit/i.test(navigator.userAgent);
if(!IOS_WEBKIT||window.__xianxiaIosStability?.version===VERSION)return;

const ACTIVE_SCALE=.5;
const TARGET_FRAME_MS=40; // 25 fps visual layer; game simulation keeps its normal RAF.
let installed=false;
let lastPhase='';
let lastDrawAt=0;
let skipVisualFrame=false;

function phase(){
  try{return window.__xianxiaDebug?.snapshot?.()?.phase||'home'}catch{return'home'}
}
function patchInkContext(ctx){
  if(!ctx||ctx.__iosStable48)return;
  try{Object.defineProperty(ctx,'__iosStable48',{value:true})}catch{return}
  const methods=['clearRect','drawImage','fillRect','strokeRect','beginPath','closePath','moveTo','lineTo','quadraticCurveTo','bezierCurveTo','arc','ellipse','fill','stroke','save','restore','translate','scale','rotate','fillText','strokeText','setLineDash'];
  for(const name of methods){
    if(typeof ctx[name]!=='function')continue;
    const raw=ctx[name].bind(ctx);
    ctx[name]=function(...args){
      if(name==='clearRect'){
        const running=phase()==='run';
        const now=performance.now();
        skipVisualFrame=!running||(now-lastDrawAt<TARGET_FRAME_MS);
        if(!skipVisualFrame)lastDrawAt=now;
      }
      if(skipVisualFrame)return;
      return raw(...args);
    };
  }
}
function resizeInkForPhase(runtime,p){
  const c=runtime?.layer,ctx=runtime?.ctx;
  if(!c||!ctx)return;
  if(p==='run'){
    const w=Math.round(1800*ACTIVE_SCALE),h=Math.round(2400*ACTIVE_SCALE);
    if(c.width!==w||c.height!==h){
      c.width=w;c.height=h;
      ctx.setTransform(ACTIVE_SCALE,0,0,ACTIVE_SCALE,0,0);
      ctx.imageSmoothingEnabled=true;
    }
  }else if(c.width!==1||c.height!==1){
    c.width=1;c.height=1;
    ctx.setTransform(1,0,0,1,0,0);
  }
}
function freeBaseCanvas(){
  const cv=document.querySelector('#cv');
  if(!cv||cv.dataset.iosStable48)return;
  cv.dataset.iosStable48='1';
  // The ink layer owns gameplay visuals on iOS. Keep the legacy canvas as a tiny
  // event surface so its 1800x2400 backing store and 60-fps painter cannot exhaust Safari.
  cv.width=1;cv.height=1;
}
function install(){
  if(installed)return true;
  const runtime=window.__xianxiaInkRuntime;
  const D=window.__xianxiaDebug;
  if(!runtime?.ready||!runtime.ctx||!runtime.layer||!D)return false;
  installed=true;
  patchInkContext(runtime.ctx);
  freeBaseCanvas();
  lastPhase=phase();
  resizeInkForPhase(runtime,lastPhase);
  console.info('[ios-stability] low-memory renderer enabled',VERSION);
  return true;
}
function tick(){
  if(!installed){install();requestAnimationFrame(tick);return}
  const runtime=window.__xianxiaInkRuntime;
  const p=phase();
  if(p!==lastPhase){
    lastPhase=p;
    lastDrawAt=0;
    skipVisualFrame=false;
    resizeInkForPhase(runtime,p);
  }
  requestAnimationFrame(tick);
}

window.__xianxiaIosStability={version:VERSION,enabled:true,get phase(){return phase()},install};
requestAnimationFrame(tick);
})();
