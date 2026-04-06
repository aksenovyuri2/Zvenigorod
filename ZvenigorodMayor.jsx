import React, { useReducer, useEffect, useState, useRef, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Building2, TreePine, Palette, Wifi, Shield, Heart, GraduationCap,
  TrendingUp, Users, Coins, AlertTriangle, Play, ArrowRight,
  RotateCcw, ChevronDown, ChevronUp, MapPin, Crown, Vote,
  Trophy, Snowflake, Sun, Leaf, CloudRain, MessageCircle, X,
  Award, Zap, Globe, ThumbsUp, Info, Newspaper,
  Bug, Skull, Megaphone, Waves, ShieldAlert, UserMinus,
  Landmark, Briefcase, HelpCircle, Rocket,
  PanelLeftClose, PanelLeftOpen, Star, Sparkles,
} from "lucide-react";

// Import v3 engine
import {
  gameReducer, createInitialState,
  METRIC_KEYS, METRICS_CFG as METRICS_CFG_RAW, GROUPS, MAX_TURNS, MAX_PICKS, ELECTION_TURN, INIT_POP,
  ALL_DECISIONS, ALL_EVENTS, ACHIEVEMENTS, ELECTION_PROMISES, WORLD_CITIES,
  DIFFICULTIES, SCENARIOS,
  getGrade as getGradeEngine, getPlayStyle as getPlayStyleEngine,
  calcGroupSatisfactions, calcAvgSatisfaction,
} from "./src/engine/gameLoop.js";
import { calcRevenue, calcMandatoryExpenses } from "./src/engine/calculator.js";
import { getCurrentCrisisPhase } from "./src/engine/crises.js";
import { generateLetterText } from "./src/npc/npcEngine.js";
import { NEIGHBORS, DIPLOMATIC_ACTIONS, JOINT_PROJECTS } from "./src/political/diplomacy.js";
import { FACTIONS } from "./src/political/dumaEngine.js";

// Icon mapping: string keys from engine to React components
const ICON_MAP = {
  Building2, TreePine, Palette, Wifi, Shield, Heart, GraduationCap, TrendingUp,
  Bug, Skull, AlertTriangle, Megaphone, Waves, ShieldAlert, UserMinus,
  Landmark, Briefcase, HelpCircle, Rocket,
};

// Enrich METRICS_CFG with Icon component (engine stores string, UI needs component)
const METRICS_CFG = {};
for (const [k, v] of Object.entries(METRICS_CFG_RAW)) {
  METRICS_CFG[k] = { ...v, Icon: ICON_MAP[v.icon] || Building2 };
}

const GROUP_KEYS = Object.keys(GROUPS);
const SEASON_NAMES = ["Зима", "Весна", "Лето", "Осень"];
const SEASON_ICONS = [Snowflake, Leaf, Sun, CloudRain];
const INIT_METRICS = { infrastructure:35, ecology:65, culture:45, digital:20, safety:40, healthcare:35, education:40, economy:30 };

// getGrade adapted for UI (letter, label, color)
function getGrade(rankIdx) {
  if (rankIdx < 5) return { letter:"S", label:"Легенда", color:"#fbbf24" };
  if (rankIdx < 15) return { letter:"A", label:"Мировой лидер", color:"#22c55e" };
  if (rankIdx < 30) return { letter:"B", label:"Город мечты", color:"#4f55f1" };
  if (rankIdx < 50) return { letter:"C", label:"Растущая звезда", color:"#a855f7" };
  if (rankIdx < 70) return { letter:"D", label:"Середнячок", color:"#f59e0b" };
  return { letter:"F", label:"Провал", color:"#ef4444" };
}

function getPlayStyle(history) {
  if (!history || history.length < 2) return "Новичок";
  const last = history[history.length - 1]?.metrics || {};
  const top = METRIC_KEYS.reduce((a, k) => last[k] > (last[a]||0) ? k : a, METRIC_KEYS[0]);
  const styles = { digital:"Технократ", economy:"Капиталист", ecology:"Эколог", culture:"Культуролог", healthcare:"Гуманист", education:"Просветитель", safety:"Силовик", infrastructure:"Строитель" };
  const balanced = METRIC_KEYS.every(k => last[k] >= 50);
  if (balanced) return "Сбалансированный";
  return styles[top] || "Мэр";
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function DeltaValue({ value, suffix = "" }) {
  if (!value || value === 0) return null;
  const pos = value > 0;
  return <span className={pos ? "text-[#00a87e] text-sm font-medium" : "text-[#e23b4a] text-sm font-medium"}>{pos ? "+" : ""}{Math.round(value)}{suffix}</span>;
}

function MetricBar({ metricKey, value, prevValue, compact = false }) {
  const cfg = METRICS_CFG[metricKey];
  if (!cfg) return null;
  const delta = Math.round(value - prevValue);
  const pct = Math.max(0, Math.min(100, value));
  const critical = value < 20;
  return (
    <div className={compact ? "mb-1.5" : "mb-3"}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <cfg.Icon size={compact ? 14 : 16} style={{ color: cfg.color }} />
          <span className={`${compact ? "text-xs" : "text-sm"} text-[#191c1f]`}>{cfg.name}</span>
          {critical && <span className="text-[#e23b4a] animate-pulse text-xs">!</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className={`${compact ? "text-xs" : "text-sm"} font-bold text-[#191c1f]`}>{Math.round(value)}</span>
          {delta !== 0 && <DeltaValue value={delta} />}
        </div>
      </div>
      <div className={`w-full rounded-full overflow-hidden ${compact ? "h-1.5" : "h-2"}`} style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: critical ? "#ef4444" : cfg.color }} />
      </div>
    </div>
  );
}

function Sparkline({ data, color, width = 80, height = 24 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(" ");
  return <svg width={width} height={height} className="inline-block"><polyline points={points} fill="none" stroke={color} strokeWidth="1.5" /></svg>;
}

function GroupSatisfaction({ groupKey, value, prevValue }) {
  const g = GROUPS[groupKey];
  if (!g) return null;
  const delta = Math.round(value - prevValue);
  const pct = Math.max(0, Math.min(100, value));
  const barColor = pct >= 60 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-xs text-[#6b7280]">{g.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#191c1f]">{Math.round(pct)}%</span>
          {delta !== 0 && <DeltaValue value={delta} suffix="%" />}
        </div>
      </div>
      <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
    </div>
  );
}

function EffectBadge({ metricKey, value }) {
  const cfg = METRICS_CFG[metricKey];
  if (!cfg) return null;
  const pos = value > 0;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: pos ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: pos ? "#16a34a" : "#dc2626" }}>
      <cfg.Icon size={12} />{pos ? "+" : ""}{value}
    </span>
  );
}

