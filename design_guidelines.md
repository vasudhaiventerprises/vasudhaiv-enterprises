# Design System: TradeMind Dashboard

This document outlines the visual design language, color palette, typography, and UI patterns used in the TradeMind dashboard. You can use this as a reference to implement a similar aesthetic in other projects.

## 1. Typography

The design relies heavily on a clean, modern, and highly legible combination of sans-serif for reading and monospace for data/metrics.

*   **Primary Font (Body/UI):** `IBM Plex Sans` (Weights: 400, 500, 600)
    *   *Usage:* General text, buttons, table headers, standard UI elements.
*   **Secondary Font (Data/Code):** `IBM Plex Mono` (Weights: 400, 500)
    *   *Usage:* Tickers, price values, metrics, inputs, and any numerical data that needs to align cleanly.

**Styling Patterns:**
*   **Section Labels:** Very small font size (10px-11px), uppercase, with wide letter-spacing (`0.1em`). Color is usually muted or hint text.
*   **Metric Values:** Medium font size (13px-15px), monospace, medium weight (500).

---

## 2. Color Palette (Dark Theme)

The interface uses a deep, cool-toned dark theme with vibrant, neon-like accent colors for data visualization and status indicators.

### Background & Surfaces
*   **Base Background:** `#0d0f14` (`--bg`) - The absolute background of the page.
*   **Surface 1:** `#141720` (`--s1`) - Used for the top navigation bar, sidebar, and standard cards.
*   **Surface 2:** `#1c1f2e` (`--s2`) - Used for interactive or elevated elements like signal cards, inputs, and stats blocks.
*   **Surface 3:** `#252840` (`--s3`) - Used for small nested elements like metric chips inside cards or progress bar tracks.
*   **Borders:** `#2a2d40` (`--border`) - Subtle, low-contrast borders to separate sections without being distracting.

### Text Colors
*   **Primary Text:** `#d4d8f0` (`--text`) - Light bluish-gray, softer on the eyes than pure white.
*   **Muted Text:** `#666880` (`--muted`) - Used for labels, secondary information, and table headers.
*   **Hint Text:** `#444660` (`--hint`) - Used for very low emphasis text like timestamps or tiny section headers.

### Accents & Status
*   **Brand / Action (Purple):** `#9d7cf7` (`--purple`) - Primary buttons, logo accents, hover states, and sentiment metrics.
*   **Positive / Buy (Green):** `#2dd4a0` (`--green`) - Buy signals, positive P&L, live status dots, high volume.
*   **Negative / Sell (Red):** `#f75c7c` (`--red`) - Sell signals, negative P&L, losses.
*   **Warning / Hold (Amber):** `#f7c948` (`--amber`) - Paper mode, hold signals, medium drawdown.
*   **Info / Open (Blue):** `#5b8dee` (`--blue`) - Open trades, technical metrics.

---

## 3. Front Look & UI Elements

The overall feel is a professional, high-density financial terminal. It feels sleek, data-rich, and modern.

### Layout & Spacing
*   **Structure:** A fixed top navbar with a split main layout (a fixed-width sidebar for portfolio/global stats, and a flexible main area for grids).
*   **Grid Systems:** Heavy use of CSS Grid (`grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));`) to create responsive masonry-like dashboards.
*   **Borders & Radii:** Rounded corners but not overly bubbly. Cards use `8px` or `10px` border-radius.

### Cards & Panels
*   **Base Cards:** Background `--s1`, border `--border`, padding `16px`.
*   **Interactive Cards (e.g., Signals):**
    *   Background `--s2`, with a `3px` solid colored left border (green for buy, red for sell).
    *   **Gradients:** A subtle linear gradient starting from the left, fading into the base surface color to give a "glow" effect.
        *   *Buy Gradient Example:* `linear-gradient(135deg, rgba(45,212,160,0.05) 0%, #1c1f2e 60%)`
    *   **Hover State:** Border color changes to the brand purple (`#9d7cf7`).

### Small Details & Micro-UI
*   **Status Badges (Pills):** Rounded pills (`border-radius: 20px`) with a solid text color and a 15% opacity background of the same color.
    *   *Example:* `color: #2dd4a0; background: rgba(45,212,160,0.15);`
*   **Score Bars:** Thin horizontal progress bars (3px height) to visually represent data (e.g., final scores, technical breakdown) instead of just showing numbers.
*   **Animations:** Subtle micro-animations, like a blinking opacity keyframe for the "Live" status dot.
*   **Inputs & Buttons:** Inputs have the `--s2` background. Buttons are either outline style (surface background, border, text color) or solid accent (`--purple` background, white text). Both transition their border/text color on hover.
