// Fast checks: the app links nowhere back to the main website, the manifest is complete and every lesson is valid.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),root=path.resolve(__dirname,'..');
const walk=d=>fs.readdirSync(path.join(root,d),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
for(const f of ['index.html','manifest.webmanifest','sw.js',...walk('assets'),...walk('lessons').filter(f=>/\.(html|js|css|json)$/.test(f))])assert.doesNotMatch(fs.readFileSync(path.join(root,f),'utf8'),/speech-website|forms\.html|resources\.html/,f);
const m=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));for(const k of ['id','name','short_name','start_url','scope','display','icons'])assert.ok(m[k],k);
for(const i of m.icons){const b=fs.readFileSync(path.join(root,i.src));assert.equal(`${b.readUInt32BE(16)}x${b.readUInt32BE(20)}`,i.sizes,i.src);}
const ctx={window:{}};new Function('window',fs.readFileSync(path.join(root,'assets/lessons.js'),'utf8'))(ctx.window);const lessons=ctx.window.AURAL_LESSONS;
assert.ok(Array.isArray(lessons));const ids=new Set();for(const l of lessons){assert.ok(l.id&&l.title&&l.href,JSON.stringify(l));assert.ok(!ids.has(l.id),'duplicate '+l.id);ids.add(l.id);if(!/^https?:/.test(l.href))assert.ok(fs.existsSync(path.join(root,l.href.split('#')[0])),'missing '+l.href);}
// Each lesson's station list and goals in lessons.js must match the lesson's own data.js.
for(const l of lessons){assert.ok(Array.isArray(l.stations)&&l.stations.length,'stations '+l.id);const dir=path.dirname(path.join(root,l.href)),w={};
 if(fs.existsSync(path.join(dir,'data.js'))){new Function('window',fs.readFileSync(path.join(dir,'data.js'),'utf8'))(w);const d=Object.values(w)[0];if(d&&d.stations)assert.deepEqual(l.stations.map(s=>s.id),d.stations.map(s=>s.id),'stations differ for '+l.id);}
 const ids=l.stations.map(s=>s.id);for(const v of [1,2,3])for(const g of l.goals?.[v]?.items||[]){assert.ok(g.text,'goal text '+l.id);for(const s of g.stations||[])assert.ok(ids.includes(s),`goal station ${s} in ${l.id}`);}
 assert.ok(!l.cover||fs.existsSync(path.join(root,l.cover)),'missing cover '+l.cover);
 if(l.cover&&l.cover.endsWith('.svg'))assert.equal((fs.readFileSync(path.join(root,l.cover),'utf8').match(/<svg/g)||[]).length,1,'cover must have one <svg> (dev servers break nested ones): '+l.cover);}
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');for(const f of JSON.parse(sw.match(/SHELL=(\[[^\]]*\])/)[1].replace(/'/g,'"')))if(f!=='./')assert.ok(fs.existsSync(path.join(root,f)),'offline file missing '+f);
console.log(`PASS: stands alone, manifest and icons valid, ${lessons.length} lessons, offline files present.`);
