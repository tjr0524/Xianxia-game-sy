(()=>{
'use strict';

const VERSION='11.50.1';
if(window.__xianxiaFoundationContent?.version===VERSION)return;

const TYPES=new Set(['charging_boar','ranged_toad','exploding_beetle','command_ape','shield_pangolin','sword_sentinel','formation_warden','foundation_guardian','taixu_boss']);
const BASE='assets/ink_v1/foundation_trial_v1/';
const ICON={
  shield:'assets/ink_v1/runtime/ui/formation_skills/shield_main.png',
  dash:BASE+'ui/node_icons/combat_abilities/evasive_step_256.png',
  burst:'assets/ink_v1/runtime/ui/formation_skills/burst_main.png'
};
const TYPE_SPEC={
  charging_boar:{name:'철갑돌진돈',hp:1.25,atk:.70,speed:.86,r:17,reward:1.15},
  ranged_toad:{name:'청무독섬',hp:.90,atk:.58,speed:.68,r:15,reward:1.05},
  exploding_beetle:{name:'균열석갑충',hp:1.10,atk:.62,speed:.76,r:15,reward:1.10},
  command_ape:{name:'묵령원',hp:1.50,atk:.52,speed:.72,r:18,reward:1.35},
  shield_pangolin:{name:'옥린천산갑',hp:1.40,atk:.48,speed:.70,r:18,reward:1.30},
  sword_sentinel:{name:'태허검위',hp:1.25,atk:.62,speed:.78,r:17,reward:1.20},
  formation_warden:{name:'태허진위',hp:1.15,atk:.60,speed:.74,r:17,reward:1.20},
  foundation_guardian:{name:'축기 수문장',hp:8.0,atk:.82,speed:.78,r:31,reward:7,boss:1},
  taixu_boss:{name:'태허진령',hp:12.0,atk:.90,speed:.72,r:36,reward:10,boss:1}
};
const ART={
  shield:{hp:[0,.22,.24,.40,.54,.60],cd:[0,12,11.5,11,10,9.5]},
  dash:{distance:[0,80,95,105,110,120],charges:[0,1,1,1,2,2],recharge:[0,5,4.5,4,6,5]},
  burst:{duration:[0,1,1.5,2.5,3.5,5],cd:[0,70,50,36,30,24],rate:[0,6,6,6.2,6.3,6.5]}
};

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const rank=(api,id)=>clamp(Math.round(+api.state.formationSkills?.ranks?.[id]||0),0,5);
const trait=(api,system,id)=>Object.values(api.state.formationSkills?.traits||{}).includes?.(`${system}:${id}`)||Object.values(api.state.formationSkills?.traits||{}).includes?.(id);
const now=api=>api.elapsed||0;
let controls=null;

function ensureControls(){
  if(controls?.isConnected)return controls;
  const game=document.querySelector('#game');
  if(!game)return null;
  const style=document.createElement('style');
  style.id='foundation-content-style';
  style.textContent=`.foundation-arts{position:absolute;z-index:7;left:10px;right:auto;bottom:10px;display:none;gap:7px;pointer-events:auto}.foundation-arts.on{display:flex}.foundation-art{position:relative;width:58px;height:58px;margin:0;padding:0;border:1px solid #8aa79a;border-radius:50%;overflow:hidden;background:#10211fd9;box-shadow:0 3px 14px #0009}.foundation-art img{width:100%;height:100%;object-fit:cover;opacity:.86}.foundation-art b{position:absolute;inset:auto 0 2px;text-align:center;font-size:8px;text-shadow:0 1px 3px #000;color:#f1f8e9}.foundation-art i{position:absolute;inset:0;display:grid;place-items:center;background:#0710149c;color:#fff;font:800 13px sans-serif;font-style:normal}.foundation-art.ready{border-color:#e6cd78;box-shadow:0 0 13px #d5b95a66}.foundation-art:disabled{opacity:.38}@media(max-width:560px){.foundation-arts{left:7px;right:auto;bottom:7px;gap:5px}.foundation-art{width:52px;height:52px}}`;
  document.head.appendChild(style);
  controls=document.createElement('div');
  controls.className='foundation-arts';
  controls.innerHTML=['shield','dash','burst'].map(id=>`<button class="foundation-art" data-art="${id}" aria-label="${id}"><img alt="" data-src="${ICON[id]}"><b>${{shield:'호체',dash:'축지',burst:'폭주'}[id]}</b><i></i></button>`).join('');
  controls.addEventListener('pointerdown',event=>event.stopPropagation());
  controls.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();const id=event.target.closest('[data-art]')?.dataset.art;if(id)activateArt(id)});
  game.appendChild(controls);
  return controls;
}

