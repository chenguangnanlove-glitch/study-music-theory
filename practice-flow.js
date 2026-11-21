export function practicePreferences(value={}){
 const v=value&&typeof value==='object'?value:{};
 return {count:[5,10,15].includes(v.count)?v.count:5,difficulty:v.difficulty==='varied'?'varied':'basic',intervalMode:['up','down','harmonic'].includes(v.intervalMode)?v.intervalMode:'up',chordMode:['up','harmonic'].includes(v.chordMode)?v.chordMode:'harmonic'};
}
export const missedQuestions=run=>(run?.questions||[]).filter((_,i)=>run.answers?.[i]?.checked&&!run.answers[i].correct);
