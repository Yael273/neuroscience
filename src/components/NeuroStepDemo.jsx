import React, { useId } from "react";
import "../styles/neuro-step-demo.css";

// המחשה ציורית של תהליכים אנטומיים, לא תרשים זרימה נוסף.
// נבחרת לפי כותרת התהליך הקיימת ב-JSON; אין צורך לשנות את השיעורים.
function getScene(title = "") {
  if (title.includes("מהגולגולת")) return "layers";
  if (title.includes("קפל דורה")) return "dura";
  if (title.includes("חוזר אל מערכת")) return "absorption";
  if (title.includes("מקור הדימום")) return "bleeding";
  if (title.includes("מסלול CSF")) return "csf";
  if (title.includes("הצטברות CSF")) return "hydro";
  if (title.includes("פענוח חתך")) return "slice";
  if (title.includes("מפרקים ומזהים")) return "model";
  return "general";
}

const layerNames = ["גולגולת", "Dura", "Arachnoid", "Subarachnoid + CSF", "Pia", "מוח"];
const layerColors = ["#c7b19a", "#b46678", "#e7b45c", "#73bbd5", "#da8d97", "#d8a9d2"];

function BrainOutline({ children, id }) {
  return (
    <g>
      <path d="M135 126 C113 82 162 48 205 65 C231 30 283 48 301 68 C353 50 401 90 392 126 C424 151 400 204 367 212 C344 249 283 236 258 234 C210 249 157 220 143 191 C111 180 113 147 135 126 Z"
        fill="#f2d8d9" stroke="#ad738b" strokeWidth="4" />
      <path d="M170 108 Q198 77 229 103 M235 87 Q263 113 286 80 M311 88 Q351 105 346 127 M154 152 Q194 130 208 158 M231 137 Q262 117 277 151 M298 144 Q333 126 357 157 M182 190 Q219 170 240 201 M266 177 Q298 204 328 183"
        fill="none" stroke="#c88aa0" strokeWidth="6" strokeLinecap="round" opacity=".75" />
      {children}
    </g>
  );
}

function Layers({ stepIndex }) {
  // חתך סכמטי: שכבות צבעוניות מקיפות את רקמת המוח. רק השכבה הפעילה מוארת.
  const rings = [
    { r: 119, color: layerColors[0], name: "גולגולת" },
    { r: 103, color: layerColors[1], name: "Dura" },
    { r: 89, color: layerColors[2], name: "Arachnoid" },
    { r: 73, color: layerColors[3], name: "CSF" },
    { r: 60, color: layerColors[4], name: "Pia" },
  ];
  return <>
    <g transform="translate(265 145)">
      {rings.map((ring, index) => (
        <circle key={ring.name} r={ring.r} fill={ring.color}
          className={stepIndex === index ? "neuro-illustration-focus" : ""}
          stroke={stepIndex === index ? "#1a806a" : "#fff"}
          strokeWidth={stepIndex === index ? 5 : 2} />
      ))}
      <path d="M-35 -30 C-63 -16 -47 11 -27 15 C-44 41 -9 57 10 40 C29 56 61 23 43 1 C59 -25 30 -48 9 -35 C-4 -58 -33 -48 -35 -30Z"
        fill={layerColors[5]} stroke={stepIndex === 4 ? "#1a806a" : "#aa78a0"} strokeWidth="4" />
      <path d="M-30 -17 Q-8 -32 8 -9 M2 8 Q29 -5 32 20 M-28 17 Q-11 2 9 27" fill="none" stroke="#b77caa" strokeWidth="4" />
    </g>
    <text x="265" y="290" className="neuro-svg-caption">חתך סכמטי: מהגולגולת אל רקמת המוח</text>
  </>;
}

function Dura({ stepIndex }) {
  return <>
    <path d="M90 68 H450" stroke="#c3ae97" strokeWidth="24" strokeLinecap="round" />
    <path d="M90 101 H450" stroke="#a85e7d" strokeWidth="10" strokeLinecap="round" />
    <path d={stepIndex > 0 ? "M95 115 L243 115 Q270 135 270 242 Q270 135 297 115 L445 115" : "M95 115 H445"}
      fill="none" stroke="#d3819d" strokeWidth="9" strokeLinecap="round" className="neuro-animated-path" />
    {stepIndex >= 2 && <ellipse cx="270" cy="111" rx="42" ry="14" fill="#73b9d7" stroke="#2588b8" strokeWidth="3" className="neuro-illustration-focus" />}
    {stepIndex >= 3 && <>
      {[200,240,300].map((x,i)=><circle key={x} cx={x} cy="111" r="5" fill="#dc486b" className="neuro-flow-dot" style={{animationDelay:`${i*.32}s`}} />)}
      <path d="M193 111 H348" fill="none" stroke="#cb4e74" strokeWidth="3" strokeDasharray="6 9" />
    </>}
    <text x="270" y="285" className="neuro-svg-caption">{["שתי שכבות דורה", "השכבה המנינגיאלית מתקפלת", "נוצר סינוס ורידי", "דם מתנקז בסינוס"][stepIndex] || "דורה"}</text>
  </>;
}

