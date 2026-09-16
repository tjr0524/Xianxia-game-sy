(()=>{
'use strict';
if(window.__xianxiaVisualVersion==='11.25.1')return;
window.__xianxiaVisualVersion='11.25.1';

const $=s=>document.querySelector(s);
const GLYPHS={qingyun:'青',blackwind:'風',blood:'血',thunder:'雷'};

function promoteTheme(){
  document.querySelector('#v1123-theme')?.remove();
  document.querySelector('#v1124-theme')?.remove();
  let link=$('#v1125-theme');
  if(!link){
    link=document.createElement('link');
    link.id='v1125-theme';
    link.rel='stylesheet';
    document.head.appendChild(link);
  }
  link.href='visual_v11_25.css?v=11.25.1';
  document.head.appendChild(link);
}

function installCorrections(){
  let style=$('#v1125-corrections');
  if(style)return;
  style=document.createElement('style');
  style.id='v1125-corrections';
  style.textContent=`
body.v25-theme{
  background:linear-gradient(180deg,#faf8f1 0,#f3efe3 64%,#eceee8 100%)!important;
}
body.v25-theme::before{opacity:.18!important}
body.v25-theme::after{color:rgba(41,70,69,.014)!important}
.v25-theme .card::after,.v25-theme .controls::before{opacity:.07!important}
.v25-theme .asc-viewport,.v25-theme .map-viewport,.v25-theme .skill17view{
  background:#f8f6ee!important;
}
.v25-theme .skill17view{
  background:radial-gradient(circle at 50% 78%,rgba(99,83,133,.045),transparent 48%),#f8f6ee!important;
}
.v25-theme .asc-viewport::before,.v25-theme .map-viewport::before,.v25-theme .skill17view::before{
  opacity:.09!important;
}
.v25-theme .overlay::before{opacity:.18!important}
@media(max-width:920px){
  body.v25-theme .controls{
    position:fixed!important;
    z-index:30!important;
    left:6px!important;
    right:6px!important;
    top:auto!important;
    bottom:calc(env(safe-area-inset-bottom) + 7px)!important;
    width:auto!important;
    min-height:0!important;
    max-height:min(72dvh,640px)!important;
    overflow:auto!important;
  }
}
`;
  document.head.appendChild(style);
}

function installArenaChrome(){
  const game=$('#game');
  if(!game)return;
  game.querySelector('.v23-atmosphere')?.remove();
  game.querySelector('.v23-frame-corners')?.remove();
  game.querySelector('.v23-zone-watermark')?.remove();
  if(!game.querySelector('.v25-atmosphere')){
    const el=document.createElement('div');
    el.className='v25-atmosphere';
    el.setAttribute('aria-hidden','true');
    game.appendChild(el);
  }
  if(!game.querySelector('.v25-frame-corners')){
    const el=document.createElement('div');
    el.className='v25-frame-corners';
    el.setAttribute('aria-hidden','true');
    game.appendChild(el);
  }
  if(!game.querySelector('.v25-zone-watermark')){
    const el=document.createElement('div');
    el.className='v25-zone-watermark';
    el.setAttribute('aria-hidden','true');
    game.appendChild(el);
  }
  const head=$('.arena-head>div');
  head?.querySelector('.v23-kicker')?.remove();
  if(head&&!head.querySelector('.v25-kicker')){
    const kicker=document.createElement('span');
    kicker.className='v25-kicker';
    kicker.textContent='水墨 · 秘境圖';
    head.prepend(kicker);
  }
}

function decorateTabs(){
  document.querySelectorAll('.tab-btn:not(.v1117-hide)').forEach(button=>{
    const label=button.querySelector('.v23-tab-label,.v25-tab-label')?.textContent?.trim()||button.textContent.trim();
    if(!label)return;
    button.setAttribute('aria-label',label);
    button.innerHTML=`<span class="v25-tab-label">${label}</span>`;
  });
}

function areaFromPage(){
  try{
    const area=window.__xianxiaDebug?.snapshot?.()?.M?.area;
    if(area)return area;
  }catch{}
  const title=$('#area')?.textContent||'';
  if(title.includes('흑풍'))return'blackwind';
  if(title.includes('적혈'))return'blood';
  if(title.includes('천뢰'))return'thunder';
  return'qingyun';
}
function phaseFromPage(){
  try{return window.__xianxiaDebug?.snapshot?.()?.phase||'home'}catch{return $('#ov')?.classList.contains('hide')?'run':'home'}
}
function syncState(){
  const body=document.body;
  if(!body)return;
  const area=areaFromPage(),phase=phaseFromPage();
  body.dataset.v25Area=area;
  body.dataset.v25Phase=phase;
  body.dataset.v23Area=area;
  body.dataset.v23Phase=phase;
  const watermark=$('.v25-zone-watermark');
  if(watermark)watermark.textContent=GLYPHS[area]||'境';
}

function markDialog(){
  const dialog=$('#ov .dialog');
  if(!dialog)return;
  dialog.dataset.v25Window='1';
  dialog.querySelectorAll('button').forEach(button=>button.dataset.v25Button='1');
}

let queued=false;
function schedule(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{
    queued=false;
    installArenaChrome();
    decorateTabs();
    syncState();
    markDialog();
  });
}
function observe(){
  const observer=new MutationObserver(schedule);
  const targets=[$('#game'),$('#ov'),$('#area'),$('.tabs'),$('.controls')].filter(Boolean);
  for(const target of targets)observer.observe(target,{attributes:true,attributeFilter:['class'],childList:true,subtree:true,characterData:true});
}
function boot(){
  promoteTheme();
  installCorrections();
  document.documentElement.dataset.visualVersion='11.25.1';
  document.body.classList.remove('v23-theme','v24-theme');
  document.body.classList.add('v25-theme');
  installArenaChrome();
  decorateTabs();
  syncState();
  markDialog();
  observe();
  window.addEventListener('resize',schedule,{passive:true});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();
