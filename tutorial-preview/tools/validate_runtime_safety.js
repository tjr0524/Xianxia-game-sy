const fs=require('fs');

const ACTIVE=[
  'runtime_kernel_v11_45.js',
  'balance_core_v11_37_1.js',
  'update_guard.js',
  'tree_camera_gesture_v11_44.js',
  'tree_touch_fix_v11_37_4.js',
  'ui_feedback_v11_40.js',
  'result_flow_v11_41.js',
  'map_detail_v11_42.js',
  'combat_cooldown_hud_v11_43.js',
  'ui_hygiene_v11_45.js',
  'ui_polish_v11_38.js',
  'worldscale_exploration_v11_34.js',
  'exploration_world_v11_33_4.js'
];

function fail(message){
  console.error('[runtime-safety] '+message);
  process.exitCode=1;
}
function read(path){return fs.readFileSync(path,'utf8')}

for(const path of ACTIVE){
  const src=read(path);
  if(path!=='runtime_kernel_v11_45.js'&&/window\.__XIANXIA_BUILD__\s*=/.test(src)){
    fail(path+' writes window.__XIANXIA_BUILD__; only the runtime kernel may own the app build');
  }
  if(/location\.(?:replace|reload|assign)\s*\(/.test(src)){
    fail(path+' can navigate/reload the live game');
  }
  if(/navigator\.serviceWorker\.register\s*\(/.test(src)){
    fail(path+' registers a service worker at runtime');
  }
  if(/\.observe\(\s*document\.(?:documentElement|body)/.test(src)){
    fail(path+' observes the whole document; observers must be scoped to a feature container');
  }
}

const guard=read('update_guard.js');
if(!/autoReload\s*:\s*false/.test(guard))fail('update_guard.js must explicitly declare autoReload:false');
if(/MutationObserver/.test(guard))fail('update_guard.js must not observe DOM mutations');

const worldscale=read('worldscale_exploration_v11_34.js');
if(/ensureUpdateGuard/.test(worldscale))fail('exploration wrapper must not bootstrap the updater');
if(!worldscale.includes("'build badge isolation'"))fail('exploration wrapper must neutralize legacy buildBadge writes');

const hygiene=read('ui_hygiene_v11_45.js');
if(/new MutationObserver/.test(hygiene))fail('ui_hygiene_v11_45.js must stay event-driven');

const sw=read('sw.js');
if(/addEventListener\(\s*['"]fetch['"]/.test(sw))fail('sw.js must not intercept runtime fetches');

const version=JSON.parse(read('version.json'));
if(version.paused!==true||String(version.build||'').trim()!==''){
  fail('version.json must remain paused with an empty build while automatic updates are retired');
}

const index=read('index.html');
const kernelPos=index.indexOf('runtime_kernel_v11_45.js');
const entryPos=index.indexOf('balance_core_v11_37_1.js');
if(kernelPos<0||entryPos<0||kernelPos>entryPos){
  fail('runtime kernel must load before the balance entrypoint');
}

if(process.exitCode){
  console.error('[runtime-safety] FAILED');
  process.exit(process.exitCode);
}
console.log('[runtime-safety] PASS');
