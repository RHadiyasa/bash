import * as React from 'react';

import { IconSvgProps } from '../../types';

export const Logo: React.FC<IconSvgProps> = ({ size = 36, width, height, ...props }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 17.8332C10 20.1344 8.20914 21.9999 6 21.9999C3.79086 21.9999 2 20.1344 2 17.8332C2 16.3934 3.56593 14.4717 4.73823 13.2347C5.43222 12.5025 6.56778 12.5025 7.26177 13.2347C8.43407 14.4717 10 16.3934 10 17.8332Z"
      fill="currentColor"
    />
    <path
      d="M22 17.8332C22 20.1344 20.2091 21.9999 18 21.9999C15.7909 21.9999 14 20.1344 14 17.8332C14 16.3934 15.5659 14.4717 16.7382 13.2347C17.4322 12.5025 18.5678 12.5025 19.2618 13.2347C20.4341 14.4717 22 16.3934 22 17.8332Z"
      fill="currentColor"
    />
    <path
      d="M16 7.83319C16 10.1344 14.2091 11.9999 12 11.9999C9.79086 11.9999 8 10.1344 8 7.83319C8 6.39337 9.56593 4.47165 10.7382 3.23473C11.4322 2.50249 12.5678 2.50249 13.2618 3.23473C14.4341 4.47165 16 6.39337 16 7.83319Z"
      fill="currentColor"
    />
  </svg>
);

export const DiscordIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
  return (
    <svg height={size || height} viewBox="0 0 24 24" width={size || width} {...props}>
      <path
        d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z"
        fill="currentColor"
      />
    </svg>
  );
};

export const TwitterIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
  return (
    <svg height={size || height} viewBox="0 0 24 24" width={size || width} {...props}>
      <path
        d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"
        fill="currentColor"
      />
    </svg>
  );
};

