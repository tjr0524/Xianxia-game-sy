(()=>{
'use strict';
const D=window.__xianxiaDebug,P=window.__xianxiaProgression;
if(!D||window.__xianxiaFreeExpeditionVersion==='11.20')return;
window.__xianxiaFreeExpeditionVersion='11.20';
const $=s=>document.querySelector(s),C=D.constants,clone=v=>JSON.parse(JSON.stringify(v));

// 11.19 길잡이가 더 이상 삭제된 원정 방침을 안내하지 않도록 선반영한다.
try{
  const key='xianxia_guide_v19';
  const guide=JSON.parse(localStorage.getItem(key)||'{}');
  guide.planLearned=1;
  localStorage.setItem(key,JSON.stringify(guide));
}catch{}

// 저장 호환용 단일 중립 프로필. 사용자에게는 노출하지 않는다.
const NEUTRAL={id:'harvest',icon:'',name:'원정',desc:'',enemyCount:1,herbCount:1,enemyHp:1,reward:1,dynamic:1,vein:1};
if(Array.isArray(C.PLANS))C.PLANS.splice(0,C.PLANS.length,NEUTRAL);

function normalizePlan(){
  const sh=D.snapshot();
  if(sh.phase==='run')return;
  const m=clone(sh.M);
  m.settings={...(m.settings||{}),plan:'harvest'};
  if(sh.M.settings?.plan!=='harvest')D.replaceState(m);
}

function css(){
  if($('#v1120freecss'))return;
  const s=document.createElement('style');
  s.id='v1120freecss';
  s.textContent=`
#planChoices,.expedition-plan-label,#objective{display:none!important}
.dialog.v17expedition{padding-top:7px!important;padding-bottom:7px!important}
.dialog.v17expedition #expeditionAreaPicker{margin:3px 0 5px!important}
.dialog.v17expedition #start{margin-top:4px!important}
.v17plans,.v17areas + .v17label{display:none!important}
.v17quick .v17chip{display:block!important}
`;
  document.head.appendChild(s);
}

function stripLegacyMissionReward(){
  const ox=$('#ox');
  if(!ox)return;
  const event=[...ox.querySelectorAll('.event')].find(e=>e.querySelector('b')?.textContent?.trim().startsWith('수행 완수'));
  if(!event)return;
  // The current game runtime already folds the objective reward into the final
  // expedition loot. This compatibility layer must never subtract that reward.
  // Keep only the old duplicate-card cleanup.
  event.remove();
}

function cleanUi(){
  const title=$('#ot')?.textContent?.trim()||'';
  const result=['무사 귀환','육신 중상','비경 붕괴'].includes(title);
  const start=$('#start');
  if(start){
    const wanted='입장';
    if(start.textContent!==wanted)start.textContent=wanted;
  }
  $('#v17settings')?.remove();
  const sheet=$('#v17back .v17sheet');
  if(sheet){
    const h=sheet.querySelector('h4');
    if(h&&h.textContent!=='비경 선택')h.textContent='비경 선택';
    const done=sheet.querySelector('.v17done');
    if(done&&done.textContent!=='닫기')done.textContent='닫기';
  }
  stripLegacyMissionReward();
}

function bindStart(){
  const start=$('#start');
  if(!start||start.dataset.v20free)return;
  start.dataset.v20free='1';
  start.addEventListener('click',()=>setTimeout(()=>{
    const sh=D.snapshot();
    if(sh.phase==='run'){
      const n=$('#notice');
      if(n)n.textContent='비경 진입. 전리품을 챙기되 귀환 동선을 항상 확보하십시오.';
    }
  },0));
}

let queued=false;
function schedule(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;cleanUi();bindStart()});
}
function observe(){
  const dialog=$('#ot')?.closest('.dialog');
  if(dialog)new MutationObserver(schedule).observe(dialog,{childList:true,subtree:true,characterData:true});
  const ov=$('#ov');
  if(ov)new MutationObserver(schedule).observe(ov,{attributes:true,attributeFilter:['class']});
}

function boot(){
  css();
  normalizePlan();
  bindStart();
  observe();
  cleanUi();
}
boot();
})();
