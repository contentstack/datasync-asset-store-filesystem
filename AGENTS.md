# DataSync Asset Store Filesystem – Agent guide

**Universal entry point** for contributors and AI agents. Detailed conventions live in **`skills/*/SKILL.md`**.

## What this repo is

| Field | Detail |
| --- | --- |
| **Name:** | [contentstack/datasync-asset-store-filesystem](https://github.com/contentstack/datasync-asset-store-filesystem) (`@contentstack/datasync-asset-store-filesystem` on npm) |
| **Purpose:** | Filesystem-backed asset store for Contentstack DataSync: downloads and stores asset files locally for use with DataSync Manager and related modules. |
| **Out of scope (if any):** | Not a standalone HTTP server or full DataSync stack—pairs with DataSync Manager, webhook listener, and a content store. |

## Tech stack (at a glance)

| Area | Details |
| --- | --- |
| Language | TypeScript → CommonJS in `dist/` (`tsconfig.json`; target ES6, `src/` only in compile). Node **20+** per README (`.travis.yml` lists older Node for legacy CI). |
| Build | `npm run build-ts` (`tsc` → `dist/`), `npm run compile` / `prepare`. Hand-written typings under `typings/`. |
| Tests | Jest (`jest.config.js`), tests under `test/` as `*.js` (`testRegex`). |
| Lint / coverage | TSLint (`tslint.json`, `npm run tslint`). Jest `--coverage` outputs to `coverage/`. |
| Runtime deps | `debug`, `lodash`, `rimraf`, `undici` (HTTP for downloads). |

## Commands (quick reference)

| Command type | Command |
| --- | --- |
| Build | `npm run build-ts` |
| Test | `npm test` (runs `pretest`: `build-ts` then cleans `_contents` / `coverage`) |
| Lint | `npm run tslint` |

CI: `.travis.yml` runs `npm run build-ts` and `npm run test`. GitHub Actions: `.github/workflows/` (e.g. CodeQL, policy/SCA scans, issues automation). Pre-commit (optional): `.husky/pre-commit` expects Talisman and Snyk when enabled.

## Where the documentation lives: skills

| Skill | Path | What it covers |
| --- | --- | --- |
| Dev workflow | [`skills/dev-workflow/SKILL.md`](skills/dev-workflow/SKILL.md) | npm scripts, CI, `example/`, optional git hooks. |
| TypeScript style | [`skills/typescript-style/SKILL.md`](skills/typescript-style/SKILL.md) | `tsconfig.json`, `typings/`, TSLint. |
| DataSync asset store API | [`skills/datasync-asset-store/SKILL.md`](skills/datasync-asset-store/SKILL.md) | Public API, `FSAssetStore`, config, DataSync integration. |
| Testing | [`skills/testing/SKILL.md`](skills/testing/SKILL.md) | Jest layout, coverage, test vs source paths. |
| Code review | [`skills/code-review/SKILL.md`](skills/code-review/SKILL.md) | PR checklist for this package. |

An index with “when to use” hints is in [`skills/README.md`](skills/README.md).

## Using Cursor (optional)

If you use **Cursor**, [`.cursor/rules/README.md`](.cursor/rules/README.md) only points to **`AGENTS.md`**—same docs as everyone else.
