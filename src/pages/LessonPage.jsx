import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, RotateCcw } from 'lucide-react';
import neuroLesson from "../data/lessons/lesson1.json";
import compLecture from "../data/lessons/compcog-lecture01.json";
import compTutorial from "../data/lessons/compcog-tutorial01.json";
import ConceptQuiz from "../components/ConceptQuiz";
import neuroLesson2 from "../data/lessons/neuro-lesson02.json";
import InteractiveSummary from "../components/InteractiveSummary";
import neuropathologyIntro from "../data/lessons/neuropathology-lecture01.json";
import geneticsLecture from '../data/lessons/genetics-lecture01.json';
import geneticsTutorial from "../data/lessons/genetics-tutorial01.json";
import molecularLecture from "../data/lessons/molecular-neurobiology-lecture01.json";
import molecularLecture2 from "../data/lessons/molecular-neurobiology-lecture02.json";
import "../styles/interactive-summary.css";


const lessonMap = {
  [neuroLesson.id]: neuroLesson,
  [compLecture.id]: compLecture,
  [compTutorial.id]: compTutorial,
  [neuroLesson2.id]: neuroLesson2,
  [neuropathologyIntro.id]: neuropathologyIntro,
  [geneticsLecture.id]: geneticsLecture,
  [geneticsTutorial.id]: geneticsTutorial,
  [molecularLecture.id]: molecularLecture,
  [molecularLecture2.id]: molecularLecture2,
};

