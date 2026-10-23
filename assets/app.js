"use strict";
/* Python Learn: state, Python runner, views. Progress lives in localStorage. */
/* ---------- utils ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const todayKey=()=>new Date().toLocaleDateString("en-CA");
const daysSince=d=>d?Math.max(0,(Date.parse(todayKey())-Date.parse(d))/864e5):99;
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const reduced=()=>window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const lsDel=k=>{try{localStorage.removeItem(k)}catch(e){}};

/* ---------- indexes ---------- */
const PROBS={},QUICK={};
for(const U of UNITS){U.problems.forEach(p=>{PROBS[p.id]={...p,unit:U.n}});U.quick.forEach((q,i)=>{QUICK[U.n+"."+i]={...q,unit:U.n,id:U.n+"."+i}})}
const TOTAL=()=>UNITS.reduce((a,U)=>a+U.problems.length,0);
const unitOf=n=>UNITS.find(U=>U.n===n);

/* ---------- state ---------- */
function blankState(){return{v:1,solved:{},prob:{},quick:{},mistakes:[],days:{},lessonsRead:[],updated:null}}
let S=blankState(),DAY=null,DAILY=null;
function mergeState(x){if(!x)return;const b=blankState();S={...b,...x}}
let saveTimer=null;
function queueSave(){clearTimeout(saveTimer);saveTimer=setTimeout(save,300)}
function save(){S.updated=new Date().toISOString();
  const ks=Object.keys(S.days).sort();if(ks.length>200)for(const k of ks.slice(0,ks.length-200))delete S.days[k];
  lsSet("pl_state",JSON.stringify(S));if(DAY)lsSet("pl_day",JSON.stringify(DAY))}
function today(){return S.days[todayKey()]||(S.days[todayKey()]={n:0,c:0,solved:0,daily:false})}
const isSolved=id=>!!S.solved[id];
const pstat=id=>S.prob[id]||(S.prob[id]={checks:0,fails:0,hints:0,shown:false});
function unitSolved(U){return U.problems.filter(p=>isSolved(p.id)).length}
function unitDone(U){return unitSolved(U)===U.problems.length}
function currentUnit(){return UNITS.find(U=>!unitDone(U))||null}

function recordQuick(q,ok){
  const st=S.quick[q.id]||(S.quick[q.id]={n:0,c:0,last:null});st.n++;if(ok)st.c++;st.last=todayKey();
  const d=today();d.n++;if(ok)d.c++;
  const m=S.mistakes.find(m=>m.kind==="q"&&m.key===q.id);
  if(!ok){if(m)m.fixes=0;else S.mistakes.unshift({kind:"q",key:q.id,t:todayKey(),fixes:0})}
  else if(m){m.fixes++;if(m.fixes>=2)S.mistakes=S.mistakes.filter(x=>x!==m)}
  S.mistakes=S.mistakes.slice(0,80);queueSave();renderStrip();
}
function recordSolve(id,review){
  const first=!isSolved(id);if(first)S.solved[id]=todayKey();
  const d=today();d.solved++;
  (S.reviewed||(S.reviewed={}))[id]=todayKey();
  if(review)S.mistakes=S.mistakes.filter(m=>!(m.kind==="p"&&m.key===id));
  queueSave();renderStrip();return first;
}
function flagProblem(id){if(!S.mistakes.some(m=>m.kind==="p"&&m.key===id))S.mistakes.unshift({kind:"p",key:id,t:todayKey(),fixes:0});queueSave()}

/* ---------- daily set ---------- */
function quickWeight(id){const st=S.quick[id];if(!st)return 3;return 0.4+2.5*(1-(st.c+1)/(st.n+2))+0.15*Math.min(daysSince(st.last),10)}
function pickQuick(n){
  const out=[];const cu=currentUnit();const upto=cu?cu.n:UNITS.length;
  for(const m of S.mistakes)if(m.kind==="q"&&QUICK[m.key]&&out.length<1)out.push(m.key);
  if(cu)for(const id of shuffle(cu.quick.map((_,i)=>cu.n+"."+i)))if(out.length<n-1&&!out.includes(id)&&!(S.quick[id]&&S.quick[id].c))out.push(id);
  const pool=Object.keys(QUICK).filter(id=>QUICK[id].unit<=upto&&!out.includes(id));
  while(out.length<n&&pool.length){const w=pool.map(quickWeight);let r=Math.random()*w.reduce((a,b)=>a+b,0);let k=0;for(;k<pool.length-1;k++){r-=w[k];if(r<=0)break}out.push(pool.splice(k,1)[0])}
  return out;
}
function nextNew(n,skip=[]){
  const out=[];for(const U of UNITS)for(const p of U.problems)if(!isSolved(p.id)&&!skip.includes(p.id)&&out.length<n)out.push(p.id);return out;
}
function pickReview(skip){
  const m=S.mistakes.find(m=>m.kind==="p"&&PROBS[m.key]&&!skip.includes(m.key));if(m)return{id:m.key,review:true};
  const cu=currentUnit();
  const old=Object.keys(S.solved).filter(id=>PROBS[id]&&!skip.includes(id)&&(!cu||PROBS[id].unit<cu.n||daysSince(S.solved[id])>=3));
  if(old.length){old.sort((a,b)=>((S.reviewed||{})[a]||"").localeCompare((S.reviewed||{})[b]||""));return{id:old[0],review:true}}
  return null;
}
function buildDay(){
  const probs=[];
  if(DAILY&&Array.isArray(DAILY.problems))for(const p of DAILY.problems.slice(0,2))if(PROBS[p.id])probs.push({id:p.id});
  for(const id of nextNew(2-probs.length,probs.map(p=>p.id)))probs.push({id});
  const rv=pickReview(probs.map(p=>p.id));
  if(rv)probs.push(rv);else for(const id of nextNew(1,probs.map(p=>p.id)))probs.push({id});
  return{date:todayKey(),quick:pickQuick(3),quickDone:false,problems:probs.map(p=>({...p,done:false}))};
}
function dayDone(){return DAY&&DAY.quickDone&&DAY.problems.every(p=>p.done)}
function markDayProgress(){if(dayDone()){const d=today();if(!d.daily){d.daily=true;queueSave();renderStrip();return true}}return false}

