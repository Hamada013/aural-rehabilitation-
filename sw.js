/* Offline home shell. Bump VERSION when shell files change; lessons will add their own files later. */
const VERSION='home-1',PREFIX='aural:'+new URL(self.registration.scope).pathname+':',CACHE=PREFIX+VERSION;
const SHELL=['./','index.html','manifest.webmanifest','assets/styles.css','assets/app.js','assets/lessons.js','icons/logo.svg','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-180.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith(PREFIX)&&k!==CACHE)await caches.delete(k);await self.clients.claim();})()));
// Network first, so a new lesson appears as soon as it is published; the cache covers offline use.
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||!u.href.startsWith(self.registration.scope))return;
 e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return r;}).catch(async()=>await caches.match(e.request)||await caches.match(new URL('index.html',self.registration.scope).href)));});
