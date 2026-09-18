'use strict';
const fs=require('fs');
const path=require('path');
const root=process.argv[2]||'.';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const index=read('index.html');
const world=read('exploration_world_v11_33_4.js');

if(!index.includes('id="start" class="primary">입장</button>'))throw new Error('expedition entry button missing from markup');
if(!index.includes('id="ov" class="overlay"'))throw new Error('expedition overlay missing from markup');
if(!world.includes('function releaseWorld()'))throw new Error('desktop home canvas release missing');
if(world.includes('installCss();ensureWorld();'))throw new Error('world canvas is still reparented during home boot');
if(!world.includes('installCss();releaseWorld();'))throw new Error('home boot does not preserve the sizing canvas');
if(!world.includes("if(mode?.active&&snap?.phase==='run')updateCamera(mode,snap);"))throw new Error('world camera active-run gate changed');
if(!world.includes('releaseWorld();\n    badge('))throw new Error('world canvas is not released after a run');
if(!world.includes("game.insertBefore(node,overlay)"))throw new Error('released canvases are not restored before the overlay');

console.log('desktop expedition entry validation: OK');
