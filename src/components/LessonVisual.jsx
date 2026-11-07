import React, { useEffect, useMemo, useState } from "react";
import "../styles/lesson-visual.css";

function StaticVisual({ block }) {
  const src = block.src || block.asset;
  if (!src) return null;
  return (
    <figure className="lv-figure">
      <img className="lv-image" src={src} alt={block.alt || block.description || block.title || "המחשה לימודית"} loading="lazy" />
      {(block.caption || block.description) && <figcaption>{block.caption || block.description}</figcaption>}
    </figure>
  );
}

function FrameSequence({ block }) {
  const frames = Array.isArray(block.frames) ? block.frames : [];
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(Math.min(Math.max(Number(block.playback?.fps) || 2, 0.5), 8));
  useEffect(() => { setIndex(0); setPlaying(false); }, [block]);
  useEffect(() => {
    if (!playing || frames.length < 2) return;
    const timer = window.setInterval(() => setIndex(i => {
      if (i === frames.length - 1 && block.playback?.loop === false) { setPlaying(false); return i; }
      return (i + 1) % frames.length;
    }), 1000 / speed);
    return () => window.clearInterval(timer);
  }, [playing, speed, frames.length, block.playback?.loop]);
  if (!frames.length) return <p>לא הוגדרו תמונות לרצף.</p>;
  const frame = frames[index];
  const src = typeof frame === "string" ? frame : frame.src;
  return (
    <div className="lv-sequence" dir="rtl">
      <div className="lv-frame"><img src={src} alt={`${block.title || "אנימציה"}, פריים ${index + 1}`} /></div>
      <div className="lv-controls">
        <button type="button" onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0}>הקודם</button>
        <button type="button" onClick={() => setPlaying(p => !p)} aria-pressed={playing}>{playing ? "עצירה ❚❚" : "הפעלה ▶"}</button>
        <button type="button" onClick={() => setIndex(i => (i + 1) % frames.length)}>הבא</button>
        <span className="lv-count" aria-live="polite">{index + 1} / {frames.length}</span>
        <label>מהירות <select value={speed} onChange={e => setSpeed(Number(e.target.value))}><option value="1">1 fps</option><option value="2">2 fps</option><option value="4">4 fps</option><option value="6">6 fps</option></select></label>
      </div>
      <input type="range" className="lv-scrub" min={0} max={frames.length - 1} value={index} onChange={e => { setIndex(Number(e.target.value)); setPlaying(false); }} aria-label="בחירת פריים" />
      {block.description && <p className="lv-hint">{block.description}</p>}
    </div>
  );
}

