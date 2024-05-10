import React, { useState } from "react";

const CookieInfo = ({
  title,
  description,
  category,
  vendor,
  type,
  expiration,
  name,
  purpose,
  url,
}) => {
  const [openInfo, setOpenInfo] = useState(false);

  function toggleInfo() {
    setOpenInfo((openInfo) => !openInfo);
    if (openInfo) {
      enableScrolling();
    } else {
      disableScrolling();
    }
  }

  function disableScrolling() {
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function () {
      window.scrollTo(x, y);
    };
    document.documentElement.style.overflow = "hidden";
  }

  function enableScrolling() {
    window.onscroll = null;
    document.documentElement.style.overflow = "visible";
  }

  return (
    <>
      <button className="btn" onClick={toggleInfo}>
        INFO
      </button>
      {openInfo && (
        <div className="cookie-info-parent">
          <div className="cookie-info-child">
            <div className="cookie-info-box">
              <h2>{title}</h2>
              <br />
              <h4>Vendor</h4>
              <p>{vendor}</p>
              <h4>Category</h4>
              <p>{category}</p>
              <h4>Type</h4>
              <p>{type}</p>
              <h4>Name</h4>
              <p>{name}</p>
              <h4>Expiration</h4>
              <p>{expiration}</p>
              <h4>Purpose</h4>
              <p>{purpose}</p>
              <h4>Description</h4>
              <p>{description}</p>
              <h4>URL</h4>
              <a href={url} alt="url">
                {url}
              </a>
            </div>
            <button className="btn cookie-info-box-btn" onClick={toggleInfo}>
              close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieInfo;
