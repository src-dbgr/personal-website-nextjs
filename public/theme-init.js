(function () {
  try {
    var theme = "dark";
    try {
      var stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") {
        theme = stored;
      }
    } catch (e) {
      theme = "dark";
    }

    try {
      var prefix = "launch_seen=";
      var parts = document.cookie.split(";");
      for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        while (part.charAt(0) === " ") {
          part = part.substring(1);
        }
        if (part.indexOf(prefix) === 0) {
          var val = "";
          try {
            val = decodeURIComponent(part.substring(prefix.length));
          } catch (err) {
            val = part.substring(prefix.length);
          }
          if (val) {
            document.documentElement.classList.add("launch-seen");
          }
          break;
        }
      }
    } catch (e) {}

    var apply = function () {
      var isDark = theme === "dark";
      if (document.body) {
        document.body.classList.toggle("dark-theme", isDark);
      }
      document.documentElement.classList.toggle(
        "htmlScrollbarDarkMode",
        isDark
      );
      document.documentElement.classList.remove("theme-pending");
    };

    if (document.body) {
      apply();
    } else {
      document.documentElement.classList.toggle(
        "htmlScrollbarDarkMode",
        theme === "dark"
      );
      document.addEventListener("DOMContentLoaded", apply);
    }
  } catch (e) {}
})();
