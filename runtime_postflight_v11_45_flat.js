(()=>{
'use strict';
const VERSION='11.49.5';
const FLAT_VERSION='11.49.5-test10';

window.__xianxiaFlatPreflight?.restoreBasic?.();
if(window.__xianxiaProgression)window.__xianxiaProgression.balanceVersion='core-v0.1';
window.__xianxiaProgressionExtrasBalanceVersion='11.36.0';
window.__xianxiaWorldScale={
  version:'11.35.0',W:1800,H:2400,ratio:'3:4',exit:{x:900,y:1200},
  camera:{referenceCss:{w:390,h:844},visibleHeight:960,visibleWidthAtReference:390/(844/960),smoothingSeconds:.14,deadZone:{x:.08,y:.06},lookAhead:.08},
  player:{visualHeight:100},
  background:{mode:'single-world',asset:{width:2304,height:3072,format:'webp',quality:85,pathTemplate:'assets/ink_v2/runtime/backgrounds/{area}.webp'},master:{width:3072,height:4096}}
};
window.__xianxiaBalance={version:'11.37.2',core:'Core Balance v0.2',spatial:'Spatial v0.1',encounter:'Encounter Density v0.3',incoming:'Multi-target v0.1'};
window.__xianxiaEncounterPatch={version:'11.37.2',flattened:true};
window.__xianxiaEncounterHotfix={version:VERSION,compatEntrypoint:'11.37.1',basicSaveFix:true,treeTouchFix:true,treeCameraFix:true,cooldownHudFix:true,uiHygiene:true,runtimeSafety:true,flattened:true};
window.__xianxiaFlatRuntime={version:FLAT_VERSION,loaderPatches:false,syncXHR:false,eval:false,frameOwner:'shared-hub',uiOwner:'ui-runtime-11.48.1',performance:{activeFps:60,idleFps:0,hiddenPause:true,sharedSnapshot:true,viewportCanvas:true,dprCap:1.5,maxPixels:2600000,offscreenCull:true}};
window.__xianxiaRuntime?.pinBuildBadge?.();

function loadScript(path,version,next,label){
  const script=document.createElement('script');
  script.src=`${path}?v=${encodeURIComponent(version)}`;
  script.async=false;
  script.onload=()=>next?.();
  script.onerror=()=>{console.warn(`[flat-runtime] ${label||path} load failed`);next?.()};
  document.body.appendChild(script);
}
function loadCooldown(){loadScript('combat_cooldown_hud_v11_43.js',VERSION,null,'cooldown HUD')}
function loadResult(){loadScript('result_flow_v11_41.js','11.48.1',loadCooldown,'result flow')}
function loadFeedback(){loadScript('ui_feedback_v11_40.js','11.48.1',loadResult,'feedback')}
function loadUiRuntime(){loadScript('ui_runtime_v11_48.js','11.48.1',loadFeedback,'UI runtime')}
if(document.readyState==='complete')setTimeout(loadUiRuntime,0);
else window.addEventListener('load',loadUiRuntime,{once:true});
})();
