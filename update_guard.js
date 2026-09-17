(()=>{
'use strict';
const LOCAL_BUILD=String(window.__XIANXIA_BUILD__||'').trim()||'unknown';
const IOS_WEBKIT=/iP(?:hone|ad|od)/.test(navigator.userAgent)&&/WebKit/i.test(navigator.userAgent);
const INK_BASE='assets/ink_v1/';
const AREA_ASSETS={
  qingyun:{guard:'source/qingyun_stone_boar.png',chaser:'source/qingyun_wind_wolf.png',bg:'../ink_v2/runtime/backgrounds/qingyun.webp'},
  blackwind:{guard:'source/blackwind_horned_yak.png',chaser:'source/blackwind_ink_panther.png',bg:'../ink_v2/runtime/backgrounds/blackwind.webp'},
  blood:{guard:'source/blood_armored_bear.png',chaser:'source/blood_ember_fox.png',bg:'../ink_v2/runtime/backgrounds/blood.webp'},
  thunder:{guard:'source/thunder_stone_rhino.png',chaser:'source/thunder_lightning_leopard.png',bg:'../ink_v2/runtime/backgrounds/thunder.webp'}
};
let memoryGuardStarted=false;
let areaLoadPromise=null;
let areaLoadFor='';
let lastPrunedArea='';

function pinBuildBadge(){
  const el=document.querySelector('#buildVersion');
  if(!el||LOCAL_BUILD==='unknown')return;
  const wanted=`BUILD ${LOCAL_BUILD}`;
  if(el.textContent!==wanted)el.textContent=wanted;
}

function cleanLegacyRefreshParams(){
  try{
    const url=new URL(location.href);
    let changed=false;
    for(const key of ['__build','__refresh']){
      if(url.searchParams.has(key)){url.searchParams.delete(key);changed=true}
    }
    if(changed)history.replaceState(history.state,'',url.pathname+url.search+url.hash);
  }catch(_){ }
}

async function retireLegacyUpdater(){
  // Deployments must never interrupt an expedition. Updating is manual-only.
  try{
    if('serviceWorker' in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(reg=>reg.unregister()));
    }
  }catch(error){
    console.warn('[update] service worker retirement skipped',error);
  }
  try{
    const keys=await caches.keys();
    await Promise.all(keys.map(key=>caches.delete(key)));
  }catch(_){ }
}

function currentArea(){
  try{return window.__xianxiaDebug?.snapshot?.()?.M?.area||'qingyun'}catch{return'qingyun'}
}
function loadImage(path){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=()=>reject(new Error('image reload failed: '+path));
    // The main runtime has already calculated sprite bounds. Reloading an evicted
    // atlas only restores its decoded pixels; no second pixel scan is required.
    img.src=INK_BASE+path+'?v=ios-mem-11.48';
  });
}
async function ensureAreaAssets(area){
  if(!IOS_WEBKIT)return true;
  const runtime=window.__xianxiaInkRuntime;
  const spec=AREA_ASSETS[area]||AREA_ASSETS.qingyun;
  if(!runtime?.images||!runtime.ready)return false;
  const keys=[`${area}_guard`,`${area}_chaser`,`bg_${area}`];
  if(keys.every(key=>runtime.images[key]))return true;
  if(areaLoadPromise&&areaLoadFor===area)return areaLoadPromise;
  areaLoadFor=area;
  areaLoadPromise=(async()=>{
    const pairs=[[`${area}_guard`,spec.guard],[`${area}_chaser`,spec.chaser],[`bg_${area}`,spec.bg]];
    // Sequential decode is intentional on iOS: decoding several 2K atlases at once
    // creates a large transient memory spike and can make Safari restart the page.
    for(const [key,path] of pairs){
      if(!runtime.images[key])runtime.images[key]=await loadImage(path);
    }
    return true;
  })().catch(error=>{console.warn('[memory] area asset restore failed',error);return false}).finally(()=>{
    areaLoadPromise=null;areaLoadFor='';
  });
  return areaLoadPromise;
}
function releaseImage(img){
  if(!img)return;
  try{img.onload=null;img.onerror=null;img.removeAttribute?.('src');img.src=''}catch(_){ }
}
function pruneInactiveAreaAssets(area){
  if(!IOS_WEBKIT)return;
  const runtime=window.__xianxiaInkRuntime;
  if(!runtime?.ready||!runtime.images)return;
  const keep=new Set(['player','objects','effects',`${area}_guard`,`${area}_chaser`,`bg_${area}`]);
  let removed=0;
  for(const key of Object.keys(runtime.images)){
    if(keep.has(key))continue;
    if(/^(?:qingyun|blackwind|blood|thunder)_(?:guard|chaser)$/.test(key)||/^bg_(?:qingyun|blackwind|blood|thunder)$/.test(key)){
      releaseImage(runtime.images[key]);
      delete runtime.images[key];
      removed++;
    }
  }
  if(removed||lastPrunedArea!==area){
    lastPrunedArea=area;
    console.info(`[memory] iOS ink cache: ${area}, released ${removed} inactive atlases`);
  }
}

function wrapAreaSwitches(){
  if(!IOS_WEBKIT)return;
  const D=window.__xianxiaDebug;
  if(!D||D.__iosMemoryWrapped)return;
  D.__iosMemoryWrapped=true;
  if(typeof D.selectArea==='function'){
    const raw=D.selectArea.bind(D);
    D.selectArea=id=>{
      const before=currentArea();
      if(!AREA_ASSETS[id]||id===before)return raw(id);
      // Load the target atlas before exposing the new area to the renderer.
      ensureAreaAssets(id).then(()=>{raw(id);pruneInactiveAreaAssets(id)});
    };
  }
  if(typeof D.replaceState==='function'){
    const raw=D.replaceState.bind(D);
    D.replaceState=value=>{
      const target=value?.area;
      if(target&&AREA_ASSETS[target]&&target!==currentArea()){
        ensureAreaAssets(target).then(()=>{raw(value);pruneInactiveAreaAssets(target)});
        return;
      }
      return raw(value);
    };
  }
}

function startIosMemoryGuard(){
  if(!IOS_WEBKIT||memoryGuardStarted)return;
  memoryGuardStarted=true;
  let attempts=0;
  const wait=()=>{
    const runtime=window.__xianxiaInkRuntime;
    const D=window.__xianxiaDebug;
    if(runtime?.ready&&D){
      const area=currentArea();
      wrapAreaSwitches();
      pruneInactiveAreaAssets(area);
      // Area changes made by legacy handlers are also covered by this low-frequency
      // check. It does not touch navigation, reload, or the active expedition.
      setInterval(async()=>{
        const next=currentArea();
        if(next!==lastPrunedArea){
          await ensureAreaAssets(next);
          pruneInactiveAreaAssets(next);
        }
      },1000);
      window.__xianxiaMemoryGuard={enabled:true,platform:'ios-webkit',get area(){return currentArea()},ensureAreaAssets,prune:()=>pruneInactiveAreaAssets(currentArea())};
      return;
    }
    if(++attempts<240)setTimeout(wait,100);
  };
  wait();
}

cleanLegacyRefreshParams();
pinBuildBadge();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',pinBuildBadge,{once:true});
retireLegacyUpdater();
startIosMemoryGuard();

window.__XIANXIA_PENDING_BUILD__='';
window.__xianxiaUpdateGuard={
  build:LOCAL_BUILD,
  disabled:true,
  autoReload:false,
  check:()=>Promise.resolve(false),
  pinBuildBadge,
  retire:retireLegacyUpdater
};
})();
