'use strict';
// Lesson 1 · بيتي. Four listening stations, three levels. Content lives in data.js, pictures in art.js.
(()=>{
const D=window.MY_HOUSE,A=window.HOUSE_ART;
const $=id=>document.getElementById(id);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
const others=(pool,not,n)=>shuffle(pool.filter(x=>!not.includes(x))).slice(0,n);
const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
document.querySelectorAll('[data-icon]').forEach(e=>e.insertAdjacentHTML('afterbegin',A.icon(e.dataset.icon)));

/* ---------- the kid playing and their saved progress (assets/store.js); no kid or a locked lesson goes back to the road map ---------- */
const Store=window.AURAL_STORE,LID='my-house',kid=Store.current();
if(!kid||!Store.unlocked(LID,1)){location.replace('../../index.html');return;}
const saved=Store.lesson(LID),save=Store.save,open=l=>Store.unlocked(LID,l);
const nextLesson=(()=>{const all=window.AURAL_LESSONS||[],i=all.findIndex(l=>l.id===LID);return all[i+1];})();
let level=[1,2,3].includes(saved.level)&&open(saved.level)?saved.level:1;
$('kid').textContent=kid.avatar;$('kid').title=kid.name;$('kid').setAttribute('aria-label',kid.name);

/* ---------- sound: recorded file first, then the device's Arabic voice, then a caption ---------- */
const SOUND=Object.fromEntries(D.sounds.map(s=>[s.key,s]));
const player=new Audio();player.preload='auto';
const files=new Map();
const SILENT='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
function file(n){
 if(!files.has(n))files.set(n,(async()=>{try{const r=await fetch(`sounds/${n}.m4a`);const t=r.headers.get('content-type')||'';if(!r.ok||t.includes('text/html'))return null;const b=await r.blob();return b.size?URL.createObjectURL(b):null;}catch{return null;}})());
 return files.get(n);
}
let voice=null;const pickVoice=()=>{try{voice=speechSynthesis.getVoices().find(v=>/^ar/i.test(v.lang))||null;}catch{voice=null;}};
if('speechSynthesis' in window){pickVoice();speechSynthesis.addEventListener?.('voiceschanged',pickVoice);}
let capTimer=0;
function caption(text){const c=$('caption');c.textContent=text;c.hidden=false;clearTimeout(capTimer);capTimer=setTimeout(()=>c.hidden=true,2600);}
function speak(text){return new Promise(res=>{if(!voice)pickVoice();
 if(!voice){caption(text);setTimeout(res,1500);return;}
 const u=new SpeechSynthesisUtterance(text);u.voice=voice;u.lang=voice.lang;u.rate=.85;u.onend=u.onerror=()=>res();
 speechSynthesis.speak(u);setTimeout(res,Math.max(2500,text.length*160));});}
async function sayOne(key){
 const s=SOUND[key];if(!s)return;
 const url=await file(s.n);
 if(url){player.src=url;await new Promise(res=>{player.onended=player.onerror=player.onpause=res;player.play().catch(res);});}
 else await speak(s.text);
}
let chain=0;
function hush(){chain++;player.pause();try{speechSynthesis.cancel();}catch{}document.body.classList.remove('speaking');}
async function say(...keys){
 hush();const me=chain;document.body.classList.add('speaking');
 for(const k of keys){if(me!==chain)return;await sayOne(k);}
 if(me===chain)document.body.classList.remove('speaking');
}
let ctx=null;
addEventListener('pointerdown',()=>{try{ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();ctx.resume();}catch{}player.src=SILENT;player.play().catch(()=>{});},{once:true,capture:true});
function tone(ok){if(!ctx)return;const t=ctx.currentTime;(ok?[660,880,1175]:[330,247]).forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain(),at=t+i*.09;o.type=ok?'sine':'triangle';o.frequency.value=f;g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(.14,at+.02);g.gain.exponentialRampToValueAtTime(.001,at+.3);o.connect(g).connect(ctx.destination);o.start(at);o.stop(at+.32);});}

