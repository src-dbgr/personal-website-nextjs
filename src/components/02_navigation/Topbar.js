import { GlobalDispatchContext, GlobalStateContext } from "../../context/GlobalContextProvider";
import React, { useContext, useEffect } from "react";
import PageLinks from "../../data/constants/links";
import SocialLinks from "../../data/constants/socialLinks";

const Topbar = (props) => {
  const dispatch = useContext(GlobalDispatchContext);
  const navopen = useContext(GlobalStateContext).navopen;

  const handleToggle = (e) => {
    // Nur auslösen, wenn direkt auf die aside geklickt wurde
    if (e.target === e.currentTarget) {
      dispatch({ type: "NAV_TOGGLE_LOGO" });
      setTimeout(() => dispatch({ type: "NAV_CIRC" }), 0);
    }
  };

  return (
    <aside
      className={`topbar ${navopen ? "show-topbar" : ""}`}
      onClick={handleToggle}
      onKeyDown={(e) => e.key === 'Escape' && handleToggle(e)}
      role="presentation"
    >
      <div className="top-container">
        <PageLinks styleClass="topbar-links" />
        <SocialLinks styleClass="footer-links"></SocialLinks>
      </div>
    </aside>
  );
};

export default Topbar;