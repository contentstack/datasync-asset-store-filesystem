---
name: typescript-style
description: TypeScript compiler settings, hand-written typings, and TSLint for this repo — use when changing tsconfig, typings, or lint rules.
---

# TypeScript style – DataSync Asset Store Filesystem

## When to use

- Editing `tsconfig.json`, `tslint.json`, or files under `typings/`
- Adding or changing `.ts` under `src/` and need to align with existing strictness and lint
- Debugging compile errors vs published types

## Instructions

- **Compiler:** `tsconfig.json` compiles only `src/**/*` to `dist/` (`module` CommonJS, `target` ES6, `moduleResolution` node, `alwaysStrict`, `noUnusedLocals` / `noUnusedParameters`, `noImplicitReturns`, etc.). Do not widen options without a deliberate reason—match existing patterns.
- **Declarations:** Public types ship from **`typings/`** (`package.json` has `"types": "./typings"`). Keep `.d.ts` in sync with `src/` exports; the build does not emit declarations from `tsc` (declaration options are commented out in tsconfig).
- **Lint:** `npm run tslint` uses `tslint.json` extending `tslint:recommended` on `src/**/*.ts`. Notable rules include max line length 120, 2-space indent, `no-default-export`, interface names prefixed with `I` where the rule applies—follow fixes consistent with nearby files.
- **Dependencies:** `@types/node` and `@types/jest` versions in `package.json` are pinned for compatibility; bump types together with TS upgrades when needed.
