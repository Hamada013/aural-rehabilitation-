'use strict';
// Home dashboard: one button per lesson, built from assets/lessons.js.
const ICONS={ear:'<path d="M8 18a3 3 0 0 0 5-2c.4-1.6 1.6-2.4 2.6-3.6A6 6 0 1 0 6 8"/><path d="M9 9.5a3 3 0 0 1 6 0c0 1.4-.9 2.2-1.7 2.8"/>',sound:'<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',play:'<path d="M8 5v14l11-7z"/>',star:'<path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z"/>',music:'<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'};
const svg=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||ICONS.ear}</svg>`;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){
 const lessons=window.AURAL_LESSONS||[],grid=document.getElementById('lessons');
 if(!lessons.length){grid.innerHTML=`<p class="empty">${svg('star')}<span>الدروس قادمة قريباً</span></p>`;return;}
 grid.innerHTML=lessons.map((l,i)=>`<a class="lesson" href="${esc(l.href)}"><span class="lesson-icon">${svg(l.icon)}</span><span class="lesson-text"><small>الدرس ${i+1}</small><strong>${esc(l.title)}</strong>${l.subtitle?`<em>${esc(l.subtitle)}</em>`:''}</span></a>`).join('');
}
render();
if('serviceWorker' in navigator&&location.protocol!=='file:')addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
