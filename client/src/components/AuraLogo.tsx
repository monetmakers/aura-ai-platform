interface AuraLogoProps {
  size?: number;
  showText?: boolean;
  textSize?: string;
  onClick?: () => void;
}

export function AuraLogo({ size = 32, showText = true, textSize = "1.25rem", onClick }: AuraLogoProps) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "0.625rem",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id={`logo-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: "#10b981", stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: "#3b82f6", stopOpacity: 1}} />
          </linearGradient>
        </defs>
        <path 
          d="M16 3L26 8.5V23.5L16 29L6 23.5V8.5L16 3Z" 
          fill={`url(#logo-gradient-${size})`}
        />
        <circle cx="12" cy="14" r="2" fill="white"/>
        <circle cx="20" cy="14" r="2" fill="white"/>
        <path 
          d="M11 19Q16 22 21 19" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          fill="none"
        />
        <circle cx="16" cy="7" r="1" fill="white"/>
        <line 
          x1="16" 
          y1="8" 
          x2="16" 
          y2="11" 
          stroke="white" 
          strokeWidth="1.5" 
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span style={{
          fontSize: textSize,
          fontWeight: 800,
          color: "#f3f4f6",
          letterSpacing: "-0.025em",
          fontFamily: "'Inter', sans-serif",
        }}>
          Aura
        </span>
      )}
    </div>
  );
}
