import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../../context/GlobalContextProvider";
import React, { useEffect, useContext } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import Aos from "aos";
import "aos/dist/aos.css";
// const data = [
//   {
//     id: 1,
//     text: "home",
//     url: "/",
//   },
//   {
//     id: 2,
//     text: "about",
//     url: "/#about",
//   },
//   {
//     id: 3,
//     text: "projects",
//     url: "/projects/",
//   },
//   {
//     id: 4,
//     text: "blog",
//     url: "/blog/",
//   },
//   {
//     id: 5,
//     text: "contact",
//     url: "/contact/",
//   },
// ];

// const tempLinks = data.map((link) => {
//   return (
//     <li
//       key={link.id}
//       data-aos="fade"
//       data-aos-once="true"
//       data-aos-delay={`${(link.id - 1) * 150}`}
//     >
//       <Link to={link.url}>{link.text}</Link>
//     </li>
//   );
// });

const CustomLink = ({ href, children }) => {
  const router = useRouter();
  const dispatch = useContext(GlobalDispatchContext);
  const { navopen } = useContext(GlobalStateContext);

  const handleClick = (e) => {
    e.preventDefault();
    if (navopen) {
      dispatch({ type: "NAV_TOGGLE_LOGO" });
      dispatch({ type: "NAV_CIRC" });

      // Verzögert die navigation um das link menü nicht abrupt zu schliessen
      setTimeout(() => {
        router.push(href);
      }, 450); // css trantisition zeit ->   --transition: all 0.5s ease;
    } else {
      router.push(href);
    }

  };

  return (
    <a href={href} onClick={handleClick}>
      {children}
    </a>
  );
};

const Links = function (props) {
  useEffect(() => {
    Aos.init({ duration: 400 });
  }, []);

  const dispatch = useContext(GlobalDispatchContext);
  const { navanimation, theme } = useContext(GlobalStateContext);

  const handleThemeToggle = () => {
    dispatch({ type: "TOGGLE_THEME" });
    dispatch({ type: "NAV_TOGGLE_LOGO" });
    dispatch({ type: "NAV_CIRC" });
  };

  return (
    <ul className={`page-links ${props.styleClass ? props.styleClass : ""}`}>
      <li
        key="1"
        data-aos={`${navanimation ? "fade-down" : ""}`}
        data-aos-once="true"
        data-aos-delay="0"
      >
        <CustomLink href="/">home</CustomLink>
      </li>
      <li
        key="2"
        data-aos={`${navanimation ? "fade-down" : ""}`}
        data-aos-once="true"
        data-aos-delay={`${navanimation ? "150" : "0"}`}
      >
        <CustomLink href="/about">about</CustomLink>
      </li>
      <li
        key="3"
        data-aos={`${navanimation ? "fade-down" : ""}`}
        data-aos-once="true"
        data-aos-delay={`${navanimation ? "300" : "0"}`}
      >
        <CustomLink href="/projects">projects</CustomLink>
      </li>
      <li
        key="4"
        data-aos={`${navanimation ? "fade-down" : ""}`}
        data-aos-once="true"
        data-aos-delay={`${navanimation ? "450" : "0"}`}
      >
        <CustomLink href="/blog">blog</CustomLink>
      </li>
      <li
        key="5"
        data-aos={`${navanimation ? "fade-down" : ""}`}
        data-aos-once="true"
        data-aos-delay={`${navanimation ? "600" : "0"}`}
      >
        <CustomLink href="/contact">contact</CustomLink>
      </li>

      <div
        id="themeiconwrapper"
        onClick={handleThemeToggle}
        onKeyDown={(e) => e.key === 'Enter' && handleThemeToggle()}
        role="button"
        tabIndex={0}
        data-aos={`${navanimation ? "fade-down" : ""}`}
        data-aos-once="true"
        data-aos-delay={`${navanimation ? "1500" : "0"}`}
      >
        <svg
          id="sunmoon"
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200"
          viewBox="0 0 200 200"
        >
          <path
            id="moon"
            d="M166.8,151.4C81.7,152.9,51.7,39.8,125.2,1.9,61.2-10.3-.7,38.3,0,100.6c-1.8,105,154.3,137.9,200,44.3A86.9,86.9,0,0,1,166.8,151.4Z"
            fill="#212121"
            opacity={`${
              useContext(GlobalStateContext).theme === "dark" ? "1" : "0"
            }`}
          />
          <g
            id="sun"
            fill="#565f61"
            opacity={`${
              useContext(GlobalStateContext).theme === "dark" ? "0" : "1"
            }`}
          >
            <path d="M.4,99.6C10.3,94.2,19.9,89,29.8,83.4v33.1C20.3,110.8,8.6,105.9.4,99.6Z" />
            <path d="M157.8,100c.9,75.4-117.2,75.1-116.1-.1C41,24.6,158.9,25,157.8,100Z" />
            <path d="M116.4,30.1H83.1L99.8.2Z" />
            <path d="M169.6,116.7V83.4l30,16.6Z" />
            <path d="M83.1,169.9h33.3L99.8,199.8Z" />
            <path d="M61.8,38.7,38.5,62.1c-3.1-10.8-6.1-21.6-9.3-32.7Z" />
            <path d="M29.2,170.6c3.2-11.1,6.2-21.9,9.3-32.4l23.1,23.1Z" />
            <path d="M170.4,29.4c-3.2,11.2-6.3,21.9-9.3,32.5L137.9,38.7Z" />
            <path d="M137.6,161.2,161,137.8l9.4,32.8Z" />
          </g>
        </svg>
      </div>
    </ul>
  );
};

export default Links;
