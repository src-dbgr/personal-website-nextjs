"use strict";
window.addEventListener("load", function (event) {
  const triangleElement = document.getElementById("triangle_nav");
  const circleElement = document.getElementById("circle_nav");
  const downSidePath = "M0,0,124.3,250,250,0Z";
  const upSidePath = "M250,250,125.7,0,0,250Z";

  let timeline = anime.timeline({
    autoplay: false,
    direction: "alternate",
    loop: false,
  });
  let animationDuration = 500;

  timeline.add({
    targets: triangleElement,
    easing: "easeInOutSine",
    duration: animationDuration,
    //loop: true,
    autoplay: false,
    d: [{ value: upSidePath }],
  });

  /*
const open = anime({
    targets: triangleElement,
    easing: 'easeOutQuad',
    duration: 200,
    //loop: true,
    direction: 'forward',
    autoplay: false,
    d: [
        {value: upSidePath},
    ]
});


const close = anime({
    targets: triangleElement,
    easing: 'easeOutQuad',
    duration: 300,
    //loop: true,
    direction: 'backward',
    autoplay: false,
    d: [
        {value: downSidePath},
    ]
});
*/

  let isUpside = false;

  function handler() {
    if (!isUpside) {
      //open.play();
      timeline.play();
      isUpside = !isUpside;
      circle_nav.classList.add("scale");
      //circle_nav.classList.remove("enableInvisibility");
      //circle_nav.classList.add("enableVisibility");
      //triangle_nav.classList.remove("enableVisibility");
      //triangle_nav.classList.add("enableInvisibility");
      //triangleElement.setAttribute("fill", "url(#circle_gradient_magenta_reverse)");
      setTimeout(function () {
        triangleElement.setAttribute("fill", "url(#circle_gradient_magenta)");
      }, animationDuration / 2);

      setTimeout(function () {
        circle_nav.classList.remove("scale");
      }, animationDuration);
    } else {
      //close.play();
      //timeline.play();
      timeline.reverse();
      timeline.play();
      isUpside = !isUpside;
      circle_nav.classList.add("scale");
      //triangleElement.setAttribute("d", downSidePath);
      //triangleElement.setAttribute("fill", "url(#triangle_alt_gradient)");

      //circle_nav.classList.remove("enableVisibility");
      //circle_nav.classList.add("enableInvisibility");
      //triangle_nav.classList.remove("enableInvisibility");
      //triangle_nav.classList.add("enableVisibility");
      setTimeout(function () {
        triangleElement.setAttribute("fill", "url(#circle_gradient_green)");
      }, animationDuration / 2);

      setTimeout(function () {
        circle_nav.classList.remove("scale");
      }, animationDuration);
    }
  }

  document.getElementById("toggle").addEventListener("click", handler);
});
