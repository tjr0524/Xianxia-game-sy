(()=>{
'use strict';

const debug=window.__xianxiaDebug;
const P=window.__xianxiaProgression;
if(!debug||!P)return;
P.version='11.6';

const $=s=>document.querySelector(s);
const HN=['하급','중급','상급'];
const notice=$('#notice');
const WORLD_W=1000;
const START_Y=120;
const STEP_Y=165;

const PATH=[
  {id:'q1',name:'연기 1층',req:{major:0,stage:1},nodes:[
    {id:'q1_atk',name:'검결 · 입문',glyph:'劍',desc:'기본 검격의 기반을 다집니다.',cost:{s:20,h:0,hg:0},effect:{cult:{atk:1}}},
    {id:'q1_hp',name:'체수련 · 기혈',glyph:'體',desc:'초기 생존력을 올립니다.',cost:{s:0,h:5,hg:0},effect:{cult:{hp:1}}},
    {id:'q1_sword',name:'어검술 전승',glyph:'法',desc:'어검술을 해금합니다. 이후 모든 해금 법술은 자동 발동합니다.',cost:{s:18,h:2,hg:0},effect:{unlock:'sword'}},
    {id:'q1_sword_pow',name:'어검술 · 위력',glyph:'刃',desc:'어검술 위력 단계를 1 올립니다.',cost:{s:35,h:0,hg:0},prereq:'q1_sword',effect:{skill:{id:'sword',key:'pow',amount:1}}}
  ]},
  {id:'q2',name:'연기 2층',req:{major:0,stage:2},nodes:[
    {id:'q2_mov',name:'경신법 · 유보',glyph:'步',desc:'상위 비경의 이동 페널티를 극복하기 위한 첫 수련입니다.',cost:{s:42,h:0,hg:0},effect:{cult:{mov:1}}},
    {id:'q2_sen',name:'신식 · 감응',glyph:'識',desc:'전리품 감응 범위를 넓힙니다.',cost:{s:0,h:7,hg:0},effect:{cult:{sen:1}}},
    {id:'q2_atk',name:'검결 · 연격',glyph:'劍',desc:'같은 검결 계열이지만 별도의 수련으로 공격력을 다시 올립니다.',cost:{s:55,h:0,hg:0},effect:{cult:{atk:1}}},
    {id:'q2_sword_range',name:'어검술 · 사거리',glyph:'法',desc:'어검술의 유효 범위를 넓힙니다.',cost:{s:68,h:0,hg:0},prereq:'q1_sword',effect:{skill:{id:'sword',key:'range',amount:1}}}
  ]},
  {id:'q3',name:'연기 3층',req:{major:0,stage:3},nodes:[
    {id:'q3_atk',name:'검결 · 파봉',glyph:'劍',desc:'공격력 수련 +1.',cost:{s:88,h:0,hg:0},effect:{cult:{atk:1}}},
    {id:'q3_hp',name:'체수련 · 단련',glyph:'體',desc:'체수련 +1.',cost:{s:0,h:11,hg:0},effect:{cult:{hp:1}}},
    {id:'q3_wave',name:'검풍 전승',glyph:'法',desc:'넓은 범위의 적을 동시에 베는 검풍을 해금합니다.',cost:{s:78,h:5,hg:0},effect:{unlock:'wave'}},
    {id:'q3_wave_pow',name:'검풍 · 위력',glyph:'風',desc:'검풍 위력 단계를 1 올립니다.',cost:{s:105,h:0,hg:0},prereq:'q3_wave',effect:{skill:{id:'wave',key:'pow',amount:1}}}
  ]},
  {id:'q4',name:'연기 4층',req:{major:0,stage:4},nodes:[
    {id:'q4_atk',name:'검결 · 심화',glyph:'劍',desc:'중반 검결 수련. 한 번에 공격력 수련 +2.',cost:{s:190,h:0,hg:0},effect:{cult:{atk:2}}},
    {id:'q4_mov',name:'경신법 · 축지',glyph:'步',desc:'경신법 +1.',cost:{s:145,h:0,hg:0},effect:{cult:{mov:1}}},
    {id:'q4_sen',name:'신식 · 확장',glyph:'識',desc:'중급 영초를 사용해 신식 +1.',cost:{s:0,h:4,hg:1},effect:{cult:{sen:1}}},
    {id:'q4_wave_range',name:'검풍 · 범위',glyph:'風',desc:'검풍의 범위 단계를 1 올립니다.',cost:{s:225,h:2,hg:1},prereq:'q3_wave',effect:{skill:{id:'wave',key:'range',amount:1}}}
  ]},
  {id:'q5',name:'연기 5층',req:{major:0,stage:5},nodes:[
    {id:'q5_atk',name:'검결 · 절맥',glyph:'劍',desc:'검결 수련 +2.',cost:{s:290,h:0,hg:0},effect:{cult:{atk:2}}},
    {id:'q5_hp',name:'체수련 · 철골',glyph:'體',desc:'체수련 +1.',cost:{s:0,h:6,hg:1},effect:{cult:{hp:1}}},
    {id:'q5_chain',name:'연환비검 전승',glyph:'法',desc:'여러 적 사이를 연속으로 도약하는 연환비검을 해금합니다.',cost:{s:190,h:4,hg:1},effect:{unlock:'chain'}},
    {id:'q5_chain_pow',name:'연환비검 · 위력',glyph:'刃',desc:'연환비검 위력 단계를 1 올립니다.',cost:{s:330,h:3,hg:1},prereq:'q5_chain',effect:{skill:{id:'chain',key:'pow',amount:1}}}
  ]},
  {id:'q6',name:'연기 6층',req:{major:0,stage:6},nodes:[
    {id:'q6_mov',name:'경신법 · 유영',glyph:'步',desc:'경신법 +2. 적혈비경의 강한 이동 페널티를 대비합니다.',cost:{s:430,h:0,hg:0},effect:{cult:{mov:2}}},
    {id:'q6_sen',name:'신식 · 투영',glyph:'識',desc:'신식 +2.',cost:{s:0,h:8,hg:1},effect:{cult:{sen:2}}},
    {id:'q6_atk',name:'검결 · 응축',glyph:'劍',desc:'검결 수련 +1.',cost:{s:470,h:0,hg:0},effect:{cult:{atk:1}}},
    {id:'q6_chain_range',name:'연환비검 · 타수',glyph:'刃',desc:'연환비검의 범위·타수 단계를 1 올립니다.',cost:{s:540,h:4,hg:1},prereq:'q5_chain',effect:{skill:{id:'chain',key:'range',amount:1}}}
  ]},
  {id:'q7',name:'연기 7층',req:{major:0,stage:7},nodes:[
    {id:'q7_atk',name:'검결 · 살검',glyph:'劍',desc:'후반 검결 수련 +2.',cost:{s:720,h:0,hg:0},effect:{cult:{atk:2}}},
    {id:'q7_hp',name:'체수련 · 옥골',glyph:'體',desc:'상급 영초를 사용해 체수련 +2.',cost:{s:0,h:5,hg:2},effect:{cult:{hp:2}}},
    {id:'q7_thunder',name:'낙뢰부 전승',glyph:'法',desc:'밀집된 적 무리에 낙뢰를 떨어뜨리는 낙뢰부를 해금합니다.',cost:{s:440,h:5,hg:2},effect:{unlock:'thunder'}},
    {id:'q7_thunder_pow',name:'낙뢰부 · 위력',glyph:'雷',desc:'낙뢰부 위력 단계를 1 올립니다.',cost:{s:820,h:3,hg:2},prereq:'q7_thunder',effect:{skill:{id:'thunder',key:'pow',amount:1}}}
  ]},
  {id:'q8',name:'연기 8층',req:{major:0,stage:8},nodes:[
    {id:'q8_mov',name:'경신법 · 무영',glyph:'步',desc:'경신법 +2.',cost:{s:1000,h:0,hg:0},effect:{cult:{mov:2}}},
    {id:'q8_sen',name:'신식 · 외방',glyph:'識',desc:'신식 +2.',cost:{s:0,h:7,hg:2},effect:{cult:{sen:2}}},
    {id:'q8_atk',name:'검결 · 극의',glyph:'劍',desc:'검결 수련 +2.',cost:{s:1150,h:0,hg:0},effect:{cult:{atk:2}}},
    {id:'q8_thunder_range',name:'낙뢰부 · 폭역',glyph:'雷',desc:'낙뢰부 범위 단계를 1 올립니다.',cost:{s:1250,h:4,hg:2},prereq:'q7_thunder',effect:{skill:{id:'thunder',key:'range',amount:1}}}
  ]},
  {id:'q9',name:'연기 9층',req:{major:0,stage:9},nodes:[
    {id:'q9_atk',name:'검결 · 원만',glyph:'劍',desc:'연기경 검결의 마무리 수련. 공격력 수련 +3.',cost:{s:1650,h:0,hg:0},effect:{cult:{atk:3}}},
    {id:'q9_hp',name:'체수련 · 금강',glyph:'體',desc:'체수련 +2.',cost:{s:0,h:9,hg:2},effect:{cult:{hp:2}}},
    {id:'q9_sword_cycle',name:'어검술 · 순환',glyph:'法',desc:'어검술 순환 단계를 1 올려 쿨타임을 줄입니다.',cost:{s:1800,h:5,hg:2},prereq:'q1_sword',effect:{skill:{id:'sword',key:'cycle',amount:1}}},
    {id:'q9_wave_cycle',name:'검풍 · 순환',glyph:'風',desc:'검풍 순환 단계를 1 올려 쿨타임을 줄입니다.',cost:{s:1950,h:5,hg:2},prereq:'q3_wave',effect:{skill:{id:'wave',key:'cycle',amount:1}}}
  ]},
  {id:'f1',name:'축기 1층',req:{major:1,stage:1},nodes:[
    {id:'f1_array',name:'만검진 전승',glyph:'陣',desc:'넓은 전장을 동시에 휩쓰는 만검진을 해금합니다.',cost:{s:1250,h:10,hg:2},effect:{unlock:'array'}},
    {id:'f1_array_pow',name:'만검진 · 위력',glyph:'陣',desc:'만검진 위력 단계를 1 올립니다.',cost:{s:2350,h:6,hg:2},prereq:'f1_array',effect:{skill:{id:'array',key:'pow',amount:1}}},
    {id:'f1_mov',name:'축기 경신',glyph:'步',desc:'대경지 돌파와 함께 경신법 +3.',cost:{s:2600,h:8,hg:2},effect:{cult:{mov:3}}},
    {id:'f1_hp',name:'축기 육신',glyph:'體',desc:'대경지 돌파와 함께 체수련 +3.',cost:{s:0,h:11,hg:2},effect:{cult:{hp:3}}}
  ]}
];

const ALL_NODES=PATH.flatMap(stage=>stage.nodes.map(n=>({...n,stage})));
const NODE_BY_ID=Object.fromEntries(ALL_NODES.map(n=>[n.id,n]));
const POS_X=[175,335,665,825];
let selected=ALL_NODES[0]?.id||null;
let cam=null;

function snapshot(){return debug.snapshot()}
function state(){return snapshot().M}
function herbKey(g){return g===0?'herb':g===1?'herb2':'herb3'}
function herbHave(M,g){return Number(M[herbKey(g)])||0}
function meets(M,req){return M.realm.major>=0&&(M.realm.major>req.major||(M.realm.major===req.major&&M.realm.stage>=req.stage))}
function bought(M,id){return !!M.trainingNodes?.[id]}
function ensure(M){if(!M.trainingNodes)M.trainingNodes={};return M}
function costText(c){return [c.s?`영석 ${c.s}`:'',c.h?`${HN[c.hg]} 영초 ${c.h}`:''].filter(Boolean).join(' · ')}
function effectText(e){
  const out=[];
  if(e.cult)for(const [k,v] of Object.entries(e.cult))out.push(`${{atk:'검결',mov:'경신법',sen:'신식',hp:'체수련'}[k]} +${v}`);
  if(e.unlock){const sk=debug.constants.SKILLS.find(s=>s.id===e.unlock);out.push(`${sk?.n||e.unlock} 해금`)}
  if(e.skill){const sk=debug.constants.SKILLS.find(s=>s.id===e.skill.id);out.push(`${sk?.n||e.skill.id} ${{pow:'위력',range:'범위·타수',cycle:'순환'}[e.skill.key]} +${e.skill.amount}`)}
  return out.join(' · ');
}
function canBuy(M,node){
  const shot=snapshot();
  if(shot.phase==='run')return [false,'원정 중에는 수련할 수 없습니다.'];
  if(bought(M,node.id))return [false,'이미 수련 완료'];
  if(!meets(M,node.stage.req))return [false,`${node.stage.name} 도달 필요`];
  if(node.prereq&&!bought(M,node.prereq))return [false,`${NODE_BY_ID[node.prereq]?.name||'선행 노드'} 필요`];
  if(M.stone<node.cost.s||herbHave(M,node.cost.hg)<node.cost.h)return [false,'수련 재료 부족'];
  return [true,'수련 가능'];
}
function applyEffect(M,node){
  if(node.effect.cult)for(const [k,v] of Object.entries(node.effect.cult))M.cult[k]=(Number(M.cult[k])||0)+v;
  if(node.effect.unlock){M.skills[node.effect.unlock].u=1}
  if(node.effect.skill){
    const s=M.skills[node.effect.skill.id];
    if(!s.u)s.u=1;
    s[node.effect.skill.key]=Math.min(5,(Number(s[node.effect.skill.key])||0)+node.effect.skill.amount);
  }
}
function buy(id){
  const node=NODE_BY_ID[id]; if(!node)return;
  const shot=snapshot(),M=ensure(shot.M),[ok,why]=canBuy(M,node);
  if(!ok){notice.textContent=why;return}
  M.stone-=node.cost.s;
  if(node.cost.h)M[herbKey(node.cost.hg)]-=node.cost.h;
  applyEffect(M,node);
  M.trainingNodes[id]=1;
  debug.replaceState(M);
  notice.textContent=`${node.stage.name} · ${node.name} 수련 완료 — ${effectText(node.effect)}`;
  requestAnimationFrame(render);
}

function style(){
  const s=document.createElement('style');
  s.textContent=`
  .v116-old-train{display:none!important}
  .stagepath-section{margin-top:8px}
  .stagepath-viewport{position:relative;height:clamp(390px,52dvh,560px);overflow:hidden;border:1px solid #31474a;border-radius:12px;background:radial-gradient(circle at 50% 6%,#1c373588,#081216 58%);touch-action:none;cursor:grab}
  .stagepath-world{position:absolute;left:0;top:0;width:${WORLD_W}px;transform-origin:0 0;will-change:transform}
  .stagepath-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
  .stagepath-line{fill:none;stroke:#405653;stroke-width:3;opacity:.72}.stagepath-line.on{stroke:#4e9b81}.stagepath-line.branch{stroke-width:2}
  .stagepath-node{position:absolute;transform:translate(-50%,-50%);min-width:108px;max-width:132px;min-height:48px;padding:7px 8px;border:1px solid #40545a;border-radius:10px;background:#111d22;color:#879997;text-align:center;font-size:9px;line-height:1.18;box-shadow:0 5px 16px #0006}
  .stagepath-node b{display:block;font-size:10px}.stagepath-node small{display:block;margin-top:3px;font-size:8px;color:#81938f}.stagepath-node.stage{min-width:88px;border-radius:999px;background:#152226}.stagepath-node.stage.on{border-color:#5fae92;color:#d5f3e8}.stagepath-node.stage.current{outline:2px solid #eef7ed;outline-offset:3px}.stagepath-node.done{border-color:#c7a956;background:#44391e;color:#ffeab0}.stagepath-node.ready{border-color:#c7a956;color:#f5dda0;box-shadow:0 0 17px #d7b95a44}.stagepath-node.locked{opacity:.46;filter:saturate(.45)}
  .stagepath-camera{position:absolute;z-index:20;right:7px;top:7px;display:flex;gap:3px;padding:3px;border:1px solid #344a4c;border-radius:9px;background:#081216dd}.stagepath-camera button{width:31px;height:29px;padding:0;border:1px solid #3b5153;border-radius:6px;background:#152529}.stagepath-camera button:nth-child(2){width:44px;font-size:9px}
  .stagepath-detail{margin-top:8px;padding:9px;border:1px solid #354c4c;border-radius:10px;background:#0d191d;min-height:92px}.stagepath-detail-head{display:flex;justify-content:space-between;gap:8px}.stagepath-detail-head b{font-size:12px}.stagepath-detail-head span{font-size:9px;color:#9db0ac}.stagepath-detail p{font-size:9px;color:#8fa29e;line-height:1.45;margin:5px 0}.stagepath-action{width:100%;min-height:36px;margin-top:6px;border:1px solid #657e6d;border-radius:8px;background:#23463b;font-size:10px;font-weight:750}.stagepath-action.ready{border-color:#b79b4d;background:#4a3e20;color:#fff0bc}
  @media(max-width:560px){.stagepath-viewport{height:410px}.stagepath-node{min-width:96px;max-width:116px;padding:6px;font-size:8px}.stagepath-node b{font-size:9px}}
  `;
  document.head.appendChild(s);
}

function bez(svg,a,b,cls=''){
  const p=document.createElementNS('http://www.w3.org/2000/svg','path');
  const mx=(a.x+b.x)/2;
  p.setAttribute('d',`M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`);
  p.setAttribute('class',`stagepath-line ${cls}`); svg.appendChild(p);
}
function makeNode(world,opt,fn){
  const b=document.createElement('button'); b.type='button'; b.className=`stagepath-node ${opt.cls||''}`;
  b.style.left=`${opt.x}px`;b.style.top=`${opt.y}px`;
  b.innerHTML=`<b>${opt.glyph?opt.glyph+' ':''}${opt.name}</b>${opt.meta?`<small>${opt.meta}</small>`:''}`;
  b.onclick=e=>{e.stopPropagation();fn?.()}; world.appendChild(b); return b;
}
function makeCamera(view,world){
  const C={x:0,y:0,s:.55,p:new Map(),g:null}; const min=.28,max=1.55;
  const apply=()=>world.style.transform=`translate(${C.x}px,${C.y}px) scale(${C.s})`;
  const fit=()=>{const r=view.getBoundingClientRect(),h=Number(world.dataset.h);if(r.width<40||r.height<40)return;C.s=Math.max(min,Math.min(.78,(r.width-18)/WORLD_W,(r.height-18)/h));C.x=(r.width-WORLD_W*C.s)/2;C.y=Math.max(8,(r.height-h*C.s)/2);apply()};
  const focus=(x,y,s=.64)=>{const r=view.getBoundingClientRect();if(r.width<40)return;C.s=Math.max(min,Math.min(max,s));C.x=r.width/2-x*C.s;C.y=r.height/2-y*C.s;apply()};
  const zoom=f=>{const r=view.getBoundingClientRect(),cx=r.width/2,cy=r.height/2,wx=(cx-C.x)/C.s,wy=(cy-C.y)/C.s,n=Math.max(min,Math.min(max,C.s*f));C.x=cx-wx*n;C.y=cy-wy*n;C.s=n;apply()};
  const gest=()=>{const a=[...C.p.values()];if(!a.length)return null;const ctr={x:a.reduce((s,p)=>s+p.x,0)/a.length,y:a.reduce((s,p)=>s+p.y,0)/a.length};return{n:a.length,ctr,d:a.length>1?Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y):0}};
  view.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;C.p.set(e.pointerId,{x:e.clientX,y:e.clientY});C.g=gest()},{passive:false});
  view.addEventListener('pointermove',e=>{if(!C.p.has(e.pointerId))return;e.preventDefault();const old=C.g;C.p.set(e.pointerId,{x:e.clientX,y:e.clientY});const now=gest();if(old&&now){const dx=now.ctr.x-old.ctr.x,dy=now.ctr.y-old.ctr.y;if(old.n>1&&now.n>1&&old.d){const r=view.getBoundingClientRect(),os=C.s,ns=Math.max(min,Math.min(max,os*now.d/old.d)),ox=old.ctr.x-r.left,oy=old.ctr.y-r.top,nx=now.ctr.x-r.left,ny=now.ctr.y-r.top,wx=(ox-C.x)/os,wy=(oy-C.y)/os;C.x=nx-wx*ns;C.y=ny-wy*ns;C.s=ns}else{C.x+=dx;C.y+=dy}apply()}C.g=now},{passive:false});
  const end=e=>{C.p.delete(e.pointerId);C.g=gest()};view.addEventListener('pointerup',end);view.addEventListener('pointercancel',end);
  return{fit,focus,zoom};
}

