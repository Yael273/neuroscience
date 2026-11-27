import React from "react";
import "../styles/genetics-study-guide-demo.css";

// A visual demonstration, NOT another flowchart. The parent ProcessFlow owns navigation.
export default function GeneticsStudyGuideDemo({ stepIndex = 0, kind = "workflow" }) {
  const stage = Math.max(0, stepIndex);
  const label = {
    workflow: ["מנתוני הצאצאים ליחס", "התאמת היחס למודל", "הגדרת הגנים והאללים", "חיזוי תוצאות הכלאה", "אימות המודל מול הנתונים"],
    epistasis: ["ארבע קבוצות גנוטיפים", "מיסוך רצסיבי", "מיסוך דומיננטי", "שני גנים נדרשים"],
    probability: ["הסתברות בכל גן", "שילוב אירועים בלתי תלויים", "הסתברות לצאצא המתאים"],
    lethality: ["יחס בהפריה", "הגנוטיפ הלתאלי אינו שורד", "חלוקה מחדש בין השורדים"],
    "cross-analysis": ["הפרדת החומים", "הסקה על גן A", "הפרדת הלא־חומים", "הסקה על גן B", "בדיקת כל הנתונים"],
    "sex-probability": ["מה נתון בשאלה?", "גנוטיפ הצאצא", "פנוטיפ תלוי מין", "הכפלת הסתברויות", "ללא כפל כפול"],
    pedigree: ["ארבע תוצאות אפשריות", "התניה על פנוטיפ", "נרמול מחדש", "הסתברות בכל מסלול", "חיבור המסלולים"],
    generations: ["הורים P", "דור F1", "הכלאת F1", "הפרדת F2 לפי מין", "מכנה ההסתברות"]
  }[kind]?.[stage] || "המחשת התהליך";
  return (
    <div className="gsg-demo" dir="rtl" aria-label={label}>
      <div className="gsg-demo-heading">{label}</div>
      <div className="gsg-scene" role="img" aria-label={label}>
        {kind === "workflow" && <Workflow stage={stage} />}
        {kind === "epistasis" && <Epistasis stage={stage} />}
        {kind === "probability" && <Probability stage={stage} />}
        {kind === "lethality" && <Lethality stage={stage} />}
        {kind === "cross-analysis" && <CrossAnalysis stage={stage} />}
        {kind === "sex-probability" && <SexProbability stage={stage} />}
        {kind === "pedigree" && <Pedigree stage={stage} />}
        {kind === "generations" && <Generations stage={stage} />}
      </div>
      <p className="gsg-note">המחשה סכמטית לפי הדוגמאות במדריך. לחצי על שלב אחר בתרשים שמעל כדי לראות את השינוי.</p>
    </div>
  );
}

