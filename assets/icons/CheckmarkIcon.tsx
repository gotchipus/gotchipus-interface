import React from 'react';

const CheckmarkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 10"
    width={10}
    height={10}
    fill="none"
    {...props}
  >
    <path
      d="M1 5L4 8L9 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CheckmarkIcon;
