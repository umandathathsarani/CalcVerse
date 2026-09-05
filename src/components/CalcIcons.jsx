/**
 * CalcVerse Calculator Icons
 * SVG icons for each calculator type, styled for both dark/light themes.
 */

export function BasicCalcIcon({ size = 40, color = '#6366F1' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill={color} fillOpacity="0.15"/>
      <rect x="10" y="10" width="20" height="20" rx="3" stroke={color} strokeWidth="1.5" fill="none"/>
      <rect x="13" y="13" width="5" height="3" rx="1" fill={color} fillOpacity="0.6"/>
      <rect x="22" y="13" width="5" height="3" rx="1" fill={color} fillOpacity="0.6"/>
      <rect x="13" y="19" width="5" height="3" rx="1" fill={color} fillOpacity="0.6"/>
      <rect x="22" y="19" width="5" height="3" rx="1" fill={color}/>
      <rect x="13" y="25" width="14" height="3" rx="1" fill={color} fillOpacity="0.4"/>
    </svg>
  );
}

export function ScientificCalcIcon({ size = 40, color = '#8B5CF6' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill={color} fillOpacity="0.15"/>
      <path d="M11 29 Q14 20, 17 23 Q20 26, 23 17 Q26 8, 29 18" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <text x="20" y="35" fontFamily="JetBrains Mono, monospace" fontSize="6" fill={color} fillOpacity="0.7" textAnchor="middle">sin cos π</text>
    </svg>
  );
}

export function GraphingCalcIcon({ size = 40, color = '#06B6D4' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill={color} fillOpacity="0.15"/>
      {/* Axes */}
      <line x1="10" y1="30" x2="32" y2="30" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      <line x1="10" y1="10" x2="10" y2="30" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      {/* Curve */}
      <path d="M10 25 Q16 10, 21 20 Q26 30, 32 12" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="21" cy="20" r="2" fill={color}/>
    </svg>
  );
}

export function FinancialCalcIcon({ size = 40, color = '#10B981' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill={color} fillOpacity="0.15"/>
      {/* Bar chart */}
      <rect x="10" y="24" width="5" height="7" rx="1.5" fill={color} fillOpacity="0.5"/>
      <rect x="17.5" y="18" width="5" height="13" rx="1.5" fill={color} fillOpacity="0.7"/>
      <rect x="25" y="12" width="5" height="19" rx="1.5" fill={color}/>
      {/* Dollar sign */}
      <text x="20" y="11" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700" fill={color} fillOpacity="0.8" textAnchor="middle">$</text>
    </svg>
  );
}

export function ProgrammerCalcIcon({ size = 40, color = '#F59E0B' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill={color} fillOpacity="0.15"/>
      <text x="20" y="16" fontFamily="JetBrains Mono, monospace" fontSize="7" fontWeight="600" fill={color} textAnchor="middle">01101</text>
      <text x="20" y="24" fontFamily="JetBrains Mono, monospace" fontSize="7" fontWeight="600" fill={color} fillOpacity="0.6" textAnchor="middle">10110</text>
      <text x="20" y="32" fontFamily="JetBrains Mono, monospace" fontSize="7" fontWeight="600" fill={color} fillOpacity="0.35" textAnchor="middle">FF A3</text>
    </svg>
  );
}

export function UnitConverterIcon({ size = 40, color = '#EC4899' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill={color} fillOpacity="0.15"/>
      {/* Left arrow */}
      <path d="M12 17 L10 20 L12 23" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Right arrow */}
      <path d="M28 17 L30 20 L28 23" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Connecting line */}
      <line x1="10" y1="20" x2="30" y2="20" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      {/* Labels */}
      <text x="14" y="14" fontFamily="Inter, sans-serif" fontSize="6" fontWeight="600" fill={color} fillOpacity="0.8">km</text>
      <text x="24" y="28" fontFamily="Inter, sans-serif" fontSize="6" fontWeight="600" fill={color} fillOpacity="0.8">mi</text>
    </svg>
  );
}

/**
 * Get the icon component for a given calculator id
 */
export function getCalcIcon(id, size, color) {
  const icons = {
    basic: BasicCalcIcon,
    scientific: ScientificCalcIcon,
    graphing: GraphingCalcIcon,
    financial: FinancialCalcIcon,
    programmer: ProgrammerCalcIcon,
    'unit-converter': UnitConverterIcon,
  };
  const IconComponent = icons[id];
  return IconComponent ? <IconComponent size={size} color={color} /> : null;
}
