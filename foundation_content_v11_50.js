(()=>{
'use strict';

const VERSION='11.50.23-late-balance';
if(window.__xianxiaFoundationContent?.version===VERSION)return;

const TYPES=new Set(['charging_boar','ranged_toad','exploding_beetle','command_ape','shield_pangolin','sword_sentinel','formation_warden','foundation_guardian','taixu_boss']);
const BASE='assets/ink_v1/foundation_trial_v1/';
const ICON={
  shield:'assets/ink_v1/runtime/ui/formation_skills/shield_main.png',
  dash:BASE+'ui/node_icons/combat_abilities/evasive_step_256.png',
  burst:'assets/ink_v1/runtime/ui/formation_skills/burst_main.png'
};
const TYPE_SPEC={
  charging_boar:{name:'철갑돌진돈',hp:1.25,atk:.70,speed:.86,r:17,reward:1.25},
  ranged_toad:{name:'청무독섬',hp:.90,atk:.58,speed:.68,r:15,reward:1.30},
  exploding_beetle:{name:'균열석갑충',hp:1.10,atk:.62,speed:.76,r:15,reward:1.35},
  command_ape:{name:'묵령원',hp:1.50,atk:.52,speed:.72,r:18,reward:1.55},
  shield_pangolin:{name:'옥린천산갑',hp:1.40,atk:.48,speed:.70,r:18,reward:1.50},
  sword_sentinel:{name:'태허검위',hp:1.25,atk:.62,speed:.78,r:17,reward:1.60},
  formation_warden:{name:'태허진위',hp:1.15,atk:.60,speed:.74,r:17,reward:1.60},
  foundation_guardian:{name:'축기 수문장',hp:8.0,atk:.82,speed:.78,r:31,reward:7,boss:1},
  taixu_boss:{name:'태허진령',hp:12.0,atk:.90,speed:.72,r:36,reward:10,boss:1}
};
const ART={
  shield:{
    layers:[0,1,1,2,3,3],perLayer:[0,.22,.24,.20,.18,.20],regen:[0,12,11.5,11,10,9.5],
    breakSpeed:[0,0,.20,.25,.35,.40],breakDuration:[0,0,1.2,1.5,2.0,2.2]
  },
  dash:{distance:[0,80,95,105,110,120],charges:[0,1,1,1,2,2],recharge:[0,5,4.5,4,6,5]},
  burst:{duration:[0,1,1.5,2.5,3.5,5],cd:[0,70,50,36,30,24],rate:[0,6,6,6.2,6.3,6.5]}
};

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const rank=(api,id)=>clamp(Math.round(+api.state.formationSkills?.ranks?.[id]||0),0,5);
const trait=(api,system,id)=>{const tiers=api.state.formationSkills?.traits?.[system];return !!tiers&&Object.values(tiers).some(row=>row?.selected===id)};
const now=api=>api.elapsed||0;
let controls=null;

function ensureControls(){
  if(controls?.isConnected)return controls;
  const game=document.querySelector('#game');
  if(!game)return null;
  const style=document.createElement('style');
  style.id='foundation-content-style';
  style.textContent=`.foundation-arts{position:absolute;z-index:7;left:10px;right:auto;bottom:10px;display:none;gap:7px;pointer-events:auto;touch-action:none}.foundation-arts.on{display:flex}.foundation-art{position:relative;width:58px;height:58px;margin:0;padding:0;border:1px solid #8aa79a;border-radius:50%;overflow:hidden;background:#10211fd9;box-shadow:0 3px 14px #0009}.foundation-art img{width:100%;height:100%;object-fit:cover;opacity:.86}.foundation-art b{position:absolute;inset:auto 0 2px;text-align:center;font-size:8px;text-shadow:0 1px 3px #000;color:#f1f8e9}.foundation-art i{position:absolute;inset:0;display:grid;place-items:center;background:#0710149c;color:#fff;font:800 13px sans-serif;font-style:normal}.foundation-art.ready{border-color:#e6cd78;box-shadow:0 0 13px #d5b95a66}.foundation-art:disabled{opacity:.38}@media(max-width:560px){.foundation-arts{left:7px;right:auto;bottom:7px;gap:5px}.foundation-art{width:52px;height:52px}}`;
  document.head.appendChild(style);
  controls=document.createElement('div');
  controls.className='foundation-arts';
  controls.innerHTML=['dash','burst'].map(id=>`<button class="foundation-art" data-art="${id}" aria-label="${id}"><img alt="" data-src="${ICON[id]}"><b>${{dash:'축지',burst:'폭주'}[id]}</b><i></i></button>`).join('');
  for(const type of ['pointerdown','pointerup','pointercancel','touchstart','touchend'])controls.addEventListener(type,event=>event.stopPropagation(),{passive:true});
  controls.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();const id=event.target.closest('[data-art]')?.dataset.art;if(id)activateArt(id)});
  game.appendChild(controls);
  return controls;
}

