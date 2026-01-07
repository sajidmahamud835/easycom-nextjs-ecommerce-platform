## 2025-02-13 - Redundant Dependency Installation
**Issue:** The build process was performing `npm install` twice during deployment. `render.yaml` ran `npm install` (which skipped devDependencies due to `NODE_ENV=production`), and then `npm run build` triggered a `prebuild` script (`npm install --include=dev`) to install them.
**Root Cause:** The `prebuild` script was a workaround to ensure devDependencies were available for the build step on Render, which defaults `NODE_ENV` to `production`.
**Fix:** Updated `render.yaml` to explicitly install devDependencies (`npm install --include=dev`) and removed the redundant `prebuild` script from `package.json`.
