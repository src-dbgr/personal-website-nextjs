import dynamic from "next/dynamic";
import Cookies from "js-cookie";

const PageWrapper = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

const MotionMain = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.main),
  {
    ssr: false,
    loading: () => <main>Loading...</main>,
  }
);

import React, { useEffect, useContext } from "react";
import Footer from "../07_footer/Footer";
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../../context/GlobalContextProvider";

const Launch = dynamic(() => import("../01_launch/Launch"), { ssr: false });

const StaticShell = ({ children, darkFooter }) => (
  <div data-layout-shell="ssr">
    {/* Navbar touches window at render; marker keeps a visible shell without SSR crash */}
    <header className="navbar" role="banner" data-layout="navbar-marker" />
    <main data-layout="main">{children}</main>
    <Footer darkFooter={darkFooter} />
  </div>
);

const Layout = ({ children, darkFooter }) => {
  const isIndexPage = true; // TODO ==> Change, compare to location pathname or slug!
  const [hasMounted, setHasMounted] = React.useState(false);

  const state = useContext(GlobalStateContext);
  const dispatch = useContext(GlobalDispatchContext);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  function navigateToHash(isActive) {
    const isBrowser = () => typeof window !== "undefined";
    let hash = isBrowser() && window.location.hash;
    if (!!hash) {
      let id = hash.replace("#", "");
      try {
        let node = document.getElementById(id);
        if (node === null) {
          console.log("Location anchor: " + hash + " could not be found");
        } else if (isActive) {
          node.scrollIntoView();
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  useEffect(() => {
    let isActive = true;
    if (!state.animation) {
      navigateToHash(isActive);
    }
    return () => {
      isActive = false;
    };
  }, [state.animation]);

  const handleFinishLaunching = () => {
    // Setze das Cookie 'launch_seen' auf 'true'.
    // expires: 7 days
    Cookies.set("launch_seen", "true", { expires: 7 });

    // Originale Dispatch Funktion aufrufen
    dispatch({ type: "LAUNCH_ANIMATION" });
  };

  // SSR + first client paint: visible shell with page content (AC-04).
  // Launch / framer wrappers only after mount to avoid blank __next and hydration mismatch.
  if (!hasMounted) {
    return (
      <StaticShell darkFooter={darkFooter}>{children}</StaticShell>
    );
  }

  return (
    <>
      {isIndexPage && state.animation ? (
        <Launch finishLaunching={handleFinishLaunching} />
      ) : (
        <PageWrapper
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          <MotionMain
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 0 }}
            transition={{
              type: "spring",
              mass: 0.35,
              stiffness: 75,
              duration: 0.1,
            }}
          >
            {children}
          </MotionMain>
          <Footer darkFooter={darkFooter} />
        </PageWrapper>
      )}
    </>
  );
};

export default Layout;
