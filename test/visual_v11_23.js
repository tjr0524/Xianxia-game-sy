(()=>{
'use strict';
if(window.__xianxiaVisualVersion==='11.23')return;
window.__xianxiaVisualVersion='11.23';

const $=selector=>document.querySelector(selector);
const GLYPHS={
  qingyun:'青',
  blackwind:'風',
  blood:'血',
  thunder:'雷'
};
const TAB_GLYPHS={
  '수련':'氣',
  '법술':'法',
  '비경 지도':'圖',
  '비경':'圖',
  '도행록':'錄',
  '인연':'緣'
};

function promoteTheme(){
  const link=$('#v1123-theme');
  if(link)document.head.appendChild(link);
}

function installArenaChrome(){
  const game=$('#game');
  if(!game)return;
  if(!game.querySelector('.v23-atmosphere')){
    const atmosphere=document.createElement('div');
    atmosphere.className='v23-atmosphere';
    atmosphere.setAttribute('aria-hidden','true');
    game.appendChild(atmosphere);
  }
  if(!game.querySelector('.v23-frame-corners')){
    const corners=document.createElement('div');
    corners.className='v23-frame-corners';
    corners.setAttribute('aria-hidden','true');
    game.appendChild(corners);
  }
  if(!game.querySelector('.v23-zone-watermark')){
    const watermark=document.createElement('div');
    watermark.className='v23-zone-watermark';
    watermark.setAttribute('aria-hidden','true');
    game.appendChild(watermark);
  }
  const head=$('.arena-head>div');
  if(head&&!head.querySelector('.v23-kicker')){
    const kicker=document.createElement('span');
    kicker.className='v23-kicker';
    kicker.textContent='秘境 원정';
    head.prepend(kicker);
  }
}

function decorateTabs(){
  document.querySelectorAll('.tab-btn:not(.v1117-hide)').forEach(button=>{
    if(button.querySelector('.v23-tab-label'))return;
    const label=button.textContent.trim();
    if(!label)return;
    const glyph=TAB_GLYPHS[label]||'卷';
    button.setAttribute('aria-label',label);
    button.innerHTML=`<span class="v23-tab-glyph" aria-hidden="true">${glyph}</span><span class="v23-tab-label">${label}</span>`;
  });
}

function areaFromPage(){
  try{
    const snap=window.__xianxiaDebug?.snapshot?.();
    if(snap?.M?.area)return snap.M.area;
  }catch{}
  const title=$('#area')?.textContent||'';
  if(title.includes('흑풍'))return'blackwind';
  if(title.includes('적혈'))return'blood';
  if(title.includes('천뢰'))return'thunder';
  return'qingyun';
}

function phaseFromPage(){
  try{
    const phase=window.__xianxiaDebug?.snapshot?.()?.phase;
    if(phase)return phase;
  }catch{}
  return $('#ov')?.classList.contains('hide')?'run':'camp';
}

function syncState(){
  const body=document.body;
  if(!body)return;
  const area=areaFromPage();
  const phase=phaseFromPage();
  body.dataset.v23Area=area;
  body.dataset.v23Phase=phase;
  body.classList.toggle('v23-danger',$('#game')?.classList.contains('danger')||false);
  const watermark=$('.v23-zone-watermark');
  if(watermark)watermark.textContent=GLYPHS[area]||'境';
}

let syncQueued=false;
function scheduleSync(){
  if(syncQueued)return;
  syncQueued=true;
  requestAnimationFrame(()=>{
    syncQueued=false;
    installArenaChrome();
    decorateTabs();
    syncState();
  });
}

function observe(){
  const observer=new MutationObserver(scheduleSync);
  const game=$('#game'),overlay=$('#ov'),area=$('#area'),tabs=$('.tabs');
  if(game)observer.observe(game,{attributes:true,attributeFilter:['class']});
  if(overlay)observer.observe(overlay,{attributes:true,attributeFilter:['class'],childList:true,subtree:true});
  if(area)observer.observe(area,{childList:true,subtree:true,characterData:true});
  if(tabs)observer.observe(tabs,{childList:true,subtree:true});
}

function boot(){
  document.documentElement.dataset.visualVersion='11.23';
  document.body.classList.add('v23-theme');
  promoteTheme();
  installArenaChrome();
  decorateTabs();
  syncState();
  observe();
  window.addEventListener('resize',scheduleSync,{passive:true});
  $('#start')?.addEventListener('click',()=>requestAnimationFrame(scheduleSync),{passive:true});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();
