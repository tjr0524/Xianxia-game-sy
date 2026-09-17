'use strict';
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
let failures=0;
function ok(name,cond){if(cond)console.log('OK  ',name);else{console.error('FAIL',name);failures++}}
function has(src,s){return src.includes(s)}
function match(src,re){return re.test(src)}

const index=read('index.html');
const core=read('balance_core_v11_36.js');
const prog=read('balance_progression_v11_36.js');
const ui=read('balance_ui_v11_36.js');
const sys21=read('balance_systems21_v11_36.js');
const extras=read('balance_progression_extras_v11_36.js');
const game=read('game_v11.js');
const progression=read('progression_v11_17.js');
const uiOriginal=read('ui_v11_17.js');
const sysOriginal=read('systems_v11_21.js');
const extrasOriginal=read('progression_extras_v11_32.js');
const world=read('worldscale_core_v11_34.js');

ok('index build 11.36.0',has(index,'BUILD 11.36.0'));
for(const f of ['balance_core_v11_36.js','balance_progression_v11_36.js','balance_ui_v11_36.js','balance_systems21_v11_36.js','balance_progression_extras_v11_36.js'])ok('index loads '+f,has(index,f+'?v=11.36.0'));
ok('legacy core loader removed',!has(index,'<script src="worldscale_core_v11_34.js'));
ok('legacy progression loader removed',!has(index,'<script src="progression_v11_17.js'));
ok('legacy ui loader removed',!has(index,'<script src="ui_v11_17.js'));
ok('legacy systems21 loader removed',!has(index,'<script src="systems_v11_21.js'));
ok('legacy extras worldscale loader removed',!has(index,'<script src="worldscale_progression_v11_34.js'));

// Core patch anchors against current game/world source.
ok('game AREAS/TREE anchor',match(game,/const AREAS=\[[\s\S]*?\n\];\n\nconst TREE=/));
ok('game TREE/NODES anchor',match(game,/const TREE=\{[\s\S]*?\n\};\n\nconst NODES=/));
ok('game SKILLS/PLANS anchor',match(game,/const SKILLS=\[[\s\S]*?\n\];\n\nconst PLANS=/));
ok('game KEY anchor',has(game,"const KEY='xianxia_proto_v11';"));
ok('game fresh cult anchor',has(game,'cult:{atk:1,mov:1,sen:1,hp:1}'));
ok('game realm/combat anchor',match(game,/const realmPower=\(\)=>isMortal\(\)\?\.42:1\+M\.realm\.major\*1\.18\+\(M\.realm\.stage-1\)\*\.11;\nconst combatPower=\(\)=>realmPower\(\)\*\(1\+\(run\?\.combo\|\|0\)\*\.045\);/));
ok('game actor/spawn anchor',match(game,/function actor\(type,options=\{\}\)\{[\s\S]*?\n\}\n\nfunction spawnBeast\(\)\{/));
ok('game spawn/vein anchor',match(game,/function spawnBeast\(\)\{[\s\S]*?\n\}\n\nfunction setupVein\(\)\{/));
ok('game vein/begin anchor',match(game,/function setupVein\(\)\{[\s\S]*?\n\}\n\nfunction begin\(\)\{/));
ok('game reward/cast anchor',match(game,/function reward\(enemy\)\{[\s\S]*?\n\}\n\nfunction cast\(skill\)\{/));
ok('game cast/move anchor',match(game,/function cast\(skill\)\{[\s\S]*?\n\}\n\nfunction moveToward/));
ok('game update/fortune anchor',match(game,/function updateHazards\(dt\)\{[\s\S]*?\n\}\n\nfunction update\(dt\)\{[\s\S]*?\n\}\n\nfunction fortune/));
ok('world eval anchor',has(world,'(0,eval)(`${game}\\n//# sourceURL=game_v11.worldscale.js`);'));

// Progression anchors.
ok('progression TRAIN anchor',match(progression,/const TRAIN=\[[\s\S]*?\n\];\nconst NODE=/));
ok('progression area unlock anchor',match(progression,/const AREA_UNLOCKS=\{[^\n]*\};/));
ok('progression ensure anchor',match(progression,/function ensure\(M\)\{[^\n]*return M\}/));
ok('progression breakthrough anchor',match(progression,/function breakthroughCost\(i\)\{[^\n]*\}/));
ok('progression affinity cost anchor',match(progression,/function affinityCost\(M,a,n\)\{[^\n]*\}/));
ok('progression canAffinity anchor',match(progression,/function canAffinity\(M,a,n\)\{[^\n]*\}/));
ok('progression canUnlockArea anchor',match(progression,/function canUnlockArea\(M,id\)\{[^\n]*\}/));
ok('progression legacy BALANCE anchor',match(progression,/const BALANCE=\{[\s\S]*?function bindRunBalance\(\)\{[^\n]*\}\nconst PRESETS=/));

// UI/system/extras anchors.
ok('ui cap/cost anchor',match(uiOriginal,/cap=\(m,s\)=>[^;]+;cost=\(s,k,n\)=>\{[^;]+;return\{[^}]+\}\};/));
ok('ui 3-branch node anchor',has(uiOriginal,"const ps=ups(p),keys=['pow','range','cycle'],nm=['위력',s.id==='chain'?'타수':'범위','순환'];"));
ok('ui unlock anchor',has(uiOriginal,"m.skills[id]||={u:0,pow:0,range:0,cycle:0};m.skills[id].u=1;"));
ok('systems21 breakthrough anchor',match(sysOriginal,/function breakthroughCost\(i\)\{[\s\S]*?\n\}/));
ok('extras array anchor',match(extrasOriginal,/const EXTRA=\[[\s\S]*?\n\];\nconst POS=/));
ok('extras 700x460 canvas anchor',has(extrasOriginal,'c.width=700;c.height=460;'));

// Assert the patch files themselves contain the key intended v0.1 data.
ok('core qingyun 70/22',has(core,"qingyun:{hp:70,hit:22"));
ok('core thunder 1300/300',has(core,"thunder:{hp:1300,hit:300"));
ok('core 25s left untouched via original',has(game,'const RUN_TIME=25;'));
ok('progression q9 total nodes new',has(prog,"T('q9_harmony','사법조화'"));
ok('progression f1 cost model',has(prog,"T('f1_harmony','진원순환'"));
ok('UI single-rank wording',has(ui,"keys=['pow'],nm=['숙련']"));
ok('extras disabled',has(extras,'const EXTRA=[];'));

if(failures){console.error(`\n${failures} validation failure(s)`);process.exit(1)}
console.log('\nBalance patch anchors validated.');
