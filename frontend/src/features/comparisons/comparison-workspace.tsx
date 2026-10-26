"use client";

import { useState } from "react";
import { ArrowRight, FileJson, RefreshCw, ShieldCheck } from "lucide-react";
import { baselineExample, candidateExample } from "./examples";
import { useCompareSpecifications } from "./use-compare-specifications";
import { SpecificationEditor } from "./specification-editor";
import { ComparisonResults } from "./comparison-results";

export function ComparisonWorkspace(){
  const [baseline,setBaseline]=useState(baselineExample); const [candidate,setCandidate]=useState(candidateExample); const [baselineName,setBaselineName]=useState("users-v1.yaml"); const [candidateName,setCandidateName]=useState("users-v1.1.yaml"); const [localError,setLocalError]=useState<string|null>(null);
  const {report,error,isLoading,compare,invalidate,clearError}=useCompareSpecifications();
  const change=(kind:"baseline"|"candidate",value:string,name?:string)=>{invalidate();clearError();setLocalError(null);if(kind==="baseline"){setBaseline(value);if(name)setBaselineName(name)}else{setCandidate(value);if(name)setCandidateName(name)}};
  const submit=()=>{if(!baseline.trim()||!candidate.trim())return setLocalError("Add both a baseline and a candidate specification.");compare({baseline:{fileName:baselineName,content:baseline},candidate:{fileName:candidateName,content:candidate},options:{failOn:"breaking",ignoreRules:[]}})};
  if(report)return <main id="main-content" className="compare-shell"><ComparisonResults report={report} onNew={invalidate}/></main>;
  return <main id="main-content" className="compare-shell"><div className="workspace-heading"><div><span className="kicker">WORKSPACE / NEW COMPARISON</span><h1>Every release starts with a comparison.</h1><p>Add your current contract and the proposed version. We&apos;ll surface the changes that matter.</p><div className="example-line"><span className="tag">Example</span> Users API &nbsp; <span className="mono">1.0.0 → 1.1.0</span></div></div><div className="workspace-actions"><button className="button" onClick={()=>{change("baseline",baselineExample,"users-v1.yaml");change("candidate",candidateExample,"users-v1.1.yaml")}}><FileJson size={16}/> Load example</button><button className="button" onClick={()=>{const bv=baseline,bn=baselineName;change("baseline",candidate,candidateName);change("candidate",bv,bn)}}><RefreshCw size={16}/> Swap specifications</button></div></div>
    {(error||localError)&&<div className="error-banner" role="alert">{error||localError}</div>}
    <div className="editors-grid"><SpecificationEditor label="Baseline" fileName={baselineName} version="1.0.0" value={baseline} onChange={(v,n)=>change("baseline",v,n)} onError={setLocalError}/><SpecificationEditor label="Candidate" fileName={candidateName} version="1.1.0" value={candidate} onChange={(v,n)=>change("candidate",v,n)} onError={setLocalError}/></div>
    <div className="compare-footer"><span><ShieldCheck size={17}/> Designed for stateless comparison. Review our security principles.</span><button className="button button-primary" disabled={isLoading} onClick={submit}>{isLoading?"Comparing specifications…":"Compare Specifications"}<ArrowRight size={17}/></button></div>
  </main>;
}