function Absorption({ stepIndex }) {
  return <>
    <path d="M80 207 Q150 175 212 208 T348 208 T463 208 L463 259 H80 Z" fill="#91cfe5" opacity=".8" />
    <path d="M75 97 H465 V136 H75 Z" fill="#bc6d86" />
    <path d="M80 146 Q160 148 199 152 Q241 146 252 173 Q264 193 280 173 Q293 150 345 152 H460" fill="none" stroke="#db9cab" strokeWidth="8" />
    <ellipse cx="270" cy="118" rx="95" ry="17" fill="#638fac" stroke="#2a648a" strokeWidth="4" />
    {stepIndex >= 1 && <path d="M270 214 Q252 189 262 166 T270 131" fill="none" stroke="#f8fdfd" strokeWidth="7" strokeLinecap="round" strokeDasharray="6 13" className="neuro-animated-path" />}
    {stepIndex >= 2 && <g className="neuro-illustration-focus"><path d="M257 115 H350" stroke="#fafafa" strokeWidth="6" strokeLinecap="round" /><path d="m339 106 12 9 -12 9" fill="none" stroke="#fafafa" strokeWidth="5" /></g>}
    <text x="270" y="291" className="neuro-svg-caption">מעבר CSF מהחלל התת־עכבישי אל הסינוס הוורידי</text>
  </>;
}

function Bleeding({ stepIndex }) {
  const epidural = stepIndex === 0;
  return <>
    <path d="M103 70 Q270 -2 439 70" stroke="#b4a18b" fill="none" strokeWidth="20" strokeLinecap="round" />
    <path d="M105 94 Q270 24 437 94" stroke="#bd748f" fill="none" strokeWidth="9" />
    <path d="M110 112 Q265 45 430 112" stroke="#e3b67c" fill="none" strokeWidth="6" />
    <path d="M118 135 Q270 73 424 135" stroke="#7abfd6" fill="none" strokeWidth="12" />
    <BrainOutline />
    {epidural ? <ellipse cx="270" cy="56" rx="75" ry="17" fill="#c73c5c" className="neuro-illustration-focus" />
      : <path d="M145 102 Q270 37 395 102 Q350 77 270 86 Q188 80 145 102Z" fill="#c73c5c" className="neuro-illustration-focus" />}
    <text x="270" y="289" className="neuro-svg-caption">{epidural ? "דימום אפידורלי – מחוץ לדורה" : "דימום סבדורלי – בין הדורה לארכנואיד"}</text>
  </>;
}

const csfPoints = [[176,129],[207,115],[240,139],[272,160],[310,183],[337,206],[300,233],[220,245],[174,216]];
function CSF({ stepIndex }) {
  return <>
    <BrainOutline>
      <path d="M211 105 Q245 83 268 113 L286 127 L273 161 L302 188 L284 216" stroke="#71b8dd" strokeWidth="16" fill="none" strokeLinecap="round" />
      <path d="M210 105 Q247 94 260 118 L271 140" stroke="#dbf4ff" strokeWidth="6" fill="none" strokeLinecap="round" />
    </BrainOutline>
    <path d="M286 217 Q290 257 267 267" stroke="#83bdd7" strokeWidth="19" fill="none" strokeLinecap="round" />
    {csfPoints.slice(0,Math.min(9,stepIndex+1)).map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i===stepIndex?11:5} fill={i===stepIndex?"#147c9c":"#67bed9"} opacity={i===stepIndex?1:.6} className={i===stepIndex?"neuro-illustration-focus":""} />)}
    <text x="270" y="294" className="neuro-svg-caption">מסלול זרימת ה־CSF במערכת החדרים וסביב המוח</text>
  </>;
}

