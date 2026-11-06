
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
import neuropathologyLesson from "./lessons/neuropathology-lecture01.json";
import appliedGenetics from "./lessons/applied-genetics-lecture01.json";
import molecularLecture03 from "./lessons/molecular-neurobiology-lecture03.json";
import buddhismLecture01 from "./lessons/buddhism-philosophy-lecture01.json";
import buddhismLecture02 from "./lessons/buddhism-philosophy-lecture02.json";
import buddhismLecture03 from "./lessons/buddhism-philosophy-lecture03.json";

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
      lessonIds: ["neuropathology-lecture01"],
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
      },
      {
        id: "molecular-exocytosis-mechanism",
        name: "הרצאה 3 — מנגנון האקסוציטוזה",
        description: "איחוי שלפוחיות סינפטיות, חלבוני SNARE, חיישן הסידן ותעלות סידן",
        lessons: 1,
        duration: 0,
        lessonIds: ["molecular-neurobiology-lecture-03"],
        topics: [
          "מנגנון האיחוי של שלפוחיות סינפטיות",
          "מבנה קומפלקס SNARE ומודל הרוכסן",
          "פירוק קומפלקס SNARE — NSF ו־α-SNAP",
          "Docking ו־Priming — חלבוני Munc13, Munc18 ו־RIM",
          "Synaptotagmin — חיישן הסידן",
          "Complexin ובקרת שחרור הנוירוטרנסמיטרים",
          "שחרור סינכרוני ואסינכרוני",
          "ננו־דומיינים ומיקרו־דומיינים של סידן",
          "תעלות סידן מסוג CaV וארגונן באזור הפעיל",
          "הקשר בין ארגון הסינפסה לתכונות השחרור"
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
  },
  {
    id: "applied-genetics",
    name: "גנטיקה יישומית",
    symbol: "🧬",
    color: "#8B5CF6",
    soft: "#F3EEFF",
    subtitle: "שונות גנטית, גנטיקה של אוכלוסיות וסמנים גנטיים",
    search: "חיפוש בגנטיקה יישומית",
    chapters: [
      {
        id: "applied-genetics-lecture-1",
        name: "הרצאה 1 — מבוא לגנטיקה יישומית",
        description: appliedGenetics.description,
        lessonIds: [appliedGenetics.id],
        lessons: 1,
        duration: appliedGenetics.duration?.estimatedStudyMinutes ?? null,
        topics: appliedGenetics.sections.map(section => section.title)
      }
    ]
  },

  {
    id: "buddhism_philosophy",
    name: "בודהיזם כפילוסופיה",
    symbol: "☸️",
    progress: 0,
    color: "#B77950",
    soft: "#FFF3E9",
    subtitle: "מחשבה בודהיסטית, פילוסופיה ודרך השחרור",
    search: "חיפוש בבודהיזם כפילוסופיה",
    chapters: [
      {
        id: "buddhism-introduction",
        name: "שיעור 1 — מבוא לבודהיזם כפילוסופיה",
        description: "בודהיזם ופילוסופיה, קשב, התרבות הוודית והמפנה האופנישדי",
        lessons: 1,
        duration: 0,
        lessonIds: [buddhismLecture01.id],
        topics: buddhismLecture01.sections.map(section => section.title)
      },
      {
        id: "buddhism-indian-thought-and-buddha",
        name: "שיעור 2 — עולם המחשבה ההודי וחיי הבודהה",
        description: "אטמן וברהמן, קארמה, סמסרה, סידהארתה גאוטמה ודרך האמצע",
        lessons: 1,
        duration: 0,
        lessonIds: [buddhismLecture02.id],
        topics: buddhismLecture02.sections.map(section => section.title)
      },
      {
        id: "buddhism-four-noble-truths",
        name: "שיעור 3 — ארבע האמיתות הנאצלות",
        description: "דוקהה, השתוקקות, היאחזות, נירוונה והנתיב בן שמונת האיברים",
        lessons: 1,
        duration: 0,
        lessonIds: [buddhismLecture03.id],
        topics: buddhismLecture03.sections.map(section => section.title)
      }
    ]
  }



];