function artState(api){return api.run?.foundation?.arts}
function shieldProfile(api){
  const r=rank(api,'shield');
  return {rank:r,count:ART.shield.layers[r]||0,perLayer:ART.shield.perLayer[r]||0,regen:ART.shield.regen[r]||0,breakSpeed:ART.shield.breakSpeed[r]||0,breakDuration:ART.shield.breakDuration[r]||0};
}
function shieldRegenSeconds(api){
  const p=shieldProfile(api);let seconds=p.regen;
  if(trait(api,'shield','unyield'))seconds*=1.10;
  if(trait(api,'shield','reverse'))seconds/=1.15;
  return seconds;
}
function makeShieldLayers(api){
  const p=shieldProfile(api),mul=trait(api,'shield','unyield')?1.25:1,max=api.player.max*p.perLayer*mul;
  return Array.from({length:p.count},(_,index)=>({index,hp:max,max,regen:0}));
}
function syncShieldTotals(arts){
  const layers=arts?.shieldLayers||[];
  arts.shieldHp=layers.reduce((sum,layer)=>sum+Math.max(0,layer.hp||0),0);
  arts.shieldMax=layers.reduce((sum,layer)=>sum+Math.max(0,layer.max||0),0);
  const timers=layers.filter(layer=>(layer.hp||0)<=0&&(layer.regen||0)>0).map(layer=>layer.regen);
  arts.shieldCd=timers.length?Math.min(...timers):0;
}
function ensureShieldLayers(api){
  const arts=artState(api);if(!arts)return [];
  const p=shieldProfile(api);
  if(!Array.isArray(arts.shieldLayers)||arts.shieldLayers.length!==p.count){
    arts.shieldLayers=makeShieldLayers(api);syncShieldTotals(arts);
  }
  return arts.shieldLayers;
}
function advanceOldestShieldRegen(api,seconds){
  const arts=artState(api),layers=ensureShieldLayers(api),broken=layers.filter(layer=>layer.hp<=0&&layer.regen>0).sort((a,b)=>a.regen-b.regen);
  if(!broken.length)return false;
  broken[0].regen=Math.max(0,broken[0].regen-Math.max(0,seconds||0));syncShieldTotals(arts);return true;
}
function maxDashCharges(api){
  const r=rank(api,'dash');return (ART.dash.charges[r]||0)+(trait(api,'dash','step')?1:0);
}
function dashRechargeSeconds(api){
  const r=rank(api,'dash');let seconds=ART.dash.recharge[r]||99;
  if(trait(api,'dash','flow'))seconds/=1.10;
  if(trait(api,'dash','step'))seconds*=1.25;
  if(trait(api,'dash','long'))seconds*=.85;
  if((artState(api)?.burstTime||0)>0&&trait(api,'burst','heaven'))seconds/=2.5;
  return seconds;
}
function dangerAt(api,point){
  for(const h of api.hazards||[]){
    if(h.struck||!(h.t>0))continue;
    if(h.kind==='charge_lane'&&Number.isFinite(h.x2)&&Number.isFinite(h.y2)){
      if(pointSegmentDistance(point,{x:h.x,y:h.y},{x:h.x2,y:h.y2})<(h.r||30))return true;
    }else if(dist(point,h)<(h.r||0))return true;
  }
  return false;
}
function activateArt(id){
  const api=window.__xianxiaDebug?.foundationApi?.();
  if(!api||api.phase!=='run')return;
  const arts=artState(api),r=rank(api,id);
  if(!arts||!r)return;
  if(id==='dash'&&arts.dashCharges>=1){
    let distance=ART.dash.distance[r];
    if(trait(api,'dash','flow'))distance*=1.25;
    if(trait(api,'dash','long'))distance*=1.35;
    const keepTarget=!!api.player.target||Math.hypot(api.player.tx-api.player.x,api.player.ty-api.player.y)>3;
    const oldTx=api.player.tx,oldTy=api.player.ty;
    let dx=Number.isFinite(api.player.dirX)?api.player.dirX:api.player.tx-api.player.x;
    let dy=Number.isFinite(api.player.dirY)?api.player.dirY:api.player.ty-api.player.y;
    let n=Math.hypot(dx,dy);if(n<.01){dx=1;dy=0;n=1}
    const from={x:api.player.x,y:api.player.y},wasDanger=dangerAt(api,from);
    const x=clamp(api.player.x+dx/n*distance,11,api.W-11),y=clamp(api.player.y+dy/n*distance,11,api.H-11),to={x,y};
    api.slash(api.player.x,api.player.y,x,y,'#a7efe0');api.player.x=x;api.player.y=y;
    if(keepTarget){api.player.tx=oldTx;api.player.ty=oldTy}else{api.player.tx=x;api.player.ty=y}
    arts.dashCharges--;arts.dashRecharge=Math.max(arts.dashRecharge,.01);
    if(trait(api,'dash','guard'))advanceOldestShieldRegen(api,2);
    if(trait(api,'dash','kill'))arts.dashSpellBoost=1.5;
    if(trait(api,'dash','escape')&&wasDanger&&!dangerAt(api,to)){
      arts.dashRecharge+=dashRechargeSeconds(api)*.35;
      api.pop(x,y-24,'탈진 환급','#b9f5e8',.6);
    }
    api.ring(x,y,30,'#b4f4e5',.3);
    api.trigger?.('onDash',{
      from,to,distance:Math.hypot(x-from.x,y-from.y),rank:r,
      derivedScale:trait(api,'dash','array')?1.40:1,
      icdScale:trait(api,'dash','void')?.60:1
    },{source:'dash'});
  }
  if(id==='burst'&&arts.burstCd<=0){
    let duration=ART.burst.duration[r],cooldown=ART.burst.cd[r];
    if(trait(api,'burst','peak'))duration*=.75;
    if(trait(api,'burst','cycle')){duration*=1.40;cooldown*=.85}
    if(trait(api,'burst','trueburst'))duration*=.70;
    if(trait(api,'burst','greatcycle')){duration*=1.35;cooldown*=.80}
    arts.burstTime=duration;arts.burstCd=cooldown;arts.burstKillExtend=0;arts.burstGuardExtend=0;arts.burstWarExtend=0;
    arts.trueburstTime=trait(api,'burst','trueburst')?Math.min(1.5,duration):0;
    api.ring(api.player.x,api.player.y,64,'#ffe09a',.6);api.pop(api.player.x,api.player.y-34,'진기폭주','#fff0b8',1);
    api.trigger?.('onBurstStart',{rank:r,duration,cooldown},{source:'burst'});
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

const THREAT={charging_boar:1.35,ranged_toad:1.40,exploding_beetle:1.45,command_ape:1.70,shield_pangolin:1.65,sword_sentinel:1.75,formation_warden:1.75};
const THREAT_CAP=[2.2,2.5,3.4,4.8,6.2,8.2],SPECIAL_LIMIT=[1,1,1,2,2,3];
function zoneRank(api,id,area=api?.state?.area){return clamp(Math.round(+api?.state?.zones?.[area]?.tree?.[id]||0),0,5)}
function uniqueRank(api,area=api?.state?.area){return area==='marsh'?zoneRank(api,'miasma1',area):area==='taixu'?zoneRank(api,'formation1',area):0}
function expectedHp(api){return Math.max(1,+api?.expectedPlayerHp?.()||+api?.player?.max||1)}
function ratioDamage(api,ratio){return Math.ceil(expectedHp(api)*ratio)}
function packThreatFits(api,type,options={}){
  if(options.packId==null)return true;
  const eco2=zoneRank(api,'eco2'),cap=THREAT_CAP[eco2]||THREAT_CAP[0],size=Math.max(1,+options.packSize||1);
  let raw=size;
  for(const enemy of api.enemies||[])if(enemy.packId===options.packId&&THREAT[enemy.type])raw+=(THREAT[enemy.type]-1);
  raw+=(THREAT[type]||1)-1;
  return raw<=cap+.001;
}
function packProfile(api,area,stage,options={}){
  if(options.packId==null||!api?.run?.foundation)return null;
  const store=api.run.foundation.packProfiles||(api.run.foundation.packProfiles={});
  if(store[options.packId])return store[options.packId];
  const r=uniqueRank(api,area),eco2=zoneRank(api,'eco2',area),limit=SPECIAL_LIMIT[eco2]||1,size=Math.max(1,+options.packSize||1);
  let seq=[],elite=0;
  if(area==='marsh'){
    if(r>=5&&stage>=6&&size>=5&&Math.random()<.65){seq=['exploding_beetle','command_ape','shield_pangolin'];elite=1}
    else if(r>=4&&stage>=6&&size>=4&&Math.random()<.60)seq=Math.random()<.5?['exploding_beetle','shield_pangolin']:['command_ape','shield_pangolin'];
    else if(r>=3&&stage>=5&&size>=3&&Math.random()<.62)seq=['exploding_beetle','command_ape'];
    else if(r>=2&&stage>=4&&size>=3&&Math.random()<.55)seq=['exploding_beetle','exploding_beetle'];
    else if(stage>=4&&Math.random()<.40+r*.06)seq=['exploding_beetle'];
  }else if(area==='taixu'){
    if(r>=5&&stage>=9&&size>=5&&Math.random()<.65){seq=['sword_sentinel','formation_warden','sword_sentinel'];elite=1}
    else if(r>=4&&stage>=8&&size>=4&&Math.random()<.62)seq=['sword_sentinel','formation_warden'];
    else if(r>=3&&stage>=8&&size>=3&&Math.random()<.58)seq=['sword_sentinel','formation_warden'];
    else if(stage>=7&&Math.random()<.44+r*.06)seq=['sword_sentinel'];
  }
  seq=seq.slice(0,Math.min(limit,size));
  return store[options.packId]={seq,elite};
}
function configureEnemy(enemy,type,options,api){
  const spec=TYPE_SPEC[type];if(!spec)return;
  enemy.visualOwner='foundation';enemy.name=spec.name;enemy.boss=spec.boss||0;enemy.r=spec.r;
  enemy.hp*=spec.hp;enemy.max=enemy.hp;enemy.attack*=spec.atk;enemy.speed*=spec.speed;enemy.rewardMult=spec.reward;
  enemy.action='idle';enemy.facing=1;enemy.mechanicCd=.8+Math.random()*1.4;enemy.hitOnce=0;enemy.shield=0;enemy.shieldMax=0;
  if(spec.boss){enemy.grade='elite';enemy.rare=0;enemy.packLeader=1}
}

function spawnType(area,realm,fallback,api,options={}){
  const stage=realm?.major>=1?(realm.stage||1):0,u=Math.random();
  if(area==='thunder'){
    const pool=['charging_boar'];if(stage>=2)pool.push('ranged_toad');
    const candidate=u<.62?pool[Math.floor(Math.random()*pool.length)]:fallback;
    return packThreatFits(api,candidate,options)?candidate:fallback;
  }
  if(area==='marsh'){
    const profile=packProfile(api,area,stage,options),index=Math.max(0,+options.packIndex||0);
    if(profile?.seq[index]){
      const candidate=profile.seq[index];
      if(packThreatFits(api,candidate,options)){
        if(profile.elite)options.grade=index===0?'rare':'enhanced';
        return candidate;
      }
    }
    const pool=[];if(stage>=4)pool.push('exploding_beetle');if(stage>=5)pool.push('command_ape');if(stage>=6)pool.push('shield_pangolin');
    if(!pool.length)return fallback;
    const r=uniqueRank(api,area),specialChance=Math.min(.82,.28+r*.08);
    let candidate=fallback;
    if(Math.random()<specialChance){
      if(r>=1&&stage>=4&&Math.random()<.48)candidate='exploding_beetle';
      else candidate=pool[Math.floor(Math.random()*pool.length)];
    }
    return packThreatFits(api,candidate,options)?candidate:fallback;
  }
  if(area==='taixu'){
    const profile=packProfile(api,area,stage,options),index=Math.max(0,+options.packIndex||0);
    if(profile?.seq[index]){
      const candidate=profile.seq[index];
      if(packThreatFits(api,candidate,options)){
        if(profile.elite)options.grade=index===0?'rare':'enhanced';
        return candidate;
      }
    }
    const r=uniqueRank(api,area),specialChance=Math.min(.78,.30+r*.075);
    if(Math.random()>=specialChance)return fallback;
    const candidate=stage>=8&&Math.random()<(.30+r*.06)?'formation_warden':'sword_sentinel';
    return packThreatFits(api,candidate,options)?candidate:fallback;
  }
  return fallback;
}

function spawnAt(api,type,x,y,extra={}){return api.spawn(type,{p:{x:clamp(x,70,api.W-70),y:clamp(y,70,api.H-70)},homeX:x,homeY:y,packLeader:true,grade:'normal',...extra})}
function spawnFormationNode(api,x,y,index){
  const enemy=spawnAt(api,'formation_warden',x,y,{environmentObjective:1});
  enemy.environmentObjective=1;enemy.formationNode=1;enemy.name='진법 결절';enemy.speed=0;enemy.homeX=enemy.x;enemy.homeY=enemy.y;enemy.hp*=1.65;enemy.max=enemy.hp;enemy.rewardMult*=1.20;enemy.mechanicCd=1.6+index*.45;
  return enemy;
}
function onBegin(api){
  api.run.foundation={bossKilled:0,packProfiles:{},arts:{
    shieldLayers:[],shieldHp:0,shieldMax:0,shieldCd:0,moveBuffPct:0,moveBuffUntil:0,slowImmuneUntil:0,dotReduceUntil:0,
    dashCharges:maxDashCharges(api),dashRecharge:0,dashSpellBoost:0,
    burstCd:0,burstTime:0,trueburstTime:0,burstKillExtend:0,burstGuardExtend:0,burstWarExtend:0
  },bossSpawned:0};
  const arts=artState(api);arts.shieldLayers=makeShieldLayers(api);syncShieldTotals(arts);
  if(api.state.area==='foundation_trial')spawnAt(api,'foundation_guardian',api.W*.5,api.H*.34);
  if(api.state.area==='taixu'){
    const fr=uniqueRank(api,'taixu'),stage=api.state.realm?.major===1?(api.state.realm.stage||1):0;
    if(stage>=8&&fr>=3){
      const spots=[[api.W*.27,api.H*.30],[api.W*.73,api.H*.44],[api.W*.48,api.H*.66]],count=fr>=4?3:2;
      for(let i=0;i<count;i++)spawnFormationNode(api,spots[i][0],spots[i][1],i);
    }
    if(stage>=9)spawnAt(api,'taixu_boss',api.W*.5,api.H*.32);
  }
  updateControls(api);
}

function updateRun(dt,api){
  const arts=artState(api);if(!arts)return;
  arts.burstCd=Math.max(0,arts.burstCd-dt);arts.burstTime=Math.max(0,arts.burstTime-dt);arts.trueburstTime=Math.max(0,Math.min(arts.trueburstTime||0,arts.burstTime||0)-dt);arts.dashSpellBoost=Math.max(0,arts.dashSpellBoost-dt);
  const layers=ensureShieldLayers(api);
  for(const layer of layers){
    if(layer.hp>0||!(layer.regen>0))continue;
    layer.regen=Math.max(0,layer.regen-dt);
    if(layer.regen<=0){
      layer.hp=layer.max;
      api.ring(api.player.x,api.player.y,34,'#8cd6c2',.24);
      api.pop(api.player.x,api.player.y-26,'호체 +1층','#c8fff0',.55);
    }
  }
  syncShieldTotals(arts);
  const maxCharges=maxDashCharges(api),recharge=dashRechargeSeconds(api);
  if(arts.dashCharges<maxCharges){
    arts.dashRecharge+=dt;
    while(arts.dashRecharge>=recharge&&arts.dashCharges<maxCharges){arts.dashRecharge-=recharge;arts.dashCharges++}
  }else arts.dashRecharge=0;
  let rate=1;
  if(arts.burstTime>0){
    rate=ART.burst.rate[rank(api,'burst')]||1;
    if(trait(api,'burst','peak'))rate*=1.40;
    if(trait(api,'burst','cycle'))rate*=.80;
    if(trait(api,'burst','greatcycle'))rate*=.85;
    if((arts.trueburstTime||0)>0)rate*=1.60;
  }
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
    if(enemy.chargeTime>0){enemy.chargeTime-=dt;enemy.action='attack';const speed=enemy.type==='foundation_guardian'?720:610;enemy.x=clamp(enemy.x+enemy.chargeDx*speed*dt,20,api.W-20);enemy.y=clamp(enemy.y+enemy.chargeDy*speed*dt,20,api.H-20);if(!enemy.hitOnce&&dist(enemy,api.player)<enemy.r+api.player.r+8){enemy.hitOnce=1;api.damagePlayer(ratioDamage(api,.45),enemy.type+'_charge')}if(enemy.chargeTime<=0)enemy.mechanicCd=enemy.type==='foundation_guardian'?2.2:3.2;return true}
    if(enemy.mechanicCd<=0){const dx=api.player.x-enemy.x,dy=api.player.y-enemy.y,n=Math.hypot(dx,dy)||1;enemy.chargeDx=dx/n;enemy.chargeDy=dy/n;enemy.facing=dx>=0?1:-1;enemy.chargeWindup=enemy.type==='foundation_guardian'?1.05:.82;addTargetHazard(api,'charge_lane',enemy.x,enemy.y,34,enemy.chargeWindup,0,enemy.type,{x2:enemy.x+enemy.chargeDx*460,y2:enemy.y+enemy.chargeDy*460,sourceId:enemy.id});return true}
    meleeMovement(enemy,dt,api,.30);return true;
  }
  if(enemy.type==='ranged_toad'||enemy.type==='formation_warden'){
    if(enemy.formationNode){
      enemy.x=enemy.homeX;enemy.y=enemy.homeY;enemy.facing=api.player.x>=enemy.x?1:-1;
      if(enemy.mechanicCd<=0){
        enemy.action='special';const fr=uniqueRank(api,'taixu'),count=fr>=4?2:1;
        for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,d=i?85+Math.random()*70:25+Math.random()*55;addTargetHazard(api,'moving_zone',clamp(api.player.x+Math.cos(a)*d,45,api.W-45),clamp(api.player.y+Math.sin(a)*d,45,api.H-45),58,1.35,ratioDamage(api,.18),'formation_node',{vx:Math.cos(a+1.1)*72,vy:Math.sin(a+1.1)*72})}
        enemy.mechanicCd=fr>=4?7.5:10;
      }
      return true;
    }
    rangedMovement(enemy,dt,api,enemy.type==='formation_warden'?230:205);
    if(enemy.mechanicCd<=0){enemy.action='special';const ratio=enemy.type==='formation_warden'?.18:.21;addTargetHazard(api,enemy.type==='formation_warden'?'formation_bolt':'projectile',api.player.x,api.player.y,enemy.type==='formation_warden'?34:28,.88,ratioDamage(api,ratio),enemy.type,{fromX:enemy.x,fromY:enemy.y});enemy.mechanicCd=enemy.type==='formation_warden'?2.4:2.9}return true;
  }
  if(enemy.type==='exploding_beetle'){
    if(enemy.hp/enemy.max<.28&&!enemy.detonating){
      const m=uniqueRank(api,'marsh'),overlap=m>=2&&(api.hazards||[]).some(h=>h.kind==='explosion'&&!h.struck&&h.t>0&&dist(h,enemy)<128);
      if(!overlap){enemy.detonating=1;enemy.mechanicCd=1.05;addTargetHazard(api,'explosion',enemy.x,enemy.y,78,1.05,ratioDamage(api,.45),enemy.type,{sourceId:enemy.id,friendlyFire:1})}
      else enemy.mechanicCd=Math.max(enemy.mechanicCd,.18);
    }
    if(enemy.detonating){enemy.action='special';if(enemy.mechanicCd<=0)enemy.hp=0;return true}meleeMovement(enemy,dt,api,.30);return true;
  }
  if(enemy.type==='command_ape'){
    meleeMovement(enemy,dt,api,.28);if(enemy.mechanicCd<=0){enemy.action='special';let count=0;for(const ally of api.enemies)if(ally!==enemy&&ally.hp>0&&dist(enemy,ally)<235){ally.commandedUntil=now(api)+4;count++}api.addHazard({visualOwner:'foundation',kind:'command',x:enemy.x,y:enemy.y,r:235,t:.7,ttl:.7,struck:1});api.pop(enemy.x,enemy.y-35,`호령 ${count}`,'#f0c67d',.9);enemy.mechanicCd=5.2}return true;
  }
  if(enemy.type==='shield_pangolin'){
    meleeMovement(enemy,dt,api,.26);if(enemy.mechanicCd<=0){enemy.action='special';for(const ally of api.enemies)if(ally.hp>0&&dist(enemy,ally)<220){ally.shield=Math.max(ally.shield||0,ally.max*.30);ally.shieldMax=Math.max(ally.shieldMax||0,ally.shield)}api.addHazard({visualOwner:'foundation',kind:'shield_cast',x:enemy.x,y:enemy.y,r:220,t:.65,ttl:.65,struck:1});enemy.mechanicCd=5.5}return true;
  }
  if(enemy.type==='sword_sentinel'){
    meleeMovement(enemy,dt,api,.32);if(enemy.mechanicCd<=0){
      enemy.action='special';const fr=uniqueRank(api,'taixu'),a=Math.random()*Math.PI*2,d=fr>=2?Math.random()*52:0;
      const x=clamp(api.player.x+Math.cos(a)*d,45,api.W-45),y=clamp(api.player.y+Math.sin(a)*d,45,api.H-45),r=fr>=2?44+Math.random()*12:48,warn=fr>=2?.72+Math.random()*.38:.92;
      addTargetHazard(api,'sword_zone',x,y,r,warn,ratioDamage(api,.27),enemy.type);enemy.mechanicCd=fr>=2?2.7:3.0;
    }return true;
  }
  if(enemy.type==='taixu_boss'){
    rangedMovement(enemy,dt,api,245);if(enemy.mechanicCd<=0){
      enemy.action='special';const fr=uniqueRank(api,'taixu'),a=Math.random()*Math.PI*2;
      addTargetHazard(api,'moving_zone',api.player.x+Math.cos(a)*90,api.player.y+Math.sin(a)*90,72,.95,ratioDamage(api,.66),enemy.type,{vx:Math.cos(a+Math.PI*.55)*95,vy:Math.sin(a+Math.PI*.55)*95});
      if(fr>=5){const b=a+Math.PI*.72;addTargetHazard(api,'moving_zone',clamp(api.player.x+Math.cos(b)*145,50,api.W-50),clamp(api.player.y+Math.sin(b)*145,50,api.H-50),58,1.35,ratioDamage(api,.18),enemy.type,{vx:Math.cos(b+1.2)*80,vy:Math.sin(b+1.2)*80})}
      enemy.mechanicCd=8.0;
    }return true;
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
      if(dist(api.player,h)<h.r)api.damagePlayer(h.damage||35,`${h.source||'hazard'}:${h.kind}`);
      if(h.friendlyFire)for(const enemy of api.enemies)if(enemy.id!==h.sourceId&&enemy.hp>0&&dist(enemy,h)<h.r)api.damageEnemy(enemy,(h.damage||35)*1.2,'friendly_explosion');
      api.ring(h.x,h.y,h.r,h.kind==='explosion'?'#f4a06b':'#b9c4ff',.32);
    }
  }
}

