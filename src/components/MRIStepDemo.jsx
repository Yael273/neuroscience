import React, { useId } from "react";
import "../styles/mri-step-demo.css";

// Illustrated, stage-specific MRI / fMRI explanations (not a second flowchart).
// Uses the same block.steps[].demo fields as the existing ProcessFlow component.
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
function Curve({ points, color = '#168f9b', width = 4 }) {
  return <polyline points={points.map(p => p.join(',')).join(' ')} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />;
}
function Grid({ size=8, active=8, glow=false }) {
  return <g>{Array.from({length: size*size}, (_,i)=> {
    const x=150+(i%size)*24, y=55+Math.floor(i/size)*24;
    const on = i < active;
    return <rect key={i} x={x} y={y} width="20" height="20" rx="2" fill={on?(glow?'#65c3cd':'#5ca8cc'):'#e5edf0'} opacity={on?1:.8} className={on?'mri-scene-appear':''} style={{animationDelay:`${(i%size)*24}ms`}} />;
  })}</g>;
}
function SpinScene({ index, kind }) {
  return <g>
    <circle cx="270" cy="155" r="104" fill="#eff7f4" stroke="#a9cfc3" strokeWidth="3" />
    <path d="M270 250V52 M167 155H373" stroke="#aec7ca" strokeDasharray="5 6" strokeWidth="2" />
    {Array.from({length:9},(_,i)=>{
      const x=193+(i%3)*77,y=91+Math.floor(i/3)*63;
      const angle = kind==='t1' ? -90+index*22 : kind==='t2' ? -90+(i-4)*index*19 : -90+(index>0?(i%3)*14:0);
      const rad=angle*Math.PI/180;
      return <g key={i}><circle cx={x} cy={y} r="17" fill="#fff" stroke="#cde5de" /><path d={`M${x} ${y} L${x+Math.cos(rad)*15} ${y+Math.sin(rad)*15}`} stroke={i%2?'#15a3b3':'#215d88'} strokeWidth="4" strokeLinecap="round" /><circle cx={x+Math.cos(rad)*15} cy={y+Math.sin(rad)*15} r="3" fill="#215d88" /></g>;
    })}
    {index>1 && <path d="M405 198 H464" stroke="#188e74" strokeWidth="4" strokeDasharray="9 7" className="mri-dash" />}
    <text x="270" y="285" className="mri-scene-caption">{kind==='t1'?'התאוששות המגנטיזציה לאורך z':kind==='t2'?'איבוד תיאום הפאזות בין הספינים':'פרצסיה וקידוד של מיקום'}</text>
  </g>;
}
function VoxelScene({index,kind}) {
  const n=index===0?3:index===1?5:8;
  const cell=194/n;
  return <g><rect x="173" y="58" width="194" height="194" rx="8" fill="#eef3fb" stroke="#90b3cf" strokeWidth="3" />
    {Array.from({length:n*n},(_,i)=> <rect key={i} x={173+(i%n)*cell} y={58+Math.floor(i/n)*cell} width={cell} height={cell} fill={(i+n)%3===0?'#abd8d6':'#d5e8ef'} stroke="#fff" strokeWidth="2" />)}
    {index>=2 && <rect x="173" y="58" width="194" height="194" rx="8" fill="none" stroke="#20a581" strokeWidth="5" className="mri-pulse" />}
    <text x="270" y="285" className="mri-scene-caption">{kind==='voxel'?`חלוקה למטריצה ${n}×${n} (המחשה)`:'איזון בין כיסוי, זמן ודגימה'}</text>
  </g>;
}
function KScene({index,kind}) {
  const grid = 8;
  return <g>
   <Grid size={grid} active={index===0?8:index===1?32:index===2?64:64} glow={index>1}/>
   {kind==='epi' && <path d={Array.from({length:8},(_,i)=>`${i===0?'M':'L'} ${i%2?318:150} ${65+i*24}`).join(' ')} stroke="#e5a34d" strokeWidth="4" fill="none" strokeDasharray="12 8" className="mri-dash"/>}
   {index===3 && <g><rect x="393" y="89" width="92" height="130" rx="9" fill="#21364c"/><ellipse cx="439" cy="153" rx="35" ry="51" fill="#b2bfc6"/><path d="M439 111V194 M411 152H465" stroke="#657c88" strokeWidth="5" /></g>}
   <text x="270" y="285" className="mri-scene-caption">{kind==='epi'?'מסלול מהיר דרך K-space':'איסוף תדרים מרחביים ושחזור תמונה'}</text>
  </g>;
}
function EchoScene({index}) {
  const points=Array.from({length:80},(_,i)=>{const t=i/79;return [87+t*370,164-85*Math.exp(-t*2.8)*Math.cos(16*Math.PI*t+(index>=2?Math.PI:0))]});
  return <g><path d="M83 160H470 M94 62V250" stroke="#9daeb7" strokeWidth="2"/><Curve points={points} color="#2d8cab" width={3}/>
    {index>=2&&<path d="M270 85V244" stroke="#dd9c51" strokeWidth="4" strokeDasharray="9 8"/>}
    <circle cx={[110,190,280,390][index]||110} cy="161" r="11" fill="#2bb18d" className="mri-pulse"/>
    <text x="270" y="285" className="mri-scene-caption">{index>=2?'פולס רפוקוס 180° מוביל להתכנסות מחודשת':'ספינים יוצאים מסנכרון לאחר העירור'}</text>
  </g>;
}
function HRFScene({index}) {
  const values=Array.from({length:95},(_,i)=>{const t=i/9.4;const h=t<1?0:t<1.8?-.11*Math.sin((t-1)/.8*Math.PI):t<5.3? 1.15*Math.sin((t-1.8)/3.5*Math.PI/2):t<7.2? 1.15-(t-5.3)*.67:t<8.7? -.12*Math.sin((t-7.2)/1.5*Math.PI):0;return [68+i*4.2,190-h*103]});
  const marker=[110,180,295,410][index]||110;
  return <g><path d="M62 190H476 M65 67V247" stroke="#9cabbb" strokeWidth="2"/><Curve points={values} color="#168caa" />
    <path d={`M${marker} 66V244`} stroke="#d7a64e" strokeDasharray="5 7" strokeWidth="3" className="mri-dash"/>
    <circle cx={marker} cy={values[clamp(Math.round((marker-68)/4.2),0,94)][1]} r="9" fill="#1a9470" className="mri-pulse"/>
    <text x="270" y="285" className="mri-scene-caption">צורת HRF סכמטית: עלייה, שיא, undershoot</text>
  </g>;
}
function BoldScene({index}) {
  return <g><path d="M75 146 C175 87 348 210 464 132" stroke="#e7b5b5" strokeWidth="66" fill="none" strokeLinecap="round"/>
    <path d="M75 146 C175 87 348 210 464 132" stroke="#c75c75" strokeWidth="48" fill="none" strokeLinecap="round"/>
    {Array.from({length:9},(_,i)=> <ellipse key={i} cx={99+i*40} cy={143+Math.sin(i*.8)*28} rx="14" ry="9" fill={index>=2?'#e6a2b4':'#7e6fa3'} stroke="#fff" strokeWidth="2" className={index>1?'mri-pulse':''} style={{animationDelay:`${i*80}ms`}}/>)}
    {index>=1&&<path d="M85 235H453" stroke="#2ba5bd" strokeWidth="5" strokeDasharray="18 13" className="mri-dash"/>}
    <text x="270" y="285" className="mri-scene-caption">כלי דם, חמצון ושינוי באות BOLD</text>
  </g>;
}
function SNRScene({index,kind}) {
  const pts=Array.from({length:145},(_,i)=>{const x=65+i*2.85;const t=i/10;const main=Math.sin(t*.72)*23;const noise=Math.sin(t*5.4)*19/(index+1);return [x,155-main-noise]});
  return <g><path d="M65 155H474 M65 65V246" stroke="#b8c8ce" strokeWidth="2"/><Curve points={pts} color="#177caa" width={3}/>
    {index>=1&&<Curve points={Array.from({length:145},(_,i)=>[65+i*2.85,155-Math.sin(i/10*.72)*23])} color="#21ad82" width={3}/>}<text x="270" y="285" className="mri-scene-caption">{kind==='linear'?'השוואת תגובה חזויה ומדודה':'הפחתת רעש והבלטת אות עקבי'}</text></g>;
}
function SafetyScene({index}) {return <g><rect x="177" y="62" width="188" height="177" rx="28" fill="#e7f1f7" stroke="#587d96" strokeWidth="5"/><path d="M215 103V181 Q270 231 326 181 V103" stroke="#ce626c" strokeWidth="21" fill="none" strokeLinecap="round"/><path d="M219 104V177 Q270 218 321 177V104" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round"/>
  {index<2?<g><circle cx="128" cy="154" r="13" fill="#d09d57"/><path d="M145 154H171" stroke="#d09d57" strokeWidth="4" className="mri-dash"/></g>:<g><circle cx="426" cy="143" r="26" fill="#d8f5e8" stroke="#2d9b73" strokeWidth="4"/><path d="M410 142L424 155L442 129" stroke="#288d68" strokeWidth="5" fill="none"/></g>}
  <text x="270" y="285" className="mri-scene-caption">סינון מתכות ושמירה על נהלי בטיחות במגנט</text></g>}

