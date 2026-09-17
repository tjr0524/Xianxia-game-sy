(()=>{
'use strict';
const VERSION='11.42.0';
if(window.__xianxiaMapDetailPatch?.version===VERSION)return;
window.__xianxiaMapDetailPatch={version:VERSION};
window.__XIANXIA_BUILD__=VERSION;

const $=s=>document.querySelector(s);
let observer=null;
let sanitizing=false;

// DESIGN NOTE
// 단계별 내부 동작(R1~R5의 팩 밀도, 증원, 연쇄 활성 등)은 밸런스/구현 문서용 정보다.
// 플레이어용 비경 지도에는 체감 효과 한 줄, 현재 진행도, 해금 상태와 비용만 노출한다.
// 내부 세부 규칙은 기존 TREE 데이터와 밸런스 코드에 유지하고 UI에는 풀어 쓰지 않는다.
function cleanDetail(){
  if(sanitizing)return;
  const detail=$('#mapDetail');
  if(!detail)return;
  sanitizing=true;
  try{
    const expect=detail.querySelector('.node-expect');
    const button=detail.querySelector('.detail-action');
    const kicker=detail.querySelector('.node-kicker')?.textContent?.trim()||'';

    // 기존 UI는 "다음 단계 기대 효과 · <내부 R1~R5 규칙><br><실제 상태>"를 노출했다.
    // 마지막 줄의 실제 플레이 상태만 남긴다.
    if(expect){
      const parts=expect.innerHTML.split(/<br\s*\/?\s*>/i);
      if(parts.length>1){
        const tmp=document.createElement('div');
        tmp.innerHTML=parts[parts.length-1];
        const status=(tmp.textContent||'').trim();
        if(expect.textContent.trim()!==status)expect.textContent=status;
      }
    }

    const status=expect?.textContent?.trim()||'';
    const capped=status.startsWith('현재 경지 상한');
    const complete=/완성/.test(status)||/·\s*5\/5\s*$/.test(kicker);

    // 랭크 상한에 막힌 경우 다음 랭크 숫자를 버튼에 표시하지 않는다.
    // 예: 상태가 "현재 경지 상한 4/5"이면 버튼도 5/5 개척이 아니라 다음 경지 해금을 안내한다.
    if(button&&capped){
      button.disabled=true;
      if(button.textContent!=='다음 경지에서 개방')button.textContent='다음 경지에서 개방';
      detail.querySelector('.cost-row')?.remove();
    }else if(button&&complete){
      button.disabled=true;
      if(button.textContent!=='완성')button.textContent='완성';
    }else if(button&&button.disabled&&status){
      const label=status==='재료 부족'?'재료 부족':status.includes('선행')?'선행 조건 필요':status.includes('필요')||status.includes('미개방')?'조건 미충족':button.textContent;
      if(label&&button.textContent!==label)button.textContent=label;
    }

    const header=$('[data-panel="tree"] .section-head .small');
    if(header&&header.textContent!=='노드를 눌러 개척 정보 확인')header.textContent='노드를 눌러 개척 정보 확인';

    const badge=$('#buildVersion');
    if(badge)badge.textContent=`BUILD ${VERSION}`;
  }finally{
    sanitizing=false;
  }
}

function boot(){
  const detail=$('#mapDetail');
  if(!detail){setTimeout(boot,80);return}
  cleanDetail();
  observer?.disconnect();
  observer=new MutationObserver(()=>cleanDetail());
  observer.observe(detail,{childList:true,subtree:true,characterData:true});
  const header=$('[data-panel="tree"] .section-head .small');
  if(header)header.textContent='노드를 눌러 개척 정보 확인';
  const badge=$('#buildVersion');if(badge)badge.textContent=`BUILD ${VERSION}`;
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();