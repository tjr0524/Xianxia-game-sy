'use strict';
const fs=require('fs');
const path=require('path');
const root=process.argv[2]||'.';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const index=read('index.html');
const tutorial=read('tutorial_runtime_v11_49.js');

if(!index.includes('tutorial_runtime_v11_49.js'))throw new Error('tutorial runtime is not loaded');
if(!tutorial.includes("const VERSION='11.49.0'"))throw new Error('tutorial runtime version mismatch');
if(!tutorial.includes("(s.M?.stats?.totalRuns||0)===0"))throw new Error('tutorial is not limited to first entry');
if(!tutorial.includes("s.M?.area==='qingyun'"))throw new Error('tutorial is not limited to Qingyun first area');
if(!tutorial.includes("(s.M?.realm?.major??-1)<0"))throw new Error('tutorial is not limited to mortal phase');
if(!tutorial.includes('요수를 피해서 영초'))throw new Error('first-entry collection instruction missing');
if(!tutorial.includes('가까이 가면 자동으로 채집'))throw new Error('auto-pickup explanation missing');
if(!tutorial.includes('귀환진'))throw new Error('return instruction missing');
if(!tutorial.includes('WASD·방향키'))throw new Error('desktop control hint missing');
if(!tutorial.includes('화면을 탭하거나 드래그'))throw new Error('mobile control hint missing');
if(!tutorial.includes("hub.subscribe('first-run-tutorial',frame,80)"))throw new Error('tutorial is not on shared frame hub');
if(/new\s+MutationObserver/.test(tutorial))throw new Error('tutorial must not use MutationObserver');

console.log('first-run tutorial validation: OK');
