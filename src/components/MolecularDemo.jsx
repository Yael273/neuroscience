import React from "react";
import "../styles/molecular-demo.css";

/**
 * Animated, schematic molecular neuroscience demonstrations.
 * The component is intentionally data-driven: {type:'molecular-animation', scene, phase}.
 * CSS animations restart when ProcessFlow remounts the active step on replay.
 * Illustrations are simplified teaching models, NOT measured experimental data.
 */
export default function MolecularDemo({ visual }) {
  const scene = visual?.scene || "growth-cone";
  const phase = Math.max(0, Number(visual?.phase) || 0);
  const is = (name) => scene === name;
  const Text = ({ x, y, children, color = "#365568", size = 17, anchor = "middle" }) => (
    <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={size} fontWeight="600">{children}</text>
  );
  const cue = (x, y, positive = true) => <g key={`${x}-${y}`} className="mol-cue"><circle cx={x} cy={y} r="11" fill={positive ? "#def5ed" : "#ffe5dc"} stroke={positive ? "#28a47d" : "#db8069"} strokeWidth="2" /><Text x={x} y={y + 5} size={19} color={positive ? "#138a6a" : "#c3644a"}>{positive ? "+" : "−"}</Text></g>;
  const cargo = (x, y, color = "#9a6eca", klass = "mol-cargo") => <g className={klass} key={`${x}-${y}`}><circle cx={x} cy={y} r="18" fill={color} stroke="#69418e" strokeWidth="2" /><circle cx={x - 5} cy={y - 5} r="5" fill="#fff" opacity="0.55" /></g>;
  const motorTrack = <><line x1="85" y1="140" x2="595" y2="140" stroke="#449c8a" strokeWidth="10" strokeLinecap="round" /><g fill="#26826e">{Array.from({ length: 21 }, (_, i) => <circle key={i} cx={90 + i * 25} cy={140} r="3.5" />)}</g><Text x={95} y={176} size={15}>סומה (−)</Text><Text x={585} y={176} size={15}>טרמינל (+)</Text></>;
  const growth = (state) => <g>
    <path d="M68 128 L284 128" stroke="#63a6b0" strokeWidth="36" strokeLinecap="round" fill="none" />
    <path d="M250 130 Q310 67 405 103 Q458 115 498 100 Q466 129 510 148 Q451 157 400 171 Q318 181 250 130 Z" fill="#e7f5f4" stroke="#95c5c0" strokeWidth="2" />
    {[-55, -35, -10, 20, 45].map((dy, i) => <line key={i} className="mol-filopodium" x1="430" y1={134 + dy * .43} x2={530 + (i % 2) * 35} y2={134 + dy * 1.95} stroke="#dc6681" strokeWidth="5" strokeLinecap="round" style={{ animationDelay: `${i * .15}s` }} />)}
    {[-20, -8, 8, 20].map((dy, i) => <line key={i} className="mol-actin" x1="320" y1={132 + dy} x2="455" y2={132 + dy * 1.75} stroke="#ed8ca2" strokeDasharray="9 7" strokeWidth="3" />)}
    {[0, 1, 2].map((i) => <path key={i} className={state >= 2 ? "mol-mt-grow" : "mol-mt"} d={`M85 ${118 + i * 10} Q275 ${119 + i * 5} ${state >= 2 ? 510 : 390} ${125 + i * 8}`} stroke="#39a87c" strokeWidth="6" strokeLinecap="round" fill="none" />)}
    <Text x={120} y={81}>אקסון</Text><Text x={423} y={50}>חרוט גדילה</Text>
    {state === 3 && <path className="mol-route" d="M506 128 Q554 115 607 92" fill="none" stroke="#25a583" strokeWidth="5" strokeDasharray="10 9" />}
  </g>;
  const soma = <><circle cx="150" cy="127" r="49" fill="#d9eafa" stroke="#76a0cf" strokeWidth="3" /><circle cx="150" cy="127" r="18" fill="#93aad0" /><Text x={150} y={205}>סומה</Text></>;
  const nerve = <><path d="M195 125 L595 125" stroke="#cce9e7" strokeWidth="34" strokeLinecap="round" /><path d="M195 125 L595 125" stroke="#449c8a" strokeWidth="4" strokeDasharray="12 5" />{soma}</>;
  const line = (x1, y1, x2, y2, col = "#bf8ec7", w = 3) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth={w} strokeLinecap="round" />;

  return (
    <div className="molecular-demo" dir="rtl" role="img" aria-label={visual?.caption || `המחשה מונפשת: ${scene}`}>
      {visual?.caption && <div className="molecular-demo-caption">{visual.caption}</div>}
      <svg viewBox="0 0 680 250" className="molecular-demo-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="mol-arrow-green" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="#269c7a" /></marker>
          <marker id="mol-arrow-orange" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="#d2824b" /></marker>
          <linearGradient id="mol-spine-grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#9ddfc9" /><stop offset="1" stopColor="#d7b6ef" /></linearGradient>
        </defs>
        {is('neurite-development') && <g>
          {soma}
          <g stroke="#6f9ed1" strokeWidth="11" strokeLinecap="round" fill="none">
            {phase >= 1 && <><path className="mol-draw" d="M145 79 Q120 55 105 40" /><path className="mol-draw" d="M195 130 L265 105" /><path className="mol-draw" d="M130 169 L107 205" /><path className="mol-draw" d="M165 170 L178 206" /></>}
            {phase >= 2 && <path className="mol-draw" d="M195 132 Q300 153 435 147 Q510 146 591 128" stroke="#2da880" strokeWidth="13" />}
            {phase >= 3 && <><path className="mol-draw" d="M105 40 L74 21 M105 40 L86 56 M107 205 L77 225 M178 206 L204 229" strokeWidth="6" /></>}
            {phase >= 4 && <><path className="mol-draw" d="M265 105 L280 74 M265 105 L298 114 M75 20 L48 35 M203 228 L226 217" strokeWidth="5" /></>}
          </g>
          {phase >= 2 && <Text x={482} y={110} color="#228969">אקסון</Text>}
          {phase === 0 && <g className="mol-grow-dot"><circle cx="150" cy="70" r="64" stroke="#94c7d1" strokeWidth="2" strokeDasharray="5 7" fill="none" /></g>}
          <Text x={405} y={221}>{['התפשטות ראשונית', 'כמה שלוחות קצרות', 'אקסון אחד מתארך', 'דנדריטים מתפצלים', 'נוירון בשל ומסועף'][Math.min(phase, 4)]}</Text>
        </g>}

        {is('growth-cone') && growth(phase)}

        {is('guidance') && <g>{growth(phase)}
          {cue(600, 76, true)} {cue(608, 119, true)} {cue(596, 164, false)}
          {phase >= 1 && <circle cx="495" cy="126" r="12" fill="#f6d57c" className="mol-pulse" />}
          {phase >= 2 && <path className="mol-route" d="M500 126 Q544 87 586 80" fill="none" stroke="#27a47a" strokeWidth="6" strokeDasharray="9 8" markerEnd="url(#mol-arrow-green)" />}
          <Text x={585} y={220}>{phase >= 2 ? 'שינוי כיוון לכיוון משיכה' : 'אותות בסביבה'}</Text>
        </g>}

        {is('slit-robo') && <g>
          <rect x="313" y="35" width="58" height="176" fill="#ffe5d5" rx="11" />
          <Text x={342} y={25} color="#ae7043">קו האמצע · Slit</Text>
          {[55, 100, 145, 190].map(y => cue(343, y, false))}
          <path d={phase >= 3 ? "M93 163 Q230 170 346 125 Q477 81 581 63" : phase >= 2 ? "M93 163 Q230 170 346 125 Q448 118 476 67" : phase >= 1 ? "M93 163 Q234 164 349 134 Q422 126 482 117" : "M93 163 Q209 165 257 165"} className="mol-draw" fill="none" stroke="#2c95be" strokeWidth="13" strokeLinecap="round" />
          <circle className="mol-move-dot" cx={phase >= 1 ? phase === 1 ? 455 : phase === 2 ? 476 : 580 : 255} cy={phase === 3 ? 63 : phase === 2 ? 67 : phase === 1 ? 117 : 165} r="16" fill="#45ad9a" stroke="#fff" strokeWidth="3" />
          {phase === 0 || phase === 1 ? <Text x={184} y={120}>Robo נמוך</Text> : <Text x={500} y={32}>Robo גבוה</Text>}
          <Text x={345} y={239}>{['Robo פחות זמין בממברנה', 'חצייה בתנאי דחייה מופחתת', 'הגברת תגובת Slit–Robo', 'התרחקות ומניעת חצייה חוזרת'][Math.min(phase, 3)]}</Text>
        </g>}

        {is('actin-dynamics') && <g>{growth(phase)}
          <path d="M505 182 Q414 192 333 169" className="mol-flow-back" stroke="#d46b8a" strokeWidth="4" strokeDasharray="6 8" markerEnd="url(#mol-arrow-orange)" fill="none" />
          {phase >= 2 && cue(587, 64, true)}
          <Text x={350} y={232}>{['הרכבה ופירוק של F-actin', 'זרימה לאחור של רשת האקטין', 'תגובה לאות סביבתי', 'התארכות מיקרוטובולים'][Math.min(phase, 3)]}</Text>
        </g>}

        {is('transport-motor') && <g>{motorTrack}
          {phase === 0 && <g>{cargo(178, 93, "#9d7ad9", "mol-stay-cargo")}{cargo(462, 93, "#7ac5c2", "mol-stay-cargo")}</g>}
          {phase === 1 && [160, 210, 260, 310, 360, 410].map(x => <rect key={x} x={x} y="120" width="18" height="20" rx="6" fill="#e6bd71" className="mol-pulse" />)}
          {phase === 2 || phase === 3 ? <g>{cargo(185, 95, "#a78bd9", "mol-transport-forward")}<Text x={330} y={65} color="#25946e">Kinesin → (+)</Text><path d="M220 90 L570 90" stroke="#2aa47f" strokeWidth="3" markerEnd="url(#mol-arrow-green)" /></g> : null}
          {phase === 4 && <g>{cargo(510, 95, "#d38ca9", "mol-transport-backward")}<Text x={340} y={64} color="#c16d68">Dynein → (−)</Text><path d="M500 90 L160 90" stroke="#ce7970" strokeWidth="3" markerEnd="url(#mol-arrow-orange)" /></g>}
          <Text x={340} y={229}>{phase === 4 ? 'רטרוגרדית: חזרה לסומה' : 'אנטרוגרדית: מסילה עם כיווניות מוגדרת'}</Text>
        </g>}

        {is('transport-speeds') && <g>
          {['Fast', 'Slow b', 'Slow a', 'Diffusion'].map((t, i) => <g key={i} opacity={i === phase ? 1 : .24}>
            <Text x={90} y={45 + i * 53} anchor="start" size={17}>{t}</Text>
            {line(240, 41 + i * 53, 600, 41 + i * 53, "#c7dedc", 6)}
            <circle cx="245" cy={41 + i * 53} r="12" fill={['#48ad88', '#aa8bc7', '#e2b178', '#aaa'][i]} className={`mol-lane-${i}`} />
            <Text x={620} y={47 + i * 53} size={13}>+</Text>
          </g>)}
        </g>}

        {is('ligation') && <g>
          <rect x="65" y="99" width="550" height="68" rx="34" fill="#e9f3f2" stroke="#97bdb6" strokeWidth="3" />
          {phase >= 1 && <rect className="mol-pulse" x="326" y="90" width="24" height="85" rx="6" fill="#c47c75" />}
          <Text x={150} y={75}>צד פרוקסימלי</Text><Text x={530} y={75}>צד דיסטלי</Text>
          {[0, 1, 2].map((i) => cargo(104 + i * 34, 132, "#9a80bd", phase >= 2 ? "mol-pile-left" : "mol-transport-forward"))}
          {[0, 1, 2].map((i) => cargo(562 - i * 34, 132, "#e7ac76", phase >= 3 ? "mol-pile-right" : "mol-transport-backward"))}
          {phase >= 2 && <Text x={245} y={207}>הצטברות אנטרוגרדית</Text>}
          {phase >= 3 && <Text x={475} y={236}>הצטברות רטרוגרדית</Text>}
          {phase === 0 && <Text x={340} y={220}>מטענים נעים לשני הכיוונים</Text>}
        </g>}

        {is('kymograph') && <g>
          <rect x="70" y="29" width="534" height="180" rx="11" fill="#f4f9fc" stroke="#c8dce3" />
          {phase <= 1 ? <g>{line(100, 110, 575, 110, "#a6c5c7", 7)}{[0, 1, 2].map(i => <g key={i} className={`mol-lane-${i}`}><circle cx={120 + i * 120} cy="110" r="14" fill={['#36a98c', '#ad83c5', '#e5b06c'][i]} /></g>)}</g> : <g>
            {line(115, 179, 565, 179, "#7499ab", 2)}{line(115, 180, 115, 48, "#7499ab", 2)}
            {[0, 1, 2].map(i => <path key={i} className="mol-kymo-line" d={`M${160 + i * 95} 178 L${220 + i * 95} 55`} stroke={['#2e9e86', '#a27fc8', '#da9e5c'][i]} strokeWidth="5" fill="none" style={{ animationDelay: `${i * .25}s` }} />)}
            {phase === 3 && <><path d="M205 180 L265 55" stroke="#276d89" strokeWidth="4" fill="none" /><Text x={475} y={52}>v = Δx / Δt</Text></>}
            <Text x={115} y={224} size={14}>זמן ↓ · מרחק →</Text>
          </g>}
        </g>}

        {is('pa-gfp') && <g>
          <rect x="100" y="104" width="486" height="52" rx="26" fill="#d7e9eb" />
          {phase >= 1 && <rect x="315" y="96" width="55" height="68" rx="24" fill="#a4edb1" opacity="0.5" className="mol-pulse" />}
          <g className={phase === 2 ? "mol-gfp-left" : phase === 3 ? "mol-gfp-no-shift" : ""}>
            {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={322 + i * 10} cy={120 + (i % 2) * 16} r="7" fill="#41bc77" opacity={phase === 0 ? .18 : .85} className={phase >= 1 ? "mol-pulse" : ""} />)}
          </g>
          <Text x={170} y={81}>פרוקסימלי ←</Text><Text x={525} y={81}>דיסטלי →</Text>
          <Text x={340} y={206}>{['סימון סגמנט אקסון', 'הפעלה פוטוכימית מקומית', 'ביקורת: הטיה רטרוגרדית', 'BFA: ירידה בהטיה'][Math.min(phase, 3)]}</Text>
        </g>}

        {is('axon-rings') && <g>
          <rect x="78" y="90" width="528" height="85" rx="36" fill="#ecf5f7" stroke="#a9cdd1" strokeWidth="2" />
          {[113, 176, 239, 302, 365, 428, 491, 554].map((x, i) => <ellipse key={x} cx={x} cy="132" rx="12" ry="42" fill="none" stroke="#db648f" strokeWidth="5" className={phase >= 1 ? "mol-ring-appear" : ""} style={{ animationDelay: `${i * .12}s` }} />)}
          {phase >= 2 && [145, 208, 271, 334, 397, 460, 523].map((x, i) => <g key={x} className="mol-ring-appear" style={{ animationDelay: `${i * .1}s` }}>{line(x, 94, x + 20, 94, "#b494c9", 4)}{line(x, 168, x + 20, 168, "#b494c9", 4)}</g>)}
          {phase === 0 || phase === 3 ? <g>{[110, 135, 160].map(y => <line key={y} x1="100" y1={y} x2="586" y2={y} stroke="#37a281" strokeWidth="6" strokeLinecap="round" />)}</g> : null}
          <Text x={340} y={223}>{['מיקרוטובולים פנימיים', 'טבעות אקטין מחזוריות', 'Spectrin מקשר בין טבעות', 'שלד תא רב־שכבתי'][Math.min(phase, 3)]}</Text>
        </g>}

        {is('synapse') && <g>
          <path d="M75 96 L345 96 Q405 100 434 143 L526 143" fill="none" stroke="#83b5bd" strokeWidth="47" strokeLinecap="round" />
          <path d="M75 96 L348 96" fill="none" stroke="#3bb08b" strokeWidth="6" strokeDasharray="14 5" />
          <path d="M434 189 Q475 177 526 189" stroke="#d09dbb" strokeWidth="26" fill="none" strokeLinecap="round" />
          {[0, 1, 2, 3].map(i => cargo(330 + i * 30, phase >= 2 ? 143 : 112, "#e6b66f", phase >= 1 ? "mol-syn-vesicle" : "mol-stay-cargo"))}
          {phase >= 2 && [390, 417, 446, 480, 513].map((x, i) => <path key={i} d={`M${x} ${160 + i % 2 * 9} l12 8 l-10 9`} fill="none" stroke="#d67191" strokeWidth="3" />)}
          <Text x={155} y={49}>אקסון</Text><Text x={488} y={237}>פוסט־סינפסה</Text>
          {phase === 3 && <Text x={478} y={61}>ארגון סינפטי מקומי</Text>}
        </g>}

        {is('ltp-spine') && <g>
          <rect x="50" y="177" width="580" height="40" rx="17" fill="#a2cfcb" />
          <path className={phase >= 2 ? "mol-spine-expand" : "mol-spine-baseline"} d="M322 182 L322 143 Q277 124 284 95 Q288 59 343 59 Q397 59 403 95 Q406 124 363 143 L363 182Z" fill="url(#mol-spine-grad)" stroke="#8a9ac0" strokeWidth="3" />
          {phase >= 1 && <circle cx={343} cy={103} r="31" fill="#b4dcff" className="mol-pulse" opacity="0.7" />}
          {phase >= 2 && [0, 1, 2, 3, 4, 5].map(i => <line key={i} x1={310 + i * 12} y1="100" x2={300 + i * 14} y2="74" stroke="#d35f83" strokeWidth="4" className="mol-ring-appear" style={{ animationDelay: `${i * .15}s` }} />)}
          {phase >= 3 && <path d="M70 195 L348 195 Q373 177 367 142 Q365 120 351 113" fill="none" stroke="#2f9f78" strokeWidth="8" className="mol-mt-grow" />}
          <Text x={175} y={83}>{['Baseline', 'גירוי LTP', 'שינוי F-actin', 'כניסת מיקרוטובולים', 'מעקב אחרי Washout'][Math.min(phase, 4)]}</Text>
        </g>}
      </svg>
      <p className="molecular-demo-note">תרשים מונפש וסכמטי להמחשה בלבד; אינו משחזר תנועה מיקרוסקופית שנמדדה בניסוי.</p>
    </div>
  );
}
