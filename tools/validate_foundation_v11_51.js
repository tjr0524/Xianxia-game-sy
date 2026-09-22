const fs=require('fs');
const vm=require('vm');

const game=fs.readFileSync('game_runtime_v11_45.js','utf8');
const progression=fs.readFileSync('progression_runtime_v11_45.js','utf8');
const foundation=fs.readFileSync('foundation_content_v11_50.js','utf8');
const mastery=fs.readFileSync('mastery_runtime_v11_51.js','utf8');
const formation=fs.readFileSync('formation_skills_v11_49_35.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const renderer=fs.readFileSync('foundation_content_renderer_v11_50.js','utf8');
const ink=fs.readFileSync('ink_runtime_world_v11_45.js','utf8');
const exploration=fs.readFileSync('exploration_runtime_v11_45.js','utf8');

function ok(value,label){if(!value)throw new Error(label);console.log('OK  ',label)}
function literal(source,start,end){const a=source.indexOf(start);if(a<0)throw new Error(`missing ${start}`);const b=source.indexOf(end,a+start.length);if(b<0)throw new Error(`missing ${end}`);return source.slice(a+start.length,b)}

ok(html.includes('mastery_runtime_v11_51.js?v='),'mastery runtime is loaded');
ok(game.includes('baseKillStone:()=>killStoneBase()'),'foundation enemy rewards use stage economy');
ok(game.includes("window.__xianxiaMastery?.onFinish?.(reason,foundationApi())"),'mastery finish hook is connected');
ok(formation.includes('const DAO_MARK_COST=1'),'additional trait choice costs one Dao Mark');
ok(!formation.includes('TEST_DAO_MARK_COST'),'free test trait override is removed');
ok(progression.includes("marsh:['eco','fate','res','miasma']"),'Purple Cloud Marsh exposes four branches');
ok(progression.includes("taixu:['eco','fate','res','formation']"),'Taixu Ruins exposes four branches');
ok((progression.match(/stage:\d,area:/g)||[]).length===9,'developer timing data has Foundation 1–9');

const economy=vm.runInNewContext('('+literal(game,'const FOUNDATION_ECONOMY=',";\nconst MAJORS")+')');
const expectedGross=[2718.76,3250,3900,4800,5900,7200,8800,10800,13200];
const expectedRuns=[16,16,17,17,18,18,18,19,20];
for(let stage=1;stage<=9;stage++){
  ok(economy[stage].gross===expectedGross[stage-1],`Foundation ${stage} gross/run matches spreadsheet`);
  ok(economy[stage].targetRuns===expectedRuns[stage-1],`Foundation ${stage} target runs match spreadsheet`);
}

const map=vm.runInNewContext('('+literal(progression,'const MAP=',";\nconst AFF_HINT")+')');
for(const area of ['marsh','taixu'])ok(Object.values(map[area].branches).flat().length===12,`${area} map renders twelve node positions`);
ok(map.taixu.gate.jiedan_trial&&map.jiedan_trial.root,'Taixu map connects to the separate Core Formation trial');
ok(map.taixu.gate.jiedan_trial.x===map.taixu.root.x&&map.taixu.gate.jiedan_trial.y>map.taixu.root.y,'Core Formation trial gate sits directly below Taixu');
ok(map.jiedan_trial.root.x===map.taixu.root.x&&map.jiedan_trial.root.y>map.taixu.gate.jiedan_trial.y,'Core Formation trial node continues vertically below its gate');
ok(progression.includes("function jumpJiedanReady()"),'developer preset exists for a trial-ready Foundation 9 state');
ok(progression.includes("M.unlocked.jiedan_trial=1")&&progression.includes("M.area='jiedan_trial'"),'trial-ready preset unlocks and selects the Core Formation trial');

const affinity=vm.runInNewContext('('+literal(progression,'const AFFINITY_COST=',";\nfunction affinityRankCap")+')');
for(const area of ['marsh','taixu'])ok(Object.keys(affinity[area]).length===12,`${area} has twelve priced nodes`);
const sum=area=>Object.values(affinity[area]).flat().reduce((a,b)=>a+b,0);
ok(sum('marsh')===130944,'Purple Cloud Marsh budget total is 130,944');
ok(sum('taixu')===240064,'Taixu Ruins budget total is 240,064');

const fctx={window:{},console};vm.runInNewContext(foundation,fctx);
for(let stage=1;stage<=9;stage++)ok(fctx.window.__xianxiaFoundationContent.runLimit(stage<=3?'thunder':stage<=6?'marsh':'taixu',{major:1,stage})===25,`Foundation ${stage} normal expedition limit is 25 seconds`);
ok(!fctx.window.__xianxiaFoundationContent.bossOnly('taixu',{major:1,stage:9}),'Taixu 9 remains a normal expedition');
ok(fctx.window.__xianxiaFoundationContent.bossOnly('jiedan_trial',{major:1,stage:9}),'Core Formation trial is boss-only');
ok(fctx.window.__xianxiaFoundationContent.runLimit('jiedan_trial',{major:1,stage:9})===45,'Core Formation trial has a 45 second boss budget');
ok(foundation.includes("api.state.area==='jiedan_trial'"),'Taixu Sovereign spawns only in the separate Core Formation trial');
ok(foundation.includes("enemy.hp*=trial.bossMode?0.70:1"),'Core Formation boss nodes use the tuned boss-phase HP');
ok(foundation.includes("trial.remaining=Math.max(0,trial.remaining-1.5)"),'breaking a formation node removes 1.5 seconds');
ok(foundation.includes("현재 이야기의 끝 · 결단 1층"),'first clear announces Core Formation 1 as the current ending');
ok(foundation.includes("api.state.realm={major:2,stage:1}"),'final boss clear promotes the character to Core Formation 1');
ok(renderer.includes("areaAssets.jiedan_trial=areaAssets.taixu"),'Core Formation trial reuses the Taixu renderer asset set');
ok(renderer.includes("['taixu','jiedan_trial'].includes(trialArea)"),'Taixu grand-formation renderer also draws in the final trial');
ok(ink.includes("area==='jiedan_trial'")&&ink.includes("taixu_ruins_battlefield_1024x1536.png"),'generic ink layer does not fall back to Qingyun in the final trial');
ok(exploration.includes("area==='jiedan_trial'")&&exploration.includes("taixu_ruins_battlefield_1024x1536.png"),'exploration backdrop uses the Taixu arena in the final trial');
ok(game.includes("M.area==='jiedan_trial'"),'combat targeting and result messaging recognize the Core Formation trial');
ok(game.includes("if(!bossOnlyRun)setupVein();else vein=null;"),'boss-only encounters suppress veins and expedition side content');
ok(game.includes("if(phase==='run'&&bossEncounter&&run?.foundation?.bossKilled){finish('return');return}"),'boss-only encounters resolve at the kill itself');
ok(progression.includes("jiedan_trial:{s:0,h:0"),'progression defines a separate Core Formation trial gate');
ok(progression.includes("축기 9층 수련 완성 필요"),'final gate requires completed Foundation 9 training');
const training=vm.runInNewContext('('+literal(progression,'const TRAIN=',";\nconst TRAIN_WORLD_H")+')',{T:(id,name,glyph,desc,cost,effect)=>({id,name,glyph,desc,cost,effect}),K:(s=0,h=0,hg=0)=>({s,h,hg})});
const core1=training.find(stage=>stage.id==='c1');
ok(core1&&core1.req.major===2&&core1.req.stage===1,'training path ends with Core Formation 1');
ok(core1.nodes.length===6,'Core Formation 1 exposes six post-ending growth nodes');
ok(core1.nodes.some(node=>node.effect.basicRange===48),'Core Formation 1 includes the expanded basic attack range node');
ok(core1.nodes.some(node=>node.effect.basicHits===1),'Core Formation 1 includes an extra basic attack target node');
ok(progression.includes("TRAIN_WORLD_H=3000,TRAIN_ROOT_Y=2910"),'training map expands to fit Core Formation 1');
ok(progression.includes("결단 시련 완수 시 자동 돌파"),'Core Formation 1 cannot be manually bypassed before the final trial');
ok(formation.includes('function traitReqReached(M,req)'),'formation UI supports ending-based Core Formation trait unlocks');
ok(formation.includes("jiedanTrialCompleted&&req?.major===2&&req?.stage===1"),'only prepared Core Formation 1 trait tiers are unlocked by the ending');
const taixuBossHp=5881*1.15*6,stage9Dps=1900;
const gateTime=taixuBossHp*.35/stage9Dps;
const postBurstDamage=stage9Dps*1.35*4;
const postTime=4+Math.max(0,taixuBossHp*.65-postBurstDamage)/stage9Dps;
const conservativeTtk=gateTime+10+postTime;
ok(conservativeTtk<=45*.70,`Core Formation boss ideal TTK ${conservativeTtk.toFixed(2)}s fits the 45s budget with practical headroom`);

const mctx={window:{},console};vm.runInNewContext(mastery,mctx);
const M={area:'qingyun',zones:{qingyun:{tree:{}}},formationSkills:{daoMarks:0,ranks:{},traits:{}}};
const run={h0:0,h1:0,h2:0,kills:0,damageBySource:{}};
const api={state:M,run,save(){}};
mctx.window.__xianxiaMastery.onBegin(api);
const message=mctx.window.__xianxiaMastery.onFinish('return',api);
ok(M.formationSkills.daoMarks===0&&message.includes('도행록에서 도흔 +1 수령 가능'),'first safe return records mastery reward in the journal');
ok(mctx.window.__xianxiaMastery.summary(M).pendingDaoMarks===1,'recorded mastery reward remains pending until claimed');
ok(mctx.window.__xianxiaMastery.claim(M,'qingyun',0)===1&&M.formationSkills.daoMarks===1,'journal claim grants the one Dao Mark reward');
ok(mctx.window.__xianxiaMastery.claim(M,'qingyun',0)===0&&mctx.window.__xianxiaMastery.onFinish('return',api)===''&&M.formationSkills.daoMarks===1,'mastery reward cannot repeat');
ok(mctx.window.__xianxiaMastery.summary(M).daoists===0,'Daoist count requires five marks');
for(const area of mctx.window.__xianxiaMastery.areas)M.mastery.areas[area].marks=[1,1,1,1,1];
ok(mctx.window.__xianxiaMastery.summary(M).daoists===6,'six completed areas produce the six-Daoist cap');
ok(mastery.includes("'태허진령 격파'"),'Taixu mastery V objective is the Sovereign defeat');
ok(mastery.includes("M.area==='jiedan_trial'&&api.run?.foundation?.bossKilled"),'Core Formation trial clear awards Taixu mastery V');
ok(mastery.includes("M.events?.jiedanTrialCompleted&&!M.mastery.areas.taixu.marks[4]"),'existing final-trial clears backfill Taixu mastery V');
const oldClear={events:{jiedanTrialCompleted:1},mastery:{version:2,areas:{}},formationSkills:{version:1,daoMarks:0,ranks:{},traits:{},daoEconomyVersion:2,daoJournalVersion:1}};
mctx.window.__xianxiaMastery.ensure(oldClear);
ok(oldClear.mastery.areas.taixu.marks[4]===1&&oldClear.mastery.areas.taixu.claimed[4]===0,'existing clear becomes an unclaimed Taixu V reward');
const clearState={area:'jiedan_trial',events:{},mastery:{version:2,areas:{}},formationSkills:{version:1,daoMarks:0,ranks:{},traits:{},daoEconomyVersion:2,daoJournalVersion:1}};
const clearRun={foundation:{bossKilled:1},mastery:{kills:{taixu_boss:1},types:{},specialKinds:0,rareKill:1,formationNodes:0},h0:0,h1:0,h2:0,kills:1,damageBySource:{}};
const clearApi={state:clearState,run:clearRun,save(){}};
const clearMessage=mctx.window.__xianxiaMastery.onFinish('return',clearApi);
ok(clearState.mastery.areas.taixu.marks[4]===1&&clearMessage.includes('태허진령 격파'),'final trial kill records Taixu mastery V immediately');


console.log('foundation 11.51 validation: OK');
