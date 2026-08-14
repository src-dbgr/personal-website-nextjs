import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import HeroMountains from "./HeroMountains";

const Threejsrender = dynamic(() => import("./Threejs/ThreejsRender"), {
  ssr: false,
  loading: () => <div className="hero-canvas-placeholder" aria-hidden="true" />,
});

const Hero = () => {
  return (
    <header className="hero">
      <div className="fixed-position">
        <div className="section-center hero-center">
          <article className="hero-info">
            <div className="hero-description-wrapper">
              <div className="underline"></div>
              <h4>HI, MY NAME IS</h4>
              <h1 className="big-heading">
                <span className="highlight">
                  <span>S</span>
                  <span>A</span>
                  <span>M</span>
                  <span>U</span>
                  <span>E</span>
                  <span>L</span>
                </span>
              </h1>
              <h2 className="big-heading">
                I BUILD <span className="highlight">IT</span> STUFF
              </h2>
              <div className="hero-description">
                <p>
                  8+ YEARS BUILDING PRODUCTION DISTRIBUTED SYSTEMS
                  <br />
                  ARCHITECTURE AND SECURITY
                </p>
              </div>

              <Link href="/contact">
                <div className="btn">GET IN TOUCH</div>
              </Link>
            </div>
          </article>
          <div className="hero-img">
            <Threejsrender />
          </div>
        </div>
      </div>
      <HeroMountains />
    </header>
  );
};

export default Hero;
