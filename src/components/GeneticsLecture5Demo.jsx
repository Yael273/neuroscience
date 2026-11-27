import React from "react";
import "../styles/genetics-lecture5-demo.css";

const Dot = ({ bad = false, small = false }) => <span className={`gl5-dot ${bad ? "bad" : ""} ${small ? "small" : ""}`} aria-label={bad ? "mtDNA מוטנטי" : "mtDNA תקין"} />;
const Box = ({ title, children, tone = "" }) => <div className={`gl5-box ${tone}`}><strong>{title}</strong><div className="gl5-content">{children}</div></div>;
const Arrow = () => <span className="gl5-arrow" aria-hidden="true">←</span>;
const Strand = ({ variant = "D", label }) => <span className={`gl5-snail ${variant === "d" ? "left" : "right"}`}><span className="gl5-snail-shell">◉</span><small>{label || (variant === "d" ? "שמאלי" : "ימני")}</small></span>;
const Cell = ({ fraction = 2, count = 10, label = "" }) => <div className="gl5-cell"><div className="gl5-cell-inside">{Array.from({ length: count }, (_, i) => <Dot key={i} bad={i < fraction} small />)}</div>{label && <small>{label}</small>}</div>;

export default function GeneticsLecture5Demo({ stepIndex = 0, step, kind = "maternal" }) {
  const n = Math.max(0, Number(stepIndex) || 0);
  const note = step?.demo?.caption || step?.description || "";
  let visual;
  if (kind === "maternal") {
    visual = <div className="gl5-scene">
      <Box title="אם: הגן הגרעיני" tone="mother"><span className="gl5-gene">{n === 0 ? "m/m   או   +/+" : "m/m"}</span></Box><Arrow />
      <Box title="ביצית"><div className="gl5-egg">{n >= 1 && <><span className="gl5-mrna">mRNA</span><span className="gl5-mrna">mRNA</span></>}</div></Box>
      {n >= 2 && <><Arrow /><Box title="עובר"><div className="gl5-embryo"><b>m/+</b><small>{n >= 3 ? "התפתחות לא תקינה עקב תוצרי האם" : "גנוטיפ תקין אפשרי"}</small></div></Box></>}
    </div>;
  } else if (kind === "snail") {
    const opposite = n >= 2 && n <= 3;
    visual = <div className="gl5-scene gl5-snail-scene"><Box title="האם"><span className="gl5-gene">{opposite ? "dd" : n === 4 ? "Dd" : "DD"}</span><Strand variant={opposite ? "d" : "D"} /></Box><Arrow /><Box title={n === 4 ? "F2" : "F1"}>
      <span className="gl5-gene">{n === 4 ? "DD · Dd · Dd · dd" : "Dd"}</span>
      <div className="gl5-snail-group">{Array.from({ length: n === 4 ? 4 : 1 }, (_, i) => <Strand key={i} variant={opposite ? "d" : "D"} />)}</div>
      <small>פנוטיפ הצאצאים נקבע לפי הגנוטיפ של האם</small>
    </Box></div>;
  } else if (kind === "reciprocal") {
    const motherAffected = n <= 1;
    visual = <div className="gl5-scene"><Box title="תורמת הביצית / הציטופלזמה" tone="mother"><span className="gl5-gene">{motherAffected ? "מוטנטית (m/m או poky)" : "תקינה"}</span><div className="gl5-egg">{motherAffected ? "●" : "○"}</div></Box><Arrow /><Box title="צאצאים"><div className="gl5-offspring">{Array.from({ length:4 }, (_, i) => <span key={i} className={`gl5-offspring-dot ${motherAffected ? "bad" : ""}`} />)}</div><b>{motherAffected ? "פנוטיפ מוטנטי" : "פנוטיפ תקין"}</b></Box></div>;
  } else if (kind === "comparison") {
    const mito = n >= 2;
    visual = <div className="gl5-scene"><Box title={mito ? "mtDNA של האם" : "גן גרעיני באם"} tone="mother">{mito ? <Cell fraction={2} /> : <span className="gl5-gene">Aa / aa</span>}</Box><Arrow /><Box title={mito ? "mtDNA של הצאצא" : "תוצרי הגן בביצית"}>{mito ? <Cell fraction={2} /> : <span className="gl5-mrna">mRNA + חלבונים</span>}</Box>{n === 3 && <><Arrow /><Box title="מי מעביר לדור הבא?">בדרך כלל הבת, ולא הבן</Box></>}</div>;
  } else if (kind === "mitochondria") {
    visual = <div className="gl5-scene"><Box title="ביצית" tone="mother"><Cell fraction={2} count={10} label="מיטוכונדריות + גרעין" /></Box><Arrow /><Box title="זרע"><span className="gl5-gene">DNA גרעיני</span><small>תרומת mtDNA זניחה בדרך כלל</small></Box>{n >= 2 && <><Arrow /><Box title={n >= 3 ? "צאצאים" : "זיגוטה"}><Cell fraction={2} count={10} label={n >= 3 ? "בנים ובנות מקבלים mtDNA מהאם" : "גרעין משני הורים"} /></Box></>}</div>;
  } else if (kind === "heteroplasmy") {
    const percentages = n === 0 ? [20] : n === 1 ? [10, 50, 80] : n === 2 ? [10, 50, 80] : [10, 50, 80];
    visual = <div className="gl5-scene gl5-hetero"><Box title={n === 0 ? "אם הטרופלזמית" : n === 1 ? "דגימה לביציות" : n === 2 ? "mtDNA מתרבה" : "צאצאים אפשריים"}>
      <div className="gl5-cell-row">{percentages.map((pct, i) => <Cell key={i} fraction={pct / 10} count={10} label={`${pct}% מוטנטי`} />)}</div>
      {n === 3 && <small>השיעורים הם דוגמת המחשה בלבד; חומרה קלינית אינה נקבעת ביחס אחיד</small>}
    </Box></div>;
  } else if (kind === "oxphos") {
    const labels = ["NADH / FADH₂", "I · II · III · IV", "H⁺  H⁺  H⁺", "קומפלקס V → ATP", "nDNA + mtDNA"];
    visual = <div className="gl5-scene gl5-oxphos"><Box title="ממברנה מיטוכונדרית פנימית"><div className="gl5-membrane">{labels.slice(0, Math.min(n + 1, labels.length)).map((label,i) => <span key={i} className="gl5-ox-node">{label}</span>)}</div><small>{n >= 2 ? "פרוטונים נצברים בין הממברנות וחוזרים דרך ATP synthase" : "השרשרת מתחילה בהעברת אלקטרונים"}</small></Box></div>;
  } else if (kind === "pedigree") {
    visual = <div className="gl5-scene gl5-pedigree"><Box title="דור ההורים"><div className="gl5-pair"><span className="gl5-person mother" title="אם">♀</span><span className="gl5-person father" title="אב">♂</span></div></Box><Arrow /><Box title="דור הילדים"><div className="gl5-pair">{["♀","♂","♀","♂"].map((sex,i)=><span key={i} className={`gl5-person ${n >= 1 && n <= 2 && i === 0 ? "muted" : "affected"}`}>{sex}</span>)}</div><small>{n === 1 ? "העברה מאב לילד אינה מתאימה ל־mtDNA טיפוסי" : n >= 2 ? "בדקי העברה דרך האם והבדלי ביטוי" : "זהי מי מושפע"}</small></Box></div>;
  } else {
    visual = <div className="gl5-scene"><Box title="שלב התהליך">{note}</Box></div>;
  }
  return <section className="gl5-demo" dir="rtl" aria-label="המחשת שלב בגנטיקה"><div className="gl5-stage">{visual}</div><p className="gl5-caption">{note}</p></section>;
}