const burst=window.AURAL_KIT.burst;

/* ---------- pictures and names for every kind of choice ---------- */
const ART={piece:id=>{const[p,c]=id.split(':');return A.piece(p,c);},person:A.person,action:A.action,object:A.object,place:A.place};
const NAME={piece:id=>{const[p,c]=id.split(':');return `${D.parts[p].name} ${D.colors[c].name}`;},person:id=>D.people[id].name,action:id=>D.actions[id].name,object:id=>D.objects[id].name,place:id=>D.places[id].name};
const card=(kind,id)=>`<button class="choice ${kind}" type="button" data-choice="${esc(id)}" aria-label="${esc(NAME[kind](id))}">${ART[kind](id)}</button>`;
const heldCard=h=>`<span class="held ${h.kind}" role="img" aria-label="${esc(NAME[h.kind](h.id))}">${ART[h.kind](h.id)}</span>`;

/* ---------- the four stations ---------- */
const stage=$('stage'),tray=$('tray');
let scene={};
const ST={
 build:{
  intro:'intro.build',
  rounds:()=>D.build[level].map(r=>{
   const c=r.color||D.parts[r.part].def,answer=`${r.part}:${c}`;let opts;
   if(level===2)opts=[answer,`${r.part}:${others(['red','blue','yellow','green'],[c],1)[0]}`,`${others(Object.keys(D.parts),[r.part],1)[0]}:${c}`];
   else opts=[answer,...others(Object.keys(D.parts),[r.part],2).map(p=>`${p}:${D.parts[p].def}`)];
   return{...r,color:c,say:[r.say],steps:[{kind:'piece',where:'tray',options:shuffle(opts),answer}]};
  }),
  init(){scene.parts={};stage.innerHTML=`<div class="house-wrap">${A.house(scene.parts)}</div>`;},
  async finish(r){scene.parts[r.part]=r.color;stage.innerHTML=`<div class="house-wrap">${A.house(scene.parts,r.part)}</div>`;await wait(700);}
 },
 who:{
  intro:'intro.who',showHeld:true,
  rounds:()=>shuffle(D.who[level]).map(r=>{
   const people=()=>shuffle([r.person,...others(Object.keys(D.people),[r.person],2)]),steps=[];let held=[];
   if(level===1){if(r.ask==='person')steps.push({kind:'person',where:'tray',options:people(),answer:r.person});else{held=[{kind:'person',id:r.person}];steps.push({kind:'place',where:'stage',answer:r.room});}}
   else{steps.push({kind:'person',where:'tray',options:people(),answer:r.person});
    if(level===3)steps.push({kind:'action',where:'tray',options:shuffle([r.action,...others(D.whoActions,[r.action],2)]),answer:r.action});
    steps.push({kind:'place',where:'stage',answer:r.room});}
   return{...r,say:[r.say],held,steps};
  }),
  init(){stage.innerHTML=`<div class="dollhouse">${A.roof()}<div class="rooms">${D.rooms.map(id=>`<button class="room" type="button" data-choice="${id}" aria-label="${esc(D.places[id].name)}" disabled>${A.place(id)}<span class="occupants"></span></button>`).join('')}</div></div>`;},
  async finish(r){
   const box=stage.querySelector(`.room[data-choice="${r.room}"] .occupants`);
   box.insertAdjacentHTML('beforeend',`<span class="occ pop">${A.person(r.person)}${level===3&&r.action?A.action(r.action):''}</span>`);
   await wait(800);
  }
 },
 where:{
  intro:'intro.where',
  rounds:()=>{const all=Object.keys(D.objects);return shuffle(all).slice(0,D.whereRounds).map(o=>{const pl=D.objects[o].place;
   return{obj:o,place:pl,say:[level===1?'obj.'+o:level===2?'put.'+o:'desc.'+o],held:[],steps:[
    {kind:'object',where:'tray',options:shuffle([o,...others(all.filter(x=>D.objects[x].place!==pl),[],2)]),answer:o},
    {kind:'place',where:'tray',options:shuffle([pl,...others(Object.keys(D.places),[pl],2)]),answer:pl}]};});},
  init(){},
  round(){stage.innerHTML=`<div class="match"><div class="mslot obj" aria-hidden="true"><b>؟</b></div><div class="mslot plc" aria-hidden="true"><b>؟</b></div></div>`;},
  step(r,kind,id){const s=stage.querySelector(kind==='object'?'.obj':'.plc');s.innerHTML=ART[kind](id);s.classList.add('filled','pop');},
  async finish(r){stage.querySelector('.match').classList.add('joined');await say('place.'+r.place);await wait(300);}
 },
 book:{
  intro:'intro.book',manual:true,
  rounds:()=>D.book.map(p=>({...p,say:['book.'+p.id,...(level===3?['ask.'+p.id]:[])],held:[],repeated:false,
   steps:level===3?[{kind:'action',where:'tray',options:shuffle([p.action,others(Object.keys(D.actions),[p.action],1)[0]]),answer:p.action}]:[]})),
  init(){},
  round(p){const old=stage.querySelector('.page'),rect=old?.getBoundingClientRect();stage.innerHTML=`<div class="page"><button class="page-pic" type="button" id="page-pic" aria-label="${esc(p.lines[0])}">${A.object(p.pic)}</button><p class="page-text"><span>${esc(p.lines[0])}</span><span>${esc(p.lines[1])}</span></p><span class="corner" aria-hidden="true"></span></div>`;window.AURAL_KIT.flip(stage,old,rect);
   $('page-pic').onclick=()=>say(level===1?p.word:level===2?'phrase.'+p.id:'book.'+p.id);},
  tools(p){return`<button class="tool tick" type="button" id="tick" aria-pressed="${p.repeated}" aria-label="الطفل كرّر" title="الطفل كرّر">${A.icon('repeat')}</button><button class="tool next" type="button" id="page-next" aria-label="${run.i+1<run.rounds.length?'الصفحة التالية':'خلصت القصة'}" title="التالي">${A.icon(run.i+1<run.rounds.length?'next':'check')}</button>`;}
 }
};

