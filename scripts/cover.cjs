// Writes each lesson's cover.svg (its picture on the road map) from the lesson's own art.js.
// The file has a single <svg> (nested ones become <g transform>) and a fixed size, so every browser and
// dev server (e.g. VS Code Live Server, which injects a script before the first </svg>) shows it.
// Usage: node scripts/cover.cjs
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const LESSONS={
 '01-my-house':w=>w.HOUSE_ART.house({roof:'red',door:'blue',window:'yellow',curtain:'red',chimney:'brick'}),
 '02-my-kitchen':w=>w.KITCHEN_ART.hero()
};
for(const[dir,draw]of Object.entries(LESSONS)){
const d=path.join(root,'lessons',dir),w={};
for(const f of ['data.js','art.js'])new Function('window',fs.readFileSync(path.join(d,f),'utf8'))(w);
let s=draw(w);
s=s.replace(/ class="[^"]*"/g,'').replace(/ aria-hidden="true"| focusable="false"/g,'');
// Flatten nested <svg x y width height viewBox overflow="visible"> into transformed groups (innermost first).
const attr=(t,n)=>(t.match(new RegExp(`\\s${n}="([^"]*)"`))||[])[1];
for(;;){
 const m=s.match(/<svg(?![^>]*xmlns)([^>]*)>((?:(?!<svg)[\s\S])*?)<\/svg>/);
 if(!m||!attr(m[1],'x'))break;
 const[x,y,wd,ht]=['x','y','width','height'].map(n=>+attr(m[1],n)),[vx,vy,vw,vh]=attr(m[1],'viewBox').split(/\s+/).map(Number);
 s=s.replace(m[0],`<g transform="translate(${x} ${y}) scale(${+(wd/vw).toFixed(4)} ${+(ht/vh).toFixed(4)}) translate(${-vx} ${-vy})">${m[2]}</g>`);
}
// Only the outer <svg> is left: give it the namespace and a fixed size.
s=s.replace(/^<svg([^>]*)>/,(_,a)=>`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="250"${a}>`);
if((s.match(/<svg/g)||[]).length!==1)throw new Error('nested <svg> left in cover');
fs.writeFileSync(path.join(d,'cover.svg'),s+'\n');
console.log(`wrote lessons/${dir}/cover.svg`);
}