const COLORS = ["#157d65", "#dc7845", "#5378bf", "#9d65a7"];
function LineChart({ block }) {
  const data = Array.isArray(block.data) ? block.data : [];
  const series = (Array.isArray(block.series) ? block.series : []).filter(s => s.dataKey);
  const [selected, setSelected] = useState(null);
  const xKey = block.xKey || "time";
  const W = 720, H = 360;
  const m = { left: 68, right: 22, top: 20, bottom: 54 };
  const pw = W - m.left - m.right, ph = H - m.top - m.bottom;
  const values = data.flatMap(row => series.map(s => Number(row[s.dataKey]))).filter(Number.isFinite);
  const xv = data.map(row => Number(row[xKey])).filter(Number.isFinite);
  if (!data.length || !values.length || !xv.length || !series.length) {
    return block.asset ? <StaticVisual block={{ ...block, src: block.asset }} /> : <p>לא הוגדרו נתונים לגרף.</p>;
  }
  const xmin = Math.min(...xv), xmax = Math.max(...xv), ymin0 = Math.min(...values), ymax0 = Math.max(...values);
  const ymin = Math.min(0, ymin0), ymax = Math.max(1, ymax0);
  const sx = x => m.left + ((x - xmin) / (xmax - xmin || 1)) * pw;
  const sy = y => m.top + ph - ((y - ymin) / (ymax - ymin || 1)) * ph;
  const ticks = [0, 1, 2, 3, 4, 5];
  const idx = selected === null ? Math.min(data.length - 1, Math.floor(data.length / 2)) : Math.min(selected, data.length - 1);
  const active = data[idx];
  return (
    <div className="lv-chart">
      <svg viewBox={`0 0 ${W} ${H}`} className="lv-chart-svg" role="img" aria-label={block.title || "גרף קווי"}>
        {ticks.map(t => { const y = ymin + t * (ymax - ymin) / 5; return <g key={`y${t}`}><line x1={m.left} x2={W - m.right} y1={sy(y)} y2={sy(y)} stroke="#e6ecea" /><text x={m.left - 10} y={sy(y)+4} textAnchor="end" fontSize="13" fill="#54635f">{y.toFixed(1)}</text></g>; })}
        {ticks.map(t => { const x = xmin + t * (xmax - xmin) / 5; return <text key={`x${t}`} x={sx(x)} y={H - m.bottom + 22} textAnchor="middle" fontSize="13" fill="#54635f">{x.toFixed(1)}</text>; })}
        <line x1={m.left} y1={m.top} x2={m.left} y2={m.top + ph} stroke="#748581" />
        <line x1={m.left} y1={m.top + ph} x2={W-m.right} y2={m.top+ph} stroke="#748581" />
        {series.map((s, si) => {
          const points = data.map(row => ({x:Number(row[xKey]), y:Number(row[s.dataKey])})).filter(p => Number.isFinite(p.x) && Number.isFinite(p.y));
          return <polyline key={s.dataKey} points={points.map(p => `${sx(p.x)},${sy(p.y)}`).join(" ")} fill="none" stroke={COLORS[si % COLORS.length]} strokeWidth="3" strokeLinejoin="round" />;
        })}
        <line x1={sx(Number(active[xKey]))} x2={sx(Number(active[xKey]))} y1={m.top} y2={m.top + ph} stroke="#8faaa1" strokeDasharray="4 4" />
        {series.map((s, si) => <circle key={s.dataKey} cx={sx(Number(active[xKey]))} cy={sy(Number(active[s.dataKey]))} r="5" fill={COLORS[si % COLORS.length]} stroke="white" strokeWidth="2" />)}
        <text x={m.left + pw/2} y={H-8} textAnchor="middle" fontSize="15" fill="#314d44">{block.xLabel || xKey}</text>
        <text transform={`translate(18 ${m.top+ph/2}) rotate(-90)`} textAnchor="middle" fontSize="15" fill="#314d44">{block.yLabel || "ערך"}</text>
      </svg>
      <input className="lv-scrub" type="range" min={0} max={data.length-1} value={idx} onChange={e => setSelected(Number(e.target.value))} aria-label="בחירת נקודה על הגרף" />
      <div className="lv-chart-readout" dir="ltr">{xKey}: {Number(active[xKey]).toFixed(2)}{series.map(s => <span key={s.dataKey}> · {s.label || s.dataKey}: {Number(active[s.dataKey]).toFixed(3)}</span>)}</div>
      {block.equation && <p className="lv-equation" dir="ltr">{block.equation}</p>}
      {block.explanation && <p className="lv-hint">{block.explanation}</p>}
    </div>
  );
}

function Calculator({ block }) {
  const [value, setValue] = useState(Number(block.initial ?? block.min ?? 1));
  const min = Number(block.min ?? 0), max = Number(block.max ?? 10), step = Number(block.step ?? 0.5);
  // Only explicitly supported calculators; do not evaluate arbitrary JSON formulas.
  const supported = block.calculatorType === "larmor" && block.variable === "B0";
  const result = supported ? 42.58 * value : null;
  if (!supported) return <p>סוג המחשבון הזה עדיין אינו נתמך.</p>;
  return (
    <div className="lv-calculator" dir="rtl">
      <label htmlFor="lv-b0">עוצמת השדה המגנטי B₀ (Tesla)</label>
      <div className="lv-calc-row">
        <input id="lv-b0" type="range" min={min} max={max} step={step} value={value} onChange={e => setValue(Number(e.target.value))} />
        <input type="number" min={min} max={max} step={step} value={value} aria-label="עוצמת השדה בטסלה" onChange={e => { const v=Number(e.target.value); if (Number.isFinite(v)) setValue(Math.min(max,Math.max(min,v))); }} />
      </div>
      <div className="lv-result"><span>תדירות לרמור של מימן (¹H)</span><strong dir="ltr">{result.toFixed(2)} MHz</strong></div>
      <p className="lv-equation" dir="ltr">f₀ = 42.58 MHz/T × B₀</p>
      <p className="lv-hint">שני הערכים מתעדכנים יחד. ככל שהשדה חזק יותר, תדירות לרמור גבוהה יותר.</p>
    </div>
  );
}

export default function LessonVisual({ block }) {
  if (!block) return null;
  if (block.type === "image" || block.type === "diagram") return <StaticVisual block={block} />;
  if (block.type === "frameSequence") return <FrameSequence block={block} />;
  if (block.type === "chart") return <LineChart block={block} />;
  if (block.type === "calculator") return <Calculator block={block} />;
  return null;
}
