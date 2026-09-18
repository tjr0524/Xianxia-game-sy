const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const inputs=['game_v11.js','ink_runtime_v11_31.js','ink_assets_v11_31.css','visual_v11_25.js','progression_v11_17.js','ui_v11_17.js','map_v11_18.js','systems_v11_19.js','systems_v11_20.js','systems_v11_21.js','systems_v11_22.js'];
function walk(rel){const full=path.join(root,rel);for(const name of fs.readdirSync(full).sort()){const child=path.join(rel,name),stat=fs.statSync(path.join(root,child));if(stat.isDirectory())walk(child);else inputs.push(child)}}
walk('assets/ink_v1');
const hash=crypto.createHash('sha256');
for(const rel of inputs.sort()){hash.update(rel);hash.update(fs.readFileSync(path.join(root,rel)))}
const token=hash.digest('hex').slice(0,12);
const indexPath=path.join(root,'index.html');
let html=fs.readFileSync(indexPath,'utf8');
if(process.argv.includes('--check')){
  const tokens=[...html.matchAll(/(?:game_v11\.js|progression_v11_17\.js|ui_v11_17\.js|map_v11_18\.js|systems_v11_(?:19|20|21|22)\.js|visual_v11_25\.js|ink_(?:assets_v11_31\.css|runtime_v11_31\.js))\?v=([^"']+)/g)].map(m=>m[1]);
  if(tokens.length!==11||tokens.some(value=>value!==token)){
    console.error(`asset cache token is stale; run node scripts/stamp_asset_cache.cjs (expected ${token})`);
    process.exit(1);
  }
  console.log(token);
  process.exit(0);
}
html=html.replace(/(ink_assets_v11_31\.css\?v=)[^"']+/,'$1'+token);
html=html.replace(/(ink_runtime_v11_31\.js\?v=)[^"']+/,'$1'+token);
html=html.replace(/(game_v11\.js\?v=)[^"']+/,'$1'+token);
html=html.replace(/(visual_v11_25\.js\?v=)[^"']+/,'$1'+token);
for(const name of ['progression_v11_17.js','ui_v11_17.js','map_v11_18.js','systems_v11_19.js','systems_v11_20.js','systems_v11_21.js','systems_v11_22.js']){
  html=html.replace(new RegExp(`(${name.replace(/\./g,'\\.')}\\?v=)[^"']+`),'$1'+token);
}
fs.writeFileSync(indexPath,html);
console.log(token);
