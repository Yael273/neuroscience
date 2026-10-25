
import React from "react";
import "../styles/process-flow.css";

export default function ProcessFlow({ block }) {
  const steps = block?.steps || [];

  if (!steps.length) return null;

  return (
    <div className="process-flow" dir="rtl">
      {/* {block.title && (
        <h4 className="process-flow-title">
          {block.title}
        </h4>
      )} */}

      <div className="process-flow-steps">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="process-flow-step">
              <strong>{step.title}</strong>

              {step.description && (
                <span>{step.description}</span>
              )}
            </div>

            {index < steps.length - 1 && (
              <span
                className="process-flow-arrow"
                aria-hidden="true"
              >
                ←
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
