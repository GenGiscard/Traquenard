/* Traquenard : réseau d'abord (toujours la dernière version), copie locale si pas de connexion.
   La base de données en ligne n'est jamais mise en cache. */
const CACHE='traquenard-v1';
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png']).catch(()=>{}))); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin) return;
  e.respondWith(fetch(e.request).then(r=>{ if(r.ok){ const c=r.clone(); caches.open(CACHE).then(k=>k.put(e.request,c)); } return r; })
    .catch(()=>caches.match(e.request).then(m=>m||caches.match('index.html'))));
});
