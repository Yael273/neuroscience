import React from "react";
import "../styles/applied-genetics-demo.css";

// Schematic, interactive-by-stage demonstrations for Applied Genetics Tutorial 1.
// ProcessFlow supplies the current step as `visual.phase` and remounts on replay.
const colors = ["#3b82ad", "#8b69ba", "#16a082", "#d18b43"];
const fmt = (n) => Number(n).toFixed(2);

function Tiles({ items, phase, label, columns }) {
  return <div className="agd-tiles" style={{ "--agd-cols": columns || Math.min(items.length, 4) }} aria-label={label}>
    {items.map((item, i) => <div key={item.id || `${i}-${item.title}`} className={`agd-tile ${item.emphasis ? "agd-tile--focus" : ""}`} style={{ "--agd-index": i, "--agd-color": item.color || colors[i % colors.length] }}>
      <strong>{item.title}</strong>{item.value && <span dir={item.math ? "ltr" : undefined}>{item.value}</span>}
      {item.note && <small>{item.note}</small>}
    </div>)}
  </div>;
}
function Equation({ children }) { return <div className="agd-equation" dir="ltr">{children}</div>; }
function Header({ title, detail }) { return <div className="agd-caption"><strong>{title}</strong>{detail && <span>{detail}</span>}</div>; }
function Arrows() { return <div className="agd-arrows" aria-hidden="true"><span>↓</span><span>↓</span><span>↓</span></div>; }

