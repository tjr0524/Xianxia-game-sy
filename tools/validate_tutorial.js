'use strict';
const fs=require('fs');
const path=require('path');
const root=process.argv[2]||'.';
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const index=read('index.html');
const tutorial=read('tutorial_runtime_v11_49.js');

if(!index.includes('tutorial_runtime_v11_49.js'))throw new Error('tutorial runtime is not loaded');
if(!tutorial.includes("const VERSION='11.49.7-tutorial'"))throw new Error('guided tutorial version mismatch');
if(!tutorial.includes("const META_KEY='xianxia_tutorial_guided_v2'"))throw new Error('guided tutorial resume state missing');
if(!tutorial.includes("const GUIDE_DONE_KEY='blackwind-first-entry'"))throw new Error('tutorial graduation state missing');
if(!tutorial.includes("return Math.max(0,+s?.M?.herb||0)+Math.max(0,+s?.run?.h0||0)"))
  throw new Error('combined persistent + run herb progress missing');
if(!tutorial.includes("progress:'하급 영초 '+lowerHerbs(s)+'/8'")&&!tutorial.includes("하급 영초 8"))
  throw new Error('mortal eight-herb onboarding target missing');
if(!tutorial.includes('초입의 발자취')||!tutorial.includes('생환지인'))
  throw new Error('journal reward guidance missing');
if(!tutorial.includes('요수를 잡아 영석을 모으세요')||!tutorial.includes("k>=3&&h>=1"))
  throw new Error('post-cultivation hunt guidance missing');
if(!tutorial.includes("M.skillUnlocks?.sword")||!tutorial.includes('어검술'))
  throw new Error('first spell unlock guidance missing');
if(!tutorial.includes("trainingCount(M,'q1_')")||!tutorial.includes('/25'))
  throw new Error('first training guidance missing');
if(!tutorial.includes("mapGateTarget('blackwind')")||!tutorial.includes("areaPickerTarget('흑풍곡')"))
  throw new Error('Blackwind gate/selection guidance missing');
if(!tutorial.includes("hub.subscribe('guided-onboarding-tutorial',frame,95)"))
  throw new Error('guided tutorial is not on shared frame hub');
if(!tutorial.includes("mini.textContent='길잡이'"))
  throw new Error('closable tutorial reopen control missing');
if(!tutorial.includes("classList.add('v1150-focus')"))
  throw new Error('tutorial focus highlight missing');
if(/new\s+MutationObserver/.test(tutorial))throw new Error('tutorial must not use MutationObserver');

console.log('guided onboarding tutorial validation: OK');
