import React, { useEffect, useState } from 'react';

export const GlobalStateContext = React.createContext();
export const GlobalDispatchContext = React.createContext();

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || "dark";
  }
  return "dark";
};

const initialState = {
  theme: getInitialTheme(),
  animation: true,
  navopen: false,
  navlogoscale: false,
  navanimation: true,
  cookieconsentopen: true,
  navcircanim: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_THEME": {
      const newTheme = state.theme === "light" ? "dark" : "light";
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
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
        navopen: state.navopen ? false : true,
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
    setIsClient(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== state.theme) {
      dispatch({ type: "TOGGLE_THEME" });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.classList.toggle("dark-theme", state.theme === "dark");
      document.documentElement.classList.toggle("htmlScrollbarDarkMode", state.theme === "dark");
    }
  }, [state.theme]);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export default GlobalContextProvider;