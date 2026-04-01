# CROSSPLATFORM Compatibility Notes

This document records the cross-version compatibility changes implemented so the `cud_research` module can run on Drupal 8.9.x, 9.x, and 10.x from the same codebase.

## Target Support Matrix

- Drupal 8.9.x
- Drupal 9.x
- Drupal 10.x

## Implemented Changes

### 1) Module Metadata Compatibility

File: `cud_research.info.yml`

- Updated `core_version_requirement` from `^10 || ^11` to `^8.9 || ^9 || ^10`.
- Added explicit dependency on `drupal:media` to match carousel media usage.

Why:
- Drupal 8/9 sites will reject installation if version requirements do not include their core major.
- The module references media entities for carousel fields and rendering.

---

### 2) Form API Method Signature Compatibility

File: `src/Form/CudResearchSettingsForm.php`

Removed return type declarations from overridden Form API methods:

- `getFormId()`
- `getEditableConfigNames()`
- `buildForm()`
- `validateForm()`
- `submitForm()`

Why:
- Method signatures in parent classes differ across Drupal/PHP combinations.
- Removing return type declarations on overrides avoids signature incompatibilities in Drupal 8 environments.

---

### 3) PHP 8 Nullsafe Operator Removal

Files:

- `src/Controller/ResearchController.php`
- `cud_research.module`

Replaced `?->` nullsafe operator usage with explicit request checks, for example:

- Before: `$requestStack->getCurrentRequest()?->getPathInfo() ?? '/'`
- After: `$request = $requestStack->getCurrentRequest(); $request ? $request->getPathInfo() : '/'`

Why:
- The nullsafe operator is PHP 8+ syntax.
- Drupal 8 deployments may run on older PHP versions where this syntax is invalid.

---

### 4) Controller Factory Signature Relaxation

File: `src/Controller/ResearchController.php`

- Changed `public static function create(ContainerInterface $container): self`
  to `public static function create(ContainerInterface $container)`.

Why:
- Keeps factory override signature tolerant across older framework/runtime combinations.

---

### 5) File URL Service Backward Fallback

File: `src/Controller/ResearchController.php`

Added fallback logic for media image URL generation:

- Prefer `file_url_generator` service when available.
- Fallback to `file_create_url()` when the service is unavailable.

Why:
- API availability differs across Drupal versions/minors.
- Ensures image URL generation remains functional in older installs.

---

### 6) Entity Query Access Check Backward Compatibility

File: `cud_research.install`

In uninstall logic:

- Replaced direct chained `->accessCheck(FALSE)` call with a guarded call using `method_exists()`.

Why:
- Access-check API usage changed across versions.
- Guarding prevents fatal errors in older versions while preserving behavior.

---

### 7) Update Hook Numbering for 8.x/9.x/10.x Paths

File: `cud_research.install`

Added wrapper update hooks:

- `cud_research_update_8001` through `cud_research_update_8005`
- `cud_research_update_9001` through `cud_research_update_9005`

Each wrapper delegates to existing logic in:

- `cud_research_update_10001` through `cud_research_update_10005`

Why:
- Different major lines can expect different update number sequences.
- Wrappers keep one implementation source while allowing update execution on 8.x/9.x/10.x sites.

## Behavioral Intent

These changes are intended to preserve module behavior while widening compatibility:

- Same route/controller behavior for `/research`, `/research/search`, and `/research/{slug}`.
- Same settings form behavior.
- Same content type/field/menu install and update intent.
- Same carousel/search/menu rendering intent.

## Known Constraints

- A full Drupal 10 database cannot be downgraded directly to Drupal 8.
  - Use migration/export-import workflows when moving data down major versions.
- Runtime parity still depends on enabled modules and local site configuration.
  - Especially media-related features/widgets in older environments.

## Recommended Verification Per Version

Run on each target site (8.9.x, 9.x, 10.x):

1. Enable module and run database updates.
2. Verify install created:
   - `research` content type
   - slug/carousel/sections fields
   - primary/secondary menus and starter links
3. Open and verify routes:
   - `/research`
   - `/research/search?q=test`
   - `/research/{slug}` for an existing slug
4. Confirm carousel image URLs render correctly.
5. Open settings page:
   - `/admin/config/content/cud-research`
   - Save `logo_filename` and confirm logo resolution.
6. Uninstall in a test environment and confirm cleanup completes without fatals.

## Change Log Summary

Compatibility updates were applied in these files:

- `cud_research.info.yml`
- `src/Form/CudResearchSettingsForm.php`
- `src/Controller/ResearchController.php`
- `cud_research.module`
- `cud_research.install`
