import '../styles/globals.css';
import GlobalContextProvider from '../context/GlobalContextProvider';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import ApolloProviderWrapper from '../lib/apolloProvider';

function MyApp({ Component, pageProps, router }) {
  return (
    <ApolloProviderWrapper>
      <GlobalContextProvider>
        <AnimatePresence exitBeforeEnter>
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </GlobalContextProvider>
    </ApolloProviderWrapper>
  );
}

export default MyApp;
