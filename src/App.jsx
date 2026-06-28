import React, { useEffect, useMemo, useState } from "react";
import {
  Trophy, Flag, Wrench, Users, DollarSign, Star, Gauge, Building2, Activity,
  Zap, UserPlus, FastForward, Newspaper, Save, RotateCcw, CloudRain,
  ShieldCheck, CircleDot, Flame, Medal, Radio, Timer, Car, Crown, Sparkles,
  Target, Cpu, Handshake, BarChart3, Settings, Clock3, GaugeCircle,
  TrendingUp, AlertTriangle, Coins, RotateCw
} from "lucide-react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const SAVE_KEY = "apexTycoonV11";
const OLD_SAVE_KEY = "apexTycoonV1";
const money = (n) => `${n < 0 ? "-" : ""}$${Math.abs(Math.round(n)).toLocaleString()}`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const uid = () => Math.random().toString(36).slice(2, 10);
const fmt = (sec = 0) => {
  if (!Number.isFinite(sec)) return "--:--.---";
  const m = Math.floor(sec / 60);
  const s = sec - m * 60;
  return `${m}:${s.toFixed(3).padStart(6, "0")}`;
};
const gap = (sec = 0) => sec <= 0.05 ? "Leader" : `+${sec.toFixed(3)}s`;

const CARS = [
  { id:"hatch", name:"Street Hatch", price:22000, tier:1, speed:33, grip:38, reliability:68, render:"compact" },
  { id:"coupe", name:"Club Coupe", price:56000, tier:1, speed:45, grip:48, reliability:62, render:"coupe" },
  { id:"gt4", name:"GT4 Contender", price:135000, tier:2, speed:62, grip:65, reliability:57, render:"gt" },
  { id:"gt3", name:"GT3 Works", price:310000, tier:3, speed:78, grip:80, reliability:51, render:"gt3" },
  { id:"proto", name:"Prototype X", price:760000, tier:4, speed:93, grip:92, reliability:44, render:"prototype" },
];
const SERIES = [
  { id:1, name:"Local Cup", rep:0, races:6, power:38, entry:700, prize:[6000,3300,1800,900,400], fans:250, laps:[14,20] },
  { id:2, name:"Regional GT", rep:80, races:8, power:55, entry:2400, prize:[18000,10000,5800,2600,900], fans:650, laps:[22,32] },
  { id:3, name:"National Championship", rep:210, races:10, power:72, entry:8500, prize:[62000,35000,19000,9000,3500], fans:1600, laps:[34,48] },
  { id:4, name:"World Endurance", rep:430, races:12, power:88, entry:21000, prize:[175000,95000,52000,25000,9000], fans:4200, laps:[50,70] },
];
const TRACKS = [
  { name:"Greenfield Oval", base:66.5, type:"oval", flow:1.02 },
  { name:"Harbor Sprint", base:84.8, type:"street", flow:.97 },
  { name:"Canyon Pass", base:96.2, type:"road", flow:.93 },
  { name:"Sunset Speedway", base:73.4, type:"oval", flow:1.04 },
  { name:"Mountain GP", base:101.6, type:"road", flow:.92 },
  { name:"Velocity Park", base:89.1, type:"circuit", flow:1.0 },
  { name:"Monte Azure", base:98.9, type:"street", flow:.94 },
  { name:"Desert Apex", base:91.8, type:"circuit", flow:.98 },
  { name:"Global Endurance", base:112.5, type:"endurance", flow:.9 },
  { name:"Apex Masters", base:94.4, type:"final", flow:.96 },
];
const WEATHER = [
  { name:"Clear", icon:"☀️", grip:1, reliability:1, lap:0, drama:0.08 },
  { name:"Cloudy", icon:"☁️", grip:.99, reliability:1, lap:.6, drama:0.10 },
  { name:"Light Rain", icon:"🌧️", grip:.91, reliability:.98, lap:3.7, drama:0.18 },
  { name:"Heavy Rain", icon:"⛈️", grip:.82, reliability:.94, lap:8.8, drama:0.28 },
  { name:"Hot Track", icon:"🔥", grip:.96, reliability:.91, lap:2.1, drama:0.20 },
];
const TRAITS = [
  { name:"Aggressive", speed:5, grip:-2, risk:.07, desc:"fast but crash-prone" },
  { name:"Smooth", speed:0, grip:5, risk:-.05, desc:"protects tires" },
  { name:"Rain Master", speed:0, grip:9, risk:-.03, wet:true, desc:"elite in wet weather" },
  { name:"Qualifier", speed:7, grip:0, risk:.02, quali:true, desc:"great over one lap" },
  { name:"Fan Favorite", speed:1, grip:1, risk:0, fans:.18, desc:"boosts fan growth" },
  { name:"Reliable", speed:-1, grip:1, risk:-.09, desc:"rarely makes mistakes" },
];
const SPONSORS = [
  { name:"Redline Energy", req:0, pay:900, bonus:4500, goal:"Finish Top 5", rep:5 },
  { name:"Apex Oil", req:60, pay:2200, bonus:11000, goal:"Finish Top 3", rep:10 },
  { name:"Velocity Bank", req:180, pay:6400, bonus:30000, goal:"Win", rep:20 },
  { name:"Titan Hyperworks", req:390, pay:17000, bonus:85000, goal:"Podium", rep:35 },
];
const TEAMS = ["Ironclad Racing","Crimson Apex","Falcon Wing","Northbound","Stormfront","Obsidian","Aurora Velocity","Pinnacle","Redline Syndicate","Lighthouse Racing"];
const NAMES = ["Jamie Cole","Alex Reyes","Sofia Silva","Kenji Tanaka","Morgan Voss","Priya Park","Marco Russo","Riley Hartman","Nadia Klein","Theo Delgado","Omar Ibrahim","Elena Moreau"];