/* ---------- one play-through of a station ---------- */
let run=null;
const cur=()=>run.rounds[run.i];
function show(id){for(const s of ['map','play'])$(s).hidden=s!==id;}
async function start(id){
 const S=ST[id];run={id,S,rounds:S.rounds(),i:0,first:0,repeated:0,results:[],busy:false};scene={};
 show('play');S.init();
 $('progress').innerHTML=run.rounds.map(()=>`<span class="pstar">${A.icon('star')}</span>`).join('');
 $('progress').setAttribute('aria-label',`${ar(run.rounds.length)} جولات`);
 beginRound(true);
}
async function beginRound(first){
 const r=cur(),S=run.S;run.step=0;run.chosen=[];run.missed=false;run.busy=false;
 S.round?.(r);renderStep();
 $('progress').children[run.i]?.classList.add('now');
 await wait(first?250:350);if(!run||cur()!==r)return;
 if(first)await say(S.intro,'listen',...r.say);else say(...r.say);
}
function renderStep(){
 const r=cur(),s=r.steps[run.step],S=run.S;
 stage.querySelectorAll('.room').forEach(b=>b.disabled=!(s&&s.where==='stage'));
 stage.classList.toggle('choose',!!(s&&s.where==='stage'));
 const held=S.showHeld?[...r.held,...run.chosen]:[];
 const heldHtml=held.length?`<div class="held-row">${held.map(heldCard).join('')}</div>`:'';
 if(!s){tray.innerHTML=S.tools?S.tools(r):'';bindTools(r);return;}
 tray.innerHTML=heldHtml+(s.where==='tray'?`<div class="choices">${s.options.map(o=>card(s.kind,o)).join('')}</div>`:'');
}
function bindTools(r){
 const tick=$('tick'),next=$('page-next');if(!tick)return;
 tick.onclick=()=>{r.repeated=!r.repeated;tick.setAttribute('aria-pressed',r.repeated);if(r.repeated)tone(true);};
 next.onclick=()=>{hush();completeRound(r.repeated);};
}
async function pick(id,btn){
 if(!run||run.busy)return;
 const r=cur(),s=r.steps[run.step];if(!s)return;
 if(id!==s.answer){
  run.missed=true;btn.classList.remove('is-wrong');void btn.offsetWidth;btn.classList.add('is-wrong');tone(false);
  say('again',...r.say);return;
 }
 run.busy=true;btn.classList.add('is-correct');tone(true);burst(btn);
 run.chosen.push({kind:s.kind,id});run.S.step?.(r,s.kind,id);
 await wait(500);if(!run||cur()!==r)return;
 run.step++;
 if(run.step<r.steps.length){run.busy=false;renderStep();return;}
 if(!run.missed)run.first++;
 if(run.S.manual){run.busy=false;renderStep();return;}
 hush();await run.S.finish(r);if(!run||cur()!==r)return;
 completeRound(!run.missed);
}
function completeRound(gold){
 const star=$('progress').children[run.i];star?.classList.remove('now');star?.classList.add(gold?'on':'soft');
 if(run.id==='book'&&cur().repeated)run.repeated++;
 run.i++;
 if(run.i<run.rounds.length)beginRound(false);else finishStation();
}
function rating(){
 const n=run.rounds.length;
 if(run.id==='book'&&level<3)return 3;
 const r=run.first/n;return r>=.9?3:r>=.6?2:1;
}
const opened=()=>({2:open(2),3:open(3),next:!!nextLesson&&Store.unlocked(nextLesson.id,1)});
function finishStation(){
 const stars=rating(),n=run.rounds.length,before=opened();
 Store.record(LID,level,run.id,{stars,ok:run.id==='book'&&level<3?run.repeated:run.first,n});
 const after=opened(),news=[...[2,3].filter(l=>after[l]&&!before[l]).map(l=>`انفتح المستوى ${ar(l)}! 🎉`),...(after.next&&!before.next?[`انفتح درس «${nextLesson.title}»! 🎉`]:[])];
 const idx=D.stations.findIndex(s=>s.id===run.id),last=idx===D.stations.length-1;
 $('done-stars').innerHTML=[1,2,3].map(i=>`<span class="${i<=stars?'on':''}">${A.icon('star')}</span>`).join('');
 $('done-stars').setAttribute('aria-label',`${ar(stars)} من ٣ نجوم`);
 $('done-text').innerHTML=(run.id==='book'?[`كرّر: ${ar(run.repeated)} من ${ar(n)} صفحات`,...(level===3?[`جواب صح من أول مرة: ${ar(run.first)} من ${ar(n)}`]:[])]:[`صح من أول مرة: ${ar(run.first)} من ${ar(n)}`]).map(t=>`<span>${t}</span>`).join('')+news.map(t=>`<span class="unlock">${esc(t)}</span>`).join('');
 $('done-next').hidden=last;
 const all=D.stations.every(s=>saved.best[`${level}.${s.id}`]);
 window.AURAL_KIT.rate(LID,level,run.id);
 $('done').showModal();say(last&&all?'done':'bravo');
}

