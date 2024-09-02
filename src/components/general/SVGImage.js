import React from 'react';

const SVGImage = ({ src, alt, width, height }) => {
  return (
    <div style={{ width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img 
        src={src} 
        alt={alt} 
        style={{ 
          maxWidth: '100%', 
          maxHeight: '100%', 
          width: 'auto', 
          height: 'auto' 
        }} 
      />
    </div>
  );
};

export default SVGImage;