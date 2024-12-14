import {
  GlobalStateContext,
  GlobalDispatchContext,
} from "../../context/GlobalContextProvider";
import React, { useState, useEffect, useContext, useRef } from "react";
import anime from "animejs";
import "aos/dist/aos.css";
import PageLinks from "../../data/constants/links";

const Navbar = (props) => {
  const [scaleTrigger, setScaleTrigger] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const mounted = useRef(false);
  const firstrender = useRef(true);
  const animationDuration = 500;
  const downTopPath = "M0,0,124.3,250,250,0Z";
  const upTopPath = "M250,250,125.7,0,0,250Z";
  const navopen = useContext(GlobalStateContext).navopen;
  const navcircanim = useContext(GlobalStateContext).navcircanim;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const animation = (params) => {
    return anime({
      targets: "#triangle_nav",
      easing: "easeInOutSine",
      duration: animationDuration,
      autoplay: false,
      d: [{ value: params }],
      loop: false,
    });
  };

  function disableScrolling() {
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function () {
      window.scrollTo(x, y);
    };
    document.documentElement.style.overflow = "hidden";
  }

  function enableScrolling() {
    window.onscroll = null;
    document.documentElement.style.overflow = "visible";
  }

  useEffect(() => {
    let isactive = true;
    if (navopen) {
      if (mounted.current && isactive) {
        animation(upTopPath).play();
      }
      if (isactive) {
        disableScrolling();
      }
    } else {
      if (mounted.current && isactive) {
        animation(downTopPath).play();
      }
      if (isactive) {
        enableScrolling();
      }
    }
    if (!firstrender.current) {
      if (mounted.current && isactive) {
        setScaleTrigger(true);
      }
      setTimeout(() => {
        if (mounted.current && isactive) {
          setScaleTrigger(false);
        }
      }, 500);
    }
    firstrender.current = false;
    return () => {
      enableScrolling();
      isactive = false;
    };
  }, [navopen]);

  let prevScrollpos = window.pageYOffset;
  const controlNavbarVisibility = () => {
    if (window.scrollY > 50) {
      let currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
      prevScrollpos = currentScrollPos;
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbarVisibility);
    return () => {
      window.removeEventListener("scroll", controlNavbarVisibility);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let alive = true;
    if (navanimation) {
      // Dynamisches Laden von Aos
      import("aos").then((Aos) => {
        Aos.init({ duration: 1000 });
        setTimeout(() => {
          if (alive) {
            dispatch({ type: "NAV_ANIMATION" });
          }
        }, 1200);
      });
    }

    return () => {
      import("aos").then((Aos) => {
        // Disable Animation afer initial execution
        Aos.init({ duration: 0 });
      });
      alive = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dispatch = useContext(GlobalDispatchContext);
  const theme = useContext(GlobalStateContext).theme;
  const navanimation = useContext(GlobalStateContext).navanimation;

  const handleToggle = () => {
    setTimeout(() => dispatch({ type: "NAV_TOGGLE_LOGO" }));
    setTimeout(() => dispatch({ type: "NAV_CIRC" }));
  };

  return (
    <nav
      className={`${navopen
        ? showNavbar
          ? "navbar navbar_open blurred-container"
          : "navbar_disappear blurred-container"
        : showNavbar
          ? "navbar navbar_closed blurred-container"
          : "navbar_disappear blurred-container"
        }`}
    >
      <div className="nav-center">
        <div className="nav-header">
          <div id="nav_main_logo_wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="224.3"
              height="208.1"
              viewBox="0 0 224.3 208.1"
              id="nav_main_logo"
              data-aos={`${navanimation ? "fade" : ""}`}
              data-aos-once="true"
              data-aos-delay={`${navanimation ? "1500" : ""}`}
            >
              <defs>
                <radialGradient
                  id="UV"
                  cx="135.23"
                  cy="79.11"
                  r="70"
                  data-name="Unbenannter Verlauf"
                  gradientTransform="matrix(1.12 0 0 -1.12 -39.26 217.5)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#9a988e"></stop>
                  <stop offset="1" stopColor="#51656a"></stop>
                </radialGradient>
                <linearGradient
                  id="2"
                  x1="37.9"
                  x2="262.1"
                  y1="93.4"
                  y2="93.4"
                  data-name="2"
                  gradientTransform="matrix(1 0 0 -1 -37.8 190.4)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#ac4a9c"></stop>
                  <stop offset="1" stopColor="#00af64"></stop>
                </linearGradient>
                <linearGradient
                  id="3"
                  x1="170.5"
                  x2="245.8"
                  y1="-0.05"
                  y2="-0.05"
                  data-name="3"
                  gradientTransform="matrix(1 0 0 -1 -21.5 177.3)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#9669a4"></stop>
                  <stop offset="1" stopColor="#456b4d"></stop>
                </linearGradient>
                <linearGradient
                  id="4"
                  x1="189.77"
                  x2="244.97"
                  y1="16.55"
                  y2="16.55"
                  data-name="4"
                  xlinkHref="#3"
                ></linearGradient>
                <linearGradient
                  id="5"
                  x1="22.2"
                  x2="77.7"
                  y1="16.35"
                  y2="16.35"
                  data-name="5"
                  xlinkHref="#3"
                ></linearGradient>
                <linearGradient
                  id="6"
                  x1="21.6"
                  x2="96.7"
                  y1="-0.15"
                  y2="-0.15"
                  data-name="6"
                  xlinkHref="#3"
                ></linearGradient>
                <linearGradient
                  id="7"
                  x1="133.96"
                  x2="189.76"
                  y1="16.05"
                  y2="16.05"
                  data-name="7"
                  gradientTransform="matrix(1 0 0 -1 -21.5 177.3)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#b34575"></stop>
                  <stop offset="1" stopColor="#248d64"></stop>
                </linearGradient>
                <linearGradient
                  id="8"
                  x1="77.7"
                  x2="133.97"
                  y1="16.05"
                  y2="16.05"
                  data-name="8"
                  xlinkHref="#7"
                ></linearGradient>
                <linearGradient
                  id="9"
                  x1="59.2"
                  x2="133.9"
                  y1="48.75"
                  y2="48.75"
                  data-name="9"
                  xlinkHref="#7"
                ></linearGradient>
                <linearGradient
                  id="10"
                  x1="133.9"
                  x2="208.1"
                  y1="48.7"
                  y2="48.7"
                  data-name="10"
                  xlinkHref="#7"
                ></linearGradient>
                <linearGradient
                  id="11"
                  x1="78"
                  x2="133.9"
                  y1="81.15"
                  y2="81.15"
                  data-name="11"
                  xlinkHref="#7"
                ></linearGradient>
                <linearGradient
                  id="12"
                  x1="133.96"
                  x2="189.4"
                  y1="81.15"
                  y2="81.15"
                  data-name="12"
                  xlinkHref="#7"
                ></linearGradient>
                <linearGradient
                  id="13"
                  x1="96.75"
                  x2="133.95"
                  y1="145.4"
                  y2="145.4"
                  data-name="13"
                  gradientTransform="matrix(1 0 0 -1 -21.5 177.3)"
                  xlinkHref="#2"
                ></linearGradient>
                <linearGradient
                  id="14"
                  x1="133.96"
                  x2="170.56"
                  y1="145.1"
                  y2="145.1"
                  data-name="14"
                  gradientTransform="matrix(1 0 0 -1 -21.5 177.3)"
                  xlinkHref="#2"
                ></linearGradient>
                <linearGradient
                  id="912"
                  x1="37.8"
                  x2="262"
                  y1="92.55"
                  y2="92.55"
                  data-name="912"
                  gradientTransform="matrix(1 0 0 -1 -37.8 190.4)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#85328b"></stop>
                  <stop offset="1" stopColor="#3bb44a"></stop>
                </linearGradient>
                <radialGradient
                  id="673"
                  cx="135.14"
                  cy="78.35"
                  r="70"
                  data-name="673"
                  gradientTransform="matrix(1.12 0 0 -1.12 -39.26 217.5)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#84ab8e"></stop>
                  <stop offset="1" stopColor="#3d3356"></stop>
                </radialGradient>
                <linearGradient
                  id="668"
                  x1="170.4"
                  x2="245.7"
                  y1="-0.9"
                  y2="-0.9"
                  data-name="668"
                  gradientTransform="matrix(1 0 0 -1 -21.5 177.3)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#957448"></stop>
                  <stop offset="1" stopColor="#3d3356"></stop>
                </linearGradient>
                <linearGradient
                  id="668-2"
                  x1="189.67"
                  x2="244.87"
                  y1="15.7"
                  y2="15.7"
                  xlinkHref="#668"
                ></linearGradient>
                <linearGradient
                  id="668-3"
                  x1="22.1"
                  x2="77.6"
                  y1="15.5"
                  y2="15.5"
                  xlinkHref="#668"
                ></linearGradient>
                <linearGradient
                  id="668-4"
                  x1="21.5"
                  x2="96.6"
                  y1="-1"
                  y2="-1"
                  xlinkHref="#668"
                ></linearGradient>
                <linearGradient
                  id="912-2"
                  x1="133.86"
                  x2="189.66"
                  y1="15.2"
                  y2="15.2"
                  gradientTransform="matrix(1 0 0 -1 -21.5 177.3)"
                  xlinkHref="#912"
                ></linearGradient>
                <linearGradient
                  id="912-3"
                  x1="77.6"
                  x2="133.87"
                  y1="15.2"
                  y2="15.2"
                  gradientTransform="matrix(1 0 0 -1 -21.5 177.3)"
                  xlinkHref="#912"
                ></linearGradient>
                <linearGradient
                  id="912-4"
                  x1="59.1"
                  x2="133.8"
                  y1="47.9"
                  y2="47.9"
                  gradientTransform="matrix(1 0 0 -1 -21.5 177.3)"
                  xlinkHref="#912"
                ></linearGradient>
                <linearGradient
                  id="912-5"
                  x1="133.8"
                  x2="208"
                  y1="47.85"
                  y2="47.85"
                  gradientTransform="matrix(1 0 0 -1 -21.5 177.3)"
                  xlinkHref="#912"
                ></linearGradient>
                <linearGradient
                  id="912-6"
                  x1="77.9"
                  x2="133.8"
                  y1="80.3"
                  y2="80.3"
                  gradientTransform="matrix(1 0 0 -1 -21.5 177.3)"
                  xlinkHref="#912"
                ></linearGradient>
                <linearGradient
                  id="912-7"
                  x1="133.86"
                  x2="189.3"
                  y1="80.3"
                  y2="80.3"
                  gradientTransform="matrix(1 0 0 -1 -21.5 177.3)"
                  xlinkHref="#912"
                ></linearGradient>
                <linearGradient
                  id="912-8"
                  x1="96.65"
                  x2="133.85"
                  y1="144.55"
                  y2="144.55"
                  gradientTransform="matrix(1 0 0 -1 -21.5 177.3)"
                  xlinkHref="#912"
                ></linearGradient>
                <linearGradient
                  id="912-9"
                  x1="133.86"
                  x2="170.46"
                  y1="144.25"
                  y2="144.25"
                  gradientTransform="matrix(1 0 0 -1 -21.5 177.3)"
                  xlinkHref="#912"
                ></linearGradient>
              </defs>
              <g id="light" opacity={`${theme === "dark" ? "0" : "1"}`}>
                <circle cx="112.2" cy="128.9" r="78.4" fill="url(#UV)"></circle>
                <path
                  fill="url(#2)"
                  d="M223.4 192.6L186.6 128.9 167.9 96.5 149 63.8 112.4 0.6 112.1 0 75.2 63.8 56.5 96.2 37.7 128.9 0.7 193 0.1 193.9 75.2 194 112.4 194 149 194 224.3 194 223.4 192.6z"
                ></path>
                <path
                  fill="url(#3)"
                  d="M149 194L224.3 194 223.4 192.6 168.2 160.7 149 194z"
                ></path>
                <path
                  fill="url(#4)"
                  d="M168.2 160.7L223.4 192.6 186.6 128.9 168.2 160.7z"
                ></path>
                <path
                  fill="url(#5)"
                  d="M37.7 128.9L0.7 193 56.2 160.9 37.7 128.9z"
                ></path>
                <path
                  fill="url(#6)"
                  d="M0.7 193L0.1 193.9 75.2 194 56.2 160.9 0.7 193z"
                ></path>
                <path
                  fill="url(#7)"
                  d="M112.4 128.5L112.4 194 149 194 168.2 160.7 112.4 128.5z"
                ></path>
                <path
                  fill="url(#8)"
                  d="M112.4 128.5L112.4 128.5 56.2 160.9 75.2 194 112.4 194 112.4 128.5z"
                ></path>
                <path
                  fill="url(#9)"
                  d="M112.4 128.5L56.5 96.2 37.7 128.9 56.2 160.9 112.4 128.5z"
                ></path>
                <path
                  fill="url(#10)"
                  d="M112.4 128.5L112.4 128.5 168.2 160.7 186.6 128.9 167.9 96.5 112.4 128.5z"
                ></path>
                <path
                  fill="url(#11)"
                  d="M112.4 128.5L112.4 128.5 112.4 63.8 75.2 63.8 56.5 96.2 112.4 128.5z"
                ></path>
                <path
                  fill="url(#12)"
                  d="M112.4 128.5L167.9 96.5 149 63.8 112.4 63.8 112.4 128.5z"
                ></path>
                <path
                  fill="url(#13)"
                  d="M112.4 0.6L112.1 0 75.2 63.8 112.4 63.8 112.4 0.6z"
                ></path>
                <path
                  fill="url(#14)"
                  d="M149 63.8L112.4 0.6 112.4 63.8 149 63.8z"
                ></path>
              </g>
              <g id="dark" opacity={`${theme === "dark" ? "0.7" : "0"}`}>
                <path
                  fill="url(#912)"
                  d="M223.3 193.4L186.5 129.8 167.8 97.3 148.9 64.7 112.3 1.4 112 0.8 75.1 64.7 56.4 97 37.6 129.8 0.6 193.8 0 194.8 75.1 194.8 112.3 194.8 148.9 194.8 224.2 194.8 223.3 193.4z"
                ></path>
                <circle
                  cx="112.1"
                  cy="129.7"
                  r="78.4"
                  fill="url(#673)"
                ></circle>
                <path
                  fill="url(#668)"
                  d="M148.9 194.8L224.2 194.8 223.3 193.4 168.1 161.6 148.9 194.8z"
                ></path>
                <path
                  fill="url(#668-2)"
                  d="M168.1 161.6L223.3 193.4 186.5 129.8 168.1 161.6z"
                ></path>
                <path
                  fill="url(#668-3)"
                  d="M37.6 129.8L0.6 193.8 56.1 161.8 37.6 129.8z"
                ></path>
                <path
                  fill="url(#668-4)"
                  d="M0.6 193.8L0 194.8 75.1 194.8 56.1 161.8 0.6 193.8z"
                ></path>
                <path
                  fill="url(#912-2)"
                  d="M112.3 129.3L112.3 194.8 148.9 194.8 168.1 161.6 112.3 129.3z"
                ></path>
                <path
                  fill="url(#912-3)"
                  d="M112.3 129.3L112.3 129.3 56.1 161.8 75.1 194.8 112.3 194.8 112.3 129.3z"
                ></path>
                <path
                  fill="url(#912-4)"
                  d="M112.3 129.3L56.4 97 37.6 129.8 56.1 161.8 112.3 129.3z"
                ></path>
                <path
                  fill="url(#912-5)"
                  d="M112.3 129.3L112.3 129.3 168.1 161.6 186.5 129.8 167.8 97.3 112.3 129.3z"
                ></path>
                <path
                  fill="url(#912-6)"
                  d="M112.3 129.3L112.3 129.3 112.3 64.7 75.1 64.7 56.4 97 112.3 129.3z"
                ></path>
                <path
                  fill="url(#912-7)"
                  d="M112.3 129.3L167.8 97.3 148.9 64.7 112.3 64.7 112.3 129.3z"
                ></path>
                <path
                  fill="url(#912-8)"
                  d="M112.3 1.4L112 0.8 75.1 64.7 112.3 64.7 112.3 1.4z"
                ></path>
                <path
                  fill="url(#912-9)"
                  d="M148.9 64.7L112.3 1.4 112.3 64.7 148.9 64.7z"
                ></path>
              </g>
            </svg>
          </div>
          <button
        type="button"
        className="toggle-btn"
        onClick={handleToggle}
      >
            <svg
              id="toggle"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="250"
              height="250"
              viewBox="0 0 250 250"
            >
              <defs>
                <radialGradient
                  id="circle_gradient"
                  data-name="circle_gradient"
                  cx="125"
                  cy="125"
                  r="125"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#9a988e"></stop>
                  <stop offset="1" stopColor="#51656a"></stop>
                </radialGradient>
                <linearGradient
                  id="triangle_gradient"
                  data-name="triangle_gradient"
                  x1="512.1"
                  y1="121.4"
                  x2="762.1"
                  y2="121.4"
                  gradientTransform="matrix(-1, 0, 0, 1, 762.1, 3.6)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#ac4a9c"></stop>
                  <stop offset="1" stopColor="#00af64"></stop>
                </linearGradient>
                <linearGradient
                  id="circle_gradient_magenta"
                  data-name="circle_gradient_magenta"
                  x1="187.28"
                  y1="232.76"
                  x2="62.42"
                  y2="16.49"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#9769a4"></stop>
                  <stop offset="0.3" stopColor="#52666b"></stop>
                  <stop offset="1" stopColor="#9a988e"></stop>
                </linearGradient>
                <linearGradient
                  id="circle_gradient_green"
                  data-name="circle_gradient_green"
                  x1="187.28"
                  y1="232.76"
                  x2="62.42"
                  y2="16.49"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#b5b2a6"></stop>
                  <stop offset="0.7" stopColor="#51656b"></stop>
                  <stop offset="1" stopColor="#32a169"></stop>
                </linearGradient>
              </defs>
              <path
                id="circle_nav"
                d="M125,0A125,125,0,1,0,250,125,125,125,0,0,0,125,0Z"
                fill="url(#circle_gradient)"
                className={`${scaleTrigger ? "scale" :
                  !scaleTrigger && navcircanim ? "circle_nav_animation" :
                    "stop-nav-animation"
                  }`}
              ></path>
              <path
                id="triangle_nav"
                d="M0,0,124.3,250,250,0Z"
                fill={`${navopen
                  ? "url(#circle_gradient_magenta)"
                  : "url(#circle_gradient_green)"
                  }`}
              ></path>
            </svg>
          </button>
        </div>
        <PageLinks styleClass="nav-links"></PageLinks>
      </div>
    </nav>
  );
};

export default Navbar;