export default function LessonPage({
  onBack, studyProgress, lessonId, subjectName,
  topicRequest, savedTopicIds, onTopicBookmark, onActiveTopicChange
}) {
  const [tab, setTab] = useState('summary');
  useEffect(() => {
    if (topicRequest?.topicId) setTab('summary');
  }, [topicRequest]);
  const [responses, setResponses] = useState({});
  const [submittedMultiple, setSubmittedMultiple] = useState({});
  const lesson = lessonMap[lessonId] || neuroLesson;

  const score = useMemo(() => {
    return lesson.quiz.reduce((n, q) => {
      if (!q.correctAnswers) return n;

      // Multiple-answer questions count only after submission.
      if (
        q.type === "multiple" &&
        !submittedMultiple[q.id]
      ) {
        return n;
      }

      const selected = responses[q.id] || [];

      // Unanswered questions should not receive points.
      if (selected.length === 0) return n;

      const selectedSorted = [...selected].sort((a, b) => a - b);
      const correctSorted = [...q.correctAnswers].sort((a, b) => a - b);

      const isCorrect =
        JSON.stringify(selectedSorted) ===
        JSON.stringify(correctSorted);

      return n + (isCorrect ? 1 : 0);
    }, 0);
  }, [lesson, responses, submittedMultiple]);


  const graded = lesson.quiz.filter(q => q.correctAnswers).length;



  function choose(q, i) {
    setResponses(prev => ({
      ...prev,
      [q.id]: q.type === "multiple"
        ? (prev[q.id] || []).includes(i)
          ? prev[q.id].filter(x => x !== i)
          : [...(prev[q.id] || []), i]
        : [i]
    }));

    // Require resubmission if a multiple-choice answer changes.
    if (q.type === "multiple") {
      setSubmittedMultiple(prev => ({
        ...prev,
        [q.id]: false
      }));
    }
  }


  return (
    <main className="main-content lesson-page">
      <button className="outline-button" onClick={onBack}>
        <ArrowRight size={16} /> חזרה לסילבוס
      </button>

      <div className="lesson-heading">
        <div className="eyebrow">
          {subjectName} · {lesson.type === "tutorial" ? "תרגול" : "הרצאה"}
        </div>
        <h1>{lesson.title}</h1>
        <p>{lesson.description}</p>
        {lesson.lecturer && (
          <small>{lesson.lecturer}</small>
        )}

        <section className="lesson-tracking" dir="rtl">
          <button
            type="button"
            className={
              studyProgress.data.completedLessonIds.includes(lesson.id)
                ? "start-button completed-button"
                : "outline-button"
            }
            onClick={() => {
              const isCompleted =
                studyProgress.data.completedLessonIds.includes(lesson.id);

              studyProgress.setLessonCompleted(
                lesson.id,
                !isCompleted
              );
            }}
          >
            <CheckCircle2 size={17} />

            {studyProgress.data.completedLessonIds.includes(lesson.id)
              ? "השיעור הושלם ✓"
              : "סימון השיעור כהושלם"}
          </button>
        </section>
      </div>



      <div className="lesson-tabs" role="tablist" aria-label="תוכן השיעור">
        {[
          ['summary', 'סיכום השיעור'],
          ['concepts', 'מושגים'],
          ['conceptPractice', 'תרגול מושגים'],
          ['quiz', 'שאלון תרגול'],
        ].map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            className={tab === id ? 'active' : ''}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>


      {tab === "summary" && (
        <InteractiveSummary
          sections={lesson.sections}
          lessonId={lesson.id}
          topicRequest={topicRequest}
          savedTopicIds={savedTopicIds}
          onTopicBookmark={onTopicBookmark}
          onActiveTopicChange={onActiveTopicChange}
        />
      )}


      {tab === 'concepts' && (
        <div className="study-cards">
          {lesson.concepts.map(c => (
            <article key={c.term} className="study-card">
              <h2 dir="right">{c.term}</h2>
              <p>{c.definition}</p>
            </article>
          ))}
        </div>
      )}

      {tab === "conceptPractice" && (
        <ConceptQuiz
          key={lesson.id}
          concepts={lesson.concepts}
        />
      )}

      {tab === 'quiz' && (
        <div className="quiz-section">
          {lesson.quizAnswerNote && (
            <p className="quiz-notice">
              {lesson.quizAnswerNote}
            </p>
          )}

          {lesson.quiz.map((q, index) => {
            const chosen = responses[q.id] || [];
            const correct = !!q.correctAnswers &&
              JSON.stringify([...chosen].sort((a, b) => a - b)) ===
              JSON.stringify([...q.correctAnswers].sort((a, b) => a - b));
            const showFeedback = q.type === "multiple"
              ? !!submittedMultiple[q.id]
              : chosen.length > 0;

            return (
              <article className="study-card quiz-card" key={q.id}>
                <div className="eyebrow">
                  שאלה {index + 1} מתוך {lesson.quiz.length} · {q.type === 'multiple' ? 'בחירה מרובה' : 'בחירה יחידה'}
                </div>
                <h2>{q.question}</h2>
                {q.image && (
                  <img
                    className="quiz-figure"
                    src={q.image}
                    alt="איור מתוך צילום שאלת הבוחן: MSP ביחס לנפח המוח"
                  />
                )}

                <div className="options-list">
                  {q.options.map((option, i) => {
                    const isChosen = chosen.includes(i);
                    const hasAnswer = showFeedback;
                    const isCorrectAnswer = q.correctAnswers?.includes(i);

                    let optionClass = "quiz-option";

                    if (isChosen) {
                      optionClass += " chosen";
                    }

                    if (hasAnswer && q.correctAnswers) {
                      if (isCorrectAnswer) {
                        optionClass += " answer-correct";
                      } else if (isChosen) {
                        optionClass += " answer-wrong";
                      }
                    }

                    return (
                      <label key={i} className={optionClass}>
                        <input
                          type={q.type === "multiple" ? "checkbox" : "radio"}
                          name={q.id}
                          checked={isChosen}
                          onChange={() => choose(q, i)}
                          disabled={showFeedback}
                        />

                        <span>
                          {String.fromCharCode(1488 + i)}. {option}
                        </span>
                      </label>
                    );
                  })}
                </div>


                {q.type === "multiple" && !submittedMultiple[q.id] && (
                  <button
                    type="button"
                    className="start-button"
                    style={{ marginTop: "12px" }}
                    disabled={chosen.length === 0}
                    onClick={() => {
                      setSubmittedMultiple(prev => ({
                        ...prev,
                        [q.id]: true
                      }));
                    }}
                  >
                    <CheckCircle2 size={17} />
                    הגשת תשובה
                  </button>
                )}



                {showFeedback && (
                  <div
                    className={
                      "quiz-feedback " +
                      (correct ? "correct" : "")
                    }
                  >
                    {!q.correctAnswers ? (
                      <strong>לא קיים מפתח תשובות מאומת לשאלה זו</strong>
                    ) : correct ? (
                      <strong>✓ תשובה נכונה!</strong>
                    ) : (
                      <>
                        <strong>✗ תשובה לא נכונה</strong>

                        <p>
                          התשובה הנכונה:{" "}
                          {q.correctAnswers
                            .map(i => q.options[i])
                            .join(" / ")}
                        </p>
                      </>
                    )}

                    <p>{q.explanation}</p>
                    <small>מקור: {q.source}</small>
                  </div>
                )}

              </article>
            );
          })}


          <div className="quiz-actions">
            <button
              className="outline-button"
              onClick={() => {
                setResponses({});
                setSubmittedMultiple({});
              }}
            >
              <RotateCcw size={16} />
              להתחיל מחדש
            </button>

            <strong>
              תשובות נכונות: {score} מתוך {graded}
            </strong>
          </div>

        </div>
      )}
    </main>
  );
}
