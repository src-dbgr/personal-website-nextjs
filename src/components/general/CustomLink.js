import React from 'react';
import { useNavigation } from '../../hooks/useNavigation';

const CustomLink = ({ href, children }) => {
  const { handleInternalLinkClick, handleInternalKeyDown } = useNavigation();

  return (
    <a 
      href={href} 
      onClick={(e) => handleInternalLinkClick(e, href)}
      onKeyDown={(e) => handleInternalKeyDown(e, href)}
    >
      {children}
    </a>
  );
};

export default CustomLink;