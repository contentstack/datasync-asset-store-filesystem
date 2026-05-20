---
name: dev-workflow
description: npm scripts, CI, and repo workflow for datasync-asset-store-filesystem — use for build/test commands, example app, and hooks.
---

# Dev workflow – DataSync Asset Store Filesystem

## When to use

- Running or changing build or test commands
- Working in `example/` or understanding CI / automation
- Optional git hooks (Talisman, Snyk)

## Instructions

- **Install:** `npm install`. Target Node **20+** for local dev (see root `README.md`).
- **Build:** `npm run build-ts` runs `clean` then `tsc`; output is `dist/`. `npm run compile` is `tsc` only; `prepare` runs compile for pack/install.
- **Watch:** `npm run watch-ts` for incremental compile during development.
- **Example app:** `example/` demonstrates wiring with mock config (not the full DataSync stack).
- **Travis:** `.travis.yml` runs `npm run build-ts` then `npm run test` on its Node matrix (may differ from README’s recommended Node version).
- **GitHub Actions:** `.github/workflows/` — security/scanning, release, and automation; see each workflow for triggers.
- **Husky (optional):** `.husky/pre-commit` runs Talisman and Snyk if installed; `SKIP_HOOK=1` bypasses. Not everyone has these CLI tools—coordinate with the team before relying on the hook locally.

TypeScript compiler options, `typings/`, and TSLint: **`skills/typescript-style/SKILL.md`**.
