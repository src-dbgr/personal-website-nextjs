// ====================================================================
// HILFSFUNKTIONEN
// ====================================================================

/**
 * Überprüft, ob der Browser ein Internet Explorer (IE 10 oder 11) ist.
 * @returns {boolean} True, wenn es sich um IE handelt, ansonsten False.
 */
const isIE = () => {
  const ua = window.navigator.userAgent;
  // IE 10 oder älter (MSIE) oder IE 11 (Trident/)
  const msie = ua.includes("MSIE ");
  const trident = ua.includes("Trident/");
  return msie || trident;
};

/**
 * Entfernt das Animationselement und den Event Listener beim Klick
 * im IE-Modus (verhindert die Animation).
 */
const cleanupIE = () => {
  // Bessere Selektoren/Abfragen
  const triangleElement = document.querySelector("#triangle");
  const imageWrapper = document.getElementById("imagewrapper");

  // Entfernt den Event Listener, der durch .onclick gesetzt wurde
  if (triangleElement?.onclick) {
    triangleElement.onclick = null;
  }

  // Optional Chaining und Null-Check
  if (imageWrapper) {
    document.body.removeChild(imageWrapper);
  }
};

// ====================================================================
// ANIMATIONS-LOGIK (Verwendet die anime.js Bibliothek)
// ====================================================================

/**
 * Konfiguriert und startet die "Atem"-Animation.
 * @param {NodeList} trianglePaths - Die Polygonelemente für die Animation.
 * @returns {object} Das Anime-Objekt der Atem-Animation.
 */
const createBreathAnimation = (trianglePaths) => {
  const pathLength = trianglePaths.length;
  const animations = [];

  // Vorbereiten der einzelnen Pfad-Animationen
  for (let i = 0; i < pathLength; i++) {
    animations.push(
      anime({
        targets: trianglePaths[i],
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

  // Erstellen der Haupt-Atem-Animation, die die Einzel-Animationen steuert
  return anime({
    update: (ins) => {
      animations.forEach((animation, i) => {
        // Die Sinusfunktion erzeugt eine "atmende" Bewegung
        const percent = (1 - Math.sin(i * 0.35 + 0.0022 * ins.currentTime)) / 2;
        animation.seek(animation.duration * percent);
      });
    },
    duration: Infinity,
    autoplay: false,
  });
};

/**
 * Konfiguriert die Start-Animationssequenz (Strich-Zeichnung des Logos).
 * @param {NodeList} trianglePaths - Die Polygonelemente für die Animation.
 * @returns {object} Die Anime-Timeline der Intro-Animation.
 */
const createIntroAnimation = (trianglePaths) => {
  return anime
    .timeline({
      autoplay: false,
    })
    .add({
      targets: trianglePaths,
      // Zeichentrick-Effekt
      strokeDashoffset: {
        value: [anime.setDashoffset, 0],
        duration: 3900,
        easing: "easeInOutCirc",
        delay: anime.stagger(190, { direction: "reverse" }),
      },
      duration: 2000,
      delay: anime.stagger(60, { direction: "reverse" }),
      easing: "linear",
      complete: (anim) => {
        anim.remove();
      },
    });
};

/**
 * Konfiguriert die Start-Transition-Animation (Einblenden/Skalieren).
 * @param {number} animTimeout - Die Dauer der Haupt-Frames.
 * @returns {object} Die Anime-Timeline der Start-Transition.
 */
const createStartTransition = (animTimeout) => {
  return anime
    .timeline({
      easing: "easeOutExpo",
      duration: animTimeout,
    })
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
      complete: (anim) => {
        anim.remove();
      },
    });
};

/**
 * Konfiguriert die "Kill-Animation" (Zerstörungs-Effekt beim Klick/Keyup).
 * @returns {object} Die Anime-Timeline des Stop-Effekts.
 */
const createKillTransition = () => {
  const tlStop = anime.timeline({
    // Verwende camelCase für Variablen
    easing: "easeOutExpo",
    duration: 500,
    autoplay: false,
  });

  tlStop
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
      // Zerstreuung der Dreieck-Polygone
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
      delay: (el, i) => i * 100,
      easing: "easeInOutSine",
      complete: (anim) => {
        anim.remove();
      },
    });

  return tlStop;
};

/**
 * Startet die Sequenz- und die Atem-Animationen.
 * @param {object} introAnim - Die Intro-Timeline.
 * @param {object} breathAnim - Die Atem-Animation.
 */
const startElementMotion = (introAnim, breathAnim) => {
  introAnim.play();
  breathAnim.play();
};

/**
 * Pausiert die Sequenz- und die Atem-Animationen.
 * @param {object} introAnim - Die Intro-Timeline.
 * @param {object} breathAnim - Die Atem-Animation.
 */
const pauseElementMotion = (introAnim, breathAnim) => {
  introAnim.pause();
  breathAnim.pause();
};

// ====================================================================
// HAUPT-LOGIK DER ANIMATION
// ====================================================================

/**
 * Verwaltet den gesamten Animationszyklus: Initialisierung, Start, Kill-Event.
 */
