/**
 * Flags written by /theme-init.js before React hydrates.
 * Read these instead of re-parsing cookies in every component.
 */

export const COOKIE_BANNER_ENABLED = false;

export function hasLaunchSeenClass() {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("launch-seen")
  );
}

export function markLaunchSeen() {
  if (typeof document !== "undefined") {
    document.documentElement.classList.add("launch-seen");
  }
}

export function paintedTheme() {
  if (typeof document === "undefined") {
    return "dark";
  }
  if (document.documentElement.classList.contains("theme-pending")) {
    return "dark";
  }
  return document.body.classList.contains("dark-theme") ? "dark" : "light";
}
