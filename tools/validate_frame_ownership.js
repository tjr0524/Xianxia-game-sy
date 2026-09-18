'use strict';
const fs=require('fs');
const path=require('path');
const root=process.argv[2]||'.';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const index=read('index.html');
const hub=read('runtime_frame_hub_v11_47.js');
const explore=read('exploration_runtime_v11_45.js');
const world=read('exploration_world_v11_33_4.js');
const feedback=read('ui_feedback_v11_40.js');
const cooldown=read('combat_cooldown_hud_v11_43.js');
const resultFlow=read('result_flow_v11_41.js');
const visual=read('visual_v11_25.js');
const tutorial=read('tutorial_runtime_v11_49.js');

if(!index.includes('runtime_frame_hub_v11_47.js'))throw new Error('shared frame hub is not loaded');
const gamePos=index.indexOf('game_runtime_v11_45.js');
const hubPos=index.indexOf('runtime_frame_hub_v11_47.js');
const tutorialPos=index.indexOf('tutorial_runtime_v11_49.js');
const explorePos=index.indexOf('exploration_runtime_v11_45.js');
if(!(gamePos>=0&&hubPos>gamePos&&tutorialPos>hubPos&&explorePos>tutorialPos))throw new Error('frame hub/tutorial load order is invalid');

if((hub.match(/requestAnimationFrame\s*\(frame\)/g)||[]).length!==1)throw new Error('frame hub must own exactly one continuous auxiliary RAF');
if((hub.match(/D\.snapshot\s*\(\)/g)||[]).length!==1)throw new Error('frame hub must capture exactly one debug snapshot per auxiliary frame');

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

const joined=explore+world+feedback+cooldown+resultFlow+visual+tutorial;
for(const name of ['exploration-lifecycle','world-camera','exploration-hud','player-feedback','combat-cooldowns','result-flow','visual-state','first-run-tutorial']){
  if(!joined.includes("'"+name+"'"))throw new Error('missing frame subscriber '+name);
}
if(!explore.includes("cameraOwner='world-wrapper'"))throw new Error('world wrapper is not declared as camera owner');
if(explore.includes('updateCamera(s);'))throw new Error('legacy exploration camera still runs');
if(!world.includes("hub.subscribe('world-camera',cameraFrame,20)"))throw new Error('world camera priority changed');
if(!explore.includes("hub.subscribe('exploration-hud',hudFrame,30)"))throw new Error('HUD must run after world camera');
if(!feedback.includes("hub.subscribe('player-feedback',frame,40)"))throw new Error('player feedback must run after camera/HUD');
if(!cooldown.includes("hub.subscribe('combat-cooldowns',update,50)"))throw new Error('cooldown HUD priority changed');
if(resultFlow.includes('requestAnimationFrame(frame)'))throw new Error('result flow still owns a continuous RAF');
if(!resultFlow.includes("hub.subscribe('result-flow',frame,60)"))throw new Error('result flow priority changed');
if(!visual.includes("hub.subscribe('visual-state',visualFrame,70)"))throw new Error('visual state priority changed');
if(!tutorial.includes("hub.subscribe('first-run-tutorial',frame,80)"))throw new Error('first-run tutorial priority changed');

console.log('frame ownership validation: OK');