function setup(){
  const trainPanel=$('[data-panel="train"]'); if(!trainPanel)return;
  const old=$('#trainProgViewport')?.closest('.prog-section'); if(old)old.classList.add('v116-old-train');
  const record=trainPanel.querySelector('.record-grid')?.closest('.section');
  const sec=document.createElement('div');sec.className='section stagepath-section';
  const worldH=START_Y+(PATH.length-1)*STEP_Y+150;
  sec.innerHTML=`<div class="prog-head"><b>수련 · 법술 도맥</b><span>각 경지마다 4개의 독립 수련</span></div><div class="small" style="margin-bottom:7px">같은 계열의 수련도 서로 다른 노드입니다. 노드마다 비용과 상승량이 다릅니다.</div><div id="stagePathViewport" class="stagepath-viewport"><div id="stagePathWorld" class="stagepath-world" data-h="${worldH}" style="height:${worldH}px"><svg class="stagepath-svg" viewBox="0 0 ${WORLD_W} ${worldH}"></svg></div><div class="stagepath-camera"><button data-sp="out">−</button><button data-sp="fit">전체</button><button data-sp="in">＋</button></div></div><div id="stagePathDetail" class="stagepath-detail"></div>`;
  trainPanel.insertBefore(sec,record||null);
  cam=makeCamera($('#stagePathViewport'),$('#stagePathWorld'));
  sec.querySelector('[data-sp="out"]').onclick=()=>cam.zoom(1/1.2);sec.querySelector('[data-sp="in"]').onclick=()=>cam.zoom(1.2);sec.querySelector('[data-sp="fit"]').onclick=cam.fit;
  $('.tab-btn[data-tab="train"]')?.addEventListener('click',()=>requestAnimationFrame(()=>requestAnimationFrame(focusCurrent)));
  render(); requestAnimationFrame(focusCurrent);
}

