/* Original illustrations for Lesson 1, drawn as inline SVG so they stay sharp on phones and iPads and work offline. */
(()=>{
const K='#22445a',W='#fffaf2',G='#cdeefa',SK='#f6d1b4';
const st=`stroke="${K}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"`;
const thin=`stroke="${K}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"`;
const svg=(vb,body,cls='')=>`<svg class="art ${cls}" viewBox="${vb}" aria-hidden="true" focusable="false">${body}</svg>`;
const hex=c=>(window.MY_HOUSE.colors[c]||{hex:c}).hex;

/* ---------- house pieces ---------- */
const P={
 roof:c=>`<path d="M6 76 110 6l104 70z" fill="${hex(c)}" ${st}/><g fill="none" stroke="#0003" stroke-width="2.2" stroke-linecap="round"><path d="M62 52q8 8 16 0M104 36q8 8 16 0M140 58q8 8 16 0M88 64q8 8 16 0"/></g><circle cx="110" cy="44" r="11" fill="${G}" ${st}/><path d="M110 33v22M99 44h22" ${thin}/>`,
 door:c=>`<rect x="2" y="2" width="36" height="64" rx="3" fill="${hex(c)}" ${st}/><path d="M8 18a12 11 0 0 1 24 0z" fill="${G}" ${thin}/><g fill="#0000001a" ${thin}><rect x="8" y="23" width="10" height="17" rx="1.5"/><rect x="22" y="23" width="10" height="17" rx="1.5"/><rect x="8" y="45" width="10" height="16" rx="1.5"/><rect x="22" y="45" width="10" height="16" rx="1.5"/></g><circle cx="33.5" cy="40" r="2.4" fill="#f8e3a3" ${thin}/>`,
 window:c=>`<rect x="2" y="2" width="36" height="33" rx="2" fill="${hex(c)}" ${st}/><rect x="6.5" y="6.5" width="12" height="24.5" rx="1.5" fill="${G}" ${thin}/><rect x="21.5" y="6.5" width="12" height="24.5" rx="1.5" fill="${G}" ${thin}/><path d="M9 14l6-5M24 14l6-5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><rect x="0.5" y="34" width="39" height="5" rx="1.5" fill="#e3e9ee" ${thin}/>`,
 curtain:c=>`<path d="M1 3h38" ${st}/><path d="M3 3h13q-4 15-1 27-6 4-12 6z" fill="${hex(c)}" ${thin}/><path d="M37 3H24q4 15 1 27 6 4 12 6z" fill="${hex(c)}" ${thin}/><path d="M7 7q1 10 0 22M11 6q0 10 1 20M33 7q-1 10 0 22M29 6q0 10-1 20" fill="none" stroke="#0002" stroke-width="1.2"/>`,
 chimney:c=>`<rect x="4" y="9" width="22" height="46" fill="${hex(c)}" ${st}/><rect x="1" y="3" width="28" height="8" rx="2" fill="${hex(c)}" ${st}/><path d="M4 21h22M4 33h22M4 45h22M15 11v10M10 21v12M20 21v12M15 33v12" fill="none" stroke="#0003" stroke-width="1.4"/>`
};
const PV={roof:'0 0 220 80',door:'0 0 40 68',window:'0 0 40 40',curtain:'0 0 40 40',chimney:'0 0 30 56'};
const piece=(part,color)=>svg(PV[part],part==='curtain'?`<rect x="5" y="4" width="30" height="31" rx="2" fill="${G}" opacity=".7"/>${P.curtain(color)}`:P[part](color),'piece');

// Where each part sits on the house (house viewBox 0 0 300 250).
const SLOT={roof:[40,40,220,80],chimney:[190,30,28,54],door:[130,162,40,68],windowA:[78,134,40,40],windowB:[182,134,40,40]};
const nest=(box,vb,body,cls='')=>`<g class="${cls}"><svg x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" viewBox="${vb}" overflow="visible">${body}</svg></g>`;
const ghost=(box,vb,shape)=>`<g class="slot">${nest(box,vb,shape)}</g>`;
function house(parts={},pop=''){
 const p=k=>parts[k],cls=k=>k===pop?'placed pop':'placed';
 let b=`<ellipse cx="150" cy="232" rx="140" ry="12" fill="#d7efdf"/>`;
 b+=`<g fill="#8fd0a5" ${thin}><circle cx="34" cy="214" r="16"/><circle cx="52" cy="206" r="14"/><circle cx="268" cy="214" r="16"/><circle cx="250" cy="206" r="14"/></g>`;
 b+=p('chimney')?nest(SLOT.chimney,PV.chimney,P.chimney(p('chimney')),cls('chimney'))+(p('roof')?`<g class="smoke" fill="#e7edf2"><circle cx="206" cy="22" r="6"/><circle cx="214" cy="12" r="7"/><circle cx="224" cy="4" r="6"/></g>`:''):ghost(SLOT.chimney,PV.chimney,`<rect x="4" y="3" width="22" height="52" rx="3"/>`);
 b+=`<rect x="62" y="112" width="176" height="118" rx="3" fill="${W}" ${st}/>`;
 b+=p('roof')?nest(SLOT.roof,PV.roof,P.roof(p('roof')),cls('roof')):ghost(SLOT.roof,PV.roof,`<path d="M6 76 110 6l104 70z"/>`);
 b+=p('door')?nest(SLOT.door,PV.door,P.door(p('door')),cls('door')):ghost(SLOT.door,PV.door,`<rect x="2" y="2" width="36" height="64" rx="3"/>`);
 b+=`<rect x="122" y="229" width="56" height="7" rx="2" fill="#dfe5ea" ${thin}/>`;
 for(const w of ['windowA','windowB']){
  b+=p('window')?nest(SLOT[w],PV.window,P.window(p('window')),cls('window')):ghost(SLOT[w],PV.window,`<rect x="2" y="2" width="36" height="35" rx="2"/>`);
  if(p('curtain'))b+=nest(SLOT[w],PV.curtain,P.curtain(p('curtain')),cls('curtain'));
 }
 return svg('0 0 300 250',b,'house');
}

/* ---------- people ---------- */
const PEOPLE={
 dad:{hair:'short',hc:'#6b4a32',top:'#7f8c99',low:'pants',lc:'#4f6fa8',mus:1},
 mom:{hair:'long',hc:'#8a5a3b',top:'#e57f9a',low:'skirt',lc:'#5d8fd0'},
 grandpa:{hair:'bald',hc:'#e9e9e9',top:'#c9a35b',low:'pants',lc:'#7d6450',glasses:1},
 grandma:{hair:'bun',hc:'#f1f1f1',top:'#b49ad6',low:'dress',lc:'#b49ad6',glasses:1},
 boy:{hair:'short',hc:'#4b3a2a',top:'#6cc08b',low:'pants',lc:'#4f7fc0',kid:.8},
 girl:{hair:'tails',hc:'#e0b04f',top:'#e5646e',low:'dress',lc:'#e5646e',kid:.76}
};
function person(id){
 const o=PEOPLE[id],k=o.kid||1;let b='';
 if(o.hair==='long')b+=`<path d="M15 30q0-18 15-18t15 18v24H15z" fill="${o.hc}" ${thin}/>`;
 if(o.low==='pants')b+=`<rect x="21" y="86" width="8" height="34" rx="3" fill="${o.lc}" ${thin}/><rect x="31" y="86" width="8" height="34" rx="3" fill="${o.lc}" ${thin}/>`;
 else b+=`<rect x="23" y="96" width="5" height="24" fill="${SK}" ${thin}/><rect x="32" y="96" width="5" height="24" fill="${SK}" ${thin}/>`;
 b+=`<ellipse cx="24" cy="121" rx="6" ry="3.5" fill="#4a4f57"/><ellipse cx="36" cy="121" rx="6" ry="3.5" fill="#4a4f57"/>`;
 b+=`<rect x="11" y="50" width="8" height="34" rx="4" fill="${o.top}" ${thin}/><rect x="41" y="50" width="8" height="34" rx="4" fill="${o.top}" ${thin}/><circle cx="15" cy="86" r="4" fill="${SK}" ${thin}/><circle cx="45" cy="86" r="4" fill="${SK}" ${thin}/>`;
 if(o.low==='skirt')b+=`<path d="M18 80h24l6 20H12z" fill="${o.lc}" ${thin}/>`;
 if(o.low==='dress')b+=`<path d="M19 48h22l8 52H11z" fill="${o.lc}" ${thin}/>`;
 else b+=`<rect x="18" y="46" width="24" height="42" rx="8" fill="${o.top}" ${thin}/>`;
 b+=`<rect x="26" y="40" width="8" height="8" fill="${SK}"/><circle cx="30" cy="29" r="13" fill="${SK}" ${thin}/>`;
 if(o.hair==='short')b+=`<path d="M17 28q-1-14 13-15 14 1 13 15-4-7-13-7t-13 7z" fill="${o.hc}" ${thin}/>`;
 if(o.hair==='long')b+=`<path d="M17 28q-1-14 13-15 14 1 13 15-6-8-13-8t-13 8z" fill="${o.hc}" ${thin}/>`;
 if(o.hair==='bald')b+=`<path d="M17 30q-2-8 3-10M43 30q2-8-3-10" fill="none" stroke="${o.hc}" stroke-width="5" stroke-linecap="round"/>`;
 if(o.hair==='bun')b+=`<circle cx="30" cy="12" r="6" fill="${o.hc}" ${thin}/><path d="M17 28q-1-13 13-14 14 1 13 14-5-6-13-6t-13 6z" fill="${o.hc}" ${thin}/>`;
 if(o.hair==='tails')b+=`<circle cx="14" cy="26" r="6" fill="${o.hc}" ${thin}/><circle cx="46" cy="26" r="6" fill="${o.hc}" ${thin}/><path d="M17 28q-1-14 13-15 14 1 13 15-5-7-13-7t-13 7z" fill="${o.hc}" ${thin}/>`;
 b+=`<circle cx="25.5" cy="30" r="1.7" fill="${K}"/><circle cx="34.5" cy="30" r="1.7" fill="${K}"/><path d="M25.5 35.5q4.5 3.5 9 0" fill="none" ${thin}/><circle cx="22" cy="34" r="2" fill="#f2a7b8" opacity=".6"/><circle cx="38" cy="34" r="2" fill="#f2a7b8" opacity=".6"/>`;
 if(o.glasses)b+=`<g fill="none" ${thin}><circle cx="25.5" cy="30" r="3.6"/><circle cx="34.5" cy="30" r="3.6"/><path d="M29 30h2"/></g>`;
 if(o.mus)b+=`<path d="M26 33.5q4-2 8 0" fill="none" stroke="${o.hc}" stroke-width="2.4" stroke-linecap="round"/>`;
 return svg('0 0 60 126',`<g transform="translate(30 126) scale(${k}) translate(-30 -126)">${b}</g>`,'person');
}

/* ---------- rooms and places (viewBox 0 0 160 100) ---------- */
const room=(wall,floor,body)=>svg('0 0 160 100',`<rect width="160" height="100" fill="${wall}"/><rect y="82" width="160" height="18" fill="${floor}"/>${body}`,'room');
const PLACE={
 kitchen:()=>room('#eef4f7','#d9cbb8',`<path d="M48 14h28l8 14H40z" fill="#c7d0d8" ${thin}/><rect x="56" y="4" width="12" height="10" fill="#c7d0d8" ${thin}/><path d="M18 34h4v12M26 34v14M30 34v10" ${thin}/><rect x="8" y="54" width="96" height="28" fill="#fff" ${thin}/><rect x="6" y="50" width="100" height="5" rx="1.5" fill="#a87b5a" ${thin}/><path d="M32 55v27M56 55v27M80 55v27M38 66h12M62 66h12" ${thin}/><rect x="48" y="44" width="22" height="6" fill="#59636e" ${thin}/><path d="M20 50v-6h16v6" fill="#4fb3b0" ${thin}/><rect x="112" y="26" width="38" height="56" rx="4" fill="#cfd8df" ${st}/><path d="M112 46h38M118 32v8M118 52v12" ${thin}/>`),
 bath:()=>room('#e1f1f5','#cfe3ea',`<g stroke="#ffffffaa" stroke-width="1.2"><path d="M0 20h160M0 40h160M0 60h160M30 0v82M70 0v82M110 0v82"/></g><path d="M136 82V18q0-6-6-6h-12" fill="none" ${st}/><path d="M112 10h12l-2 6h-8z" fill="#c7d0d8" ${thin}/><path d="M60 58h86v6q-4 16-20 16H80q-16 0-20-16z" fill="#fff" ${st}/><circle cx="96" cy="50" r="3" fill="#fff" ${thin}/><circle cx="104" cy="44" r="4" fill="#fff" ${thin}/><rect x="14" y="16" width="26" height="22" rx="10" fill="${G}" ${thin}/><path d="M12 50h30l-4 12H16z" fill="#fff" ${thin}/><rect x="20" y="62" width="18" height="20" fill="#c9a98a" ${thin}/>`),
 bedroom:()=>room('#fbe7ec','#d9c3b0',`<rect x="56" y="12" width="30" height="26" fill="${G}" ${thin}/><path d="M71 12v26" ${thin}/><path d="M54 10h34M54 10h8q-2 14 0 30h-8zM88 10h-8q2 14 0 30h8z" fill="#e57f9a" ${thin}/><rect x="10" y="44" width="8" height="38" rx="3" fill="#a87b5a" ${thin}/><rect x="16" y="60" width="78" height="16" rx="3" fill="#f2a7b8" ${st}/><rect x="90" y="56" width="6" height="26" rx="2" fill="#a87b5a" ${thin}/><ellipse cx="30" cy="57" rx="11" ry="5" fill="#fff" ${thin}/><g fill="#fff" opacity=".7"><circle cx="50" cy="68" r="1.6"/><circle cx="62" cy="64" r="1.6"/><circle cx="74" cy="69" r="1.6"/></g><rect x="112" y="24" width="38" height="58" rx="3" fill="#d6b99c" ${st}/><path d="M131 24v58" ${thin}/><circle cx="127" cy="52" r="1.6" fill="${K}"/><circle cx="135" cy="52" r="1.6" fill="${K}"/>`),
 living:()=>room('#e5f3e9','#d9cbb8',`<rect x="34" y="12" width="40" height="24" rx="2" fill="#fff" ${thin}/><path d="M38 32l10-10 8 8 6-5 8 7" fill="none" ${thin}/><rect x="16" y="44" width="76" height="22" rx="9" fill="#c9a37c" ${st}/><rect x="12" y="60" width="84" height="18" rx="7" fill="#d9b48f" ${st}/><path d="M22 78v4M86 78v4" ${st}/><rect x="110" y="34" width="40" height="28" rx="3" fill="#3a4552" ${st}/><rect x="114" y="38" width="32" height="20" rx="2" fill="#6b7f92"/><rect x="114" y="66" width="32" height="16" rx="2" fill="#a87b5a" ${thin}/><path d="M104 82V70" ${thin}/>`),
 kids:()=>room('#fdf0dc','#d9cbb8',`<path d="M12 16v66M62 16v66" ${st}/><rect x="12" y="30" width="50" height="9" rx="2" fill="#f4a259" ${thin}/><rect x="12" y="62" width="50" height="9" rx="2" fill="#f4a259" ${thin}/><path d="M54 30v-14M54 39v23" ${thin}/><path d="M66 40v42M76 40v42M66 50h10M66 60h10M66 70h10" ${thin}/><rect x="96" y="54" width="54" height="5" rx="1.5" fill="#a87b5a" ${thin}/><path d="M102 59v23M144 59v23" ${thin}/><circle cx="114" cy="42" r="10" fill="#7cc4e6" ${thin}/><path d="M106 38q8 4 16 0M114 32v20" fill="none" ${thin}/><circle cx="88" cy="74" r="8" fill="#f08a3c" ${thin}/><path d="M80 74h16M88 66v16" ${thin}/>`),
 baby:()=>room('#fce9f0','#e3cbb8',`<path d="M40 6v8" ${thin}/><path d="M26 14h28" ${thin}/><path d="M26 14v6M54 14v6M40 14v8" ${thin}/><circle cx="26" cy="22" r="3" fill="#f2c14e"/><circle cx="54" cy="22" r="3" fill="#7cc4e6"/><path d="M37 24l3 3 3-3-3-3z" fill="#e5646e"/><rect x="14" y="42" width="56" height="34" rx="3" fill="none" ${st}/><path d="M14 58h56M22 42v34M30 42v34M38 42v34M46 42v34M54 42v34M62 42v34M16 76v6M68 76v6" ${thin}/><rect x="15" y="58" width="54" height="8" fill="#f2a7b8"/><path d="M96 80q18 6 36 0" fill="none" ${st}/><path d="M104 78l4-18h18l4 18M108 60q-2-14 8-16 10-2 12 6l-6 2" fill="#f6e2c3" ${thin}/><circle cx="140" cy="74" r="6" fill="#b98a64" ${thin}/><circle cx="140" cy="64" r="5" fill="#b98a64" ${thin}/>`),
 garage:()=>svg('0 0 160 100',`<rect width="160" height="100" fill="#e3f1f8"/><rect y="84" width="160" height="16" fill="#9fd3a8"/><path d="M22 40 80 12l58 28" fill="#e5646e" ${st}/><rect x="30" y="38" width="100" height="46" fill="#fff" ${st}/><rect x="46" y="48" width="68" height="36" fill="#9aa7b2" ${st}/><path d="M46 56h68M46 64h68M46 72h68" ${thin}/><path d="M42 84h76l6 8H36z" fill="#b8c1c9" ${thin}/>`,'room'),
 garden:()=>svg('0 0 160 100',`<rect width="160" height="100" fill="#e8f5fb"/><circle cx="134" cy="20" r="11" fill="#f6d266" ${thin}/><g fill="#fff" ${thin}><path d="M6 80V48l5-6 5 6v32M22 80V48l5-6 5 6v32M128 80V48l5-6 5 6v32M144 80V48l5-6 5 6v32"/></g><path d="M0 62h160" ${thin}/><rect x="74" y="44" width="8" height="38" fill="#a87b5a" ${thin}/><circle cx="78" cy="34" r="20" fill="#8fd0a5" ${st}/><rect y="78" width="160" height="22" fill="#9fd3a8"/><g ${thin}><path d="M40 80V68M52 80V66M104 80V68M116 80V66"/><circle cx="40" cy="66" r="4" fill="#f2a7b8"/><circle cx="52" cy="64" r="4" fill="#f6d266"/><circle cx="104" cy="66" r="4" fill="#e5646e"/><circle cx="116" cy="64" r="4" fill="#fff"/></g>`,'room')
};
function roof(){return svg('0 0 320 46',`<path d="M4 44 160 3l156 41z" fill="#ef8f8f" ${st}/><path d="M120 26q7 6 14 0M180 22q7 6 14 0M70 36q7 6 14 0M232 36q7 6 14 0" fill="none" stroke="#0002" stroke-width="2"/>`,'roofbar');}

/* ---------- objects (viewBox 0 0 80 80) ---------- */
const OBJ={
 pan:`<rect x="46" y="38" width="30" height="8" rx="4" transform="rotate(35 46 42)" fill="#3d4650" ${thin}/><circle cx="32" cy="36" r="24" fill="#3d4650" ${st}/><circle cx="32" cy="36" r="19" fill="#505b66"/><path d="M18 30q4-8 10-2 5 6-2 10-8 2-8-8z" fill="#fff"/><circle cx="23" cy="32" r="4" fill="#f4a259"/><path d="M33 40q6-8 12-2 4 7-3 9-9 2-9-7z" fill="#fff"/><circle cx="39" cy="42" r="4" fill="#f4a259"/>`,
 soap:`<rect x="20" y="30" width="40" height="44" rx="10" fill="#9bd6e8" ${st}/><rect x="33" y="20" width="14" height="10" fill="#7cc4e6" ${thin}/><path d="M28 14h24v6H28zM52 15h12v4" fill="#7cc4e6" ${thin}/><rect x="28" y="46" width="24" height="14" rx="4" fill="#fff" ${thin}/><g fill="#fff" ${thin}><circle cx="66" cy="38" r="5"/><circle cx="70" cy="52" r="3"/><circle cx="12" cy="44" r="4"/></g>`,
 brush:`<g transform="rotate(-35 40 40)"><rect x="6" y="36" width="52" height="9" rx="4.5" fill="#4f9bd9" ${st}/><rect x="56" y="30" width="18" height="10" rx="2" fill="#fff" ${thin}/><path d="M60 30v-4M64 30v-5M68 30v-4M72 30v-5" stroke="#7cc4e6" stroke-width="2.4" stroke-linecap="round"/></g>`,
 pillow:`<path d="M10 18q30-8 60 0 6 22 0 44-30 8-60 0-6-22 0-44z" fill="#f2a7b8" ${st}/><path d="M22 34q16 6 34 0M24 48q12 4 26 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
 tv:`<rect x="6" y="12" width="68" height="44" rx="5" fill="#3a4552" ${st}/><rect x="11" y="17" width="58" height="34" rx="2" fill="#6b7f92"/><path d="M16 44l14-14 10 10 8-6 16 10" fill="none" stroke="#a9d8f0" stroke-width="2"/><path d="M40 56v8M26 68h28" ${st}/>`,
 ball:`<circle cx="40" cy="40" r="28" fill="#f08a3c" ${st}/><path d="M12 40h56M40 12v56M20 20q14 20 0 40M60 20q-14 20 0 40" fill="none" ${thin}/>`,
 rattle:`<rect x="35" y="38" width="10" height="26" rx="4" fill="#c9a98a" ${thin}/><circle cx="40" cy="68" r="7" fill="none" stroke="#c9a98a" stroke-width="5"/><circle cx="40" cy="26" r="18" fill="#f2a7b8" ${st}/><path d="M24 20q16 8 32 0M24 32q16 8 32 0" fill="none" stroke="#fff" stroke-width="3"/><path d="M14 10l-4-4M66 10l4-4M40 4V0" ${thin}/>`,
 car:`<path d="M8 52v-10q0-6 6-7l10-2 8-12q3-3 8-3h12q6 0 9 4l8 11 6 1q7 1 7 8v10z" fill="#e5646e" ${st}/><path d="M34 22h9v12H26zM48 22h8l7 12H48z" fill="${G}" ${thin}/><circle cx="24" cy="54" r="8" fill="#3d4650" ${st}/><circle cx="58" cy="54" r="8" fill="#3d4650" ${st}/><circle cx="24" cy="54" r="3" fill="#c7d0d8"/><circle cx="58" cy="54" r="3" fill="#c7d0d8"/>`,
 can:`<path d="M20 30h34v34q0 6-6 6H26q-6 0-6-6z" fill="#9aa7b2" ${st}/><path d="M54 40l18-14" stroke="#9aa7b2" stroke-width="6" stroke-linecap="round"/><path d="M54 40l18-14" fill="none" ${thin}/><path d="M20 38q-12-2-10-14 2-8 12-4" fill="none" ${st}/><g fill="#7cc4e6"><circle cx="74" cy="34" r="2"/><circle cx="72" cy="42" r="2"/><circle cx="76" cy="48" r="2"/></g>`,
 table:`<path d="M6 30l12-10h50l8 10v20q-4 4-8 2-6 4-12 0-6 4-12 0-6 4-12 0-6 4-12 0-6 4-12 0-4 2-2-2z" fill="#e5646e" ${st}/><path d="M14 52v18M66 52v18" ${st}/><path d="M10 30h66" ${thin}/>`,
 chair:`<path d="M18 44V22q0-12 22-12t22 12v22" fill="#4fb391" ${st}/><rect x="8" y="38" width="14" height="28" rx="6" fill="#5cc4a0" ${st}/><rect x="58" y="38" width="14" height="28" rx="6" fill="#5cc4a0" ${st}/><rect x="20" y="44" width="40" height="14" rx="5" fill="#6dd0ad" ${st}/><path d="M20 58h40v10H20z" fill="#4fb391" ${thin}/><path d="M26 68v6M54 68v6M12 66v8M68 66v8" ${st}/>`,
 bear:`<circle cx="24" cy="16" r="7" fill="#b98a64" ${st}/><circle cx="56" cy="16" r="7" fill="#b98a64" ${st}/><ellipse cx="40" cy="56" rx="20" ry="18" fill="#b98a64" ${st}/><circle cx="40" cy="28" r="17" fill="#b98a64" ${st}/><ellipse cx="40" cy="34" rx="7" ry="5" fill="#f1dcc6"/><circle cx="40" cy="32" r="2.4" fill="${K}"/><circle cx="34" cy="25" r="1.8" fill="${K}"/><circle cx="46" cy="25" r="1.8" fill="${K}"/><ellipse cx="22" cy="70" rx="8" ry="6" fill="#c99d78" ${thin}/><ellipse cx="58" cy="70" rx="8" ry="6" fill="#c99d78" ${thin}/><ellipse cx="40" cy="58" rx="9" ry="8" fill="#d6b08e"/>`,
 bed:`<rect x="6" y="18" width="8" height="54" rx="3" fill="#a87b5a" ${st}/><rect x="66" y="34" width="8" height="38" rx="3" fill="#a87b5a" ${st}/><rect x="12" y="44" width="58" height="18" rx="3" fill="#f2a7b8" ${st}/><ellipse cx="24" cy="40" rx="10" ry="6" fill="#fff" ${st}/><path d="M34 44q14-8 34 0" fill="#f7c4d1" ${thin}/>`,
 tallwindow:`<rect x="18" y="10" width="44" height="62" rx="2" fill="#c9a98a" ${st}/><rect x="23" y="15" width="15" height="52" fill="${G}" ${thin}/><rect x="42" y="15" width="15" height="52" fill="${G}" ${thin}/><path d="M12 8h56" ${st}/><path d="M14 8h12q-4 30 2 54-8 4-14 6z" fill="#e57f9a" ${thin}/><path d="M66 8H54q4 30-2 54 8 4 14 6z" fill="#e57f9a" ${thin}/>`
};
const object=id=>OBJ[id]?svg('0 0 80 80',OBJ[id],'object'):id==='door'?svg('-10 -2 60 72',P.door('red'),'object'):PLACE[id]?PLACE[id]():'';

/* ---------- action icons (viewBox 0 0 48 48) ---------- */
const AC={
 sleep:`<path d="M30 10a15 15 0 1 0 10 24 13 13 0 0 1-10-24z" fill="#cfd9f5" ${st}/><path d="M30 8h7l-7 8h7" fill="none" ${thin}/>`,
 cook:`<path d="M8 22h32v10q0 8-8 8H16q-8 0-8-8z" fill="#4fb3b0" ${st}/><path d="M4 24h4M40 24h4M18 22v-3h12v3" ${st}/><path d="M18 14q-3-4 0-8M26 14q-3-4 0-8" fill="none" ${thin}/>`,
 play:`<rect x="6" y="22" width="16" height="16" rx="2" fill="#f2c14e" ${st}/><rect x="22" y="22" width="16" height="16" rx="2" fill="#7cc4e6" ${st}/><rect x="14" y="6" width="16" height="16" rx="2" fill="#e5646e" ${st}/>`,
 read:`<path d="M24 12q-8-4-18-2v26q10-2 18 2 8-4 18-2V10q-10-2-18 2z" fill="#fff" ${st}/><path d="M24 12v26M10 18h9M10 24h9M29 18h9M29 24h9" ${thin}/>`,
 bathe:`<path d="M6 26h36v4q0 10-10 10H16Q6 40 6 30z" fill="#fff" ${st}/><g fill="#cdeefa" ${thin}><circle cx="16" cy="18" r="5"/><circle cx="27" cy="14" r="6"/><circle cx="36" cy="20" r="4"/></g>`,
 watch:`<rect x="5" y="9" width="38" height="26" rx="3" fill="#3a4552" ${st}/><path d="M20 15v14l11-7z" fill="#fff"/><path d="M24 35v5M15 41h18" ${st}/>`,
 knock:`<rect x="20" y="6" width="22" height="38" rx="2" fill="#e5646e" ${st}/><circle cx="37" cy="26" r="1.8" fill="#f8e3a3"/><path d="M14 18q-4 6 0 12M8 14q-6 10 0 20" fill="none" ${thin}/>`,
 look:`<path d="M4 24q20-22 40 0-20 22-40 0z" fill="#fff" ${st}/><circle cx="24" cy="24" r="8" fill="#7cc4e6" ${st}/><circle cx="24" cy="24" r="3" fill="${K}"/>`,
 water:`<path d="M24 42V24" ${st}/><path d="M24 30q-12 0-12-12 12 0 12 12zM24 26q10 0 10-10-10 0-10 10z" fill="#8fd0a5" ${thin}/><path d="M14 44h20" ${st}/><g fill="#7cc4e6"><circle cx="38" cy="8" r="2"/><circle cx="42" cy="15" r="2"/><circle cx="34" cy="13" r="2"/></g>`,
 eat:`<circle cx="24" cy="26" r="15" fill="#fff" ${st}/><circle cx="24" cy="26" r="9" fill="none" ${thin}/><path d="M4 10v12M4 16h0M7 10v12M2 10v12M4 22v18" ${thin}/><path d="M44 10q-5 4-3 12v18" fill="none" ${thin}/>`,
 hug:`<path d="M24 40S6 29 6 17a9 9 0 0 1 18-3 9 9 0 0 1 18 3c0 12-18 23-18 23z" fill="#f2a7b8" ${st}/>`
};
const action=id=>svg('0 0 48 48',AC[id]||'','action');

/* ---------- interface icons (outline, 24px) ---------- */
const UI={
 home:'<path d="M4 11 12 4l8 7v9H4z"/><path d="M10 20v-6h4v6"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
 close:'<path d="M6 6l12 12M18 6 6 18"/>',
 ear:'<path d="M8 18a3 3 0 0 0 5-2c.4-1.6 1.6-2.4 2.6-3.6A6 6 0 1 0 6 8"/><path d="M9 9.5a3 3 0 0 1 6 0c0 1.4-.9 2.2-1.7 2.8"/>',
 again:'<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/>',
 map:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
 next:'<path d="M15 5 8 12l7 7"/>',prev:'<path d="M9 5l7 7-7 7"/>',
 check:'<path d="M5 12.5 10 17 19 7"/>',
 star:'<path d="m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
 build:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><rect x="10" y="14" width="4" height="6"/>',
 people:'<circle cx="8" cy="8" r="3"/><circle cx="16.5" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.2-6 5-6s5 2.5 5 6M13 20c0-3 1.5-5 3.5-5s3.5 2 3.5 5"/>',
 where:'<rect x="3" y="12" width="8" height="8" rx="2"/><path d="M13 4l8 7v9h-6"/><path d="M7 12V8a4 4 0 0 1 4-4"/><path d="m9 6 2-2 2 2"/>',
 book:'<path d="M12 6q-4-2-9-1v14q5-1 9 1 4-2 9-1V5q-5-1-9 1z"/><path d="M12 6v14"/>',
 repeat:'<path d="M12 4a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3z"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3"/>'
};
const icon=(id,cls='icon')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${UI[id]||''}</svg>`;

window.HOUSE_ART={house,piece,person,place:id=>PLACE[id]?PLACE[id]():'',roof,object,action,icon,parts:Object.keys(P)};
})();
