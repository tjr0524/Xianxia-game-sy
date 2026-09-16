(()=>{
'use strict';

const debug=window.__xianxiaDebug;
const P=window.__xianxiaProgression;
if(!debug||!P)return;
P.version='11.9';

const $=s=>document.querySelector(s);
const HN=['하급','중급','상급'];
const notice=$('#notice');
const C=debug.constants;
let stageObserver=null,realmObserver=null,queued=false;

function css(){
  if($('#v119style'))return;
  const s=document.createElement('style');
  s.id='v119style';
  s.textContent=`
  .v119-hidden{display:none!important}
  .tree-icon-legend{display:flex;gap:5px;flex-wrap:wrap;margin:5px 0 8px;color:#839691;font-size:8px}
  .tree-icon-legend span{display:inline-flex;align-items:center;gap:3px;padding:3px 5px;border:1px solid #2c4145;border-radius:999px;background:#0b171b}
  .tree-icon-legend i{font:700 12px serif;color:#d9e6e2;font-style:normal}
  .stagepath-node.icon-node{min-width:60px!important;max-width:60px!important;width:60px;height:60px;min-height:60px!important;padding:0!important;border-radius:0!important;clip-path:polygon(28% 0,72% 0,100% 28%,100% 72%,72% 100%,28% 100%,0 72%,0 28%);display:grid;place-items:center}
  .stagepath-node.icon-node .tree-glyph{font:800 24px serif;line-height:1}
  .stagepath-node.icon-node .tree-state{position:absolute;right:2px;bottom:2px;min-width:16px;height:15px;padding:0 3px;border-radius:999px;background:#071014dd;border:1px solid #51636a;display:grid;place-items:center;font-size:8px;color:#c4d0cd}
  .stagepath-node.kind-atk{border-color:#a98361}.stagepath-node.kind-atk .tree-glyph{color:#f0c999}
  .stagepath-node.kind-body{border-color:#8b6464}.stagepath-node.kind-body .tree-glyph{color:#e9aaa4}
  .stagepath-node.kind-move{border-color:#5f8b78}.stagepath-node.kind-move .tree-glyph{color:#9bdac0}
  .stagepath-node.kind-sense{border-color:#667c9c}.stagepath-node.kind-sense .tree-glyph{color:#aac8ee}
  .stagepath-node.kind-skill{border-color:#7c6b9e}.stagepath-node.kind-skill .tree-glyph{color:#c7b9ef}
  .stagepath-node.stage.break-ready{border-color:#d3b35d!important;color:#ffe8a1!important;box-shadow:0 0 20px #d7b95a55!important;opacity:1!important;filter:none!important}
  .stagepath-node.stage.break-next{border-color:#7f7651;opacity:.82;filter:none}
  #realmProgWorld .prog-node.icon-node{min-width:58px!important;max-width:58px!important;width:58px;height:58px;min-height:58px!important;padding:0!important;border-radius:0!important;clip-path:polygon(28% 0,72% 0,100% 28%,100% 72%,72% 100%,28% 100%,0 72%,0 28%);display:grid;place-items:center}
  #realmProgWorld .prog-node.icon-node .tree-glyph{font:800 22px serif;line-height:1}
  #realmProgWorld .prog-node.icon-node .tree-state{position:absolute;right:2px;bottom:2px;min-width:18px;height:14px;padding:0 3px;border-radius:999px;background:#071014dd;border:1px solid #51636a;display:grid;place-items:center;font-size:7px;color:#c4d0cd}
  details.dev .dev-milestones{margin-top:10px;padding:8px;border:1px solid #35464a;border-radius:9px;background:#0d171b}
  details.dev .dev-milestones b{display:block;margin-bottom:4px;color:#b7c8c4;font-size:10px}
  details.dev .dev-milestones p{margin:0 0 7px;color:#718683;font-size:8px;line-height:1.4}
  .dev-milestone-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}
  details.dev .dev-milestone-grid button{margin:0;min-height:34px;padding:5px 3px;border:1px solid #4d5c60;border-radius:7px;background:#17252a;color:#c8d5d2;font-size:9px}
  `;
  document.head.appendChild(s);
}

function hideLegacyTraining(){
  $('#breakthrough')?.closest('.section')?.classList.add('v119-hidden');
  $('#atk')?.closest('.section')?.classList.add('v119-hidden');
}

const glyphKind=g=>({'劍':'atk','體':'body','步':'move','識':'sense','刃':'skill','風':'skill','法':'skill','雷':'skill','陣':'skill','獸':'skill','緣':'skill','脈':'sense','門':'skill'}[g]||'skill');
function iconifyButton(button,{realm=false}={}){
  if(!button||button.classList.contains('icon-node')||button.classList.contains('stage')||button.classList.contains('area-root'))return;
  const b=button.querySelector('b');if(!b)return;
  const full=b.textContent.trim(),glyph=(full.match(/^\S+/)||['•'])[0],small=button.querySelector('small')?.textContent.trim()||'';
  const state=button.classList.contains('done')||button.classList.contains('complete')?'✓':button.classList.contains('ready')||button.classList.contains('available')?'＋':realm&&/^\d+\/5$/.test(small)?small:'·';
  button.title=[full,small].filter(Boolean).join(' · ');button.setAttribute('aria-label',button.title);
  button.classList.add('icon-node',`kind-${glyphKind(glyph)}`);
  button.innerHTML=`<span class="tree-glyph">${glyph}</span><span class="tree-state">${state}</span>`;
}
function iconifyTrees(){
  document.querySelectorAll('#stagePathWorld .stagepath-node').forEach(b=>iconifyButton(b));
  document.querySelectorAll('#realmProgWorld .prog-node').forEach(b=>iconifyButton(b,{realm:true}));
}
function legends(){
  const stage=$('.stagepath-section');
  if(stage&&!stage.querySelector('.tree-icon-legend')){const e=document.createElement('div');e.className='tree-icon-legend';e.innerHTML='<span><i>劍</i>공격</span><span><i>體</i>육신</span><span><i>步</i>이동</span><span><i>識</i>감응</span><span><i>法</i>법술</span>';stage.insertBefore(e,stage.querySelector('.stagepath-viewport'))}
  const realm=$('[data-panel="tree"] .prog-section');
  if(realm&&!realm.querySelector('.tree-icon-legend')){const e=document.createElement('div');e.className='tree-icon-legend';e.innerHTML='<span><i>獸</i>요수</span><span><i>緣</i>산수·기연</span><span><i>脈</i>영맥</span><span><i>雷</i>천뢰</span><span><i>門</i>비경 관문</span>';realm.insertBefore(e,realm.querySelector('#realmProgViewport'))}
}

function path(){return P.trainingPath||[]}
function snapshot(){return debug.snapshot()}
function reached(M,req){return M.realm?.major>=0&&(M.realm.major>req.major||(M.realm.major===req.major&&M.realm.stage>=req.stage))}
function currentIndex(M){let idx=-1;for(let i=0;i<path().length;i++)if(reached(M,path()[i].req))idx=i;return idx}
function completed(M,stage){return stage?.nodes?.filter(n=>M.trainingNodes?.[n.id]).length||0}
function herbKey(g){return g===0?'herb':g===1?'herb2':'herb3'}
function breakthroughCost(targetIdx){
  if(targetIdx===0)return{s:0,h:8,hg:0,label:'수선 입문'};
  if(targetIdx===9)return{s:4800,h:75,hg:2,label:'축기 돌파',major:true};
  const currentStage=targetIdx;
  return{s:Math.ceil(120*1.62**(currentStage-1)),h:Math.ceil(16*1.27**(currentStage-1)),hg:Math.min(2,Math.floor((currentStage-1)/3)),label:`연기 ${targetIdx+1}층 돌파`};
}
function stageStatus(targetIdx){
  const shot=snapshot(),M=shot.M,p=path(),cur=currentIndex(M),target=p[targetIdx];
  if(!target)return{can:false,text:'경지 정보 없음'};
  if(targetIdx<=cur)return{can:false,reached:true,text:targetIdx===cur?'현재 경지':'도달 완료'};
  if(targetIdx!==cur+1)return{can:false,text:'이전 경지 돌파 필요'};
  if(shot.phase==='run')return{can:false,text:'원정 중에는 돌파할 수 없음'};
  const price=breakthroughCost(targetIdx);
  if(targetIdx>0){const done=completed(M,p[targetIdx-1]);if(done<2)return{can:false,text:`${p[targetIdx-1].name} 수련 2/4 필요`,price,done}}
  if(price.major&&!M.events?.foundationInsight)return{can:false,text:'축기의 실마리 필요',price};
  if((Number(M.stone)||0)<price.s||(Number(M[herbKey(price.hg)])||0)<price.h)return{can:false,text:'돌파 재료 부족',price};
  return{can:true,text:'돌파 가능',price};
}
function priceText(p){return [p.s?`영석 ${p.s}`:'',p.h?`${HN[p.hg]} 영초 ${p.h}`:''].filter(Boolean).join(' · ')}
function doBreakthrough(targetIdx){
  const p=path(),target=p[targetIdx],status=stageStatus(targetIdx);if(!target||!status.can){if(notice)notice.textContent=status.text;return}
  const M=snapshot().M,price=status.price;
  M.stone-=price.s;if(price.h)M[herbKey(price.hg)]-=price.h;
  M.realm={...target.req};
  debug.replaceState(M);
  if(notice)notice.textContent=`${target.name} 도달 — 새 수련 노드가 열렸습니다.`;
  requestAnimationFrame(()=>{P.renderStageTraining?.();enhanceStageNodes();P.focusStageTraining?.()});
}
function stageName(button){const t=button.querySelector('b')?.textContent||'';return t.replace(/^境\s*/,'').trim()}
function stageIndexFromButton(button){const name=stageName(button);return path().findIndex(s=>s.name===name)}
function stageDetail(targetIdx){
  const box=$('#stagePathDetail'),p=path(),st=p[targetIdx];if(!box||!st)return;
  const M=snapshot().M,status=stageStatus(targetIdx),count=completed(M,st),cur=currentIndex(M);
  if(targetIdx<=cur){
    box.innerHTML=`<div class="stagepath-detail-head"><b>${st.name}</b><span>${targetIdx===cur?'현재 경지':'도달 완료'} · ${count}/4</span></div><p>이 경지에서 네 개의 독립 수련을 선택할 수 있습니다. 다음 경지 돌파에는 이 경지 수련 2개 이상이 필요합니다.</p>`;
    return;
  }
  const price=status.price||breakthroughCost(targetIdx);
  box.innerHTML=`<div class="stagepath-detail-head"><b>${st.name}</b><span>경지 노드</span></div><p>${status.text}${targetIdx===9?' · 대경지 돌파는 축기의 실마리가 추가로 필요합니다.':''}</p><div>비용 · ${priceText(price)}</div>`;
  const b=document.createElement('button');b.className=`stagepath-action ${status.can?'ready':''}`;b.disabled=!status.can;b.textContent=status.can?`${st.name} 돌파`:'조건 미충족';b.onclick=()=>doBreakthrough(targetIdx);box.appendChild(b);
}
function enhanceStageNodes(){
  const M=snapshot().M,cur=currentIndex(M);
  document.querySelectorAll('#stagePathWorld .stagepath-node.stage').forEach(button=>{
    const idx=stageIndexFromButton(button);if(idx<0)return;
    button.classList.remove('break-ready','break-next');
    if(idx===cur+1){const s=stageStatus(idx);button.classList.add(s.can?'break-ready':'break-next')}
  });
  iconifyTrees();legends();hideLegacyTraining();
}
function bindStageClicks(){
  const world=$('#stagePathWorld');if(!world||world.dataset.v119Stage)return;
  world.dataset.v119Stage='1';
  world.addEventListener('click',e=>{const b=e.target.closest('.stagepath-node.stage');if(!b)return;const idx=stageIndexFromButton(b);if(idx>=0)requestAnimationFrame(()=>stageDetail(idx))});
}

function applyNodeEffect(M,node){
  if(node.effect?.cult)for(const [k,v] of Object.entries(node.effect.cult))M.cult[k]=(Number(M.cult[k])||0)+v;
  if(node.effect?.unlock){M.skills[node.effect.unlock]||={u:0,pow:0,range:0,cycle:0};M.skills[node.effect.unlock].u=1}
  if(node.effect?.skill){const e=node.effect.skill;M.skills[e.id]||={u:0,pow:0,range:0,cycle:0};M.skills[e.id].u=1;M.skills[e.id][e.key]=Math.min(5,(Number(M.skills[e.id][e.key])||0)+e.amount)}
}
const PRESETS={
 q1:{label:'연기 1층',stageIndex:0,realm:{major:0,stage:1},area:'qingyun',unlocked:['qingyun'],stone:120,herbs:[35,0,0],trees:{qingyun:{eco1:2}}},
 q3:{label:'연기 3층',stageIndex:2,realm:{major:0,stage:3},area:'blackwind',unlocked:['qingyun','blackwind'],stone:900,herbs:[80,18,0],trees:{qingyun:{eco1:5,eco2:3,eco3:1},blackwind:{eco1:1,fate1:1}}},
 q5:{label:'연기 5층',stageIndex:4,realm:{major:0,stage:5},area:'blackwind',unlocked:['qingyun','blackwind'],stone:3200,herbs:[120,55,12],trees:{qingyun:{eco1:5,eco2:5,eco3:2},blackwind:{eco1:3,eco2:2,fate1:3,fate2:1}}},
 q7:{label:'연기 7층',stageIndex:6,realm:{major:0,stage:7},area:'blood',unlocked:['qingyun','blackwind','blood'],stone:10500,herbs:[160,100,55],trees:{qingyun:{eco1:5,eco2:5,eco3:5},blackwind:{eco1:5,eco2:3,eco3:2,fate1:5,fate2:3,fate3:2},blood:{eco1:2,fate1:2,res1:2}}},
 q9:{label:'연기 9층',stageIndex:8,realm:{major:0,stage:9},area:'blood',unlocked:['qingyun','blackwind','blood'],stone:30000,herbs:[220,170,130],insight:1,trees:{qingyun:{eco1:5,eco2:5,eco3:5},blackwind:{eco1:5,eco2:5,eco3:5,fate1:5,fate2:5,fate3:4},blood:{eco1:5,eco2:3,eco3:2,fate1:4,fate2:3,fate3:2,res1:4,res2:3,res3:2}}},
 f1:{label:'축기 1층',stageIndex:9,realm:{major:1,stage:1},area:'thunder',unlocked:['qingyun','blackwind','blood','thunder'],stone:65000,herbs:[300,250,220],insight:1,trees:{qingyun:{eco1:5,eco2:5,eco3:5},blackwind:{eco1:5,eco2:5,eco3:5,fate1:5,fate2:5,fate3:5},blood:{eco1:5,eco2:5,eco3:4,fate1:5,fate2:5,fate3:4,res1:5,res2:3,res3:3},thunder:{eco1:2,fate1:2,res1:2,storm1:2}}}
};
function milestoneState(preset){
  const M=JSON.parse(JSON.stringify(snapshot().M));M.realm={...preset.realm};M.cult={atk:1,mov:1,sen:1,hp:1};M.skills=Object.fromEntries(C.SKILLS.map(s=>[s.id,{u:0,pow:0,range:0,cycle:0}]));M.trainingNodes={};
  const p=path();for(let i=0;i<=preset.stageIndex&&i<p.length;i++)for(const n of p[i].nodes){applyNodeEffect(M,n);M.trainingNodes[n.id]=1}
  M.unlocked={qingyun:1};for(const id of preset.unlocked)M.unlocked[id]=1;M.area=preset.area;M.stone=preset.stone;[M.herb,M.herb2,M.herb3]=preset.herbs;M.events={...(M.events||{}),foundationInsight:preset.insight?1:0};M.zones=M.zones||{};
  for(const area of C.AREAS){const prev=M.zones[area.id]||{};M.zones[area.id]={...prev,tree:{}}}for(const [area,tree] of Object.entries(preset.trees||{}))M.zones[area].tree={...tree};M.settings={...(M.settings||{}),tab:'train'};return M;
}
function jumpMilestone(id){const preset=PRESETS[id];if(!preset)return;if(snapshot().phase==='run'){notice.textContent='원정을 마친 뒤 사용하십시오.';return}debug.replaceState(milestoneState(preset));notice.textContent=`DEV · ${preset.label} 테스트 상태 적용`;requestAnimationFrame(()=>{P.renderStageTraining?.();enhanceStageNodes();P.focusStageTraining?.()})}
function devTools(){
  const d=$('details.dev');if(!d||d.querySelector('.dev-milestones'))return;const w=document.createElement('div');w.className='dev-milestones';w.innerHTML='<b>진행도 마일스톤 강제 이동</b><p>해당 시점까지의 수련·법술·비경·인연과 테스트 자원을 맞춥니다.</p><div class="dev-milestone-grid"></div>';const g=w.querySelector('.dev-milestone-grid');
  for(const [id,p] of Object.entries(PRESETS)){const b=document.createElement('button');b.type='button';b.textContent=p.label;b.onclick=()=>jumpMilestone(id);g.appendChild(b)}d.appendChild(w);
}

function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhanceStageNodes();devTools()})}
function localObservers(){
  const sw=$('#stagePathWorld');if(sw&&!stageObserver){stageObserver=new MutationObserver(schedule);stageObserver.observe(sw,{childList:true})}
  const rw=$('#realmProgWorld');if(rw&&!realmObserver){realmObserver=new MutationObserver(()=>requestAnimationFrame(iconifyTrees));realmObserver.observe(rw,{childList:true})}
}
function boot(){
  css();hideLegacyTraining();devTools();legends();bindStageClicks();localObservers();enhanceStageNodes();
  if(!P.trainingPath?.length||!$('#stagePathWorld'))setTimeout(boot,60);
}
boot();
P.jumpMilestone=jumpMilestone;P.milestones=PRESETS;P.iconifyTrees=iconifyTrees;P.enhanceStageNodes=enhanceStageNodes;P.breakthroughStage=doBreakthrough;
})();