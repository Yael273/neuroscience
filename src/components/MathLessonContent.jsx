import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import "../styles/math-lesson-content.css";

// Keep mathematical notation LTR and ordinary Hebrew text RTL.
const HEBREW = /[\u0590-\u05FF]/;
const EXPLICIT_MATH = /(\$\$[\s\S]+?\$\$|\$[^$\n]+\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\])/g;
const INLINE_SYMBOL = /(?<![\p{L}\p{N}_])(?:[a-zA-Z](?:_[A-Za-z0-9]+)?(?:\^[{]?[A-Za-z0-9+\-]+[}]?)?|(?:ln|sin|cos|tan|exp|log)\([^()]*\)|[∂∇][a-zA-Z]?)(?![\p{L}\p{N}_])/gu;
const MATH_MARKER = /(?:\\(?:frac|partial|nabla|sqrt|sum|cdot|left|right|sin|cos|ln|log|hat|vec|theta|pi|cdots|approx|exp)|[=^∂∇≈])/;

function unwrapMath(value) {
  let result = String(value ?? "").trim();
  if (result.startsWith("$$") && result.endsWith("$$")) result = result.slice(2, -2);
  else if ((result.startsWith("\\(") && result.endsWith("\\)")) ||
           (result.startsWith("\\[") && result.endsWith("\\]"))) result = result.slice(2, -2);
  else if (result.startsWith("$") && result.endsWith("$")) result = result.slice(1, -1);
  return result.trim();
}

