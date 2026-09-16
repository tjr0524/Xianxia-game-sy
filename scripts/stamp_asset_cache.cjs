const crypto=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const inputs=['ink_runtime_v11_31.js','ink_assets_v11_31.css'];
function walk(rel){const full=path.join(root,rel);for(const name of fs.readdirSync(full).sort()){const child=path.join(rel,name),stat=fs.statSync(path.join(root,child));if(stat.isDirectory())walk(child);else inputs.push(child)}}
walk('assets/ink_v1');
const hash=crypto.createHash('sha256');
for(const rel of inputs.sort()){hash.update(rel);hash.update(fs.readFileSync(path.join(root,rel)))}
const token=hash.digest('hex').slice(0,12);
const indexPath=path.join(root,'index.html');
let html=fs.readFileSync(indexPath,'utf8');
if(process.argv.includes('--check')){
  const tokens=[...html.matchAll(/ink_(?:assets_v11_31\.css|runtime_v11_31\.js)\?v=([^"']+)/g)].map(m=>m[1]);
  if(tokens.length!==2||tokens.some(value=>value!==token)){
    console.error(`asset cache token is stale; run node scripts/stamp_asset_cache.cjs (expected ${token})`);
    process.exit(1);
  }
  console.log(token);
  process.exit(0);
}
html=html.replace(/(ink_assets_v11_31\.css\?v=)[^"']+/,'$1'+token);
html=html.replace(/(ink_runtime_v11_31\.js\?v=)[^"']+/,'$1'+token);
fs.writeFileSync(indexPath,html);
console.log(token);
