
import React, { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "syllabus-study-progress-v1";

const EMPTY = {
  completedLessonIds: [],
  studySecondsByLesson: {}
};

function readStorage() {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "null"
    );

    return {
      completedLessonIds: Array.isArray(parsed?.completedLessonIds)
        ? parsed.completedLessonIds
        : [],
      studySecondsByLesson:
        parsed?.studySecondsByLesson &&
        typeof parsed.studySecondsByLesson === "object"
          ? parsed.studySecondsByLesson
          : {}
    };
  } catch {
    return { ...EMPTY };
  }
}

export default function useStudyProgress() {
  const [data, setData] = useState(readStorage);

  // Save progress whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Browser storage may be unavailable.
    }
  }, [data]);

  // Mark a lesson as completed or incomplete.
  const setLessonCompleted = useCallback((lessonId, completed) => {
    setData(prev => ({
      ...prev,
      completedLessonIds: completed
        ? Array.from(
            new Set([...prev.completedLessonIds, lessonId])
          )
        : prev.completedLessonIds.filter(id => id !== lessonId)
    }));
  }, []);

  // Add recorded study time for a lesson.
  const addStudySeconds = useCallback((lessonId, seconds) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return;

    setData(prev => ({
      ...prev,
      studySecondsByLesson: {
        ...prev.studySecondsByLesson,
        [lessonId]:
          (prev.studySecondsByLesson[lessonId] || 0) + seconds
      }
    }));
  }, []);

  // Calculate completion percentage.
  const getProgress = useCallback((lessonIds) => {
    const ids = Array.from(new Set(lessonIds));

    const completed = ids.filter(id =>
      data.completedLessonIds.includes(id)
    ).length;

    return {
      completed,
      total: ids.length,
      percent: ids.length
        ? Math.round((completed / ids.length) * 100)
        : 0
    };
  }, [data.completedLessonIds]);

  return {
    data,
    setLessonCompleted,
    addStudySeconds,
    getProgress
  };
}
