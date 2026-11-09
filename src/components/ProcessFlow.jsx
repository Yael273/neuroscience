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
            <span className="process-flow-demo-disclaimer">דוגמה להמחשה; אינה מחליפה את נתוני התרגיל.</span>
          </div>
        )}
      </div>
    </section>
  );
}
