import { GlobalDispatchContext,  GlobalStateContext } from "../../context/GlobalContextProvider";
import React, { useContext } from "react";
import PageLinks from "../../data/constants/links";
import SocialLinks from "../../data/constants/socialLinks";

const Topbar = (props) => {
  const dispatch = useContext(GlobalDispatchContext);
  const navopen = useContext(GlobalStateContext).navopen;
  return (
    <aside
      className={`topbar ${navopen ? "show-topbar" : ""}`}
      onClick={() => {
        dispatch({ type: "NAV_TOGGLE_LOGO" });
      }}
      onKeyDown={() => {
        dispatch({ type: "NAV_TOGGLE_LOGO" });
      }}
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
