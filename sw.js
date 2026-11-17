const CACHE='dieta-v3';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
const store=(req,r)=>{if(r.ok||r.type==='opaque'){const c=r.clone();caches.open(CACHE).then(ch=>ch.put(req,c))}return r};
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(e.request).then(r=>store(e.request,r)).catch(()=>caches.match(e.request).then(h=>h||caches.match('./index.html'))));
  }else if(/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).then(r=>store(e.request,r))));
  }
});
