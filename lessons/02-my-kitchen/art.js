'use strict';
/* Lesson 2 · مطبخي — original SVG pictures, in the same flat style as lesson 1 (navy outline, soft colours).
   Items and food are drawn on an 80×80 box so they can be placed inside bigger scenes with put(). */
(()=>{
const K='#22445a',W='#fffaf2',SK='#f6d1b4';
const st=`stroke="${K}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"`;
const thin=`stroke="${K}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"`;
const svg=(vb,body,cls='')=>`<svg class="art ${cls}" viewBox="${vb}" aria-hidden="true" focusable="false">${body}</svg>`;
const put=(body,x,y,s=1,r=0)=>`<g transform="translate(${x} ${y})${r?` rotate(${r} 40 40)`:''} scale(${s})">${body}</g>`;
// A curved arrow from (x1,y1) to (x2,y2) bending through (cx,cy), with a hand-drawn head.
function arrow(x1,y1,cx,cy,x2,y2){const a=Math.atan2(y2-cy,x2-cx),h=7,p=(d)=>`${(x2-h*Math.cos(a+d)).toFixed(1)} ${(y2-h*Math.sin(a+d)).toFixed(1)}`;
 return`<path d="M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}M${p(.5)}L${x2} ${y2}L${p(-.5)}" fill="none" ${st}/>`;}

/* ---------- kitchen things (80×80) ---------- */
const IT={
 bowl:`<path d="M8 32h64q-2 32-32 34Q10 64 8 32z" fill="#7cc4e6" ${st}/><path d="M10 32q30 9 60 0" fill="none" ${thin}/><path d="M28 66h24" ${st}/><path d="M18 42q4 12 14 16" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>`,
 cup:`<path d="M54 30h6q9 0 9 10t-9 10h-6" fill="none" ${st}/><path d="M16 20h38v36q0 10-10 10H26q-10 0-10-10z" fill="#ef8f8f" ${st}/><ellipse cx="35" cy="20" rx="19" ry="4" fill="#d96c6c" ${thin}/><path d="M22 30v22" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>`,
 fork:`<g transform="rotate(-40 40 40)"><rect x="36" y="38" width="8" height="38" rx="4" fill="#c7d0d8" ${st}/><path d="M30 6v20q0 12 10 12t10-12V6M37 6v22M43 6v22" fill="#dfe7ee" ${st}/></g>`,
 knife:`<g transform="rotate(-40 40 40)"><rect x="34" y="46" width="12" height="30" rx="5" fill="#a87b5a" ${st}/><path d="M34 46V10q12 2 12 20v16z" fill="#dfe7ee" ${st}/><circle cx="40" cy="56" r="1.8" fill="#fff"/><circle cx="40" cy="66" r="1.8" fill="#fff"/></g>`,
 oven:`<rect x="12" y="8" width="56" height="66" rx="4" fill="#fff" ${st}/><path d="M12 22h56" ${st}/><g fill="#3d4650"><circle cx="22" cy="15" r="3"/><circle cx="31" cy="15" r="3"/><circle cx="40" cy="15" r="3"/></g><rect x="19" y="30" width="42" height="30" rx="3" fill="#3d4650" ${st}/><rect x="23" y="34" width="34" height="22" rx="2" fill="#f4a259" opacity=".55"/><path d="M22 66h36" ${st}/>`,
 pan:`<rect x="46" y="38" width="30" height="8" rx="4" transform="rotate(35 46 42)" fill="#3d4650" ${thin}/><circle cx="32" cy="36" r="24" fill="#3d4650" ${st}/><circle cx="32" cy="36" r="19" fill="#5a6672"/><path d="M20 28q4-6 10-4" fill="none" stroke="#8a97a3" stroke-width="2.4" stroke-linecap="round"/>`,
 plate:`<ellipse cx="40" cy="42" rx="33" ry="22" fill="#fff" ${st}/><ellipse cx="40" cy="42" rx="21" ry="13" fill="#e8f4ec" ${thin}/><path d="M30 38l6-6M36 42l8-8" stroke="#b9dcc6" stroke-width="2" stroke-linecap="round"/>`,
 pot:`<path d="M14 32h52v26q0 10-10 10H24q-10 0-10-10z" fill="#4f9bd9" ${st}/><path d="M5 38h9M66 38h9" ${st}/><path d="M11 32q29-14 58 0z" fill="#7cb8ea" ${st}/><circle cx="40" cy="22" r="4" fill="#3d4650" ${st}/>`,
 fridge:`<rect x="20" y="4" width="40" height="72" rx="6" fill="#dfe7ee" ${st}/><path d="M20 30h40" ${st}/><path d="M27 12v11M27 38v18" ${st}/><path d="M50 40v26" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>`,
 sink:`<path d="M40 36V20q0-9 10-9t10 9v5" fill="none" stroke="#9aa7b2" stroke-width="6" stroke-linecap="round"/><circle cx="30" cy="31" r="4" fill="#9aa7b2" ${thin}/><circle cx="52" cy="31" r="4" fill="#9aa7b2" ${thin}/><path d="M6 38h68l-7 26q-2 6-8 6H21q-6 0-8-6z" fill="#c7d0d8" ${st}/><path d="M14 46h52" ${thin}/><g fill="#7cc4e6"><circle cx="60" cy="30" r="1.8"/><circle cx="60" cy="35" r="1.4"/></g>`,
 spoon:`<g transform="rotate(-40 40 40)"><rect x="36" y="38" width="8" height="38" rx="4" fill="#a87b5a" ${st}/><ellipse cx="40" cy="22" rx="12" ry="17" fill="#c7d0d8" ${st}/><path d="M35 14q2-4 6-4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g>`,
 salt:`<path d="M26 28h28v38q0 7-7 7H33q-7 0-7-7z" fill="#fff" ${st}/><path d="M28 28q0-15 12-15t12 15z" fill="#9aa7b2" ${st}/><g fill="${K}"><circle cx="36" cy="20" r="1.6"/><circle cx="44" cy="20" r="1.6"/><circle cx="40" cy="16" r="1.6"/></g><path d="M31 44h18M31 52h18" stroke="#dfe7ee" stroke-width="3" stroke-linecap="round"/>`,
 whisk:`<g transform="rotate(-35 40 40)"><rect x="36" y="48" width="8" height="28" rx="4" fill="#e5646e" ${st}/><path d="M40 48C24 42 26 6 40 4c14 2 16 38 0 44zM40 48C32 38 34 8 40 4c6 4 8 34 0 44" fill="none" ${thin}/></g>`,
 kettle:`<path d="M22 46L8 34" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M22 46L8 34" stroke="#ef8f8f" stroke-width="3.4" stroke-linecap="round"/><path d="M18 68l4-30q2-11 18-11t18 11l4 30z" fill="#ef8f8f" ${st}/><path d="M58 40q14-2 14-14t-12-10" fill="none" ${st}/><path d="M28 26q12-15 24 0" fill="none" ${st}/><circle cx="40" cy="22" r="4" fill="#3d4650"/><path d="M24 54h32" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>`,
 mitt:`<path d="M20 72V36q0-20 18-20 16 0 16 17v6l8-8q7-5 10 2 2 5-3 9L54 56v16z" fill="#f2c14e" ${st}/><path d="M20 62h34" ${st}/><path d="M26 30l20 20M26 42l18 18M36 22l16 16M24 52l8 8" stroke="#e0a92e" stroke-width="2"/>`,
 strainer:`<path d="M54 38l22-12" stroke="${K}" stroke-width="5" stroke-linecap="round"/><path d="M8 34h48q0 28-24 28T8 34z" fill="#c7d0d8" ${st}/><g fill="${K}"><circle cx="20" cy="42" r="1.6"/><circle cx="30" cy="46" r="1.6"/><circle cx="40" cy="42" r="1.6"/><circle cx="26" cy="53" r="1.6"/><circle cx="36" cy="54" r="1.6"/><circle cx="46" cy="49" r="1.6"/></g>`
};
const item=id=>svg('0 0 80 80',IT[id]||'','item-art');

/* ---------- food (80×80) ---------- */
const FD={
 chicken:`<path d="M48 40l14-10q4-8 10-4 5 3 1 9 7-1 7 6-1 6-9 3L54 50" fill="#fff" ${st}/><path d="M12 52Q6 28 26 20q20-6 30 14 4 10-6 20Q30 72 12 52z" fill="#c98a4b" ${st}/><path d="M22 34q8-6 16-2" fill="none" stroke="#e7b07a" stroke-width="3" stroke-linecap="round"/>`,
 banana:`<path d="M14 22q2 42 48 40 9-2 9-9-34 4-44-33z" fill="#f7d54a" ${st}/><path d="M24 30q6 22 34 28" fill="none" stroke="#e0b52e" stroke-width="2"/><path d="M11 17l5 6" ${st}/>`,
 potato:`<path d="M12 44q-2-22 26-24 30-2 30 20 0 22-30 22Q14 62 12 44z" fill="#b68955" ${st}/><g fill="#7d5a35"><circle cx="28" cy="36" r="2"/><circle cx="46" cy="48" r="2"/><circle cx="54" cy="34" r="1.7"/><circle cx="34" cy="50" r="1.5"/></g>`,
 apple:`<path d="M40 26q-8-6-18-2-12 6-8 26 4 18 16 22 6 2 10-2 4 4 10 2 12-4 16-22 4-20-8-26-10-4-18 2z" fill="#e5646e" ${st}/><path d="M40 26q0-10 6-15" fill="none" ${st}/><path d="M45 16q10-7 17 0-8 7-17 0z" fill="#6cc08b" ${thin}/><path d="M24 36q-2 8 2 14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/>`,
 carrot:`<path d="M56 24q10-14 20-10-4 10-16 14M58 26q14-4 18 6-10 4-18-4" fill="#6cc08b" ${thin}/><path d="M60 26L18 68q-5 3-5-2l36-46q7-5 11 6z" fill="#f08a3c" ${st}/><path d="M30 48l6 4M40 38l6 4M23 58l4 3" fill="none" ${thin}/>`,
 cucumber:`<g transform="rotate(-18 40 40)"><rect x="6" y="28" width="68" height="24" rx="12" fill="#5fae6e" ${st}/><path d="M16 36h46M20 44h40" stroke="#4a9258" stroke-width="2" stroke-linecap="round"/><g fill="#d8f0cf"><circle cx="22" cy="40" r="1.4"/><circle cx="38" cy="36" r="1.4"/><circle cx="54" cy="42" r="1.4"/></g></g>`
};
const food=id=>svg('0 0 80 80',FD[id]||'','food-art');

/* ---------- the cookie people (80×90) ---------- */
const COOKIE=`M40 6a13 13 0 0 1 10 21h7q15 0 15 10t-15 10h-3l10 25q3 10-5 12-7 1-10-7l-9-16-9 16q-3 8-10 7-8-2-5-12l10-25h-3Q8 47 8 37t15-10h7A13 13 0 0 1 40 6z`;
function cookie(kind='boy',face=true){
 let b=`<path d="${COOKIE}" fill="#d9a066" ${st}/>`;
 if(face)b+=`<circle cx="35" cy="17" r="2.2" fill="${K}"/><circle cx="45" cy="17" r="2.2" fill="${K}"/><path d="M34 23q6 5 12 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><g fill="#fff" ${thin}><circle cx="40" cy="38" r="2.4"/><circle cx="40" cy="46" r="2.4"/><circle cx="40" cy="54" r="2.4"/></g><path d="M14 36q2 2 0 4M66 36q-2 2 0 4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`;
 if(kind==='boy')b+=`<path d="M32 28l8 4 8-4v8l-8-4-8 4z" fill="#4f9bd9" ${thin}/>`;
 if(kind==='girl')b+=`<path d="M40 7l-9-5v10zM40 7l9-5v10z" fill="#f2a7b8" ${thin}/><circle cx="40" cy="7" r="2.6" fill="#e57f9a" ${thin}/><path d="M28 60q12 6 24 0" fill="none" stroke="#f2a7b8" stroke-width="3" stroke-linecap="round"/>`;
 return b;
}
const cookieArt=kind=>svg('0 0 80 92',cookie(kind),'cookie');

/* ---------- story scenes (160×110) ---------- */
const BIT={
 butter:`<path d="M10 52l14-12h40l-6 14H12z" fill="#ffb59a" ${thin}/><path d="M22 38h36v12H22z" fill="#f7e98e" ${st}/><path d="M22 38l6-6h36l-6 6z" fill="#fbf2b8" ${st}/><path d="M58 38l6-6v12l-6 6z" fill="#e8d870" ${st}/>`,
 sugar:`<path d="M16 72l4-44q2-8 20-8t20 8l4 44z" fill="#c7d6ff" ${st}/><path d="M18 30q22-8 44 0" fill="none" ${thin}/><rect x="24" y="44" width="32" height="12" rx="2" fill="#fff" ${thin}/><path d="M30 50h20" ${thin}/>`,
 flour:`<path d="M12 72q-4-30 8-40l-4-10q24-8 48 0l-4 10q12 10 8 40z" fill="#e9d6b3" ${st}/><path d="M20 22q20 8 40 0" fill="#fff" ${thin}/><rect x="24" y="44" width="32" height="12" rx="2" fill="#fff" ${thin}/><path d="M30 50h20" ${thin}/>`,
 eggs:`<path d="M8 42h64l-6 20H14z" fill="#c7d0d8" ${st}/><g fill="#fff" ${st}><ellipse cx="22" cy="38" rx="7" ry="9"/><ellipse cx="40" cy="38" rx="7" ry="9"/><ellipse cx="58" cy="38" rx="7" ry="9"/></g><path d="M26 42v20M44 42v20" ${thin}/>`,
 syrup:`<rect x="30" y="8" width="20" height="10" rx="2" fill="#a87b5a" ${st}/><path d="M28 18h24l6 12v40q0 4-4 4H26q-4 0-4-4V30z" fill="#dfe7ee" ${st}/><path d="M24 50h32v20q0 3-3 3H27q-3 0-3-3z" fill="#d7a24a"/><rect x="28" y="34" width="24" height="10" rx="2" fill="#fff" ${thin}/>`,
 microwave:`<rect x="4" y="16" width="72" height="48" rx="5" fill="#fff" ${st}/><rect x="10" y="22" width="44" height="36" rx="3" fill="#9aa7b2" ${st}/><path d="M18 30l14-4M18 40l22-8" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/><circle cx="66" cy="30" r="5" fill="#dfe7ee" ${thin}/><circle cx="66" cy="44" r="5" fill="#dfe7ee" ${thin}/><rect x="61" y="52" width="10" height="5" rx="1" fill="#dfe7ee" ${thin}/>`,
 dough:`<path d="M8 50q-4-22 18-28 18-6 34 2 18 10 10 28-6 14-30 12Q10 64 8 50z" fill="#d9a066" ${st}/><path d="M34 34l-6 6 4 4-6 8h8l4-6 4 6h8l-6-8 4-4-6-6q-4 4-8 0z" fill="#fff" ${thin}/>`,
 pin:`<g transform="rotate(-28 40 40)"><rect x="4" y="34" width="14" height="10" rx="5" fill="#c9a98a" ${st}/><rect x="62" y="34" width="14" height="10" rx="5" fill="#c9a98a" ${st}/><rect x="16" y="28" width="48" height="22" rx="10" fill="#e8d3b9" ${st}/></g>`,
 tray:`<path d="M6 24h68l-4 40H10z" fill="#8f979e" ${st}/><path d="M12 30h56l-3 28H15z" fill="#a8b0b7"/>`,
 timer:`<path d="M14 64q-4-30 26-36 30 6 26 36z" fill="#eef2f5" ${st}/><circle cx="40" cy="50" r="10" fill="#fff" ${thin}/><path d="M40 50l6-4" ${st}/><path d="M36 28l4-6 4 6z" fill="#e5646e" ${thin}/>`,
 icing:`<g transform="rotate(-35 40 40)"><path d="M26 10h28v44l-8 10h-12l-8-10z" fill="#cfe0f7" ${st}/><path d="M34 64l6 12 6-12z" fill="#fff" ${st}/><path d="M26 16h28" ${thin}/></g>`
};
const P=BIT;
const SCENE={
 cover:()=>put(cookie('boy'),22,14,.98)+put(cookie('girl'),78,14,.98),
 ingredients:()=>put(P.sugar,2,8,.7)+put(P.flour,44,4,.78)+put(P.eggs,98,14,.66)+put(P.butter,18,58,.62)+put(P.syrup,108,48,.6),
 bowl:()=>put(P.butter,4,4,.55)+put(P.syrup,118,0,.5,25)+arrow(44,24,62,26,66,48)+arrow(118,22,100,22,94,48)+put(IT.bowl,44,36,.95),
 microwave:()=>put(P.microwave,52,0,.95)+arrow(48,86,30,66,52,50)+put(IT.bowl,6,64,.6),
 mix:()=>put(P.sugar,4,0,.5)+put(P.eggs,104,0,.62)+arrow(42,22,60,26,64,46)+arrow(116,30,100,30,96,48)+put(IT.bowl,40,34,.95)+put(IT.spoon,62,8,.7,-20),
 flour:()=>put(P.flour,0,4,.62)+put(IT.salt,122,10,.5)+arrow(50,28,64,30,66,50)+arrow(122,36,104,36,98,52)+put(IT.bowl,40,36,.95),
 dough:()=>put(P.dough,32,24,1.15)+put(P.pin,92,0,.8)+arrow(36,40,14,40,16,62)+put(cookie('',false),6,64,.42),
 tray:()=>put(P.tray,14,4,1.65)+[0,1,2,3,4,5].map(i=>put(cookie('',false),38+(i%3)*28+(i>2?8:0),52+(i>2?24:0),.28)).join(''),
 oven:()=>put(IT.oven,22,4,1.25)+put(P.timer,112,10,.5),
 decorate:()=>put(cookie('',false),8,26,.75)+put(P.icing,32,-2,.8)+arrow(76,74,92,90,104,72)+put(cookie('girl'),100,20,.75),
 run:()=>`<g class="runner-a">${put(cookie('girl'),12,18,.8)}</g><g class="runner-b">${put(cookie('boy'),88,8,.8)}</g><path d="M4 50h16M2 62h14M80 40h12M78 54h14" stroke="${K}" stroke-width="2" stroke-linecap="round" opacity=".5"/>`
};
const scene=id=>svg('0 0 160 110',(SCENE[id]||(()=>''))(),'scene');

/* ---------- chef's hat craft (240×150) ---------- */
const cuts=(x0,y0,n,step,len)=>Array.from({length:n},(_,i)=>`M${x0+step*(i+1)} ${y0}v${len}`).join('');
function strip(x,w,o={}){
 const back=o.back?'#eaf2f8':'#fff';let b=`<rect x="${x}" y="40" width="${w}" height="70" rx="3" fill="${back}" ${st}/>`;
 if(!o.back)b+=`<path d="M${x} 75h${w}" stroke="${K}" stroke-width="1.5" stroke-dasharray="5 4"/><path d="${cuts(x,40,Math.floor(w/20)-1,20,30)}" stroke="#9fbfd4" stroke-width="1.6" stroke-dasharray="4 4"/>`;
 return b;
}
function hatShape(x=70,y=8,s=1){return`<g transform="translate(${x} ${y}) scale(${s})"><path d="M14 70Q-6 66 4 44 0 22 24 22q6-18 26-14 20-10 34 6 22-2 22 22 12 18-10 34z" fill="#fff" ${st}/><path d="M30 40q2 16 0 30M50 34q2 20 0 36M72 36q-2 18 0 34" fill="none" stroke="#c9d6e2" stroke-width="2"/><rect x="12" y="68" width="88" height="24" rx="4" fill="#fff" ${st}/><path d="M20 76v10M34 76v10M48 76v10M62 76v10M76 76v10M90 76v10" stroke="#c9d6e2" stroke-width="2"/></g>`;}
function hatState(n){
 let b='';
 if(n<=0)b=strip(10,100)+strip(130,100);
 else if(n<=3){b=strip(10,110,{back:n===3})+strip(116,114,{back:n===3});if(n===2)b+=`<rect x="112" y="40" width="12" height="70" fill="#f7e98e" opacity=".85"/><path d="M118 34v-12" stroke="#e0a92e" stroke-width="3" stroke-linecap="round"/>`;}
 else if(n<=5){b=`<rect x="10" y="60" width="220" height="40" rx="3" fill="#fff" ${st}/><path d="M10 64h220" stroke="#c9d6e2" stroke-width="2"/>`;
  if(n===5)b+=`<path d="${cuts(10,60,10,20,26)}" ${st}/>`+Array.from({length:11},(_,i)=>`<path d="M${14+i*20} 60q6-8 12 0" fill="none" stroke="#c9d6e2" stroke-width="2"/>`).join('');}
 else if(n===6)b=hatShape(64,14,1.05);
 else if(n===8)b=hatShape(150,46,.72);
 return svg('0 0 240 150',b,'hatstate');
}

/* ---------- tools for the hat (48×48) ---------- */
const TOOL={
 join:`<rect x="4" y="16" width="24" height="16" rx="2" fill="#fff" ${st}/><rect x="20" y="16" width="24" height="16" rx="2" fill="#fff" ${st}/><path d="M20 16v16" stroke="#e0a92e" stroke-width="3"/>`,
 glue:`<rect x="16" y="18" width="16" height="26" rx="3" fill="#7cc4e6" ${st}/><rect x="18" y="8" width="12" height="10" rx="2" fill="#fff" ${st}/><rect x="20" y="4" width="8" height="5" rx="2" fill="#f7e98e" ${thin}/><rect x="19" y="26" width="10" height="8" rx="1" fill="#fff" ${thin}/>`,
 turn:`<rect x="10" y="14" width="28" height="20" rx="2" fill="#eaf2f8" ${st}/><path d="M8 10q16-10 32 0" fill="none" ${st}/><path d="M36 4l4 6-7 2" fill="none" ${st}/><path d="M40 38q-16 10-32 0" fill="none" ${st}/><path d="M12 44l-4-6 7-2" fill="none" ${st}/>`,
 fold:`<path d="M6 14h36v10H6z" fill="#fff" ${st}/><path d="M6 24h36l-4 10H10z" fill="#dfe7ee" ${st}/><path d="M24 40v-8M20 36l4-4 4 4" fill="none" ${st}/>`,
 cut:`<circle cx="12" cy="36" r="6" fill="#fff" stroke="#e5646e" stroke-width="3"/><circle cx="12" cy="14" r="6" fill="#fff" stroke="#e5646e" stroke-width="3"/><path d="M17 33L44 12M17 17l27 21" ${st}/><circle cx="24" cy="25" r="2" fill="${K}"/>`,
 wrap:`<circle cx="20" cy="24" r="14" fill="#f2c14e" ${st}/><circle cx="20" cy="24" r="6" fill="#fff" ${st}/><path d="M32 30l12 4v8l-14-4" fill="#f7e98e" ${st}/>`,
 puton:`<g transform="translate(6 14) scale(.32)">${'<path d="M14 70Q-6 66 4 44 0 22 24 22q6-18 26-14 20-10 34 6 22-2 22 22 12 18-10 34z" fill="#fff" stroke="#22445a" stroke-width="7"/><rect x="12" y="68" width="88" height="24" rx="4" fill="#fff" stroke="#22445a" stroke-width="7"/>'}</g><path d="M24 2v10M20 8l4 4 4-4" fill="none" ${st}/>`,
 takeoff:`<g transform="translate(6 16) scale(.32)">${'<path d="M14 70Q-6 66 4 44 0 22 24 22q6-18 26-14 20-10 34 6 22-2 22 22 12 18-10 34z" fill="#fff" stroke="#22445a" stroke-width="7"/><rect x="12" y="68" width="88" height="24" rx="4" fill="#fff" stroke="#22445a" stroke-width="7"/>'}</g><path d="M24 14V4M20 8l4-4 4 4" fill="none" ${st}/>`
};
const tool=id=>svg('0 0 48 48',TOOL[id]||'','tool-art');
const PLACE={
 edge:`<rect x="4" y="12" width="72" height="26" rx="2" fill="#fff" ${st}/><rect x="62" y="12" width="14" height="26" fill="#f7e98e" ${thin}/>`,
 middle:`<rect x="4" y="12" width="72" height="26" rx="2" fill="#fff" ${st}/><path d="M4 25h72" stroke="#e0a92e" stroke-width="4" stroke-dasharray="6 4"/>`,
 lines:`<rect x="4" y="12" width="72" height="26" rx="2" fill="#fff" ${st}/><path d="M16 12v13M28 12v13M40 12v13M52 12v13M64 12v13" stroke="#e5646e" stroke-width="3" stroke-linecap="round"/>`,
 together:`<path d="M10 30q30 22 60 0" fill="none" ${st}/><rect x="4" y="8" width="16" height="22" rx="2" fill="#fff" ${st}/><rect x="60" y="8" width="16" height="22" rx="2" fill="#fff" ${st}/><path d="M28 12h24M34 7l-6 5 6 5M46 7l6 5-6 5" fill="none" stroke="#e0a92e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
};
const hatPlace=id=>svg('0 0 80 50',PLACE[id]||'','place-art');

/* ---------- jobs: little chef hat, dice, box, buttons ---------- */
const miniHat=()=>svg('0 0 112 96',`<path d="M14 70Q-6 66 4 44 0 22 24 22q6-18 26-14 20-10 34 6 22-2 22 22 12 18-10 34z" fill="#fff" stroke="${K}" stroke-width="6" stroke-linejoin="round"/><rect x="12" y="68" width="88" height="24" rx="4" fill="#fff" stroke="${K}" stroke-width="6"/>`,'mini-hat');
const button=c=>{const hex=(window.MY_KITCHEN.buttons[c]||{hex:c}).hex;return svg('0 0 60 60',`<circle cx="30" cy="30" r="26" fill="${hex}" ${st}/><circle cx="30" cy="30" r="19" fill="none" stroke="#0003" stroke-width="2"/><g fill="#fff" ${thin}><circle cx="24" cy="24" r="3.4"/><circle cx="36" cy="24" r="3.4"/><circle cx="24" cy="36" r="3.4"/><circle cx="36" cy="36" r="3.4"/></g>`,'button-art');};
const box=()=>svg('0 0 140 90',`<path d="M10 30h120v52q0 4-4 4H14q-4 0-4-4z" fill="#d9a066" ${st}/><path d="M10 30l14-18h92l14 18z" fill="#c78e55" ${st}/><path d="M24 12l8 18M116 12l-8 18" ${thin}/><path d="M30 58h80" stroke="#b97d45" stroke-width="3" stroke-linecap="round"/>`,'box-art');

/* ---------- map picture ---------- */
function hero(){
 let b=`<rect x="4" y="150" width="292" height="80" rx="8" fill="#eaf2f8"/>`;
 b+=`<rect x="22" y="34" width="120" height="12" rx="4" fill="#a87b5a" ${st}/>`+[0,1,2].map(i=>put([IT.spoon,IT.whisk,IT.fork][i],26+i*36,40,.5,0)).join('');
 b+=put(IT.fridge,152,54,2.2);
 b+=`<rect x="14" y="138" width="182" height="16" rx="4" fill="#a87b5a" ${st}/><rect x="20" y="154" width="170" height="70" rx="4" fill="#fff" ${st}/><path d="M77 154v70M134 154v70M44 178h10M101 178h10M158 178h10" ${st}/>`;
 b+=put(IT.pot,30,90,.78)+`<path d="M52 88q-6-10 0-18M64 86q-6-10 0-18" fill="none" stroke="#c9d6e2" stroke-width="3" stroke-linecap="round" class="steam"/>`;
 b+=put(IT.kettle,120,84,.72)+put(IT.cup,88,108,.42);
 return svg('0 0 300 250',b,'kitchen-hero');
}

/* ---------- interface icons (outline, 24px) ---------- */
const UI={
 home:'<path d="M4 11 12 4l8 7v9H4z"/><path d="M10 20v-6h4v6"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
 close:'<path d="M6 6l12 12M18 6 6 18"/>',
 ear:'<path d="M8 18a3 3 0 0 0 5-2c.4-1.6 1.6-2.4 2.6-3.6A6 6 0 1 0 6 8"/><path d="M9 9.5a3 3 0 0 1 6 0c0 1.4-.9 2.2-1.7 2.8"/>',
 again:'<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/>',
 map:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
 next:'<path d="M15 5 8 12l7 7"/>',
 check:'<path d="M5 12.5 10 17 19 7"/>',
 star:'<path d="m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
 grid:'<path d="M4 5h16v14H4z"/><path d="M4 12h16M9.5 5v14M14.5 5v14"/>',
 book:'<path d="M12 6q-4-2-9-1v14q5-1 9 1 4-2 9-1V5q-5-1-9 1z"/><path d="M12 6v14"/>',
 hat:'<path d="M7 15q-4-1-3-5 0-4 5-4 1-3 4-3 3 0 4 3 5 0 5 4 1 4-3 5"/><path d="M7 15h10v5H7z"/>',
 dice:'<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="15" r="1"/><circle cx="15" cy="9" r="1"/><circle cx="9" cy="15" r="1"/>',
 repeat:'<path d="M12 4a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3z"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3"/>'
};
const icon=(id,cls='icon')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${UI[id]||''}</svg>`;

window.KITCHEN_ART={item,food,cookie:cookieArt,scene,hatState,hatShape:()=>svg('0 0 112 96',hatShape(0,0,1),'hat-art'),tool,hatPlace,miniHat,button,box,hero,icon,items:Object.keys(IT),foods:Object.keys(FD),scenes:Object.keys(SCENE),tools:Object.keys(TOOL),places:Object.keys(PLACE)};
})();
