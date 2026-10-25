import React, { useState } from "react";
import { Bookmark, BookmarkCheck, ListTree } from "lucide-react";

export default function LessonNavigation({ sections, activeId, savedIds, onNavigate, onToggleBookmark }) {
  const [savedOnly, setSavedOnly] = useState(false);
  const displayed = savedOnly ? sections.filter(s => savedIds.includes(s.id)) : sections;

  return (
    <nav className="lesson-section-nav" aria-label="ניווט בנושאי השיעור" dir="rtl">
      <div className="lesson-section-nav-header">
        <strong><ListTree size={19} /> תוכן השיעור</strong>
        <button type="button" className={savedOnly ? "nav-filter selected" : "nav-filter"}
          aria-pressed={savedOnly} onClick={() => setSavedOnly(v => !v)}>
          <Bookmark size={15} /> {savedOnly ? "הצגת כל הנושאים" : `לחזרה (${savedIds.length})`}
        </button>
      </div>
      {displayed.length ? (
        <div className="lesson-section-nav-list">
          {displayed.map((section) => (
            <div className={activeId === section.id ? "lesson-nav-entry active" : "lesson-nav-entry"} key={section.id}>
              <button type="button" className="lesson-nav-jump" aria-current={activeId === section.id ? "location" : undefined}
                onClick={() => onNavigate(section.id)}>{section.title}</button>
              <button type="button" className="lesson-nav-save"
                aria-label={`${savedIds.includes(section.id) ? "הסרת" : "שמירת"} ${section.title} לחזרה`}
                aria-pressed={savedIds.includes(section.id)} onClick={() => onToggleBookmark(section.id)}>
                {savedIds.includes(section.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              </button>
            </div>
          ))}
        </div>
      ) : <p className="lesson-section-nav-empty">עדיין לא שמרת נושאים לחזרה. לחצי על סמל הסימנייה ליד נושא.</p>}
    </nav>
  );
}
