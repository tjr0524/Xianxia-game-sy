const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const html=read('index.html');
const js=read('ui_polish_v11_38.js');
const css=read('ui_polish_v11_38.css');

assert.match(html,/ui_polish_v11_38\.css\?v=11\.39\.0/);
assert.match(html,/ui_polish_v11_38\.js\?v=11\.39\.0/);
assert.doesNotMatch(html,/balance_ui_v11_36\.js/,'broken legacy UI patch must stay disabled');
assert.ok(html.indexOf('ui_polish_v11_38.js')>html.indexOf('exploration_world_v11_33_4.js'),'polish must run after all renderers');

assert.match(js,/replace\(\/\\s\*후산\$\/,'\'\)/,'compact area names drop the suffix');
assert.match(js,/s\.id!=='basic'/,'basic attack is excluded from the spell list');
assert.match(js,/M\.skills\[id\]=\{u:1,pow:1,range:0,cycle:0\}/,'unlock starts at rank one');
assert.match(js,/map-point-glyph38/);
assert.match(js,/map-root-name38/);
assert.doesNotMatch(js,/undefined 0층/);
assert.match(js,/moveRecordsToExpedition/,'records move to the expedition screen');
assert.match(js,/installDetailPopover\('#ascViewport','#ascDetail','\.asc-node'\)/,'training detail becomes a popover');
assert.match(js,/installDetailPopover\('#mapViewport','#mapDetail','\.map-node'\)/,'map detail becomes a popover');

assert.match(css,/word-break:keep-all!important/,'area labels must not split by character');
assert.match(css,/\.expedition-area-grid>\.expedition-area-btn:only-child\{grid-column:1\/-1\}/,'single area fills the row');
assert.match(css,/panel\.active\[data-panel="skills"\][\s\S]*overflow-y:auto!important/,'mobile spellbook remains scrollable');
assert.match(css,/\.map-point-glyph38/);
assert.match(css,/\.detail-popover38\.v17float\.open\{display:block!important\}/);
assert.match(css,/\.expedition-records38/);

console.log('v11.39 UI polish: 19 assertions passed');
