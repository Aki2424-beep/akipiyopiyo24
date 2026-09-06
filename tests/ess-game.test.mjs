import test from 'node:test';
import assert from 'node:assert/strict';
import {initialGame,applyAction,quote,validSave,fixedCost} from '../lib/ess-game.ts';
const contract=(id,pack=0)=>({type:'contract',id,pack,service:true,pricing:1});
function balance(g){const ar=g.receivables.reduce((n,r)=>n+r.amount,0),wip=g.projects.filter(p=>p.status==='building').reduce((n,p)=>n+p.cost,0);assert.equal(g.cash+ar+wip,1400+g.profit-g.currentExpense);assert(validSave(JSON.parse(JSON.stringify(g))))}
function act(g,a){const next=applyAction(g,a);balance(next);return next}
test('contract creates WIP, delivery creates receivable, cash arrives following week',()=>{
 let g=initialGame();g=act(g,{type:'survey',id:'solar'});g=act(g,contract('solar'));assert.equal(g.cash,1030);assert.equal(g.profit,0);assert.throws(()=>applyAction(g,{type:'research'}));g=act(g,{type:'week'});assert.equal(g.projects[0].status,'building');g=act(g,{type:'week'});assert.equal(g.projects[0].status,'operating');assert.equal(g.receivables[0].amount,700);const cash=g.cash;g=act(g,{type:'week'});assert.equal(g.cash,cash+700+9-3-fixedCost(g));assert.equal(g.receivables.length,0);
});
test('invalid actions leave original state intact and specification gates hold',()=>{
 let g=initialGame();const before=structuredClone(g);assert.throws(()=>applyAction(g,contract('solar')));assert.deepEqual(g,before);g=act(g,{type:'survey',id:'data'});assert.throws(()=>applyAction(g,contract('data',0)),/出力/);assert.throws(()=>applyAction(g,contract('data',1)),/技術/);assert.throws(()=>applyAction(g,{type:'maintain',id:'data'}));assert.throws(()=>quote(g,'solar',55,true,1));assert.throws(()=>quote(g,'solar',0,true,55));
});
test('capital pressure, pricing and supply news have explicit effects',()=>{
 const g=initialGame();assert.equal(quote(g,'solar',0,true,2).accepted,false);assert.equal(quote({...g,trust:65},'solar',0,true,2).accepted,true);assert.equal(quote({...g,week:4},'solar',0,true,1).cost,432);assert.equal(quote({...g,research:2},'solar',0,true,1).cost,331);assert.equal(quote(g,'solar',2,true,1).price,quote(g,'solar',0,true,1).price);assert.ok(quote(g,'solar',2,true,1).cost>quote(g,'solar',0,true,1).cost);
});
test('a plausible 12-week strategy is winnable, with reconciled accounts every step',()=>{
 let g=initialGame();const plan=[
 [{type:'survey',id:'solar'},contract('solar')],
 [{type:'survey',id:'factory'},contract('factory')],
 [{type:'research'},{type:'survey',id:'hospital'}],
 [contract('hospital'),{type:'hire',team:'service'}],
 [],[],[],[{type:'maintain',id:'solar'}],[],[],[{type:'maintain',id:'factory'}],[]
 ];
 for(const actions of plan){for(const a of actions)g=act(g,a);g=act(g,{type:'week'});assert(g.cash>=0)}
 assert(g.ended);assert.equal(g.reports.length,12);assert.equal(g.projects.filter(p=>p.status==='operating').length,3);assert(g.trust>=70);assert.throws(()=>applyAction(g,{type:'week'}));
 for(let i=0;i<g.reports.length;i++){const r=g.reports[i],p=g.reports[i-1];assert.equal(r.cash-(p?.cash??1400),r.profit-(r.receivable-(p?.receivable??0))-(r.wip-(p?.wip??0)))}
});
test('service overload and low reliability affect income, trust and insolvency ends season',()=>{
 let g=initialGame();g.projects.slice(0,3).forEach(p=>{p.status='operating';p.service=true;p.health=55});g=applyAction(g,{type:'week'});assert.equal(g.projects[0].health,41);assert.equal(g.reports[0].revenue,0);assert.equal(g.trust,37);
 const broke=applyAction({...initialGame(),cash:1},{type:'week'});assert(broke.ended);assert(broke.cash<0);
});
test('damaged or incompatible saves are rejected',()=>{assert(!validSave(null));assert(!validSave({}));assert(!validSave({...initialGame(),week:100}));assert(!validSave({...initialGame(),projects:[]}));assert(!validSave({...initialGame(),version:2}));assert(validSave(initialGame()));});
