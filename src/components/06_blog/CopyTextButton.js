import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { MdCheck, MdContentCopy, MdErrorOutline } from "react-icons/md";

const RESET_AFTER_MS = 2000;

const STATES = {
  idle: { label: "COPY TEXT", Icon: MdContentCopy },
  copied: { label: "COPIED", Icon: MdCheck },
  failed: { label: "NOT COPIED", Icon: MdErrorOutline },
};

const CopyTextButton = ({ sourceRef, title }) => {
  const [status, setStatus] = useState("idle");
  const resetTimer = useRef(null);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const handleCopy = async () => {
    let next = "copied";
    try {
      const body = sourceRef.current.innerText.trim();
      await navigator.clipboard.writeText(`${title}\n\n${body}`);
    } catch {
      next = "failed";
    }
    setStatus(next);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStatus("idle"), RESET_AFTER_MS);
  };

  const { label, Icon } = STATES[status];

  return (
    <button
      type="button"
      className="btn center-btn blog-copy-btn"
      onClick={handleCopy}
    >
      <span className="btn" aria-live="polite">
        <Icon className="icon-margin" aria-hidden="true" />
        {label}
      </span>
    </button>
  );
};

CopyTextButton.propTypes = {
  sourceRef: PropTypes.shape({ current: PropTypes.object }).isRequired,
  title: PropTypes.string.isRequired,
};

export default CopyTextButton;
