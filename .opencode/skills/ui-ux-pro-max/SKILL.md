---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web, mobile, and desktop. This skill should be used when designing, building, reviewing, or fixing interfaces, including pages, components, design systems, accessibility, interaction, responsive layout, typography, color, charts, and stack-specific UI implementation."
---

# UI/UX Pro Max - Design Intelligence

Searchable local UI/UX guidance: 79 searchable styles (50 active), 192 product palettes and exact reasoning profiles, 74 font pairings, 119 UX guidelines, 105 curated icons, 17 GSAP presets, 25 chart types, and 22 technology stacks.

## When to Apply

Use this Skill when the task involves **UI structure, visual design decisions, interaction patterns, or user experience quality control**: designing new pages, creating/refactoring UI components, choosing color/typography/spacing/layout systems, reviewing UI for UX/accessibility/consistency, implementing navigation/animation/responsive behavior, or improving perceived quality and usability.

Skip it for pure backend logic, API/database design, non-visual performance work, infrastructure/DevOps, or non-visual scripts — unless the task changes how something **looks, feels, moves, or is interacted with**.

## Rule Categories by Priority

| Priority | Category | Impact | Key Checks |
|----------|----------|--------|------------|
| 1 | Accessibility | CRITICAL | Contrast 4.5:1, Alt text, Keyboard nav, Aria-labels |
| 2 | Touch & Interaction | CRITICAL | Min size 44x44px, 8px+ spacing, Loading feedback |
| 3 | Performance | HIGH | WebP/AVIF, Lazy loading, Reserve space (CLS < 0.1) |
| 4 | Style Selection | HIGH | Match product type, Consistency, SVG icons |
| 5 | Layout & Responsive | HIGH | Mobile-first breakpoints, Viewport meta |
| 6 | Typography & Color | MEDIUM | Base 16px, Line-height 1.5, Semantic color tokens |
| 7 | Animation | MEDIUM | Context-aware timing, Motion conveys meaning |
| 8 | Forms & Feedback | MEDIUM | Visible labels, Error near field, Helper text |
| 9 | Navigation Patterns | HIGH | Predictable back, Bottom nav ≤5, Deep linking |
| 10 | Charts & Data | LOW | Legends, Tooltips, Accessible colors |

## Design System Generation

```bash
python scripts/search.py "<query>" --design-system -p "Project Name"
```

## Domain Search

| Need | Domain |
|------|--------|
| Product type patterns | `product` |
| Style options | `style` |
| Color palettes | `color` |
| Font pairings | `typography` |
| Chart recommendations | `chart` |
| UX best practices | `ux` |
| Landing page structure | `landing` |
| Icon recommendations | `icons` |
| GSAP animation presets | `gsap` |
| React/Next.js performance | `react` |

## Stack Guidelines

```bash
python scripts/search.py "<keyword>" --stack <stack>
```

Available stacks: `react`, `nextjs`, `vue`, `svelte`, `astro`, `nuxtjs`, `angular`, `laravel`, `swiftui`, `react-native`, `flutter`, `html-tailwind`, `shadcn`, `threejs`
