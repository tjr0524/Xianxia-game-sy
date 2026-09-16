(()=>{
'use strict';
const debug=window.__xianxiaDebug;
const P=window.__xianxiaProgression;
if(!debug||!P)return;
const $=s=>document.querySelector(s);
const HN=['하급','중급','상급'];
const notice=$('#notice');
let boundWorld=null;

function path(){return P.trainingPath||[]}
function snap(){return debug.snapshot()}
function reached(M,req){return M.realm?.major>=0&&(M.realm.major>req.major||(M.realm.major===req.major&&M.realm.stage>=req.stage))}
function currentIndex(M){let idx=-1;for(let i=0;i<path().length;i++)if(reached(M,path()[i].req))idx=i;return idx}
function doneCount(M,stage){return stage?.nodes?.filter(n=>M.trainingNodes?.[n.id]).length||0}
function herbKey(g){return g===0?'herb':g===1?'herb2':'herb3'}
function cost(targetIdx){
 if(targetIdx===0)return{s:0,h:8,hg:0,label:'수선 입문'};
 if(targetIdx===9)return{s:4800,h:75,hg:2,label:'축기 돌파',major:true};
 return{s:Math.ceil(120*1.62**(targetIdx-1)),h:Math.ceil(16*1.27**(targetIdx-1)),hg:Math.min(2,Math.floor((targetIdx-1)/3)),label:`연기 ${targetIdx+1}층 돌파`};
}
function costText(c){return[c.s?`영석 ${c.s}`:'',c.h?`${HN[c.hg]} 영초 ${c.h}`:''].filter(Boolean).join(' · ')}
function status(targetIdx){
 const shot=snap(),M=shot.M,p=path(),cur=currentIndex(M),target=p[targetIdx];
 if(!target)return{can:false,text:'경지 정보 없음'};
 if(targetIdx<=cur)return{can:false,reached:true,text:targetIdx===cur?'현재 경지':'도달 완료'};
 if(targetIdx!==cur+1)return{can:false,text:'이전 경지 돌파 필요'};
 const price=cost(targetIdx);
 if(shot.phase==='run')return{can:false,text:'원정 중에는 돌파할 수 없음',price};
 if(targetIdx>0){const d=doneCount(M,p[targetIdx-1]);if(d<2)return{can:false,text:`${p[targetIdx-1].name} 수련 ${d}/4 · 2개 이상 필요`,price}}
 if(price.major&&!M.events?.foundationInsight)return{can:false,text:'축기의 실마리 필요',price};
 if((Number(M.stone)||0)<price.s||(Number(M[herbKey(price.hg)])||0)<price.h)return{can:false,text:'돌파 재료 부족',price};
 return{can:true,text:'돌파 가능',price};
}
function breakTo(targetIdx){
 const st=path()[targetIdx],s=status(targetIdx);if(!st||!s.can){if(notice)notice.textContent=s.text;return}
 const M=snap().M,c=s.price;M.stone-=c.s;if(c.h)M[herbKey(c.hg)]-=c.h;M.realm={...st.req};debug.replaceState(M);
 if(notice)notice.textContent=`${st.name} 도달 — 새 수련 노드가 열렸습니다.`;
 requestAnimationFrame(()=>{P.renderStageTraining?.();P.focusStageTraining?.()});
}
function stageIndex(button){
 const text=(button.querySelector('b')?.textContent||button.textContent||'').replace(/^境\s*/,'').trim();
 return path().findIndex(s=>text.includes(s.name));
}
function addStyles(){
 if($('#v1110style'))return;const s=document.createElement('style');s.id='v1110style';s.textContent=`
 .stage-hub-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:5px;margin-top:8px}
 .stage-hub-grid button{min-height:35px;margin:0;padding:5px;border:1px solid #43585c;border-radius:7px;background:#142328;text-align:left;font-size:9px}
 .stage-hub-grid button strong{display:block;font-size:10px}.stage-hub-grid button span{display:block;margin-top:2px;color:#81938f;font-size:8px}
 .stage-hub-grid button.ready{border-color:#b79b4d;background:#3a311d;color:#f7e4aa}.stage-hub-grid button.done{border-color:#568875;background:#19372f;color:#c7eadf}
 .stage-next-action{width:100%;min-height:38px;margin-top:7px;border:1px solid #596e62;border-radius:8px;background:#1e3831;font-size:10px;font-weight:750}
 .stage-next-action.ready{border-color:#b79b4d;background:#4a3e20;color:#fff0bc}
 `;document.head.appendChild(s)
}
function renderHub(idx){
 const box=$('#stagePathDetail'),p=path(),st=p[idx];if(!box||!st)return;
 const shot=snap(),M=shot.M,cur=currentIndex(M),count=doneCount(M,st);
 if(idx>cur){
   const s=status(idx),c=s.price||cost(idx);
   box.innerHTML=`<div class="stagepath-detail-head"><b>${st.name}</b><span>경지 노드</span></div><p>${s.text}</p><div>비용 · ${costText(c)}</div>`;
   const b=document.createElement('button');b.className=`stage-next-action ${s.can?'ready':''}`;b.disabled=!s.can;b.textContent=s.can?(idx===0?'수선 입문':`${st.name} 돌파`):'조건 미충족';b.onclick=()=>breakTo(idx);box.appendChild(b);return;
 }
 box.innerHTML=`<div class="stagepath-detail-head"><b>${st.name}</b><span>${idx===cur?'현재 경지':'도달 완료'} · ${count}/4</span></div><p>${idx===cur?'아래 네 수련 중 원하는 것을 선택할 수 있습니다. 다음 경지에는 이 경지 수련 2개 이상이 필요합니다.':'이미 지나온 경지입니다. 남은 수련은 언제든 보충할 수 있습니다.'}</p>`;
 const grid=document.createElement('div');grid.className='stage-hub-grid';
 for(const n of st.nodes){
   const done=!!M.trainingNodes?.[n.id];
   const button=document.createElement('button');button.type='button';button.className=done?'done':'';
   button.innerHTML=`<strong>${n.glyph||'•'} ${n.name}</strong><span>${done?'✓ 수련 완료':'눌러서 상세/수련'}</span>`;
   button.onclick=()=>{
     const nodeButton=[...document.querySelectorAll('#stagePathWorld .stagepath-node')].find(x=>(x.title||x.textContent||'').includes(n.name));
     if(nodeButton)nodeButton.click();else P.buyStageTraining?.(n.id);
   };
   grid.appendChild(button);
 }
 box.appendChild(grid);
 if(idx===cur&&idx+1<p.length){
   const s=status(idx+1),next=p[idx+1],b=document.createElement('button');b.className=`stage-next-action ${s.can?'ready':''}`;b.disabled=!s.can;
   b.textContent=s.can?`${next.name} 돌파`:`다음 경지 · ${s.text}`;b.onclick=()=>breakTo(idx+1);box.appendChild(b);
 }
}
function bind(){
 addStyles();
 const world=$('#stagePathWorld');
 if(!world){setTimeout(bind,80);return}
 if(boundWorld===world)return;boundWorld=world;
 world.addEventListener('click',e=>{
   const b=e.target.closest('.stagepath-node.stage');if(!b)return;
   const idx=stageIndex(b);if(idx<0)return;
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
   renderHub(idx);
 },true);
}
bind();
P.renderStageHub=renderHub;
})();
