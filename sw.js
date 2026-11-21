const C='kupdiyari-v5';
const DOSYA=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
// Kurulum: dosyaları tarayıcı önbelleğini atlayarak taze indir
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(DOSYA.map(u=>new Request(u,{cache:'reload'})))));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
// Oyun sayfası: internet varsa en yeni sürüm (ve önbelleğe yaz), yoksa kayıtlı sürüm. Diğer dosyalar: önce önbellek.
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
 const sayfa=e.request.mode==='navigate'||/\/(index\.html)?$/.test(new URL(e.request.url).pathname);
 if(sayfa){e.respondWith(fetch(e.request.url,{cache:'no-cache'}).then(res=>{const k=res.clone();caches.open(C).then(c=>c.put('./index.html',k));return res;}).catch(()=>caches.match('./index.html',{ignoreSearch:true})));return;}
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{const k=res.clone();caches.open(C).then(c=>c.put(e.request,k));return res;})));});