export const GithubIcon: React.FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => {
  return (
    <svg height={size || height} viewBox="0 0 24 24" width={size || width} {...props}>
      <path
        clipRule="evenodd"
        d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const MoonFilledIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
  <svg width="48" height="28" viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1818_640)">
      <rect width="48" height="28" rx="14" fill="#006FEE" />
      <g filter="url(#filter0_ddd_1818_640)">
        <rect x="24" y="4" width="20" height="20" rx="10" fill="white" />
      </g>
      <path
        d="M34 18.0833C36.2552 18.0833 38.0833 16.2551 38.0833 14C38.0833 11.7448 36.2552 9.91663 34 9.91663C31.7448 9.91663 29.9167 11.7448 29.9167 14C29.9167 16.2551 31.7448 18.0833 34 18.0833Z"
        fill="#292D32"
      />
      <path
        d="M34 20.3934C33.6792 20.3934 33.4167 20.1542 33.4167 19.8334V19.7867C33.4167 19.4659 33.6792 19.2034 34 19.2034C34.3208 19.2034 34.5833 19.4659 34.5833 19.7867C34.5833 20.1075 34.3208 20.3934 34 20.3934ZM38.165 18.7484C38.0133 18.7484 37.8675 18.69 37.7508 18.5792L37.675 18.5034C37.4475 18.2759 37.4475 17.9084 37.675 17.6809C37.9025 17.4534 38.27 17.4534 38.4975 17.6809L38.5733 17.7567C38.8008 17.9842 38.8008 18.3517 38.5733 18.5792C38.4625 18.69 38.3167 18.7484 38.165 18.7484ZM29.835 18.7484C29.6833 18.7484 29.5375 18.69 29.4208 18.5792C29.1933 18.3517 29.1933 17.9842 29.4208 17.7567L29.4967 17.6809C29.7242 17.4534 30.0917 17.4534 30.3192 17.6809C30.5467 17.9084 30.5467 18.2759 30.3192 18.5034L30.2433 18.5792C30.1325 18.69 29.9808 18.7484 29.835 18.7484ZM39.8333 14.5834H39.7867C39.4658 14.5834 39.2033 14.3209 39.2033 14C39.2033 13.6792 39.4658 13.4167 39.7867 13.4167C40.1075 13.4167 40.3933 13.6792 40.3933 14C40.3933 14.3209 40.1542 14.5834 39.8333 14.5834ZM28.2133 14.5834H28.1667C27.8458 14.5834 27.5833 14.3209 27.5833 14C27.5833 13.6792 27.8458 13.4167 28.1667 13.4167C28.4875 13.4167 28.7733 13.6792 28.7733 14C28.7733 14.3209 28.5342 14.5834 28.2133 14.5834ZM38.0892 10.4942C37.9375 10.4942 37.7917 10.4359 37.675 10.325C37.4475 10.0975 37.4475 9.73004 37.675 9.50254L37.7508 9.42671C37.9783 9.19921 38.3458 9.19921 38.5733 9.42671C38.8008 9.65421 38.8008 10.0217 38.5733 10.2492L38.4975 10.325C38.3867 10.4359 38.2408 10.4942 38.0892 10.4942ZM29.9108 10.4942C29.7592 10.4942 29.6133 10.4359 29.4967 10.325L29.4208 10.2434C29.1933 10.0159 29.1933 9.64837 29.4208 9.42087C29.6483 9.19337 30.0158 9.19337 30.2433 9.42087L30.3192 9.49671C30.5467 9.72421 30.5467 10.0917 30.3192 10.3192C30.2083 10.4359 30.0567 10.4942 29.9108 10.4942ZM34 8.77337C33.6792 8.77337 33.4167 8.53421 33.4167 8.21337V8.16671C33.4167 7.84587 33.6792 7.58337 34 7.58337C34.3208 7.58337 34.5833 7.84587 34.5833 8.16671C34.5833 8.48754 34.3208 8.77337 34 8.77337Z"
        fill="#292D32"
      />
    </g>
    <defs>
      <filter
        id="filter0_ddd_1818_640"
        x="14"
        y="-4"
        width="40"
        height="40"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="0.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1818_640" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
        <feBlend mode="normal" in2="effect1_dropShadow_1818_640" result="effect2_dropShadow_1818_640" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="2.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" />
        <feBlend mode="normal" in2="effect2_dropShadow_1818_640" result="effect3_dropShadow_1818_640" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow_1818_640" result="shape" />
      </filter>
      <clipPath id="clip0_1818_640">
        <rect width="48" height="28" rx="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const SunFilledIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
  <svg width="48" height="28" viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1818_658)">
      <rect width="48" height="28" rx="14" fill="#3F3F46" />
      <g filter="url(#filter0_ddd_1818_658)">
        <rect x="4" y="4" width="20" height="20" rx="10" fill="white" />
      </g>
      <path
        d="M19.5592 16.2925C19.4658 16.135 19.2033 15.89 18.55 16.0066C18.1883 16.0708 17.8208 16.1 17.4533 16.0825C16.0942 16.0241 14.8633 15.4 14.0058 14.4375C13.2475 13.5916 12.7808 12.4891 12.775 11.2991C12.775 10.6341 12.9033 9.99247 13.1658 9.3858C13.4225 8.79663 13.2417 8.48747 13.1133 8.35913C12.9792 8.22497 12.6642 8.0383 12.0458 8.29497C9.66 9.2983 8.18417 11.69 8.35917 14.2508C8.53417 16.66 10.2258 18.7191 12.4658 19.495C13.0025 19.6816 13.5683 19.7925 14.1517 19.8158C14.245 19.8216 14.3383 19.8275 14.4317 19.8275C16.3858 19.8275 18.2175 18.9058 19.3725 17.3366C19.7633 16.7941 19.6583 16.45 19.5592 16.2925Z"
        fill="#292D32"
      />
    </g>
    <defs>
      <filter
        id="filter0_ddd_1818_658"
        x="-6"
        y="-4"
        width="40"
        height="40"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="0.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1818_658" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
        <feBlend mode="normal" in2="effect1_dropShadow_1818_658" result="effect2_dropShadow_1818_658" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="2.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" />
        <feBlend mode="normal" in2="effect2_dropShadow_1818_658" result="effect3_dropShadow_1818_658" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow_1818_658" result="shape" />
      </filter>
      <clipPath id="clip0_1818_658">
        <rect width="48" height="28" rx="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const HeartFilledIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);

export const SearchIcon = (props: IconSvgProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path d="M22 22L20 20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
);
