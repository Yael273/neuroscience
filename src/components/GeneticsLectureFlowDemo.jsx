import React from "react";

/**
 * Extra explanatory visuals for genetics lectures 3 and 4.
 * Fully data-driven: other lessons and the GeneticsStepDemo integration are untouched.
 */
export default function GeneticsLectureFlowDemo({ step, stepIndex, title }) {
  const view = step?.lectureDemo;
  if (!view) return null;
  const key = `${title || "flow"}-${stepIndex}`;
  return (
    <div className="gen34-stage" dir="rtl" aria-live="polite">
      <div className="gen34-stage-label">המחשה של שלב {stepIndex + 1}</div>
      <div className="gen34-stage-card" key={key}>
        {view.heading && <h5 className="gen34-stage-title">{view.heading}</h5>}
        {Array.isArray(view.tokens) && (
          <div className="gen34-demo-chain" aria-label="המחשה חזותית של השלב">
            {view.tokens.map((token, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="gen34-demo-arrow" aria-hidden="true">←</span>}
                <span
                  className={`gen34-demo-token${token.muted ? " is-muted" : ""}${token.focus ? " is-focus" : ""}`}
                  style={{ "--gen34-delay": `${index * 160}ms` }}
                >{token.text}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        {Array.isArray(view.bars) && (
          <div className="gen34-demo-bars" role="img" aria-label={view.caption || view.heading}>
            {view.bars.map((bar, index) => (
              <div className="gen34-demo-bar" key={index}>
                <span className="gen34-demo-bar-label">{bar.label}</span>
                <span className="gen34-demo-bar-track"><span className="gen34-demo-bar-fill" style={{
                  "--gen34-width": `${Math.max(0, Math.min(100, Number(bar.percent) || 0))}%`,
                  "--gen34-delay": `${index * 220}ms`,
                  "--gen34-color": bar.color || "#49a789",
                }}/></span>
                <span className="gen34-demo-bar-value">{bar.value || `${bar.percent}%`}</span>
              </div>
            ))}
          </div>
        )}
        {view.formula && <div className="gen34-demo-formula">{view.formula}</div>}
        {view.caption && <p className="gen34-demo-caption">{view.caption}</p>}
      </div>
    </div>
  );
}
