export const SITES=[
 {id:'solar',name:'ひかりソーラーパーク',type:'再エネ併設',x:22,y:21,power:250,capacity:1000,price:660,cost:360,weeks:2,research:0,need:'昼の余剰を蓄え、夕方の供給に回したい。',lesson:'発電と利用の時間差を埋める。容量だけでなく充電できる出力も必要。'},
 {id:'factory',name:'みなと精機',type:'工場・ピークカット',x:77,y:21,power:250,capacity:500,price:540,cost:300,weeks:2,research:0,need:'夕方のピークを250kW、2時間抑えたい。',lesson:'250kW×2時間＝500kWhは損失を除いた値。ここでは必要仕様を利用可能容量で設定。'},
 {id:'hospital',name:'みどり総合病院',type:'重要負荷・BCP',x:23,y:43,power:200,capacity:800,price:800,cost:430,weeks:3,research:1,need:'非常時の重要負荷への供給を設計したい。',lesson:'BCPは電池だけでは成立しない。切替・自立運転等の設計が必要。ゲームでは技術投資で対応力を表す。'},
 {id:'data',name:'ベイデータセンター',type:'電源の信頼性',x:80,y:57,power:500,capacity:1000,price:950,cost:520,weeks:3,research:1,need:'安定稼働を支える電源・運用支援を整えたい。',lesson:'UPS等の設計と常用ESSは区別が必要。この案件では電源システム対応力を技術投資で簡略化。'},
 {id:'grid',name:'湾岸蓄電プロジェクト',type:'系統用ESS',x:27,y:72,power:500,capacity:2000,price:1200,cost:690,weeks:3,research:2,need:'充放電して電力市場へ参加する蓄電所をつくりたい。',lesson:'電力市場の収益を得るのは蓄電所の運用側。このゲームの自社収益は設備販売と保守の対価。'},
 {id:'overseas',name:'海外・現地工場案件',type:'海外定置用ESS',x:90,y:90,power:500,capacity:1000,price:1050,cost:550,weeks:3,research:1,need:'現地の工場へESSを導入。保証・支払・現地保守を明確にしたい。',lesson:'輸出価格だけでなく、通貨・回収・受入・責任分担を合意する。ここでは国や実制度を特定しない仮想市場。'}
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
export type Project={id:string;status:'open'|'surveyed'|'building'|'operating';pack:number;service:boolean;price:number;cost:number;remaining:number;health:number;design?:string};
export type Report={week:number;revenue:number;cogs:number;expense:number;profit:number;cash:number;receivable:number;wip:number;equity:number;notes:string[]};
export type Game={planning?:Planning;version:1;week:number;cash:number;trust:number;engineers:number;serviceTeams:number;research:number;actions:number;projects:Project[];receivables:{due:number;amount:number}[];profit:number;currentExpense:number;reports:Report[];log:string[];ended:boolean};
export type Action={type:'survey';id:string}|{type:'contract';id:string;pack:number;service:boolean;pricing:number}|{type:'hire';team:'engineering'|'service'}|{type:'research'}|{type:'maintain';id:string}|{type:'week'}|PlanningAction;
export function initialGame():Game{return {planning:initialPlanning(),version:1,week:1,cash:1400,trust:55,engineers:2,serviceTeams:1,research:0,actions:2,projects:SITES.map(s=>({id:s.id,status:'open',pack:0,service:true,price:0,cost:0,remaining:0,health:100})),receivables:[],profit:0,currentExpense:0,reports:[],log:['第1週：1400万円でESS事業をスタート。'],ended:false}}
export function fixedCost(g:Game){return 18+g.engineers*8+g.serviceTeams*7}
export function quote(g:Game,id:string,pack:number,service:boolean,pricing:number){const site=SITES.find(s=>s.id===id),p=PACKAGES[pack];if(!site||!p||![0,1,2].includes(pricing))throw Error('提案条件を確認してください');const minPack=PACKAGES.findIndex(p=>p.power>=site.power&&p.capacity>=site.capacity);const pl=planningOf(g);const segment=segmentOf(id);const cost=Math.round(site.cost*p.factor/PACKAGES[minPack].factor*(1-g.research*.04)*([4,10].includes(g.week)?1.2:1)*(pl.product==='lean'&&segment==='industrial'?.92:1)*(pl.product==='monitor'?1.03:1)*(id==='overseas'?1.08:1))+(pl.partners.includes('epc')?20:0);const price=Math.round((site.price+(service?40:0))*[.9,1,1.1][pricing]);return {cost,price,margin:price-cost,fit:p.power>=site.power&&p.capacity>=site.capacity,weeks:Math.max(1,site.weeks+(id==='overseas'?1:0)-(pl.partners.includes('epc')?1:0)),gates:planningGates(g,id),accepted:pricing<2||g.trust>=65||g.research>=2||(pl.competition&&pl.campaigns.includes(segment)&&service)}}
export function applyAction(state:Game,a:Action):Game{
 if(state.ended)throw Error('今期は終了しています。新しく始めると再挑戦できます。');
 const g:Game=hydrateGame(structuredClone(state));if(a.type==='planning')return applyPlanning(g,a);const log=(t:string)=>{g.log.unshift(`第${g.week}週：${t}`);g.log=g.log.slice(0,40)};
 const spend=(n:number)=>{if(g.cash<n)throw Error('手元資金が不足しています');g.cash-=n};
 const expense=(n:number)=>{spend(n);g.currentExpense+=n};
 if(a.type!=='week'&&g.actions<1)throw Error('今週の意思決定枠を使い切りました。次の週へ進んでください。');
 const p='id'in a?g.projects.find(p=>p.id===a.id):undefined;
 if('id'in a&&!p)throw Error('案件が見つかりません');
 if(a.type==='survey'){if(p!.status!=='open')throw Error('この案件は調査済みです');expense(planningOf(g).campaigns.includes(segmentOf(p!.id))?0:10);p!.status='surveyed';log(`${SITES.find(s=>s.id===p!.id)!.name}を調査。要求仕様を把握。`)}
 else if(a.type==='contract'){
  if(p!.status!=='surveyed')throw Error('先に顧客調査を行ってください');const site=SITES.find(s=>s.id===a.id)!;const q=quote(g,a.id,a.pack,a.service,a.pricing);
  if(q.gates.length)throw Error('未完了：'+q.gates.join('・'));if(!q.fit)throw Error('必要な出力・容量を満たしていません');if(g.research<site.research)throw Error(`技術レベル${site.research}が必要です`);
  if(!q.accepted)throw Error('上乗せ価格の根拠が不足。信頼65以上または技術2以上が必要です');
  if(g.projects.filter(p=>p.status==='building').length>=g.engineers)throw Error('設計・施工の枠がいっぱいです');spend(q.cost);
  Object.assign(p!,{status:'building',pack:a.pack,service:a.service,price:q.price,cost:q.cost,remaining:q.weeks,design:planningOf(g).product});log(`${site.name}を受注。原価${q.cost}を先払い、引渡し時に売上${q.price}を計上。`)
 }else if(a.type==='hire'){const key=a.team==='engineering'?'engineers':'serviceTeams';if(g[key]>=4)throw Error('チーム数は最大4です');expense(50);g[key]++;log(`${a.team==='engineering'?'技術':'保守'}チームを増員。翌決算から人件費が増加。`)}
 else if(a.type==='research'){if(g.research>=3)throw Error('技術投資は最大レベルです');expense(100);g.research++;log(`技術レベル${g.research}。対応可能案件と原価効率が向上。`)}
 else if(a.type==='maintain'){if(p!.status!=='operating')throw Error('稼働中の案件を選んでください');if(p!.health>=100)throw Error('この拠点の信頼性は十分です');expense(20);p!.health=Math.min(100,p!.health+30);g.trust=Math.min(100,g.trust+2);log(`${SITES.find(s=>s.id===p!.id)!.name}を点検。信頼性を30回復。`)}
 else if(a.type==='week'){
  let revenue=0,cogs=0;let expense=g.currentExpense+fixedCost(g);const notes:string[]=[];
  for(const r of g.receivables.filter(r=>r.due<=g.week)){g.cash+=r.amount;notes.push(`売掛金${r.amount}万円を回収`)}g.receivables=g.receivables.filter(r=>r.due>g.week);
  const operating=g.projects.filter(p=>p.status==='operating');const shortage=operating.length>g.serviceTeams*2;
  for(const p of operating){p.health=Math.max(0,p.health-Math.max(0,(shortage?14:4)-(p.design==='monitor'?2:0))-(g.week===7?12:0));const income=p.service&&p.health>=50?9:0;revenue+=income;g.cash+=income;expense+=3;g.cash-=3;if(p.health<50){g.trust=Math.max(0,g.trust-6);notes.push(`${SITES.find(s=>s.id===p.id)!.name}の信頼性低下。保守契約収入が停止。`)}}
  for(const p of g.projects.filter(p=>p.status==='building')){p.remaining--;if(p.remaining===0){p.status='operating';revenue+=p.price;cogs+=p.cost;g.receivables.push({due:g.week+(p.id==='overseas'?2:1),amount:p.price});g.trust=Math.min(100,g.trust+7);notes.push(`${SITES.find(s=>s.id===p.id)!.name}を引渡し。売上${p.price}万円、入金は${p.id==='overseas'?'2週後':'翌週'}。`)}}
  g.cash-=fixedCost(g);const profit=revenue-cogs-expense;g.profit+=profit;const receivable=g.receivables.reduce((n,r)=>n+r.amount,0),wip=g.projects.filter(p=>p.status==='building').reduce((n,p)=>n+p.cost,0);
  g.reports.push({week:g.week,revenue,cogs,expense,profit,cash:g.cash,receivable,wip,equity:1400+g.profit,notes});g.currentExpense=0;log(`週次決算：売上${revenue}、利益${profit}、現金${g.cash}万円。`);notes.forEach(log);
  g.ended=g.week===12||g.cash<0;if(!g.ended)g.week++;g.actions=2;g.planning!.moves=1;return g;
 }
 g.actions--;return g;
}
export function validSave(v:unknown):v is Game{if(!v||typeof v!=='object')return false;const g=v as Game;return g.version===1&&Number.isInteger(g.week)&&g.week>=1&&g.week<=12&&Number.isFinite(g.cash)&&Number.isFinite(g.trust)&&g.trust>=0&&g.trust<=100&&Number.isInteger(g.actions)&&g.actions>=0&&g.actions<=2&&Number.isInteger(g.engineers)&&g.engineers>=1&&g.engineers<=4&&Number.isInteger(g.serviceTeams)&&g.serviceTeams>=1&&g.serviceTeams<=4&&Number.isInteger(g.research)&&g.research>=0&&g.research<=3&&Number.isFinite(g.profit)&&Number.isFinite(g.currentExpense)&&typeof g.ended==='boolean'&&Array.isArray(g.projects)&&[5,6].includes(g.projects.length)&&new Set(g.projects.map(p=>p.id)).size===g.projects.length&&SITES.slice(0,5).every(s=>g.projects.some(p=>p.id===s.id))&&g.projects.every(p=>SITES.some(s=>s.id===p.id)&&(p.design===undefined||['none','lean','monitor'].includes(p.design))&&['open','surveyed','building','operating'].includes(p.status)&&[p.pack,p.price,p.cost,p.remaining,p.health].every(Number.isFinite)&&p.health>=0&&p.health<=100&&typeof p.service==='boolean'&&p.pack>=0&&p.pack<3)&&Array.isArray(g.receivables)&&g.receivables.every(r=>Number.isFinite(r.due)&&Number.isFinite(r.amount))&&Array.isArray(g.reports)&&g.reports.length<=12&&g.reports.every(r=>[r.week,r.revenue,r.cogs,r.expense,r.profit,r.cash,r.receivable,r.wip,r.equity].every(Number.isFinite)&&Array.isArray(r.notes)&&r.notes.every(n=>typeof n==='string'))&&Array.isArray(g.log)&&g.log.every(l=>typeof l==='string')&&(g.planning===undefined||validPlanning(g.planning))}

export const SEGMENTS=[
 {id:'industrial',name:'国内・需要家',demand:'電力ピークと継続運用',evidence:'工場の時系列需要、重要負荷、サービス要望を比較',risk:'BCP用途は切替・自立運転等の設計も必要',sites:['factory','hospital','data']},
 {id:'renewables',name:'国内・再エネ／系統用',demand:'余剰活用と需給調整',evidence:'発電パターン、運用目的、接続条件を整理',risk:'市場取引収益は運用事業者側。制度適合を別途確認',sites:['solar','grid']},
 {id:'overseas',name:'海外・定置用',demand:'現地工場への電源供給',evidence:'顧客要求と現地サービス・受入条件を整理',risk:'通貨・入金・保証・役割分担で条件が変わる',sites:['overseas']}
];
export type Planning={moves:number;markets:string[];competition:boolean;campaigns:string[];product:'none'|'lean'|'monitor';partners:string[];policies:string[];international:boolean;plan:null|{segment:string;count:number};reviews:number;history:string[]};
export type PlanningAction={type:'planning';task:'market'|'competition'|'campaign'|'product'|'partner'|'policy'|'international'|'plan'|'review';choice:string;count?:number};
export function initialPlanning():Planning{return {moves:1,markets:[],competition:false,campaigns:[],product:'none',partners:[],policies:[],international:false,plan:null,reviews:0,history:[]}}
export function planningOf(g:Game):Planning{return g.planning??initialPlanning()}
export function segmentOf(id:string){return SEGMENTS.find(s=>s.sites.includes(id))!.id}
export function planningGates(g:Game,id:string){const p=planningOf(g);return id==='overseas'?[...(p.markets.includes('overseas')?[]:['海外市場調査']),...(p.partners.includes('overseas')?[]:['現地企業との役割分担']),...(p.policies.includes('overseas')?[]:['現地制度・要件確認']),...(p.international?[]:['英文条件の合意'])]:id==='grid'?[...(p.partners.includes('operator')?[]:['運用事業者との連携']),...(p.policies.includes('renewables')?[]:['系統用の制度・要件確認'])]:[]}
export function planningCosts(task:PlanningAction['task']){return ({market:20,competition:20,campaign:30,product:80,partner:40,policy:15,international:25,plan:0,review:0})[task]}
export function applyPlanning(g:Game,a:PlanningAction):Game{
 const p=g.planning??=initialPlanning();if(p.moves<1)throw Error('今週の企画枠は使用済みです。次週に進んでください。');const cost=planningCosts(a.task);if(g.cash<cost)throw Error('企画費用の資金が不足しています');let note='';const validSegment=SEGMENTS.some(s=>s.id===a.choice);
 if(a.task==='market'){if(!validSegment||p.markets.includes(a.choice))throw Error('未調査の市場を選んでください');p.markets.push(a.choice);note=`市場調査：${SEGMENTS.find(s=>s.id===a.choice)!.name}の顧客課題・制度・提供体制を整理。`}
 else if(a.task==='competition'){if(!p.markets.length)throw Error('まず市場を調査してください');if(p.competition)throw Error('競合比較は完了しています');if(a.choice!=='same-scope')throw Error('本体価格だけでなく、工事・保証・保守・納期を同じ範囲で比較してください');p.competition=true;note='競合比較：仕様・価格・保証・納期・サービスをそろえ、差別化の論点を作成。'}
 else if(a.task==='campaign'){if(!validSegment||!p.markets.includes(a.choice))throw Error('調査済み市場に向けて販促を企画してください');if(p.campaigns.includes(a.choice))throw Error('この市場の販促は実施済みです');p.campaigns.push(a.choice);note='用途別の説明会・提案資料を実施。対象市場の未調査顧客の調査費が0に。保守付き提案の上乗せ根拠にも活用。'}
 else if(a.task==='product'){if(!p.competition||!p.markets.length)throw Error('市場調査と競合比較から製品要求を作ってください');if(p.product!=='none')throw Error('今期の製品方針は決定済みです');if(!['lean','monitor'].includes(a.choice))throw Error('製品方針を選んでください');p.product=a.choice as 'lean'|'monitor';note=a.choice==='lean'?'標準化方針を開発と合意。今後の国内需要家案件の原価8%低減。':'監視支援方針を開発・サービスと合意。今後の全案件の原価3%増、稼働後の通常劣化指標を週2改善。'}
 else if(a.task==='partner'){if(!['epc','operator','overseas'].includes(a.choice)||p.partners.includes(a.choice))throw Error('未連携の相手を選んでください');p.partners.push(a.choice);note=a.choice==='epc'?'施工パートナーと工程・範囲を合意。新規案件は工期1週短縮、原価20万円増。':a.choice==='operator'?'運用事業者と責任分担を合意。系統用案件の運用・市場参加は相手側が担う。':'現地企業と施工・保守・問い合わせ窓口を分担。海外案件の提案体制を整備。'}
 else if(a.task==='policy'){if(!validSegment||!p.markets.includes(a.choice))throw Error('市場調査後に、その市場の制度論点を整理してください');if(p.policies.includes(a.choice))throw Error('この市場の制度確認は完了しています');p.policies.push(a.choice);note='技術・法務等と適用要件を確認し、業界団体へ匿名の課題と根拠を整理した意見を提出する想定。制度変更や補助金採択を保証するものではない。'}
 else if(a.task==='international'){if(!p.markets.includes('overseas')||!p.partners.includes('overseas')||!p.policies.includes('overseas'))throw Error('海外市場・現地連携・制度確認を先に行ってください');if(p.international)throw Error('英文条件は確認済みです');if(a.choice!=='written')throw Error('通貨、支払時期、受入条件、保証、現地保守の担当を文書でそろえてください');p.international=true;note='英文の条件表・役割分担を合意。海外案件を提案可能に。原価8%増、工期1週増、引渡し2週後入金の仮定。'}
 else if(a.task==='plan'){if(!validSegment||!p.markets.includes(a.choice)||!p.competition)throw Error('対象市場の調査と競合比較を先に行ってください');if(!Number.isInteger(a.count)||a.count!<1||a.count!>SEGMENTS.find(s=>s.id===a.choice)!.sites.length)throw Error('対象市場の案件数の範囲で目標を設定してください');p.plan={segment:a.choice,count:a.count!};note=`重点市場と稼働目標${a.count}件を設定。販売・技術・保守の実行計画を合わせる。`}
 else if(a.task==='review'){if(!p.plan||!g.reports.length)throw Error('計画を設定し、週次決算後に振り返ってください');if(!['capacity','value'].includes(a.choice))throw Error('改善案を選んでください');p.reviews++;const n=g.projects.filter(s=>s.status==='operating'&&segmentOf(s.id)===p.plan!.segment).length;note=`計画差異：稼働${n}/${p.plan.count}、現金${g.cash}万円。${a.choice==='capacity'?'納期と技術・保守の負荷を確認し、増員・社外連携を検討。':'価格だけでなく提供範囲と粗利を確認し、製品・販促の改善を検討。'}次の実行判断が必要。`}
 else throw Error('企画メニューが見つかりません');
 g.cash-=cost;g.currentExpense+=cost;p.moves--;p.history.unshift(`第${g.week}週：${note}`);p.history=p.history.slice(0,30);g.log.unshift(`第${g.week}週：${note}`);g.log=g.log.slice(0,40);return g;
}
export function hydrateGame(g:Game):Game{return {...g,planning:g.planning??initialPlanning(),projects:SITES.map(s=>g.projects.find(p=>p.id===s.id)??{id:s.id,status:'open',pack:0,service:true,price:0,cost:0,remaining:0,health:100})}}
export function validPlanning(p:unknown):boolean{if(!p||typeof p!=='object')return false;const v=p as Planning;const list=(a:unknown,allowed:string[])=>Array.isArray(a)&&a.every(s=>typeof s==='string'&&allowed.includes(s))&&new Set(a).size===a.length;return [0,1].includes(v.moves)&&list(v.markets,['industrial','renewables','overseas'])&&list(v.campaigns,['industrial','renewables','overseas'])&&list(v.partners,['epc','operator','overseas'])&&list(v.policies,['industrial','renewables','overseas'])&&['none','lean','monitor'].includes(v.product)&&typeof v.competition==='boolean'&&typeof v.international==='boolean'&&Number.isInteger(v.reviews)&&v.reviews>=0&&Array.isArray(v.history)&&v.history.every(s=>typeof s==='string')&&(v.plan===null||(['industrial','renewables','overseas'].includes(v.plan.segment)&&Number.isInteger(v.plan.count)&&v.plan.count>=1&&v.plan.count<=3))}
