import React, { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, CheckCircle2, ChevronDown, RotateCcw } from "lucide-react";
import InteractiveImage from "./InteractiveImage";
import ProcessFlow from "./ProcessFlow";
import "../styles/learning-colors.css";
import { assetUrl } from "../utils/assetUrl";



// Opt-in textbook layout: only sections with learningFlow use this renderer.
// Other lessons continue to use the original JSON structure and layout.
function LessonFlowVisual({ block }) {
  if (!block) return null;
  return (
    <div className={`learning-visual learning-visual--${block.type} textbook-visual`}>
      <h4>{block.title}</h4>
      {block.type === "comparison" && (
        <div className="learning-table-scroll" role="region" tabIndex={0} aria-label={block.title}>
          <table className="learning-comparison-table">
            <thead><tr>{block.columns.map((col, i) => <th scope="col" key={i}>{col}</th>)}</tr></thead>
            <tbody>{block.rows.map((row, ri) => (
              <tr key={ri}>{row.map((cell, ci) => ci === 0
                ? <th scope="row" key={ci} dir="auto" data-label={block.columns[ci]}>{cell}</th>
                : <td key={ci} dir="auto" data-label={block.columns[ci]}>{cell}</td>)}</tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {block.type === "process" && <ProcessFlow block={block} />}
      {block.type === "takeaway" && <p className="learning-takeaway">{block.text}</p>}
    </div>
  );
}

function LessonNarrative({ section, lessonId }) {
  return (
    <div className="textbook-reading">
      {section.learningQuestion && (
        <div className="textbook-question">
          <span>השאלה המרכזית</span>
          <h4>{section.learningQuestion}</h4>
        </div>
      )}
      {(section.learningFlow || []).map((part, i) => {
        if (part.type === "intro" || part.type === "paragraph") {
          return <p className="textbook-paragraph" key={i}>{part.text}</p>;
        }
        if (part.type === "explanation") {
          return (
            <section className="textbook-subsection" key={i}>
              <h4>{part.title}</h4>
              <p>{part.text}</p>
            </section>
          );
        }
        if (part.type === "visual") {
          return <LessonFlowVisual key={i} block={section.visualBlocks?.[part.index]} />;
        }
        if (part.type === "image" && section.image?.src) {
          return section.image.hotspots?.length ? (
            <InteractiveImage key={`${lessonId}-${section.id}-${i}`} image={section.image} title={section.title} />
          ) : (
            <figure key={i} className="interactive-topic-figure textbook-figure">
              <img src={assetUrl(section.image.src)} alt={section.image.alt || section.title} loading="lazy" />
              <figcaption>מתוך המצגת המקורית · שקופית {section.image.slide}</figcaption>
            </figure>
          );
        }
        if (part.type === "takeaway") {
          return <aside className="textbook-note" key={i}><strong>{part.title || "מה חשוב לזכור?"}</strong><p>{part.text}</p></aside>;
        }
        return null;
      })}
    </div>
  );
}

// Each section may optionally have an image and a check question in the JSON.
export default function InteractiveSummary({
  sections = [], lessonId, topicRequest,
  savedTopicIds = [], onTopicBookmark, onActiveTopicChange
}) {
  const [answers, setAnswers] = useState({});
  const [expanded, setExpanded] = useState({});
  const [expandedDetails, setExpandedDetails] = useState({});
  const [activeTopicId, setActiveTopicId] = useState(sections[0]?.id ?? null);
  const savedIds = savedTopicIds;
  const toggleBookmark = onTopicBookmark;

  // Reset local practice when switching to a different lesson.
  useEffect(() => {
    setAnswers({});
    setExpanded({});
    setExpandedDetails({});
    const firstTopicId = sections[0]?.id ?? null;
    setActiveTopicId(firstTopicId);
    onActiveTopicChange?.(firstTopicId);
  }, [lessonId, onActiveTopicChange]);

  // Follow the topic closest to the upper visible part of the viewport.
  useEffect(() => {
    if (!sections.length) return;
    let frame = null;
    const update = () => {
      frame = null;
      let current = sections[0].id;
      for (const section of sections) {
        const node = document.getElementById(`topic-${section.id}`);
        if (node && node.getBoundingClientRect().top <= 180) current = section.id;
      }
      setActiveTopicId(current);
      onActiveTopicChange?.(current);
    };
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [sections, onActiveTopicChange]);

  // The sidebar can open a collapsed topic, including after switching tabs.
  useEffect(() => {
    const id = topicRequest?.topicId;
    if (!id || !sections.some(section => section.id === id)) return;
    setExpanded(previous => ({ ...previous, [id]: true }));
    setActiveTopicId(id);
    onActiveTopicChange?.(id);
    const frame = requestAnimationFrame(() => {
      document.getElementById(`topic-${id}`)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [topicRequest, sections, onActiveTopicChange]);

  const questionCount = sections.filter(section => section.check).length;
  const answeredCount = sections.filter(section =>
    section.check && answers[section.id] !== undefined
  ).length;

  function clearAnswer(id) {
    setAnswers(previous => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
  }

  return (
    <div className="interactive-summary" dir="rtl">
      <header className="interactive-summary-header">
        <div>
          <span className="interactive-kicker">לומדים ומתרגלים</span>
          <h2>סיכום השיעור</h2>
          <p>עוברים על נושא קצר, נעזרים באיור ובודקים את ההבנה לפני שממשיכים.</p>
        </div>
        {questionCount > 0 && (
          <div className="interactive-summary-count" aria-live="polite">
            {answeredCount} מתוך {questionCount} שאלות נענו
          </div>
        )}
      </header>

      {sections.map((section, index) => {
        const check = section.check;
        const selected = answers[section.id];
        const answered = selected !== undefined;
        const correct = answered && selected === check?.correctAnswer;
        const hasImage = Boolean(section.image?.src);
        const isExpanded = expanded[section.id] !== false;

        return (
          <article key={section.id} className="interactive-topic" id={`topic-${section.id}`}>
            <div className="interactive-topic-heading">
              <div className="interactive-topic-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="interactive-topic-title">
                <span className="interactive-kicker">
                  נושא {index + 1}
                  {section.slidePages?.length > 0 && ` · שקופיות ${section.slidePages[0]}–${section.slidePages.at(-1)}`}
                </span>
                <h3>{section.title}</h3>
              </div>
              <button
                type="button"
                className={savedIds.includes(section.id) ? "interactive-bookmark saved" : "interactive-bookmark"}
                aria-pressed={savedIds.includes(section.id)}
                aria-label={`${savedIds.includes(section.id) ? "הסרה מחזרה" : "שמירה לחזרה"}: ${section.title}`}
                title={savedIds.includes(section.id) ? "הסרה מהנושאים לחזרה" : "שמירה לחזרה"}
                onClick={() => toggleBookmark(section.id)}
              >
                {savedIds.includes(section.id) ? <BookmarkCheck size={19} /> : <Bookmark size={19} />}
              </button>
              <button
                type="button"
                className="interactive-collapse"
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? "צמצום" : "הרחבת"} הנושא ${section.title}`}
                onClick={() => setExpanded(previous => ({ ...previous, [section.id]: !isExpanded }))}
              >
                <ChevronDown size={19} className={isExpanded ? "" : "collapsed"} />
              </button>
            </div>

            {isExpanded && (
              <div className="interactive-topic-content">
                {section.learningFlow?.length > 0 ? (
                  <LessonNarrative section={section} lessonId={lessonId} />
                ) : (
                  <>
                <p className="interactive-topic-summary">{section.summary}</p>
                {section.details?.length > 0 && (
                  <section className="interactive-topic-details" aria-label="הסברים והרחבות">
                    {section.details.map((item, detailIndex) => {
                      const detailKey = `${section.id}-${detailIndex}`;
                      const isLong = (item.explanation?.length ?? 0) > 270;
                      const showAll = Boolean(expandedDetails[detailKey]);
                      return (
                        <div className="interactive-detail" key={detailKey}>
                          <h4 className="interactive-detail-heading">{item.term}</h4>
                          <p
                            id={`detail-${detailKey}`}
                            className={`interactive-detail-text${isLong && !showAll ? " is-clamped" : ""}`}
                          >
                            {item.explanation}
                          </p>
                          {isLong && (
                            <button
                              type="button"
                              className="interactive-detail-more"
                              aria-expanded={showAll}
                              aria-controls={`detail-${detailKey}`}
                              onClick={() => setExpandedDetails(previous => ({
                                ...previous,
                                [detailKey]: !showAll,
                              }))}
                            >
                              {showAll ? "הצג פחות" : "קראי את ההסבר המלא"}
                              <ChevronDown size={15} className={showAll ? "detail-chevron-up" : ""} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </section>
                )}

                {section.visualBlocks?.length > 0 && (
                  <div className="learning-visual-blocks">
                    {section.visualBlocks.map((block, blockIndex) => (
                      <div className={`learning-visual learning-visual--${block.type}`} key={`${section.id}-visual-${blockIndex}`}>
                        <h4>{block.title}</h4>
                        {block.type === "comparison" && (
                          <div className="learning-table-scroll" role="region" tabIndex={0} aria-label={block.title}>
                            <table className="learning-comparison-table">
                              <thead><tr>{block.columns.map((col, ci) => <th key={ci} scope="col">{col}</th>)}</tr></thead>
                              <tbody>{block.rows.map((row, ri) => (
                                <tr key={ri}>{row.map((cell, ci) => ci === 0
                                  ? <th scope="row" key={ci} dir="auto" data-label={block.columns[ci]}>{cell}</th>
                                  : <td key={ci} dir="auto" data-label={block.columns[ci]}>{cell}</td>)}</tr>
                              ))}</tbody>
                            </table>
                          </div>
                        )}

                        {block.type === "process" && (
                          <ProcessFlow block={block} />
                        )}

                        {block.type === "takeaway" && <p className="learning-takeaway">{block.text}</p>}
                      </div>
                    ))}
                  </div>
                )}


                {hasImage && section.image.hotspots?.length > 0 && (
                  <InteractiveImage key={`${lessonId}-${section.id}`} image={section.image} title={section.title} />
                )}

                {hasImage && !section.image.hotspots?.length && (
                  <figure className="interactive-topic-figure">
                    <img src={assetUrl(section.image.src)} alt={section.image.alt || section.title} loading="lazy" />
                    <figcaption>מתוך המצגת המקורית · שקופית {section.image.slide}</figcaption>
                  </figure>
                )}

                  </>
                )}

                {check && (
                  <div className="interactive-check">
                    <div className="interactive-check-heading">
                      <span>בדיקת הבנה</span>
                      <strong>{check.question}</strong>
                    </div>
                    <div className="interactive-check-options">
                      {check.options.map((option, optionIndex) => {
                        const correctOption = optionIndex === check.correctAnswer;
                        const selectedOption = selected === optionIndex;
                        const stateClass = !answered ? "" : correctOption ? " answer-correct" : selectedOption ? " answer-wrong" : "";
                        return (
                          <button
                            key={optionIndex}
                            type="button"
                            className={`interactive-check-option${stateClass}`}
                            disabled={answered}
                            aria-pressed={selectedOption}
                            onClick={() => setAnswers(previous => ({ ...previous, [section.id]: optionIndex }))}
                          >
                            <span className="interactive-option-marker">{String.fromCharCode(1488 + optionIndex)}</span>
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>
                    {answered && (
                      <div className={`interactive-check-feedback ${correct ? "correct" : "incorrect"}`} role="status">
                        <strong><CheckCircle2 size={16} /> {correct ? "נכון מאוד!" : "כדאי לנסות לזכור את הכלל"}</strong>
                        <p>{check.explanation}</p>
                        <button type="button" onClick={() => clearAnswer(section.id)}>
                          <RotateCcw size={14} /> ניסיון נוסף
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
