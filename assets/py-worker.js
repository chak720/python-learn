/* Runs Python in a Web Worker so a runaway loop can be stopped by terminating the worker. */
"use strict";
const PYODIDE="https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
importScripts(PYODIDE+"pyodide.js");
let run=null;
const ready=(async()=>{
  const py=await loadPyodide({indexURL:PYODIDE});
  const src=await (await fetch("harness.py",{cache:"no-cache"})).text();
  py.runPython(src);
  run=py.globals.get("__pl_run");
  postMessage({type:"ready"});
})().catch(e=>postMessage({type:"fail",error:String(e&&e.message||e)}));
self.onmessage=async e=>{
  const {id,code,tests}=e.data;
  try{await ready;if(!run)throw new Error("Python didn't load");
    const results=tests.map(t=>JSON.parse(run(code,JSON.stringify(t))));
    postMessage({type:"result",id,results});
  }catch(err){postMessage({type:"result",id,error:String(err&&err.message||err)})}
};
