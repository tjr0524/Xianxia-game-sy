const SW_BUILD='11.44.0';

self.addEventListener('install',event=>{
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message',event=>{
  if(event.data?.type==='CLEAR_CACHES'){
    event.waitUntil((async()=>{
      const keys=await caches.keys();
      await Promise.all(keys.map(key=>caches.delete(key)));
    })());
  }
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;

  const bypass=req.mode==='navigate' ||
    req.destination==='script' ||
    req.destination==='style' ||
    req.destination==='worker' ||
    url.pathname.endsWith('/version.json') ||
    url.pathname.endsWith('/index.html');

  if(!bypass)return;

  event.respondWith((async()=>{
    try{
      return await fetch(new Request(req,{cache:'no-store'}));
    }catch(error){
      return fetch(req);
    }
  })());
});