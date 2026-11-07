// Lesson content checks: every sound a round uses exists, numbers are unique, every picture is drawn,
// and each lesson's sounds/sounds.txt matches its data.js.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{execFileSync}=require('child_process'),root=path.resolve(__dirname,'..');
const dir=path.join(root,'lessons/01-my-house'),w={};
for(const f of ['data.js','art.js'])new Function('window',fs.readFileSync(path.join(dir,f),'utf8'))(w);
const D=w.MY_HOUSE,A=w.HOUSE_ART;
const keys=new Set(),nums=new Set();
for(const s of D.sounds){assert.ok(!keys.has(s.key),'duplicate key '+s.key);assert.ok(!nums.has(s.n),'duplicate number '+s.n);assert.ok(s.text&&s.use,s.key);keys.add(s.key);nums.add(s.n);}
const need=k=>assert.ok(keys.has(k),'missing sound '+k);
['welcome','listen','bravo','again','done',...D.stations.map(s=>'intro.'+s.id)].forEach(need);
for(const l of [1,2,3]){
 for(const r of D.build[l]){need(r.say);assert.ok(D.parts[r.part]);if(r.color)assert.ok(D.colors[r.color]);assert.ok(A.piece(r.part,r.color||D.parts[r.part].def).length>200);}
 for(const r of D.who[l]){need(r.say);assert.ok(D.people[r.person],r.person);assert.ok(D.rooms.includes(r.room),r.room);if(r.action)assert.ok(D.whoActions.includes(r.action),r.action);}
}
for(const[o,v]of Object.entries(D.objects)){['obj.','put.','desc.'].forEach(p=>need(p+o));assert.ok(D.places[v.place]);assert.ok(A.object(o).length>200,'no picture for '+o);}
for(const p of Object.keys(D.places)){need('place.'+p);assert.ok(A.place(p).length>200,'no picture for '+p);}
for(const p of Object.keys(D.people)){need('person.'+p);assert.ok(A.person(p).length>200);}
for(const a of Object.keys(D.actions))assert.ok(A.action(a).length>120,'no icon for '+a);
for(const p of D.book){['book.','ask.','phrase.'].forEach(x=>need(x+p.id));need(p.word);assert.ok(D.actions[p.action]);assert.ok(A.object(p.pic).length>200,'no picture for '+p.pic);assert.equal(p.lines.length,2);}
// Level 1 "where" needs at least two objects from other places for every object.
for(const[o,v]of Object.entries(D.objects))assert.ok(Object.values(D.objects).filter(x=>x.place!==v.place).length>=2,o);
// Lesson 2 · مطبخي
{
 const dir2=path.join(root,'lessons/02-my-kitchen'),w2={};
 for(const f of ['data.js','art.js'])new Function('window',fs.readFileSync(path.join(dir2,f),'utf8'))(w2);
 const K=w2.MY_KITCHEN,KA=w2.KITCHEN_ART,keys2=new Set(),nums2=new Set();
 for(const s of K.sounds){assert.ok(!keys2.has(s.key),'kitchen duplicate key '+s.key);assert.ok(!nums2.has(s.n),'kitchen duplicate number '+s.n);assert.ok(s.text&&s.use,s.key);keys2.add(s.key);nums2.add(s.n);}
 const need2=k=>assert.ok(keys2.has(k),'kitchen missing sound '+k);
 ['welcome','listen','bravo','again','done','same','fav.color','book.cover','cover.boy','cover.girl','catch','yum',...K.stations.map(s=>'intro.'+s.id)].forEach(need2);
 for(const id of K.board1)need2('item.'+id);
 for(const id of K.board2){need2('desc.'+id);assert.ok(K.items[id]&&KA.items.includes(id),'kitchen item '+id);}
 for(const f of K.find){need2(f.say);f.items.forEach(i=>assert.ok(K.board2.includes(i),'find item '+i));}
 K.book.forEach((p,i)=>{['book.','word.','phrase.'].forEach(x=>need2(x+p.id));if(i)need2('num.'+(i+1));assert.ok(KA.scenes.includes(p.id),'no scene for '+p.id);
  if(p.ask){need2('ask.'+p.id);assert.ok(K.book.some(q=>q.id===p.ask.answer)&&K.book.some(q=>q.id===p.ask.other),'ask pages '+p.id);}});
 for(const l of [1,2,3])for(const h of K.hat[l]){need2(h.say);for(const x of h.steps)assert.ok(x.tool?K.tools[x.tool]&&KA.tools.includes(x.tool):K.hatPlaces[x.place]&&KA.places.includes(x.place),'hat step '+JSON.stringify(x));}
 for(const l of [1,2,3])for(const j of K.jobs[l]){assert.ok(K.verbs[j.verb]&&K.foods[j.food],'job '+JSON.stringify(j));if(l===1){need2('verb.'+j.verb);need2('food.'+j.food);}else need2(j.say);if(l===3)assert.ok(K.people[j.person],'job person '+j.person);}
 for(const f of K.foodOrder)assert.ok(KA.foods.includes(f),'no picture for food '+f);
 console.log(`PASS: lesson 2 has ${K.sounds.length} sounds, all rounds and pictures complete.`);
}
execFileSync(process.execPath,[path.join(root,'scripts/sounds-list.cjs'),'--check'],{stdio:'inherit'});
console.log(`PASS: lesson 1 has ${D.sounds.length} sounds, all rounds and pictures complete, sounds.txt up to date.`);
