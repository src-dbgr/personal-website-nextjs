import React from "react";
import SocialLinks from "../../data/constants/socialLinks";
import Link from "next/link";
import { useNavigation } from "../../hooks/useNavigation";

const Footer = ({ darkFooter }) => {
  const { handleInternalLinkClick, handleInternalKeyDown } = useNavigation();

  return (
    <div className={`${darkFooter ? "footer" : "footer light-footer"}`}>
      <div>
        <SocialLinks styleClass="footer-links"></SocialLinks>
        <p className="footer-copyright">copyright&copy;{new Date().getFullYear()}</p>
        <div>
          <Link
            href="/legal"
            className="legal-disclosure"
            onClick={(e) => handleInternalLinkClick(e, "/legal")}
            onKeyDown={(e) => handleInternalKeyDown(e, "/legal")}
          >
            Legal Notice
          </Link>
          <Link
            href="/privacy"
            className="legal-disclosure"
            onClick={(e) => handleInternalLinkClick(e, "/privacy")}
            onKeyDown={(e) => handleInternalKeyDown(e, "/privacy")}
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
