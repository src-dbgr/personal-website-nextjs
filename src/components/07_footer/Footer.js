import React, { useContext } from "react";
import SocialLinks from "../../data/constants/socialLinks";
import Link from "next/link";
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../../context/GlobalContextProvider";
import { useNavigation } from "../../hooks/useNavigation";

const Footer = ({ darkFooter }) => {
  const { handleInternalLinkClick, handleInternalKeyDown } = useNavigation();

  return (
    <div className={`${darkFooter ? "footer" : "footer light-footer"}`}>
      <div>
        <SocialLinks styleClass="footer-links"></SocialLinks>
        <h4>copyright&copy;{new Date().getFullYear()}</h4>
        <div>
          <Link href="/legal" legacyBehavior>
            <a
              className="legal-disclosure"
              onClick={(e) => handleInternalLinkClick(e, "/legal")}
              onKeyDown={(e) => handleInternalKeyDown(e, "/legal")}
            >
              Legal Notice | Impressum
            </a>
          </Link>
          <Link href="/privacy" legacyBehavior>
            <a
              className="legal-disclosure"
              onClick={(e) => handleInternalLinkClick(e, "/privacy")}
              onKeyDown={(e) => handleInternalKeyDown(e, "/privacy")}
            >
              Privacy Policy | Datenschutzerklärung
            </a>
          </Link>
          <small className="recaptcha">
            This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and 
            <a href="https://policies.google.com/terms"> Terms of Service
            </a>{" "}
            apply.
          </small>
        </div>
      </div>
    </div>
  );
};

export default Footer;
