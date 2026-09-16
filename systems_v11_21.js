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
function needCount(i){return Math.min(4,2+Math.floor(i/3))}
function breakthroughCost(i){
  if(i===0)return{s:0,h:8,hg:0};
  if(i===9)return{s:4800,h:75,hg:2,major:true};
  return{s:Math.ceil(120*1.62**(i-1)),h:Math.ceil(16*1.27**(i-1)),hg:Math.min(2,Math.floor((i-1)/3))};
}
function stageStatus(i){
  const sh=D.snapshot(),m=sh.M,cur=currentStageIndex(m),target=TRAIN[i];
  if(!target)return{can:false,text:'경지 정보 없음'};
  if(i<=cur)return{can:false,reached:true,text:i===cur?'현재 경지':'이미 개방한 경지'};
  if(i!==cur+1)return{can:false,text:'바로 아래 경지를 먼저 개방해야 합니다.',price:breakthroughCost(i)};
  const price=breakthroughCost(i);
  if(sh.phase==='run')return{can:false,text:'원정 중에는 돌파할 수 없습니다.',price};
  if(i>0){
    const prev=TRAIN[i-1],done=completed(m,prev),need=needCount(i-1);
    if(done<need)return{can:false,text:`${prev.name} 수련 ${done}/${prev.nodes.length} · 최소 ${need}개 필요`,price};
  }
  if(price.major&&!m.events?.foundationInsight)return{can:false,text:'축기의 실마리가 필요합니다.',price};
  if((+m.stone||0)<price.s||(+m[HKEY(price.hg)]||0)<price.h)return{can:false,text:'돌파 재료가 부족합니다.',price};
  return{can:true,text:'개방 가능',price};
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
  });
}

function activateJournal(){
  const tab=$('.v19-ach-tab'),panel=$('#v19JournalPanel');
  if(!tab||!panel)return;
  document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));
  tab.classList.add('active');
  panel.classList.add('active');
  $('.controls')?.classList.add('open');
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