function modifyEnemyDamage(enemy,amount){
  if(!enemy?.shield)return amount;
  const blocked=Math.min(enemy.shield,amount);enemy.shield-=blocked;return amount-blocked;
}
function applyShieldBreakEffects(api,arts,brokenLayers,preBroken,blocked,source){
  if(!brokenLayers.length)return;
  const p=shieldProfile(api),t=now(api);
  let speed=p.breakSpeed,duration=p.breakDuration;
  if(trait(api,'shield','cloud')){speed+=.15;duration+=.5}
  if(trait(api,'shield','glide')){speed+=.35;duration=Math.max(duration,2.5);arts.dashRecharge+=1.0}
  if(speed>0){arts.moveBuffPct=speed;arts.moveBuffUntil=t+duration}
  if(trait(api,'shield','shadow')){arts.slowImmuneUntil=t+1.2;arts.dotReduceUntil=t+1.2}
  if(trait(api,'shield','reflux'))for(const id of Object.keys(api.run.skillCooldowns||{}))api.run.skillCooldowns[id]*=.92;
  if(trait(api,'shield','reverse'))for(const id of Object.keys(api.run.skillCooldowns||{}))api.run.skillCooldowns[id]*=.88;
  if(trait(api,'shield','renew'))for(const layer of preBroken)layer.regen=Math.max(0,(layer.regen||0)-1.5);
  if(trait(api,'shield','mana')){
    const rows=Object.entries(api.run.skillCooldowns||{}),longest=rows.reduce((best,row)=>row[1]>(best?.[1]||-1)?row:best,null);
    for(const [id,value] of rows)api.run.skillCooldowns[id]=Math.max(0,value*(longest&&id===longest[0]?.75:.92));
  }
  syncShieldTotals(arts);
  api.pop(api.player.x,api.player.y-28,brokenLayers.length>1?`호체 ${brokenLayers.length}층 파괴`:'호체 파괴','#a5e6d7',.8);
  api.trigger?.('onShieldBreak',{rank:p.rank,layersBroken:brokenLayers.length,blocked,damageSource:source,regen:brokenLayers.map(layer=>layer.regen)},{source:'shield'});
}
function modifyPlayerDamage(amount,source,api){
  const arts=artState(api);if(!arts)return amount;
  if((arts.dotReduceUntil||0)>now(api)&&/(dot|zone|field|poison|burn|bleed)/i.test(String(source||'')))amount*=.75;
  const layers=ensureShieldLayers(api);if(!layers.length)return amount;
  let remaining=Math.max(0,amount),blocked=0,brokenCount=0;
  const preBroken=layers.filter(layer=>layer.hp<=0&&layer.regen>0),newlyBroken=[];
  for(const layer of layers){
    if(remaining<=0)break;
    if(layer.hp<=0)continue;
    const efficiency=trait(api,'shield','diamond')&&brokenCount>=1?1.20:1;
    const capacity=layer.hp*efficiency;
    if(remaining>=capacity-1e-9){
      remaining-=capacity;blocked+=capacity;layer.hp=0;layer.regen=shieldRegenSeconds(api);newlyBroken.push(layer);brokenCount++;
    }else{
      layer.hp=Math.max(0,layer.hp-remaining/efficiency);blocked+=remaining;remaining=0;
    }
  }
  syncShieldTotals(arts);
  if(newlyBroken.length)applyShieldBreakEffects(api,arts,newlyBroken,preBroken,blocked,source);
  return remaining;
}
function playerSpeedMultiplier(api){
  const arts=artState(api);if(!arts)return 1;
  return (arts.moveBuffUntil||0)>now(api)?1+Math.max(0,arts.moveBuffPct||0):1;
}
function onTrigger(event,payload,ctx,api){
  const arts=artState(api);if(!arts)return;
  if(event==='onBurstStart'&&trait(api,'burst','spell')){
    for(const id of ['sword','wave','chain','thunder','array']){
      if((api.run.skillCooldowns?.[id]||0)>0)continue;
      api.castSpell?.(id,{powerScale:.60,triggered:true,source:`burst:spell:${id}`,triggerMeta:ctx.child({originTrait:'burst:spell',source:`burst:spell:${id}`})});
    }
  }
  if(event==='onShieldBreak'&&arts.burstTime>0&&trait(api,'burst','guard')&&arts.burstGuardExtend<1.2){
    const add=Math.min(.4,1.2-arts.burstGuardExtend);arts.burstTime+=add;arts.burstGuardExtend+=add;
  }
  if(event==='onKill'){
    const special=!!payload?.special;
    if(special&&trait(api,'dash','reflux')&&arts.dashCharges<maxDashCharges(api))arts.dashRecharge+=1.5;
    if(special&&trait(api,'burst','kill')){
      arts.burstCd=Math.max(0,arts.burstCd-2);
      if(arts.burstTime>0){arts.burstTime+=.3;arts.burstKillExtend+=.3}
    }
    if(arts.burstTime>0&&trait(api,'burst','warvein')){
      let add=0;if(special)add=.5;else if(Math.random()<.20)add=.25;
      if(add&&arts.burstWarExtend<4){add=Math.min(add,4-arts.burstWarExtend);arts.burstTime+=add;arts.burstWarExtend+=add}
    }
  }
}
function beforeEnemyDeath(enemy,api){if(enemy.boss)api.run.foundation.bossKilled=1}
function rewardEnemy(enemy,api){
  if(!TYPES.has(enemy.type))return false;
  const amount=Math.ceil(90*(enemy.rewardMult||1)*(api.planRewardMultiplier?.()||1)*(api.areaRewardMultiplier?.()||1));api.gainStone(amount,enemy.x,enemy.y);
  if(enemy.boss){api.run.elite=1;api.gainHerb(enemy.type==='taixu_boss'?5:3,2,enemy.x+12,enemy.y);api.pop(enemy.x,enemy.y-42,`${enemy.name} 격파`,'#ffe4a0',1.25)}
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
  onBegin,updateRun,updateEnemy,updateHazards,modifyEnemyDamage,modifyPlayerDamage,playerSpeedMultiplier,onTrigger,beforeEnemyDeath,rewardEnemy,onFinish,snapshotEnemy
};
})();

//# sourceURL=foundation_content_v11_50.js
