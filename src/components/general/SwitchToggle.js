import React from "react";
import CookieInfo from "./CookieInfo";

const SwitchToggle = ({
  id,
  toggleHandler,
  checkBoxState,
  title,
  selectable,
  description,
  category,
  vendor,
  type,
  expiration,
  name,
  purpose,
  url,
  enablealltoggle,
}) => {
  return (
    <div className="switch-content-wrapper">
      {selectable ? (
        <>
          <label className="switch" htmlFor={`cookie-toggle-${id ?? title}`}>
            <input
              id={`cookie-toggle-${id ?? title}`}
              name={`cookie-toggle-${id ?? title}`}
              className="analytics-checkbox"
              type="checkbox"
              onClick={toggleHandler}
            />
            <span
              className={`${
                checkBoxState
                  ? enablealltoggle
                    ? "slider enableallslider"
                    : "slider sliderChecked"
                  : "slider"
              }`}
            >
              <span
                className={`${
                  checkBoxState
                    ? "enabled-text-variable enableText"
                    : "enabled-text-variable"
                }`}
              >
                enabled
              </span>
              <span
                className={`${
                  checkBoxState
                    ? "disabled-text-variable disableText"
                    : "disabled-text-variable"
                }`}
              >
                disabled
              </span>
            </span>
          </label>
        </>
      ) : (
        <>
          <label
            className="switch-enabled"
            htmlFor={`cookie-required-${id ?? title}`}
          >
            <input
              id={`cookie-required-${id ?? title}`}
              name={`cookie-required-${id ?? title}`}
              type="checkbox"
            />
            <span className="slider-enabled">
              <span className="enabled-text-required">required</span>
            </span>
          </label>
        </>
      )}
      <div className="switch-title">{title}</div>
      {!enablealltoggle && (
        <CookieInfo
          key={id}
          title={title}
          vendor={vendor}
          category={category}
          description={description}
          type={type}
          expiration={expiration}
          name={name}
          purpose={purpose}
          url={url}
        />
      )}
    </div>
  );
};

export default SwitchToggle;
