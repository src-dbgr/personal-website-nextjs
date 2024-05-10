import React from "react";
import SocialLinks from "../../data/constants/socialLinks";
import Link from "next/link";

const Footer = ({ darkFooter }) => {
  return (
    <div className={`${darkFooter ? "footer" : "footer light-footer"}`}>
      <div>
        <SocialLinks styleClass="footer-links"></SocialLinks>
        <h4>copyright&copy;{new Date().getFullYear()}</h4>
        <div>
          <Link href="/legal" legacyBehavior><a className="legal-disclosure">Legal Notice | Impressum</a></Link>
          <Link href="/privacy" legacyBehavior><a className="legal-disclosure">Privacy Policy | Datenschutzerklärung</a></Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
