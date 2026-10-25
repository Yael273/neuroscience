import { useEffect, useState } from "react";

const KEY = "study-topic-bookmarks-v1";

function readBookmarks() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

export default function useTopicBookmarks(lessonId) {
  const [allBookmarks, setAllBookmarks] = useState(readBookmarks);
  const savedIds = allBookmarks[lessonId] || [];

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(allBookmarks)); }
    catch { /* Storage unavailable, keep working in memory. */ }
  }, [allBookmarks]);

  function toggleBookmark(sectionId) {
    setAllBookmarks(prev => {
      const saved = prev[lessonId] || [];
      return {
        ...prev,
        [lessonId]: saved.includes(sectionId)
          ? saved.filter(id => id !== sectionId)
          : [...saved, sectionId]
      };
    });
  }

  return { savedIds, toggleBookmark };
}
