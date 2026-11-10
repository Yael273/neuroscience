import React, { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Check, CircleHelp, FileText, Flag, RotateCcw } from "lucide-react";
import "../styles/process-flow.css";

const icons = [BookOpen, FileText, CircleHelp, Flag];

// Optional visual demonstrations supplied by the lesson JSON.
// Steps without a visual keep the original explanation-only presentation.
function StepDemonstration({ visual }) {
  if (!visual || !visual.type) return null;
  const { type } = visual;
  return (
    <div className="process-flow-demo" aria-label={visual.caption || "המחשה של השלב"}>
      {visual.caption && <div className="process-flow-demo-label">{visual.caption}</div>}

      {type === "concept-sequence" && (
        <div className="process-flow-concept-sequence" role="list">
          {(visual.items || []).map((item, index) => (
            <React.Fragment key={index}>
              <div className="process-flow-concept-item" role="listitem" style={{ "--demo-delay": `${index * 220}ms` }}>
                <span className="process-flow-concept-count" aria-hidden="true">{index + 1}</span>
                <strong>{item.label}</strong>
                {item.description && <p>{item.description}</p>}
              </div>
              {index < (visual.items || []).length - 1 && (
                <span className="process-flow-concept-arrow" aria-hidden="true" style={{ "--demo-delay": `${index * 220 + 110}ms` }}>←</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {type === "allele-identification" && (
        <div className="process-flow-alleles" dir="ltr">
          {(visual.alleles || []).map((allele, i) => (
            <div className={`process-flow-allele${allele.selected ? " is-selected" : ""}`} key={i} style={{ "--demo-delay": `${i * 170}ms` }}>
              <span className="process-flow-allele-symbol">{allele.symbol}</span>
              <span className="process-flow-allele-caption">{allele.label}</span>
              {allele.selected && <span className="process-flow-allele-selected">נבחר להדגמה ✓</span>}
            </div>
          ))}
        </div>
      )}

      {type === "dominance" && (
        <div className="process-flow-dominance">
          <div className="process-flow-gene-pair" dir="ltr">
            {(visual.genotype || []).map((allele, i) => (
              <span className="process-flow-gene" key={i}>{allele}</span>
            ))}
          </div>
          <div className="process-flow-demo-arrow" aria-hidden="true">↓</div>
          <div className="process-flow-phenotype">{visual.phenotype}</div>
          {visual.explanation && <p>{visual.explanation}</p>}
        </div>
      )}

      {type === "gamete-separation" && (
        <div className="process-flow-gametes">
          <div className="process-flow-parent" dir="ltr">
            {(visual.genotype || []).map((allele, i) => <span className="process-flow-gene" key={i}>{allele}</span>)}
          </div>
          <div className="process-flow-split-arrows" aria-hidden="true"><span>↙</span><span>↘</span></div>
          <div className="process-flow-gamete-row" dir="ltr">
            {(visual.genotype || []).map((allele, i) => (
              <div className="process-flow-gamete" key={i} style={{ "--demo-delay": `${i * 160}ms` }}>
                <span>{allele}</span>
                <small>גמטה {i + 1}</small>
              </div>
            ))}
          </div>
          {visual.explanation && <p>{visual.explanation}</p>}
        </div>
      )}

      {type === "punnett-square" && (
        <div className="process-flow-punnett-wrap">
          <div className="process-flow-punnett" dir="ltr">
            <span className="process-flow-punnett-corner" aria-hidden="true">×</span>
            {(visual.parentB || []).map((allele, i) => <span className="process-flow-punnett-head" key={`b${i}`}>{allele}</span>)}
            {(visual.parentA || []).map((allele, row) => (
              <React.Fragment key={`a${row}`}>
                <span className="process-flow-punnett-head">{allele}</span>
                {(visual.parentB || []).map((other, col) => (
                  <div className="process-flow-punnett-cell" key={`${row}-${col}`} style={{ "--demo-delay": `${220 + (row * 2 + col) * 210}ms` }}>
                    <strong>{allele}{other}</strong>
                    {visual.phenotypes?.[row]?.[col] && <small>{visual.phenotypes[row][col]}</small>}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          {visual.result && <p className="process-flow-punnett-result">{visual.result}</p>}
        </div>
      )}
      {type === "probability-distribution" && (
        <div className="process-flow-probabilities" role="img" aria-label={visual.caption || "התפלגות ההסתברויות"}>
          {(visual.outcomes || []).map((outcome, index) => (
            <div className="process-flow-probability" key={index} style={{ "--demo-delay": `${index * 230}ms` }}>
              <span className="process-flow-probability-name">{outcome.label}</span>
              <span className="process-flow-probability-bar">
                <span className="process-flow-probability-fill" style={{ "--probability-width": `${Math.max(0, Math.min(100, Number(outcome.probability) * 100))}%`, "--probability-color": outcome.color || "#439b83" }} />
              </span>
              <strong dir="ltr">{outcome.fraction}</strong>
            </div>
          ))}
          {visual.explanation && <p className="process-flow-probability-explain">{visual.explanation}</p>}
        </div>
      )}

      {type === "independent-product" && (
        <div className="process-flow-product">
          <div className="process-flow-product-inputs">
            {(visual.factors || []).map((factor, index) => (
              <div className="process-flow-product-factor" key={index} style={{ "--demo-delay": `${index * 420}ms` }}>
                <span>{factor.label}</span>
                <strong dir="ltr">{factor.fraction}</strong>
              </div>
            ))}
          </div>
          <div className="process-flow-product-equation" dir="ltr" aria-label={visual.equation}>
            {(visual.factors || []).map((factor, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="process-flow-product-times">×</span>}
                <span>{factor.fraction}</span>
              </React.Fragment>
            ))}
            <span className="process-flow-product-equals">=</span>
            <strong>{visual.resultFraction}</strong>
          </div>
          <div className="process-flow-result-cells" dir="ltr" aria-label={visual.resultText || "תוצאה"}>
            {Array.from({ length: Number(visual.denominator) || 8 }, (_, i) => (
              <span key={i} className={i < Number(visual.numerator) ? "is-highlighted" : ""} style={{ "--demo-delay": `${i * 100 + 1050}ms` }} />
            ))}
          </div>
          <p className="process-flow-product-result">{visual.resultText}</p>
          {visual.explanation && <p className="process-flow-probability-explain">{visual.explanation}</p>}
        </div>
      )}

      {type === "pedigree-example" && (
        <div className="process-flow-pedigree">
          <svg viewBox="0 0 420 215" role="img" aria-label="אילן יוחסין סכמטי: שני הורים בריאים נשאים וילד עם פנוטיפ רצסיבי" preserveAspectRatio="xMidYMid meet">
            <line x1="120" y1="58" x2="300" y2="58" stroke="#78938b" strokeWidth="3" />
            <line x1="210" y1="58" x2="210" y2="148" stroke="#78938b" strokeWidth="3" />
            <rect x="96" y="34" width="48" height="48" rx="3" fill="#e9f3ff" stroke="#3a72a5" strokeWidth="3" />
            <circle cx="300" cy="58" r="24" fill="#e9f3ff" stroke="#3a72a5" strokeWidth="3" />
            <rect x="186" y="130" width="48" height="48" rx="3" fill="#325c89" stroke="#325c89" strokeWidth="3" />
            <g fontSize="17" fill="#21435e" fontWeight="700" textAnchor="middle">
              <text x="120" y="24">{visual.focus === "legend" ? "□" : "Aa"}</text>
              <text x="300" y="24">{visual.focus === "legend" ? "○" : "Aa"}</text>
              <text x="210" y="204">{visual.focus === "legend" ? "בעל התכונה" : "aa"}</text>
            </g>
            {visual.focus !== "legend" && <g className="process-flow-pedigree-highlights"><circle cx="120" cy="58" r="34" fill="none" stroke="#35b57c" strokeWidth="3" strokeDasharray="5 5"/><circle cx="300" cy="58" r="34" fill="none" stroke="#35b57c" strokeWidth="3" strokeDasharray="5 5"/></g>}
          </svg>
          <p>{visual.explanation}</p>
        </div>
      )}

      {type === "ratio-analysis" && (
        <div className="process-flow-ratio">
          {(visual.items || []).map((item,i) => {
            const max = Math.max(1,...(visual.items || []).map(x=>Number(x.value)||0));
            return <div className="process-flow-ratio-row" key={i} style={{"--demo-delay":`${i*170}ms`}}>
              <span>{item.label}</span>
              <div className="process-flow-ratio-track"><div className="process-flow-ratio-fill" style={{"--ratio-width":`${100*(Number(item.value)||0)/max}%`,"--ratio-color":item.color||"#36a97d"}}/></div>
              <strong dir="ltr">{Number(item.value).toLocaleString('en-US')}</strong>
            </div>;
          })}
          {visual.explanation && <p>{visual.explanation}</p>}
        </div>
      )}

      {type === "chi-square-table" && (() => {
        const observed = visual.observed || [];
        const expected = visual.expected || [];
        const terms = observed.map((o,i)=>(o-expected[i])**2/expected[i]);
        const total = terms.reduce((sum,t)=>sum+t,0);
        return <div className="process-flow-chi" dir="rtl">
          {visual.focus === "hypotheses" ? <div className="process-flow-chi-headline"><strong>H₀: 9:3:3:1</strong><span>לעומת</span><strong>H₁: יחס שונה</strong></div> :
          visual.focus === "degrees" ? <div className="process-flow-chi-headline"><strong>4 קטגוריות</strong><span>− 1 =</span><strong>df = 3</strong></div> :
          visual.focus === "decision" ? <div className="process-flow-chi-headline"><strong>χ² ≈ {total.toFixed(2)}</strong><span>קטן מ־</span><strong>7.82</strong><span>← אין לדחות את H₀</span></div> :
          <div className="process-flow-chi-scroll"><table><thead><tr><th>קבוצה</th><th>נצפה O</th><th>צפוי E</th>{visual.focus === "contributions" && <th dir="ltr">(O−E)²/E</th>}</tr></thead><tbody>
            {observed.map((o,i)=><tr key={i} style={{"--demo-delay":`${i*240}ms`}}><th>{visual.names?.[i]}</th><td>{o}</td><td>{expected[i].toFixed(2)}</td>{visual.focus === "contributions" && <td>{terms[i].toFixed(3)}</td>}</tr>)}
          </tbody></table></div>}
          {visual.explanation && <p>{visual.explanation}</p>}
        </div>;
      })()}

      {type === "dihybrid-cross" && (
        <div className="process-flow-dihybrid">
          {visual.phase === "parents" && <div className="process-flow-dihybrid-parents" dir="ltr"><span>AaBb</span><b>×</b><span>AaBb</span></div>}
          {visual.phase === "gametes" && <div className="process-flow-dihybrid-gametes" dir="ltr">{["AB","Ab","aB","ab"].map((g,i)=><span key={g} style={{"--demo-delay":`${i*220}ms`}}>{g}</span>)}</div>}
          {visual.phase === "square" && <div className="process-flow-dihybrid-table" dir="ltr" role="img" aria-label="ריבוע פאנט 4 על 4 של הכלאת AaBb כפול AaBb">
            <span className="head">×</span>{["AB","Ab","aB","ab"].map(g=><span key={`h${g}`} className="head">{g}</span>)}
            {["AB","Ab","aB","ab"].map((a,ri)=><React.Fragment key={a}><span className="head">{a}</span>{["AB","Ab","aB","ab"].map((b,ci)=>{
              const pair=(upper,lower)=>[upper,lower].sort((x,y)=>(x===x.toUpperCase()?0:1)-(y===y.toUpperCase()?0:1)).join("");
              const genotype=pair(a[0],b[0])+pair(a[1],b[1]);
              return <span className="cell" key={`${a}-${b}`} style={{"--demo-delay":`${(ri*4+ci)*80}ms`}}>{genotype}</span>;
            })}</React.Fragment>)}
          </div>}
          {visual.phase === "phenotypes" && <div className="process-flow-dihybrid-ratios">{[["A_B_","9/16","#3277a8"],["A_bb","3/16","#8960b2"],["aaB_","3/16","#2d9f82"],["aabb","1/16","#c5902b"]].map(([k,v,c],i)=><span key={k} style={{"--demo-delay":`${i*220}ms`,"--ratio-color":c}}><strong>{k}</strong><small>{v}</small></span>)}</div>}
          {visual.explanation && <p>{visual.explanation}</p>}
        </div>
      )}
    </div>
  );
}

export default function ProcessFlow({ block }) {
  const steps = Array.isArray(block?.steps) ? block.steps : [];
  const [activeStep, setActiveStep] = useState(0);
  const [replay, setReplay] = useState(0);
  const flowKey = JSON.stringify(steps);

  useEffect(() => {
    setActiveStep(0);
    setReplay(0);
  }, [flowKey]);

  if (!steps.length) return null;
  const safeStep = Math.min(activeStep, steps.length - 1);
  const current = steps[safeStep];
  const currentDescription = current?.description || current?.text || "";
  const hasVisual = !!current?.visual?.type;
  const selectStep = (index) => {
    if (index >= 0 && index < steps.length) {
      setActiveStep(index);
      setReplay(value => value + 1);
    }
  };

  return (
    <section className="process-flow" dir="rtl" aria-label={block?.title || "שלבי התהליך"}>
      <div className="process-flow-shell">
        <div className="process-flow-header">
          <div className="process-flow-intro">
            <span className="process-flow-kicker">לומדים לפי שלבים</span>
            <h4 className="process-flow-title">{block?.title || "שלבי התהליך"}</h4>
            <p>בחרי שלב כדי לראות מה קורה בו.</p>
          </div>
          <span className="process-flow-progress" aria-live="polite">שלב {safeStep + 1} מתוך {steps.length}</span>
        </div>
        <div className="process-flow-steps" aria-label="בחירת שלב בתהליך">
          {steps.map((step, index) => {
            const Icon = icons[index % icons.length];
            const isActive = index === safeStep;
            const isComplete = index < safeStep;
            return (
              <button
                key={index} type="button"
                className={`process-flow-step${isActive ? " is-active" : ""}${isComplete ? " is-complete" : ""}`}
                aria-current={isActive ? "step" : undefined}
                onClick={() => selectStep(index)}
              >
                <span className="process-flow-track" aria-hidden="true"><span className="process-flow-node">
                  {isComplete ? <Check size={18} /> : <Icon size={19} />}
                </span></span>
                <strong>{step.title || `שלב ${index + 1}`}</strong>
                {(step.description || step.text) && <span className="process-flow-step-description">{step.description || step.text}</span>}
              </button>
            );
          })}
        </div>
        <div className="process-flow-current">
          <div className="process-flow-current-text">
            <strong>עכשיו: {current.title || `שלב ${safeStep + 1}`}</strong>
            {currentDescription && <span> — {currentDescription}</span>}
          </div>
          <button className="process-flow-next" type="button" onClick={() => selectStep(safeStep + 1)} disabled={safeStep === steps.length - 1}>
            {safeStep === steps.length - 1 ? "השלב האחרון" : "לשלב הבא"}
            {safeStep < steps.length - 1 && <ArrowLeft size={16} aria-hidden="true" />}
          </button>
        </div>
        {hasVisual && (
          <div className="process-flow-visual-section">
            <div className="process-flow-demo-toolbar">
              <span>המחשה של התהליך</span>
              <button type="button" onClick={() => setReplay(value => value + 1)} aria-label="הפעלה חוזרת של ההמחשה">
                <RotateCcw size={15} /> הצגה חוזרת
              </button>
            </div>
            <div key={`${safeStep}-${replay}`} className="process-flow-demo-stage">
              <StepDemonstration visual={current.visual} />
            </div>
            <span className="process-flow-demo-disclaimer">המחשה לימודית סכמטית; אינה ממצא אמפירי ואינה מחליפה את המקור.</span>
          </div>
        )}
      </div>
    </section>
  );
}
