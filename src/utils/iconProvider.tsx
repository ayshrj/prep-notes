import React from "react";

const IconProvider: React.FC<{
  strokeWidth?: string | number;
  stroke?: string;
  width?: string | number;
  className?: string;
}> = ({ strokeWidth = 4, stroke = "white", width = 32, className }) => {
  return (
    <svg
      width={width}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth={strokeWidth}
      stroke={stroke}
      className={className}
    >
      <g transform="rotate(-45, 16, 16)">
        <circle cx="16" cy="16" r="14" fill="none" />
        <line x1="2" x2="30" y1="13" y2="13" />
        <line x1="2" x2="30" y1="18" y2="18" />
        <circle cx="22.5" cy="22.5" r="0.001" />
      </g>
    </svg>
  );
};

export default IconProvider;
