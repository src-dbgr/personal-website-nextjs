import React from 'react';
import Image from 'next/image';

const SVGImage = ({ src, alt, width, height }) => {
  return (
    <div style={{ width, height, position: 'relative' }}>
      <Image 
        src={src} 
        alt={alt} 
        fill
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
};

export default SVGImage;