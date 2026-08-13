import React from 'react';
import Link from 'next/link';
import { useNavigation } from '../../hooks/useNavigation';

const CustomLink = ({ href, children }) => {
  const { handleInternalLinkClick, handleInternalKeyDown } = useNavigation();

  return (
    <Link
      href={href}
      prefetch
      onClick={(e) => handleInternalLinkClick(e, href)}
      onKeyDown={(e) => handleInternalKeyDown(e, href)}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
