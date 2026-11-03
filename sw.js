const CACHE='pocket-budget-shell-v7';
const FILES=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// Stale-while-revalidate: instant offline load, fresh copy fetched in the background for next open.
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(r,{ignoreSearch:true});
const net=fetch(r).then(res=>{if(res.status===200)c.put(r,res.clone());return res}).catch(()=>null);
if(hit){e.waitUntil(net);return hit}
return (await net)||(r.mode==='navigate'?c.match('./index.html'):Response.error())}))});
