
import lesson1 from './lessons/lesson1.json';
import neuroLesson2 from './lessons/neuro-lesson02.json';
import compLecture from './lessons/compcog-lecture01.json';
import compTutorial from './lessons/compcog-tutorial01.json';
import geneticsLecture from './lessons/genetics-lecture01.json';

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
    }]
  }
];
