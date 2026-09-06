export const SITES=[
 {id:'solar',name:'ひかりソーラーパーク',type:'再エネ併設',x:22,y:21,power:250,capacity:1000,price:660,cost:360,weeks:2,research:0,need:'昼の余剰を蓄え、夕方の供給に回したい。',lesson:'発電と利用の時間差を埋める。容量だけでなく充電できる出力も必要。'},
 {id:'factory',name:'みなと精機',type:'工場・ピークカット',x:77,y:21,power:250,capacity:500,price:540,cost:300,weeks:2,research:0,need:'夕方のピークを250kW、2時間抑えたい。',lesson:'250kW×2時間＝500kWhは損失を除いた値。ここでは必要仕様を利用可能容量で設定。'},
 {id:'hospital',name:'みどり総合病院',type:'重要負荷・BCP',x:23,y:43,power:200,capacity:800,price:800,cost:430,weeks:3,research:1,need:'非常時の重要負荷への供給を設計したい。',lesson:'BCPは電池だけでは成立しない。切替・自立運転等の設計が必要。ゲームでは技術投資で対応力を表す。'},
 {id:'data',name:'ベイデータセンター',type:'電源の信頼性',x:80,y:57,power:500,capacity:1000,price:950,cost:520,weeks:3,research:1,need:'安定稼働を支える電源・運用支援を整えたい。',lesson:'UPS等の設計と常用ESSは区別が必要。この案件では電源システム対応力を技術投資で簡略化。'},
 {id:'grid',name:'湾岸蓄電プロジェクト',type:'系統用ESS',x:27,y:72,power:500,capacity:2000,price:1200,cost:690,weeks:3,research:2,need:'充放電して電力市場へ参加する蓄電所をつくりたい。',lesson:'電力市場の収益を得るのは蓄電所の運用側。このゲームの自社収益は設備販売と保守の対価。'}
];
export const PACKAGES=[{name:'Compact',power:250,capacity:1000,factor:1},{name:'Power',power:500,capacity:1000,factor:1.2},{name:'Long',power:500,capacity:2000,factor:1.5}];
export const NEWS=[
 ['地域のESS相談が動き出す','まず顧客を調査し、用途・仕様・提供範囲をそろえよう。'],
 ['納期も、顧客価値の一部','設計・施工の同時進行枠は技術チーム数まで。営業の勢いだけでは増やせない。'],
 ['来週、部材価格が上がる','第4週の新規契約は原価が20%増。今週までの契約は固定原価。'],
 ['部材価格が一時上昇','今週の新規契約原価は20%増。技術投資による標準化は原価低減にも効く。'],
 ['導入後の支援に注目','保守付き案件は週次の契約収入が発生。人員が足りなければ設備の信頼性が低下する。'],
 ['来週の高温に備えよう','第7週は稼働済み全拠点の信頼性が追加で12低下。点検で備えられる。'],
 ['高温で設備への負担が増加','稼働拠点の信頼性が追加で12低下。50未満ではサービス収入が止まり、顧客の信頼も下がる。'],
 ['複数拠点の管理が課題に','保守チーム1つで2拠点を担当。増やすほど固定費も増える。'],
 ['来週、部材価格が再び上がる','第10週の新規契約は原価20%増。将来の費用を見ながら計画しよう。'],
 ['部材価格が再上昇','今週の契約原価20%増。受注量だけでなく粗利と手元資金を確認。'],
 ['期末の引渡しが近づく','売上計上と入金は別。引渡しの翌週に代金を回収する。'],
 ['12週間の経営を振り返る','稼働3件以上・顧客信頼70以上・現金を残す。この3つが目標。']
];
export type Project={id:string;status:'open'|'surveyed'|'building'|'operating';pack:number;service:boolean;price:number;cost:number;remaining:number;health:number};
export type Report={week:number;revenue:number;cogs:number;expense:number;profit:number;cash:number;receivable:number;wip:number;equity:number;notes:string[]};
export type Game={version:1;week:number;cash:number;trust:number;engineers:number;serviceTeams:number;research:number;actions:number;projects:Project[];receivables:{due:number;amount:number}[];profit:number;currentExpense:number;reports:Report[];log:string[];ended:boolean};
export type Action={type:'survey';id:string}|{type:'contract';id:string;pack:number;service:boolean;pricing:number}|{type:'hire';team:'engineering'|'service'}|{type:'research'}|{type:'maintain';id:string}|{type:'week'};
export function initialGame():Game{return {version:1,week:1,cash:1400,trust:55,engineers:2,serviceTeams:1,research:0,actions:2,projects:SITES.map(s=>({id:s.id,status:'open',pack:0,service:true,price:0,cost:0,remaining:0,health:100})),receivables:[],profit:0,currentExpense:0,reports:[],log:['第1週：1400万円でESS事業をスタート。'],ended:false}}
export function fixedCost(g:Game){return 18+g.engineers*8+g.serviceTeams*7}
export function quote(g:Game,id:string,pack:number,service:boolean,pricing:number){const site=SITES.find(s=>s.id===id),p=PACKAGES[pack];if(!site||!p||![0,1,2].includes(pricing))throw Error('提案条件を確認してください');const minPack=PACKAGES.findIndex(p=>p.power>=site.power&&p.capacity>=site.capacity);const cost=Math.round(site.cost*p.factor/PACKAGES[minPack].factor*(1-g.research*.04)*([4,10].includes(g.week)?1.2:1));const price=Math.round((site.price+(service?40:0))*[.9,1,1.1][pricing]);return {cost,price,margin:price-cost,fit:p.power>=site.power&&p.capacity>=site.capacity,accepted:pricing<2||g.trust>=65||g.research>=2}}
export function applyAction(state:Game,a:Action):Game{
 if(state.ended)throw Error('今期は終了しています。新しく始めると再挑戦できます。');
 const g:Game=structuredClone(state);const log=(t:string)=>{g.log.unshift(`第${g.week}週：${t}`);g.log=g.log.slice(0,40)};
 const spend=(n:number)=>{if(g.cash<n)throw Error('手元資金が不足しています');g.cash-=n};
 const expense=(n:number)=>{spend(n);g.currentExpense+=n};
 if(a.type!=='week'&&g.actions<1)throw Error('今週の意思決定枠を使い切りました。次の週へ進んでください。');
 const p='id'in a?g.projects.find(p=>p.id===a.id):undefined;
 if('id'in a&&!p)throw Error('案件が見つかりません');
 if(a.type==='survey'){if(p!.status!=='open')throw Error('この案件は調査済みです');expense(10);p!.status='surveyed';log(`${SITES.find(s=>s.id===p!.id)!.name}を調査。要求仕様を把握。`)}
 else if(a.type==='contract'){
  if(p!.status!=='surveyed')throw Error('先に顧客調査を行ってください');const site=SITES.find(s=>s.id===a.id)!;const q=quote(g,a.id,a.pack,a.service,a.pricing);
  if(!q.fit)throw Error('必要な出力・容量を満たしていません');if(g.research<site.research)throw Error(`技術レベル${site.research}が必要です`);
  if(!q.accepted)throw Error('上乗せ価格の根拠が不足。信頼65以上または技術2以上が必要です');
  if(g.projects.filter(p=>p.status==='building').length>=g.engineers)throw Error('設計・施工の枠がいっぱいです');spend(q.cost);
  Object.assign(p!,{status:'building',pack:a.pack,service:a.service,price:q.price,cost:q.cost,remaining:site.weeks});log(`${site.name}を受注。原価${q.cost}を先払い、引渡し時に売上${q.price}を計上。`)
 }else if(a.type==='hire'){const key=a.team==='engineering'?'engineers':'serviceTeams';if(g[key]>=4)throw Error('チーム数は最大4です');expense(50);g[key]++;log(`${a.team==='engineering'?'技術':'保守'}チームを増員。翌決算から人件費が増加。`)}
 else if(a.type==='research'){if(g.research>=3)throw Error('技術投資は最大レベルです');expense(100);g.research++;log(`技術レベル${g.research}。対応可能案件と原価効率が向上。`)}
 else if(a.type==='maintain'){if(p!.status!=='operating')throw Error('稼働中の案件を選んでください');if(p!.health>=100)throw Error('この拠点の信頼性は十分です');expense(20);p!.health=Math.min(100,p!.health+30);g.trust=Math.min(100,g.trust+2);log(`${SITES.find(s=>s.id===p!.id)!.name}を点検。信頼性を30回復。`)}
 else if(a.type==='week'){
  let revenue=0,cogs=0;let expense=g.currentExpense+fixedCost(g);const notes:string[]=[];
  for(const r of g.receivables.filter(r=>r.due<=g.week)){g.cash+=r.amount;notes.push(`売掛金${r.amount}万円を回収`)}g.receivables=g.receivables.filter(r=>r.due>g.week);
  const operating=g.projects.filter(p=>p.status==='operating');const shortage=operating.length>g.serviceTeams*2;
  for(const p of operating){p.health=Math.max(0,p.health-(shortage?14:4)-(g.week===7?12:0));const income=p.service&&p.health>=50?9:0;revenue+=income;g.cash+=income;expense+=3;g.cash-=3;if(p.health<50){g.trust=Math.max(0,g.trust-6);notes.push(`${SITES.find(s=>s.id===p.id)!.name}の信頼性低下。保守契約収入が停止。`)}}
  for(const p of g.projects.filter(p=>p.status==='building')){p.remaining--;if(p.remaining===0){p.status='operating';revenue+=p.price;cogs+=p.cost;g.receivables.push({due:g.week+1,amount:p.price});g.trust=Math.min(100,g.trust+7);notes.push(`${SITES.find(s=>s.id===p.id)!.name}を引渡し。売上${p.price}万円、入金は翌週。`)}}
  g.cash-=fixedCost(g);const profit=revenue-cogs-expense;g.profit+=profit;const receivable=g.receivables.reduce((n,r)=>n+r.amount,0),wip=g.projects.filter(p=>p.status==='building').reduce((n,p)=>n+p.cost,0);
  g.reports.push({week:g.week,revenue,cogs,expense,profit,cash:g.cash,receivable,wip,equity:1400+g.profit,notes});g.currentExpense=0;log(`週次決算：売上${revenue}、利益${profit}、現金${g.cash}万円。`);notes.forEach(log);
  g.ended=g.week===12||g.cash<0;if(!g.ended)g.week++;g.actions=2;return g;
 }
 g.actions--;return g;
}
export function validSave(v:unknown):v is Game{if(!v||typeof v!=='object')return false;const g=v as Game;return g.version===1&&Number.isInteger(g.week)&&g.week>=1&&g.week<=12&&Number.isFinite(g.cash)&&Number.isFinite(g.trust)&&g.trust>=0&&g.trust<=100&&Number.isInteger(g.actions)&&g.actions>=0&&g.actions<=2&&Number.isInteger(g.engineers)&&g.engineers>=1&&g.engineers<=4&&Number.isInteger(g.serviceTeams)&&g.serviceTeams>=1&&g.serviceTeams<=4&&Number.isInteger(g.research)&&g.research>=0&&g.research<=3&&Number.isFinite(g.profit)&&Number.isFinite(g.currentExpense)&&typeof g.ended==='boolean'&&Array.isArray(g.projects)&&g.projects.length===5&&SITES.every(s=>g.projects.some(p=>p.id===s.id))&&g.projects.every(p=>['open','surveyed','building','operating'].includes(p.status)&&[p.pack,p.price,p.cost,p.remaining,p.health].every(Number.isFinite)&&p.health>=0&&p.health<=100&&typeof p.service==='boolean'&&p.pack>=0&&p.pack<3)&&Array.isArray(g.receivables)&&g.receivables.every(r=>Number.isFinite(r.due)&&Number.isFinite(r.amount))&&Array.isArray(g.reports)&&g.reports.length<=12&&g.reports.every(r=>[r.week,r.revenue,r.cogs,r.expense,r.profit,r.cash,r.receivable,r.wip,r.equity].every(Number.isFinite)&&Array.isArray(r.notes)&&r.notes.every(n=>typeof n==='string'))&&Array.isArray(g.log)&&g.log.every(l=>typeof l==='string')}

