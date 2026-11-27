import React from "react";
import "../styles/genetics-study-guide-demo.css";

// A visual demonstration, NOT another flowchart. The parent ProcessFlow owns navigation.
export default function GeneticsStudyGuideDemo({ stepIndex = 0, kind = "workflow" }) {
  const stage = Math.max(0, stepIndex);
  const label = {
    workflow: ["מנתוני הצאצאים ליחס", "התאמת היחס למודל", "הגדרת הגנים והאללים", "חיזוי תוצאות הכלאה", "אימות המודל מול הנתונים"],
    epistasis: ["ארבע קבוצות גנוטיפים", "מיסוך רצסיבי", "מיסוך דומיננטי", "שני גנים נדרשים"],
    probability: ["הסתברות בכל גן", "שילוב אירועים בלתי תלויים", "הסתברות לצאצא המתאים"],
    lethality: ["יחס בהפריה", "הגנוטיפ הלתאלי אינו שורד", "חלוקה מחדש בין השורדים"]
  }[kind]?.[stage] || "המחשת התהליך";
  return (
    <div className="gsg-demo" dir="rtl" aria-label={label}>
      <div className="gsg-demo-heading">{label}</div>
      <div className="gsg-scene" role="img" aria-label={label}>
        {kind === "workflow" && <Workflow stage={stage} />}
        {kind === "epistasis" && <Epistasis stage={stage} />}
        {kind === "probability" && <Probability stage={stage} />}
        {kind === "lethality" && <Lethality stage={stage} />}
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
