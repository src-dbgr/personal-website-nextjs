import { GlobalStateContext } from "../../context/GlobalContextProvider";
import React, { useEffect, useContext, useState } from "react";
import Link from "next/link";
import Threejsrender from "./Threejs/ThreejsRender";
import Aos from "aos";
import "aos/dist/aos.css";

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, navanimation } = useContext(GlobalStateContext);

  useEffect(() => {
    setIsMounted(true);
    Aos.init({ duration: 1000 });
  }, []);

  if (!isMounted) {
    return null; // oder ein Loading-Indikator
  }

  return (
    <header className="hero">
      <div className="fixed-position">
        <div className="section-center hero-center">
          <article className="hero-info">
            <div className="hero-description-wrapper">
              <div
                className="underline"
                data-aos={`${navanimation ? "fade" : ""}`}
                data-aos-once="true"
              ></div>
              <h4
                data-aos={`${navanimation ? "fade" : ""}`}
                data-aos-once="true"
                data-aos-delay={`${navanimation ? "200" : "0"}`}
              >
                HI, MY NAME IS
              </h4>
              <h1 className="big-heading">
                <span
                  className="highlight"
                  data-aos={`${navanimation ? "fade" : ""}`}
                  data-aos-delay={`${navanimation ? "400" : "0"}`}
                  data-aos-once="true"
                >
                  <span>S</span>
                  <span>A</span>
                  <span>M</span>
                  <span>U</span>
                  <span>E</span>
                  <span>L</span>
                </span>
              </h1>
              <h2
                data-aos={`${navanimation ? "fade" : ""}`}
                data-aos-delay={`${navanimation ? "600" : "0"}`}
                data-aos-once="true"
                className="big-heading"
              >
                I BUILD <span className="highlight">IT</span> STUFF
              </h2>
              <div
                className="hero-description"
                data-aos={`${navanimation ? "fade" : ""}`}
                data-aos-once="true"
                data-aos-delay={`${navanimation ? "800" : "0"}`}
              >
                <p>
                  I AM A SOFTWARE DEVELOPER AND MACHINE LEARNING ENTHUSIAST WHO
                  SPECIALIZES IN SOLVING REAL-WORLD <span>IT</span> PROBLEMS.
                </p>
              </div>

              <Link
                href="/contact"
                data-aos={`${navanimation ? "fade" : ""}`}
                data-aos-once="true"
                data-aos-delay={`${navanimation ? "1000" : "0"}`}
              >
                <div className="btn">GET IN TOUCH</div>
              </Link>
            </div>
          </article>
          <div
            className="hero-img"
            data-aos={`${navanimation ? "fade" : ""}`}
            data-aos-once="true"
            data-aos-delay={`${navanimation ? "1200" : "0"}`}
          >
            <Threejsrender />
          </div>
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="4323.9"
        height="251.5"
        viewBox="0 0 4323.9 251.5"
        className="triangle-one"
        data-aos={`${navanimation ? "fade-up" : ""}`}
        data-aos-once="true"
      >
        <defs>
          <linearGradient
            id="a"
            x1="1458.35"
            x2="1458.35"
            y1="250.68"
            y2="250.68"
            data-name="Unbenannter Verlauf 75"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              className="triangle-gradient-one"
              offset="30%"
              stopColor="#96948d"
              stopOpacity="1"
            ></stop>
            <stop
              className="triangle-gradient-two"
              offset="100%"
              stopColor="#b5b2a6"
              stopOpacity="0.1"
            ></stop>
          </linearGradient>
          <linearGradient
            id="c"
            x1="2162.09"
            x2="2165"
            y1="240"
            y2="0"
            xlinkHref="#a"
          >
            <animate
              attributeType="XML"
              attributeName="y1"
              values="70%;100%;70%"
              dur="20s"
              repeatCount="indefinite"
            />
            <animate
              attributeType="XML"
              attributeName="x2"
              values="2162;2165;2162"
              dur="20s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
        <path
          fill="url(#c)"
          d="M2214.8 250.7L2218.5 250.7 2304.5 250.7 2571.4 250.7 2598.3 250.7 2744.3 250.7 2762.8 250.7 2781 250.7 2867.3 250.7 2927.4 250.7 3015.9 250.7 3089.1 250.7 3269.6 250.7 3389.2 250.7 3520.7 250.7 3550.5 250.7 3569.7 250.7 3706.2 250.7 3712.8 250.7 3982.3 250.7 4040.8 250.7 4171 250.7 4240.3 250.7 4323.6 250.7 4323.6 176.4 4293.5 186.3 4238.3 160.4 4175 168.4 4122.5 133 4082.2 162.2 3949.2 61.7 3862 120.5 3806.9 105.5 3734.6 148.5 3672 149.4 3615.1 196.9 3614.8 196.7 3594.4 200.1 3534.1 142.3 3495.5 156.1 3446.2 121 3429.4 122.3 3394.4 90 3383.7 99.6 3312.6 59.2 3260.6 1.4 3159.4 111.5 3130.6 83.6 3093.7 51.4 3068.6 79 3040.6 84.5 2981 135.9 2919.7 142.3 2890.8 171.4 2887.4 168.9 2842.1 183.9 2793.6 161.1 2737.9 168.1 2691.6 136.9 2656.2 162.6 2539.2 74.2 2462.5 125.9 2413.9 112.8 2350.4 150.5 2295.3 151.4 2197.4 233 2098.5 150.7 2043.5 149.8 1979.9 112 1931.3 125.2 1854.6 73.4 1737.6 161.8 1702.2 136.2 1656 167.3 1600.2 160.3 1551.7 183.1 1506.5 168.2 1503 170.7 1474.1 141.6 1412.8 135.1 1353.2 83.7 1325.2 78.2 1300.1 50.7 1263.2 82.8 1234.4 110.7 1133.3 0.7 1081.2 58.5 1010.1 98.9 999.5 89.2 964.4 121.6 947.6 120.2 898.3 155.3 859.8 141.6 799.4 199.4 779 195.9 778.7 196.1 721.8 148.7 659.2 147.7 587 104.8 531.8 119.8 444.6 60.9 311.6 161.4 271.4 132.2 218.8 167.6 155.5 159.7 100.3 185.6 48.9 168.7 0.6 203.6 0.6 250.7"
        ></path>
        <g
          className="g-stroke"
          fill="none"
          stroke="#b5b2a7"
          strokeMiterlimit="10"
          strokeWidth="2"
        >
          <path d="M1234.4 110.7L1263.2 82.8 1300.1 50.7"></path>
          <path d="M859.8 141.6L799.4 199.4 779 195.9 778.7 196.1"></path>
          <path d="M999.5 89.2L964.4 121.6 947.6 120.2 898.3 155.3"></path>
          <path d="M1133.3 0.7L1081.2 58.5 1010.1 98.9"></path>
          <path d="M1133.3 0.7L1234.4 110.7"></path>
          <path d="M1234.4 110.7L1251.9 134.3 1259.3 174.9 1282.7 195.9"></path>
          <path d="M1133.3 0.7L1137 30 1132.1 56.2 1137.4 88.6 1132.5 125 1135.9 155.2 1129 178.3 1128.3 206.9 1121.6 238.4"></path>
          <path d="M1133.3 0.7L1184 64.5 1231 114 1234.4 110.7"></path>
          <path d="M1503 170.7L1474.1 141.6 1412.8 135.1 1353.2 83.7 1325.2 78.2 1300.1 50.7"></path>
          <path d="M1438.1 214.9L1415.3 208.2 1395.5 182.3 1366.5 171.8 1351.3 143.5 1331.5 126.3 1327.4 98.5 1300.1 50.7"></path>
          <path d="M859.8 141.6L898.3 155.3"></path>
          <path d="M859.8 141.6L866 168.1 865.3 189.4 871.3 207.6 871.6 230"></path>
          <path d="M956.5 209.4L921.5 188.5 898.3 155.3"></path>
          <path d="M999.5 89.2L1010.1 98.9"></path>
          <path d="M999.5 89.2L1015.3 138.5 1037.9 155.2 1046.3 198.7 1066.4 202.7 1077.7 241 1074 194.2 1056.7 189.3 1044.9 138.9 1024.1 122.9 1010.1 98.9"></path>
          <path d="M1503 170.7L1506.5 168.2"></path>
          <path d="M1854.6 73.4L1931.3 125.2 1979.9 112 2043.5 149.8"></path>
          <path d="M1702.2 136.2L1656 167.3 1600.2 160.3 1551.7 183.1"></path>
          <path d="M1854.6 73.4L1737.6 161.8"></path>
          <path d="M1555.9 190.9L1567.4 203.9"></path>
          <path d="M1438.1 214.9L1457.3 203.8 1503 170.7"></path>
          <path d="M1505.5 172.9L1505.1 172.8 1503 170.7"></path>
          <path d="M1438.1 214.9L1450.7 218.6 1475 240.7"></path>
          <path d="M1854.6 73.4L1956.9 142.8 1988.4 178.3 2018.9 195.4 2042.5 227"></path>
          <path d="M1854.6 73.4L1827.7 130.5 1834.3 163.8 1820.5 200.7"></path>
          <path d="M1702.2 136.2L1737.6 161.8"></path>
          <path d="M1702.2 136.2L1684 171.1 1682.5 190.1 1668.7 219.1"></path>
          <path d="M1737.6 161.8L1746.4 191.5 1764.1 212.5 1774.5 240.8"></path>
          <path d="M2043.5 149.8L2098.5 150.7 2197.4 233"></path>
          <path d="M2043.5 149.8L2076.9 181.4 2096.6 186.6 2116.9 213 2149.7 223.5 2197 250.7"></path>
          <path d="M1506.5 168.2L1551.7 183.1"></path>
          <path d="M1505.5 172.9L1506.5 168.2"></path>
          <path d="M1551.7 183.1L1555.9 190.9"></path>
          <path d="M1591.2 230.8L1579.2 211.9 1567.4 203.9"></path>
          <path d="M1555.9 190.9L1560.6 199.4 1567.4 203.9"></path>
          <path d="M1505.5 172.9L1502 190.1 1486.8 215.2 1480.4 234.9 1475 240.7"></path>
          <path d="M1505.5 172.9L1555.3 190.2 1555.9 190.9"></path>
          <path d="M1591.2 230.8L1590.8 230.6 1567.4 203.9"></path>
          <path d="M444.6 60.9L531.8 119.8 587 104.8 659.2 147.7"></path>
          <path d="M48.9 168.7L0.6 203.6"></path>
          <path d="M271.4 132.2L218.8 167.6 155.5 159.7 100.3 185.6"></path>
          <path d="M444.6 60.9L311.6 161.4"></path>
          <path d="M444.6 60.9L560.9 139.7 596.6 180.1 631.3 199.6 658.1 235.5"></path>
          <path d="M444.6 60.9L414.1 125.8 421.5 163.7 405.9 205.6"></path>
          <path d="M271.4 132.2L311.6 161.4"></path>
          <path d="M271.4 132.2L250.7 171.9 249 193.6 233.4 226.5 228.9 243.7 222.1 250.7"></path>
          <path d="M311.6 161.4L321.7 195.1 341.8 219"></path>
          <path d="M659.2 147.7L721.8 148.7 778.7 196.1"></path>
          <path d="M659.2 147.7L697.2 183.6 719.6 189.6 740.8 217"></path>
          <path d="M740.8 217L778.7 196.1"></path>
          <path d="M48.9 168.7L100.3 185.6"></path>
          <path d="M48.9 168.7L43.9 193.6 26.6 222 19.3 244.5 16.7 247.2"></path>
          <path d="M100.3 185.6L110.4 204.1 131.6 218.3 145 238.6"></path>
          <path d="M3093.7 51.4L3130.6 83.6 3159.4 111.5"></path>
          <path d="M3495.5 156.1L3446.2 121 3429.4 122.3 3394.4 90"></path>
          <path d="M3260.6 1.4L3312.6 59.2 3383.7 99.6"></path>
          <path d="M3615.1 196.9L3614.8 196.7 3594.4 200.1 3534.1 142.3"></path>
          <path d="M3260.6 1.4L3159.4 111.4"></path>
          <path d="M3159.4 111.5L3141.9 135 3134.6 175.7 3111.1 196.6"></path>
          <path d="M3260.6 1.4L3256.9 30.8 3261.7 56.9 3256.4 89.3 3261.3 125.8 3257.9 155.9 3264.8 179 3265.5 207.7 3272.2 239.1"></path>
          <path d="M3260.6 1.4L3209.8 65.2 3162.8 114.8 3159.4 111.5"></path>
          <path d="M3093.7 51.4L3068.6 79 3040.6 84.5 2981 135.9 2919.7 142.3 2890.8 171.4"></path>
          <path d="M2955.7 215.7L2978.6 208.9 2998.4 183 3027.3 172.6 3042.5 144.2 3062.3 127 3066.5 99.3 3093.7 51.4"></path>
          <path d="M3495.5 156.1L3534.1 142.3"></path>
          <path d="M3495.5 156.1L3472.3 189.2 3437.4 210.1 3405.9 241.4"></path>
          <path d="M3534.1 142.3L3527.8 168.9 3528.5 190.1 3522.5 208.3"></path>
          <path d="M3383.7 99.6L3394.4 90"></path>
          <path d="M3383.7 99.6L3369.7 123.6 3348.9 139.6 3337.1 190.1 3319.8 194.9 3316.1 241.7 3327.4 203.5 3347.6 199.4 3355.9 155.9 3378.5 139.2 3394.4 90"></path>
          <path d="M2691.6 136.9L2737.9 168.1 2793.6 161.1 2842.1 183.9"></path>
          <path d="M2887.4 168.9L2890.8 171.4"></path>
          <path d="M2656.2 162.6L2539.2 74.2"></path>
          <path d="M2350.4 150.5L2413.9 112.8 2462.5 125.9 2539.2 74.2"></path>
          <path d="M2837.9 191.6L2826.4 204.7"></path>
          <path d="M2955.7 215.7L2936.5 204.5 2890.8 171.4"></path>
          <path d="M2888.3 173.7L2888.7 173.5 2890.8 171.4"></path>
          <path d="M2955.7 215.7L2943.1 219.4 2918.8 241.4"></path>
          <path d="M2573.3 201.4L2559.5 164.6 2566.1 131.2 2539.2 74.2"></path>
          <path d="M2539.2 74.2L2436.9 143.5 2405.4 179 2374.9 196.1 2351.3 227.7"></path>
          <path d="M2656.2 162.6L2691.6 136.9"></path>
          <path d="M2691.6 136.9L2709.8 171.8 2711.3 190.9 2725.1 219.8 2729 235"></path>
          <path d="M2656.2 162.6L2647.4 192.2 2629.7 213.3"></path>
          <path d="M2350.4 150.5L2295.3 151.4 2197.4 233"></path>
          <path d="M2350.4 150.5L2316.9 182.1 2297.2 187.4 2276.9 213.7 2244.1 224.2"></path>
          <path d="M2842.1 183.9L2887.4 168.9"></path>
          <path d="M2842.1 183.9L2837.9 191.6"></path>
          <path d="M2888.3 173.7L2887.4 168.9"></path>
          <path d="M2802.6 231.5L2814.6 212.6 2826.4 204.7"></path>
          <path d="M2826.4 204.7L2833.3 200.1 2837.9 191.6"></path>
          <path d="M2802.6 231.5L2798.3 238.3"></path>
          <path d="M2888.3 173.7L2891.8 190.9 2907 215.9 2913.4 235.6 2918.8 241.4"></path>
          <path d="M2837.9 191.6L2838.5 190.9 2888.3 173.7"></path>
          <path d="M2802.6 231.5L2803 231.3 2826.4 204.7"></path>
          <path d="M2918.8 241.4L2917.7 242.4 2878.7 245.1"></path>
          <path d="M4293.5 186.3L4238.3 160.4 4175 168.4 4122.5 133"></path>
          <path d="M3949.2 61.7L4082.2 162.2"></path>
          <path d="M3734.6 148.5L3806.9 105.5 3862 120.5 3949.2 61.7"></path>
          <path d="M3949.2 61.7L3979.8 126.5 3972.3 164.4 3987.9 206.3"></path>
          <path d="M3949.2 61.7L3832.9 140.5 3797.2 180.9 3755.8 217.8"></path>
          <path d="M4082.2 162.2L4122.5 133"></path>
          <path d="M4122.5 133L4143.1 172.6 4144.8 194.3"></path>
          <path d="M4082.2 162.2L4072.2 195.8 4052 219.8"></path>
          <path d="M3615.1 196.9L3672 149.4 3734.6 148.5"></path>
          <path d="M3734.6 148.5L3696.6 184.4 3674.2 190.3 3653.1 217.8"></path>
          <path d="M3615.1 196.9L3569.5 234.9"></path>
          <path d="M3653.1 217.8L3651.1 220.3 3613.9 232.2"></path>
          <path d="M3615.1 196.9L3653.1 217.8"></path>
          <path d="M4293.5 186.3L4323.6 176.8"></path>
          <path d="M4293.5 186.3L4283.4 204.8 4262.2 219"></path>
        </g>
      </svg>
    </header>
  );
};

export default Hero;