// Old JSON sometimes writes derivatives as f\\' (LaTeX accent syntax).
// Convert that to the mathematical prime f' before calling KaTeX.
function cleanMath(value) {
  return unwrapMath(value)
    .replace(/\\'/g, "'")
    .replace(/\\\s+(?=[a-zA-Z])/g, " ")
    .trim();
}

function Formula({ value, block = false }) {
  const math = cleanMath(value);
  if (!math) return null;
  const fallback = () => <code dir="ltr" className="ml3-math-fallback">{math}</code>;
  return block ? (
    <div dir="ltr" className="ml3-equation">
      <BlockMath math={math} renderError={fallback} />
    </div>
  ) : (
    <span dir="ltr" className="ml3-inline">
      <InlineMath math={math} renderError={fallback} />
    </span>
  );
}

function tokenize(text, key) {
  const parts = [];
  let pos = 0;
  for (const m of text.matchAll(INLINE_SYMBOL)) {
    if (m.index > pos) parts.push(<React.Fragment key={`${key}-p${pos}`}>{text.slice(pos, m.index)}</React.Fragment>);
    parts.push(<Formula key={`${key}-m${m.index}`} value={m[0]} />);
    pos = m.index + m[0].length;
  }
  if (pos < text.length) parts.push(<React.Fragment key={`${key}-end`}>{text.slice(pos)}</React.Fragment>);
  return parts;
}

function RichText({ children }) {
  const text = String(children ?? "");
  const items = [];
  let current = 0;
  for (const match of text.matchAll(EXPLICIT_MATH)) {
    if (match.index > current) items.push(...tokenize(text.slice(current, match.index), `t${current}`));
    items.push(<Formula key={`m${match.index}`} value={match[0]} />);
    current = match.index + match[0].length;
  }
  if (current < text.length) items.push(...tokenize(text.slice(current), `t${current}`));
  return <>{items}</>;
}

// Handle older mixed strings, such as:
// "a\\ \\text{קבוע};\\quad\\frac{ds}{dt}=\\omega"
// by separating the Hebrew explanation from its mathematical equation.
function splitLegacyMixedLine(value) {
  const text = String(value ?? "").trim();
  if (!HEBREW.test(text) || !/\\(?:frac|partial|nabla|sqrt|omega|theta|pi|cdot|sum)/.test(text)) return null;

  const chunks = text.split(/\s*;\s*(?:\\quad\s*)?/);
  if (chunks.length < 2) return null;

  const pieces = chunks.map(chunk => {
    const cleaned = chunk
      .replace(/\\text\{([^{}]*)\}/g, "$1")
      .replace(/\\quad\b/g, " ")
      .replace(/\\ /g, " ")
      .trim();
    if (!cleaned) return null;
    return HEBREW.test(cleaned) ? { kind: "prose", value: cleaned } : { kind: "math", value: cleaned };
  }).filter(Boolean);
  return pieces.some(x => x.kind === "math") ? pieces : null;
}

function ContentLine({ value, preferBlock = false }) {
  const text = String(value ?? "").trim();
  if (!text) return null;

  const mixed = splitLegacyMixedLine(text);
  if (mixed) return <div className="ml3-mixed-step">
    {mixed.map((part, i) => part.kind === "math"
      ? <Formula value={part.value} block key={i} />
      : <p className="ml3-prose" dir="rtl" key={i}><RichText>{part.value}</RichText></p>)}
  </div>;

  const onlyMath = !HEBREW.test(text) && (MATH_MARKER.test(text) ||
    (preferBlock && /^[\s()\d+\-*/.a-zA-Z]+$/.test(text) && /[=^]/.test(text)));
  if (onlyMath) return <Formula value={text} block />;
  return <p className="ml3-prose" dir="rtl"><RichText>{text}</RichText></p>;
}

function ExplainItem({ item }) {
  const term = typeof item === "string" ? "" : (item.term || item.title || "");
  const description = typeof item === "string" ? item : (item.explanation || item.text || "");
  const meaningful = term && !/^הסבר\s*\d+$/u.test(term);
  return <div className="ml3-paragraph">
    {meaningful && <h4 className="ml3-subtitle">{term}</h4>}
    <ContentLine value={description} />
  </div>;
}

export default function MathLessonContent({ section }) {
  const details = Array.isArray(section?.details) ? section.details : [];
  const formulas = Array.isArray(section?.formulas) ? section.formulas : [];
  const examples = Array.isArray(section?.examples) ? section.examples : [];
  const keyPoints = Array.isArray(section?.keyPoints) ? section.keyPoints : [];

  return <div className="ml3-lesson" dir="rtl">
    {details.length > 0 && <section className="ml3-section ml3-theory" aria-label="הסבר עיוני">
      <header className="ml3-section-header"><span className="ml3-label">01</span><h3>להבין את הרעיון</h3></header>
      <div className="ml3-reading">{details.map((item, i) => <ExplainItem item={item} key={i} />)}</div>
    </section>}

    {formulas.length > 0 && <section className="ml3-section ml3-formulas" aria-label="נוסחאות מרכזיות">
      <header className="ml3-section-header"><span className="ml3-label">02</span><h3>הנוסחאות שצריך להכיר</h3></header>
      <div className="ml3-formula-list">{formulas.map((f, i) => <article className="ml3-formula-card" key={f.id || i}>
        {f.latex && <Formula value={f.latex} block />}
        {f.meaning && <p className="ml3-meta"><strong>משמעות </strong><RichText>{f.meaning}</RichText></p>}
        {f.whenToUse && <p className="ml3-meta"><strong>מתי משתמשים? </strong><RichText>{f.whenToUse}</RichText></p>}
        {f.notes && <p className="ml3-meta"><RichText>{f.notes}</RichText></p>}
      </article>)}</div>
    </section>}

    {examples.length > 0 && <section className="ml3-section ml3-examples" aria-label="דוגמאות פתורות">
      <header className="ml3-section-header"><span className="ml3-label">03</span><h3>דוגמאות פתורות — צעד אחר צעד</h3></header>
      {examples.map((ex, i) => <article className="ml3-example" key={i}>
        <h4 className="ml3-example-title">דוגמה {i + 1}{ex.title ? ` — ${ex.title}` : ""}</h4>
        {ex.question && <div className="ml3-question"><span className="ml3-miniheading">נתון / נדרש</span><ContentLine value={ex.question} preferBlock /></div>}
        {Array.isArray(ex.steps) && ex.steps.length > 0 && <div className="ml3-solution">
          <h5>מהלך הפתרון</h5>
          <ol className="ml3-steps">{ex.steps.map((step, j) => <li key={j}>
            <span className="ml3-step-number" aria-hidden="true">{j + 1}</span>
            <div className="ml3-step-body"><ContentLine value={step} preferBlock /></div>
          </li>)}</ol>
        </div>}
        {ex.answer && <div className="ml3-answer"><span className="ml3-miniheading">תשובה סופית</span><ContentLine value={ex.answer} preferBlock /></div>}
        {ex.tip && <p className="ml3-tip"><strong>שימי לב: </strong><RichText>{ex.tip}</RichText></p>}
      </article>)}
    </section>}

    {keyPoints.length > 0 && <section className="ml3-section ml3-keypoints" aria-label="דגשים לזכור">
      <header className="ml3-section-header"><span className="ml3-label">✓</span><h3>דגשים חשובים לבוחן</h3></header>
      <ul>{keyPoints.map((p, i) => <li key={i}><RichText>{p}</RichText></li>)}</ul>
    </section>}
  </div>;
}
