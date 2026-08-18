---
name: frontend-design
description: Create distinctive, intentional, accessible React interfaces for Call of Chess without falling back to generic templates. Use when designing, redesigning, or implementing any page, component, lesson flow, dashboard, navigation, responsive layout, or visual system in the Call of Chess chess-learning product.
license: Complete terms in LICENSE.txt
---

# Frontend Design — Call of Chess

Act as the design lead for **Call of Chess**, a bilingual web platform for learning chess. Create interfaces that are visually memorable because they are grounded in chess learning, not because they add decoration. Every visual decision must support at least one product goal: understanding a concept, practicing a position, following progress, or receiving useful feedback.

## Start from the product context

Before changing UI, inspect the repository, existing routes, translation mechanism, design tokens, components, and related screens. Reuse existing components, styles, dependencies, and conventions. Do not invent a parallel design system or add a library when the repository already provides a coherent solution.

Use the canonical English routes `/`, `/lesson/:id`, `/account`, `/profile`, `/path`, and `/ranking`. Preserve French paths only as compatibility aliases when they already exist. Keep all visible strings, labels, errors, empty states, titles, and visible metadata available in both French and English through the existing i18n mechanism; never add hard-coded text in one language.

Never invent scores, profiles, games, rankings, statistics, or user data to make a screen look populated. Design explicit loading, empty, unavailable, error, success, and signed-out states. An empty state should guide the next useful learning action rather than simulate activity.

## Design principles

Treat the hero or first viewport as a thesis about the learning task. Lead with the most characteristic artifact of the subject: a playable position, a lesson objective, a clear progress marker, a tactical question, or an explanatory board state. Do not default to a large marketing gradient, generic dashboard statistics, or decorative chess imagery unless the brief and content justify them.

Give typography a deliberate role. Choose a display treatment with personality and restraint, a highly legible body face, and a utility treatment for coordinates, notation, labels, or compact data when needed. Establish a type scale, weight hierarchy, line length, and spacing rhythm before implementing components. Keep text concise, concrete, and written from the learner's point of view.

Use structural devices only when they carry meaning. Number positions when order matters, use coordinates when they help orientation, and use dividers or labels to clarify the lesson structure. Do not add badges, counters, borders, icons, or gradients merely to fill space.

Spend visual boldness in one place. Pick one signature element appropriate to the brief—such as a distinctive board treatment, a lesson-path motif, a notation-led visual rhythm, or a carefully orchestrated interaction—and keep the surrounding interface disciplined. Remove one decorative element during critique if it does not improve comprehension or actionability.

Use motion only when it teaches, confirms, or improves orientation. Prefer one coherent transition over many scattered effects. Respect `prefers-reduced-motion`, keep animations short, and never make essential content depend on animation.

## Required two-pass workflow

### Pass 1: design plan

Before coding, write a compact plan containing:

1. **Learning job:** the audience, the learner's immediate need, and the page's single primary action.
2. **Palette:** four to six named color tokens with hex values, including surface, text, accent, interactive, success, and error considerations. Verify contrast rather than choosing color by mood alone.
3. **Type:** the roles for display, body, and utility text, with intentional scale and weight choices.
4. **Layout:** a one-sentence structural concept plus a small ASCII wireframe. Explain how the board, lesson content, navigation, and feedback relate.
5. **Signature:** one memorable visual or interaction that comes from chess learning and serves the page's job.
6. **States:** loading, empty, unavailable, error, success, signed-out, mobile, keyboard focus, and reduced-motion behavior.

### Critique before implementation

Challenge the plan against the actual Call of Chess brief. Ask whether the palette, typography, layout, and signature would be the same for a generic SaaS dashboard or another unrelated product. If so, revise them to express the lesson, position, progression, or learner feedback more specifically. Avoid default AI patterns such as warm cream plus serif and terracotta, near-black plus acid green, or dense editorial columns unless the brief genuinely calls for them.

Only implement after the revised plan is coherent. Derive component classes, CSS variables, spacing, and copy from the plan. Keep CSS specificity predictable; avoid generic element selectors that can unintentionally override component classes.

### Pass 2: implementation and critique

Build the smallest complete change using existing React/TypeScript patterns. Separate deterministic logic—translations, state derivation, route decisions, progress calculations, and display formatting—from visual components so it remains testable. Keep components composable and avoid duplicating page-specific variants when an existing component can be extended safely.

Review the result visually at a mobile width and a desktop width. Check for horizontal overflow, clipped text, unreadable tables or notation, touch targets that are too small, and board layouts that lose orientation. Verify visible focus states, keyboard operation, semantic labels, contrast, and reduced motion. Critique the final screen against the plan and remove any ornament that distracts from the learning task.

## Copy and interaction language

Write in the user's vocabulary, not the implementation vocabulary. Say what a learner controls or recognizes, never what the system is built with. Use active, specific verbs: “Start the lesson,” “Try the move,” “Save changes,” and “View the path” are preferable to vague labels such as “Submit” or “Continue” when the action is more specific.

Keep the same action name throughout a flow. A button that says “Save changes” should produce feedback that says “Changes saved.” Explain failures plainly, state what happened, and give the next safe action. Do not apologize for errors or hide unavailable data behind fake content.

For bilingual UI, preserve meaning rather than translating word-for-word. Keep terminology consistent across navigation, lesson content, feedback, account screens, and metadata. Verify both locales whenever a component or route changes.

## Quality gate

Before considering a frontend change complete, run the project's standard checks from its root:

```bash
pnpm check
pnpm test -- --run
pnpm build
```

Add or update focused tests for changed translations, route behavior, state derivation, and boundary cases. If visual or navigation behavior changes, perform a mobile and desktop verification. Document any unavailable integration, migration, environment requirement, or manual verification rather than masking it with fabricated data.
