import React, { useEffect } from "react";
import PageLinks from "../../data/constants/links";
import SocialLinks from "../../data/constants/socialLinks";
import { useNavigation } from "../../hooks/useNavigation";

const Topbar = (props) => {
  const { handleTopbarToggle, closeTopbar, navopen } = useNavigation();

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && navopen) {
        closeTopbar();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [navopen, closeTopbar]);

  return (
    <aside
      className={`topbar ${navopen ? "show-topbar" : ""}`}
      onClick={handleTopbarToggle}
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