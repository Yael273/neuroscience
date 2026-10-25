# סילבוס — אתר הכנה למבחנים

פרויקט React + Vite בעברית ו-RTL, עם שיעור ראשון המבוסס על מצגת הקורס מבוא לנוירואנטומיה תפקודית ועל קריאת Assaf et al. (2020), ובוחן שאלות מתוך צילומי המסך.

## הרצה
```bash
npm install
npm run dev
```
ב-PowerShell אם npm נחסם: `npm.cmd install` ואז `npm.cmd run dev`.

## היכן משנים את הנתונים?
- `src/data/lessons/lesson1.json` — הסיכומים, המושגים, המקורות והשאלות.
- `src/data/syllabus.js` — רשימת המקצועות והפרקים.
- `src/pages/LessonPage.jsx` — ממשק השיעור והבוחן.
- `public/images/assaf-msp-question.png` — תמונת גרף הבוחן המצורפת.

השאלות אינן כוללות מפתח תשובות רשמי; המפתח המוצע אינו בהכרח המפתח של המרצה. שאלה 1 אינה מדורגת. מאמר Cesario מוזכר במצגת, אך לא צורף כקובץ מלא.
