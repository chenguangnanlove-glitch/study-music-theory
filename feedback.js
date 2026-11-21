import {chordFeedback} from './chord-feedback.js?v=unified-12';
import {explanation,pitchName} from './course.js?v=unified-12';
export function briefFeedback(q,choice){
 if(!choice||choice===q.correct)return '';
 const chord=chordFeedback(q,choice);if(chord)return chord;
 if(q.type==='invert'&&q.s)return `转位前是${q.s.name}，转位后为${q.correct}：度数相加为9，性质按大与小、增与减互换，纯保持纯。`;
 if(q.s)return `${q.notes.map(pitchName).join('—')}相距${q.s.semi}个半音，${q.skill==='steps'?'所以是'+q.correct:'按音名字母数为'+q.s.degree+'度，是'+q.correct}。`;
 const sentences=explanation(q).match(/[^。！？]+[。！？]?/g)||[];
 return q.skill==='names'?sentences.at(-1)||'':sentences[0]||'';
}
