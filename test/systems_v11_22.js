(()=>{
'use strict';
const D=window.__xianxiaDebug;
if(!D||window.__xianxiaPanelUxVersion==='11.22')return;
window.__xianxiaPanelUxVersion='11.22';
const $=s=>document.querySelector(s);
const controls=$('.controls'),tabs=$('.tabs'),game=$('#game'),arena=$('.arena-card');
if(!controls||!tabs)return;
const compact=()=>!!window.matchMedia?.('(max-width:920px)').matches;
let ignoreTabsUntil=0;

function css(){
  if($('#v1122panelcss'))return;
  const s=document.createElement('style');
  s.id='v1122panelcss';
  s.textContent=`
.v22-close-handle,.v22-expedition-tab{display:none}
.brand h1{white-space:nowrap}
@media(max-width:920px){
  body:not(.v22-combat-mode){height:100dvh!important;overflow:hidden!important;padding-bottom:0!important}
  body:not(.v22-combat-mode) .shell{display:flex!important;flex-direction:column!important;width:100%!important;height:100dvh!important;padding:8px 8px calc(72px + env(safe-area-inset-bottom))!important;overflow:hidden!important}
  .topbar{display:grid!important;flex:0 0 auto!important;grid-template-columns:1fr!important;gap:6px!important;align-items:start!important;margin-bottom:0!important;padding-bottom:6px!important}
  .brand{min-width:0}.brand h1{white-space:nowrap!important}
  .resources{display:grid!important;grid-template-columns:.85fr .8fr 1.35fr!important;width:100%;gap:5px!important}
  .resource{min-width:0!important}
  .layout{display:block!important;flex:1 1 auto!important;min-height:0!important;height:auto!important;margin-top:0!important;padding-top:0!important;overflow:hidden!important}
  .footer{display:none!important}
  .arena-card{height:100%!important;margin-bottom:0!important;overflow-y:auto!important;overscroll-behavior:contain}
  body.v22-panel-mode .arena-card{display:none!important}
  .controls{position:static!important;left:auto!important;right:auto!important;bottom:auto!important;width:100%!important;height:100%!important;min-height:0!important;max-height:none!important;overflow:hidden!important;margin:0!important;border-radius:10px 3px 10px 3px!important;box-shadow:none!important}
  body.v22-expedition-mode .controls{height:0!important;margin:0!important;border:0!important;background:transparent!important;overflow:visible!important}
  .tabs.v22-mobile-nav{position:fixed!important;z-index:80!important;left:6px!important;right:6px!important;bottom:calc(env(safe-area-inset-bottom) + 6px)!important;top:auto!important;display:grid!important;grid-template-columns:repeat(5,1fr)!important;gap:3px!important;min-height:58px!important;padding:5px!important;border:1px solid #77877f55!important;border-radius:13px 5px 13px 5px!important;background:rgba(239,241,233,.97)!important;box-shadow:0 10px 30px #27393238!important;overflow:visible!important}
  .controls .panel{display:none!important;height:100%!important;max-height:none!important;overflow-y:auto!important;overscroll-behavior:contain;padding:7px 7px 18px!important;scroll-padding-bottom:18px}
  body.v22-panel-mode .controls .panel.active{display:block!important}
  body.v22-panel-mode .controls .panel.active[data-panel="train"],body.v22-panel-mode .controls .panel.active[data-panel="skills"],body.v22-panel-mode .controls .panel.active[data-panel="tree"]{display:flex!important;flex-direction:column!important;overflow:hidden!important}
  body.v22-panel-mode [data-panel="train"] .asc-section,body.v22-panel-mode [data-panel="skills"]>.section,body.v22-panel-mode [data-panel="tree"]>.section{display:flex!important;flex:1 1 auto!important;flex-direction:column!important;min-height:0!important;height:100%!important;margin:0!important}
  body.v22-panel-mode #ascViewport,body.v22-panel-mode #mapViewport,body.v22-panel-mode #skillTreeViewport{flex:1 1 auto!important;min-height:0!important;height:auto!important}
  body.v22-panel-mode [data-panel="skills"] #skillTree,body.v22-panel-mode [data-panel="skills"] .formation-board49{display:flex!important;flex:1 1 auto!important;flex-direction:column!important;min-height:0!important;height:100%!important}
  body.v22-panel-mode [data-panel="skills"] .fs49-topline{flex:0 0 auto!important}
  body.v22-panel-mode [data-panel="skills"] .fs49-viewport{flex:1 1 auto!important;width:100%!important;max-width:none!important;height:auto!important;min-height:0!important;aspect-ratio:auto!important;margin:0!important}
  body.v22-panel-mode [data-panel="skills"] .fs49-board{inset:0 auto auto 0!important;width:100%!important;height:auto!important;aspect-ratio:1!important}
  body.v22-expedition-mode .controls .panel,body.v22-expedition-mode .controls details{display:none!important}
  .v22-expedition-tab{display:flex!important;min-height:50px!important;margin-top:-8px!important;border-color:#8e763e!important;border-radius:13px 5px 13px 5px!important;background:#f7f0dc!important;color:#30453e!important;box-shadow:0 5px 14px #33463e30,inset 0 -3px #9b7f3f70!important;font-weight:800!important}
  .v22-expedition-tab::before{background-position:25% 0!important;filter:sepia(.25) saturate(.8)!important}
  .v22-expedition-tab.active{background:#e6d6ab!important;border-color:#9e8040!important;color:#243a33!important}
  .v22-close-handle{display:none!important}
  body.v22-expedition-mode:not(.v22-combat-mode) .arena-head{display:none!important}
  body.v22-expedition-mode:not(.v22-combat-mode) .arena-head>div{min-width:0!important;overflow:visible!important}
  body.v22-expedition-mode:not(.v22-combat-mode) .arena-head p{display:block!important;height:auto!important;margin:0!important;padding-bottom:2px!important;white-space:normal!important;overflow:visible!important;line-height:1.45!important}
  body.v22-expedition-mode:not(.v22-combat-mode) .game{border:0!important;border-radius:0!important;overflow:visible!important;background:transparent!important;box-shadow:none!important}
  body.v22-expedition-mode:not(.v22-combat-mode) .game canvas,body.v22-expedition-mode:not(.v22-combat-mode) #v1131InkLayer,body.v22-expedition-mode:not(.v22-combat-mode) .danger-label{display:none!important}
  body.v22-expedition-mode:not(.v22-combat-mode) .overlay{position:relative!important;inset:auto!important;display:block!important;min-height:0!important;padding:0!important;background:transparent!important;backdrop-filter:none!important}
  body.v22-expedition-mode:not(.v22-combat-mode) .overlay.hide{display:none!important}
  body.v22-expedition-mode:not(.v22-combat-mode) .dialog{width:100%!important;max-height:none!important;margin:0!important}
  body.v22-expedition-mode:not(.v22-combat-mode) .hud,body.v22-expedition-mode:not(.v22-combat-mode) .objective,body.v22-expedition-mode:not(.v22-combat-mode) .run-row,body.v22-expedition-mode:not(.v22-combat-mode) .notice{display:none!important}
  body.v22-combat-mode{overflow:hidden!important;padding-bottom:0!important}
  body.v22-combat-mode .topbar,body.v22-combat-mode .controls,body.v22-combat-mode .tabs.v22-mobile-nav,body.v22-combat-mode .footer{display:none!important}
  body.v22-combat-mode .shell{width:100%!important;height:100dvh!important;margin:0!important;padding:0!important}
  body.v22-combat-mode .layout{display:block!important;width:100%!important;height:100%!important}
  body.v22-combat-mode .arena-card{position:fixed!important;z-index:100!important;display:flex!important;flex-direction:column!important;inset:0!important;width:100%!important;height:100dvh!important;margin:0!important;padding:max(8px,env(safe-area-inset-top)) 7px max(8px,env(safe-area-inset-bottom))!important;border:0!important;border-radius:0!important;overflow-y:auto!important;background:#e9e2d0 url("assets/paper_fiber.svg")!important;box-shadow:none!important}
  body.v22-combat-mode .arena-head{flex:0 0 auto;margin:0 2px 6px!important}
  body.v22-combat-mode .arena-head h2{font-size:15px!important}
  body.v22-combat-mode .arena-head p{font-size:8px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:74vw}
  body.v22-combat-mode .game{flex:0 0 auto;width:100%!important;margin:0!important}
  body.v22-combat-mode .hud{flex:0 0 auto;margin-top:6px!important;gap:5px!important}
  body.v22-combat-mode .hud-item{min-height:45px!important;padding:5px!important}
  body.v22-combat-mode .run-row{position:sticky;z-index:12;bottom:0;flex:0 0 auto;margin-top:6px!important;padding-bottom:2px;background:linear-gradient(transparent,#e9e2d0 22%)}
  body.v22-combat-mode .notice{flex:0 0 auto;margin:3px 2px 0!important;font-size:9px!important}
}
`;
  document.head.appendChild(s);
}

function syncAria(){document.querySelectorAll('.tab-btn').forEach(b=>b.setAttribute('aria-expanded',String(b.classList.contains('active'))));}
function settleClosed(){if(compact())D.setMenuOpen?.(false)}

function expeditionButton(){
  let b=$('.v22-expedition-tab');
  if(b)return b;
  b=document.createElement('button');
  b.type='button';b.className='tab-btn v22-expedition-tab';b.dataset.tab='expedition';b.textContent='비경';
  const tree=$('.tab-btn[data-tab="tree"]');
  tabs.insertBefore(b,tree||null);
  return b;
}

function placeMobileNav(){
  if(compact()){
    tabs.classList.add('v22-mobile-nav');
    if(tabs.parentElement!==document.body)document.body.appendChild(tabs);
  }else{
    tabs.classList.remove('v22-mobile-nav');
    if(tabs.parentElement!==controls)controls.insertBefore(tabs,controls.firstChild);
  }
}

function showExpedition(){
  if(!compact())return;
  document.body.classList.remove('v22-panel-mode');
  document.body.classList.add('v22-expedition-mode');
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab==='expedition'));
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  settleClosed();syncAria();window.scrollTo?.({top:0,behavior:'smooth'});
}