function driver(seed=0){
  const tr=pick(TRAITS);
  const skill=clamp(Math.round(42+Math.random()*38+seed),38,96);
  const calm=clamp(Math.round(40+Math.random()*42),35,95);
  return {id:uid(),name:pick(NAMES),skill,calm,trait:tr,salary:Math.round(420+skill*13+calm*5),age:18+Math.floor(Math.random()*18),xp:0};
}
function baseGame(){return {
  version:"1.1", cash:85000, week:1, rep:0, fans:300, season:1, raceNo:1,
  championship:[], history:[{week:1,cash:85000}], sponsor:SPONSORS[0], tab:"home",
  hq:{garage:1,rd:0,marketing:0,staff:0},
  cars:[{id:"starter",model:"hatch",name:"Hatchling #1",condition:100,up:{engine:0,tires:0,aero:0,reliability:0},driverId:"starterDriver",paint:"amber"}],
  drivers:[{...driver(),id:"starterDriver",name:"Jamie Cole",skill:50,calm:54,salary:420,trait:TRAITS[5]}],
  candidates:[driver(),driver(),driver()], selected:"starter",
  log:["Apex Tycoon v1.1 installed: lap timing, realistic race HUD, fastest lap bonus, and better visuals."],
  records:{wins:0,podiums:0,poles:0,titles:0,fastestLaps:0},
  lastRace:null,
};}
function migrate(old){
  const fresh = baseGame();
  if(!old || typeof old !== "object") return fresh;
  return {
    ...fresh, ...old, version:"1.1", tab:old.tab || "home",
    sponsor: SPONSORS.find(s=>s.name===old?.sponsor?.name) || old.sponsor || SPONSORS[0],
    hq:{...fresh.hq, ...(old.hq||{})},
    records:{...fresh.records, ...(old.records||{})},
    log:["Apex Tycoon updated to v1.1 Realism + Lap Times.", ...(old.log||[])].slice(0,10),
  };
}
function saveGame(g){ localStorage.setItem(SAVE_KEY, JSON.stringify(g)); }
function loadGame(){
  try{
    const v11 = JSON.parse(localStorage.getItem(SAVE_KEY));
    if(v11) return migrate(v11);
    const old = JSON.parse(localStorage.getItem(OLD_SAVE_KEY));
    return migrate(old);
  }catch{return baseGame()}
}
function title(rep){ if(rep<80)return"Garage Rookie"; if(rep<210)return"Club Principal"; if(rep<430)return"National Contender"; if(rep<800)return"World Class Team"; return"Motorsport Dynasty";}
function carStats(car){
  const m=CARS.find(c=>c.id===car?.model) || CARS[0];
  const up = car?.up || {engine:0,tires:0,aero:0,reliability:0};
  return {
    speed:m.speed+up.engine*8+up.aero*3,
    grip:m.grip+up.tires*8+up.aero*4,
    reliability:clamp(m.reliability+up.reliability*10+(car?.condition||100)*.18,5,99),
    model:m
  };
}
function lapSummary(laps){
  const clean = laps.filter(Number.isFinite);
  const total = clean.reduce((s,v)=>s+v,0);
  return {best:Math.min(...clean), last:clean[clean.length-1], avg:total/clean.length, total};
}
function makeLapSet({track, weather, stats, driver:drv, power, laps, dnf=false, dnfLap=null, player=false}){
  const wet = weather.name.includes("Rain");
  const trait = drv?.trait || {speed:0,grip:0,risk:0};
  const paceScore = power ?? (stats.speed*.45 + stats.grip*.35 + (drv?.skill||50)*.2 + (trait.speed||0) + (trait.grip||0) + (wet&&trait.wet?9:0));
  const calm = drv?.calm || 55;
  const base = track.base + weather.lap - paceScore*.23 + (100-stats.reliability)*.018;
  const arr = [];
  let tireFade = 0;
  for(let i=1;i<=laps;i++){
    tireFade += 0.045 + (weather.name === "Hot Track" ? .045 : 0) + (wet ? .018 : 0);
    const fuelBurn = Math.max(0, (laps-i) * .016);
    const variance = (100-calm)*.018;
    const mistake = Math.random() < clamp(.015 + (100-calm)*.0006 + weather.drama*.035, .01, .12) ? 1.4 + Math.random()*4.6 : 0;
    const pushLap = player && i === laps && !dnf ? -Math.random()*0.6 : 0;
    arr.push(clamp(base + tireFade - fuelBurn + (Math.random()*2-1)*variance + mistake + pushLap, 42, 180));
    if(dnf && dnfLap && i>=dnfLap) break;
  }
  return arr;
}
function upgradeCost(g, car, type){
  const model = CARS.find(c=>c.id===car.model) || CARS[0];
  const lvl = car.up[type];
  if(lvl >= 5) return null;
  const pacing = 1.95;
  return Math.round((model.price*.085)*(lvl+1)*(1.52**lvl)*pacing*(1-g.hq.rd*.055));
}
function repairCost(g, car){
  const model = CARS.find(c=>c.id===car.model) || CARS[0];
  const missing = 100 - car.condition;
  if(missing <= 0) return 0;
  return Math.round(model.price * .0042 * missing * (1-g.hq.staff*.025));
}

