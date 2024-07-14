import React, { useEffect, useContext } from "react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import Navbar from "../02_navigation/Navbar";
import Topbar from "../02_navigation/Topbar";
import Footer from "../07_footer/Footer";
import CookieConsent from "./CookieConsent";
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../../context/GlobalContextProvider";

const Launch = dynamic(() => import('../01_launch/Launch'), { ssr: false });

const Layout = ({ children, darkFooter, cookies }) => {
  const isIndexPage = true; // TODO ==> Change, compare to location pathname or slug!

  const state = useContext(GlobalStateContext);
  const dispatch = useContext(GlobalDispatchContext);

  const disableCookieConsent = React.useCallback(() => {
    dispatch({ type: "COOKIE_CONSENT" });
  }, [dispatch]);

  const checkCookieState = React.useCallback(() => {
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("CONSENTRXCSQECJWXXK") === "true"
    ) {
      disableCookieConsent();
    }
  }, [disableCookieConsent]);

  useEffect(() => {
    checkCookieState();
  }, [checkCookieState]);

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

  if (typeof window === 'undefined') {
    return null; // or a loading placeholder
  }
  
  // disable in production
  // disabling on first render
  // useEffect(() => {
  //   const noop = () => { };
  //   [
  //     "assert",
  //     "clear",
  //     "count",
  //     "debug",
  //     "dir",
  //     "dirxml",
  //     "error",
  //     "exception",
  //     "group",
  //     "groupCollapsed",
  //     "groupEnd",
  //     "info",
  //     "log",
  //     "markTimeline",
  //     "profile",
  //     "profileEnd",
  //     "table",
  //     "time",
  //     "timeEnd",
  //     "timeline",
  //     "timelineEnd",
  //     "timeStamp",
  //     "trace",
  //     "warn",
  //   ].forEach((method) => {
  //     window.console[method] = noop;
  //   });
  // }, []);
  return (
    <>
      {state.cookieconsentopen && <CookieConsent cookies={cookies} />}
      {isIndexPage && state.animation ? (
        <Launch
          finishLaunching={() => {
            dispatch({ type: "LAUNCH_ANIMATION" });
          }}
        />
      ) : (
        <>
          <Navbar />
          <Topbar />
          <motion.main
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
          </motion.main>
          <Footer darkFooter={darkFooter} />
        </>
      )}
    </>
  );
};

export default Layout;