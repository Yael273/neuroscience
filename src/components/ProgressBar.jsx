
import React from "react";

export default function ProgressBar({
    percent = 0,
    completed = 0,
    total = 0
}) {
    const safePercent = Math.max(0, Math.min(100, percent));

    return (
        <div className="study-progress" dir="rtl">
            <div className="study-progress-label">
                {/* <strong>התקדמות בלמידה </strong> */}
                <span>
                    {completed} מתוך {total} שיעורים הושלמו · {safePercent}%
                </span>
            </div>

            <div
                className="study-progress-track"
                role="progressbar"
                aria-label="התקדמות בלמידה"
                aria-valuenow={safePercent}
                aria-valuemin={0}
                aria-valuemax={100}
            >

                <div
                    className="study-progress-fill"
                    style={{ width: `${safePercent}%` }}
                />
            </div>
        </div>
    );
}