function showPanel(tab){
  if(!compact()||!tab||tab.dataset.tab==='expedition')return;
  document.body.classList.remove('v22-expedition-mode');
  document.body.classList.add('v22-panel-mode');
  $('.v22-expedition-tab')?.classList.remove('active');
  settleClosed();syncAria();window.scrollTo?.({top:0,behavior:'smooth'});
}

function enterCombat(){
  if(!compact())return;
  document.body.classList.remove('v22-panel-mode');
  document.body.classList.add('v22-expedition-mode','v22-combat-mode');
  settleClosed();window.scrollTo?.(0,0);
}

function leaveCombat(){
  if(!document.body.classList.contains('v22-combat-mode'))return;
  document.body.classList.remove('v22-combat-mode');
  showExpedition();
}

function installHandle(){
  let b=$('#v22PanelClose');if(b)return b;
  b=document.createElement('button');b.id='v22PanelClose';b.type='button';b.className='v22-close-handle';b.setAttribute('aria-label','성장 패널 닫기');b.innerHTML='<span>⌄ 닫기</span>';tabs.appendChild(b);
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();showExpedition()});
  let sy=0,dy=0,drag=false;
  b.addEventListener('pointerdown',e=>{sy=e.clientY;dy=0;drag=true;b.classList.add('dragging');try{b.setPointerCapture(e.pointerId)}catch{}e.preventDefault();e.stopPropagation();},{passive:false});
  b.addEventListener('pointermove',e=>{if(!drag)return;dy=e.clientY-sy;b.style.transform=`translateX(-50%) translateY(${Math.max(0,Math.min(24,dy*.35))}px)`;e.preventDefault();e.stopPropagation();},{passive:false});
  const end=e=>{if(!drag)return;drag=false;b.classList.remove('dragging');b.style.transform='translateX(-50%)';if(dy>34)showExpedition();try{b.releasePointerCapture(e.pointerId)}catch{}e.preventDefault();e.stopPropagation();};
  b.addEventListener('pointerup',end,{passive:false});b.addEventListener('pointercancel',end,{passive:false});return b;
}
function bindTabs(){if(tabs.dataset.v22tabs)return;tabs.dataset.v22tabs='1';tabs.addEventListener('pointerup',e=>{if(Date.now()<ignoreTabsUntil){e.preventDefault();e.stopImmediatePropagation()}},true);tabs.addEventListener('click',e=>{const b=e.target.closest('.tab-btn');if(!b||!compact())return;if(Date.now()<ignoreTabsUntil){e.preventDefault();e.stopImmediatePropagation();return}if(b.dataset.tab==='expedition'){e.preventDefault();e.stopImmediatePropagation();showExpedition();return}requestAnimationFrame(()=>showPanel(b));},true);}
function bindOutsideClose(){}
function bindLifecycle(){controls.addEventListener('xianxia:panel-open',e=>{if(e.detail?.open&&compact()&&!document.body.classList.contains('v22-combat-mode')){const active=$('.tab-btn.active');if(active?.dataset.tab!=='expedition')requestAnimationFrame(()=>showPanel(active))}});window.addEventListener('resize',()=>{placeMobileNav();if(!compact()){document.body.classList.remove('v22-panel-mode','v22-expedition-mode','v22-combat-mode');return}if(D.snapshot().phase==='run'){enterCombat();return}requestAnimationFrame(()=>document.body.classList.contains('v22-panel-mode')?showPanel($('.tab-btn.active')):showExpedition())});$('#start')?.addEventListener('pointerup',()=>{ignoreTabsUntil=Date.now()+450},{capture:true});$('#start')?.addEventListener('click',()=>{ignoreTabsUntil=Date.now()+450;enterCombat()},{capture:true});const ov=$('#ov');if(ov)new MutationObserver(()=>{if(!ov.classList.contains('hide'))leaveCombat();else if(D.snapshot().phase==='run')enterCombat()}).observe(ov,{attributes:true,attributeFilter:['class']});}
function boot(){css();expeditionButton();installHandle();placeMobileNav();bindTabs();bindOutsideClose();bindLifecycle();if(compact())showExpedition();}
boot();

// Sprites are owned by ink_runtime_world_v11_45.js. The retired 700x460
// brush renderer fetched another atlas and ran a hidden, independent RAF.
})();
