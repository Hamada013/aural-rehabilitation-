/* The lessons on the road map, in order. Add one entry per lesson; the dashboard builds itself from this list.
   Each lesson: {id, title, subtitle, href, cover, tint, stations, goals}.
   cover: the lesson's picture on the road map; tint: its soft background colour.
   stations: [{id, title}] — must match the station ids in the lesson's data.js (tests/check.cjs checks this).
   goals: {1|2|3: {unit, items:[{text, stations:[station ids]}]}} — short goals per level. The stations a goal lists
   decide whether it is done, being worked on, or hard for a kid (see assets/store.js). */
window.AURAL_LESSONS=[
 {id:'my-house',title:'بيتي',subtitle:'أجزاء البيت · العيلة · الأغراض · قصة',href:'lessons/01-my-house/index.html',cover:'lessons/01-my-house/cover.svg',tint:'#fde9e4',
  stations:[{id:'build',title:'نبني البيت'},{id:'who',title:'مين بالبيت؟'},{id:'where',title:'وين بيروح؟'},{id:'book',title:'قصة بيتي'}],
  goals:{
  1:{unit:'معلومة واحدة',items:[
   {text:'يسمع كلمة واحدة ويختار صورتها: جزء من البيت، شخص من العيلة، غرفة، أو غرض.',stations:['build','who']},
   {text:'يقول أو يكرّر كلمة واحدة: باب، شبّاك، بابا، المطبخ…',stations:['book']},
   {text:'يعرف وين بيروح كل غرض بالبيت.',stations:['where']},
   {text:'يتابع القصة ويكرّر كلمة من كل صفحة.',stations:['book']}
  ]},
  2:{unit:'معلومتان',items:[
   {text:'يسمع معلومتين بنفس الجملة: اللون والجزء («الباب الأصفر»)، الشخص والغرفة («بابا بالمطبخ»).',stations:['build','who']},
   {text:'يفهم «حطّ الغرض بالمكان» ويختار الاثنين.',stations:['where']},
   {text:'يقول 2–3 كلمات مع بعض: «تيتا بغرفة البيبي».',stations:['book']},
   {text:'يكرّر 2–3 كلمات من كل صفحة بالقصة.',stations:['book']}
  ]},
  3:{unit:'ثلاث معلومات',items:[
   {text:'يسمع ثلاث معلومات: مين، شو عم يعمل، ووين («تيتا عم تطبخ بالمطبخ»).',stations:['who']},
   {text:'يعرف الشي من وصف استعماله («منه منشوف برّا» = الشباك).',stations:['build','where']},
   {text:'يجاوب سؤال عن القصة: «شو منعمل بالمطبخ؟».',stations:['book']},
   {text:'يكرّر جملة من 5–6 كلمات ويحكي عن بيته.',stations:['book']}
  ]}
 }},
 {id:'my-kitchen',title:'مطبخي',subtitle:'أغراض المطبخ · قصة البسكوتات · قبعة الطبّاخ · شغلات الطبّاخ',href:'lessons/02-my-kitchen/index.html',cover:'lessons/02-my-kitchen/cover.svg',tint:'#fff1d6',
  stations:[{id:'things',title:'أغراض المطبخ'},{id:'book',title:'قصة البسكوتات'},{id:'hat',title:'قبعة الطبّاخ'},{id:'jobs',title:'شغلات الطبّاخ'}],
  goals:{
  1:{unit:'معلومة واحدة',items:[
   {text:'يسمع اسم غرض من المطبخ ويلاقيه: زبدية، كوباية، شوكة…',stations:['things']},
   {text:'يفهم «متل بعض» ويطابق الصورة مع الصورة.',stations:['things']},
   {text:'يتابع قصة البسكوتات، يعرف الصبي من البنت، ويكرّر كلمة من كل صفحة.',stations:['book']},
   {text:'ينفّذ تعليمة بسيطة ويعرف الأفعال: لزّق، اطوي، قصّ، لبّس.',stations:['hat']},
   {text:'يسمع فعل (قصّ / اغسل) أو أكلة ويلاقيها.',stations:['jobs']}
  ]},
  2:{unit:'معلومتان',items:[
   {text:'يسمع غرضين بنفس الجملة («الكوباية والشوكة») ويلاقي الاثنين.',stations:['things']},
   {text:'يلاقي رقم الصفحة ويكرّر 2–3 كلمات من القصة.',stations:['book']},
   {text:'يفهم فعل + مكان: «حطّ لزق عالطرف»، «قصّ عالخطوط».',stations:['hat']},
   {text:'يسمع فعل + أكلة: «اغسل التفاحة».',stations:['jobs']}
  ]},
  3:{unit:'ثلاث معلومات',items:[
   {text:'يعرف الغرض من وصف استعماله («منصفّي فيها المعكرونة» = المصفاية).',stations:['things']},
   {text:'يفهم «قبل» و«بعد» بالقصة ويكرّر جملة من 4–5 كلمات.',stations:['book']},
   {text:'ينفّذ تعليمتين ورا بعض: «اقلب الورقة، وبعدين اطويها».',stations:['hat']},
   {text:'يسمع مين + شو لازم يعمل + بشو: «ماما لازم تغسل التفاحة».',stations:['jobs']}
  ]}
 }}
];
