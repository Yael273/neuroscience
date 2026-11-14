import React from "react";
import "../styles/synaptic-release-demo.css";

// Each state is a scientific schematic, not a frame from an experiment.
// The parent ProcessFlow remounts the active visual when a step changes or is replayed.
export default function SynapticReleaseDemo({ scene, phase = 0 }) {
  const p = Math.min(3, Math.max(0, Number(phase) || 0));
  const T = ({ x, y, children, size = 16, color = "#35566d" }) => (
    <text x={x} y={y} textAnchor="middle" fontSize={size} fontWeight="600" fill={color}>{children}</text>
  );
  const mem = (y, color = "#6ba6b4") => <path d={`M55 ${y} H625`} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" />;
  const vesicle = (x, y, r = 48, fused = false) => (
    <g className="syn-appear">
      {fused
        ? <path d={`M${x-r} ${y+10} Q${x-38} ${y-34} ${x} ${y-30} Q${x+38} ${y-34} ${x+r} ${y+10}`} fill="#e4f4f1" stroke="#71b0b2" strokeWidth="6" />
        : <circle cx={x} cy={y} r={r} fill="#e4f4f1" stroke="#71b0b2" strokeWidth="6" />}
      {!fused && Array.from({length:5},(_,i)=><circle key={`nt-${i}`} cx={x-21+(i%3)*20} cy={y-16+Math.floor(i/3)*28} r="5" fill="#e5aa61" />)}
    </g>
  );
  const strands = (amount, paired = false) => (
    <g>
      {Array.from({length:amount},(_,i)=><path key={`strand-${i}`} className="syn-draw" d={`M${315+i*9} 120 Q${311+i*11} 146 ${308+i*10} ${paired?184:165}`} fill="none" stroke={['#bf7bb5','#6c9fd0','#59ac87','#df996e'][i%4]} strokeWidth="5" strokeLinecap="round" style={{animationDelay:`${i*.1}s`}} />)}
    </g>
  );
  const ion = (x,y,i,klass="syn-ion") => <g key={`ca-${i}`} className={klass} style={{animationDelay:`${i*.12}s`}}><circle cx={x} cy={y} r="10" fill="#e4a759" stroke="#bf7a2d" strokeWidth="1.5"/><T x={x} y={y+4} size={9} color="#fff">Ca</T></g>;
  const proteins = (n=4) => <g>{Array.from({length:n},(_,i)=><rect key={`prot-${i}`} x={305+i*16} y="120" width="10" height="42" rx="5" fill={['#ad75b4','#729dcd','#58ad8e','#d9a36d'][i%4]} className="syn-appear" style={{animationDelay:`${i*.12}s`}} />)}</g>;

  if (scene === 'l3-snare-cycle') return <g>
    {mem(184)}
    {vesicle(343, p===0?73:p===1?112:140, 43, p===2)}
    {p===0 && <><T x={343} y={22}>שלפוחית לפני עגינה</T><T x={460} y={132}>v-SNARE / t-SNARE</T></>}
    {p===1 && <>{strands(4,true)}<T x={480} y={98}>trans-SNARE</T></>}
    {p===2 && <>{strands(4,true)}{Array.from({length:6},(_,i)=>ion(320+i*12,197-(i%2)*9,i,'syn-nt-release'))}<T x={498} y={83}>איחוי · cis-SNARE</T></>}
    {p===3 && <>{proteins()}<g className="syn-appear"><circle cx="409" cy="140" r="20" fill="#dbc4ef"/><T x={409} y={145} size={12}>NSF</T></g><T x={440} y={83}>הכנה למחזור נוסף</T></>}
    <T x={148} y={218}>ממברנת התא</T>
  </g>;

  if (scene === 'l3-nsf-recycle') return <g>
    {mem(192)}
    {p<=2 ? <>{strands(4,true)}<T x={165} y={105}>cis-SNARE יציב</T></> : <>{proteins(4)}<T x={172} y={105}>SNAREs מפורקים</T></>}
    {p>=1 && <g className="syn-appear"><rect x="365" y="70" width="112" height="67" rx="24" fill="#dfcef0" stroke="#b09ad0" strokeWidth="2"/><T x={420} y={96} size={15}>NSF</T><T x={420} y={119} size={12}>α-SNAP</T></g>}
    {p===2 && <g className="syn-appear"><rect x="480" y="151" width="80" height="37" rx="16" fill="#fff0c8"/><T x={520} y={175} size={16}>ATP</T><path d="M492 141 Q458 126 443 139" stroke="#cc9640" strokeWidth="4" strokeDasharray="7 6" className="syn-dash" fill="none"/></g>}
    {p===3 && <><path className="syn-draw" d="M320 118 L260 72 M335 118 L337 65 M350 118 L406 72" stroke="#56a589" strokeWidth="4"/><T x={526} y={154} color="#16856b">פירוק תלוי ATP</T></>}
  </g>;

  if (scene === 'l3-zipper') return <g>
    {mem(192)}{vesicle(333, p===0?68:p===1?88:p===2?105:134, 39, p===3)}
    <g>{Array.from({length:4},(_,i)=> <path key={`helix-${i}`} className={p>=1?"syn-draw":""} d={`M${313+i*12} ${p===0?90:110} Q${308+i*15} ${p>=2?149:123} ${313+i*12} ${p>=3?191:p===2?167:141}`} fill="none" stroke={['#b97db5','#70a4cf','#61b38d','#d6a063'][i]} strokeWidth="5" strokeLinecap="round" style={{animationDelay:`${i*.13}s`}} />)}</g>
    <T x={485} y={70}>{['Qa / Qb / Qc / R','תחילת הרכבת trans','רוכסן חלקי (primed)','איחוי לאחר אות Ca²⁺'][p]}</T>
    {p>=2 && <g className="syn-appear"><rect x="370" y="130" width="77" height="27" rx="13" fill="#f4d4ec"/><T x={409} y={149} size={12}>Complexin</T></g>}
    {p===3 && [0,1,2,3].map(i=>ion(285+i*32,210+(i%2)*7,i,'syn-nt-release'))}
  </g>;

  if (scene === 'l3-munc-priming') return <g>
    {mem(200)}
    {vesicle(398, p>=2?115:75, 40)}
    <g className="syn-appear"><path d={p<=1?"M277 179 Q255 150 276 132 Q304 127 307 158":"M277 186 L279 124"} fill="none" stroke="#9c74c2" strokeWidth="10" strokeLinecap="round"/><T x={218} y={119} size={15}>Syntaxin</T></g>
    {p>=1 && <g className="syn-appear"><ellipse cx="253" cy="169" rx="31" ry="18" fill="#c6c0ed"/><T x={251} y={174} size={12}>Munc18</T></g>}
    {p>=2 && <g className="syn-appear"><path d="M340 155 Q356 129 374 142" fill="none" stroke="#62b6a3" strokeWidth="12" strokeLinecap="round"/><T x={364} y={117} size={14}>Munc13</T></g>}
    {p===3 && <>{strands(3,true)}<T x={510} y={127} size={14}>SNARE מורכב</T></>}
    <T x={443} y={45}>{['מצב סגור','בקרה על מצב Syntaxin','קירוב שלפוחית ופתיחה','הרכבה מבוקרת'][p]}</T>
  </g>;

  if (scene === 'l3-calcium-release') return <g>
    {mem(77)}{mem(203,"#81bdb5")}
    <rect x="285" y="55" width="71" height="43" rx="9" fill={p>=1?"#79a6e3":"#b2c7e2"} stroke="#5c85bb" strokeWidth="3" className="syn-appear"/>
    <T x={320} y={43} size={14}>VGCC</T>
    {p>=1 && [0,1,2,3,4].map(i=>ion(320+((i%3)-1)*25,110+Math.floor(i/3)*34,i))}
    {vesicle(455,p>=3?167:154,32,p===3)}
    <g className="syn-appear"><rect x="420" y="177" rx="10" width="74" height="18" fill={p>=2?"#bc82c6":"#d1bcd6"}/><T x={457} y={167} size={13}>Syt</T></g>
    {p>=2 && <path className="syn-draw" d="M361 127 Q401 130 430 166" stroke="#d5974d" strokeWidth="5" fill="none" strokeDasharray="8 6"/>}
    {p===3 && [0,1,2,3].map(i=>ion(440+i*14,214+(i%2)*8,i,'syn-nt-release'))}
    <T x={135} y={161}>{['פוטנציאל פעולה','Ca²⁺ מקומי','הפעלת החיישן','איחוי ושחרור'][p]}</T>
  </g>;

  if (scene === 'l3-buffers') return <g>
    <g><rect x="72" y="50" width="536" height="150" rx="12" fill="#f3f9fc" stroke="#c8e0e4" strokeWidth="2"/></g>
    <rect x="307" y="52" width="66" height="39" rx="7" fill="#86aee1" />
    <T x={340} y={40} size={16}>תעלת סידן</T>
    <path d="M339 97 Q297 117 273 154 M339 97 Q377 117 409 156" stroke="#e4aa67" fill="none" strokeWidth="3" strokeDasharray="6 7" className="syn-dash"/>
    <circle cx="255" cy="166" r="28" fill="#def3ec" stroke="#69a88d" strokeWidth="4"/>
    <circle cx="425" cy="166" r="28" fill="#e9e9fb" stroke="#9a91c9" strokeWidth="4"/>
    <T x={250} y={216} size={14}>צימוד הדוק</T><T x={429} y={216} size={14}>צימוד מרוחק</T>
    {p>=1 && [0,1,2,3,4].map(i=>ion(323+(i-2)*14,113+(i%2)*18,i))}
    {p>=2 && <g className="syn-appear"><rect x="112" y="77" width="95" height="30" rx="12" fill="#fbe4c9"/><T x={159} y={97} size={14}>BAPTA</T><rect x="472" y="77" width="92" height="30" rx="12" fill="#e4dafa"/><T x={518} y={97} size={14}>EGTA</T></g>}
    {p===3 && <><path className="syn-draw" d="M283 165 L307 149" stroke="#dc8f60" strokeWidth="5"/><path className="syn-draw" d="M394 166 L370 147" stroke="#8e91ca" strokeWidth="4" strokeDasharray="5 6"/></>}
    <T x={337} y={244} size={14}>{['מיקום מקור Ca²⁺ והחיישנים','הסידן מתפזר במרחב','השוואת בופר מהיר ואיטי','הסקה על מרחק הצימוד'][p]}</T>
  </g>;

  return null;
}
