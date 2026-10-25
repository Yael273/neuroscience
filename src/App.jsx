
import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import SyllabusPage from "./pages/SyllabusPage";
import LessonPage from "./pages/LessonPage";
import useStudyProgress from "./hooks/useStudyProgress";
import { subjects } from "./data/syllabus";
import useTopicBookmarks from "./hooks/useTopicBookmarks";
import neuroLesson from "./data/lessons/lesson1.json";
import neuroLesson2 from "./data/lessons/neuro-lesson02.json";
import compLecture from "./data/lessons/compcog-lecture01.json";
import compTutorial from "./data/lessons/compcog-tutorial01.json";
import neuropathologyIntro from "./data/lessons/neuropathology-lecture01.json";
import geneticsLecture from './data/lessons/genetics-lecture01.json';
import ScrollToTop from "./components/ScrollToTop";

const lessonsById = Object.fromEntries(
  [neuroLesson, neuroLesson2, compLecture, compTutorial, neuropathologyIntro, geneticsLecture].map(lesson => [lesson.id, lesson])
);

export default function App() {
  const [activeId, setActiveId] = useState(subjects[0]?.id ?? "");
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [activeTopicId, setActiveTopicId] = useState(null);

  const studyProgress = useStudyProgress();
  const [topicRequest, setTopicRequest] = useState(null);
  const { savedIds, toggleBookmark } = useTopicBookmarks(selectedLessonId || "__inactive__");
  const activeLesson = selectedLessonId ? lessonsById[selectedLessonId] : null;

  function navigateToTopic(topicId) {
    setTopicRequest({ topicId, requestId: Date.now() });
  }
  const active = subjects.find(s => s.id === activeId);

  const [activeChapterId, setActiveChapterId] = useState(
    subjects[0]?.chapters[0]?.id ?? null
  );

  function changeSubject(id) {
    setActiveId(id);
    setSelectedLessonId(null);
    setTopicRequest(null);

    const selectedSubject = subjects.find(s => s.id === id);
    setActiveChapterId(selectedSubject?.chapters[0]?.id ?? null);

    window.scrollTo(0, 0);
  }

  function openLesson(chapter) {
    setTopicRequest(null);
    setSelectedLessonId(chapter.lessonIds[0]);
    window.scrollTo(0, 0);
  }


  function changeChapter(chapterId) {
    // Find the selected chapter in the active subject.
    const chapter = active?.chapters.find(
      ch => ch.id === chapterId
    );

    if (!chapter) return;

    // Update the highlighted chapter.
    setActiveChapterId(chapterId);

    // Open the lesson belonging to that chapter.
    const lessonId = chapter.lessonIds?.[0];

    if (lessonId) {
      setTopicRequest(null);
      setSelectedLessonId(lessonId);
    }

    // Scroll to the beginning of the new lesson.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }


  return (
    <div className="app-shell" dir="rtl" lang="he">
      <Sidebar
        activeId={activeId}
        onChange={changeSubject}
        studyProgress={studyProgress}
        activeChapterId={activeChapterId}
        onChapterChange={changeChapter}
        activeLesson={activeLesson}
        savedTopicIds={savedIds}
        onTopicNavigate={navigateToTopic}
        onTopicBookmark={toggleBookmark}
        activeTopicId={activeTopicId}
      />

      {selectedLessonId ? (
        <LessonPage
          key={selectedLessonId}
          lessonId={selectedLessonId}
          subjectName={active?.name}
          studyProgress={studyProgress}
          topicRequest={topicRequest}
          savedTopicIds={savedIds}
          onTopicBookmark={toggleBookmark}
          onBack={() => { setSelectedLessonId(null); setTopicRequest(null); }}
          onActiveTopicChange={setActiveTopicId}
        />
      ) : (
        active && (
          <SyllabusPage
            subject={active}
            studyProgress={studyProgress}
            activeChapterId={activeChapterId}
            onLessonOpen={(chapter) => {
              setActiveChapterId(chapter.id);
              openLesson(chapter);
            }}
          />
        )
      )}
      <ScrollToTop />
    </div>
  );
}
