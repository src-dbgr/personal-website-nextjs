import React, { useRef } from "react";

function Sound({ src }) {
  // const audioRef = useRef();
  return (
    <div>
      {/* <audio
        className="prismasound"
        controls="controls"
        preload="auto"
        autobuffer="true"
        style={{ display: "none" }}
        ref={audioRef}
      >
        <source src={src} />
      </audio> */}
    </div>
  );
}

export default Sound;
