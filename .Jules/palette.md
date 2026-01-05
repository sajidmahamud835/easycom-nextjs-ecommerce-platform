## 2024-05-23 - Favorite Button Accessibility & Feedback
**Learning:** Icon-only buttons (like Wishlist hearts) are a major accessibility gap. Adding `aria-label` is crucial, but visual users also benefit from Tooltips. Async actions on buttons need immediate feedback (loading spinner) to prevent rage-clicks.
**Action:** Always wrap async icon-buttons in a `Tooltip` and handle `isLoading` state with a spinner replacement or overlay.
