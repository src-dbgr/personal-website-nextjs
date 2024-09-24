import Link from "next/link";
import Image from 'next/image';
import React, { useContext } from "react";
import { FaSquareGithub } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { ImSoundcloud2 } from "react-icons/im";
import { FaEnvelopeSquare } from "react-icons/fa";
import { GlobalDispatchContext, GlobalStateContext } from "../../context/GlobalContextProvider";
import { useNavigation } from "../../hooks/useNavigation";

const BlueskyIcon = () => (
  <svg viewBox="20.398 24.597 448 448" xmlns="http://www.w3.org/2000/svg" className="social-icon-svg">
    <path d="M 404.398 24.597 C 439.698 24.597 468.398 53.297 468.398 88.597 L 468.398 408.597 C 468.398 443.897 439.698 472.597 404.398 472.597 L 84.398 472.597 C 49.098 472.597 20.398 443.897 20.398 408.597 L 20.398 88.597 C 20.398 53.297 49.098 24.597 84.398 24.597 Z M 308.331 270.322 C 306.504 270.1 304.62 269.879 302.79 269.602 C 304.675 269.824 306.504 270.1 308.331 270.322 Z M 241.949 232.865 C 227.486 204.77 188.144 152.407 151.573 126.584 C 116.497 101.816 103.143 106.082 94.333 110.071 C 84.193 114.672 82.364 130.242 82.364 139.385 C 82.364 148.528 87.406 214.523 90.676 225.55 C 101.481 261.956 140.048 274.257 175.566 270.268 C 177.395 269.99 179.224 269.769 181.107 269.491 C 179.278 269.769 177.451 270.045 175.566 270.268 C 123.535 278.024 77.32 296.975 137.942 364.41 C 204.601 433.454 229.26 349.616 241.949 307.116 C 254.639 349.616 269.211 430.406 344.793 364.41 C 401.534 307.116 360.363 277.969 308.331 270.268 C 306.504 270.045 304.62 269.824 302.79 269.548 C 304.675 269.769 306.504 270.045 308.331 270.268 C 343.851 274.202 382.362 261.901 393.224 225.55 C 396.492 214.523 401.534 148.583 401.534 139.385 C 401.534 130.186 399.706 114.616 389.565 110.071 C 380.81 106.137 367.401 101.816 332.38 126.584 C 295.753 152.407 256.411 204.77 241.949 232.865 Z" />
  </svg>
);

const data = [
  {
    id: 1,
    icon: <FaSquareGithub className="social-icon" />,
    url: "https://www.github.com/src-dbgr",
    type: "external",
  },
  {
    id: 2,
    icon: <BlueskyIcon />,
    url: "https://bsky.app/profile/devsam.bsky.social",
    type: "external",
  },  
  {
    id: 3,
    icon: <FaSquareXTwitter className="social-icon" />,
    url: "https://www.x.com/smlblm",
    type: "external",
  },
  {
    id: 4,
    icon: <FaEnvelopeSquare className="social-icon" />,
    url: "/contact",
    type: "internal",
  },
  {
    id: 5,
    icon: <ImSoundcloud2 className="social-icon soundcloud" />,
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