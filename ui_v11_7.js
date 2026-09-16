(()=>{
'use strict';

const debug=window.__xianxiaDebug;
const P=window.__xianxiaProgression;
if(!debug||!P)return;
P.version='11.7';

const $=s=>document.querySelector(s);
const constants=debug.constants;
const notice=$('#notice');

function addStyle(){
  if($('#v117style'))return;
  const s=document.createElement('style');
  s.id='v117style';
  s.textContent=`
  .tree-icon-legend{display:flex;gap:5px;flex-wrap:wrap;margin:5px 0 8px;color:#839691;font-size:8px}
  .tree-icon-legend span{display:inline-flex;align-items:center;gap:3px;padding:3px 5px;border:1px solid #2c4145;border-radius:999px;background:#0b171b}
  .tree-icon-legend i{font:700 12px serif;color:#d9e6e2;font-style:normal}

  .stagepath-node.icon-node{min-width:62px!important;max-width:62px!important;width:62px;height:62px;min-height:62px!important;padding:0!important;border-radius:0!important;clip-path:polygon(28% 0,72% 0,100% 28%,100% 72%,72% 100%,28% 100%,0 72%,0 28%);display:grid;place-items:center;overflow:visible}
  .stagepath-node.icon-node .tree-glyph{font:800 25px serif;line-height:1;position:relative;z-index:1}
  .stagepath-node.icon-node .tree-state{position:absolute;right:3px;bottom:2px;min-width:15px;height:15px;padding:0 3px;border-radius:999px;background:#071014dd;border:1px solid #51636a;display:grid;place-items:center;font-size:8px;line-height:1;color:#c4d0cd;z-index:2}
  .stagepath-node.icon-node.kind-atk{border-color:#a98361}.stagepath-node.icon-node.kind-atk .tree-glyph{color:#f0c999}
  .stagepath-node.icon-node.kind-body{border-color:#8b6464}.stagepath-node.icon-node.kind-body .tree-glyph{color:#e9aaa4}
  .stagepath-node.icon-node.kind-move{border-color:#5f8b78}.stagepath-node.icon-node.kind-move .tree-glyph{color:#9bdac0}
  .stagepath-node.icon-node.kind-sense{border-color:#667c9c}.stagepath-node.icon-node.kind-sense .tree-glyph{color:#aac8ee}
  .stagepath-node.icon-node.kind-skill{border-color:#7c6b9e}.stagepath-node.icon-node.kind-skill .tree-glyph{color:#c7b9ef}
  .stagepath-node.icon-node.ready{box-shadow:0 0 18px #dfc77f55}.stagepath-node.icon-node.done{box-shadow:0 0 16px #d7b95a3f}

  #realmProgWorld .prog-node.icon-node{min-width:58px!important;max-width:58px!important;width:58px;height:58px;min-height:58px!important;padding:0!important;border-radius:0!important;clip-path:polygon(28% 0,72% 0,100% 28%,100% 72%,72% 100%,28% 100%,0 72%,0 28%);display:grid;place-items:center}
  #realmProgWorld .prog-node.icon-node .tree-glyph{font:800 22px serif;line-height:1}
  #realmProgWorld .prog-node.icon-node .tree-state{position:absolute;right:2px;bottom:2px;min-width:18px;height:14px;padding:0 3px;border-radius:999px;background:#071014dd;border:1px solid #51636a;display:grid;place-items:center;font-size:7px;color:#c4d0cd}
  #realmProgWorld .prog-node.icon-node.unlock{border-color:#aa8f4a;background:#332c1b;color:#ead797}

  details.dev .dev-milestones{margin-top:10px;padding:8px;border:1px solid #35464a;border-radius:9px;background:#0d171b}
  details.dev .dev-milestones b{display:block;margin-bottom:4px;color:#b7c8c4;font-size:10px}
  details.dev .dev-milestones p{margin:0 0 7px;color:#718683;font-size:8px;line-height:1.4}
  .dev-milestone-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}
  details.dev .dev-milestone-grid button{margin:0;min-height:34px;padding:5px 3px;border:1px solid #4d5c60;border-radius:7px;background:#17252a;color:#c8d5d2;font-size:9px}
  details.dev .dev-milestone-grid button:active{background:#294138}
  @media(max-width:560px){.stagepath-node.icon-node{width:58px;height:58px;min-width:58px!important;max-width:58px!important;min-height:58px!important}.stagepath-node.icon-node .tree-glyph{font-size:23px}}
  `;
  document.head.appendChild(s);
}

const glyphKind=glyph=>({
  '劍':'atk','刃':'skill','風':'skill','法':'skill','雷':'skill','陣':'skill',
  '體':'body','步':'move','識':'sense','獸':'skill','緣':'skill','脈':'sense','門':'skill'
}[glyph]||'skill');

function iconifyButton(button,{realm=false}={}){
  if(!button||button.classList.contains('icon-node'))return;
  if(button.classList.contains('stage')||button.classList.contains('area-root'))return;
  const b=button.querySelector('b');
  if(!b)return;
  const full=b.textContent.trim();
  const glyph=(full.match(/^\S+/)||['•'])[0];
  const small=button.querySelector('small')?.textContent.trim()||'';
  const state=button.classList.contains('done')||button.classList.contains('complete')?'✓':
    button.classList.contains('ready')||button.classList.contains('available')?'＋':
    realm&&/^\d+\/5$/.test(small)?small:'·';
  button.dataset.fullLabel=full;
  button.title=[full,small].filter(Boolean).join(' · ');
  button.setAttribute('aria-label',button.title);
  button.classList.add('icon-node',`kind-${glyphKind(glyph)}`);
  button.innerHTML=`<span class="tree-glyph">${glyph}</span><span class="tree-state">${state}</span>`;
}

function iconifyTrees(){
  document.querySelectorAll('#stagePathWorld .stagepath-node').forEach(button=>iconifyButton(button));
  document.querySelectorAll('#realmProgWorld .prog-node').forEach(button=>iconifyButton(button,{realm:true}));
}

function addLegends(){
  const stage=$('.stagepath-section');
  if(stage&&!stage.querySelector('.tree-icon-legend')){
    const legend=document.createElement('div');
    legend.className='tree-icon-legend';
    legend.innerHTML='<span><i>劍</i>공격</span><span><i>體</i>육신</span><span><i>步</i>이동</span><span><i>識</i>감응</span><span><i>法</i>법술</span>';
    const view=stage.querySelector('.stagepath-viewport');
    stage.insertBefore(legend,view);
  }
  const realm=$('[data-panel="tree"] .prog-section');
  if(realm&&!realm.querySelector('.tree-icon-legend')){
    const legend=document.createElement('div');
    legend.className='tree-icon-legend';
    legend.innerHTML='<span><i>獸</i>요수</span><span><i>緣</i>산수·기연</span><span><i>脈</i>영맥</span><span><i>雷</i>천뢰</span><span><i>門</i>비경 관문</span>';
    const view=realm.querySelector('#realmProgViewport');
    realm.insertBefore(legend,view);
  }
}

function applyNodeEffect(M,node){
  if(node.effect?.cult)for(const [key,value] of Object.entries(node.effect.cult))M.cult[key]=(Number(M.cult[key])||0)+value;
  if(node.effect?.unlock){M.skills[node.effect.unlock]||={u:0,pow:0,range:0,cycle:0};M.skills[node.effect.unlock].u=1}
  if(node.effect?.skill){
    const e=node.effect.skill;
    M.skills[e.id]||={u:0,pow:0,range:0,cycle:0};
    M.skills[e.id].u=1;
    M.skills[e.id][e.key]=Math.min(5,(Number(M.skills[e.id][e.key])||0)+e.amount);
  }
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
  const old=debug.snapshot().M;
  const M=JSON.parse(JSON.stringify(old));
  M.realm={...preset.realm};
  M.cult={atk:1,mov:1,sen:1,hp:1};
  M.skills=Object.fromEntries(constants.SKILLS.map(skill=>[skill.id,{u:0,pow:0,range:0,cycle:0}]));
  M.trainingNodes={};
  const path=P.trainingPath||[];
  for(let i=0;i<=preset.stageIndex&&i<path.length;i++){
    for(const node of path[i].nodes){applyNodeEffect(M,node);M.trainingNodes[node.id]=1}
  }
  M.unlocked={qingyun:1};
  for(const id of preset.unlocked)M.unlocked[id]=1;
  M.area=preset.area;
  M.stone=preset.stone;
  M.herb=preset.herbs[0];M.herb2=preset.herbs[1];M.herb3=preset.herbs[2];
  M.events={...(M.events||{}),foundationInsight:preset.insight?1:0};
  M.zones=M.zones||{};
  for(const area of constants.AREAS){
    const prev=M.zones[area.id]||{};
    M.zones[area.id]={...prev,tree:{}};
  }
  for(const [area,tree] of Object.entries(preset.trees||{}))M.zones[area].tree={...tree};
  M.settings={...(M.settings||{}),tab:'train'};
  return M;
}

function jumpMilestone(id){
  const preset=PRESETS[id];if(!preset)return;
  if(debug.snapshot().phase==='run'){notice.textContent='원정을 마친 뒤 개발자 진행 점프를 사용하십시오.';return}
  const M=milestoneState(preset);
  debug.replaceState(M);
  notice.textContent=`DEV · ${preset.label} 테스트 상태로 이동 — 해당 시점의 수련·법술·비경·인연 및 테스트 자원 적용`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    P.renderStageTraining?.();P.render?.();P.focusStageTraining?.();iconifyTrees();
  }));
}

function addDevTools(){
  const details=$('details.dev');if(!details||details.querySelector('.dev-milestones'))return;
  const wrap=document.createElement('div');wrap.className='dev-milestones';
  wrap.innerHTML='<b>진행도 마일스톤 강제 이동</b><p>해당 시점까지의 수련/법술을 완료하고, 접근 가능한 비경과 인연 선행조건을 맞춘 테스트 상태를 만듭니다.</p><div class="dev-milestone-grid"></div>';
  const grid=wrap.querySelector('.dev-milestone-grid');
  for(const [id,preset] of Object.entries(PRESETS)){
    const button=document.createElement('button');button.type='button';button.textContent=preset.label;button.onclick=()=>jumpMilestone(id);grid.appendChild(button);
  }
  details.appendChild(wrap);
}

addStyle();
addLegends();
addDevTools();
iconifyTrees();

const bodyObserver=new MutationObserver(()=>requestAnimationFrame(()=>{addLegends();addDevTools();iconifyTrees()}));
bodyObserver.observe(document.body,{childList:true,subtree:true});

P.jumpMilestone=jumpMilestone;
P.milestones=PRESETS;
P.iconifyTrees=iconifyTrees;
})();