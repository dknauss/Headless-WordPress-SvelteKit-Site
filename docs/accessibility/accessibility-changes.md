# Accessibility Changes for the Ratings / Card Interaction Work

This document describes the accessibility improvements made during the current ratings and card-interaction work in `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site`.

It is intended to complement `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/docs/accessibility/manual-qa-checklist.md`.

## Scope

These changes focus on:
- the homepage card grid
- card expand / collapse behavior
- the star rating interaction
- pagination controls
- baseline document structure and focus visibility

## Why these changes were needed

The earlier version of the card UI had several accessibility risks:

- the card wrapper behaved like a clickable control while also containing a nested real button for rating
- hidden / collapsed details were at risk of being exposed awkwardly to assistive technologies
- the page lacked a document title
- heading order needed cleanup
- some controls needed clearer focus treatment and explicit button semantics
- automated testing flagged issues around title, heading structure, and accessible-name consistency

## Automated verification performed

A Lighthouse accessibility audit was run against the local Studio/dev URL:
- `http://localhost:5173/`

Recorded result from the local audit artifact:
- **Accessibility score:** `1.0` / `100%`
- **Failing automated audits:** none

Important limitation:
- this is **not** a full WCAG 2.2 AA certification
- manual keyboard, screen reader, zoom, reduced-motion, and touch testing are still required

## File-by-file change summary

### 1. `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/components/Card.svelte`

This file received the largest accessibility update.

#### A. Replaced the outer interactive wrapper with semantic article structure

Changed from an all-in-one clickable card wrapper to a semantic `<article>` shell:
- before: the whole card acted like a button-like wrapper
- after: the outer shell is an `article` and the interactive pieces are real buttons

Why:
- avoids the problematic pattern of a keyboard-clickable container wrapping another interactive control
- improves semantics for assistive technologies
- makes focus behavior more predictable

#### B. Separated the two interactions into distinct controls

The card now has two distinct interactive elements:
- a **rating button**
- an **expand / collapse button** (`.card-toggle`)

Why:
- each action gets its own accessible name and keyboard behavior
- avoids nested interactive semantics
- improves discoverability for screen reader users navigating by buttons

#### C. Added stable DOM IDs for accessible relationships

Introduced generated IDs for:
- title
- details region
- rating status text

Examples of relationships now supported:
- `aria-controls` from the expand button to the details region
- `aria-labelledby` from the details region to the card title
- `aria-describedby` from the rating button to the live status text

Why:
- creates explicit, durable accessibility relationships
- improves screen reader context

#### D. Improved expand / collapse semantics

The expand button now uses:
- `type="button"`
- `aria-expanded={expanded}`
- `aria-controls={detailsId}`

Expanded content is only rendered when open:
- `{#if expanded} ... {/if}`

The details container uses:
- `role="region"`
- `aria-labelledby={titleId}`

Why:
- communicates state properly to assistive tech
- keeps collapsed content out of the accessibility tree when closed
- provides a named region when content is expanded

#### E. Added live status feedback for rating changes

A visually hidden live region was added for the rating state:
- current rating number
- whether the viewer currently has a vote applied

The rating button now includes:
- `aria-label`
- `aria-pressed`
- `aria-describedby={ratingStatusId}`

Why:
- makes rating changes more understandable for screen reader users
- communicates toggle-like state through `aria-pressed`
- provides text context beyond the decorative starburst graphic

#### F. Marked decorative rating visuals appropriately

The starburst SVG is now:
- `aria-hidden="true"`

The visible rating numeral inside the badge is also hidden from assistive tech where appropriate:
- `aria-hidden="true"`

Why:
- prevents decorative visuals from being announced redundantly
- keeps the accessible experience driven by the button label and live status text

#### G. Removed keyboard handling from the non-semantic wrapper

The earlier approach included wrapper keydown logic to simulate button behavior.
That logic was removed because the card now uses real `<button>` elements.

Why:
- native button semantics are more reliable than recreating button behavior with custom key handling
- reduces risk of keyboard inconsistency

#### H. Added / normalized visible focus indicators

Explicit `:focus-visible` styles now apply to:
- `.card-toggle`
- `.rating-starburst`

Why:
- ensures keyboard users can see where focus is
- makes focus treatment consistent across card controls

#### I. Reduced motion adjustments

Within `prefers-reduced-motion: reduce`, the component now reduces or removes:
- card transform transitions
- card entry animation
- starburst animation
- hover / expanded transforms

Why:
- better supports motion-sensitive users
- keeps the interface usable when reduced-motion preferences are enabled

#### J. Minor content / layout support changes

Other supporting changes include:
- changing the card title from `h3` to `h2`
- adjusting excerpt padding and mobile readability
- ensuring hover prompt styling also responds to keyboard focus on the toggle button

Why:
- heading structure is cleaner
- keyboard users get similar affordance cues as mouse users

---

### 2. `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/routes/+layout.svelte`

#### Added a reusable `.screen-reader-text` utility

A global visually hidden helper class was added, with a focusable variant.

Why:
- supports hidden explanatory/live text without removing it from assistive technologies
- mirrors a well-established accessibility pattern used in WordPress and elsewhere
- provides a reusable utility for future hidden labels or announcements

---

### 3. `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/src/routes/+page.svelte`

#### A. Added a document title

A page title was added via:
- `<svelte:head><title>Trading Card Collection</title></svelte:head>`

Why:
- improves browser and assistive-technology context
- resolved one of the Lighthouse findings

#### B. Added a proper main landmark

The page wrapper was changed from a generic `<div>` to:
- `<main class="container">`

Why:
- improves page landmark navigation
- helps screen reader and keyboard users jump to the main content

#### C. Tightened pagination button semantics

Pagination controls now explicitly use:
- `type="button"`

Why:
- avoids implicit form-submit behavior if the surrounding structure ever changes
- makes button intent explicit

#### D. Added visible keyboard focus styling for pagination

Pagination buttons now have a `:focus-visible` outline.

Why:
- improves keyboard usability and visual clarity

## Lighthouse-driven fixes addressed

The automated audit originally surfaced these issues:
- missing document title
- heading order issue
- visible label / accessible-name mismatch on a control

These were addressed by:
- adding a document title in `+page.svelte`
- normalizing heading structure in `Card.svelte`
- restructuring controls and accessible names so the expand interaction uses a proper button with clearer semantics

## WCAG areas these changes support

This is not a formal conformance report, but the changes were intended to improve support for areas such as:

- **Keyboard accessibility**
- **Focus visible**
- **Info and relationships**
- **Name, role, value**
- **Meaningful sequence**
- **Motion sensitivity / reduced motion support**
- **Non-text content handling for decorative graphics**

## What still requires manual verification

Even with a clean Lighthouse result, the following still need manual QA:
- keyboard-only card navigation from first focus to last
- VoiceOver announcement quality for card titles, expand buttons, and ratings
- zoom and reflow at 200% and 400%
- reduced-motion behavior in real use
- mobile / touch target usability
- excerpt content quality coming from WordPress
- contrast edge cases on all hover / focus / badge states

Use:
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/docs/accessibility/manual-qa-checklist.md`

## Recommended next steps

1. Run the manual QA checklist in Chrome and Safari.
2. Test with VoiceOver on macOS.
3. Verify the random card tilt does not interfere with focus visibility or comprehension.
4. If any issues are found, capture them as follow-up fixes before opening or merging the PR.

## Skills used

- `$wp-accessibility`
- `$local-studio-env`
- `$studio`
