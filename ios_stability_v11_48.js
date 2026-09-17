(()=>{
'use strict';
const VERSION='11.49.0';
const IOS_WEBKIT=/iP(?:hone|ad|od)/.test(navigator.userAgent)&&/WebKit/i.test(navigator.userAgent);
if(!IOS_WEBKIT||window.__xianxiaIosStability?.version===VERSION)return;

const W=1800,H=2400;
const ACTIVE_SCALE=.5;
const TARGET_FRAME_MS=40; // 25 fps visual layer; simulation keeps normal RAF timing.
const BASE='assets/ink_v1/';
const AREA_ASSETS={
  qingyun:{guard:'source/qingyun_stone_boar.png',chaser:'source/qingyun_wind_wolf.png',bg:'../ink_v2/runtime/backgrounds/qingyun.webp'},
  blackwind:{guard:'source/blackwind_horned_yak.png',chaser:'source/blackwind_ink_panther.png',bg:'../ink_v2/runtime/backgrounds/blackwind.webp'},
  blood:{guard:'source/blood_armored_bear.png',chaser:'source/blood_ember_fox.png',bg:'../ink_v2/runtime/backgrounds/blood.webp'},
  thunder:{guard:'source/thunder_stone_rhino.png',chaser:'source/thunder_lightning_leopard.png',bg:'../ink_v2/runtime/backgrounds/thunder.webp'}
};
const TINY_IMAGE='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
let installed=false;
let lastPhase='';
let lastDrawAt=0;
let skipVisualFrame=false;
let activeArea='';
let areaLoadPromise=null;
let areaLoadFor='';
let wrappedDebug=false;

function phase(){
  try{return window.__xianxiaDebug?.snapshot?.()?.phase||'home'}catch{return'home'}
}
function area(){
  try{return window.__xianxiaDebug?.snapshot?.()?.M?.area||'qingyun'}catch{return'qingyun'}
}
function patchInkContext(ctx){
  if(!ctx||ctx.__iosStable49)return;
  try{Object.defineProperty(ctx,'__iosStable49',{value:true})}catch{return}
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
function resizeWorldCanvas(canvas,ctx,p,scale=ACTIVE_SCALE){
  if(!canvas||!ctx)return;
  if(p==='run'){
    const w=Math.round(W*scale),h=Math.round(H*scale);
    if(canvas.width!==w||canvas.height!==h){
      canvas.width=w;canvas.height=h;
      ctx.setTransform(scale,0,0,scale,0,0);
      ctx.imageSmoothingEnabled=true;
    }
  }else if(canvas.width!==3||canvas.height!==4){
    canvas.width=3;canvas.height=4;
    ctx.setTransform(1,0,0,1,0,0);
  }
}
function resizeInkForPhase(runtime,p){
  resizeWorldCanvas(runtime?.layer,runtime?.ctx,p,ACTIVE_SCALE);
}
function resizeGatherForPhase(p){
  const c=document.querySelector('#v1132GatherLayer');
  if(!c)return;
  const ctx=c.getContext('2d');
  resizeWorldCanvas(c,ctx,p,ACTIVE_SCALE);
}
function freeBaseCanvas(){
  const cv=document.querySelector('#cv');
  if(!cv)return;
  cv.dataset.iosStable49='1';
  if(cv.width!==3||cv.height!==4){cv.width=3;cv.height=4}
}
function disableLegacyObjectLayer(){
  const c=document.querySelector('#v27ObjectLayer');
  if(!c)return;
  if(c.width!==3||c.height!==4){c.width=3;c.height=4}
  const ctx=c.getContext('2d');
  if(!ctx||ctx.__iosStable49Noop)return;
  try{Object.defineProperty(ctx,'__iosStable49Noop',{value:true})}catch{return}
  const methods=['clearRect','drawImage','fillRect','strokeRect','beginPath','closePath','moveTo','lineTo','quadraticCurveTo','bezierCurveTo','arc','arcTo','ellipse','fill','stroke','save','restore','translate','scale','rotate','fillText','strokeText','setLineDash'];
  for(const name of methods)if(typeof ctx[name]==='function')ctx[name]=()=>{};
}
function preReadyGuard(){
  freeBaseCanvas();
  disableLegacyObjectLayer();
  resizeGatherForPhase(phase());
  const runtime=window.__xianxiaInkRuntime;
  if(runtime?.layer&&runtime?.ctx&&!runtime.ready)resizeInkForPhase(runtime,'home');
}
function loadImage(path){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=()=>reject(new Error('image restore failed: '+path));
    img.src=BASE+path+'?v='+encodeURIComponent(VERSION);
  });
}
async function ensureAreaAssets(name){
  const runtime=window.__xianxiaInkRuntime;
  const spec=AREA_ASSETS[name]||AREA_ASSETS.qingyun;
  if(!runtime?.ready||!runtime.images)return false;
  const pairs=[[`${name}_guard`,spec.guard],[`${name}_chaser`,spec.chaser],[`bg_${name}`,spec.bg]];
  if(pairs.every(([key])=>runtime.images[key]))return true;
  if(areaLoadPromise&&areaLoadFor===name)return areaLoadPromise;
  areaLoadFor=name;
  areaLoadPromise=(async()=>{
    for(const [key,path] of pairs){
      if(!runtime.images[key])runtime.images[key]=await loadImage(path);
    }
    return true;
  })().catch(error=>{console.warn('[ios-stability] area restore failed',error);return false}).finally(()=>{areaLoadPromise=null;areaLoadFor=''});
  return areaLoadPromise;
}
function releaseImage(img){
  if(!img)return;
  try{img.onload=null;img.onerror=null;img.src=TINY_IMAGE}catch(_){ }
}
function pruneInactiveAreaAssets(name){
  const runtime=window.__xianxiaInkRuntime;
  if(!runtime?.ready||!runtime.images)return;
  const keep=new Set(['player','objects','effects',`${name}_guard`,`${name}_chaser`,`bg_${name}`]);
  let removed=0;
  for(const key of Object.keys(runtime.images)){
    if(keep.has(key))continue;
    if(/^(?:qingyun|blackwind|blood|thunder)_(?:guard|chaser)$/.test(key)||/^bg_(?:qingyun|blackwind|blood|thunder)$/.test(key)){
      releaseImage(runtime.images[key]);
      delete runtime.images[key];
      removed++;
    }
  }
  activeArea=name;
  if(removed)console.info(`[ios-stability] released ${removed} inactive area atlases; keeping ${name}`);
}
function wrapAreaSwitches(){
  const D=window.__xianxiaDebug;
  if(!D||wrappedDebug)return;
  wrappedDebug=true;
  if(typeof D.selectArea==='function'){
    const raw=D.selectArea.bind(D);
    D.selectArea=id=>{
      if(!AREA_ASSETS[id]||id===area())return raw(id);
      ensureAreaAssets(id).then(ok=>{if(ok){raw(id);pruneInactiveAreaAssets(id)}});
    };
  }
  if(typeof D.replaceState==='function'){
    const raw=D.replaceState.bind(D);
    D.replaceState=value=>{
      const target=value?.area;
      if(target&&AREA_ASSETS[target]&&target!==area()){
        ensureAreaAssets(target).then(ok=>{if(ok){raw(value);pruneInactiveAreaAssets(target)}});
        return;
      }
      return raw(value);
    };
  }
}
function install(){
  if(installed)return true;
  const runtime=window.__xianxiaInkRuntime;
  const D=window.__xianxiaDebug;
  if(!runtime?.ready||!runtime.ctx||!runtime.layer||!D)return false;
  installed=true;
  patchInkContext(runtime.ctx);
  wrapAreaSwitches();
  freeBaseCanvas();
  disableLegacyObjectLayer();
  lastPhase=phase();
  resizeInkForPhase(runtime,lastPhase);
  resizeGatherForPhase(lastPhase);
  activeArea=area();
  pruneInactiveAreaAssets(activeArea);
  console.info('[ios-stability] low-memory renderer enabled',VERSION);
  return true;
}
function tick(){
  preReadyGuard();
  if(!installed){install();requestAnimationFrame(tick);return}
  const runtime=window.__xianxiaInkRuntime;
  const p=phase();
  freeBaseCanvas();
  disableLegacyObjectLayer();
  if(p!==lastPhase){
    lastPhase=p;
    lastDrawAt=0;
    skipVisualFrame=false;
    resizeInkForPhase(runtime,p);
    resizeGatherForPhase(p);
  }else{
    resizeGatherForPhase(p);
  }
  const nextArea=area();
  if(nextArea!==activeArea&&!areaLoadPromise){
    ensureAreaAssets(nextArea).then(ok=>{if(ok)pruneInactiveAreaAssets(nextArea)});
  }
  requestAnimationFrame(tick);
}

window.__xianxiaIosStability={
  version:VERSION,enabled:true,
  get phase(){return phase()},get area(){return area()},
  install,ensureAreaAssets,prune:()=>pruneInactiveAreaAssets(area())
};
requestAnimationFrame(tick);
})();
