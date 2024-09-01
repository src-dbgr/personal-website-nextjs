// hooks/useNavigation.js
import { useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import { GlobalDispatchContext, GlobalStateContext } from "../context/GlobalContextProvider";

export const useNavigation = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { navopen } = useContext(GlobalStateContext);
  const router = useRouter();

  const handleNavigation = (url) => {
    if (navopen) {
      dispatch({ type: "NAV_TOGGLE_LOGO" });
      dispatch({ type: "NAV_CIRC" });

      setTimeout(() => {
        router.push(url);
      }, 450);
    } else {
      router.push(url);
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