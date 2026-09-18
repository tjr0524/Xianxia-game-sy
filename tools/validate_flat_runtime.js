'use strict';
const fs=require('fs');
const path=require('path');
const root=process.argv[2]||'.';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const index=read('index.html');
const kernel=read('runtime_kernel_v11_45.js');
if(!index.includes('BUILD 11.49.1'))throw new Error('test build label is not 11.49.1');
if(!kernel.includes("const BUILD='11.49.1'"))throw new Error('canonical test build is not 11.49.1');
const flat=[
  'game_runtime_v11_45.js',
  'runtime_frame_hub_v11_47.js',
  'tutorial_runtime_v11_49.js',
  'ink_runtime_world_v11_45.js',
  'progression_runtime_v11_45.js',
  'systems21_runtime_v11_45.js',
  'progression_extras_runtime_v11_45.js',
  'exploration_runtime_v11_45.js'
];
const legacyActive=[
  'balance_core_v11_37_1.js',
  'balance_progression_v11_36.js',
  'balance_systems21_v11_36.js',
  'balance_progression_extras_v11_36.js',
  'worldscale_exploration_v11_34.js'
];
for(const p of flat){
  if(!index.includes('src="'+p))throw new Error('flat runtime missing from index: '+p);
  const s=read(p);
  if(/new\s+XMLHttpRequest/.test(s))throw new Error('sync/runtime XHR survived in '+p);
  if(/\(0,\s*eval\)|\beval\s*\(/.test(s))throw new Error('eval survived in '+p);
}
for(const p of legacyActive){
  if(index.includes('src="'+p))throw new Error('legacy patch loader still active: '+p);
}
const order=[
  'runtime_preflight_v11_45_flat.js',
  'update_guard.js',
  'tree_camera_gesture_v11_44.js',
  'tree_touch_fix_v11_37_4.js',
  'game_runtime_v11_45.js',
  'runtime_frame_hub_v11_47.js',
  'tutorial_runtime_v11_49.js',
  'ink_runtime_world_v11_45.js',
  'progression_runtime_v11_45.js',
  'systems_v11_20.js',
  'map_v11_18.js',
  'systems_v11_19.js',
  'systems21_runtime_v11_45.js',
  'systems_v11_22.js',
  'visual_v11_25.js',
  'progression_extras_runtime_v11_45.js',
  'exploration_runtime_v11_45.js',
  'exploration_world_v11_33_4.js',
  'ui_polish_v11_38.js',
  'runtime_postflight_v11_45_flat.js'
];
let last=-1;
for(const p of order){
  const i=index.indexOf('src="'+p);
  if(i<0||i<=last)throw new Error('runtime order invalid at '+p);
  last=i;
}
console.log('flat runtime validation: OK');
