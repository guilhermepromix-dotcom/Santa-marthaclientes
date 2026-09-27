const VERSION='sm-2026-09-27-offline-sync-1';
const STATIC_CACHE=VERSION+'-static';
const CORE=['/','/index.html','/manifest.webmanifest','/santa-martha-icon-v2.png','/icone.png','/print-logo.png'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(STATIC_CACHE).then(c=>c.addAll(CORE)).catch(()=>{}));});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const k of await caches.keys())if(k!==STATIC_CACHE)await caches.delete(k);await self.clients.claim();})());});
self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const u=new URL(event.request.url);
 if(u.origin===location.origin){
  if(event.request.mode==='navigate'||u.pathname==='/'||u.pathname==='/index.html'){
   event.respondWith(fetch(event.request,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(STATIC_CACHE).then(c=>c.put('/index.html',copy));return r;}).catch(()=>caches.match('/index.html')));return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(STATIC_CACHE).then(c=>c.put(event.request,copy))}return r})));return;
 }
 // Cacheia a biblioteca Supabase depois do primeiro uso online, permitindo reabrir o PWA offline.
 if(u.hostname==='cdn.jsdelivr.net'||u.hostname==='esm.sh')event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(r=>{if(r.ok||r.type==='opaque'){const copy=r.clone();caches.open(STATIC_CACHE).then(c=>c.put(event.request,copy))}return r})));
});
