// Browser check: plays every station at every level on a phone, an iPad and a landscape phone,
// makes one wrong choice per station, and saves screenshots to output/screens.
// Run: APP_PLAYWRIGHT=/path/to/node_modules/playwright node tests/browser.cjs
const http=require('http'),fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const {chromium,webkit}=require(process.env.APP_PLAYWRIGHT||'playwright');
const TYPES={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json','.m4a':'audio/mp4','.txt':'text/plain','.woff2':'font/woff2'};
const server=http.createServer((q,s)=>{const f=path.join(root,decodeURIComponent(new URL(q.url,'http://x').pathname).replace(/\/$/,'/index.html'));
 if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){s.writeHead(404);s.end();return;}
 s.writeHead(200,{'content-type':TYPES[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(s);});
const SIZES={phone:{width:390,height:844},ipad:{width:1024,height:768},landscape:{width:844,height:390},laptop:{width:1280,height:664}};
const out=path.join(root,'output/screens');fs.mkdirSync(out,{recursive:true});
// Every station content element must sit inside the stage (nothing hidden behind the tray or off screen).
const fits=page=>page.evaluate(()=>{const st=document.getElementById('stage'),s=st.getBoundingClientRect(),c=st.firstElementChild;if(!c)return true;
 const r=c.getBoundingClientRect();return r.top>=s.top-2&&r.bottom<=s.bottom+2&&r.left>=s.left-2&&r.right<=s.right+2;});
// Lesson 2 · مطبخي: plays every station (levels 1–3 on the phone, level 2 elsewhere) with one wrong choice per station.
async function playKitchen(page,name,base,errors){
 await page.goto(base+'lessons/02-my-kitchen/index.html?test');await page.waitForSelector('.station');
 await page.screenshot({path:`${out}/kitchen-map-${name}.png`});
 for(const level of name==='phone'?[1,2,3]:[2]){
  await page.click(`[data-level="${level}"]`);
  for(const st of ['things','book','hat','jobs']){
   await page.click(`[data-station="${st}"]`);await page.waitForSelector('#play:not([hidden])');
   let wrong=false,shot=false;
   for(let guard=0;guard<160;guard++){
    if(await page.locator('#done[open]').count())break;
    const r=await page.evaluate(()=>window.MY_KITCHEN_TEST.run());
    if(r&&r.busy&&await page.locator('#tray .choice.k-button').count()){await page.click('#tray .choice.k-button >> nth=0');await page.waitForTimeout(700);continue;}
    if(!r||!r.round||r.busy){await page.waitForTimeout(150);continue;}
    const s=r.round.steps[r.step];
    if(!shot&&(name!=='phone'||level===2)){await page.waitForTimeout(450);await page.screenshot({path:`${out}/kitchen-${st}-L${level}-${name}.png`});shot=true;
     if(!(await fits(page)))errors.push(`${name} L${level} ${st}: kitchen stage content does not fit`);}
    if(!s){if(await page.locator('#tick').count())await page.click('#tick');await page.click('#page-next');await page.waitForTimeout(250);continue;}
    if(s.taps){await page.evaluate(()=>document.querySelector('#stage .runner:not(.done)')?.click());await page.waitForTimeout(200);continue;}
    const scope=s.where==='tray'?'#tray':'#stage';
    if(!wrong){const bad=await page.evaluate(([scope,s])=>{const ok=s.answers||[String(s.answer)];const b=[...document.querySelectorAll(scope+' [data-choice]')].find(x=>!x.disabled&&!ok.includes(x.dataset.choice));return b?b.dataset.choice:null;},[scope,s]);
     if(bad){await page.click(`${scope} [data-choice="${bad}"]`,{force:true});wrong=true;await page.waitForTimeout(120);}}
    const todo=s.answers?s.answers.filter(a=>!r.got.includes(a)):[String(s.answer)];
    await page.click(`${scope} [data-choice="${todo[0]}"]`,{force:true});
    await page.waitForFunction(([i,step,g])=>{const x=window.MY_KITCHEN_TEST.run();return !x||x.i!==i||x.step!==step||x.got.length!==g||document.querySelector('#done[open]');},[r.i,r.step,r.got.length],{timeout:9000});
   }
   await page.waitForSelector('#done[open]',{timeout:9000}).catch(()=>errors.push(`${name} L${level} ${st}: kitchen station never finished`));
   const over=await page.evaluate(()=>{const p=document.getElementById('play');return p.scrollHeight>p.clientHeight+1||document.documentElement.scrollWidth>innerWidth+1;});
   if(over)errors.push(`${name} L${level} ${st}: kitchen play screen overflows`);
   if(await page.locator('#done[open]').count()){await page.click('#done-map');await page.waitForSelector('#map:not([hidden])');}
  }
 }
}
(async()=>{
 await new Promise(r=>server.listen(0,r));const base=`http://localhost:${server.address().port}/`;
 const browser=await(process.env.APP_ENGINE==='webkit'?webkit:chromium).launch();const errors=[];
 for(const[name,viewport]of Object.entries(SIZES)){
  const page=await browser.newPage({viewport,hasTouch:true});
  page.on('pageerror',e=>errors.push(`${name}: ${e.message}`));
  page.on('console',m=>{if(m.type()==='error'&&!/404|Failed to load resource/.test(m.text()))errors.push(`${name}: ${m.text()}`);});
  // dashboard: first run, add a kid, road map, side list, lesson sheet with goals, info
  await page.goto(base);await page.waitForSelector('#welcome:not([hidden])');
  await page.screenshot({path:`${out}/home-welcome-${name}.png`});
  await page.click('#welcome-add');await page.fill('#kid-form input[name=name]','سارة');await page.click('#avatars label:nth-child(2)');
  await page.click('#kid-form [type=submit]');await page.waitForSelector('.stop-btn[data-lesson]');await page.waitForTimeout(300);
  await page.screenshot({path:`${out}/home-${name}.png`});
  await page.click('#open-menu');await page.waitForSelector('#menu[open] .all-lessons button');await page.waitForTimeout(300);
  await page.screenshot({path:`${out}/home-menu-${name}.png`});
  await page.click('#menu [data-lesson]');await page.waitForSelector('#lesson[open]');
  await page.click('#lesson .goals-box summary');await page.waitForSelector('#lesson .g-now');
  if(name==='phone')await page.screenshot({path:`${out}/home-lesson-${name}.png`});
  await page.keyboard.press('Escape');
  await page.click('#open-info');await page.waitForSelector('#info[open] .contact');if(name==='phone')await page.screenshot({path:`${out}/home-info-${name}.png`});await page.keyboard.press('Escape');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))errors.push(`${name}: dashboard scrolls sideways`);
  // levels open in order on the phone; elsewhere therapist mode (behind the code) opens everything
  if(name!=='phone'){
   await page.click('#open-menu');await page.waitForSelector('#menu[open]');await page.click('#therapist');await page.waitForSelector('#pin[open]');
   await page.fill('#pin-code','111');await page.click('#pin-form [type=submit]');
   if(await page.locator('#pin-error').isHidden()||await page.evaluate(()=>window.AURAL_STORE.therapist()))errors.push(`${name}: a wrong therapist code was accepted`);
   await page.fill('#pin-code','013');await page.click('#pin-form [type=submit]');await page.waitForFunction(()=>!document.getElementById('pin').open);
   if(!(await page.evaluate(()=>window.AURAL_STORE.therapist()&&window.AURAL_STORE.unlocked('my-kitchen',3))))errors.push(`${name}: therapist code did not open everything`);
   if(name==='ipad')await page.screenshot({path:`${out}/home-therapist-${name}.png`});
   await page.keyboard.press('Escape');
  }
  await page.goto(base+'lessons/01-my-house/index.html?test');await page.waitForSelector('.station');
  if(name==='phone'&&!(await page.locator('[data-level="2"]:disabled').count()))errors.push('phone: level 2 should start locked');
  await page.screenshot({path:`${out}/map-${name}.png`});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))errors.push(`${name}: lesson map scrolls sideways`);
  for(const level of name==='phone'?[1,2,3]:[2]){
   await page.click(`[data-level="${level}"]`);
   for(const st of ['build','who','where','book']){
    await page.click(`[data-station="${st}"]`);await page.waitForSelector('#play:not([hidden])');
    let wrong=false,shots=0;
    for(let guard=0;guard<80;guard++){
     if(await page.locator('#done[open]').count())break;
     const r=await page.evaluate(()=>window.MY_HOUSE_TEST.run());
     if(!r||!r.round){const st2=await page.evaluate(()=>({r:window.MY_HOUSE_TEST.run(),done:!!document.querySelector('#done[open]'),play:!document.getElementById('play').hidden}));
      if(!st2.done)errors.push(`${name} L${level} ${st}: no current round and no summary ${JSON.stringify(st2)}`);await page.waitForTimeout(200);if(!st2.done&&guard>5)break;continue;}
     const s=r.round.steps[r.step];
     if(!s){ // book tools
      if(await page.locator('#tick').count()){await page.click('#tick');await page.click('#page-next');}
      await page.waitForTimeout(150);continue;}
     if(s.where==='tray')await page.waitForSelector('#tray [data-choice]');
     if(!wrong){const bad=s.where==='tray'?(s.options||[]).find(o=>o!==s.answer):(await page.evaluate(a=>[...document.querySelectorAll('.room')].map(b=>b.dataset.choice).find(c=>c!==a),s.answer));
      if(bad){const sel=s.where==='tray'?`#tray [data-choice="${bad}"]`:`.room[data-choice="${bad}"]`;await page.click(sel);wrong=true;await page.waitForTimeout(80);}}
     if(shots<1&&(name!=='phone'||level===2)){await page.screenshot({path:`${out}/${st}-L${level}-${name}.png`});shots++;if(!(await fits(page)))errors.push(`${name} L${level} ${st}: stage content does not fit`);}
     const sel=s.where==='tray'?`#tray [data-choice="${s.answer}"]`:`.room[data-choice="${s.answer}"]`;
     await page.click(sel);
     await page.waitForFunction(([i,step])=>{const r=window.MY_HOUSE_TEST.run();return !r||r.i!==i||r.step!==step||document.querySelector('#done[open]');},[r.i,r.step],{timeout:8000});
    }
    await page.waitForSelector('#done[open]');
    if(st==='book'&&name==='phone'&&level===3)await page.screenshot({path:`${out}/done-${name}.png`});
    // the play area must never scroll
    const over=await page.evaluate(()=>{const p=document.getElementById('play');return p.scrollHeight>p.clientHeight+1||document.documentElement.scrollWidth>innerWidth+1;});
    if(over)errors.push(`${name} L${level} ${st}: play screen overflows`);
    await page.click('#done-map');await page.waitForSelector('#map:not([hidden])');
   }
  }
  await page.screenshot({path:`${out}/map-after-${name}.png`});
  await playKitchen(page,name,base,errors);
  // back on the dashboard: stars and the report
  await page.goto(base+'?report');await page.waitForSelector('#report[open] .r-table');await page.waitForTimeout(400);
  if(name==='phone'&&!(await page.locator('#report .g-done li').count()))errors.push('phone: report shows no goals done after playing every level');
  await page.screenshot({path:`${out}/report-${name}.png`,fullPage:true});
  await page.emulateMedia({media:'print'});await page.evaluate(()=>{document.getElementById('print-area').innerHTML=document.getElementById('report-body').innerHTML;});
  if(name==='phone')await page.pdf?.({path:`${out}/report.pdf`,format:'A4'}).catch(()=>{});
  await page.emulateMedia({media:'screen'});
  await page.close();
 }
 await browser.close();server.close();
 if(errors.length){console.error('FAIL\n'+errors.join('\n'));process.exit(1);}
 console.log('PASS: both lessons play through (every level on the phone) on phone, iPad, landscape phone and 13" laptop, and every station fits. Screens in output/screens.');
})().catch(e=>{console.error(e);server.close();process.exit(1);});