function DecisionCard({ decision, selected, affordable, onToggle, usageCount, costMultiplier = 1, advisorComment }) {
  const cost = Math.round(decision.cost * costMultiplier);
  const disabled = !affordable && !selected;
  const hasNeg = Object.values(decision.effects).some(v => v < 0);
  return (
    <button onClick={() => !disabled && onToggle(decision.id)} disabled={disabled}
      title={disabled ? `Недостаточно бюджета (нужно ${cost} млн)` : ""}
      className={`w-full text-left rounded-3xl p-3 border transition-all duration-200
        ${selected
          ? "border-[#4f55f1] bg-[#f7f7f7] shadow-md shadow-[#4f55f1]/10 scale-[1.01]"
          : disabled
          ? "border-[#ebebeb] bg-[#f0f0f0] opacity-40 cursor-not-allowed"
          : hasNeg
          ? "border-[#e0e0e0] bg-[#f7f7f7] hover:border-[#c0c0c0] hover:shadow-sm cursor-pointer active:scale-[0.98]"
          : "border-[#e0e0e0] bg-[#f7f7f7] hover:border-[#c0c0c0] hover:shadow-sm cursor-pointer active:scale-[0.98]"}`}>
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-xs font-bold text-[#191c1f] leading-tight pr-2">{decision.name}</h3>
        <div className="flex items-center gap-0.5 shrink-0">
          <span className="text-sm font-semibold text-[#191c1f]">{cost}</span>
          <span className="text-[10px] text-[#9ca3af] ml-0.5">млн</span>
        </div>
      </div>
      <p className="text-[11px] text-[#6b7280] mb-1.5 leading-snug line-clamp-1">{decision.desc}</p>
      <div className="flex flex-wrap gap-1">
        {Object.entries(decision.effects).map(([k, v]) => <EffectBadge key={k} metricKey={k} value={usageCount > 0 ? Math.round(v * Math.pow(0.7, usageCount)) : v} />)}
        {decision.recurringIncome && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e8e8e8] text-[#6b7280]">{decision.recurringIncome.base > 0 ? `+${decision.recurringIncome.base - decision.recurringIncome.maintenance}` : `-${decision.recurringIncome.maintenance}`}/ход</span>}
        {decision.populationEffect && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e8e8e8] text-[#6b7280]"><Users size={10} />+{decision.populationEffect}</span>}
        {decision.once && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e8e8e8] text-[#9ca3af]">Разовое</span>}
        {decision.requires && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#4f55f1]/10 text-[#4f55f1]">Цепочка</span>}
      </div>
      {usageCount > 0 && <div className="mt-1.5 text-[10px] text-[#6b7280]">Эффект ×{Math.round(Math.pow(0.7, usageCount) * 100)}%</div>}
      {advisorComment && advisorComment.map((c, i) => (
        <div key={i} className="mt-2 flex items-start gap-2 p-2 rounded-xl bg-[#f7f7f7] border border-[#ebebeb]">
          <span className="text-sm">{c.avatar}</span>
          <div><span className="text-[10px] text-[#9ca3af]">{c.advisor}:</span><p className="text-[10px] text-[#6b7280] italic leading-snug">{"\u00AB"}{c.text}{"\u00BB"}</p></div>
        </div>
      ))}
    </button>
  );
}

function FadeIn({ children, className = "" }) {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), 50); return () => clearTimeout(t); }, []);
  return <div className={`transition-all duration-500 ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${className}`}>{children}</div>;
}

function NewsBar({ news }) {
  if (!news || !news.length) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#f0f0f0]/90 border-t border-[#e0e0e0] px-4 py-2 z-50 overflow-hidden">
      <div className="flex items-center gap-2">
        <Newspaper size={14} className="text-[#ec7e00] shrink-0" />
        <div className="overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-marquee">
            <span className="text-xs text-[#191c1f]">{news.map((n, i) => <span key={i}><span className="text-[#ec7e00] mx-2">|</span>{n}</span>)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AchievementToast({ achievements }) {
  if (!achievements || !achievements.length) return null;
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {achievements.map(id => {
        const a = ACHIEVEMENTS.find(x => x.id === id);
        if (!a) return null;
        return (
          <FadeIn key={id}>
            <div className="px-4 py-3 rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0]">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{a.icon}</span>
                <div><div className="text-xs text-[#ec7e00] font-bold">Достижение!</div><div className="text-sm text-[#191c1f] font-medium">{a.name}</div></div>
              </div>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}

function OvertakeToast({ msg, onDismiss }) {
  if (!msg) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <FadeIn>
        <div className="px-6 py-3 rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] flex items-center gap-3">
          <span className="text-sm text-[#191c1f]">{msg}</span>
          <button onClick={onDismiss} className="text-[#6b7280] hover:text-[#191c1f]"><X size={14} /></button>
        </div>
      </FadeIn>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RANKING TABLE
// ═══════════════════════════════════════════════════════════════════════════════

function RankingTable({ zvScore, rankIdx, expanded, onToggle }) {
  const nearby = 3;
  const start = Math.max(0, rankIdx - nearby);
  const end = Math.min(WORLD_CITIES.length, rankIdx + nearby + 1);
  const visible = expanded ? WORLD_CITIES : WORLD_CITIES.slice(start, end);
  const zvEntry = { name: "Звенигород", flag: "🏛️", score: zvScore, icon: "🏛️", tagline: "Ваш город", isPlayer: true };

  const allEntries = expanded
    ? [...WORLD_CITIES.slice(0, rankIdx), zvEntry, ...WORLD_CITIES.slice(rankIdx)]
    : [...WORLD_CITIES.slice(start, rankIdx), zvEntry, ...WORLD_CITIES.slice(rankIdx, end)];

  return (
    <div className="rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider flex items-center gap-1.5">
          <Globe size={14} className="text-[#4f55f1]" /> Мировой рейтинг — #{rankIdx + 1} из {WORLD_CITIES.length + 1}
        </h2>
        <button onClick={onToggle} className="text-xs text-[#4f55f1] hover:text-[#4f55f1]">{expanded ? "Свернуть" : "Полный список"}</button>
      </div>
      <div className={expanded ? "max-h-80 overflow-y-auto space-y-1 pr-1" : "space-y-1"}>
        {allEntries.map((city, i) => {
          const pos = expanded ? i + 1 : start + i + 1;
          const isZv = city.isPlayer;
          return (
            <div key={city.name + i} className={`flex items-center gap-2 px-2 py-1.5 rounded-full text-xs ${isZv ? "bg-[#e8e8e8] border border-[#4f55f1]/30" : "hover:bg-[#f7f7f7]"}`}>
              <span className="text-[#9ca3af] w-6 text-right font-mono">#{pos}</span>
              <span>{city.flag || city.icon}</span>
              <span className={`flex-1 ${isZv ? "text-[#4f55f1] font-bold" : "text-[#191c1f]"}`}>{city.name}</span>
              <span className="text-[#6b7280] font-mono">{typeof city.score === "number" ? city.score.toFixed(1) : city.score}</span>
              <div className="w-16 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>
                <div className="h-full rounded-full" style={{ width: `${city.score}%`, backgroundColor: isZv ? "#4f55f1" : "#c0c0c0" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE SCREENS
// ═══════════════════════════════════════════════════════════════════════════════

function StartScreen({ onStart }) {
  const [scenarioId, setScenarioId] = useState("standard");
  const [difficultyId, setDifficultyId] = useState("normal");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-white" />
      <FadeIn className="relative z-10 text-center max-w-2xl">
        <div className="mb-8">
          <svg viewBox="0 0 400 180" className="w-80 mx-auto mb-6">
            <rect x="0" y="140" width="400" height="40" rx="4" fill="#e0e0e0" opacity="0.5" />
            <path d="M40,140 Q200,100 360,140" stroke="#4f55f1" fill="none" strokeWidth="2" opacity="0.3" />
            <rect x="60" y="80" width="35" height="60" rx="2" fill="#c0c0c0" /><rect x="65" y="85" width="8" height="10" rx="1" fill="#4f55f1" opacity="0.4" /><rect x="80" y="85" width="8" height="10" rx="1" fill="#4f55f1" opacity="0.25" /><rect x="65" y="100" width="8" height="10" rx="1" fill="#4f55f1" opacity="0.3" /><rect x="80" y="100" width="8" height="10" rx="1" fill="#4f55f1" opacity="0.2" />
            <rect x="110" y="60" width="40" height="80" rx="2" fill="#d0d0d0" /><polygon points="130,40 108,60 152,60" fill="#b0b0b0" /><circle cx="130" cy="52" r="4" fill="#4f55f1" opacity="0.5" /><rect x="120" y="110" width="18" height="30" rx="1" fill="#e8e8e8" />
            <rect x="170" y="55" width="60" height="85" rx="2" fill="#d0d0d0" /><polygon points="200,30 167,55 233,55" fill="#b0b0b0" /><circle cx="200" cy="43" r="5" fill="#4f55f1" opacity="0.6" /><rect x="180" y="65" width="10" height="14" rx="1" fill="#4f55f1" opacity="0.4" /><rect x="195" y="65" width="10" height="14" rx="1" fill="#4f55f1" opacity="0.25" /><rect x="210" y="65" width="10" height="14" rx="1" fill="#4f55f1" opacity="0.3" /><rect x="188" y="105" width="24" height="35" rx="2" fill="#e8e8e8" />
            <rect x="250" y="75" width="45" height="65" rx="2" fill="#c0c0c0" /><rect x="255" y="80" width="10" height="12" rx="1" fill="#4f55f1" opacity="0.3" /><rect x="270" y="80" width="10" height="12" rx="1" fill="#4f55f1" opacity="0.25" /><rect x="262" y="115" width="16" height="25" rx="1" fill="#e8e8e8" />
            <rect x="310" y="90" width="35" height="50" rx="2" fill="#c0c0c0" /><rect x="315" y="95" width="8" height="10" rx="1" fill="#4f55f1" opacity="0.3" /><rect x="330" y="95" width="8" height="10" rx="1" fill="#4f55f1" opacity="0.2" /><rect x="318" y="115" width="14" height="25" rx="1" fill="#e8e8e8" />
          </svg>
        </div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <MapPin className="text-[#4f55f1]" size={24} />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#191c1f]">Звенигород</h1>
        </div>
        <h2 className="text-xl md:text-2xl font-light text-[#6b7280] mb-8 tracking-wide">Симулятор Мэра</h2>
        <p className="text-base text-[#6b7280] mb-8 max-w-lg mx-auto leading-relaxed">
          Вы — новый мэр Звенигорода. У вас два срока по 5 лет, чтобы превратить тихий подмосковный город в лучшее место для жизни на планете.
        </p>

        {/* Scenario picker */}
        <div className="mb-6 text-left max-w-md mx-auto">
          <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">Сценарий</h3>
          <div className="space-y-2">
            {SCENARIOS.map(s => (
              <button key={s.id} onClick={() => setScenarioId(s.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl border transition-colors ${scenarioId === s.id ? "border-[#4f55f1] bg-[#f7f7f7]" : "border-[#e0e0e0] bg-[#f7f7f7] hover:border-[#c0c0c0]"}`}>
                <div className="text-sm font-bold text-[#191c1f]">{s.name}</div>
                <div className="text-xs text-[#6b7280]">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty picker */}
        <div className="mb-8 text-left max-w-md mx-auto">
          <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">Сложность</h3>
          <div className="flex gap-2">
            {Object.entries(DIFFICULTIES).map(([id, d]) => (
              <button key={id} onClick={() => setDifficultyId(id)}
                className={`flex-1 px-3 py-2.5 rounded-full border text-sm font-medium transition-all active:scale-[0.95] ${difficultyId === id ? "border-[#4f55f1] bg-[#4f55f1] text-white shadow-md shadow-[#4f55f1]/20" : "border-[#e0e0e0] bg-[#f7f7f7] text-[#6b7280] hover:border-[#c0c0c0]"}`}>
                {d.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#9ca3af] mt-2 text-center">
            {difficultyId === "easy" && "💚 Больше бюджета, 3 решения за ход. Идеально для первого запуска."}
            {difficultyId === "normal" && "⚖️ Стандартный баланс. 2 решения, обычный бюджет."}
            {difficultyId === "hard" && "🔥 Меньше денег, быстрый износ. Для опытных мэров."}
            {difficultyId === "hardcore" && "💀 Минимум ресурсов, 1 решение за ход. Удачи."}
          </p>
        </div>

        {/* How to play */}
        <div className="mb-8 max-w-md mx-auto rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] p-4">
          <div className="grid grid-cols-4 gap-3 text-center">
            <div><div className="text-2xl mb-1">📋</div><div className="text-[10px] text-[#6b7280] leading-tight">Принимайте решения каждый квартал</div></div>
            <div><div className="text-2xl mb-1">📊</div><div className="text-[10px] text-[#6b7280] leading-tight">Следите за 8 метриками города</div></div>
            <div><div className="text-2xl mb-1">🗳️</div><div className="text-[10px] text-[#6b7280] leading-tight">Пройдите выборы на 20-м ходу</div></div>
            <div><div className="text-2xl mb-1">🏆</div><div className="text-[10px] text-[#6b7280] leading-tight">Поднимите город в мировом рейтинге</div></div>
          </div>
        </div>

        <button onClick={() => onStart(scenarioId, difficultyId)} className="inline-flex items-center gap-3 px-8 py-4 bg-[#191c1f] text-white font-semibold text-lg rounded-full hover:opacity-90 active:scale-[0.97] transition-all shadow-lg">
          <Play size={22} />Начать игру
        </button>
        <div className="mt-8 flex items-center gap-6 text-xs text-[#9ca3af] justify-center">
          <span>👥 25 000</span><span>💰 850 млн</span><span>📅 40 ходов</span><span>🗳️ 2 срока</span>
        </div>
      </FadeIn>
    </div>
  );
}

function CrisisPhase({ state, dispatch }) {
  const crisis = state.activeCrisis;
  if (!crisis) return null;
  const phase = getCurrentCrisisPhase(crisis);
  if (!phase) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <FadeIn className="max-w-xl w-full">
        <div className="rounded-3xl border border-[#e0e0e0] bg-[#f7f7f7] p-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-[#e23b4a]" size={24} />
            <span className="text-sm font-bold text-[#e23b4a] uppercase tracking-wider">Кризис: {crisis.name}</span>
            <span className="text-xs text-[#9ca3af] ml-auto">Фаза {crisis.currentPhase + 1} из {crisis.totalPhases}</span>
          </div>
          <p className="text-lg text-[#191c1f] leading-relaxed mb-4">{phase.description}</p>

          {/* Auto effects */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(phase.autoEffects || {}).map(([k, v]) => <EffectBadge key={k} metricKey={k} value={v} />)}
          </div>

          {/* Emergency actions */}
          {phase.emergencyActions && phase.emergencyActions.length > 0 && (
            <div className="space-y-3 mb-4">
              <h3 className="text-sm font-bold text-[#191c1f]">Экстренные меры:</h3>
              {phase.emergencyActions.map((action, i) => (
                <button key={i} onClick={() => dispatch({ type: "CRISIS_ACTION", actionIdx: i })}
                  className="w-full text-left rounded-2xl p-4 border border-[#e0e0e0] bg-[#f7f7f7] hover:border-[#c0c0c0] transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#191c1f] text-sm">{action.name}</span>
                    {action.cost > 0 && <span className="text-[#ec7e00] text-sm font-bold flex items-center gap-1"><Coins size={14} />{action.cost}</span>}
                    {action.cost === 0 && <span className="text-[#00a87e] text-xs">Бесплатно</span>}
                  </div>
                  <p className="text-xs text-[#6b7280] mb-2">{action.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(action.effects || {}).map(([k, v]) => <EffectBadge key={k} metricKey={k} value={v} />)}
                  </div>
                </button>
              ))}
            </div>
          )}

          <button onClick={() => dispatch({ type: "SKIP_CRISIS_ACTION" })}
            className="w-full py-3 bg-transparent text-[#191c1f] border-2 border-[#c0c0c0] font-medium rounded-full transition-colors text-sm hover:border-[#191c1f]">
            Не предпринимать мер
          </button>
        </div>
      </FadeIn>
    </div>
  );
}

function EventPhase({ event, onContinue, onChoice }) {
  if (!event) return null;
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <FadeIn className="max-w-xl w-full">
        <div className="rounded-3xl border border-[#ec7e00]/30 bg-[#f7f7f7] p-8">
          <div className="flex items-center gap-2 mb-6"><AlertTriangle className="text-[#ec7e00]" size={20} /><span className="text-sm font-bold text-[#ec7e00] uppercase tracking-wider">Событие</span></div>
          <p className="text-xl text-[#191c1f] leading-relaxed mb-6">{event.text}</p>
          {!event.choices && (
            <>
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(event.effects || {}).map(([k, v]) => <EffectBadge key={k} metricKey={k} value={v} />)}
                {event.budget !== 0 && event.budget && <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${event.budget > 0 ? "bg-[#e8e8e8] text-[#191c1f]" : "bg-[#e8e8e8] text-[#e23b4a]"}`}><Coins size={12} />{event.budget > 0 ? "+" : ""}{event.budget} млн</span>}
                {event.population && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#e8e8e8] text-[#6b7280]"><Users size={12} />{event.population > 0 ? "+" : ""}{event.population}</span>}
                {event.approval && <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${event.approval > 0 ? "bg-[#e8e8e8] text-[#191c1f]" : "bg-[#e8e8e8] text-[#e23b4a]"}`}><ThumbsUp size={12} />{event.approval > 0 ? "+" : ""}{event.approval}</span>}
              </div>
              <button onClick={onContinue} className="w-full py-3 bg-[#191c1f] text-white font-semibold rounded-full hover:opacity-90 active:scale-[0.97] transition-all">Продолжить</button>
            </>
          )}
          {event.choices && (
            <div className="space-y-3">
              {event.choices.map((choice, i) => (
                <button key={i} onClick={() => onChoice(i)} className="w-full text-left rounded-2xl p-4 border border-[#e0e0e0] bg-[#f7f7f7] hover:border-[#c0c0c0] transition-colors">
                  <div className="font-bold text-[#191c1f] mb-2">{choice.label}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(choice.effects || {}).map(([k, v]) => <EffectBadge key={k} metricKey={k} value={v} />)}
                    {choice.budget !== 0 && choice.budget && <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${choice.budget > 0 ? "bg-[#e8e8e8] text-[#191c1f]" : "bg-[#e8e8e8] text-[#e23b4a]"}`}><Coins size={12} />{choice.budget > 0 ? "+" : ""}{choice.budget}</span>}
                    {choice.population && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#e8e8e8] text-[#6b7280]"><Users size={12} />{choice.population > 0 ? "+" : ""}{choice.population}</span>}
                    {choice.approval && <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${choice.approval > 0 ? "bg-[#e8e8e8] text-[#191c1f]" : "bg-[#e8e8e8] text-[#e23b4a]"}`}><ThumbsUp size={12} />{choice.approval > 0 ? "+" : ""}{choice.approval}</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}

function MilestoneToast({ turn, metrics }) {
  const [show, setShow] = useState(true);
  useEffect(() => { const t = setTimeout(() => setShow(false), 5000); return () => clearTimeout(t); }, []);
  if (!show) return null;
  const msg = turn === 10 ? "🎯 10 кварталов за плечами! Первая четверть пути пройдена." : turn === 30 ? "⚡ 30-й квартал — финишная прямая! Осталось 10 ходов." : null;
  if (!msg) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <FadeIn><div className="px-6 py-3 rounded-2xl bg-[#f7f7f7] border border-[#4f55f1]/30 shadow-lg flex items-center gap-3">
        <Sparkles size={18} className="text-[#4f55f1]" />
        <span className="text-sm text-[#191c1f] font-medium">{msg}</span>
        <button onClick={() => setShow(false)} className="text-[#9ca3af] hover:text-[#191c1f]"><X size={14} /></button>
      </div></FadeIn>
    </div>
  );
}

function DecisionPhase({ state, dispatch }) {
  const { turn, budget, debt, population, metrics, prevMetrics, selectedDecisions, availableDecisions, globalRankIdx, satisfactions, prevSatisfactions, recurringEffects, costMultiplier, costMultiplierTurns, approval, zvenigorodScore, advisorComments } = state;
  const totalCost = selectedDecisions.reduce((s, id) => { const d = ALL_DECISIONS.find(x => x.id === id); return s + (d ? Math.round(d.cost * (costMultiplier || 1)) : 0); }, 0);
  const revenue = calcRevenue(population, metrics);
  const mandatory = calcMandatoryExpenses(population, metrics);
  const [showGroups, setShowGroups] = useState(false);
  const [showRankFull, setShowRankFull] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("groups");
  const [projectPickerFor, setProjectPickerFor] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const avgSat = calcAvgSatisfaction(satisfactions);
  const season = turn % 4;
  const SeasonIcon = SEASON_ICONS[season];
  const year = 2025 + Math.floor(turn / 4);
  const quarter = (turn % 4) + 1;
  const term = turn < ELECTION_TURN ? 1 : 2;
  const termTurn = turn < ELECTION_TURN ? turn + 1 : turn - ELECTION_TURN + 1;
  const metricHistory = (mk) => state.history.map(h => h.metrics[mk]);
  // Notification dots
  const hasLetters = (state.npcLetters || []).length > 0 && (state.respondedLetters || []).length < (state.npcLetters || []).length;
  const hasProtests = (state.activeProtests || []).length > 0;
  const hasCritical = METRIC_KEYS.some(k => metrics[k] < 20);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {(turn === 10 || turn === 30) && <MilestoneToast turn={turn} metrics={metrics} />}
      <FadeIn className="flex flex-col overflow-hidden h-full">
        {/* Header */}
        <div className="px-4 pt-2 pb-1 shrink-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1 rounded-lg hover:bg-[#f0f0f0] transition-colors" title="Панель метрик">
                {sidebarOpen ? <PanelLeftClose size={18} className="text-[#6b7280]" /> : <PanelLeftOpen size={18} className="text-[#6b7280]" />}
                {!sidebarOpen && (hasLetters || hasProtests || hasCritical) && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#e23b4a]" />}
              </button>
              <h1 className="text-lg md:text-xl font-bold text-[#191c1f]">Q{quarter} {year}</h1>
              <span className="text-xs text-[#9ca3af] hidden sm:inline">Срок {term}, ход {termTurn}/{ELECTION_TURN}</span>
              <span className="flex items-center gap-1 text-xs text-[#6b7280]"><SeasonIcon size={14} />{SEASON_NAMES[season]}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1" title="Одобрение мэра">
                <ThumbsUp size={14} className={approval >= 60 ? "text-[#00a87e]" : approval >= 40 ? "text-[#ec7e00]" : "text-[#e23b4a]"} />
                <span className="text-sm font-bold text-[#191c1f]">{Math.round(approval)}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Crown size={16} className="text-[#ec7e00]" />
                <span className="text-sm font-bold text-[#191c1f]">#{globalRankIdx + 1}</span>
              </div>
            </div>
          </div>
          <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>
            <div className="h-full rounded-full bg-[#4f55f1] transition-all duration-500" style={{ width: `${(turn / MAX_TURNS) * 100}%` }} />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-3 px-4 py-1.5 mx-4 rounded-2xl bg-[#f7f7f7] border border-[#ebebeb] text-xs shrink-0">
          <div className="flex items-center gap-1">
            <Coins size={13} className="text-[#ec7e00]" />
            <span className="font-bold text-[#191c1f]">{Math.round(budget)}</span>
            <span className="text-[#9ca3af]">млн</span>
          </div>
          <span className="text-[#9ca3af]">|</span>
          <span className="text-[#00a87e]">+{revenue}</span>
          <span className="text-[#e23b4a]">-{mandatory}</span>
          {totalCost > 0 && <span className="text-[#ec7e00]">-{totalCost}</span>}
          {(recurringEffects.budget||0) !== 0 && <span className={recurringEffects.budget > 0 ? "text-[#00a87e]" : "text-[#e23b4a]"}>{recurringEffects.budget > 0 ? "+" : ""}{recurringEffects.budget}/ход</span>}
          {debt > 0 && <span className="text-[#e23b4a] font-bold">Долг: {Math.round(debt)}</span>}
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <Users size={13} className="text-[#4f55f1]" />
            <span className="text-[#191c1f]">{population.toLocaleString("ru-RU")}</span>
          </div>
        </div>

        {costMultiplierTurns > 0 && <div className="mx-4 mt-1 px-4 py-1.5 rounded-full bg-[#f7f7f7] border border-[#e0e0e0] text-[#ec7e00] text-xs shrink-0">Цены на строительство +20% (осталось: {costMultiplierTurns})</div>}
        {(state.seasonCostMod || 1) !== 1 && <div className={`mx-4 mt-1 px-4 py-1.5 rounded-full bg-[#f7f7f7] border border-[#e0e0e0] text-xs shrink-0 ${state.seasonCostMod > 1 ? "text-[#e23b4a]" : "text-[#00a87e]"}`}>{state.seasonCostMod > 1 ? "❄️ Зимняя наценка +15% на решения" : "☀️ Летняя скидка -5% на решения"}</div>}
        {debt > 500 && <div className="mx-4 mt-1 px-4 py-1.5 rounded-full border text-xs bg-[#f7f7f7] border-[#e0e0e0] text-[#e23b4a] shrink-0">Долг: {Math.round(debt)} млн (Штраф: -2 ко всем метрикам!)</div>}
        {METRIC_KEYS.some(k => metrics[k] < 20) && <div className="mx-4 mt-1 px-4 py-1.5 rounded-full bg-[#f7f7f7] border border-[#e0e0e0] text-[#e23b4a] text-xs flex items-center gap-2 shrink-0"><AlertTriangle size={14} />Критическая ситуация: {METRIC_KEYS.filter(k=>metrics[k]<20).map(k=>METRICS_CFG[k].name).join(", ")}</div>}

        {/* Main content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 px-4 pb-2 overflow-hidden">
          {/* Sidebar */}
          <div className={`lg:col-span-4 overflow-y-auto pr-1 space-y-3 transition-all duration-300 ${sidebarOpen ? "block" : "hidden lg:block"}`}>
            <div className="rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] p-3">
              <h2 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">Метрики города</h2>
              <div className="space-y-1">
                {METRIC_KEYS.map(mk => {
                  const cfg = METRICS_CFG[mk];
                  const v = Math.round(metrics[mk]);
                  const pv = Math.round(prevMetrics[mk]);
                  const delta = v - pv;
                  const critical = v < 20;
                  const Icon = cfg.Icon;
                  return (
                    <div key={mk} className="flex items-center gap-1.5 h-5" title={`${cfg.name}: ${v}`}>
                      <Icon size={13} style={{ color: critical ? "#ef4444" : cfg.color }} />
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[#e8e8e8]">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, v))}%`, backgroundColor: critical ? "#ef4444" : cfg.color }} />
                      </div>
                      <span className={`text-xs font-mono w-5 text-right ${critical ? "text-[#e23b4a] font-bold" : "text-[#191c1f]"}`}>{v}</span>
                      {delta !== 0 && <span className={`text-xs w-5 text-right ${delta > 0 ? "text-[#00a87e]" : "text-[#e23b4a]"}`}>{delta > 0 ? "+" : ""}{delta}</span>}
                      {critical && <span className="text-[#e23b4a] text-xs">!</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Economy panel */}
            {state.economy && (() => {
              const econ = state.economy;
              const RATES = [5, 8, 10, 12, 15];
              const canChange = state.turn - (econ.lastTaxChangeTurn || -99) >= 4;
              const taxColor = econ.taxRate <= 8 ? "text-[#00a87e]" : econ.taxRate >= 12 ? "text-[#e23b4a]" : "text-[#ec7e00]";
              return (
                <div className="rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] p-3">
                  <h2 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">Экономика</h2>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <div className="text-[10px] text-[#9ca3af] mb-0.5">Безработица</div>
                      <div className={`text-sm font-bold ${econ.unemployment > 15 ? "text-[#e23b4a]" : econ.unemployment < 8 ? "text-[#00a87e]" : "text-[#ec7e00]"}`}>{econ.unemployment}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-[#9ca3af] mb-0.5">Зарплата</div>
                      <div className="text-sm font-bold text-[#191c1f]">{(econ.avgSalary/1000).toFixed(0)}к</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-[#9ca3af] mb-0.5">Бизнесов</div>
                      <div className="text-sm font-bold text-[#4f55f1]">{econ.businessCount}</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-[#6b7280]">Налог</span>
                      <span className={`text-xs font-bold ${taxColor}`}>{econ.taxRate}%</span>
                      {!canChange && <span className="text-[10px] text-[#9ca3af]">кд {4 - (state.turn - (econ.lastTaxChangeTurn || -99))} ход.</span>}
                    </div>
                    <div className="flex gap-1">
                      {RATES.map(r => (
                        <button key={r}
                          onClick={() => dispatch({ type: "CHANGE_TAX", rate: r })}
                          disabled={!canChange || r === econ.taxRate}
                          className={`flex-1 py-1 text-[10px] font-bold rounded-full transition-colors ${r === econ.taxRate ? "bg-[#4f55f1] text-white" : canChange ? "bg-[#e8e8e8] hover:bg-[#e0e0e0] text-[#191c1f]" : "bg-[#f7f7f7] text-[#9ca3af] cursor-default"}`}>
                          {r}%
                        </button>
                      ))}
                    </div>
                    <div className="mt-1 text-[10px] text-[#9ca3af] text-center">
                      {econ.taxRate < 10 ? "↓ меньше доходов, ↑ экономика" : econ.taxRate > 10 ? "↑ больше доходов, ↓ экономика" : "Стандартная ставка"}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* NPC Letters */}
            {(state.npcLetters || []).length > 0 && (
              <div className="rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] p-3">
                <h2 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">Почта мэра</h2>
                <div className="space-y-2">
                  {state.npcLetters.map((npc, i) => {
                    const letter = generateLetterText(npc, metrics);
                    if (!letter) return null;
                    const happy = letter.sentiment === "happy";
                    const responded = (state.respondedLetters || []).includes(npc.id);
                    return (
                      <div key={i} className="rounded-xl p-2 text-xs bg-[#f0f0f0] border border-[#ebebeb]">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span>{happy ? "😊" : "😠"}</span>
                          <span className="font-semibold text-[#191c1f] truncate flex-1">{npc.name}</span>
                          <span className="text-[#9ca3af] text-[10px] shrink-0">{npc.group}</span>
                        </div>
                        <p className={`italic leading-tight ${happy ? "text-[#00a87e]" : "text-[#e23b4a]"}`}>«{letter.text}»</p>
                        {!responded && (
                          <div className="flex gap-1.5 mt-1.5">
                            <button onClick={() => dispatch({ type: "RESPOND_TO_LETTER", npcId: npc.id, positive: true })}
                              className="flex-1 py-1 rounded-full bg-[#00a87e]/10 text-[#00a87e] text-[10px] font-semibold hover:bg-[#00a87e]/20 active:scale-[0.95] transition-all">
                              👍 Поддержать
                            </button>
                            <button onClick={() => dispatch({ type: "RESPOND_TO_LETTER", npcId: npc.id, positive: false })}
                              className="flex-1 py-1 rounded-full bg-[#e8e8e8] text-[#6b7280] text-[10px] font-semibold hover:bg-[#e0e0e0] active:scale-[0.95] transition-all">
                              Отклонить
                            </button>
                          </div>
                        )}
                        {responded && <div className="mt-1 text-[10px] text-[#9ca3af]">✓ Ответ отправлен</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active projects */}
            {(state.projects || []).filter(p => p.status === "building").length > 0 && (
              <div className="rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] p-3">
                <h2 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">Стройки города</h2>
                <div className="space-y-2">
                  {state.projects.filter(p => p.status === "building").map((p, i) => {
                    const progress = Math.round((p.currentTurn / p.totalTurns) * 100);
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#191c1f] truncate flex-1">{p.name}</span>
                          <span className="text-[#6b7280] ml-2 shrink-0 font-mono">{p.currentTurn}/{p.totalTurns}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#e8e8e8] overflow-hidden">
                          <div className="h-full rounded-full bg-[#4f55f1] transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                        {p.currentProblem && (
                          <div className="text-[10px] text-[#ec7e00] truncate">⚠️ {p.currentProblem.label || p.currentProblem.desc}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Protests */}
            {(state.activeProtests || []).length > 0 && (
              <div className="rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] p-3">
                <h2 className="text-xs font-bold text-[#e23b4a] uppercase tracking-wider mb-2">Протесты</h2>
                <div className="space-y-1.5">
                  {state.activeProtests.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span>{p.icon}</span>
                      <span className="text-[#e23b4a] flex-1 truncate">{p.name}</span>
                      <span className="text-[#e23b4a]/70 font-mono">{state.turn + 1 - p.startTurn} ход.</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active crisis widget */}
            {state.activeCrisis && (() => {
              const crisis = state.activeCrisis;
              const phase = getCurrentCrisisPhase(crisis);
              const CrisisIcon = ICON_MAP[crisis.icon] || AlertTriangle;
              return (
                <div className="rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CrisisIcon size={14} className="text-[#e23b4a] shrink-0" />
                    <span className="text-xs font-bold text-[#e23b4a] flex-1 truncate">{crisis.name}</span>
                    <span className="text-[10px] text-[#e23b4a] shrink-0">Фаза {crisis.currentPhase + 1}/{crisis.totalPhases}</span>
                  </div>
                  {phase && <p className="text-[11px] text-[#e23b4a]/80 leading-snug mb-2">{phase.description}</p>}
                  {phase && Object.keys(phase.autoEffects || {}).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(phase.autoEffects).map(([k, v]) => (
                        <span key={k} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${v < 0 ? "bg-[#e8e8e8] text-[#e23b4a]" : "bg-[#e8e8e8] text-[#00a87e]"}`}>
                          {METRICS_CFG[k]?.name} {v > 0 ? "+" : ""}{v}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 text-[10px] text-[#e23b4a]/60">⚠ Решение в конце хода</div>
                </div>
              );
            })()}

            {/* Tabs: Группы / Рейтинг / Соседи / Дума / Жители */}
            <div className="rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] p-3">
              <div className="flex gap-1 mb-3 flex-wrap">
                {[["groups","Группы"],["rank","Рейтинг"],["diplomacy","Соседи"],["duma","Дума"],["residents","Жители"]].map(([tab, label]) => (
                  <button key={tab} onClick={() => setSidebarTab(tab)}
                    className={`relative flex-1 py-1 text-[11px] font-semibold rounded-full transition-colors ${sidebarTab === tab ? "bg-[#4f55f1] text-white" : "bg-[#e8e8e8] text-[#6b7280] hover:text-[#191c1f]"}`}>
                    {label}
                    {tab === "residents" && hasLetters && sidebarTab !== "residents" && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#e23b4a]" />}
                  </button>
                ))}
              </div>

              {sidebarTab === "groups" && (
                <div className="space-y-1">
                  {GROUP_KEYS.map(k => <GroupSatisfaction key={k} groupKey={k} value={satisfactions[k]} prevValue={(prevSatisfactions||{})[k]||satisfactions[k]} />)}
                </div>
              )}

              {sidebarTab === "rank" && (
                <RankingTable zvScore={zvenigorodScore} rankIdx={globalRankIdx} expanded={showRankFull} onToggle={() => setShowRankFull(!showRankFull)} />
              )}

              {sidebarTab === "residents" && (() => {
                const allNPCs = (state.npcs || []).filter(n => n.status === "resident" || n.status === "moved_in");
                const sorted = [...allNPCs].sort((a, b) => a.satisfaction - b.satisfaction);
                const unhappy = sorted.slice(0, 3);
                const happy = sorted.slice(-3).reverse();
                const shown = [...unhappy, ...happy].filter((n, i, arr) => arr.findIndex(x => x.id === n.id) === i).slice(0, 6);
                if (shown.length === 0) return <div className="text-xs text-[#9ca3af] text-center py-4">Жители появятся после первого хода</div>;
                return (
                  <div className="space-y-1.5">
                    {shown.map(npc => {
                      const sat = Math.round(npc.satisfaction);
                      const happy = sat >= 60;
                      const sad = sat < 35;
                      const satColor = happy ? "text-[#00a87e]" : sad ? "text-[#e23b4a]" : "text-[#ec7e00]";
                      const barColor = happy ? "#10b981" : sad ? "#ef4444" : "#f59e0b";
                      const letter = generateLetterText(npc, metrics);
                      return (
                        <div key={npc.id} className="rounded-xl bg-[#f0f0f0] p-2 text-xs" title={letter ? `«${letter.text}»` : ""}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span>{happy ? "😊" : sad ? "😠" : "😐"}</span>
                            <span className="text-[#191c1f] font-medium flex-1 truncate">{npc.name}</span>
                            <span className={`font-bold font-mono ${satColor}`}>{sat}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[#9ca3af] text-[10px] truncate flex-1">{npc.group}</span>
                            <div className="w-16 h-1 rounded-full bg-[#e8e8e8] overflow-hidden shrink-0">
                              <div className="h-full rounded-full" style={{ width: `${sat}%`, backgroundColor: barColor }} />
                            </div>
                          </div>
                          {letter && <p className={`mt-1 text-[10px] italic leading-tight truncate ${happy ? "text-[#00a87e]/70" : "text-[#e23b4a]/70"}`}>«{letter.text}»</p>}
                        </div>
                      );
                    })}
                    <div className="text-[10px] text-[#9ca3af] text-center pt-1">{allNPCs.length} жителей в базе</div>
                  </div>
                );
              })()}

              {sidebarTab === "duma" && (() => {
                const deputies = state.deputies || [];
                if (deputies.length === 0) return <div className="text-xs text-[#9ca3af] text-center py-4">Депутаты появятся после первого хода</div>;
                const factionGroups = {};
                for (const d of deputies) {
                  if (!factionGroups[d.faction]) factionGroups[d.faction] = [];
                  factionGroups[d.faction].push(d);
                }
                return (
                  <div className="space-y-2">
                    {Object.entries(factionGroups).map(([fKey, members]) => {
                      const faction = FACTIONS[fKey];
                      if (!faction) return null;
                      const FIcon = ICON_MAP[faction.icon] || HelpCircle;
                      return (
                        <div key={fKey} className="rounded-xl bg-[#f0f0f0] p-2">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <FIcon size={12} className="text-[#4f55f1]" />
                            <span className="text-[10px] font-bold text-[#191c1f] uppercase tracking-wider">{faction.name}</span>
                            <span className="text-[10px] text-[#9ca3af] ml-auto">{faction.desc}</span>
                          </div>
                          {members.map(d => {
                            const loyaltyColor = d.loyalty >= 60 ? "text-[#00a87e]" : d.loyalty >= 40 ? "text-[#ec7e00]" : "text-[#e23b4a]";
                            return (
                              <div key={d.id} className="flex items-center gap-1.5 py-0.5 text-xs">
                                <span>{d.avatar}</span>
                                <span className="text-[#191c1f] flex-1 truncate">{d.shortName || d.name.split(" ").pop()}</span>
                                <span className={`font-mono text-[10px] ${loyaltyColor}`} title="Лояльность">{Math.round(d.loyalty)}%</span>
                                <div className="w-10 h-1 rounded-full bg-[#e8e8e8] overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${d.loyalty}%`, backgroundColor: d.loyalty >= 60 ? "#10b981" : d.loyalty >= 40 ? "#f59e0b" : "#ef4444" }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                    <div className="text-[10px] text-[#9ca3af] text-center pt-1">
                      Средняя лояльность: {Math.round(deputies.reduce((s, d) => s + d.loyalty, 0) / deputies.length)}%
                    </div>
                  </div>
                );
              })()}

              {sidebarTab === "diplomacy" && (
                <div className="space-y-2">
                  {NEIGHBORS.map(n => {
                    const rel = (state.neighborRelations || {})[n.id] || { relationship: 0, actionThisTurn: false };
                    const rv = rel.relationship;
                    const relColor = rv > 30 ? "text-[#00a87e]" : rv < -30 ? "text-[#e23b4a]" : "text-[#ec7e00]";
                    const barWidth = Math.max(0, Math.min(100, (rv + 100) / 2));
                    const barColor = rv > 0 ? "#10b981" : "#ef4444";
                    const availableActions = DIPLOMATIC_ACTIONS.filter(a => !a.allNeighbors && a.id !== "compete" && a.id !== "joint_project");
                    const availableProjects = JOINT_PROJECTS.filter(p => p.partner === n.id && rv >= p.relationshipRequired);
                    const isPicking = projectPickerFor === n.id;
                    return (
                      <div key={n.id} className="rounded-xl bg-[#f0f0f0] p-2 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[#191c1f] font-semibold">{n.icon} {n.name}</span>
                          <span className={`font-mono font-bold ${relColor}`}>{rv > 0 ? "+" : ""}{rv}</span>
                        </div>
                        <div className="h-1 rounded-full bg-[#e8e8e8] overflow-hidden mb-2">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${barWidth}%`, backgroundColor: barColor }} />
                        </div>

                        {/* Active joint project */}
                        {rel.activeProject && (
                          <div className="mb-2 space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-[#4f55f1] truncate flex-1">🤝 {rel.activeProject.name}</span>
                              <span className="text-[#9ca3af] ml-1 shrink-0">{rel.activeProject.currentTurn}/{rel.activeProject.totalTurns}</span>
                            </div>
                            <div className="h-1 rounded-full bg-[#e8e8e8] overflow-hidden">
                              <div className="h-full rounded-full bg-[#4f55f1] transition-all duration-500" style={{ width: `${Math.round(rel.activeProject.currentTurn / rel.activeProject.totalTurns * 100)}%` }} />
                            </div>
                          </div>
                        )}

                        {rel.actionThisTurn ? (
                          <span className="text-[#9ca3af] text-[10px]">Уже действовали этот ход</span>
                        ) : isPicking ? (
                          <div className="space-y-1.5">
                            <div className="text-[10px] text-[#6b7280] font-semibold">Выберите проект:</div>
                            {availableProjects.length === 0 && <div className="text-[10px] text-[#9ca3af]">Нужно больше доверия</div>}
                            {availableProjects.map(p => (
                              <button key={p.id}
                                disabled={!!rel.activeProject || budget < Math.round(p.totalCost * p.costShare)}
                                onClick={() => { dispatch({ type: "START_JOINT_PROJECT", neighborId: n.id, projectId: p.id }); setProjectPickerFor(null); }}
                                className="w-full text-left rounded-xl p-1.5 bg-[#f7f7f7] hover:bg-[#e8e8e8] disabled:opacity-40 border border-[#e0e0e0] transition-colors">
                                <div className="text-[#191c1f] mb-0.5 leading-tight">{p.name}</div>
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(p.effects).map(([k, v]) => (
                                    <span key={k} className={`text-[9px] px-1 rounded-full ${v > 0 ? "bg-[#e8e8e8] text-[#00a87e]" : "bg-[#e8e8e8] text-[#e23b4a]"}`}>{METRICS_CFG[k]?.name} {v > 0 ? "+" : ""}{v}</span>
                                  ))}
                                  <span className="text-[9px] px-1 rounded-full bg-[#e8e8e8] text-[#ec7e00]">−{Math.round(p.totalCost * p.costShare)} млн</span>
                                  <span className="text-[9px] px-1 rounded-full bg-[#e8e8e8] text-[#6b7280]">{p.duration} хода</span>
                                </div>
                              </button>
                            ))}
                            <button onClick={() => setProjectPickerFor(null)} className="text-[10px] text-[#9ca3af] hover:text-[#191c1f] transition-colors">← Назад</button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {availableActions.map(a => (
                              <button key={a.id}
                                onClick={() => dispatch({ type: "APPLY_DIPLOMATIC_ACTION", neighborId: n.id, actionId: a.id })}
                                disabled={budget < (a.baseCost || 0)}
                                className="px-1.5 py-0.5 bg-[#e8e8e8] hover:bg-[#e0e0e0] disabled:opacity-40 text-[#191c1f] rounded-full text-[10px] transition-colors"
                                title={`${a.name}${a.baseCost ? ` (−${a.baseCost} млн)` : " (бесплатно)"}`}>
                                {a.name.split(" ").slice(0, 2).join(" ")}
                              </button>
                            ))}
                            {!rel.activeProject && (
                              <button
                                onClick={() => setProjectPickerFor(n.id)}
                                className="px-1.5 py-0.5 bg-[#4f55f1]/80 hover:bg-[#4f55f1] text-white rounded-full text-[10px] transition-colors"
                                title="Предложить совместный проект">
                                🤝 Проект
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Decisions */}
          <div className="lg:col-span-8 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <h2 className="text-sm font-bold text-[#191c1f]">Решения ({selectedDecisions.length} из {MAX_PICKS})</h2>
              {totalCost > 0 && (
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${budget - totalCost >= 0 ? "bg-[#e8e8e8] text-[#6b7280]" : "bg-[#e23b4a]/10 text-[#e23b4a]"}`}>
                  После: {Math.round(budget - totalCost)} млн
                </span>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {availableDecisions.map(d => {
                  const cost = Math.round(d.cost * (costMultiplier||1));
                  const selected = selectedDecisions.includes(d.id);
                  const otherCost = totalCost - (selected ? cost : 0);
                  const affordable = (budget - otherCost - cost) >= -50;
                  return <DecisionCard key={d.id} decision={d} selected={selected} affordable={affordable||selected} onToggle={id => dispatch({ type: "SELECT_DECISION", id })} usageCount={state.decisionHistory[d.id]||0} costMultiplier={costMultiplier||1} advisorComment={(advisorComments||{})[d.id]} />;
                })}
              </div>
            </div>
            <div className="pt-2 shrink-0">
              <button onClick={() => { if (state.eventChoiceIndex != null) dispatch({ type: "SUBMIT_WITH_EVENT" }); else dispatch({ type: "SUBMIT_DECISIONS" }); }}
                className="w-full py-3 bg-[#191c1f] text-white font-semibold rounded-full transition-opacity text-base hover:opacity-85">
                {selectedDecisions.length === 0 ? "Пропустить ход" : "Завершить ход"}{selectedDecisions.length > 0 && <span className="text-[#9ca3af] ml-2">(-{totalCost} млн)</span>}
              </button>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

function generateNarrative(state) {
  const { metrics, prevMetrics, budget, prevBudget, population, prevPopulation, approval, activeProtests } = state;
  const prevApproval = state.history.length >= 2 ? state.history[state.history.length - 2].approval : approval;
  const budgetDelta = budget - prevBudget;
  const popDelta = population - prevPopulation;
  const approvalDelta = approval - prevApproval;

  const deltas = METRIC_KEYS.map(k => ({ key: k, name: METRICS_CFG[k].name, delta: Math.round(metrics[k] - prevMetrics[k]), val: Math.round(metrics[k]) }));
  const worst = deltas.reduce((a, b) => b.delta < a.delta ? b : a);
  const best = deltas.reduce((a, b) => b.delta > a.delta ? b : a);

  const parts = [];
  if (budgetDelta < -100) parts.push("Казна стремительно тает.");
  else if (budgetDelta > 50) parts.push("Бюджет подрос — неплохо!");
  if (worst.delta <= -5) parts.push(`${worst.name} просела на ${Math.abs(worst.delta)} — горожане недовольны.`);
  if (best.delta >= 3) parts.push(`${best.name} улучшилась на +${best.delta}.`);
  if ((activeProtests || []).length > 0) parts.push(`В городе ${activeProtests.length} акция(й) протеста.`);
  if (approvalDelta <= -5) parts.push("Рейтинг мэра падает.");
  else if (approvalDelta >= 5) parts.push("Горожане всё больше доверяют мэру.");
  if (popDelta < -100) parts.push("Люди уезжают из города.");
  if (state.debt > 300) parts.push("Долг растёт — нужны срочные меры.");

  if (parts.length === 0) parts.push("Спокойный квартал без потрясений.");
  return parts.slice(0, 2).join(" ");
}

function generateForesight(state) {
  const hints = [];
  const { metrics, neighborRelations, achievements, debt, approval, turn, approvalHistory } = state;

  // Crisis warnings
  for (const k of METRIC_KEYS) {
    const v = Math.round(metrics[k]);
    if (v < 25 && v >= 15) hints.push({ icon: "⚠️", type: "danger", text: `${METRICS_CFG[k].name} = ${v} — близко к кризису` });
  }

  // Debt warning
  if (debt > 200 && debt < 500) hints.push({ icon: "🏦", type: "danger", text: `Долг ${Math.round(debt)} млн — растёт из-за процентов` });

  // Approval danger
  if (approval < 30) hints.push({ icon: "📉", type: "danger", text: `Одобрение ${Math.round(approval)}% — риск отзыва мэра` });

  // Neighbor project opportunities
  if (neighborRelations) {
    for (const [nid, rel] of Object.entries(neighborRelations)) {
      if (rel.activeProject) continue;
      const neighbor = NEIGHBORS.find(n => n.id === nid);
      if (!neighbor) continue;
      const available = JOINT_PROJECTS.filter(p => p.partner === nid && rel.relationship >= p.relationshipRequired - 10 && rel.relationship < p.relationshipRequired);
      if (available.length > 0) {
        hints.push({ icon: "🤝", type: "opportunity", text: `${neighbor.name}: ещё +${available[0].relationshipRequired - rel.relationship} к отношениям — откроется проект` });
      }
    }
  }

  // Achievement near-miss
  const NEAR_ACHIEVEMENTS = [
    { id: "debt_free", check: (s) => s.debt === 0 && !s.achievements.includes("debt_free"), hint: "Нет долга — продержитесь до хода 20 для достижения «Финансист»" },
    { id: "green_city", check: (s) => s.metrics.ecology >= 75 && s.metrics.ecology < 90, hint: `Экология ${Math.round(metrics.ecology)} — нужно 90 для «Зелёного города»` },
    { id: "beloved", check: (s) => s.approval >= 75 && s.approval < 90, hint: `Одобрение ${Math.round(approval)}% — нужно 90 для «Народного мэра»` },
  ];
  for (const na of NEAR_ACHIEVEMENTS) {
    if (!achievements.includes(na.id) && na.check(state)) {
      hints.push({ icon: "🏆", type: "opportunity", text: na.hint });
    }
  }

  return hints.slice(0, 3);
}

function ResultsPhase({ state, dispatch }) {
  const { metrics, prevMetrics, population, prevPopulation, budget, prevBudget, globalRankIdx, satisfactions, prevSatisfactions, turnRevenue, turnExpenses, debt, turn, approval, zvenigorodScore } = state;
  const prevRankIdx = state.history.length >= 2 ? state.history[state.history.length - 2].globalRankIdx : globalRankIdx;
  const [dismissed, setDismissed] = useState(false);
  const [showChronicle, setShowChronicle] = useState(false);
  const turnLog = state.turnLog || [];
  const foresight = generateForesight(state);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      {!dismissed && <OvertakeToast msg={state.overtakeMsg} onDismiss={() => setDismissed(true)} />}
      <AchievementToast achievements={state.newAchievements} />
      <FadeIn className="max-w-2xl w-full">
        <div className="rounded-3xl bg-[#f7f7f7] border border-[#e0e0e0] p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#191c1f] mb-1">Итоги Q{(turn - 1) % 4 + 1} {2025 + Math.floor((turn - 1) / 4)}</h2>
            <p className="text-sm text-[#6b7280]">Квартал {turn} из {MAX_TURNS}</p>
            <p className="text-sm text-[#191c1f] italic mt-2">{generateNarrative(state)}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="text-center p-3 rounded-2xl bg-[#f0f0f0] border border-[#ebebeb]">
              <div className="text-xs text-[#6b7280] mb-1">Рейтинг</div>
              <div className="text-2xl font-bold text-[#191c1f] font-bold">#{globalRankIdx + 1}</div>
              <DeltaValue value={prevRankIdx - globalRankIdx} />
            </div>
            <div className="text-center p-3 rounded-2xl bg-[#f0f0f0] border border-[#ebebeb]">
              <div className="text-xs text-[#6b7280] mb-1">Бюджет</div>
              <div className="text-lg font-bold text-[#191c1f]">{Math.round(budget)}</div>
              <DeltaValue value={Math.round(budget - prevBudget)} suffix=" млн" />
            </div>
            <div className="text-center p-3 rounded-2xl bg-[#f0f0f0] border border-[#ebebeb]">
              <div className="text-xs text-[#6b7280] mb-1">Одобрение</div>
              <div className="text-lg font-bold text-[#191c1f] font-bold">{Math.round(approval)}%</div>
              <DeltaValue value={Math.round(approval - (state.history.length >= 2 ? state.history[state.history.length - 2].approval : approval))} suffix="%" />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-bold text-[#6b7280] uppercase mb-3">Метрики</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              {METRIC_KEYS.map(k => {
                const delta = Math.round(metrics[k] - prevMetrics[k]);
                return (
                  <div key={k} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-1.5">{React.createElement(METRICS_CFG[k].Icon, { size: 14, style: { color: METRICS_CFG[k].color } })}<span className="text-sm text-[#191c1f]">{METRICS_CFG[k].name}</span></div>
                    <div className="flex items-center gap-2"><span className="text-sm font-bold text-[#191c1f]">{Math.round(metrics[k])}</span>{delta !== 0 && <DeltaValue value={delta} />}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-6 p-3 rounded-xl bg-[#f0f0f0] flex items-center justify-between">
            <div className="flex items-center gap-2"><Users size={16} className="text-[#4f55f1]" /><span className="text-sm text-[#191c1f]">Население</span></div>
            <div className="flex items-center gap-2"><span className="text-sm font-bold text-[#191c1f]">{population.toLocaleString("ru-RU")}</span><DeltaValue value={population - prevPopulation} /></div>
          </div>

          {debt > 0 && <div className="mb-4 p-3 rounded-2xl text-center text-sm font-bold bg-[#f0f0f0] border border-[#ebebeb] text-[#e23b4a]">Долг: {Math.round(debt)} млн</div>}

          {/* Chronicle */}
          {turnLog.length > 0 && (
            <div className="mb-4">
              <button onClick={() => setShowChronicle(!showChronicle)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#6b7280] uppercase tracking-wider hover:text-[#191c1f] transition-colors mb-2">
                <span>📜 Хроника квартала ({turnLog.length})</span>
                {showChronicle ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showChronicle && (
                <div className="rounded-2xl bg-[#f0f0f0] border border-[#ebebeb] p-3 space-y-1.5 max-h-48 overflow-y-auto">
                  {turnLog.map((entry, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="shrink-0 mt-0.5">{entry.icon}</span>
                      <span className={`leading-snug ${entry.cat === "crisis" || entry.cat === "protest" ? "text-[#e23b4a]" : entry.cat === "rank" ? "text-[#ec7e00]" : entry.cat === "npc" ? "text-[#4f55f1]" : entry.cat === "diplomacy" ? "text-[#4f55f1]" : "text-[#191c1f]"}`}>{entry.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Foresight */}
          {foresight.length > 0 && (
            <div className="mb-6 rounded-xl border border-[#e0e0e0] bg-[#f0f0f0] p-3 space-y-2">
              <div className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-1">На следующий квартал</div>
              {foresight.map((h, i) => (
                <div key={i} className={`flex items-start gap-2 text-xs rounded-xl px-3 py-2 ${h.type === "danger" ? "bg-[#f7f7f7] text-[#e23b4a]" : "bg-[#f7f7f7] text-[#4f55f1]"}`}>
                  <span className="shrink-0">{h.icon}</span>
                  <span className="leading-snug">{h.text}</span>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => dispatch({ type: "NEXT_TURN" })}
            className="w-full py-4 bg-[#191c1f] text-white font-semibold rounded-full text-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all">
            {turn >= MAX_TURNS || state.defaulted ? "Результаты" : turn === ELECTION_TURN ? "К выборам!" : "Следующий квартал"}<ArrowRight size={20} />
          </button>
        </div>
      </FadeIn>
      <NewsBar news={state.news} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ELECTION
// ═══════════════════════════════════════════════════════════════════════════════

function ElectionCampaign({ state, dispatch }) {
  const [promiseIdx, setPromiseIdx] = useState(null);
  const startScore = state.history[0]?.zvScore || 38;
  const attrGrowth = Math.round(((state.zvenigorodScore - startScore) / Math.max(1, startScore)) * 100);
  const popGrowth = Math.round(((state.population - INIT_POP) / INIT_POP) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <FadeIn className="max-w-xl w-full">
        <div className="rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] p-8">
          <div className="text-center mb-6">
            <Vote className="mx-auto text-[#4f55f1] mb-3" size={40} />
            <h2 className="text-2xl font-bold text-[#191c1f] mb-2">Выборы мэра Звенигорода</h2>
            <p className="text-sm text-[#6b7280]">Ваш первый срок подошёл к концу. Жители решают, достойны ли вы второго срока.</p>
          </div>

          <div className="space-y-2 mb-6 p-4 rounded-2xl bg-[#f0f0f0] border border-[#ebebeb]">
            <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Одобрение:</span><span className="text-[#191c1f] font-bold">{Math.round(state.approval)}%</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Рост привлекательности:</span><span className={`font-bold ${attrGrowth > 0 ? "text-[#00a87e]" : "text-[#e23b4a]"}`}>{attrGrowth > 0 ? "+" : ""}{attrGrowth}%</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Население:</span><span className="text-[#191c1f] font-bold">{INIT_POP.toLocaleString("ru-RU")} → {state.population.toLocaleString("ru-RU")} ({popGrowth > 0 ? "+" : ""}{popGrowth}%)</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#6b7280]">Финансовая стабильность:</span><span className={state.neverHadDebt ? "text-[#00a87e] font-bold" : "text-[#ec7e00] font-bold"}>{state.neverHadDebt ? "Без долгов \u2713" : "Были проблемы"}</span></div>
          </div>

          <h3 className="text-sm font-bold text-[#191c1f] mb-3">Предвыборное обещание:</h3>
          <div className="space-y-2 mb-6">
            {ELECTION_PROMISES.map((p, i) => (
              <button key={p.id} onClick={() => { setPromiseIdx(i); dispatch({ type: "CHOOSE_PROMISE", index: i }); }}
                className={`w-full text-left p-3 rounded-2xl border transition-colors ${promiseIdx === i ? "border-[#4f55f1] bg-[#f7f7f7]" : "border-[#e0e0e0] bg-[#f7f7f7] hover:border-[#c0c0c0]"}`}>
                <div className="text-sm font-bold text-[#191c1f]">{p.label}</div>
                <div className="text-xs text-[#6b7280] mt-1">Бонус: {Object.entries(p.bonus).map(([k,v])=>`${METRICS_CFG[k]?.name} +${v}`).join(", ")} | Если не выполните — штраф к одобрению</div>
              </button>
            ))}
          </div>

          <button onClick={() => dispatch({ type: "START_ELECTION" })} disabled={promiseIdx === null}
            className="w-full py-4 bg-[#191c1f] text-white disabled:bg-[#e8e8e8] disabled:text-[#9ca3af] font-semibold rounded-full text-lg hover:opacity-90 active:scale-[0.97] transition-all">
            Начать подсчёт голосов
          </button>
        </div>
      </FadeIn>
    </div>
  );
}

function ElectionVote({ state, dispatch }) {
  const [counting, setCounting] = useState(true);
  const [displayPct, setDisplayPct] = useState(50);

  useEffect(() => {
    dispatch({ type: "ELECTION_RESULT" });
  }, []);

  useEffect(() => {
    if (!state.electionResult) return;
    const target = state.electionResult.votePercent;
    let current = 50;
    const interval = setInterval(() => {
      current += (target - current) * 0.1 + (Math.random() - 0.5) * 2;
      setDisplayPct(Math.round(current * 10) / 10);
      if (Math.abs(current - target) < 0.5) {
        setDisplayPct(target);
        setCounting(false);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [state.electionResult]);

  if (!state.electionResult) return null;
  const { won, votePercent, opponent } = state.electionResult;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <FadeIn className="max-w-xl w-full">
        <div className="rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] p-8 text-center">
          <h2 className="text-xl font-bold text-[#191c1f] mb-6">Подсчёт голосов</h2>

          <div className="mb-4">
            <div className="text-sm text-[#6b7280] mb-2">Ваш оппонент: <span className="text-[#191c1f]">{opponent.avatar} {opponent.name}</span></div>
            <div className="text-xs text-[#9ca3af] italic">{"\u00AB"}{opponent.slogan}{"\u00BB"}</div>
          </div>

          <div className="relative h-8 rounded-full overflow-hidden bg-[#e8e8e8] mb-4">
            <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 bg-[#4f55f1]" style={{ width: `${displayPct}%` }} />
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#191c1f]">{displayPct}% за вас | {Math.round((100 - displayPct) * 10) / 10}% за оппонента</div>
          </div>

          {!counting && (
            <FadeIn>
              <div className={`text-3xl font-bold mb-4 ${won ? "text-[#00a87e]" : "text-[#e23b4a]"}`}>{won ? "\uD83C\uDF89 Вы переизбраны!" : "\uD83D\uDE14 Вы проиграли"}</div>
              <p className="text-sm text-[#6b7280] mb-6">{won ? "Жители доверили вам ещё 5 лет. Не подведите!" : `Жители выбрали ${opponent.name} новым мэром.`}</p>
              <button onClick={() => { if (won) dispatch({ type: "START_SECOND_TERM" }); else dispatch({ type: "NEXT_TURN" }); }}
                className="w-full py-4 bg-[#191c1f] text-white font-semibold rounded-full text-lg hover:opacity-90 active:scale-[0.97] transition-all">
                {won ? "Начать второй срок" : "Посмотреть итоги"}
              </button>
            </FadeIn>
          )}
        </div>
      </FadeIn>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ELECTION LOSS SCREEN (Game Over)
// ═══════════════════════════════════════════════════════════════════════════════

function ElectionLossScreen({ state, dispatch }) {
  const { electionResult, satisfactions, metrics } = state;
  const { votePercent, opponent } = electionResult;
  const opponentPct = Math.round((100 - votePercent) * 10) / 10;

  // Bottom 3 group satisfactions
  const sortedGroups = GROUP_KEYS
    .map(k => ({ key: k, name: GROUPS[k].name, value: Math.round(satisfactions[k]) }))
    .sort((a, b) => a.value - b.value)
    .slice(0, 3);

  // 3 metrics that dropped the most from initial values
  const metricDrops = METRIC_KEYS
    .map(k => ({ key: k, name: METRICS_CFG[k]?.name, delta: Math.round(metrics[k]) - INIT_METRICS[k] }))
    .sort((a, b) => a.delta - b.delta)
    .slice(0, 3)
    .filter(m => m.delta < 0);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <FadeIn className="max-w-xl w-full">
        <div className="rounded-3xl bg-[#f7f7f7] border border-[#e0e0e0] p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e8e8e8] border border-[#e0e0e0] mb-4">
              <Skull size={32} className="text-[#e23b4a]" />
            </div>
            <h2 className="text-3xl font-bold text-[#e23b4a] tracking-tight">Поражение на выборах</h2>
            <p className="text-[#9ca3af] text-sm mt-2">Ваше правление окончено</p>
          </div>

          {/* Vote bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-[#9ca3af] mb-1.5">
              <span>Вы: {votePercent}%</span>
              <span>{opponent.name}: {opponentPct}%</span>
            </div>
            <div className="relative h-6 rounded-full overflow-hidden bg-[#f7f7f7] border border-[#e0e0e0]">
              <div className="absolute inset-y-0 left-0 rounded-l-full bg-[#e23b4a]" style={{ width: `${votePercent}%` }} />
              <div className="absolute inset-y-0 right-0 rounded-r-full bg-[#00a87e]" style={{ width: `${opponentPct}%` }} />
            </div>
          </div>

          {/* Winner */}
          <div className="rounded-2xl bg-[#f0f0f0] border border-[#ebebeb] p-4 mb-6 text-center">
            <p className="text-[#191c1f] text-sm leading-relaxed">
              Жители Звенигорода выбрали нового мэра — <span className="text-[#191c1f] font-bold">{opponent.name}</span>.
            </p>
            <p className="text-xs text-[#9ca3af] italic mt-1.5">{"\u00AB"}{opponent.slogan}{"\u00BB"}</p>
          </div>

          {/* Worst groups */}
          {sortedGroups.length > 0 && (
            <div className="rounded-2xl bg-[#f0f0f0] border border-[#ebebeb] p-4 mb-4">
              <h3 className="text-xs font-bold text-[#e23b4a] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <UserMinus size={14} />Что пошло не так:
              </h3>
              <div className="space-y-2">
                {sortedGroups.map(g => (
                  <div key={g.key} className="flex items-center justify-between">
                    <span className="text-sm text-[#6b7280]">{g.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-[#f7f7f7] overflow-hidden">
                        <div className="h-full rounded-full bg-[#e23b4a]" style={{ width: `${g.value}%` }} />
                      </div>
                      <span className="text-xs font-mono text-[#e23b4a] w-8 text-right">{g.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics that dropped most */}
          {metricDrops.length > 0 && (
            <div className="rounded-2xl bg-[#f0f0f0] border border-[#ebebeb] p-4 mb-8">
              <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <TrendingUp size={14} className="rotate-180" />Наибольшие потери:
              </h3>
              <div className="space-y-1.5">
                {metricDrops.map(m => (
                  <div key={m.key} className="flex items-center justify-between text-sm">
                    <span className="text-[#6b7280]">{m.name}</span>
                    <span className="font-mono text-[#e23b4a]">{m.delta}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => dispatch({ type: "RESTART" })}
              className="w-full py-4 bg-[#191c1f] text-white font-semibold rounded-full text-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all"
            >
              <RotateCcw size={20} />Играть снова
            </button>
            <button
              onClick={() => dispatch({ type: "RESTART_FRESH" })}
              className="w-full py-3 bg-transparent text-[#191c1f] font-medium rounded-full text-sm border-2 border-[#c0c0c0] flex items-center justify-center gap-2 transition-colors hover:border-[#191c1f]"
            >
              <Zap size={16} />Другой сценарий
            </button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// END SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function EndScreen({ state, onRestart, onRestartFresh }) {
  const grade = getGrade(state.globalRankIdx);
  const history = state.history;
  const rankData = history.map(h => ({ turn:`К${h.turn}`, rank: h.globalRankIdx + 1 }));
  const popData = history.map(h => ({ turn:`К${h.turn}`, pop: h.population }));
  const playStyle = getPlayStyle(history);

  const bestMetric = METRIC_KEYS.reduce((b, k) => { const d = state.metrics[k] - INIT_METRICS[k]; return d > b.delta ? { key: k, delta: d } : b; }, { key: "", delta: -Infinity });
  const worstMetric = METRIC_KEYS.reduce((w, k) => { const d = state.metrics[k] - INIT_METRICS[k]; return d < w.delta ? { key: k, delta: d } : w; }, { key: "", delta: Infinity });

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      <FadeIn className="max-w-3xl mx-auto">
        <div className="text-center rounded-3xl bg-[#f7f7f7] border border-[#e0e0e0] p-8 mb-6">
          {state.defaulted && <div className="mb-4 px-4 py-2 inline-block rounded-full bg-[#e23b4a]/10 text-[#e23b4a] text-sm font-bold">💸 Дефолт! Город обанкротился.</div>}
          {state.electionResult && !state.electionResult.won && <div className="mb-4 px-4 py-2 inline-block rounded-full bg-[#e23b4a]/10 text-[#e23b4a] text-sm font-bold">🗳️ Проиграли выборы.</div>}
          <div className="text-8xl font-bold mb-2" style={{ color: grade.color }}>{grade.letter}</div>
          <div className="text-xl font-bold text-[#191c1f] mb-1">{grade.label}</div>
          <div className="text-[#6b7280]">Рейтинг: <span className="text-[#191c1f] font-bold">#{state.globalRankIdx + 1}</span> из {WORLD_CITIES.length + 1}</div>
          <div className="text-[#9ca3af] text-sm mt-1">Население: {state.population.toLocaleString("ru-RU")} | Стиль: {playStyle}</div>

          {/* Narrative summary */}
          <div className="mt-4 text-sm text-[#6b7280] leading-relaxed max-w-lg mx-auto">
            {state.defaulted
              ? "Бюджет Звенигорода не выдержал. В следующий раз попробуйте снизить налоги для роста экономики или выбрать менее затратные проекты."
              : state.globalRankIdx < 15
              ? `Выдающийся результат! Звенигород стал одним из лучших городов мира. Ваш стиль «${playStyle}» вошёл в историю.`
              : state.globalRankIdx < 50
              ? `Хорошее правление! Звенигород вырос и окреп. Попробуйте другой сценарий, чтобы войти в топ-15.`
              : `Город пережил ваше правление, но потенциал не раскрыт. Сбалансируйте метрики и следите за бюджетом — и рейтинг пойдёт вверх.`
            }
          </div>
        </div>

        {/* Achievements */}
        <div className="rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#191c1f] flex items-center gap-2"><Trophy size={16} className="text-[#ec7e00]" />Достижения</h3>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#e8e8e8] text-[#6b7280]">{state.achievements.length} / {ACHIEVEMENTS.length}</span>
          </div>
          {state.achievements.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-3">
              {state.achievements.map(id => { const a = ACHIEVEMENTS.find(x => x.id === id); return a ? <div key={id} className="px-3 py-1.5 rounded-full bg-[#4f55f1]/10 border border-[#4f55f1]/20 text-sm text-[#191c1f] font-medium"><span className="mr-1">{a.icon}</span>{a.name}</div> : null; })}
            </div>
          ) : (
            <p className="text-sm text-[#9ca3af]">Пока нет разблокированных достижений</p>
          )}
          {/* Locked achievements hint */}
          {state.achievements.length < ACHIEVEMENTS.length && (
            <div className="flex flex-wrap gap-1.5">
              {ACHIEVEMENTS.filter(a => !state.achievements.includes(a.id)).slice(0, 4).map(a => (
                <span key={a.id} className="px-2.5 py-1 rounded-full bg-[#f0f0f0] border border-[#ebebeb] text-xs text-[#9ca3af]">🔒 {a.name}</span>
              ))}
              {ACHIEVEMENTS.length - state.achievements.length > 4 && <span className="px-2 py-1 text-xs text-[#9ca3af]">+{ACHIEVEMENTS.length - state.achievements.length - 4} ещё</span>}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] p-6 mb-6">
          <h3 className="text-sm font-bold text-[#191c1f] mb-4">Сравнение метрик</h3>
          <div className="space-y-2">
            {METRIC_KEYS.map(k => {
              const start = INIT_METRICS[k];
              const end = Math.round(state.metrics[k]);
              const delta = end - start;
              return (
                <div key={k} className="flex items-center gap-3">
                  {React.createElement(METRICS_CFG[k].Icon, { size: 16, style: { color: METRICS_CFG[k].color } })}
                  <span className="text-sm text-[#6b7280] w-32 shrink-0">{METRICS_CFG[k].name}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs text-[#9ca3af] w-8 text-right">{start}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${end}%`, backgroundColor: METRICS_CFG[k].color }} />
                    </div>
                    <span className="text-sm font-bold text-[#191c1f] w-8">{end}</span>
                    <div className="w-12 text-right"><DeltaValue value={delta} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] p-4">
            <h3 className="text-sm font-bold text-[#191c1f] mb-3">Рейтинг</h3>
            <div className="h-48"><ResponsiveContainer width="100%" height="100%"><LineChart data={rankData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" /><XAxis dataKey="turn" tick={{ fill:"#64748b", fontSize:10 }} /><YAxis reversed tick={{ fill:"#64748b", fontSize:10 }} /><RTooltip contentStyle={{ backgroundColor:"#fff", border:"1px solid #e0e0e0", borderRadius:"12px", boxShadow:"0 4px 12px rgba(0,0,0,0.08)" }} /><Line type="monotone" dataKey="rank" stroke="#4f55f1" strokeWidth={2} dot={{ r:2, fill:"#4f55f1" }} name="Позиция" /></LineChart></ResponsiveContainer></div>
          </div>
          <div className="rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] p-4">
            <h3 className="text-sm font-bold text-[#191c1f] mb-3">Население</h3>
            <div className="h-48"><ResponsiveContainer width="100%" height="100%"><LineChart data={popData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" /><XAxis dataKey="turn" tick={{ fill:"#64748b", fontSize:10 }} /><YAxis tick={{ fill:"#64748b", fontSize:10 }} /><RTooltip contentStyle={{ backgroundColor:"#fff", border:"1px solid #e0e0e0", borderRadius:"12px", boxShadow:"0 4px 12px rgba(0,0,0,0.08)" }} /><Line type="monotone" dataKey="pop" stroke="#06b6d4" strokeWidth={2} dot={{ r:2, fill:"#06b6d4" }} name="Население" /></LineChart></ResponsiveContainer></div>
          </div>
        </div>

        <div className="rounded-2xl bg-[#f7f7f7] border border-[#e0e0e0] p-6 mb-6">
          <h3 className="text-sm font-bold text-[#191c1f] mb-3">Итоги правления</h3>
          <div className="space-y-2 text-sm text-[#6b7280]">
            {bestMetric.delta > 0 && <p>Лучший рост: <span className="text-[#191c1f] font-medium">{METRICS_CFG[bestMetric.key]?.name}</span> <span className="text-[#00a87e]">+{bestMetric.delta}</span></p>}
            {worstMetric.delta < 0 && <p>Наибольшее падение: <span className="text-[#191c1f] font-medium">{METRICS_CFG[worstMetric.key]?.name}</span> <span className="text-[#e23b4a]">{worstMetric.delta}</span></p>}
            <p>Финальный бюджет: <span className="text-[#191c1f] font-medium">{Math.round(state.budget)} млн</span></p>
            {state.debt > 0 && <p>Долг: <span className="text-[#e23b4a] font-medium">{Math.round(state.debt)} млн</span></p>}
            <p>Население: <span className="text-[#191c1f] font-medium">{state.population > INIT_POP ? "+" : ""}{state.population - INIT_POP}</span></p>
            <p>Кварталов: <span className="text-[#191c1f] font-medium">{state.turn}</span> | Одобрение: <span className="text-[#191c1f] font-medium">{Math.round(state.approval)}%</span></p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={onRestart} className="w-full py-4 bg-[#191c1f] text-white font-semibold rounded-full text-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all"><RotateCcw size={20} />Играть снова</button>
          <button onClick={onRestartFresh} className="w-full py-3 bg-transparent text-[#191c1f] font-medium rounded-full text-sm border-2 border-[#c0c0c0] flex items-center justify-center gap-2 transition-colors hover:border-[#191c1f]"><Zap size={16} />Другой сценарий</button>
        </div>
      </FadeIn>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

export default function ZvenigorodMayorSim() {
  const [state, dispatch] = useReducer(gameReducer, Date.now(), createInitialState);

  return (
    <div className="min-h-screen bg-white text-[#191c1f] selection:bg-[#4f55f1]/30" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c0c0c0; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
        @keyframes notif-ping { 0% { transform: scale(1); opacity:1; } 75% { transform: scale(1.8); opacity:0; } 100% { transform: scale(1); opacity:0; } }
        .notif-dot::after { content:''; position:absolute; inset:-1px; border-radius:9999px; animation: notif-ping 1.5s cubic-bezier(0,0,0.2,1) infinite; background: inherit; }
      `}</style>
      {state.phase === "start" && <StartScreen onStart={(scenarioId, difficultyId) => dispatch({ type: "START_GAME", seed: Date.now(), scenarioId, difficultyId })} />}
      {state.phase === "crisis" && <CrisisPhase state={state} dispatch={dispatch} />}
      {state.phase === "event" && <EventPhase event={state.currentEvent} onContinue={() => dispatch({ type: "CONTINUE_EVENT" })} onChoice={(i) => dispatch({ type: "CHOOSE_EVENT", index: i })} />}
      {state.phase === "decisions" && <DecisionPhase state={state} dispatch={dispatch} />}
      {state.phase === "results" && <ResultsPhase state={state} dispatch={dispatch} />}
      {state.phase === "election_campaign" && <ElectionCampaign state={state} dispatch={dispatch} />}
      {state.phase === "election_vote" && <ElectionVote state={state} dispatch={dispatch} />}
      {state.phase === "election_result" && <ElectionVote state={state} dispatch={dispatch} />}
      {state.phase === "election_loss" && <ElectionLossScreen state={state} dispatch={dispatch} />}
      {state.phase === "end" && <EndScreen state={state} onRestart={() => dispatch({ type: "RESTART" })} onRestartFresh={() => dispatch({ type: "RESTART_FRESH" })} />}
    </div>
  );
}
