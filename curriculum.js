import {note,LETTERS,NAT,SKILLS as INTERVAL_SKILLS,makeQuestion as intervalQuestion,explanation as intervalExplanation,staff,shuffle,rng,pitchName} from './theory.js?v=unified-12';
export {note,interval,INTERVALS,staff,pitchName,shuffle,inversion} from './theory.js?v=unified-12';
export const GROUPS=[{id:'sound',title:'音的基础',desc:'音名、唱名、音组与音的性质',icon:'C',skills:['names','register','qualities']},{id:'notation',title:'记谱法',desc:'高低音谱号、时值、休止符与拍号',icon:'𝄞',skills:['pitch','duration','meter']},{id:'interval',title:'音程',desc:'看谱、听辨、全半音与音程转位',icon:'♪',skills:INTERVAL_SKILLS.map(s=>s.id)},{id:'keys',title:'调与音阶',desc:'调号、自然大小调与音级',icon:'♯',skills:['key','scale','degrees']},{id:'terms',title:'记号与音乐术语',desc:'变音记号、力度、速度与反复',icon:'𝑓',skills:['accidental','dynamics','tempo']}];
const NEW_SKILLS=[['names','音名与唱名','把 C D E 和 do re mi 对应起来','C','入门'],['register','音的分组','同一个音名，区分不同音区','↕','基础'],['qualities','音的四种性质','理解高低、强弱、长短和音色','≋','入门'],['pitch','五线谱认音','认识高音与低音谱号的音位','𝄞','基础'],['duration','音符与休止符','辨认时值，理解附点','♩','基础'],['meter','拍号与小节','读懂单位音符与小节时值','¾','基础'],['key','调号与调名','识别升降号与关系大小调','♯','基础'],['scale','自然大小调','看懂音阶结构与半音位置','≋','基础'],['degrees','调式音级','找到音阶中指定的第几级','Ⅰ','进阶'],['accidental','变音记号','升、降、还原与重升重降','♮','基础'],['dynamics','力度与表情','理解强弱和力度变化','𝑓','基础'],['tempo','速度与常用术语','速度、反复和结束标记','↻','基础']].map(([id,title,desc,icon,level])=>({id,title,desc,icon,level}));
export const SKILLS=GROUPS.flatMap(g=>g.skills.map(id=>({...([...INTERVAL_SKILLS,...NEW_SKILLS].find(s=>s.id===id)),group:g.id})));
export const isNewSkill=id=>NEW_SKILLS.some(s=>s.id===id);
export const groupFor=id=>GROUPS.find(g=>g.skills.includes(id));
export const SOLFEGE=['do','re','mi','fa','sol','la','si'];
export function registerName(n){const o=Math.floor(n.d/7);return({1:'大字一组',2:'大字组',3:'小字组',4:'小字一组',5:'小字二组',6:'小字三组'})[o]||'其他音组'}
export function groupSymbol(n){const o=Math.floor(n.d/7),l=LETTERS[n.d%7];return o===2?l:o===3?l.toLowerCase():o>=4?l.toLowerCase()+['','¹','²','³'][o-3]:l+'₁'}
export const KEYS=[
 ['C',28,0,0,'a',33,0],['G',32,0,1,'e',30,0],['D',29,0,2,'b',34,0],['A',33,0,3,'升f',31,1],['E',30,0,4,'升c',28,1],['B',34,0,5,'升g',32,1],['升F',31,1,6,'升d',29,1],['升C',28,1,7,'升a',33,1],['F',31,0,-1,'d',29,0],['降B',34,-1,-2,'g',32,0],['降E',30,-1,-3,'c',28,0],['降A',33,-1,-4,'f',31,0],['降D',29,-1,-5,'降b',34,-1],['降G',32,-1,-6,'降e',30,-1],['降C',28,-1,-7,'降a',33,-1]
].map(([major,d,acc,count,minor,md,ma])=>({major,d,acc,count,minor,md,ma}));
export function naturalScale(root,isMinor=false){const offsets=isMinor?[0,2,3,5,7,8,10,12]:[0,2,4,5,7,9,11,12];return offsets.map((v,i)=>{const natural=note(root.d+i);return note(root.d+i,root.midi+v-natural.midi)})}
export const DURATIONS=[{id:'whole',name:'全音符',v:4,g:'\uE1D2'},{id:'half',name:'二分音符',v:2,g:'\uE1D3'},{id:'quarter',name:'四分音符',v:1,g:'\uE1D5'},{id:'eighth',name:'八分音符',v:.5,g:'\uE1D7'},{id:'sixteenth',name:'十六分音符',v:.25,g:'\uE1D9'},{id:'rwhole',name:'全休止符',v:4,g:'\uE4E3'},{id:'rhalf',name:'二分休止符',v:2,g:'\uE4E4'},{id:'rquarter',name:'四分休止符',v:1,g:'\uE4E5'},{id:'reighth',name:'八分休止符',v:.5,g:'\uE4E6'},{id:'rsixteenth',name:'十六分休止符',v:.25,g:'\uE4E7'}];
export const ACCIDENTALS=[['♯','升记号','将基本音级升高半音'],['♭','降记号','将基本音级降低半音'],['♮','还原记号','恢复基本音级的音高'],['𝄪','重升记号','将基本音级升高全音'],['𝄫','重降记号','将基本音级降低全音']];
export const DYNAMICS=[['pp','很弱'],['p','弱'],['mp','中弱'],['mf','中强'],['f','强'],['ff','很强'],['cresc.','渐强'],['dim.','渐弱'],['decresc.','渐弱'],['sf','突强'],['fp','强后即弱']];
export const TEMPO=[['Grave','庄板'],['Largo','广板'],['Larghetto','小广板'],['Lento','慢板'],['Adagio','柔板'],['Andante','行板'],['Andantino','小行板'],['Moderato','中板'],['Allegretto','小快板'],['Allegro','快板'],['Vivace','活泼地'],['Presto','急板'],['Prestissimo','最急板'],['accel.','渐快'],['rit.','渐慢'],['a tempo','回原速'],['D.C.','从头反复'],['D.S.','从记号处反复'],['Fine','结束'],['Coda','尾声']];
export const beatText=v=>({.375:'3/8',.25:'1/4',.5:'1/2',.75:'3/4',1:'1',1.5:'1又1/2',2:'2',3:'3',4:'4',6:'6'})[v]||String(v);
export const keyText=k=>k.count===0?'无升降号':`${Math.abs(k.count)}个${k.count>0?'升':'降'}号`;
export function makeQuestion(skill,index=0,seed=Date.now(),difficulty='basic',soundMode='up'){
 if(!isNewSkill(skill))return intervalQuestion(skill,index,seed,difficulty,soundMode);
 const r=rng(seed+index*8191+SKILLS.findIndex(s=>s.id===skill)*719),pick=a=>a[Math.floor(r()*a.length)],q={id:`${skill}-${seed}-${index}`,skill,type:'concept',notes:[],correct:'',options:[],mode:'up',seed};
 const choose=(correct,pool)=>{q.correct=correct;q.options=shuffle([correct,...shuffle([...new Set(pool)].filter(x=>x!==correct),r).slice(0,3)],r)};
 if(skill==='names'){
  const i=Math.floor(r()*7),reverse=pick([true,false]);q.title=reverse?`按固定唱名，${SOLFEGE[i]} 对应哪个基本音名？`:`按固定唱名，基本音名 ${LETTERS[i]} 的唱名是？`;q.feature=reverse?SOLFEGE[i]:LETTERS[i];choose(reverse?LETTERS[i]:SOLFEGE[i],reverse?LETTERS:SOLFEGE);q.detail=`固定唱名依次对应：C—do、D—re、E—mi、F—fa、G—sol、A—la、B—si。本题 ${LETTERS[i]} 对应 ${SOLFEGE[i]}。`;q.notes=[note(28+i)];q.showAfterOnly=true;
 }else if(skill==='register'||skill==='pitch'){
  q.clef=difficulty==='basic'?'treble':pick(['treble','bass']);const d=q.clef==='bass'?pick(Array.from({length:10},(_,i)=>18+i)):pick(Array.from({length:13},(_,i)=>28+i));q.notes=[note(d)];q.type='pitch';q.title=skill==='register'?'谱面上的音属于哪个音组？':'谱面上的音对应哪个音组记号？';
  if(skill==='register')choose(registerName(q.notes[0]),['大字组','小字组','小字一组','小字二组','小字三组']);else choose(groupSymbol(q.notes[0]),Array.from({length:14},(_,i)=>groupSymbol(note((q.clef==='bass'?17:28)+i))));q.detail=`${q.clef==='bass'?'低':'高'}音谱号中，这个音是 ${pitchName(q.notes[0])}，音组记号写作 ${groupSymbol(q.notes[0])}，属于${registerName(q.notes[0])}。中央C是 c¹（C4）。`;
 }else if(skill==='qualities'){
  const a=pick([['音的高低','振动频率','频率越高，音越高。'],['音的强弱','振幅','其他条件相同时，振幅越大，声音越强。'],['音的长短','持续时间','声音持续越久，时值越长。'],['音色','发音体与振动方式','不同乐器或发音方式会带来不同音色。']]);q.title=`${a[0]}主要与什么有关？`;q.feature=a[0];choose(a[1],['振动频率','振幅','持续时间','发音体与振动方式']);q.detail=a[2];
 }else if(skill==='duration'){
  const dur=pick(DURATIONS),dotted=difficulty!=='basic'&&r()>.45,v=dur.v*(dotted?1.5:1);q.glyph=dur.g;q.dot=dotted;q.title='以四分音符为一拍，这个符号有几拍？';choose(beatText(v)+'拍',[.25,.5,.75,1,1.5,2,3,4,6].map(v=>beatText(v)+'拍'));q.detail=`${dotted?'附点':''}${dur.name}的基本时值是${beatText(dur.v)}拍${dotted?'，附点增加原时值的一半，所以合计'+beatText(v)+'拍':''}。${dur.id==='rwhole'?'这里问的是基本时值；整小节休止时，全休止符也可表示整个小节的休止。':''}`;q.durationValue=v;q.baseValue=dur.v;
 }else if(skill==='meter'){
  const [n,d]=pick(difficulty==='basic'?[[2,4],[3,4],[4,4]]:[[2,4],[3,4],[4,4],[3,8],[6,8]]);q.meter=[n,d];q.title=pick([true,false])?'这个拍号的分母表示哪种单位音符？':'按这个拍号，每小节包含几个分母所指定的单位音符？';const unit=({4:'四分音符',8:'八分音符'})[d];if(q.title.includes('分母'))choose(unit,['二分音符','四分音符','八分音符','十六分音符']);else choose(n+'个',['2个','3个','4个','6个']);q.detail=`${n}/${d}：以${unit}为单位，每小节有${n}个这样的单位音符。${n===6&&d===8?'6/8通常感受为两大拍，每大拍是一个附点四分音符；这里的6表示六个八分音符单位。':''}`;
 }else if(skill==='key'){
  const k=pick(difficulty==='basic'?KEYS.filter(k=>Math.abs(k.count)<=3):KEYS),minor=r()>.5;q.key=k.count;q.type='key';q.title=`这个调号对应哪个${minor?'小调':'大调'}？`;choose((minor?k.minor+'小调':k.major+'大调'),KEYS.map(x=>minor?x.minor+'小调':x.major+'大调'));q.detail=`${keyText(k)}对应 ${k.major}大调和${k.minor}小调。关系大小调使用相同调号，但主音不同。`;q.keyCount=k.count;q.isMinor=minor;
 }else if(skill==='scale'||skill==='degrees'){
  const k=pick(difficulty==='basic'?KEYS.filter(k=>Math.abs(k.count)<=2):KEYS),minor=r()>.5,root=note(minor?k.md:k.d,minor?k.ma:k.acc);q.notes=naturalScale(root,minor);q.clef='treble';q.isMinor=minor;q.scaleKey=k;q.type='scale';const name=(minor?k.minor:k.major)+'自然'+(minor?'小调':'大调');
  if(skill==='scale'){q.title='这组上行音阶属于哪种调式？';choose(name,KEYS.flatMap(x=>[x.major+'自然大调',x.minor+'自然小调']));q.detail=`主音是${pitchName(root)}。${name}的音阶结构为${minor?'全—半—全—全—半—全—全':'全—全—半—全—全—全—半'}。`;}
  else{const degree=pick([2,3,4,5,6,7]);q.degree=degree;q.title=`${name}的第${degree}级音是？`;q.feature=name;q.showAfterOnly=true;choose(pitchClass(q.notes[degree-1]),[...q.notes.slice(0,7).map(pitchClass),...LETTERS]);q.detail=`从主音起依次计为Ⅰ、Ⅱ、Ⅲ……；${name}的第${degree}级是${pitchClass(q.notes[degree-1])}。音阶依次为 ${q.notes.slice(0,7).map(pitchClass).join('—')}。`;}
 }else{
  const items=skill==='accidental'?ACCIDENTALS:skill==='dynamics'?DYNAMICS:TEMPO,a=pick(items);q.feature=a[0];q.title=skill==='accidental'?'这个变音记号的作用是什么？':'这个音乐记号或术语的含义是什么？';choose(skill==='accidental'?a[2]:a[1],items.map(x=>skill==='accidental'?x[2]:x[1]));q.detail=skill==='accidental'?`${a[0]} 是${a[1]}，作用是${a[2]}。`:`${a[0]} 表示“${a[1]}”。${a[0]==='mp'?'注意：mp是中弱，mf才是中强。':''}`;
 }
 return q;
}
export const pitchClass=n=>(n.acc===-1?'降':n.acc===1?'升':n.acc===-2?'重降':n.acc===2?'重升':'')+LETTERS[n.d%7];
export const explanation=q=>q.detail||intervalExplanation(q);
export function notation(q,{reveal=false,id='question-staff'}={}){
 if(q.glyph)return `<div class="notation-symbol" role="img" aria-label="待辨认的音符或休止符"><span class="music">${q.glyph}</span>${q.dot?'<span class="augmentation-dot">·</span>':''}</div>`;
 if(q.meter)return `<div class="time-signature" role="img" aria-label="${q.meter[0]}/${q.meter[1]}拍号"><span>${q.meter[0]}</span><span>${q.meter[1]}</span></div>`;
 if(q.type==='key')return staff([],{key:q.key,id,caption:'题目调号'});
 if(q.showAfterOnly&&!reveal)return `<div class="concept-panel">${q.feature}</div>`;
 if(q.notes.length)return staff(q.notes,{id,label:reveal,clef:q.clef||'treble',harmonic:q.type==='invert',caption:reveal?'答案谱面':'题目谱面'});
 return q.feature?`<div class="concept-panel ${['dynamics','accidental'].includes(q.skill)?'symbol-text':''}">${q.feature}</div>`:'';
}
function table(rows){return `<div class="learning-table">${rows.map(([a,b])=>`<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>`}
function panel(title,text){return `<div class="card"><h3>${title}</h3><p>${text}</p></div>`}
function demo(notes,title){return `<button class="secondary" data-act="demo" data-notes="${notes.map(n=>n.midi).join(',')}">▶ ${title}</button>`}
export function newLesson(id){
 if(id==='names')return `<p class="lesson-text">音名采用 C、D、E、F、G、A、B 七个字母。<strong>本模块使用固定唱名</strong>，帮助初学者建立对应关系。</p>${table(LETTERS.map((l,i)=>[l,SOLFEGE[i]]))}${panel('记住顺序','七个基本音级循环排列：C—D—E—F—G—A—B—C。唱名与音组是不同概念；同名音可以处在不同音区。')}${staff(naturalScale(note(28)),{label:true,id:'names-demo'})}${demo(naturalScale(note(28)),'听 C 大调上行音阶')}`;
 if(id==='register')return `<p class="lesson-text">相同音名可以处在不同八度。教材用<strong>大小写字母与上下标</strong>区分音组。中央 C 记作 c¹，国际音高编号为 C4。</p>${table([['大字组','C—B，对应 C2—B2'],['小字组','c—b，对应 C3—B3'],['小字一组','c¹—b¹，对应 C4—B4'],['小字二组','c²—b²，对应 C5—B5'],['小字三组','c³—b³，对应 C6—B6']])}${panel('练习路径','基础练高音谱号；变化练习加入低音谱号。先认谱号，再数线与间，最后判断音组。')}${staff([note(28),note(35)],{label:true,id:'register-demo'})}${demo([note(28),note(35)],'听相差一个八度的 C')}`;
 if(id==='qualities')return `<p class="lesson-text">描述一个音时，可以从<strong>高低、强弱、长短和音色</strong>四个角度观察。不要把“更响”当作“更高”。</p>${table([['高低','与振动频率有关'],['强弱','主要与振幅有关'],['长短','与持续时间有关'],['音色','与发音体、振动方式等有关']])}${panel('用课堂上的声音理解','同一个音，轻弹与重弹主要改变强弱；低音和高音主要改变音高；让音延长改变长短；吉他与钢琴弹同样音高，音色仍然不同。')}`;
 if(id==='pitch')return `<p class="lesson-text">五线谱的五条线与四个间，都<strong>从下向上</strong>数。高音谱号确定 G 的位置，低音谱号确定 F 的位置。</p><div class="compare"><div class="card"><h3>高音谱号</h3>${staff([note(32)],{label:true,id:'clef-g'})}<p>第二线是 g¹（G4）</p></div><div class="card"><h3>低音谱号</h3>${staff([note(24)],{label:true,clef:'bass',id:'clef-f'})}<p>第四线是小字 f（F3）</p></div></div><div class="rule">高音谱号下加一线，与低音谱号上加一线，都是中央 C（c¹／C4）。</div>${staff([note(28)],{label:true,id:'middle-c'})}`;
 if(id==='duration')return `<p class="lesson-text">先以<strong>四分音符为一拍</strong>来比较时值。休止符表示相同长度的停顿。附点增加原时值的一半。</p>${table(DURATIONS.slice(0,5).map(d=>[`<span class="music table-glyph">${d.g}</span> ${d.name}`,beatText(d.v)+'拍']))}${panel('附点怎么算？','附点二分音符：2＋1＝3拍。<br>附点四分音符：1＋1/2＝1又1/2拍。<br>附点八分音符：1/2＋1/4＝3/4拍。')}${table(DURATIONS.slice(5).map(d=>[`<span class="music table-glyph">${d.g}</span> ${d.name}`,beatText(d.v)+'拍']))}<div class="rule">全休止符的基本时值为4个四分音符；用于整小节休止时，也可表示整个小节，不能仅凭符号断言该小节一定是4/4。</div>`;
 if(id==='meter')return `<p class="lesson-text">拍号写在谱号、调号之后。<strong>分母指定单位音符，分子表示每小节包含几个这样的单位音符。</strong></p>${table([['2/4','每小节2个四分音符单位，通常强—弱'],['3/4','每小节3个四分音符单位，通常强—弱—弱'],['4/4','每小节4个四分音符单位，通常强—弱—次强—弱'],['3/8','每小节3个八分音符单位'],['6/8','每小节6个八分音符单位，通常组合为两大拍']])}${panel('先统一单位，再相加','3/4一小节的总时值相当于3个四分音符，也相当于6个八分音符。但仅凭总时值，不能把3/4和6/8当作同一种节拍组织。小节线划分小节，通常紧接下一小节强拍之前。')}`;
 if(id==='key')return `<p class="lesson-text">调号告诉你哪些基本音级需要持续升降。<strong>关系大小调使用相同调号</strong>；只看调号时，要结合题目指定的大调或小调作答。</p><div class="card"><h3>一个升号：G大调／e小调</h3>${staff([],{key:1,id:'key-one'})}<p>升号顺序：F、C、G、D、A、E、B。<br>降号顺序：B、E、A、D、G、C、F。</p></div>${table(KEYS.filter(k=>Math.abs(k.count)<=3).map(k=>[keyText(k),k.major+'大调／'+k.minor+'小调']))}<div class="rule">基础练习使用三个升降号以内；变化练习扩展到七个升降号。</div>`;
 if(id==='scale')return `<p class="lesson-text">自然大调和自然小调的关键区别是<strong>全音、半音的排列顺序</strong>。</p><div class="card"><h3>C自然大调</h3>${staff(naturalScale(note(28)),{label:true,id:'scale-major'})}<p>全—全—半—全—全—全—半<br>半音位于Ⅲ—Ⅳ、Ⅶ—Ⅰ。</p>${demo(naturalScale(note(28)),'听自然大调')}</div><div class="card"><h3>a自然小调</h3>${staff(naturalScale(note(33),true),{label:true,id:'scale-minor'})}<p>全—半—全—全—半—全—全<br>半音位于Ⅱ—Ⅲ、Ⅴ—Ⅵ。</p>${demo(naturalScale(note(33),true),'听自然小调')}</div><div class="rule">本模块只练自然大小调；和声小调、旋律小调留在后续中级内容中。</div>`;
 if(id==='degrees')return `<p class="lesson-text">把主音当作第Ⅰ级，沿音阶向上依次编号。<strong>音级数字表达的是相对主音的位置</strong>。</p>${staff(naturalScale(note(28)),{label:true,id:'degree-scale'})}${table([['Ⅰ 主音','C大调中是C'],['Ⅱ 上主音','C大调中是D'],['Ⅲ 中音','C大调中是E'],['Ⅳ 下属音','C大调中是F'],['Ⅴ 属音','C大调中是G'],['Ⅵ 下中音','C大调中是A'],['Ⅶ 导音／下主音','自然大调中，Ⅶ级与主音相距半音；自然小调Ⅶ级与主音相距全音，通常称下主音']])}${panel('换了调，位置关系仍在','G大调的第Ⅲ级是B，第Ⅶ级是升F；不能把“第Ⅲ级”固定理解成E。练习只要求找出指定音级的音名。')}`;
 if(id==='accidental')return `<p class="lesson-text">变音记号写在音符前方，用来改变该音的音高。<strong>还原记号不是一律降低或升高半音</strong>，而是恢复基本音级。</p>${table(ACCIDENTALS.map(([s,n,a])=>[s+' '+n,a]))}${panel('看谱时注意','先看调号，再看临时变音记号。临时记号通常对本小节中同一音高位置后续的同音有效；跨越小节线后，应重新按调号判断。')}`;
 if(id==='dynamics')return `<p class="lesson-text">力度描述声音的强弱，也包括<strong>逐渐变化或突然变化</strong>。力度大小是音乐语境中的相对关系。</p>${table(DYNAMICS)}<div class="rule">特别容易混淆：mp＝中弱，mf＝中强；cresc.＝渐强，dim.＝渐弱。</div>`;
 return `<p class="lesson-text">先掌握常见速度，再认识速度变化、反复与结束用语。<strong>速度术语并不总对应唯一固定的节拍器数字。</strong></p>${table(TEMPO)}<div class="rule">a tempo表示回到原来的速度；D.C.是从头反复，D.S.是从反复记号处反复。</div>`;
}
