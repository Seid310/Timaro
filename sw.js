const CACHE='timaro-pwa-v03-1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('timaro-pwa-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
if(req.mode==='navigate'){event.respondWith(fetch(req).then(response=>{if(!response.ok)throw new Error('Navigation unavailable');return response;}).catch(async()=>await caches.match('./index.html')||Response.error()));return;}
if(!ASSETS.some(path=>new URL(path,self.registration.scope).href===url.href))return;
event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));});