function Stat({label,value,max=100,icon:Icon}){return <div className="stat"><div><span>{Icon&&<Icon size={13}/>} {label}</span><b>{Math.round(value)}</b></div><i><em style={{width:`${clamp(value/max*100,0,100)}%`}}/></i></div>}
function Card({children, className=""}){return <section className={`card ${className}`}>{children}</section>}
function Metric({icon:Icon,label,value}){return <div className="metric">{Icon&&<Icon size={14}/>}<span>{label}</span><b>{value}</b></div>}
function CarRender({type="compact",weather="Clear",paint="amber",damage=0}){return <div className={`scene ${weather.includes("Rain")?"rain":""} ${weather==="Hot Track"?"heat":""}`}><div className="garageLights"/><div className="backWall"><span/><span/><span/></div><div className="floorGrid"/><div className={`carRender ${type} ${paint}`} style={{filter: damage>55?"brightness(.8) saturate(.8)":""}}><span className="shadow"/><span className="body"/><span className="hood"/><span className="roof"/><span className="windshield"/><span className="splitter"/><span className="wing"/><span className="wheel w1"/><span className="wheel w2"/><span className="brake b1"/><span className="brake b2"/><span className="glow"/>{damage>35&&<span className="damage"/>}</div><div className="toolbox"/><div className="lift"/><div className="tireStack"/></div>}
function Header({g,setG}){return <header><div className="brand"><div className="logo"><Flag size={18}/></div><div><h1>Apex Tycoon</h1><p>{title(g.rep)} • Season {g.season}</p></div></div><div className="week"><small>WEEK</small><b>{g.week}</b></div><div className="pills"><div><DollarSign size={14}/><span>{money(g.cash)}</span></div><div><Trophy size={14}/><span>{g.rep} REP</span></div><div><Star size={14}/><span>{g.fans.toLocaleString()}</span></div></div><nav>{[["home",Gauge],["garage",Wrench],["drivers",Users],["race",Flag],["hq",Building2],["stats",BarChart3]].map(([id,Icon])=><button key={id} onClick={()=>setG({...g,tab:id})} className={g.tab===id?"on":""}><Icon size={15}/>{id}</button>)}</nav></header>}

