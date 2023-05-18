import React from "react";

export const Blob = () => (
  <svg
    width="244"
    height="244"
    viewBox="0 0 244 244"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_67_196)">
      <path
        d="M97.3594 74.6869C109.941 64.8581 121.058 48.4937 133.641 45.7458C146.392 43.0745 160.519 53.7758 164.787 67.4586C169.056 81.1413 163.222 97.8964 162.04 111.112C161.102 124.237 164.724 133.578 166.219 148.017C167.715 162.456 167.161 181.825 158.489 185.753C149.908 189.924 133.376 178.731 120.995 170.85C108.691 162.802 100.628 158.31 88.2724 153.475C75.749 148.563 58.9319 143.308 52.8905 133.063C46.849 122.819 51.8269 107.494 61.4538 97.9334C70.8368 88.464 84.8687 84.7595 97.3594 74.6869Z"
        fill="#F1965B"
      />
    </g>
    <defs>
      <clipPath id="clip0_67_196">
        <rect
          width="184"
          height="184"
          fill="white"
          transform="translate(0 167.364) rotate(-65.4483)"
        />
      </clipPath>
    </defs>
  </svg>
);

export const Blob2 = () => (
  <svg
    width="222"
    height="222"
    viewBox="0 0 222 222"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M163.614 46.842C178.71 49.728 190.476 65.49 194.694 82.806C199.134 100.122 196.248 118.992 186.48 131.646C176.934 144.078 160.728 150.516 146.964 156.066C133.2 161.616 122.1 166.5 107.892 170.718C93.4619 175.158 76.1459 179.154 68.8199 171.384C61.2719 163.836 63.9359 144.522 60.1619 128.538C56.1659 112.332 45.5099 99.456 43.9559 84.582C42.4019 69.93 49.7279 53.502 62.3819 49.728C75.0359 45.954 93.0179 55.056 111.444 54.612C129.648 54.168 148.296 43.956 163.614 46.842Z"
      fill="#FFCA0F"
    />
  </svg>
);

export const UserIcon = ({
  width = 128,
  height = 133,
}: {
  width?: number;
  height?: number;
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 128 133"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <circle opacity="0.3" cx="64" cy="62" r="62" fill="#FFCA0F" />
    <ellipse cx="64" cy="110.057" rx="37.434" ry="13.283" fill="white" />
    <rect x="18" y="25" width="91" height="91" fill="url(#pattern0)" />
    <defs>
      <pattern
        id="pattern0"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image0_141_579"
          transform="translate(-0.197802 -0.21978) scale(0.014652)"
        />
      </pattern>
      <image
        id="image0_141_579"
        width="96"
        height="96"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);
