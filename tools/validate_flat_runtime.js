'use strict';
const fs=require('fs');
const path=require('path');
const root=process.argv[2]||'.';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const index=read('index.html');
const kernel=read('runtime_kernel_v11_45.js');
if(!index.includes('BUILD 11.49.6'))throw new Error('test build label is not 11.49.6');
if(!kernel.includes("const BUILD='11.49.6'"))throw new Error('canonical test build is not 11.49.6');
const flat=[
  'runtime_frame_hub_v11_47.js',
  'game_runtime_v11_45.js',
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
  'runtime_frame_hub_v11_47.js',
  'game_runtime_v11_45.js',
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
const ink=read('ink_runtime_world_v11_45.js');
const game=read('game_runtime_v11_45.js');
const manifest=JSON.parse(read('assets/ink_v1/manifest.json'));
const preparedAssets=[
  'qingyun_mist_goat_v1.png','blackwind_shadow_badger_v1.png','blackwind_sickle_mantis_v1.png',
  'blood_bloodscale_lizard_v1.png','blood_crimson_quill_v1.png','blood_crystal_qilin_v1.png',
  'thunder_basalt_tortoise_v1.png','thunder_horn_ram_v1.png','thunder_storm_marten_v1.png',
  'spirit_deer_v1.png','treasure_rat_v1.png','wandering_rival_v1.png','trait_fx_atlas_v1.png'
];
for(const asset of preparedAssets){
  const assetPath=path.join(root,'assets','ink_v1','source',asset);
  if(!fs.existsSync(assetPath))throw new Error('prepared runtime asset missing: '+asset);
  if(!ink.includes(asset))throw new Error('prepared runtime asset is not bound: '+asset);
}
if(manifest.version!=='1.1.0'||manifest.runtime_bindings?.version!=='11.49.6')
  throw new Error('ink manifest/runtime binding version mismatch');
for(const token of ["spirit:'spirit_deer'","rat:'treasure_rat'","rogue:'wandering_rival'","blood_elite:'source/blood_crystal_qilin_v1.png'","thunder_elite:'source/thunder_basalt_tortoise_v1.png'","prepare('trait_fx',[4,4,4,4])"]){
  if(!ink.includes(token))throw new Error('runtime asset binding token missing: '+token);
}
if(!game.includes('rareTrait:enemy.rareTrait'))throw new Error('rare trait metadata is not exposed to renderer');

console.log('flat runtime validation: OK');
