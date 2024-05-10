import React, { useState, useEffect, useRef } from "react";
import Cookies from 'js-cookie'
import { useRouter } from "next/router"; 
import SwitchToggle from "./SwitchToggle";
import Link from "next/link";

function isBrowser() {
  return typeof window !== "undefined";
}

function initializeAndTrack(router) {
  if (Cookies.get('ga-consent') === 'true') {
    // Google Analytics Script initialisieren
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'DEINE_GA_TRACKING_ID', {
      page_path: router.asPath // sorgt dafür, dass bei jeder Route-Änderung getrackt wird
    });
  }
}

const CookieConsent = () => {
  const router = useRouter();
  const [bannerHidden, setBannerHidden] = useState(false); // Initial falsch, wird später überprüft
  const [intialInvisible, setInitialInvisible] = useState(true); // Initial auf true gesetzt
  const [customize, setCustomize] = useState(false); // Kein Einfluss auf das erste Rendering

  // Laden der Einstellungen und Zustände beim Client-Rendering
  useEffect(() => {
    if (isBrowser()) {
      const hidden = JSON.parse(localStorage.getItem("CONSENTRXCSQECJWXXK") || "false");
      setBannerHidden(hidden);
      setInitialInvisible(false);
      initializeAndTrack(router);
    }
  }, [router]);

  const toggleCustomization = () => {
    setCustomize(!customize);
  };

  const EnableAllAnalytics = () => {
    // Cookie-Bearbeitungslogik
    setBannerHidden(true);
    localStorage.setItem("CONSENTRXCSQECJWXXK", JSON.stringify(true));
  };

  const DeclineAnalytics = () => {
    // Cookie-Entfernungslogik
    setBannerHidden(true);
    localStorage.setItem("CONSENTRXCSQECJWXXK", JSON.stringify(true));
  };
  return (
    <>
      <div className={`${intialInvisible ? "empty" : "_"}`}>
        {!bannerHidden && (
          <>
            <div
              className={`${
                customize ? "cookie-consent no-opacity" : "cookie-consent"
              }`}
            >
              {customize ? (
                <div className="customizeCookies">
                  <div className="cookie-allow-analytics-toggle">
                    {cookies.map((cookie) => {
                      const {
                        identifier,
                        name,
                        purpose,
                        selectable,
                        title,
                        type,
                        url,
                        vendor,
                        description,
                        expiration,
                        enablealltoggle,
                        category,
                      } = cookie;
                      let catogories = "";
                      category.map((nested_category) => {
                        return (catogories += nested_category.category + ", ");
                      });
                      catogories = catogories.substring(
                        0,
                        catogories.length - 2
                      );
                      return (
                        <SwitchToggle
                          key={identifier}
                          toggleHandler={toggleHandler[identifier]}
                          checkBoxState={checkBoxState[identifier]}
                          vendor={vendor}
                          category={catogories}
                          title={title}
                          selectable={selectable}
                          description={description}
                          type={type}
                          expiration={expiration}
                          name={name}
                          purpose={purpose}
                          url={url}
                          enablealltoggle={enablealltoggle}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="cookie-text">
                  <span>
                    This website uses cookies and other tracking technologies.
                    By accepting all cookies, you consent to this website's use
                    of all cookies. You can also activate only specific cookies
                    or decline the entire usage of cookies. Declining stops all
                    tracking cookies but will use local window storage to not
                    show the banner again on revisit. Usage of cookies helps to
                    analyze this website's traffic and understand where visitors
                    are coming from. Your Identity always remains
                    anonymous.&nbsp;
                    <Link href="/privacy">Learn more</Link>
                  </span>
                </div>
              )}
              <div className="cookie-interactives">
                <div
                  className={`${
                    customize ? "cookie-buttons row" : "cookie-buttons"
                  }`}
                >
                  {customize ? (
                    <button className={"btn"} onClick={EnableAnalytics}>
                      ACCEPT CUSTOM
                    </button>
                  ) : (
                    <button className={"btn"} onClick={EnableAllAnalytics}>
                      ACCEPT ALL
                    </button>
                  )}
                  {!customize && (
                    <button className="btn" onClick={DeclineAnalytics}>
                      Decline
                    </button>
                  )}
                  <button className={"btn"} onClick={toggleCustomization}>
                    {!customize ? "CUSTOMIZE" : "CLOSE"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CookieConsent;
