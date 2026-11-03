import { useEffect, useRef, useState } from "react";

// Keeps a flat object of numbers in sync with the query string, so any setting can
// be shared as a link. Keys are prefixed per chapter to avoid collisions, and only
// values that differ from the defaults appear in the URL.
export default function useUrlState(prefix, defaults) {
  const [state, setState] = useState(defaults);
  const loaded = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = { ...defaults };
    let found = false;
    for (const key of Object.keys(defaults)) {
      const raw = params.get(`${prefix}${key}`);
      const num = raw === null ? NaN : Number(raw);
      if (Number.isFinite(num)) {
        next[key] = num;
        found = true;
      }
    }
    if (found) setState(next);
    loaded.current = true;
    // Defaults are constants per chapter; read the URL once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(state)) {
      if (value === defaults[key]) url.searchParams.delete(`${prefix}${key}`);
      else url.searchParams.set(`${prefix}${key}`, String(value));
    }
    if (url.href !== window.location.href) {
      window.history.replaceState(window.history.state, "", url);
    }
    // Defaults are constants per chapter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefix, state]);

  const update = (key) => (value) => setState((s) => ({ ...s, [key]: value }));
  return [state, update, setState];
}