function Cell({ children, variant = "", delay = 0 }) {
  return <span className={`gsg-cell ${variant}`} style={{ "--gsg-delay": `${delay}ms` }}>{children}</span>;
}
function Workflow({ stage }) {
  if (stage === 0) return <div className="gsg-stack"><div className="gsg-ratio"><Cell>9</Cell><Cell>3</Cell><Cell>3</Cell><Cell>1</Cell></div><div className="gsg-caption">16 צאצאים אפשריים בהכלאה דו־היברידית</div></div>;
  if (stage === 1) return <div className="gsg-stack"><div className="gsg-ratio"><Cell>9</Cell><Cell>3</Cell><Cell variant="gsg-joined">3 + 1 = 4</Cell></div><div className="gsg-result">9 : 3 : 4</div><div className="gsg-caption">איחוד הקבוצות מצביע על אפשרות לאפיסטזיס רצסיבי</div></div>;
  if (stage === 2) return <div className="gsg-stack"><div className="gsg-gene-map"><Cell variant="gsg-blue">A_ → צבע נוצר</Cell><Cell variant="gsg-dark">aa → אין צבע</Cell><Cell>B_ / bb → סוג הצבע</Cell></div><div className="gsg-caption">המקרא מגדיר כיצד כל גן משפיע על הפנוטיפ</div></div>;
  if (stage === 3) return <div className="gsg-stack"><div className="gsg-cross"><span>AaBb</span><span>×</span><span>AaBb</span></div><div className="gsg-ratio"><Cell variant="gsg-blue">A_B_</Cell><Cell>A_bb</Cell><Cell variant="gsg-dark">aa__</Cell></div><div className="gsg-caption">נחשב את קבוצות הצאצאים שחוזה המודל</div></div>;
  return <div className="gsg-stack"><div className="gsg-verify"><span>נצפה: 9 : 3 : 4</span><span className="gsg-check">✓</span><span>חזוי: 9 : 3 : 4</span></div><div className="gsg-caption">המודל מתאים לדוגמה; בשאלה אמיתית בודקים גם את שאר ההכלאות</div></div>;
}
const clusters = [{label:"A_B_",n:9},{label:"A_bb",n:3},{label:"aaB_",n:3},{label:"aabb",n:1}];
function Epistasis({stage}) {
  const groupSets = stage === 0 ? [0,1,2,3] : stage === 1 ? [0,1,2,2] : stage === 2 ? [0,0,1,2] : [0,1,1,1];
  const result = ["9 : 3 : 3 : 1", "9 : 3 : 4", "12 : 3 : 1", "9 : 7"][stage] || "9 : 3 : 3 : 1";
  return <div className="gsg-stack"><div className="gsg-clusters">{clusters.map((c,i)=><div key={i} className={`gsg-cluster gsg-group-${groupSets[i]}`} style={{"--gsg-delay":`${i*115}ms`}}><strong>{c.label}</strong><span>{c.n}/16</span><div className="gsg-mini-dots">{Array.from({length:c.n},(_,j)=><i key={j}/>)}</div></div>)}</div><div className="gsg-result">{result}</div><div className="gsg-caption">{["כל קבוצה בפנוטיפ נפרד", "aa ממסך את B ולכן 3+1 מתאחדים", "A_ ממסך את B ולכן 9+3 מתאחדים", "רק A_B_ יוצר את הפנוטיפ; היתר 3+3+1"][stage]}</div></div>;
}
function Probability({ stage }) {
  if(stage===0) return <div className="gsg-stack"><div className="gsg-prob-two"><div><strong>גן A</strong><div className="gsg-ratio"><Cell variant="gsg-dark">aa: ¼</Cell><Cell>A_: ¾</Cell></div></div><div><strong>גן B</strong><div className="gsg-ratio"><Cell variant="gsg-blue">B_: ¾</Cell><Cell>bb: ¼</Cell></div></div></div><div className="gsg-caption">Aa × Aa ו־Bb × Bb</div></div>;
  if(stage===1) return <div className="gsg-stack"><div className="gsg-multiply"><Cell variant="gsg-dark">P(aa) = ¼</Cell><b>×</b><Cell variant="gsg-blue">P(B_) = ¾</Cell></div><div className="gsg-caption">רק בהנחת התפלגות בלתי תלויה אפשר להכפיל את ההסתברויות</div></div>;
  return <div className="gsg-stack"><div className="gsg-fraction"><strong>¼ × ¾ = 3/16</strong></div><div className="gsg-sixteen">{Array.from({length:16},(_,i)=><i key={i} className={i<3?"is-match":""} style={{"--gsg-delay":`${i*35}ms`}} />)}</div><div className="gsg-caption">שלוש אפשרויות מתוך 16 מתאימות ל־aaB_</div></div>;
}
function Lethality({stage}) {
  return <div className="gsg-stack"><div className="gsg-offspring">{["YY", "Yy", "Yy", "yy"].map((g,i)=><div key={i} className={`gsg-mouse ${stage>=1&&i===0?"is-lethal":""} ${stage===2&&i===0?"is-removed":""}`} style={{"--gsg-delay":`${i*125}ms`}}><div className="gsg-mouse-face"><span className="gsg-ears">◖ ◗</span><span className="gsg-face">● ●</span></div><strong>{g}</strong><span>{i===0?"לתאלי":i<3?"צהוב":"לא צהוב"}</span>{stage>=1&&i===0&&<b className="gsg-x">✕</b>}</div>)}</div><div className="gsg-result">{stage===0?"¼ : ½ : ¼":stage===1?"1 מתוך 4 אינו שורד":"2 צהובים : 1 לא צהוב"}</div><div className="gsg-caption">{stage===0?"תוצאות ההפריה לפני התחשבות בהישרדות":stage===1?"YY אינו נכלל בחישוב היחס בקרב השורדים":"מבין שלושת השורדים: ⅔ צהובים ו־⅓ לא צהובים"}</div></div>;
}

