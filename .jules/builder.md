## 2025-01-06 - Render Build Resilience
**Issue:** Deployment failed on Render because `cross-env` (a devDependency) was missing during the build command. Render's default environment sets `NODE_ENV=production`, causing `npm install` to skip devDependencies. Additionally, Render Dashboard settings may override `render.yaml`, preventing custom install commands.
**Root Cause:** Removing the `prebuild` script caused the build to run without necessary build tools (`cross-env`, `tailwindcss`, `typescript`).
**Fix:** Restored the `prebuild` script (`npm install --include=dev`) in `package.json`. This ensures that whenever `npm run build` is executed, devDependencies are explicitly installed first, making the build process resilient to environment configuration overrides.
