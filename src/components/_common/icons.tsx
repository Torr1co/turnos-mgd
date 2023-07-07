import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import { type Icon } from "~/utils/language/types";

export const VerticalLine = () => {
  return <div className="h-full border-r border-gray-700"></div>;
};

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
    <rect x="18" y="25" width="91" height="91" fill="url(#userIcon)" />
    <defs>
      <pattern
        id="userIcon"
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

export const Xicon = () => (
  <button className="absolute top-4 right-4 ml-auto grid h-10 w-10 items-center rounded-full bg-gray-300 p-1">
    <XMarkIcon className="text-gray-600" />
  </button>
);

export const PetIcon = (props: Icon) => (
  <svg
    width={props.width ?? "124"}
    height={props.height ?? "124"}
    viewBox="0 0 124 124"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <circle opacity="0.3" cx="62" cy="62" r="62" fill="#FFCA0F" />
    <rect
      x="14.3077"
      y="27.4231"
      width="95.3846"
      height="96.5769"
      fill="url(#petIcon1)"
    />
    <defs>
      <pattern
        id="petIcon1"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image0_46_317"
          transform="matrix(0.0105469 0 0 0.0104167 -0.00624999 0)"
        />
      </pattern>
      <image
        id="image0_46_317"
        width="96"
        height="96"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);
