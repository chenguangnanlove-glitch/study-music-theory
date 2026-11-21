export const LETTERS=['C','D','E','F','G','A','B'];
export const NAT=[0,2,4,5,7,9,11];
export const INTERVALS=[{name:'纯一度',degree:1,semi:0},{name:'小二度',degree:2,semi:1},{name:'大二度',degree:2,semi:2},{name:'小三度',degree:3,semi:3},{name:'大三度',degree:3,semi:4},{name:'纯四度',degree:4,semi:5},{name:'增四度',degree:4,semi:6},{name:'减五度',degree:5,semi:6},{name:'纯五度',degree:5,semi:7},{name:'小六度',degree:6,semi:8},{name:'大六度',degree:6,semi:9},{name:'小七度',degree:7,semi:10},{name:'大七度',degree:7,semi:11},{name:'纯八度',degree:8,semi:12}];
export const note=(diatonic,acc=0)=>({d:diatonic,acc,midi:(Math.floor(diatonic/7)+1)*12+NAT[((diatonic%7)+7)%7]+acc});
export function interval(root,spec,dir=1){const targetD=root.d+dir*(spec.degree-1),nat=note(targetD),target=note(targetD,root.midi+dir*spec.semi-nat.midi);return [root,target]}
export function pitchName(n){return `${n.acc===-1?'♭':n.acc===1?'♯':n.acc===-2?'𝄫':n.acc===2?'𝄪':''}${LETTERS[((n.d%7)+7)%7]}${Math.floor(n.d/7)}`}
export const nameOnly=n=>`${n.acc===-1?'降':n.acc===1?'升':''}${LETTERS[((n.d%7)+7)%7]}`;
export function inversion(s){let quality=s.name[0];const q={纯:'纯',大:'小',小:'大',增:'减',减:'增'}[quality];return INTERVALS.find(x=>x.degree===9-s.degree&&x.name[0]===q)}
export function rng(seed){let n=seed>>>0;return()=>{n+=0x6D2B79F5;let t=n;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
export function shuffle(arr,r=Math.random){let a=[...arr];for(let i=a.length-1;i>0;i--){let j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
export const SKILLS=[{id:'steps',title:'全音与半音',desc:'先把音高距离弄清楚',icon:'½',level:'入门',lesson:'steps'},{id:'read',title:'看谱认音程',desc:'先数度数，再判断性质',icon:'𝄞',level:'基础',lesson:'read'},{id:'thirds',title:'大小三度听辨',desc:'同一个起音，听见不同距离',icon:'♪',level:'基础',lesson:'thirds'},{id:'ear',title:'综合音程听辨',desc:'变化根音，听上下行与和声',icon:'♫',level:'进阶',lesson:'ear'},{id:'invert',title:'音程转位',desc:'交换高低，理解音程的关系',icon:'⇅',level:'进阶',lesson:'invert'}];
const rank={steps:1,read:2,thirds:3,ear:4,invert:5};
export function makeQuestion(skill,index=0,seed=Date.now(),difficulty='basic',soundMode='up'){
 const r=rng(seed+index*8191+(rank[skill]||0)*173),pick=a=>a[Math.floor(r()*a.length)];let s,root,notes,correct,options,type='read',direction=1;
 if(skill==='steps'){
  s=pick(INTERVALS.filter(x=>x.degree===2));root=pick([note(28),note(29),note(30),note(31),note(32),note(33),note(34)]);notes=interval(root,s);correct=s.semi===1?'半音':'全音';options=['半音','全音','既不是全音，也不是半音'];
 }else{
  let pool=skill==='thirds'?INTERVALS.filter(x=>x.degree===3):skill==='ear'?INTERVALS.filter(x=>[2,3,4,5,6,7,8].includes(x.degree)&&!['增','减'].includes(x.name[0])):skill==='invert'?INTERVALS.filter(x=>x.degree>1&&x.degree<8):difficulty==='basic'?INTERVALS.filter(x=>[2,3,4,5,8].includes(x.degree)&&!['增','减'].includes(x.name[0])):INTERVALS;
  s=pick(pool);type=skill==='thirds'||skill==='ear'?'ear':skill==='invert'?'invert':'read';
  direction=type==='ear'&&soundMode==='down'?-1:1;
  root=skill==='thirds'&&difficulty==='basic'?note(28):pick([28,29,30,31,32,33,34].map(d=>note(d,difficulty==='basic'?0:pick([-1,0,1]))));
  if(direction===-1)root=note(root.d+7,root.acc);
  notes=interval(root,s,direction);
  correct=type==='invert'?inversion(s).name:s.name;
  if(skill==='thirds')options=['小三度','大三度'];else if(skill==='ear')options=shuffle([...new Set([correct,...shuffle(pool.map(x=>x.name),r).filter(x=>x!==correct).slice(0,3)])],r);else options=shuffle([correct,...shuffle(INTERVALS.map(x=>x.name).filter(x=>x!==correct),r).slice(0,3)],r);
 }
 return{id:`${skill}-${seed}-${index}`,skill,type,s,notes,correct,options,mode:soundMode,direction,title:skill==='steps'?'这两个音相隔全音还是半音？':type==='ear'?'听一听，这是什么音程？':type==='invert'?'这个音程转位后是什么音程？':'看五线谱，判断音程性质',seed};
}
export function explanation(q){const ns=q.notes.map(pitchName).join(q.mode==='harmonic'?' ＋ ':' → ');if(q.skill==='steps')return `${ns} 相距 ${q.s.semi} 个半音。一个半音是相邻琴键的距离，两个半音组成一个全音。`;
 const base=`${ns}：按音名字母数（包含起音与终音）是 ${q.s.degree} 度，实际相距 ${q.s.semi} 个半音，所以是${q.s.name}。`;
 return q.type==='invert'?base+` 转位后度数之和为9，半音数之和为12；大与小互换、增与减互换，纯保持纯，因此是${q.correct}。`:base;
}
export function staff(notes,{label=false,harmonic=false,caption='',id='staff',highlight=false,clef='treble',key=0}={}){
 const base=clef==='bass'?18:30,bottom=112,space=13,y=n=>bottom-(n.d-base)*space/2; // E4 is diatonic index 30.
 const width=notes.length>4?450:375,end=width-23;
 const xs=notes.map((_,i)=>harmonic?185:notes.length===1?190:notes.length===2?150+i*115:100+i*(width-155)/(notes.length-1));
 const accidental=a=>({[-2]:'\uE264',[-1]:'\uE260',[1]:'\uE262',[2]:'\uE263'})[a]||'';
 let lines=[0,1,2,3,4].map(i=>`<line x1="18" x2="${end}" y1="${bottom-i*space}" y2="${bottom-i*space}"/>`).join('');
 let symbols=notes.map((n,i)=>{const yy=y(n),x=xs[i],acc=accidental(n.acc),other=notes.some((v,j)=>j<i&&(Math.abs(v.d-n.d)===1||(v.d===n.d&&v.acc!==n.acc)));let xx=x+(harmonic&&other?23:0),ledger='';for(let d=base-2;d>=n.d;d-=2)ledger+=`<line x1="${xx-17}" x2="${xx+17}" y1="${y({d})}" y2="${y({d})}"/>`;for(let d=base+10;d<=n.d;d+=2)ledger+=`<line x1="${xx-17}" x2="${xx+17}" y1="${y({d})}" y2="${y({d})}"/>`;return `<g class="score-note" data-note-index="${i}" data-midi="${n.midi}">${ledger}${acc?`<text class="music" x="${xx-31}" y="${yy}" font-size="52">${acc}</text>`:''}<ellipse cx="${xx}" cy="${yy}" rx="10" ry="6.4" transform="rotate(-16 ${xx} ${yy})" class="note-head" fill="${highlight&&i===1?'#4168ae':'#25354b'}" stroke="none"/><ellipse cx="${xx}" cy="${yy}" rx="4.5" ry="3.3" transform="rotate(-16 ${xx} ${yy})" fill="white" stroke="none"/>${label?`<text x="${xx}" y="172" text-anchor="middle" class="pitch-label">${pitchName(n)}</text>`:''}</g>`}).join('');
 const keyPositions=(key>0?[38,35,39,36,33,37,34]:[34,37,33,36,32,35,31]).slice(0,Math.abs(key));const keySymbols=keyPositions.map((d,i)=>`<text class="music" x="${82+i*25}" y="${y({d:d-(clef==='bass'?14:0)})}" font-size="52">${key>0?'&#xE262;':'&#xE260;'}</text>`).join('');
 return `<svg class="staff" viewBox="0 0 ${width} 195" role="img" aria-labelledby="${id}"><title id="${id}">${caption||(clef==='bass'?'低音谱表':'高音谱表')}${label?' '+notes.map(pitchName).join('、'):''}</title><g stroke="#7b8593" stroke-width="1">${lines}<line x1="${end}" x2="${end}" y1="60" y2="112"/></g><text class="music" x="31" y="${clef==='bass'?73:99}" font-size="52">${clef==='bass'?'&#xE062;':'&#xE050;'}</text>${keySymbols}<g stroke="#25354b" stroke-width="1.4">${symbols}</g></svg>`
}