function artState(api){return api.run?.foundation?.arts}
function activateArt(id){
  const api=window.__xianxiaDebug?.foundationApi?.();
  if(!api||api.phase!=='run')return;
  const arts=artState(api),r=rank(api,id);
  if(!arts||!r)return;
  if(id==='shield'&&arts.shieldCd<=0){
    let hp=api.player.max*ART.shield.hp[r];
    if(trait(api,'shield','unyield'))hp*=1.25;
    arts.shieldHp=hp;arts.shieldMax=hp;arts.shieldCd=ART.shield.cd[r];
    api.ring(api.player.x,api.player.y,38,'#8cd6c2',.45);api.pop(api.player.x,api.player.y-30,'호체막','#c8fff0',.8);
  }
  if(id==='dash'&&arts.dashCharges>=1){
    let distance=ART.dash.distance[r];
    if(trait(api,'dash','flow'))distance*=1.25;if(trait(api,'dash','long'))distance*=1.35;
    let dx=api.player.tx-api.player.x,dy=api.player.ty-api.player.y,n=Math.hypot(dx,dy);
    if(n<2){dx=1;dy=0;n=1}
    const x=clamp(api.player.x+dx/n*distance,11,api.W-11),y=clamp(api.player.y+dy/n*distance,11,api.H-11);
    api.slash(api.player.x,api.player.y,x,y,'#a7efe0');api.player.x=api.player.tx=x;api.player.y=api.player.ty=y;
    arts.dashCharges--;arts.dashRecharge=Math.max(arts.dashRecharge,.01);
    if(trait(api,'dash','guard'))arts.shieldCd=Math.max(0,arts.shieldCd-2);
    if(trait(api,'dash','kill'))arts.dashSpellBoost=1.5;
    api.ring(x,y,30,'#b4f4e5',.3);
  }
  if(id==='burst'&&arts.burstCd<=0){
    let duration=ART.burst.duration[r],cooldown=ART.burst.cd[r];
    if(trait(api,'burst','peak'))duration*=.75;
    if(trait(api,'burst','cycle')){duration*=1.4;cooldown*=.85}
    arts.burstTime=duration;arts.burstCd=cooldown;
    api.ring(api.player.x,api.player.y,64,'#ffe09a',.6);api.pop(api.player.x,api.player.y-34,'진기폭주','#fff0b8',1);
  }
  updateControls(api);
}

function updateControls(api){
  const root=ensureControls();if(!root)return;
  const active=api.phase==='run'&&api.state.realm?.major>=1;
  root.classList.toggle('on',active);if(!active)return;
  const arts=artState(api);
  root.querySelectorAll('[data-art]').forEach(button=>{
    const id=button.dataset.art,r=rank(api,id),img=button.querySelector('img'),cover=button.querySelector('i');
    if(r&&img&&!img.src)img.src=img.dataset.src;
    let value=0,label='';
    if(id==='shield'){value=arts?.shieldCd||0;label=arts?.shieldHp>0?`${Math.ceil(arts.shieldHp)}`:value>0?value.toFixed(1):''}
    if(id==='dash'){value=(arts?.dashCharges||0)>0?0:arts?.dashRecharge||0;label=(arts?.dashCharges||0)>0?`${arts.dashCharges}`:value.toFixed(1)}
    if(id==='burst'){value=arts?.burstCd||0;label=arts?.burstTime>0?'ON':value>0?value.toFixed(1):''}
    button.disabled=!r;button.classList.toggle('ready',!!r&&!value);cover.textContent=label;
  });
}

