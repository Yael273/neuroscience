import React from 'react';
import { ArrowLeft, BookText, Clock3, CircleHelp } from 'lucide-react';
import { CheckCircle2 } from "lucide-react";
export default function ChapterCard({ chapter, index, onOpen, featured, completed = false }) {
    return <article id={'chapter-' + chapter.id} className={'chapter-card ' + (featured ? 'featured' : '')}>
        <div className="chapter-main">
            <span className="chapter-number">
                {String(index + 1).padStart(2, '0')}
            </span>

            <div className="chapter-info">
                <h3>{chapter.name}</h3>

                <p>{chapter.description}</p>
                <div className="chapter-meta">
                    <span>
                        <BookText size={13} />
                        {chapter.lessons} שיעורים
                    </span>
                    <span>
                        <Clock3 size={13} /> שעה ו{chapter.duration} דק׳</span>
                    <span>
                        <CircleHelp size={13} /> שאלון תרגול
                    </span>

                    <div className={
                        "chapter-completion " +
                        (completed ? "is-completed" : "is-pending")
                    }>
                        <CheckCircle2 size={15} />
                        <span>
                            {completed ? "הושלם" : "טרם הושלם"}
                        </span>
                    </div>


                </div>
            </div>
        </div>

        <button className="outline-button" onClick={() => onOpen(chapter)}>לצפייה בפרק <ArrowLeft size={16} /></button>
    </article>
}
