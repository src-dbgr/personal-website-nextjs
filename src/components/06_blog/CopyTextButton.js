import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { MdCheck, MdContentCopy, MdErrorOutline } from "react-icons/md";

const RESET_AFTER_MS = 2000;

const STATES = {
  idle: { label: "Copy text", Icon: MdContentCopy },
  copied: { label: "Copied", Icon: MdCheck },
  failed: { label: "Not copied", Icon: MdErrorOutline },
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
      aria-label={label}
      title={label}
    >
      <Icon aria-hidden="true" />
    </button>
  );
};

CopyTextButton.propTypes = {
  sourceRef: PropTypes.shape({ current: PropTypes.object }).isRequired,
  title: PropTypes.string.isRequired,
};

export default CopyTextButton;
