/* Offline shell: the home page and every lesson's files. Bump VERSION when any of them change.
   Recorded sounds are cached the first time they play (they are added later, so they are not listed here). */
const VERSION='lessons-5',PREFIX='aural:'+new URL(self.registration.scope).pathname+':',CACHE=PREFIX+VERSION;
const SHELL=['./','index.html','manifest.webmanifest','assets/styles.css','assets/app.js','assets/lessons.js','assets/store.js','assets/kit.js','assets/fonts.css','assets/fonts/baloo-bhaijaan-2-arabic.woff2','assets/fonts/baloo-bhaijaan-2-latin.woff2','icons/logo.svg','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-180.png',
 'lessons/01-my-house/index.html','lessons/01-my-house/lesson.css','lessons/01-my-house/data.js','lessons/01-my-house/art.js','lessons/01-my-house/game.js','lessons/01-my-house/cover.svg',
 'lessons/02-my-kitchen/index.html','lessons/02-my-kitchen/lesson.css','lessons/02-my-kitchen/data.js','lessons/02-my-kitchen/art.js','lessons/02-my-kitchen/game.js','lessons/02-my-kitchen/cover.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith(PREFIX)&&k!==CACHE)await caches.delete(k);await self.clients.claim();})()));
// Network first, so a new lesson appears as soon as it is published; the cache covers offline use.
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||!u.href.startsWith(self.registration.scope))return;
 e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return r;}).catch(async()=>await caches.match(e.request)||await caches.match(new URL('index.html',self.registration.scope).href)));});
