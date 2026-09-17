const SW_BUILD='retired-11.47.2';

self.addEventListener('install',event=>{
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    try{
      const keys=await caches.keys();
      await Promise.all(keys.map(key=>caches.delete(key)));
    }catch(_){ }
    try{await self.registration.unregister()}catch(_){ }
  })());
});

// Intentionally no fetch handler. This worker only exists to replace and retire
// older caching/updater workers that could serve stale version.json data.
