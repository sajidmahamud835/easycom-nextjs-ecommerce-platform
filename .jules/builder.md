## 2026-01-08 - [Legacy Build Hack]
**Issue:** `package.json` contains a `prebuild` script executing `npm install --include=dev`.
**Root Cause:** This appears to be a workaround for CI environments (like Render) where `NODE_ENV=production` causes the initial `npm install` to skip `devDependencies` (including `cross-env`, which is required for the build script itself).
**Fix:** Remove the `prebuild` side-effect and configure the CI environment (`render.yaml`) to explicitly install development dependencies via `npm install --include=dev`.
