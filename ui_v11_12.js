(()=>{
'use strict';

const $=s=>document.querySelector(s);
const RESULT_TITLES=new Set(['무사 귀환','육신 중상','비경 붕괴']);
let startText='선택한 방침으로 진입';
let popoverReady=false;

function addStyle(){
  if($('#v1112style'))return;
  const s=document.createElement('style');
  s.id='v1112style';
  s.textContent=`
  /* 귀환 정산은 기본 상태에서 한 화면 안에 끝낸다. */
  .dialog.result-compact{max-height:94%!important;overflow:hidden!important;padding:10px 12px!important}
  .dialog.result-compact h3{font-size:18px!important;margin-bottom:2px!important}
  .dialog.result-compact .intro{margin:3px 0 5px!important;font-size:9px!important;line-height:1.3!important}
  .dialog.result-compact #ox{margin:2px 0 4px!important;font-size:10px!important;line-height:1.35!important}
  .dialog.result-compact #ox>br{display:none}
  .dialog.result-compact #ox>b{display:block;margin:3px 0 5px;font-size:11px;color:#f1e2b1}
  .dialog.result-compact #ox .event{margin:4px 0!important;padding:5px 7px!important;font-size:8px!important;line-height:1.28!important;border-radius:7px!important}
  .dialog.result-compact #expeditionAreaPicker,
  .dialog.result-compact .expedition-plan-label,
  .dialog.result-compact #planChoices{display:none!important}
  .dialog.result-compact.result-config-open{overflow:auto!important}
  .dialog.result-compact.result-config-open #expeditionAreaPicker{display:block!important}
  .dialog.result-compact.result-config-open .expedition-plan-label{display:block!important}
  .dialog.result-compact.result-config-open #planChoices{display:grid!important}
  .result-config-toggle{width:100%;min-height:30px;margin:4px 0 0;padding:4px 8px;border:1px solid #3e5559;border-radius:8px;background:#142328;color:#aebfbb;font-size:9px;text-align:center}
  .dialog.result-compact #start{min-height:34px!important;margin-top:5px!important;font-size:10px!important}

  /* 수련 상세는 도맥 아래가 아니라 도맥 안에 뜨는 작은 창으로 사용한다. */
  #ascViewport{position:relative}
  #ascDetail.asc-float-detail{position:absolute;z-index:40;width:min(260px,calc(100% - 18px));min-height:0;max-height:230px;overflow:auto;margin:0!important;padding:9px 10px!important;box-shadow:0 12px 32px #000c;border-color:#55706c;background:#0b171bdd;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);pointer-events:auto;touch-action:pan-y;display:none}
  #ascDetail.asc-float-detail.open{display:block}
  #ascDetail.asc-float-detail .detail-head{padding-right:22px}
  #ascDetail.asc-float-detail p{margin:4px 0!important;font-size:8.5px!important;line-height:1.35!important}
  #ascDetail.asc-float-detail .detail-action{min-height:32px!important;margin-top:5px!important;font-size:9px!important}
  .asc-pop-close{position:absolute;right:5px;top:5px;width:22px;height:22px;margin:0;padding:0;border:1px solid #536568;border-radius:50%;background:#111f23;color:#aebfbb;font-size:12px;line-height:18px;text-align:center}
  @media(max-width:560px){
    .dialog.result-compact{padding:7px 8px!important}
    .dialog.result-compact h3{font-size:16px!important}
    #ascDetail.asc-float-detail{width:min(230px,calc(100% - 14px));max-height:205px;padding:7px 8px!important}
  }
  `;
  document.head.appendChild(s);
}

function ensureResultToggle(dialog){
  let b=$('#resultConfigToggle');
  if(!b){
    b=document.createElement('button');
    b.id='resultConfigToggle';
    b.type='button';
    b.className='result-config-toggle';
    const start=$('#start');
    if(start)start.parentNode.insertBefore(b,start);
  }
  b.onclick=()=>{
    const open=dialog.classList.toggle('result-config-open');
    b.textContent=open?'원정 설정 접기':'원정 설정';
  };
  return b;
}

function syncResultMode(){
  const title=$('#ot'),dialog=title?.closest('.dialog'),start=$('#start');
  if(!title||!dialog)return;
  const isResult=RESULT_TITLES.has(title.textContent.trim());
  dialog.classList.toggle('result-compact',isResult);
  if(!isResult){
    dialog.classList.remove('result-config-open');
    $('#resultConfigToggle')?.remove();
    if(start&&start.dataset.resultLabel==='1'){
      start.textContent=startText;
      delete start.dataset.resultLabel;
    }
    return;
  }
  dialog.classList.remove('result-config-open');
  const toggle=ensureResultToggle(dialog);
  toggle.textContent='원정 설정';
  if(start){
    if(start.dataset.resultLabel!=='1')startText=start.textContent||startText;
    start.dataset.resultLabel='1';
    start.textContent='같은 설정으로 다시 진입';
  }
}

function ensureClose(detail){
  if(detail.querySelector('.asc-pop-close'))return;
  const b=document.createElement('button');
  b.type='button';
  b.className='asc-pop-close';
  b.setAttribute('aria-label','상세 닫기');
  b.textContent='×';
  b.onclick=e=>{e.stopPropagation();detail.classList.remove('open')};
  detail.appendChild(b);
}

function positionDetail(view,node,detail){
  detail.classList.add('open');
  ensureClose(detail);
  detail.style.visibility='hidden';
  detail.style.left='8px';
  detail.style.top='8px';
  requestAnimationFrame(()=>{
    const vr=view.getBoundingClientRect(),nr=node.getBoundingClientRect();
    const w=Math.min(detail.offsetWidth||250,Math.max(120,vr.width-16));
    const h=Math.min(detail.offsetHeight||150,Math.max(90,vr.height-16));
    let left=nr.right-vr.left+8;
    if(left+w>vr.width-8)left=nr.left-vr.left-w-8;
    if(left<8)left=Math.max(8,(vr.width-w)/2);
    let top=nr.top-vr.top+nr.height/2-h/2;
    top=Math.max(8,Math.min(vr.height-h-8,top));
    detail.style.left=`${Math.round(left)}px`;
    detail.style.top=`${Math.round(top)}px`;
    detail.style.visibility='visible';
  });
}

function installTrainingPopover(){
  const view=$('#ascViewport'),detail=$('#ascDetail');
  if(!view||!detail){setTimeout(installTrainingPopover,80);return}
  if(popoverReady)return;
  popoverReady=true;
  detail.classList.add('asc-float-detail');
  view.appendChild(detail);
  detail.classList.remove('open');

  view.addEventListener('click',e=>{
    const node=e.target.closest('.asc-node');
    if(node){
      requestAnimationFrame(()=>positionDetail(view,node,detail));
      return;
    }
    if(!e.target.closest('#ascDetail'))detail.classList.remove('open');
  },true);

  detail.addEventListener('pointerdown',e=>e.stopPropagation());
  detail.addEventListener('click',e=>e.stopPropagation());
  window.addEventListener('resize',()=>detail.classList.remove('open'));
}

function boot(){
  addStyle();
  installTrainingPopover();
  const title=$('#ot'),ov=$('#ov');
  if(title&&!title.dataset.v1112Result){
    title.dataset.v1112Result='1';
    new MutationObserver(syncResultMode).observe(title,{childList:true,characterData:true,subtree:true});
  }
  if(ov&&!ov.dataset.v1112Result){
    ov.dataset.v1112Result='1';
    new MutationObserver(syncResultMode).observe(ov,{attributes:true,attributeFilter:['class']});
  }
  syncResultMode();
}

boot();
})();