export const PetIcon2 = (props: Icon) => (
  <svg
    width="124"
    height="124"
    viewBox="0 0 124 124"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <circle opacity="0.3" cx="64" cy="64" r="60" fill="#FFCA0F" />
    <rect x="9" y="13" width="110" height="111" fill="url(#petIcon2)" />
    <defs>
      <pattern
        id="petIcon2"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image0_46_314"
          transform="matrix(0.0105114 0 0 0.0104167 -0.00454545 0)"
        />
      </pattern>
      <image
        id="image0_46_314"
        width="96"
        height="96"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

export const PetIcon3 = (props: Icon) => (
  <svg
    width="124"
    height="124"
    viewBox="0 0 124 124"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <circle opacity="0.3" cx="62" cy="62" r="62" fill="#FFCA0F" />
    <rect x="15" y="21" width="103" height="103" fill="url(#petIcon3)" />
    <defs>
      <pattern
        id="petIcon3"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use xlinkHref="#image0_46_315" transform="scale(0.0104167)" />
      </pattern>
      <image
        id="image0_46_315"
        width="96"
        height="96"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

export const PetIcon4 = (props: Icon) => (
  <svg
    width="124"
    height="124"
    viewBox="0 0 124 124"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <circle opacity="0.3" cx="63.5" cy="63.5" r="60.5" fill="#FFCA0F" />
    <rect x="8" y="12" width="111" height="112" fill="url(#petIcon4)" />
    <defs>
      <pattern
        id="petIcon4"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image0_46_316"
          transform="matrix(0.0105105 0 0 0.0104167 -0.0045045 0)"
        />
      </pattern>
      <image
        id="image0_46_316"
        width="96"
        height="96"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

export const PET_ICONS = [PetIcon, PetIcon2, PetIcon3, PetIcon4] as const;

export const BookingCancelledIcon = (props: Icon) => (
  <svg
    width={props.width ?? "80"}
    height={props.height ?? "80"}
    viewBox="0 0 124 124"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <circle cx="62" cy="62" r="62" fill="#FCA5A5" />
    <rect
      x="30.8315"
      y="35.809"
      width="63.191"
      height="56.3595"
      rx="10"
      fill="white"
    />
    <rect x="24" y="23" width="76" height="76" fill="url(#bookingCancelled)" />
    <rect
      x="44.761"
      y="54.9575"
      width="34.5961"
      height="29.0442"
      transform="rotate(0.273281 44.761 54.9575)"
      fill="white"
    />
    <path
      d="M52 59L72 79"
      stroke="#444B54"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M72 59L52 79"
      stroke="#444B54"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <defs>
      <pattern
        id="bookingCancelled"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use xlinkHref="#image0_413_667" transform="scale(0.0078125)" />
      </pattern>
      <image
        id="image0_413_667"
        width="128"
        height="128"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

export const BookingIcon = (props: Icon) => (
  <svg
    width={props.width ?? "80"}
    height={props.height ?? "80"}
    viewBox="0 0 81 81"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <circle opacity="0.3" cx="40.5" cy="40.5" r="40.5" fill="#FFCA0F" />
    <rect
      x="20.14"
      y="23.3916"
      width="41.278"
      height="36.8155"
      rx="10"
      fill="white"
    />
    <rect
      x="15.6774"
      y="15.0244"
      width="49.6452"
      height="49.6452"
      fill="url(#bookingIcon)"
    />
    <defs>
      <pattern
        id="bookingIcon"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use xlinkHref="#image0_77_526" transform="scale(0.0078125)" />
      </pattern>
      <image
        id="image0_77_526"
        width="128"
        height="128"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

export const CameraIcon = (props: Icon) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={props.className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
    />
  </svg>
);

export const DogWalkerIcon = (props: Icon) => (
  <svg
    width="124"
    height="124"
    viewBox="0 0 124 124"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <circle opacity="0.3" cx="62" cy="62" r="62" fill="#FFCA0F" />
    <rect x="17" y="19" width="99" height="99" fill="url(#dogWalker)" />
    <rect
      width="62.7143"
      height="5"
      rx="2.5"
      transform="matrix(-0.766044 -0.642788 -0.642788 0.766044 67.2559 58.312)"
      fill="#50C1E4"
    />
    <rect
      width="19.5362"
      height="5"
      rx="2.5"
      transform="matrix(-0.766044 -0.642788 -0.642788 0.766044 87.1794 74.5576)"
      fill="#50C1E4"
    />
    <defs>
      <pattern
        id="dogWalker"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use xlinkHref="#image0_295_674" transform="scale(0.0104167)" />
      </pattern>
      <image
        id="image0_295_674"
        width="96"
        height="96"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

export const DogWatcherIcon = (props: Icon) => (
  <svg
    width="128"
    height="124"
    viewBox="0 0 128 124"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <circle opacity="0.3" cx="62" cy="62" r="62" fill="#FFCA0F" />
    <rect x="58" y="37" width="70" height="87" fill="url(#dogWatcher1)" />
    <rect x="8" y="6" width="47" height="56" fill="url(#dogWatcher2)" />
    <rect
      x="43"
      y="25.1259"
      width="10"
      height="4"
      rx="2"
      transform="rotate(-31.0462 43 25.1259)"
      fill="#50C1E4"
    />
    <rect x="45" y="32" width="10" height="4" rx="2" fill="#50C1E4" />
    <rect
      x="44.6992"
      y="39.6562"
      width="10"
      height="4"
      rx="2"
      transform="rotate(31.07 44.6992 39.6562)"
      fill="#50C1E4"
    />
    <rect
      width="10.2182"
      height="4.08727"
      rx="2.04363"
      transform="matrix(-0.856751 -0.515729 -0.515729 0.856751 20.2618 25.2698)"
      fill="#50C1E4"
    />
    <rect
      width="10"
      height="4"
      rx="2"
      transform="matrix(-1 0 0 1 18 32.3398)"
      fill="#50C1E4"
    />
    <rect
      width="10.2182"
      height="4.08727"
      rx="2.04363"
      transform="matrix(-0.856537 0.516085 0.516085 0.856537 18.5255 40.1172)"
      fill="#50C1E4"
    />
    <defs>
      <pattern
        id="dogWatcher1"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image0_295_657"
          transform="matrix(0.0129902 0 0 0.0104167 -0.247059 0)"
        />
      </pattern>
      <pattern
        id="dogWatcher2"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image1_295_657"
          transform="matrix(0.0123325 0 0 0.0104167 -0.088352 0)"
        />
      </pattern>
      <image
        id="image0_295_657"
        width="96"
        height="96"
        xlinkHref="data:image/png;base64,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"
      />
      <image
        id="image1_295_657"
        width="96"
        height="96"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

export const ServiceIcons = {
  DOGWATCHER: DogWatcherIcon,
  DOGWALKER: DogWalkerIcon,
} as const;
