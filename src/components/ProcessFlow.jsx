import React, { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Check, CircleHelp, FileText, Flag } from "lucide-react";
import "../styles/process-flow.css";
import GeneticsStepDemo from "./GeneticsStepDemo";
import NeuroStepDemo from "./NeuroStepDemo";

const icons = [BookOpen, FileText, CircleHelp, Flag];

export default function ProcessFlow({ block }) {
  const steps = Array.isArray(block?.steps) ? block.steps : [];
  const [activeStep, setActiveStep] = useState(0);
  const [visited, setVisited] = useState([0]);
  const flowKey = JSON.stringify(steps);

  useEffect(() => {
    setActiveStep(0);
    setVisited([0]);
  }, [flowKey]);

  if (!steps.length) return null;

  function selectStep(index) {
    if (index < 0 || index >= steps.length) return;
    setActiveStep(index);
    setVisited(previous => previous.includes(index) ? previous : [...previous, index]);
  }

  return (
    <section className="process-flow" dir="rtl" aria-label={block?.title || "שלבי התהליך"}>
      <div className="process-flow-shell">
        <div className="process-flow-header">
          <div className="process-flow-intro">
            <h4 className="process-flow-title">{block?.title || "שלבי התהליך"}</h4>
          </div>
        </div>

        {/* תרשים ניווט אחד בלבד. אין כאן העתק נוסף של התרשים או תיבות הסבר. */}
        <div className="process-flow-steps" aria-label="בחירת שלב בתהליך">
          {steps.map((step, index) => {
            const Icon = icons[index % icons.length];
            const isActive = index === activeStep;
            const isVisited = visited.includes(index) && !isActive;
            return (
              <button key={index} type="button"
                className={`process-flow-step${isActive ? " is-active" : ""}${isVisited ? " is-visited" : ""}`}
                aria-current={isActive ? "step" : undefined}
                onClick={() => selectStep(index)}>
                <span className="process-flow-track" aria-hidden="true">
                  <span className="process-flow-node">
                    {isVisited ? <Check size={18} /> : <Icon size={19} />}
                  </span>
                </span>
                <strong>{step.title || `שלב ${index + 1}`}</strong>
                {(step.description || step.text) && (
                  <span className="process-flow-step-description">{step.description || step.text}</span>
                )}
              </button>
            );
          })}
        </div>

        {block?.interactiveDemo === "genetics-tutorial03" && (
          <GeneticsStepDemo step={steps[activeStep]} stepIndex={activeStep} totalSteps={steps.length} />
        )}
        {block?.interactiveDemo === "neuro4" && (
          <NeuroStepDemo
            step={steps[activeStep]}
            stepIndex={activeStep}
            totalSteps={steps.length}
            title={block.title}
            kind={block.demoKind || "flow"}
          />
        )}

        {/* ניווט מינימלי, ללא כרטיס הסבר כפול, הרחבה, פס או הפעלה אוטומטית. */}
        <div className="process-flow-current">
          <button type="button" className="process-flow-next"
            onClick={() => selectStep(activeStep + 1)}
            disabled={activeStep === steps.length - 1}>
            {activeStep === steps.length - 1 ? "סיום התהליך" : "לשלב הבא"}
            {activeStep < steps.length - 1 && <ArrowLeft size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </section>
  );
}
