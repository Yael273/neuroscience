
import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import "../styles/scroll-to-top.css";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "instant" : "smooth"
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      className="scroll-to-top"
      onClick={scrollToTop}
      aria-label="חזרה לראש העמוד"
      title="חזרה למעלה"
    >
      <ArrowUp size={22} />
    </button>
  );
}
