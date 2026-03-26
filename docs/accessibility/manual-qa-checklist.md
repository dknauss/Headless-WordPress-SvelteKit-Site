# Manual Accessibility QA Checklist

**Project:** Headless WordPress + SvelteKit Site  
**Primary local URL:** `http://localhost:5173/`  
**Goal:** Verify the card grid, card expansion, ratings interaction, and pagination with manual accessibility checks beyond automated Lighthouse coverage.

## Why this exists

Automated audits are useful, but they do not fully verify WCAG 2.2 AA compliance. This checklist is for manual QA of the current UI and should be run before opening or merging the ratings/accessibility PR.

## Recommended test matrix

Run as much of this matrix as practical:

- **Desktop browser:** latest Chrome
- **Secondary browser:** latest Safari or Firefox
- **Screen reader:** VoiceOver on macOS
- **Keyboard only:** no mouse/trackpad
- **Zoom:** 200% and 400%
- **Reduced motion:** enabled at OS level
- **Touch / narrow viewport:** responsive browser mode or a real phone

## Pass / fail rule

A check passes only if:
- the interaction works as expected
- the UI remains understandable
- focus is visible and predictable
- there is no keyboard trap
- screen reader output is accurate enough to complete the task

---

## 1. Page structure and landmarks

### Check
- Load the homepage.
- Confirm the page has a meaningful document title.
- Confirm there is one clear main content region.
- Confirm headings are announced in a sensible order.

### Pass if
- browser tab title describes the page
- there is a single `main` landmark
- heading structure is sequential and understandable

### Notes
- Inspect card titles to ensure they fit naturally into the overall heading hierarchy.

---

## 2. Keyboard-only navigation

### Check
- Starting at the top of the page, use `Tab` and `Shift+Tab` only.
- Move through all interactive controls:
  - card expand/collapse controls
  - rating buttons
  - pagination buttons
- Activate controls using `Enter` and `Space` where appropriate.

### Pass if
- every interactive control is reachable
- tab order is logical
- no hidden or off-screen control unexpectedly receives focus
- focus never gets trapped
- both `Enter` and `Space` work for buttons

### Fail examples
- focus disappears
- focus jumps unpredictably after expanding a card
- mouse hover behavior is required to access content

---

## 3. Focus visibility

### Check
- Tab through all controls on the page.
- Check focus indicators on both light and dark parts of the design.
- Expand a card and check focus styling again.

### Pass if
- every focused control has a visible indicator
- the indicator is not obscured by shadows or transforms
- focus remains visible at normal zoom and 200% zoom

---

## 4. Card expand/collapse interaction

### Check
- Expand and collapse multiple cards using keyboard only.
- Confirm collapsed content is not announced when the card is closed.
- Confirm expanded content becomes reachable when opened.

### Pass if
- the expand control has a clear accessible name
- state changes are conveyed correctly (`expanded` / `collapsed`)
- hidden content is not exposed prematurely
- expanded content becomes readable and navigable

### Notes
- If card motion or tilt affects usability, note it here.

---

## 5. Rating interaction

### Check
- Tab to a rating control.
- Activate it several times.
- Confirm the visible number updates.
- Confirm any live announcement or status feedback is understandable.
- Try repeated rating actions until rate limiting would normally apply.

### Pass if
- the rating control has a clear accessible name
- state change is announced or otherwise clearly conveyed
- the updated rating is perceivable visually and via assistive tech
- the control remains operable without requiring pointer hover
- any temporary block or rate limit message is understandable

### Fail examples
- screen reader reads only “button” with no context
- rating changes visually but is not announced
- focus jumps away after rating

---

## 6. Screen reader flow

### Check
Using VoiceOver:
- navigate by landmarks
- navigate by headings
- navigate by buttons
- activate card expand controls
- activate rating controls
- move through pagination

### Pass if
- controls have useful names
- duplicate names are still distinguishable by context
- expanded/collapsed state is announced accurately
- the page can be understood without seeing the visual layout

### Suggested prompts to listen for
- Does the card title make sense when announced?
- Is the expand button label clearer than just “Read more”?
- Is the rating button label specific about the card and action?

---

## 7. Zoom and reflow

### Check
- Test at **200% zoom**.
- Test at **400% zoom**.
- Narrow the viewport to a mobile-like width.

### Pass if
- text remains readable
- controls remain operable
- no content overlaps critical controls
- no horizontal scrolling is required for core reading and interaction
- expanded card content is still usable

### Pay attention to
- rating badge placement
- expand button overlap
- card shadows or transforms clipping content

---

## 8. Reduced motion

### Check
- Enable **Reduce Motion** in the OS.
- Reload the page.
- Hover, focus, and expand cards again.

### Pass if
- the interface remains understandable
- motion is reduced or at least not disorienting
- transforms do not create a usability problem for motion-sensitive users

### Notes
- If animation remains purely decorative and mild, document that judgment.
- If motion is still pronounced, log a follow-up issue.

---

## 9. Color and contrast spot check

### Check
Manually inspect:
- card title text
- body text
- button labels
- rating numeral
- focus ring / focus styles
- pagination controls

### Pass if
- text is readable against its background
- focus indication is easy to see
- hover-only styling is not the sole way to convey meaning

### Notes
Use a contrast checker if any combination looks borderline.

---

## 10. Touch target and pointer usability

### Check
- Test in responsive mode or on a phone.
- Tap expand controls.
- Tap rating controls.
- Tap pagination controls.

### Pass if
- controls are easy to hit without accidental activation
- tap targets are sufficiently separated
- expanded content does not block nearby controls unintentionally

---

## 11. Error and edge-state handling

### Check
Exercise likely edge cases:
- rating repeatedly
- loading with the backend unavailable
- expanding several cards in sequence
- pagination at first and last pages

### Pass if
- error messages are understandable
- failure states do not break keyboard flow
- controls recover gracefully after an error

### Notes
Document exact wording of user-facing errors when possible.

---

## 12. Content quality and semantics

### Check
- Inspect WordPress-provided excerpts and card text.
- Confirm paragraphs, headings, and lists are announced sensibly.
- Confirm images have appropriate alt text or are decorative.

### Pass if
- content reads sensibly with assistive tech
- semantic HTML is preserved
- decorative presentation is not announced as meaningful content

---

## 13. Final sign-off

Mark each area as:
- **Pass**
- **Pass with follow-up**
- **Fail**

### Suggested summary template

```md
## Accessibility QA Summary

Date:
Tester:
Browsers / AT used:

- Page structure: Pass / Pass with follow-up / Fail
- Keyboard navigation: Pass / Pass with follow-up / Fail
- Focus visibility: Pass / Pass with follow-up / Fail
- Expand/collapse interaction: Pass / Pass with follow-up / Fail
- Rating interaction: Pass / Pass with follow-up / Fail
- Screen reader flow: Pass / Pass with follow-up / Fail
- Zoom/reflow: Pass / Pass with follow-up / Fail
- Reduced motion: Pass / Pass with follow-up / Fail
- Contrast spot check: Pass / Pass with follow-up / Fail
- Touch targets: Pass / Pass with follow-up / Fail
- Error states: Pass / Pass with follow-up / Fail
- Content semantics: Pass / Pass with follow-up / Fail

Follow-ups:
- 
- 
- 
```

## Skills used

- `$wp-accessibility`
- `$local-studio-env`
- `$studio`
