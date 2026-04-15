interface LogoProps {
  className?: string;
  width?: number;
}

export function Logo({ className, width = 100 }: LogoProps) {
  const height = Math.round(width * 0.4);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 250 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="250" height="100" rx="4" fill="#1a2e14" />
      <text
        x="125"
        y="38"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="12"
        fontWeight="bold"
        letterSpacing="3"
        fill="#c8b97a"
      >
        C.H.C. HORSES
      </text>
      <text
        x="125"
        y="68"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="24"
        fontWeight="bold"
        letterSpacing="2"
        fill="white"
      >
        LA FATTORIA
      </text>
    </svg>
  );
}
