import React from "react";
import Image from "next/image";

const toPx = (value) => {
  if (typeof value === "number") return value;
  const parsed = parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : 40;
};

const SVGImage = ({ src, alt, width, height }) => {
  const w = toPx(width);
  const h = toPx(height);

  return (
    <div style={{ width: w, height: h, position: "relative" }}>
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};

export default SVGImage;