function configureEnemy(enemy,type,options,api){
  const spec=TYPE_SPEC[type];if(!spec)return;
  enemy.visualOwner='foundation';enemy.name=spec.name;enemy.boss=spec.boss||0;enemy.r=spec.r;
  enemy.hp*=spec.hp;enemy.max=enemy.hp;enemy.attack*=spec.atk;enemy.speed*=spec.speed;enemy.rewardMult=spec.reward;
  enemy.action='idle';enemy.facing=1;enemy.mechanicCd=.8+Math.random()*1.4;enemy.hitOnce=0;enemy.shield=0;enemy.shieldMax=0;
  if(spec.boss){enemy.grade='elite';enemy.rare=0;enemy.packLeader=1}
}

function spawnType(area,realm,fallback){
  const stage=realm?.major>=1?(realm.stage||1):0,u=Math.random();
  if(area==='thunder')return u<.62?'charging_boar':fallback;
  if(area==='marsh'){
    const pool=['ranged_toad'];if(stage>=4)pool.push('exploding_beetle');if(stage>=5)pool.push('command_ape');if(stage>=6)pool.push('shield_pangolin');
    return u<.82?pool[Math.floor(Math.random()*pool.length)]:fallback;
  }
  if(area==='taixu')return u<.82?(stage>=8&&Math.random()<.48?'formation_warden':'sword_sentinel'):fallback;
  return fallback;
}

function spawnAt(api,type,x,y){return api.spawn(type,{p:{x:clamp(x,70,api.W-70),y:clamp(y,70,api.H-70)},homeX:x,homeY:y,packLeader:true,grade:'normal'})}
function onBegin(api){
  api.run.foundation={bossKilled:0,arts:{shieldHp:0,shieldMax:0,shieldCd:0,dashCharges:ART.dash.charges[rank(api,'dash')]||0,dashRecharge:0,burstCd:0,burstTime:0,dashSpellBoost:0},bossSpawned:0};
  if(api.state.area==='foundation_trial')spawnAt(api,'foundation_guardian',api.W*.5,api.H*.34);
  if(api.state.area==='taixu'&&api.state.realm?.major===1&&api.state.realm.stage>=9)spawnAt(api,'taixu_boss',api.W*.5,api.H*.32);
  updateControls(api);
}

function updateRun(dt,api){
  const arts=artState(api);if(!arts)return;
  arts.shieldCd=Math.max(0,arts.shieldCd-dt);arts.burstCd=Math.max(0,arts.burstCd-dt);arts.burstTime=Math.max(0,arts.burstTime-dt);arts.dashSpellBoost=Math.max(0,arts.dashSpellBoost-dt);
  const dr=rank(api,'dash'),maxCharges=(ART.dash.charges[dr]||0)+(trait(api,'dash','step')?1:0);
  let recharge=ART.dash.recharge[dr]||99;if(trait(api,'dash','flow'))recharge*=1.10;if(trait(api,'dash','long'))recharge*=.85;if(arts.burstTime>0&&trait(api,'burst','heaven'))recharge/=2.5;
  if(arts.dashCharges<maxCharges){arts.dashRecharge+=dt;if(arts.dashRecharge>=recharge){arts.dashRecharge=0;arts.dashCharges++}}else arts.dashRecharge=0;
  let rate=1;if(arts.burstTime>0){rate=ART.burst.rate[rank(api,'burst')]||1;if(trait(api,'burst','peak'))rate*=1.4;if(trait(api,'burst','cycle'))rate*=.8}
  if(arts.dashSpellBoost>0)rate*=1.35;
  if(rate>1)for(const id of Object.keys(api.run.skillCooldowns||{}))api.run.skillCooldowns[id]=Math.max(0,api.run.skillCooldowns[id]-dt*(rate-1));
  updateControls(api);
}

