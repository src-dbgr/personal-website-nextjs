import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import anime from "animejs";
import Seo from "../general/Seo";
import { GlobalStateContext } from "../../context/GlobalContextProvider";

let introAnimationDisabled = false;

const Launch = (props) => {
  const router = useRouter();
  const { pathname, query } = router;
  const theme = useContext(GlobalStateContext).theme;

  useEffect(() => {

    const skipParams = ['n', 'a', 'sk'];
    
    introAnimationDisabled = Object.keys(query).some(key => {
      return skipParams.some(param => 
        key.toLowerCase().includes(param.toLowerCase())
      );
    });

    function isIE() {
      const ua = window.navigator.userAgent;
      const msie = ua.indexOf("MSIE "); // IE 10 or older
      const trident = ua.indexOf("Trident/"); //IE 11
      return msie > 0 || trident > 0;
    }
    function clickIE(e) {
      try {
        document
          .querySelector("#triangle")
          .removeEventListener("click", clickIE);
        document.body.removeChild(
          document.getElementsByClassName("imagewrapper")
        );
        console.log("Removing Image Wrapper!");
      } catch (err) {
        console.log("issue occured checking for internet explorer");
        console.error(err);
      }
    }

    function skipAnimation() {
      if (theme === 'dark') {
        document.documentElement.classList.remove("dark-launch-style");
      } else {
        document.documentElement.classList.remove("light-launch-style");
      }
      props.finishLaunching();
    }

    if (isIE()) {
      try {
        document.querySelector("#logo").style.opacity = 1;
        document.getElementById("triangle").onclick = clickIE; //onclick event
      } catch (err) {
        console.log("issue occured selecting document elements");
        console.error(err);
      }
    } else if (introAnimationDisabled) {
      skipAnimation();
    } else {
      let launchAnimation = function () {
        try {
          let logoEl = document.querySelector("#logo");
          let trianglePathEls = logoEl.querySelectorAll(
            "#triangle polygon:not(#_12triangleback)"
          );
          let pathLength = trianglePathEls.length;
          let aimations = [];

          let breathAnimation = anime({
            begin: function () {
              for (let i = 0; i < pathLength; i++) {
                aimations.push(
                  anime({
                    targets: trianglePathEls[i],
                    stroke: {
                      value: [`${theme === "dark" ? "rgb(61, 139, 104)" : "rgba(150, 149, 141, 0.8)"}`],
                      duration: 1000,
                    },
                    strokeWidth: [0, 1.5],
                    translateX: [2, -4],
                    translateY: [2, -4],
                    opacity: [0.3, 1],
                    easing: "easeOutQuad",
                    autoplay: false,
                  })
                );
              }
            },
            update: function (ins) {
              aimations.forEach(function (animation, i) {
                let percent =
                  (1 - Math.sin(i * 0.35 + 0.0022 * ins.currentTime)) / 2;
                animation.seek(animation.duration * percent);
              });
            },
            duration: Infinity,
            autoplay: false,
          });

          let introAnimation = anime
            .timeline({
              autoplay: false,
            })
            .add({
              targets: trianglePathEls,
              strokeDashoffset: {
                value: [anime.setDashoffset, 0],
                duration: 3900,
                easing: "easeInOutCirc",
                delay: anime.stagger(190, { direction: "reverse" }),
              },

              duration: 2000,
              delay: anime.stagger(60, { direction: "reverse" }),
              easing: "linear",
              complete: function (anim) {
                introAnimation.remove();
              },
            });

          function startElementMotion() {
            introAnimation.play();
            breathAnimation.play();
          }

          function pauseElementMotion() {
            introAnimation.pause();
            breathAnimation.pause();
          }

          let tl_stop = anime.timeline({
            easing: "easeOutExpo",
            duration: 500,
            autoplay: false,
          });

          tl_stop
            .add({
              targets: "#description, #outercircle",
              rotate: [0, 360],
              transformOrigin: ["50% 50% 0", "50% 60% 0"],
              scale: 0.5,
              opacity: 0,
            })
            .add({
              targets: "#innercircle",
              opacity: 0,
              scale: 1.4,
              transformOrigin: ["50% 50% 0", "50% 50% 0"],
            })
            .add({
              targets: "#triangle polygon",
              translateX: anime.stagger(10, {
                grid: [1, -150],
                from: "center",
                axis: "x",
              }),
              translateY: anime.stagger(10, {
                grid: [1, -150],
                from: "center",
                axis: "y",
              }),
              rotateZ: anime.stagger([0, 90], {
                grid: [14, 5],
                from: "center",
                axis: "x",
              }),
              delay: function (el, i) {
                return i * 100;
              },
              easing: "easeInOutSine",
              complete: function (anim) {
                tl_stop.remove();
              },
            });

          let animTimeout = 1000;
          let killAnimationTriggered = false;
          let iteration = 1; // set to 0 if you want to enable customization of the intro animation duration
          function killAnimation(e) {

            if (theme === 'dark') {
              document.documentElement.classList.remove("dark-launch-style");
            } else {
              document.documentElement.classList.remove("light-launch-style");
            }
            if (!killAnimationTriggered) {
              if (iteration < 1) {
                ++iteration;
                if (e.code === 'customIdentifier') {
                  console.log("Automatically")
                  setTimeout(killAnimation, 2000, e); // timeout determines the duration of the intro animation before it decays
                  return
                }
              }
              const triangle = document.querySelector(
                "#triangle #_12triangleback"
              );
              if (triangle) {
                triangle.style.opacity = 0;
                tl_stop.play();
                pauseElementMotion();
                document
                  .querySelector("#triangle")
                  .removeEventListener("click", killAnimation);
                document.body.removeEventListener(
                  "keydown",
                  keyDownEnterEvent,
                  true
                );
                // document.body.removeEventListener("keydown", killAnimation, true);
                if (e instanceof Event && e.code !== "customIdentifier") {
                  // this section stops the animation immediately since
                  // the user killed the animation
                  props.finishLaunching();
                } else {
                  // this section ends the animation smoothly with polygon decay
                  // applies when everything runs without user interruption

                  finishLaunchWrapper(0);
                }
                killAnimationTriggered = !killAnimationTriggered;
              }
            }
          }

          // Wrap Exit Function in order to avoid timout browser violation
          function finishLaunchWrapper(counter) {
            counter = counter + 1;
            if (counter === 3) {
              // has the effect that the timout is divided by
              setTimeout(props.finishLaunching, animTimeout);
            } else {
              setTimeout(finishLaunchWrapper, animTimeout, counter);
            }
          }

          function startAnimation() {
            let tl_start = anime.timeline({
              easing: "easeOutExpo",
              duration: animTimeout,
            });

            tl_start
              .add({
                targets: "#outercircle",
                opacity: 1,
                transformOrigin: ["50% 50% 0", "50% 50% 0"],
                scale: [0, 0.5, 1],
              })
              .add({
                targets: "#triangle,#innercircle",
                transformOrigin: ["50% 50% 0", "50% 50% 0"],
                opacity: [0, 0.2, 0.5, 0.95],
                rotate: [0, 1080],
                scale: [0, 0.2, 1.1, 1],
              })
              .add({
                targets: "#description",
                opacity: [0, 1],
              })
              .add({
                targets: "#triangle",
                transformOrigin: ["50% 55% 0", "50% 55% 0"],
                rotate: [0, 720],
                complete: function (anim) {
                  tl_start.remove();
                },
              });

            return tl_start;
          }

          // kick off animation
          function initialAnimation() {
            // make background layer invisible
            let nodes = document.querySelectorAll(
              "#description,#outercircle,#innercircle,#triangle,#_12triangleback"
            );

            document.querySelector("#_12triangleback").style.opacity = 0;
            Array.from(nodes).forEach(function (item) {
              item.style.opacity = 0;
            });

            // in order to not render on load up make logo visible later
            document.querySelector("#logo").style.opacity = 1;
            let startAnim = startAnimation();
            startAnim.play();
            // delayed start of polygon motion
            setTimeout(startElementMotion, animTimeout * 3);
          }

          let triangleElement = document.querySelector("#triangle");
          triangleElement.onclick = killAnimation;
          function keyDownEnterEvent(event) {
            if (event.defaultPrevented) {
              return;
            }
            var handled = false;
            // if (event.keyCode === 13) {
            //   killAnimation();
            // }

            if (event.key !== undefined) {
              // Handle the event with KeyboardEvent.key and set handled true.
              if (event.key === "Enter") {
                killAnimation(event);
                handled = true;
              }
            } else if (event.keyIdentifier !== undefined) {
              // Handle the event with KeyboardEvent.keyIdentifier and set handled true.
              if (event.key === "Enter") {
                killAnimation(event);
                handled = true;
              }
            } else if (event.keyCode !== undefined) {
              if (event.key === "Enter") {
                killAnimation(event);
                handled = true;
              }
              // Handle the event with KeyboardEvent.keyCode and set handled true.
            }

            if (handled) {
              event.preventDefault();
            }
          }
          document.body.addEventListener("keydown", keyDownEnterEvent, true);

          return initialAnimation;
        } catch (err) {
          console.log("issue occured during launch animation setup");
          console.error(err);
        }
      };
      launchAnimation()();

      function descriptionAnimation() {
        try {
          let letters = document.querySelectorAll("#description path");
          let printSpeed = 100; // ms
          let startDelay = 2000; // ms
          Array.from(letters).forEach(function (letter) {
            letter.style.opacity = "0";
          });

          function enableDescriptionLetters(letter, callback) {
            letter.style.opacity = "1";
            if (callback && typeof callback === "function") {
              setTimeout(callback, printSpeed * 5); // set little timeout to print final letter.
            }
          }

          // function colorizeDescriptionLetters(letter, color) {
          //   letter.style.fill = color;
          // }

          function makeDescriptionVisible(
            callback,
            execDelay,
            execStartDelay,
            color
          ) {
            let delay = execDelay;
            let startDelay = execStartDelay;
            Array.from(letters).forEach(function (letter, index) {
              // delay typing at the following letter indizes
              startDelay +=
                index === 3 || index === 13 || index === 12 ? delay * 5 : 0;
              // return setTimeout(callback, (startDelay += delay), letter, color);
              if (index === letters.length - 1) {
                return setTimeout(
                  callback,
                  (startDelay += delay),
                  letter,
                  () => {
                    // anonymous inner callback, simulates a key down event to stop animation and launch page
                    document.body.dispatchEvent(
                      new KeyboardEvent("keydown", {
                        key: "Enter",
                        keyCode: 13, // Enter keyCode
                        code: "customIdentifier", // identify that this keystroke is triggered automatically
                        which: 13,
                        shiftKey: false,
                        ctrlKey: false,
                        metaKey: false,
                      })
                    );
                  }
                );
              } else {
                return setTimeout(callback, (startDelay += delay), letter);
              }
            });
          }

          makeDescriptionVisible(
            enableDescriptionLetters,
            printSpeed,
            startDelay
          );

          // colorization also possible, turn off css keyframe animation beforehand
          // makeDescriptionVisible(
          //   colorizeDescriptionLetters,
          //   printSpeed,
          //   startDelay + 100,
          //   "rgb(181, 178, 166)"
          // );
        } catch (err) {
          console.log("issue occured during animation description launch");
          console.error(err);
        }
      }

      descriptionAnimation();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Seo title="Launch" description={"test"} />
      <div className="imagewrapper">
        <svg
          id="logo"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 300 260"
        >
          <defs>
            <radialGradient
              id="Unbenannter_Verlauf_249"
              data-name="Unbenannter Verlauf 249"
              cx={189.92}
              cy={206.48}
              r={99.62}
              gradientTransform="translate(-62.8 -82.7) scale(1.12 1.12)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset={0} stopColor="#344549" />
              <stop offset={0.14} stopColor="#4c5859" />
              <stop offset={0.39} stopColor="#6e7470" />
              <stop offset={0.61} stopColor="#868881" />
              <stop offset={0.83} stopColor="#95948b" />
              <stop offset={1} stopColor="#9a988e" />
            </radialGradient>
            <radialGradient
              id="Unbenannter_Verlauf_999"
              data-name="Unbenannter Verlauf 249"
              cx={189.92}
              cy={206.48}
              r={99.62}
              gradientTransform="translate(-62.8 -82.7) scale(1.12 1.12)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset={0.70} stopColor="rgba(53, 53, 53, 0.7)" />
              <stop offset={0.71} stopColor="rgba(61, 139, 104, 0.7)" />
              <stop offset={0.76} stopColor="rgba(61, 139, 104, 0.7)" />
              <stop offset={0.77} stopColor="rgba(53, 53, 53, 0.7)" />
              <stop offset={1} stopColor="rgba(53, 53, 53, 0.7)" />
            </radialGradient>
            <radialGradient
              id="Unbenannter_Verlauf_1075"
              data-name="Unbenannter Verlauf 1075"
              cx={189.92}
              cy={206.48}
              r={70}
              gradientTransform="translate(-62.8 -82.7) scale(1.12 1.12)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset={0} stopColor="#9a988e" />
              <stop offset={1} stopColor="#51656a" />
            </radialGradient>
            <linearGradient
              id="Unbenannter_Verlauf_1258"
              data-name="Unbenannter Verlauf 1258"
              x1={77.94}
              y1={176.54}
              x2={302.1}
              y2={176.54}
              gradientTransform="translate(-40.1 -60)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset={0} stopColor="#ac4a9c" />
              <stop offset={1} stopColor="#00af64" />
            </linearGradient>
            <linearGradient
              id="Unbenannter_Verlauf_278"
              data-name="Unbenannter Verlauf 278"
              x1={210.53}
              y1={270.01}
              x2={285.78}
              y2={270.01}
              gradientTransform="translate(-23.8 -73.1)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset={0} stopColor="#9669a4" />
              <stop offset={1} stopColor="#456b4d" />
            </linearGradient>
            <linearGradient
              id="Unbenannter_Verlauf_1265"
              data-name="Unbenannter Verlauf 1265"
              x1={229.77}
              y1={253.41}
              x2={284.97}
              y2={253.41}
              xlinkHref="#Unbenannter_Verlauf_278"
            />
            <linearGradient
              id="Unbenannter_Verlauf_1269"
              data-name="Unbenannter Verlauf 1269"
              x1={62.17}
              y1={253.63}
              x2={117.69}
              y2={253.63}
              xlinkHref="#Unbenannter_Verlauf_278"
            />
            <linearGradient
              id="Unbenannter_Verlauf_278-2"
              x1={61.62}
              y1={270.13}
              x2={136.75}
              y2={270.13}
              xlinkHref="#Unbenannter_Verlauf_278"
            />
            <linearGradient
              id="Unbenannter_Verlauf_145"
              data-name="Unbenannter Verlauf 145"
              x1={173.96}
              y1={253.91}
              x2={229.77}
              y2={253.91}
              gradientTransform="translate(-23.8 -73.1)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset={0} stopColor="#b34575" />
              <stop offset={1} stopColor="#248d64" />
            </linearGradient>
            <linearGradient
              id="Unbenannter_Verlauf_145-2"
              x1={117.69}
              y1={253.9}
              x2={173.96}
              y2={253.9}
              xlinkHref="#Unbenannter_Verlauf_145"
            />
            <linearGradient
              id="Unbenannter_Verlauf_1278"
              data-name="Unbenannter Verlauf 1278"
              x1={99.18}
              y1={221.27}
              x2={173.95}
              y2={221.27}
              xlinkHref="#Unbenannter_Verlauf_145"
            />
            <linearGradient
              id="Unbenannter_Verlauf_145-3"
              x1={173.96}
              y1={221.27}
              x2={248.15}
              y2={221.27}
              xlinkHref="#Unbenannter_Verlauf_145"
            />
            <linearGradient
              id="Unbenannter_Verlauf_145-4"
              x1={118.05}
              y1={188.84}
              x2={173.96}
              y2={188.84}
              xlinkHref="#Unbenannter_Verlauf_145"
            />
            <linearGradient
              id="Unbenannter_Verlauf_145-5"
              x1={173.96}
              y1={188.84}
              x2={229.4}
              y2={188.84}
              xlinkHref="#Unbenannter_Verlauf_145"
            />
            <linearGradient
              id="Unbenannter_Verlauf_280"
              data-name="Unbenannter Verlauf 280"
              x1={136.75}
              y1={124.6}
              x2={173.96}
              y2={124.6}
              gradientTransform="translate(-23.8 -73.1)"
              xlinkHref="#Unbenannter_Verlauf_1258"
            />
            <linearGradient
              id="Unbenannter_Verlauf_1258-2"
              x1={173.96}
              y1={124.9}
              x2={210.53}
              y2={124.9}
              gradientTransform="translate(-23.8 -73.1)"
              xlinkHref="#Unbenannter_Verlauf_1258"
            />
          </defs>
          <g
            id="outercircle"
            style={{
              transform: "scale(1)",
              opacity: 1,
              transformOrigin: "0% 0% 0px",
            }}
          >
            <ellipse
              id="outercircle-2"
              data-name="outercircle"
              cx={149.9}
              cy={148.4}
              rx={111.6}
              ry={111.6}
              fill={`${theme === "dark" ? "url(#Unbenannter_Verlauf_999)" : "url(#Unbenannter_Verlauf_249)"}`}
            />
          </g>
          <g
            id="innercircle"
            style={{
              transform: "scale(1)",
              opacity: 1,
              transformOrigin: "0% 0% 0px",
            }}
          >
            <ellipse
              id="innercircle-2"
              data-name="innercircle"
              cx={149.9}
              cy={148.4}
              rx={78.4}
              ry={78.4}
              fill={`${theme === "dark" ? "rgba(62, 62, 62, 0.7)" : "url(#Unbenannter_Verlauf_1075)"}`}
            />
          </g>
          <g id="triangle">
            <polygon
              id="_12triangleback"
              data-name="12triangleback"
              points="261.2 212.1 224.4 148.4 205.6 116 186.7 83.4 150.2 20.1 149.8 19.6 113 83.4 94.3 115.8 75.4 148.4 38.4 212.5 37.8 213.5 113 213.5 150.2 213.5 186.7 213.5 262 213.5 261.2 212.1"
              fill="url(#Unbenannter_Verlauf_1258)"
              style={{
                transform: "translateX(0px) translateY(0px) rotateZ(0deg)",
              }}
            />
            <polygon
              id="_11peakbottomrightlow"
              data-name="11peakbottomrightlow"
              points="186.7 213.5 262 213.5 261.2 212.1 206 180.2 186.7 213.5"
              fill="url(#Unbenannter_Verlauf_278)"
              style={{
                opacity: 0.85,
                transform: "translateX(0px) translateY(0px) rotateZ(0deg)",
              }}
            />
            <polygon
              id="_10peakbottomrighthigh"
              data-name="10peakbottomrighthigh"
              points="206 180.2 261.2 212.1 224.4 148.4 206 180.2"
              fill="url(#Unbenannter_Verlauf_1265)"
              style={{
                opacity: 0.6,
                transform: "translateX(0px) translateY(0px) rotateZ(0deg)",
              }}
            />
            <polygon
              id="_09peakbottomlefthigh"
              data-name="09peakbottomlefthigh"
              points="75.4 148.4 38.4 212.5 93.9 180.5 75.4 148.4"
              fill="url(#Unbenannter_Verlauf_1269)"
              style={{
                opacity: 1,
                transform: "translateX(0px) translateY(0px) rotateZ(0deg)",
              }}
            />
            <polygon
              id="_08peakbottomleftlow"
              data-name="08peakbottomleftlow"
              points="38.4 212.5 37.8 213.5 113 213.5 93.9 180.5 38.4 212.5"
              fill="url(#Unbenannter_Verlauf_278-2)"
              style={{
                opacity: 0.75,
                transform: "translateX(0px) translateY(0px) rotateZ(0deg)",
              }}
            />
            <polygon
              id="_07bodybottomright"
              data-name="07bodybottomright"
              points="150.2 148 150.2 213.5 186.7 213.5 206 180.2 150.2 148"
              fill="url(#Unbenannter_Verlauf_145)"
              style={{
                opacity: 0.95,
                transform: "translateX(0px) translateY(0px) rotateZ(0deg)",
              }}
            />
            <polygon
              id="_06bodybottomleft"
              data-name="06bodybottomleft"
              points="150.2 148 150.2 148 93.9 180.5 113 213.5 150.2 213.5 150.2 148"
              fill="url(#Unbenannter_Verlauf_145-2)"
              style={{
                opacity: 0.75,
                transform: "translateX(0px) translateY(0px) rotateZ(0deg)",
              }}
            />
            <polygon
              id="_05bodymiddlerleft"
              data-name="05bodymiddlerleft"
              points="150.2 148 94.3 115.8 75.4 148.4 93.9 180.5 150.2 148"
              fill="url(#Unbenannter_Verlauf_1278)"
              style={{
                opacity: 0.65,
                transform: "translateX(0px) translateY(0px) rotateZ(0deg)",
              }}
            />
            <polygon
              id="_04bodymiddleright"
              data-name="04bodymiddleright"
              points="150.2 148 150.2 148 206 180.2 224.4 148.4 205.6 116 150.2 148"
              fill="url(#Unbenannter_Verlauf_145-3)"
              style={{
                opacity: 0.9,
                transform: "translateX(0px) translateY(0px) rotateZ(0deg)",
              }}
            />
            <polygon
              id="_03bodytopleft"
              data-name="03bodytopleft"
              points="150.2 148 150.2 148 150.2 83.4 113 83.4 94.3 115.8 150.2 148"
              fill="url(#Unbenannter_Verlauf_145-4)"
              style={{
                opacity: 1,
                transform: "translateX(0px) translateY(0px) rotateZ(0deg)",
              }}
            />
            <polygon
              id="_02bodytopright"
              data-name="02bodytopright"
              points="150.2 148 205.6 116 186.7 83.4 150.2 83.4 150.2 148"
              fill="url(#Unbenannter_Verlauf_145-5)"
              style={{
                opacity: 0.75,
                transform: "translateX(0px) translateY(0px) rotateZ(0deg)",
              }}
            />
            <polygon
              id="_01peaktopleft"
              data-name="01peaktopleft"
              points="150.2 20.1 149.8 19.6 113 83.4 150.2 83.4 150.2 20.1"
              fill="url(#Unbenannter_Verlauf_280)"
              style={{
                opacity: 0.9,
                transform: "translateX(0px) translateY(0px) rotateZ(0deg)",
              }}
            />
            <polygon
              id="_00peaktopright"
              data-name="00peaktopright"
              points="186.7 83.4 150.2 20.1 150.2 83.4 186.7 83.4"
              fill="url(#Unbenannter_Verlauf_1258-2)"
              style={{
                opacity: 0.8,
                transform: "translateX(0px) translateY(0px) rotateZ(0deg)",
              }}
            />
          </g>
          <g
            id="description"
            style={{
              transform: "rotate(0deg)",
              transformOrigin: "0% 0% 0px",
              opacity: 1,
            }}
          >
            <path
              id="_00h"
              data-name="00h"
              d="M75.4,239.7l-13.1,3.9,1.6,5.4L77,245.1l1.4,4.5-30.1,9L47,254l12.7-3.7L58,244.8l-12.6,3.8L44,244.1l30.1-9Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_01i"
              data-name="01i"
              d="M73.4,230.9l-30.9,5.4-.8-4.7,30.9-5.3Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_02comma"
              data-name="02comma"
              d="M76.8,218.9l.2,2.4-5.1-1.1v1.6l-5,.5-.4-5,4.5-.4Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_03i"
              data-name="03i"
              d="M71.3,204.3,40,202.6l.3-4.7,31.3,1.7Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_04a"
              data-name="04a"
              d="M75.3,177.7l-7.2-.6-1.2,5.1,6.7,2.6-1.1,4.6L43.2,177l1.4-5.9L76.4,173Zm-12.5,2.9,1-3.9-13.4-1.2v.2Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_05m"
              data-name="05m"
              d="M83,156.8l-20-8.6h-.1l14.4,10.5-1.2,2.6-17.4-3.2h0l20,8.6L76.9,171,48.1,158.6l2.4-5.7,17,3.2h0l-14-10,2.5-5.9,28.8,12.4Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_06s"
              data-name="06s"
              d="M78.5,117.9l.6.5-2.3,4c-3-3.5-7.6.8-3.5,3.4s15.5-3,18.9,1.5c10.6,5.6-1,20.4-9.1,11.6l2.3-4,1.8,1.3c3,2.7,6.6-2.3,3.2-4.3-4-4.2-16,2.7-19.8-2.1C61.9,125.2,71,111.6,78.5,117.9Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_07a"
              data-name="07a"
              d="M107.2,123.3l-5.8-4.2-3.6,3.8,4.4,5.6L98.9,132,80.1,106.3l4.2-4.4,26.3,17.9Zm-12.1-3.9,2.8-2.8L87,108.8h-.1Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_08m"
              data-name="08m"
              d="M124.6,109.3,111.8,91.7h-.1l7,16.3-2.3,1.7L103,98h0l12.7,17.6-3.6,2.6L93.7,92.9l5-3.6,12.9,11.4h.1l-6.9-15.8,5.2-3.8,18.4,25.4Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_09u"
              data-name="09u"
              d="M141.7,92.2c5,8.6-9.5,15.7-13.2,6.4L117.9,76.7l4.1-2,10.5,21.8c1,2,2.3,2.4,3.8,1.6s2.1-1.9,1.1-4L126.9,72.4l4.2-2.1Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_10e"
              data-name="10e"
              d="M144.7,70.1l2.7,8.4,6.6-2.1,1.3,4.2-6.6,2.1,2.8,8.9,8.2-2.6,1.3,4.2-12.7,4-9.5-29.9,12.8-4,1.3,4.2Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_11l"
              data-name="11l"
              d="M175.7,86l.8,4.4L164,92.6l-5.4-30.9,4.6-.8,4.7,26.5Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_12hypen"
              data-name="12hypen"
              d="M185.3,76.5V71.9h9.6v4.6Z"
              transform="translate(-40 -60)"
              fill="#3D8B68"
            />
            <path
              id="_13i"
              data-name="13i"
              d="M206.5,91l4.9-31,4.7.8-5,30.9Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_14b"
              data-name="14b"
              d="M239.8,67c8,1.5,5.8,15.2-1.1,15.4h-.1c2.9,1.9,2.8,5.6,1.2,9.3-2.4,8.5-11,4.8-16.7,2.6l10.5-29.6ZM229.1,91.8c2.5,1.1,5.2,1.8,6.3-1.8s1.1-6.3-3.1-7.3Zm4.6-13.2c3,1.6,5.3.6,6.1-3s-.7-4.4-3.2-5.1Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_15u"
              data-name="15u"
              d="M255.6,101.1c-4.1,9.1-18.3,1.6-13-7l11.5-21.4,4,2.2L246.7,96.2c-1.1,2-.6,3.2.9,4s2.8.5,3.9-1.5l11.4-21.3,4.2,2.2Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_16i"
              data-name="16i"
              d="M255.5,109.5l18-25.6,3.8,2.7-17.9,25.7Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_17l"
              data-name="17l"
              d="M275.5,119.6l-2.9,3.4-9.7-8.2L283.3,91l3.6,3-17.4,20.5Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_18d"
              data-name="18d"
              d="M302,108.7c8.5,8.1-7.9,16.4-12.3,21.5-6.1,6.2-11.8-1-15.7-5.7l23.5-20.9Zm-21.5,16.4c1.6,2.2,3.6,3.9,6.3,1.3l11.1-9.9c2.9-2.3,1.4-4.5-.6-6.4Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_19i"
              data-name="19i"
              d="M290.3,145.2,317.2,129l2.5,4.1-26.9,16.2Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_20t"
              data-name="20t"
              d="M322.6,148.5,298.3,160l-2.1-4.3,24.3-11.5-2.1-4.6,4-1.9,6.4,13.5-4.1,1.9Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_21s"
              data-name="21s"
              d="M330.5,179l-.8.2-1.6-4.3c4.6-.1,4.1-6.4-.5-4.8s-7.4,13.9-13.1,13.7c-11,4.7-15.2-13.6-3.2-14.4l1.6,4.3-2.1.6c-4,.6-2.4,6.5,1.3,5.2,5.8-.5,8-14.1,14.1-14C335.3,161.6,340.1,177.2,330.5,179Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_22t"
              data-name="22t"
              d="M334.5,191.8l-26.6,3.6-.6-4.8,26.6-3.5-.7-5,4.5-.6,1.9,14.8-4.4.6Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_21u"
              data-name="21u"
              d="M315.6,216.8c-10,.6-10-15.4.1-14.7l24.3.2v4.6l-24.2-.2c-2.3,0-3.2,1-3.2,2.6s.9,2.7,3.1,2.8h24.2V217Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_22f"
              data-name="22f"
              d="M334.1,229.2l-8.8-1.3-1,6.6-4.3-.6,1-6.7-13.6-2,.7-4.7,31,4.6-1.9,13-4.3-.6Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
            <path
              id="_23f"
              data-name="23f"
              d="M330.2,247.5l-8.5-2.4-1.8,6.5-4.3-1.2,1.9-6.5-13.2-3.8,1.3-4.5,30.2,8.6-3.6,12.6-4.3-1.2Z"
              transform="translate(-40 -60)"
              fill="#344549"
            />
          </g>
        </svg>
      </div>
    </>
  );
};

export default Launch;
