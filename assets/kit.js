'use strict';
/* Shared pieces for every lesson game (load after assets/store.js):
   - ar(n): Arabic-Indic digits; esc(s): HTML escape.
   - burst(el): a little star burst from an element (skipped when the device asks for less motion).
   - rate(lessonId, level, station): fills the therapist rating box (#rate in the station-done sheet) with that level's goals
     for the station, each with 20/40/60/80% buttons (80% = goal done). Shown only in therapist mode (side list switch).
   - flip(stage, oldPage, rect): turns the old book page over the new one like a real book (spine on the right, RTL).
   - swipe(el, onForward, onBack): a horizontal swipe on a touch screen; forward = finger moves to the right (RTL books). */
(()=>{
const S=window.AURAL_STORE;
const ar=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const still=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;

function burst(el){
 if(still())return;
 const r=el.getBoundingClientRect(),b=document.createElement('span');b.className='burst';b.setAttribute('aria-hidden','true');
 b.style.left=r.left+r.width/2+'px';b.style.top=r.top+r.height/2+'px';
 b.innerHTML=Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2+Math.random()*.4,d=r.width*.55+Math.random()*24;return`<i style="--x:${Math.cos(a)*d}px;--y:${Math.sin(a)*d}px"></i>`;}).join('');
 document.body.append(b);setTimeout(()=>b.remove(),800);
}

function rate(lessonId,level,station){
 const box=document.getElementById('rate');if(!box)return;
 const on=!!S&&S.therapist();box.hidden=!on;box.closest('dialog')?.classList.toggle('rating',on);if(!on)return;
 const l=(window.AURAL_LESSONS||[]).find(x=>x.id===lessonId),items=l?.goals?.[level]?.items||[];
 let list=items.filter(g=>!g.stations||g.stations.includes(station));if(!list.length)list=items;
 const draw=()=>{box.querySelector('ul').innerHTML=list.map(g=>{const i=items.indexOf(g),cur=S.rating(lessonId,level,g)?.pct;
  return`<li><p>${esc(g.text)}</p><div class="pcts" role="group" aria-label="نسبة تحقيق الهدف">${[20,40,60,80].map(v=>`<button type="button" class="p${v}" data-i="${i}" data-v="${v}" aria-pressed="${cur===v}">${ar(v)}٪</button>`).join('')}</div></li>`;}).join('');};
 draw();
 box.onclick=e=>{const b=e.target.closest('[data-v]');if(!b)return;const g=items[+b.dataset.i],v=+b.dataset.v,cur=S.rating(lessonId,level,g)?.pct;
  S.rate(lessonId,level,g,cur===v?null:v);draw();if(v===80&&cur!==80)burst(box.querySelector(`[data-i="${b.dataset.i}"][data-v="80"]`));};
}

function flip(stage,oldPage,rect){
 if(!oldPage||!rect||still())return;
 const s=stage.getBoundingClientRect(),leaf=document.createElement('div');leaf.className='leaf';leaf.setAttribute('aria-hidden','true');
 leaf.style.cssText=`left:${rect.left-s.left}px;top:${rect.top-s.top}px;width:${rect.width}px;height:${rect.height}px`;
 oldPage.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));oldPage.classList.add('leaf-front');
 const back=document.createElement('div');back.className='leaf-back';
 leaf.append(oldPage,back);stage.append(leaf);
 const done=()=>leaf.remove();leaf.addEventListener('animationend',e=>{if(e.target===leaf)done();});setTimeout(done,1400);
}

function swipe(el,onForward,onBack){
 let x0=null,y0=0,t0=0;
 el.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button)return;x0=e.clientX;y0=e.clientY;t0=Date.now();});
 el.addEventListener('pointerup',e=>{if(x0==null)return;const dx=e.clientX-x0,dy=e.clientY-y0;x0=null;
  if(Math.abs(dx)<50||Math.abs(dx)<Math.abs(dy)*1.5||Date.now()-t0>900)return;(dx>0?onForward:onBack)?.();});
 el.addEventListener('pointercancel',()=>x0=null);
}
window.AURAL_KIT={ar,esc,burst,rate,flip,swipe};
})();
