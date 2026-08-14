import React, { useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GlobalStateContext } from "../../context/GlobalContextProvider";

const SHOW_AFTER_PX = 400;

const ScrollToTop = () => {
  const { navopen } = useContext(GlobalStateContext);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const updateVisibility = useCallback(() => {
    const y = window.scrollY || document.documentElement.scrollTop;
    setVisible(y > SHOW_AFTER_PX);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(() => {
        updateVisibility();
        ticking = false;
      });
    };
    updateVisibility();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [updateVisibility]);

  useEffect(() => {
    const onDone = () => {
      setVisible(false);
      window.requestAnimationFrame(updateVisibility);
    };
    router.events.on("routeChangeComplete", onDone);
    return () => router.events.off("routeChangeComplete", onDone);
  }, [router.events, updateVisibility]);

  const handleClick = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const main = document.getElementById("main-content");
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    if (main) {
      main.focus({ preventScroll: true });
    }
  };

  const show = visible && !navopen;

  return (
    <button
      type="button"
      className={`scroll-top${show ? " is-visible" : ""}`}
      aria-label="Back to top"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      onClick={handleClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M6.5 14.5 12 9l5.5 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default ScrollToTop;
