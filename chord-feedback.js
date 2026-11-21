import {TRIADS,INVERSIONS} from './intermediate.js?v=unified-12';
import {pitchClass} from './curriculum.js?v=unified-12';
const skills=['b-triad','b-build','b-chord-ear','b-inversion'];
export const isChordSample=q=>skills.includes(q?.skill);
export function chordFeedback(q,choice){
 if(!isChordSample(q)||!choice||choice===q.correct)return '';
 if(q.skill==='b-inversion')return `最低音${pitchClass(q.notes[0])}是和弦的${['根音','三音','五音'][q.inv]}，所以是${INVERSIONS[q.inv]}。`;
 const correct=TRIADS[q.kind];if(!correct)return '';
 const selected=q.optionScores?.[choice];
 const chosen=selected?TRIADS.find(t=>t.offsets.every((v,i)=>v===selected[i].midi-selected[0].midi)):TRIADS.find(t=>t.name===choice);
 if(!chosen)return '';
 const adjustments=[1,2].filter(i=>chosen.offsets[i]!==correct.offsets[i]).map(i=>{
  const delta=correct.offsets[i]-chosen.offsets[i];
  return `${i===1?'三音':'五音'}应${delta>0?'升高':'降低'}${Math.abs(delta)===1?'半音':'全音'}`;
 });
 if(!adjustments.length)return '';
 return `你选的是${chosen.name}；${adjustments.join('、')}才是${correct.name}。`;
}
