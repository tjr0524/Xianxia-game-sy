const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');

const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/ink_v2/manifest.json'),'utf8'));
assert.equal(manifest.version,'2.0.0');
assert.deepEqual(manifest.world,{width:1800,height:2400,ratio:'3:4'});
assert.deepEqual(manifest.runtime,{width:2304,height:3072,format:'webp',quality:85});

for(const [area,rel] of Object.entries(manifest.backgrounds)){
  const file=path.join(root,'assets/ink_v2',rel);
  assert.ok(fs.existsSync(file),`missing ${area}: ${rel}`);
  const dimensions=execFileSync('identify',['-format','%wx%h',file],{encoding:'utf8'});
  assert.equal(dimensions,'2304x3072',`${area} must be a 3:4 2304x3072 runtime asset`);
}

const runtime=fs.readFileSync(path.join(root,'ink_runtime_v11_31.js'),'utf8');
for(const area of Object.keys(manifest.backgrounds)){
  assert.match(runtime,new RegExp(`bg_${area}:'\\.\\./ink_v2/runtime/backgrounds/${area}\\.webp'`));
}

const world=fs.readFileSync(path.join(root,'worldscale_core_v11_34.js'),'utf8');
assert.match(world,/background:\{mode:'single-world'/);
assert.match(world,/c\.drawImage\(img,0,0,W,H\)/);
assert.doesNotMatch(world,/TILE_W|TILE_H|tile-current|for\(let y=0,row=0/);

console.log('ink v2: four full-world 3:4 backgrounds verified');