/* ---------- map screen ---------- */
function renderMap(){
 $('hero').innerHTML=A.house({roof:'red',door:'blue',window:'yellow',curtain:'red',chimney:'brick'});
 document.querySelectorAll('#levels [data-level]').forEach(b=>{const l=+b.dataset.level,on=l===level,ok=open(l);b.setAttribute('aria-checked',on);b.tabIndex=on?0:-1;b.disabled=!ok;b.classList.toggle('locked',!ok);b.title=ok?'':`خلّص المستوى ${ar(l-1)} لينفتح`;});
 $('stations').innerHTML=D.stations.map((s,i)=>{const best=saved.best[`${level}.${s.id}`]||0;
  return`<button class="station" type="button" data-station="${s.id}"><span class="station-num">${ar(i+1)}</span>${A.icon(s.icon,'station-icon')}<strong>${esc(s.title)}</strong><span class="mini-stars" aria-label="${ar(best)} من ٣ نجوم">${[1,2,3].map(n=>`<span class="${n<=best?'on':''}">${A.icon('star')}</span>`).join('')}</span></button>`;}).join('');
}
function setLevel(l){if(!open(l))return;level=l;saved.level=l;save();renderMap();}
$('levels').addEventListener('click',e=>{const b=e.target.closest('[data-level]');if(b)setLevel(+b.dataset.level);});
$('levels').addEventListener('keydown',e=>{const d={ArrowLeft:1,ArrowDown:1,ArrowRight:-1,ArrowUp:-1}[e.key];if(!d)return;e.preventDefault();let l=level;do l=((l-1+d+3)%3)+1;while(!open(l));setLevel(l);$('levels').querySelector(`[data-level="${l}"]`).focus();});
$('stations').addEventListener('click',e=>{const b=e.target.closest('[data-station]');if(b)start(b.dataset.station);});
$('hero').addEventListener('click',()=>say('welcome'));

