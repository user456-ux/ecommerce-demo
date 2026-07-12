# Ecommerce Demo

A lightweight storefront demo built with plain HTML, CSS, and JavaScript — no framework, no build step, and only a single dev dependency (for linting). It showcases a full front-end shopping experience: product browsing, search and category filtering, a persistent cart, per-product photo selection, and a light/dark theme toggle.

## Features

- **Product catalog** — 16 products across three categories (Accessories, Electronics, Plants), each with a real photo gallery.
- **Photo selector** — every product ships with 3 real photos and a thumbnail swatch selector next to its title to preview each one.
- **Search** — live, case-insensitive filtering by product name.
- **Category navigation** — filter the catalog from the header nav, with a responsive collapsible menu on smaller screens.
- **Shopping cart** — add/remove items, adjust quantities, view a running subtotal; cart state persists across page reloads via `localStorage`.
- **Light/dark theme** — a header toggle switches themes instantly, respects the browser's preferred color scheme by default, and remembers the user's choice.
- **Responsive layout** — adapts from mobile to desktop with no external CSS framework.

## Tech Stack

- HTML5
- CSS3 (custom properties for theming, CSS Grid/Flexbox for layout)
- Vanilla JavaScript (ES6+, no build tooling required)

## Getting Started

This is a static site — no installation or build step is required.

1. Clone the repository:
   ```bash
   git clone https://github.com/user456-ux/ecommerce-demo.git
   cd ecommerce-demo
   ```
2. Open `index.html` directly in a browser, or serve it locally:
   ```bash
   python -m http.server 8080
   ```
   Then visit `http://localhost:8080`.

## Linting

The project uses [ESLint](https://eslint.org) to catch JavaScript errors and enforce a few basic code-quality rules in `script.js`. This is the project's only dependency — a single devDependency (`eslint`), added purely for static analysis, with no runtime dependencies at all.

```bash
npm install
npm run lint
```

Linting also runs automatically in CI via GitHub Actions on every push and pull request to `main` (see `.github/workflows/lint.yml`).

## Project Structure

```
ecommerce-demo/
├── index.html                 # Page markup and layout
├── styles.css                 # Theming, layout, and component styles
├── script.js                  # Product data, cart logic, and UI interactions
├── eslint.config.js           # ESLint configuration
├── package.json                # Single devDependency (eslint) and lint script
├── .github/workflows/lint.yml # CI workflow that runs ESLint
└── images/
    └── products/
        └── <product-id>/      # 3 photos per product (1.jpg, 2.jpg, 3.jpg)
```

## Image Credits

Product photos are sourced from [Wikimedia Commons](https://commons.wikimedia.org) under their respective public domain / Creative Commons licenses. This demo is not intended for production or commercial use as-is; if adapting it for a public-facing project, add proper per-image attribution.

## License

Released under the [MIT License](LICENSE).
