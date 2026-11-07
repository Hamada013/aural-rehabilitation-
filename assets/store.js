'use strict';
/* Kids and their progress, saved on this device only (localStorage 'aural:v2'). Shared by the dashboard and every lesson.
   Unlocking: level 1 of the first lesson is always open. Finishing a level (every station played once) opens the next
   level of that lesson; finishing level 1 of a lesson opens level 1 of the next lesson. Therapist mode opens everything.
   Goal status, per goal and level, from the stations the goal lists in assets/lessons.js:
   done = every station scored at least PASS%; hard = played and still under HARD% after two tries, or last try under LOW%;
   now = open but not done yet; later = level still locked.
   Therapist mode (one switch per device, behind a code on the dashboard) opens every lesson and level, and adds a rating per goal (20/40/60/80%) after each station; a rating wins over
   the scores: 80% = done, 20–40% = hard, 60% = now. */
(()=>{
const KEY='aural:v2',OLD={'my-house':'aural:my-house'},PASS=80,HARD=60,LOW=50,LOG=400;
let db={};
function read(){try{db=JSON.parse(localStorage.getItem(KEY))||{};}catch{db={};}db.kids=db.kids||[];db.progress=db.progress||{};db.log=db.log||{};}
const write=()=>{try{localStorage.setItem(KEY,JSON.stringify(db));return true;}catch{return false;}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const all=()=>window.AURAL_LESSONS||[];
const def=id=>all().find(l=>l.id===id);
read();

const S={
 PASS,HARD,
 reload:read,save:write,
 kids:()=>db.kids,
 kid:id=>db.kids.find(k=>k.id===id)||null,
 current:()=>S.kid(db.current)||null,
 use(id){if(S.kid(id)){db.current=id;write();}},
 therapist:()=>!!db.therapist,
 setTherapist(on){db.therapist=!!on;write();},
 addKid({name,avatar}){
  const k={id:uid(),name:String(name||'').trim().slice(0,30)||'بطل',avatar:avatar||'🦁',created:Date.now(),notes:''};
  if(!db.kids.length)for(const[l,key]of Object.entries(OLD)){ // the first kid takes progress saved before accounts existed
   try{const o=JSON.parse(localStorage.getItem(key));if(o&&o.best){const p=S.lesson(l,k.id);for(const[s,v]of Object.entries(o.best)){p.best[s]=v;p.tries[s]=1;p.pct[s]=p.lastPct[s]=v>=3?90:v===2?70:40;}if([1,2,3].includes(o.level))p.level=o.level;}localStorage.removeItem(key);}catch{}
  }
  db.kids.push(k);db.current=k.id;write();return k;
 },
 updateKid(id,patch){const k=S.kid(id);if(k){Object.assign(k,patch);write();}return k;},
 removeKid(id){db.kids=db.kids.filter(k=>k.id!==id);delete db.progress[id];delete db.log[id];if(db.current===id)db.current=db.kids[0]?.id;write();},

 // One lesson's saved progress for a kid: {best,tries,pct,lastPct,last} keyed '<level>.<station>', plus the last level used.
 lesson(lessonId,kidId=db.current){
  const k=db.progress[kidId]=db.progress[kidId]||{};
  const p=k[lessonId]=k[lessonId]||{};for(const f of ['best','tries','pct','lastPct','last','rate'])p[f]=p[f]||{};return p;
 },
 station(lessonId,level,station,kidId=db.current){const p=S.lesson(lessonId,kidId),k=`${level}.${station}`;return{stars:p.best[k]||0,tries:p.tries[k]||0,pct:p.pct[k]||0,lastPct:p.lastPct[k],last:p.last[k]||0};},
 record(lessonId,level,station,{stars,ok,n},kidId=db.current){
  const p=S.lesson(lessonId,kidId),k=`${level}.${station}`,pct=n?Math.round(ok/n*100):0,t=Date.now();
  p.best[k]=Math.max(p.best[k]||0,stars);p.tries[k]=(p.tries[k]||0)+1;p.pct[k]=Math.max(p.pct[k]||0,pct);p.lastPct[k]=pct;p.last[k]=t;
  const log=db.log[kidId]=db.log[kidId]||[];log.push({t,l:lessonId,v:level,s:station,stars,pct});if(log.length>LOG)log.splice(0,log.length-LOG);
  write();
 },
 log:(kidId=db.current)=>db.log[kidId]||[],

 levelDone(lessonId,level,kidId=db.current){const l=def(lessonId);return !!l&&l.stations.every(s=>S.station(lessonId,level,s.id,kidId).tries>0);},
 unlocked(lessonId,level=1,kidId=db.current){
  if(db.therapist)return true;
  if(level>1)return S.levelDone(lessonId,level-1,kidId);
  const i=all().findIndex(l=>l.id===lessonId);return i===0||(i>0&&S.levelDone(all()[i-1].id,1,kidId));
 },
 stars(lessonId,kidId=db.current){const l=def(lessonId);if(!l)return{got:0,max:0};let got=0;for(const v of [1,2,3])for(const s of l.stations)got+=S.station(lessonId,v,s.id,kidId).stars;return{got,max:l.stations.length*9};},
 totalStars:(kidId=db.current)=>all().reduce((a,l)=>a+S.stars(l.id,kidId).got,0),
 // Therapist rating of one goal: {pct,t} or null. pct null clears it.
 rating(lessonId,level,goal,kidId=db.current){const i=def(lessonId)?.goals?.[level]?.items.indexOf(goal);return i>=0?S.lesson(lessonId,kidId).rate[`${level}.${i}`]||null:null;},
 rate(lessonId,level,goal,pct,kidId=db.current){const i=def(lessonId)?.goals?.[level]?.items.indexOf(goal);if(!(i>=0))return;const r=S.lesson(lessonId,kidId).rate;if(pct==null)delete r[`${level}.${i}`];else r[`${level}.${i}`]={pct,t:Date.now()};write();},
 goalStatus(lessonId,level,goal,kidId=db.current){
  if(!S.unlocked(lessonId,level,kidId))return'later';
  const r=S.rating(lessonId,level,goal,kidId);if(r)return r.pct>=80?'done':r.pct<=40?'hard':'now';
  const st=(goal.stations||def(lessonId).stations.map(s=>s.id)).map(s=>S.station(lessonId,level,s,kidId));
  if(st.every(s=>s.tries&&s.pct>=PASS))return'done';
  if(st.some(s=>s.tries&&((s.tries>=2&&s.pct<HARD)||s.lastPct<LOW)))return'hard';
  return'now';
 },

};
window.AURAL_STORE=S;
})();