// New study-guide illustrations. A ProcessFlow above provides the only step navigation.
// Scenes change instantly: no entrance, fade, pulse or transition animation.
function Diagram({ children, note }) {
  return <div className="gsg-stack"><div className="gsg-teaching-diagram">{children}</div>{note && <div className="gsg-caption">{note}</div>}</div>;
}
function RatioBars({ data }) {
  return <div className="gsg-bars" dir="ltr">{data.map(([name,count,tone],i)=><div className="gsg-bar-item" key={i}><span>{name}</span><div className="gsg-bar-track"><div className={`gsg-bar-fill ${tone||''}`} style={{width:`${count/16*100}%`}}/></div><b>{count}/16</b></div>)}</div>;
}
function CrossAnalysis({stage}) {
  if(stage===0) return <Diagram note="מתוך כל מין, בערך רבע מהצאצאים חומים"><div className="gsg-data-cards"><span>זכרים <b>21 / 82</b><small>≈ 25.6%</small></span><span>נקבות <b>19 / 78</b><small>≈ 24.4%</small></span></div></Diagram>;
  if(stage===1) return <Diagram note="פנוטיפ רצסיבי בהסתברות רבע מתאים להצלבה Aa × Aa"><div className="gsg-ratio"><Cell>Aa</Cell>×<Cell>Aa</Cell></div><div className="gsg-four"><span>AA</span><span>Aa</span><span>Aa</span><span className="is-muted">aa · חום</span></div></Diagram>;
  if(stage===2) return <Diagram note="מתמקדים רק בזכרים שאינם חומים בהכלאה ג"><div className="gsg-data-cards"><span>סגולים <b>14</b></span><span>כחולים <b>32</b></span><span>לבנים <b>16</b></span></div><div className="gsg-result">≈ 1 : 2 : 1</div></Diagram>;
  if(stage===3) return <Diagram note="יחס 1:2:1 מרמז על Bb × Bb בהנחות המודל"><div className="gsg-ratio"><Cell>Bb</Cell>×<Cell>Bb</Cell></div><div className="gsg-four"><span>BB</span><span>Bb</span><span>Bb</span><span>bb</span></div></Diagram>;
  return <Diagram note="מודל אפשרי נבחן מול כל ארבע ההכלאות, ולא לפי יחס יחיד"><div className="gsg-gene-map"><Cell variant="gsg-dark">גן A: חום / לא חום</Cell><Cell variant="gsg-blue">גן B: צבע אצל הלא־חומים</Cell><Cell>בדיקה לפי מין</Cell></div><span className="gsg-check">✓</span></Diagram>;
}
function SexProbability({stage}) {
  if(stage===0)return <Diagram note="הבדילי בין הסתברות מותנית בזכר לבין הסתברות ללידת זכר כחול"><div className="gsg-data-cards"><span><b>בהינתן זכר</b><small>המין כבר ידוע</small></span><span><b>צאצא זכר כחול</b><small>מין עדיין לא ידוע</small></span></div></Diagram>;
  if(stage===1)return <Diagram note="AaBB × AABb: חצי מהצאצאים A_Bb"><div className="gsg-ratio"><Cell>AaBB</Cell>×<Cell>AABb</Cell></div><div className="gsg-four"><span>AABB</span><span>AABb</span><span>AaBB</span><span>AaBb</span></div></Diagram>;
  if(stage===2)return <Diagram note="אותו גנוטיפ מתבטא אחרת לפי מין — זה אינו גן שנמצא רק בזכרים"><div className="gsg-data-cards"><span><b>A_Bb · זכר</b><small>כחול</small></span><span><b>A_Bb · נקבה</b><small>לבן</small></span></div></Diagram>;
  if(stage===3)return <Diagram note="לכלל הצאצאים: חצי נושאים A_Bb, ומחציתם זכרים"><div className="gsg-multiply"><Cell variant="gsg-blue">½ גנוטיפ</Cell>×<Cell>½ זכר</Cell></div><div className="gsg-result">¼ זכר כחול</div></Diagram>;
  return <Diagram note="כבר ידוע שהוא זכר? אז P(כחול | זכר)=½, בלי עוד הכפלה"><div className="gsg-data-cards"><span><b>ידוע שהוא זכר</b><small>½</small></span><span><b>צאצא אקראי</b><small>¼</small></span></div></Diagram>;
}
function Pedigree({stage}) {
  if(stage===0) return <Diagram note="מהכלאת Aabb × AaBB מתקבלים ארבעה צירופים שווי הסתברות"><div className="gsg-four"><span>AABb</span><span>AaBb</span><span>AaBb</span><span>aaBb</span></div></Diagram>;
  if(stage===1) return <Diagram note="האב כחול, ולכן aaBb החום אינו אפשרי עבורו"><div className="gsg-four"><span>AABb</span><span>AaBb</span><span>AaBb</span><span className="is-eliminated">aaBb ✕</span></div></Diagram>;
  if(stage===2) return <Diagram note="נותרו שלושה מתוך ארבעת הצירופים — מנרמלים בתוך קבוצת הכחולים"><div className="gsg-data-cards"><span><b>AABb</b><small>⅓</small></span><span><b>AaBb</b><small>⅔</small></span></div></Diagram>;
  if(stage===3) return <Diagram note="אם האם AaBB: לכל גנוטיפ אב מחשבים בנפרד P(בן כחול)"><div className="gsg-data-cards"><span><b>AABb</b><small>¼</small></span><span><b>AaBb</b><small>3/16</small></span></div></Diagram>;
  return <Diagram note="משקללים כל מסלול לפי ההסתברות של הגנוטיפ ההורי"><div className="gsg-multiply"><Cell>⅓ × ¼</Cell>+<Cell>⅔ × 3/16</Cell></div><div className="gsg-result">5/24 ≈ 20.83%</div></Diagram>;
}
function Generations({stage}) {
  if(stage===0) return <Diagram note="בדוגמה שבמדריך אלה ההורים המקוריים"><div className="gsg-ratio"><Cell>AABB</Cell>×<Cell>aabb</Cell></div><div className="gsg-caption">דור P</div></Diagram>;
  if(stage===1) return <Diagram note="כל דור F1 הוא AaBb; ביטוי הצבע משתנה עם המין"><div className="gsg-result">AaBb</div><div className="gsg-data-cards"><span>זכרים <b>כחולים</b></span><span>נקבות <b>לבנות</b></span></div></Diagram>;
  if(stage===2) return <Diagram note="כדי לייצר דור F2 מכליאים את שני פרטי F1"><div className="gsg-ratio"><Cell>AaBb</Cell>×<Cell>AaBb</Cell></div></Diagram>;
  if(stage===3) return <Diagram note="התפלגות הפנוטיפים בתוך כל מין שונה"><div className="gsg-data-cards"><span><b>זכרים</b><small>6 כחולים · 3 סגולים · 4 חומים · 3 לבנים</small></span><span><b>נקבות</b><small>3 סגולות · 4 חומות · 9 לבנות</small></span></div></Diagram>;
  return <Diagram note="היחסים הקודמים הם מתוך 16 בכל מין, לא מכלל הלידות"><div className="gsg-data-cards"><span><b>P(כחול | זכר)</b><small>6/16</small></span><span><b>P(זכר כחול)</b><small>½ × 6/16 = 3/16</small></span></div></Diagram>;
}
