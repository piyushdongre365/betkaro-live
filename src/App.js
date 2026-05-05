import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════
// SUPABASE CONFIG — Yahan apni keys daalo
// Dashboard → Settings → API
// ═══════════════════════════════════════════════
const SUPABASE_URL  = "https://rbsfrmksfeiksefrzcbm.supabase.co";   // 👈 Replace
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJic2ZybWtzZmVpa3NlZnJ6Y2JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MTE5NDYsImV4cCI6MjA5MzM4Nzk0Nn0.2MOR-tuYnAjbksn0eTMHVWDaj3XUhUmP7MqsPlTladc";                      // 👈 Replace
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ═══════════════════════════════════════════════
// ADMIN CREDENTIALS (hardcoded — sirf admin ke liye)
// ═══════════════════════════════════════════════
const ADMIN = { username:"admin", password:"admin123" };

// ═══════════════════════════════════════════════
// HOUSE EDGE ALGORITHMS — 90% loss, 10% win
// ═══════════════════════════════════════════════
function generateAviatorCrash() {
  const r = Math.random();
  // 90% of time: crash between 1.00x and 1.99x
  if (r < 0.78) return +(1.01 + r * 1.27).toFixed(2);
  if (r < 0.90) return +(1.99 + (r-0.78) * 5).toFixed(2);
  // 10% of time: lucky crash 3x-20x
  return +(3.0 + (r - 0.90) * 170).toFixed(2);
}

function shouldMineExplode(clickIndex, totalClicks) {
  // First click always safe; after that 90% house edge per click
  if (totalClicks === 0) return false;
  return Math.random() < 0.90;
}

function getMineMultiplier(safeCount, mineCount) {
  if (safeCount === 0) return 1.0;
  const totalCells = 25;
  let mult = 1.0;
  for (let i = 0; i < safeCount; i++) {
    const safeRemaining = totalCells - mineCount - i;
    const totalRemaining = totalCells - i;
    mult *= (totalRemaining / safeRemaining) * 0.97; // 3% house rake
  }
  return +mult.toFixed(2);
}

// ═══════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════
const SPORTS_TABS = ["INPLAY","SPORTS","CASINO","SPORTS BOOK","OTHERS"];
const SPORT_ICONS = [
  { key:"cricket", icon:"🏏", label:"CRICKET" },
  { key:"football", icon:"⚽", label:"FOOTBALL" },
  { key:"tennis", icon:"🎾", label:"TENNIS" },
  { key:"fantasy", icon:"🏆", label:"FANTASY 11", isNew:true },
  { key:"cockfight", icon:"🐓", label:"COCK FIGHT" },
  { key:"horse", icon:"🐎", label:"HORSE RACING" },
];

const CASINO_GAMES = [
  { name:"AVIATOR", color:"linear-gradient(135deg,#0a0a2e,#1a0050)", emoji:"✈️", playable:true, tag:"aviator", hot:true },
  { name:"MINES", color:"linear-gradient(135deg,#001a00,#003300)", emoji:"💎", playable:true, tag:"mines", hot:true },
  { name:"EZUGI", color:"linear-gradient(135deg,#3d0000,#8B0000)", emoji:"🎰", playable:false },
  { name:"LIGHTNING", color:"linear-gradient(135deg,#0a0a1e,#1a1a5e)", emoji:"⚡", playable:false },
  { name:"MARBLE RUN", color:"linear-gradient(135deg,#001a00,#004400)", emoji:"🔮", playable:false },
  { name:"TEEN PATTI", color:"linear-gradient(135deg,#150030,#3a0070)", emoji:"🃏", playable:false },
  { name:"COLOR PREDICTION", color:"linear-gradient(135deg,#001a30,#003060)", emoji:"🌈", playable:false },
  { name:"DRAGON TIGER", color:"linear-gradient(135deg,#2a0000,#600000)", emoji:"🐉", playable:false },
  { name:"ANDAR BAHAR", color:"linear-gradient(135deg,#1a0030,#400060)", emoji:"🎴", playable:false },
  { name:"7 UP DOWN", color:"linear-gradient(135deg,#001a30,#004060)", emoji:"🎲", playable:false },
];

const IPL_TEAMS = [
  { name:"Mumbai Indians",       back:[1110,1200], lay:[1400,1500] },
  { name:"Royal Challengers",    back:[285,300],   lay:[310,320]   },
  { name:"Chennai Super Kings",  back:[1400,1450], lay:[1800,1900] },
  { name:"Sunrisers Hyderabad",  back:[800,850],   lay:[980,1010]  },
  { name:"Delhi Capitals",       back:[1750,1800], lay:[2200,2300] },
  { name:"Punjab Kings",         back:[225,240],   lay:[255,270]   },
  { name:"Gujarat Titans",       back:[2000,2100], lay:[0,0]       },
  { name:"Lucknow Super Giants", back:[8700,9000], lay:[0,0]       },
  { name:"Kolkata Knight Riders", back:[8800,9200],lay:[0,0]       },
  { name:"Rajasthan Royals",     back:[490,510],   lay:[570,600]   },
];

const MATCHES = [
  { id:1, league:"Indian Premier League",   t1:"Delhi Capitals",   t2:"Punjab Kings",   date:"25/04/2026 15:30", live:true,  sport:"cricket",
    score1:"DC: 142/6 (17.2)", score2:"PBKS: 0/0 (0.0)",
    odds:{ back1:1.95, lay1:1.96, backX:0, layX:0, back2:2.02, lay2:2.04 } },
  { id:2, league:"Indian Premier League",   t1:"Mumbai Indians",   t2:"CSK",            date:"25/04/2026 19:30", live:false, sport:"cricket",
    score1:"", score2:"",
    odds:{ back1:2.10, lay1:2.12, backX:0, layX:0, back2:1.85, lay2:1.86 } },
  { id:3, league:"Pakistan Super League",   t1:"Karachi Kings",    t2:"Lahore Qalandars",date:"26/04/2026 17:30",live:false,sport:"cricket",
    score1:"", score2:"",
    odds:{ back1:1.75, lay1:1.76, backX:0, layX:0, back2:2.20, lay2:2.22 } },
  { id:4, league:"Premier League",          t1:"Arsenal",          t2:"Chelsea",         date:"25/04/2026 20:00", live:true, sport:"football",
    score1:"Arsenal: 2", score2:"Chelsea: 1",
    odds:{ back1:2.20, lay1:2.22, backX:3.40, layX:3.50, back2:3.10, lay2:3.15 } },
  { id:5, league:"ATP Madrid Open",         t1:"Djokovic",         t2:"Alcaraz",         date:"25/04/2026 18:00", live:true, sport:"tennis",
    score1:"6-4, 3-*", score2:"",
    odds:{ back1:1.65, lay1:1.66, backX:0, layX:0, back2:2.30, lay2:2.32 } },
  { id:6, league:"Bangladesh Women",        t1:"Bangladesh W",     t2:"Sri Lanka W",     date:"25/04/2026 09:00", live:false, sport:"cricket",
    score1:"", score2:"",
    odds:{ back1:1.50, lay1:1.51, backX:0, layX:0, back2:2.60, lay2:2.65 } },
];

// Live score simulation data
const LIVE_SCORES_INIT = [
  { id:1, t1:"Delhi Capitals", t2:"Punjab Kings", s1:"142/6", ov1:"17.2", s2:"0/0", ov2:"0.0", sport:"cricket", live:true },
  { id:4, t1:"Arsenal", t2:"Chelsea", s1:"2", s2:"1", min:"74'", sport:"football", live:true },
  { id:5, t1:"Djokovic", t2:"Alcaraz", s1:"6-4, 3", s2:"0-1, *", set:"Set 2", sport:"tennis", live:true },
];

