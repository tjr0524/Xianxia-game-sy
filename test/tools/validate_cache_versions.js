'use strict';
const fs=require('fs');
const path=require('path');
const root=process.argv[2]||'.';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

const index=read('index.html');
const kernel=read('runtime_kernel_v11_45.js');
const match=/const BUILD='([^']+)'/.exec(kernel);
if(!match)throw new Error('canonical build marker missing from runtime kernel');
const build=match[1];

if(!index.includes(`BUILD ${build}`))
  throw new Error(`index build badge does not match canonical build ${build}`);

const refs=[...index.matchAll(/<script\s+[^>]*src="([^"]+)"/g)].map(m=>m[1]);
if(!refs.length)throw new Error('no script references found in index.html');

for(const ref of refs){
  if(/^https?:\/\//i.test(ref))continue;
  const url=new URL(ref,'https://xianxia.invalid/');
  const cacheVersion=url.searchParams.get('v');
  if(cacheVersion!==build)
    throw new Error(`script cache version mismatch: ${ref} (expected v=${build})`);
}

const version=JSON.parse(read('version.json'));
if(String(version.build||'')!==build)
  throw new Error(`version.json build mismatch: ${version.build||'(blank)'} != ${build}`);
if(version.paused)
  throw new Error('version.json is paused; test build would not advertise the deployed build');

console.log(`cache/build validation: OK (${build}, ${refs.length} scripts)`);
