const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

class ClassList{
  constructor(){this.values=new Set()}
  add(...names){names.forEach(name=>this.values.add(name))}
  remove(...names){names.forEach(name=>this.values.delete(name))}
  contains(name){return this.values.has(name)}
}

class Element{
  constructor(){
    this.className='';
    this.classList=new ClassList();
    this.dataset={};
    this.children=[];
    this.disabled=false;
    this.textContent='';
    this.innerHTML='';
    this.listeners=[];
  }
  addEventListener(type,handler,options){this.listeners.push({type,handler,options})}
  appendChild(child){this.children.push(child);return child}
  insertBefore(child,before){
    const index=this.children.indexOf(before);
    if(index<0)this.children.push(child);else this.children.splice(index,0,child);
    return child;
  }
  querySelector(selector){
    if(selector.startsWith('.')){
      const name=selector.slice(1);
      return this.children.find(child=>String(child.className).split(/\s+/).includes(name))||null;
    }
    return null;
  }
}

const viewport=new Element();
const detail=new Element();
const state={
  realm:{major:0,stage:2},
  trainingNodes:{q2a:1,q2b:1},
  stone:9999,
  herb:9999,
  herb2:9999,
  herb3:9999,
  events:{}
};
const trainingPath=[
  {name:'연기 1층',req:{major:0,stage:1},nodes:[{id:'q1a'},{id:'q1b'}]},
  {name:'연기 2층',req:{major:0,stage:2},nodes:[{id:'q2a'},{id:'q2b'}]},
  {name:'연기 3층',req:{major:0,stage:3},nodes:[{id:'q3a'},{id:'q3b'}]}
];
let breakthroughIndex=null;

global.window=global;
global.requestAnimationFrame=callback=>{callback();return 1};
global.document={
  querySelector(selector){
    if(selector==='#ascViewport')return viewport;
    if(selector==='#ascDetail')return detail;
    return null;
  },
  querySelectorAll(){return[]},
  createElement(){return new Element()}
};
function replaceState(){}
global.__xianxiaDebug={snapshot:()=>({M:state,phase:'home'}),replaceState};
global.__xianxiaProgression={
  trainingPath,
  costHtml:()=>'<span class="cost-chip">cost</span>',
  breakthroughStage:index=>{breakthroughIndex=index}
};

const code=fs.readFileSync(new URL('../systems_v11_21.js',`file://${__filename}`),'utf8');
vm.runInThisContext(code,{filename:'systems_v11_21.js'});

const binding=viewport.listeners.find(listener=>listener.type==='click');
assert.ok(binding,'stage viewport receives a click listener');
assert.equal(binding.options,true,'stage listener runs in capture phase before node stopPropagation');

const stage3={dataset:{nodeId:'stage-2'}};
binding.handler({target:{closest:()=>stage3}});

assert.match(detail.innerHTML,/연기 3층/,'clicking the stage 3 node opens stage 3 details');
assert.match(detail.innerHTML,/개방 가능/,'stage 3 direct selection reports that it can be unlocked');
const action=detail.children.find(child=>String(child.className).includes('detail-action'));
assert.ok(action,'stage 3 details contain the unlock action');
assert.equal(action.disabled,false,'stage 3 unlock action is enabled');
assert.equal(action.textContent,'연기 3층 개방');
action.onclick({stopPropagation(){}});
assert.equal(breakthroughIndex,2,'stage 3 action calls breakthrough for stage 3 directly');

console.log('v11.24 direct stage unlock: 8 assertions passed');
