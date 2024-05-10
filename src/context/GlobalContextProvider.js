import React from "react";

export const GlobalStateContext = React.createContext();
export const GlobalDispatchContext = React.createContext();

const initialState = {
  theme: "dark",
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
      return {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
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
  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export const themeStyle = initialState.theme;
export default GlobalContextProvider;
