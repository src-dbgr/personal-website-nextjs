import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { hasLaunchSeenClass, paintedTheme } from "../lib/bootFlags";

export const GlobalStateContext = React.createContext();
export const GlobalDispatchContext = React.createContext();

const initialState = {
  theme: "dark",
  animation: true,
  navopen: false,
  navlogoscale: false,
  navanimation: true,
  cookieconsentopen: false,
  navcircanim: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_THEME": {
      const newTheme = state.theme === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
      }
      return {
        ...state,
        theme: newTheme,
      };
    }
    case "SET_THEME": {
      const newTheme = action.theme === "light" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
      }
      return {
        ...state,
        theme: newTheme,
      };
    }
    case "LAUNCH_ANIMATION": {
      return {
        ...state,
        animation: false,
      };
    }
    case "NAV_TOGGLE_LOGO": {
      return {
        ...state,
        navopen: !state.navopen,
      };
    }
    case "NAV_ANIMATION": {
      return {
        ...state,
        navanimation: false,
      };
    }
    case "NAV_CIRC": {
      return {
        ...state,
        navcircanim: false,
      };
    }
    case "COOKIE_CONSENT": {
      return {
        ...state,
        cookieconsentopen: false,
      };
    }
    default:
      throw new Error("Bad Action Type");
  }
}

const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (hasLaunchSeenClass() || Cookies.get("launch_seen")) {
      dispatch({ type: "LAUNCH_ANIMATION" });
    }
    dispatch({ type: "SET_THEME", theme: paintedTheme() });
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    document.body.classList.toggle("dark-theme", state.theme === "dark");
    document.documentElement.classList.toggle(
      "htmlScrollbarDarkMode",
      state.theme === "dark"
    );
  }, [isClient, state.theme]);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export default GlobalContextProvider;
