---
name: code-review
description: PR review checklist for datasync-asset-store-filesystem — use when opening or reviewing pull requests.
---

# Code review – DataSync Asset Store Filesystem

## When to use

- Opening a PR that touches `src/`, tests, or published artifacts
- Reviewing changes for a library release

## Instructions

- **Build and tests:** Branch should pass `npm run build-ts` and `npm test` locally.
- **Lint:** Run `npm run tslint` for TypeScript changes in `src/`.
- **API and docs:** If public behavior or defaults change, update root `README.md` and verify [`datasync-asset-store`](../datasync-asset-store/SKILL.md) assumptions still hold.
- **Versioning:** Bump `package.json` version when releasing; follow org conventions for tags and changelog if applicable.
- **Security:** Avoid logging secrets; path handling should remain safe (see existing sanitization in `src/utils.ts` and related code). Large dependency or HTTP behavior changes deserve extra scrutiny.
- **Scope:** Keep changes focused on the asset-store concern—avoid unrelated refactors in the same PR unless required for the fix.
