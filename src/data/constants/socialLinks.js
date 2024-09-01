import Link from "next/link";
import React, { useContext } from "react";
import { FaGithubAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { ImSoundcloud } from "react-icons/im";
import { IoIosPaperPlane } from "react-icons/io";
import { GlobalDispatchContext, GlobalStateContext } from "../../context/GlobalContextProvider";

const data = [
  {
    id: 1,
    icon: <FaGithubAlt className="social-icon" />,
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
    icon: <IoIosPaperPlane className="social-icon" />,
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
  const dispatch = useContext(GlobalDispatchContext);
  const navopen = useContext(GlobalStateContext).navopen;

  const handleInternalLinkClick = () => {
    if(navopen){
      dispatch({ type: "NAV_TOGGLE_LOGO" });
      setTimeout(() => dispatch({ type: "NAV_CIRC" }), 0);
    }
  };

  const links = data.map((link) => {
    if (link.type === "internal") {
      return (
        <li key={link.id}>
          <Link href={link.url} passHref legacyBehavior>
            <a className="social-link" onClick={handleInternalLinkClick}>{link.icon}</a>
          </Link>
        </li>
      );
    } else {
      return (
        <li key={link.id}>
          <a href={link.url} className="social-link" target="_blank" rel="noopener noreferrer">
            {link.icon}
          </a>
        </li>
      );
    }
  });

  return <ul className={`social-links ${styleClass ? styleClass : ""}`}>{links}</ul>;
};

export default SocialLinks;