"use strict";

function isIE() {
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf("MSIE "); // IE 10 or older
  const trident = ua.indexOf("Trident/"); //IE 11
  return msie > 0 || trident > 0;
}

function clickIE(e) {
  document.querySelector("#triangle").removeEventListener("click", clickIE);
  document.body.removeChild(document.getElementById("imagewrapper"));
}

if (isIE()) {
  document.querySelector("#logo").style.opacity = 1;
  document.getElementById("triangle").onclick = clickIE; //onclick event
} else {
  let launchAnimation = function () {
    let logoEl = document.querySelector("#logo");
    let trianglePathEls = logoEl.querySelectorAll(
      "#triangle path:not(#_12triangleback)"
    );
    let pathLength = trianglePathEls.length;
    let hasStarted = false;
    let aimations = [];

    let breathAnimation = anime({
      begin: function () {
        for (let i = 0; i < pathLength; i++) {
          if (window.CP.shouldStopExecution(0)) break;
          aimations.push(
            anime({
              targets: trianglePathEls[i],
              stroke: {
                value: ["rgba(150, 149, 141, 0.8)"],
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
        window.CP.exitedLoop(0);
      },
      update: function (ins) {
        aimations.forEach(function (animation, i) {
          let percent = (1 - Math.sin(i * 0.35 + 0.0022 * ins.currentTime)) / 2;
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
        targets: "#triangle path",
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

    function killAnimation() {
      if (!killAnimationTriggered) {
        document.querySelector("#triangle #_12triangleback").style.opacity = 0;
        tl_stop.play();
        pauseElementMotion();
        document
          .querySelector("#triangle")
          .removeEventListener("click", killAnimation);
        document.body.removeEventListener("keyup", killAnimation);
        setTimeout(function () {
          document.getElementById("imagewrapper").remove();
        }, animTimeout * 3);
        killAnimationTriggered = !killAnimationTriggered;
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
          transformOrigin: ["50% 50% 0", "50% 50% 0"],
          scale: [0, 0.5, 1],
          opacity: 1,
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

      Array.from(nodes).forEach(function (item) {
        item.style.opacity = 0;
      });

      // remove in order to make it work in IE ...
      // [
      //   ...document.querySelectorAll(
      //     "#description,#outercircle,#innercircle,#triangle,#_12triangleback"
      //   ),
      // ].map((item) => {
      //   item.style.opacity = 0;
      // });
      // in order to not render on load up make logo visible later
      document.querySelector("#logo").style.opacity = 1;
      let startAnim = startAnimation();
      startAnim.play();
      setTimeout(startElementMotion, animTimeout * 3);
      setTimeout(killAnimation, animTimeout * 60000); // launch after timeout if user does not click to launch
    }

    let triangleElement = document.querySelector("#triangle");
    triangleElement.onclick = killAnimation;
    document.body.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        killAnimation();
      }
    });

    return initialAnimation;
  };
  launchAnimation()();

  function descriptionAnimation() {
    let letters = document.querySelectorAll("#description path");
    Array.from(letters).forEach(function (letter) {
      letter.style.opacity = "0";
    });

    function enableDescriptionLetters(letter) {
      letter.style.opacity = "1";
    }

    function colorizeDescriptionLetters(letter, color) {
      letter.style.fill = color;
    }

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
        return setTimeout(callback, (startDelay += delay), letter, color);
      });
    }

    let printSpeed = 100; // ms
    let startDelay = 2000; // ms
    makeDescriptionVisible(enableDescriptionLetters, printSpeed, startDelay);

    // colorization also possible, turn off keyframe animation beforehand
    // makeDescriptionVisible(
    //   colorizeDescriptionLetters,
    //   printSpeed,
    //   startDelay + 100,
    //   "rgb(181, 178, 166)"
    // );
  }

  descriptionAnimation();
}
