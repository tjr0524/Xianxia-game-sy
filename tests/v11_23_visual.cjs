const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const html=read('index.html');
const css=read('visual_v11_23.css');
const js=read('visual_v11_23.js');

assert.match(html,/<link id="v1123-theme"[^>]+visual_v11_23\.css\?v=11\.23/);
assert.match(html,/<script src="visual_v11_23\.js\?v=11\.23"><\/script>\s*<\/body>/);
assert.match(css,/body\.v23-theme\[data-v23-area="blackwind"\]/);
assert.match(css,/body\.v23-theme\[data-v23-area="blood"\]/);
assert.match(css,/body\.v23-theme\[data-v23-area="thunder"\]/);
assert.match(css,/\.v23-theme \.controls\{[\s\S]*height:clamp\(650px,calc\(100dvh - 118px\),860px\)/);
assert.match(css,/@media\(max-width:920px\)[\s\S]*\.v23-theme \.controls\{/);
assert.match(css,/\.v23-theme \.v22-close-handle\{[\s\S]*height:34px!important/);
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
assert.match(css,/\.v23-theme \.v19-ach/);
assert.match(css,/\.v23-theme \.map-root\.current/);
assert.match(css,/\.v23-theme \.s17main\.ready/);
assert.match(js,/window\.__xianxiaVisualVersion='11\.23'/);
assert.match(js,/body\.dataset\.v23Area=area/);
assert.match(js,/body\.dataset\.v23Phase=phase/);
assert.match(js,/document\.head\.appendChild\(link\)/);
assert.doesNotMatch(js,/replaceState|localStorage|sessionStorage/);

let depth=0;
for(const char of css){
  if(char==='{')depth++;
  if(char==='}')depth--;
  assert.ok(depth>=0,'CSS closes no block before it opens');
}
assert.equal(depth,0,'CSS block braces are balanced');

console.log('v11.23 visual regression: 18 assertions passed');
