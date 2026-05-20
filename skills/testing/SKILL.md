---
name: testing
description: Jest tests and coverage for datasync-asset-store-filesystem — use for test layout, pretest build, and coverage output.
---

# Testing – DataSync Asset Store Filesystem

## When to use

- Adding or changing tests under `test/`
- Interpreting coverage reports or Jest configuration
- Debugging `pretest` / build ordering before tests run

## Instructions

- **Runner:** `npm test` runs Jest with `--coverage`. `pretest` runs `npm run build-ts` and removes `_contents` and `coverage` so tests run against a fresh build and clean asset dirs where relevant.
- **Test files:** `jest.config.js` sets `testRegex: "./test/.*.js$"` and `testEnvironment: "node"`. Tests are JavaScript under `test/`, not co-located `*.spec.ts` in `src/`.
- **Coverage:** Output directory `coverage/`; reporters include `json` and `html`. `coveragePathIgnorePatterns` excludes `node_modules`, `test-utils`, `test_content`, and parts of `dist/` — adjust in `jest.config.js` if you add new paths that should be ignored or included.
- **Integration style:** `example/` and `test/` may use mocks; avoid committing real API keys or secrets (align with Talisman/Snyk expectations if hooks are used).
