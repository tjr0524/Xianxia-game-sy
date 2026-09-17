const SW_BUILD='retired-11.45';

self.addEventListener('install',event=>{
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    try{
      const keys=await caches.keys();
      await Promise.all(keys.map(key=>caches.delete(key)));
    }catch(_){}
    try{await self.registration.unregister()}catch(_){}
  })());
});

// Intentionally no fetch handler.
// The game no longer uses a service worker for versioning or runtime updates.
