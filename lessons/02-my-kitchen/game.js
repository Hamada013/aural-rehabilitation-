'use strict';
// Lesson 2 · مطبخي. Four listening stations, three levels. Content lives in data.js, pictures in art.js
// (people come from lesson 1's art). Shared pieces (rating, page flip, swipe, burst) come from assets/kit.js.
(()=>{
const D=window.MY_KITCHEN,A=window.KITCHEN_ART,PEOPLE_ART=window.HOUSE_ART,KIT=window.AURAL_KIT,Store=window.AURAL_STORE,LID='my-kitchen';
const $=id=>document.getElementById(id),{ar,esc,burst}=KIT;
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
const others=(pool,not,n)=>shuffle(pool.filter(x=>!not.includes(x))).slice(0,n);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
document.querySelectorAll('[data-icon]').forEach(e=>e.insertAdjacentHTML('afterbegin',A.icon(e.dataset.icon)));

/* ---------- the kid playing and their saved progress; no kid or a locked lesson goes back to the road map ---------- */
const kid=Store.current();
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

/* ---------- pictures and names for every kind of choice ---------- */
const page=id=>D.book.find(p=>p.id===id);
const NAME={item:id=>D.items[id].name,food:id=>D.foods[id].name,tool:id=>D.tools[id].name,place:id=>D.hatPlaces[id].name,person:id=>D.people[id].name,num:n=>`الرقم ${ar(n)}`,pic:id=>page(id).lines.join(' '),button:c=>D.buttons[c].name};
const ART={item:A.item,food:A.food,tool:A.tool,place:A.hatPlace,person:id=>PEOPLE_ART.person(id),num:n=>`<b class="num">${ar(n)}</b>`,pic:id=>A.scene(id),button:A.button};
const card=(kind,id)=>`<button class="choice k-${kind}" type="button" data-choice="${esc(id)}" aria-label="${esc(NAME[kind](id))}">${ART[kind](id)}</button>`;

/* ---------- the four stations ---------- */
const stage=$('stage'),tray=$('tray');
let scene={};
const ST={
 // 1 · Things in the kitchen: hidden cards land on the same picture (L1), two buttons in your colour (L2), guess from use (L3).
 things:{
  intro:'intro.things',
  async init(){
   const board=level===1?D.board1:D.board2;
   stage.innerHTML=`<div class="board" style="--rows:${board.length/4}">${board.map(id=>`<button class="cell" type="button" data-choice="${id}" aria-label="${esc(D.items[id].name)}" disabled>${A.item(id)}</button>`).join('')}</div>`;
   if(level!==2)return;
   tray.innerHTML=`<div class="choices">${Object.keys(D.buttons).map(c=>card('button',c)).join('')}</div>`;
   say('fav.color');
   scene.color=await new Promise(res=>{tray.onclick=e=>{const b=e.target.closest('[data-choice]');if(!b)return;tray.onclick=null;tone(true);burst(b);b.classList.add('is-correct');res(b.dataset.choice);};});
   await wait(500);
  },
  rounds(){
   if(level===1)return shuffle(D.board1).slice(0,D.roundsL1).map(id=>({say:['item.'+id],cards:[id],steps:[{where:'stage',answer:id}]}));
   if(level===2)return shuffle(D.find).map(f=>({say:[f.say],cards:f.items,steps:[{where:'stage',answers:f.items}]}));
   return shuffle(D.board2).slice(0,D.roundsL3).map(id=>({say:['desc.'+id],cards:[id],steps:[{where:'stage',answer:id}]}));
  },
  round(){stage.querySelectorAll('.cell').forEach(c=>{c.classList.remove('covered','done','is-correct');c.querySelectorAll('.cover,.marker').forEach(x=>x.remove());});},
  tray(r){return level===2?`<div class="held-row">${r.cards.map(()=>`<span class="hand-button">${A.button(scene.color)}</span>`).join('')}</div>`:`<div class="deck" aria-hidden="true">${r.cards.map(()=>'<span class="card-back"><b>؟</b></span>').join('')}</div>`;},
  step(r,s,id,btn){
   if(level===2){tray.querySelector('.hand-button:not(.used)')?.classList.add('used');btn.insertAdjacentHTML('beforeend',`<span class="marker">${A.button(scene.color)}</span>`);return;}
   // the hidden card turns over and flies onto the same picture
   const from=tray.querySelector('.card-back')?.getBoundingClientRect(),to=btn.getBoundingClientRect(),c=document.createElement('span');
   c.className='fly-card';c.innerHTML=A.item(id);document.body.append(c);
   const sx=from?from.left:to.left,sy=from?from.top:to.top+200;
   c.style.cssText=`left:${sx}px;top:${sy}px;width:${to.width}px;height:${to.height}px`;
   tray.querySelector('.card-back')?.classList.add('gone');
   requestAnimationFrame(()=>requestAnimationFrame(()=>{c.style.transform=`translate(${to.left-sx}px,${to.top-sy}px) rotate(-4deg)`;}));
   setTimeout(()=>{c.remove();btn.classList.add('covered');btn.insertAdjacentHTML('beforeend',`<span class="cover">${A.item(id)}</span>`);},520);
  },
  async finish(){await wait(500);if(level===1)await say('same');await wait(250);}
 },
 // 2 · The cookie book: turn pages like a real book; L1 boy/girl on the cover, L2 find the page number, L3 before/after.
 book:{
  intro:'intro.book',manual:true,
  rounds(){
   const cover={id:'cover',cover:true,say:['book.cover'],steps:[],repeated:false};
   if(level===1){const who=Math.random()<.5?'girl':'boy';cover.say=['book.cover','cover.'+who];cover.steps=[{where:'stage',answer:who}];cover.noTick=true;}
   const pages=D.book.map((p,i)=>{const n=i+1,r={...p,n,repeated:false,say:['book.'+p.id],steps:[]};
    if(level===2&&n>1){r.hidden=true;r.say=['num.'+n];r.steps=[{where:'tray',kind:'num',options:shuffle([n,...others([...Array(10)].map((_,k)=>k+1),[n,1],2)]),answer:n}];}
    if(level===3&&p.ask){r.say=['book.'+p.id,'ask.'+p.id];r.steps=[{where:'tray',kind:'pic',options:shuffle([p.ask.answer,p.ask.other]),answer:p.ask.answer}];}
    return r;});
   return[cover,...pages,{id:'catch',auto:true,say:['catch'],steps:[{where:'stage',taps:D.catchCount}]}];
  },
  init(){},
  round(r){
   if(r.id==='catch'){const old=stage.querySelector('.page'),rect=old?.getBoundingClientRect();
    stage.innerHTML=`<div class="run-scene">${[0,1,2,3,4].map(i=>`<button class="runner r${i}" type="button" data-choice="cookie" aria-label="بسكوتة" disabled>${A.cookie(i%2?'girl':'boy')}</button>`).join('')}</div>`;KIT.flip(stage,old,rect);return;}
   if(r.hidden){if(!stage.querySelector('.page'))this.show(r);return;}
   this.show(r);
  },
  show(r){
   const old=stage.querySelector('.page'),rect=old?.getBoundingClientRect();
   stage.innerHTML=r.cover?`<div class="page cover-page"><h2 class="book-title">قصة البسكوتات</h2><div class="cover-kids">${['boy','girl'].map(k=>`<button class="cover-kid" type="button" data-choice="${k}" aria-label="${k==='boy'?'الصبي':'البنت'}" disabled>${A.cookie(k)}</button>`).join('')}</div><span class="corner" aria-hidden="true"></span></div>`
    :`<div class="page"><button class="page-pic" type="button" id="page-pic" aria-label="${esc(r.lines.join(' '))}">${A.scene(r.id)}</button><p class="page-text"><span>${esc(r.lines[0])}</span><span>${esc(r.lines[1])}</span></p><span class="page-num">${ar(r.n)}</span><span class="corner" aria-hidden="true"></span></div>`;
   KIT.flip(stage,old,rect);
   const pic=$('page-pic');if(pic)pic.onclick=()=>say(level===1?'word.'+r.id:level===2?'phrase.'+r.id:'book.'+r.id);
  },
  step(r,s,id,btn){
   if(s.kind==='num'){this.show(r);setTimeout(()=>say('book.'+r.id),450);}
   if(s.taps){btn.classList.add('caught');}
  },
  tools(r){return`${r.noTick?'':`<button class="tool tick" type="button" id="tick" aria-pressed="${r.repeated}" aria-label="الطفل كرّر" title="الطفل كرّر">${A.icon('repeat')}</button>`}<button class="tool next" type="button" id="page-next" aria-label="الصفحة التالية" title="التالي">${A.icon('next')}</button>`;},
  async finish(r){if(r.id==='catch'){await say('yum');}}
 },
 // 3 · Chef's hat: hear the direction, pick the tool (and where); the paper becomes a hat that lands on the kid's picture.
 hat:{
  intro:'intro.hat',
  rounds(){return D.hat[level].map(h=>({...h,say:[h.say],steps:h.steps.map(x=>x.tool
   ?{where:'tray',kind:'tool',options:shuffle([x.tool,...others(Object.keys(D.tools),[x.tool],2)]),answer:x.tool}
   :{where:'tray',kind:'place',options:shuffle([x.place,...others(Object.keys(D.hatPlaces),[x.place],2)]),answer:x.place})}));},
  init(){scene.state=D.hatStart[level];this.draw();},
  draw(act=''){
   const s=scene.state,onHead=s===7,offHead=s===8;
   stage.innerHTML=`<div class="hat-stage s${s} ${act?'act-'+act:''}">${onHead||offHead?`<div class="chef"><span class="chef-face">${esc(kid.avatar)}</span>${onHead?`<span class="chef-hat">${A.hatShape()}</span>`:''}</div>`:''}${s<7||offHead?A.hatState(s):''}</div>`;
  },
  step(r,s,id){if(s.kind==='tool'){scene.state=D.tools[id].state;this.draw(id);}else stage.querySelector('.hat-stage')?.classList.add('spot','spot-'+id);},
  async finish(){await wait(700);}
 },
 // 4 · Chef's jobs: the dice roll inside a box the child can't see into — listen, then put a chef's hat on the job.
 jobs:{
  intro:'intro.jobs',
  rounds(){return shuffle(D.jobs[level]).map(j=>{const steps=[];
   if(level===1){steps.push({where:'stage',answer:'mat:'+j.verb,only:'.mat-head'});steps.push({where:'stage',answer:`${j.verb}:${j.food}`,only:`.mat[data-mat="${j.verb}"] .food`,say:['food.'+j.food]});}
   else{if(level===3)steps.push({where:'tray',kind:'person',options:shuffle([j.person,...others(Object.keys(D.people),[j.person],2)]),answer:j.person});steps.push({where:'stage',answer:`${j.verb}:${j.food}`,only:'.food'});}
   return{...j,say:level===1?['verb.'+j.verb]:[j.say],steps};});},
  init(){const mats=level===1?['cut','wash']:['cut','wash','cook'];
   stage.innerHTML=`<div class="mats" style="--n:${mats.length}">${mats.map(m=>`<div class="mat" data-mat="${m}"><button class="mat-head" type="button" data-choice="mat:${m}" aria-label="${esc(D.verbs[m].name)}" disabled>${A.item(D.verbs[m].icon)}</button><div class="foods">${D.foodOrder.map(f=>`<button class="food" type="button" data-choice="${m}:${f}" aria-label="${esc(D.verbs[m].name+' '+D.foods[f].name)}" disabled>${A.food(f)}</button>`).join('')}</div></div>`).join('')}</div>`;},
  round(r){stage.querySelectorAll('.mat').forEach(m=>m.classList.remove('away'));scene.rolled=false;},
  tray(r,s){const dice=[...(level===3?['person']:[]),'verb','food'];
   const html=`<div class="dicebox${scene.rolled?'':' rolling'}" aria-hidden="true">${dice.map((d,i)=>`<span class="die d${i}"></span>`).join('')}${A.box()}</div>`;scene.rolled=true;return html;},
  step(r,s,id,btn){
   if(id.startsWith('mat:')){const m=id.slice(4);stage.querySelectorAll('.mat').forEach(x=>x.classList.toggle('away',x.dataset.mat!==m));return;}
   if(s.kind==='person')return;
   btn.classList.add('hatted','done');btn.insertAdjacentHTML('beforeend',`<span class="hat-on">${A.miniHat()}</span>`);
  },
  async finish(r){ // open the box: show what the dice said
   const faces=[...(level===3?[PEOPLE_ART.person(r.person)]:[]),A.item(D.verbs[r.verb].icon),A.food(r.food)];
   tray.innerHTML=`<div class="dice-faces">${faces.map(f=>`<span class="face">${f}</span>`).join('')}</div>`;
   stage.querySelectorAll('.mat').forEach(m=>m.classList.remove('away'));
   await wait(1300);
  }
 }
};

/* ---------- one play-through of a station ---------- */
let run=null;
const cur=()=>run.rounds[run.i];
const stepSay=()=>{const r=cur(),s=r.steps[run.step];return s?.say||r.say;};
function show(id){for(const s of ['map','play'])$(s).hidden=s!==id;}
async function start(id){
 hush();const S=ST[id];run={id,S,rounds:S.rounds(),i:0,first:0,repeated:0,busy:true,got:[]};scene={};const me=run;
 show('play');stage.innerHTML='';tray.innerHTML='';stage.classList.remove('choose');
 $('progress').innerHTML=run.rounds.map(()=>`<span class="pstar">${A.icon('star')}</span>`).join('');
 $('progress').setAttribute('aria-label',`${ar(run.rounds.length)} جولات`);
 await S.init?.();if(run!==me)return;
 beginRound(true);
}
async function beginRound(first){
 const r=cur(),S=run.S;run.step=0;run.missed=false;run.busy=false;run.got=[];
 S.round?.(r);renderStep();
 $('progress').children[run.i]?.classList.add('now');
 await wait(first?250:350);if(!run||cur()!==r)return;
 if(first)await say(S.intro,'listen',...r.say);else say(...r.say);
}
function renderStep(){
 const r=cur(),s=r.steps[run.step],S=run.S;
 stage.querySelectorAll('[data-choice]').forEach(b=>b.disabled=!(s&&s.where==='stage'&&(!s.only||b.matches(s.only)))||b.classList.contains('done'));
 stage.classList.toggle('choose',!!(s&&s.where==='stage'));
 if(!s){tray.innerHTML=S.tools&&!r.auto?S.tools(r):'';bindTools(r);return;}
 tray.innerHTML=s.where==='tray'?`<div class="choices">${s.options.map(o=>card(s.kind,o)).join('')}</div>`:(S.tray?.(r,s)||'');
}
function bindTools(r){
 const tick=$('tick'),next=$('page-next');if(!next)return;
 if(tick)tick.onclick=()=>{r.repeated=!r.repeated;tick.setAttribute('aria-pressed',r.repeated);if(r.repeated)tone(true);};
 next.onclick=()=>{hush();completeRound(true);};
}
async function pick(id,btn){
 if(!run||run.busy)return;
 const r=cur(),s=r.steps[run.step];if(!s)return;
 const ok=s.taps?id==='cookie':s.answers?s.answers.includes(id)&&!run.got.includes(id):String(id)===String(s.answer);
 if(!ok){
  run.missed=true;btn.classList.remove('is-wrong');void btn.offsetWidth;btn.classList.add('is-wrong');tone(false);
  say('again',...stepSay());return;
 }
 tone(true);burst(btn);
 if(s.answers||s.taps){run.got.push(id);btn.classList.add('done');btn.disabled=true;run.S.step?.(r,s,id,btn);if(run.got.length<(s.taps||s.answers.length))return;}
 else{btn.classList.add('is-correct');run.S.step?.(r,s,id,btn);}
 run.busy=true;await wait(550);if(!run||cur()!==r)return;
 run.step++;run.got=[];
 if(run.step<r.steps.length){run.busy=false;renderStep();const ns=r.steps[run.step];if(ns.say)say(...ns.say);return;}
 if(!run.missed)run.first++;
 if(run.S.manual&&!r.auto){run.busy=false;renderStep();return;}
 hush();await run.S.finish?.(r);if(!run||cur()!==r)return;
 completeRound(!run.missed);
}
function completeRound(gold){
 const r=cur(),star=$('progress').children[run.i];star?.classList.remove('now');star?.classList.add(gold&&!run.missed?'on':'soft');
 if(run.id==='book'&&r.repeated)run.repeated++;
 run.i++;
 if(run.i<run.rounds.length)beginRound(false);else finishStation();
}
// The book's pages the therapist ticks for repeating (all pages except the cover and the catching game).
const tickPages=()=>run.rounds.filter(r=>!r.auto&&!r.noTick).length;
function rating(){
 if(run.id==='book'&&level<3){const r=run.repeated/tickPages();return r>=.9?3:r>=.6?2:1;}
 const r=run.first/run.rounds.length;return r>=.9?3:r>=.6?2:1;
}
const opened=()=>({2:open(2),3:open(3),next:!!nextLesson&&Store.unlocked(nextLesson.id,1)});
function finishStation(){
 const stars=rating(),book=run.id==='book',n=book&&level<3?tickPages():run.rounds.length,before=opened();
 Store.record(LID,level,run.id,{stars,ok:book&&level<3?run.repeated:run.first,n});
 const after=opened(),news=[...[2,3].filter(l=>after[l]&&!before[l]).map(l=>`انفتح المستوى ${ar(l)}! 🎉`),...(after.next&&!before.next?[`انفتح درس «${nextLesson.title}»! 🎉`]:[])];
 const idx=D.stations.findIndex(s=>s.id===run.id),last=idx===D.stations.length-1;
 $('done-stars').innerHTML=[1,2,3].map(i=>`<span class="${i<=stars?'on':''}">${A.icon('star')}</span>`).join('');
 $('done-stars').setAttribute('aria-label',`${ar(stars)} من ٣ نجوم`);
 $('done-text').innerHTML=(book&&level<3?[`كرّر: ${ar(run.repeated)} من ${ar(n)} صفحات`]:[`صح من أول مرة: ${ar(run.first)} من ${ar(run.rounds.length)}`]).map(t=>`<span>${t}</span>`).join('')+news.map(t=>`<span class="unlock">${esc(t)}</span>`).join('');
 $('done-next').hidden=last;
 const all=D.stations.every(s=>saved.best[`${level}.${s.id}`]);
 KIT.rate(LID,level,run.id);
 $('done').showModal();say(last&&all?'done':'bravo');
}

/* ---------- map screen ---------- */
function renderMap(){
 $('hero').innerHTML=A.hero();
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
tray.addEventListener('click',e=>{const b=e.target.closest('[data-choice]');if(b&&!tray.onclick)pick(b.dataset.choice,b);});
stage.addEventListener('click',e=>{const b=e.target.closest('[data-choice]');if(b&&!b.disabled)pick(b.dataset.choice,b);});
KIT.swipe(stage,()=>{if(run&&run.id==='book'&&$('page-next'))$('page-next').click();});
$('ear').addEventListener('click',()=>run&&say(...stepSay()));
function toMap(){hush();run=null;renderMap();show('map');}
$('back').addEventListener('click',toMap);
$('done-map').addEventListener('click',()=>{$('done').close();toMap();});
$('done-again').addEventListener('click',()=>{$('done').close();start(run.id);});
$('done-next').addEventListener('click',()=>{const i=D.stations.findIndex(s=>s.id===run.id);$('done').close();start(D.stations[i+1].id);});
$('done').addEventListener('cancel',e=>{e.preventDefault();$('done').close();toMap();});

/* ---------- goals (shared with the dashboard), with this kid's status for each ---------- */
const GOAL_TAG={done:'تحقق ✓',now:'نعمل عليه',hard:'يحتاج دعم',later:'لاحقاً'};
const lesson=(window.AURAL_LESSONS||[]).find(l=>l.id===LID);
$('open-goals').addEventListener('click',()=>{
 const g=lesson?.goals||{};
 $('goals-body').innerHTML=[1,2,3].map(l=>`<section class="goal-level${l===level?' current':''}"><h3>المستوى ${ar(l)}${g[l]?.unit?` <small>${esc(g[l].unit)}</small>`:''}</h3><ul class="goal-list">${(g[l]?.items||[]).map(x=>{const st=Store.goalStatus(LID,l,x);return`<li class="g-${st}">${esc(x.text)} <span class="g-tag">${GOAL_TAG[st]}</span></li>`;}).join('')}</ul></section>`).join('');
 $('goals').showModal();
});
document.querySelectorAll('dialog [data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
document.querySelectorAll('dialog.goals').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close();}));

renderMap();
if(new URLSearchParams(location.search).has('test'))window.MY_KITCHEN_TEST={run:()=>run&&{id:run.id,i:run.i,step:run.step,busy:run.busy,got:run.got,round:cur()},level:()=>level};
if('serviceWorker' in navigator&&location.protocol!=='file:')addEventListener('load',()=>navigator.serviceWorker.register('../../sw.js',{scope:'../../'}).catch(()=>{}));
})();
