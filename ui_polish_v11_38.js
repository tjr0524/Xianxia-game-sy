(()=>{
'use strict';
const VERSION='11.38.0';
if(window.__xianxiaUiPolishVersion===VERSION)return;
window.__xianxiaUiPolishVersion=VERSION;
window.__XIANXIA_BUILD__=VERSION;

const D=window.__xianxiaDebug;
const P=window.__xianxiaProgression;
if(!D){console.error('[ui-11.38] game state unavailable');return}

const $=s=>document.querySelector(s);
const REALMS=['연기','축기','결단','원영'];
const HERBS=['하급','중급','상급'];
const GLYPHS={sword:'刃',wave:'風',chain:'連',thunder:'雷',array:'陣'};
const AREA_GLYPHS={qingyun:'青',blackwind:'風',blood:'血',thunder:'雷'};
const BRANCH_GLYPHS={eco:'獸',res:'脈',fate:'緣',storm:'雷'};
const SKILL_COST={
  sword:[null,{s:80,h:3,hg:0},{s:70,h:4,hg:0},{s:90,h:5,hg:0},{s:110,h:6,hg:0},{s:130,h:8,hg:0}],
  wave:[null,{s:150,h:5,hg:0},{s:180,h:7,hg:0},{s:210,h:9,hg:0},{s:240,h:12,hg:0},{s:280,h:15,hg:0}],
  chain:[null,{s:180,h:5,hg:1},{s:220,h:7,hg:1},{s:260,h:9,hg:1},{s:320,h:12,hg:1},{s:380,h:15,hg:1}],
  thunder:[null,{s:400,h:4,hg:2},{s:500,h:5,hg:2},{s:650,h:7,hg:2},{s:800,h:10,hg:2},{s:950,h:15,hg:2}],
  array:[null,{s:1200,h:12,hg:2}]
};

let spellObserver=null;
let mapObserver=null;
let pickerObserver=null;
let spellRenderQueued=false;
let mapDecorating=false;
let pickerDecorating=false;

function snapshot(){return D.snapshot()}
function spells(){
  const list=typeof P?.spellList==='function'?P.spellList():D.constants.SKILLS;
  return (list||[]).filter(s=>s.id!=='basic');
}
function herbKey(g){return g<=0?'herb':g===1?'herb2':'herb3'}
function have(M,g){return +M[herbKey(g)]||0}
function reached(M,req){
  if(!req)return true;
  const major=M.realm?.major??-1,stage=M.realm?.stage||0;
  return major>req.major||(major===req.major&&stage>=req.stage);
}
function realmLabel(req){
  if(!req||req.major<0)return'상시';
  return `${REALMS[req.major]||'상위 경지'} ${req.stage}층`;
}
function cap(M,skill){
  if(!reached(M,skill.req))return 0;
  if(skill.id==='array')return 1;
  if(skill.id==='thunder'&&(M.realm?.major??-1)>0)return 5;
  if((M.realm?.major??-1)>skill.req.major)return 5;
  return Math.max(1,Math.min(5,(M.realm?.stage||0)-skill.req.stage+1));
}
function skillState(M,id){
  M.skills||={};
  return M.skills[id]||{u:0,pow:0,range:0,cycle:0};
}
function known(M,id){return !!M.skillUnlocks?.[id]||!!skillState(M,id).u}
function cost(skill,next){return SKILL_COST[skill.id]?.[next]||{s:999999,h:999,hg:skill.grade||0}}
function canPay(M,c){return (+M.stone||0)>=c.s&&have(M,c.hg)>=c.h}
function notice(text){const el=$('#notice');if(el)el.textContent=text}
function costMarkup(c){
  if(!c)return'<span>현재 상한</span>';
  const parts=[];
  if(c.s)parts.push(`<span class="stone">◆ ${c.s}</span>`);
  if(c.h)parts.push(`<span class="herb${c.hg}">❧ ${HERBS[c.hg]} ${c.h}</span>`);
  return parts.join('')||'<span>비용 없음</span>';
}
function rankPips(rank,currentCap){
  let html='';
  for(let i=1;i<=5;i++)html+=`<i class="${i<=rank?'on':i>currentCap?'cap':''}"></i>`;
  return html;
}
function statusFor(isKnown,isReady,rank,currentCap){
  if(!isKnown)return isReady?'전승 가능':'봉인';
  return rank>=currentCap?'경지 상한':'자동 발동';
}
function cardClass(isKnown,isReady,rank,currentCap){
  if(!isKnown)return isReady?'ready':'locked';
  return rank>=5||rank>=currentCap?'known mastered':'known';
}
function makeSpellCard(M,phase,skill){
  const isKnown=known(M,skill.id);
  const state=skillState(M,skill.id);
  const currentCap=cap(M,skill);
  const rank=isKnown?Math.max(1,Math.min(5,+state.pow||1)):0;
  const stageOpen=reached(M,skill.req);
  const unlockCost={s:+skill.unlock?.s||0,h:+skill.unlock?.h||0,hg:skill.grade||0};
  const nextCost=isKnown&&rank<currentCap?cost(skill,rank+1):null;
  const actionable=phase!=='run'&&(isKnown?rank<currentCap&&canPay(M,nextCost):stageOpen&&canPay(M,unlockCost));
  const stateText=statusFor(isKnown,stageOpen&&!isKnown,rank,currentCap);
  const actionText=phase==='run'?'원정 중':!isKnown?(stageOpen?'법술 전승':`${realmLabel(skill.req)} 개방`):rank>=currentCap?'현재 경지 상한':'숙련 강화';
  const shownCost=isKnown?nextCost:stageOpen?unlockCost:null;
  const card=document.createElement('article');
  card.className=`spell-card38 ${cardClass(isKnown,stageOpen&&!isKnown,rank,currentCap)}`;
  card.dataset.skill=skill.id;
  card.innerHTML=`
    <div class="spell-seal38" aria-hidden="true">${GLYPHS[skill.id]||'法'}</div>
    <div class="spell-main38">
      <div class="spell-head38">
        <div class="spell-title38"><b>${skill.n}</b><small>${realmLabel(skill.req)} · ${skill.cd?`기본 순환 ${Number(skill.cd).toFixed(1)}초`:'법술 전승'}</small></div>
        <span class="spell-state38">${stateText}</span>
      </div>
      <p class="spell-desc38">${skill.desc}</p>
      <div class="spell-rank38"><span>숙련</span><div class="spell-pips38">${rankPips(rank,currentCap)}</div><span>${rank}/${currentCap||5}</span></div>
      <div class="spell-actions38">
        <div class="spell-cost38">${shownCost?costMarkup(shownCost):`<span>${stageOpen?'강화 완료':realmLabel(skill.req)+' 필요'}</span>`}</div>
        <button type="button" class="spell-action38" ${actionable?'':'disabled'}>${actionText}</button>
      </div>
    </div>`;
  card.querySelector('.spell-action38').addEventListener('click',()=>{
    if(!actionable)return;
    if(isKnown)upgrade(skill.id);
    else unlock(skill.id);
  });
  return card;
}
function renderSpellbook(){
  const root=$('#skillTree');
  if(!root)return;
  spellObserver?.disconnect();
  const shot=snapshot(),M=shot.M;
  const book=document.createElement('div');
  book.className='spellbook38';
  book.innerHTML=`
    <div class="spellbook38-intro"><span class="spellbook38-core">劍</span><div><b>검맥 법술첩</b><p>전승한 법술은 기본 검격과 함께 각자의 순환마다 자동 발동합니다.</p></div></div>
    <div class="spellbook38-note"><strong>기본 검격 · 상시</strong><span>별도 해금 없이 사용 · 수련 도맥에서 강화</span></div>`;
  for(const skill of spells())book.appendChild(makeSpellCard(M,shot.phase,skill));
  root.replaceChildren(book);
  spellObserver?.observe(root,{childList:true});
}
function scheduleSpellbook(){
  if(spellRenderQueued)return;
  spellRenderQueued=true;
  requestAnimationFrame(()=>{spellRenderQueued=false;renderSpellbook()});
}
function unlock(id){
  const shot=snapshot(),M=shot.M,skill=spells().find(s=>s.id===id);
  if(!skill||shot.phase==='run'||known(M,id)||!reached(M,skill.req))return;
  const c={s:+skill.unlock?.s||0,h:+skill.unlock?.h||0,hg:skill.grade||0};
  if(!canPay(M,c)){notice('법술 전승 재료가 부족합니다.');return}
  M.stone-=c.s;
  if(c.h)M[herbKey(c.hg)]=have(M,c.hg)-c.h;
  M.skillUnlocks||={};
  M.skillUnlocks[id]=1;
  M.skills||={};
  M.skills[id]={u:1,pow:1,range:0,cycle:0};
  D.replaceState(M);
  notice(`${skill.n} 전승 완료 · 다음 원정부터 자동 발동합니다.`);
  scheduleSpellbook();
}
function upgrade(id){
  const shot=snapshot(),M=shot.M,skill=spells().find(s=>s.id===id);
  if(!skill||shot.phase==='run'||!known(M,id))return;
  const state=skillState(M,id),rank=Math.max(1,+state.pow||1),currentCap=cap(M,skill);
  if(rank>=currentCap)return;
  const c=cost(skill,rank+1);
  if(!canPay(M,c)){notice('법술 숙련 강화 재료가 부족합니다.');return}
  M.stone-=c.s;
  if(c.h)M[herbKey(c.hg)]=have(M,c.hg)-c.h;
  M.skills[id]={...state,u:1,pow:rank+1,range:0,cycle:0};
  D.replaceState(M);
  notice(`${skill.n} 숙련 ${rank+1}/${currentCap} 강화.`);
  scheduleSpellbook();
}

function compactAreaName(name){return String(name||'').replace(/\s*후산$/,'')}
function decoratePicker(){
  const grid=$('#expeditionAreaPicker .expedition-area-grid');
  if(!grid||pickerDecorating)return;
  pickerDecorating=true;
  pickerObserver?.disconnect();
  for(const button of grid.querySelectorAll('.expedition-area-btn')){
    const raw=button.textContent.trim();
    const glyph=button.querySelector('i')?.textContent.trim()||raw.slice(0,1);
    const name=compactAreaName(raw.replace(glyph,'').trim());
    button.innerHTML=`<i aria-hidden="true">${glyph}</i><span class="area-label38">${name}</span>`;
    button.setAttribute('aria-label',name);
  }
  pickerObserver?.observe(grid,{childList:true,subtree:true});
  pickerDecorating=false;
}

function branchGlyph(id){
  if(id.startsWith('eco'))return BRANCH_GLYPHS.eco;
  if(id.startsWith('res'))return BRANCH_GLYPHS.res;
  if(id.startsWith('fate'))return BRANCH_GLYPHS.fate;
  if(id.startsWith('storm'))return BRANCH_GLYPHS.storm;
  return'印';
}
function decorateMap(){
  const world=$('#mapWorld');
  if(!world||mapDecorating)return;
  mapDecorating=true;
  mapObserver?.disconnect();
  for(const zone of world.querySelectorAll('.map-zone span'))zone.textContent=compactAreaName(zone.textContent);
  for(const node of world.querySelectorAll('.map-node')){
    if(node.classList.contains('map-root')){
      const area=node.dataset.area||'';
      const name=compactAreaName(D.constants.AREAS.find(a=>a.id===area)?.name||node.textContent.replace(/^[青風血雷]\s*/,''));
      node.innerHTML=`<span class="map-root-seal38" aria-hidden="true">${AREA_GLYPHS[area]||'境'}</span><span class="map-root-name38">${name}</span>`;
      node.setAttribute('aria-label',`${name} 비경`);
    }else if(node.classList.contains('map-point')){
      const id=node.dataset.affinity||'';
      const rank=(node.textContent.match(/\d+\/5/)||['0/5'])[0];
      node.innerHTML=`<span class="map-point-glyph38" aria-hidden="true">${branchGlyph(id)}</span><span class="rank">${rank}</span>`;
      const data=Object.values(D.constants.TREE||{}).flat().find(x=>x.id===id);
      node.setAttribute('aria-label',`${data?.n||'개척 노드'} ${rank}`);
    }else if(node.classList.contains('map-gate')){
      const area=node.dataset.area||'';
      const name=compactAreaName(D.constants.AREAS.find(a=>a.id===area)?.name||node.textContent.replace(/^門\s*/,''));
      node.innerHTML=`<span class="map-gate-mark38" aria-hidden="true">門</span><span class="map-gate-name38">${name}</span>`;
      node.setAttribute('aria-label',`${name} 관문`);
    }
  }
  mapObserver?.observe(world,{childList:true,subtree:true});
  mapDecorating=false;
}

function observe(){
  const skillRoot=$('#skillTree');
  if(skillRoot){spellObserver=new MutationObserver(scheduleSpellbook);spellObserver.observe(skillRoot,{childList:true})}
  const world=$('#mapWorld');
  if(world){mapObserver=new MutationObserver(()=>requestAnimationFrame(decorateMap));mapObserver.observe(world,{childList:true,subtree:true})}
  const picker=$('#expeditionAreaPicker .expedition-area-grid');
  if(picker){pickerObserver=new MutationObserver(()=>requestAnimationFrame(decoratePicker));pickerObserver.observe(picker,{childList:true,subtree:true})}
  const areaPanel=$('[data-panel="skills"]');
  areaPanel?.addEventListener('xianxia:panel-open',scheduleSpellbook);
  $('.tab-btn[data-tab="skills"]')?.addEventListener('click',scheduleSpellbook);
  $('.tab-btn[data-tab="tree"]')?.addEventListener('click',()=>requestAnimationFrame(decorateMap));
}
function boot(){
  const badge=$('#buildVersion');
  if(badge)badge.textContent=`BUILD ${VERSION}`;
  renderSpellbook();
  decoratePicker();
  decorateMap();
  observe();
  setTimeout(()=>{decoratePicker();decorateMap();scheduleSpellbook()},250);
}

boot();
})();
