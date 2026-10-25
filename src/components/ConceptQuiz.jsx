import React, { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

// Create questions from the lesson's existing concepts.
function createQuestions(concepts) {
    return concepts.map((concept, index) => {
        const otherTerms = concepts
            .filter((_, i) => i !== index)
            .map(item => item.term);

        // Shuffle incorrect options.
        const shuffled = [...otherTerms].sort(() => Math.random() - 0.5);

        // Add the correct term and shuffle all options.
        const options = [
            concept.term,
            ...shuffled.slice(0, 3)
        ].sort(() => Math.random() - 0.5);

        return {
            id: index,
            question: concept.definition,
            answer: concept.term,
            options
        };
    });
}

export default function ConceptQuiz({ concepts = [] }) {
    const questions = useMemo(
        () => createQuestions(concepts),
        [concepts]
    );

    const [answers, setAnswers] = useState({});

    function selectAnswer(questionId, answer) {
        // Lock each question after the first answer.
        if (answers[questionId] !== undefined) return;

        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    }

    const score = questions.filter(
        q => answers[q.id] === q.answer
    ).length;

    if (concepts.length < 2) {
        return <p>אין מספיק מושגים ליצירת תרגול.</p>;
    }

    return (
        <div className="quiz-section" dir="rtl">
            <h2>תרגול מושגים</h2>
            <p>
                קראי את ההגדרה ובחרי את המושג המתאים.
            </p>

            {questions.map((q, index) => {
                const selected = answers[q.id];
                const answered = selected !== undefined;

                return (
                    <article
                        key={q.id}
                        className="study-card quiz-card"
                    >
                        <div className="eyebrow">
                            שאלה {index + 1} מתוך {questions.length}
                        </div>

                        <h2>{q.question}</h2>

                        <div className="options-list">
                            {q.options.map((option, i) => {
                                const isCorrect = option === q.answer;
                                const isSelected = selected === option;

                                let optionClass = "quiz-option";

                                if (isSelected) {
                                    optionClass += " chosen";
                                }

                                if (answered) {
                                    if (isCorrect) {
                                        optionClass += " answer-correct";
                                    } else if (isSelected) {
                                        optionClass += " answer-wrong";
                                    }
                                }

                                return (
                                    <label
                                        key={option}
                                        className={optionClass}
                                    >
                                        <input
                                            type="radio"
                                            name={`concept-${q.id}`}
                                            checked={isSelected}
                                            disabled={answered}
                                            onChange={() =>
                                                selectAnswer(q.id, option)
                                            }
                                        />

                                        <span dir="auto">
                                            {String.fromCharCode(1488 + i)}. {option}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>

                        {answered && (
                            <div
                                className={
                                    "quiz-feedback " +
                                    (selected === q.answer ? "correct" : "")
                                }
                            >
                                <strong>
                                    {selected === q.answer
                                        ? "✓ תשובה נכונה!"
                                        : "✗ תשובה לא נכונה"}
                                </strong>

                                <p>
                                    המושג הנכון: <strong dir="auto">{q.answer}</strong>
                                </p>
                            </div>
                        )}
                    </article>
                );
            })}

            <div className="quiz-actions">
                <button
                    className="outline-button"
                    onClick={() => setAnswers({})}
                >
                    <RotateCcw size={16} />
                    להתחיל מחדש
                </button>

                <strong>
                    {/* <CheckCircle2 size={16} /> */}
                    תשובות נכונות: {score} מתוך {questions.length}
                </strong>
            </div>
        </div>
    );
}
