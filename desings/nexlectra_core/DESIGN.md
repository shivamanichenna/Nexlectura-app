---
name: Nexlectra Core
colors:
  surface: '#faf9f8'
  surface-dim: '#dadad9'
  surface-bright: '#faf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f2'
  surface-container: '#eeeeed'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e1'
  on-surface: '#1a1c1c'
  on-surface-variant: '#594137'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f0ef'
  outline: '#8d7165'
  outline-variant: '#e1bfb1'
  surface-tint: '#a14000'
  primary: '#a14000'
  on-primary: '#ffffff'
  primary-container: '#ff6f1a'
  on-primary-container: '#5b2000'
  inverse-primary: '#ffb694'
  secondary: '#585e6c'
  on-secondary: '#ffffff'
  secondary-container: '#dde2f3'
  on-secondary-container: '#5e6473'
  tertiary: '#565e74'
  on-tertiary: '#ffffff'
  tertiary-container: '#939ab3'
  on-tertiary-container: '#2a3246'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb694'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7b2f00'
  secondary-fixed: '#dde2f3'
  secondary-fixed-dim: '#c1c6d7'
  on-secondary-fixed: '#161c27'
  on-secondary-fixed-variant: '#414754'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#faf9f8'
  on-background: '#1a1c1c'
  surface-variant: '#e3e2e1'
  deep-orange: '#FF6F1A'
  navy-depth: '#1A202C'
  alabaster-base: '#FAF9F8'
  zinc-muted: '#71717A'
  dark-surface: '#0B0E14'
  dark-border: '#1E293B'
typography:
  headline-xl:
    fontFamily: Poppins
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Poppins
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1.1'
  headline-xl-mobile:
    fontFamily: Poppins
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 20px
---

## Brand & Style

The design system embodies a premium, futuristic EdTech personality—blending the utility of high-end developer tools with the warmth of a high-performance learning environment. It targets tech-forward learners and professionals who value efficiency and AI-driven insights.

The aesthetic is **Minimalist Silicon Valley**, drawing inspiration from Notion AI's clean utility and the modern component-centric look of 21st.dev. It leverages high-quality whitespace, crisp typography, and subtle **Glassmorphism** for a sense of technological sophistication. The overall feel is intellectual yet approachable, utilizing "bounce" physics for motion to maintain a sense of delight and momentum without sacrificing professional gravity.

## Colors

The palette centers on a high-energy **Deep Orange** as the primary action color, signifying intelligence and momentum. 

- **Light Mode:** Uses **Soft Alabaster** (#FAF9F8) as the primary canvas to differentiate from standard sterile whites, creating a more "premium paper" feel. **Navy Blue** provides deep contrast for text and structural headers.
- **Dark Mode:** Transitions to a **Dark Surface** (#0B0E14) with Navy Blue accents. Instead of pure black, depth is achieved through layered tones of deep blue and charcoal, ensuring glassmorphic effects remain visible.
- **Accents:** Use **Zinc Muted** for secondary metadata and borders to maintain the minimal aesthetic.

## Typography

This design system uses a dual-font strategy to balance character with readability. 

- **Headings:** **Poppins** provides a geometric, modern structure that feels friendly yet authoritative. Tighten letter spacing on larger headlines for a more "designed" editorial look.
- **Body & UI:** **Inter** is utilized for its exceptional legibility at small sizes and its neutral, systematic feel. It handles data-heavy EdTech screens with precision.
- **Scaling:** On mobile devices, headline sizes scale down slightly while maintaining line-height ratios to ensure optimal readability within narrow viewports.

## Layout & Spacing

The layout follows a **Fluid Grid** model optimized for mobile-first SaaS delivery. 

- **Spacing Rhythm:** Based on a 4px baseline grid. Use 16px (md) for standard internal padding and 24px (lg) for section separation.
- **Mobile Layout:** 1-column layout with 20px side margins. Elements should span the full width or use a horizontal scroll (carousel) for card-based content like "Course Suggestions."
- **Tablet/Desktop:** Content is centered with a max-width container of 1024px. Use a 12-column grid for dashboard views where widgets occupy 4 or 6 column spans.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Glassmorphism**.

1.  **Base Layer:** The Alabaster background.
2.  **Surface Layer:** Cards and containers use a white or near-white background with very subtle, extra-diffused shadows (0px 4px 20px rgba(0,0,0,0.04)).
3.  **Overlays:** Modals and Bottom Navigation use a **Backdrop Blur** (12px to 20px) with 80% opacity. In Dark Mode, these overlays should have a 1px "ghost border" (#FFFFFF10) to define the edge against dark backgrounds.
4.  **Interactive Depth:** Elements scale up by 2% on hover/press to simulate physical proximity.

## Shapes

The design system employs a **Rounded** shape language to evoke a friendly, modern SaaS feel. 

- **Standard Elements:** Buttons, Input Fields, and small widgets use a 16px corner radius.
- **Large Containers:** Cards and Modals use a 24px corner radius to emphasize a "contained" and safe learning environment.
- **Badges:** Use a full pill-shape (999px) to distinguish them from interactive buttons.

## Components

- **Buttons:** 
    - *Primary:* Deep Orange background, white text. High-bounce physics on tap.
    - *Secondary:* Navy Blue background or Soft Alabaster with a thin border.
    - *Ghost:* No background, Inter medium weight text in Navy or Orange.
- **Input Fields:** 16px radius, Alabaster background with a 1px border that turns Deep Orange on focus. Labels sit above the field in `label-md`.
- **Bottom Nav Bar:** Frosted glass effect with a subtle top border. Icons use a "fill-on-active" state with a small bounce animation.
- **Cards:** 24px radius, white background (light) or Navy-surface (dark). Padding should be a consistent 20px.
- **Shimmer Loaders:** Use a soft gradient animation from Alabaster to a slightly darker grey-beige to simulate content loading without jarring the user.
- **Toggles:** Pill-shaped with a tactile "knob" that scales slightly when toggled.
- **Modals:** Slide up from the bottom on mobile (Bottom Sheets), with a 24px top-radius and a grab-handle indicator.