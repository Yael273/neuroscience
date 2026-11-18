import React from "react";
import "../styles/genetics-step-demo.css";

// The parent ProcessFlow controls selectedStep. This component renders only the
// concrete worked example for the selected step, not another process diagram.
function DemoItem({ item, index }) {
  const [label, value, symbol] = item;
  return (
    <div className="gen3-demo-item" style={{ "--gen3-item-order": index }}>
      <span className="gen3-demo-item-symbol" aria-hidden="true">{symbol || (index + 1)}</span>
      <span className="gen3-demo-item-label">{label}</span>
      <strong className="gen3-demo-item-value" dir="auto">{value}</strong>
    </div>
  );
}

export default function GeneticsStepDemo({ step, stepIndex, totalSteps }) {
  const demo = step?.demo;
  if (!demo) return null;

  return (
    <div className="gen3-step-demo" key={stepIndex} dir="rtl" aria-live="polite" aria-atomic="true">
      <div className="gen3-demo-heading">
        <span className="gen3-demo-count">המחשה של שלב {stepIndex + 1} מתוך {totalSteps}</span>
        <h5>{demo.headline}</h5>
        {demo.lead && <p>{demo.lead}</p>}
      </div>

      {demo.kind === "matrix" ? (
        <div className="gen3-demo-table-wrap">
          <table className="gen3-demo-table">
            <thead><tr>{demo.headers.map((x, i) => <th key={i}>{x}</th>)}</tr></thead>
            <tbody>{demo.rows.map((row, i) => <tr key={i}>{row.map((value, j) => <td key={j}>{value}</td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : demo.kind === "bars" ? (
        <div className="gen3-demo-bars">
          {(demo.items || []).map(([label, amount], i) => (
            <div className="gen3-demo-bar" key={i}>
              <span>{label}</span>
              <div className="gen3-demo-bar-track"><div className="gen3-demo-bar-fill" style={{ "--gen3-bar": `${amount}%`, "--gen3-item-order": i }} /></div>
              <strong>{amount}%</strong>
            </div>
          ))}
        </div>
      ) : (
        <>
          {demo.formula && <div className="gen3-demo-formula" dir="auto">{demo.formula}</div>}
          <div className={`gen3-demo-items ${demo.kind === "comparison" ? "gen3-demo-comparison" : ""}`}>
            {(demo.items || []).map((item, i) => <DemoItem key={i} item={item} index={i} />)}
          </div>
        </>
      )}
      {demo.result && <div className="gen3-demo-result"><span aria-hidden="true">✓</span><p>{demo.result}</p></div>}
    </div>
  );
}
