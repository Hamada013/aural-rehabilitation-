/* Lesson 1 · بيتي — all game content. Inspired by a themed listening kit; words, rounds and art are our own.
   Sounds: each entry is sounds/<n>.m4a. Keep numbers stable once recorded; add new lines with new numbers.
   After changing this list run: node scripts/sounds-list.cjs  (rewrites sounds/sounds.txt). */
window.MY_HOUSE={
sounds:[
 // General
 {n:1,key:'welcome',text:'أهلاً! اليوم رح نلعب ببيتي.',use:'Lesson start'},
 {n:2,key:'listen',text:'اسمع منيح.',use:'Before the first round of a station'},
 {n:3,key:'bravo',text:'برافو!',use:'End of a station'},
 {n:4,key:'again',text:'اسمع كمان مرة.',use:'After a wrong choice'},
 {n:5,key:'done',text:'خلصنا! شاطر كتير.',use:'All four stations finished'},
 {n:6,key:'intro.build',text:'يلا نبني البيت.',use:'Station 1 start'},
 {n:7,key:'intro.who',text:'مين بالبيت؟ يلا نشوف.',use:'Station 2 start'},
 {n:8,key:'intro.where',text:'وين بيروح كل غرض؟',use:'Station 3 start'},
 {n:9,key:'intro.book',text:'يلا نقرا قصة بيتي.',use:'Station 4 start'},
 // Station 1 · house parts (Level 1)
 {n:10,key:'part.roof',text:'السطح',use:'Build · L1'},
 {n:11,key:'part.door',text:'الباب',use:'Build · L1 · also book word'},
 {n:12,key:'part.window',text:'الشباك',use:'Build · L1 · also book word'},
 {n:13,key:'part.curtain',text:'الستارة',use:'Build · L1'},
 {n:14,key:'part.chimney',text:'المدخنة',use:'Build · L1'},
 // Station 1 · colour + part (Level 2)
 {n:15,key:'build2.roof',text:'السطح الأحمر',use:'Build · L2'},
 {n:16,key:'build2.door',text:'الباب الأصفر',use:'Build · L2'},
 {n:17,key:'build2.window',text:'الشباك الأزرق',use:'Build · L2'},
 {n:18,key:'build2.curtain',text:'الستارة الخضرا',use:'Build · L2'},
 {n:19,key:'build2.chimney',text:'المدخنة الزرقا',use:'Build · L2'},
 // Station 1 · what it is for (Level 3)
 {n:20,key:'build3.roof',text:'بيحمي البيت من الشتي والشمس.',use:'Build · L3 · roof'},
 {n:21,key:'build3.door',text:'منه منفوت ومنطلع من البيت.',use:'Build · L3 · door'},
 {n:22,key:'build3.window',text:'منه منشوف برّا وبيفوت الضو.',use:'Build · L3 · window'},
 {n:23,key:'build3.curtain',text:'منسكّرها بالليل لحتى تعتم الغرفة.',use:'Build · L3 · curtain'},
 {n:24,key:'build3.chimney',text:'منه بيطلع الدخان لفوق.',use:'Build · L3 · chimney'},
 // People
 {n:25,key:'person.dad',text:'بابا',use:'Who · L1'},
 {n:26,key:'person.mom',text:'ماما',use:'Who · L1'},
 {n:27,key:'person.grandpa',text:'جدّو',use:'Who · L1'},
 {n:28,key:'person.grandma',text:'تيتا',use:'Who · L1'},
 {n:29,key:'person.boy',text:'الصبي',use:'Who · L1'},
 {n:30,key:'person.girl',text:'البنت',use:'Who · L1'},
 // Places
 {n:31,key:'place.kitchen',text:'المطبخ',use:'Who · L1, Where · after a match, book word'},
 {n:32,key:'place.bath',text:'الحمّام',use:'Who · L1, Where'},
 {n:33,key:'place.bedroom',text:'غرفة النوم',use:'Who · L1, Where'},
 {n:34,key:'place.living',text:'الصالون',use:'Who · L1, Where'},
 {n:35,key:'place.kids',text:'غرفة الولاد',use:'Who · L1, Where'},
 {n:36,key:'place.baby',text:'غرفة البيبي',use:'Who · L1, Where'},
 {n:37,key:'place.garage',text:'الكراج',use:'Where'},
 {n:38,key:'place.garden',text:'الجنينة',use:'Where · also book word'},
 // Station 2 · person + place (Level 2)
 {n:39,key:'who2.1',text:'بابا بالمطبخ',use:'Who · L2'},
 {n:40,key:'who2.2',text:'ماما بالصالون',use:'Who · L2'},
 {n:41,key:'who2.3',text:'جدّو بغرفة النوم',use:'Who · L2'},
 {n:42,key:'who2.4',text:'تيتا بغرفة البيبي',use:'Who · L2'},
 {n:43,key:'who2.5',text:'الصبي بالحمّام',use:'Who · L2'},
 {n:44,key:'who2.6',text:'البنت بغرفة الولاد',use:'Who · L2'},
 // Station 2 · person + action + place (Level 3)
 {n:45,key:'who3.1',text:'تيتا عم تطبخ بالمطبخ',use:'Who · L3'},
 {n:46,key:'who3.2',text:'بابا عم يقرا بالصالون',use:'Who · L3'},
 {n:47,key:'who3.3',text:'جدّو نايم بالصالون',use:'Who · L3'},
 {n:48,key:'who3.4',text:'ماما عم تلعب بغرفة الولاد',use:'Who · L3'},
 {n:49,key:'who3.5',text:'الصبي عم يتحمّم بالحمّام',use:'Who · L3'},
 {n:50,key:'who3.6',text:'البنت عم تتفرّج عالتلفزيون بغرفة النوم',use:'Who · L3'},
 // Objects (Level 1)
 {n:51,key:'obj.pan',text:'المقلاية',use:'Where · L1'},
 {n:52,key:'obj.soap',text:'الصابونة',use:'Where · L1'},
 {n:53,key:'obj.brush',text:'فرشاية السنان',use:'Where · L1'},
 {n:54,key:'obj.pillow',text:'المخدّة',use:'Where · L1'},
 {n:55,key:'obj.tv',text:'التلفزيون',use:'Where · L1'},
 {n:56,key:'obj.ball',text:'الطابة',use:'Where · L1'},
 {n:57,key:'obj.rattle',text:'الخشخيشة',use:'Where · L1'},
 {n:58,key:'obj.car',text:'السيارة',use:'Where · L1'},
 {n:59,key:'obj.can',text:'رشّاشة المي',use:'Where · L1'},
 // Station 3 · object + place (Level 2)
 {n:60,key:'put.pan',text:'حطّ المقلاية بالمطبخ',use:'Where · L2'},
 {n:61,key:'put.soap',text:'حطّ الصابونة بالحمّام',use:'Where · L2'},
 {n:62,key:'put.brush',text:'حطّ فرشاية السنان بالحمّام',use:'Where · L2'},
 {n:63,key:'put.pillow',text:'حطّ المخدّة بغرفة النوم',use:'Where · L2'},
 {n:64,key:'put.tv',text:'حطّ التلفزيون بالصالون',use:'Where · L2'},
 {n:65,key:'put.ball',text:'حطّ الطابة بغرفة الولاد',use:'Where · L2'},
 {n:66,key:'put.rattle',text:'حطّ الخشخيشة بغرفة البيبي',use:'Where · L2'},
 {n:67,key:'put.car',text:'حطّ السيارة بالكراج',use:'Where · L2'},
 {n:68,key:'put.can',text:'حطّ رشّاشة المي بالجنينة',use:'Where · L2'},
 // Station 3 · what it is for (Level 3)
 {n:69,key:'desc.pan',text:'منقلي فيها البيض.',use:'Where · L3 · pan'},
 {n:70,key:'desc.soap',text:'منغسل فيها إيدينا لتصير نضاف.',use:'Where · L3 · soap'},
 {n:71,key:'desc.brush',text:'منفرك فيها سناننا.',use:'Where · L3 · toothbrush'},
 {n:72,key:'desc.pillow',text:'منحط راسنا عليها وقت ننام.',use:'Where · L3 · pillow'},
 {n:73,key:'desc.tv',text:'منتفرّج عليه عالرسوم المتحركة.',use:'Where · L3 · TV'},
 {n:74,key:'desc.ball',text:'منلعب فيها ومنشوطها.',use:'Where · L3 · ball'},
 {n:75,key:'desc.rattle',text:'البيبي بيهزّها وبتعمل صوت.',use:'Where · L3 · rattle'},
 {n:76,key:'desc.car',text:'منركب فيها ومنروح مشوار.',use:'Where · L3 · car'},
 {n:77,key:'desc.can',text:'منسقي فيها الورد.',use:'Where · L3 · watering can'},
 // Station 4 · story pages
 {n:78,key:'book.door',text:'بيتي فيه باب كبير، لندقّ عليه.',use:'Book page 1'},
 {n:79,key:'book.kitchen',text:'بيتي فيه مطبخ كله أغراض بتلمع، لنطبخ فيه.',use:'Book page 2'},
 {n:80,key:'book.window',text:'بيتي فيه شبابيك عالية، لنتفرّج منها لبرّا.',use:'Book page 3'},
 {n:81,key:'book.garden',text:'بيتي فيه جنينة فيها شمس، لنزرع فيها ورد.',use:'Book page 4'},
 {n:82,key:'book.table',text:'بيتي فيه طاولة عليها شرشف أحمر، لناكل عليها.',use:'Book page 5'},
 {n:83,key:'book.chair',text:'بيتي فيه كرسي قديم، لنقرا عليه سوا.',use:'Book page 6'},
 {n:84,key:'book.bear',text:'بيتي فيه دبدوبي الحلو، لأحضنه.',use:'Book page 7'},
 {n:85,key:'book.bed',text:'وبيتي فيه تخت ناعم ودافي، لنام فيه. تصبح على خير!',use:'Book page 8'},
 // Station 4 · words when the picture is tapped
 {n:86,key:'word.table',text:'الطاولة',use:'Book L1 word'},
 {n:87,key:'word.chair',text:'الكرسي',use:'Book L1 word'},
 {n:88,key:'word.bear',text:'الدبدوب',use:'Book L1 word'},
 {n:89,key:'word.bed',text:'التخت',use:'Book L1 word'},
 // Station 4 · questions (Level 3)
 {n:90,key:'ask.door',text:'شو منعمل بالباب؟',use:'Book L3 question'},
 {n:91,key:'ask.kitchen',text:'شو منعمل بالمطبخ؟',use:'Book L3 question'},
 {n:92,key:'ask.window',text:'شو منعمل بالشباك؟',use:'Book L3 question'},
 {n:93,key:'ask.garden',text:'شو منعمل بالجنينة؟',use:'Book L3 question'},
 {n:94,key:'ask.table',text:'شو منعمل عالطاولة؟',use:'Book L3 question'},
 {n:95,key:'ask.chair',text:'شو منعمل عالكرسي؟',use:'Book L3 question'},
 {n:96,key:'ask.bear',text:'شو منعمل بالدبدوب؟',use:'Book L3 question'},
 {n:97,key:'ask.bed',text:'شو منعمل بالتخت؟',use:'Book L3 question'},
 // Station 4 · short phrases when the picture is tapped (Level 2)
 {n:98,key:'phrase.door',text:'باب كبير',use:'Book L2 phrase'},
 {n:99,key:'phrase.kitchen',text:'مطبخ بيلمع',use:'Book L2 phrase'},
 {n:100,key:'phrase.window',text:'شبابيك عالية',use:'Book L2 phrase'},
 {n:101,key:'phrase.garden',text:'جنينة فيها شمس',use:'Book L2 phrase'},
 {n:102,key:'phrase.table',text:'شرشف أحمر',use:'Book L2 phrase'},
 {n:103,key:'phrase.chair',text:'كرسي قديم',use:'Book L2 phrase'},
 {n:104,key:'phrase.bear',text:'دبدوبي الحلو',use:'Book L2 phrase'},
 {n:105,key:'phrase.bed',text:'تخت ناعم ودافي',use:'Book L2 phrase'}
],
colors:{red:{name:'أحمر',hex:'#e5646e'},blue:{name:'أزرق',hex:'#4f9bd9'},yellow:{name:'أصفر',hex:'#f2c14e'},green:{name:'أخضر',hex:'#6cc08b'},brick:{name:'قرميدي',hex:'#c9714f'}},
parts:{
 roof:{name:'السطح',def:'red'},door:{name:'الباب',def:'blue'},window:{name:'الشباك',def:'yellow'},curtain:{name:'الستارة',def:'red'},chimney:{name:'المدخنة',def:'brick'}
},
people:{dad:{name:'بابا'},mom:{name:'ماما'},grandpa:{name:'جدّو'},grandma:{name:'تيتا'},boy:{name:'الصبي'},girl:{name:'البنت'}},
places:{kitchen:{name:'المطبخ'},bath:{name:'الحمّام'},bedroom:{name:'غرفة النوم'},living:{name:'الصالون'},kids:{name:'غرفة الولاد'},baby:{name:'غرفة البيبي'},garage:{name:'الكراج'},garden:{name:'الجنينة'}},
rooms:['bath','baby','bedroom','kids','kitchen','living'],
actions:{sleep:{name:'نوم'},cook:{name:'طبخ'},play:{name:'لعب'},read:{name:'قراءة'},bathe:{name:'حمّام'},watch:{name:'تلفزيون'},knock:{name:'دقّ'},look:{name:'تفرّج'},water:{name:'سقاية'},eat:{name:'أكل'},hug:{name:'حضن'}},
whoActions:['sleep','cook','play','read','bathe','watch'],
objects:{
 pan:{name:'المقلاية',place:'kitchen'},soap:{name:'الصابونة',place:'bath'},brush:{name:'فرشاية السنان',place:'bath'},
 pillow:{name:'المخدّة',place:'bedroom'},tv:{name:'التلفزيون',place:'living'},ball:{name:'الطابة',place:'kids'},
 rattle:{name:'الخشخيشة',place:'baby'},car:{name:'السيارة',place:'garage'},can:{name:'رشّاشة المي',place:'garden'}
},
stations:[
 {id:'build',title:'نبني البيت',icon:'build'},
 {id:'who',title:'مين بالبيت؟',icon:'people'},
 {id:'where',title:'وين بيروح؟',icon:'where'},
 {id:'book',title:'قصة بيتي',icon:'book'}
],
// Station 1: parts go on in this order, so a curtain always follows its window.
build:{
 1:[{part:'roof',say:'part.roof'},{part:'door',say:'part.door'},{part:'window',say:'part.window'},{part:'curtain',say:'part.curtain'},{part:'chimney',say:'part.chimney'}],
 2:[{part:'roof',color:'red',say:'build2.roof'},{part:'door',color:'yellow',say:'build2.door'},{part:'window',color:'blue',say:'build2.window'},{part:'curtain',color:'green',say:'build2.curtain'},{part:'chimney',color:'blue',say:'build2.chimney'}],
 3:[{part:'roof',say:'build3.roof'},{part:'door',say:'build3.door'},{part:'window',say:'build3.window'},{part:'curtain',say:'build3.curtain'},{part:'chimney',say:'build3.chimney'}]
},
// Station 2. Level 1 alternates "who?" and "which room?"; the person or room not asked about is set by the round.
who:{
 1:[{ask:'person',person:'dad',room:'living',say:'person.dad'},{ask:'room',person:'girl',room:'kitchen',say:'place.kitchen'},{ask:'person',person:'grandma',room:'baby',say:'person.grandma'},{ask:'room',person:'boy',room:'bath',say:'place.bath'},{ask:'person',person:'mom',room:'bedroom',say:'person.mom'},{ask:'room',person:'grandpa',room:'kids',say:'place.kids'}],
 2:[{person:'dad',room:'kitchen',say:'who2.1'},{person:'mom',room:'living',say:'who2.2'},{person:'grandpa',room:'bedroom',say:'who2.3'},{person:'grandma',room:'baby',say:'who2.4'},{person:'boy',room:'bath',say:'who2.5'},{person:'girl',room:'kids',say:'who2.6'}],
 3:[{person:'grandma',action:'cook',room:'kitchen',say:'who3.1'},{person:'dad',action:'read',room:'living',say:'who3.2'},{person:'grandpa',action:'sleep',room:'living',say:'who3.3'},{person:'mom',action:'play',room:'kids',say:'who3.4'},{person:'boy',action:'bathe',room:'bath',say:'who3.5'},{person:'girl',action:'watch',room:'bedroom',say:'who3.6'}]
},
whereRounds:6,
book:[
 {id:'door',pic:'door',lines:['بيتي فيه باب كبير','لندقّ عليه.'],word:'part.door',action:'knock'},
 {id:'kitchen',pic:'kitchen',lines:['بيتي فيه مطبخ كله أغراض بتلمع','لنطبخ فيه.'],word:'place.kitchen',action:'cook'},
 {id:'window',pic:'tallwindow',lines:['بيتي فيه شبابيك عالية','لنتفرّج منها لبرّا.'],word:'part.window',action:'look'},
 {id:'garden',pic:'garden',lines:['بيتي فيه جنينة فيها شمس','لنزرع فيها ورد.'],word:'place.garden',action:'water'},
 {id:'table',pic:'table',lines:['بيتي فيه طاولة عليها شرشف أحمر','لناكل عليها.'],word:'word.table',action:'eat'},
 {id:'chair',pic:'chair',lines:['بيتي فيه كرسي قديم','لنقرا عليه سوا.'],word:'word.chair',action:'read'},
 {id:'bear',pic:'bear',lines:['بيتي فيه دبدوبي الحلو','لأحضنه.'],word:'word.bear',action:'hug'},
 {id:'bed',pic:'bed',lines:['وبيتي فيه تخت ناعم ودافي','لنام فيه. تصبح على خير!'],word:'word.bed',action:'sleep'}
]
};
