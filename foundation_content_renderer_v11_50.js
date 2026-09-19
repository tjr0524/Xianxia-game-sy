(()=>{
'use strict';
const VERSION='11.51.10-damage-floats';
if(window.__xianxiaFoundationRenderer?.version===VERSION)return;
const W=1800,H=2400,BASE='assets/ink_v1/foundation_trial_v1/';
const areaAssets={
  foundation_trial:{bg:'background/foundation_trial_arena.png',foundation_guardian:'boss/foundation_guardian_sheet_6x4.png',portrait:'ui/foundation_guardian_portrait.png',crest:'ui/foundation_trial_warning_crest.png'},
  thunder:{charging_boar:'enemies/ink_armored_charging_boar/ink_armored_charging_boar_sheet_6x3.png',charge_lane:'enemies/ink_armored_charging_boar/charge_lane_telegraph_512x128.png',node:'regions/thunder_peak/objects/lightning_conduction_node_512.png'},
  marsh:{bg:'regions/purple_cloud_marsh/background/purple_cloud_marsh_battlefield_1024x1536.png',decor:'regions/purple_cloud_marsh/decor/purple_cloud_marsh_decor_atlas_2x2.png',ambient:'regions/purple_cloud_marsh/fx/purple_cloud_marsh_fx_atlas_2x2.png',ranged_toad:'enemies/celadon_mist_toad/celadon_mist_toad_sheet_6x3.png',projectile:'enemies/celadon_mist_toad/celadon_qi_projectile_sheet_8x1.png',projectileTarget:'enemies/celadon_mist_toad/ranged_impact_telegraph_256.png',exploding_beetle:'enemies/cracked_stone_beetle/cracked_stone_beetle_sheet_6x3.png',explosion:'enemies/cracked_stone_beetle/circular_burst_sheet_6x1.png',explosionTarget:'enemies/cracked_stone_beetle/explosion_telegraph_256.png',command_ape:'enemies/ink_command_ape/ink_command_ape_sheet_6x3.png',command:'enemies/ink_command_ape/command_buff_marker_sheet_4x1.png',shield_pangolin:'enemies/jade_scale_pangolin/jade_scale_pangolin_sheet_6x3.png',shield:'enemies/jade_scale_pangolin/ally_shield_overlay_sheet_4x1.png',shieldBreak:'fx/common/shield_break/shield_break_sheet_6x1.png'},
  taixu:{bg:'regions/taixu_ruins/background/taixu_ruins_battlefield_1024x1536.png',decor:'regions/taixu_ruins/decor/taixu_ruins_decor_atlas_2x2.png',node:'regions/taixu_ruins/objects/taixu_formation_node_512.png',sword_sentinel:'enemies/taixu_sword_sentinel/taixu_sword_sentinel_sheet_6x3.png',swordTarget:'enemies/taixu_sword_sentinel/sword_zone_telegraph_256.png',swordImpact:'enemies/taixu_sword_sentinel/sword_ground_impact_sheet_6x1.png',formation_warden:'enemies/taixu_formation_warden/taixu_formation_warden_sheet_6x3.png',formationTarget:'enemies/taixu_formation_warden/formation_target_telegraph_256.png',formationBolt:'enemies/taixu_formation_warden/formation_bolt_sheet_6x1.png',taixu_boss:'boss/taixu_formation_sovereign/taixu_formation_sovereign_sheet_6x4.png',portrait:'ui/taixu_formation_sovereign_portrait.png',movingZone:'boss/taixu_formation_sovereign/moving_formation_zone_256.png',grandFloor:'boss/taixu_formation_sovereign/grand_formation_floor_sheet_6x1.png',areaActivation:'fx/common/area_field/area_field_activation_sheet_6x1.png'}
};
const state={version:VERSION,canvas:null,ctx:null,images:{},loading:{},area:'',cache:new URL(document.currentScript?.src||location.href).searchParams.get('v')||'dev',prevFoundation:new Map(),deaths:[],damageFloats:[],lastArea:''};
window.__xianxiaFoundationRenderer=state;
function layer(){
  if(state.canvas?.isConnected)return true;const ink=document.querySelector('#v1131InkLayer'),base=document.querySelector('#cv');if(!ink&&!base)return false;
  const canvas=document.createElement('canvas');canvas.id='foundationContentLayer';canvas.setAttribute('aria-hidden','true');canvas.style.cssText='position:absolute;left:0;top:0;pointer-events:none;z-index:2;';(ink||base).insertAdjacentElement('afterend',canvas);state.canvas=canvas;state.ctx=canvas.getContext('2d',{alpha:true});return true;
}
function load(key,path){if(state.images[key]||state.loading[key])return;state.loading[key]=1;const image=new Image();image.decoding='async';image.onload=()=>{state.images[key]=image;delete state.loading[key];window.__xianxiaFrameHub?.wake?.()};image.onerror=()=>{delete state.loading[key];console.warn('[foundation-render] optional asset failed',path)};image.src=BASE+path+'?v='+encodeURIComponent(state.cache)}
function ensureArea(area){const set=areaAssets[area];if(!set)return;for(const[key,path]of Object.entries(set))load(area+':'+key,path)}
function metrics(snapshot){const game=document.querySelector('#game'),rect=game?.getBoundingClientRect?.(),cssW=Math.max(1,Math.round(rect?.width||390)),cssH=Math.max(1,Math.round(rect?.height||844)),mode=window.__xianxiaExplorationMode,active=snapshot.phase==='run'&&mode?.active&&Number.isFinite(mode.scale),worldScale=active?mode.scale:Math.max(cssW/W,cssH/H),left=active?mode.left:(cssW-W*worldScale)/2,top=active?mode.top:(cssH-H*worldScale)/2,renderScale=Math.max(.7,Math.min(window.devicePixelRatio||1,1.5,Math.sqrt(2200000/Math.max(1,cssW*cssH))));return{cssW,cssH,worldScale,left,top,renderScale}}
function resize(m){const c=state.canvas,bw=Math.max(1,Math.round(m.cssW*m.renderScale)),bh=Math.max(1,Math.round(m.cssH*m.renderScale));if(c.width!==bw||c.height!==bh){c.width=bw;c.height=bh;state.ctx.imageSmoothingEnabled=true}c.style.width=m.cssW+'px';c.style.height=m.cssH+'px';c.style.maxWidth='none';c.style.maxHeight='none'}
function image(area,key){return state.images[area+':'+key]}
function frame(img,row,cols,index,rows,x,y,height,flip=false,alpha=1){if(!img?.naturalWidth)return;const sw=img.naturalWidth/cols,sh=img.naturalHeight/rows,scale=height/sh,w=sw*scale,c=state.ctx;c.save();c.globalAlpha=alpha;c.translate(x,y);if(flip)c.scale(-1,1);c.drawImage(img,index%cols*sw,row*sh,sw,sh,-w/2,-height,w,height);c.restore()}
function centered(img,cols,index,x,y,size,alpha=1){if(!img?.naturalWidth)return;const sw=img.naturalWidth/cols,sh=img.naturalHeight,ratio=sw/sh,c=state.ctx;c.save();c.globalAlpha=alpha;c.drawImage(img,index%cols*sw,0,sw,sh,x-size*ratio/2,y-size/2,size*ratio,size);c.restore()}
function telegraphImage(area,h,t){if(h.kind==='charge_lane')return image(area,'charge_lane');if(h.kind==='projectile')return image(area,'projectileTarget');if(h.kind==='explosion')return image(area,'explosionTarget');if(h.kind==='sword_zone')return image(area,'swordTarget');if(h.kind==='formation_bolt')return image(area,'formationTarget');if(h.kind==='moving_zone')return image(area,'movingZone');return null}
function drawHazard(area,h,t){const c=state.ctx,p=h.struck?1:1-Math.max(0,h.t)/(h.ttl||1);c.save();
  if(h.kind==='charge_lane'){const x2=h.x2||h.x,y2=h.y2||h.y,angle=Math.atan2(y2-h.y,x2-h.x),length=Math.hypot(x2-h.x,y2-h.y),im=telegraphImage(area,h,t);c.translate(h.x,h.y);c.rotate(angle);c.globalAlpha=.38+.32*p;if(im?.naturalWidth)c.drawImage(im,0,-h.r,length,h.r*2);else{c.fillStyle='#d8895a80';c.fillRect(0,-h.r,length,h.r*2)}c.restore();return}
  const im=telegraphImage(area,h,t);c.globalAlpha=h.struck?.9:.35+.35*p;if(im?.naturalWidth)c.drawImage(im,h.x-h.r,h.y-h.r,h.r*2,h.r*2);else{c.fillStyle=h.kind==='explosion'?'#c85e3855':'#8172c455';c.beginPath();c.arc(h.x,h.y,h.r,0,Math.PI*2);c.fill()}c.strokeStyle=h.kind==='explosion'?'#f2a06e':'#c5c8ff';c.lineWidth=3;c.setLineDash(h.struck?[]:[10,7]);c.beginPath();c.arc(h.x,h.y,h.r*(.86+.14*p),0,Math.PI*2);c.stroke();c.restore();
  if(!h.struck&&h.fromX!=null){const fx=h.kind==='projectile'?image(area,'projectile'):image(area,'formationBolt'),x=h.fromX+(h.x-h.fromX)*p,y=h.fromY+(h.y-h.fromY)*p;centered(fx,h.kind==='projectile'?8:6,Math.floor(p*(h.kind==='projectile'?8:6)),x,y,48,.92)}
  if(h.struck){const fx=h.kind==='explosion'?image(area,'explosion'):h.kind==='sword_zone'?image(area,'swordImpact'):h.kind==='moving_zone'?image(area,'grandFloor'):null;if(fx)centered(fx,6,Math.floor(t*12)%6,h.x,h.y,h.r*2.25,.9)}
}
function drawEnvironment(area,t){
  const c=state.ctx,atlas=image(area,'decor'),ambient=image(area,'ambient'),node=image(area,'node');
  if(atlas?.naturalWidth){const positions=[[170,330,0],[1630,420,1],[220,2070,2],[1580,2140,3]];for(const[x,y,index]of positions){const sw=atlas.naturalWidth/2,sh=atlas.naturalHeight/2;c.save();c.globalAlpha=.48;c.drawImage(atlas,index%2*sw,Math.floor(index/2)*sh,sw,sh,x-100,y-100,200,200);c.restore()}}
  if(ambient?.naturalWidth){const sw=ambient.naturalWidth/2,sh=ambient.naturalHeight/2;for(let i=0;i<4;i++){const x=280+i*410,y=520+(i%2)*850;c.save();c.globalAlpha=.13+.05*Math.sin(t+i);c.drawImage(ambient,i%2*sw,Math.floor(i/2)*sh,sw,sh,x-130,y-130,260,260);c.restore()}}
  if(node?.naturalWidth){for(const[x,y]of[[330,720],[1470,760],[380,1800],[1420,1760]]){c.save();c.globalAlpha=.55;c.drawImage(node,x-52,y-72,104,104);c.restore()}}
}
function enemyHeight(e){return e.boss?(e.type==='taixu_boss'?190:176):92}
function syncFoundationDeaths(snapshot,area,now){
  const current=(snapshot.enemies||[]).filter(e=>e.visualOwner==='foundation');
  if(state.lastArea!==area){
    state.prevFoundation.clear();state.deaths.length=0;state.damageFloats.length=0;state.lastArea=area;
  }
  const seen=new Set(current.map(e=>e.id));
  for(const e of current){
    const prev=state.prevFoundation.get(e.id);
    if(prev&&Number.isFinite(prev.hp)&&e.hp<prev.hp-.05){
      state.damageFloats.push({x:e.x,y:e.y,damage:prev.hp-e.hp,start:now,boss:!!e.boss});
      if(state.damageFloats.length>24)state.damageFloats.splice(0,state.damageFloats.length-24);
    }
  }
  for(const [id,e] of state.prevFoundation){
    if(!seen.has(id))state.deaths.push({...e,start:now});
  }
  state.prevFoundation=new Map(current.map(e=>[e.id,{id:e.id,type:e.type,x:e.x,y:e.y,hp:e.hp,max:e.max,boss:!!e.boss,facing:e.facing||1,name:e.name||''}]));
  return current;
}
function drawFoundationDeaths(area,now){
  const c=state.ctx;
  for(let i=state.deaths.length-1;i>=0;i--){
    const d=state.deaths[i],age=now-d.start,duration=d.boss?.92:.72;
    if(age>=duration){state.deaths.splice(i,1);continue}
    const im=image(area,d.type);if(!im?.naturalWidth)continue;
    const rows=d.boss?4:3,row=d.boss?3:2,steps=4,step=Math.min(steps-1,Math.floor(age/duration*steps));
    const index=d.boss?2+step:step,height=enemyHeight(d),fade=age>duration*.68?1-(age-duration*.68)/(duration*.32):1;
    c.save();c.globalAlpha=.18*fade;c.fillStyle='#111';c.beginPath();c.ellipse(d.x,d.y+18,d.boss?48:27,d.boss?12:7,0,0,Math.PI*2);c.fill();c.restore();
    frame(im,row,6,index,rows,d.x,d.y+24,height,d.facing<0,Math.max(0,fade));
  }
}
function drawEnemy(area,e,t,elapsed){const im=image(area,e.type);if(!im?.naturalWidth)return;const boss=e.boss,rows=boss?4:3,row=e.action==='attack'?1:e.action==='special'?(boss?2:1):0,index=Math.floor((t*(e.action==='move'?9:6)+e.id*.7))%6,height=enemyHeight(e),c=state.ctx;
  c.save();c.globalAlpha=.25;c.fillStyle='#111';c.beginPath();c.ellipse(e.x,e.y+18,boss?48:27,boss?12:7,0,0,Math.PI*2);c.fill();c.restore();
  if(e.commandedUntil>elapsed){const marker=image('marsh','command');centered(marker,4,Math.floor(t*7)%4,e.x,e.y-height-20,42,.95)}
  if(e.shield>0){const shield=image('marsh','shield');centered(shield,4,Math.floor(t*6)%4,e.x,e.y-height*.48,boss?150:105,.76)}
  frame(im,row,6,index,rows,e.x,e.y+24,height,e.facing<0,1);
  const hp=Math.max(0,e.hp/Math.max(1,e.max)),w=boss?100:54;c.save();c.fillStyle='#071014cc';c.fillRect(e.x-w/2,e.y-height-12,w,7);c.fillStyle=boss?'#c7825a':'#aabf9a';c.fillRect(e.x-w/2+1,e.y-height-11,(w-2)*hp,5);if(e.shield>0){c.strokeStyle='#8ed7d1';c.strokeRect(e.x-w/2,e.y-height-12,w,7)}if(boss){c.font='700 13px serif';c.textAlign='center';c.fillStyle='#f4e6c2';c.fillText(e.name,e.x,e.y-height-20)}c.restore();
}
function drawFoundationDamage(now){
  const c=state.ctx;
  for(let i=state.damageFloats.length-1;i>=0;i--){
    const q=state.damageFloats[i],age=now-q.start,d=.68;
    if(age>=d){state.damageFloats.splice(i,1);continue}
    const u=age/d,fade=1-u,y=q.y-(q.boss?116:62)-u*28;
    c.save();c.globalAlpha=Math.min(1,age/.06)*fade;c.textAlign='center';c.textBaseline='middle';
    c.strokeStyle='rgba(248,241,220,.95)';c.lineWidth=q.boss?5:4;
    c.fillStyle='#8b352d';c.font='900 '+(q.boss?20:17)+'px sans-serif';
    const text='-'+Math.max(1,Math.round(q.damage));
    c.strokeText(text,q.x,y);c.fillText(text,q.x,y);c.restore();
  }
}
function applyBackground(area,m){const ink=window.__xianxiaInkRuntime?.layer,bg=image(area,'bg');if(!ink||!bg?.src)return;ink.style.backgroundImage=`linear-gradient(rgba(12,20,20,.08),rgba(8,13,16,.16)),url("${bg.src}")`;ink.style.backgroundSize=`100% 100%,${W*m.worldScale}px ${H*m.worldScale}px`;ink.style.backgroundPosition=`0 0,${m.left}px ${m.top}px`;ink.style.backgroundRepeat='no-repeat'}
function drawBossPlate(area,snapshot,m){const boss=(snapshot.enemies||[]).find(e=>e.visualOwner==='foundation'&&e.boss);if(!boss)return;const c=state.ctx,k=m.renderScale,size=56*k,x=Math.max(8,(m.cssW*.5-85))*k,y=12*k,portrait=image(area,'portrait'),crest=image(area,'crest');c.save();c.setTransform(1,0,0,1,0,0);c.fillStyle='#081311d9';c.strokeStyle='#b79b5c';c.lineWidth=1.5*k;c.beginPath();c.roundRect(x,y,170*k,64*k,9*k);c.fill();c.stroke();if(portrait?.naturalWidth)c.drawImage(portrait,x+4*k,y+4*k,size,size);if(crest?.naturalWidth){c.globalAlpha=.38;c.drawImage(crest,x+136*k,y+8*k,42*k,42*k);c.globalAlpha=1}c.fillStyle='#f4e6bf';c.font=`700 ${11*k}px serif`;c.textAlign='left';c.fillText(boss.name,x+66*k,y+23*k);c.fillStyle='#713b33';c.fillRect(x+66*k,y+33*k,96*k,8*k);c.fillStyle='#d79b70';c.fillRect(x+66*k,y+33*k,96*k*Math.max(0,boss.hp/Math.max(1,boss.max)),8*k);c.restore()}
function draw(snapshot,meta){if(!layer()||!snapshot)return;const area=snapshot.M?.area||'',supported=!!areaAssets[area],m=metrics(snapshot);resize(m);const c=state.ctx;c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,state.canvas.width,state.canvas.height);state.canvas.style.display=supported&&snapshot.phase==='run'?'block':'none';if(!supported||snapshot.phase!=='run'){state.prevFoundation.clear();state.deaths.length=0;state.damageFloats.length=0;state.lastArea=area;return}ensureArea(area);applyBackground(area,m);const k=m.renderScale;c.setTransform(k*m.worldScale,0,0,k*m.worldScale,k*m.left,k*m.top);const t=(meta?.now||performance.now())/1000;
  const foundationEnemies=syncFoundationDeaths(snapshot,area,t);
  drawEnvironment(area,t);
  for(const h of snapshot.hazards||[])if(h.visualOwner==='foundation')drawHazard(area,h,t);
  drawFoundationDeaths(area,t);
  for(const e of foundationEnemies)drawEnemy(area,e,t,snapshot.elapsed||0);
  drawFoundationDamage(t);
  drawBossPlate(area,snapshot,m);
}
const boot=()=>{if(!layer())return;const hub=window.__xianxiaFrameHub;if(!hub?.subscribe){console.error('[foundation-render] frame hub unavailable');return}hub.subscribe('foundation-content-render',draw,27);hub.wake?.()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

//# sourceURL=foundation_content_renderer_v11_50.js
