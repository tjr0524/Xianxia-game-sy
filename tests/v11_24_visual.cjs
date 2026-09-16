const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const html=read('index.html');
const css=read('visual_v11_24.css');
const js=read('visual_v11_24.js');

assert.match(html,/<meta name="theme-color" content="#f4f2e9">/);
assert.match(html,/<body class="v24-theme">/);
assert.match(html,/<link id="v1124-theme"[^>]+visual_v11_24\.css\?v=11\.24/);
assert.match(html,/<script src="visual_v11_24\.js\?v=11\.24"><\/script>\s*<\/body>/);
assert.match(css,/:root\{[\s\S]*color-scheme:light/);
assert.match(css,/--v24-paper:#f4f2e9/);
assert.match(css,/body\.v24-theme\{[\s\S]*linear-gradient\(180deg,#fbfaf5/);
assert.match(css,/body\.v24-theme::after\{[\s\S]*clip-path:polygon/);
assert.match(css,/\.v24-theme \.card\{[\s\S]*rgba\(255,254,250/);
assert.match(css,/\.v24-theme \.dialog,[\s\S]*#fff/);
assert.match(css,/\.v24-theme \.controls\{[\s\S]*#fffefa/);
assert.match(css,/\.v24-theme \.asc-viewport,[\s\S]*#f9faf5/);
assert.match(css,/\.v24-theme \.asc-stage\.available[\s\S]*#fff2c9/);
assert.match(css,/\.v24-theme \.asc-leaf\.locked\{opacity:\.72/);
assert.match(css,/@media\(max-width:920px\)[\s\S]*\.v24-theme \.v22-close-handle/);
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
assert.match(js,/dataset\.visualVersion='11\.24'/);
assert.match(js,/document\.head\.appendChild\(theme\)/);
assert.doesNotMatch(js,/replaceState|localStorage|sessionStorage/);

let depth=0;
for(const char of css){
  if(char==='{')depth++;
  if(char==='}')depth--;
  assert.ok(depth>=0,'CSS closes no block before it opens');
}
assert.equal(depth,0,'CSS block braces are balanced');

console.log('v11.24 light visual regression: 20 assertions passed');
