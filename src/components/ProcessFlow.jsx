import React, { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Check, CircleHelp, FileText, Flag } from "lucide-react";
import "../styles/process-flow.css";

const icons = [BookOpen, FileText, CircleHelp, Flag];

export default function ProcessFlow({ block }) {
  const steps = Array.isArray(block?.steps) ? block.steps : [];
  const [activeStep, setActiveStep] = useState(0);

  // Reset the selected step when the underlying diagram changes.
  const flowKey = JSON.stringify(steps);
  useEffect(() => {
    setActiveStep(0);
  }, [flowKey]);

  if (!steps.length) return null;

  // Progress always follows the selected step, including when moving back.
  const selectStep = (index) => {
    if (index >= 0 && index < steps.length) setActiveStep(index);
  };

  const current = steps[activeStep];
  const currentDescription = current?.description || current?.text || "";

  return (
    <section className="process-flow" dir="rtl" aria-label={block?.title || "שלבי התהליך"}>
      <div className="process-flow-shell">
        <div className="process-flow-header">
          <div className="process-flow-intro">
            <span className="process-flow-kicker">לומדים לפי שלבים</span>
            <h4 className="process-flow-title">{block?.title || "שלבי התהליך"}</h4>
            <p>בחרי שלב כדי להתמקד בהסבר שלו.</p>
          </div>
          <span className="process-flow-progress" aria-live="polite">
            שלב {activeStep + 1} מתוך {steps.length}
          </span>
        </div>

        <div className="process-flow-steps" aria-label="בחירת שלב בתהליך">
          {steps.map((step, index) => {
            const Icon = icons[index % icons.length];
            const isActive = index === activeStep;
            const isComplete = index < activeStep;
            return (
              <button
                key={index}
                type="button"
                className={`process-flow-step${isActive ? " is-active" : ""}${isComplete ? " is-complete" : ""}`}
                aria-current={isActive ? "step" : undefined}
                onClick={() => selectStep(index)}
              >
                <span className="process-flow-track" aria-hidden="true">
                  <span className="process-flow-node">
                    {isComplete ? <Check size={18} /> : <Icon size={19} />}
                  </span>
                </span>
                <strong>{step.title || `שלב ${index + 1}`}</strong>
                {(step.description || step.text) && (
                  <span className="process-flow-step-description">
                    {step.description || step.text}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="process-flow-current" aria-live="polite">
          <div className="process-flow-current-text">
            <strong>עכשיו: {current.title || `שלב ${activeStep + 1}`}</strong>
            {currentDescription && <span> — {currentDescription}</span>}
          </div>
          <button
            type="button"
            className="process-flow-next"
            onClick={() => selectStep(activeStep + 1)}
            disabled={activeStep === steps.length - 1}
          >
            {activeStep === steps.length - 1 ? "השלב האחרון" : "לשלב הבא"}
            {activeStep < steps.length - 1 && <ArrowLeft size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </section>
  );
}
