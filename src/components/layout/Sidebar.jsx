
import React, { useEffect, useState } from "react";
import {
    BookOpen,
    Bookmark,
    BookmarkCheck,
    ChevronDown
} from "lucide-react";

import "../../styles/sidebar-topics.css";
import { subjects } from "../../data/syllabus";

export default function Sidebar({
    activeId,
    onChange,
    studyProgress,
    activeChapterId,
    onChapterChange,
    activeLesson,
    savedTopicIds = [],
    onTopicNavigate,
    onTopicBookmark,
    activeTopicId,
}) {
    const current = subjects.find(s => s.id === activeId);

    // Allows manually closing the currently selected lesson.
    const [closedLessonId, setClosedLessonId] = useState(null);

    // Open the topic list automatically when switching lessons.
    useEffect(() => {
        setClosedLessonId(null);
    }, [activeLesson?.id]);

    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-line">
                    <span className="brand-icon">
                        <BookOpen size={20} />
                    </span>

                    <strong>
                        סילבוס<span className="brand-dot">.</span>
                    </strong>
                </div>

                <p>כל החומר שצריך כדי להתכונן למבחן.</p>
            </div>

            <nav aria-label="מקצועות">
                <div className="sidebar-label">
                    כל המקצועות
                </div>

                <div className="subjects-menu">
                    {subjects.map(s => {
                        const lessonIds = s.chapters.flatMap(
                            chapter => chapter.lessonIds || []
                        );

                        const progress = studyProgress.getProgress(lessonIds);

                        return (
                            <button
                                key={s.id}
                                type="button"
                                className={
                                    "subject-nav " +
                                    (s.id === activeId ? "active" : "")
                                }
                                onClick={() => onChange(s.id)}
                                aria-current={
                                    s.id === activeId ? "page" : undefined
                                }
                            >
                                <div className="subject-top">
                                    <span
                                        className="subject-symbol"
                                        style={{
                                            background: s.soft,
                                            color: s.color
                                        }}
                                    >
                                        {s.symbol}
                                    </span>

                                    <strong>{s.name}</strong>

                                    <span className="nav-progress">
                                        {progress.percent}%
                                    </span>
                                </div>

                                <div className="progress-track">
                                    <span
                                        style={{
                                            width: `${progress.percent}%`,
                                            background: s.color
                                        }}
                                    />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </nav>

            {current && (
                <div className="chapter-nav">
                    <div className="sidebar-label">
                        פרקים ב{current.name}
                    </div>

                    {current.chapters.map(ch => {
                        const isSelected = Boolean(
                            activeLesson &&
                            ch.id === activeChapterId &&
                            ch.lessonIds?.includes(activeLesson.id)
                        );

                        const isOpen =
                            isSelected &&
                            closedLessonId !== activeLesson?.id;

                        return (
                            <div
                                className="sidebar-chapter-group"
                                key={ch.id}
                            >
                                <div
                                    className={
                                        "chapter-link " +
                                        (isSelected ? "current" : "")
                                    }
                                >
                                    <button
                                        type="button"
                                        className="sidebar-chapter-name"
                                        onClick={() => onChapterChange(ch.id)}
                                    >
                                        <span className="nav-dot" />
                                        <span>{ch.name}</span>
                                    </button>

                                    {isSelected && (
                                        <button
                                            type="button"
                                            className="lesson-toggle"
                                            aria-expanded={isOpen}
                                            aria-controls={`topics-${ch.id}`}
                                            aria-label={
                                                isOpen
                                                    ? `סגירת נושאי ${ch.name}`
                                                    : `פתיחת נושאי ${ch.name}`
                                            }
                                            onClick={() => {
                                                setClosedLessonId(previous =>
                                                    previous === activeLesson.id
                                                        ? null
                                                        : activeLesson.id
                                                );
                                            }}
                                        >
                                            <ChevronDown
                                                size={16}
                                                className={
                                                    isOpen ? "" : "is-closed"
                                                }
                                            />
                                        </button>
                                    )}
                                </div>

                                {isSelected && (
                                    <div
                                        id={`topics-${ch.id}`}
                                        className={
                                            "sidebar-topics-panel " +
                                            (isOpen ? "open" : "closed")
                                        }
                                        inert={!isOpen ? true : undefined}
                                        aria-hidden={!isOpen}
                                    >
                                        <div
                                            className="sidebar-topics"
                                            aria-label={`נושאי ${activeLesson.title}`}
                                        >
                                            {(activeLesson.sections || []).map(section => {
                                                const bookmarked =
                                                    savedTopicIds.includes(section.id);

                                                return (
                                                    <div
                                                        className="sidebar-topic"
                                                        key={section.id}
                                                    >
                                                        <button
                                                            type="button"
                                                            className={
                                                                "sidebar-topic-link" +
                                                                (activeTopicId === section.id ? " active" : "")
                                                            }
                                                            aria-current={
                                                                activeTopicId === section.id ? "location" : undefined
                                                            }
                                                            onClick={() =>
                                                                onTopicNavigate(section.id)
                                                            }
                                                            title={section.title}
                                                        >
                                                            {section.title}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className={
                                                                "sidebar-topic-bookmark" +
                                                                (bookmarked ? " saved" : "")
                                                            }
                                                            onClick={() =>
                                                                onTopicBookmark(section.id)
                                                            }
                                                            title={
                                                                bookmarked
                                                                    ? "הסרת סימנייה"
                                                                    : "שמירה לחזרה"
                                                            }
                                                            aria-label={
                                                                `${bookmarked
                                                                    ? "הסרת סימנייה"
                                                                    : "שמירה לחזרה"
                                                                }: ${section.title}`
                                                            }
                                                            aria-pressed={bookmarked}
                                                        >
                                                            {bookmarked ? (
                                                                <BookmarkCheck size={15} />
                                                            ) : (
                                                                <Bookmark size={15} />
                                                            )}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </aside>
    );
}