// ═══════════════════════════════════════════════
// AD BANNER
// ═══════════════════════════════════════════════
function AdBanner({ type="promo" }) {
  const ads = [
    { bg:"linear-gradient(135deg,#b8860b,#8B6914)", text:"🎁 WELCOME BONUS: 100% on first deposit up to ₹10,000!", sub:"Use code: BETKARO100" },
    { bg:"linear-gradient(135deg,#cc0000,#880000)", text:"🏆 IPL 2026 — BET ON EVERY BALL!", sub:"Best odds guaranteed" },
    { bg:"linear-gradient(135deg,#004080,#002050)", text:"✈️ AVIATOR — Win up to 100x your bet!", sub:"New players get 5 free spins" },
    { bg:"linear-gradient(135deg,#006600,#003300)", text:"💎 MINES — Find the gems, win big!", sub:"Instant withdrawal guaranteed" },
  ];
  const ad = ads[Math.floor(Math.random() * ads.length)];
  return (
    <div style={{background:ad.bg, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", position:"relative", overflow:"hidden"}}>
      <div style={{position:"absolute", inset:0, background:"url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpolygon points='20 0 20 20 0 20'/%3E%3C/g%3E%3C/svg%3E\")"}} />
      <div style={{position:"relative"}}>
        <p style={{margin:0, color:"#fff", fontWeight:800, fontSize:12}}>{ad.text}</p>
        <p style={{margin:0, color:"rgba(255,255,255,0.75)", fontSize:10}}>{ad.sub}</p>
      </div>
      <span style={{background:"rgba(255,255,255,0.2)", padding:"4px 10px", borderRadius:20, color:"#fff", fontSize:11, fontWeight:700, whiteSpace:"nowrap", position:"relative"}}>CLAIM →</span>
    </div>
  );
}

// ═══════════════════════════════════════════════
// LIVE SCORE WIDGET
// ═══════════════════════════════════════════════
function LiveScoreWidget({ scores }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [localScores, setLocalScores] = useState(scores);

  useEffect(() => {
    const iv = setInterval(() => {
      setLocalScores(prev => prev.map(s => {
        if (s.sport === "cricket" && s.live) {
          const balls = Math.random() > 0.6 ? 1 : 0;
          if (!balls) return s;
          const runs = Math.floor(Math.random() * 7);
          const wicket = runs === 0 && Math.random() > 0.85;
          const [r, w] = s.s1.split("/").map(Number);
          const ovParts = s.ov1.split(".");
          let ball = parseInt(ovParts[1]) + 1;
          let ov = parseInt(ovParts[0]);
          if (ball > 5) { ball = 0; ov++; }
          return { ...s, s1:`${r+runs}/${w+(wicket?1:0)}`, ov1:`${ov}.${ball}` };
        }
        if (s.sport === "football" && s.live) {
          const min = parseInt(s.min) + 1;
          return { ...s, min:`${min}'` };
        }
        return s;
      }));
      setActiveIdx(prev => (prev + 1) % scores.length);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  const s = localScores[activeIdx];
  if (!s) return null;

  return (
    <div style={{background:"#0a1a0a", borderBottom:"1px solid #1a3a1a", padding:"6px 14px", display:"flex", alignItems:"center", gap:10, overflowX:"auto"}}>
      <span style={{background:"#cc0000", color:"#fff", fontSize:9, fontWeight:900, padding:"2px 6px", borderRadius:3, whiteSpace:"nowrap", animation:"pulse 1s infinite"}}>● LIVE</span>
      {localScores.map((sc, i) => (
        <div key={sc.id} onClick={() => setActiveIdx(i)}
          style={{display:"flex", alignItems:"center", gap:6, padding:"4px 10px", background:i===activeIdx?"rgba(0,200,0,0.1)":"transparent", borderRadius:6, cursor:"pointer", border:i===activeIdx?"1px solid #00aa33":"1px solid transparent", whiteSpace:"nowrap", transition:"all 0.3s"}}>
          <span style={{fontSize:10}}>{sc.sport==="cricket"?"🏏":sc.sport==="football"?"⚽":"🎾"}</span>
          <div>
            <p style={{margin:0, color:"#ddd", fontSize:10, fontWeight:700}}>{sc.t1} v {sc.t2}</p>
            <p style={{margin:0, color:"#00cc44", fontSize:10, fontWeight:600}}>
              {sc.sport==="cricket" ? `${sc.s1} (${sc.ov1}) v ${sc.s2} (${sc.ov2})` :
               sc.sport==="football" ? `${sc.s1} - ${sc.s2} | ${sc.min}` :
               `${sc.s1} v ${sc.s2} | ${sc.set}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// SCOREBOARD FULL VIEW
// ═══════════════════════════════════════════════
function ScoreBoard() {
  const [scores, setScores] = useState([
    { id:1, t1:"Delhi Capitals", t2:"Punjab Kings", s1:"142/6", s2:"47/2", ov1:"17.2 ov", ov2:"6.4 ov", rr1:"8.22", rr2:"7.09", crr:"7.09", rrr:"9.14", status:"PBKS needs 96 runs in 42 balls", sport:"cricket", live:true, league:"IPL 2026" },
    { id:4, t1:"Arsenal", t2:"Chelsea", s1:"2", s2:"1", events:["⚽ 23' Saka (ARS)","⚽ 41' Havertz (ARS)","⚽ 67' Palmer (CHE)"], min:"74'", status:"2nd Half", sport:"football", live:true, league:"Premier League" },
  ]);

  useEffect(() => {
    const iv = setInterval(() => {
      setScores(prev => prev.map(s => {
        if (s.sport === "cricket" && s.live) {
          const r2 = parseInt(s.s2.split("/")[0]) + (Math.random()>0.5?Math.floor(Math.random()*4):0);
          const w2 = parseInt(s.s2.split("/")[1]);
          const oparts = s.ov2.split(" ")[0].split(".");
          let b = parseInt(oparts[1])+1, o = parseInt(oparts[0]);
          if(b>5){b=0;o++;}
          const target = parseInt(s.s1.split("/")[0]);
          const remaining = target - r2 + 1;
          const ballsLeft = (20-o)*6 - b;
          const rrr = ballsLeft > 0 ? (remaining / (ballsLeft/6)).toFixed(2) : "---";
          return { ...s, s2:`${r2}/${w2}`, ov2:`${o}.${b} ov`, rrr, status:`${s.t2} needs ${remaining} runs in ${ballsLeft} balls` };
        }
        return s;
      }));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{padding:"10px 14px"}}>
      <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:10}}>
        <span style={{background:"#cc0000", color:"#fff", fontSize:9, fontWeight:900, padding:"2px 6px", borderRadius:3, animation:"pulse 1s infinite"}}>● LIVE</span>
        <span style={{color:"#f0c040", fontWeight:800, fontSize:14}}>SCOREBOARD</span>
      </div>
      {scores.map(sc => (
        <div key={sc.id} style={{background:"#111", border:"1px solid #222", borderRadius:12, marginBottom:10, overflow:"hidden"}}>
          <div style={{background:"rgba(184,134,11,0.15)", padding:"6px 12px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <span style={{color:"#f0c040", fontSize:11, fontWeight:700}}>{sc.league}</span>
            <span style={{background:"#cc0000", color:"#fff", fontSize:9, padding:"1px 6px", borderRadius:3, fontWeight:700}}>● LIVE</span>
          </div>
          {sc.sport === "cricket" ? (
            <div style={{padding:"10px 12px"}}>
              <div style={{display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", gap:8, marginBottom:8}}>
                <div>
                  <p style={{margin:0, color:"#ddd", fontWeight:700, fontSize:13}}>{sc.t1}</p>
                  <p style={{margin:0, color:"#f0c040", fontWeight:900, fontSize:20}}>{sc.s1}</p>
                  <p style={{margin:0, color:"#888", fontSize:11}}>{sc.ov1}</p>
                </div>
                <div style={{textAlign:"center"}}>
                  <p style={{margin:0, color:"#555", fontSize:12, fontWeight:700}}>VS</p>
                </div>
                <div style={{textAlign:"right"}}>
                  <p style={{margin:0, color:"#ddd", fontWeight:700, fontSize:13}}>{sc.t2}</p>
                  <p style={{margin:0, color:"#00cc44", fontWeight:900, fontSize:20}}>{sc.s2}</p>
                  <p style={{margin:0, color:"#888", fontSize:11}}>{sc.ov2}</p>
                </div>
              </div>
              <div style={{background:"#0a0a0a", borderRadius:8, padding:"6px 10px", display:"flex", justifyContent:"space-around"}}>
                <div style={{textAlign:"center"}}>
                  <p style={{margin:0, color:"#888", fontSize:9}}>CRR</p>
                  <p style={{margin:0, color:"#f0c040", fontWeight:800, fontSize:13}}>{sc.crr}</p>
                </div>
                <div style={{textAlign:"center"}}>
                  <p style={{margin:0, color:"#888", fontSize:9}}>RRR</p>
                  <p style={{margin:0, color:"#ff6644", fontWeight:800, fontSize:13}}>{sc.rrr}</p>
                </div>
              </div>
              <p style={{margin:"8px 0 0", color:"#aaa", fontSize:11, textAlign:"center"}}>{sc.status}</p>
            </div>
          ) : (
            <div style={{padding:"10px 12px"}}>
              <div style={{display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", gap:8, marginBottom:8}}>
                <div>
                  <p style={{margin:0, color:"#ddd", fontWeight:700, fontSize:13}}>{sc.t1}</p>
                </div>
                <div style={{textAlign:"center", background:"#1a1a1a", borderRadius:8, padding:"6px 12px"}}>
                  <p style={{margin:0, color:"#fff", fontWeight:900, fontSize:22}}>{sc.s1} - {sc.s2}</p>
                  <p style={{margin:0, color:"#cc0000", fontSize:11, fontWeight:700}}>{sc.min}</p>
                </div>
                <div style={{textAlign:"right"}}>
                  <p style={{margin:0, color:"#ddd", fontWeight:700, fontSize:13}}>{sc.t2}</p>
                </div>
              </div>
              <div style={{borderTop:"1px solid #1a1a1a", paddingTop:6}}>
                {sc.events && sc.events.map((e,i) => (
                  <p key={i} style={{margin:"2px 0", color:"#888", fontSize:11}}>{e}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// AVIATOR GAME
// ═══════════════════════════════════════════════
function AviatorGame({ wallet, setWallet, showToast, onBack }) {
  const [phase, setPhase] = useState("idle"); // idle, flying, crashed, cashed
  const [multiplier, setMultiplier] = useState(1.00);
  const [crashAt, setCrashAt] = useState(null);
  const [betAmt, setBetAmt] = useState("");
  const [activeBet, setActiveBet] = useState(null);
  const [history, setHistory] = useState([1.24,8.45,1.03,1.67,1.12,2.31,1.05,1.44,15.72,1.09]);
  const [autoCash, setAutoCash] = useState("");
  const [planeX, setPlaneX] = useState(10);
  const [planeY, setPlaneY] = useState(70);
  const timerRef = useRef(null);
  const multRef = useRef(1.00);
  const crashRef = useRef(null);

  const startRound = () => {
    if (!betAmt || parseFloat(betAmt) <= 0) { showToast("❌ Bet amount dalo!"); return; }
    if (parseFloat(betAmt) > wallet) { showToast("❌ Balance kam hai! Deposit karo."); return; }
    const bet = parseFloat(betAmt);
    setWallet(w => w - bet);
    setActiveBet(bet);
    const crash = generateAviatorCrash();
    setCrashAt(crash);
    crashRef.current = crash;
    multRef.current = 1.00;
    setMultiplier(1.00);
    setPlaneX(5);
    setPlaneY(80);
    setPhase("flying");
    timerRef.current = setInterval(() => {
      multRef.current = +(multRef.current * 1.025).toFixed(2);
      // Move plane
      setPlaneX(x => Math.min(x + 1.2, 80));
      setPlaneY(y => Math.max(y - 0.7, 10));
      setMultiplier(multRef.current);
      // Auto cashout
      if (autoCash && parseFloat(autoCash) > 0 && multRef.current >= parseFloat(autoCash)) {
        cashOut(multRef.current);
        return;
      }
      if (multRef.current >= crashRef.current) {
        crash_plane(multRef.current);
      }
    }, 100);
  };

  const cashOut = (currentMult) => {
    if (phase !== "flying") return;
    clearInterval(timerRef.current);
    const win = +(activeBet * currentMult).toFixed(2);
    setWallet(w => w + win);
    showToast(`✅ Cashout! ₹${win} jeet gaye! (${currentMult}x)`);
    setHistory(h => [currentMult, ...h.slice(0, 9)]);
    setPhase("cashed");
    setActiveBet(null);
    setTimeout(() => { setPhase("idle"); setMultiplier(1.00); setPlaneX(5); setPlaneY(80); }, 2000);
  };

  const crash_plane = (finalMult) => {
    clearInterval(timerRef.current);
    setPhase("crashed");
    setHistory(h => [finalMult, ...h.slice(0, 9)]);
    showToast(`💥 Plane crash! ${finalMult}x par uda gaya!`);
    setTimeout(() => { setPhase("idle"); setMultiplier(1.00); setPlaneX(5); setPlaneY(80); }, 2500);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const multColor = multiplier >= 2 ? "#00ff88" : multiplier >= 1.5 ? "#f0c040" : "#fff";

  return (
    <div style={{background:"#0a0a1e", minHeight:"100vh", padding:0}}>
      {/* Header */}
      <div style={{background:"linear-gradient(90deg,#0a0a2e,#150050)", padding:"10px 14px", display:"flex", alignItems:"center", gap:10, borderBottom:"2px solid #3300aa"}}>
        <button onClick={onBack} style={{background:"none", border:"none", color:"#9966ff", fontSize:18, cursor:"pointer"}}>←</button>
        <span style={{fontSize:20}}>✈️</span>
        <div>
          <h2 style={{margin:0, color:"#9966ff", fontWeight:900, fontSize:18}}>AVIATOR</h2>
          <p style={{margin:0, color:"rgba(153,102,255,0.6)", fontSize:10}}>How high can you fly?</p>
        </div>
        <div style={{marginLeft:"auto", background:"rgba(153,102,255,0.15)", padding:"4px 10px", borderRadius:20, border:"1px solid #5500cc"}}>
          <span style={{color:"#f0c040", fontWeight:800}}>₹{wallet.toFixed(2)}</span>
        </div>
      </div>

      {/* History strip */}
      <div style={{background:"#080818", padding:"6px 12px", display:"flex", gap:4, overflowX:"auto", borderBottom:"1px solid #1a1a40"}}>
        {history.map((h,i) => (
          <span key={i} style={{padding:"3px 8px", borderRadius:12, background:h>=2?"rgba(0,255,136,0.15)":h>=1.5?"rgba(240,192,64,0.15)":"rgba(255,60,60,0.15)", color:h>=2?"#00ff88":h>=1.5?"#f0c040":"#ff4444", fontSize:11, fontWeight:700, whiteSpace:"nowrap", border:`1px solid ${h>=2?"#00aa44":h>=1.5?"#b8860b":"#880000"}`}}>
            {h}x
          </span>
        ))}
      </div>

      {/* Sky / Game area */}
      <div style={{position:"relative", height:220, background:"linear-gradient(180deg,#030310 0%,#0a0a30 50%,#0d0d20 100%)", overflow:"hidden", borderBottom:"1px solid #1a1a40"}}>
        {/* Stars */}
        {[...Array(20)].map((_,i)=>(
          <div key={i} style={{position:"absolute", width:2, height:2, background:"#fff", borderRadius:"50%", opacity:0.5+Math.random()*0.5, top:`${Math.random()*90}%`, left:`${Math.random()*100}%`}} />
        ))}
        {/* Grid lines */}
        <svg style={{position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.08}}>
          {[...Array(6)].map((_,i)=><line key={i} x1={`${i*20}%`} y1="0" x2={`${i*20}%`} y2="100%" stroke="#6644ff" strokeWidth="1"/>)}
          {[...Array(5)].map((_,i)=><line key={i} x1="0" y1={`${i*25}%`} x2="100%" y2={`${i*25}%`} stroke="#6644ff" strokeWidth="1"/>)}
        </svg>
        {/* Multiplier */}
        <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column"}}>
          {phase === "crashed" ? (
            <div style={{textAlign:"center"}}>
              <p style={{margin:0, color:"#ff3333", fontSize:48, fontWeight:900, textShadow:"0 0 30px #ff0000"}}>💥</p>
              <p style={{margin:0, color:"#ff4444", fontSize:22, fontWeight:900}}>FLEW AWAY!</p>
              <p style={{margin:0, color:"#ff6644", fontSize:16}}>{multiplier}x</p>
            </div>
          ) : (
            <div style={{textAlign:"center"}}>
              <p style={{margin:0, color:multColor, fontSize:52, fontWeight:900, textShadow:`0 0 30px ${multColor}`, fontFamily:"'Courier New', monospace", transition:"color 0.3s"}}>{multiplier.toFixed(2)}x</p>
              {phase === "cashed" && <p style={{margin:0, color:"#00ff88", fontSize:14, fontWeight:700}}>✅ CASHED OUT!</p>}
              {phase === "idle" && <p style={{margin:0, color:"#5544aa", fontSize:13}}>Waiting for next round...</p>}
            </div>
          )}
        </div>
        {/* Plane */}
        {phase === "flying" && (
          <div style={{position:"absolute", left:`${planeX}%`, top:`${planeY}%`, fontSize:28, transform:"rotate(-25deg)", transition:"left 0.1s, top 0.1s", filter:`drop-shadow(0 0 8px #9966ff)`}}>
            ✈️
          </div>
        )}
        {/* Trail */}
        {phase === "flying" && (
          <div style={{position:"absolute", left:`5%`, top:`80%`, width:`${planeX-5}%`, height:2, background:"linear-gradient(90deg,transparent,rgba(153,102,255,0.6))", borderRadius:1}} />
        )}
      </div>

      {/* Bet controls */}
      <div style={{padding:14, background:"#080818"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10}}>
          <div>
            <p style={{margin:"0 0 4px", color:"#6644aa", fontSize:11, fontWeight:600}}>BET AMOUNT (₹)</p>
            <input type="number" value={betAmt} onChange={e=>setBetAmt(e.target.value)} placeholder="100"
              disabled={phase==="flying"}
              style={{width:"100%", padding:"10px 12px", background:"#0f0f28", border:"2px solid #3300aa", borderRadius:8, color:"#fff", fontSize:16, fontWeight:700, boxSizing:"border-box", outline:"none"}}/>
          </div>
          <div>
            <p style={{margin:"0 0 4px", color:"#6644aa", fontSize:11, fontWeight:600}}>AUTO CASHOUT (x)</p>
            <input type="number" value={autoCash} onChange={e=>setAutoCash(e.target.value)} placeholder="2.00"
              disabled={phase==="flying"}
              style={{width:"100%", padding:"10px 12px", background:"#0f0f28", border:"2px solid #1a1a40", borderRadius:8, color:"#9966ff", fontSize:16, fontWeight:700, boxSizing:"border-box", outline:"none"}}/>
          </div>
        </div>
        <div style={{display:"flex", gap:6, marginBottom:10}}>
          {[100,200,500,1000].map(q=>(
            <button key={q} onClick={()=>setBetAmt(q.toString())} disabled={phase==="flying"}
              style={{flex:1, padding:"6px 0", background:"rgba(153,102,255,0.1)", border:"1px solid #3300aa", borderRadius:6, color:"#9966ff", fontWeight:700, fontSize:12, cursor:"pointer"}}>
              ₹{q}
            </button>
          ))}
        </div>
        {phase === "flying" ? (
          <button onClick={()=>cashOut(multRef.current)}
            style={{width:"100%", padding:16, background:"linear-gradient(135deg,#00aa44,#007730)", border:"none", borderRadius:12, color:"#fff", fontWeight:900, fontSize:16, cursor:"pointer", animation:"pulse 0.5s infinite"}}>
            💰 CASHOUT @ {multiplier.toFixed(2)}x = ₹{activeBet ? (activeBet*multiplier).toFixed(2) : "0.00"}
          </button>
        ) : (
          <button onClick={startRound} disabled={phase==="crashed"}
            style={{width:"100%", padding:16, background:phase==="cashed"?"#00aa44":"linear-gradient(135deg,#5500cc,#3300aa)", border:"none", borderRadius:12, color:"#fff", fontWeight:900, fontSize:16, cursor:"pointer", opacity:phase==="crashed"?0.5:1}}>
            {phase==="idle" ? "🚀 PLACE BET & FLY!" : phase==="cashed"?"✅ BET AGAIN!":"⏳ Next round..."}
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{padding:"0 14px 14px", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8}}>
        {[["Max Win","100x 🚀"],["Min Bet","₹10"],["Avg Crash","1.8x"]].map(([l,v])=>(
          <div key={l} style={{background:"rgba(85,0,204,0.1)", border:"1px solid #2a0066", borderRadius:8, padding:"8px 10px", textAlign:"center"}}>
            <p style={{margin:0, color:"#6644aa", fontSize:10}}>{l}</p>
            <p style={{margin:0, color:"#9966ff", fontWeight:800, fontSize:13}}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MINES GAME
// ═══════════════════════════════════════════════
function MinesGame({ wallet, setWallet, showToast, onBack }) {
  const SIZE = 5;
  const TOTAL = SIZE * SIZE;
  const [mineCount, setMineCount] = useState(3);
  const [revealed, setRevealed] = useState([]);
  const [mines, setMines] = useState([]);
  const [gameState, setGameState] = useState("idle"); // idle, playing, lost, won
  const [betAmt, setBetAmt] = useState("");
  const [clickCount, setClickCount] = useState(0);
  const [currentMult, setCurrentMult] = useState(1.0);
  const [activeBet, setActiveBet] = useState(null);
  const clickRef = useRef(0);

  const startGame = () => {
    if (!betAmt || parseFloat(betAmt) <= 0) { showToast("❌ Bet amount dalo!"); return; }
    if (parseFloat(betAmt) > wallet) { showToast("❌ Balance kam hai!"); return; }
    const bet = parseFloat(betAmt);
    setWallet(w => w - bet);
    setActiveBet(bet);
    setRevealed([]);
    setMines([]);
    clickRef.current = 0;
    setClickCount(0);
    setCurrentMult(1.0);
    setGameState("playing");
  };

  const handleCellClick = (idx) => {
    if (gameState !== "playing") return;
    if (revealed.includes(idx)) return;

    const isFirst = clickRef.current === 0;
    const isMine = shouldMineExplode(idx, clickRef.current);

    if (isMine && !isFirst) {
      // Hit a mine! Reveal random mine positions
      const minePositions = [];
      const available = Array.from({length:TOTAL}, (_,i)=>i).filter(i=>!revealed.includes(i));
      for (let i = available.length-1; i>0; i--) {
        const j=Math.floor(Math.random()*(i+1));
        [available[i],available[j]]=[available[j],available[i]];
      }
      for (let i=0;i<mineCount;i++) minePositions.push(available[i]);
      if (!minePositions.includes(idx)) minePositions[0] = idx;
      setMines(minePositions);
      setRevealed(prev => [...prev, idx]);
      setGameState("lost");
      showToast(`💥 MINE! ₹${activeBet} gaya!`);
      return;
    }

    const newRevealed = [...revealed, idx];
    setRevealed(newRevealed);
    clickRef.current += 1;
    const safeCount = clickRef.current;
    const mult = getMineMultiplier(safeCount, mineCount);
    setClickCount(safeCount);
    setCurrentMult(mult);

    // Check if all safe cells revealed
    if (safeCount === TOTAL - mineCount) {
      cashOut(mult);
    }
  };

  const cashOut = (mult) => {
    if (gameState !== "playing") return;
    const win = +(activeBet * (mult || currentMult)).toFixed(2);
    setWallet(w => w + win);
    showToast(`✅ Cashout! ₹${win} jeete! (${(mult||currentMult).toFixed(2)}x)`);
    setGameState("won");
    setActiveBet(null);
  };

  const resetGame = () => {
    setGameState("idle");
    setRevealed([]);
    setMines([]);
    setClickCount(0);
    setCurrentMult(1.0);
    setActiveBet(null);
    clickRef.current = 0;
  };

  const cellState = (idx) => {
    if (revealed.includes(idx)) {
      if (mines.includes(idx)) return "mine";
      return "safe";
    }
    return "hidden";
  };

  return (
    <div style={{background:"#030d03", minHeight:"100vh"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(90deg,#001500,#003300)", padding:"10px 14px", display:"flex", alignItems:"center", gap:10, borderBottom:"2px solid #00aa33"}}>
        <button onClick={onBack} style={{background:"none", border:"none", color:"#00aa33", fontSize:18, cursor:"pointer"}}>←</button>
        <span style={{fontSize:20}}>💎</span>
        <div>
          <h2 style={{margin:0, color:"#00ff88", fontWeight:900, fontSize:18}}>MINES</h2>
          <p style={{margin:0, color:"rgba(0,255,136,0.5)", fontSize:10}}>Find gems, avoid mines!</p>
        </div>
        <div style={{marginLeft:"auto", background:"rgba(0,170,51,0.15)", padding:"4px 10px", borderRadius:20, border:"1px solid #00aa33"}}>
          <span style={{color:"#f0c040", fontWeight:800}}>₹{wallet.toFixed(2)}</span>
        </div>
      </div>

      {/* Multiplier display */}
      <div style={{background:"#010d01", padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #0a2a0a"}}>
        <div>
          <p style={{margin:0, color:"#005500", fontSize:11}}>CURRENT MULTIPLIER</p>
          <p style={{margin:0, color:gameState==="lost"?"#ff4444":gameState==="won"?"#00ff88":"#00ff88", fontSize:32, fontWeight:900, fontFamily:"monospace"}}>
            {currentMult.toFixed(2)}x
          </p>
        </div>
        <div style={{textAlign:"right"}}>
          <p style={{margin:0, color:"#005500", fontSize:11}}>POTENTIAL WIN</p>
          <p style={{margin:0, color:"#f0c040", fontSize:20, fontWeight:800}}>
            ₹{activeBet ? (activeBet*currentMult).toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div style={{padding:"10px 14px", background:"#020d02"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10}}>
          <div>
            <p style={{margin:"0 0 4px", color:"#005500", fontSize:11, fontWeight:600}}>BET AMOUNT (₹)</p>
            <input type="number" value={betAmt} onChange={e=>setBetAmt(e.target.value)}
              disabled={gameState==="playing"}
              placeholder="100"
              style={{width:"100%", padding:"10px 12px", background:"#040d04", border:"2px solid #005500", borderRadius:8, color:"#fff", fontSize:16, fontWeight:700, boxSizing:"border-box", outline:"none"}}/>
          </div>
          <div>
            <p style={{margin:"0 0 4px", color:"#005500", fontSize:11, fontWeight:600}}>MINES COUNT</p>
            <select value={mineCount} onChange={e=>setMineCount(parseInt(e.target.value))}
              disabled={gameState==="playing"}
              style={{width:"100%", padding:"10px 12px", background:"#040d04", border:"2px solid #005500", borderRadius:8, color:"#00ff88", fontSize:16, fontWeight:700, boxSizing:"border-box", outline:"none"}}>
              {[1,2,3,5,7,10,15,20].map(n=><option key={n} value={n}>{n} Mines</option>)}
            </select>
          </div>
        </div>
        <div style={{display:"flex", gap:6, marginBottom:10}}>
          {[100,200,500,1000].map(q=>(
            <button key={q} onClick={()=>setBetAmt(q.toString())} disabled={gameState==="playing"}
              style={{flex:1, padding:"6px 0", background:"rgba(0,170,51,0.1)", border:"1px solid #005500", borderRadius:6, color:"#00aa33", fontWeight:700, fontSize:12, cursor:"pointer"}}>
              ₹{q}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{padding:"0 14px 14px"}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8}}>
          {Array.from({length:TOTAL}, (_,i) => {
            const cs = cellState(i);
            return (
              <div key={i} onClick={()=>handleCellClick(i)}
                style={{
                  aspectRatio:"1", borderRadius:10,
                  background: cs==="mine" ? "linear-gradient(135deg,#3a0000,#660000)" :
                              cs==="safe" ? "linear-gradient(135deg,#003300,#005500)" :
                              gameState==="playing" ? "linear-gradient(135deg,#0a1a0a,#112211)" : "#0a0a0a",
                  border: cs==="mine" ? "2px solid #ff4444" :
                          cs==="safe" ? "2px solid #00aa33" : "2px solid #1a2a1a",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  cursor: gameState==="playing" && cs==="hidden" ? "pointer" : "default",
                  fontSize:26,
                  transition:"all 0.2s",
                  transform: cs!=="hidden" ? "scale(0.95)" : gameState==="playing"?"scale(1)":"scale(0.9)",
                  boxShadow: cs==="safe" ? "0 0 10px rgba(0,170,51,0.4)" : cs==="mine" ? "0 0 10px rgba(255,68,68,0.4)" : "none"
                }}>
                {cs === "mine" ? "💣" : cs === "safe" ? "💎" : gameState==="playing" ? "❓" : "⬛"}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action button */}
      <div style={{padding:"0 14px 14px"}}>
        {gameState === "idle" || gameState === "won" || gameState === "lost" ? (
          <button onClick={gameState==="idle"?startGame:resetGame}
            style={{width:"100%", padding:16, background:"linear-gradient(135deg,#00aa33,#007722)", border:"none", borderRadius:12, color:"#fff", fontWeight:900, fontSize:16, cursor:"pointer"}}>
            {gameState==="idle" ? "💎 START GAME!" : gameState==="won" ? "🎉 PLAY AGAIN!" : "😢 TRY AGAIN!"}
          </button>
        ) : (
          <button onClick={()=>cashOut(currentMult)}
            style={{width:"100%", padding:16, background:"linear-gradient(135deg,#b8860b,#d4a017)", border:"none", borderRadius:12, color:"#fff", fontWeight:900, fontSize:16, cursor:"pointer"}}>
            💰 CASHOUT ₹{activeBet ? (activeBet*currentMult).toFixed(2) : "0.00"} ({currentMult.toFixed(2)}x)
          </button>
        )}
      </div>

      {/* Info */}
      <div style={{padding:"0 14px 20px", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8}}>
        {[["Safe Cells",`${TOTAL-mineCount}`],["Mines",`${mineCount}`],["Safe Picks",`${clickCount}`]].map(([l,v])=>(
          <div key={l} style={{background:"rgba(0,85,0,0.1)", border:"1px solid #002200", borderRadius:8, padding:"8px 10px", textAlign:"center"}}>
            <p style={{margin:0, color:"#005500", fontSize:10}}>{l}</p>
            <p style={{margin:0, color:"#00aa33", fontWeight:800, fontSize:16}}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// BET SLIP
// ═══════════════════════════════════════════════
function BetSlip({ bet, wallet, onConfirm, onClose }) {
  const [amt, setAmt] = useState("");
  const profit = amt ? (parseFloat(amt) * (bet.odds - 1)).toFixed(2) : "0.00";
  const liability = bet.type === "lay" && amt ? (parseFloat(amt) * (bet.odds - 1)).toFixed(2) : "0.00";
  const quickAmts = [100,200,500,1000,2000,5000];
  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"flex-end",justifyContent:"center",background:"rgba(0,0,0,0.8)"}}>
      <div style={{width:"100%",maxWidth:480,background:"#111",borderRadius:"20px 20px 0 0",padding:0,overflow:"hidden",boxShadow:"0 -10px 40px rgba(0,0,0,0.8)"}}>
        <div style={{background:bet.type==="back"?"linear-gradient(135deg,#1a4a90,#4a90d9)":"linear-gradient(135deg,#a05020,#f4a261)",padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <p style={{margin:0,color:"#fff",fontWeight:900,fontSize:15}}>{bet.team}</p>
            <p style={{margin:0,color:"rgba(255,255,255,0.8)",fontSize:12}}>{bet.match} • {bet.type==="back"?"BACK":"LAY"}</p>
          </div>
          <button onClick={onClose} style={{background:"rgba(0,0,0,0.3)",border:"none",color:"#fff",fontSize:20,cursor:"pointer",width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,padding:"14px 16px",background:"#0a0a0a"}}>
          <div>
            <p style={{margin:"0 0 4px",color:"#888",fontSize:11,fontWeight:600}}>ODDS</p>
            <div style={{background:bet.type==="back"?"rgba(74,144,217,0.2)":"rgba(244,162,97,0.2)",padding:"10px 12px",borderRadius:8,textAlign:"center",border:`2px solid ${bet.type==="back"?"#4a90d9":"#f4a261"}`}}>
              <span style={{color:bet.type==="back"?"#4a90d9":"#f4a261",fontWeight:900,fontSize:22}}>{bet.odds}</span>
            </div>
          </div>
          <div>
            <p style={{margin:"0 0 4px",color:"#888",fontSize:11,fontWeight:600}}>STAKE (₹)</p>
            <input type="number" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="Enter amount"
              style={{width:"100%",padding:"10px 12px",background:"#1a1a1a",border:"2px solid #b8860b",borderRadius:8,color:"#fff",fontSize:16,fontWeight:700,boxSizing:"border-box",outline:"none"}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:6,padding:"0 16px 12px",flexWrap:"wrap"}}>
          {quickAmts.map(q=>(
            <button key={q} onClick={()=>setAmt(prev=>(parseFloat(prev||0)+q).toString())}
              style={{padding:"6px 12px",background:"rgba(184,134,11,0.15)",border:"1px solid #b8860b",borderRadius:6,color:"#f0c040",fontWeight:700,cursor:"pointer",fontSize:12}}>+₹{q}</button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",borderTop:"1px solid #222",borderBottom:"1px solid #222"}}>
          <div style={{padding:"12px 16px",borderRight:"1px solid #222"}}>
            <p style={{margin:0,color:"#888",fontSize:11}}>Profit</p>
            <p style={{margin:0,color:"#00cc44",fontWeight:900,fontSize:18}}>₹{profit}</p>
          </div>
          <div style={{padding:"12px 16px"}}>
            <p style={{margin:0,color:"#888",fontSize:11}}>{bet.type==="lay"?"Liability":"Loss"}</p>
            <p style={{margin:0,color:"#ff4444",fontWeight:900,fontSize:18}}>₹{bet.type==="lay"?liability:amt||"0.00"}</p>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,padding:16}}>
          <button onClick={onClose} style={{padding:14,background:"#222",border:"1px solid #444",borderRadius:10,color:"#ccc",fontWeight:700,fontSize:14,cursor:"pointer"}}>CANCEL</button>
          <button onClick={()=>{if(amt&&parseFloat(amt)>0)onConfirm(parseFloat(amt),bet.odds,bet.type)}}
            style={{padding:14,background:"linear-gradient(135deg,#b8860b,#d4a017)",border:"none",borderRadius:10,color:"#fff",fontWeight:900,fontSize:14,cursor:"pointer"}}>PLACE BET</button>
        </div>
        <p style={{textAlign:"center",color:"#555",fontSize:11,margin:"0 0 16px"}}>Wallet: ₹{wallet.toLocaleString("en-IN")}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// BOOKMAKER TABLE
// ═══════════════════════════════════════════════
function BookmakerTable({ teams, onBet }) {
  const [liveOdds, setLiveOdds] = useState(teams);
  useEffect(()=>{
    const iv = setInterval(()=>{
      setLiveOdds(prev=>prev.map(t=>({
        ...t,
        back:[Math.max(100,t.back[0]+(Math.random()>0.5?10:-10)),t.back[1]],
        lay:[t.lay[0]?Math.max(100,t.lay[0]+(Math.random()>0.5?10:-10)):0, t.lay[1]],
      })));
    },3000);
    return()=>clearInterval(iv);
  },[]);
  return (
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead>
          <tr style={{background:"#1a2a2a"}}>
            <th style={{padding:"8px 12px",textAlign:"left",color:"#aaa",fontWeight:600,fontSize:11}}>Min:100 Max:50k</th>
            {["","BACK","","LAY","",""].map((h,i)=>(
              <th key={i} style={{padding:"8px 4px",textAlign:"center",color:i<=2?"#4a90d9":"#f4a261",fontWeight:700,fontSize:11,width:60}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {liveOdds.map((team,i)=>(
            <tr key={i} style={{borderBottom:"1px solid #1a1a1a",background:i%2===0?"#111":"#0d0d0d"}}>
              <td style={{padding:"10px 12px",color:"#ddd",fontSize:13,fontWeight:500}}>{team.name}</td>
              <td style={{textAlign:"center",padding:"4px"}}>
                <div style={{background:"#1a3a5c",borderRadius:4,padding:"6px 4px",minWidth:52}}><div style={{color:"#4a90d9",fontSize:11}}>-</div><div style={{color:"#888",fontSize:10}}>0.0</div></div>
              </td>
              <td style={{textAlign:"center",padding:"4px"}}>
                <div style={{background:"#1a3a5c",borderRadius:4,padding:"6px 4px",minWidth:52}}><div style={{color:"#4a90d9",fontSize:11}}>-</div><div style={{color:"#888",fontSize:10}}>0.0</div></div>
              </td>
              <td style={{textAlign:"center",padding:"4px"}} onClick={()=>team.back[0]&&onBet({team:team.name,odds:team.back[0],type:"back",match:"IPL Cup Winner"})}>
                <div style={{background:team.back[0]?"#4a90d9":"#1a2a3a",borderRadius:4,padding:"6px 4px",minWidth:52,cursor:team.back[0]?"pointer":"default",transition:"all 0.2s"}}>
                  <div style={{color:"#fff",fontSize:team.back[0]>999?11:13,fontWeight:700}}>{team.back[0]||"-"}</div>
                  <div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>50k</div>
                </div>
              </td>
              <td style={{textAlign:"center",padding:"4px"}} onClick={()=>team.lay[0]&&onBet({team:team.name,odds:team.lay[0],type:"lay",match:"IPL Cup Winner"})}>
                <div style={{background:team.lay[0]?"#f4a261":"#3a2a1a",borderRadius:4,padding:"6px 4px",minWidth:52,cursor:team.lay[0]?"pointer":"default",transition:"all 0.2s"}}>
                  <div style={{color:team.lay[0]?"#fff":"#555",fontSize:team.lay[0]>999?11:13,fontWeight:700}}>{team.lay[0]||"-"}</div>
                  <div style={{color:team.lay[0]?"rgba(255,255,255,0.7)":"#333",fontSize:10}}>{team.lay[0]?"50k":"0.0"}</div>
                </div>
              </td>
              <td style={{textAlign:"center",padding:"4px"}}>
                <div style={{background:"#3a1a0a",borderRadius:4,padding:"6px 4px",minWidth:52}}><div style={{color:"#f4a261",fontSize:11}}>-</div><div style={{color:"#888",fontSize:10}}>0.0</div></div>
              </td>
              <td style={{textAlign:"center",padding:"4px"}}>
                <div style={{background:"#3a1a0a",borderRadius:4,padding:"6px 4px",minWidth:52}}><div style={{color:"#f4a261",fontSize:11}}>-</div><div style={{color:"#888",fontSize:10}}>0.0</div></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MATCH ROW
// ═══════════════════════════════════════════════
function MatchRow({ match, onBet, onOpen }) {
  const [odds, setOdds] = useState(match.odds);
  const prevOdds = useRef(match.odds);
  const [flash, setFlash] = useState({});
  useEffect(()=>{
    const iv = setInterval(()=>{
      const delta=()=>(Math.random()-0.5)*0.04;
      const newOdds = {
        back1:Math.max(1.01,+(odds.back1+delta()).toFixed(2)),
        lay1: Math.max(1.01,+(odds.lay1+delta()).toFixed(2)),
        backX:odds.backX?Math.max(1.01,+(odds.backX+delta()).toFixed(2)):0,
        layX: odds.layX?Math.max(1.01,+(odds.layX+delta()).toFixed(2)):0,
        back2:Math.max(1.01,+(odds.back2+delta()).toFixed(2)),
        lay2: Math.max(1.01,+(odds.lay2+delta()).toFixed(2)),
      };
      const f={};
      if(newOdds.back1!==prevOdds.current.back1)f.b1=newOdds.back1>prevOdds.current.back1?"up":"dn";
      if(newOdds.back2!==prevOdds.current.back2)f.b2=newOdds.back2>prevOdds.current.back2?"up":"dn";
      setFlash(f); setTimeout(()=>setFlash({}),600);
      prevOdds.current=newOdds; setOdds(newOdds);
    },3500);
    return()=>clearInterval(iv);
  },[]);

  const OddBtn=({val,type,team,side,flashKey})=>(
    <div onClick={()=>val&&onBet({team,odds:val,type,match:`${match.t1} v ${match.t2}`})}
      style={{flex:1,background:side==="back"?(flash[flashKey]?"#6ab0ff":"#4a90d9"):(flash[flashKey]?"#ffb070":"#f4a261"),
        borderRadius:4,padding:"8px 4px",textAlign:"center",cursor:val?"pointer":"default",minWidth:52,
        transition:"background 0.3s",opacity:val?1:0.4}}>
      <div style={{color:"#fff",fontWeight:700,fontSize:14}}>{val||"-"}</div>
      <div style={{color:"rgba(255,255,255,0.7)",fontSize:10}}>0</div>
    </div>
  );

  const sportEmoji = match.sport==="cricket"?"🏏":match.sport==="football"?"⚽":"🎾";

  return (
    <div style={{borderBottom:"2px solid #111",background:"#0d0d0d"}}>
      <div onClick={onOpen} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",cursor:"pointer",background:"#111"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {match.live&&<span style={{background:"#cc0000",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4,animation:"pulse 1s infinite"}}>● LIVE</span>}
          <div>
            <p style={{margin:0,color:"#ddd",fontWeight:600,fontSize:13}}>{sportEmoji} {match.league}</p>
            <p style={{margin:0,color:"#666",fontSize:11}}>{match.live && match.score1 ? match.score1 : match.date}</p>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{color:"#555",fontSize:18}}>›</span>
        </div>
      </div>
      <div style={{padding:"6px 12px 10px"}}>
        <div style={{display:"grid",gridTemplateColumns:`1fr ${match.odds.backX?"1fr ":""}1fr`,gap:8}}>
          {/* Team 1 */}
          <div>
            <p style={{margin:"0 0 4px",color:"#aaa",fontSize:12,fontWeight:600,textAlign:"center"}}>{match.t1}</p>
            <div style={{display:"flex",gap:3}}>
              <OddBtn val={odds.back1} type="back" team={match.t1} side="back" flashKey="b1"/>
              <OddBtn val={odds.lay1} type="lay" team={match.t1} side="lay" flashKey="b1"/>
            </div>
          </div>
          {/* Draw */}
          {match.odds.backX>0&&(
            <div>
              <p style={{margin:"0 0 4px",color:"#aaa",fontSize:12,fontWeight:600,textAlign:"center"}}>Draw</p>
              <div style={{display:"flex",gap:3}}>
                <OddBtn val={odds.backX} type="back" team="Draw" side="back" flashKey="bx"/>
                <OddBtn val={odds.layX} type="lay" team="Draw" side="lay" flashKey="bx"/>
              </div>
            </div>
          )}
          {/* Team 2 */}
          <div>
            <p style={{margin:"0 0 4px",color:"#aaa",fontSize:12,fontWeight:600,textAlign:"center"}}>{match.t2}</p>
            <div style={{display:"flex",gap:3}}>
              <OddBtn val={odds.back2} type="back" team={match.t2} side="back" flashKey="b2"/>
              <OddBtn val={odds.lay2} type="lay" team={match.t2} side="lay" flashKey="b2"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// DEPOSIT MODAL
// ═══════════════════════════════════════════════
function DepositModal({ qrImage, onClose, onSubmit }) {
  const [amt, setAmt] = useState("");
  const [utr, setUtr] = useState("");
  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{width:"100%",maxWidth:480,background:"#111",borderRadius:"20px 20px 0 0",padding:20,maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h2 style={{margin:0,color:"#f0c040",fontSize:18}}>💰 Deposit</h2>
          <button onClick={onClose} style={{background:"#222",border:"none",color:"#fff",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <div style={{textAlign:"center",marginBottom:16,background:"#1a1a1a",borderRadius:12,padding:16}}>
          {qrImage
            ?<img src={qrImage} alt="QR" style={{width:180,height:180,objectFit:"contain",borderRadius:8,background:"#fff",padding:8}}/>
            :<div style={{width:180,height:180,margin:"0 auto",background:"rgba(184,134,11,0.1)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8,border:"2px dashed #b8860b"}}>
              <span style={{fontSize:48}}>📱</span>
              <p style={{color:"#888",fontSize:12,margin:0}}>Scan to Pay</p>
            </div>}
          <p style={{color:"#888",fontSize:12,margin:"10px 0 0"}}>Scan QR code ya UPI ID par send karo</p>
          <div style={{background:"rgba(184,134,11,0.1)",border:"1px solid #b8860b",borderRadius:8,padding:"8px 12px",marginTop:8}}>
            <p style={{margin:0,color:"#f0c040",fontWeight:700,fontSize:13}}>UPI: betkaro@upi</p>
          </div>
        </div>
        <div style={{display:"grid",gap:10,marginBottom:14}}>
          {[["Amount (₹)","number",amt,setAmt,"1000"],["UTR/Reference Number","text",utr,setUtr,"Enter transaction ID"]].map(([l,t,v,s,p])=>(
            <div key={l}>
              <p style={{margin:"0 0 4px",color:"#888",fontSize:12}}>{l}</p>
              <input type={t} value={v} onChange={e=>s(e.target.value)} placeholder={p}
                style={{width:"100%",padding:"10px 12px",background:"#1a1a1a",border:"1px solid #333",borderRadius:8,color:"#fff",fontSize:14,boxSizing:"border-box",outline:"none"}}/>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {[500,1000,2000,5000].map(q=>(
            <button key={q} onClick={()=>setAmt(q.toString())}
              style={{flex:1,padding:"8px 0",background:"rgba(184,134,11,0.1)",border:"1px solid #b8860b",borderRadius:8,color:"#f0c040",fontWeight:700,fontSize:12,cursor:"pointer"}}>
              ₹{q}
            </button>
          ))}
        </div>
        <button onClick={()=>{if(amt&&utr){onSubmit(parseFloat(amt),utr);onClose();}}}
          style={{width:"100%",padding:14,background:"linear-gradient(135deg,#b8860b,#d4a017)",border:"none",borderRadius:12,color:"#fff",fontWeight:900,fontSize:15,cursor:"pointer"}}>SUBMIT DEPOSIT REQUEST</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// WITHDRAW MODAL
// ═══════════════════════════════════════════════
function WithdrawModal({ wallet, onClose, onSubmit }) {
  const [form, setForm] = useState({amount:"",bank:"",account:"",ifsc:"",name:""});
  const fields=[["Amount (₹)","amount","number"],["Bank Name","bank","text"],["Account Number","account","number"],["IFSC Code","ifsc","text"],["Account Holder Name","name","text"]];
  return (
    <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.9)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{width:"100%",maxWidth:480,background:"#111",borderRadius:"20px 20px 0 0",padding:20,maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h2 style={{margin:0,color:"#f0c040",fontSize:18}}>🏦 Withdraw</h2>
          <button onClick={onClose} style={{background:"#222",border:"none",color:"#fff",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <div style={{background:"rgba(184,134,11,0.1)",border:"1px solid #b8860b",borderRadius:10,padding:"10px 14px",marginBottom:14}}>
          <p style={{margin:0,color:"#888",fontSize:11}}>Available Balance</p>
          <p style={{margin:0,color:"#f0c040",fontWeight:900,fontSize:20}}>₹{wallet.toLocaleString("en-IN")}</p>
        </div>
        {fields.map(([l,k,t])=>(
          <div key={k} style={{marginBottom:10}}>
            <p style={{margin:"0 0 4px",color:"#888",fontSize:12}}>{l}</p>
            <input type={t} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={l}
              style={{width:"100%",padding:"10px 12px",background:"#1a1a1a",border:"1px solid #333",borderRadius:8,color:"#fff",fontSize:14,boxSizing:"border-box",outline:"none"}}/>
          </div>
        ))}
        <button onClick={()=>{if(form.amount&&form.bank&&form.account&&form.ifsc&&form.name){onSubmit(form);onClose();}}}
          style={{width:"100%",padding:14,background:"linear-gradient(135deg,#1a7a1a,#145214)",border:"none",borderRadius:12,color:"#fff",fontWeight:900,fontSize:15,cursor:"pointer",marginTop:4}}>SUBMIT WITHDRAWAL</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════
function AdminPanel({ deposits, withdrawals, onApprove, onReject, onMarkPaid, onQRUpload, qrImage, matches, onLogout }) {
  const [tab, setTab] = useState("dashboard");
  const fileRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const tabs=[["dashboard","📊"],["deposits","💰"],["withdrawals","🏦"],["scanner","📷"],["odds","📈"],["users","👥"]];
  return (
    <div style={{minHeight:"100vh",background:"#060606",color:"#fff",fontFamily:"'Segoe UI',sans-serif"}}>
      <div style={{background:"linear-gradient(90deg,#1a0800,#2d1500)",borderBottom:"2px solid #b8860b",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>🔐</span>
          <div>
            <h1 style={{margin:0,color:"#f0c040",fontSize:18,fontWeight:900}}>BETKARO ADMIN</h1>
            <p style={{margin:0,color:"#886600",fontSize:10}}>Control Panel v3.0</p>
          </div>
        </div>
        <button onClick={onLogout} style={{padding:"8px 16px",background:"#cc2200",border:"none",borderRadius:8,color:"#fff",cursor:"pointer",fontWeight:700,fontSize:12}}>LOGOUT</button>
      </div>
      <div style={{display:"flex",gap:0,borderBottom:"1px solid #222",overflowX:"auto"}}>
        {tabs.map(([k,ic])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"10px 14px",background:tab===k?"rgba(184,134,11,0.2)":"transparent",border:"none",color:tab===k?"#f0c040":"#888",cursor:"pointer",fontWeight:700,fontSize:12,whiteSpace:"nowrap",borderBottom:tab===k?"2px solid #f0c040":"2px solid transparent"}}>
            {ic} {k.toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{padding:16,maxWidth:900,margin:"0 auto"}}>
        {tab==="dashboard"&&(
          <div>
            <h2 style={{color:"#f0c040",marginBottom:16}}>📊 Overview</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:20}}>
              {[["Total Users","1,247","👥"],["Active Bets","389","🎯"],["Pending Deposits",deposits.filter(d=>d.status==="pending").length,"💰"],["Pending Withdrawals",withdrawals.filter(w=>w.status==="pending").length,"🏦"],["Today Revenue","₹2,34,500","📈"]].map(([l,v,ic])=>(
                <div key={l} style={{background:"rgba(184,134,11,0.08)",border:"1px solid rgba(184,134,11,0.2)",borderRadius:12,padding:14}}>
                  <p style={{margin:"0 0 4px",color:"#886600",fontSize:10,fontWeight:600}}>{ic} {l}</p>
                  <p style={{margin:0,color:"#f0c040",fontSize:20,fontWeight:900}}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{background:"#0d0d0d",borderRadius:12,padding:16,border:"1px solid #1a1a1a"}}>
              <h3 style={{color:"#f0c040",marginTop:0}}>Pending Actions</h3>
              {deposits.filter(d=>d.status==="pending").map(d=>(
                <div key={d.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #1a1a1a"}}>
                  <div><p style={{margin:0,color:"#fff",fontWeight:600}}>{d.user} — ₹{d.amount.toLocaleString()}</p><p style={{margin:0,color:"#666",fontSize:12}}>UTR: {d.utr}</p></div>
                  <button onClick={()=>onApprove(d.id)} style={{padding:"8px 14px",background:"#00cc44",border:"none",borderRadius:8,color:"#fff",cursor:"pointer",fontWeight:700,fontSize:12}}>✅ Approve</button>
                </div>
              ))}
              {deposits.filter(d=>d.status==="pending").length===0&&<p style={{color:"#444"}}>No pending deposits.</p>}
            </div>
          </div>
        )}
        {tab==="deposits"&&(
          <div>
            <h2 style={{color:"#f0c040"}}>💰 Deposit Requests</h2>
            {deposits.map(d=>(
              <div key={d.id} style={{background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:12,padding:14,marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <p style={{margin:"0 0 4px",color:"#fff",fontWeight:700}}>👤 {d.user}</p>
                    <p style={{margin:"0 0 4px",color:"#f0c040",fontSize:20,fontWeight:900}}>₹{d.amount.toLocaleString()}</p>
                    <p style={{margin:0,color:"#555",fontSize:12}}>UTR: <b style={{color:"#aaa"}}>{d.utr}</b> | {d.date}</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <span style={{display:"block",padding:"3px 10px",background:d.status==="approved"?"#003300":d.status==="rejected"?"#330000":"#332200",border:`1px solid ${d.status==="approved"?"#00aa33":d.status==="rejected"?"#aa0000":"#b8860b"}`,borderRadius:20,fontSize:11,color:d.status==="approved"?"#00ee44":d.status==="rejected"?"#ff4444":"#f0c040",marginBottom:8}}>{d.status.toUpperCase()}</span>
                    {d.status==="pending"&&<div style={{display:"flex",gap:6}}>
                      <button onClick={()=>onApprove(d.id)} style={{padding:"6px 12px",background:"#00aa33",border:"none",borderRadius:6,color:"#fff",cursor:"pointer",fontWeight:700,fontSize:12}}>✅</button>
                      <button onClick={()=>onReject(d.id)} style={{padding:"6px 12px",background:"#cc0000",border:"none",borderRadius:6,color:"#fff",cursor:"pointer",fontWeight:700,fontSize:12}}>❌</button>
                    </div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="withdrawals"&&(
          <div>
            <h2 style={{color:"#f0c040"}}>🏦 Withdrawal Requests</h2>
            {withdrawals.length===0&&<p style={{color:"#444"}}>Koi withdrawal request nahi hai.</p>}
            {withdrawals.map(w=>(
              <div key={w.id} style={{background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:12,padding:14,marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <p style={{margin:"0 0 4px",color:"#fff",fontWeight:700}}>👤 {w.user}</p>
                    <p style={{margin:"0 0 4px",color:"#f0c040",fontSize:20,fontWeight:900}}>₹{w.amount.toLocaleString()}</p>
                    <p style={{margin:"0 0 2px",color:"#555",fontSize:12}}>Bank: <b style={{color:"#aaa"}}>{w.bank}</b> | A/C: {w.account}</p>
                    <p style={{margin:0,color:"#555",fontSize:12}}>IFSC: {w.ifsc} | {w.date}</p>
                  </div>
                  <div>
                    <span style={{display:"block",padding:"3px 10px",background:w.status==="paid"?"#003300":"#332200",border:`1px solid ${w.status==="paid"?"#00aa33":"#b8860b"}`,borderRadius:20,fontSize:11,color:w.status==="paid"?"#00ee44":"#f0c040",marginBottom:8}}>{w.status.toUpperCase()}</span>
                    {w.status==="pending"&&<button onClick={()=>onMarkPaid(w.id)} style={{padding:"6px 14px",background:"#00aa33",border:"none",borderRadius:6,color:"#fff",cursor:"pointer",fontWeight:700,fontSize:12}}>✅ Mark Paid</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="scanner"&&(
          <div>
            <h2 style={{color:"#f0c040"}}>📷 QR Scanner</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {/* Current QR */}
              <div style={{background:"rgba(184,134,11,0.06)",border:"2px dashed #b8860b",borderRadius:16,padding:16,textAlign:"center"}}>
                <h3 style={{color:"#f0c040",marginTop:0}}>Current QR</h3>
                {qrImage
                  ?<img src={qrImage} alt="QR" style={{width:160,height:160,objectFit:"contain",borderRadius:10,background:"#fff",padding:6}}/>
                  :<div style={{width:160,height:160,margin:"0 auto",background:"rgba(184,134,11,0.1)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:6}}>
                    <span style={{fontSize:40}}>📷</span>
                    <p style={{color:"#555",fontSize:12,margin:0}}>No QR uploaded</p>
                  </div>}
                {qrImage&&<p style={{color:"#00cc44",fontSize:12,margin:"8px 0 0",fontWeight:700}}>✅ QR Active!</p>}
              </div>
              {/* Upload New QR */}
              <div style={{background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:16,padding:16}}>
                <h3 style={{color:"#fff",marginTop:0}}>Upload New QR</h3>
                <p style={{color:"#888",fontSize:12,marginTop:0}}>JPG, PNG supported.</p>
                <input ref={fileRef} type="file" accept="image/*" onChange={e=>{
                  const f=e.target.files[0];
                  if(f){
                    setSelectedFile(f);
                    setPreviewUrl(URL.createObjectURL(f));
                  }
                }} style={{display:"none"}}/>
                {/* Preview */}
                {previewUrl&&(
                  <div style={{marginBottom:10,textAlign:"center"}}>
                    <p style={{color:"#b8860b",fontSize:11,margin:"0 0 6px",fontWeight:700}}>📋 Selected — Preview:</p>
                    <img src={previewUrl} alt="Preview" style={{width:120,height:120,objectFit:"contain",borderRadius:8,background:"#fff",padding:4,border:"2px solid #b8860b"}}/>
                  </div>
                )}
                <button onClick={()=>{ setPreviewUrl(null); setSelectedFile(null); fileRef.current.click(); }}
                  style={{width:"100%",padding:10,background:"rgba(184,134,11,0.2)",border:"2px solid #b8860b",borderRadius:10,color:"#f0c040",fontWeight:800,fontSize:13,cursor:"pointer",marginBottom:8}}>
                  📁 SELECT IMAGE
                </button>
                <button
                  disabled={!selectedFile||uploading}
                  onClick={async()=>{
                    if(!selectedFile)return;
                    setUploading(true);
                    await onQRUpload(selectedFile);
                    setUploading(false);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  style={{width:"100%",padding:12,background:selectedFile?"linear-gradient(135deg,#00aa33,#007722)":"#1a1a1a",border:"none",borderRadius:10,color:selectedFile?"#fff":"#444",fontWeight:900,fontSize:14,cursor:selectedFile?"pointer":"not-allowed",transition:"all 0.3s"}}>
                  {uploading?"⏳ Uploading...":selectedFile?"⬆️ UPLOAD QR":"⬆️ UPLOAD QR"}
                </button>
                {!selectedFile&&<p style={{color:"#555",fontSize:11,margin:"6px 0 0",textAlign:"center"}}>Pehle image select karo</p>}
              </div>
            </div>
          </div>
        )}
        {tab==="odds"&&(
          <div>
            <h2 style={{color:"#f0c040"}}>📈 Odds Control</h2>
            {matches.map(m=>(
              <div key={m.id} style={{background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:12,padding:14,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <p style={{margin:0,color:"#fff",fontWeight:700}}>{m.t1} v {m.t2}</p>
                  {m.live&&<span style={{background:"#cc0000",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10}}>LIVE</span>}
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {[["Back "+m.t1,"back1"],["Lay "+m.t1,"lay1"],["Back "+m.t2,"back2"],["Lay "+m.t2,"lay2"]].map(([l,k])=>(
                    <div key={k}>
                      <p style={{margin:"0 0 4px",color:"#888",fontSize:10}}>{l}</p>
                      <input type="number" step="0.01" defaultValue={m.odds[k]}
                        style={{padding:"8px 10px",background:"#1a1a1a",border:"1px solid #333",borderRadius:8,color:k.startsWith("back")?"#4a90d9":"#f4a261",fontWeight:700,width:80,outline:"none"}}/>
                    </div>
                  ))}
                  <button style={{alignSelf:"flex-end",padding:"8px 14px",background:"#b8860b",border:"none",borderRadius:8,color:"#fff",fontWeight:800,cursor:"pointer",fontSize:12}}>UPDATE</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="users"&&(
          <div>
            <h2 style={{color:"#f0c040"}}>👥 Users</h2>
            {[{u:"demo123",bal:0,bets:2,joined:"25/04/2026"},{u:"rahul99",bal:5230,bets:15,joined:"20/04/2026"},{u:"priya_bet",bal:1200,bets:7,joined:"18/04/2026"}].map(u=>(
              <div key={u.u} style={{background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:12,padding:14,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{margin:"0 0 4px",color:"#fff",fontWeight:700}}>👤 {u.u}</p>
                  <p style={{margin:0,color:"#888",fontSize:12}}>Balance: <b style={{color:"#f0c040"}}>₹{u.bal.toLocaleString()}</b> | Bets: {u.bets} | Joined: {u.joined}</p>
                </div>
                <button style={{padding:"6px 14px",background:"#1a0000",border:"1px solid #440000",borderRadius:8,color:"#ff4444",fontWeight:700,cursor:"pointer",fontSize:12}}>BLOCK</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════
export default function Betkaro() {
  const [page, setPage] = useState("login");
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"
  const [user, setUser] = useState(null);       // username string
  const [userId, setUserId] = useState(null);   // supabase user id
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginForm, setLoginForm] = useState({u:"",p:""});
  const [signupForm, setSignupForm] = useState({u:"",email:"",p:"",cp:""});
  const [loginErr, setLoginErr] = useState("");
  const [signupErr, setSignupErr] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [wallet, setWalletState] = useState(0);
  const [mainTab, setMainTab] = useState("INPLAY");
  const [sportTab, setSportTab] = useState("cricket");
  const [betSlip, setBetSlip] = useState(null);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [deposits, setDeposits] = useState([
    {id:"D001",user:"demo123",amount:2000,utr:"UTR123456789012",date:"25/04/2026",status:"pending"},
    {id:"D002",user:"rahul99",amount:5000,utr:"UTR987654321098",date:"24/04/2026",status:"approved"},
  ]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [bets, setBets] = useState([]);
  const [toast, setToast] = useState("");
  const [openMatch, setOpenMatch] = useState(null);
  const [matchViewTab, setMatchViewTab] = useState("ODDS");
  const [casinoGame, setCasinoGame] = useState(null);
  const [showScoreboard, setShowScoreboard] = useState(false);

  const showToast=(msg,dur=3000)=>{setToast(msg);setTimeout(()=>setToast(""),dur);};

  // ─── Wallet: save to Supabase whenever it changes ───
  const setWallet = useCallback(async (valOrFn) => {
    setWalletState(prev => {
      const next = typeof valOrFn === "function" ? valOrFn(prev) : valOrFn;
      if (userId) {
        supabase.from("profiles").update({ wallet_balance: next }).eq("id", userId).then(() => {});
      }
      return next;
    });
  }, [userId]);

  // ─── On mount: check existing session & load QR ───
  useEffect(() => {
    // Check if user already logged in
    supabase.auth.getSession().then(({ data:{ session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      }
    });
    // Load QR from admin_settings
    loadQR();
  }, []);

  const loadQR = async () => {
    try {
      const { data } = await supabase.from("admin_settings").select("qr_url").eq("id", 1).single();
      if (data?.qr_url) setQrImage(data.qr_url);
    } catch {}
  };

  const loadUserProfile = async (supaUser) => {
    // Fetch or create profile row
    let { data: profile } = await supabase
      .from("profiles").select("*").eq("id", supaUser.id).single();
    if (!profile) {
      const username = supaUser.email.split("@")[0];
      await supabase.from("profiles").insert({ id: supaUser.id, username, email: supaUser.email, wallet_balance: 0 });
      profile = { wallet_balance: 0, username };
    }
    setUserId(supaUser.id);
    setUser(profile.username);
    setWalletState(profile.wallet_balance || 0);
    // Load bets
    const { data: betRows } = await supabase.from("bets").select("*").eq("user_id", supaUser.id).order("created_at", { ascending: false });
    if (betRows) setBets(betRows);
    setPage("home");
  };

  // ─── LOGIN with Supabase Auth ───
  const handleLogin = async () => {
    setLoginErr("");
    // Admin check (hardcoded)
    if (loginForm.u === ADMIN.username && loginForm.p === ADMIN.password) {
      setIsAdmin(true); setUser("admin"); setPage("admin"); return;
    }
    setAuthLoading(true);
    // Username se email lookup karo profiles table mein
    let emailToUse = loginForm.u;
    if (!loginForm.u.includes("@")) {
      const { data: profile } = await supabase
        .from("profiles").select("email").eq("username", loginForm.u).single();
      if (!profile) { setLoginErr("❌ Username nahi mila!"); setAuthLoading(false); return; }
      emailToUse = profile.email;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password: loginForm.p,
    });
    setAuthLoading(false);
    if (error) { setLoginErr("❌ Galat username/email ya password!"); return; }
    await loadUserProfile(data.user);
  };

  // ─── SIGNUP with Supabase Auth ───
  const handleSignup = async () => {
    setSignupErr("");
    const { u, email, p, cp } = signupForm;
    if (!u || u.length < 3) { setSignupErr("❌ Username kam se kam 3 characters hona chahiye!"); return; }
    if (!email || !email.includes("@")) { setSignupErr("❌ Sahi email address daalo!"); return; }
    if (!p || p.length < 6) { setSignupErr("❌ Password kam se kam 6 characters hona chahiye!"); return; }
    if (p !== cp) { setSignupErr("❌ Passwords match nahi karte!"); return; }
    // Check if username already taken
    const { data: existing } = await supabase.from("profiles").select("id").eq("username", u).single();
    if (existing) { setSignupErr("❌ Ye username pehle se le liya gaya hai!"); return; }
    setAuthLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password: p });
    if (error) { setSignupErr(`❌ ${error.message}`); setAuthLoading(false); return; }
    // Insert profile with username + email
    await supabase.from("profiles").insert({ id: data.user.id, username: u, email, wallet_balance: 0 });
    setAuthLoading(false);
    showToast("✅ Account ban gaya! Ab login karo.");
    setAuthMode("login");
    setLoginForm({ u, p: "" });
    setSignupForm({ u:"", email:"", p:"", cp:"" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setUserId(null); setIsAdmin(false);
    setPage("login"); setLoginForm({u:"",p:""}); setCasinoGame(null);
    setWalletState(0); setBets([]);
  };

  const placeBet = async (amount,odds,type) => {
    if(type==="back"&&amount>wallet){showToast("❌ Balance nahi! Deposit karo.");return;}
    if(type==="back") setWallet(w=>w-amount);
    const win=+(amount*(odds-1)).toFixed(2);
    const newBet={team:betSlip.team,odds,type,amount,win,match:betSlip.match,date:new Date().toLocaleDateString("en-IN"),status:"Active"};
    if (userId) {
      const { data } = await supabase.from("bets").insert({ ...newBet, user_id: userId }).select().single();
      if (data) setBets(b=>[data,...b]);
    } else {
      setBets(b=>[{id:"B"+Date.now(),...newBet},...b]);
    }
    showToast(`✅ Bet placed! ${type==="back"?"Potential Win":"Liability"}: ₹${win}`);
    setBetSlip(null);
  };

  const handleDeposit=(amount,utr)=>{
    const tx={id:"D"+Date.now(),user,amount,utr,date:new Date().toLocaleDateString("en-IN"),status:"pending"};
    setDeposits(d=>[tx,...d]);
    showToast("✅ Deposit request submit! Admin approve karega.");
  };

  const handleWithdraw=(form)=>{
    if(parseFloat(form.amount)>wallet){showToast("❌ Balance kam hai!");return;}
    const tx={id:"W"+Date.now(),user,...form,date:new Date().toLocaleDateString("en-IN"),status:"pending"};
    setWithdrawals(w=>[tx,...w]);
    setWallet(v=>v-parseFloat(form.amount));
    showToast("✅ Withdrawal submit! 24 ghante mein process hogi.");
  };

  const approveDeposit=(id)=>{
    const dep=deposits.find(d=>d.id===id);
    if(dep)setWallet(w=>w+dep.amount);
    setDeposits(d=>d.map(x=>x.id===id?{...x,status:"approved"}:x));
    showToast("✅ Deposit approved!");
  };

  const filteredMatches = mainTab==="INPLAY"
    ? MATCHES.filter(m=>m.live)
    : MATCHES.filter(m=>m.sport===sportTab);

  // ─── LOGIN / SIGNUP PAGE ───
  if(page==="login") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0a0a0a 0%,#1a0800 30%,#0a1a0a 70%,#0a0a0a 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif",position:"relative",overflow:"hidden",padding:"0 16px"}}>
      {/* Animated BG dots */}
      {[...Array(12)].map((_,i)=>(
        <div key={i} style={{position:"absolute",width:4,height:4,borderRadius:"50%",background:"rgba(240,192,64,0.3)",top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,animation:`pulse ${1.5+Math.random()}s infinite ${Math.random()}s`}}/>
      ))}
      <div style={{textAlign:"center",marginBottom:28,position:"relative"}}>
        <div style={{fontSize:48,marginBottom:6}}>🎰</div>
        <h1 style={{margin:0,fontSize:48,fontWeight:900,color:"#f0c040",textShadow:"2px 2px 0 #8B6914,4px 4px 0 #5a3a00,0 0 40px rgba(240,192,64,0.5)",letterSpacing:3,fontStyle:"italic"}}>BETKARO</h1>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:12,margin:"6px 0 0",letterSpacing:4}}>BETTING EXCHANGE</p>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:10,flexWrap:"wrap"}}>
          {["🏏 CRICKET","⚽ FOOTBALL","✈️ AVIATOR","💎 MINES"].map(t=>(
            <span key={t} style={{background:"rgba(184,134,11,0.15)",border:"1px solid rgba(184,134,11,0.3)",padding:"3px 8px",borderRadius:20,color:"#b8860b",fontSize:10,fontWeight:700}}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"24px 20px",width:"100%",maxWidth:360,boxShadow:"0 20px 60px rgba(0,0,0,0.8)"}}>
        {/* Tab toggle */}
        <div style={{display:"flex",background:"rgba(255,255,255,0.05)",borderRadius:12,padding:4,marginBottom:22,gap:4}}>
          {[["login","🔑 LOGIN"],["signup","✨ SIGN UP"]].map(([mode,label])=>(
            <button key={mode} onClick={()=>{setAuthMode(mode);setLoginErr("");setSignupErr("");}}
              style={{flex:1,padding:"9px 0",background:authMode===mode?"linear-gradient(135deg,#b8860b,#d4a017)":"transparent",border:"none",borderRadius:8,color:authMode===mode?"#fff":"#888",fontWeight:800,fontSize:13,cursor:"pointer",transition:"all 0.2s"}}>
              {label}
            </button>
          ))}
        </div>

        {authMode==="login" ? (
          <>
            <h2 style={{margin:"0 0 18px",color:"#f0c040",textAlign:"center",fontSize:15,fontWeight:700}}>APNE ACCOUNT MEIN LOGIN KARO</h2>
            <div style={{marginBottom:12}}>
              <p style={{margin:"0 0 5px",color:"#888",fontSize:12}}>Username</p>
              <input placeholder="Enter username" value={loginForm.u} onChange={e=>setLoginForm(f=>({...f,u:e.target.value}))}
                style={{width:"100%",padding:"12px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#fff",fontSize:15,boxSizing:"border-box",outline:"none"}}/>
            </div>
            <div style={{marginBottom:12}}>
              <p style={{margin:"0 0 5px",color:"#888",fontSize:12}}>Password</p>
              <input type="password" placeholder="Enter password" value={loginForm.p} onChange={e=>setLoginForm(f=>({...f,p:e.target.value}))}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                style={{width:"100%",padding:"12px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#fff",fontSize:15,boxSizing:"border-box",outline:"none"}}/>
            </div>
            {loginErr&&<p style={{color:"#ff4444",fontSize:13,margin:"0 0 12px",textAlign:"center",background:"rgba(255,0,0,0.1)",padding:"8px",borderRadius:8}}>{loginErr}</p>}
            <button onClick={handleLogin} disabled={authLoading}
              style={{width:"100%",padding:14,background:"linear-gradient(135deg,#b8860b,#d4a017)",border:"none",borderRadius:10,color:"#fff",fontWeight:900,fontSize:16,cursor:"pointer",marginBottom:10,boxShadow:"0 4px 20px rgba(184,134,11,0.4)",opacity:authLoading?0.7:1}}>
              {authLoading?"⏳ Loading...":"LOGIN →"}
            </button>
            <p style={{color:"#666",fontSize:12,textAlign:"center",margin:"0 0 8px"}}>Account nahi hai?{" "}
              <span onClick={()=>setAuthMode("signup")} style={{color:"#f0c040",cursor:"pointer",fontWeight:700}}>Sign Up karo</span>
            </p>
          </>
        ) : (
          <>
            <h2 style={{margin:"0 0 18px",color:"#f0c040",textAlign:"center",fontSize:15,fontWeight:700}}>NAYA ACCOUNT BANAO</h2>
            <div style={{marginBottom:12}}>
              <p style={{margin:"0 0 5px",color:"#888",fontSize:12}}>Username <span style={{color:"#555"}}>(display name)</span></p>
              <input placeholder="Apna username choose karo" value={signupForm.u} onChange={e=>setSignupForm(f=>({...f,u:e.target.value.toLowerCase().replace(/\s/g,"")}))}
                style={{width:"100%",padding:"12px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#fff",fontSize:15,boxSizing:"border-box",outline:"none"}}/>
            </div>
            <div style={{marginBottom:12}}>
              <p style={{margin:"0 0 5px",color:"#888",fontSize:12}}>Email Address</p>
              <input type="email" placeholder="apna@email.com" value={signupForm.email} onChange={e=>setSignupForm(f=>({...f,email:e.target.value}))}
                style={{width:"100%",padding:"12px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#fff",fontSize:15,boxSizing:"border-box",outline:"none"}}/>
            </div>
            <div style={{marginBottom:12}}>
              <p style={{margin:"0 0 5px",color:"#888",fontSize:12}}>Password</p>
              <input type="password" placeholder="Kam se kam 6 characters" value={signupForm.p} onChange={e=>setSignupForm(f=>({...f,p:e.target.value}))}
                style={{width:"100%",padding:"12px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#fff",fontSize:15,boxSizing:"border-box",outline:"none"}}/>
            </div>
            <div style={{marginBottom:14}}>
              <p style={{margin:"0 0 5px",color:"#888",fontSize:12}}>Confirm Password</p>
              <input type="password" placeholder="Password dobara daalo" value={signupForm.cp} onChange={e=>setSignupForm(f=>({...f,cp:e.target.value}))}
                onKeyDown={e=>e.key==="Enter"&&handleSignup()}
                style={{width:"100%",padding:"12px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#fff",fontSize:15,boxSizing:"border-box",outline:"none"}}/>
            </div>
            {signupErr&&<p style={{color:"#ff4444",fontSize:13,margin:"0 0 12px",textAlign:"center",background:"rgba(255,0,0,0.1)",padding:"8px",borderRadius:8}}>{signupErr}</p>}
            <button onClick={handleSignup} disabled={authLoading}
              style={{width:"100%",padding:14,background:"linear-gradient(135deg,#007730,#00aa44)",border:"none",borderRadius:10,color:"#fff",fontWeight:900,fontSize:16,cursor:"pointer",marginBottom:10,boxShadow:"0 4px 20px rgba(0,170,68,0.4)",opacity:authLoading?0.7:1}}>
              {authLoading?"⏳ Creating...":"✨ CREATE ACCOUNT →"}
            </button>
            <p style={{color:"#666",fontSize:12,textAlign:"center",margin:"0 0 8px"}}>Pehle se account hai?{" "}
              <span onClick={()=>setAuthMode("login")} style={{color:"#f0c040",cursor:"pointer",fontWeight:700}}>Login karo</span>
            </p>
          </>
        )}
        <p style={{color:"#444",fontSize:11,textAlign:"center",margin:"10px 0 0"}}>18+ | Play Responsibly | T&C Apply</p>
      </div>
    </div>
  );

  // ─── ADMIN ───
  if(page==="admin") return (
    <AdminPanel deposits={deposits} withdrawals={withdrawals}
      onApprove={approveDeposit}
      onReject={id=>setDeposits(d=>d.map(x=>x.id===id?{...x,status:"rejected"}:x))}
      onMarkPaid={id=>setWithdrawals(w=>w.map(x=>x.id===id?{...x,status:"paid"}:x))}
      onQRUpload={async (file) => {
        showToast("⏳ QR upload ho raha hai...");
        const filePath = `public/payment-qr-${Date.now()}.png`;
        const { data, error } = await supabase.storage
          .from("qr-codes")
          .upload(filePath, file, { upsert: true, contentType: file.type });
        if (error) { showToast("❌ Upload failed: " + error.message); console.error("QR Upload error:", error); return; }
        const { data: urlData } = supabase.storage.from("qr-codes").getPublicUrl(filePath);
        const publicUrl = urlData.publicUrl;
        const { error: dbError } = await supabase.from("admin_settings").upsert({ id: 1, qr_url: publicUrl, updated_at: new Date().toISOString() });
        if (dbError) { showToast("❌ DB save failed: " + dbError.message); console.error("DB error:", dbError); return; }
        setQrImage(publicUrl);
        showToast("✅ QR Code upload ho gaya! Sabhi users ko dikhega.");
      }}
      qrImage={qrImage}
      matches={MATCHES}
      onLogout={handleLogout}/>
  );

  // ─── CASINO GAMES ───
  if(casinoGame==="aviator") return (
    <AviatorGame wallet={wallet} setWallet={setWallet} showToast={showToast} onBack={()=>setCasinoGame(null)}/>
  );
  if(casinoGame==="mines") return (
    <MinesGame wallet={wallet} setWallet={setWallet} showToast={showToast} onBack={()=>setCasinoGame(null)}/>
  );

  // ─── MAIN USER SITE ───
  return (
    <div style={{minHeight:"100vh",background:"#080808",color:"#fff",fontFamily:"'Segoe UI',sans-serif",maxWidth:500,margin:"0 auto",position:"relative",paddingBottom:70}}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes marquee{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
        @keyframes slideIn{from{transform:translateY(-100%)}to{transform:translateY(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 10px rgba(184,134,11,0.3)}50%{box-shadow:0 0 25px rgba(184,134,11,0.7)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      `}</style>

      {/* HEADER */}
      <div style={{background:"linear-gradient(90deg,#0a0500,#1a0a00,#0a0500)",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100,borderBottom:"1px solid #b8860b",animation:"glow 3s infinite"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:20}}>🎰</span>
          <h1 style={{margin:0,color:"#f0c040",fontSize:22,fontWeight:900,fontStyle:"italic",textShadow:"0 0 20px rgba(240,192,64,0.4)"}}>BETKARO</h1>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setShowScoreboard(s=>!s)} style={{background:"rgba(0,200,0,0.1)",border:"1px solid #00aa33",borderRadius:6,padding:"4px 8px",color:"#00cc44",fontSize:10,fontWeight:700,cursor:"pointer"}}>📊 SCORE</button>
          <div onClick={()=>setShowDeposit(true)} style={{background:"rgba(184,134,11,0.15)",border:"1px solid rgba(184,134,11,0.4)",borderRadius:8,padding:"5px 10px",cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <span style={{fontSize:14}}>💰</span>
              <span style={{color:"#f0c040",fontWeight:900,fontSize:15}}>₹{wallet.toFixed(2)}</span>
            </div>
            <p style={{margin:0,color:"rgba(255,255,255,0.5)",fontSize:9,textAlign:"center"}}>{user} ▼</p>
          </div>
        </div>
      </div>

      {/* LIVE SCORE WIDGET */}
      <LiveScoreWidget scores={LIVE_SCORES_INIT}/>

      {/* MARQUEE */}
      <div style={{background:"linear-gradient(90deg,#1a0500,#2a0800,#1a0500)",overflow:"hidden",height:26,display:"flex",alignItems:"center",borderBottom:"1px solid #330000"}}>
        <div style={{animation:"marquee 25s linear infinite",whiteSpace:"nowrap",color:"#f0c040",fontSize:11,fontWeight:600,padding:"0 20px"}}>
          🔥 IPL 2026 LIVE • Delhi Capitals 142/6 (17.2 ov) vs Punjab Kings 47/2 (6.4 ov) &nbsp;|&nbsp; ⚽ Arsenal 2-1 Chelsea (74') &nbsp;|&nbsp; 🎾 Djokovic vs Alcaraz LIVE &nbsp;|&nbsp; 🏆 CUP WINNER MARKET OPEN &nbsp;|&nbsp; ✈️ AVIATOR — BIG WIN CHANCE! &nbsp;|&nbsp; 💎 MINES — FIND GEMS!
        </div>
      </div>

      {/* AD BANNER */}
      <AdBanner/>

      {/* SCOREBOARD TOGGLE */}
      {showScoreboard && <ScoreBoard/>}

      {/* UPCOMING MATCHES SCROLL */}
      <div style={{background:"#0d0d0d",padding:"8px 12px",borderBottom:"1px solid #1a1a1a"}}>
        <p style={{margin:"0 0 6px",color:"#f0c040",fontSize:11,fontWeight:700}}>📅 UPCOMING & LIVE</p>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
          {MATCHES.map(m=>(
            <div key={m.id} onClick={()=>{setOpenMatch(m);setMatchViewTab("ODDS");setMainTab("INPLAY");}}
              style={{minWidth:145,background:m.live?"rgba(0,100,0,0.2)":"#1a1a1a",border:"1px solid "+(m.live?"#00aa33":"#2a2a2a"),borderRadius:10,padding:"8px 10px",cursor:"pointer",flexShrink:0,transition:"all 0.2s"}}>
              <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:4}}>
                <span style={{fontSize:11}}>{m.sport==="cricket"?"🏏":m.sport==="football"?"⚽":"🎾"}</span>
                <p style={{margin:0,color:m.live?"#00cc44":"#666",fontSize:9,fontWeight:800}}>{m.live?"● LIVE":m.date.split(" ")[1]}</p>
              </div>
              <p style={{margin:"0 0 2px",color:"#ddd",fontSize:11,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.t1}</p>
              <p style={{margin:"0 0 2px",color:"#888",fontSize:10,textAlign:"center"}}>vs</p>
              <p style={{margin:0,color:"#ddd",fontSize:11,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.t2}</p>
              {m.live && m.score1 && <p style={{margin:"4px 0 0",color:"#00cc44",fontSize:9}}>{m.score1}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* IPL BANNER */}
      <div style={{background:"linear-gradient(90deg,#8B0000,#cc0000,#8B0000)",padding:"7px 14px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,0.03) 10px,rgba(255,255,255,0.03) 20px)"}}/>
        <p style={{margin:0,color:"#fff",fontWeight:900,fontSize:14,letterSpacing:2,position:"relative"}}>🏆 IPL 2026 — BET NOW!</p>
      </div>

      {/* MATCH DETAIL VIEW */}
      {openMatch&&(
        <div style={{background:"#080808"}}>
          <div style={{background:"#111",padding:"10px 14px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid #1a1a1a",position:"sticky",top:50,zIndex:90}}>
            <button onClick={()=>setOpenMatch(null)} style={{background:"rgba(240,192,64,0.1)",border:"1px solid rgba(240,192,64,0.3)",color:"#f0c040",cursor:"pointer",fontSize:14,padding:"4px 10px",borderRadius:6}}>← Back</button>
            <div style={{flex:1}}>
              <p style={{margin:0,color:"#ddd",fontWeight:700,fontSize:13}}>{openMatch.t1} v {openMatch.t2}</p>
              <p style={{margin:0,color:"#666",fontSize:10}}>{openMatch.league}</p>
            </div>
            {openMatch.live&&<span style={{background:"#cc0000",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:8,animation:"pulse 1s infinite"}}>● LIVE</span>}
          </div>
          {openMatch.live && openMatch.score1 && (
            <div style={{background:"#0a1a0a",padding:"8px 14px",borderBottom:"1px solid #1a2a1a"}}>
              <p style={{margin:0,color:"#00cc44",fontSize:13,fontWeight:700}}>{openMatch.score1}</p>
              {openMatch.score2&&<p style={{margin:"2px 0 0",color:"#aaa",fontSize:12}}>{openMatch.score2}</p>}
            </div>
          )}
          <div style={{display:"flex",borderBottom:"2px solid #1a1a1a"}}>
            {["ODDS","MATCHED BET ("+bets.length+")"].map(t=>(
              <button key={t} onClick={()=>setMatchViewTab(t.split(" (")[0])} style={{flex:1,padding:"11px 0",background:"none",border:"none",borderBottom:matchViewTab===t.split(" (")[0]?"2px solid #b8860b":"2px solid transparent",color:matchViewTab===t.split(" (")[0]?"#f0c040":"#666",fontWeight:700,cursor:"pointer",fontSize:12}}>
                {t}
              </button>
            ))}
          </div>
          {matchViewTab==="ODDS"&&(
            <div>
              <div style={{background:"#1a3030",padding:"8px 14px",borderBottom:"1px solid #1a2a2a"}}>
                <p style={{margin:0,color:"#f0c040",fontWeight:700,fontSize:12}}>📊 BOOKMAKER — IPL CUP WINNER</p>
              </div>
              <BookmakerTable teams={IPL_TEAMS} onBet={b=>setBetSlip({...b})}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",background:"#111",borderTop:"2px solid #1a1a1a"}}>
                <button style={{padding:14,background:"#b8860b",border:"none",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer"}}>FANCY</button>
                <button style={{padding:14,background:"#111",border:"none",color:"#888",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>PREMIUM <span style={{background:"#cc0000",color:"#fff",fontSize:9,padding:"2px 6px",borderRadius:4}}>NEW</span></button>
              </div>
              <div style={{display:"flex",overflowX:"auto",borderTop:"1px solid #1a1a1a",background:"#0d0d0d"}}>
                {["ALL","SESSIONS","W/R MARKET","ODD/EVEN"].map(t=>(
                  <button key={t} style={{padding:"10px 12px",background:"none",border:"none",borderBottom:"2px solid transparent",color:"#666",fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",fontSize:11}}>{t}</button>
                ))}
              </div>
            </div>
          )}
          {matchViewTab==="MATCHED"&&(
            <div style={{padding:14}}>
              {bets.length===0?<div style={{textAlign:"center",padding:30,color:"#444"}}><p style={{fontSize:36}}>🎯</p><p>Koi bet nahi lagi.</p></div>
                :bets.map(b=>(
                  <div key={b.id} style={{background:"#111",border:"1px solid #1a1a1a",borderRadius:10,padding:12,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div>
                        <p style={{margin:"0 0 4px",color:b.type==="back"?"#4a90d9":"#f4a261",fontWeight:700,fontSize:13}}>{b.type.toUpperCase()} — {b.team}</p>
                        <p style={{margin:0,color:"#666",fontSize:11}}>Odds: {b.odds} | Stake: ₹{b.amount}</p>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <p style={{margin:0,color:"#00cc44",fontWeight:700}}>Win: ₹{b.win}</p>
                        <p style={{margin:0,color:"#444",fontSize:10}}>{b.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* MAIN TABS */}
      {!openMatch&&(
        <>
          {/* Sports tabs */}
          <div style={{display:"flex",borderBottom:"1px solid #1a1a1a",background:"#0d0d0d",overflowX:"auto",position:"sticky",top:50,zIndex:90}}>
            {SPORTS_TABS.map(t=>(
              <button key={t} onClick={()=>setMainTab(t)} style={{padding:"11px 13px",background:"none",border:"none",borderBottom:mainTab===t?"2px solid #b8860b":"2px solid transparent",color:mainTab===t?"#f0c040":"#666",fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",fontSize:11}}>
                {t}
              </button>
            ))}
          </div>

          {/* Sport icons row */}
          {(mainTab==="INPLAY"||mainTab==="SPORTS")&&(
            <div style={{display:"flex",overflowX:"auto",background:"#0a0a0a",borderBottom:"1px solid #1a1a1a",padding:"4px 0"}}>
              {SPORT_ICONS.map(s=>(
                <button key={s.key} onClick={()=>{setSportTab(s.key);if(mainTab==="INPLAY")setMainTab("SPORTS");}}
                  style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"7px 12px",background:sportTab===s.key?"rgba(184,134,11,0.15)":"none",border:"none",borderBottom:sportTab===s.key?"2px solid #b8860b":"2px solid transparent",color:sportTab===s.key?"#f0c040":"#666",cursor:"pointer",minWidth:64,position:"relative"}}>
                  <span style={{fontSize:20}}>{s.icon}</span>
                  <span style={{fontSize:9,fontWeight:700,whiteSpace:"nowrap"}}>{s.label}</span>
                  {s.isNew&&<span style={{position:"absolute",top:3,right:3,background:"#cc0000",color:"#fff",fontSize:7,padding:"1px 3px",borderRadius:3,fontWeight:900}}>NEW</span>}
                </button>
              ))}
            </div>
          )}

          {/* INPLAY filter row */}
          {mainTab==="INPLAY"&&(
            <div style={{display:"flex",gap:6,padding:"7px 12px",background:"#090909",borderBottom:"1px solid #111",alignItems:"center"}}>
              {["LIVE","VIRTUAL","PREMIUM"].map(t=>(
                <button key={t} style={{padding:"4px 10px",background:"rgba(184,134,11,0.1)",border:"1px solid rgba(184,134,11,0.3)",borderRadius:16,color:"#b8860b",fontSize:10,fontWeight:700,cursor:"pointer"}}>● {t}</button>
              ))}
              <span style={{marginLeft:"auto",color:"#f0c040",fontWeight:700,fontSize:10,cursor:"pointer"}}>TIME ▼</span>
            </div>
          )}

          {/* CASINO TAB */}
          {mainTab==="CASINO"&&(
            <div style={{padding:12}}>
              {/* Featured games row */}
              <div style={{background:"rgba(184,134,11,0.08)",border:"1px solid rgba(184,134,11,0.2)",borderRadius:12,padding:12,marginBottom:12}}>
                <p style={{margin:"0 0 10px",color:"#f0c040",fontWeight:900,fontSize:13}}>🔥 POPULAR GAMES</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {CASINO_GAMES.filter(g=>g.hot).map(g=>(
                    <div key={g.name} onClick={()=>g.playable?setCasinoGame(g.tag):showToast("🚧 Coming soon!")}
                      style={{background:g.color,borderRadius:12,padding:0,overflow:"hidden",cursor:"pointer",aspectRatio:"16/9",display:"flex",alignItems:"flex-end",justifyContent:"flex-start",position:"relative",border:"2px solid rgba(255,255,255,0.15)",boxShadow:"0 4px 20px rgba(0,0,0,0.5)"}}>
                      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontSize:42}}>{g.emoji}</span>
                      </div>
                      <div style={{position:"relative",width:"100%",background:"linear-gradient(transparent,rgba(0,0,0,0.8))",padding:"20px 10px 8px"}}>
                        <p style={{margin:0,color:"#fff",fontWeight:900,fontSize:12,letterSpacing:1}}>{g.name}</p>
                        <p style={{margin:0,color:"#f0c040",fontSize:9,fontWeight:700}}>▶ PLAY NOW</p>
                      </div>
                      <div style={{position:"absolute",top:6,right:6,background:"#cc0000",color:"#fff",fontSize:8,padding:"2px 6px",borderRadius:10,fontWeight:900,animation:"pulse 1s infinite"}}>LIVE</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ad */}
              <AdBanner/>

              {/* All games grid */}
              <p style={{margin:"10px 0 8px",color:"#f0c040",fontWeight:900,fontSize:13}}>🎮 ALL GAMES</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {CASINO_GAMES.map(g=>(
                  <div key={g.name} onClick={()=>g.playable?setCasinoGame(g.tag):showToast("🚧 Coming soon!")}
                    style={{background:g.color,borderRadius:10,overflow:"hidden",cursor:"pointer",aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4,position:"relative",border:"1px solid rgba(255,255,255,0.1)"}}>
                    <span style={{fontSize:28}}>{g.emoji}</span>
                    <span style={{color:"#fff",fontWeight:800,fontSize:10,letterSpacing:1}}>{g.name}</span>
                    {g.playable&&<span style={{position:"absolute",bottom:4,right:4,background:"rgba(0,200,100,0.2)",border:"1px solid #00aa33",color:"#00cc44",fontSize:8,padding:"1px 5px",borderRadius:8,fontWeight:900}}>PLAY</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SPORTS BOOK TAB */}
          {mainTab==="SPORTS BOOK"&&(
            <div style={{padding:14}}>
              <AdBanner/>
              <div style={{marginTop:12,background:"#111",borderRadius:12,padding:14}}>
                <h3 style={{color:"#f0c040",margin:"0 0 12px",fontWeight:900}}>📚 SPORTS BOOK</h3>
                <p style={{color:"#888",fontSize:13}}>Full sports book coming soon. Bet on all major tournaments.</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
                  {["🏏 Cricket","⚽ Football","🏀 Basketball","🎾 Tennis","🏒 Hockey","🏈 NFL"].map(s=>(
                    <div key={s} style={{background:"rgba(184,134,11,0.08)",border:"1px solid rgba(184,134,11,0.2)",borderRadius:8,padding:"10px 12px",cursor:"pointer"}}>
                      <p style={{margin:0,color:"#f0c040",fontWeight:700,fontSize:12}}>{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MATCH LIST */}
          {(mainTab==="INPLAY"||mainTab==="SPORTS")&&(
            <div>
              {filteredMatches.length===0
                ?<div style={{padding:40,textAlign:"center",color:"#333"}}>
                  <p style={{fontSize:48,margin:0}}>{sportTab==="cricket"?"🏏":sportTab==="football"?"⚽":"🎾"}</p>
                  <p style={{fontSize:15}}>Koi match nahi hai abhi</p>
                </div>
                :filteredMatches.map(m=><MatchRow key={m.id} match={m} onBet={b=>setBetSlip(b)} onOpen={()=>{setOpenMatch(m);setMatchViewTab("ODDS");}}/>)
              }
              <AdBanner/>
            </div>
          )}

          {/* OTHERS TAB */}
          {mainTab==="OTHERS"&&(
            <div style={{padding:14}}>
              {/* Wallet card */}
              <div style={{background:"linear-gradient(135deg,#1a0800,#2a1200)",border:"1px solid #b8860b",borderRadius:14,padding:16,marginBottom:14,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",right:-20,top:-20,width:80,height:80,borderRadius:"50%",background:"rgba(184,134,11,0.1)"}}/>
                <p style={{margin:"0 0 4px",color:"#886600",fontSize:11,fontWeight:600}}>💰 WALLET BALANCE</p>
                <p style={{margin:"0 0 12px",color:"#f0c040",fontSize:28,fontWeight:900}}>₹{wallet.toLocaleString("en-IN")}</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <button onClick={()=>setShowDeposit(true)} style={{padding:"10px 0",background:"linear-gradient(135deg,#b8860b,#d4a017)",border:"none",borderRadius:8,color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer"}}>+ DEPOSIT</button>
                  <button onClick={()=>setShowWithdraw(true)} style={{padding:"10px 0",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#ddd",fontWeight:700,fontSize:13,cursor:"pointer"}}>WITHDRAW</button>
                </div>
              </div>

              <h3 style={{color:"#f0c040",margin:"0 0 10px",fontWeight:900}}>🎯 My Bets ({bets.length})</h3>
              {bets.length===0?<p style={{color:"#444",textAlign:"center",padding:"20px 0"}}>Koi bet nahi lagi abhi.</p>
                :bets.map(b=>(
                  <div key={b.id} style={{background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:10,padding:12,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <div>
                        <p style={{margin:"0 0 3px",color:b.type==="back"?"#4a90d9":"#f4a261",fontWeight:700,fontSize:12}}>{b.type.toUpperCase()} — {b.team}</p>
                        <p style={{margin:"0 0 2px",color:"#555",fontSize:11}}>{b.match}</p>
                        <p style={{margin:0,color:"#555",fontSize:11}}>Odds: {b.odds} | Stake: ₹{b.amount}</p>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <p style={{margin:"0 0 4px",color:"#00cc44",fontWeight:800}}>₹{b.win}</p>
                        <span style={{background:"rgba(0,200,100,0.1)",border:"1px solid #005522",color:"#00aa44",fontSize:10,padding:"2px 8px",borderRadius:8,fontWeight:700}}>Active</span>
                      </div>
                    </div>
                  </div>
                ))}

              <h3 style={{color:"#f0c040",margin:"20px 0 10px",fontWeight:900}}>⚙️ Account</h3>
              <div style={{background:"#0d0d0d",borderRadius:12,overflow:"hidden",border:"1px solid #1a1a1a"}}>
                {[["💰 Deposit","deposit"],["🏦 Withdraw","withdraw"],["📋 Transaction History","history"],["🔑 Change Password","pwd"],["🚪 Logout","logout"]].map(([l,k])=>(
                  <button key={k} onClick={()=>{if(k==="deposit")setShowDeposit(true);else if(k==="withdraw")setShowWithdraw(true);else if(k==="logout")handleLogout();}}
                    style={{width:"100%",padding:"14px 16px",background:"none",border:"none",borderBottom:"1px solid #111",color:"#ccc",textAlign:"left",cursor:"pointer",fontSize:13,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    {l} <span style={{color:"#444",fontSize:16}}>›</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:500,background:"#0a0a0a",borderTop:"2px solid rgba(184,134,11,0.5)",display:"flex",justifyContent:"space-around",padding:"8px 0 10px",zIndex:100}}>
        {[["🏠","Home","home"],["💰","Deposit","dep"],["🎰","Casino","casino"],["📋","My Bets","bets"],["👤","Account","acc"]].map(([ic,l,k])=>(
          <button key={k} onClick={()=>{
            setCasinoGame(null);setOpenMatch(null);
            if(k==="dep")setShowDeposit(true);
            else if(k==="home")setMainTab("INPLAY");
            else if(k==="casino")setMainTab("CASINO");
            else if(k==="bets")setMainTab("OTHERS");
            else if(k==="acc")setMainTab("OTHERS");
          }}
          style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:"0 8px"}}>
            <span style={{fontSize:20}}>{ic}</span>
            <span style={{color:mainTab==="CASINO"&&k==="casino"||mainTab==="INPLAY"&&k==="home"||mainTab==="OTHERS"&&(k==="bets"||k==="acc")?"#f0c040":"#555",fontSize:9,fontWeight:700}}>{l}</span>
          </button>
        ))}
      </div>

      {/* MODALS */}
      {betSlip&&<BetSlip bet={betSlip} wallet={wallet} onConfirm={placeBet} onClose={()=>setBetSlip(null)}/>}
      {showDeposit&&<DepositModal qrImage={qrImage} onClose={()=>setShowDeposit(false)} onSubmit={handleDeposit}/>}
      {showWithdraw&&<WithdrawModal wallet={wallet} onClose={()=>setShowWithdraw(false)} onSubmit={handleWithdraw}/>}

      {/* TOAST */}
      {toast&&(
        <div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:"#1a1a1a",border:"1px solid #b8860b",borderRadius:12,padding:"10px 20px",color:"#fff",fontWeight:700,fontSize:13,zIndex:99999,boxShadow:"0 4px 30px rgba(0,0,0,0.8)",whiteSpace:"nowrap",maxWidth:"90vw",textAlign:"center"}}>
          {toast}
        </div>
      )}
    </div>
  );
}
