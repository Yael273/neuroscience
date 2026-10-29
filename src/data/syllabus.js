
import lesson1 from './lessons/lesson1.json';
import neuroLesson2 from './lessons/neuro-lesson02.json';
import compLecture from './lessons/compcog-lecture01.json';
import compTutorial from './lessons/compcog-tutorial01.json';
import geneticsLecture from './lessons/genetics-lecture01.json';
import geneticsTutorial from "./lessons/genetics-tutorial01.json";
import molecularLecture from "./lessons/molecular-neurobiology-lecture01.json";
import molecularLecture2 from "./lessons/molecular-neurobiology-lecture02.json";
import brainImagingLesson from "./lessons/brain-imaging-lesson01.json";
import brainImagingLesson2 from "./lessons/brain-imaging-lesson02.json";
import consciousnessLesson from "./lessons/consciousness-lesson01.json";

// Only subjects with real uploaded material appear here.
// Progress is calculated automatically using useStudyProgress.

export const subjects = [
  {
    id: 'neuro',
    name: 'נוירואנטומיה תפקודית',
    symbol: '🧠',
    color: '#20ad60',
    soft: '#e8f8ef',
    subtitle: 'התפתחות מודלים תפקודיים של המוח בפרספקטיבה אבולוציונית',
    search: 'חיפוש בנוירואנטומיה',

    chapters: [
      {
        id: 'evolution-models',
        name: 'התפתחות מודלים תפקודיים של המוח',
        description: lesson1.description,
        lessonIds: [lesson1.id],
        lessons: 1,
        duration: lesson1.duration.estimatedStudyMinutes,
        topics: [lesson1.title]
      },
      {
        id: 'nervous-system-introduction',
        name: 'מבוא למערכת העצבים',
        description: neuroLesson2.description,
        lessonIds: [neuroLesson2.id],
        lessons: 1,
        duration: null,
        topics: [neuroLesson2.title]
      }
    ]
  },

  {
    id: 'compcog',
    name: 'מבוא לחישוביות וקוגניציה',
    symbol: '💻',
    color: '#3574cc',
    soft: '#eaf2ff',
    subtitle: 'מבוא למודלים חישוביים ולנוירונים מלאכותיים',
    search: 'חיפוש בחישוביות וקוגניציה',

    chapters: [
      {
        id: 'comp-lecture-1',
        name: 'הרצאה 1 — מבוא למודלים חישוביים',
        description: compLecture.description,
        lessonIds: [compLecture.id],
        lessons: 1,
        duration: null,
        topics: [compLecture.title]
      },
      {
        id: 'comp-tutorial-1',
        name: 'תרגול 1 — מודל McCulloch–Pitts',
        description: compTutorial.description,
        lessonIds: [compTutorial.id],
        lessons: 1,
        duration: null,
        topics: [compTutorial.title]
      }
    ]
  },
  {
    id: "neuropathology",
    name: "נוירופתולוגיה",
    symbol: "🧬",
    color: "#a65b92",
    soft: "#f7edf4",
    subtitle: "פתולוגיות של המערכת המוטורית והזדקנות",
    search: "חיפוש בנוירופתולוגיה",
    chapters: [{
      id: "np-motor-introduction",
      name: "מבוא לבקרה מוטורית",
      description: "הרצאה 1: בקרה מוטורית כבסיס להבנת פתולוגיות",
      lessonIds: ["neuropathology-motor-intro-01"],
      lessons: 1,
      duration: 0,
      topics: ["מבוא לבקרה מוטורית ולנוירופתולוגיה"]
    }]
  },
  {
    id: 'genetics',
    name: 'יסודות הגנטיקה',
    symbol: '🧬',
    color: '#be805a',
    soft: '#fff3e9',
    subtitle: 'חוקי מנדל, גנוטיפים, פנוטיפים ודפוסי הורשה',
    search: 'חיפוש ביסודות הגנטיקה',
    chapters: [{
      id: 'genetics-lecture-1',
      name: 'הרצאות 1–2 — יסודות התורשה',
      description: geneticsLecture.description,
      lessonIds: [geneticsLecture.id],
      lessons: 1,
      duration: geneticsLecture.duration?.estimatedStudyMinutes ?? null,
      topics: [geneticsLecture.title]
    },
    {
      id: "genetics-tutorial-1",
      name: "תרגול 1 — חוקי מנדל ודומיננטיות מלאה",
      description: geneticsTutorial.description,
      lessonIds: [geneticsTutorial.id],
      lessons: 1,
      duration: null,
      topics: [geneticsTutorial.title]
    }]
  },
  {
    id: "molecular_neurobiology",
    name: "נוירוביולוגיה מולקולרית",
    symbol: "🧬",
    progress: 0,
    color: "#4773bd",
    soft: "#ebf1ff",
    subtitle: "העברה סינפטית ומודל מאגרי הווזיקולות",
    search: "חיפוש בנוירוביולוגיה מולקולרית",
    chapters: [
      {
        id: "molecular-synaptic-transmission",
        name: "הרצאה 1 — העברה סינפטית",
        description: "מבט מולקולרי וכמותי על העברה סינפטית",
        lessons: 1,
        duration: 0,
        lessonIds: ["molecular-neurobiology-synaptic-transmission-01"],
        topics: ["העברה סינפטית ומודל מאגרי הווזיקולות"]
      },
      {
        id: "molecular-synaptic-organization",
        name: "הרצאה 2 — ארגון קדם ובתר־סינפטי",
        description: "הפרדת פאזות, קונדנסטים וננו־עמודות סינפטיות",
        lessons: 1,
        duration: 0,
        lessonIds: ["molecular-neurobiology-synaptic-organization-02"],
        topics: [
          "הפרדת פאזות וקונדנסט הסינפסין",
          "חשיבות הפרדת הפאזות בתא העצב",
          "ננו־עמודות טרנס־סינפטיות",
          "תכונות החומר של ה־PSD"
        ]
      }
    ]
  },

  {
    id: 'brain_imaging',
    name: 'מבוא לדימות מוח האדם',
    symbol: '🧠',
    color: '#6278B5',
    soft: '#EEF2FF',
    subtitle: 'הדמיה מבנית ותפקודית, MRI, fMRI ושיטות לחקר המוח',
    search: 'חיפוש במבוא לדימות מוח האדם',
    chapters: [
      {
        id: 'brain-imaging-intro',
        name: 'הרצאה 1 — מבוא לדימות מוח האדם',
        description: 'רקע היסטורי, אנטומיה ושיטות דימות מוחי',
        lessonIds: ['brain-imaging-lesson-01'],
        lessons: 1,
        duration: 0,
        topics: [
          'רקע היסטורי ומהפכה קוגניטיבית',
          'לוקליזציה של תפקודים במוח',
          'אבני הבניין ומישורי חיתוך',
          'CT, MRI ו-DTI',
          'דימות תפקודי ורישום תא בודד'
        ]
      },
      {
        id: 'brain-imaging-lesson-2',
        name: 'הרצאה 2 — שיטות מדידה וגרייה עצבית',
        description: brainImagingLesson2.description,
        lessonIds: [brainImagingLesson2.id],
        lessons: 1,
        duration: brainImagingLesson2.duration?.estimatedStudyMinutes ?? null,
        topics: [brainImagingLesson2.title]
      }
    ]
  },

  {
    id: 'consciousness_and_psychopathology',
    name: 'תודעה ופסיכופתולוגיה',
    symbol: '💭',
    color: '#8265AE',
    soft: '#F4EFFF',
    subtitle: 'החוויה הסובייקטיבית, גוף–נפש ותיאוריות של תודעה',
    search: 'חיפוש בתודעה ופסיכופתולוגיה',
    chapters: [
      {
        id: 'consciousness-lecture-1',
        name: 'הרצאה 1 — מבוא לתודעה ופסיכופתולוגיה',
        description: consciousnessLesson.description,
        lessonIds: [consciousnessLesson.id],
        lessons: 1,
        duration: consciousnessLesson.duration?.estimatedStudyMinutes ?? null,
        topics: consciousnessLesson.sections.map(section => section.title)
      }
    ]
  }

];