function MarkerChoice({ phase }) {
 const items = [
  {title:"תכונה",value:"צבע פרווה",note:"מה רוצים לחקור?"},
  {title:"שונות DNA",value:"A / G",note:"שני אללים בסמן"},
  {title:"גנוטיפים",value:"AA · AG · GG",note:"מזהים כל פרט"},
  {title:"קשר לתכונה",value:"חולים / בריאים",note:"משווים בין הקבוצות"}
 ];
 return <><Header title="מן התכונה לסמן מועמד" detail="בכל שלב מתווסף מידע מסוג אחר"/><Tiles items={items.map((it,i)=>({...it,emphasis:i===phase,color:i===phase?"#198d73":undefined}))}/><div className="agd-focus-line">{["קודם מגדירים פנוטיפ שניתן למדוד.","מחפשים אתר DNA משתנה בין פרטים.","מזהים את האללים של כל פרט במעבדה.","השוואה יכולה להראות אסוציאציה — לא בהכרח סיבתיות."][phase]}</div></>;
}
function StudyPath({ phase }) {
 return <><Header title="שתי דרכים לבדיקת תאחיזה" detail="בחירת הדרך תלויה בתכנון המחקר ובנתונים הזמינים"/>
 <div className="agd-branch">
  <div className="agd-center">{phase === 0 ? "מטרה: למצוא סמן סמוך לתכונה" : "האם יש משפחות אינפורמטיביות?"}</div>
  <div className="agd-branch-paths"><div className={phase===2?"agd-chosen":""}><b>משפחה</b><span>הורים ← צאצאים</span><small>עוקבים אחר הורשה ורקומביננטים</small></div><div className={phase===3?"agd-chosen":""}><b>אוכלוסייה</b><span>קבוצת מקרים ↔ ביקורת</span><small>סורקים סמנים ובודקים אסוציאציה</small></div></div>
 </div><div className="agd-focus-line">{["מגדירים את התכונה ואת סוג הראיה הדרושה.","בודקים אם ניתן לעקוב אחרי כמה דורות.","במשפחה: מבחינים במשותף ובאירועי רקומבינציה.","באוכלוסייה: מחפשים קשר סטטיסטי ומאמתים במדגם נוסף."][phase]}</div></>;
}
function CandidateValidation({ phase }) {
 return <><Header title="מסמן חשוד לסמן מבוסס" detail="מחקר בחתולים: S135 הוא מועמד, לא הוכחה לסיבתיות"/>
 <Tiles items={[{title:"אסוציאציה",value:"S135",note:"שכיחויות שונות"},{title:"שחזור",value:"מדגם נוסף",note:"ממצא עקבי"},{title:"הורשה",value:"משפחה",note:"סמן + תכונה"},{title:"רקומבינציה",value:"מעט רקומביננטים",note:"תומך בתאחיזה"}].map((x,i)=>({...x,emphasis:i===phase}))}/>
 <div className="agd-marker-bar"><span>DNA</span><div className="agd-marker-track"><i className={phase>=0?"agd-visible":""}>S135</i><i className={phase>=2?"agd-visible":""}>לוקוס המחלה</i></div></div><div className="agd-focus-line">{["נמצא הבדל בשכיחות הסמן בין הקבוצות.","מבקשים לראות את אותו קשר במדגם בלתי תלוי.","בודקים אם הסמן והתכונה עוברים יחד במשפחה.","מעט רקומביננטים תומכים בקרבה גנטית; אינם מוכיחים שהסמן גורם למחלה."][phase]}</div></>;
}
function Diversity({ phase }) {
 const freq=[.2,.2,.2,.2,.2]; const sq=freq.map(v=>v*v);
 return <><Header title="דוגמה: 5 אללים בתדירות 0.2" detail="הדגמה של שאלה 5(א), סמן I"/>
 <div className="agd-allele-row" dir="ltr">{freq.map((v,i)=><div className="agd-allele" key={i} style={{"--agd-index":i}}><strong>A{i+1}</strong><span>{phase===0?fmt(v):fmt(sq[i])}</span><div className="agd-mini-track"><i style={{width:`${(phase===0?v:sq[i])*100}%`}} /></div></div>)}</div>
 {phase===0&&<Equation>p₁ = p₂ = p₃ = p₄ = p₅ = 0.20</Equation>}
 {phase===1&&<Equation>(0.20)² = 0.04 &nbsp; לכל אלל</Equation>}
 {phase===2&&<Equation>Σpᵢ² = 5 × 0.04 = 0.20</Equation>}
 {phase===3&&<Equation>H = 1 − 0.20 = <b>0.80</b></Equation>}
 <div className="agd-focus-line">{["סכום התדירויות הוא 1.","הסיכוי לדגום אותו אלל פעמיים קשור לריבוע שכיחותו.","סכום הריבועים הוא ההסתברות לשני אללים זהים בדגימה אקראית.","המשלים ל־1 נותן את ההסתברות לשני אללים שונים, בהנחות המדד."][phase]}</div></>;
}
function Joint({ phase }) {
 return <><Header title="שאלה 5(ג): 500 פרטים, שלושה סמנים" detail="כפל הסתברויות מותנה באי־תלות בין הסמנים"/>
 <Tiles items={[{title:"סמן I",value:"H = 0.80"},{title:"סמן II",value:"H = 0.60"},{title:"סמן III",value:"H = 0.90"}].map((x,i)=>({...x,emphasis:phase===0||phase>=2,color:colors[i]}))} columns={3}/>
 {phase===0&&<Equation>0.80 &nbsp; · &nbsp; 0.60 &nbsp; · &nbsp; 0.90</Equation>}
 {phase===1&&<div className="agd-assumption">האם הסמנים בלתי תלויים? <b>אם כן, אפשר לכפול הסתברויות.</b><small>אם קיימת תלות, צריך להשתמש בהסתברות משותפת ולא במכפלה הפשוטה.</small></div>}
 {phase===2&&<Equation>P = 0.80 × 0.60 × 0.90 = <b>0.432</b></Equation>}
 {phase===3&&<><Equation>500 × 0.432 = <b>216</b></Equation><div className="agd-dots" aria-label="43.2 אחוז מהפרטים צפויים להיות הטרוזיגוטים בכל שלושת הסמנים">{Array.from({length:25},(_,i)=><span key={i} className={i<11?"agd-dot-on":""}/>)}</div></>}
 <div className="agd-focus-line">{["מחשבים את H לכל סמן בנפרד.","חובה לבדוק אם מותר להשתמש בהנחת אי־תלות.","0.432 הוא הסיכוי המשותף לפי הנחת אי־התלות.","216 הוא מספר צפוי, ולא ספירה של פרטים שנמדדו בפועל."][phase]}</div></>;
}
function LD({ phase }) {
 const associations=[{marker:"M₁",trait:"A₁",count:4},{marker:"M₂",trait:"A₂",count:3}];
 return <><Header title="תלות בין סמן לתכונה" detail="דוגמה סכמטית; ההשוואה המדויקת נעשית מול שכיחויות שוליות"/>
 <div className="agd-ld-grid">
 <div className="agd-ld-header">סמן / תכונה</div><b>A₁</b><b>A₂</b>
 <b>M₁</b><span className={phase>=1?"agd-ld-hot":""}>4</span><span>0</span>
 <b>M₂</b><span>0</span><span className={phase>=1?"agd-ld-hot":""}>3</span>
 </div>
 {phase>=2&&<Equation>P(M₁,A₁) = 4/7 &nbsp; ≠ &nbsp; (4/7)×(4/7)</Equation>}
 <div className="agd-focus-line">{["רושמים את התדירויות של אללי הסמן ושל התכונה.","סופרים את הופעת הצירופים יחד באותה אוכלוסייה.","משווים תדירות צירוף נצפית למכפלת תדירויות שוליות.","סטייה מאי־תלות מצביעה על LD בדוגמה; צריך מדגם מתאים לבחינת מובהקות."][phase]}</div></>;
}
function Pedigree({ phase }) {
 const nodes=[{x:120,y:50,label:"אב",g:"m₁/m₂"},{x:290,y:50,label:"אם",g:"m₃/m₄"},{x:95,y:170,label:"ילד 1",g:"m₂/m₄"},{x:205,y:170,label:"ילד 2",g:"m₁/m₃"},{x:315,y:170,label:"ילד 3",g:"m₂/m₃"}];
 return <><Header title="מעקב סמן–מחלה במשפחה" detail="דוגמה סכמטית להדגמת הגנוטיפים והשוואתם לפנוטיפ"/>
 <svg className="agd-pedigree-svg" viewBox="0 0 410 215" role="img" aria-label="עץ משפחה עם הורים ושלושה צאצאים">
 <path d="M120 65 V93 H290 V65 M205 93 V123 H95 V140 M205 123 H315 V140 M205 123 V140" fill="none" stroke="#9eb4b4" strokeWidth="3"/>
 {nodes.map((n,i)=><g key={i} className="agd-pedigree-node" style={{"--agd-index":i,opacity:phase===0&&i>1?.25:1}}>
 <circle cx={n.x} cy={n.y} r="27" fill={phase>=2&&i===2?"#e7b5bb":"#e5eef8"} stroke={phase>=2&&i===2?"#b86976":"#6e98c1"} strokeWidth="3" />
 <text x={n.x} y={n.y-4} textAnchor="middle" fontSize="12" fill="#294459">{n.label}</text>
 <text x={n.x} y={n.y+12} textAnchor="middle" fontSize="11" fill="#294459">{phase>=1?n.g:"?"}</text>
 </g>)}
 </svg>
 <div className="agd-focus-line">{["מזהים אילו אללים של הסמן יש לכל הורה.","משייכים את הסמן ללוקוס המחלה ועוקבים אחרי העברתם.","משווים את הצירוף הגנטי לפנוטיפ אצל כל צאצא.","מקרים חריגים עשויים להצביע על רקומבינציה, לאחר אימות הגנוטיפים והפאזות."][phase]}</div></>;
}
function HardyWeinberg({ phase }) {
 const assumptions=[{title:"זיווג אקראי",key:1},{title:"אין סלקציה",key:2},{title:"אין מוטציה/הגירה",key:2},{title:"אוכלוסייה גדולה",key:2}];
 return <><Header title="בדיקת התנאים של מודל הרדי–ויינברג" detail="השוואה בין אוכלוסייה תאורטית לבין משפחות שנבחרו למחקר"/>
 <div className="agd-hw">
 <div className="agd-hw-row"><strong>האוכלוסייה</strong><span className={phase===0?"agd-selected":""}>פרטים רבים ודגימה מתאימה</span></div>
 <div className="agd-hw-row"><strong>דפוס זיווג</strong><span className={phase===1?"agd-selected agd-warning":""}>משפחות שנבחרו במיוחד ≠ זיווג אקראי</span></div>
 <div className="agd-hw-row"><strong>כוחות אבולוציוניים</strong><span className={phase===2?"agd-selected":""}>סלקציה · הגירה · מוטציה · סחף</span></div>
 {phase===3&&<Equation>p² + 2pq + q² = 1</Equation>}
 </div><div className="agd-focus-line">{["מגדירים מהי האוכלוסייה שעליה מסיקים.","הכלאה מכוונת/בחירת משפחות אינה דגימה של זיווג אקראי.","בודקים האם הנחות המודל מתקיימות בקרוב.","סטייה מהציפייה יכולה לנבוע מכמה גורמים — אינה מזהה סיבה אחת מעצמה."][phase]}</div></>;
}

export default function AppliedGeneticsDemo({ visual }) {
 const scene=visual?.scene || "marker-choice";
 const phase=Math.max(0,Math.min(3,Math.floor(Number(visual?.phase)||0)));
 const Renderer={"marker-choice":MarkerChoice,"study-path":StudyPath,"candidate-validation":CandidateValidation,"gene-diversity":Diversity,"joint-probability":Joint,"ld-comparison":LD,"pedigree":Pedigree,"hardy-weinberg":HardyWeinberg}[scene];
 if(!Renderer) return null;
 return <div className="agd-demo" dir="rtl" aria-label={visual?.caption || "המחשה של התהליך"} key={`${scene}-${phase}`}>
   <Renderer phase={phase}/><div className="agd-note">המחשה סכמטית לצורכי לימוד, לא נתונים ניסויים חדשים.</div>
 </div>;
}
