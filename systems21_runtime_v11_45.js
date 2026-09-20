/* GENERATED FLAT RUNTIME 11.45 · source chain: systems_v11_21 -> balance_systems21_v11_36 */
(()=>{
'use strict';
const D=window.__xianxiaDebug,P=window.__xianxiaProgression;
if(!D||!P||window.__xianxiaUxFixVersion==='11.21')return;
window.__xianxiaUxFixVersion='11.21';
const $=s=>document.querySelector(s);
const TRAIN=P.trainingPath||[];
const HKEY=g=>g===0?'herb':g===1?'herb2':'herb3';

function currentStageIndex(m){
  let idx=-1;
  for(let i=0;i<TRAIN.length;i++){
    const r=TRAIN[i].req;
    if((m.realm?.major??-1)>r.major||((m.realm?.major??-1)===r.major&&(m.realm?.stage??0)>=r.stage))idx=i;
  }
  return idx;
}
function completed(m,stage){return stage?.nodes?.filter(n=>m.trainingNodes?.[n.id]).length||0}

// 경지 비용/조건의 단일 소유자는 progression runtime이다.
// 이 UI 호환 레이어가 별도 가격표를 가지면 축기 이후 모든 단계가 f1 비용으로 fallback된다.
function breakthroughCost(i){
  return P.breakthroughCost?.(i)||null;
}
function stageStatus(i){
  return P.stageStatus?.(i)||{can:false,text:'경지 상태를 불러오지 못했습니다.',price:breakthroughCost(i)};
}
function costHtml(c){
  if(P.costHtml)return P.costHtml(c);
  const a=[];
  if(c?.s)a.push(`<span class="cost-chip stone"><i>◆</i>${c.s}</span>`);
  if(c?.h)a.push(`<span class="cost-chip herb g${c.hg}"><i>❧</i>${c.h}</span>`);
  return a.join('')||'<span class="cost-chip free">무료</span>';
}
function ensureClose(detail){
  if(detail.querySelector('.v17close'))return;
  const b=document.createElement('button');
  b.className='v17close';
  b.textContent='×';
  b.onclick=e=>{e.stopPropagation();detail.classList.remove('open')};
  detail.appendChild(b);
}
function setDetail(detail,html){detail.innerHTML=html;ensureClose(detail)}

function rewriteStageDetail(idx){
  const detail=$('#ascDetail');
  if(!detail||!TRAIN[idx])return;
  const m=D.snapshot().M,cur=currentStageIndex(m),stage=TRAIN[idx],done=completed(m,stage),st=stageStatus(idx);
  if(idx<cur){
    setDetail(detail,`<div class="node-kicker">${stage.name} · ${done}/${stage.nodes.length}</div><div class="node-effect">이미 개방한 경지입니다.</div><div class="node-expect">이 층의 수련 노드를 눌러 완료한 수련과 효과를 확인할 수 있습니다.</div>`);
    return;
  }
  if(idx===cur){
    setDetail(detail,`<div class="node-kicker">${stage.name} · ${done}/${stage.nodes.length}</div><div class="node-effect">현재 경지입니다. 주변 수련 노드를 선택해 도맥을 완성하세요.</div><div class="node-expect">다음 경지 돌파는 위쪽의 다음 경지 노드를 직접 눌러 진행합니다.</div>`);
    return;
  }
  const price=st.price||breakthroughCost(idx);
  const next=idx===cur+1;
  setDetail(detail,`<div class="node-kicker">${stage.name} · ${done}/${stage.nodes.length}</div><div class="node-effect">${next?`${stage.name}을 개방하고 새로운 수련 가지를 연다.`:'아직 도달할 수 없는 경지입니다.'}</div><div class="node-expect">${st.text}</div><div class="cost-row">${next?costHtml(price):'<span class="cost-chip free">선행 경지 필요</span>'}</div>`);
  const b=document.createElement('button');
  b.className=`detail-action ${st.can?'ready':''}`;
  b.disabled=!st.can;
  b.textContent=next?`${stage.name} 개방`:'조건 미충족';
  b.onclick=e=>{e.stopPropagation();P.breakthroughStage(idx)};
  detail.insertBefore(b,detail.querySelector('.v17close'));
}
function bindStageNodes(){
  const v=$('#ascViewport');
  if(!v||v.dataset.v21stage)return;
  v.dataset.v21stage='1';
  v.addEventListener('click',e=>{
    const node=e.target.closest('.asc-stage[data-node-id^="stage-"]');
    if(!node)return;
    const idx=Number(node.dataset.nodeId.slice(6));
    if(!Number.isInteger(idx))return;
    requestAnimationFrame(()=>rewriteStageDetail(idx));
  },true);
}

function activateJournal(){
  const tab=$('.v19-ach-tab'),panel=$('#v19JournalPanel');
  if(!tab||!panel)return;
  document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));
  tab.classList.add('active');
  panel.classList.add('active');
  D.setMenuOpen?.(true);
}
function journalIsActive(){return !!$('.v19-ach-tab.active')||!!$('#v19JournalPanel.active')}
function preserveJournalTab(){
  if(D.replaceState.dataset?.v21)return;
  const raw=D.replaceState.bind(D);
  const wrapped=value=>{
    const keep=journalIsActive();
    raw(value);
    if(keep){
      activateJournal();
      requestAnimationFrame(()=>{activateJournal();requestAnimationFrame(activateJournal)});
    }
  };
  wrapped.dataset={v21:'1'};
  D.replaceState=wrapped;
}

function boot(){
  preserveJournalTab();
  bindStageNodes();
}
boot();
})();

//# sourceURL=systems21_runtime_v11_45.js
