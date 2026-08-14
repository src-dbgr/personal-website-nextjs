import React from "react";
import Navbar from "../02_navigation/Navbar";
import Topbar from "../02_navigation/Topbar";
import ScrollToTop from "./ScrollToTop";

/**
 * Navbar + mobile overlay live here so they survive Pages-Router remounts.
 * Overlay close animation can finish while the destination page is already shown underneath.
 * Chrome stays in the first HTML. CSS hides it until theme-init or launch finish
 * marks launch-seen, so first-visit overlay does not race a visible nav.
 */
const PersistentChrome = () => {
  return (
    <div className="persistent-chrome">
      <Navbar />
      <Topbar />
      <ScrollToTop />
    </div>
  );
};

export default PersistentChrome;
