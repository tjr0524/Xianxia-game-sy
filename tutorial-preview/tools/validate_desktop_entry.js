'use strict';
const fs=require('fs');
const path=require('path');
const root=process.argv[2]||'.';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const index=read('index.html');
const world=read('exploration_world_v11_33_4.js');
const explore=read('exploration_runtime_v11_45.js');
const ink=read('ink_runtime_world_v11_45.js');

if(!index.includes('id="start" class="primary">입장</button>'))throw new Error('expedition entry button missing from markup');
if(!index.includes('id="ov" class="overlay"'))throw new Error('expedition overlay missing from markup');
if(!index.includes('<canvas id="cv"'))throw new Error('base game canvas missing from markup');
if(!world.includes('function retireWorldWrapper()'))throw new Error('legacy full-world wrapper retirement missing');
if(!world.includes("mode.cameraOwner='viewport-renderer'"))throw new Error('viewport camera ownership missing');
if(!world.includes("if(mode?.active&&snap?.phase==='run')updateCamera(mode,snap);"))throw new Error('world camera active-run gate changed');
if(world.includes('will-change:transform')||world.includes('matrix('))throw new Error('legacy full-world compositor survived');
if(!explore.includes('body.v1133-run #cv{display:none!important;opacity:0!important}'))throw new Error('base canvas is not removed from combat compositing');
if(!ink.includes('function ensureViewport(m)')||!ink.includes("c.style.width=m.cssW+'px'"))throw new Error('viewport-sized combat canvas missing');
if(!world.includes("game.insertBefore(node,overlay)"))throw new Error('combat canvas is not kept before the overlay');

console.log('desktop expedition entry + viewport canvas validation: OK');
