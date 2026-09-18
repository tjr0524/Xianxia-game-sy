(()=>{
'use strict';
const VERSION='11.41.0';
if(window.__xianxiaResultFlow?.version===VERSION)return;
window.__xianxiaResultFlow={version:VERSION};

const $=s=>document.querySelector(s);
let priorPhase=null;
let lastView=null;
let resultOpen=false;
let pendingTimer=0;

function snap(){
  try{return window.__xianxiaDebug?.snapshot?.()||null}catch{return null}
}
function badge(){}
function installStyles(){
  if($('#v1141ResultStyle'))return;
  const style=document.createElement('style');
  style.id='v1141ResultStyle';
  style.textContent=`
body.v1141-result-mode{overflow:hidden!important;overscroll-behavior:none!important;padding-bottom:0!important;background:#101713!important}
body.v1141-result-mode .shell{display:block!important;width:100%!important;max-width:none!important;height:100dvh!important;margin:0!important;padding:0!important}
body.v1141-result-mode .layout{display:block!important;width:100%!important;height:100%!important;margin:0!important;padding:0!important;overflow:hidden!important}
body.v1141-result-mode .topbar,
body.v1141-result-mode .arena-head,
body.v1141-result-mode .arena-card>.hud,
body.v1141-result-mode .arena-card>.objective,
body.v1141-result-mode .arena-card>.run-row,
body.v1141-result-mode .arena-card>.notice,
body.v1141-result-mode .controls,
body.v1141-result-mode .tabs.v22-mobile-nav,
body.v1141-result-mode .footer{display:none!important}
body.v1141-result-mode .arena-card{position:fixed!important;z-index:21000!important;display:block!important;inset:0!important;width:100vw!important;height:100dvh!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;background:#101713!important;overflow:hidden!important}
body.v1141-result-mode #game{position:absolute!important;display:block!important;inset:0!important;width:100vw!important;height:100dvh!important;margin:0!important;border:0!important;border-radius:0!important;overflow:hidden!important;background:#101713!important;box-shadow:none!important}
body.v1141-result-mode #ov{display:none!important}
body.v1141-result-mode #v1133Hud{display:none!important}
body.v1141-result-mode #cv,
body.v1141-result-mode #v1131InkLayer,
body.v1141-result-mode #v1132GatherLayer{display:block!important;position:absolute!important;left:var(--v1141-left,0px)!important;top:var(--v1141-top,0px)!important;right:auto!important;bottom:auto!important;width:var(--v1141-width,100vw)!important;height:var(--v1141-height,100dvh)!important;max-width:none!important;max-height:none!important;transform:none!important;transform-origin:0 0!important}
body.v1141-result-mode #cv{opacity:0!important}

#v1141ResultLayer{position:fixed;z-index:29000;inset:0;display:grid;place-items:center;padding:max(18px,env(safe-area-inset-top)) 16px max(20px,env(safe-area-inset-bottom));background:linear-gradient(180deg,rgba(8,13,11,.12),rgba(8,13,11,.52));backdrop-filter:blur(1.5px);animation:v1141ResultIn .22s ease-out both}
#v1141ResultCard{width:min(386px,calc(100vw - 28px));max-height:min(560px,76dvh);overflow:auto;padding:18px 16px 14px;border:1px solid rgba(222,215,194,.66);border-radius:16px 5px 16px 5px;background:linear-gradient(155deg,rgba(249,246,235,.97),rgba(226,224,211,.96));box-shadow:0 18px 58px rgba(8,14,12,.42),inset 0 1px rgba(255,255,255,.9);color:#263833;text-align:center;-webkit-overflow-scrolling:touch}
#v1141ResultSeal{width:42px;height:42px;margin:0 auto 8px;display:grid;place-items:center;border:1px solid #758b81;border-radius:50%;background:rgba(238,235,220,.88);color:#38564b;font:800 20px/1 var(--v25-serif,serif);box-shadow:inset 0 0 0 3px rgba(255,255,255,.45)}
#v1141ResultLayer.dead #v1141ResultSeal{border-color:#9c5d55;color:#8b3d36;background:#f0ddd6}
#v1141ResultLayer.collapse #v1141ResultSeal{border-color:#9a814b;color:#735b24;background:#efe5c9}
#v1141ResultTitle{margin:0;color:#273b35;font:800 21px/1.2 var(--v25-serif,serif);letter-spacing:.04em}
#v1141ResultSub{margin:5px 0 12px;color:#72807b;font-size:9px;line-height:1.4}
#v1141ResultBody{padding:11px 10px;border-top:1px solid rgba(104,123,115,.22);border-bottom:1px solid rgba(104,123,115,.22);color:#42544e;font-size:11px;line-height:1.65;text-align:left}
#v1141ResultBody>b{color:#283e37;font-size:13px}
#v1141ResultBody .event{margin:9px 0 0!important;padding:8px!important;border:1px solid rgba(158,129,64,.34)!important;border-radius:8px 3px 8px 3px!important;background:rgba(248,239,210,.62)!important;color:#6e5928!important;font-size:9px!important;line-height:1.45!important}
#v1141ResultActions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:13px}
#v1141ResultActions button{min-height:45px;margin:0;padding:8px 10px;border-radius:10px 3px 10px 3px;font:800 11px/1.2 var(--v25-serif,serif);touch-action:manipulation}
#v1141Again{border:1px solid #557e70;background:linear-gradient(180deg,#5e8f7e,#426d60);color:#fffdf5;box-shadow:0 5px 14px rgba(45,79,68,.18)}
#v1141Back{border:1px solid #9aa49e;background:linear-gradient(180deg,#fbfaf3,#e6e6dc);color:#3b4d47}
@keyframes v1141ResultIn{from{opacity:0;transform:scale(.985)}to{opacity:1;transform:scale(1)}}
@media(max-width:560px){#v1141ResultCard{width:min(354px,calc(100vw - 24px));max-height:70dvh;padding:15px 13px 12px}#v1141ResultTitle{font-size:19px}#v1141ResultActions button{min-height:43px}}
`;
  document.head.appendChild(style);
}

function captureView(){
  const mode=window.__xianxiaExplorationMode;
  if(!mode?.active)return;
  const layer=$('#v1131InkLayer')||$('#cv');
  const scale=+mode.scale||1;
  lastView={
    left:Number.isFinite(+mode.left)?+mode.left:parseFloat(layer?.style.left)||0,
    top:Number.isFinite(+mode.top)?+mode.top:parseFloat(layer?.style.top)||0,
    width:parseFloat(layer?.style.width)||1800*scale,
    height:parseFloat(layer?.style.height)||2400*scale,
    scale
  };
}
function holdCombatScene(){
  const v=lastView||{left:0,top:0,width:innerWidth||390,height:innerHeight||844};
  const body=document.body;
  body.style.setProperty('--v1141-left',`${v.left}px`);
  body.style.setProperty('--v1141-top',`${v.top}px`);
  body.style.setProperty('--v1141-width',`${v.width}px`);
  body.style.setProperty('--v1141-height',`${v.height}px`);
  body.classList.add('v1141-result-mode');
}
function releaseCombatScene(){
  const body=document.body;
  body.classList.remove('v1141-result-mode');
  for(const key of ['--v1141-left','--v1141-top','--v1141-width','--v1141-height'])body.style.removeProperty(key);
}
function areaInfo(){
  const s=snap();
  const id=s?.M?.area;
  const areas=window.__xianxiaDebug?.constants?.AREAS||[];
  return areas.find?.(a=>a.id===id)||null;
}
function restorePreparation(){
  const area=areaInfo();
  const title=$('#ot'),intro=$('#ox'),ov=$('#ov');
  if(title)title.textContent=area?.name||$('#area')?.textContent||'비경 준비';
  if(intro){
    const desc=area?.desc||'수행 방침과 동선을 정한 뒤 비경에 입장하세요.';
    intro.innerHTML=`${desc}<br><span style="opacity:.72">수행 방침을 고르고 입장하세요.</span>`;
  }
  ov?.classList.remove('hide');
}
function closeResult(){
  clearTimeout(pendingTimer);pendingTimer=0;
  $('#v1141ResultLayer')?.remove();
  resultOpen=false;
  releaseCombatScene();
}
function retry(){
  const start=$('#start');
  closeResult();
  if(start){
    requestAnimationFrame(()=>start.click());
  }
}
function backToPreparation(){
  closeResult();
  restorePreparation();
}
function resultMeta(title){
  if(/중상|불능|사망/.test(title))return{kind:'dead',seal:'傷',sub:'이번 원정은 여기서 끝났습니다.'};
  if(/붕괴/.test(title))return{kind:'collapse',seal:'危',sub:'비경이 붕괴되어 일부 전리품만 회수했습니다.'};
  return{kind:'safe',seal:'歸',sub:'이번 원정의 결과를 확인하세요.'};
}
function showResult(){
  if(resultOpen)return;
  resultOpen=true;
  $('#v1141ResultLayer')?.remove();
  const sourceTitle=$('#ot')?.textContent?.trim()||'원정 결과';
  const sourceBody=$('#ox')?.innerHTML||'원정이 종료되었습니다.';
  const meta=resultMeta(sourceTitle);
  const layer=document.createElement('div');
  layer.id='v1141ResultLayer';
  layer.className=meta.kind;
  layer.innerHTML=`<section id="v1141ResultCard" role="dialog" aria-modal="true" aria-labelledby="v1141ResultTitle">
    <div id="v1141ResultSeal" aria-hidden="true">${meta.seal}</div>
    <h2 id="v1141ResultTitle">${sourceTitle}</h2>
    <p id="v1141ResultSub">${meta.sub}</p>
    <div id="v1141ResultBody">${sourceBody}</div>
    <div id="v1141ResultActions"><button id="v1141Again" type="button">다시 입장</button><button id="v1141Back" type="button">돌아가기</button></div>
  </section>`;
  layer.addEventListener('pointerdown',e=>e.stopPropagation(),true);
  layer.querySelector('#v1141Again').addEventListener('click',retry);
  layer.querySelector('#v1141Back').addEventListener('click',backToPreparation);
  document.body.appendChild(layer);
}
function onRunFinished(s){
  holdCombatScene();
  const dead=(+s?.P?.hp||0)<=0 || /육신 중상|전투 불능/.test($('#ot')?.textContent||'');
  if(dead){
    requestAnimationFrame(()=>{
      const text=$('#v1140DeathFx .v1140-death-copy span');
      if(text)text.textContent='체력이 다해 쓰러졌습니다.';
    });
    clearTimeout(pendingTimer);
    pendingTimer=setTimeout(()=>{pendingTimer=0;showResult()},1120);
  }else{
    showResult();
  }
}
function frame(s){
  const phase=s?.phase||null;
  if(phase==='run'){
    captureView();
    if(resultOpen){$('#v1141ResultLayer')?.remove();resultOpen=false;releaseCombatScene()}
  }else if(priorPhase==='run'){
    onRunFinished(s);
  }
  priorPhase=phase;
}
function subscribeFrame(){
  const hub=window.__xianxiaFrameHub;
  if(hub?.subscribe){
    hub.subscribe('result-flow',frame,60);
    return;
  }
  function fallback(){
    frame(snap());
    requestAnimationFrame(fallback);
  }
  requestAnimationFrame(fallback);
}
function boot(){
  installStyles();badge();
  subscribeFrame();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();