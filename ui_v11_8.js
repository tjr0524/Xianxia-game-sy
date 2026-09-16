(()=>{
'use strict';

const debug=window.__xianxiaDebug;
const P=window.__xianxiaProgression;
if(!debug||!P)return;
P.version='11.10';

const $=s=>document.querySelector(s);
const C=debug.constants;
const AREA_GLYPH={qingyun:'青',blackwind:'風',blood:'血',thunder:'雷'};
const SAVE_KEY='xianxia_proto_v11';
let savedSkills=null;
let pickerSignature='';

function addStyle(){
  if($('#v118style'))return;
  const s=document.createElement('style');
  s.id='v118style';
  s.textContent=`
  .expedition-area-picker{margin:8px 0 6px;padding:7px;border:1px solid #32474c;border-radius:10px;background:#0c171bcc;text-align:left}
  .expedition-area-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:5px}
  .expedition-area-head b{font-size:10px;color:#d7e6e2}.expedition-area-head span{font-size:8px;color:#7f9490}
  .expedition-area-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}
  .expedition-area-btn{min-height:42px;margin:0;padding:5px 3px;border:1px solid #354b50;border-radius:8px;background:#122026;color:#93a6a2;text-align:center}
  .expedition-area-btn i{display:block;font:700 16px serif;font-style:normal;margin-bottom:2px}.expedition-area-btn span{display:block;font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .expedition-area-btn.active{border-color:#63ac96;background:#1b443b;color:#e3f6ef;box-shadow:0 0 0 1px #68b49b33 inset}
  .expedition-plan-label{margin:5px 0 4px;text-align:left;font-size:9px;color:#869b97}
  @media(max-width:560px){.expedition-area-picker{margin:5px 0;padding:5px}.expedition-area-grid{gap:3px}.expedition-area-btn{min-height:36px;padding:3px 2px}.expedition-area-btn i{font-size:14px}.expedition-area-btn span{font-size:7px}}
  `;
  document.head.appendChild(s);
}

function areaPicker(){
  const plans=$('#planChoices');
  if(!plans)return null;
  let wrap=$('#expeditionAreaPicker');
  if(!wrap){
    wrap=document.createElement('div');
    wrap.id='expeditionAreaPicker';
    wrap.className='expedition-area-picker';
    wrap.innerHTML='<div class="expedition-area-head"><b>원정 비경</b><span>해금한 비경은 언제든 재입장</span></div><div class="expedition-area-grid"></div>';
    plans.parentNode.insertBefore(wrap,plans);
    const label=document.createElement('div');
    label.className='expedition-plan-label';
    label.textContent='탐색 방법 선택';
    plans.parentNode.insertBefore(label,plans);
  }
  return wrap;
}

function renderAreaPicker(force=false){
  const wrap=areaPicker();
  if(!wrap)return;
  const shot=debug.snapshot();
  const state=shot.M;
  const unlocked=C.AREAS.filter(area=>state.unlocked?.[area.id]);
  const signature=`${state.area}|${shot.phase}|${unlocked.map(a=>a.id).join(',')}`;
  if(!force&&signature===pickerSignature)return;
  pickerSignature=signature;
  const grid=wrap.querySelector('.expedition-area-grid');
  grid.replaceChildren();
  for(const area of unlocked){
    const b=document.createElement('button');
    b.type='button';
    b.className='expedition-area-btn'+(state.area===area.id?' active':'');
    b.disabled=shot.phase==='run';
    b.innerHTML=`<i>${AREA_GLYPH[area.id]||'境'}</i><span>${area.name.replace(' 후산','')}</span>`;
    b.onclick=()=>{
      if(debug.snapshot().phase==='run')return;
      debug.selectArea(area.id);
      const n=$('#notice');
      if(n)n.textContent=`${area.name}을 다음 원정지로 선택했습니다.`;
      pickerSignature='';
      requestAnimationFrame(()=>renderAreaPicker(true));
    };
    grid.appendChild(b);
  }
}

const BALANCE={
  sword:{pow:r=>-1.4+r*.5,range:r=>-1.45+r*.5},
  wave:{pow:r=>-2.0+r*.5,range:r=>-2.33+r*.5},
  chain:{pow:r=>-1.8+r*.5,range:r=>-1+r*.35},
  thunder:{pow:r=>-2.2+r*.5,range:r=>-2+r*.4},
  array:{pow:r=>-2.2+r*.5,range:r=>-3.7+r*.45}
};

function clone(v){return JSON.parse(JSON.stringify(v))}

function applyRunBalance(){
  const shot=debug.snapshot();
  if(shot.phase==='run'||savedSkills)return;
  const state=shot.M;
  savedSkills=clone(state.skills||{});
  for(const [id,rule] of Object.entries(BALANCE)){
    if(!state.skills?.[id])continue;
    const raw=savedSkills[id]||{};
    state.skills[id].pow=rule.pow(Number(raw.pow)||0);
    state.skills[id].range=rule.range(Number(raw.range)||0);
  }
  debug.replaceState(state);
  try{
    const persisted=clone(state);
    persisted.skills=clone(savedSkills);
    localStorage.setItem(SAVE_KEY,JSON.stringify(persisted));
  }catch(error){console.warn('v11.10 balance persist guard failed',error)}
}

function restoreRunBalance(){
  if(!savedSkills)return;
  const shot=debug.snapshot();
  if(shot.phase==='run')return;
  const state=shot.M;
  state.skills=clone(savedSkills);
  savedSkills=null;
  debug.replaceState(state);
  pickerSignature='';
  requestAnimationFrame(()=>renderAreaPicker(true));
}

function bindBalance(){
  const start=$('#start');
  if(start&&!start.dataset.v118Balance){
    start.dataset.v118Balance='1';
    start.addEventListener('click',applyRunBalance,{capture:true});
  }
  const ov=$('#ov');
  if(ov&&!ov.dataset.v118Balance){
    ov.dataset.v118Balance='1';
    new MutationObserver(()=>{
      requestAnimationFrame(()=>{
        restoreRunBalance();
        pickerSignature='';
        renderAreaPicker(true);
      });
    }).observe(ov,{attributes:true,attributeFilter:['class']});
  }
}

addStyle();
renderAreaPicker(true);
bindBalance();

// Area selection changes #area text. Watch only that tiny label; never observe
// the expedition dialog subtree, because rebuilding the picker would otherwise
// trigger its own observer again and create an infinite render loop.
const areaLabel=$('#area');
if(areaLabel)new MutationObserver(()=>{
  pickerSignature='';
  requestAnimationFrame(()=>renderAreaPicker(true));
}).observe(areaLabel,{childList:true,subtree:true,characterData:true});

P.renderAreaPicker=()=>renderAreaPicker(true);
P.restoreRunBalance=restoreRunBalance;
})();
