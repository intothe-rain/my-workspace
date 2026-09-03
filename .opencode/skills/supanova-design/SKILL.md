---
name: supanova-full-output
description: Overrides default LLM truncation behavior. Enforces complete HTML generation with zero placeholder patterns. Every landing page must be delivered as a complete, production-ready file. No shortcuts, no skeletons, no "add more as needed" patterns.
---

# Supanova Full-Output Enforcement

## Baseline

Treat every landing page generation as production-critical. A partial output is a broken output. If the user asks for a landing page, deliver the COMPLETE landing page — every section, every animation, every responsive breakpoint. No exceptions.

## Banned Output Patterns

The following patterns are hard failures. Never produce them:

**In code blocks:**
- `<!-- ... -->`
- `<!-- rest of sections -->`
- `<!-- similar to above -->`
- `<!-- add more sections as needed -->`
- `<!-- TODO -->`
- `// ...`
- Bare `...` standing in for omitted HTML

**In prose:**
- "Let me know if you want me to continue"
- "I can add more sections if needed"
- "For brevity, I'll show just the hero section"
- "The rest follows the same pattern"

**Structural shortcuts:**
- Outputting only the Hero when a full page was requested
- Showing the first and last section while skipping the middle
- Replacing repeated sections with one example and a description
- Describing what HTML should contain instead of writing it
- Generating a skeleton/wireframe when a complete page was requested

## Execution Process

1. **Scope** — Read the full request. Count how many sections/components are expected. A "landing page" means: nav + hero + social proof + features + testimonials + CTA + footer at minimum (7 sections). Lock the count.
2. **Build** — Generate every section completely with full responsive classes, animations, real content, and proper icons.
3. **Cross-check** — Before output, verify: Does the HTML file have an opening `<!DOCTYPE html>` and closing `</html>`? Are all 7+ sections present?

## Landing Page Completeness Standards

A complete landing page MUST include:

### Required Elements
- `<!DOCTYPE html>` with `<html lang="ko">`
- Complete `<head>` with meta tags, Tailwind CDN
- Navigation (floating glass or minimal bar)
- Hero section (above the fold)
- At least one trust/social proof element
- Feature presentation (3-5 features minimum)
- Testimonials or case studies
- Primary CTA section
- Footer with essential links
- Scroll animation JavaScript
- Complete `</html>` closing

### Required Quality
- Every section has real content (no placeholder text)
- Every section has full responsive classes
- Every interactive element has hover/active states
- Every image has `loading="lazy"`, `alt` text
- All visible text content is in natural Korean
