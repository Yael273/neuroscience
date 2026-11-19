import React from "react";
import "../styles/repetitive-dna-hierarchy.css";

// A real React/CSS teaching view — the only visuals are direction arrows.
const tandemGroups = [
  {
    name: "Satellites",
    description: <>אזורים חוזרים ארוכים מאוד, בהיקף של כ־<bdi>100 kb</bdi> ועד יותר מ־<bdi>1 Mb</bdi>. בדוגמת המצגת יחידת החזרה היא באורך <bdi>171 bp</bdi>.</>,
  },
  {
    name: "Minisatellites / VNTR",
    description: <>רצפים חוזרים שיחידת החזרה שלהם היא בדרך כלל <bdi>9–80 bp</bdi>, והאזור כולו עשוי להיות באורך <bdi>1–20 kb</bdi>. מספר החזרות עשוי להשתנות בין פרטים.</>,
  },
  {
    name: "Microsatellites / SSR / STR",
    description: <>יחידות חזרה קצרות בנות <bdi>1–6 bp</bdi>, כגון CA. ההבדלים במספר החזרות יוצרים אללים באורכים שונים.</>,
  },
  {
    name: "Telomeres — דוגמה",
    description: <>קצות הכרומוזומים מכילים רצפי DNA חוזרים בטנדם. במצגת מופיע המוטיב <bdi>GGGTTA</bdi> (בכיוון ההפוך למוסכמה הנפוצה <bdi>5′-TTAGGG-3′</bdi>). זהו <strong>יישום/דוגמה</strong>, ולא דרגת גודל נוספת.</>,
  },
];

function DirectionArrows({ inverted = false }) {
  const count = inverted ? 2 : 4;
  return (
    <div className="rdna-arrows" role="img" aria-label={inverted ? "שני חצים בכיוונים מנוגדים" : "ארבעה חצים בכיוון זהה"} dir="ltr">
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} className={`rdna-arrow ${inverted && i === 1 ? "rdna-arrow--reverse" : ""}`} viewBox="0 0 96 58" aria-hidden="true">
          <path d="M3 17 H57 V3 L92 29 L57 55 V41 H3 Z" fill="#f04b52" stroke="#194c76" strokeWidth="3" strokeLinejoin="round"/>
        </svg>
      ))}
    </div>
  );
}

export default function RepetitiveDNAHierarchy() {
  return (
    <div className="rdna" dir="rtl">
      <header className="rdna-banner"><h3>Repetitive DNA / DNA חזרתי</h3></header>
      <div className="rdna-panel rdna-panel--tandem">
        <div className="rdna-mainhead">
          <div className="rdna-maintext">
            <h4>Tandem repeats</h4>
            <p>יחידות DNA החוזרות זו אחר זו <strong>באותו כיוון</strong>, כמו חוליות בשרשרת.</p>
          </div>
          <div className="rdna-graphic"><DirectionArrows /></div>
        </div>
        <div className="rdna-subgroup">
          <div className="rdna-subitems">
            {tandemGroups.map((group) => (
              <div className="rdna-subitem" key={group.name}>
                <div className="rdna-subtitle"><span className="rdna-helix" aria-hidden="true">⌁</span><h5 dir="ltr">{group.name}</h5></div>
                <p>{group.description}</p>
              </div>
            ))}
          </div>
          <aside className="rdna-subgroup-label"><span>תתי־סוגים</span><small>של חזרות טנדם</small></aside>
        </div>
      </div>
      <div className="rdna-panel rdna-panel--inverted">
        <div className="rdna-mainhead">
          <div className="rdna-maintext">
            <h4>Inverted repeats</h4>
            <p>רצפים חוזרים הנמצאים <strong>באוריינטציות מנוגדות</strong> זה ביחס לזה, ולא באותו כיוון.</p>
          </div>
          <div className="rdna-graphic"><DirectionArrows inverted /></div>
        </div>
      </div>
    </div>
  );
}