function Hydro({ stepIndex }) {
  return <>
    <BrainOutline>
      <path d="M217 109 Q260 97 279 127 L261 174 Q249 184 232 163 Z" fill="#75bddc" stroke="#337ba0" strokeWidth="3" className={stepIndex >= 2 ? "neuro-ventricle-expand" : ""} />
      <path d="M275 178 L289 213" stroke={stepIndex===1?"#c74a65":"#79c5dc"} strokeWidth="12" strokeLinecap="round" />
    </BrainOutline>
    {stepIndex === 1 && <path d="M274 168 l-11 10 m11 -10 l11 10" fill="none" stroke="#c74a65" strokeWidth="6" />}
    {stepIndex >= 2 && <circle cx="251" cy="146" r="48" fill="none" stroke="#2b9ac0" strokeDasharray="8 9" strokeWidth="3" className="neuro-illustration-focus" />}
    <text x="270" y="290" className="neuro-svg-caption">{["ייצור CSF", "הפרעה בזרימה", "הצטברות והרחבת חדרים", "שינוי במאזן הנוזל"][stepIndex] || "מערכת החדרים"}</text>
  </>;
}

function Slice({ stepIndex }) {
  return <>
    <ellipse cx="270" cy="153" rx="147" ry="107" fill="#e7b5c6" stroke="#996c86" strokeWidth="5" />
    <ellipse cx="270" cy="153" rx="122" ry="86" fill="#f5dce3" stroke="#c88ca5" strokeWidth="4" />
    <path d="M270 65 V241" stroke="#a67b90" strokeWidth="5" strokeDasharray={stepIndex===1?"0":"6 7"} />
    <path d="M235 139 Q250 112 270 143 Q290 112 305 139 L294 166 L270 156 L246 166 Z" fill="#7fb6d3" stroke={stepIndex===3?"#0f8ca9":"#aac6d7"} strokeWidth={stepIndex===3?6:2} />
    {stepIndex === 0 && <path d="M103 260 H435" stroke="#1a87a0" strokeWidth="5" strokeDasharray="11 8" />}
    {stepIndex === 2 && <ellipse cx="270" cy="153" rx="145" ry="105" fill="none" stroke="#198b74" strokeWidth="7" className="neuro-illustration-focus" />}
    <text x="270" y="293" className="neuro-svg-caption">{["זיהוי מישור החתך", "איתור קו האמצע", "זיהוי הקורטקס החיצוני", "זיהוי חללי החדרים"][stepIndex] || "חתך מוח"}</text>
  </>;
}

function Model({ stepIndex }) {
  return <>
    <BrainOutline>
      {stepIndex >= 1 && <path d="M265 62 Q331 42 381 113 Q338 158 268 151 Z" fill="#f7fafc" stroke="#5f9fae" strokeWidth="3" className="neuro-model-reveal" />}
      {stepIndex >= 2 && <path d="M265 105 Q299 93 322 122 L302 166 L267 161 Z" fill="#86c4d9" stroke="#32799c" strokeWidth="3" className="neuro-illustration-focus" />}
      {stepIndex >= 3 && <path d="M259 160 Q295 181 278 229 L259 261 L243 225 Q231 192 259 160Z" fill="#bc91b6" stroke="#74557d" strokeWidth="3" className="neuro-illustration-focus" />}
    </BrainOutline>
    <text x="270" y="291" className="neuro-svg-caption">{["דגם מוח שלם", "הסרת חלק מהמעטפת", "חשיפת מבנים פנימיים", "זיהוי גזע המוח"][stepIndex] || "דגם מוח"}</text>
  </>;
}

export default function NeuroStepDemo({ step, stepIndex = 0, title = "" }) {
  const scene = getScene(title);
  const label = step?.demo?.title || step?.title || "המחשה אנטומית";
  const imageId = useId();
  return (
    <div className="neuro-step-demo" dir="rtl" aria-label={`המחשה חזותית: ${label}`}>
      <div className="neuro-step-demo-title">{label}</div>
      <svg key={`${scene}-${stepIndex}`} className="neuro-step-illustration" viewBox="0 0 540 310"
        role="img" aria-labelledby={`${imageId}-title`}>
        <title id={`${imageId}-title`}>{label}</title>
        {scene === "layers" && <Layers stepIndex={stepIndex} />}
        {scene === "dura" && <Dura stepIndex={stepIndex} />}
        {scene === "absorption" && <Absorption stepIndex={stepIndex} />}
        {scene === "bleeding" && <Bleeding stepIndex={stepIndex} />}
        {scene === "csf" && <CSF stepIndex={stepIndex} />}
        {scene === "hydro" && <Hydro stepIndex={stepIndex} />}
        {scene === "slice" && <Slice stepIndex={stepIndex} />}
        {scene === "model" && <Model stepIndex={stepIndex} />}
        {scene === "general" && <BrainOutline />}
      </svg>
      <p className="neuro-step-demo-note">איור סכמטי ללמידה, לא תמונה אנטומית בקנה מידה.</p>
    </div>
  );
}
