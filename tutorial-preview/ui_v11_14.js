(()=>{
'use strict';

const $=s=>document.querySelector(s);
const RESULT_TITLES=new Set(['무사 귀환','육신 중상','비경 붕괴']);
if(window.__xianxiaExpeditionLayoutVersion==='11.14')return;
window.__xianxiaExpeditionLayoutVersion='11.14';

function addStyle(){
  if($('#v1114style'))return;
  const s=document.createElement('style');
  s.id='v1114style';
  s.textContent=`
  /* 시작 전 원정 비경 선택창: 내부 스크롤 없이 한 화면에 끝낸다. */
  .dialog.v14expedition{
    width:min(470px,100%)!important;
    max-height:none!important;
    overflow:hidden!important;
    padding:7px 8px!important;
    scrollbar-width:none;
  }
  .dialog.v14expedition::-webkit-scrollbar{display:none}
  .dialog.v14expedition h3{
    margin:0 0 2px!important;
    font-size:16px!important;
    line-height:1.08!important;
  }
  .dialog.v14expedition .intro{
    margin:1px 0 4px!important;
    font-size:8px!important;
    line-height:1.18!important;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
    overflow:hidden;
  }
  .dialog.v14expedition #expeditionAreaPicker{
    margin:2px 0 3px!important;
    padding:4px!important;
    border-radius:8px!important;
  }
  .dialog.v14expedition .expedition-area-head{
    margin:0 0 2px!important;
    min-height:12px!important;
  }
  .dialog.v14expedition .expedition-area-head b{font-size:8px!important}
  .dialog.v14expedition .expedition-area-head span{font-size:6.5px!important}
  .dialog.v14expedition .expedition-area-grid{gap:3px!important}
  .dialog.v14expedition .expedition-area-btn{
    min-height:31px!important;
    padding:2px 1px!important;
    border-radius:7px!important;
  }
  .dialog.v14expedition .expedition-area-btn i{
    margin:0!important;
    font-size:12px!important;
    line-height:1!important;
  }
  .dialog.v14expedition .expedition-area-btn span{
    margin-top:1px!important;
    font-size:6px!important;
    line-height:1.05!important;
  }
  .dialog.v14expedition .expedition-plan-label{
    margin:2px 0!important;
    font-size:7px!important;
    line-height:1!important;
  }
  .dialog.v14expedition #planChoices{
    gap:3px!important;
    margin:0!important;
  }
  .dialog.v14expedition .plan-card{
    min-height:48px!important;
    padding:4px 2px!important;
    border-radius:8px!important;
  }
  .dialog.v14expedition .plan-card b{
    margin:0 0 2px!important;
    font-size:9px!important;
    line-height:1.05!important;
  }
  .dialog.v14expedition .plan-card span{
    font-size:6.3px!important;
    line-height:1.12!important;
    display:-webkit-box!important;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
    overflow:hidden;
  }
  .dialog.v14expedition #start{
    min-height:31px!important;
    margin-top:4px!important;
    padding:4px 6px!important;
    font-size:10px!important;
  }
  @media(max-width:560px){
    .overlay{padding:4px!important}
    .dialog.v14expedition{padding:6px!important}
    .dialog.v14expedition h3{font-size:15px!important}
    .dialog.v14expedition .intro{font-size:7.5px!important;margin-bottom:3px!important}
    .dialog.v14expedition #expeditionAreaPicker{padding:3px!important;margin-bottom:2px!important}
    .dialog.v14expedition .expedition-area-btn{min-height:29px!important}
    .dialog.v14expedition .plan-card{min-height:44px!important;padding:3px 2px!important}
    .dialog.v14expedition .plan-card b{font-size:8.5px!important}
    .dialog.v14expedition .plan-card span{font-size:6px!important}
    .dialog.v14expedition #start{min-height:29px!important;margin-top:3px!important}
  }
  `;
  document.head.appendChild(s);
}

function sync(){
  const ov=$('#ov');
  const title=$('#ot');
  const dialog=title?.closest('.dialog');
  if(!ov||!title||!dialog)return;
  const result=RESULT_TITLES.has(title.textContent.trim());
  const visible=!ov.classList.contains('hide');
  dialog.classList.toggle('v14expedition',visible&&!result);
  if(visible&&!result)dialog.scrollTop=0;
}

function boot(){
  addStyle();
  const ov=$('#ov');
  const title=$('#ot');
  if(ov&&!ov.dataset.v1114exp){
    ov.dataset.v1114exp='1';
    new MutationObserver(sync).observe(ov,{attributes:true,attributeFilter:['class']});
  }
  if(title&&!title.dataset.v1114exp){
    title.dataset.v1114exp='1';
    new MutationObserver(sync).observe(title,{childList:true,characterData:true,subtree:true});
  }
  sync();
}

boot();
})();
