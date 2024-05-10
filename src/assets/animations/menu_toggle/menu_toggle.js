let circle = document.getElementById("circle_nav");
let triangle = document.getElementById("triangle_nav");
let toggleImage = document.getElementById("toggle");
let sIndex = "auto";
let easy = "none";
let duration = 0.1;

let toggle = false;
function morph() {
  if (!toggle) {
    triangle.style.fill = "url(#circle_gradient)";
    TweenMax.to(triangle, duration, {
      morphSVG: { shape: circle, shapeIndex: sIndex },
      ease: easy,
    });
    //tl.to(circle, {morphSVG:{shape:triangle, shapeIndex: sIndex}, ease:easy}, "+=0");
    toggle = !toggle;
  } else {
    triangle.style.fill = "url(#triangle_gradient)";
    TweenMax.to(triangle, duration, {
      morphSVG: { shape: triangle, shapeIndex: sIndex },
      ease: easy,
    });
    //tl.to(circle, {morphSVG:{shape:circle, shapeIndex: sIndex}, ease:easy}, "+=0");
    toggle = !toggle;
  }
}

if (toggleImage) {
  toggleImage.addEventListener("click", morph);
} else {
}