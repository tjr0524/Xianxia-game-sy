/* GENERATED FLAT RUNTIME 11.45 · source chain: exploration_mode_v11_33 -> worldscale_exploration_v11_34 */
(()=>{
'use strict';
const VERSION='11.50.21';
if(window.__xianxiaExplorationMode?.version===VERSION)return;

const W=1800,H=2400;
const EXIT_APPROACH={x:900,y:1177};
const $=s=>document.querySelector(s);
const game=$('#game');
const cv=$('#cv');
const ret=$('#ret');
if(!game||!cv)return;

const state={
  version:VERSION,active:false,ready:false,pressed:false,pointerId:null,returning:false,
  camX:W/2,camY:H/2,left:0,top:0,scale:1,viewW:W,viewH:H,
  prevPX:null,prevPY:null,leadX:0,leadY:0,patched:false,hires:false,area:null
};
window.__xianxiaExplorationMode=state;

function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function buildBadge(){}

function installCss(){
  $('#v1133ExplorationStyle')?.remove();
  const style=document.createElement('style');
  style.id='v1133ExplorationStyle';
  style.textContent=`
body.v1133-run{overflow:hidden!important;overscroll-behavior:none!important;background:#101713!important;padding-bottom:0!important}
body.v1133-run .shell{width:100%!important;max-width:none!important;height:100dvh!important;margin:0!important;padding:0!important}
body.v1133-run .topbar,
body.v1133-run .arena-head,
body.v1133-run .arena-card>.hud,
body.v1133-run .arena-card>.objective,
body.v1133-run .arena-card>.run-row,
body.v1133-run .arena-card>.notice,
body.v1133-run .controls,
body.v1133-run .footer{display:none!important}
body.v1133-run .layout{display:block!important;width:100%!important;height:100%!important;margin:0!important}
body.v1133-run .arena-card{position:fixed!important;z-index:1000!important;inset:0!important;width:100vw!important;height:100dvh!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;background:#101713!important;overflow:hidden!important}
body.v1133-run #game{position:absolute!important;inset:0!important;width:100vw!important;height:100dvh!important;border:0!important;border-radius:0!important;box-shadow:none!important;overflow:hidden!important;background:#101713!important}
body.v1133-run #game canvas{max-width:none!important;max-height:none!important;touch-action:none!important}
body.v1133-run #cv{display:none!important;opacity:0!important}
body.v1133-run #v19DangerSvg,body.v1133-run #v19DangerBanner{display:none!important}
body.v1133-run .danger-label{z-index:28!important;left:50%!important;top:calc(env(safe-area-inset-top) + 14px)!important;transform:translateX(-50%)!important;font-size:11px!important;white-space:nowrap!important}
#v1133Backdrop{position:absolute;z-index:0;inset:-4%;pointer-events:none;background-position:center;background-size:cover;background-repeat:no-repeat;filter:saturate(.88) contrast(.96) brightness(.91);transform:scale(1.04)}
#v1133Backdrop::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(241,233,212,.08),rgba(20,28,24,.09));box-shadow:inset 0 0 90px rgba(24,28,24,.22)}
#v1133Hud{position:absolute;z-index:30;inset:0;pointer-events:none;display:none;color:#24332e;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Pretendard",sans-serif}
body.v1133-run #v1133Hud{display:block}
#v1133Loot{position:absolute;left:calc(env(safe-area-inset-left) + 14px);top:calc(env(safe-area-inset-top) + 14px);min-width:126px;padding:9px 11px;border:1px solid rgba(235,228,205,.52);border-radius:12px;background:rgba(238,231,212,.78);box-shadow:0 5px 18px rgba(24,31,28,.18);backdrop-filter:blur(5px);font-size:11px;line-height:1.45;text-shadow:0 1px rgba(255,255,255,.45)}
#v1133Loot b{display:block;font-size:12px;margin-bottom:3px}
#v1133Timer{position:absolute;right:calc(env(safe-area-inset-right) + 14px);top:calc(env(safe-area-inset-top) + 14px);padding:7px 10px;border-radius:999px;background:rgba(238,231,212,.76);border:1px solid rgba(235,228,205,.5);font-weight:800;font-size:12px;box-shadow:0 4px 14px rgba(24,31,28,.15);backdrop-filter:blur(5px)}
#v1133Timer.warn{color:#9c3f35;background:rgba(244,222,205,.86)}
#v1133Objective{position:absolute;left:calc(env(safe-area-inset-left) + 14px);top:calc(env(safe-area-inset-top) + 92px);max-width:min(310px,70vw);padding:5px 8px;border-radius:8px;background:rgba(232,226,209,.56);font-size:9px;line-height:1.35;color:#50605a;backdrop-filter:blur(3px)}
#v1133Hp{position:absolute;left:50%;bottom:calc(env(safe-area-inset-bottom) + 18px);transform:translateX(-50%);width:min(380px,58vw);min-width:190px;text-align:center}
#v1133HpText{display:inline-block;margin-bottom:5px;padding:3px 8px;border-radius:999px;background:rgba(236,229,211,.74);font-size:10px;font-weight:800;box-shadow:0 3px 10px rgba(24,31,28,.14)}
#v1133HpTrack{height:12px;padding:2px;border:1px solid rgba(244,239,219,.65);border-radius:999px;background:rgba(35,45,41,.58);box-shadow:0 4px 16px rgba(12,18,16,.25)}
#v1133HpFill{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#8b3e36,#bd6957);transition:width .12s linear}
#v1133Return{position:absolute;right:calc(env(safe-area-inset-right) + 14px);bottom:calc(env(safe-area-inset-bottom) + 18px);pointer-events:auto;min-width:74px;min-height:42px;padding:7px 12px;border:1px solid rgba(238,232,214,.62);border-radius:12px;background:rgba(238,231,212,.82);color:#2b3b35;font-weight:800;font-size:11px;box-shadow:0 5px 18px rgba(20,28,24,.2);backdrop-filter:blur(5px)}
#v1133Return.returning{background:rgba(186,211,195,.9);border-color:rgba(79,119,102,.48)}
#v1133Return.urgent{border-color:rgba(180,76,57,.78);background:rgba(246,222,198,.94);color:#7e3029;animation:v1133ReturnUrgent .72s ease-in-out infinite}
@keyframes v1133ReturnUrgent{0%,100%{transform:scale(1);box-shadow:0 5px 18px rgba(20,28,24,.2),0 0 0 0 rgba(189,70,51,0)}50%{transform:scale(1.07);box-shadow:0 7px 24px rgba(120,35,27,.30),0 0 0 7px rgba(189,70,51,.16)}}
#v1133Guide{position:absolute;z-index:32;display:none;width:52px;height:52px;margin:-26px 0 0 -26px;pointer-events:none}
#v1133GuideArrow{position:absolute;left:50%;top:54%;width:31px;height:23px;margin:-11.5px 0 0 -15.5px;transform-origin:50% 50%}
#v1133GuideArrow svg{display:block;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 2px 2px rgba(49,29,10,.28));animation:v1133GuidePulse .9s ease-in-out infinite}
#v1133GuideArrow path{fill:rgba(255,222,164,.97);stroke:rgba(126,72,34,.95);stroke-width:2.2;stroke-linejoin:round}
#v1133GuideLabel{position:absolute;left:50%;top:-2px;transform:translateX(-50%);padding:2px 6px;border-radius:999px;background:rgba(54,38,23,.72);font-size:8px;font-weight:800;white-space:nowrap;color:#ffe6b8;text-shadow:0 1px 2px rgba(0,0,0,.32)}
@keyframes v1133GuidePulse{0%,100%{opacity:.84;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
@media(max-width:560px){
 #v1133Loot{left:calc(env(safe-area-inset-left) + 9px);top:calc(env(safe-area-inset-top) + 9px);min-width:112px;padding:7px 9px;font-size:10px}
 #v1133Timer{right:calc(env(safe-area-inset-right) + 9px);top:calc(env(safe-area-inset-top) + 9px);font-size:11px}
 #v1133Objective{left:calc(env(safe-area-inset-left) + 9px);top:calc(env(safe-area-inset-top) + 79px);max-width:64vw}
 #v1133Hp{width:min(300px,62vw);bottom:calc(env(safe-area-inset-bottom) + 12px)}
 #v1133Return{right:calc(env(safe-area-inset-right) + 9px);bottom:calc(env(safe-area-inset-bottom) + 10px);min-width:66px;min-height:38px}
 #v1133Guide{width:48px;height:48px;margin:-24px 0 0 -24px}
 #v1133GuideArrow{width:29px;height:21px;margin:-10.5px 0 0 -14.5px}
}
`;
  document.head.appendChild(style);
}

function ensureBackdrop(){
  let bg=$('#v1133Backdrop');
  if(!bg){bg=document.createElement('div');bg.id='v1133Backdrop';game.prepend(bg)}
  return bg;
}
function syncBackdrop(s){
  const area=s?.M?.area||'qingyun';
  if(state.area===area)return;
  state.area=area;
  ensureBackdrop().style.backgroundImage=`url("assets/ink_v1/runtime/backgrounds/${area}.png")`;
}

function makeHud(){
  let hud=$('#v1133Hud');
  if(hud)return hud;
  hud=document.createElement('div');hud.id='v1133Hud';
  hud.innerHTML=`
   <div id="v1133Loot"><b>이번 원정</b><div id="v1133Stone">영석 0</div><div id="v1133Herbs">영초 下0 · 中0 · 上0</div></div>
   <div id="v1133Timer">25.0초</div>
   <div id="v1133Objective"></div>
   <div id="v1133Hp"><div id="v1133HpText">36 / 36</div><div id="v1133HpTrack"><i id="v1133HpFill"></i></div></div>
   <button id="v1133Return" type="button">귀환</button>
   <div id="v1133Guide"><div id="v1133GuideArrow"><svg viewBox="-9 -11 27 22" aria-hidden="true"><path d="M16 0 L-7 -9 L-2 0 L-7 9 Z"/></svg></div><span id="v1133GuideLabel">귀환진</span></div>`;
  game.appendChild(hud);
  hud.querySelector('#v1133Return').addEventListener('pointerdown',e=>e.stopPropagation(),true);
  hud.querySelector('#v1133Return').onclick=e=>{e.preventDefault();e.stopPropagation();state.returning=true;ret?.click()};
  return hud;
}

function clearLayerStyles(){
  const layer=$('#v1131InkLayer');
  if(!layer)return;
  for(const key of ['position','left','top','right','bottom','width','height','maxWidth','maxHeight','transform','transformOrigin'])layer.style[key]='';
}
function patchInkRuntime(){
  const runtime=window.__xianxiaInkRuntime;
  if(!runtime)return;
  state.patched=true;
  state.hires=runtime.renderScale||1;
}

function activate(s){
  if(state.active)return;
  state.active=true;state.ready=false;state.returning=false;state.area=null;
  state.camX=s?.P?.x??W/2;state.camY=s?.P?.y??H/2;state.cameraStamp=performance.now();
  state.prevPX=s?.P?.x??null;state.prevPY=s?.P?.y??null;state.leadX=state.leadY=0;
  document.body.classList.add('v1133-run');
  ensureBackdrop();makeHud();patchInkRuntime();syncBackdrop(s);
}
function deactivate(){
  if(!state.active)return;
  state.active=false;state.ready=false;state.pressed=false;state.pointerId=null;state.returning=false;
  state.prevPX=state.prevPY=null;state.leadX=state.leadY=0;
  document.body.classList.remove('v1133-run');clearLayerStyles();
  const guide=$('#v1133Guide');if(guide)guide.style.display='none';
  $('#v1133Return')?.classList.remove('urgent','returning');
  buildBadge(`BUILD ${VERSION} · CAM ✓`);
}

function worldToScreen(x,y){return{x:state.left+x*state.scale,y:state.top+y*state.scale}}

function guidePosition(player,target,vw,vh){
  let dx=target.x-player.x,dy=target.y-player.y;const len=Math.hypot(dx,dy)||1;dx/=len;dy/=len;
  const left=46,right=vw-46,top=70,bottom=vh-88,candidates=[];
  if(dx>.001)candidates.push((right-player.x)/dx);else if(dx<-.001)candidates.push((left-player.x)/dx);
  if(dy>.001)candidates.push((bottom-player.y)/dy);else if(dy<-.001)candidates.push((top-player.y)/dy);
  const valid=candidates.filter(t=>t>0);const t=valid.length?Math.min(...valid):80;
  return{x:clamp(player.x+dx*t,left,right),y:clamp(player.y+dy*t,top,bottom),angle:Math.atan2(dy,dx)*180/Math.PI};
}
function updateReturnGuide(s,remaining){
  const guide=$('#v1133Guide'),button=$('#v1133Return');
  const bossFight=!!window.__xianxiaFoundationContent?.bossOnly?.(s?.M?.area,s?.M?.realm);
  const danger=remaining<=10||game.classList.contains('danger');
  if(button){
    button.style.display=bossFight?'none':'';
    button.classList.toggle('returning',!bossFight&&state.returning);
    button.classList.toggle('urgent',!bossFight&&danger);
    button.textContent=state.returning?'귀환 중':'귀환';
  }
  if(guide)guide.style.display='none';
}

function updateHud(s){
  const r=s.run||{},p=s.P||{hp:0,max:1};
  const stone=$('#v1133Stone'),herbs=$('#v1133Herbs'),hpText=$('#v1133HpText'),hpFill=$('#v1133HpFill'),timer=$('#v1133Timer'),objective=$('#v1133Objective');
  if(stone)stone.textContent=`영석 ${Math.floor(r.s||0)}`;
  if(herbs){
    const stage=+s.M?.realm?.stage||0,major=+s.M?.realm?.major||-1;
    herbs.textContent=major>=1
      ?stage<=3?`뢰흔 ${r.thunderMarks||0}`:stage<=6?`자운정수 ${r.purpleEssence||0}`:'후기 재료 미정'
      :`영초 下${r.h0||0} · 中${r.h1||0} · 上${r.h2||0}`;
  }
  if(hpText)hpText.textContent=`${Math.max(0,Math.ceil(p.hp||0))} / ${Math.max(1,Math.ceil(p.max||1))}`;
  if(hpFill)hpFill.style.width=`${clamp((p.hp||0)/Math.max(1,p.max||1)*100,0,100)}%`;
  const total=s.run?.limit||window.__xianxiaDebug?.constants?.RUN_TIME||25,remaining=Math.max(0,total-(s.elapsed||0));
  if(timer){timer.textContent=`${remaining.toFixed(1)}초`;timer.classList.toggle('warn',remaining<=10)}
  if(objective){const source=$('#objective');objective.textContent=(source?.textContent||'').replace(/\s+/g,' ').trim()}
  updateReturnGuide(s,remaining);
}

function screenToWorld(e){return{x:clamp((e.clientX-state.left)/state.scale,11,W-11),y:clamp((e.clientY-state.top)/state.scale,11,H-11)}}
function moveFromPointer(e){const D=window.__xianxiaDebug;if(!state.active||!D?.moveTo)return;state.returning=false;const p=screenToWorld(e);D.moveTo(p.x,p.y)}
function isCombatUiTarget(target){
  return !!target?.closest?.('#v1133Return,.foundation-arts,.foundation-art,[data-art],button,input,select,textarea,[role="button"]');
}
function interceptPointer(){
  game.addEventListener('pointerdown',e=>{
    if(!state.active||isCombatUiTarget(e.target))return;
    e.preventDefault();e.stopPropagation();state.pressed=true;state.pointerId=e.pointerId;game.setPointerCapture?.(e.pointerId);moveFromPointer(e);
  },{capture:true,passive:false});
  game.addEventListener('pointermove',e=>{
    if(!state.active||!state.pressed||e.pointerId!==state.pointerId)return;
    e.preventDefault();e.stopPropagation();moveFromPointer(e);
  },{capture:true,passive:false});
  const end=e=>{if(!state.active||e.pointerId!==state.pointerId)return;e.preventDefault();e.stopPropagation();state.pressed=false;state.pointerId=null};
  game.addEventListener('pointerup',end,{capture:true,passive:false});game.addEventListener('pointercancel',end,{capture:true,passive:false});
}

function lifecycleFrame(s){
  if(s?.phase==='run'){
    activate(s);patchInkRuntime();syncBackdrop(s);
  }else deactivate();
}
function hudFrame(s){
  if(s?.phase==='run'&&state.active)updateHud(s);
}
function subscribeFrames(){
  const hub=window.__xianxiaFrameHub;
  if(hub?.subscribe){
    hub.subscribe('exploration-lifecycle',lifecycleFrame,10);
    hub.subscribe('exploration-hud',hudFrame,30);
    state.frameOwner='shared-hub';
    state.cameraOwner='viewport-renderer';
    return;
  }
  function fallback(){
    const D=window.__xianxiaDebug;let s=null;try{s=D?.snapshot?.()}catch{}
    lifecycleFrame(s);hudFrame(s);
    requestAnimationFrame(fallback);
  }
  state.frameOwner='fallback';
  requestAnimationFrame(fallback);
}

installCss();ensureBackdrop();makeHud();interceptPointer();buildBadge(`BUILD ${VERSION} · CAM ✓`);subscribeFrames();
})();

//# sourceURL=exploration_runtime_v11_45.js
