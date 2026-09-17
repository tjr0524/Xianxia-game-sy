const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const html=read('index.html');
const css=read('visual_v11_25.css');
const js=read('visual_v11_25.js');

assert.match(html,/<meta name="theme-color" content="#f3efe3">/);
assert.match(html,/<body class="v25-theme">/);
assert.match(html,/<link id="v1125-theme"[^>]+visual_v11_25\.css\?v=11\.25/);
assert.match(html,/<script src="visual_v11_25\.js\?v=11\.25"><\/script>\s*<\/body>/);
assert.doesNotMatch(html,/visual_v11_23\.js|visual_v11_24\.js/,'legacy visual JS layers are no longer executed');
assert.doesNotMatch(html,/id="v1123-theme"|id="v1124-theme"/,'legacy visual CSS layers are no longer linked');
assert.match(css,/Gowun\+Batang/,'body typeface is loaded from Google Fonts');
assert.match(css,/Hahmlet/,'display typeface is loaded from Google Fonts');
assert.match(css,/assets\/ink_mountains\.svg/,'ink mountain asset is used');
assert.match(css,/assets\/cloud_scroll\.svg/,'cloud ornament asset is used');
assert.match(css,/assets\/paper_fiber\.svg/,'paper texture asset is used');
assert.match(css,/\.v25-theme \.dialog button,[\s\S]*color:var\(--v25-ink\)!important/,'overlay buttons receive explicit readable text color');
assert.match(css,/\.v25-theme \.primary,[\s\S]*color:#fffdf3!important/,'primary action uses high-contrast light text');
assert.match(css,/\.v25-theme \.v17settings[\s\S]*color:#245d51!important/,'settings button has explicit contrast');
assert.match(css,/\.v25-theme #ascDetail\.v17float,[\s\S]*background:linear-gradient/,'floating details use paper cards');
assert.match(css,/\.v25-theme \.v17float \.node-effect[\s\S]*font:800 14px/,'node effect remains the visual emphasis');
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
assert.match(js,/dataset\.visualVersion='11\.25'/);
assert.match(js,/classList\.remove\('v23-theme','v24-theme'\)/);
assert.doesNotMatch(js,/replaceState|localStorage|sessionStorage/,'visual layer does not mutate progression or saves');

for(const asset of ['assets/ink_mountains.svg','assets/cloud_scroll.svg','assets/paper_fiber.svg']){
  assert.ok(fs.existsSync(path.join(root,asset)),`${asset} exists`);
}
let depth=0;
for(const char of css){
  if(char==='{')depth++;
  if(char==='}')depth--;
  assert.ok(depth>=0,'CSS closes no block before it opens');
}
assert.equal(depth,0,'CSS block braces are balanced');

console.log('v11.25 eastern visual regression: 23 assertions passed');
