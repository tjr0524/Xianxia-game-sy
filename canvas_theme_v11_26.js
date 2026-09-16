(()=>{
'use strict';
if(window.__xianxiaCanvasThemeVersion==='11.26')return;
window.__xianxiaCanvasThemeVersion='11.26';

const COLORS=new Map(Object.entries({
  // Qingyun / common background
  '#172e31':'#eef2e9',
  '#244d48':'#dce7dc',
  '#6b8f72':'#b6cbbb',
  '#081014':'#e2e7df',
  '#0a1518':'#c8d4ca',
  '#ffffff0b':'#536a6212',
  '#b6e2ca1c':'#5675682b',

  // Blackwind
  '#191f22':'#f1eee5',
  '#34342a':'#e3dccb',
  '#6d6042':'#c9b991',
  '#d9c48b17':'#8b74402b',

  // Blood
  '#291719':'#f3e7e1',
  '#532127':'#e5cbc5',
  '#8c493b':'#cba195',
  '#e8736230':'#a2554d35',

  // Thunder
  '#11182b':'#ececf2',
  '#24284b':'#d9dbe8',
  '#555c91':'#b6bdd5',
  '#d4dcff55':'#747fa43a',
  '#b8c3ff19':'#66739b28',

  // Return gate: keep it obvious on the pale ground
  '#8fe1b2':'#2e806b',
  '#b9efd0':'#245f51',

  // Pickups / veins on pale ground
  '#bfe8c2aa':'#497b59b8',
  '#b8d7ef':'#719fba',
  '#eef7ff':'#f8fcff',
  '#e7f0ff':'#405f72',

  // Player guidance
  '#8ac8dc2c':'#477d8238',
  '#d8e9c966':'#5979616e',

  // Light combat FX need more ink on a light battlefield
  '#eef6ff':'#7393a7',
  '#f4f6ff':'#58758a',
  '#9fdfff':'#4d91a5',
  '#c6d6ff':'#697fae',
  '#d7c8ff':'#796aa6',
  '#d6d5ff':'#7379a7',
  '#eef0ff':'#727aa1',
  '#f4f1ff':'#68709c'
}).map(([key,value])=>[key.toLowerCase(),value]));

function remap(value){
  if(typeof value!=='string')return value;
  return COLORS.get(value.toLowerCase())||value;
}

function descriptorFor(object,key){
  let proto=Object.getPrototypeOf(object);
  while(proto){
    const descriptor=Object.getOwnPropertyDescriptor(proto,key);
    if(descriptor)return descriptor;
    proto=Object.getPrototypeOf(proto);
  }
  return null;
}

function themeContext(ctx){
  if(!ctx||ctx.__xianxiaLightInkCanvas)return ctx;
  try{Object.defineProperty(ctx,'__xianxiaLightInkCanvas',{value:true})}catch{return ctx}

  for(const key of ['fillStyle','strokeStyle','shadowColor']){
    const descriptor=descriptorFor(ctx,key);
    if(!descriptor?.get||!descriptor?.set)continue;
    try{
      Object.defineProperty(ctx,key,{
        configurable:true,
        enumerable:descriptor.enumerable,
        get(){return descriptor.get.call(ctx)},
        set(value){descriptor.set.call(ctx,remap(value))}
      });
    }catch{}
  }

  const originalGradient=ctx.createLinearGradient?.bind(ctx);
  if(originalGradient){
    ctx.createLinearGradient=(...args)=>{
      const gradient=originalGradient(...args);
      const add=gradient.addColorStop.bind(gradient);
      gradient.addColorStop=(offset,color)=>add(offset,remap(color));
      return gradient;
    };
  }
  const originalRadial=ctx.createRadialGradient?.bind(ctx);
  if(originalRadial){
    ctx.createRadialGradient=(...args)=>{
      const gradient=originalRadial(...args);
      const add=gradient.addColorStop.bind(gradient);
      gradient.addColorStop=(offset,color)=>add(offset,remap(color));
      return gradient;
    };
  }
  return ctx;
}

const nativeGetContext=HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext=function(type,...args){
  const ctx=nativeGetContext.call(this,type,...args);
  return type==='2d'&&this.id==='cv'?themeContext(ctx):ctx;
};
})();
