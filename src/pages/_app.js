import '../styles/globals.css';
import GlobalContextProvider from '../context/GlobalContextProvider';
import { AnimatePresence } from 'framer-motion';
import React from 'react';

function MyApp({ Component, pageProps, router }) {
  return (
    <GlobalContextProvider>
      <AnimatePresence exitBeforeEnter>
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
    </GlobalContextProvider>
  );
}

export default MyApp;