// Lesson 4: dedicated MRI physics illustrations; one illustration changes per selected flow step.
function PhysicsScene({scene,index}) {
  const spinAngles=Array.from({length:8},(_,i)=>{
    if(scene==='rf') return index===0?-90:index===1?-45:0;
    if(scene==='phase') return index===0?0:index===1?i*27:i*27;
    return index===0?0:index===1?i*18:i*35;
  });
  if(['rf','phase'].includes(scene)) return <g>
    <circle cx="270" cy="150" r="103" fill="#eaf6fa" stroke="#90bed0" strokeWidth="3"/>
    {scene==='rf'&&<path d="M270 240V50 M165 150H375" stroke="#91b3c2" strokeWidth="2" strokeDasharray="6 5"/>}
    {spinAngles.map((a,i)=>{const x=195+(i%4)*48,y=116+Math.floor(i/4)*82,r=(a-90)*Math.PI/180;return <g key={i}><circle cx={x} cy={y} r="19" fill="white" stroke="#b5d4de"/><path d={`M${x} ${y} L${x+Math.cos(r)*16} ${y+Math.sin(r)*16}`} stroke="#168caa" strokeWidth="4" strokeLinecap="round" className={index>0?'mri-pulse':''}/></g>})}
    {scene==='rf'&&index>0&&<path d="M85 150q22-80 44 0t44 0" fill="none" stroke="#df9877" strokeWidth="5" className="mri-dash"/>}
    <text x="270" y="287" className="mri-scene-caption">{scene==='rf'?['מגנטיזציה אורכית לפני RF','פולס RF מעורר את הספינים','המגנטיזציה מוטה למישור הרוחבי'][Math.min(index,2)]:['ספינים בתיאום פאזה','הגרדיאנט יוצר היסטים תלויי מיקום','הפרשי הפאזה נשמרים אחרי כיבוי הגרדיאנט'][Math.min(index,2)]}</text>
  </g>;
  if(scene==='slice') return <g>
    <ellipse cx="270" cy="156" rx="117" ry="103" fill="#e4eff5" stroke="#82acc4" strokeWidth="3"/>
    {Array.from({length:7},(_,i)=><path key={i} d={`M165 ${87+i*23}H375`} stroke="#9ab9cb" strokeWidth="5" opacity=".65"/>)}
    <rect x="155" y={index===0?122:index===1?117:111} width="230" height={index===2?25:38} fill="#34a8ae" opacity={index===0?.13:.42} className={index>0?'mri-pulse':''}/>
    {index===1&&<path d="M75 127 q20-65 40 0t40 0" stroke="#df9e65" strokeWidth="5" fill="none" className="mri-dash"/>}
    <text x="270" y="287" className="mri-scene-caption">{['גרדיאנט יוצר תדר שונה בכל גובה','RF מעורר רק טווח תדרים נבחר','מתקבל חתך במיקום ובעובי מוגדרים'][Math.min(index,2)]}</text>
  </g>;
  if(scene==='frequency') return <g>
    <path d="M70 160H472 M80 69V244" stroke="#9eb6c3" strokeWidth="2"/>
    {[0,1,2].map((j)=>{const pts=Array.from({length:100},(_,i)=>{const t=i/99;return `${85+t*375},${155-(16+j*10)*Math.sin(t*Math.PI*(8+j*5))}`}).join(' ');return <polyline key={j} points={pts} fill="none" stroke={['#168caa','#56b69b','#da9f60'][j]} strokeWidth="3" opacity={index===0&&j>0?.18:1} className={index===1?'mri-scene-appear':''}/>})}
    {index===2&&[0,1,2].map((j)=><rect key={j} x={200+j*55} y={235-(j+1)*30} width="25" height={(j+1)*30} fill="#3199b0" className="mri-scene-appear"/>)}
    <text x="270" y="287" className="mri-scene-caption">{['גרדיאנט גורם לתדרים שונים במיקומים שונים','הסליל קולט סכום תדרים','פורייה מפרידה את רכיבי התדר'][Math.min(index,2)]}</text>
  </g>;
  if(scene==='fid') return <g>
    <path d="M67 160H470 M70 65V251" stroke="#adbdc8" strokeWidth="2"/>
    <polyline points={Array.from({length:180},(_,i)=>{const t=i/179;const amp=(index===0?1:index===1?0.85:0.66)*83*Math.exp(-t*(index===2?3.8:2));return `${78+t*382},${159-amp*Math.sin(t*31*Math.PI)}`}).join(' ')} stroke="#278ea9" fill="none" strokeWidth="2.7" className="mri-scene-appear"/>
    {index>=1&&<circle cx="418" cy="145" r="30" fill="none" stroke="#50a98d" strokeWidth="5" className="mri-pulse"/>}
    <text x="270" y="287" className="mri-scene-caption">{['RF יוצר מגנטיזציה רוחבית','מגנטיזציה מתקדמת בפרצסיה ונקלטת בסליל','האות החשמלי מתנדנד ודועך: FID'][Math.min(index,2)]}</text>
  </g>;
  if(scene==='fourier') return <g>
    <path d="M59 151H476 M67 68V244" stroke="#afc0c8" strokeWidth="2"/>
    {index<2?<polyline points={Array.from({length:130},(_,i)=>{let t=i/129;return `${80+t*370},${151-34*Math.sin(t*18*Math.PI)-22*Math.sin(t*7*Math.PI)}`}).join(' ')} fill="none" stroke="#2495ac" strokeWidth="3"/>:[0,1,2,3].map((j)=><rect key={j} x={180+j*55} y={242-(j%2?135:85)} width="26" height={j%2?135:85} fill="#2a9bb3" className="mri-scene-appear"/>)}
    <text x="270" y="287" className="mri-scene-caption">{['אותות ממיקומים רבים מצטרפים','סליל הקליטה מודד אות משולב','התמרת פורייה משחזרת מידע מרחבי'][Math.min(index,2)]}</text>
  </g>;
  return null;
}

