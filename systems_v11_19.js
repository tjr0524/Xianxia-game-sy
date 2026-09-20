(()=>{
'use strict';
const D=window.__xianxiaDebug,P=window.__xianxiaProgression;if(!D||!P||window.__xianxiaSystemsVersion==='11.51.25')return;window.__xianxiaSystemsVersion='11.51.25';
const $=s=>document.querySelector(s),C=D.constants,clone=v=>JSON.parse(JSON.stringify(v));
function css(){if($('#v1119systems'))return;const s=document.createElement('style');s.id='v1119systems';s.textContent=`
.v19-danger-svg{position:absolute;z-index:6;inset:0;width:100%;height:100%;pointer-events:none;display:none}.v19-danger-svg.show{display:block}.v19-return-line{stroke:#ffe29a;stroke-width:4;stroke-dasharray:11 9;animation:v19dash .65s linear infinite;filter:drop-shadow(0 0 5px #ffbc55)}.v19-exit-ring{fill:#39d9be18;stroke:#ffe09a;stroke-width:5;transform-box:fill-box;transform-origin:center;animation:v19ring .8s ease-in-out infinite alternate;filter:drop-shadow(0 0 8px #66e8cc)}.v19-exit-core{fill:#84f5d6;opacity:.8}.v19-exit-label{fill:#fff0bb;font:800 18px sans-serif;text-anchor:middle;paint-order:stroke;stroke:#071014;stroke-width:4}.v19-danger-banner{position:absolute;z-index:7;left:50%;top:42px;transform:translateX(-50%);display:none;padding:7px 12px;border:1px solid #ffcf78;border-radius:999px;background:#3a1b13e8;color:#ffe6ae;font-size:11px;font-weight:850;box-shadow:0 0 20px #ff8e4966;pointer-events:none;white-space:nowrap}.v19-danger-banner.show{display:block;animation:v19banner .45s ease-in-out 3 alternate}.v19-danger-ret{border-color:#ffd175!important;background:linear-gradient(180deg,#7f3a25,#542417)!important;color:#fff0c0!important;animation:v19ret .55s ease-in-out infinite alternate!important;box-shadow:0 0 0 2px #ffcf7544,0 0 22px #ff9b4d88!important}@keyframes v19dash{to{stroke-dashoffset:-20}}@keyframes v19ring{to{transform:scale(1.22);opacity:.75}}@keyframes v19ret{to{filter:brightness(1.35);transform:translateY(-1px)}}@keyframes v19banner{to{transform:translateX(-50%) scale(1.04)}}
.tabs.v19-four{grid-template-columns:repeat(4,1fr)!important}.v19-ach-tab{position:relative}.v19-ach-tab.ready:after{content:'';position:absolute;right:7px;top:6px;width:7px;height:7px;border-radius:50%;background:#f2d36e;box-shadow:0 0 9px #f2d36e}
.v19-journal{display:grid;gap:7px}.v19-journal-intro{padding:9px;border:1px solid #4a4633;border-radius:9px;background:#1b1a13;color:#c8c4a9;font-size:9px;line-height:1.5}.v19-journal-total{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:7px}.v19-journal-total div{padding:6px;border:1px solid #3b4945;border-radius:8px;background:#111b1d;text-align:center}.v19-journal-total span{display:block;color:#82928d;font-size:7px}.v19-journal-total b{font-size:11px;color:#ead79b}
.v19-area{overflow:hidden;border:1px solid #34484b;border-radius:10px;background:#101b20}.v19-area[open]{border-color:#6d6240;background:#171a18}.v19-area-summary{list-style:none;cursor:pointer;padding:9px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px;align-items:center}.v19-area-summary::-webkit-details-marker{display:none}.v19-area-title{display:flex;align-items:center;gap:7px;min-width:0}.v19-area-glyph{width:31px;height:31px;flex:0 0 31px;border:1px solid #5a675f;border-radius:50%;display:grid;place-items:center;font:800 14px serif;color:#d6c383;background:#171d1a}.v19-area-name{min-width:0}.v19-area-name b{display:block;font:750 11px serif;color:#edf2e7}.v19-area-name small{display:block;margin-top:2px;font-size:8px;color:#8fa09a}.v19-area-meta{text-align:right}.v19-area-meta b{display:block;font-size:9px;color:#dbc886}.v19-area-meta small{display:block;margin-top:2px;font-size:7px;color:#8fa09a}.v19-area-ready{display:inline-block;margin-top:3px;padding:2px 5px;border:1px solid #9b8342;border-radius:999px;background:#3b321a;color:#ffe59e;font-size:7px;font-weight:800}.v19-area-progress{grid-column:1/-1;height:5px;overflow:hidden;border-radius:99px;background:#091113}.v19-area-progress i{display:block;height:100%;background:linear-gradient(90deg,#8a7740,#d6bd69)}
.v19-goals{display:grid;gap:5px;padding:0 7px 7px}.v19-goal{display:grid;grid-template-columns:27px minmax(0,1fr) auto;gap:7px;align-items:center;padding:7px;border:1px solid #2f4145;border-radius:8px;background:#0d171a}.v19-goal.done{border-color:#665b39;background:#1b1b15}.v19-goal.claimed{opacity:.65}.v19-goal-rank{width:27px;height:27px;display:grid;place-items:center;border:1px solid #53645e;border-radius:7px;color:#97aaa4;font:800 10px serif}.v19-goal.done .v19-goal-rank{border-color:#9a8445;color:#f1d98d;background:#2b2718}.v19-goal-main b{display:block;font-size:9px;color:#e2ebe7}.v19-goal-main span{display:block;margin-top:2px;font-size:8px;line-height:1.35;color:#8fa19c}.v19-goal-reward{margin-top:3px;font-size:8px;color:#d7c47e}.v19-goal button{min-width:62px;min-height:30px;padding:3px 6px;border:1px solid #4b5c57;border-radius:7px;background:#162326;font-size:8px}.v19-goal.done:not(.claimed) button{border-color:#a98f49;background:#493d1f;color:#ffe7a0;box-shadow:0 0 11px #c7a84c22}.v19-goal.claimed button{border-color:#384641;background:#11191a;color:#6f817b}
@media(max-width:560px){.v19-danger-banner{top:31px;font-size:9px}.v19-area-summary{padding:7px}.v19-goal{grid-template-columns:25px minmax(0,1fr) auto;padding:6px;gap:5px}.v19-goal button{min-width:56px}.v19-journal-total{gap:3px}}
`;document.head.appendChild(s)}
function dangerUi(){const game=$('#game');if(!game||$('#v19DangerSvg'))return;const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='v19DangerSvg';svg.classList.add('v19-danger-svg');svg.setAttribute('viewBox','0 0 700 460');svg.setAttribute('preserveAspectRatio','none');svg.innerHTML='<defs><marker id="v19arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#ffe29a"/></marker></defs><line id="v19ReturnLine" class="v19-return-line" x1="350" y1="230" x2="350" y2="420" marker-end="url(#v19arrow)"/><circle class="v19-exit-ring" cx="350" cy="438" r="29"/><circle class="v19-exit-core" cx="350" cy="438" r="8"/><text class="v19-exit-label" x="350" y="397">귀환진</text>';game.appendChild(svg);const b=document.createElement('div');b.id='v19DangerBanner';b.className='v19-danger-banner';b.textContent='비경 붕괴 임박 · 귀환진으로 복귀하십시오';game.appendChild(b)}
let wasDanger=false,bannerTimer=0;function dangerRefresh(){dangerUi();const sh=D.snapshot(),game=$('#game'),ret=$('#ret'),svg=$('#v19DangerSvg'),banner=$('#v19DangerBanner');if(!game||!ret||!svg)return;const danger=sh.phase==='run'&&game.classList.contains('danger');ret.classList.toggle('v19-danger-ret',danger);ret.textContent=danger?'↩ 즉시 귀환':'출구로 복귀';svg.classList.toggle('show',danger);if(danger){const p=sh.P||{x:350,y:230},line=$('#v19ReturnLine');line?.setAttribute('x1',Math.max(0,Math.min(700,p.x||350)));line?.setAttribute('y1',Math.max(0,Math.min(460,p.y||230)));if(!wasDanger&&banner){banner.classList.add('show');clearTimeout(bannerTimer);bannerTimer=setTimeout(()=>banner.classList.remove('show'),2300)}}else banner?.classList.remove('show');wasDanger=danger}
const MASTERY=()=>window.__xianxiaMastery;
const AREA_GLYPH={qingyun:'雲',blackwind:'風',blood:'血',thunder:'雷',marsh:'澤',taixu:'陣'};
const ROMAN=['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ'];
let forceOpenArea='';
function journalUi(){
  const tabs=$('.tabs'),treeBtn=$('.tab-btn[data-tab="tree"]');if(!tabs||!treeBtn)return;
  tabs.classList.add('v19-four');
  let b=$('.v19-ach-tab');
  if(!b){
    b=document.createElement('button');b.className='tab-btn v19-ach-tab';b.dataset.tab='daohang';b.textContent='도행록';treeBtn.after(b);
    b.addEventListener('click',()=>{
      document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');$('#v19JournalPanel')?.classList.add('active');D.setMenuOpen?.(true);renderJournal();
    });
    document.querySelectorAll('.tab-btn:not(.v19-ach-tab)').forEach(x=>x.addEventListener('click',()=>$('#v19JournalPanel')?.classList.remove('active')));
  }
  let p=$('#v19JournalPanel');
  if(!p){
    p=document.createElement('section');p.id='v19JournalPanel';p.className='panel';p.dataset.panel='daohang';
    p.innerHTML='<div class="section"><div class="section-head"><b>도행록 · 비경 숙련</b><span class="small">업적을 새기고 도흔을 회수한다</span></div><div class="v19-journal-intro">각 비경의 숙련 업적을 달성하면 이곳에 기록됩니다. 기록된 보상에서 <b>도흔</b>을 직접 수령해 팔괘 진반의 선택 노드를 영구 해금할 수 있습니다. 비경 이름을 눌러 업적 목록을 펼치거나 접을 수 있습니다.<div id="v19JournalTotal" class="v19-journal-total"></div></div><div id="v19Journal" class="v19-journal"></div></div>';
    $('.controls')?.insertBefore(p,$('details.dev'));
  }
}
function claimMastery(area,index){
  const sh=D.snapshot();if(sh.phase==='run')return;
  const api=MASTERY();if(!api?.claim)return;
  const m=clone(sh.M),reward=api.claim(m,area,index);
  if(!reward)return;
  forceOpenArea=area;
  D.replaceState(m);
  renderJournal();
  const n=$('#notice');if(n)n.textContent=`도행록 보상 수령 · 도흔 +${reward}`;
}
function openJournalArea(area){
  forceOpenArea=area;
  renderJournal();
  const d=$(`.v19-area[data-area="${area}"]`);
  if(d)d.open=true;
}
function renderJournal(){
  journalUi();
  const box=$('#v19Journal'),tab=$('.v19-ach-tab'),total=$('#v19JournalTotal'),api=MASTERY();
  if(!box||!api?.summary)return;
  const oldOpen=new Set(Array.from(box.querySelectorAll('.v19-area[open]')).map(x=>x.dataset.area));
  const sh=D.snapshot(),m=sh.M,summary=api.summary(m),first=!box.dataset.ready;
  const pendingAreas=api.areas.filter(area=>(summary.areas?.[area]?.pendingReward||0)>0);
  if(forceOpenArea)oldOpen.add(forceOpenArea);
  else if(first)oldOpen.add(pendingAreas[0]||m.area||'qingyun');
  box.replaceChildren();box.dataset.ready='1';
  let pendingClaims=0;
  for(const area of api.areas){
    const a=summary.areas?.[area];if(!a)continue;
    const details=document.createElement('details');details.className='v19-area';details.dataset.area=area;
    if(oldOpen.has(area))details.open=true;
    const pendingCount=a.done.reduce((n,v,i)=>n+(v&&!a.claimedFlags[i]?1:0),0);pendingClaims+=pendingCount;
    const unlocked=!!m.unlocked?.[area],progress=Math.max(0,Math.min(100,a.marks/5*100));
    const head=document.createElement('summary');head.className='v19-area-summary';
    head.innerHTML=`<div class="v19-area-title"><span class="v19-area-glyph">${AREA_GLYPH[area]||'錄'}</span><span class="v19-area-name"><b>${a.name}</b><small>${unlocked?'숙련 진행 중':'아직 미개방'} · ${a.marks}/5 달성</small></span></div><div class="v19-area-meta"><b>도흔 ${a.claimedReward}/${a.totalReward}</b><small>${a.claimed}/5 수령</small>${a.pendingReward?`<span class="v19-area-ready">+${a.pendingReward} 수령 가능</span>`:''}</div><div class="v19-area-progress"><i style="width:${progress}%"></i></div>`;
    details.appendChild(head);
    const goals=document.createElement('div');goals.className='v19-goals';
    for(let i=0;i<5;i++){
      const done=!!a.done[i],claimed=!!a.claimedFlags[i],reward=+a.rewards[i]||0,row=document.createElement('div');
      row.className='v19-goal '+(done?'done ':'')+(claimed?'claimed':'');
      row.dataset.index=String(i);
      row.innerHTML=`<div class="v19-goal-rank">${ROMAN[i]}</div><div class="v19-goal-main"><b>${a.objectives[i]}</b><span>${done?(claimed?'업적 완료 · 보상 수령 완료':'업적 완료 · 도흔을 수령할 수 있습니다'):'달성 조건을 만족한 뒤 무사 귀환하면 기록됩니다.'}</span><div class="v19-goal-reward">기록 보상 · 도흔 +${reward}</div></div>`;
      const btn=document.createElement('button');btn.type='button';btn.dataset.claimArea=area;btn.dataset.claimIndex=String(i);
      btn.textContent=claimed?'수령 완료':done?'도흔 수령':'미달성';btn.disabled=!done||claimed;
      btn.onclick=e=>{e.preventDefault();e.stopPropagation();claimMastery(area,i)};
      row.appendChild(btn);goals.appendChild(row);
    }
    details.appendChild(goals);box.appendChild(details);
  }
  if(total)total.innerHTML=`<div><span>보유 도흔</span><b>${summary.daoMarks}</b></div><div><span>누적 수령</span><b>${summary.earnedDaoMarks}/${summary.maxDaoMarks}</b></div><div><span>수령 대기</span><b>${summary.pendingDaoMarks}</b></div>`;
  tab?.classList.toggle('ready',pendingClaims>0);
  forceOpenArea='';
}
window.__xianxiaJournal={render:renderJournal,openArea:openJournalArea,claim:claimMastery};
function boot(){css();dangerUi();journalUi();renderJournal();setInterval(()=>{dangerRefresh();renderJournal()},350)}boot();
})();
