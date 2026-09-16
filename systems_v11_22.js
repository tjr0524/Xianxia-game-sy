(()=>{
'use strict';
const D=window.__xianxiaDebug;
if(!D||window.__xianxiaPanelUxVersion==='11.22')return;
window.__xianxiaPanelUxVersion='11.22';
const $=s=>document.querySelector(s);
const controls=$('.controls'),tabs=$('.tabs'),game=$('#game');
if(!controls||!tabs)return;
const compact=()=>!!window.matchMedia?.('(max-width:920px)').matches;
let desiredOpen=controls.classList.contains('open');

function css(){
  if($('#v1122panelcss'))return;
  const s=document.createElement('style');
  s.id='v1122panelcss';
  s.textContent=`
.v22-close-handle{display:none}
@media(max-width:920px){
  .controls.open .tabs{padding-top:36px!important;transition:padding-top .16s ease}
  .v22-close-handle{position:absolute;z-index:20;left:50%;top:4px;transform:translateX(-50%);display:none;align-items:center;justify-content:center;gap:6px;width:92px;height:27px;margin:0;padding:0 10px;border:1px solid #40565a;border-radius:999px;background:#17272cee;color:#c5d4d0;font-size:9px;font-weight:750;box-shadow:0 5px 15px #0007;touch-action:none;user-select:none;-webkit-user-select:none}
  .controls.open .v22-close-handle{display:flex}
  .v22-close-handle:before{content:'';width:22px;height:3px;border-radius:99px;background:#718581}
  .v22-close-handle.dragging{background:#23383d;border-color:#718d88;color:#eff8f5}
}
`;
  document.head.appendChild(s);
}

function syncAria(open){
  document.querySelectorAll('.tab-btn').forEach(b=>b.setAttribute('aria-expanded',String(open&&b.classList.contains('active'))));
}
function setOpen(open){
  if(!compact())return;
  desiredOpen=!!open;
  controls.classList.toggle('open',desiredOpen);
  syncAria(desiredOpen);
}
function closePanel(){setOpen(false)}

function installHandle(){
  let b=$('#v22PanelClose');
  if(b)return b;
  b=document.createElement('button');
  b.id='v22PanelClose';
  b.type='button';
  b.className='v22-close-handle';
  b.setAttribute('aria-label','성장 패널 닫기');
  b.innerHTML='<span>⌄ 닫기</span>';
  tabs.appendChild(b);
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();closePanel()});
  let sy=0,dy=0,drag=false;
  b.addEventListener('pointerdown',e=>{
    sy=e.clientY;dy=0;drag=true;b.classList.add('dragging');
    try{b.setPointerCapture(e.pointerId)}catch{}
    e.preventDefault();e.stopPropagation();
  },{passive:false});
  b.addEventListener('pointermove',e=>{
    if(!drag)return;dy=e.clientY-sy;
    b.style.transform=`translateX(-50%) translateY(${Math.max(0,Math.min(24,dy*.35))}px)`;
    e.preventDefault();e.stopPropagation();
  },{passive:false});
  const end=e=>{
    if(!drag)return;drag=false;b.classList.remove('dragging');b.style.transform='translateX(-50%)';
    if(dy>34)closePanel();
    try{b.releasePointerCapture(e.pointerId)}catch{}
    e.preventDefault();e.stopPropagation();
  };
  b.addEventListener('pointerup',end,{passive:false});
  b.addEventListener('pointercancel',end,{passive:false});
  return b;
}

function bindTabs(){
  if(tabs.dataset.v22tabs)return;
  tabs.dataset.v22tabs='1';
  tabs.addEventListener('click',e=>{
    const b=e.target.closest('.tab-btn');
    if(!b||!compact())return;
    const wasOpen=controls.classList.contains('open');
    const wasActive=b.classList.contains('active');
    requestAnimationFrame(()=>{
      setOpen(wasOpen&&wasActive?false:true);
    });
  },true);
}

function bindOutsideClose(){
  if(!game||game.dataset.v22close)return;
  game.dataset.v22close='1';
  game.addEventListener('pointerdown',()=>{
    if(compact()&&controls.classList.contains('open'))closePanel();
  },{capture:true,passive:true});
}

function bindLifecycle(){
  window.addEventListener('resize',()=>{
    if(!compact())return;
    if(D.snapshot().phase==='run')desiredOpen=false;
    requestAnimationFrame(()=>setOpen(desiredOpen));
  });
  $('#start')?.addEventListener('click',()=>{desiredOpen=false},{capture:true});
}

function boot(){
  css();installHandle();bindTabs();bindOutsideClose();bindLifecycle();
  if(compact())desiredOpen=controls.classList.contains('open');
}
boot();
})();

(()=>{
'use strict';
if(window.__xianxiaSpriteRuntime||document.querySelector('script[data-v1128-sprites]'))return;
const s=document.createElement('script');
s.src='sprite_runtime_v11_28.js?v=11.28';
s.dataset.v1128Sprites='1';
s.async=false;
document.head.appendChild(s);
})();
