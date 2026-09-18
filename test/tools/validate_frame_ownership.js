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

const hubPos=index.indexOf('runtime_frame_hub_v11_47.js');
const gamePos=index.indexOf('game_runtime_v11_45.js');
const tutorialPos=index.indexOf('tutorial_runtime_v11_49.js');
const explorePos=index.indexOf('exploration_runtime_v11_45.js');
if(!(hubPos>=0&&gamePos>hubPos&&tutorialPos>gamePos&&explorePos>tutorialPos))
  throw new Error('frame hub/game/tutorial load order is invalid');

if((hub.match(/requestAnimationFrame\s*\(frame\)/g)||[]).length!==1)
  throw new Error('frame hub must own exactly one continuous RAF');
if(!hub.includes("const ACTIVE_FPS=60")||!hub.includes("const IDLE_FPS=8"))
  throw new Error('frame pacing limits are missing');
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
if(ink.includes('drawImage(img,0,0,W,H)'))
  throw new Error('ink renderer still redraws the full background bitmap every frame');
if(!ink.includes('function renderBounds(s)')||!ink.includes('function clipBounds(c,r)'))
  throw new Error('ink renderer viewport clipping is missing');
if(!ink.includes('function drawGatherRings(s,t)'))
  throw new Error('gather rings were not merged into the ink renderer');

if(extras.includes('function makeGatherLayer')||extras.includes('drawGatherRings')||extras.includes('requestAnimationFrame(drawGatherRings)'))
  throw new Error('progression extras still owns the full-world gather canvas/RAF');
if(theme.includes('requestAnimationFrame(renderOverlay)'))
  throw new Error('hidden legacy canvas overlay RAF is still active');

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
for(const name of ['game-simulation','exploration-lifecycle','world-camera','ink-render','exploration-hud','player-feedback','combat-cooldowns','result-flow','visual-state','first-run-tutorial']){
  if(!joined.includes("'"+name+"'"))throw new Error('missing frame subscriber '+name);
}
if(!world.includes("hub.subscribe('world-camera',cameraFrame,20)"))throw new Error('world camera priority changed');
if(!explore.includes("hub.subscribe('exploration-hud',hudFrame,30)"))throw new Error('HUD priority changed');
if(!feedback.includes("hub.subscribe('player-feedback',frame,40)"))throw new Error('feedback priority changed');
if(!cooldown.includes("hub.subscribe('combat-cooldowns',update,50)"))throw new Error('cooldown priority changed');
if(!resultFlow.includes("hub.subscribe('result-flow',frame,60)"))throw new Error('result-flow priority changed');
if(!visual.includes("hub.subscribe('visual-state',visualFrame,70)"))throw new Error('visual-state priority changed');
if(!tutorial.includes("hub.subscribe('first-run-tutorial',frame,80)"))throw new Error('tutorial priority changed');

console.log('frame ownership validation: OK');
