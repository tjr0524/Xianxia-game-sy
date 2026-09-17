(()=>{
'use strict';
const PATCH_VERSION='11.47.1';
const FEEDBACK_VERSION='11.40.0';
const RESULT_VERSION='11.41.0';
const MAP_DETAIL_VERSION='11.42.0';
const COOLDOWN_VERSION='11.45.0';
const TREE_CAMERA_VERSION='11.45.0';
const HYGIENE_VERSION='11.47.1';
const BASE='balance_core_v11_47.js';
const SAVE_KEY='xianxia_proto_v11';
window.__XIANXIA_BUILD__=PATCH_VERSION;

function load(path,version=PATCH_VERSION){
  const x=new XMLHttpRequest();
  x.open('GET',`${path}?v=${encodeURIComponent(version)}&ts=${Date.now()}`,false);
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
    console.info('[save-fix] restored basic attack progression',M.skills.basic);
    persistedBasic=null;
  }catch(error){console.warn('[save-fix] basic restore failed',error)}
}

function loadUiHygiene(){
  if(document.querySelector('script[data-v1145-hygiene]'))return;
  const script=document.createElement('script');
  script.dataset.v1145Hygiene='1';
  script.src=`ui_hygiene_v11_45.js?v=${encodeURIComponent(HYGIENE_VERSION)}&ts=${Date.now()}`;
  script.async=false;
  script.onerror=()=>console.warn('[ui-11.47.1] hygiene patch load failed');
  document.body.appendChild(script);
}

function loadCooldownHud(){
  if(document.querySelector('script[data-v1143-cooldown]')){loadUiHygiene();return}
  const script=document.createElement('script');
  script.dataset.v1143Cooldown='1';
  script.src=`combat_cooldown_hud_v11_43.js?v=${encodeURIComponent(COOLDOWN_VERSION)}&ts=${Date.now()}`;
  script.async=false;
  script.onload=loadUiHygiene;
  script.onerror=()=>{console.warn('[ui-11.45] cooldown HUD load failed');loadUiHygiene()};
  document.body.appendChild(script);
}

function loadMapDetailPatch(){
  if(document.querySelector('script[data-v1142-map-detail]')){loadCooldownHud();return}
  const script=document.createElement('script');
  script.dataset.v1142MapDetail='1';
  script.src=`map_detail_v11_42.js?v=${encodeURIComponent(MAP_DETAIL_VERSION)}&ts=${Date.now()}`;
  script.async=false;
  script.onload=loadCooldownHud;
  script.onerror=()=>{console.warn('[ui-11.42] map detail patch load failed');loadCooldownHud()};
  document.body.appendChild(script);
}

function loadResultFlow(){
  if(document.querySelector('script[data-v1141-result]')){loadMapDetailPatch();return}
  const result=document.createElement('script');
  result.dataset.v1141Result='1';
  result.src=`result_flow_v11_41.js?v=${encodeURIComponent(RESULT_VERSION)}&ts=${Date.now()}`;
  result.async=false;
  result.onload=loadMapDetailPatch;
  result.onerror=()=>{console.warn('[ui-11.41] result flow load failed');loadMapDetailPatch()};
  document.body.appendChild(result);
}

function loadFeedbackPatch(){
  if(document.querySelector('script[data-v1140-feedback]')){loadResultFlow();return}
  const script=document.createElement('script');
  script.dataset.v1140Feedback='1';
  script.src=`ui_feedback_v11_40.js?v=${encodeURIComponent(FEEDBACK_VERSION)}&ts=${Date.now()}`;
  script.async=false;
  script.onload=loadResultFlow;
  script.onerror=()=>{console.warn('[ui-11.40] feedback patch load failed');loadResultFlow()};
  document.body.appendChild(script);
}

try{
  try{(0,eval)(load('update_guard.js')+'\n//# sourceURL=update_guard.runtime.js')}catch(updateError){console.warn('[update] guard load failed',updateError)}
  try{(0,eval)(load('tree_camera_gesture_v11_44.js',TREE_CAMERA_VERSION)+'\n//# sourceURL=tree_camera_gesture_v11_45.runtime.js')}catch(cameraError){console.warn('[tree-camera] load failed',cameraError)}
  try{(0,eval)(load('tree_touch_fix_v11_37_4.js')+'\n//# sourceURL=tree_touch_fix_v11_46.runtime.js')}catch(touchError){console.warn('[touch-fix] load failed',touchError)}
  const src=load(BASE);
  (0,eval)(src+'\n//# sourceURL=balance_core_v11_47.entry.runtime.js');
  setTimeout(()=>restorePersistedBasic(),0);
  const e=document.querySelector('#buildVersion');if(e)e.textContent=`BUILD ${PATCH_VERSION}`;
  window.__xianxiaEncounterHotfix={version:PATCH_VERSION,compatEntrypoint:'11.37.1',basicSaveFix:true,treeTouchFix:true,treeCameraFix:true,cooldownHudFix:true,uiHygiene:true,devMenuSwordTrigger:true,inlineBuildBadge:true,herbSpatialFix:true,mobileHeaderFix:true};
}catch(error){
  console.error(error);
  const e=document.querySelector('#buildVersion');if(e)e.textContent=`BUILD ${PATCH_VERSION}`;
}

if(document.readyState==='complete')setTimeout(loadFeedbackPatch,0);
else window.addEventListener('load',loadFeedbackPatch,{once:true});
})();
