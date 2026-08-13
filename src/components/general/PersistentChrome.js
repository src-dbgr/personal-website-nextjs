import React, { useContext, useEffect, useState } from "react";
import Navbar from "../02_navigation/Navbar";
import Topbar from "../02_navigation/Topbar";
import { GlobalStateContext } from "../../context/GlobalContextProvider";

/**
 * Navbar + mobile overlay live here so they survive Pages-Router remounts.
 * Overlay close animation can finish while the destination page is already shown underneath.
 */
const PersistentChrome = () => {
  const { animation } = useContext(GlobalStateContext);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || animation) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Topbar />
    </>
  );
};

export default PersistentChrome;
