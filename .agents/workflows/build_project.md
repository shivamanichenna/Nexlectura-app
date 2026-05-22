---
description: Workflow to build the Nexlectra project.
---

# Building Nexlectra

Follow these steps to build the project for production or for Capacitor sync.

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Typecheck**:
   ```bash
   npm run typecheck
   ```

3. **Build the Project**:
   ```bash
   npm run build
   ```
   *Note: This generates the `out` directory which is used by Capacitor.*

4. **Sync with Capacitor (Optional)**:
   ```bash
   npx cap sync
   ```