function pointSegmentDistance(p,a,b){const vx=b.x-a.x,vy=b.y-a.y,wx=p.x-a.x,wy=p.y-a.y,l=vx*vx+vy*vy,t=l?clamp((wx*vx+wy*vy)/l,0,1):0;return Math.hypot(p.x-(a.x+vx*t),p.y-(a.y+vy*t))}
function addTargetHazard(api,kind,x,y,r,t,damage,source,extra={}){api.addHazard({visualOwner:'foundation',kind,x,y,r,t,ttl:t,struck:0,damage,source,...extra})}

function rangedMovement(enemy,dt,api,ideal=190){
  const p=api.player,d=dist(enemy,p);enemy.facing=p.x>=enemy.x?1:-1;
  if(d<ideal-35){const dx=enemy.x-p.x,dy=enemy.y-p.y,n=Math.hypot(dx,dy)||1;enemy.x=clamp(enemy.x+dx/n*enemy.speed*dt,20,api.W-20);enemy.y=clamp(enemy.y+dy/n*enemy.speed*dt,20,api.H-20)}
  else if(d>ideal+55)api.moveToward(enemy,p.x,p.y,enemy.speed*.72,dt);
}
function meleeMovement(enemy,dt,api,mult=.35){
  const p=api.player,d=dist(enemy,p),boost=enemy.commandedUntil>now(api)?1.22:1;enemy.facing=p.x>=enemy.x?1:-1;
  if(d>p.r+enemy.r+4)api.moveToward(enemy,p.x,p.y,enemy.speed*boost,dt);
  else if(enemy.cd<=0){api.damagePlayer(Math.ceil(enemy.attack*mult*(enemy.commandedUntil>now(api)?1.18:1)),enemy.type);enemy.cd=enemy.attackPeriod+1;api.ring(p.x,p.y,p.r+8,'#c96d62',.18)}
}

