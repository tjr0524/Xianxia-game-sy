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
  body{padding-bottom:calc(74px + env(safe-area-inset-bottom))!important}
  .topbar{display:grid!important;grid-template-columns:1fr!important;gap:6px!important;align-items:start!important}
  .brand{min-width:0}.brand h1{white-space:nowrap!important}
  .resources{display:grid!important;grid-template-columns:.85fr .8fr 1.35fr!important;width:100%;gap:5px!important}
  .resource{min-width:0!important}
  .arena-card{margin-bottom:0!important}
  body.v22-panel-mode .arena-card{display:none!important}
  .controls{position:static!important;left:auto!important;right:auto!important;bottom:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;margin:0 0 4px!important;border-radius:10px 3px 10px 3px!important;box-shadow:none!important}
  body.v22-expedition-mode .controls{height:0!important;margin:0!important;border:0!important;background:transparent!important;overflow:visible!important}
  .controls .tabs{position:fixed!important;z-index:80!important;left:6px!important;right:6px!important;bottom:calc(env(safe-area-inset-bottom) + 6px)!important;top:auto!important;display:grid!important;grid-template-columns:repeat(5,1fr)!important;gap:3px!important;min-height:58px!important;padding:5px!important;border:1px solid #77877f55!important;border-radius:13px 5px 13px 5px!important;box-shadow:0 10px 30px #27393238!important}
  .controls.open .tabs{padding-top:5px!important}
  .controls .panel{display:none!important;max-height:none!important;overflow:visible!important;padding:7px!important}
  body.v22-panel-mode .controls .panel.active{display:block!important}
  body.v22-expedition-mode .controls .panel,body.v22-expedition-mode .controls details{display:none!important}
  .v22-expedition-tab{display:flex!important;min-height:50px!important;margin-top:-8px!important;border-color:#8e763e!important;border-radius:13px 5px 13px 5px!important;background:#f7f0dc!important;color:#30453e!important;box-shadow:0 5px 14px #33463e30,inset 0 -3px #9b7f3f70!important;font-weight:800!important}
  .v22-expedition-tab::before{background-position:25% 0!important;filter:sepia(.25) saturate(.8)!important}
  .v22-expedition-tab.active{background:#e6d6ab!important;border-color:#9e8040!important;color:#243a33!important}
  .v22-close-handle{display:none!important}
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
function bindLifecycle(){controls.addEventListener('xianxia:panel-open',e=>{if(e.detail?.open&&compact()){const active=$('.tab-btn.active');if(active?.dataset.tab!=='expedition')requestAnimationFrame(()=>showPanel(active))}});window.addEventListener('resize',()=>{if(!compact()){document.body.classList.remove('v22-panel-mode','v22-expedition-mode');return}requestAnimationFrame(()=>document.body.classList.contains('v22-panel-mode')?showPanel($('.tab-btn.active')):showExpedition())});$('#start')?.addEventListener('pointerup',()=>{ignoreTabsUntil=Date.now()+450},{capture:true});$('#start')?.addEventListener('click',()=>{ignoreTabsUntil=Date.now()+450;showExpedition()},{capture:true});}
function boot(){css();expeditionButton();installHandle();bindTabs();bindOutsideClose();bindLifecycle();if(compact())showExpedition();}
boot();

// v11.30: load verified brush-sprite runtime after the core UI scripts.
if(!document.querySelector('script[data-sprite-v1130]')){
  const s=document.createElement('script');
  s.src='sprite_runtime_v11_30.js?v=11.30';
  s.dataset.spriteV1130='1';
  s.async=false;
  document.head.appendChild(s);
}
})();
