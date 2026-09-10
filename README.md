<div align="center">

# CalcVerse

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

**CalcVerse** is a modern, unified calculator platform designed as a developer portfolio project. Rather than a single tool, it bundles six specialized calculators into one sleek, unified interface.

Built with React 18 and Vite, it focuses on providing a premium user experience through beautiful design, fluid interactions, and deep functionality.

![CalcVerse Home](./Screenshots/01.png)
<br/>
![CalcVerse Theme](./Screenshots/02.png)

</div>

## 🚀 Features

### 1. Basic Calculator
![Basic Calculator](./Screenshots/Basic%20Calculator.png)
A clean, everyday calculator with standard arithmetic operations and a dedicated memory row (`MC`, `MR`, `M+`, `M-`). It tracks your running calculations in a visual history ribbon above the current input.

### 2. Scientific Calculator
![Scientific Calculator](./Screenshots/Scientific.png)
Designed for advanced mathematics, featuring:
- Trigonometric functions (`sin`, `cos`, `tan`, `arcsin`, etc.) with `DEG` / `RAD` toggles.
- Advanced functions (`log`, `ln`, `e`, `π`, roots, exponents).
- An **Unclosed Parentheses Warning** badge to help avoid syntax errors.

### 3. Graphing Calculator
![Graphing Calculator](./Screenshots/Graphing.png)
A real-time function plotter powered by `mathjs` and HTML5 Canvas.
- Plot multiple equations simultaneously with distinct colors.
- Interactive panning and zooming.
- **Evaluate Panel**: Instantly find `y` for a given `x`.
- **Table of Values**: Generate a scrollable data table for a range of `x` values.
- **Export**: Download your graph canvas as a PNG.

### 4. Financial Calculator
![Financial Calculator](./Screenshots/Financial.png)
A comprehensive suite for personal finance planning:
- **Loan / EMI**: Calculate monthly payments and generate an Amortization Schedule (exportable as CSV).
- **Compound Interest**: Predict future value based on varied compounding frequencies.
- **Discount & Tax**: Quickly find final prices after applying markups/discounts.
- **Savings Goal**: Calculate required monthly contributions to hit a target amount.
- **Tip Splitter**: Split bills easily among friends.
- Support for multiple global currencies.

### 5. Programmer Calculator
![Programmer Calculator](./Screenshots/Programmer.png)
A specialized tool for developers handling bitwise logic:
- **Multi-Base Live Display**: See inputs evaluated simultaneously in HEX, DEC, OCT, and BIN.
- **Bitwise Operations**: `AND`, `OR`, `XOR`, `NOT`, and bit shifting (`<<`, `>>`).
- **Dynamic Word Sizing**: Toggle between 8-bit, 16-bit, 32-bit, and 64-bit boundaries.
- **Bit-Map Visualizer**: A clickable grid of 64 bits to flip individual bits manually.
- **Two's Complement** representations for signed integers.

### 6. Unit Converter
![Unit Converter](./Screenshots/Unit%20Converter.png)
Convert across 10 different categories (Length, Weight, Temp, Area, Volume, Speed, Time, Data, Energy, and Currency).
- **Live Currency Rates**: Fetches real-time exchange rates from `open.er-api.com`.
- **Quick Results Grid**: See conversions for *all* units in a category at once.
- **Favourites System**: Pin frequently used units for quick access (persisted in LocalStorage).

### Global App Features
![History & More](./Screenshots/03.png)
- **Calculation History Page**: A dedicated page storing all your calculations. You can search, filter by calculator type, copy results, and clear history.
- **Universal Keyboard Shortcuts**: A quick-access modal (`?` key) lists shortcuts for navigating and using the app.
- **Persistent Theme**: Toggle between Dark and Light mode (persisted in LocalStorage).

![Modals & Features](./Screenshots/04.png)
<br/>
![Additional Features](./Screenshots/05.png)

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Vanilla CSS Modules (no Tailwind)
- **Icons**: `react-icons`
- **Math Engine**: `mathjs` (used for scientific evaluation and graphing)

## 📦 Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/umandathathsarani/CalcVerse.git
   cd CalcVerse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📜 License
This project is licensed under the MIT License.
