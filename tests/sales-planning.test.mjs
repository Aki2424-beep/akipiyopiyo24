import test from 'node:test';
import assert from 'node:assert/strict';
import {initialGame,applyAction,quote,validSave,hydrateGame} from '../lib/ess-game.ts';
const week=g=>applyAction(g,{type:'week'});
const plan=(g,task,choice,extra={})=>applyAction(g,{type:'planning',task,choice,...extra});
function balance(g){assert.equal(g.cash+g.receivables.reduce((n,r)=>n+r.amount,0)+g.projects.filter(p=>p.status==='building').reduce((n,p)=>n+p.cost,0),1400+g.profit-g.currentExpense);assert(validSave(g))}
test('planning has separate weekly capacity and invalid choices do not spend cash',()=>{
 let g=initialGame();const before=structuredClone(g);assert.throws(()=>plan(g,'competition','same-scope'));assert.deepEqual(g,before);
 g=plan(g,'market','industrial');assert.equal(g.actions,2);assert.equal(g.cash,1380);assert.throws(()=>plan(g,'market','overseas'),/企画枠/);balance(g);
 g=week(g);const snapshot=structuredClone(g);assert.throws(()=>plan(g,'competition','price-only'));assert.deepEqual(g,snapshot);g=plan(g,'competition','same-scope');balance(g);
 g=plan(week(g),'campaign','industrial');g.trust=55;assert(quote(g,'factory',0,true,2).accepted);assert(!quote(g,'factory',0,false,2).accepted);const cash=g.cash;g=applyAction(g,{type:'survey',id:'factory'});assert.equal(g.cash,cash);balance(g);
});
test('product and EPC decisions affect future quotes and preserve contracted specifications',()=>{
 let g=initialGame();g.planning.markets=['industrial'];g.planning.competition=true;const base=quote(g,'factory',0,true,1);
 g=plan(g,'product','lean');assert.equal(quote(g,'factory',0,true,1).cost,Math.round(base.cost*.92));
 g=applyAction(g,{type:'survey',id:'factory'});g=applyAction(g,{type:'contract',id:'factory',pack:0,service:true,pricing:1});const cost=g.projects[1].cost;
 g=plan(week(g),'partner','epc');assert.equal(quote(g,'solar',0,true,1).weeks,1);assert.equal(g.projects[1].cost,cost);balance(g);
});
test('overseas gates lead to a deliverable contract and two-week receivable, with reconciled accounts',()=>{
 let g=initialGame();assert.equal(quote(g,'overseas',1,true,1).gates.length,4);
 g=plan(g,'market','overseas');g=applyAction(g,{type:'research'});g=applyAction(g,{type:'survey',id:'overseas'});
 g=plan(week(g),'partner','overseas');g=plan(week(g),'policy','overseas');g=week(g);assert.throws(()=>plan(g,'international','price-only'));g=plan(g,'international','written');
 assert.equal(quote(g,'overseas',1,true,1).gates.length,0);g=applyAction(g,{type:'contract',id:'overseas',pack:1,service:true,pricing:1});balance(g);
 for(let i=0;i<4;i++){g=week(g);balance(g)}
 assert.equal(g.projects.at(-1).status,'operating');assert.equal(g.receivables.length,1);g=week(g);assert.equal(g.receivables.length,1);balance(g);g=week(g);assert.equal(g.receivables.length,0);balance(g);
});
test('legacy five-project saves migrate without losing progress and planning goals are validated',()=>{
 const old=initialGame();delete old.planning;old.projects.pop();old.cash=1234;assert(validSave(old));const migrated=hydrateGame(old);assert.equal(migrated.cash,1234);assert.equal(migrated.projects.length,6);assert.equal(migrated.planning.moves,1);
 let g=initialGame();g.planning.markets=['overseas'];g.planning.competition=true;assert.throws(()=>plan(g,'plan','overseas',{count:2}));g=plan(g,'plan','overseas',{count:1});g=plan(week(g),'review','capacity');assert.equal(g.planning.reviews,1);balance(g);
});
