(()=>{
'use strict';
const PATCH_VERSION='11.50.2';
const BASE='balance_core_v11_37.js';
const SAVE_KEY='xianxia_proto_v11';

// One owner for the application build. Legacy feature patches are allowed to read
// this value, but writes from their internal VERSION constants are ignored.
try{
  Object.defineProperty(window,'__XIANXIA_BUILD__',{
    configurable:true,
    enumerable:true,
    get(){return PATCH_VERSION},
    set(_value){}
  });
}catch(_){window.__XIANXIA_BUILD__=PATCH_VERSION}

function installCanonicalHeader(){
  const badge=document.querySelector('#buildVersion');
  const title=document.querySelector('.brand h1');
  if(!badge||!title)return;
  let row=title.parentElement?.querySelector(':scope > .brand-title-row');
  if(!row){
    row=document.createElement('div');
    row.className='brand-title-row';
    title.parentNode.insertBefore(row,title);
    row.appendChild(title);
  }
  if(badge.parentElement!==row)row.appendChild(badge);
  badge.textContent=`BUILD ${PATCH_VERSION}`;
  badge.setAttribute('aria-hidden','true');

  if(document.querySelector('#canonical-build-style'))return;
  const style=document.createElement('style');
  style.id='canonical-build-style';
  style.textContent=`
.brand-title-row{display:flex!important;align-items:baseline!important;gap:7px!important;min-width:0!important}
.brand-title-row h1{flex:0 0 auto!important;white-space:nowrap!important;word-break:keep-all!important}
#buildVersion.build-version{position:static!important;z-index:auto!important;top:auto!important;left:auto!important;right:auto!important;bottom:auto!important;transform:none!important;display:inline!important;min-width:0!important;min-height:0!important;width:auto!important;height:auto!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:none!important;box-shadow:none!important;backdrop-filter:none!important;color:#8b918e!important;font:600 0/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;letter-spacing:.04em!important;white-space:nowrap!important;pointer-events:none!important;opacity:.82!important}
#buildVersion.build-version::after{content:"BUILD ${PATCH_VERSION}";font-size:8px!important}
body.v22-combat-mode #buildVersion,body.v1133-run #buildVersion,body.v1141-result-mode #buildVersion{display:none!important}
@media(max-width:560px){
  body.v25-theme .topbar{display:flex!important;flex-wrap:wrap!important;align-items:center!important;justify-content:flex-start!important;gap:8px!important}
  body.v25-theme .brand{flex:1 1 100%!important;width:100%!important;min-width:0!important}
  body.v25-theme .brand>div:last-child{min-width:0!important;flex:1 1 auto!important}
  body.v25-theme .resources{flex:1 1 100%!important;width:100%!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:6px!important}
  body.v25-theme .resource{min-width:0!important;width:auto!important}
  body.v25-theme .resource>span,body.v25-theme .resource>b{white-space:nowrap!important;word-break:keep-all!important}
}
`;
  (document.head||document.documentElement).appendChild(style);
}
installCanonicalHeader();

function load(path,version=PATCH_VERSION){
  const x=new XMLHttpRequest();
  x.open('GET',`${path}?v=${encodeURIComponent(version)}`,false);
  x.setRequestHeader('Cache-Control','no-cache');
  x.send(null);
  if(!((x.status>=200&&x.status<300)||x.status===0))throw new Error(`${path} load failed: ${x.status}`);
  return x.responseText;
}

let persistedBasic=null;
try{
  const raw=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');
  if(raw?.skills?.basic&&typeof raw.skills.basic==='object')persistedBasic={...raw.skills.basic};
}catch(error){console.warn('[save-fix] basic snapshot failed',error)}

function restorePersistedBasic(attempt=0){
  if(!persistedBasic)return;
  const D=window.__xianxiaDebug;
  const P=window.__xianxiaProgression;
  if((!D||!P)&&attempt<30){setTimeout(()=>restorePersistedBasic(attempt+1),0);return}
  if(!D)return;
  try{
    const snap=D.snapshot();
    const M=snap?.M;
    if(!M)return;
    M.skills||={};
    const current=M.skills.basic||{};
    M.skills.basic={
      u:1,
      pow:Math.max(+current.pow||0,+persistedBasic.pow||0),
      range:Math.max(+current.range||0,+persistedBasic.range||0),
      cycle:Math.max(+current.cycle||0,+persistedBasic.cycle||0),
      ...persistedBasic,
      u:1
    };
    D.replaceState(M);
    persistedBasic=null;
  }catch(error){console.warn('[save-fix] basic restore failed',error)}
}

function cleanupDetailClose(detail){
  if(!detail)return;
  const closers=[...detail.querySelectorAll('button')].filter(button=>{
    const text=(button.textContent||'').trim();
    return button.classList.contains('detail-close38')||button.getAttribute('aria-label')==='상세정보 닫기'||text==='×';
  });
  if(closers.length<2)return;
  const keep=closers.find(button=>button.classList.contains('detail-close38'))||closers[closers.length-1];
  for(const button of closers)if(button!==keep)button.remove();
}
function cleanupDetailCloses(){
  cleanupDetailClose(document.querySelector('#ascDetail'));
  cleanupDetailClose(document.querySelector('#mapDetail'));
}
function scheduleDetailCleanup(){
  requestAnimationFrame(cleanupDetailCloses);
  setTimeout(cleanupDetailCloses,40);
}
document.addEventListener('click',event=>{
  if(event.target?.closest?.('.asc-node,.map-node'))scheduleDetailCleanup();
},true);

function appendPatch(path,datasetKey,onload,onerror){
  if(document.querySelector(`script[${datasetKey}]`)){onload?.();return}
  const script=document.createElement('script');
  script.setAttribute(datasetKey,'1');
  script.src=`${path}?v=${encodeURIComponent(PATCH_VERSION)}`;
  script.async=false;
  if(onload)script.onload=onload;
  if(onerror)script.onerror=onerror;
  document.body.appendChild(script);
}
function loadCooldownHud(){
  appendPatch('combat_cooldown_hud_v11_43.js','data-v1143-cooldown',()=>{installCanonicalHeader();scheduleDetailCleanup()},()=>console.warn('[ui] cooldown HUD load failed'));
}
function loadMapDetailPatch(){
  appendPatch('map_detail_v11_42.js','data-v1142-map-detail',loadCooldownHud,()=>{console.warn('[ui] map detail load failed');loadCooldownHud()});
}
function loadResultFlow(){
  appendPatch('result_flow_v11_41.js','data-v1141-result',loadMapDetailPatch,()=>{console.warn('[ui] result flow load failed');loadMapDetailPatch()});
}
function loadFeedbackPatch(){
  appendPatch('ui_feedback_v11_40.js','data-v1140-feedback',loadResultFlow,()=>{console.warn('[ui] feedback patch load failed');loadResultFlow()});
}

try{
  try{(0,eval)(load('update_guard.js')+'\n//# sourceURL=update_guard.runtime.js')}catch(updateError){console.warn('[update] guard load failed',updateError)}
  try{(0,eval)(load('tree_camera_gesture_v11_44.js')+'\n//# sourceURL=tree_camera_gesture.runtime.js')}catch(cameraError){console.warn('[tree-camera] load failed',cameraError)}
  try{(0,eval)(load('tree_touch_fix_v11_37_4.js')+'\n//# sourceURL=tree_touch_fix.runtime.js')}catch(touchError){console.warn('[touch-fix] load failed',touchError)}
  const src=load(BASE).replaceAll('11.37.2',PATCH_VERSION);
  (0,eval)(src+'\n//# sourceURL=balance_core_v11_50_2.entry.runtime.js');
  setTimeout(()=>restorePersistedBasic(),0);
  installCanonicalHeader();
  window.__xianxiaEncounterHotfix={
    version:PATCH_VERSION,
    compatEntrypoint:'11.37.1',
    canonicalBuildOwner:true,
    globalMutationObserverRemoved:true,
    iosEmergencyMonkeypatchRemoved:true,
    legacyWorldLoopDisabled:true,
    devMenuSwordTrigger:true,
    inlineBuildBadge:true
  };
}catch(error){
  console.error(error);
  installCanonicalHeader();
}

if(document.readyState==='complete')setTimeout(loadFeedbackPatch,0);
else window.addEventListener('load',loadFeedbackPatch,{once:true});
})();