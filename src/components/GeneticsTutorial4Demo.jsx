import React from "react";
import "../styles/genetics-tutorial4-demo.css";

// This component is intentionally an illustration, not a second flowchart.
// It supports the existing step.demo.mode / step.demo.phase JSON structure.
const CLASSES = [
  { key: "A_B_", count: 9, A: true, B: true, genotype: "A_B_" },
  { key: "A_bb", count: 3, A: true, B: false, genotype: "A_bb" },
  { key: "aaB_", count: 3, A: false, B: true, genotype: "aaB_" },
  { key: "aabb", count: 1, A: false, B: false, genotype: "aabb" },
];
const MODE_INFO = {
  recessive: { labels: { blue: "כחול", red: "אדום", white: "לבן" }, order: ["blue", "red", "white"], ratio: "9 : 3 : 4" },
  dominant: { labels: { white: "לבן", blue: "כחול", red: "אדום" }, order: ["white", "blue", "red"], ratio: "12 : 3 : 1" },
  complement: { labels: { blue: "כחול", white: "לבן" }, order: ["blue", "white"], ratio: "9 : 7" },
  duplicate: { labels: { blue: "כחול", white: "לבן" }, order: ["blue", "white"], ratio: "15 : 1" },
  suppressor: { labels: { normal: "תקין", mutant: "מוטנטי" }, order: ["normal", "mutant"], ratio: "13 : 3" },
  pineapple: { labels: { piping: "Piping", tip: "Spiny tip", spiny: "Spiny" }, order: ["piping", "tip", "spiny"], ratio: "12 : 3 : 1" },
};
function phenotype(mode, entry) {
  const { A, B } = entry;
  if (mode === "recessive") return !A ? "white" : B ? "blue" : "red";
  if (mode === "dominant") return A ? "white" : B ? "blue" : "red";
  if (mode === "complement") return A && B ? "blue" : "white";
  if (mode === "duplicate") return A || B ? "blue" : "white";
  if (mode === "suppressor") return A && B ? "mutant" : "normal";
  if (mode === "pineapple") return A ? "piping" : B ? "tip" : "spiny";
  return "white";
}
function emphasis(mode, phase, entry) {
  const { A, B } = entry;
  if (mode === "recessive") return phase === 0 ? !A : phase === 1 ? A : phase === 2 ? A : !A;
  if (mode === "dominant") return phase === 0 ? A : phase === 1 ? !A : !A;
  if (mode === "complement") return phase === 0 ? A : phase === 1 ? B : true;
  if (mode === "duplicate") return phase === 0 ? A : phase === 1 ? !A && B : !A && !B;
  if (mode === "suppressor") return phase === 0 ? A : phase === 1 ? !B : true;
  if (mode === "pineapple") return phase === 0 ? A : phase === 1 ? !A : phase === 2 ? !A && B : !A && !B;
  return true;
}
function ClassGrid({ mode, phase, caption }) {
  const info = MODE_INFO[mode];
  const grouped = {};
  for (const entry of CLASSES) {
    const result = phenotype(mode, entry);
    grouped[result] = (grouped[result] || 0) + entry.count;
  }
  return <div className="g4-classes">
    <div className="g4-allele-tiles" aria-label="16 צירופי גנוטיפים מחולקים ל-4 מחלקות">
      {CLASSES.map((entry) => {
        const result = phenotype(mode, entry);
        const highlighted = emphasis(mode, phase, entry);
        return <div key={entry.key} className={`g4-class ${highlighted ? "g4-focus" : "g4-muted"}`}>
          <div className="g4-class-top"><b dir="ltr">{entry.genotype}</b><span>{entry.count}/16</span></div>
          <div className="g4-pips" aria-hidden="true">{Array.from({length: entry.count}, (_, i) => <span key={i} className={`g4-pip result-${result}`} style={{"--delay": `${i * 55}ms`}} />)}</div>
          <strong className={`g4-outcome result-text-${result}`}>{info.labels[result]}</strong>
        </div>;
      })}
    </div>
    <div className="g4-total" aria-label="יחס פנוטיפי סופי">
      {info.order.map((result, i) => <React.Fragment key={result}>
        {i > 0 && <span className="g4-colon">:</span>}
        <div className={`g4-total-part result-bg-${result}`}><b>{grouped[result] || 0}</b><small>{info.labels[result]}</small></div>
      </React.Fragment>)}
    </div>
    <div className="g4-caption">{caption}</div>
  </div>;
}
function BooleanGenes({ mode, phase, caption }) {
  const complement = mode === "complement";
  const cases = complement
    ? [{a:1,b:1,yes:true},{a:1,b:0,yes:false},{a:0,b:1,yes:false},{a:0,b:0,yes:false}]
    : [{a:1,b:1,yes:true},{a:1,b:0,yes:true},{a:0,b:1,yes:true},{a:0,b:0,yes:false}];
  return <div className="g4-logic">
    <div className="g4-process-art" role="img" aria-label={complement ? "נדרשים שני רכיבים לקבלת תוצר" : "מספיק רכיב אחד לקבלת תוצר"}>
      <div className={`g4-producer ${phase >= 0 ? "on" : ""}`}><span>גן A</span><i className="g4-molecule a"/><small>רכיב א</small></div>
      <div className="g4-operation">{complement ? "+" : "או"}</div>
      <div className={`g4-producer ${phase >= 1 ? "on" : ""}`}><span>גן B</span><i className="g4-molecule b"/><small>רכיב ב</small></div>
      <div className={`g4-product ${phase >= 2 ? "complete" : ""}`}><span>{phase >= 2 ? "תוצר כחול" : "?"}</span><div className="g4-product-disc"/></div>
    </div>
    <div className="g4-mini-cases">{cases.map((c,i)=><div key={i} className={`g4-case ${phase===2 ? "show" : phase===0 ? c.a ? "show" : "dim" : c.b ? "show" : "dim"}`}><span dir="ltr">{c.a ? "A_" : "aa"} {c.b ? "B_" : "bb"}</span><b>{c.yes ? "●" : "○"}</b></div>)}</div>
    <p className="g4-caption">{caption}</p>
  </div>;
}
function GateIllustration({ phase, caption }) {
  const opened = phase === 0 || phase === 2;
  return <div className="g4-gate-scene">
    <div className="g4-gate-track"><div className="g4-gene" >A / a</div><div className={`g4-gate ${opened ? "open" : "closed"}`}><span>{opened ? "שער פתוח" : "שער חסום"}</span></div><div className="g4-gene">B / b</div><div className={`g4-color-output ${opened ? "visible" : "hidden"}`}>{opened ? "צבע מתבטא" : "ביטוי ממוסך"}</div></div>
    <p className="g4-caption">{caption}</p>
  </div>;
}
function LethalIllustration({ phase, caption, otherAlleles = false }) {
 const types = otherAlleles ? ["CʸCʸ", "CʸCᵃ", "CʸCᵃ", "CᵃCᵃ"] : ["YˡYˡ", "Yˡy", "Yˡy", "yy"];
 return <div className="g4-lethal-scene">
   {phase === 0 && <div className="g4-parents"><span>🟡 הורה הטרוזיגוטי</span><strong>×</strong><span>🟡 הורה הטרוזיגוטי</span></div>}
   <div className="g4-offspring">{types.map((x,i)=><div className={`g4-child ${i===0 && phase>= (otherAlleles ? 1 : 2) ? "removed" : ""}`} key={i}>
      <div className="g4-mouse-shape">{i===3 ? "🟤" : "🟡"}</div><b dir="ltr">{x}</b><small>{i===0 ? "1/4" : i===3 ? "1/4" : "1/4"}</small>
      {i===0 && phase >= (otherAlleles ? 1 : 2) && <span className="g4-crossout">✕</span>}
   </div>)}</div>
   {phase >= (otherAlleles ? 2 : 3) && <div className="g4-survivors"><b>2 צהובים</b><span>:</span><b>1 חום</b><small>סופרים רק את שלושת השורדים</small></div>}
   <p className="g4-caption">{caption}</p>
 </div>;
}
function BombayIllustration({ phase, caption }) {
  const hasH = phase < 2;
  return <div className="g4-bombay-scene">
   <div className="g4-blood-key"><span>גן ABO</span><b>+</b><span className={hasH ? "g4-functional" : "g4-blocked"}>{hasH ? "H_ (יש בסיס H)" : "hh (אין בסיס H)"}</span></div>
   <div className="g4-red-cell" aria-label="כדורית דם אדומה סכמטית">
     {hasH && <><i className="g4-antenna"/><i className="g4-antenna"/><i className="g4-antenna"/></>}
     {phase === 0 && <em>פוטנציאל לאנטיגן A/B</em>}
     {phase === 1 && <em>H מאפשר הצגה</em>}
     {phase >= 2 && <em>אין A/B על פני התא</em>}
   </div>
   <div className="g4-blood-result">{phase >= 2 ? "בדיקת ABO רגילה → נראה O" : "בסיס H מאפשר ביטוי אנטיגנים"}</div>
   <p className="g4-caption">{caption}</p>
  </div>;
}
function RatIllustration({ phase, caption }) {
 const cases = [
  {g:"C_ A_B_",color:"black",name:"שחור"},{g:"C_ A_bb",color:"gray",name:"אפור"},
  {g:"C_ aaB_",color:"brown",name:"חום"},{g:"C_ aabb",color:"yellow",name:"צהוב"},
  {g:"cc __ __",color:"albino",name:"לבקן"}
 ];
 return <div className="g4-rat-scene">
   <div className="g4-rat-branch"><b>גן C</b><span className={phase===1?"g4-branch-active":""}>cc → אין פיגמנט</span><span className={phase>=2?"g4-branch-active":""}>C_ → בודקים A ו־B</span></div>
   <div className="g4-rat-colors">{cases.map((c,i)=><div key={c.g} className={`g4-rat-tile ${phase===1 ? i===4?"selected":"quiet" : phase===2 ? i<4?"selected":"quiet" : phase>=3 ? "selected" : ""}`}>
     <i className={`g4-pip result-${c.color}`}/><b>{c.name}</b><small dir="ltr">{c.g}</small>
   </div>)}</div>
   <p className="g4-caption">{caption}</p>
 </div>;
}
function SuppressorIllustration({phase,caption}) {
 return <div className="g4-suppressor-scene">
  <div className="g4-compare-suppressor"><div className={`g4-suppressor-case ${phase===0?"selected":""}`}><span dir="ltr">aaB_</span><i className="g4-pip result-mutant"/><b>ביטוי מוטנטי</b></div><div className={`g4-suppressor-case ${phase>=1?"selected":""}`}><span dir="ltr">aabb</span><i className="g4-pip result-normal"/><b>דיכוי → תקין</b></div></div>
  <div className="g4-suppressor-ratio">{phase>=2 ? <><b>13 תקינים</b><span>:</span><b>3 מוטנטים</b></> : <span>כאשר bb מדכא את הביטוי המוטנטי, הפנוטיפ משתנה</span>}</div>
  <p className="g4-caption">{caption}</p>
 </div>;
}
function FruitIllustration({phase,caption}) {
 const observed = [65,4], expected=[69*15/16,69/16];
 return <div className="g4-fruit">
  <div className="g4-fruit-bars">{["כחולים","לבנים"].map((label,i)=><div key={i} className="g4-fruit-row"><b>{label}</b><div className="g4-bar-track"><i style={{width:`${(phase===0?observed[i]:expected[i])/69*100}%`}}/></div><strong>{phase===0?observed[i]:expected[i].toFixed(1)}</strong></div>)}</div>
  <div className="g4-fruit-type">{phase===0?"נתונים שנצפו: 65 מול 4":phase===1?"השוואה לצפוי ביחס 15:1":phase===2?"מודל: A_ או B_ → כחול, ורק aabb → לבן":"ניסוי המשך: הכלאות מבחן / דור F3"}</div>
  <p className="g4-caption">{caption}</p>
 </div>;
}
function PedigreeIllustration({phase,caption}) {return <div className="g4-pedigree">
  <div className="g4-family"><div className="g4-family-person">O (פנוטיפ)<small>ייתכן hh</small></div><div className="g4-family-person">O (פנוטיפ)<small>ייתכן ii</small></div></div>
  <div className="g4-family-line"/><div className="g4-family-person child">ילד A<small>מחייב בדיקת גנוטיפים</small></div>
  {phase>=2 && <div className="g4-pedigree-highlight">hh עשוי למסך אללים של ABO בהורה שנראה O</div>}
  <p className="g4-caption">{caption}</p>
 </div>}