function updateEnemy(enemy,dt,api){
  if(!TYPES.has(enemy.type))return false;
  enemy.mechanicCd-=dt;enemy.action='move';
  if(enemy.type==='charging_boar'||enemy.type==='foundation_guardian'){
    if(enemy.chargeWindup>0){enemy.chargeWindup-=dt;enemy.action='special';if(enemy.chargeWindup<=0){enemy.chargeTime=enemy.type==='foundation_guardian'?.58:.42;enemy.hitOnce=0}return true}
    if(enemy.chargeTime>0){enemy.chargeTime-=dt;enemy.action='attack';const speed=enemy.type==='foundation_guardian'?720:610;enemy.x=clamp(enemy.x+enemy.chargeDx*speed*dt,20,api.W-20);enemy.y=clamp(enemy.y+enemy.chargeDy*speed*dt,20,api.H-20);if(!enemy.hitOnce&&dist(enemy,api.player)<enemy.r+api.player.r+8){enemy.hitOnce=1;api.damagePlayer(Math.ceil(enemy.attack*.62),enemy.type+'_charge')}if(enemy.chargeTime<=0)enemy.mechanicCd=enemy.type==='foundation_guardian'?2.2:3.2;return true}
    if(enemy.mechanicCd<=0){const dx=api.player.x-enemy.x,dy=api.player.y-enemy.y,n=Math.hypot(dx,dy)||1;enemy.chargeDx=dx/n;enemy.chargeDy=dy/n;enemy.facing=dx>=0?1:-1;enemy.chargeWindup=enemy.type==='foundation_guardian'?1.05:.82;addTargetHazard(api,'charge_lane',enemy.x,enemy.y,34,enemy.chargeWindup,0,enemy.type,{x2:enemy.x+enemy.chargeDx*460,y2:enemy.y+enemy.chargeDy*460,sourceId:enemy.id});return true}
    meleeMovement(enemy,dt,api,.30);return true;
  }
  if(enemy.type==='ranged_toad'||enemy.type==='formation_warden'){
    rangedMovement(enemy,dt,api,enemy.type==='formation_warden'?230:205);
    if(enemy.mechanicCd<=0){enemy.action='special';addTargetHazard(api,enemy.type==='formation_warden'?'formation_bolt':'projectile',api.player.x,api.player.y,enemy.type==='formation_warden'?34:28,.88,Math.ceil(enemy.attack*.62),enemy.type,{fromX:enemy.x,fromY:enemy.y});enemy.mechanicCd=enemy.type==='formation_warden'?2.4:2.9}return true;
  }
  if(enemy.type==='exploding_beetle'){
    if(enemy.hp/enemy.max<.28&&!enemy.detonating){enemy.detonating=1;enemy.mechanicCd=1.05;addTargetHazard(api,'explosion',enemy.x,enemy.y,78,1.05,Math.ceil(enemy.attack*.75),enemy.type,{sourceId:enemy.id,friendlyFire:1})}
    if(enemy.detonating){enemy.action='special';if(enemy.mechanicCd<=0)enemy.hp=0;return true}meleeMovement(enemy,dt,api,.30);return true;
  }
  if(enemy.type==='command_ape'){
    meleeMovement(enemy,dt,api,.28);if(enemy.mechanicCd<=0){enemy.action='special';let count=0;for(const ally of api.enemies)if(ally!==enemy&&ally.hp>0&&dist(enemy,ally)<235){ally.commandedUntil=now(api)+4;count++}api.addHazard({visualOwner:'foundation',kind:'command',x:enemy.x,y:enemy.y,r:235,t:.7,ttl:.7,struck:1});api.pop(enemy.x,enemy.y-35,`호령 ${count}`,'#f0c67d',.9);enemy.mechanicCd=5.2}return true;
  }
  if(enemy.type==='shield_pangolin'){
    meleeMovement(enemy,dt,api,.26);if(enemy.mechanicCd<=0){enemy.action='special';for(const ally of api.enemies)if(ally.hp>0&&dist(enemy,ally)<220){ally.shield=Math.max(ally.shield||0,ally.max*.30);ally.shieldMax=Math.max(ally.shieldMax||0,ally.shield)}api.addHazard({visualOwner:'foundation',kind:'shield_cast',x:enemy.x,y:enemy.y,r:220,t:.65,ttl:.65,struck:1});enemy.mechanicCd=5.5}return true;
  }
  if(enemy.type==='sword_sentinel'){
    meleeMovement(enemy,dt,api,.32);if(enemy.mechanicCd<=0){enemy.action='special';addTargetHazard(api,'sword_zone',api.player.x,api.player.y,48,.92,Math.ceil(enemy.attack*.70),enemy.type);enemy.mechanicCd=3.0}return true;
  }
  if(enemy.type==='taixu_boss'){
    rangedMovement(enemy,dt,api,245);if(enemy.mechanicCd<=0){enemy.action='special';const a=Math.random()*Math.PI*2;addTargetHazard(api,'moving_zone',api.player.x+Math.cos(a)*90,api.player.y+Math.sin(a)*90,72,1.15,Math.ceil(enemy.attack*.68),enemy.type,{vx:Math.cos(a+Math.PI*.55)*95,vy:Math.sin(a+Math.PI*.55)*95});enemy.mechanicCd=1.8}return true;
  }
  return true;
}

