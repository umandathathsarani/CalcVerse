/**
 * Calculator metadata — single source of truth for all calculator cards.
 * Add a new entry here to automatically register a new calculator
 * throughout the entire application.
 */
export const calculators = [
  {
    id: 'basic',
    name: 'Basic Calculator',
    tagline: 'Everyday arithmetic, fast.',
    description:
      'Perform simple, everyday calculations with a clean, intuitive interface. From groceries to quick arithmetic, get the answer instantly.',
    features: ['Addition, subtraction, multiplication, division', 'Percentage calculations', 'Memory functions (MC, MR, M+, M−)', 'Keyboard input support', 'Sign toggle & backspace'],
    bestFor: 'Everyday use, shopping & schoolwork',
    useCases: ['Grocery shopping', 'Splitting bills', 'Quick arithmetic', 'Schoolwork'],
    route: '/calculators/basic',
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    icon: 'basic',
    status: 'available',
  },
  {
    id: 'scientific',
    name: 'Scientific Calculator',
    tagline: 'Advanced math, made accessible.',
    description:
      'Tackle complex mathematics with a full-featured scientific calculator. Trigonometry, logarithms, exponents, constants — all in one place.',
    features: ['Trigonometry (sin, cos, tan + inverses)', 'Logarithms (log, ln)', 'Powers, roots & absolute values', 'Constants & random numbers', 'Factorials, percentages & inverses'],
    bestFor: 'University, science & engineering',
    useCases: ['Algebra', 'Calculus', 'Physics problems', 'Engineering calculations'],
    route: '/calculators/scientific',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    icon: 'scientific',
    status: 'available',
  },
  {
    id: 'graphing',
    name: 'Graphing Calculator',
    tagline: 'Visualize equations instantly.',
    description:
      'Plot functions on an interactive coordinate plane. Visualize equations, explore behavior, and evaluate functions at specific values.',
    features: ['Plot multiple functions simultaneously', 'Interactive zoom & pan with scroll', 'On-screen virtual math keypad', 'Function evaluation at x values', 'Grid with axis labels'],
    bestFor: 'Algebra, calculus & mathematics',
    useCases: ['Graphing functions', 'Exploring calculus', 'Comparing equations', 'Visualizing data'],
    route: '/calculators/graphing',
    color: '#06B6D4',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
    icon: 'graphing',
    status: 'available',
  },
  {
    id: 'financial',
    name: 'Financial Calculator',
    tagline: 'Smart tools for your finances.',
    description:
      'Loans, compound interest, investments, and amortization schedules — everything you need to make informed financial decisions.',
    features: ['Loan & EMI calculator', 'Compound interest calculator', 'Savings goals & Salary projections', 'Discount & tax final prices', 'ROI & Tip splitting'],
    bestFor: 'Finance, business & personal planning',
    useCases: ['Loan planning', 'Investment analysis', 'Interest calculations', 'Mortgage planning'],
    route: '/calculators/financial',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    icon: 'financial',
    status: 'available',
  },
  {
    id: 'programmer',
    name: 'Programmer Calculator',
    tagline: 'Built for developers.',
    description:
      'Work across binary, octal, decimal, and hexadecimal with full bitwise operation support. An essential tool for every developer.',
    features: ['BIN / OCT / DEC / HEX live display', 'Bitwise AND, OR, XOR, NOT, NAND, NOR', 'Left shift & right shift by 1 bit', '8 / 16 / 32 / 64-bit word size', 'Click any row to switch base instantly'],
    bestFor: 'Developers, CS students & engineers',
    useCases: ['Number base conversion', 'Bitwise operations', 'Debugging', 'Low-level programming'],
    route: '/calculators/programmer',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    icon: 'programmer',
    status: 'available',
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    tagline: 'Convert anything, instantly.',
    description:
      'Convert between units across length, weight, temperature, area, volume, speed, time, data, and energy — fast and accurately.',
    features: ['9 conversion categories', 'All-unit quick results grid', 'Swap units with one click', 'Temperature special formulas (°C/°F/K)', 'Click any result to set "To" unit'],
    bestFor: 'Students, engineers & everyday use',
    useCases: ['Length conversion', 'Temperature conversion', 'Data size conversion', 'Weight & volume'],
    route: '/calculators/unit-converter',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    icon: 'unit-converter',
    status: 'available',
  },
];

export default calculators;
