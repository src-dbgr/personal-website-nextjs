// hooks/useNavigation.js
import { useContext, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GlobalDispatchContext, GlobalStateContext } from "../context/GlobalContextProvider";

const PRIMARY_ROUTES = [
  '/',
  '/about',
  '/projects',
  '/blog',
  '/playground',
  '/contact',
  '/legal',
  '/privacy',
];

const normalizePath = (path) => {
  if (!path) return "/";
  const bare = path.split("#")[0].split("?")[0];
  if (bare === "") return "/";
  return bare.replace(/\/+$/, "") || "/";
};

export const useNavigation = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { navopen } = useContext(GlobalStateContext);
  const router = useRouter();

  useEffect(() => {
    PRIMARY_ROUTES.forEach((route) => {
      router.prefetch(route);
    });
  }, [router]);

  const closeOverlay = useCallback(() => {
    dispatch({ type: "NAV_TOGGLE_LOGO" });
    dispatch({ type: "NAV_CIRC" });
  }, [dispatch]);

  const handleNavigation = (url) => {
    void router.prefetch(url);

    if (!navopen) {
      router.push(url);
      return;
    }

    // Immediate close animation (PersistentChrome stays mounted so it can finish).
    // Push on the next frame so the first paint of the close isn't blocked by routing.
    closeOverlay();
    if (normalizePath(url) !== normalizePath(router.asPath)) {
      requestAnimationFrame(() => {
        void router.push(url);
      });
    }
  };

  const handleInternalLinkClick = (e, url) => {
    e.preventDefault();
    handleNavigation(url);
  };

  const handleInternalKeyDown = (e, url) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNavigation(url);
    }
  };

  const handleExternalKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      window.open(e.target.href, '_blank');
    }
  };

  const closeTopbar = useCallback(() => {
    if (navopen) {
      dispatch({ type: "NAV_TOGGLE_LOGO" });
      setTimeout(() => dispatch({ type: "NAV_CIRC" }), 0);
    }
  }, [navopen, dispatch]);

  const handleTopbarToggle = (e) => {
    // Nur auslösen, wenn direkt auf die aside geklickt wurde
    if (e.target === e.currentTarget) {
      closeTopbar();
    }
  };

  return {
    handleNavigation,
    handleInternalLinkClick,
    handleInternalKeyDown,
    handleExternalKeyDown,
    handleTopbarToggle,
    closeTopbar,
    navopen
  };
};
