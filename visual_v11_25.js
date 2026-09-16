(()=>{
'use strict';
if(window.__xianxiaVisualVersion==='11.25')return;
window.__xianxiaVisualVersion='11.25';

const $=s=>document.querySelector(s);
const GLYPHS={qingyun:'青',blackwind:'風',blood:'血',thunder:'雷'};
const TAB_GLYPHS={'수련':'氣','법술':'法','비경 지도':'圖','비경':'圖','도행록':'錄','인연':'緣'};

function promoteTheme(){
  document.querySelector('#v1123-theme')?.remove();
  document.querySelector('#v1124-theme')?.remove();
  let link=$('#v1125-theme');
  if(!link){
    link=document.createElement('link');
    link.id='v1125-theme';
    link.rel='stylesheet';
    link.href='visual_v11_25.css?v=11.25';
    document.head.appendChild(link);
  }else document.head.appendChild(link);
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
    let label=button.querySelector('.v23-tab-label,.v25-tab-label')?.textContent?.trim()||button.textContent.trim();
    if(!label)return;
    const glyph=TAB_GLYPHS[label]||'卷';
    button.setAttribute('aria-label',label);
    button.innerHTML=`<span class="v25-tab-glyph" aria-hidden="true">${glyph}</span><span class="v25-tab-label">${label}</span>`;
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
  document.documentElement.dataset.visualVersion='11.25';
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
