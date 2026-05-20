---
name: datasync-asset-store
description: Public API and DataSync integration for the filesystem asset store — use for start, FSAssetStore, config, and asset paths.
---

# DataSync asset store API – DataSync Asset Store Filesystem

## When to use

- Implementing or changing how assets are downloaded, stored, or removed on disk
- Wiring this package into DataSync Manager (`setAssetStore`)
- Debugging URL parsing, `baseDir`, or path patterns

## Instructions

- **Entry:** Consumers typically `require('@contentstack/datasync-asset-store-filesystem')` and pass the module to DataSync Manager; the package `main` is `./dist` (compiled from `src/index.ts`).
- **Lifecycle:** Call `start(config)` to get a `Promise` that resolves to an `FSAssetStore` instance. `setConfig` / `getConfig` hold merged config; `assetStoreInstance` is exported for the active instance after `start`.
- **Class:** `FSAssetStore` (`src/filesystem.ts`) implements download/unpublish flows using `undici` for HTTP, `fs` for writes, and helpers from `src/index.ts` for paths.
- **Path helpers:** `getAssetLocation` and `getFileLocation` build directory/file paths from asset URLs and `assetStore` config (`pattern`, `patternWithBranch`, optional `assetFolderPrefixKey`). Contentstack asset hostnames are matched via regex in `src/index.ts`.
- **Defaults:** `defaultConfig` in `src/config.ts` — e.g. `assetStore.baseDir: './_contents'`, `pattern` and `patternWithBranch` for folder layout. Merge with app config as in the README example.
- **Cross-module config:** README documents `content-store-filesystem.baseDir` alongside this module; keep docs aligned when changing default paths.
- **Errors:** User-facing strings and errors are centralized in `src/messages.ts` where applicable.
