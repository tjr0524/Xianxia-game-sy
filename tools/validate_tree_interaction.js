'use strict';
const fs=require('fs');
const path=require('path');
const root=process.argv[2]||'.';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

const camera=read('tree_camera_gesture_v11_44.js');
const progression=read('progression_runtime_v11_45.js');
const touch=read('tree_touch_fix_v11_37_4.js');

if(camera.includes(".detail-close38,.asc-node,.map-node')"))
  throw new Error('shared tree camera still excludes node-started drags');
if(!camera.includes("function interactiveInside(target){return !!target?.closest?.('.camera,.v17float,.detail-popover38,.detail-action,.detail-close38')}"))
  throw new Error('shared tree camera interactive exclusion list is unexpected');
if(!camera.includes("Math.hypot(p.x-old.startX,p.y-old.startY)>7"))
  throw new Error('shared tree camera drag threshold missing');
if(!camera.includes("performance.now()<c.dragUntil"))
  throw new Error('shared tree camera drag-click suppression missing');
if(!progression.includes("closest('.camera,.v17float,.asc-node,.map-node')"))
  throw new Error('legacy progression camera should stay excluded from node pointers; shared capture camera owns them');

const nodeDown=/if\(node\)\{[\s\S]*?pointers\.set\(event\.pointerId,\{kind:'node'[\s\S]*?return;\s*\}/.exec(touch)?.[0]||'';
if(!nodeDown)throw new Error('tree touch node pointerdown guard missing');
if(nodeDown.includes('stopPropagation')||nodeDown.includes('stopImmediatePropagation'))
  throw new Error('tree touch guard still swallows node pointerdown');

const nodeUp=/if\(p\.kind==='node'\)\{[\s\S]*?return;\s*\}/.exec(touch)?.[0]||'';
if(!nodeUp)throw new Error('tree touch node pointerup guard missing');
if(nodeUp.includes('stopPropagation')||nodeUp.includes('stopImmediatePropagation'))
  throw new Error('tree touch guard still swallows node pointerup');

if(!progression.includes("b.onclick=e=>{e.stopPropagation();f?.()}"))
  throw new Error('training node click action missing');
if(!progression.includes("mapNode(w,o,f)")||!progression.includes("b.onclick=e=>{e.stopPropagation();f?.()}"))
  throw new Error('map node click action missing');

console.log('tree interaction validation: OK');
