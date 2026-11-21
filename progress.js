// Preserve legacy primary records and keep one resumable run per level.
export function createProgress(initial={}){
 const db={attempts:[],wrong:[],sessions:[],completedLessons:[],active:null,settings:{volume:.75,duration:.9,bpm:80},...initial};
 db.settings={volume:.75,duration:.9,bpm:80,...initial.settings};
 db.level=['primary','intermediate'].includes(db.level)?db.level:'primary';
 if(!db.activeByLevel)db.activeByLevel={primary:db.active||null,intermediate:null};
 delete db.active;
 Object.defineProperty(db,'active',{get(){return db.activeByLevel[db.level]||null},set(v){db.activeByLevel[db.level]=v},enumerable:false});
 return db;
}
