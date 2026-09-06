export type Config = {solar:number; demand:number; capacity:number; power:number; initialSoc:number; cloudy:boolean};
export type Sample = {hour:number; solar:number; demand:number; charge:number; discharge:number; grid:number; curtailed:number; energyStart:number; energyEnd:number; loss:number; baselineGrid:number; baselineCurtailed:number};
export const DEFAULT:Config={solar:900,demand:420,capacity:1600,power:500,initialSoc:30,cloudy:false};
export const DT=0.25;
export const EFFICIENCY=0.95;
export function dispatch(solar:number,demand:number,energy:number,c:Config):Omit<Sample,'hour'>{
 const energyStart=energy;
 const surplus=Math.max(0,solar-demand),deficit=Math.max(0,demand-solar);
 const charge=Math.min(surplus,c.power,Math.max(0,c.capacity-energy)/(EFFICIENCY*DT));
 const discharge=Math.min(deficit,c.power,Math.max(0,energy)*EFFICIENCY/DT);
 const energyEnd=Math.max(0,Math.min(c.capacity,energy+charge*EFFICIENCY*DT-discharge/EFFICIENCY*DT));
 const loss=(charge*(1-EFFICIENCY)+discharge*(1/EFFICIENCY-1))*DT;
 return {solar,demand,charge,discharge,grid:deficit-discharge,curtailed:surplus-charge,energyStart,energyEnd,loss,baselineGrid:deficit,baselineCurtailed:surplus};
}
export function simulate(c:Config):Sample[]{
 if(!Object.values(c).every(v=>typeof v==='boolean'||Number.isFinite(v))||c.capacity<0||c.power<0||c.solar<0||c.demand<0||c.initialSoc<0||c.initialSoc>100)throw Error('Invalid simulation settings');
 let energy=c.capacity*c.initialSoc/100;
 return Array.from({length:96},(_,i)=>{
  const hour=i*DT;
  const daylight=Math.max(0,Math.sin(Math.PI*(hour+DT/2-6)/12));
  const cloud=c.cloudy&&hour>=10&&hour<14?0.25:1;
  const solar=c.solar*daylight*cloud;
  const demand=c.demand*(0.65+0.25*Math.exp(-(((hour-9)/3)**2))+0.65*Math.exp(-(((hour-19)/2.5)**2)));
  const sample=dispatch(solar,demand,energy,c);energy=sample.energyEnd;
  return {hour,...sample};
 });
}
export function totals(samples:Sample[]){return samples.reduce((a,s)=>({grid:a.grid+s.grid*DT,baselineGrid:a.baselineGrid+s.baselineGrid*DT,curtailed:a.curtailed+s.curtailed*DT,baselineCurtailed:a.baselineCurtailed+s.baselineCurtailed*DT,loss:a.loss+s.loss}),{grid:0,baselineGrid:0,curtailed:0,baselineCurtailed:0,loss:0})}

