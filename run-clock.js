// Only visible answer time counts. Repeated pause events must be harmless.
export function pauseRunClock(run,now=Date.now()){
 if(!run||run.finished)return;
 if(Number.isFinite(run.started))run.elapsed=(run.elapsed||0)+Math.max(0,now-run.started);
 run.started=null;
}
export function resumeRunClock(run,now=Date.now()){
 if(run&&!run.finished&&!Number.isFinite(run.started))run.started=now;
}