export default function GeneticsTutorial4Demo({ step, stepIndex = 0, totalSteps = 1 }) {
 const data = step?.demo;
 if (!data) return null;
 const mode = data.mode || "gate";
 const phase = Number.isFinite(Number(data.phase)) ? Number(data.phase) : stepIndex;
 const caption = data.caption || step.description || "";
 const isClassMode = ["recessive","dominant","pineapple"].includes(mode);
 let art;
 if (isClassMode) art = <ClassGrid mode={mode} phase={phase} caption={caption}/>;
 else if (mode === "complement") art=<BooleanGenes mode={mode} phase={phase} caption={caption}/>;
 else if (mode === "duplicate" && totalSteps === 4) art=<FruitIllustration phase={phase} caption={caption}/>;
 else if (mode === "duplicate") art=<BooleanGenes mode={mode} phase={phase} caption={caption}/>;
 else if (mode === "lethal") art=<LethalIllustration phase={phase} caption={caption} otherAlleles={totalSteps===3}/>;
 else if (mode === "bombay" && /שושלת|ענף|אפשרות|ABO/.test(step.title) && totalSteps===4 && /מתחילים|מחפשים|בודקים|מאמתים/.test(step.title)) art=<PedigreeIllustration phase={phase} caption={caption}/>;
 else if (mode === "bombay") art=<BombayIllustration phase={phase} caption={caption}/>;
 else if (mode === "rat") art=<RatIllustration phase={phase} caption={caption}/>;
 else if (mode === "suppressor") art=<SuppressorIllustration phase={phase} caption={caption}/>;
 else art=<GateIllustration phase={phase} caption={caption}/>;
 return <div className="genetics-tutorial4-demo" dir="rtl" aria-label={`המחשה: ${step.title}`}>
  <div className="g4-scene" key={`${mode}-${phase}-${stepIndex}`}>{art}</div>
 </div>;
}