/* ---------- play controls ---------- */
// Swipe the story book like a real one: finger to the right turns to the next page (when the page is done).
window.AURAL_KIT.swipe(stage,()=>{if(run&&run.id==='book'&&$('page-next'))$('page-next').click();});
tray.addEventListener('click',e=>{const b=e.target.closest('[data-choice]');if(b)pick(b.dataset.choice,b);});
stage.addEventListener('click',e=>{const b=e.target.closest('.room[data-choice]');if(b&&!b.disabled)pick(b.dataset.choice,b);});
$('ear').addEventListener('click',()=>run&&say(...cur().say));
function toMap(){hush();run=null;renderMap();show('map');}
$('back').addEventListener('click',toMap);
$('done-map').addEventListener('click',()=>{$('done').close();toMap();});
$('done-again').addEventListener('click',()=>{$('done').close();start(run.id);});
$('done-next').addEventListener('click',()=>{const i=D.stations.findIndex(s=>s.id===run.id);$('done').close();start(D.stations[i+1].id);});
$('done').addEventListener('cancel',e=>{e.preventDefault();$('done').close();toMap();});

/* ---------- goals (shared with the dashboard), with this kid's status for each ---------- */
const GOAL_TAG={done:'تحقق ✓',now:'نعمل عليه',hard:'يحتاج دعم',later:'لاحقاً'};
const lesson=(window.AURAL_LESSONS||[]).find(l=>l.id==='my-house');
$('open-goals').addEventListener('click',()=>{
 const g=lesson?.goals||{};
 $('goals-body').innerHTML=[1,2,3].map(l=>`<section class="goal-level${l===level?' current':''}"><h3>المستوى ${['١','٢','٣'][l-1]}${g[l]?.unit?` <small>${esc(g[l].unit)}</small>`:''}</h3><ul class="goal-list">${(g[l]?.items||[]).map(x=>{const st=Store.goalStatus(LID,l,x);return`<li class="g-${st}">${esc(x.text)} <span class="g-tag">${GOAL_TAG[st]}</span></li>`;}).join('')}</ul></section>`).join('');
 $('goals').showModal();
});
document.querySelectorAll('dialog [data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
document.querySelectorAll('dialog.goals').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close();}));

renderMap();
if(new URLSearchParams(location.search).has('test'))window.MY_HOUSE_TEST={run:()=>run&&{id:run.id,i:run.i,step:run.step,round:cur()},level:()=>level};
if('serviceWorker' in navigator&&location.protocol!=='file:')addEventListener('load',()=>navigator.serviceWorker.register('../../sw.js',{scope:'../../'}).catch(()=>{}));
})();
