// Fast checks: the app links nowhere back to the main website, the manifest is complete and every lesson is valid.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),root=path.resolve(__dirname,'..');
const walk=d=>fs.readdirSync(path.join(root,d),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
for(const f of ['index.html','manifest.webmanifest','sw.js',...walk('assets'),...walk('lessons').filter(f=>/\.(html|js|css|json)$/.test(f))])assert.doesNotMatch(fs.readFileSync(path.join(root,f),'utf8'),/speech-website|forms\.html|resources\.html/,f);
const m=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));for(const k of ['id','name','short_name','start_url','scope','display','icons'])assert.ok(m[k],k);
for(const i of m.icons){const b=fs.readFileSync(path.join(root,i.src));assert.equal(`${b.readUInt32BE(16)}x${b.readUInt32BE(20)}`,i.sizes,i.src);}
const ctx={window:{}};new Function('window',fs.readFileSync(path.join(root,'assets/lessons.js'),'utf8'))(ctx.window);const lessons=ctx.window.AURAL_LESSONS;
assert.ok(Array.isArray(lessons));const ids=new Set();for(const l of lessons){assert.ok(l.id&&l.title&&l.href,JSON.stringify(l));assert.ok(!ids.has(l.id),'duplicate '+l.id);ids.add(l.id);if(!/^https?:/.test(l.href))assert.ok(fs.existsSync(path.join(root,l.href.split('#')[0])),'missing '+l.href);}
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');for(const f of JSON.parse(sw.match(/SHELL=(\[[^\]]*\])/)[1].replace(/'/g,'"')))if(f!=='./')assert.ok(fs.existsSync(path.join(root,f)),'offline file missing '+f);
console.log(`PASS: stands alone, manifest and icons valid, ${lessons.length} lessons, offline files present.`);
