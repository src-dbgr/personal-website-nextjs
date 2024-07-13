import '../styles/globals.css';
import GlobalContextProvider from '../context/GlobalContextProvider';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import ApolloProviderWrapper from '../lib/apolloProvider';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (!!window.MSCompatibleInfo) {
      window.location.replace("/ie-err.html");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log(
        "\n\nWelcome to:%c\n               /\\\\\\         /\\\\\\\\\\\\                                                                 \n               \\/\\\\\\        \\////\\\\\\                                                                 \n                \\/\\\\\\           \\/\\\\\\                                                                 \n     /\\\\\\\\\\\\\\\\\\\\ \\/\\\\\\           \\/\\\\\\       /\\\\\\\\\\  /\\\\\\\\\\            /\\\\\\\\\\  /\\\\\\\\\\       /\\\\\\\\\\\\\\\\  \n     \\/\\\\\\//////  \\/\\\\\\\\\\\\\\\\\\     \\/\\\\\\     /\\\\\\///\\\\\\\\\\///\\\\\\        /\\\\\\///\\\\\\\\\\///\\\\\\   /\\\\\\/////\\\\\\ \n      \\/\\\\\\\\\\\\\\\\\\\\ \\/\\\\\\////\\\\\\    \\/\\\\\\    \\/\\\\\\ \\//\\\\\\  \\/\\\\\\       \\/\\\\\\ \\//\\\\\\  \\/\\\\\\  /\\\\\\\\\\\\\\\\\\\\\\  \n       \\////////\\\\\\ \\/\\\\\\  \\/\\\\\\    \\/\\\\\\    \\/\\\\\\  \\/\\\\\\  \\/\\\\\\       \\/\\\\\\  \\/\\\\\\  \\/\\\\\\ \\//\\\\///////   \n         /\\\\\\\\\\\\\\\\\\\\ \\/\\\\\\\\\\\\\\\\\\   /\\\\\\\\\\\\\\\\\\ \\/\\\\\\  \\/\\\\\\  \\/\\\\\\  /\\\\\\ \\/\\\\\\  \\/\\\\\\  \\/\\\\\\  \\//\\\\\\\\\\\\\\\\\\\\ \n         \\//////////  \\/////////   \\/////////  \\///   \\///   \\///  \\///  \\///   \\///   \\///    \\//////////  \n\n",
        "color: #3d8b68;"
      );
    }
  }, []);

  return (
    <ApolloProviderWrapper>
      <GlobalContextProvider>
        <AnimatePresence exitBeforeEnter>
          <Component {...pageProps}/>
        </AnimatePresence>
      </GlobalContextProvider>
    </ApolloProviderWrapper>
  );
}

export default MyApp;