function currentStageIndex(M){
  let idx=0; for(let i=0;i<PATH.length;i++)if(meets(M,PATH[i].req))idx=i; return idx;
}
function focusCurrent(){
  const M=state();const i=currentStageIndex(M),y=START_Y+i*STEP_Y;cam?.focus(500,y,.62);
}
function render(){
  const world=$('#stagePathWorld');if(!world)return;const M=ensure(state()),svg=world.querySelector('svg');
  world.querySelectorAll('.stagepath-node').forEach(e=>e.remove());svg.innerHTML='';
  PATH.forEach((st,i)=>{
    const y=START_Y+i*STEP_Y,open=meets(M,st.req),count=st.nodes.filter(n=>bought(M,n.id)).length,current=M.realm.major===st.req.major&&M.realm.stage===st.req.stage;
    const p={x:500,y}; if(i){const prev={x:500,y:START_Y+(i-1)*STEP_Y};bez(svg,prev,p,open?'on':'')}
    makeNode(world,{...p,name:st.name,glyph:'境',meta:`${count}/4`,cls:`stage ${open?'on':'locked'} ${current?'current':''}`},()=>{selected=`stage:${st.id}`;renderDetail()});
    st.nodes.forEach((n,j)=>{
      const np={x:POS_X[j],y:y+(j%2?34:-34)},done=bought(M,n.id),[can]=canBuy(M,n);
      bez(svg,p,np,done?'on branch':'branch');
      makeNode(world,{...np,name:n.name,glyph:n.glyph,meta:done?'완료':costText(n.cost),cls:done?'done':can?'ready':'locked'},()=>{selected=n.id;renderDetail()});
    });
  });
  renderDetail();
}
function renderDetail(){
  const box=$('#stagePathDetail');if(!box)return;const M=ensure(state());
  if(String(selected).startsWith('stage:')){
    const id=String(selected).slice(6),st=PATH.find(s=>s.id===id)||PATH[0],count=st.nodes.filter(n=>bought(M,n.id)).length;
    box.innerHTML=`<div class="stagepath-detail-head"><b>${st.name}</b><span>${count}/4 완료</span></div><p>이 경지에서 네 개의 독립 수련이 열립니다. 전부 필수는 아니며, 같은 검결 계열도 별개 노드로 다시 등장할 수 있습니다.</p><div>${meets(M,st.req)?'✓ 현재 접근 가능':'아직 경지에 도달하지 않았습니다.'}</div>`;return;
  }
  const n=NODE_BY_ID[selected]||ALL_NODES[0];if(!n)return;const done=bought(M,n.id),[can,why]=canBuy(M,n);
  box.innerHTML=`<div class="stagepath-detail-head"><b>${n.stage.name} · ${n.name}</b><span>${done?'완료':'1회 수련'}</span></div><p>${n.desc}<br><b>효과</b> · ${effectText(n.effect)}</p><div>${done?'✓ 이미 적용됨':`비용 · ${costText(n.cost)} · ${why}`}</div>`;
  const b=document.createElement('button');b.className=`stagepath-action ${can?'ready':''}`;b.textContent=done?'수련 완료':'이 노드 수련';b.disabled=!can;b.onclick=()=>buy(n.id);box.appendChild(b);
}

style();setup();
const obs=new MutationObserver(()=>requestAnimationFrame(render));for(const el of [$('#realm'),$('#stone'),$('#herb')])if(el)obs.observe(el,{childList:true,subtree:true,characterData:true});
window.addEventListener('resize',()=>requestAnimationFrame(focusCurrent));
P.trainingPath=PATH;P.renderStageTraining=render;P.focusStageTraining=focusCurrent;P.buyStageTraining=buy;
})();
