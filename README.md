# CalcVerse

> **One place for every calculation.**

A modern, multi-purpose calculator platform featuring six specialized calculators — built as a developer portfolio project with React and Vite.

![CalcVerse](https://img.shields.io/badge/CalcVerse-v0.1.0-6366F1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## Features

- 🌙 **Dark-first design** with full light mode support
- 💾 **Theme persistence** via localStorage
- 📱 **Fully responsive** — desktop, tablet, mobile
- ⌨️ **Keyboard support** on applicable calculators
- 📜 **Calculation history** stored locally
- ♿ **Accessible** — semantic HTML, ARIA labels, focus states
- ⚡ **Fast** — lazy loading, no unnecessary dependencies

---

## Calculators

| Calculator | Description | Status |
|---|---|---|
| 🔢 Basic Calculator | Everyday arithmetic with keyboard support | ✅ Phase 3 |
| 🔬 Scientific Calculator | Trig, log, constants, DEG/RAD modes | ✅ Phase 4 |
| 📈 Graphing Calculator | Plot equations on an interactive coordinate plane | ✅ Phase 5 |
| 💰 Financial Calculator | Loans, interest, investments, amortization | ✅ Phase 6 |
| 💻 Programmer Calculator | BIN/OCT/DEC/HEX conversion and bitwise ops | ✅ Phase 7 |
| 📏 Unit Converter | 9 categories: length, weight, temperature, and more | ✅ Phase 8 |

---

## Tech Stack

- **React 18** — UI library
- **Vite 5** — Build tool and dev server
- **React Router v6** — Client-side routing
- **CSS Modules** — Scoped component styles
- **React Icons** — Icon library
- **LocalStorage** — Persistent preferences and history

---

## Installation

```bash
# Clone the repository
git clone https://github.com/umandathathsarani/CalcVerse.git
cd CalcVerse

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## Running Locally

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## Project Structure

```
calcverse/
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── calculators/         # Individual calculator pages
│   │   ├── BasicCalculator.jsx
│   │   ├── ScientificCalculator.jsx
│   │   ├── GraphingCalculator.jsx
│   │   ├── FinancialCalculator.jsx
│   │   ├── ProgrammerCalculator.jsx
│   │   └── UnitConverter.jsx
│   │
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── CalculatorCard.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── Button.jsx
│   │   └── CalcIcons.jsx
│   │
│   ├── context/
│   │   └── ThemeContext.jsx  # Dark/light theme management
│   │
│   ├── data/
│   │   └── calculators.js   # Calculator metadata (single source of truth)
│   │
│   ├── pages/               # Route-level page components
│   │   ├── Home.jsx
│   │   ├── Calculators.jsx
│   │   ├── History.jsx
│   │   └── About.jsx
│   │
│   ├── App.jsx              # Root component with routing
│   ├── main.jsx             # React entry point
│   └── index.css            # Global design system & CSS tokens
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Routes

| Path | Page |
|---|---|
| `/` | Home page |
| `/calculators` | All calculators |
| `/calculators/basic` | Basic Calculator |
| `/calculators/scientific` | Scientific Calculator |
| `/calculators/graphing` | Graphing Calculator |
| `/calculators/financial` | Financial Calculator |
| `/calculators/programmer` | Programmer Calculator |
| `/calculators/unit-converter` | Unit Converter |
| `/history` | Calculation history |
| `/about` | About page |

---

## Future Improvements

- Date & Age Calculator
- BMI & Health Calculator
- Matrix Calculator
- Statistics Calculator
- Fraction Calculator
- Currency Converter (live rates)
- Probability Calculator
- PWA support (offline mode)
- Export calculations to PDF

---

## Contributing

This is a personal portfolio project. Feedback and suggestions are welcome via GitHub Issues.

---

## License

MIT © 2026 [umandathathsarani](https://github.com/umandathathsarani)
