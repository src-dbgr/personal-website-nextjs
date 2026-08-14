import dynamic from "next/dynamic";
import Cookies from "js-cookie";

import React, { useEffect, useContext } from "react";
import Footer from "../07_footer/Footer";
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../../context/GlobalContextProvider";
import { hasLaunchSeenClass, markLaunchSeen } from "../../lib/bootFlags";

const Launch = dynamic(() => import("../01_launch/Launch"), { ssr: false });

const Layout = ({ children, darkFooter }) => {
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
    Cookies.set("launch_seen", "true", { expires: 7 });
    markLaunchSeen();
    dispatch({ type: "LAUNCH_ANIMATION" });
  };

  const showLaunchOverlay =
    hasMounted && state.animation && !hasLaunchSeenClass();

  return (
    <div>
      {showLaunchOverlay ? (
        <div className="launch-overlay">
          <Launch finishLaunching={handleFinishLaunching} />
        </div>
      ) : null}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer darkFooter={darkFooter} />
    </div>
  );
};

export default Layout;
