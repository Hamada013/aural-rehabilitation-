// Writes lessons/<lesson>/sounds/sounds.txt from that lesson's data.js, so the recording list always matches the game.
// Usage: node scripts/sounds-list.cjs            (all lessons)
//        node scripts/sounds-list.cjs --check    (fail if any list is out of date)
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const lessons=fs.readdirSync(path.join(root,'lessons'),{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name);
function list(dir){
 const w={};new Function('window',fs.readFileSync(path.join(root,'lessons',dir,'data.js'),'utf8'))(w);
 const data=Object.values(w)[0];if(!data?.sounds)return null;
 const lines=[`Sounds for lesson ${dir}`,'Record each line as sounds/<number>.m4a (for example 1.m4a). Missing files use the device voice until you add them.','Online, new files are picked up automatically; once played they also work offline.',''];
 for(const s of data.sounds)lines.push(`${s.n}.m4a\t${s.text}\t(${s.use})`);
 return lines.join('\n')+'\n';
}
let stale=0;
for(const dir of lessons){
 const text=list(dir);if(text==null)continue;
 const out=path.join(root,'lessons',dir,'sounds','sounds.txt');
 if(process.argv.includes('--check')){if(!fs.existsSync(out)||fs.readFileSync(out,'utf8')!==text){console.error('out of date: '+out);stale++;}}
 else{fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,text);console.log('wrote '+path.relative(root,out));}
}
process.exit(stale?1:0);