function updateHazards(dt,api){
  for(const h of api.hazards){
    if(h.visualOwner!=='foundation')continue;
    if(h.kind==='moving_zone'&&!h.struck){h.x=clamp(h.x+(h.vx||0)*dt,30,api.W-30);h.y=clamp(h.y+(h.vy||0)*dt,30,api.H-30)}
    h.t-=dt;
    if(h.t>0||h.struck)continue;
    h.struck=1;h.t=.24;h.ttl=.24;
    if(h.kind==='charge_lane')continue;
    if(['projectile','formation_bolt','sword_zone','moving_zone','explosion'].includes(h.kind)){
      if(dist(api.player,h)<h.r)api.damagePlayer(h.damage||35,h.source||h.kind);
      if(h.friendlyFire)for(const enemy of api.enemies)if(enemy.id!==h.sourceId&&enemy.hp>0&&dist(enemy,h)<h.r)api.damageEnemy(enemy,(h.damage||35)*1.2,'friendly_explosion');
      api.ring(h.x,h.y,h.r,h.kind==='explosion'?'#f4a06b':'#b9c4ff',.32);
    }
  }
}

function modifyEnemyDamage(enemy,amount){
  if(!enemy?.shield)return amount;
  const blocked=Math.min(enemy.shield,amount);enemy.shield-=blocked;return amount-blocked;
}
function modifyPlayerDamage(amount,source,api){
  const arts=artState(api);if(!arts?.shieldHp)return amount;
  const blocked=Math.min(arts.shieldHp,amount);arts.shieldHp-=blocked;
  if(arts.shieldHp<=0){arts.shieldHp=0;api.pop(api.player.x,api.player.y-28,'호체 파괴','#a5e6d7',.8);if(trait(api,'shield','reflux'))for(const id of Object.keys(api.run.skillCooldowns||{}))api.run.skillCooldowns[id]*=.92;if(trait(api,'shield','reverse'))for(const id of Object.keys(api.run.skillCooldowns||{}))api.run.skillCooldowns[id]*=.88}
  return amount-blocked;
}
function beforeEnemyDeath(enemy,api){if(enemy.boss)api.run.foundation.bossKilled=1}
function rewardEnemy(enemy,api){
  if(!TYPES.has(enemy.type))return false;
  const amount=Math.ceil(90*(enemy.rewardMult||1));api.gainStone(amount,enemy.x,enemy.y);
  if(enemy.boss){api.run.elite=1;api.gainHerb(enemy.type==='taixu_boss'?5:3,2,enemy.x+12,enemy.y);api.pop(enemy.x,enemy.y-42,`${enemy.name} 격파`,'#ffe4a0',1.25)}
  const arts=artState(api);if(arts&&trait(api,'burst','kill')&&enemy.boss)arts.burstCd=Math.max(0,arts.burstCd-2);
  return true;
}
function onFinish(reason,api){
  if(controls)controls.classList.remove('on');
  if(reason==='return'&&api.state.area==='foundation_trial'&&api.run?.foundation?.bossKilled&&!api.state.events.foundationInsight){api.state.events.foundationInsight=1;api.save();return '<div class="event"><b>시련 완수 · 축기의 실마리</b><br>수문장을 넘어 축기의 문을 열었습니다.</div>'}
  return '';
}
function snapshotEnemy(enemy){return{chargeWindup:enemy.chargeWindup||0,chargeTime:enemy.chargeTime||0,mechanicCd:enemy.mechanicCd||0,detonating:enemy.detonating||0}}

window.__xianxiaFoundationContent={
  version:VERSION,base:BASE,isCombatType:type=>TYPES.has(type),configureEnemy,spawnType,
  bossOnly:area=>area==='foundation_trial',runLimit:(area,realm)=>area==='foundation_trial'||(area==='taixu'&&realm?.major===1&&realm.stage>=9)?60:['thunder','marsh','taixu'].includes(area)?35:25,
  onBegin,updateRun,updateEnemy,updateHazards,modifyEnemyDamage,modifyPlayerDamage,beforeEnemyDeath,rewardEnemy,onFinish,snapshotEnemy
};
})();

//# sourceURL=foundation_content_v11_50.js
