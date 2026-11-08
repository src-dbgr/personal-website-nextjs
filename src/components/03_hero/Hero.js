import React from "react";
import Link from "next/link";
import HeroMountains from "./HeroMountains";
import LiquidWord from "./LiquidWord";
import LiquidButton from "./LiquidButton";
import HeroBlackHole from "./HeroBlackHole";
import LiquidLogo from "./LiquidLogo";

const Hero = () => {
  return (
    <header className="hero">
      <div className="fixed-position">
        <HeroBlackHole />
        <div className="section-center hero-center">
          <article className="hero-info">
            <div className="hero-description-wrapper">
              <div className="underline"></div>
              <h4>HI, MY NAME IS</h4>
              <h1 className="big-heading">
                <LiquidWord word="samuel" stroke={22}>
                  <span>S</span>
                  <span>A</span>
                  <span>M</span>
                  <span>U</span>
                  <span>E</span>
                  <span>L</span>
                </LiquidWord>
              </h1>
              <h2 className="big-heading">
                I BUILD <LiquidWord word="it">IT</LiquidWord> STUFF
              </h2>
              <div className="hero-description">
                <p className="hero-slogan-line">9+ years building</p>
                <p className="hero-slogan-line">
                  production-grade distributed systems,
                </p>
                <p className="hero-slogan-line">architecture and security</p>
              </div>

              <Link href="/contact">
                <LiquidButton>GET IN TOUCH</LiquidButton>
              </Link>
            </div>
          </article>
          <div className="hero-img">
            <LiquidLogo />
          </div>
        </div>
      </div>
      <HeroMountains />
    </header>
  );
};

export default Hero;
