(()=>{
'use strict';
const VERSION='11.43.0';
if(window.__xianxiaCooldownHud?.version===VERSION)return;
window.__xianxiaCooldownHud={version:VERSION};
window.__XIANXIA_BUILD__=VERSION;

const $=s=>document.querySelector(s);
const SHORT={sword:'어검',wave:'검풍',chain:'연환',thunder:'낙뢰',array:'만검'};
const GLYPH={sword:'劍',wave:'風',chain:'連',thunder:'雷',array:'陣'};
let signature='';
let observedMax={};
let previous={};

function installStyle(){
  if($('#v1143CooldownStyle'))return;
  const style=document.createElement('style');
  style.id='v1143CooldownStyle';
  style.textContent=`
#v1143Cooldowns{
  position:absolute;
  z-index:33;
  right:calc(env(safe-area-inset-right) + 14px);
  top:calc(env(safe-area-inset-top) + 54px);
  display:none;
  flex-direction:column;
  align-items:flex-end;
  gap:5px;
  pointer-events:none;
  color:#283832;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Pretendard",sans-serif;
}
body.v1133-run #v1143Cooldowns{display:flex}
.v1143-cd{
  position:relative;
  width:43px;
  height:43px;
  padding:2px;
  border:1px solid rgba(235,228,205,.62);
  border-radius:11px 3px 11px 3px;
  background:rgba(238,231,212,.72);
  box-shadow:0 4px 14px rgba(20,28,24,.16);
  backdrop-filter:blur(5px);
  overflow:hidden;
}
.v1143-cd-ring{
  position:absolute;
  inset:3px;
  border-radius:9px 2px 9px 2px;
  background:conic-gradient(rgba(67,86,78,.76) calc(var(--cooldown-progress,0) * 1turn),rgba(247,242,226,.92) 0);
  transform:rotate(-90deg);
  opacity:.94;
}
.v1143-cd-inner{
  position:absolute;
  inset:5px;
  display:grid;
  place-items:center;
  border-radius:8px 2px 8px 2px;
  background:rgba(244,239,222,.91);
  box-shadow:inset 0 0 0 1px rgba(101,119,110,.18);
  transform:none;
}
.v1143-cd-glyph{position:absolute;top:3px;left:5px;font:800 11px/1 serif;color:#53675e;opacity:.72}
.v1143-cd-time{font-size:10px;font-weight:850;letter-spacing:-.03em;font-variant-numeric:tabular-nums;color:#33473f}
.v1143-cd-name{position:absolute;left:3px;right:3px;bottom:2px;text-align:center;font-size:6.5px;font-weight:800;color:#66766f;line-height:1}
.v1143-cd.ready{border-color:rgba(101,145,123,.66);background:rgba(225,239,225,.78)}
.v1143-cd.ready .v1143-cd-ring{background:rgba(112,151,130,.54)}
.v1143-cd.ready .v1143-cd-inner{background:rgba(239,245,230,.94)}
.v1143-cd.ready .v1143-cd-time{font-size:7px;color:#4d725f;letter-spacing:0}
.v1143-cd.cast{animation:v1143CastPulse .24s ease-out}
@keyframes v1143CastPulse{0%{transform:scale(1.12);filter:brightness(1.18)}100%{transform:scale(1);filter:none}}
@media(max-width:560px){
  #v1143Cooldowns{right:calc(env(safe-area-inset-right) + 9px);top:calc(env(safe-area-inset-top) + 48px);gap:4px}
  .v1143-cd{width:39px;height:39px;border-radius:10px 3px 10px 3px}
  .v1143-cd-inner{inset:5px}
  .v1143-cd-time{font-size:9px}
  .v1143-cd-glyph{font-size:10px;top:2px;left:4px}
  .v1143-cd-name{font-size:6px;bottom:2px}
}
`;
  document.head.appendChild(style);
}

function ensureHud(){
  const parent=$('#v1133Hud');
  if(!parent)return null;
  let hud=$('#v1143Cooldowns');
  if(!hud){
    hud=document.createElement('div');
    hud.id='v1143Cooldowns';
    hud.setAttribute('aria-label','법술 재사용 대기시간');
    parent.appendChild(hud);
  }
  return hud;
}

function activeSkills(snap){
  const skills=window.__xianxiaDebug?.constants?.SKILLS||[];
  const M=snap?.M||{};
  return skills.filter(skill=>!!(M.skillUnlocks?.[skill.id]||M.skills?.[skill.id]?.u));
}

function rebuild(hud,skills){
  hud.replaceChildren();
  for(const skill of skills){
    const item=document.createElement('div');
    item.className='v1143-cd ready';
    item.dataset.skill=skill.id;
    item.innerHTML=`<div class="v1143-cd-ring"></div><div class="v1143-cd-inner"><span class="v1143-cd-glyph">${GLYPH[skill.id]||'術'}</span><b class="v1143-cd-time">준비</b><span class="v1143-cd-name">${SHORT[skill.id]||skill.n}</span></div>`;
    hud.appendChild(item);
  }
}

function update(){
  const D=window.__xianxiaDebug;
  let snap=null;
  try{snap=D?.snapshot?.()}catch{}
  const hud=ensureHud();
  if(!hud){requestAnimationFrame(update);return}

  if(snap?.phase!=='run'||!snap.run){
    hud.style.display='none';
    signature='';observedMax={};previous={};
    requestAnimationFrame(update);return;
  }
  hud.style.display='';

  const skills=activeSkills(snap);
  const sig=skills.map(s=>s.id).join('|');
  if(sig!==signature){signature=sig;rebuild(hud,skills)}

  for(const skill of skills){
    const id=skill.id;
    const item=hud.querySelector(`[data-skill="${id}"]`);
    if(!item)continue;
    const cd=Math.max(0,+snap.run.skillCooldowns?.[id]||0);
    const prev=previous[id]||0;
    if(cd>prev+.16){
      observedMax[id]=cd;
      item.classList.remove('cast');
      void item.offsetWidth;
      item.classList.add('cast');
    }
    if(!observedMax[id]&&cd>0)observedMax[id]=cd;
    const max=Math.max(cd,observedMax[id]||skill.cd||1,.1);
    const progress=Math.max(0,Math.min(1,cd/max));
    item.style.setProperty('--cooldown-progress',String(progress));
    const time=item.querySelector('.v1143-cd-time');
    if(cd>.04){
      item.classList.remove('ready');
      time.textContent=cd>=10?Math.ceil(cd).toString():cd.toFixed(1);
    }else{
      item.classList.add('ready');
      time.textContent='준비';
    }
    previous[id]=cd;
  }
  requestAnimationFrame(update);
}

installStyle();
ensureHud();
const badge=$('#buildVersion');if(badge)badge.textContent=`BUILD ${VERSION}`;
requestAnimationFrame(update);
})();