'use strict';
// Dashboard: a road map of lessons for the kid playing, a side list of everything, kid profiles, a progress report
// (print / save as PDF / share) and an info sheet with the therapist's contact. Lessons come from assets/lessons.js,
// kids and progress from assets/store.js.
(()=>{
/* Therapist contact: shown on the dashboard only (info sheet and report). whatsapp: international number, digits only, e.g. '9639XXXXXXXX'. */
const CONTACT={name:'أحمد غانم',nameEn:'Ahmad Ghanem',title:'أخصائي النطق واللغة',titleEn:'Speech and Language Pathology',place:'اللاذقية، سوريا',email:'slp.ahmadghanem@gmail.com',whatsapp:'963988451245'};
/* Therapist mode code: a light lock so kids don't switch it on by accident (not a security measure — it lives in this file). */
const THERAPIST_CODE='013';
const AVATARS=['🦁','🐰','🐻','🐼','🐯','🐸','🐵','🦊','🐱','🐶','🐥','🐢','🦄','🐳','🦋','🚀'];
const SOON=2; // locked "coming soon" stops after the last lesson
const X=[.5,.8,.5,.2]; // where each stop sits across the road, repeating

const S=window.AURAL_STORE,LESSONS=window.AURAL_LESSONS||[];
const ICONS={menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',close:'<path d="M6 6l12 12M18 6 6 18"/>',plus:'<path d="M12 5v14M5 12h14"/>',check:'<path d="m5 12 5 5 9-10"/>',
 star:'<path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z"/>',lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',play:'<path d="M8 5v14l11-7z"/>',
 report:'<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h4"/>',kids:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0M14 20a4.5 4.5 0 0 1 7-3.7"/>',
 pdf:'<path d="M6 9V3h12v6M6 18H4v-7h16v7h-2"/><rect x="6" y="14" width="12" height="7"/>',share:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',whatsapp:'<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9c0 3 2.5 6 6 6l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13 7 4 4"/>',goals:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>'};
const svg=(n,c='')=>`<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||''}</svg>`;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const day=t=>t?new Date(t).toLocaleDateString('ar-u-nu-arab',{day:'numeric',month:'long',year:'numeric'}):'—';
const $=id=>document.getElementById(id);
const LEVEL_TAG={done:'خلص',open:'مفتوح',locked:'مقفول'};
const GOAL={done:{title:'أهداف تحققت',tag:'تحقق ✓'},now:{title:'أهداف نعمل عليها الآن',tag:'نعمل عليه'},hard:{title:'أهداف تحتاج دعم',tag:'يحتاج دعم'},later:{title:'لاحقاً',tag:'لاحقاً'}};
document.querySelectorAll('[data-icon]').forEach(e=>e.insertAdjacentHTML('afterbegin',svg(e.dataset.icon)));

let toastT=0;
function toast(t){const e=$('toast');e.textContent=t;e.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>e.hidden=true,2800);}
const levelState=(id,l)=>S.levelDone(id,l)?'done':S.unlocked(id,l)?'open':'locked';
const levelBadges=id=>`<span class="lv-row">${[1,2,3].map(l=>{const st=levelState(id,l);return`<i class="lv ${st}" title="المستوى ${ar(l)}: ${LEVEL_TAG[st]}">${st==='done'?svg('check'):st==='locked'?svg('lock'):ar(l)}</i>`;}).join('')}</span>`;
const lessonDone=id=>[1,2,3].every(l=>S.levelDone(id,l));
// The stop the kid is at: the first open lesson not finished yet, else the last open one.
function hereIndex(){let last=-1;for(let i=0;i<LESSONS.length;i++){if(!S.unlocked(LESSONS[i].id,1))break;last=i;if(!lessonDone(LESSONS[i].id))return i;}return last;}

/* ---------- road map ---------- */
function render(){
 S.reload();const kid=S.current();
 $('open-kids').innerHTML=kid?`<span class="avatar">${esc(kid.avatar)}</span><span class="kid-name">${esc(kid.name)}<small>${svg('star')} ${ar(S.totalStars())}</small></span>`:`<span class="avatar">${svg('plus')}</span><span class="kid-name">طفل جديد</span>`;
 $('welcome').hidden=!!kid;$('road-area').hidden=!kid;
 if(!kid)return;
 $('road-title').innerHTML=`يلا يا ${esc(kid.name)}! <span aria-hidden="true">🚀</span>`;
 const here=hereIndex();
 const stops=LESSONS.map((l,i)=>{
  const open=S.unlocked(l.id,1),st=S.stars(l.id),cls=!open?'locked':lessonDone(l.id)?'done':'open';
  return`<div class="stop ${cls}${i===here?' here':''}" style="--x:${X[i%X.length]};--tint:${esc(l.tint||'#e7f1f8')}">
   ${i===here?`<span class="marker" aria-hidden="true">${esc(kid.avatar)}</span>`:''}
   <button class="stop-btn" type="button" data-lesson="${esc(l.id)}" aria-label="الدرس ${ar(i+1)}: ${esc(l.title)}${open?'':' (مقفول)'}">
    <img src="${esc(l.cover)}" alt="" width="300" height="250"><span class="stop-num">${ar(i+1)}</span>${open?'':`<span class="stop-lock">${svg('lock')}</span>`}
   </button>
   <strong>${esc(l.title)}</strong>
   ${open?`<span class="stop-stars">${svg('star')} ${ar(st.got)} من ${ar(st.max)}</span>${levelBadges(l.id)}`:'<span class="stop-stars">مقفول</span>'}
  </div>`;});
 for(let j=0;j<SOON;j++){const i=LESSONS.length+j;stops.push(`<div class="stop soon" style="--x:${X[i%X.length]}"><span class="stop-btn" aria-hidden="true"><b>؟</b></span><strong>قريباً</strong></div>`);}
 const road=$('road');road.querySelectorAll('.stop').forEach(e=>e.remove());road.insertAdjacentHTML('beforeend',stops.join(''));
 drawRoad();
 if($('menu').open)renderMenu();
}
function drawRoad(){
 const road=$('road'),box=road.getBoundingClientRect(),p=$('road-path');if(!box.width)return;
 const pts=[...road.querySelectorAll('.stop-btn')].map(b=>{const r=b.getBoundingClientRect();return[r.left+r.width/2-box.left,r.top+r.height/2-box.top];});
 if(pts.length<2){p.innerHTML='';return;}
 const curve=a=>a.map((q,i)=>{if(!i)return`M${q[0]} ${q[1]}`;const o=a[i-1],dy=(q[1]-o[1])/2;return`C${o[0]} ${o[1]+dy} ${q[0]} ${q[1]-dy} ${q[0]} ${q[1]}`;}).join('');
 const here=Math.max(0,hereIndex());
 p.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);p.setAttribute('width',box.width);p.setAttribute('height',box.height);
 p.innerHTML=`<path d="${curve(pts)}" class="road-edge"/><path d="${curve(pts)}" class="road-base"/><path d="${curve(pts)}" class="road-dash"/>${here>0?`<path d="${curve(pts.slice(0,here+1))}" class="road-done"/>`:''}`;
}
new ResizeObserver(()=>drawRoad()).observe($('road'));

/* ---------- one lesson ---------- */
function openLesson(id){
 const l=LESSONS.find(x=>x.id===id),i=LESSONS.indexOf(l);if(!l)return;
 if(!S.unlocked(id,1)){toast(`خلّص المستوى ١ من درس «${LESSONS[i-1].title}» لينفتح 🔒`);return;}
 $('lesson-title').textContent=`الدرس ${ar(i+1)} · ${l.title}`;
 const st=S.stars(id);
 $('lesson-body').innerHTML=`<div class="lesson-cover" style="--tint:${esc(l.tint||'#e7f1f8')}"><img src="${esc(l.cover)}" alt="" width="300" height="250"></div>
  <p class="muted">${esc(l.subtitle||'')}</p>
  <p class="stars-line">${svg('star')} <b>${ar(st.got)}</b> من ${ar(st.max)} نجمة</p>
  <ul class="level-list">${[1,2,3].map(v=>{const s=levelState(id,v),got=l.stations.reduce((a,x)=>a+S.station(id,v,x.id).stars,0);
   return`<li class="${s}"><i class="lv ${s}">${s==='done'?svg('check'):s==='locked'?svg('lock'):ar(v)}</i><span>المستوى ${ar(v)}<small>${esc(l.goals?.[v]?.unit||'')}</small></span><em>${s==='locked'?`خلّص المستوى ${ar(v-1)}`:`${ar(got)} من ${ar(l.stations.length*3)} ⭐`}</em></li>`;}).join('')}</ul>
  <a class="big-button play" href="${esc(l.href)}">${svg('play')}يلا نلعب</a>
  ${l.goals?`<details class="goals-box"><summary>${svg('goals')}الأهداف</summary>${goalLevels(l)}</details>`:''}`;
 $('lesson').showModal();
}
const goalLevels=l=>[1,2,3].filter(v=>l.goals[v]).map(v=>`<section class="goal-level"><h3>المستوى ${ar(v)} <small>${esc(l.goals[v].unit||'')}</small></h3><ul class="goal-list">${l.goals[v].items.map(g=>{const s=S.goalStatus(l.id,v,g);const r=S.rating(l.id,v,g);return`<li class="g-${s}">${esc(g.text)} <span class="g-tag">${GOAL[s].tag}${r?` · ${ar(r.pct)}٪`:''}</span></li>`;}).join('')}</ul></section>`).join('');

/* ---------- side list ---------- */
function renderMenu(){
 const kid=S.current();
 $('menu-kid').innerHTML=kid?`<button class="menu-kid" type="button" data-go="kids"><span class="avatar">${esc(kid.avatar)}</span><span><b>${esc(kid.name)}</b><small>${svg('star')} ${ar(S.totalStars())} نجمة</small></span><em>تبديل</em></button>`:'';
 $('all-lessons').innerHTML=LESSONS.map((l,i)=>{const open=kid&&S.unlocked(l.id,1);
  return`<li><button type="button" class="${open?'':'locked'}" data-lesson="${esc(l.id)}"><span class="thumb" style="--tint:${esc(l.tint||'#e7f1f8')}"><img src="${esc(l.cover)}" alt="" width="300" height="250">${open?'':svg('lock','thumb-lock')}</span><span class="row-text"><small>الدرس ${ar(i+1)}</small><b>${esc(l.title)}</b></span>${kid?levelBadges(l.id):''}</button></li>`;}).join('')+
  `<li><span class="row-soon"><span class="thumb">؟</span><span class="row-text"><small>الدرس ${ar(LESSONS.length+1)}</small><b>قريباً</b></span></span></li>`;
}

/* ---------- kids ---------- */
let editing=null; // null: list; 'new'; or a kid id
function renderKids(){
 const kids=S.kids(),cur=S.current(),form=editing!==null;
 $('kid-grid').hidden=form;$('kid-form').hidden=!form;
 $('kids-title').textContent=form?(editing==='new'?'طفل جديد':'تعديل'):'مين عم يلعب؟';
 if(!form){
  $('kid-grid').innerHTML=kids.map(k=>`<div class="kid-tile${cur&&k.id===cur.id?' current':''}"><button type="button" data-kid="${esc(k.id)}"><span class="avatar">${esc(k.avatar)}</span><b>${esc(k.name)}</b><small>${svg('star')} ${ar(S.totalStars(k.id))}</small></button><button class="icon-button edit" type="button" data-edit="${esc(k.id)}" aria-label="تعديل ${esc(k.name)}">${svg('edit')}</button></div>`).join('')+
   `<div class="kid-tile add"><button type="button" data-edit="new"><span class="avatar">${svg('plus')}</span><b>طفل جديد</b></button></div>`;
  return;
 }
 const k=editing==='new'?null:S.kid(editing),f=$('kid-form'),pick=k?.avatar||AVATARS[kids.length%AVATARS.length];
 f.elements.name.value=k?.name||'';
 $('avatars').innerHTML=AVATARS.map(a=>`<label><input type="radio" name="avatar" value="${a}"${a===pick?' checked':''}><span>${a}</span></label>`).join('');
 $('kid-delete').hidden=!k;
 setTimeout(()=>f.elements.name.focus(),50);
}
function openKids(mode=null){editing=mode;renderKids();if(!$('kids').open)$('kids').showModal();}
$('kid-grid').addEventListener('click',e=>{
 const ed=e.target.closest('[data-edit]');if(ed){editing=ed.dataset.edit;renderKids();return;}
 const b=e.target.closest('[data-kid]');if(b){S.use(b.dataset.kid);$('kids').close();render();}
});
$('kid-form').addEventListener('submit',e=>{
 e.preventDefault();const f=e.target,name=f.elements.name.value.trim();if(!name){f.elements.name.focus();return;}
 const avatar=f.elements.avatar.value||AVATARS[0];
 if(editing==='new'){S.addKid({name,avatar});$('kids').close();toast(`أهلاً ${name}! ${avatar}`);}
 else{S.updateKid(editing,{name,avatar});editing=null;renderKids();}
 render();
});
$('kid-cancel').addEventListener('click',()=>{if(!S.kids().length){$('kids').close();return;}editing=null;renderKids();});
$('kid-delete').addEventListener('click',()=>{const k=S.kid(editing);if(k&&confirm(`حذف ${k.name} وكل تقدّمه؟ ما فينا نرجّعه.`)){S.removeKid(k.id);editing=null;renderKids();render();}});

/* ---------- report ---------- */
function goalsByStatus(kid){
 const out={done:[],now:[],hard:[]};
 for(const l of LESSONS)for(const v of [1,2,3])for(const g of l.goals?.[v]?.items||[]){const s=S.goalStatus(l.id,v,g,kid.id);if(out[s])out[s].push({l,v,g});}
 return out;
}
function reportHTML(kid,forPrint){
 const log=S.log(kid.id),goals=goalsByStatus(kid),levels=LESSONS.reduce((a,l)=>a+[1,2,3].filter(v=>S.levelDone(l.id,v,kid.id)).length,0);
 const max=LESSONS.reduce((a,l)=>a+S.stars(l.id,kid.id).max,0);
 const goalList=s=>`<section class="r-goals g-${s}"><h3>${GOAL[s].title} <span class="count">${ar(goals[s].length)}</span></h3>${goals[s].length?`<ul>${goals[s].map(x=>`<li>${esc(x.g.text)}<small>${esc(x.l.title)} · المستوى ${ar(x.v)}${(r=>r?` · تقييم المعالج ${ar(r.pct)}٪`:'')(S.rating(x.l.id,x.v,x.g,kid.id))}</small></li>`).join('')}</ul>`:'<p class="muted">لا يوجد بعد.</p>'}</section>`;
 const table=l=>`<table class="r-table"><caption>${esc(l.title)}</caption><thead><tr><th>المحطة</th>${[1,2,3].map(v=>`<th>المستوى ${ar(v)}</th>`).join('')}</tr></thead><tbody>${l.stations.map(s=>`<tr><th>${esc(s.title)}</th>${[1,2,3].map(v=>{const x=S.station(l.id,v,s.id,kid.id);
   return`<td>${!S.unlocked(l.id,v,kid.id)?'<span class="muted">مقفول</span>':x.tries?`<span class="r-stars">${'★'.repeat(x.stars)}<span>${'★'.repeat(3-x.stars)}</span></span><small>${ar(x.pct)}٪ · ${ar(x.tries)} مرة</small>`:'<span class="muted">—</span>'}</td>`;}).join('')}</tr>`).join('')}</tbody></table>`;
 const recent=log.slice(-12).reverse();
 const stName=(lid,sid)=>LESSONS.find(l=>l.id===lid)?.stations.find(s=>s.id===sid)?.title||sid;
 return`<header class="r-head"><img src="icons/logo.svg" width="56" height="56" alt=""><div><h1>تقرير التقدّم</h1><p>${esc(kid.avatar)} <b>${esc(kid.name)}</b> · ${day(Date.now())}</p></div></header>
  <div class="r-tiles"><div><b>${ar(S.totalStars(kid.id))}<small> من ${ar(max)}</small></b><span>نجمة</span></div><div><b>${ar(levels)}<small> من ${ar(LESSONS.length*3)}</small></b><span>مستوى خلص</span></div><div><b>${ar(log.length)}</b><span>مرة لعب</span></div><div><b class="date">${day(log.at(-1)?.t)}</b><span>آخر مرة</span></div></div>
  <h2>الأهداف</h2><div class="r-goal-grid">${goalList('now')}${goalList('done')}${goalList('hard')}</div>
  <h2>التقدّم بكل درس</h2>${LESSONS.filter(l=>S.unlocked(l.id,1,kid.id)).map(table).join('')}
  <h2>آخر الجلسات</h2>${recent.length?`<table class="r-table"><thead><tr><th>التاريخ</th><th>الدرس</th><th>المستوى</th><th>المحطة</th><th>النتيجة</th></tr></thead><tbody>${recent.map(r=>`<tr><td>${day(r.t)}</td><td>${esc(LESSONS.find(l=>l.id===r.l)?.title||r.l)}</td><td>${ar(r.v)}</td><td>${esc(stName(r.l,r.s))}</td><td><span class="r-stars">${'★'.repeat(r.stars)}</span> ${ar(r.pct)}٪</td></tr>`).join('')}</tbody></table>`:'<p class="muted">لسا ما في جلسات.</p>'}
  <h2>ملاحظات المعالج</h2>${forPrint?`<p class="r-notes">${esc(kid.notes||'—')}</p>`:`<textarea id="notes" rows="4" placeholder="اكتب ملاحظاتك هون… (بتنحفظ وبتطلع بالتقرير)">${esc(kid.notes||'')}</textarea>`}
  <footer class="r-foot"><b>${esc(CONTACT.name)}</b> · ${esc(CONTACT.title)} · ${esc(CONTACT.place)}<br><span dir="ltr">${esc(CONTACT.email)}${CONTACT.whatsapp?` · +${esc(CONTACT.whatsapp)}`:''}</span></footer>`;
}
function openReport(){
 const kid=S.current();if(!kid){openKids('new');return;}
 $('report-body').innerHTML=reportHTML(kid,false);
 $('notes').addEventListener('input',e=>S.updateKid(kid.id,{notes:e.target.value}));
 $('report').showModal();
}
$('report-pdf').addEventListener('click',()=>{
 const kid=S.current();$('print-area').innerHTML=reportHTML(kid,true);
 const t=document.title;document.title=`تقرير ${kid.name} ${new Date().toISOString().slice(0,10)}`;
 document.body.classList.add('printing');window.print();
 setTimeout(()=>{document.body.classList.remove('printing');document.title=t;},500);
});
$('report-share').addEventListener('click',async()=>{
 const kid=S.current(),g=goalsByStatus(kid),list=s=>g[s].length?g[s].map(x=>`• ${x.g.text} (${x.l.title} · م${ar(x.v)})`).join('\n'):'—';
 const text=`تقرير التقدّم: ${kid.name} · ${day(Date.now())}\n⭐ ${ar(S.totalStars(kid.id))} نجمة\n\n${GOAL.now.title}:\n${list('now')}\n\n${GOAL.done.title}:\n${list('done')}\n\n${GOAL.hard.title}:\n${list('hard')}${kid.notes?`\n\nملاحظات: ${kid.notes}`:''}\n\n${CONTACT.name} · ${CONTACT.title}`;
 try{if(navigator.share){await navigator.share({title:`تقرير ${kid.name}`,text});return;}}catch(e){if(e.name==='AbortError')return;}
 try{await navigator.clipboard.writeText(text);toast('انتسخ التقرير، الصقه وين ما بدك 📋');}catch{toast('ما زبط النسخ');}
});

/* ---------- info and contact ---------- */
function openInfo(){
 const wa=CONTACT.whatsapp?`<a class="big-button wa" href="https://wa.me/${esc(CONTACT.whatsapp)}" target="_blank" rel="noopener">${svg('whatsapp')}واتساب</a>`:'';
 $('info-body').innerHTML=`<p>دروس استماع للأطفال بشكل ألعاب. كل درس فيه أربع محطات وثلاث مستويات: معلومة واحدة، معلومتين، وثلاث معلومات.</p>
  <ul class="how"><li>🔓 لما يخلّص الطفل كل محطات المستوى ١ بدرس، بينفتح المستوى ٢ من نفس الدرس والمستوى ١ من الدرس اللي بعده.</li><li>⭐ النجوم والتقدّم بينحفظوا لكل طفل لحاله، على هالجهاز.</li><li>📄 من «تقرير التقدّم» فيك تطبع أو تحفظ PDF أو تشارك الأهداف.</li></ul>
  <section class="contact"><img src="icons/logo.svg" width="56" height="56" alt=""><div><b>${esc(CONTACT.name)}</b><span>${esc(CONTACT.title)}</span><span>${esc(CONTACT.place)}</span><span class="en" dir="ltr">${esc(CONTACT.nameEn)} · ${esc(CONTACT.titleEn)}</span></div></section>
  <div class="contact-actions">${wa}<a class="big-button soft" href="mailto:${esc(CONTACT.email)}">${svg('mail')}<span dir="ltr">${esc(CONTACT.email)}</span></a></div>`;
 $('info').showModal();
}

/* ---------- wiring ---------- */
$('open-menu').addEventListener('click',()=>{renderMenu();$('therapist').checked=S.therapist();$('menu').showModal();});
$('open-kids').addEventListener('click',()=>openKids(S.kids().length?null:'new'));
$('open-info').addEventListener('click',openInfo);
$('welcome-add').addEventListener('click',()=>openKids('new'));
$('road').addEventListener('click',e=>{const b=e.target.closest('[data-lesson]');if(b)openLesson(b.dataset.lesson);});
$('menu').addEventListener('click',e=>{
 const b=e.target.closest('[data-lesson]');if(b){if(!S.current()){openKids('new');return;}$('menu').close();openLesson(b.dataset.lesson);return;}
 if(e.target.closest('[data-go="kids"]')){$('menu').close();openKids();}
});
// Therapist mode: switching on asks for the code; switching off doesn't. On = every lesson and level open + goal ratings.
$('therapist').addEventListener('change',e=>{
 if(!e.target.checked){S.setTherapist(false);toast('وضع المعالج مطفي');render();renderMenu();return;}
 e.target.checked=false; // stays off until the code is right
 $('pin-code').value='';$('pin-error').hidden=true;$('pin').showModal();setTimeout(()=>$('pin-code').focus(),60);
});
$('pin-form').addEventListener('submit',e=>{
 e.preventDefault();const f=$('pin-form');
 if($('pin-code').value.trim()!==THERAPIST_CODE){$('pin-error').hidden=false;$('pin-code').value='';f.classList.remove('shake');void f.offsetWidth;f.classList.add('shake');$('pin-code').focus();return;}
 S.setTherapist(true);$('therapist').checked=true;$('pin').close();toast('وضع المعالج شغّال 🩺 كل الدروس مفتوحة');render();renderMenu();
});
$('menu-report').addEventListener('click',()=>{$('menu').close();openReport();});
$('menu-kids').addEventListener('click',()=>{$('menu').close();openKids();});
$('menu-info').addEventListener('click',()=>{$('menu').close();openInfo();});
document.querySelectorAll('dialog').forEach(d=>{
 d.querySelector('[data-close]')?.addEventListener('click',()=>d.close());
 d.addEventListener('click',e=>{if(e.target===d)d.close();});
});
addEventListener('pageshow',e=>{if(e.persisted)render();});
addEventListener('storage',render);
render();
if(new URLSearchParams(location.search).has('report'))openReport();
if('serviceWorker' in navigator&&location.protocol!=='file:')addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
})();