export default function App(){
 const [g,setG]=useState(loadGame); const [race,setRace]=useState(null); const [anim,setAnim]=useState(0);
 useEffect(()=>saveGame(g),[g]);
 useEffect(()=>{ if(!race||race.phase!=="live")return; const t=setInterval(()=>setAnim(v=>{ if(v>=100){clearInterval(t); setRace(r=>({...r,phase:"result"})); return 100} return v+1.8+Math.random()*2.4}),140); return()=>clearInterval(t)},[race]);
 const selected=g.cars.find(c=>c.id===g.selected)||g.cars[0]; const selectedDriver=g.drivers.find(d=>d.id===selected?.driverId); const series=SERIES.slice().reverse().find(s=>g.rep>=s.rep)||SERIES[0]; const slots=1+g.hq.garage;
 const addLog=(m)=>setG(x=>({...x,log:[m,...x.log].slice(0,10)}));
 function simRace(){
  if(!selected||!selectedDriver){addLog("Assign a driver before racing.");return}
  if(g.cash<series.entry){addLog("Not enough cash for entry fee.");return}
  const weather=pick(WEATHER), track=pick(TRACKS);
  const laps = Math.round(series.laps[0] + Math.random()*(series.laps[1]-series.laps[0]));
  const st=carStats(selected); const wet=weather.name.includes("Rain"); const trait=selectedDriver.trait || TRAITS[5];
  const qualiPower=st.speed*.45+st.grip*.25+selectedDriver.skill*.3+(trait.quali?8:0)+(wet&&trait.wet?5:0)+(Math.random()*12-6);
  const opponents=Array.from({length:9},(_,i)=>({id:uid(),name:TEAMS[i],team:true,stats:{speed:series.power+(Math.random()*14-7),grip:series.power+(Math.random()*14-7),reliability:clamp(series.power+20+Math.random()*18,45,98)},driver:driver(series.id*3),power:series.power+(Math.random()*22-11)}));
  const qPlayerLap = clamp(track.base + weather.lap - qualiPower*.25 + Math.random()*1.2, 42, 180);
  const grid=[{id:"player",name:`${selected.name} / ${selectedDriver.name}`,player:true,qLap:qPlayerLap},...opponents.map(o=>({...o,qLap:clamp(track.base + weather.lap - (o.power+o.driver.skill*.12)*.24 + Math.random()*1.6,42,180)}))].sort((a,b)=>a.qLap-b.qLap);
  const pole=grid[0].player; const startPos=grid.findIndex(f=>f.player)+1;
  let playerPower=st.speed*.34+st.grip*.33*weather.grip+selectedDriver.skill*.21+selectedDriver.calm*.12+(trait.speed||0)+(trait.grip||0)+(wet&&trait.wet?12:0)+(Math.random()*15-7.5);
  const risk=clamp(.055+weather.drama+(trait.risk||0)+(100-st.reliability)*.0054,0,.42);
  const dnf=Math.random()<risk; const dnfLap=dnf?Math.max(3, Math.min(laps-1, Math.round(laps*(.25+Math.random()*.65)))):null;
  const playerLaps=makeLapSet({track,weather,stats:st,driver:selectedDriver,power:playerPower,laps,dnf,dnfLap,player:true});
  const playerSum=lapSummary(playerLaps);
  const playerEntry={id:"player",name:`${selected.name} / ${selectedDriver.name}`,player:true,qLap:qPlayerLap,laps:playerLaps,...playerSum,dnf,dnfLap,startPos};
  const rivals=opponents.map(o=>{
    const rDnf = Math.random() < clamp(weather.drama*.09 + (92-o.stats.reliability)*.002, .01, .16);
    const rDnfLap = rDnf ? Math.max(3, Math.min(laps-1, Math.round(laps*(.2+Math.random()*.7)))) : null;
    const lapsArr=makeLapSet({track,weather,stats:o.stats,driver:o.driver,power:o.power+o.driver.skill*.16,laps,dnf:rDnf,dnfLap:rDnfLap});
    return {...o,laps:lapsArr,...lapSummary(lapsArr),dnf:rDnf,dnfLap:rDnfLap,startPos:grid.findIndex(f=>f.id===o.id)+1};
  });
  const field=[playerEntry,...rivals].sort((a,b)=>{
    if(a.dnf && !b.dnf) return 1;
    if(!a.dnf && b.dnf) return -1;
    if(a.dnf && b.dnf) return (b.dnfLap||0)-(a.dnfLap||0);
    return a.total-b.total;
  });
  const rank=field.findIndex(f=>f.player);
  const leaderTotal=field[0]?.total || playerSum.total;
  const aheadTotal=rank>0 ? field[rank-1].total : playerSum.total;
  const fastest = field.filter(f=>!f.dnf).reduce((best,f)=> f.best < best.best ? f : best, field.find(f=>!f.dnf)||playerEntry);
  const events=[];
  events.push(`Qualifying: ${selectedDriver.name} starts P${startPos} with a ${fmt(qPlayerLap)} lap.`);
  if(pole)events.push("TV cameras caught your car taking pole in qualifying.");
  if(weather.name.includes("Rain"))events.push(`${weather.icon} ${weather.name} made lap times swing by several seconds.`);
  if(Math.random()<weather.drama)events.push("A safety car compressed the field and reset the gaps midway through the race.");
  if(fastest.player)events.push(`Fastest lap: ${fmt(fastest.best)} from ${selectedDriver.name}.`);
  if(dnf)events.push(`Mechanical failure on lap ${dnfLap} ended the race early.`);
  else if(rank===0)events.push("Your pit wall nailed the strategy and controlled the final stint.");
  else if(rank<3)events.push("A clean podium finish impressed the paddock.");
  else events.push("The team brought the car home and collected useful race data.");
  setAnim(0); setRace({phase:"live",weather,track,laps,grid,field,rank,dnf,pole,events,fastest,player:playerEntry,leaderGap:playerEntry.total-leaderTotal,aheadGap:playerEntry.total-aheadTotal});
 }
 function collect(){
  if(!race)return; const rank=race.rank; const prize=race.dnf?0:(series.prize[rank]||500); const sponsor=g.sponsor; let sponsorBonus=sponsor.pay;
  const goalMet=(!race.dnf)&&((sponsor.goal.includes("Win")&&rank===0)||(sponsor.goal.includes("Top 3")&&rank<3)||(sponsor.goal.includes("Top 5")&&rank<5)||(sponsor.goal.includes("Podium")&&rank<3));
  if(goalMet)sponsorBonus+=sponsor.bonus;
  const fastestLapBonus = race.fastest?.player && !race.dnf ? Math.max(1000, Math.round(series.prize[0]*.12)) : 0;
  const pointsTable=[25,18,15,12,10,8,6,4,2,1]; const points=race.dnf?0:(pointsTable[rank]||0)+(race.fastest?.player?1:0);
  const repGain=race.dnf?-4:Math.max(2,Math.round((series.prize.length-rank+2)*2.2))+(goalMet?sponsor.rep:0)+(race.fastest?.player?2:0);
  const fanGain=race.dnf?-Math.round(series.fans*.08):Math.round(series.fans*(1-rank*.075)*(1+g.hq.marketing*.12)*(selectedDriver.trait?.fans?1.18:1));
  const salary=g.drivers.reduce((s,d)=>s+d.salary,0); const loss=race.dnf?Math.round(18+Math.random()*18):Math.round(7+Math.random()*11+race.weather.drama*12);
  const newCash=g.cash+prize+sponsorBonus+fastestLapBonus-series.entry-salary; const newWeek=g.week+1; const nextRace=race.raceNo>=series.races?1:g.raceNo+1; const newSeason=race.raceNo>=series.races?g.season+1:g.season;
  const titleWon = race.raceNo>=series.races && rank < 3;
  const logs=[`P${rank+1} at ${race.track.name}. Best ${fmt(race.player.best)}, total ${fmt(race.player.total)}.`, goalMet?`${sponsor.name} goal met: ${sponsor.goal}.`:`${sponsor.name} goal missed.`, fastestLapBonus?`Fastest lap bonus earned: ${money(fastestLapBonus)}.`:null, titleWon?`Season ${g.season} ended with a championship-level result.`:null].filter(Boolean);
  setG(x=>({...x,cash:newCash,week:newWeek,season:newSeason,raceNo:nextRace,rep:clamp(x.rep+repGain,0,9999),fans:clamp(x.fans+fanGain,0,99999999),lastRace:race,history:[...x.history,{week:newWeek,cash:newCash}].slice(-30),championship:[...x.championship,{season:x.season,race:x.raceNo,track:race.track.name,position:rank+1,points,bestLap:race.player.best,totalTime:race.player.total}],records:{...x.records,wins:x.records.wins+(rank===0?1:0),podiums:x.records.podiums+(rank<3?1:0),poles:x.records.poles+(race.pole?1:0),titles:x.records.titles+(titleWon?1:0),fastestLaps:(x.records.fastestLaps||0)+(race.fastest?.player?1:0)},cars:x.cars.map(c=>c.id===selected.id?{...c,condition:clamp(c.condition-loss,5,100)}:c),drivers:x.drivers.map(d=>d.id===selectedDriver.id?{...d,xp:(d.xp||0)+points,skill:clamp(d.skill+(points>12?1:0),1,99)}:d),log:[...logs,...race.events,...x.log].slice(0,10)})); setRace(null);
 }
 function upgrade(car,type){ const cost=upgradeCost(g, car, type); if(cost===null)return; if(g.cash<cost){addLog("Not enough cash for that upgrade.");return} setG(x=>({...x,cash:x.cash-cost,cars:x.cars.map(c=>c.id===car.id?{...c,up:{...c.up,[type]:c.up[type]+1}}:c),log:[`Installed ${type} level ${car.up[type]+1} on ${car.name} for ${money(cost)}.`,...x.log].slice(0,10)})); }
 function repair(car){ const cost=repairCost(g, car); if(cost<=0)return; if(g.cash<cost){addLog("Not enough cash for repairs.");return} setG(x=>({...x,cash:x.cash-cost,cars:x.cars.map(c=>c.id===car.id?{...c,condition:100}:c),log:[`${car.name} repaired for ${money(cost)}.`,...x.log].slice(0,10)})); }
 function buy(model){ const m=CARS.find(c=>c.id===model); if(g.cars.length>=slots){addLog("Garage full. Upgrade HQ garage bays.");return} if(g.cash<m.price){addLog("Not enough cash for that car.");return} const car={id:uid(),model,name:`${m.name} #${g.cars.length+1}`,condition:100,up:{engine:0,tires:0,aero:0,reliability:0},driverId:null,paint:pick(["amber","blue","red","silver","green"])}; setG({...g,cash:g.cash-m.price,cars:[...g.cars,car],selected:car.id,log:[`Purchased ${m.name}.`,...g.log].slice(0,10)}); }
 function hire(d){ const fee=d.salary*4; if(g.cash<fee){addLog("Not enough cash to sign driver.");return} setG({...g,cash:g.cash-fee,drivers:[...g.drivers,d],candidates:g.candidates.filter(c=>c.id!==d.id),log:[`Signed ${d.name}, a ${d.trait.name} driver.`,...g.log].slice(0,10)}); }
 const content = race? <RaceView race={race} anim={anim} collect={collect} skip={()=>{setAnim(100);setRace({...race,phase:"result"})}}/> : g.tab==="home"? <Home g={g} series={series} setTab={(t)=>setG({...g,tab:t})}/> : g.tab==="garage"? <Garage g={g} setG={setG} selected={selected} slots={slots} upgrade={upgrade} repair={repair} buy={buy}/> : g.tab==="drivers"? <Drivers g={g} setG={setG} hire={hire}/> : g.tab==="race"? <RaceSetup g={g} setG={setG} selected={selected} driver={selectedDriver} series={series} simRace={simRace}/> : g.tab==="hq"? <HQ g={g} setG={setG}/> : <Stats g={g} setG={setG}/>;
 return <div className="app"><Header g={g} setG={setG}/><main>{content}</main><footer><button onClick={()=>{saveGame(g);addLog("Game saved.")}}><Save size={14}/> Save</button><button onClick={()=>{if(confirm("Reset Apex Tycoon save?")){localStorage.removeItem(SAVE_KEY);localStorage.removeItem(OLD_SAVE_KEY);setG(baseGame());}}}><RotateCcw size={14}/> Reset</button></footer></div>
}
function Home({g,series,setTab}){const car=g.cars[0]||baseGame().cars[0];return <div className="stack"><CarRender type={(CARS.find(c=>c.id===car.model)||CARS[0]).render} paint={car.paint} damage={100-car.condition}/><Card><div className="cardTitle"><Flame size={15}/> Team Command Center</div><div className="biggrid"><button onClick={()=>setTab("race")} className="primary"><Flag/> Race Weekend</button><button onClick={()=>setTab("garage")}><Wrench/> Build Cars</button><button onClick={()=>setTab("drivers")}><Users/> Sign Drivers</button><button onClick={()=>setTab("stats")}><Timer/> Lap Records</button></div></Card><Card><div className="cardTitle"><Trophy size={15}/> Current Series</div><h2>{series.name}</h2><p>Race {g.raceNo}/{series.races} • Entry {money(series.entry)} • Win pays {money(series.prize[0])}</p><div className="progress"><span style={{width:`${g.raceNo/series.races*100}%`}}/></div></Card>{g.lastRace&&<Card><div className="cardTitle"><Clock3 size={15}/> Last Race Timing</div><div className="timingGrid"><Metric icon={Medal} label="Result" value={`P${g.lastRace.rank+1}`}/><Metric icon={Timer} label="Best Lap" value={fmt(g.lastRace.player.best)}/><Metric icon={Clock3} label="Total" value={fmt(g.lastRace.player.total)}/><Metric icon={GaugeCircle} label="Gap" value={gap(g.lastRace.leaderGap)}/></div></Card>}<Card><div className="cardTitle"><Activity size={15}/> Cash Trend</div><div className="chart"><ResponsiveContainer><LineChart data={g.history}><CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false}/><XAxis dataKey="week" tick={{fill:"#7d8796",fontSize:10}} axisLine={false} tickLine={false}/><Tooltip formatter={(v)=>money(v)} contentStyle={{background:"#0b0f16",border:"1px solid rgba(255,176,32,.35)",borderRadius:12}}/><Line dataKey="cash" stroke="#ffb020" strokeWidth={3} dot={false}/></LineChart></ResponsiveContainer></div></Card><Card><div className="cardTitle"><Newspaper size={15}/> Team News</div>{g.log.map((l,i)=><p key={i} className={i?'news':'news hot'}>{l}</p>)}</Card></div>}
function Garage({g,setG,selected,slots,upgrade,repair,buy}){const stats=carStats(selected); const rCost=repairCost(g, selected); return <div className="stack"><CarRender type={stats.model.render} paint={selected.paint} damage={100-selected.condition}/><Card><div className="cardTitle"><Car size={15}/> Garage {g.cars.length}/{slots}</div><select value={selected.id} onChange={e=>setG({...g,selected:e.target.value})}>{g.cars.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><Stat label="Speed" icon={Zap} value={stats.speed} max={140}/><Stat label="Grip" icon={CircleDot} value={stats.grip} max={140}/><Stat label="Reliability" icon={ShieldCheck} value={stats.reliability} max={100}/><Stat label="Condition" icon={Activity} value={selected.condition} max={100}/><div className="grid2">{["engine","tires","aero","reliability"].map(t=>{const cost=upgradeCost(g,selected,t); return <button key={t} onClick={()=>upgrade(selected,t)}><Settings size={14}/>{t} Lv {selected.up[t]}/5 <small>{cost?money(cost):"MAX"}</small></button>})}</div>{rCost>0&&<button className="repair" onClick={()=>repair(selected)}><Wrench size={14}/> Repair to 100% <b>{money(rCost)}</b></button>}</Card><Card><div className="cardTitle"><Sparkles size={15}/> Dealer Lot</div>{CARS.map(c=><button className="row" key={c.id} onClick={()=>buy(c.id)}><span>{c.name}<small>SPD {c.speed} • GRIP {c.grip} • REL {c.reliability}</small></span><b>{money(c.price)}</b></button>)}</Card></div>}
function Drivers({g,setG,hire}){return <div className="stack"><Card><div className="cardTitle"><Users size={15}/> Roster</div>{g.drivers.map(d=><div className="driver" key={d.id}><div><b>{d.name}</b><small>{d.age} yrs • {d.trait.name}: {d.trait.desc} • XP {d.xp||0}</small></div><Stat label="Skill" value={d.skill} icon={Star}/><Stat label="Calm" value={d.calm} icon={Activity}/><select value={g.cars.find(c=>c.driverId===d.id)?.id||""} onChange={e=>setG({...g,cars:g.cars.map(c=>c.id===e.target.value?{...c,driverId:d.id}:c.driverId===d.id?{...c,driverId:null}:c)})}><option value="">Bench</option>{g.cars.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>)}</Card><Card><div className="cardTitle"><Target size={15}/> Scouted Talent</div>{g.candidates.map(d=><button className="row" key={d.id} onClick={()=>hire(d)}><span>{d.name}<small>{d.trait.name} • Skill {d.skill} • Calm {d.calm}</small></span><b><UserPlus size={13}/> {money(d.salary*4)}</b></button>)}<button onClick={()=>setG({...g,candidates:[driver(g.hq.staff*5),driver(g.hq.staff*5),driver(g.hq.staff*5)]})}><FastForward size={14}/> Re-scout</button></Card></div>}
function RaceSetup({g,setG,selected,driver,series,simRace}){const stats=carStats(selected); return <div className="stack"><CarRender type={stats.model.render} paint={selected.paint}/><Card className="raceCard"><div className="cardTitle"><Radio size={15}/> Race Weekend</div><h2>{series.name}</h2><p>Selected: <b>{selected.name}</b> with <b>{driver?driver.name:"No Driver"}</b></p><select value={g.selected} onChange={e=>setG({...g,selected:e.target.value})}>{g.cars.map(c=><option key={c.id} value={c.id}>{c.name} {c.driverId?"":"— no driver"}</option>)}</select><div className="grid2 featureGrid"><div><CloudRain/> Weather changes lap pace</div><div><Timer/> Qualifying lap times</div><div><Clock3/> Live timing tower</div><div><Handshake/> Sponsor goals</div></div><button className="primary giant" onClick={simRace}><Flag/> Start Race Weekend</button></Card><Card><div className="cardTitle"><Handshake size={15}/> Sponsor</div><h2>{g.sponsor.name}</h2><p>{money(g.sponsor.pay)}/week • Bonus {money(g.sponsor.bonus)} • Goal: {g.sponsor.goal}</p>{SPONSORS.filter(s=>g.rep>=s.req).map(s=><button className="row" key={s.name} onClick={()=>setG({...g,sponsor:s})}><span>{s.name}<small>{s.goal}</small></span><b>{money(s.pay)}/wk</b></button>)}</Card></div>}
function HQ({g,setG}){const defs={garage:["Garage Bays",60000],rd:["R&D Lab",75000],marketing:["Marketing Office",65000],staff:["Scouting Dept",70000]};return <div className="stack"><CarRender type="prototype"/><Card><div className="cardTitle"><Building2 size={15}/> Headquarters</div>{Object.entries(defs).map(([k,[name,cost]])=><button className="row" key={k} onClick={()=>{let real=Math.round(cost*(g.hq[k]+1)); if(g.cash>=real)setG({...g,cash:g.cash-real,hq:{...g.hq,[k]:g.hq[k]+1},log:[`${name} upgraded to level ${g.hq[k]+2}.`,...g.log].slice(0,10)})}}><span>{name}<small>Level {g.hq[k]+1}</small></span><b>{money(cost*(g.hq[k]+1))}</b></button>)}</Card></div>}
function Stats({g}){const races=g.championship.filter(r=>r.season===g.season); const pts=races.reduce((s,r)=>s+r.points,0); const best=[...g.championship].sort((a,b)=>a.bestLap-b.bestLap)[0];return <div className="stack"><Card><div className="cardTitle"><Crown size={15}/> Records</div><div className="records"><div><b>{g.records.wins}</b><small>Wins</small></div><div><b>{g.records.podiums}</b><small>Podiums</small></div><div><b>{g.records.poles}</b><small>Poles</small></div><div><b>{g.records.fastestLaps||0}</b><small>Fastest Laps</small></div></div></Card><Card><div className="cardTitle"><Timer size={15}/> Lap Records</div>{best?<><h2>{fmt(best.bestLap)}</h2><p>Best team lap at {best.track}, Season {best.season} Race {best.race}.</p></>:<p>No lap records yet. Run a race weekend.</p>}</Card><Card><div className="cardTitle"><Medal size={15}/> Season {g.season}</div><h2>{pts} points</h2>{races.map(r=><p className="news" key={`${r.season}-${r.race}-${r.track}`}>Race {r.race}: P{r.position} at {r.track} • Best {fmt(r.bestLap)} • {r.points} pts</p>)}</Card></div>}
function RaceView({race,anim,collect,skip}){const lap=Math.min(race.laps, Math.max(1, Math.ceil((anim/100)*race.laps))); const player=race.player; const liveLast=player.laps[Math.min(lap-1, player.laps.length-1)] || player.last; const liveBest=Math.min(...player.laps.slice(0, Math.min(lap, player.laps.length))); const liveAvg=player.laps.slice(0, Math.min(lap, player.laps.length)).reduce((s,v)=>s+v,0)/Math.min(lap, player.laps.length); const playerPos = race.field.findIndex(f=>f.player)+1;return <div className="stack"><Card className="raceLive"><div className="cardTitle"><Flag size={15}/> {race.track.name} • {race.weather.icon} {race.weather.name}</div>{race.phase==="live"?<><div className="raceHud"><Metric icon={RotateCw} label="Lap" value={`${lap}/${race.laps}`}/><Metric icon={Clock3} label="Last" value={fmt(liveLast)}/><Metric icon={Timer} label="Best" value={fmt(liveBest)}/><Metric icon={GaugeCircle} label="Avg" value={fmt(liveAvg)}/></div><div className="track"><div className={`trackOval ${race.weather.name.includes("Rain")?"wet":""}`}><span className="carDot player" style={{offsetDistance:`${anim}%`}}/><span className="carDot rival r1" style={{offsetDistance:`${Math.max(0,anim-6)}%`}}/><span className="carDot rival r2" style={{offsetDistance:`${Math.max(0,anim-13)}%`}}/><span className="carDot rival r3" style={{offsetDistance:`${Math.max(0,anim-20)}%`}}/></div></div><div className="tower"><p><b>Start</b> P{player.startPos} • Quali {fmt(player.qLap)}</p><p><b>Live</b> P{playerPos} • Gap {gap(Math.max(0, race.leaderGap*(anim/100)))} • Ahead {gap(Math.max(0, race.aheadGap*(anim/100)))}</p></div><div className="leaderboard">{race.field.slice(0,6).map((f,i)=><p className={f.player?"me":""} key={f.id}><b>P{i+1}</b><span>{f.name}</span><small>{f.dnf?`DNF L${f.dnfLap}`:gap(f.total-race.field[0].total)}</small></p>)}</div><button onClick={skip}><FastForward size={14}/> Skip to Results</button></>:<><div className="resultBadge">{race.dnf?"DNF":`P${race.rank+1}`}</div><div className="raceHud"><Metric icon={Timer} label="Best" value={fmt(player.best)}/><Metric icon={Clock3} label="Total" value={fmt(player.total)}/><Metric icon={GaugeCircle} label="Leader Gap" value={gap(race.leaderGap)}/><Metric icon={TrendingUp} label="Fastest" value={race.fastest?.player?"YES":"NO"}/></div><div className="leaderboard results">{race.field.map((f,i)=><p className={f.player?"me":""} key={f.id}><b>P{i+1}</b><span>{f.name} {f.dnf?`DNF L${f.dnfLap}`:""}</span><small>{f.dnf?"Out":fmt(f.total)}</small></p>)}</div>{race.events.map(e=><p className="news hot" key={e}>{e}</p>)}<button className="primary giant" onClick={collect}><Coins size={16}/> Collect Results</button></>}</Card></div>}