/* ---------- Python runner ---------- */
const PY={w:null,state:"idle",ready:null,cb:null,listeners:new Set(),error:""};
function pyNotify(){PY.listeners.forEach(f=>{try{f(PY.state)}catch(e){}})}
function pyStart(){
  if(PY.w)return PY.ready;
  PY.state="loading";pyNotify();
  PY.ready=new Promise((res,rej)=>{
    let w;try{w=new Worker("assets/py-worker.js")}catch(e){PY.state="failed";PY.error=String(e);pyNotify();rej(e);return}
    PY.w=w;
    w.onmessage=e=>{const m=e.data;
      if(m.type==="ready"){PY.state="ready";pyNotify();res()}
      else if(m.type==="fail"){PY.state="failed";PY.error=m.error;PY.w=null;w.terminate();pyNotify();rej(new Error(m.error))}
      else if(m.type==="result"&&PY.cb){const cb=PY.cb;PY.cb=null;cb(m)}};
    w.onerror=e=>{PY.state="failed";PY.error=e.message||"Python failed to load";PY.w=null;w.terminate();pyNotify();rej(new Error(PY.error))};
  });
  PY.ready.catch(()=>{});
  return PY.ready;
}
function pyRestart(){if(PY.w){PY.w.terminate();PY.w=null}PY.cb=null;PY.state="idle";pyStart()}
async function pyRun(code,tests){
  if(PY.state==="failed"){PY.w=null}
  await pyStart();
  if(PY.cb)throw new Error("busy");
  const limit=4000+1500*tests.length;
  return new Promise((res,rej)=>{
    const timer=setTimeout(()=>{PY.cb=null;pyRestart();res({timeout:true})},limit);
    PY.cb=m=>{clearTimeout(timer);if(m.error)rej(new Error(m.error));else res({results:m.results})};
    PY.w.postMessage({id:Date.now(),code,tests});
  });
}

/* ---------- checking ---------- */
const norm=s=>String(s).replace(/\r/g,"").split("\n").map(l=>l.replace(/\s+$/,"")).join("\n").replace(/^\n+/,"").replace(/\n+$/,"");
function testFiles(p,t){return t.files!==undefined?t.files:(p.files||{})}
function evalTest(t,r){
  const fails=[];
  if(r.error&&t.exit===undefined)fails.push({k:"crash",msg:"Your program crashed."});
  if(t.out!==undefined&&!t.skipRun){
    const got=norm(r.stdout),want=norm(t.out);let ok;
    if(t.match==="regex")ok=new RegExp(t.out,t.ci?"i":"").test(got);
    else if(t.match==="contains")ok=t.ci?got.toLowerCase().includes(want.toLowerCase()):got.includes(want);
    else ok=t.ci?got.toLowerCase()===want.toLowerCase():got===want;
    if(!ok)fails.push({k:"out",want:t.match==="regex"?null:want,got});
  }
  if(t.exit!==undefined){const ok=t.exit==="nonzero"?r.exit!==0:r.exit===t.exit;if(!ok)fails.push({k:"exit",msg:t.exit==="nonzero"?"Your program should have stopped with sys.exit(...) here, but it finished normally.":`Expected exit code ${t.exit}, got ${r.exit}.`})}
  if(t.errIncludes&&!(r.stderr+r.stdout).includes(t.errIncludes))fails.push({k:"err",msg:`Expected the message "${t.errIncludes}". Your program printed: ${norm(r.stderr+r.stdout)||"(nothing)"}`});
  if(t.check&&r.check&&!r.check.ok)fails.push({k:"check",msg:r.check.msg});
  return fails;
}
function testLabel(t){
  if(t.label)return t.label;
  const parts=[];if(t.argv)parts.push("Arguments: "+(t.argv.length?t.argv.join(" "):"(none)"));
  if(t.stdin)parts.push("Input: "+(t.stdin.length?t.stdin.map(s=>JSON.stringify(s)).join(", "):"(none)"));
  return parts.join(" · ")||"Run your program";
}

