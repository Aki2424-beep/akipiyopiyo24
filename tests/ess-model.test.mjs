import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT,DT,EFFICIENCY,dispatch,simulate,totals} from '../lib/ess-model.ts';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
test('full and empty batteries obey energy and power limits',()=>{
 const full=dispatch(900,100,DEFAULT.capacity,DEFAULT);close(full.charge,0);close(full.curtailed,800);
 const empty=dispatch(0,600,0,DEFAULT);close(empty.discharge,0);close(empty.grid,600);
 const powerLimited=dispatch(900,100,0,{...DEFAULT,power:80});close(powerLimited.charge,80);close(powerLimited.curtailed,720);
 const nearEmpty=dispatch(0,1000,10,DEFAULT);close(nearEmpty.discharge,10*EFFICIENCY/DT);close(nearEmpty.energyEnd,0);
 const nearFull=dispatch(1000,0,DEFAULT.capacity-10,DEFAULT);close(nearFull.charge,10/EFFICIENCY/DT);close(nearFull.energyEnd,DEFAULT.capacity);
});
test('every 15-minute interval conserves energy with efficiency losses',()=>{
 for(const capacity of [0,100,300,1600,4000])for(const power of [0,80,500,1000])for(const initialSoc of [0,30,100])for(const cloudy of [false,true])for(const solar of [0,900]){
 const config={...DEFAULT,capacity,power,initialSoc,cloudy,solar};const samples=simulate(config);assert.equal(samples.length,96);
 let prior=capacity*initialSoc/100;
 for(const s of samples){close(s.energyStart,prior);close(s.solar+s.grid+s.discharge,s.demand+s.charge+s.curtailed);close(s.energyEnd-s.energyStart+s.loss,(s.charge-s.discharge)*DT);assert.ok(s.energyEnd>=-1e-8&&s.energyEnd<=capacity+1e-8);assert.ok(s.charge<=power+1e-8&&s.discharge<=power+1e-8);assert.ok(s.charge*s.discharge===0);assert.ok(s.grid>=0&&s.curtailed>=0);prior=s.energyEnd}
 const t=totals(samples);assert.ok(t.grid<=t.baselineGrid+1e-8);assert.ok(t.curtailed<=t.baselineCurtailed+1e-8);
 if(power===0||capacity===0){close(t.grid,t.baselineGrid);close(t.curtailed,t.baselineCurtailed)}
 }
});
test('cloud scenario reduces only the selected midday solar window',()=>{
 const clear=simulate(DEFAULT),cloud=simulate({...DEFAULT,cloudy:true});for(let i=0;i<96;i++)close(cloud[i].solar,clear[i].solar*(clear[i].hour>=10&&clear[i].hour<14?.25:1));
});
test('invalid physical settings are rejected',()=>{
 for(const invalid of [{capacity:-1},{power:-2},{initialSoc:110},{solar:NaN}])assert.throws(()=>simulate({...DEFAULT,...invalid}));
});

