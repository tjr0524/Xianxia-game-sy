'use strict';
const fs=require('fs');
const path=require('path');
const root=process.argv[2]||'.';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

const index=read('index.html');
const hub=read('runtime_frame_hub_v11_47.js');
const game=read('game_runtime_v11_45.js');
const ink=read('ink_runtime_world_v11_45.js');
const extras=read('progression_extras_runtime_v11_45.js');
const theme=read('canvas_theme_v11_26.js');
const explore=read('exploration_runtime_v11_45.js');
const world=read('exploration_world_v11_33_4.js');
const feedback=read('ui_feedback_v11_40.js');
const cooldown=read('combat_cooldown_hud_v11_43.js');
const resultFlow=read('result_flow_v11_41.js');
const visual=read('visual_v11_25.js');
const tutorial=read('tutorial_runtime_v11_49.js');
const mobileUi=read('systems_v11_22.js');

if(/sprite_runtime_v11_(?:28|29|30)\.js/.test(mobileUi))
  throw new Error('mobile UI loads a retired sprite renderer with its own hidden RAF');

const hubPos=index.indexOf('runtime_frame_hub_v11_47.js');
const gamePos=index.indexOf('game_runtime_v11_45.js');
const tutorialPos=index.indexOf('tutorial_runtime_v11_49.js');
const explorePos=index.indexOf('exploration_runtime_v11_45.js');
if(!(hubPos>=0&&gamePos>hubPos&&tutorialPos>gamePos&&explorePos>tutorialPos))
  throw new Error('frame hub/game/tutorial load order is invalid');

if((hub.match(/requestAnimationFrame\s*\(frame\)/g)||[]).length!==1)
  throw new Error('frame hub must own exactly one active continuous RAF');
if(!hub.includes("const ACTIVE_FPS=60")||!hub.includes("const IDLE_FPS=0"))
  throw new Error('active/idle frame pacing is invalid');
if(!hub.includes("idleEventDriven:IDLE_FPS===0"))
  throw new Error('idle event-driven mode is missing');
if(!hub.includes("document.addEventListener('visibilitychange'"))
  throw new Error('hidden-tab frame suspension is missing');
if(!hub.includes("D.frameSnapshot"))
  throw new Error('frame hub is not using the lightweight shared snapshot');

if(game.includes('requestAnimationFrame(loop)')||game.includes('function loop(now)'))
  throw new Error('game runtime still owns a private continuous RAF');
if(!game.includes("frameHub.subscribe('game-simulation',frameStep,-100)"))
  throw new Error('game simulation is not the pre-snapshot frame owner');
if(!game.includes('frameSnapshot'))
  throw new Error('game runtime does not expose a lightweight frame snapshot');

if(ink.includes('requestAnimationFrame(draw)')||ink.includes('__xianxiaDebug?.snapshot?.()'))
  throw new Error('ink runtime still owns a private frame/snapshot loop');
if(!ink.includes("hub.subscribe('ink-render',drawFrame,25)"))
  throw new Error('ink renderer is not subscribed to the shared frame');
if(ink.includes('c.width=W;c.height=H')||ink.includes('clearRect(0,0,W,H)'))
  throw new Error('ink renderer still allocates/clears a full-world backing canvas');
for(const token of ['function viewportMetrics(s)','function ensureViewport(m)','function setWorldTransform(m)','function visible(x,y,pad=120)','maxPixels:2600000','dprCap:1.5']){
  if(!ink.includes(token))throw new Error('viewport renderer missing '+token);
}
if(ink.includes('function renderBounds(s)')||ink.includes('function clipBounds(c,r)'))
  throw new Error('legacy full-world clip renderer survived');
if(!ink.includes("filter=hit?'brightness(2.15) saturate(.3)':'none'"))
  throw new Error('per-enemy default drop-shadow filter survived');
if(!ink.includes('function drawGatherRings(s,t)'))
  throw new Error('gather rings are not owned by the ink renderer');

if(extras.includes('function makeGatherLayer')||extras.includes('drawGatherRings')||extras.includes('requestAnimationFrame(drawGatherRings)'))
  throw new Error('progression extras still owns the full-world gather canvas/RAF');
if(theme.includes('requestAnimationFrame(renderOverlay)'))
  throw new Error('hidden legacy canvas overlay RAF is still active');

if(world.includes('matrix(')||world.includes('will-change:transform'))
  throw new Error('full-world CSS camera compositor survived');
if(!world.includes("mode.cameraOwner='viewport-renderer'"))
  throw new Error('camera is not publishing viewport ownership');
if(!explore.includes('body.v1133-run #cv{display:none!important;opacity:0!important}'))
  throw new Error('base canvas is still composited during combat');
if(explore.includes('layer.style.width=')||explore.includes('ink.width=Math.round(W*dpr)'))
  throw new Error('exploration runtime still forces full-world canvas sizing');

const checks=[
  ['exploration runtime',explore,'requestAnimationFrame(frame)','function frame(){'],
  ['world camera',world,'requestAnimationFrame(frame)','function frame(){'],
  ['player feedback',feedback,'requestAnimationFrame(frame)','function snapshot(){'],
  ['cooldown HUD',cooldown,'requestAnimationFrame(update)','function update(){']
];
for(const [name,src,loop,legacy] of checks){
  if(src.includes(loop))throw new Error(name+' still owns its old continuous RAF');
  if(src.includes(legacy))throw new Error(name+' still exposes its old frame/snapshot entrypoint');
}

const joined=game+ink+explore+world+feedback+cooldown+resultFlow+visual+tutorial;
for(const name of ['game-simulation','exploration-lifecycle','world-camera','ink-render','exploration-hud','player-feedback','combat-cooldowns','result-flow','visual-state','guided-onboarding-tutorial']){
  if(!joined.includes("'"+name+"'"))throw new Error('missing frame subscriber '+name);
}
if(!world.includes("hub.subscribe('world-camera',cameraFrame,20)"))throw new Error('world camera priority changed');
if(!explore.includes("hub.subscribe('exploration-hud',hudFrame,30)"))throw new Error('HUD priority changed');
if(!feedback.includes("hub.subscribe('player-feedback',frame,40)"))throw new Error('feedback priority changed');
if(!cooldown.includes("hub.subscribe('combat-cooldowns',update,50)"))throw new Error('cooldown priority changed');
if(!resultFlow.includes("hub.subscribe('result-flow',frame,60)"))throw new Error('result-flow priority changed');
if(!visual.includes("hub.subscribe('visual-state',visualFrame,70)"))throw new Error('visual-state priority changed');
if(!tutorial.includes("hub.subscribe('guided-onboarding-tutorial',frame,95)"))throw new Error('guided tutorial priority changed');

console.log('frame ownership + viewport renderer validation: OK');
