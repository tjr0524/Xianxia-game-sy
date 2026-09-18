(()=>{
'use strict';
const VERSION='11.49.0';
if(window.__xianxiaFirstRunTutorial?.version===VERSION)return;

const $=s=>document.querySelector(s);
const D=window.__xianxiaDebug;
if(!D)return;

let lastPhase=null;
let lastKey='';

function firstRunCandidate(s){
  return !!s &&
    (s.M?.stats?.totalRuns||0)===0 &&
    (s.M?.realm?.major??-1)<0 &&
    s.M?.area==='qingyun';
}

function controlHint(){
  return window.matchMedia?.('(max-width:920px)').matches
    ? '화면을 탭하거나 드래그해 이동합니다.'
    : 'WASD·방향키 또는 화면 클릭/드래그로 이동합니다.';
}

function ensureStyle(){
  if($('#v1149TutorialStyle'))return;
  const style=document.createElement('style');
  style.id='v1149TutorialStyle';
  style.textContent=`
#v1149Tutorial{
  position:absolute;z-index:95;left:50%;top:max(12px,env(safe-area-inset-top));
  transform:translateX(-50%);width:min(330px,calc(100% - 24px));
  padding:9px 11px;border:1px solid rgba(102,125,114,.52);
  border-radius:11px 4px 11px 4px;
  background:rgba(248,244,230,.94);color:#2f433b;
  box-shadow:0 8px 24px rgba(31,44,38,.20);
  text-align:left;pointer-events:none;backdrop-filter:blur(3px)
}
#v1149Tutorial b{display:block;margin-bottom:3px;font:800 12px/1.25 var(--v25-serif,serif);letter-spacing:.02em}
#v1149Tutorial span{display:block;font-size:10px;line-height:1.45}
#v1149Tutorial small{display:block;margin-top:4px;color:#6d7d76;font-size:8.5px;line-height:1.35}
#v1149Tutorial.done{border-color:rgba(151,119,53,.55);background:rgba(250,241,207,.95)}
#v1149Tutorial .count{font-weight:800;color:#486d5f}
#v1149Tutorial.done .count{color:#8a6b2f}
@media(max-width:560px){
  #v1149Tutorial{top:max(8px,env(safe-area-inset-top));width:min(310px,calc(100% - 20px));padding:8px 10px}
  #v1149Tutorial b{font-size:11px}
  #v1149Tutorial span{font-size:9.5px}
}
`;
  (document.head||document.documentElement).appendChild(style);
}

function banner(){
  let el=$('#v1149Tutorial');
  if(el)return el;
  const game=$('#game');
  if(!game)return null;
  el=document.createElement('div');
  el.id='v1149Tutorial';
  el.setAttribute('role','status');
  el.setAttribute('aria-live','polite');
  game.appendChild(el);
  return el;
}

function removeBanner(){
  $('#v1149Tutorial')?.remove();
  lastKey='';
}

function targetData(s){
  let target=5;
  try{
    const objective=D.objectiveData?.();
    if(objective?.label==='영초 채집'&&Number.isFinite(+objective.target))target=Math.max(1,+objective.target);
  }catch{}
  const got=(+s?.run?.h0||0)+(+s?.run?.h1||0)+(+s?.run?.h2||0);
  return {target,got};
}

function updatePreparation(s){
  if(!firstRunCandidate(s)||s.phase!=='home')return;
  const ov=$('#ov'),title=$('#ot'),intro=$('#ox');
  if(!ov||ov.classList.contains('hide')||!title||!intro)return;
  if(/무사 귀환|육신 중상|비경 붕괴/.test(title.textContent||''))return;
  const target=5;
  const html=`<b>첫 비경 · 생존 연습</b><br>
    아직 범인은 요수와 싸울 수 없습니다.<br>
    ① <strong>요수를 피해서 영초 ${target}개</strong>를 모으세요.<br>
    ② 영초는 가까이 가면 자동으로 채집됩니다.<br>
    ③ 다 모으면 <strong>귀환진</strong>으로 돌아오세요.<br>
    <span style="opacity:.72">${controlHint()}</span>`;
  if(intro.dataset.v1149Tutorial!=='1'){
    intro.dataset.v1149Tutorial='1';
    intro.innerHTML=html;
  }
}

function updateRun(s){
  if(!firstRunCandidate(s)||s.phase!=='run'){
    removeBanner();
    return;
  }
  const {target,got}=targetData(s);
  const done=got>=target;
  const key=`${done?'done':'gather'}:${got}:${target}:${controlHint()}`;
  if(key===lastKey)return;
  lastKey=key;
  const el=banner();
  if(!el)return;
  el.classList.toggle('done',done);
  if(done){
    el.innerHTML=`<b>✓ 채집 완료 · 이제 살아서 돌아가세요</b>
      <span>영초 <span class="count">${Math.min(got,target)}/${target}</span> · 남쪽 귀환진으로 복귀하세요.</span>
      <small>오른쪽 아래 귀환 버튼을 누르거나 직접 귀환진으로 이동해도 됩니다.</small>`;
  }else{
    el.innerHTML=`<b>첫 수행 · 요수를 피하세요</b>
      <span>영초를 <span class="count">${got}/${target}</span> 모으세요. 가까이 가면 자동 채집됩니다.</span>
      <small>범인은 아직 공격할 수 없습니다 · ${controlHint()}</small>`;
  }
}

function frame(s){
  updatePreparation(s);
  updateRun(s);
  lastPhase=s?.phase||null;
}

function boot(){
  ensureStyle();
  let s=null;
  try{s=D.snapshot()}catch{}
  if(s)frame(s);
  const hub=window.__xianxiaFrameHub;
  if(hub?.subscribe){
    hub.subscribe('first-run-tutorial',frame,80);
    return;
  }
  function fallback(){
    let snap=null;try{snap=D.snapshot()}catch{}
    frame(snap);
    requestAnimationFrame(fallback);
  }
  requestAnimationFrame(fallback);
}

window.__xianxiaFirstRunTutorial={version:VERSION};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();
