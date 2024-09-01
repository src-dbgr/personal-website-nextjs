import Link from "next/link";
import React, { useContext } from "react";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { ImSoundcloud } from "react-icons/im";
import { MdMessage } from "react-icons/md";
import { GlobalDispatchContext, GlobalStateContext } from "../../context/GlobalContextProvider";
import { useNavigation } from "../../hooks/useNavigation";

const data = [
  {
    id: 1,
    icon: <FaGithub className="social-icon" />,
    url: "https://www.github.com/src-dbgr",
    type: "external",
  },
  {
    id: 2,
    icon: <FaXTwitter className="social-icon" />,
    url: "https://www.x.com/smlblm",
    type: "external",
  },
  {
    id: 3,
    icon: <MdMessage className="social-icon" />,
    url: "/contact",
    type: "internal",
  },
  {
    id: 4,
    icon: <ImSoundcloud className="social-icon" />,
    url: "https://soundcloud.com/ivorycone",
    type: "external",
  },
];

const SocialLinks = ({ styleClass }) => {
  const { handleInternalLinkClick, handleInternalKeyDown, handleExternalKeyDown } = useNavigation();

  const links = data.map((link) => {
    if (link.type === "internal") {
      return (
        <li key={link.id}>
          <Link href={link.url} passHref legacyBehavior>
            <a 
              className="social-link" 
              onClick={(e) => handleInternalLinkClick(e, link.url)}
              onKeyDown={(e) => handleInternalKeyDown(e, link.url)}
            >
              {link.icon}
            </a>
          </Link>
        </li>
      );
    } else {
      return (
        <li key={link.id}>
          <a 
            href={link.url} 
            className="social-link" 
            target="_blank" 
            rel="noopener noreferrer"
            onKeyDown={handleExternalKeyDown}
          >
            {link.icon}
          </a>
        </li>
      );
    }
  });

  return <ul className={`social-links ${styleClass ? styleClass : ""}`}>{links}</ul>;
};

export default SocialLinks;