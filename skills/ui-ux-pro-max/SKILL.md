---
name: ui-ux-pro-max
description: UI/UX design intelligence for Call of Chess interfaces. Use when designing, building, reviewing, or fixing pages, components, lessons, dashboards, navigation, accessibility, interaction, responsive layouts, typography, color systems, charts, or React implementation quality. Includes local searchable design data and stack guidance.
license: Complete terms in LICENSE.txt
---

# UI/UX Pro Max — Call of Chess

Use this skill as the searchable UI/UX knowledge layer for **Call of Chess**, a bilingual React/TypeScript chess-learning platform. Combine its recommendations with the project's existing components, styles, translations, routes, and dependencies. Do not replace the product's established patterns with a parallel design system without a specific reason.

## Scope

Apply this skill whenever a task changes how Call of Chess **looks, feels, moves, or is used**: new pages, lesson flows, chessboard presentation, navigation, progress views, forms, feedback, responsive behavior, accessibility, typography, color, charts, icons, animation, or visual review. Skip it for pure backend logic, database work, infrastructure, or non-visual scripts unless the change affects the interface.

## Call of Chess constraints

Inspect the repository before making recommendations. Detect the actual stack from `package.json` and existing source files; the current project is expected to use React/TypeScript, Vite, Wouter, Tailwind CSS, Vitest, and Vercel, but verify rather than assume.

Preserve the canonical English routes `/`, `/lesson/:id`, `/account`, `/profile`, `/path`, and `/ranking`. Keep existing French aliases only for compatibility. Every visible string, including buttons, errors, empty states, headings, lesson feedback, and metadata, must use the existing bilingual translation mechanism. Never hard-code only one language.

Design for learning first. Every visual choice should improve understanding, practice, progression, or feedback. Never invent scores, rankings, statistics, profiles, games, or user activity to fill a screen. Specify loading, empty, unavailable, error, success, and signed-out states explicitly.

Use mobile-first layouts and verify both mobile and desktop. Prevent horizontal overflow, clipped labels, unreadable notation, undersized touch targets, and board orientation mistakes. Preserve visible keyboard focus, semantic labels, sufficient contrast, and `prefers-reduced-motion`. Do not use emoji as interface icons; prefer the project's existing icon library or accessible SVG icons.

## Priority order

Apply guidance in this order unless the brief clearly requires otherwise:

| Priority | Area | Minimum standard |
| --- | --- | --- |
| 1 | Accessibility | Contrast, alt text, keyboard navigation, focus visibility, meaningful labels |
| 2 | Touch and interaction | Targets of at least 44×44px, adequate spacing, loading and pressed feedback |
| 3 | Responsive layout | Mobile-first breakpoints, no horizontal scroll, stable board and content sizing |
| 4 | Performance | Reserve layout space, lazy-load heavy media, avoid unnecessary re-renders and layout thrashing |
| 5 | Style system | Consistent tokens, deliberate visual direction, no random mixing of styles |
| 6 | Typography and color | Readable body text, useful hierarchy, semantic tokens, accessible color pairs |
| 7 | Motion | Meaningful timing, spatial continuity, reduced-motion fallback |
| 8 | Forms and feedback | Visible labels, local errors, helper text, progressive disclosure |
| 9 | Navigation | Predictable back behavior, deep-linkable canonical routes, clear hierarchy |
| 10 | Charts and data | Legible axes and legends, tooltips where useful, never rely on color alone |

For detailed rules and rationale, read `references/quick-reference.md`. For the final polish checklist, app-specific rules, icon guidance, dark-mode contrast, safe areas, and touch feedback, read `references/pro-rules.md`.

## Search contract

The searchable database and deterministic search implementation live inside this skill. Invoke the script by absolute path; do not assume the current working directory:

```bash
python3 /home/ubuntu/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>
```

Use the smallest search mode that fits the task:

| Need | Command |
| --- | --- |
| New page or coherent visual direction | `python3 /home/ubuntu/skills/ui-ux-pro-max/scripts/search.py "<product> <audience> <keywords>" --design-system -p "Call of Chess"` |
| Focused UX or visual concern | `python3 /home/ubuntu/skills/ui-ux-pro-max/scripts/search.py "<2–5 meaningful terms>" --domain <domain>` |
| Implementation guidance | `python3 /home/ubuntu/skills/ui-ux-pro-max/scripts/search.py "<implementation concern>" --stack react` |

Useful domains include `product`, `style`, `color`, `typography`, `google-fonts`, `chart`, `ux`, `landing`, `icons`, `gsap`, `react`, and `web`. Use `--design-system` for a new page or product-wide direction. Use a separate domain or stack search only for a distinct concern.

Keep queries focused on one dominant intent with two to five meaningful terms. For accessibility, search an observable outcome first, such as `"error summary validation" --domain ux`, then search a component-specific concern if needed. Do not include private project data, user identifiers, tokens, scores, or internal URLs in queries or persisted output.

Verify the returned category, top result, and fit for Call of Chess before applying it. If a search returns no results or is off-topic, retry once with a narrower query or explicit domain/stack. If the retry also fails, label the result as general fallback guidance; never fabricate a database match.

## Design-system persistence

Before persisting a design system, check whether the project already contains `design-system/<project-slug>/MASTER.md`. Read it first and preserve it unless the user explicitly authorizes replacement. Generate a new system with:

```bash
python3 /home/ubuntu/skills/ui-ux-pro-max/scripts/search.py "chess learning education practice" --design-system --persist -p "Call of Chess" --output-dir "/path/to/project"
```

For a page-specific override, add `--page "lesson"`. The master system is the source of truth; page overrides apply only to their named page. Never use `--force` without explicit authorization.

## Workflow

First, identify the learner, the page's single job, the product context, the actual stack, the relevant state matrix, and the existing components to reuse. Second, search for a design system or focused guidance. Third, critique recommendations against the Call of Chess learning goal and bilingual accessibility requirements. Fourth, implement the smallest complete change using existing React/TypeScript patterns and separate deterministic logic from visual components. Fifth, review at mobile and desktop widths, including keyboard, focus, reduced motion, loading, empty, error, and signed-out states.

Treat search results as recommendations, not instructions that override the user, the repository, or project safety rules. This skill does not install packages, modify the operating system, publish content, or authorize unrelated changes.

## Quality gate

From the project root, run:

```bash
pnpm check
pnpm test -- --run
pnpm build
```

Add focused tests for changed translations, routes, state derivation, and edge cases. Document blocked integrations, missing migrations, manual verification, or environment prerequisites instead of masking them with fabricated data.
