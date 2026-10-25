import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Search, X } from 'lucide-react';
import ProgressBar from "../components/ProgressBar";
import Hero from '../components/Hero'; import ChapterCard from '../components/ChapterCard';
export default function SyllabusPage({ subject, onLessonOpen, studyProgress, activeChapterId }) {
    const [query, setQuery] = useState(''); const [opened, setOpened] = useState(null); const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem('syllabus-completed') || '{}'));
    const filtered = subject.chapters.filter(ch => (ch.name + ' ' + ch.description + ' ' + ch.topics.join(' ')).includes(query.trim()));
    const mark = (id, i) => { const next = { ...completed, [id + ':' + i]: !completed[id + ':' + i] }; setCompleted(next); localStorage.setItem('syllabus-completed', JSON.stringify(next)); };
    const lessonIds = subject.chapters.flatMap(
        chapter => chapter.lessonIds || []
    );
    const progress = studyProgress.getProgress(lessonIds);
    return <main className="main-content">

        <div className="page-heading">
            <div className="heading-copy">
                <div className="eyebrow">הסילבוס המלא</div>
                <ProgressBar {...progress} />
                <h1>{subject.name}</h1>
                <p>{subject.subtitle}</p>
            </div>
            <label className="search-box">
                <Search size={18} />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder={subject.search} aria-label={subject.search} />
            </label>
        </div>
        <div className="top-rule" />{!query.trim() && <Hero
            subject={subject}
            onStart={() => {
                const firstChapter = subject.chapters[0];

                if (firstChapter) {
                    onLessonOpen(firstChapter);
                }
            }}
        />}
        <section className="chapters-section">
            <div className="section-header">
                <div>
                    <h2>מגלים את הסילבוס</h2>
                    <p>עוברים על כל הפרקים בקצב שלכם.</p>
                </div>
                <span>{filtered.length} פרקים</span>
            </div>
            <div className="chapters-list">
                {filtered.map((chapter, index) => (
                    <ChapterCard
                        key={chapter.id}
                        chapter={chapter}
                        index={subject.chapters.indexOf(chapter)}
                        featured={chapter.id === activeChapterId}
                        onOpen={onLessonOpen}
                        completed={
                            (chapter.lessonIds?.length || 0) > 0 &&
                            chapter.lessonIds.every(id =>
                                studyProgress.data.completedLessonIds.includes(id)
                            )
                        }
                    />
                ))}
            </div>
        </section>
        <footer className="footer">
            <strong>
                <span className="footer-logo">
                    ▯
                </span> סילבוס.</strong>
            <span>חומרי לימוד פתוחים לכל תלמיד ותלמידה.</span>
        </footer>
        {opened && <div className="dialog-backdrop" onClick={() => setOpened(null)}>
            <div className="chapter-dialog" role="dialog" aria-modal="true" aria-label={opened.name} onClick={e => e.stopPropagation()}>
                <button className="close-dialog" onClick={() => setOpened(null)} aria-label="סגירה"><X size={20} />
                </button>
                <span className="eyebrow">{subject.name} / פרק לימוד</span>
                <h2>{opened.name}</h2>
                <p>{opened.description}</p>
                <h3>השיעורים בפרק</h3>
                <div className="lesson-list">
                    {opened.topics.map((topic, i) => <button key={topic} onClick={() => mark(opened.id, i)} className={'lesson ' + (completed[opened.id + ':' + i] ? 'done' : '')}>
                        <CheckCircle2 size={20} />
                        <span>{i + 1}. {topic}</span>
                        <small>{completed[opened.id + ':' + i] ? 'הושלם' : 'סימון כהושלם'}</small>
                    </button>)}
                </div>
                <button className="back-button" onClick={() => setOpened(null)}>
                    <ArrowRight size={16} />
                    בחזרה לסילבוס
                </button>
            </div>
        </div>}
    </main>;
}
