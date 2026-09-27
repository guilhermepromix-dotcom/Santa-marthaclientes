const VERSION='sm-2026-09-26-pedidos-orcamentos-2';
const STATIC_CACHE=VERSION+'-static';
const CORE=['/','/index.html'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(STATIC_CACHE).then(c=>c.addAll(CORE)).catch(()=>{}));});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const k of await caches.keys())if(k!==STATIC_CACHE)await caches.delete(k);await self.clients.claim();})());});
self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const u=new URL(event.request.url);
  if(u.origin!==location.origin)return;
  if(event.request.mode==='navigate'||u.pathname==='/'||u.pathname==='/index.html'||u.pathname==='/manifest.webmanifest'||u.pathname==='/sw.js'){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(STATIC_CACHE).then(c=>c.put(event.request,copy));return r;}).catch(()=>caches.match(event.request).then(r=>r||caches.match('/index.html'))));
    return;
  }
  event.respondWith(fetch(event.request,{cache:'no-cache'}).catch(()=>caches.match(event.request)));
});
