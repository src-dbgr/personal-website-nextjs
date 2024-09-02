import "../styles/globals.css";
import GlobalContextProvider from "../context/GlobalContextProvider";
import { AnimatePresence } from "framer-motion";
import React from "react";
import ApolloProviderWrapper from "../lib/apolloProvider";
import { useEffect } from "react";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (!!window.MSCompatibleInfo) {
      window.location.replace("/ie-err.html");
    }
  }, []);

  const devsamio =
    "" +
    "\n  ;                                                                                               " +
    "\n  ED.                                                                                       :     " +
    "\n  E#Wi                 ,;                    .                                             t#,    " +
    "\n  E###G.             f#i                    ;W                                     t      ;##W.   " +
    "\n  E#fD#W;          .E#t                    f#E         ..           ..       :     Ej    :#L:WE   " +
    "\n  E#t t##L        i#W,   t      .DD.     .E#f         ;W,          ,W,     .Et     E#,  .KG  ,#D  " +
    "\n  E#t  .E#K,     L#D.    EK:   ,WK.     iWW;         j##,         t##,    ,W#t     E#t  EE    ;#f " +
    "\n  E#t    j##f  :K#Wfff;  E#t  i#D      L##Lffi      G###,        L###,   j###t     E#t f#.     t#i" +
    "\n  E#t    :E#K: i##WLLLLt E#t j#f      tLLG##L     :E####,      .E#j##,  G#fE#t     E#t :#G     GK " +
    "\n  E#t   t##L    .E#L     E#tL#i         ,W#i     ;W# G##,     ;WW; ##,:K#i E#t     E#t  ;#L   LW. " +
    "\n  E#t .D#W;       f#E:   E#WW,         j#E.     j###DW##,    j#E.  ##f#W,  E#t     E#t   t#f f#:  " +
    "\n  E#tiW#G.         ,WW;  E#K:        .D#j      G##i,,G##,  .D#L    ###K:   E#t     E#t    f#D#;   " +
    "\n  E#K##i            .D#; ED.        ,WK,     :K#K:   L##, :K#t     ##D.    E#t     E#t     G#t    " +
    "\n  E##D.               tt t          EG.     ;##D.    L##, ...      #G      .. .E#t E#t      t     " +
    "\n  E#t                               ,       ,,,      .,,           .          ;E#t.,;.            " +
    "\n  L:";

    useEffect(() => {
      if (typeof window !== "undefined") {
        console.log(
          "\n\nWelcome to:%c\n" + devsamio,
          "color: #3d8b68; font-family: monospace;"
        );
      }
    }, [devsamio]);

  return (
    <ApolloProviderWrapper>
      <GlobalContextProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
          <meta name="theme-color" content="#2e2e2e" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Samuel IT" />
        </Head>
        <AnimatePresence mode="wait">
          <Component {...pageProps} />
        </AnimatePresence>
      </GlobalContextProvider>
    </ApolloProviderWrapper>
  );
}

export default MyApp;