/* ---------- text formatting ---------- */
function inline(s){return esc(s).replace(/`([^`]+)`/g,"<code>$1</code>")}
function fmtText(s){
  return String(s).split(/```\n?([\s\S]*?)\n?```/).map((chunk,i)=>{
    if(i%2)return`<pre class="codeblock">${esc(chunk)}</pre>`;
    return chunk.split(/\n{2,}/).filter(x=>x.trim()).map(par=>{
      const lines=par.split("\n");
      if(lines.every(l=>/^- /.test(l)))return`<ul>${lines.map(l=>`<li>${inline(l.slice(2))}</li>`).join("")}</ul>`;
      return`<p>${lines.map(inline).join("<br>")}</p>`}).join("");
  }).join("");
}

/* ---------- editor ---------- */
function makeEditor(host,value,onChange,onRun){
  if(window.CodeMirror){
    const cm=CodeMirror(host,{value,mode:"python",lineNumbers:true,indentUnit:4,tabSize:4,indentWithTabs:false,matchBrackets:true,viewportMargin:Infinity,lineWrapping:false,
      extraKeys:{Tab:c=>{if(c.somethingSelected())c.indentSelection("add");else c.replaceSelection("    ","end")},"Shift-Tab":c=>c.indentSelection("subtract"),"Ctrl-Enter":()=>onRun(),"Cmd-Enter":()=>onRun()}});
    cm.on("change",()=>onChange(cm.getValue()));
    setTimeout(()=>cm.refresh(),0);
    return{get:()=>cm.getValue(),set:v=>cm.setValue(v),focus:()=>cm.focus(),refresh:()=>cm.refresh()};
  }
  const ta=document.createElement("textarea");ta.className="plain-editor";ta.value=value;ta.spellcheck=false;ta.setAttribute("aria-label","Code editor");ta.rows=14;host.appendChild(ta);
  ta.addEventListener("keydown",e=>{
    if(e.key==="Tab"){e.preventDefault();ta.setRangeText("    ",ta.selectionStart,ta.selectionEnd,"end")}
    else if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){e.preventDefault();onRun()}
    else if(e.key==="Enter"){const before=ta.value.slice(0,ta.selectionStart);const line=before.split("\n").pop();let ind=line.match(/^ */)[0];if(/:\s*$/.test(line))ind+="    ";e.preventDefault();ta.setRangeText("\n"+ind,ta.selectionStart,ta.selectionEnd,"end")}
  });
  ta.addEventListener("input",()=>onChange(ta.value));
  return{get:()=>ta.value,set:v=>{ta.value=v},focus:()=>ta.focus(),refresh(){}};
}

/* ---------- problem workspace ---------- */
const draftKey=(id,review)=>"pl_code_"+id+(review?"_r":"");
function pyStatusHTML(){return{idle:"Python loads when you first run code.",loading:"Loading Python in your browser. The first time takes 10–20 seconds; after that it's cached.",ready:"Python 3.12 is ready.",failed:"Python couldn't load. Check your connection and reload the page."}[PY.state]}
function openProblem(id,opts={}){
  const p=PROBS[id];if(!p)return;
  const host=$("#v-problem");const U=unitOf(p.unit);const st=pstat(id);
  const review=!!opts.review;let code=review?(lsGet(draftKey(id,true))??p.starter):(lsGet(draftKey(id))??p.starter);
  const examples=p.tests.filter(t=>!t.skipRun&&t.out!==undefined&&t.match!=="regex"&&!t.check).slice(0,2);
  const files=p.files||{};
  host.innerHTML=`<div class="stack">
    <div class="row between"><button class="btn ghost chip" id="pback">← Back</button><span class="pill ${isSolved(id)?"ok":"todo"}" id="pstatus">${isSolved(id)?"solved":"not solved yet"}</span></div>
    <div class="card stack">
      <span class="tag">Unit ${U.n} · ${esc(U.title)}${review?" · from memory":""}</span>
      <h2>${esc(p.title)}</h2>
      ${review?`<p class="banner">Review: solve this again without looking. You've seen it before, so this is where it sticks.</p>`:""}
      <div class="brief measure">${fmtText(p.brief)}</div>
      ${examples.length?`<div class="stack small"><h3>Example${examples.length>1?"s":""}</h3>${examples.map(t=>`<pre class="codeblock">${t.argv?`$ python program.py ${esc(t.argv.join(" "))}\n`:""}${(t.stdin||[]).map(s=>`<span class="muted">input:</span> ${esc(s)}`).join("\n")}${t.stdin&&t.stdin.length?"\n":""}<span class="muted">prints:</span>\n${esc(t.out)}</pre>`).join("")}</div>`:""}
      ${Object.keys(files).length?`<div class="stack small"><h3>Files in the folder</h3>${Object.entries(files).map(([n,c])=>`<details class="file"><summary><code>${esc(n)}</code></summary><pre class="codeblock">${esc(c)}</pre></details>`).join("")}</div>`:""}
    </div>
    <div class="card stack ws">
      <div class="row between"><h3>program.py</h3><span class="kbd">Ctrl/⌘ + Enter to check</span></div>
      <div id="editor"></div>
      <div class="iogrid">
        <label class="stack small" for="stdin" ${p.tests.some(t=>t.stdin&&t.stdin.length)?"":"hidden"}><span>Input <span class="muted">· one line per input() call</span></span><textarea id="stdin" rows="3" spellcheck="false">${esc((examples[0]&&examples[0].stdin||[]).join("\n"))}</textarea></label>
        ${p.argv?`<label class="stack small" for="argv"><span>Arguments <span class="muted">· as in python program.py …</span></span><input type="text" id="argv" autocomplete="off" spellcheck="false" value="${esc((p.tests[0].argv||[]).join(" "))}"></label>`:""}
      </div>
      <div class="row">
        <button class="btn" id="prun">Run</button>
        <button class="btn accent" id="pcheck">Check</button>
        <button class="btn ghost" id="phint">Hint</button>
        <button class="btn ghost" id="psol" hidden>Show solution</button>
        <button class="btn ghost" id="preset">Reset code</button>
      </div>
      <p class="small muted" id="pystat" aria-live="polite">${esc(pyStatusHTML())}</p>
      <div id="hints" class="stack"></div>
      <div id="pout" class="stack" aria-live="polite"></div>
      <div id="psolbox"></div>
    </div>
    ${!review?`<p class="small muted center">Stuck for more than 20 minutes? Take a hint, then try again tomorrow. Struggling a bit is how it sticks.</p>`:""}
  </div>`;
  const ed=makeEditor(host.querySelector("#editor"),code,v=>{lsSet(draftKey(id,review),v)},()=>check());
  pyStart();
  const statEl=host.querySelector("#pystat");const lis=()=>{if(statEl.isConnected)statEl.textContent=pyStatusHTML();else PY.listeners.delete(lis)};PY.listeners.add(lis);
  let hintsShown=0,fails=0;const hintsBox=host.querySelector("#hints");const out=host.querySelector("#pout");
  const solBtn=host.querySelector("#psol");
  const updSol=()=>{solBtn.hidden=!(isSolved(id)&&!review||fails>=2||st.shown)};updSol();
  host.querySelector("#pback").onclick=()=>{PY.listeners.delete(lis);back()};
  host.querySelector("#preset").onclick=e=>{const b=e.currentTarget;if(b.dataset.sure){ed.set(p.starter);lsDel(draftKey(id,review));b.textContent="Reset code";delete b.dataset.sure}else{b.dataset.sure="1";b.textContent="Sure? Click again";setTimeout(()=>{if(b.isConnected){b.textContent="Reset code";delete b.dataset.sure}},3000)}};
  const hintBtn=host.querySelector("#phint");
  const hintLabel=()=>{hintBtn.textContent=hintsShown<p.hints.length?`Hint ${hintsShown+1} of ${p.hints.length}`:"No more hints";hintBtn.disabled=hintsShown>=p.hints.length};hintLabel();
  hintBtn.onclick=()=>{if(hintsShown>=p.hints.length)return;hintsBox.insertAdjacentHTML("beforeend",`<p class="hint qin"><b>Hint ${hintsShown+1}.</b> ${inline(p.hints[hintsShown])}</p>`);hintsShown++;st.hints++;queueSave();hintLabel()};
  solBtn.onclick=()=>{
    if(!isSolved(id)&&!st.shown&&!solBtn.dataset.sure){solBtn.dataset.sure="1";solBtn.textContent="Sure? It'll come back for review";return}
    if(!isSolved(id)||review){st.shown=true;st.shownDay=todayKey();flagProblem(id);if(opts.onGiveUp)opts.onGiveUp()}
    host.querySelector("#psolbox").innerHTML=`<div class="stack qin"><h3>One way to solve it</h3><pre class="codeblock">${esc(p.solution)}</pre><p class="small muted">Yours doesn't have to match. If it passes the checks, it's right.</p></div>`;solBtn.hidden=true;
  };
  const busy=b=>host.querySelectorAll("#prun,#pcheck").forEach(x=>x.disabled=b);
  async function run(){
    busy(true);out.innerHTML=`<p class="small muted">Running…</p>`;
    const stdin=host.querySelector("#stdin").value.replace(/\r/g,"");const lines=stdin===""?[]:stdin.replace(/\n$/,"").split("\n");
    const argvEl=host.querySelector("#argv");const argv=argvEl?argvEl.value.trim().split(/\s+/).filter(Boolean):[];
    try{const r=await pyRun(ed.get(),[{stdin:lines,argv,files}]);
      if(r.timeout){out.innerHTML=timeoutHTML();return}
      const x=r.results[0];
      out.innerHTML=`<div class="stack"><h3>Output</h3><pre class="console">${esc(x.transcript||"")||'<span class="muted">(your program printed nothing)</span>'}</pre>${x.error?errHelp(x.error):""}${x.exit&&!x.error?`<p class="small muted">Program exited with code ${x.exit}.</p>`:""}</div>`;
    }catch(e){out.innerHTML=`<p class="small bad">${esc(e.message==="busy"?"Still running the last one.":"Couldn't run Python: "+e.message)}</p>`}
    finally{busy(false)}
  }
  async function check(){
    if(host.querySelector("#pcheck").disabled)return;
    busy(true);out.innerHTML=`<p class="small muted">Checking ${p.tests.length} test${p.tests.length>1?"s":""}…</p>`;
    const tests=p.tests.map(t=>({...t,files:testFiles(p,t)}));
    try{const r=await pyRun(ed.get(),tests);st.checks++;
      if(r.timeout){fails++;out.innerHTML=timeoutHTML();updSol();queueSave();return}
      const res=tests.map((t,i)=>({t,r:r.results[i],f:evalTest(t,r.results[i])}));
      const passed=res.filter(x=>!x.f.length).length;const all=passed===res.length;
      const firstBad=res.find(x=>x.f.length);
      out.innerHTML=`<div class="fb ${all?"ok":"bad"}"><span class="verdict">${all?"All tests pass":`${passed} of ${res.length} tests pass`}</span>
        <ul class="tests">${res.map(x=>`<li class="${x.f.length?"no":"yes"}"><span aria-hidden="true">${x.f.length?"✗":"✓"}</span> ${esc(testLabel(x.t))}</li>`).join("")}</ul>
        ${firstBad?failHTML(firstBad):""}</div>`;
      if(all){const first=recordSolve(id,review);
        host.querySelector("#pstatus").className="pill ok";host.querySelector("#pstatus").textContent="solved";
        if(review)lsDel(draftKey(id,true));
        out.querySelector(".fb").insertAdjacentHTML("beforeend",`<span>${first?"Solved. Nice work.":"Solved again."}</span>`);
        out.querySelector(".fb").classList.add("good");
        if(opts.onSolved)opts.onSolved();updSol();
        const nx=nextAfter(id);
        out.insertAdjacentHTML("beforeend",`<div class="row">${opts.fromDaily?`<button class="btn accent" id="pdone">Back to today's set</button>`:nx?`<button class="btn accent" id="pnext">Next problem: ${esc(PROBS[nx].title)}</button>`:""}</div>`);
        const pd=out.querySelector("#pdone");if(pd)pd.onclick=()=>{PY.listeners.delete(lis);back()};
        const pn=out.querySelector("#pnext");if(pn)pn.onclick=()=>{PY.listeners.delete(lis);openProblem(nx,{from:opts.from})};
      }else{fails++;st.fails++;updSol()}
      queueSave();
    }catch(e){out.innerHTML=`<p class="small bad">${esc(e.message==="busy"?"Still running the last one.":"Couldn't run Python: "+e.message)}</p>`}
    finally{busy(false)}
  }
  host.querySelector("#prun").onclick=run;host.querySelector("#pcheck").onclick=check;
  showView("problem");try{history.replaceState(null,"","#p/"+id)}catch(e){}
  window.scrollTo({top:0,behavior:"auto"});
  PROBLEM_CTX={id,opts};
}
let PROBLEM_CTX=null,LAST_VIEW="daily";
function nextAfter(id){const ids=Object.keys(PROBS);const i=ids.indexOf(id);for(let k=i+1;k<ids.length;k++)if(!isSolved(ids[k]))return ids[k];return null}
function timeoutHTML(){return`<div class="fb bad"><span class="verdict">Your program took too long</span><span>It ran for several seconds without finishing. Usually that's a loop that never stops (check the while condition changes), or an input() the program keeps waiting on. Python has been restarted.</span></div>`}
function errHelp(err){
  const last=(err.trim().split("\n").filter(l=>l.trim()).pop()||"");
  const tips=[[/^EOFError|asked for more input/m,"Your program called input() more times than there are lines in the Input box. Add another line, or check for a loop that keeps asking."],[/^SyntaxError/m,"Python couldn't read a line. Look for a missing quote, bracket or colon on the line shown, or just above it."],[/^IndentationError/m,"The spacing at the start of a line is off. Lines inside an if, loop or def need four more spaces than the line that opens it."],[/^NameError/m,"Python doesn't know that name. Is there a typo, missing quotes around text, or a variable used before it's created?"],[/^TypeError/m,"Two types that don't mix, often a string and a number. Did you forget int() or float() around input()?"],[/^ValueError/m,"A value of the right type but the wrong content, like int(\"cat\")."],[/^IndexError/m,"A list position that doesn't exist. Remember the first item is [0] and sys.argv[1] needs an argument."],[/^KeyError/m,"That key isn't in the dictionary. Check the spelling and capitals, or test with in first."],[/^ZeroDivisionError/m,"Something was divided by zero."],[/^FileNotFoundError/m,"That file isn't in the folder. Check the name, including capitals and extension."],[/^AttributeError/m,"That object doesn't have that method or attribute. Check the spelling, and what type the value really is."]];
  const tip=(tips.find(([re])=>re.test(err))||[])[1];
  return`<details class="err" open><summary><b>${esc(last)}</b></summary><pre class="console">${esc(err)}</pre></details>${tip?`<p class="small">${esc(tip)}</p>`:""}`;
}
function failHTML(x){
  const {t,r,f}=x;const rows=[];
  if(t.argv)rows.push(`<span class="muted">Arguments:</span> ${esc(t.argv.join(" ")||"(none)")}`);
  if(t.stdin)rows.push(`<span class="muted">Input:</span> ${t.stdin.length?t.stdin.map(s=>`<code>${esc(s)}</code>`).join(" "):"(none)"}`);
  let body="";
  for(const e of f){
    if(e.k==="out")body+=`<div class="diff"><div><h3>Expected</h3><pre class="console">${e.want===null?'<span class="muted">a number from the allowed range</span>':esc(e.want)||'<span class="muted">(nothing)</span>'}</pre></div><div><h3>Your program printed</h3><pre class="console">${esc(e.got)||'<span class="muted">(nothing)</span>'}</pre></div></div>${e.want&&e.got&&e.want.toLowerCase()===e.got.toLowerCase()?`<p class="small">Close: only the capitals differ.</p>`:e.want&&e.got&&e.want.replace(/\s+/g,"")===e.got.replace(/\s+/g,"")?`<p class="small">Close: only the spaces or line breaks differ.</p>`:""}`;
    else if(e.k==="crash")body+=errHelp(r.error);
    else body+=`<p>${esc(e.msg)}</p>`;
  }
  return`<div class="stack small failbox"><b>First failing test: ${esc(testLabel(t))}</b>${rows.length?`<p>${rows.join("<br>")}</p>`:""}${body}</div>`;
}

