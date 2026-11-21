// Prepare recordings before enabling playback; never queue a late note behind a download.
export class Piano {
 constructor(status=()=>{}) {
  this.ctx=null;this.buffers=new Map();this.pending=new Map();this.errors=new Map();this.nodes=[];
  this.visual=null;this.serial=0;this.volume=.75;this.duration=.9;this.status=status;this.timer=null;this.playing=false;
  this.anchors=[];for(let o=2;o<=5;o++)for(const [n,p] of [['C',0],['Ds',3],['Fs',6],['A',9]])this.anchors.push({m:(o+1)*12+p,file:`${n}${o}`});this.anchors.push({m:84,file:'C6'});
 }
 context(){if(!this.ctx)this.ctx=new(window.AudioContext||window.webkitAudioContext)({latencyHint:'interactive'});return this.ctx}
 init(){const ctx=this.context();return ctx.state==='running'?Promise.resolve():ctx.resume()}
 unlock(){try{const result=this.init();result.catch(()=>{});return result}catch{return Promise.resolve()}}
 closest(m){return this.anchors.reduce((best,a)=>Math.abs(a.m-m)<Math.abs(best.m-m)?a:best,this.anchors[0])}
 ready(notes){return notes.every(m=>this.buffers.has(this.closest(m).m))}
 failed(notes){return notes.some(m=>this.errors.has(this.closest(m).m))}
 async load(m){
  const a=this.closest(m);if(this.buffers.has(a.m))return a;
  if(!this.pending.has(a.m)){
   this.errors.delete(a.m);
   const request=(async()=>{
    try{const ctx=this.context(),r=await fetch(`assets/piano/${a.file}.mp3`);if(!r.ok)throw Error('钢琴采样加载失败，请点击重试');const b=await ctx.decodeAudioData(await r.arrayBuffer());this.buffers.set(a.m,b);this.errors.delete(a.m)}
    catch(e){this.errors.set(a.m,e);throw e}
    finally{this.pending.delete(a.m);this.status(this.playing?'playing':'ready')}
   })();this.pending.set(a.m,request);
  }
  await this.pending.get(a.m);return a;
 }
 prepare(notes){return Promise.all([...new Set(notes.map(m=>this.closest(m).m))].map(m=>this.load(m)))}
 preload(){// The common lesson samples are prioritized; other notes follow in the background.
  return this.prepare([60,63,64,65,67]).then(()=>this.prepare(this.anchors.map(a=>a.m))).catch(()=>{});
 }
 stop(){
  this.serial++;clearTimeout(this.timer);this.playing=false;this.visual=null;
  for(const {s,g}of this.nodes){try{const now=this.ctx.currentTime;g.gain.cancelScheduledValues(now);g.gain.setTargetAtTime(.0001,now,.004);s.stop(now+.02)}catch{}}
  this.nodes=[];this.status('ready');
 }
 activeNoteIndices(){
  if(!this.playing||!this.visual||this.visual.kind==='rhythm'||!this.ctx)return [];
  const {at,gap,mode,notes,duration}=this.visual,t=this.ctx.currentTime-at;
  return notes.flatMap((_,i)=>{const start=mode==='harmonic'?0:i*gap;return t>=start&&t<start+duration+.2?[i]:[]});
 }
 activeEventIndices(){
  if(!this.playing||this.visual?.kind!=='rhythm'||!this.ctx)return [];
  const t=this.ctx.currentTime-this.visual.at;
  return this.visual.events.flatMap((e,index)=>t>=e.start&&t<e.end?[{index,rest:!e.notes.length}]:[]);
 }
 play(notes,mode='up'){
  // Not ready: show preparation, but do not emit a delayed sound when the request resolves.
  if(!this.ready(notes)){this.status('loading');this.prepare(notes).catch(e=>this.status('error',e.message));return false}
  this.stop();const token=this.serial;
  try{
   const ctx=this.context();if(ctx.state!=='running')this.unlock();
   const at=ctx.currentTime,gap=this.duration+.2;this.visual={at,gap,mode,notes:[...notes],duration:this.duration};this.playing=true;this.status('playing');
   notes.forEach((m,i)=>{
    const a=this.closest(m),s=ctx.createBufferSource(),g=ctx.createGain(),start=at+(mode==='harmonic'?0:i*gap),level=this.volume*(mode==='harmonic'?.58:.72);
    s.buffer=this.buffers.get(a.m);s.playbackRate.value=2**((m-a.m)/12);
    g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(level,start+.002);g.gain.setValueAtTime(level,start+this.duration);g.gain.exponentialRampToValueAtTime(.0001,start+this.duration+.2);
    s.connect(g).connect(ctx.destination);s.start(start);s.stop(start+this.duration+.24);s.onended=()=>{s.disconnect();g.disconnect()};this.nodes.push({s,g});
   });
   this.timer=setTimeout(()=>{if(token===this.serial){this.playing=false;this.nodes=[];this.status('ready')}},((mode==='harmonic'?0:(notes.length-1)*gap)+this.duration+.3)*1000);
   return true;
  }catch(e){this.playing=false;this.status('error',e.message);return false}
 }
 // Schedule acoustic-piano rhythms on the audio clock; rests remain silent.
 playSequence(events,bpm=80,countIn=2){
  const notes=[48,...events.flatMap(e=>e.notes)];
  if(!this.ready(notes)){this.status('loading');this.prepare(notes).catch(e=>this.status('error',e.message));return false}
  this.stop();const token=this.serial;
  try{
   const ctx=this.context();if(ctx.state!=='running')this.unlock();
   const at=ctx.currentTime,beat=60/Math.max(40,Math.min(160,Number(bpm)||80));
   const timeline=[...Array.from({length:countIn},(_,i)=>({at:i,beats:.18,notes:[48],cue:true})),...events.map(e=>({...e,at:e.at+countIn}))];
   this.visual={kind:'rhythm',at,events:events.map(e=>({...e,start:(e.at+countIn)*beat,end:(e.at+countIn+e.beats)*beat}))};
   this.playing=true;this.status('playing');
   for(const e of timeline)for(const midi of e.notes){
    const a=this.closest(midi),s=ctx.createBufferSource(),g=ctx.createGain(),start=at+e.at*beat,duration=Math.max(.04,e.beats*beat*.86),level=this.volume*(e.cue?.22:.65);
    s.buffer=this.buffers.get(a.m);s.playbackRate.value=2**((midi-a.m)/12);
    g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(level,start+.002);g.gain.setValueAtTime(level,start+duration);g.gain.exponentialRampToValueAtTime(.0001,start+duration+.055);
    s.connect(g).connect(ctx.destination);s.start(start);s.stop(start+duration+.065);s.onended=()=>{s.disconnect();g.disconnect()};this.nodes.push({s,g});
   }
   const end=Math.max(countIn,...events.map(e=>countIn+e.at+e.beats))*beat;
   this.timer=setTimeout(()=>{if(token===this.serial){this.playing=false;this.nodes=[];this.status('ready')}},(end+.1)*1000);return true;
  }catch(e){this.playing=false;this.status('error',e.message);return false}
 }

}
