import {note,rng,shuffle,LETTERS,pitchName} from './theory.js?v=unified-12';
import {KEYS,naturalScale,pitchClass} from './curriculum.js?v=unified-12';
export const GROUPS=[
 {id:'b-chords',title:'三和弦及转位',icon:'interval',skills:['b-triad','b-inversion','b-build','b-chord-ear']},
 {id:'b-minor',title:'和声与旋律小调',icon:'keys',skills:['b-harmonic','b-melodic']},
 {id:'b-degrees',title:'调内音级',icon:'sound',skills:['b-degree-name','b-degree-note']},
 {id:'b-diatonic',title:'调内和弦',icon:'interval',skills:['b-major-chord','b-minor-chord']},
 {id:'b-triplets',title:'三连音',icon:'notation',skills:['b-triplet-value','b-triplet-fill']},
 {id:'b-rhythm',title:'节奏',icon:'notation',skills:['b-rhythm-count','b-barline','b-rhythm-ear','b-syncopation']},
 {id:'b-terms',title:'音乐术语',icon:'terms',skills:['b-expression','b-articulation']}
];
const TITLES=[
 ['b-triad','三和弦性质','从三度叠置认识四种三和弦'],['b-inversion','三和弦转位','用最低音辨认原位、六和弦与四六和弦'],['b-build','构成三和弦','选择正确的三和弦谱面'],['b-chord-ear','大小三和弦听辨','固定根音比较，再换根音听辨'],
 ['b-harmonic','和声小调','自然小调升高第Ⅶ级'],['b-melodic','旋律小调','上行升Ⅵ、Ⅶ，下行还原'],
 ['b-degree-name','音级名称','主音、属音与其他音级'],['b-degree-note','调内音级定位','在大小调中找到指定音级'],
 ['b-major-chord','大调调内和弦','自然大调各级三和弦'],['b-minor-chord','小调调内和弦','比较自然、和声与旋律小调'],
 ['b-triplet-value','三连音时值','三个音占原来两个同类音的时间'],['b-triplet-fill','补全一拍','用三等分理解节拍'],
 ['b-rhythm-count','节奏与时值','附点、休止与拍数计算'],['b-barline','小节线位置','按拍号找到完整小节的边界'],['b-rhythm-ear','听节奏选谱','比较附点、切分与三连音'],['b-syncopation','认识切分节奏','听出弱位延续到强位'],
 ['b-expression','表情术语','理解演奏的情绪与性格'],['b-articulation','奏法与结构术语','连奏、断奏、重音与曲式标记']
];
export const SKILLS=TITLES.map(([id,title,desc])=>({id,title,desc,group:GROUPS.find(g=>g.skills.includes(id)).id,level:'中级'}));
export const TRIADS=[{name:'大三和弦',offsets:[0,4,7]},{name:'小三和弦',offsets:[0,3,7]},{name:'增三和弦',offsets:[0,4,8]},{name:'减三和弦',offsets:[0,3,6]}];
export const INVERSIONS=['原位','第一转位（六和弦）','第二转位（四六和弦）'];
export const DEGREE_NAMES=['主音','上主音','中音','下属音','属音','下中音','导音'];
export const ROMAN=['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ'];
export const EXPRESSIONS=[['Animato','活泼地'],['Cantabile','如歌地'],['Dolce','柔和地'],['Energico','有力地'],['Espressivo','富有表情地'],['Risoluto','坚决地'],['Romance','浪漫曲'],['Lugubre','悲伤地'],['Scherzando','诙谐地'],['Appassionato','热情地'],['Con brio','有精神地'],['Grazioso','优美地'],['Maestoso','庄严地'],['Solo','独奏'],['Amabile','可爱地'],['Agitato','激动地'],['Tranquillo','安静地'],['Ballade','叙事曲']];
export const ARTICULATIONS=[['Legato','连奏'],['Marcato','着重地'],['Staccato','断奏'],['Coda','尾声'],['ten.','保持音'],['sfz','突强'],['D.C. al Fine','从头反复，至 Fine 结束'],['D.S. al Coda','从记号处反复，按指示进入尾声']];
export function triad(root,kind=0,inv=0){const spec=typeof kind==='number'?TRIADS[kind]:TRIADS.find(x=>x.name===kind);const ns=spec.offsets.map((s,i)=>{const d=root.d+2*i;return note(d,root.midi+s-note(d).midi)});return [...ns.slice(inv),...ns.slice(0,inv).map(n=>note(n.d+7,n.acc))]}
export function minorScale(root,form='natural',direction='up'){
 const ns=naturalScale(root,true).map((n,i)=>note(n.d,n.acc+((form==='harmonic'&&i===6)||(form==='melodic'&&direction==='up'&&(i===5||i===6))?1:0)));
 return direction==='down'?ns.reverse():ns;
}
export function scaleFor(k,form='major',direction='up'){return form==='major'?(direction==='down'?naturalScale(note(k.d,k.acc)).reverse():naturalScale(note(k.d,k.acc))):minorScale(note(k.md,k.ma),form,direction)}
export function diatonicTriad(k,form,degree){const s=scaleFor(k,form),extended=s.slice(0,7).concat(s.slice(0,7).map(n=>note(n.d+7,n.acc)));const ns=[0,2,4].map(i=>extended[degree-1+i]);return ns[2].midi>84?ns.map(n=>note(n.d-7,n.acc)):ns}
export function triadQuality(ns){const a=ns[1].midi-ns[0].midi,b=ns[2].midi-ns[0].midi;return TRIADS.find(x=>x.offsets[1]===a&&x.offsets[2]===b)?.name}
const nsText=ns=>ns.map(pitchClass).join('—');
const modName=(k,f)=>f==='major'?k.major+'自然大调':k.minor+({natural:'自然小调',harmonic:'和声小调',melodic:'旋律小调（上行）'})[f];
const nice=v=>({[1/3]:'1/3',[2/3]:'2/3',.25:'1/4',.5:'1/2',.75:'3/4',1.5:'1又1/2',2.5:'2又1/2',3.5:'3又1/2'})[v]||String(v);
const ev=(ticks,rest=false,triplet=false)=>({ticks,rest,triplet});
export const PATTERNS=[
 {id:'quarters',name:'四个四分音符',events:[ev(12),ev(12),ev(12),ev(12)]},
 {id:'eighths',name:'均分八分音符',events:[ev(6),ev(6),ev(6),ev(6),ev(12),ev(12)]},
 {id:'dotted',name:'附点节奏',events:[ev(18),ev(6),ev(12),ev(12)]},
 {id:'syncopated',name:'切分节奏',events:[ev(6),ev(12),ev(6),ev(12),ev(12)]},
 {id:'triplet',name:'八分三连音',events:[ev(4,false,true),ev(4,false,true),ev(4,false,true),ev(12),ev(12),ev(12)]},
 {id:'rest',name:'含休止的节奏',events:[ev(12,true),ev(12),ev(6),ev(6),ev(12)]},
 {id:'short-dotted',name:'附点八分节奏',events:[ev(9),ev(3),ev(12),ev(12),ev(12)]},
 {id:'half',name:'含二分音符的节奏',events:[ev(24),ev(12),ev(12)]},
 {id:'dotted-half',name:'附点二分节奏',events:[ev(36),ev(12)]},
 {id:'rest-eighth',name:'八分休止节奏',events:[ev(6,true),ev(6),ev(12),ev(12),ev(12)]},
 {id:'rest-half',name:'二分休止节奏',events:[ev(12),ev(24,true),ev(12)]},
 {id:'sixteenths',name:'四个十六分音符',events:[ev(3),ev(3),ev(3),ev(3),ev(12),ev(12),ev(12)]},
 {id:'paired-dotted',name:'两组附点节奏',events:[ev(18),ev(6),ev(18),ev(6)]},
 {id:'whole',name:'全音符持续',events:[ev(48)]}
];
export const sequenceFor=events=>{let beat=0;return events.map(e=>{const x={at:beat,beats:e.ticks/12,notes:e.rest?[]:[60]};beat+=e.ticks/12;return x})};
export function makeQuestion(skill,index=0,seed=Date.now(),difficulty='basic',soundMode='up'){
 const r=rng(seed+index*8191+SKILLS.findIndex(s=>s.id===skill)*733),pick=a=>a[Math.floor(r()*a.length)],q={id:`${skill}-${seed}-${index}`,skill,level:'intermediate',type:'concept',notes:[],options:[],mode:'up',seed};
 const choose=(correct,pool)=>{q.correct=correct;q.options=shuffle([correct,...shuffle([...new Set(pool)].filter(x=>x!==correct),r).slice(0,3)],r)};
 const k=pick(KEYS.filter(k=>Math.abs(k.count)<=(difficulty==='basic'?2:5))),root=note(pick([28,29,30,31,32]),difficulty==='basic'?0:pick([-1,0,1]));
 if(['b-triad','b-inversion','b-build','b-chord-ear'].includes(skill)){
  const kind=skill==='b-chord-ear'?pick([0,1]):pick([0,1,2,3]),inv=skill==='b-inversion'?pick([0,1,2]):0,base=skill==='b-chord-ear'&&difficulty==='basic'?note(28):root;
  q.notes=triad(base,kind,inv);q.chord=true;q.root=base;q.kind=kind;q.inv=inv;q.mode=skill==='b-chord-ear'?soundMode==='up'?'up':'harmonic':'harmonic';
  if(skill==='b-inversion'){q.title=`这个${TRIADS[kind].name}处于什么位置？`;choose(INVERSIONS[inv],INVERSIONS);q.detail=`先按三度重新排列，根音是${pitchClass(base)}。本题最低音是${pitchClass(q.notes[0])}，为和弦的${['根音','三音','五音'][inv]}，所以是${INVERSIONS[inv]}。转位保持和弦性质。`}
  else if(skill==='b-build'){
   q.title=`选出以${pitchClass(base)}为根音的${TRIADS[kind].name}`;q.feature=pitchClass(base)+' · '+TRIADS[kind].name;q.hideNotes=true;q.optionScores={};
   const choices=shuffle([0,1,2,3],r);q.options=choices.map((v,i)=>{const label=String.fromCharCode(65+i);q.optionScores[label]=triad(base,v);if(v===kind)q.correct=label;return label});
   q.detail=`${TRIADS[kind].name}由${TRIADS[kind].offsets.join('、')}个半音的位置构成；正确的构成音是 ${nsText(q.notes)}。先看音名字母是否隔一个排列，再核对升降号。`;
  }else{q.type=skill==='b-chord-ear'?'ear':'chord';q.title=skill==='b-chord-ear'?'听一听，这是哪种三和弦？':'看谱判断三和弦的性质';choose(TRIADS[kind].name,TRIADS.slice(0,skill==='b-chord-ear'?2:4).map(x=>x.name));q.detail=`${nsText(q.notes)}，从低到高包含${kind===0?'大三度＋小三度':kind===1?'小三度＋大三度':kind===2?'大三度＋大三度':'小三度＋小三度'}，所以是${TRIADS[kind].name}。${skill==='b-chord-ear'?'可以在答题后逐音播放，比较中间音与根音的距离。':''}`}
 }else if(skill==='b-harmonic'||skill==='b-melodic'){
  const form=skill==='b-harmonic'?'harmonic':'melodic',dir=skill==='b-harmonic'?'up':pick(['up','down']);q.notes=scaleFor(k,form,dir);q.scaleForm=form;q.scaleKey=k;q.direction=dir;q.type='scale';
  if(form==='harmonic'){q.title=`${k.minor}和声小调中，第Ⅶ级音是？`;choose(pitchClass(q.notes[6]),[...q.notes.slice(0,7).map(pitchClass),...LETTERS]);q.feature=k.minor+'和声小调';q.hideNotes=true;q.detail=`在${k.minor}自然小调基础上，升高第Ⅶ级半音，得到${pitchClass(q.notes[6])}。音阶是 ${nsText(q.notes)}；Ⅵ—Ⅶ之间形成增二度。`}
  else{q.title=`这组${dir==='up'?'上行':'下行'}音阶是哪种小调？`;choose(modName(k,form).replace('（上行）','')+' · '+(dir==='up'?'上行':'下行'),[...KEYS.slice(0,10).map(x=>x.minor+'旋律小调 · '+(dir==='up'?'上行':'下行'))]);q.detail=`这里采用教材中的古典旋律小调：上行时，在自然小调基础上升高Ⅵ、Ⅶ级；下行时恢复自然小调的Ⅵ、Ⅶ级。本题为${k.minor}旋律小调${dir==='up'?'上行':'下行'}：${nsText(q.notes)}。`;if(r()>.5){const degree=pick([6,7]),n=q.notes[dir==='up'?degree-1:8-degree];q.title=`${k.minor}旋律小调${dir==='up'?'上行':'下行'}时，第${ROMAN[degree-1]}级音是？`;q.feature=k.minor+'旋律小调 · '+(dir==='up'?'上行':'下行');q.hideNotes=true;choose(pitchClass(n),[...q.notes.slice(0,7).map(pitchClass),...scaleFor(k,'natural').map(pitchClass),...LETTERS]);q.detail+=` 所以第${ROMAN[degree-1]}级是${pitchClass(n)}。`;}}
 }else if(skill==='b-degree-name'||skill==='b-degree-note'){
  const form=pick(['major','natural','harmonic']),degree=pick([1,2,3,4,5,6,7]),sc=scaleFor(k,form),name=modName(k,form);q.degree=degree;q.scaleForm=form;q.scaleKey=k;q.notes=sc;q.hideNotes=true;q.feature=name;
  if(skill==='b-degree-name'){const label=degree===7&&form==='natural'?'下主音':DEGREE_NAMES[degree-1];q.title=`${name}的第${ROMAN[degree-1]}级叫什么？`;choose(label,[...DEGREE_NAMES,'下主音']);q.detail=`${name}的第${ROMAN[degree-1]}级是${pitchClass(sc[degree-1])}，称${label}。${degree===7?'自然小调第Ⅶ级与主音相距全音，称下主音；大调及和声小调的第Ⅶ级与主音相距半音，称导音。':'音级名称描述它与主音的关系，换调后名称不变。'}`}
  else{const degName=degree===7&&form==='natural'?'下主音':DEGREE_NAMES[degree-1];q.title=`${name}的${degName}（第${ROMAN[degree-1]}级）是哪个音？`;choose(pitchClass(sc[degree-1]),[...sc.slice(0,7).map(pitchClass),...LETTERS]);q.detail=`从主音开始依次排列：${nsText(sc.slice(0,7))}。第${ROMAN[degree-1]}级是${pitchClass(sc[degree-1])}，称${degName}。`}
 }else if(skill==='b-major-chord'||skill==='b-minor-chord'){
  const form=skill==='b-major-chord'?'major':pick(difficulty==='basic'?['natural','harmonic']:['natural','harmonic','melodic']),degree=pick([1,2,3,4,5,6,7]);q.notes=diatonicTriad(k,form,degree);q.chord=true;q.mode='harmonic';q.scaleForm=form;q.scaleKey=k;q.degree=degree;const quality=triadQuality(q.notes);
  q.title=`${modName(k,form)}的第${ROMAN[degree-1]}级三和弦是什么性质？`;choose(quality,TRIADS.map(x=>x.name));q.detail=`在该调的第${ROMAN[degree-1]}级上隔一个音级取一个音：${nsText(q.notes)}。根音到三音相距${q.notes[1].midi-q.notes[0].midi}个半音，到五音相距${q.notes[2].midi-q.notes[0].midi}个半音，因此是${quality}。${form==='melodic'?'这里的旋律小调按上行音阶构成和弦；下行恢复自然小调。':''}`;
 }else if(skill==='b-triplet-value'){
  const ticks=pick([4,8,16]);q.rhythm=Array.from({length:3},()=>ev(ticks,false,true));q.notes=[note(28)];q.sequence=sequenceFor(q.rhythm);q.title='以四分音符为一拍，这组三连音合计几拍？';choose(nice(ticks/4)+'拍',[.5,1,2,3,4,6].map(v=>nice(v)+'拍'));q.detail=`这组是${ticks===4?'八分':ticks===8?'四分':'二分'}三连音：三个这样的音，合计占两个普通${ticks===4?'八分':ticks===8?'四分':'二分'}音符的时间，即${ticks/4}拍。每个音均分为${nice(ticks/12)}拍。`;
 }else if(skill==='b-triplet-fill'){
  const given=pick([1,2]);q.rhythm=[ev(4,false,true),ev(4,false,true),ev(4,false,true)];q.missingFrom=given;q.notes=[note(28)];q.sequence=sequenceFor(q.rhythm);q.title=`一拍分成八分三连音，已有${given}个，还需几个？`;choose((3-given)+'个',['1个','2个','3个','4个']);q.detail=`八分三连音把一个四分音符的时值平均分成三份，每份1/3拍。已有${given}份，还需要${3-given}份；三个三连音合计正好一拍。`;
 }else if(skill==='b-rhythm-count'){
  const p=pick(PATTERNS),cut=pick(p.id==='triplet'?[3,p.events.length]:[2,3,p.events.length]),events=p.events.slice(0,cut);q.rhythm=events;q.notes=[note(28)];q.sequence=sequenceFor(events);const ticks=events.reduce((s,e)=>s+e.ticks,0);q.totalTicks=ticks;q.title='以四分音符为一拍，这段节奏合计几拍？';choose(nice(ticks/12)+'拍',[.5,1,1.5,2,2.5,3,3.5,4].map(v=>nice(v)+'拍'));q.detail=`依次相加：${events.map(e=>nice(e.ticks/12)+(e.rest?'（休止）':'')).join('＋')}＝${nice(ticks/12)}拍。休止符也占时间；附点增加原时值的一半，三连音按三等分计算。`;
 }else if(skill==='b-barline'){
  const units=pick([2,3,4]),barTicks=units*12;let bar=[];if(r()>.5)bar=[ev(6),ev(6),...Array.from({length:units-1},()=>ev(12))];else bar=[ev(12),...Array.from({length:units-1},()=>ev(6),).flatMap(e=>[e,ev(6)])];
  q.rhythm=[...bar,...bar];q.notes=[note(28)];q.sequence=sequenceFor(q.rhythm);q.time=[units,4];q.boundary=bar.length;q.totalTicks=barTicks*2;q.numberEvents=true;q.title=`按${units}/4拍，中间的小节线应放在哪里？`;choose('第'+bar.length+'个符号后',[bar.length-1,bar.length,bar.length+1,Math.max(1,bar.length-2)].map(n=>'第'+n+'个符号后'));q.detail=`${units}/4拍每小节合计${units}个四分音符的时值。从左向右累计，第${bar.length}个符号后正好${units}拍，所以在这里划小节线。`;
 }else if(skill==='b-rhythm-ear'){
  const p=pick(PATTERNS);q.rhythm=p.events;q.sequence=sequenceFor(p.events);q.notes=[note(28)];q.type='ear';q.rhythmEar=true;q.title='听节奏，选择对应的谱面';q.optionRhythms={};q.options=shuffle([p,...shuffle(PATTERNS.filter(x=>x.id!==p.id),r).slice(0,3)],r).map((x,i)=>{const label=String.fromCharCode(65+i);q.optionRhythms[label]=x.events;if(x.id===p.id)q.correct=label;return label});q.detail=`正确谱面为${p.name}。四分音符为一拍，留意每次起音的位置；休止处保持安静，附点延长，三连音均分一拍。`;
 }else if(skill==='b-syncopation'){
  const p=pick(PATTERNS.filter(x=>['syncopated','dotted','eighths','quarters'].includes(x.id)));q.rhythm=p.events;q.sequence=sequenceFor(p.events);q.notes=[note(28)];q.title='这段节奏含有弱位延续到强位的切分吗？';choose(p.id==='syncopated'?'有切分':'没有切分',['有切分','没有切分']);q.detail=p.id==='syncopated'?'开头的八分音符占半拍，接着的四分音符从第一拍后半拍开始，延续过第二拍的起点，形成切分。':'这段节奏没有从弱位延续跨过下一强位的长音。附点只是时值延长的写法，本身不等于切分。';
 }else{
  const items=skill==='b-expression'?EXPRESSIONS:ARTICULATIONS,a=pick(items);q.title='这个音乐术语是什么意思？';q.feature=a[0];choose(a[1],items.map(x=>x[1]));q.detail=`${a[0]} 表示“${a[1]}”。${a[0]==='Legato'?'演奏时注意音与音之间连贯，减少不必要的空隙。':a[0]==='Staccato'?'音要短促清楚；具体长度结合速度和音乐语境判断。':''}`;
 }
 return q;
}
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export function pitchedScore(notes,{harmonic=false,label=false,id='b-score',title='五线谱'}={}){
 const width=harmonic?360:Math.max(360,notes.length*53+95),y=n=>112-(n.d-30)*6.5,minY=Math.min(0,...notes.map(n=>y(n)-36)),maxY=Math.max(165,...notes.map(n=>y(n)+24));
 const xs=notes.map((n,i)=>harmonic?190:notes.length===1?190:90+i*(width-120)/Math.max(1,notes.length-1));let accs=new Map();
 const glyph=a=>({[-2]:'\uE264',[-1]:'\uE260',[0]:'\uE261',[1]:'\uE262',[2]:'\uE263'})[a];
 const symbols=notes.map((n,i)=>{let x=xs[i],yy=y(n),ledger='';for(let d=28;d>=n.d;d-=2)ledger+=`<line x1="${x-15}" x2="${x+15}" y1="${y({d})}" y2="${y({d})}"/>`;for(let d=40;d<=n.d;d+=2)ledger+=`<line x1="${x-15}" x2="${x+15}" y1="${y({d})}" y2="${y({d})}"/>`;const prev=accs.get(n.d)||0,show=n.acc!==prev;accs.set(n.d,n.acc);return `<g class="score-note" data-note-index="${i}" data-midi="${n.midi}">${ledger}${show?`<text class="music" x="${x-28-(harmonic?i%2*18:0)}" y="${yy}" font-size="46">${glyph(n.acc)}</text>`:''}<text class="music" x="${x-11}" y="${yy}" font-size="46">&#xE0A2;</text>${label&&!harmonic?`<text x="${x}" y="${maxY-8}" text-anchor="middle" class="pitch-label">${pitchName(n)}</text>`:''}</g>`}).join('');
 const svg=`<svg class="staff b-score" viewBox="0 ${minY} ${width} ${maxY-minY}" role="img" aria-label="${esc(title)}"><g stroke="#7b8593" stroke-width="1">${Array.from({length:5},(_,i)=>`<line x1="18" x2="${width-15}" y1="${112-i*13}" y2="${112-i*13}"/>`).join('')}</g><text class="music" x="27" y="99" font-size="52">&#xE050;</text><g stroke="#25354b" stroke-width="1.2">${symbols}</g></svg>`;
 return `<div class="score-scroll${notes.length>8?' score-wide':''}">${svg}</div>${harmonic&&label?`<div class="score-caption">${nsText(notes)}</div>`:''}`;
}
export function rhythmScore(events,{time=null,label=false,boundary=0,numberEvents=false,missingFrom=null}={}){
 const width=Math.max(360,events.length*52+100),start=time?100:65,spacing=(width-start-27)/Math.max(1,events.length),x=i=>start+i*spacing;let symbols='';
 for(let i=0;i<events.length;i++){
  symbols+=`<g class="rhythm-event" data-event-index="${i}">`;
  const e=events[i],t=e.ticks,base=e.triplet?t===4?6:t===8?12:24:t,restGlyph=base===48?'\uE4E3':base===24||base===36?'\uE4E4':base===12||base===18?'\uE4E5':base===6||base===9?'\uE4E6':'\uE4E7',noteGlyph=base===48?'\uE1D2':base===24||base===36?'\uE1D3':base===12||base===18?'\uE1D5':base===6||base===9?'\uE1D7':'\uE1D9';
  if(missingFrom!==null&&i>=missingFrom&&!label)symbols+=`<rect x="${x(i)-10}" y="79" width="27" height="36" rx="6" fill="#edf1fa"/><text x="${x(i)+3}" y="104" font-size="22" text-anchor="middle" fill="#45638e">?</text>`;
  else symbols+=`<text class="music" x="${x(i)-9}" y="99" font-size="43">${e.rest?restGlyph:noteGlyph}</text>${[9,18,36].includes(t)&&!e.triplet?`<circle cx="${x(i)+13}" cy="94" r="2.2" fill="#25354b"/>`:''}`;
  if(numberEvents)symbols+=`<text x="${x(i)}" y="147" text-anchor="middle" class="pitch-label">${i+1}</text>`;
  if(e.triplet&&(()=>{let run=0;for(let j=i-1;j>=0&&events[j].triplet;j--)run++;return run%3===0})()) {const end=Math.min(i+2,events.length-1);symbols+=`<path d="M${x(i)-12} 55v-7h${x(end)-x(i)+26}v7" fill="none" stroke="#25354b"/><rect x="${(x(i)+x(end))/2-8}" y="39" width="16" height="16" fill="white"/><text x="${(x(i)+x(end))/2}" y="51" text-anchor="middle" font-size="17" fill="#25354b">3</text>`}
  if(label&&boundary&&i+1===boundary)symbols+=`<line x1="${x(i)+spacing*.6}" x2="${x(i)+spacing*.6}" y1="73" y2="125" stroke="#285da8" stroke-width="2"/>`;
  symbols+='</g>';
 }
 return `<div class="score-scroll"><svg class="staff rhythm-score" viewBox="0 20 ${width} 145" role="img" aria-label="${label?'答案':'待辨认'}节奏谱面${time?'，'+time.join('/')+'拍':''}"><g stroke="#9097a1" stroke-width=".8">${Array.from({length:5},(_,i)=>`<line x1="14" x2="${width-14}" y1="${73+i*13}" y2="${73+i*13}"/>`).join('')}</g>${time?`<text x="34" y="96" font-size="25" font-family="serif" text-anchor="middle">${time[0]}</text><text x="34" y="119" font-size="25" font-family="serif" text-anchor="middle">${time[1]}</text>`:''}${symbols}</svg></div>`;
}
export function notation(q,{reveal=false,id='b-question'}={}){
 if(q.rhythm)return rhythmScore(q.rhythm,{time:q.time,label:reveal,boundary:q.boundary,numberEvents:q.numberEvents,missingFrom:q.missingFrom??null});
 if(q.hideNotes&&!reveal)return `<div class="concept-panel">${q.feature}</div>`;
 if(q.notes.length)return pitchedScore(q.notes,{harmonic:q.chord,label:reveal,id,title:reveal?'答案谱面':'题目谱面'});
 return q.feature?`<div class="concept-panel term-panel">${q.feature}</div>`:'';
}
export function optionMarkup(q,text){if(q.optionScores?.[text])return `<span class="option-letter">${text}</span>${pitchedScore(q.optionScores[text],{harmonic:true,title:'选项'+text})}`;if(q.optionRhythms?.[text])return `<span class="option-letter">${text}</span>${rhythmScore(q.optionRhythms[text])}`;return text}
const table=rows=>`<div class="learning-table">${rows.map(([a,b])=>`<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>`;
const card=(title,body)=>`<section class="card"><h3>${title}</h3>${body}</section>`;
const demo=(ns,text,mode='up')=>`<button class="secondary" data-act="demo" data-notes="${ns.map(n=>n.midi).join(',')}" data-mode="${mode}">▶ ${text}</button>`;
const rhythmDemo=(events,text)=>`<button class="secondary" data-act="demo" data-notes="60,48" data-sequence="${encodeURIComponent(JSON.stringify(sequenceFor(events)))}">▶ ${text}</button>`;
const chordCard=(title,ns,text='')=>card(title,pitchedScore(ns,{harmonic:true,label:true})+`<p>${text}</p><div class="demo-actions">${demo(ns,'同时弹响','harmonic')}${demo(ns,'逐音对照')}</div>`);
export function lesson(id){
 if(['b-triad','b-build','b-chord-ear'].includes(id))return `<p class="lesson-text">三和弦由三个音按<strong>三度关系叠置</strong>而成，分别叫根音、三音、五音。先比较相同根音上的和弦，再改变根音。</p>${table([['大三和弦','大三度＋小三度；根音到五音是纯五度'],['小三和弦','小三度＋大三度；根音到五音是纯五度'],['增三和弦','大三度＋大三度；根音到五音是增五度'],['减三和弦','小三度＋小三度；根音到五音是减五度']])}${chordCard('C大三和弦',triad(note(28),0),'C—E—G；中间音距离根音4个半音。')}${chordCard('C小三和弦',triad(note(28),1),'C—降E—G；中间音距离根音3个半音。')}${id==='b-chord-ear'?'<div class="rule">听辨先练大小三和弦。基础固定根音C，变化练习更换根音；答后可逐音对照。</div>':chordCard('C增三和弦',triad(note(28),2))+chordCard('C减三和弦',triad(note(28),3))}${id==='b-build'?'<div class="rule">构成和弦时先排列字母：根音、上方第三个字母、上方第五个字母；再用升降号调整半音数。相同声音的不同字母写法不能随意互换。</div>':''}`;
 if(id==='b-inversion')return `<p class="lesson-text">转位改变<strong>最低音</strong>，不改变和弦的根音与性质。先还原成三度叠置，再判断哪个和弦音在最下面。</p>${[0,1,2].map(inv=>chordCard(INVERSIONS[inv],triad(note(28),0,inv),['根音C在最低处：C—E—G。','三音E在最低处：E—G—C；最低音到上方两音为三度与六度。','五音G在最低处：G—C—E；最低音到上方两音为四度与六度。'][inv])).join('')}<div class="rule">六和弦与四六和弦的数字，描述最低音到上方各音的音程；不代表多加一个音。</div>`;
 if(id==='b-harmonic'||id==='b-melodic'){
  const root=note(33),form=id==='b-harmonic'?'harmonic':'melodic',up=minorScale(root,form),down=minorScale(root,form,'down');return `<p class="lesson-text">从自然小调出发，按需要改变音级。这里采用<strong>古典小调</strong>的上、下行规则。</p>${card('a自然小调',pitchedScore(minorScale(root),{label:true})+demo(minorScale(root),'听自然小调'))}${form==='harmonic'?card('a和声小调',pitchedScore(up,{label:true})+'<p>升高第Ⅶ级：G变为升G。Ⅵ—Ⅶ为增二度，Ⅶ—Ⅰ为半音；上、下行都保留升高的Ⅶ级。</p>'+demo(up,'听和声小调')):card('a旋律小调 · 上行',pitchedScore(up,{label:true})+'<p>上行升高第Ⅵ、Ⅶ级：F、G变为升F、升G。</p>'+demo(up,'听上行'))+card('a旋律小调 · 下行',pitchedScore(down,{label:true})+'<p>下行恢复自然小调的Ⅵ、Ⅶ级：使用G、F。</p>'+demo(down,'听下行'))}<div class="rule">“升高半音”是相对自然小调原有的音而言。例如原来是降B，升高后是B，不是升B。</div>`;
 }
 if(id==='b-degree-name'||id==='b-degree-note')return `<p class="lesson-text">音级既可以用<strong>罗马数字</strong>表示位置，也可以用名称表达与主音的关系。先确定调式，再找音级。</p>${table(ROMAN.map((x,i)=>[x,DEGREE_NAMES[i]]))}${card('G自然大调',pitchedScore(scaleFor(KEYS.find(k=>k.major==='G')),{label:true})+'<p>主音G；下属音C；属音D；导音升F。不要把“属音”固定记成G。</p>')}${card('a自然小调与a和声小调','<p>自然小调第Ⅶ级G距主音A为全音，称下主音；和声小调第Ⅶ级升G距主音A为半音，具有导音作用。</p>')}`;
 if(id==='b-major-chord'||id==='b-minor-chord'){
  const major=id==='b-major-chord',k=KEYS[0],forms=major?['major']:['natural','harmonic','melodic'];return `<p class="lesson-text">在调内选定一个音级作为根音，<strong>隔一个音取一个音</strong>，组成三和弦。遇到调式变化音，也要带入和弦。</p>${forms.map(form=>card(modName(k,form),table(ROMAN.map((x,i)=>[x,nsText(diatonicTriad(k,form,i+1))+' · '+triadQuality(diatonicTriad(k,form,i+1))])))).join('')}${chordCard(major?'C大调Ⅴ级：G—B—D':'a和声小调Ⅴ级：E—升G—B',diatonicTriad(k,major?'major':'harmonic',5),major?'自然大调的Ⅰ、Ⅳ、Ⅴ级是大三和弦；Ⅱ、Ⅲ、Ⅵ级是小三和弦；Ⅶ级是减三和弦。':'和声小调升高第Ⅶ级，因此Ⅴ级由小三和弦变成大三和弦，Ⅶ级由大三和弦变成减三和弦。')}<div class="rule">旋律小调的表格按上行音阶构成；下行恢复自然小调。不要把自然小调和和声小调的和弦性质混用。</div>`;
 }
 if(id==='b-triplet-value'||id==='b-triplet-fill')return `<p class="lesson-text">三连音把原来<strong>两个同类音符</strong>的时间，平均分给三个音。括号或连线旁的数字3提醒你三等分。</p>${card('一拍里的八分三连音',rhythmScore(PATTERNS[4].events.slice(0,3))+'<p>三个八分三连音＝一个四分音符＝1拍，每个占1/3拍。</p>'+rhythmDemo(PATTERNS[4].events.slice(0,3),'听一拍三等分'))}${table([['八分三连音一组','3个音合计1拍'],['四分三连音一组','3个音合计2拍'],['二分三连音一组','3个音合计4拍']])}${card('和均分八分音符比较',rhythmScore([ev(6),ev(6)])+rhythmDemo([ev(6),ev(6)],'听一拍二等分'))}<div class="rule">三连音仍按均匀间隔演奏，不能弹成“前长后短”或“三个普通八分音符”。</div>`;
 if(['b-rhythm-count','b-barline','b-rhythm-ear','b-syncopation'].includes(id))return `<p class="lesson-text">以<strong>四分音符为一拍</strong>，先跟稳拍子，再比较起音的位置。点击示范前有两拍预备，速度可以调整。</p>${table([['四分／八分／十六分','1拍／1/2拍／1/4拍'],['附点四分／附点八分','1又1/2拍／3/4拍'],['休止符','不发声，但仍占相应时值'],['小节线','从第一拍开始累计，达到拍号规定的时值后划线']])}${['quarters','dotted','syncopated','triplet','rest','short-dotted'].map(key=>{const p=PATTERNS.find(p=>p.id===key);return card(p.name,rhythmScore(p.events,{time:[4,4]})+(key==='syncopated'?'<p>八分—四分—八分：中间的音从弱位开始，延续跨过下一拍的起点。</p>':'')+rhythmDemo(p.events,'听示范'))}).join('')}<div class="rule">附点增加原时值的一半；切分描述重音位置与持续关系，两者不是同一个概念。休止时也要继续数拍。</div>`;
 return `<p class="lesson-text">把术语和<strong>具体演奏动作或音乐性格</strong>对应起来。速度、力度、奏法与表情可能同时出现。</p>${table(id==='b-expression'?EXPRESSIONS:ARTICULATIONS)}${card('应用到弹奏中','<p>Legato时让音连接；Staccato时收短音；Marcato强调起音。Cantabile提醒你像歌唱一样组织旋律，具体力度和速度仍要结合乐句。</p>')}`;
}