/* ---------- quick-question runner ---------- */
function quickRunner(host,ids,{title,onDone}){
  let i=0,right=0;
  function draw(){
    const q=QUICK[ids[i]];if(!q){onDone&&onDone(right,ids.length);return}
    const multi=!q.opts&&/\n/.test(q.a);
    host.innerHTML=`<div class="card ticket qin">
      <div class="meta"><span>${esc(title)} · ${i+1} / ${ids.length}</span><span>Unit ${q.unit}${S.mistakes.some(m=>m.kind==="q"&&m.key===q.id)?" · review":""}</span></div>
      <div class="progressbar"><i style="width:${i/ids.length*100}%"></i></div>
      <div class="q">${esc(q.q)}</div>
      ${q.code?`<pre class="codeblock">${esc(q.code)}</pre>`:""}
      ${q.opts?`<div class="opts" role="group" aria-label="Answers">${q.opts.map((o,k)=>`<button class="opt" data-k="${k}">${esc(o)}</button>`).join("")}</div>`
        :multi?`<label class="small muted" for="qans">Type exactly what it prints, one line per line</label><textarea id="qans" rows="3" spellcheck="false" class="mono"></textarea>`
        :`<label class="small muted" for="qans">Type exactly what it prints</label><input type="text" id="qans" autocomplete="off" spellcheck="false" class="mono">`}
      ${q.opts?"":`<div class="row"><button class="btn" id="qsub">Check</button><button class="btn ghost" id="qskip">I don't know</button></div>`}
      <div id="qfb"></div></div>`;
    if(!q.opts){const inp=host.querySelector("#qans");inp.focus({preventScroll:true});
      inp.addEventListener("keydown",e=>{if(e.key==="Enter"&&(!multi||e.ctrlKey||e.metaKey)){e.preventDefault();answer(inp.value,false)}});
      host.querySelector("#qsub").onclick=()=>answer(inp.value,false);host.querySelector("#qskip").onclick=()=>answer("",true);}
    else host.querySelectorAll(".opt").forEach(b=>b.onclick=()=>answer(Number(b.dataset.k),false));
  }
  function answer(v,skipped){
    const q=QUICK[ids[i]];const card=host.querySelector(".ticket");if(card.dataset.done)return;
    let ok;
    if(q.opts){ok=v===q.a;host.querySelectorAll(".opt").forEach(b=>{const k=Number(b.dataset.k);b.disabled=true;if(k===q.a)b.classList.add("right");else if(k===v)b.classList.add("wrong")})}
    else{if(!skipped&&!String(v).trim())return;ok=!skipped&&norm(v)===norm(q.a);host.querySelectorAll("#qans,#qsub,#qskip").forEach(el=>el.disabled=true)}
    card.dataset.done="1";if(ok)right++;recordQuick(q,ok);
    card.classList.remove("qin");card.classList.add(ok?"good":"shake");
    const fb=host.querySelector("#qfb");
    fb.innerHTML=`<div class="fb ${ok?"ok":"bad"}"><span class="verdict">${ok?"Correct":"Not quite"}</span>
      ${!q.opts?`<span class="muted">It prints:</span><pre class="console">${esc(q.a)}</pre>`:""}
      <span>${esc(q.why||"")}</span>${!ok&&!q.opts&&/^["'].*["']$/.test(String(v).trim())?`<span class="small">print doesn't show the quotes around a string.</span>`:""}</div>
      <div class="row" style="margin-top:10px"><button class="btn accent" id="qnext">${i+1<ids.length?"Next":"Finish"}</button></div>`;
    const nb=fb.querySelector("#qnext");nb.focus({preventScroll:true});nb.onclick=()=>{i++;draw()};
  }
  draw();
}

/* ---------- views ---------- */
const VIEWS=["learn","daily","practice","profile"];
function streak(){let n=0;const d=new Date();if(!(S.days[todayKey()]?.daily))d.setDate(d.getDate()-1);while(S.days[d.toLocaleDateString("en-CA")]?.daily){n++;d.setDate(d.getDate()-1)}return n}
function renderStrip(){
  bump("#sStreak",streak());bump("#sSolved",Object.keys(S.solved).filter(id=>PROBS[id]).length);
  $("#sTotal").textContent=TOTAL();
}
function bump(sel,v){const el=$(sel);if(!el)return;if(el.textContent!==String(v)){el.textContent=v;el.classList.remove("bump");void el.offsetWidth;el.classList.add("bump")}}
function cs50Line(U){return`<p class="small muted">CS50P <a href="${CS50P_URL}" target="_blank" rel="noopener">Lecture ${U.week}: ${esc(WEEKS[U.week])}</a>. Watch it, do this unit, then try Problem Set ${U.week} on your own.</p>`}
function lessonHTML(U,open){
  return`<div class="lessonbody" ${open?"":"hidden"}>${U.sections.map(x=>`<div class="lsec"><b>${esc(x.h)}</b><p>${esc(x.p)}</p></div>`).join("")}
    <div class="lsec"><b>Remember</b><ul>${U.takeaways.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></div></div>`;
}
function renderDaily(){
  const host=$("#v-daily");
  if(!DAY||DAY.date!==todayKey()){DAY=buildDay();save()}
  const U=currentUnit();const lessonId=U?"u"+U.n:null;const read=lessonId&&S.lessonsRead.includes(lessonId);
  const done=dayDone();
  const item=(label,sub,state,btn)=>`<li class="dayitem ${state}"><span class="tick" aria-hidden="true">${state==="done"?"✓":""}</span><span class="l"><span>${label}</span><span class="small muted">${sub}</span></span>${btn}</li>`;
  host.innerHTML=`${DAILY&&DAILY.message?`<div class="card"><p class="measure">${esc(DAILY.message)}</p></div>`:""}
    ${U?`<div class="card lesson">
      <div class="row between"><h3>${read?"Current unit":"Today's lesson"} · Unit ${U.n} of ${UNITS.length}</h3>${read?`<span class="pill ok">read</span>`:""}</div>
      <h2>${esc(U.title)}</h2>${cs50Line(U)}
      ${lessonHTML(U,!read)}
      <div class="row">${read?`<button class="btn ghost" id="ltoggle">Show lesson</button>`:`<button class="btn" id="lread">Got it</button>`}<span class="muted small">${unitSolved(U)} of ${U.problems.length} problems solved in this unit</span></div></div>`
      :`<div class="card lesson"><h3>Course complete</h3><h2>You've solved every problem.</h2><p class="muted measure">Time for the CS50P final project. Daily sets now mix review problems from memory.</p></div>`}
    <div class="card stack">
      <h3>${new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}</h3>
      <h2>${done?"Today's set is done. See you tomorrow.":"Today's set · about 30 minutes"}</h2>
      <p class="muted measure">A quick warm-up, then problems: new ones from where you are in the course, plus one you've seen before to solve from memory.</p>
      <ol class="daylist">
        ${item("Warm-up",`${DAY.quick.length} quick questions`,DAY.quickDone?"done":"",`<button class="btn ${DAY.quickDone?"ghost":"accent"} chip" id="dwarm">${DAY.quickDone?"Again":"Start"}</button>`)}
        ${DAY.problems.map((x,k)=>{const p=PROBS[x.id];return item(esc(p.title),`${x.review?"From memory · ":""}Unit ${p.unit} · ${esc(unitOf(p.unit).title)}`,x.done?"done":"",`<button class="btn ${x.done?"ghost":"accent"} chip" data-dp="${k}">${x.done?"Open":"Solve"}</button>`)}).join("")}
      </ol>
      <div class="row">${done?`<button class="btn ghost" id="dextra">Give me another problem</button>`:""}<span class="muted small">Streak: ${streak()} day${streak()===1?"":"s"}. A day counts once the warm-up is done and every problem is solved or its solution viewed.</span></div>
    </div>
    <div id="runhost"></div>`;
  const lr=host.querySelector("#lread");if(lr)lr.onclick=()=>{S.lessonsRead=[...S.lessonsRead,lessonId];queueSave();renderDaily()};
  const lt=host.querySelector("#ltoggle");if(lt)lt.onclick=()=>{const b=host.querySelector(".lessonbody");b.hidden=!b.hidden;lt.textContent=b.hidden?"Show lesson":"Hide lesson"};
  host.querySelector("#dwarm").onclick=()=>{const rh=host.querySelector("#runhost");
    quickRunner(rh,DAY.quick,{title:"Warm-up",onDone:(r,n)=>{DAY.quickDone=true;const fin=markDayProgress();save();renderDaily();
      const rh2=$("#runhost");rh2.innerHTML=`<div class="card stack qin"><h3>Warm-up done</h3><div class="big tabular">${r}/${n}</div><p class="muted">${fin?"That's today's set finished.":"Now the problems."} Misses come back in later warm-ups until you get them right twice.</p></div>`}});
    rh.scrollIntoView({behavior:reduced()?"auto":"smooth",block:"start"})};
  host.querySelectorAll("[data-dp]").forEach(b=>b.onclick=()=>{const k=Number(b.dataset.dp);const x=DAY.problems[k];
    const fin=()=>{x.done=true;markDayProgress();save()};
    openProblem(x.id,{review:x.review,fromDaily:true,from:"daily",onSolved:fin,onGiveUp:fin})});
  const ex=host.querySelector("#dextra");if(ex)ex.onclick=()=>{const id=nextNew(1,DAY.problems.map(p=>p.id))[0]||pickReview(DAY.problems.map(p=>p.id))?.id;if(id)openProblem(id,{from:"daily",review:isSolved(id)})};
}
// The solution-viewed rule: a problem whose solution was revealed counts as done for the day.
function syncDayFromShown(){if(!DAY)return;for(const x of DAY.problems)if(!x.done&&S.prob[x.id]&&S.prob[x.id].shown&&S.prob[x.id].shownDay===todayKey())x.done=true}
function renderLearn(){
  const host=$("#v-learn");const cu=currentUnit();
  host.innerHTML=`<div class="card stack"><h3>The course</h3><h2>From zero to CS50P's final project</h2>
    <p class="muted measure">${UNITS.length} units that follow CS50's Introduction to Programming with Python, lecture by lecture. Read a unit, then solve its problems. A unit is done when every problem passes. The problems are practice for the same skills as CS50's problem sets, not the problem sets themselves, so do those on your own afterwards.</p></div>
    <ol class="units">${UNITS.map(U=>{const d=unitDone(U),cur=cu&&cu.n===U.n,n=unitSolved(U);
      return`<li class="card unit ${d?"done":""} ${cur?"current":""}"><button class="unithead" data-u="${U.n}" aria-expanded="false">
        <span class="unum tabular">${U.n}</span><span class="utitle">${esc(U.title)}<span class="small muted" style="display:block;font-weight:400">CS50P week ${U.week}</span></span>
        <span class="pill ${d?"ok":cur?"mid":"todo"}">${d?"done":cur?"up next":n?`${n}/${U.problems.length}`:"not started"}</span></button>
        <div class="unitbody" hidden>${cs50Line(U)}${lessonHTML(U,true)}
          <div class="stack"><h3>Problems</h3><div class="list">${U.problems.map(p=>`<div><span class="l">${esc(p.title)}</span><span class="row" style="gap:8px"><span class="pill ${isSolved(p.id)?"ok":"todo"}">${isSolved(p.id)?"solved":"to do"}</span><button class="btn ghost chip" data-open="${p.id}">Open</button></span></div>`).join("")}</div></div>
          <div class="row"><button class="btn accent" data-quiz="${U.n}">Quick check: ${U.quick.length} questions</button></div><div class="uhost"></div></div></li>`}).join("")}</ol>`;
  host.querySelectorAll(".unithead").forEach(b=>b.onclick=()=>{const body=b.nextElementSibling;const open=body.hidden;body.hidden=!open;b.setAttribute("aria-expanded",String(open));if(open)body.classList.add("qin")});
  host.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>openProblem(b.dataset.open,{from:"learn",review:false}));
  host.querySelectorAll("[data-quiz]").forEach(b=>b.onclick=()=>{const U=unitOf(Number(b.dataset.quiz));const uh=b.closest(".unitbody").querySelector(".uhost");
    quickRunner(uh,U.quick.map((_,i)=>U.n+"."+i),{title:`Unit ${U.n} quick check`,onDone:(r,n)=>{uh.innerHTML=`<div class="card stack qin"><h3>Unit ${U.n} quick check</h3><div class="big tabular">${r}/${n}</div><p class="muted">${r===n?"All correct.":"Misses will come back in your daily warm-ups."}</p></div>`}})});
}
function renderPractice(){
  const host=$("#v-practice");const solvedIds=Object.keys(S.solved).filter(id=>PROBS[id]);const cu=currentUnit();
  host.innerHTML=`<div class="card stack"><h3>Practice</h3><h2>Extra reps whenever you want them</h2>
      <p class="muted measure">Drill quick questions from one unit, or re-solve a problem from memory. Rewriting a solution from a blank page is one of the fastest ways to make it stick.</p>
      <div class="row"><button class="btn accent" id="memory" ${solvedIds.length?"":"disabled"}>Random problem from memory</button><button class="btn ghost" id="mixed">10 mixed quick questions</button></div>
      <div class="stack"><span class="small muted">Drill one unit:</span><div class="row">${UNITS.map(U=>`<button class="btn ghost chip" data-drill="${U.n}">${U.n}. ${esc(U.title.split(/[:,]/)[0])}</button>`).join("")}</div></div>
    </div><div id="prhost"></div>
    <div class="card stack"><h3>All problems · ${solvedIds.length} of ${TOTAL()} solved</h3>
      ${UNITS.map(U=>`<div class="stack" style="gap:6px"><span class="small"><b>Unit ${U.n}</b> <span class="muted">${esc(U.title)}</span></span><div class="row" style="gap:6px">${U.problems.map(p=>`<button class="btn ghost chip pchip ${isSolved(p.id)?"solved":""}" data-open="${p.id}">${isSolved(p.id)?"✓ ":""}${esc(p.title)}</button>`).join("")}</div></div>`).join("")}</div>`;
  const ph=host.querySelector("#prhost");
  host.querySelectorAll("[data-drill]").forEach(b=>b.onclick=()=>{const U=unitOf(Number(b.dataset.drill));quickRunner(ph,shuffle(U.quick.map((_,i)=>U.n+"."+i)),{title:`Unit ${U.n} drill`,onDone:(r,n)=>{ph.innerHTML=`<div class="card stack qin"><h3>Drill done</h3><div class="big tabular">${r}/${n}</div></div>`}});ph.scrollIntoView({behavior:reduced()?"auto":"smooth",block:"start"})});
  host.querySelector("#mixed").onclick=()=>{const upto=cu?cu.n:UNITS.length;const ids=shuffle(Object.keys(QUICK).filter(id=>QUICK[id].unit<=upto)).slice(0,10);quickRunner(ph,ids,{title:"Mixed",onDone:(r,n)=>{ph.innerHTML=`<div class="card stack qin"><h3>Mixed set done</h3><div class="big tabular">${r}/${n}</div></div>`}});ph.scrollIntoView({behavior:reduced()?"auto":"smooth",block:"start"})};
  host.querySelector("#memory").onclick=()=>{const id=shuffle(solvedIds)[0];if(id)openProblem(id,{from:"practice",review:true})};
  host.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>openProblem(b.dataset.open,{from:"practice",review:false}));
}
function renderProfile(){
  const host=$("#v-profile");const solved=Object.keys(S.solved).filter(id=>PROBS[id]).length;
  let qn=0,qc=0;for(const k in S.quick){qn+=S.quick[k].n;qc+=S.quick[k].c}
  const cells=[];const d=new Date();d.setDate(d.getDate()-34);
  for(let i=0;i<35;i++){const k=d.toLocaleDateString("en-CA");const v=S.days[k];const n=(v?.n||0)+3*(v?.solved||0);cells.push(`<i class="${n>=15?"l3":n>=6?"l2":n>0?"l1":""} ${k===todayKey()?"today":""}" title="${k}: ${v?.solved||0} problems, ${v?.n||0} questions"></i>`);d.setDate(d.getDate()+1)}
  const cu=currentUnit();
  const mq=S.mistakes.filter(m=>(m.kind==="q"?QUICK[m.key]:PROBS[m.key]));
  host.innerHTML=`<div class="grid">
      <div class="card skill"><h3>Problems solved</h3><span class="r tabular">${solved}<span class="muted" style="font-size:15px"> / ${TOTAL()}</span></span><div class="bar"><i style="width:${solved/TOTAL()*100}%"></i></div></div>
      <div class="card skill"><h3>Current unit</h3><span class="r">${cu?cu.n:"✓"}<span class="muted" style="font-size:15px"> / ${UNITS.length}</span></span><span class="small muted">${cu?esc(cu.title):"Course complete"}</span></div>
      <div class="card skill"><h3>Quick questions</h3><span class="r tabular">${qn?Math.round(qc/qn*100)+"%":"–"}</span><span class="small muted">${qn} answered</span></div>
      <div class="card skill"><h3>Streak</h3><span class="r tabular">${streak()}<span class="muted" style="font-size:15px"> days</span></span></div>
    </div>
    <div class="card stack"><h3>Units</h3><div class="list">${UNITS.map(U=>{const n=unitSolved(U);const qs=U.quick.map((_,i)=>S.quick[U.n+"."+i]).filter(Boolean);const a=qs.reduce((x,s)=>x+s.n,0),c=qs.reduce((x,s)=>x+s.c,0);
      return`<div><span class="l">${U.n}. ${esc(U.title)}<span class="bar" style="margin-top:6px;display:block"><i style="width:${n/U.problems.length*100}%"></i></span></span><span class="small muted tabular" style="text-align:right;white-space:nowrap">${n}/${U.problems.length} solved${a?`<br>${Math.round(c/a*100)}% quick`:""}</span></div>`}).join("")}</div></div>
    <div class="card stack"><h3>Last 5 weeks</h3><div class="heat">${cells.join("")}</div></div>
    <div class="card stack"><h3>Review queue · ${mq.length}</h3><div class="list">${mq.length?mq.slice(0,12).map(m=>m.kind==="q"?`<div style="flex-direction:column;align-items:stretch;gap:4px"><span>${esc(QUICK[m.key].q)}</span>${QUICK[m.key].code?`<pre class="codeblock">${esc(QUICK[m.key].code)}</pre>`:""}<span class="small muted">Unit ${QUICK[m.key].unit} quick question · ${m.fixes}/2 fixed</span></div>`:`<div><span class="l">${esc(PROBS[m.key].title)} <span class="small muted">· problem, solve it from memory</span></span><button class="btn ghost chip" data-rev="${m.key}">Solve</button></div>`).join(""):`<div><span class="muted">Nothing to review. Missed quick questions and problems whose solution you viewed show up here and come back in your daily set.</span></div>`}</div></div>
    <div class="card stack"><h3>Your data</h3>
      <p class="muted measure">Progress is saved in this browser only. Copy it to move to another device, or paste it into Claude and ask what to focus on.</p>
      <div class="row"><button class="btn" id="copyp">Copy progress</button><button class="btn ghost" id="impp">Import progress</button><button class="btn ghost" id="resetp">Reset</button></div>
      <div id="pmsg" class="small" aria-live="polite"></div>
      <div id="impbox" hidden class="stack"><label for="imptext" class="small">Paste copied progress</label><textarea id="imptext" rows="4"></textarea><div class="row"><button class="btn" id="impgo">Load it</button></div></div>
      <div id="resetbox" hidden class="row"><span class="small">This deletes all progress and saved code in this browser.</span><button class="btn danger" id="resetgo">Delete my progress</button></div></div>`;
  host.querySelectorAll("[data-rev]").forEach(b=>b.onclick=()=>openProblem(b.dataset.rev,{from:"profile",review:true}));
  const msg=t=>{host.querySelector("#pmsg").textContent=t};
  host.querySelector("#copyp").onclick=async()=>{const drafts={};for(const id in PROBS){const c=lsGet(draftKey(id));if(c&&c!==PROBS[id].starter)drafts[id]=c}
    const txt=JSON.stringify({pythonLearn:1,state:S,drafts});
    try{await navigator.clipboard.writeText(txt);msg("Copied, including your saved code.")}catch(e){const b=host.querySelector("#impbox");b.hidden=false;host.querySelector("#imptext").value=txt;host.querySelector("#imptext").select();msg("Couldn't copy automatically. The text is selected below, so copy it from there.")}};
  host.querySelector("#impp").onclick=()=>{host.querySelector("#impbox").hidden=false;host.querySelector("#imptext").value="";host.querySelector("#imptext").focus()};
  host.querySelector("#impgo").onclick=()=>{try{const j=JSON.parse(host.querySelector("#imptext").value);if(!j.state)throw 0;mergeState(j.state);for(const id in j.drafts||{})lsSet(draftKey(id),j.drafts[id]);DAY=null;save();renderAll();go("profile");$("#pmsg").textContent="Progress loaded."}catch(e){msg("That doesn't look like copied Python Learn progress.")}};
  host.querySelector("#resetp").onclick=()=>{host.querySelector("#resetbox").hidden=false};
  host.querySelector("#resetgo").onclick=()=>{S=blankState();DAY=null;for(const id in PROBS){lsDel(draftKey(id));lsDel(draftKey(id,true))}lsDel("pl_day");save();renderAll();go("profile");$("#pmsg").textContent="Progress reset."};
}
function moveIndicator(){const sel=document.querySelector('nav button[aria-selected="true"]');const ind=$("#navind");if(!sel||!ind){if(ind)ind.style.width="0";return}ind.style.width=sel.offsetWidth+"px";ind.style.transform=`translateX(${sel.offsetLeft-4}px)`}
function showView(v){
  document.querySelectorAll("nav button").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.v===v)));
  [...VIEWS,"problem"].forEach(k=>{const el=$("#v-"+k);const show=k===v;if(show&&el.hidden){el.hidden=false;el.classList.remove("vin");void el.offsetWidth;el.classList.add("vin")}else if(!show)el.hidden=true});
  moveIndicator();
}
function go(v,push=true){
  if(!VIEWS.includes(v))v="daily";LAST_VIEW=v;
  if(v==="daily"){syncDayFromShown();renderDaily()}if(v==="learn")renderLearn();if(v==="practice")renderPractice();if(v==="profile")renderProfile();
  showView(v);if(push)try{history.replaceState(null,"","#"+v)}catch(e){}
}
function back(){go(PROBLEM_CTX&&PROBLEM_CTX.opts.from||LAST_VIEW)}
function route(){const h=(location.hash||"#daily").slice(1);
  if(h.startsWith("p/")&&PROBS[h.slice(2)])openProblem(h.slice(2),{from:LAST_VIEW,review:false});else go(h,false)}
function renderAll(){renderStrip();renderDaily();renderLearn();renderPractice();renderProfile()}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>go(b.dataset.v));
window.addEventListener("resize",moveIndicator);
(async()=>{
  try{mergeState(JSON.parse(lsGet("pl_state")||"null"))}catch(e){}
  try{const d=JSON.parse(lsGet("pl_day")||"null");if(d&&d.date===todayKey())DAY=d}catch(e){}
  try{const r=await fetch("daily.json",{cache:"no-store"});if(r.ok){const j=await r.json();if(j&&j.id&&daysSince(j.id)<=1){DAILY=j;
    for(const p of j.problems||[])if(p&&p.id&&Array.isArray(p.tests)&&!PROBS[p.id]){const U=currentUnit()||UNITS[UNITS.length-1];PROBS[p.id]={hints:[],solution:"",starter:"",...p,unit:U.n}}}}}catch(e){}
  renderAll();route();window.addEventListener("hashchange",route);
  document.body.classList.add("ready");
  setTimeout(()=>{if(PY.state==="idle")pyStart()},1500);
})();
