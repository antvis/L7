import React from 'react';
import styles from './BannerSVG.module.less';

const BannerSVG = React.memo(() => {
  const block6NodeRadius = '2';
  const block6GridPositions = [
    { x: 45.5, y: 45.5 }, // A
    { x: 65.5, y: 45.5 }, // B
    { x: 85.5, y: 45.5 }, // C
    { x: 105.5, y: 45.5 }, // D
    { x: 45.5, y: 65.5 }, // E
    { x: 65.5, y: 65.5 }, // F
    { x: 85.5, y: 65.5 }, // G
    { x: 105.5, y: 65.5 }, // H
    { x: 45.5, y: 85.5 }, // I
    { x: 65.5, y: 85.5 }, // J
    { x: 85.5, y: 85.5 }, // K
    { x: 105.5, y: 85.5 }, // L
    { x: 45.5, y: 105.5 }, // M
    { x: 65.5, y: 105.5 }, // N
    { x: 85.5, y: 105.5 }, // O
    { x: 105.5, y: 105.5 }, // P
  ];
  const fills = [
    'rgb(180, 100, 254)', // A
    'rgb(163, 89, 254)', // B
    'rgb(141, 76, 254)', // C
    'rgb(120, 64, 254)', // D
    'rgb(205, 114, 254)', // E
    'rgb(185, 103, 254)', // F
    'rgb(159, 87, 254)', // G
    'rgb(140, 78, 254)', // H
    'rgb(224, 126, 254)', // I
    'rgb(202, 114, 254)', // J
    'rgb(179, 100, 254)', // K
    'rgb(164, 92, 254)', // L
    'rgb(248, 141, 254)', // M
    'rgb(223, 126, 254)', // N
    'rgb(201, 112, 254)', // O
    'rgb(180, 101, 254)', // P
  ];
  const getBlock6Circles = () => {
    const labels = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
    ];
    const circles = labels.map((label, i) => {
      const beginx = block6GridPositions[i].x;
      const beginy = block6GridPositions[i].y;
      const classname = `block6Circle${label}`;
      return (
        <circle
          id={`block6-circle-${label}`}
          className={styles[classname]}
          key={label}
          fill={fills[i]}
          cx={beginx}
          cy={beginy}
          r={block6NodeRadius}
        />
      );
    });
    return circles;
  };

  return (
    <section className={styles.wrapper}>
      <svg width="130%" height="130%" viewBox="-50 -50 751 587" version="1.1">
        <defs>
          <linearGradient
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            id="linearGradient-2"
          >
            <stop stopColor="#F0EFFD" offset="0%" />
            <stop stopColor="#F9F8FF" offset="100%" />
          </linearGradient>
          <rect id="path-3" x="311" y="445" width="24" height="24" />
          <filter
            x="-275.0%"
            y="-225.0%"
            width="650.0%"
            height="650.0%"
            filterUnits="objectBoundingBox"
            id="filter-4"
          >
            <feOffset
              dx="0"
              dy="12"
              in="SourceAlpha"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="20"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.1925   0 0 0 0 0.273875   0 0 0 0 0.35  0 0 0 0.1 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
          <rect id="path-5" x="39" y="0" width="24" height="24" />
          <filter
            x="-275.0%"
            y="-225.0%"
            width="650.0%"
            height="650.0%"
            filterUnits="objectBoundingBox"
            id="filter-6"
          >
            <feOffset
              dx="0"
              dy="12"
              in="SourceAlpha"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="20"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.1925   0 0 0 0 0.273875   0 0 0 0 0.35  0 0 0 0.1 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
          <linearGradient
            x1="78.4948196%"
            y1="100%"
            x2="0%"
            y2="100%"
            id="linearGradient-7"
          >
            <stop stopColor="#FBF6FF" offset="0%" />
            <stop stopColor="#FAF9FC" offset="100%" />
          </linearGradient>
          <path
            d="M0,0 L154,0 L154,152 C154,153.104569 153.104569,154 152,154 L2,154 C0.8954305,154 1.3527075e-16,153.104569 0,152 L0,0 L0,0 Z"
            id="path-8"
          />
          <filter
            x="-65.9%"
            y="-51.0%"
            width="231.8%"
            height="231.8%"
            filterUnits="objectBoundingBox"
            id="filter-10"
          >
            <feOffset
              dx="0"
              dy="23"
              in="SourceAlpha"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="30"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.89233777   0 0 0 0 0.767282774   0 0 0 0 1  0 0 0 0.34298514 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
          <filter
            x="-71.4%"
            y="-56.5%"
            width="242.9%"
            height="242.9%"
            filterUnits="objectBoundingBox"
            id="filter-11"
          >
            <feGaussianBlur
              stdDeviation="30.5"
              in="SourceAlpha"
              result="shadowBlurInner1"
            />
            <feOffset
              dx="39"
              dy="-12"
              in="shadowBlurInner1"
              result="shadowOffsetInner1"
            />
            <feComposite
              in="shadowOffsetInner1"
              in2="SourceAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
              result="shadowInnerInner1"
            />
            <feColorMatrix
              values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 0.60003278 0"
              type="matrix"
              in="shadowInnerInner1"
            />
          </filter>
          <radialGradient
            cx="-3.18731345%"
            cy="149.566259%"
            fx="-3.18731345%"
            fy="149.566259%"
            r="181.707698%"
            id="radialGradient-15"
          >
            <stop stopColor="#E565FF" offset="0%" />
            <stop stopColor="#9C58FF" offset="58.1529772%" />
            <stop stopColor="#7818FF" offset="100%" />
          </radialGradient>

          <linearGradient
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            id="linearGradient-27"
          >
            <stop stopColor="#3EB0FF" offset="0%" />
            <stop stopColor="#00FF97" offset="100%" />
          </linearGradient>
          <linearGradient
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            id="linearGradient-28"
          >
            <stop stopColor="#3EB0FF" offset="0%" />
            <stop stopColor="#00FF97" offset="100%" />
          </linearGradient>
          <linearGradient
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            id="linearGradient-29"
          >
            <stop stopColor="#3EB0FF" offset="0%" />
            <stop stopColor="#00FF97" offset="100%" />
          </linearGradient>
          <linearGradient
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            id="linearGradient-30"
          >
            <stop stopColor="#3EB0FF" offset="0%" />
            <stop stopColor="#00FF97" offset="100%" />
          </linearGradient>
          <path
            d="M0,0 L126,0 L126,124 C126,125.104569 125.104569,126 124,126 L2,126 C0.8954305,126 1.3527075e-16,125.104569 0,124 L0,0 L0,0 Z"
            id="path-31"
          />
          <filter
            x="-73.8%"
            y="-59.5%"
            width="247.6%"
            height="247.6%"
            filterUnits="objectBoundingBox"
            id="filter-32"
          >
            <feOffset
              dx="0"
              dy="18"
              in="SourceAlpha"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="28"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.86820607   0 0 0 0 0.783993902   0 0 0 0 1  0 0 0 0.111505682 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
          <rect id="path-33" x="25" y="37" width="64" height="64" rx="2" />
          <filter
            x="-56.2%"
            y="-56.2%"
            width="212.5%"
            height="212.5%"
            filterUnits="objectBoundingBox"
            id="filter-34"
          >
            <feGaussianBlur
              stdDeviation="33.5"
              in="SourceAlpha"
              result="shadowBlurInner1"
            />
            <feOffset
              dx="5"
              dy="-4"
              in="shadowBlurInner1"
              result="shadowOffsetInner1"
            />
            <feComposite
              in="shadowOffsetInner1"
              in2="SourceAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
              result="shadowInnerInner1"
            />
            <feColorMatrix
              values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 0.232927229 0"
              type="matrix"
              in="shadowInnerInner1"
            />
          </filter>
          <linearGradient
            x1="100%"
            y1="98.9231419%"
            x2="100%"
            y2="0%"
            id="linearGradient-35"
          >
            <stop stopColor="#79FFEF" offset="0%" />
            <stop stopColor="#35FFAD" offset="100%" />
          </linearGradient>
          <linearGradient
            x1="100%"
            y1="98.9231419%"
            x2="100%"
            y2="0%"
            id="linearGradient-36"
          >
            <stop stopColor="#79FFEF" offset="0%" />
            <stop stopColor="#35FFAD" offset="100%" />
          </linearGradient>
          <linearGradient
            x1="100%"
            y1="98.9231419%"
            x2="100%"
            y2="0%"
            id="linearGradient-37"
          >
            <stop stopColor="#79FFEF" offset="0%" />
            <stop stopColor="#35FFAD" offset="100%" />
          </linearGradient>
          <circle id="path-41" cx="65.5" cy="65.5" r="32.5" />

          <path
            d="M0,0 L124,0 C125.104569,-2.02906125e-16 126,0.8954305 126,2 L126,124 C126,125.104569 125.104569,126 124,126 L0,126 L0,126 L0,0 Z"
            id="path-46"
          />
          <filter
            x="-97.2%"
            y="-67.1%"
            width="294.4%"
            height="294.4%"
            filterUnits="objectBoundingBox"
            id="filter-48"
          >
            <feOffset
              dx="0"
              dy="38"
              in="SourceAlpha"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="34.5"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.751720252   0 0 0 0 0.56875   0 0 0 0 1  0 0 0 0.407096809 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
          <filter
            x="-83.3%"
            y="-53.2%"
            width="266.7%"
            height="266.7%"
            filterUnits="objectBoundingBox"
            id="filter-49"
          >
            <feGaussianBlur
              stdDeviation="33.5"
              in="SourceAlpha"
              result="shadowBlurInner1"
            />
            <feOffset
              dx="5"
              dy="-4"
              in="shadowBlurInner1"
              result="shadowOffsetInner1"
            />
            <feComposite
              in="shadowOffsetInner1"
              in2="SourceAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
              result="shadowInnerInner1"
            />
            <feColorMatrix
              values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 0.232927229 0"
              type="matrix"
              in="shadowInnerInner1"
            />
          </filter>
          <linearGradient
            x1="50%"
            y1="3.85364977%"
            x2="50%"
            y2="89.6029946%"
            id="linearGradient-50"
          >
            <stop stopColor="rgba(255, 255, 255, 0.12)" offset="0%" />
            <stop stopColor="rgba(255, 255, 255, 0.12)" offset="100%" />
          </linearGradient>
          <linearGradient
            x1="100%"
            y1="50%"
            x2="0%"
            y2="50%"
            id="linearGradient-51"
          >
            <stop stopColor="rgba(255, 255, 255, 0.12)" offset="0%" />
            <stop stopColor="rgba(255, 255, 255, 0.12)" offset="100%" />
          </linearGradient>
          <linearGradient
            x1="85.7700904%"
            y1="92.3103523%"
            x2="0%"
            y2="34.9608269%"
            id="linearGradient-52"
          >
            <stop stopColor="rgba(255, 255, 255, 0.12)" offset="0%" />
            <stop stopColor="rgba(255, 255, 255, 0.12)" offset="100%" />
          </linearGradient>
          <linearGradient
            x1="50%"
            y1="100%"
            x2="50%"
            y2="0%"
            id="linearGradient-53"
          >
            <stop stopColor="#FF41F9" offset="0%" />
            <stop stopColor="#00FFCA" offset="100%" />
          </linearGradient>
          <path
            d="M63,34 C74.045695,34 83,42.954305 83,54 C83,61.3637967 76.3333333,71.3637967 63,84 C49.6666667,71.3637967 43,61.3637967 43,54 C43,42.954305 51.954305,34 63,34 Z M63,39.8333333 C55.175966,39.8333333 48.8333333,46.1480369 48.8333333,53.9376185 C48.8333333,58.572673 53.4703894,66.0292388 63,75.6666667 L63,75.6666667 L63.4297955,75.230106 C72.669063,65.80393 77.1666667,58.5024449 77.1666667,53.9376185 C77.1666667,46.1480369 70.824034,39.8333333 63,39.8333333 Z M63,47 C66.3137085,47 69,49.6862915 69,53 C69,56.3137085 66.3137085,59 63,59 C59.6862915,59 57,56.3137085 57,53 C57,49.6862915 59.6862915,47 63,47 Z"
            id="path-54"
          />

          <rect id="path-56" x="0" y="0" width="100" height="100" />
          <filter
            x="-122.5%"
            y="-84.5%"
            width="345.0%"
            height="345.0%"
            filterUnits="objectBoundingBox"
            id="filter-57"
          >
            <feOffset
              dx="0"
              dy="38"
              in="SourceAlpha"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="34.5"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.751720252   0 0 0 0 0.56875   0 0 0 0 1  0 0 0 0.407096809 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
          <filter
            x="-105.0%"
            y="-67.0%"
            width="310.0%"
            height="310.0%"
            filterUnits="objectBoundingBox"
            id="filter-58"
          >
            <feGaussianBlur
              stdDeviation="33.5"
              in="SourceAlpha"
              result="shadowBlurInner1"
            />
            <feOffset
              dx="5"
              dy="-4"
              in="shadowBlurInner1"
              result="shadowOffsetInner1"
            />
            <feComposite
              in="shadowOffsetInner1"
              in2="SourceAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
              result="shadowInnerInner1"
            />
            <feColorMatrix
              values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 0.232927229 0"
              type="matrix"
              in="shadowInnerInner1"
            />
          </filter>
          <linearGradient
            x1="61.28125%"
            y1="0%"
            x2="38.71875%"
            y2="100%"
            id="linearGradient-59"
          >
            <stop stopColor="#FFFFFF" offset="0%" />
            <stop stopColor="#FEFEFE" offset="100%" />
          </linearGradient>
          <rect id="path-60" x="32" y="10" width="38" height="80" rx="6" />
          <filter
            x="-223.7%"
            y="-73.8%"
            width="547.4%"
            height="312.5%"
            filterUnits="objectBoundingBox"
            id="filter-62"
          >
            <feOffset
              dx="0"
              dy="26"
              in="SourceAlpha"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="24"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.643049592   0 0 0 0 0.24772541   0 0 0 0 0.82178442  0 0 0 0.199874344 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
          <linearGradient
            x1="100%"
            y1="0%"
            x2="0%"
            y2="100%"
            id="linearGradient-63"
          >
            <stop stopColor="#FFFFFF" offset="0%" />
            <stop stopColor="#FEFEFE" offset="100%" />
          </linearGradient>

          <linearGradient
            id="arc-gradient1"
            x1="0"
            x2="0.3"
            y1="0"
            y2="1"
            gradientTransform="rotate(-90)"
          >
            <stop offset="0%" stopColor="rgb(154, 104, 255)" stopOpacity="1" />\
            <stop
              offset="100%"
              stopColor="rgb(255, 145, 253)"
              stopOpacity="1"
            />
          </linearGradient>
          <linearGradient
            id="arc-gradient2"
            x1="0"
            x2="0"
            y1="0"
            y2="1"
            gradientTransform="rotate(30)"
          >
            <stop offset="0%" stopColor="rgb(68, 17, 215)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="rgb(230, 54, 255)" stopOpacity="1" />
          </linearGradient>
          <filter
            id="arc-filter1"
            x="-100%"
            y="-100%"
            width="400%"
            height="400%"
          >
            <feOffset result="offOut" in="SourceGraphic" dx="-5" dy="-5" />
            <feColorMatrix
              result="matrixOut"
              in="offOut"
              type="matrix"
              values="0.463 0 0 0 0 0 0.110 0 0 0 0 0 0.922 0 0 0 0 0 0.2 0"
            />
            <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="20" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
          <filter id="arc-filter2" x="-50%" y="-50%" width="250%" height="250%">
            <feOffset result="offOut" in="SourceGraphic" dx="5" dy="5" />
            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
          <filter
            x="-2875.0%"
            y="-2000.0%"
            width="5850.0%"
            height="5850.0%"
            filterUnits="objectBoundingBox"
            id="filter-75"
          >
            <feOffset
              dx="0"
              dy="35"
              in="SourceAlpha"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="32.5"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.490799576   0 0 0 0 0.194812378   0 0 0 0 0.892436594  0 0 0 0.3046875 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
          <path
            d="M2,0 L122,0 L122,0 L122,120 C122,121.104569 121.104569,122 120,122 L0,122 L0,122 L0,2 C-1.3527075e-16,0.8954305 0.8954305,2.02906125e-16 2,0 Z"
            id="path-78"
          />
          <filter
            x="-69.7%"
            y="-48.4%"
            width="239.3%"
            height="239.3%"
            filterUnits="objectBoundingBox"
            id="filter-79"
          >
            <feOffset
              dx="0"
              dy="26"
              in="SourceAlpha"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="24"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.643049592   0 0 0 0 0.24772541   0 0 0 0 0.82178442  0 0 0 0.199874344 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
          <filter
            x="-300.0%"
            y="-220.0%"
            width="700.0%"
            height="700.0%"
            filterUnits="objectBoundingBox"
            id="filter-81"
          >
            <feMorphology
              radius="1"
              operator="dilate"
              in="SourceAlpha"
              result="shadowSpreadOuter1"
            />
            <feOffset
              dx="0"
              dy="4"
              in="shadowSpreadOuter1"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="4"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feComposite
              in="shadowBlurOuter1"
              in2="SourceAlpha"
              operator="out"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.538230561   0 0 0 0 0.163202963   0 0 0 0 0.817963089  0 0 0 0.229758523 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
          <filter
            x="-300.0%"
            y="-220.0%"
            width="700.0%"
            height="700.0%"
            filterUnits="objectBoundingBox"
            id="filter-83"
          >
            <feMorphology
              radius="1"
              operator="dilate"
              in="SourceAlpha"
              result="shadowSpreadOuter1"
            />
            <feOffset
              dx="0"
              dy="4"
              in="shadowSpreadOuter1"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="4"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feComposite
              in="shadowBlurOuter1"
              in2="SourceAlpha"
              operator="out"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.538230561   0 0 0 0 0.163202963   0 0 0 0 0.817963089  0 0 0 0.229758523 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
          <filter
            x="-300.0%"
            y="-220.0%"
            width="700.0%"
            height="700.0%"
            filterUnits="objectBoundingBox"
            id="filter-85"
          >
            <feMorphology
              radius="1"
              operator="dilate"
              in="SourceAlpha"
              result="shadowSpreadOuter1"
            />
            <feOffset
              dx="0"
              dy="4"
              in="shadowSpreadOuter1"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="4"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feComposite
              in="shadowBlurOuter1"
              in2="SourceAlpha"
              operator="out"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.538230561   0 0 0 0 0.163202963   0 0 0 0 0.817963089  0 0 0 0.229758523 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
          <filter
            x="-300.0%"
            y="-220.0%"
            width="700.0%"
            height="700.0%"
            filterUnits="objectBoundingBox"
            id="filter-87"
          >
            <feMorphology
              radius="1"
              operator="dilate"
              in="SourceAlpha"
              result="shadowSpreadOuter1"
            />
            <feOffset
              dx="0"
              dy="4"
              in="shadowSpreadOuter1"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="4"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feComposite
              in="shadowBlurOuter1"
              in2="SourceAlpha"
              operator="out"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.538230561   0 0 0 0 0.163202963   0 0 0 0 0.817963089  0 0 0 0.229758523 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
          <filter
            x="-300.0%"
            y="-220.0%"
            width="700.0%"
            height="700.0%"
            filterUnits="objectBoundingBox"
            id="filter-89"
          >
            <feMorphology
              radius="1"
              operator="dilate"
              in="SourceAlpha"
              result="shadowSpreadOuter1"
            />
            <feOffset
              dx="0"
              dy="4"
              in="shadowSpreadOuter1"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="4"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feComposite
              in="shadowBlurOuter1"
              in2="SourceAlpha"
              operator="out"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.538230561   0 0 0 0 0.163202963   0 0 0 0 0.817963089  0 0 0 0.229758523 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
          <radialGradient
            id="block5-gradient"
            fx="50%"
            fy="50%"
            cx="50%"
            cy="50%"
            r="90%"
          >
            <stop stopOpacity="1" stopColor="#FFDBB8" offset="0%" />
            <stop stopOpacity="1" stopColor="#FFD341" offset="100%" />
          </radialGradient>
          <filter id="rect-shadow" x="-50%" y="-50%" width="300%" height="300%">
            <feOffset result="offOut" in="SourceGraphic" dx="10" dy="10" />
            <feColorMatrix
              result="matrixOut"
              in="offOut"
              type="matrix"
              values="0.192 0 0 0 0 0 0.275 0 0 0 0 0 0.349 0 0 0 0 0 0.1 0"
            />
            <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="10" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
        </defs>
        <g
          id="Ant-V-PC-定稿-1101"
          transform="translate(-711.000000, -100.000000)"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g id="banner-svg" transform="translate(779.000000, 127.000000)">
            <g id="backs" transform="translate(209.000000, 0.000000)">
              <rect
                id="back-lefttop-small"
                stroke="#EBE1FB"
                opacity="0.503348214"
                x="257.5"
                y="145.5"
                width="206"
                height="172"
                transform="translate(-90.000000, -150.000000)"
              />
              <rect
                id="back-righttop"
                stroke="#EBE1FB"
                opacity="0.293619792"
                x="235.5"
                y="0.5"
                width="527"
                height="451"
                transform="translate(-320.000000, -180.000000)"
              />
              <path
                id="back-fan"
                d="M0.500015456,334.512545 L0.507890624,586.5 L252.499521,586.5 C252.235652,448.831454 143.017682,336.763448 7.1430388,334.533878 L3.01314849,334.5 C2.17494966,334.5 1.33723221,334.504183 0.500015456,334.512545 Z"
                stroke="#EBE1FB"
                opacity="0.503348214"
                transform="translate(-285.000000, -172.000000)"
              />
              <image
                xlinkHref="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*aRK0RKcWMzEAAAAAAAAAAABkARQnAQ"
                width="120px"
                height="120px"
                x="0px"
                y="350px"
              />
              <rect
                id="back-rect1"
                fill="url(#linearGradient-2)"
                x="290"
                y="424"
                width="21"
                height="21"
              >
                <animate
                  attributeName="y"
                  from="424"
                  to="424"
                  begin="0s"
                  dur="10s"
                  values="424;440;424"
                  keySplines="0.5 0.8 0.6 1; 0.5 0.8 0.6 1;"
                  keyTimes="0;0.5;1"
                  calcMode="spline"
                  repeatCount="indefinite"
                />
              </rect>
              <rect
                id="back-rect2"
                fill="#ffffff"
                filter="url(#rect-shadow)"
                x="312"
                y="445"
                width="28"
                height="28"
              >
                <animate
                  attributeName="y"
                  from="445"
                  to="445"
                  begin="0s"
                  dur="10s"
                  values="445;430;445"
                  keySplines="0.5 0.8 0.6 1; 0.5 0.8 0.6 1;"
                  keyTimes="0;0.5;1"
                  calcMode="spline"
                  repeatCount="indefinite"
                />
              </rect>
              <circle
                id="back-circle"
                fill="#EEEBFD"
                cx="205.5"
                cy="431.5"
                r="1.5"
              />
              <rect
                id="back-rect-top"
                fill="#ffffff"
                filter="url(#rect-shadow)"
                x="39"
                y="0"
                width="24"
                height="24"
              >
                <animate
                  attributeName="y"
                  from="0"
                  to="0"
                  begin="0s"
                  dur="8s"
                  values="0;20;0"
                  keySplines="0.5 0.8 0.6 1; 0.5 0.8 0.6 1;"
                  keyTimes="0;0.5;1"
                  calcMode="spline"
                  repeatCount="indefinite"
                />
              </rect>
            </g>
            <g id="block6" transform="translate(131.000000, 218.000000)">
              <g id="block6-back-white" opacity="0.966843378">
                <use
                  fill="black"
                  fillOpacity="1"
                  filter="url(#filter-10)"
                  xlinkHref="#path-8"
                />
                <use
                  fill="url(#linearGradient-7)"
                  fillRule="evenodd"
                  xlinkHref="#path-8"
                />
                <use
                  fill="black"
                  fillOpacity="1"
                  filter="url(#filter-11)"
                  xlinkHref="#path-8"
                />
              </g>
              <g id="block6-nodes" className={styles.block6NodesContainer}>
                {getBlock6Circles()}
              </g>
            </g>
            <g id="block2" transform="translate(185.000000, 118.000000)">
              <image
                id="block2Back"
                xlinkHref="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*JikGQZ3gmKsAAAAAAAAAAABkARQnAQ"
                width="236px"
                height="236px"
                x="-69px"
                y="-30px"
              />
              <g id="block2-bars" transform="translate(25.000000, 27.000000)">
                <rect
                  id="block2-bar1"
                  className={styles.block2Bar1}
                  fill="url(#linearGradient-27)"
                  x="0"
                  y="0"
                  width="27"
                  height="6"
                />
                <rect
                  id="block2-bar2"
                  className={styles.block2Bar2}
                  fill="url(#linearGradient-28)"
                  x="0"
                  y="12"
                  width="44"
                  height="6"
                />
                <rect
                  id="block2-bar3"
                  className={styles.block2Bar3}
                  fill="url(#linearGradient-29)"
                  x="0"
                  y="24"
                  width="17"
                  height="6"
                />
                <rect
                  id="block2-bar4"
                  className={styles.block2Bar4}
                  fill="url(#linearGradient-30)"
                  x="0"
                  y="36"
                  width="34"
                  height="6"
                />
              </g>
            </g>
            <g id="block8" transform="translate(385.000000, 218.000000)">
              <g id="block8-back-big-white">
                <use
                  fill="black"
                  fillOpacity="1"
                  filter="url(#filter-32)"
                  xlinkHref="#path-31"
                />
                <use fill="#FFFFFF" fillRule="evenodd" xlinkHref="#path-31" />
              </g>
              <g id="block8-back-purple">
                <use
                  fill="url(#radialGradient-15)"
                  fillRule="evenodd"
                  xlinkHref="#path-33"
                />
                <use
                  fill="black"
                  fillOpacity="1"
                  filter="url(#filter-34)"
                  xlinkHref="#path-33"
                />
              </g>
              <rect
                id="block8-back-white"
                stroke="#F0E8FC"
                fill="#FFFFFF"
                x="37.5"
                y="25.5"
                width="63"
                height="63"
              />
              <g id="block8-bars" transform="translate(54.000000, 40.000000)">
                <rect
                  id="block8-bar2"
                  className={styles.block8Bar2}
                  fill="url(#linearGradient-35)"
                  x="12"
                  y="0"
                  width="6"
                  height="33.75"
                />
                <rect
                  id="block8-bar1"
                  className={styles.block8Bar1}
                  fill="url(#linearGradient-36)"
                  x="0"
                  y="10"
                  width="6"
                  height="23.75"
                />
                <rect
                  id="block8-bar3"
                  className={styles.block8Bar3}
                  fill="url(#linearGradient-37)"
                  x="24"
                  y="17"
                  width="6"
                  height="16.875"
                />
              </g>
            </g>
            <g id="blcok5" transform="translate(0.000000, 218.000000)">
              <image
                id="block5Back"
                xlinkHref="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*KpT9QrpQ4ZgAAAAAAAAAAABkARQnAQ"
                width="268px"
                height="268px"
                x="-69px"
                y="-30px"
              />

              <g id="block5-circle" opacity="0.326241629">
                <use fill="#F4E7FF" fillRule="evenodd" xlinkHref="#path-41" />
              </g>
              <path
                id="block5-fan"
                className={styles.block5Fan}
                stroke="url(#block5-gradient)"
                strokeWidth="32.5"
                strokeDasharray="207.24"
                strokeDashoffset="100" //
                d="M65.5,49 C74.336556,49 81.5,56.3873016 81.5,65.5 C81.5,70.0566032 79.7089393,74.1818092 76.8132242,77.1677613"
              />
            </g>
            <g id="block4" transform="translate(439.000000, 92.000000)">
              <mask id="mask-47" fill="white">
                <use xlinkHref="#path-46" />
              </mask>
              <g id="block4-back-purple">
                <use
                  fill="black"
                  fillOpacity="1"
                  filter="url(#filter-48)"
                  xlinkHref="#path-46"
                />
                <use
                  fill="url(#radialGradient-15)"
                  fillRule="evenodd"
                  xlinkHref="#path-46"
                />
                <use
                  fill="black"
                  fillOpacity="1"
                  filter="url(#filter-49)"
                  xlinkHref="#path-46"
                />
              </g>
              <g id="block4-front-back" mask="url(#mask-47)">
                <g transform="translate(64.994468, 55.918147) rotate(10.000000) translate(-64.994468, -55.918147) translate(-40.505532, -50.081853)">
                  <rect
                    id="block4-back-line-verti"
                    className={styles.block4LineVerti}
                    fill="url(#linearGradient-50)"
                    x="64"
                    y="180"
                    width="4"
                    height="192"
                  />
                  <rect
                    id="block4-back-line-hori"
                    className={styles.block4LineHori}
                    fill="url(#linearGradient-51)"
                    x="-1.36424205e-11"
                    y="151"
                    width="202"
                    height="4"
                  />
                  <path
                    id="block4-back-circle"
                    className={styles.block4Circle}
                    stroke="url(#linearGradient-52)"
                    opacity="0.545549665"
                    strokeDasharray="132"
                    strokeWidth="5"
                    d="M111.248537,49.2552483 C107.33563,82.1953597 146.587514,105.361957 164.688607,98.6513257"
                  />
                </g>
              </g>
              <g id="blockk4-pin" mask="url(#mask-47)">
                <use
                  fill="url(#linearGradient-53)"
                  fillRule="evenodd"
                  xlinkHref="#path-54"
                />
              </g>
            </g>
            <g id="blcok7" transform="translate(285.000000, 218.000000)">
              <g id="block7-back-purple">
                <use
                  fill="black"
                  fillOpacity="1"
                  filter="url(#filter-57)"
                  xlinkHref="#path-56"
                />
                <use
                  fill="url(#radialGradient-15)"
                  fillRule="evenodd"
                  xlinkHref="#path-56"
                />
                <use
                  fill="black"
                  fillOpacity="1"
                  filter="url(#filter-58)"
                  xlinkHref="#path-56"
                />
              </g>
              <path
                d="M0.501347558,99.5 L99.4968058,99.5 L99.5000192,99.1328902 L99.5,99.1372666 C99.5,72.2776127 77.3400243,50.5 50,50.5 C22.6599757,50.5 0.5,72.2776127 0.5,99.1372666 C0.5,99.2582303 0.50044932,99.3791419 0.501347558,99.5 Z"
                id="block7-back-fan2"
                stroke="#FFFFFF"
                opacity="0.0636151414"
              />
              <path
                d="M99.4968058,0.5 L0.501347558,0.5 C0.50044932,0.620858103 0.5,0.741769731 0.5,0.862733364 C0.5,27.7223873 22.6599757,49.5 50,49.5 C77.3400243,49.5 99.5,27.7223873 99.5,0.862733364 L99.5000192,0.867109806 L99.4968058,0.5 Z"
                id="block7-back-fan1"
                stroke="#FFFFFF"
                opacity="0.0636151414"
              />
              <g id="block7-phone">
                <use
                  fill="black"
                  fillOpacity="1"
                  filter="url(#filter-62)"
                  xlinkHref="#path-60"
                />
                <use
                  fill="url(#linearGradient-59)"
                  fillRule="evenodd"
                  xlinkHref="#path-60"
                />
              </g>
              <rect
                id="block7-yaxis"
                fill="#DEC9F9"
                mask="url(#mask-61)"
                x="34"
                y="33"
                width="1"
                height="34"
              />
              <rect
                id="block7-xaxis"
                fill="#DEC9F9"
                mask="url(#mask-61)"
                transform="translate(51.000000, 66.500000) scale(1, -1) translate(-51.000000, -66.500000) "
                x="34"
                y="66"
                width="34"
                height="1"
              />
              <path
                id="block7-curve"
                className={styles.block7Curve}
                strokeDasharray="90"
                d="M36,65 C52.5685425,65 66,51.5685425 66,35"
                stroke="#9655FE"
              />
            </g>
            <g id="block3" transform="translate(285.000000, 64.000000)">
              <image
                id="block3Back"
                xlinkHref="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*6vbkRapOLegAAAAAAAAAAABkARQnAQ"
                width="250px"
                height="250px"
                x="-48px"
                y="-22px"
              />
              <g id="block3-arcs" transform="translate(33.000000, 33.000000)">
                <circle
                  id="block3-arc-big"
                  className={styles.block3ArcBig}
                  fill="none"
                  stroke="url(#arc-gradient1)"
                  filter="url(#arc-filter1)"
                  strokeWidth="18"
                  strokeMiterlimit="1"
                  cx="45"
                  cy="45"
                  r="35"
                  strokeDasharray="201"
                  strokeDashoffset="50"
                  transform="rotate(-180 45 45)"
                />
                <circle
                  id="block3-arc-small"
                  className={styles.block3ArcSmall}
                  fill="none"
                  stroke="url(#arc-gradient2)"
                  filter="url(#arc-filter2)"
                  strokeWidth="13"
                  strokeMiterlimit="1"
                  cx="45"
                  cy="45"
                  r="25"
                  strokeDasharray="123.6 1000"
                  strokeDashoffset="100"
                  transform="rotate(0 45 45)"
                />
              </g>
            </g>
            <g id="block1" transform="translate(63.000000, 96.000000)">
              <g
                id="block1-bars"
                transform="translate(29.000000, 26.000000)"
                fill="#DEC9F9"
                opacity="0.503348214"
              >
                <rect id="矩形" x="32" y="0" width="1" height="70" />
                <rect id="矩形备份-18" x="48" y="0" width="1" height="70" />
                <rect id="矩形备份-19" x="64" y="0" width="1" height="70" />
                <rect id="矩形备份-16" x="16" y="0" width="1" height="70" />
                <rect id="矩形备份-17" x="0" y="0" width="1" height="70" />
              </g>
              <g id="block1-back" opacity="0.693987165">
                <use
                  fill="black"
                  fillOpacity="1"
                  filter="url(#filter-79)"
                  xlinkHref="#path-78"
                />
                <use
                  fill="url(#linearGradient-63)"
                  fillRule="evenodd"
                  xlinkHref="#path-78"
                />
              </g>
              <g
                id="block1-circles"
                transform="translate(27.000000, 34.000000)"
              >
                <circle
                  id="block-circle1-shadow"
                  className={styles.block1Circle1}
                  filter="url(#filter-81)"
                  stroke="#8D3FFD"
                  strokeWidth="1"
                  fill="#FFFFFF"
                  fillRule="evenodd"
                  cx="2.5"
                  cy="30"
                  r="3"
                />
                <circle
                  id="block-circle1-object"
                  className={styles.block1Circle1}
                  stroke="#8D3FFD"
                  strokeWidth="1"
                  fill="#FFFFFF"
                  fillRule="evenodd"
                  cx="2.5"
                  cy="30"
                  r="3"
                />

                <circle
                  id="block1-circle2-shadow"
                  className={styles.block1Circle2}
                  filter="url(#filter-83)"
                  stroke="#8D3FFD"
                  strokeWidth="1"
                  fill="#FFFFFF"
                  fillRule="evenodd"
                  cx="18.5"
                  cy="15"
                  r="3"
                />
                <circle
                  id="block1-circle2-object"
                  className={styles.block1Circle2}
                  stroke="#8D3FFD"
                  strokeWidth="1"
                  fill="#FFFFFF"
                  fillRule="evenodd"
                  cx="18.5"
                  cy="15"
                  r="3"
                />

                <circle
                  id="block1-circle3-shadow"
                  className={styles.block1Circle3}
                  filter="url(#filter-85)"
                  stroke="#8D3FFD"
                  strokeWidth="1"
                  fill="#FFFFFF"
                  fillRule="evenodd"
                  cx="34.5"
                  cy="30"
                  r="3"
                />
                <circle
                  id="block1-circle3-object"
                  className={styles.block1Circle3}
                  stroke="#8D3FFD"
                  strokeWidth="1"
                  fill="#FFFFFF"
                  fillRule="evenodd"
                  cx="34.5"
                  cy="30"
                  r="3"
                />

                <circle
                  id="block1-circle4-shadow"
                  className={styles.block1Circle4}
                  filter="url(#filter-87)"
                  stroke="#8D3FFD"
                  strokeWidth="1"
                  fill="#FFFFFF"
                  fillRule="evenodd"
                  cx="50.5"
                  cy="45"
                  r="3"
                />
                <circle
                  id="block1-circle4-object"
                  className={styles.block1Circle4}
                  stroke="#8D3FFD"
                  strokeWidth="1"
                  fill="#FFFFFF"
                  fillRule="evenodd"
                  cx="50.5"
                  cy="45"
                  r="3"
                />

                <circle
                  id="block1-circle5-shadow"
                  className={styles.block1Circle5}
                  filter="url(#filter-89)"
                  stroke="#8D3FFD"
                  strokeWidth="1"
                  fill="#FFFFFF"
                  fillRule="evenodd"
                  cx="66.5"
                  cy="30"
                  r="3"
                />
                <circle
                  id="block1-circle5-object"
                  className={styles.block1Circle5}
                  stroke="#8D3FFD"
                  strokeWidth="1"
                  fill="#FFFFFF"
                  fillRule="evenodd"
                  cx="66.5"
                  cy="30"
                  r="3"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </section>
  );
});

export default BannerSVG;