const sceneNames={image:'יצירת אות ותמונה',gradient:'קידוד מרחבי',kspace:'מרחב התדרים',t1:'רלקסציה אורכית',t2:'רלקסציה רוחבית',contrast:'שקלול תמונה',echo:'רצף Spin Echo',bold:'תגובה של כלי דם',epi:'דגימת EPI',hrf:'התגובה ההמודינמית',safety:'בטיחות MRI',timeseries:'סדרת זמן',voxel:'גודל ווקסל',sampling:'דגימה בזמן',snr:'יחס אות לרעש',linear:'ליניאריות'};
export default function MRIStepDemo({ step, stepIndex=0, kind='image' }) {
  const id=useId();const scene=step?.demo?.scene||kind;const label=step?.title||sceneNames[scene]||'המחשת MRI';
  return <div className="mri-step-demo" dir="rtl"><strong className="mri-step-title">{label}</strong>
    <svg key={`${scene}-${stepIndex}`} viewBox="0 0 540 310" role="img" aria-labelledby={`${id}-title`} className="mri-step-illustration">
      <title id={`${id}-title`}>המחשה מונפשת: {label}</title>
      {['rf','fid','slice','frequency','phase','fourier'].includes(scene)&&<PhysicsScene scene={scene} index={stepIndex}/>}
      {['image','gradient','t1','t2','contrast'].includes(scene)&&<SpinScene index={stepIndex} kind={scene==='t1'?'t1':scene==='t2'?'t2':'gradient'}/>}
      {['voxel','sampling'].includes(scene)&&<VoxelScene index={stepIndex} kind={scene}/>}
      {['kspace','epi','timeseries'].includes(scene)&&<KScene index={stepIndex} kind={scene}/>}
      {scene==='echo'&&<EchoScene index={stepIndex}/>}
      {scene==='hrf'&&<HRFScene index={stepIndex}/>}
      {scene==='bold'&&<BoldScene index={stepIndex}/>}
      {['snr','linear'].includes(scene)&&<SNRScene index={stepIndex} kind={scene}/>}
      {scene==='safety'&&<SafetyScene index={stepIndex}/>}
    </svg>
    <p className="mri-step-note">איור סכמטי להמחשת העיקרון, לא תרשים מדידה כמותי.</p>
  </div>;
}