const launchMainAnimationLogic = () => {
  const animTimeout = 1000;
  let killAnimationTriggered = false;

  const logoEl = document.querySelector("#logo");
  const trianglePathEls = logoEl.querySelectorAll(
    "#triangle polygon:not(#_12triangleback)"
  );

  // 1. Animationen initialisieren
  const breathAnimation = createBreathAnimation(trianglePathEls);
  const introAnimation = createIntroAnimation(trianglePathEls);
  const startTransition = createStartTransition(animTimeout);
  const killTransition = createKillTransition();

  // Elemente für die spätere Verwendung zwischenspeichern
  const triangleElement = document.querySelector("#triangle");
  const descriptionBack = document.querySelector("#triangle #_12triangleback");
  const imageWrapper = document.getElementById("imagewrapper");
  const nodesToHide = document.querySelectorAll(
    "#description,#outercircle,#innercircle,#triangle,#_12triangleback"
  );

  /**
   * Stoppt alle Animationen und entfernt das Element.
   */
  const killAnimation = () => {
    // Verwende Arrow Function
    if (killAnimationTriggered) return;

    // Setze den Kill-Zustand, um Mehrfachausführung zu verhindern
    killAnimationTriggered = true;

    // Visuelle Vorbereitung
    if (descriptionBack) {
      descriptionBack.style.opacity = 0;
    }

    // Animationen ausführen
    pauseElementMotion(introAnimation, breathAnimation);
    killTransition.play();

    // Event Listener entfernen
    triangleElement?.removeEventListener("click", killAnimation);
    document.body.removeEventListener("keyup", handleKeyup);

    // Wrapper nach Abschluss der Kill-Animation entfernen
    setTimeout(() => {
      if (imageWrapper) {
        imageWrapper.remove();
      }
    }, animTimeout * 3);
  };

  /**
   * Keyup-Handler, der die Animation beendet, wenn Enter gedrückt wird.
   * @param {KeyboardEvent} event
   */
  const handleKeyup = (event) => {
    // Verwende Arrow Function
    // Key-Code 13 für Enter, besser: event.key === 'Enter' in modernen Browsern
    if (event.keyCode === 13) {
      event.preventDefault();
      killAnimation();
    }
  };

  /**
   * Bereitet das Logo für den Start vor und beginnt die Animation.
   */
  const initialAnimation = () => {
    // Verwende Arrow Function
    // Alle Teile unsichtbar machen
    Array.from(nodesToHide).forEach((item) => {
      item.style.opacity = 0;
    });

    // Logo sichtbar machen
    document.querySelector("#logo").style.opacity = 1;

    // Starte die Einleitungs-Transition
    startTransition.play();

    // Starte die dauerhaften Bewegungen (Intro und Breath) nach der Transition
    setTimeout(
      () => startElementMotion(introAnimation, breathAnimation),
      animTimeout * 3
    );

    // Automatischer Kill nach Timeout, falls der Nutzer nicht klickt
    // Speichern des Timers, falls er vorzeitig abgebrochen werden muss
    setTimeout(killAnimation, animTimeout * 60000);
  };

  // Event Listener setzen (für Kill-Animation) - Null-Check mit Optional Chaining
  triangleElement?.addEventListener("click", killAnimation);
  document.body.addEventListener("keyup", handleKeyup);

  // Animation starten
  initialAnimation();
};

// ====================================================================
// TEXT-ANIMATION (Description)
// ====================================================================

/**
 * Animiert die einzelnen Buchstaben der Beschreibung (Typing-Effekt).
 */
const animateDescriptionText = () => {
  const letters = document.querySelectorAll("#description path");
  // Alle Buchstaben zu Beginn unsichtbar machen
  letters.forEach((letter) => {
    letter.style.opacity = "0";
  });

  const printSpeed = 100; // ms
  const startDelay = 2000; // ms

  /**
   * Führt eine Callback-Funktion für jeden Buchstaben mit einer zeitlichen Verzögerung aus.
   * @param {function} callback - Die Funktion, die auf den Buchstaben angewendet wird.
   * @param {number} execDelay - Die Verzögerung zwischen den einzelnen Buchstaben.
   * @param {number} execStartDelay - Die Anfangsverzögerung.
   * @param {string} [color] - Optionaler Farbwert für die Colorize-Callback.
   */
  const processDescriptionLetters = (
    // Verwende Arrow Function
    callback,
    execDelay,
    execStartDelay,
    color
  ) => {
    let currentDelay = execStartDelay;

    letters.forEach((letter, index) => {
      // Fügt an bestimmten Stellen eine längere Pause ein (z.B. nach Kommata/Wörtern)
      currentDelay +=
        index === 3 || index === 13 || index === 12 ? execDelay * 5 : 0;

      currentDelay += execDelay; // Normale Verzögerung

      setTimeout(callback, currentDelay, letter, color);
    });
  };

  // Funktion zum Sichtbarmachen der Buchstaben
  const enableDescriptionLetters = (letter) => {
    letter.style.opacity = "1";
  };

  // Startet den Typing-Effekt
  processDescriptionLetters(enableDescriptionLetters, printSpeed, startDelay);

  // Die auskommentierte Colorize-Funktion (im Original) - Beibehalten des Kommentars
  /*
  const colorizeDescriptionLetters = (letter, color) => {
     letter.style.fill = color;
  };
  processDescriptionLetters(
    colorizeDescriptionLetters,
    printSpeed,
    startDelay + 100,
    "rgb(181, 178, 166)"
  );
  */
};

// ====================================================================
// PROGRAMMSTART
// ====================================================================

// Entferne "use strict"; da ES-Module oder Class-Body-Scope dies implizieren
// und alle Funktionen jetzt const/let anstelle von var verwenden.

if (isIE()) {
  document.querySelector("#logo").style.opacity = 1;
  // Verwenden des Event-Handlers direkt (anstatt .onclick, da die Logik in cleanupIE liegt)
  document.getElementById("triangle").onclick = cleanupIE;
} else {
  // Start der Haupt-Logo-Animation
  launchMainAnimationLogic();

  // Start der separaten Text-Animation
  animateDescriptionText();
}
