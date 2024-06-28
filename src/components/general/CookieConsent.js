import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import SwitchToggle from './SwitchToggle';
import { initGoogleAnalytics } from '../../lib/initGoogleAnalytics'; // Import der GA-Initialisierungsfunktion
import Link from "next/link";

function isBrowser() {
  return typeof window !== 'undefined';
}

function getValue(key, defaultValue) {
  return isBrowser() && window.localStorage.getItem(key)
    ? JSON.parse(window.localStorage.getItem(key))
    : defaultValue;
}

function setValue(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function useStickyState(defaultValue, key) {
  const [value, setter] = useState(() => {
    return getValue(key, defaultValue);
  });

  useEffect(() => {
    setValue(key, value);
  }, [key, value]);

  return [value, setter];
}

const COOKIE_QUERY = gql`
  query Query {
    cookies(filters: { active: { eq: true } }, sort: "identifier:desc") {
      data {
        attributes {
          name
          purpose
          selectable
          title
          type
          url
          vendor
          description
          expiration
          enablealltoggle
          category {
            category
          }
          identifier
        }
      }
    }
  }
`;

const CookieConsent = () => {
  const { data, loading, error } = useQuery(COOKIE_QUERY);
  const router = useRouter();

  const cookies = data ? data.cookies.data.map(item => item.attributes) : [];

  const [bannerHidden, setBannerHidden] = useStickyState(
    false,
    'CONSENTRXCSQECJWXXK'
  );

  const cookieNames = useRef({
    gglanalytics: 'sb-ggl-anlytcs-ecuosp',
    ggltagmgr: 'sb-google-tagmanager',
    fbpixel: 'sb-facebook-pixel',
    tiktokpixel: 'sb-tiktok-pixel',
    hotjar: 'sb-hotjarCheckboxState',
  });
  const onMount = useRef(false);
  const [initialInvisible, setInitialInvisible] = useState(true);
  const [toggleAllState, setToggleAllState] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [gglAnalyticsCheckboxState, setGglAnalyticsCheckboxState] =
    useState(false);
  const [gglTagmgrCheckboxState, setGglTagmgrCheckboxState] = useState(false);
  const [fbPixelCheckboxState, setFbCheckboxPixelState] = useState(false);
  const [tiktokPixelCheckboxState, setTiktokCheckboxPixelState] =
    useState(false);
  const [hotjarCheckboxState, setHotjarCheckboxState] = useState(false);

  const toggleGglAnalytics = () => {
    setGglAnalyticsCheckboxState(
      (gglAnalyticsCheckboxState) => !gglAnalyticsCheckboxState
    );
  };
  const toggleGglTagMgr = () => {
    setGglTagmgrCheckboxState(
      (gglTagmgrCheckboxState) => !gglTagmgrCheckboxState
    );
  };
  const toggleFbPixel = () => {
    setFbCheckboxPixelState((fbPixelCheckboxState) => !fbPixelCheckboxState);
  };
  const toggleTiktokPixel = () => {
    setTiktokCheckboxPixelState(
      (tiktokPixelCheckboxState) => !tiktokPixelCheckboxState
    );
  };
  const toggleHotjar = () => {
    setHotjarCheckboxState((hotjarCheckboxState) => !hotjarCheckboxState);
  };

  const setAll = (val) => {
    setGglAnalyticsCheckboxState((gglAnalyticsCheckboxState) => val);
    setGglTagmgrCheckboxState((gglTagmgrCheckboxState) => val);
    setFbCheckboxPixelState((fbPixelCheckboxState) => val);
    setTiktokCheckboxPixelState((tiktokPixelCheckboxState) => val);
    setHotjarCheckboxState((hotjarCheckboxState) => val);
  };

  useEffect(() => {
    let active = true;
    if (!onMount.current) {
      setInitialInvisible(false);
      onMount.current = true;
    } else {
      if (active) {
        setAll(toggleAllState);
      }
    }
    return () => {
      active = false;
    };
  }, [toggleAllState]);

  useEffect(() => {
    if (isBrowser()) {
      // Initialize and track based on user consent
      if (gglAnalyticsCheckboxState) {
        initGoogleAnalytics('G-ET703HRR3G'); // Deine Google Analytics Tracking-ID
      }
      // Füge hier die Initialisierung weiterer Tracking-Dienste hinzu
    }
  }, [gglAnalyticsCheckboxState, gglTagmgrCheckboxState, fbPixelCheckboxState, tiktokPixelCheckboxState, hotjarCheckboxState]);

  const toggleAll = () => {
    setToggleAllState((toggleAllState) => !toggleAllState);
  };

  const toggleCustomization = () => {
    setCustomize((customize) => !customize);
  };

  const EnableAllAnalytics = () => {
    cookies.forEach((cookie) => {
      if (cookie.name !== 'none') {
        setCookie(cookie.name, true, 365);
      }
    });
    setBannerHidden(true);
  };

  const EnableAnalytics = () => {
    if (gglAnalyticsCheckboxState) {
      setCookie(cookieNames.current.gglanalytics, true, 365);
    }
    if (gglTagmgrCheckboxState) {
      setCookie(cookieNames.current.ggltagmgr, true, 365);
    }
    if (fbPixelCheckboxState) {
      setCookie(cookieNames.current.fbpixel, true, 365);
    }
    if (tiktokPixelCheckboxState) {
      setCookie(cookieNames.current.tiktokpixel, true, 365);
    }
    if (hotjarCheckboxState) {
      setCookie(cookieNames.current.hotjar, true, 365);
    }
    setBannerHidden(true);
  };

  function setCookie(cName, cValue, expDays) {
    let date = new Date();
    date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie =
      cName + '=' + cValue + ';' + expires + ';path=/;secure;samesite=none';
  }

  function isCookieInPlace(cName) {
    let containsCookie = false;
    try {
      document.cookie.split(';').forEach((element) => {
        if (element.includes(cName)) {
          containsCookie = true;
          return;
        }
      });
    } catch (err) {
      console.log('issue checking whether cookie is in place');
      console.error(err);
    }
    return containsCookie;
  }

  function removeCookie(cName) {
    if (isCookieInPlace(cName)) {
      document.cookie = cName + '=false;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }

  function removeAllCookies() {
    Object.values(cookieNames.current).forEach((cookie) => removeCookie(cookie));
  }

  function gaOptout() {
    try {
      let gaProperty = 'G-ET703HRR3G';
      let disableStr = 'ga-disable-' + gaProperty;
      if (document.cookie.indexOf(disableStr + '=true') > -1) {
        window[disableStr] = true;
      }
      document.cookie =
        disableStr +
        '=true;expires=Thu, 31 Dec 2099 23:59:59 UTC;path=/;secure;samesite=none';
      window[disableStr] = true;
    } catch (err) {
      console.log('issue setting opt out cookie for google analytics');
      console.error(err);
    }
  }

  const DeclineAnalytics = () => {
    try {
      removeAllCookies();
      gaOptout();
    } catch (err) {
      console.log('could not invalidate cookie');
      console.error(err);
    }
    setBannerHidden(true);
  };

  const toggleHandler = [
    toggleAll,
    null,
    toggleGglTagMgr,
    toggleFbPixel,
    toggleTiktokPixel,
    toggleHotjar,
    toggleGglAnalytics,
  ];

  const checkBoxState = [
    toggleAllState,
    null,
    gglTagmgrCheckboxState,
    fbPixelCheckboxState,
    tiktokPixelCheckboxState,
    hotjarCheckboxState,
    gglAnalyticsCheckboxState,
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className={`${initialInvisible ? 'empty' : '_'}`}>
        {!bannerHidden && (
          <>
            <div className={`${customize ? 'cookie-consent no-opacity' : 'cookie-consent'}`}>
              {customize ? (
                <div className='customizeCookies'>
                  <div className='cookie-allow-analytics-toggle'>
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
                      let categories = '';
                      category.map((nested_category) => {
                        return (categories += nested_category.category + ', ');
                      });
                      categories = categories.substring(0, categories.length - 2);
                      return (
                        <SwitchToggle
                          key={identifier}
                          toggleHandler={toggleHandler[identifier]}
                          checkBoxState={checkBoxState[identifier]}
                          vendor={vendor}
                          category={categories}
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
                <div className='cookie-text'>
                  <span>
                    This website uses cookies and other tracking technologies.
                    By accepting all cookies, you consent to this website&apos;s use
                    of all cookies. You can also activate only specific cookies
                    or decline the entire usage of cookies. Declining stops all
                    tracking cookies but will use local window storage to not
                    show the banner again on revisit. Usage of cookies helps to
                    analyze this website&apos;s traffic and understand where visitors
                    are coming from. Your Identity always remains
                    anonymous.&nbsp;
                    <Link href="/privacy" className="link">Learn more</Link>
                  </span>
                </div>
              )}
              <div className='cookie-interactives'>
                <div className={`${customize ? 'cookie-buttons row' : 'cookie-buttons'}`}>
                  {customize ? (
                    <button className={'btn'} onClick={EnableAnalytics}>
                      ACCEPT CUSTOM
                    </button>
                  ) : (
                    <button className={'btn'} onClick={EnableAllAnalytics}>
                      ACCEPT ALL
                    </button>
                  )}
                  {!customize && (
                    <button className='btn' onClick={DeclineAnalytics}>
                      Decline
                    </button>
                  )}
                  <button className={'btn'} onClick={toggleCustomization}>
                    {!customize ? 'CUSTOMIZE' : 'CLOSE'}
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
