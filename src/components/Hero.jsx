import React from 'react';
import { Play } from 'lucide-react';
export default function Hero({ subject, onStart }) {
    return <section className="hero">
        <div className="hero-body">
            <div className="hero-pills">
                <span>{subject.chapters.length} פרקים</span>
                <span>{subject.chapters.reduce((n, c) => n + c.lessons, 0)} שיעורים</span>
            </div>
            <h2>מתחילים עם {subject.chapters[0].name}</h2>
            <p>הסברים ברורים, דוגמאות פתורות ובדיקות קצרות שמתאימות לכל דרישות הבחינה.</p>
            <button className="start-button" onClick={onStart}>
                <Play size={14} fill="currentColor" /> התחלת השיעור הראשון</button>
        </div>
        <div className="hero-image" aria-hidden="true">
            {subject.symbol}

        </div>
    </section>
}
