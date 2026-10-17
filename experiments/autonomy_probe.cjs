// Deterministic, offline T1 autonomy probe: select a training candidate, don't publish it.
// The optimizer here is a scripted hyperparameter search, not autonomous LLM design.
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8'),source=html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(source);
const elements=new Map(),document={getElementById(id){if(!elements.has(id))elements.set(id,{value:'',disabled:false,textContent:'',click(){}});return elements.get(id)}};
const ctx=vm.createContext({document,console,Float64Array,Math,Number,Set,Map,Array,Error,Blob,URL,Date,setTimeout});
vm.runInContext(source[1]+'\n globalThis.lab={init,trainOne,forward,soft,rng,averageLoss};',ctx,{timeout:5000});
const {init,trainOne,rng,averageLoss}=ctx.lab;
// Fixed, small Japanese-English synthetic corpus. Only the training segment updates weights.
// Validation is a separately authored sequence with the same character set, not exact training positions.
const train='abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc';
const holdout='bcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabca';
const alphabet=new Set([...train]);assert.ok([...holdout].every(ch=>alphabet.has(ch)));
const seeds=[42,73],rates=[0.012,0.035,0.07],steps=380;
function experiment(seed,lr){
 const model=init(train,seed),mapping=new Map(model.vocab.map((c,i)=>[c,i]));
 const tr=[...train].map(c=>mapping.get(c)),val=[...holdout].map(c=>mapping.get(c)),draw=rng(seed+1009);
 const before=averageLoss(model,val);
 for(let step=0;step<steps;step++){
  const t=Math.floor(draw()*(tr.length-3));
  trainOne(model,tr.slice(t,t+3),tr[t+3],lr);
 }
 const after=averageLoss(model,val);
 assert.ok(Number.isFinite(after));
 return {seed,learning_rate:lr,before,after};
}
const results=rates.map(lr=>({learning_rate:lr,mean_holdout:seeds.reduce((sum,seed)=>sum+experiment(seed,lr).after,0)/seeds.length}));
const baseline=results[1],best=results.reduce((a,b)=>b.mean_holdout<a.mean_holdout?b:a);
const outcome={schema:'luminalia-tiny-lm-t1-v1',evidence_type:'synthetic_offline_holdout',training_steps:steps,seeds,training_chars:train.length,holdout_chars:holdout.length,
 baseline, candidates:results,selected:best,improvement_over_baseline:baseline.mean_holdout-best.mean_holdout,
 adoption:'not_authorized',authority_effect:'none',external_effect:'none',
 claims:['scripted hyperparameter selection only','synthetic holdout is not real-world generalization evidence']};
fs.mkdirSync('reports',{recursive:true});
fs.writeFileSync('reports/t1-latest.json',JSON.stringify(outcome,null,2)+'\n');
assert.equal(outcome.adoption,'not_authorized');
console.log(JSON.stringify(outcome));
