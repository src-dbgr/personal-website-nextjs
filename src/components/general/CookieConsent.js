import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import SwitchToggle from './SwitchToggle';
import { initGoogleAnalytics } from '../../lib/initGoogleAnalytics';
import Link from "next/link";

// Importieren der Umgebungsvariablen
const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

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

const CookieConsent = ({ cookies }) => {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const [toggleAllState, setToggleAllState] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [gglAnalyticsCheckboxState, setGglAnalyticsCheckboxState] = useState(false);
  const [gglTagmgrCheckboxState, setGglTagmgrCheckboxState] = useState(false);
  const [fbPixelCheckboxState, setFbCheckboxPixelState] = useState(false);
  const [tiktokPixelCheckboxState, setTiktokCheckboxPixelState] = useState(false);
  const [hotjarCheckboxState, setHotjarCheckboxState] = useState(false);

  useEffect(() => {
    if (!isClient) return;

    // Retrieve the cookie states from localStorage
    setGglAnalyticsCheckboxState(getValue('gglAnalyticsCheckboxState', false));
    setGglTagmgrCheckboxState(getValue('gglTagmgrCheckboxState', false));
    setFbCheckboxPixelState(getValue('fbPixelCheckboxState', false));
    setTiktokCheckboxPixelState(getValue('tiktokPixelCheckboxState', false));
    setHotjarCheckboxState(getValue('hotjarCheckboxState', false));
    setBannerHidden(getValue('CONSENTRXCSQECJWXXK', false));
  }, [isClient, setBannerHidden]);

  const toggleGglAnalytics = () => {
    setGglAnalyticsCheckboxState((prevState) => {
      const newState = !prevState;
      setValue('gglAnalyticsCheckboxState', newState);
      return newState;
    });
  };

  const toggleGglTagMgr = () => {
    setGglTagmgrCheckboxState((prevState) => {
      const newState = !prevState;
      setValue('gglTagmgrCheckboxState', newState);
      return newState;
    });
  };

  const toggleFbPixel = () => {
    setFbCheckboxPixelState((prevState) => {
      const newState = !prevState;
      setValue('fbPixelCheckboxState', newState);
      return newState;
    });
  };

  const toggleTiktokPixel = () => {
    setTiktokCheckboxPixelState((prevState) => {
      const newState = !prevState;
      setValue('tiktokPixelCheckboxState', newState);
      return newState;
    });
  };

  const toggleHotjar = () => {
    setHotjarCheckboxState((prevState) => {
      const newState = !prevState;
      setValue('hotjarCheckboxState', newState);
      return newState;
    });
  };

  const setAll = (val) => {
    setGglAnalyticsCheckboxState(val);
    // setGglTagmgrCheckboxState(val);
    // setFbCheckboxPixelState(val);
    // setTiktokCheckboxPixelState(val);
    // setHotjarCheckboxState(val);
  };

  useEffect(() => {
    setAll(toggleAllState);
  }, [toggleAllState]);

  const toggleAll = () => {
    setToggleAllState((prevState) => !prevState);
  };

  const toggleCustomization = () => {
    setCustomize((prevState) => !prevState);
  };

  const EnableAllAnalytics = () => {
    cookies.forEach((cookie) => {
      if (cookie.name !== 'none') {
        setCookie(cookie.name, true, 365);
      }
    });
    
    // Aktualisiere alle Checkbox-States
    setGglAnalyticsCheckboxState(true);
    // setGglTagmgrCheckboxState(true);
    // setFbCheckboxPixelState(true);
    // setTiktokCheckboxPixelState(true);
    // setHotjarCheckboxState(true);
    
    // Aktualisiere localStorage
    setValue('gglAnalyticsCheckboxState', true);
    // setValue('gglTagmgrCheckboxState', true);
    // setValue('fbPixelCheckboxState', true);
    // setValue('tiktokPixelCheckboxState', true);
    // setValue('hotjarCheckboxState', true);
    
    setBannerHidden(true);
    setValue('CONSENTRXCSQECJWXXK', true);
  
    // Initialisiere Google Analytics
    initGoogleAnalytics(GOOGLE_ANALYTICS_ID);
  };

  const EnableAnalytics = () => {
    if (gglAnalyticsCheckboxState) {
      setCookie(cookieNames.current.gglanalytics, true, 365);
      setValue('gglAnalyticsCheckboxState', true);
      initGoogleAnalytics(GOOGLE_ANALYTICS_ID);
    }
    if (gglTagmgrCheckboxState) {
      setCookie(cookieNames.current.ggltagmgr, true, 365);
      setValue('gglTagmgrCheckboxState', true);
    }
    if (fbPixelCheckboxState) {
      setCookie(cookieNames.current.fbpixel, true, 365);
      setValue('fbPixelCheckboxState', true);
    }
    if (tiktokPixelCheckboxState) {
      setCookie(cookieNames.current.tiktokpixel, true, 365);
      setValue('tiktokPixelCheckboxState', true);
    }
    if (hotjarCheckboxState) {
      setCookie(cookieNames.current.hotjar, true, 365);
      setValue('hotjarCheckboxState', true);
    }
    setBannerHidden(true);
    setValue('CONSENTRXCSQECJWXXK', true);
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
      let gaProperty = GOOGLE_ANALYTICS_ID;
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
    setValue('CONSENTRXCSQECJWXXK', true);
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

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div>
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
                    or decline the entire usage of cookies. 
                    Declining stops tracking cookies but allows essential use of localStorage for preferences and theme. 
                    Accepted cookies help analyze traffic. Your identity remains anonymous.
                    For full details on our data practices, please refer to the Privacy Policy.&nbsp;
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