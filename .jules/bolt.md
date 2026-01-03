## 2026-01-03 - [Optimized Image Loading]
**Learning:** Defaulting `priority` to `true` on image components within reusable list items (like `ProductCard`) is a performance anti-pattern. It causes the browser to eagerly load all images in a grid, degrading LCP and consuming excessive bandwidth.
**Action:** Always allow `priority` to be controlled via props in list item components, and set it to `true` only for the first few items in the viewport (LCP candidates).
