# CUD Sustainability Module

## Overview

This module owns the `/sustainability` route family and renders sustainability content through custom Twig templates.

Routes:
- `/sustainability` → `SustainabilityController::index()`
- `/sustainability/our-commitment/governance` → `SustainabilityController::renderGovernancePage()`
- `/sustainability/{slug}` → `SustainabilityController::renderPage()`
- Aliased Drupal nodes at `/sustainability/*` are intercepted by `hook_preprocess_page()` in `cud_sustainability.module`

## Carousel

Every sustainability content type supports a hero carousel via `field_research_carousel_images` and `field_research_carousel_content`.

`SustainabilityController::getCarouselItems()` is a **public** method and is called from two places:
1. Controller methods (`buildPage()`) for module-owned routes.
2. `hook_preprocess_page()` in `cud_sustainability.module` for pages served via Drupal path aliases.

If `field_research_carousel_images` is empty, a placeholder slide is returned by `getFallbackCarouselItemsFromNode()`. All inner-page templates have the carousel block active.

## Breadcrumb

Breadcrumbs are populated in `cud_sustainability_preprocess_cud_sustainability()` using Drupal's `breadcrumb` service, so they are always route-aware and require no manual maintenance.

Each link is normalised to a plain `['text' => ..., 'url' => ...]` array. A segment is only rendered as a hyperlink when its URL:

1. Is not a non-routable route (`<nolink>`, `<none>`).
2. Resolves via `path_alias.manager` to a system path matching `/node/{id}` of a published node.

Segments that fail either check are rendered as `<span>` (plain text, not clickable).

## Admin Edit Shortcut

When the current user has `update` access on the route node, an `edit_url` variable is set to the node edit form URL. Both `--normal` and `--our-commitment--governance` templates render a `fa-pen-to-square` icon link beside the `<h1>` when this variable is truthy. It is invisible to anonymous and unprivileged users.



When using chat/AI assistance for this repository, apply these hard rules:

- Scope all code changes to this module only: `web/modules/custom/cud_sustainability`.
- Do not modify Drupal core, contrib modules, themes, profiles, or site-wide code unless explicitly requested.
- During testing, run only the container cache clear command so module changes are reflected on hosting.
- Do not run install/update/uninstall commands unless explicitly requested.

Cache clear command policy:

- Use your project container command that runs `drush cr` inside the Drupal container.
- Example (adjust container/service name as needed):

```bash
docker compose exec <php-service> drush cr
```

This keeps testing safe and focused on `cud_sustainability` development.

## Route ownership and conflict handling

This module is designed to keep `/sustainability` owned by CUD Sustainability even when other routes or content aliases exist.

How route conflicts are handled:
- `hook_route_alter()` marks non-`cud_sustainability.*` routes under `/sustainability` as inaccessible.
- This prevents other modules/themes from taking over `/sustainability` or `/sustainability/*` route paths.

Path alias note:
- This module does not use a custom inbound path processor.
- If a site-level alias rewrites `/sustainability`, correct or remove that alias at the site level.

After enabling or updating this module, clear caches so route changes apply:

```bash
drush cr
```

or clear all caches from Drupal admin UI.

## Drupal 8.x cross-version compatibility

Yes, this is implemented to work with older Drupal 8.9.x installs as well.

Compatibility considerations used here:
- `core_version_requirement` already allows `^8.9 || ^9 || ^10`.
- Prefix checks use `strpos(...) === 0` (not `str_starts_with()`), so PHP 7 environments remain supported.
- The module avoids custom inbound path processor services to reduce cross-instance compiler issues.

Practical requirement:
- Keep your site on Drupal 8.9.x with a supported PHP version for your exact patch level.

Display modes:
- `main` (default) -> `templates/cud-sustainability-main.html.twig`
- `secondary` -> `templates/cud-sustainability-secondary.html.twig`

## Standalone Tailwind setup

This module now uses a standalone Tailwind build inside the module itself.

Files used:
- `package.json`
- `tailwind.config.js`
- `assets/tailwind.input.css`
- `css/cud_sustainability.tailwind.css` (generated output)

Library loading:
- `cud_sustainability/page` now loads:
  - `css/cud_sustainability.tailwind.css`
  - `css/cud_sustainability.css`

No dependency on `tailwindcss/global-styling` is required.

## Theme behavior

The module does not force a specific Drupal theme anymore.

Theme negotiator cleanup:
- Removed `src/Theme/CudResearchThemeNegotiator.php`
- No custom service-based path processor is required

Sustainability pages now render with whichever frontend theme is active for the site.

## Logo source priority

Sustainability page header logo now resolves in this order:
1. Module asset file in `web/modules/custom/cud_sustainability/assets/images/` using configured filename
2. Active theme logo (`theme_get_setting('logo.url')`)
3. `NULL` (template falls back to the `CR` badge)

Configure filename in Drupal admin:
- `Admin -> Configuration -> Content authoring -> CUD Sustainability`
- Path: `/admin/config/content/cud-sustainability`

Default filename is `logo.png`.

Example:
- Put your file at `web/modules/custom/cud_sustainability/assets/images/logo.png`
- Keep `logo.png` in module settings

Or set a different filename like `cud-mark.svg` and place that file in the same folder.

## Sustainability-specific page layout

The latest successful change gives sustainability routes their own page frame instead of relying on the site's default page layout structure.

How it works:
- The module adds route-specific theme suggestions for `html` and `page` on `/sustainability` routes.
- Sustainability routes use dedicated templates:
  - `templates/html--cud-sustainability.html.twig`
  - `templates/page--cud-sustainability.html.twig`
- The sustainability page template renders only `page.content` by default, so the visible layout is controlled by:
  - `templates/cud-sustainability--main.html.twig`
  - `templates/cud-sustainability--normal.html.twig`
  - `templates/cud-sustainability--our-commitment--governance.html.twig` (and future variants)

This gives full control over the sustainability layout while keeping Drupal's required internals intact.

Why this still works for both user and admin areas:
- The minimal sustainability `html` template still includes Drupal placeholders for CSS and JavaScript.
- It still renders `page_top` and `page_bottom`, so Drupal behaviors and admin integrations can attach correctly.
- The route keeps normal Drupal controller rendering, entity rendering, permissions, and cache behavior.
- The active site theme still exists, but its normal page-region layout is not driving the sustainability presentation.

## Optional Drupal blocks and regions

Sustainability routes are intentionally blank by default except for the content area.

There are two ways to selectively enable Drupal-controlled pieces when needed.

1. Module-controlled block slots
- Rendered block slots are intentionally disabled by default in this branch.
- Re-enable slot rendering only if specific Drupal blocks are required for this layout.
- Available slots:
  - `header`
  - `pre_content`
  - `footer`

2. Page-region hooks in the sustainability page template
- `templates/page--cud-sustainability.html.twig` contains commented examples for optional regions such as:
  - `page.header`
  - `page.primary_menu`
  - `page.secondary_menu`
  - `page.highlighted`
  - `page.breadcrumb`
  - `page.help`
  - `page.sidebar_first`
  - `page.sidebar_second`
  - `page.footer`

This setup keeps the sustainability experience blank and controlled by the module, while allowing Drupal building blocks to be enabled at will.

## Recommended defaults

If you want a practical starting point, enable only the minimum Drupal blocks that help with usability and administration.

Recommended first set:
- `tailwindcss_messages`
  - Good for status, warning, and error feedback.
- `tailwindcss_breadcrumbs`
  - Useful if sustainability pages need orientation inside a larger site structure.
- `tailwindcss_primary_local_tasks`
  - Helpful for admin users when tabs are relevant.
- `tailwindcss_secondary_local_tasks`
  - Helpful when secondary admin tabs are used.

Usually keep disabled unless intentionally needed:
- `tailwindcss_site_branding`
  - Keep disabled if the sustainability template already owns the branding area.
- `tailwindcss_main_menu`
  - Keep disabled if navigation is custom inside the sustainability Twig templates.
- `tailwindcss_search_form_narrow`
  - Enable only if sustainability pages need theme-level search in the header.
- `tailwindcss_account_menu`
  - Enable only if user account shortcuts must appear inside the sustainability shell.
- `tailwindcss_search_form_wide`
  - Enable only if a footer or utility-search area is needed.
- `tailwindcss_syndicate`
  - Enable only if RSS is part of the sustainability experience.

Suggested slot mapping:
- `pre_content`
  - `tailwindcss_messages`
  - `tailwindcss_breadcrumbs`
  - `tailwindcss_primary_local_tasks`
  - `tailwindcss_secondary_local_tasks`
- `header`
  - `tailwindcss_site_branding`
  - `tailwindcss_main_menu`
  - `tailwindcss_search_form_narrow`
- `footer`
  - `tailwindcss_account_menu`
  - `tailwindcss_search_form_wide`
  - `tailwindcss_syndicate`

## Install, Reinstall, Remove Guide

Run commands from your Drupal project root (`/var/www/devcontainers/cud.staging.local`) unless noted otherwise.

Status: Sequences verified in this project. Uninstall hook removes all field data and SQL tables automatically.

### Quick install with Drush

Use this when module assets are already built and you only need to enable/update the module:

```bash
drush en cud_sustainability -y
drush updb -y
drush cr
drush pml --status=enabled --type=module --format=json | grep -o '"cud_sustainability"'
```

Expected result:
- Last command prints `"cud_sustainability"` when the module is enabled.
- If Drush reports `Already enabled: cud_sustainability`, the module is already installed.

### Full install

1. Build module CSS assets:

```bash
cd web/modules/custom/cud_sustainability
npm install
npm run build
cd /var/www/devcontainers/cud.staging.local
```

2. Enable the module, run pending updates, rebuild cache:

```bash
drush en cud_sustainability -y
drush updb -y
drush cr
```

What install creates automatically:
- Content type `sustainability` (CUD Sustainability)
- Field `field_research_slug` — URL path identifier
- Field `field_research_carousel_images` — unlimited media references (image)
- Field `field_research_carousel_content` — unlimited HTML overlay text, paired with images by position
- Menu `cud-sustainability-primary` (CUD Sustainability Primary) with 3 starter links
- Menu `cud-sustainability-secondary` (CUD Sustainability Secondary) with 3 starter links
- One starter published node with slug `main` → `/sustainability`
- DB tables: `node__field_research_slug`, `node__field_research_carousel_images`, `node__field_research_carousel_content` (plus revision variants)

3. Add content:
- Edit the auto-created `main` node for `/sustainability`.
- Add more `CUD Sustainability` nodes with unique slugs for `/sustainability/{slug}`.

4. Verify CUD Sustainability menus and starter links:

```bash
drush php:eval "foreach (['cud-sustainability-primary', 'cud-sustainability-secondary'] as $id) { $menu = \Drupal\system\Entity\Menu::load($id); echo $id . ': ' . ($menu ? 'exists' : 'missing') . PHP_EOL; }"

drush php:eval '$storage = \Drupal::entityTypeManager()->getStorage("menu_link_content"); foreach (["cud-sustainability-primary", "cud-sustainability-secondary"] as $menu_name) { echo $menu_name . PHP_EOL; $links = $storage->loadByProperties(["menu_name" => $menu_name]); foreach ($links as $link) { $uri = $link->get("link")->first()?->getUrl()->toString() ?? ""; echo " - " . $link->label() . " => " . $uri . PHP_EOL; } }'
```

### Reinstall module

Use this sequence to wipe and recreate everything cleanly:

```bash
drush pm:uninstall cud_sustainability -y
drush en cud_sustainability -y
drush updb -y
drush cr
```

What this does:
- Uninstall deletes all sustainability nodes, all field instances, all field storage tables, both CUD sustainability menus, and the content type.
- Re-enable runs install hooks, recreates the content type, fields, both menus (with starter links), and the starter `main` node.

Rebuild CSS after reinstall if needed:

```bash
cd web/modules/custom/cud_sustainability
npm run build
cd /var/www/devcontainers/cud.staging.local
drush cr
```

For existing installs that only need new update hooks applied (no full wipe):

```bash
drush updb -y
drush cr
```

This applies menu provisioning update hooks as well (including `cud_sustainability_update_10005`).

Compatibility note:
- This module uses `preview_mode: 1` for node type creation, which is compatible with current Drupal core where `NodeType::NODE_PREVIEW_OPTIONAL` is not defined.

### Remove module

Always back up first:

```bash
drush sql:dump --result-file=../backup-before-cud-sustainability-uninstall.sql
```

Then uninstall:

```bash
drush pm:uninstall cud_sustainability -y
drush cr
```

What uninstall removes automatically:
- All published and unpublished `sustainability` nodes and their revision data
- Field instance `field_research_slug` on `sustainability`
- Field instance `field_research_carousel_images` on `sustainability`
- Field instance `field_research_carousel_content` on `sustainability`
- Field storage + DB tables for each field above (only if no other bundle uses it)
- Menu links in `cud-sustainability-primary` and `cud-sustainability-secondary`
- Menus `cud-sustainability-primary` and `cud-sustainability-secondary`
- Content type `sustainability` (CUD Sustainability)

Verify cleanup — confirm tables are gone:

```bash
drush sql:query "SHOW TABLES LIKE 'node__field_research%';"
drush sql:query "SELECT COUNT(*) FROM node WHERE type='sustainability';" 2>/dev/null || echo "Table clean"
```

Both queries should return empty results after a successful uninstall.

Manual SQL cleanup (edge case only — if tables survive an interrupted uninstall):

```bash
drush sql:query "DROP TABLE IF EXISTS node__field_research_slug;"
drush sql:query "DROP TABLE IF EXISTS node_revision__field_research_slug;"
drush sql:query "DROP TABLE IF EXISTS node__field_research_carousel_images;"
drush sql:query "DROP TABLE IF EXISTS node_revision__field_research_carousel_images;"
drush sql:query "DROP TABLE IF EXISTS node__field_research_carousel_content;"
drush sql:query "DROP TABLE IF EXISTS node_revision__field_research_carousel_content;"
drush cr
```

Optional code removal after uninstall:

```bash
rm -rf web/modules/custom/cud_sustainability
```

## Daily development workflow

When you edit utility classes in either Twig template:

```bash
cd web/modules/custom/cud_sustainability
npm run build
cd /var/www/devcontainers/cud.staging.local
drush cr
```

Optional watch mode during development:

```bash
cd web/modules/custom/cud_sustainability
npm run watch
```

## Validation checklist

After a build, check:
- `/sustainability`
- `/sustainability?mode=secondary`
- `/sustainability/{slug}?mode=main`
- `/sustainability/{slug}?mode=secondary`

## Troubleshooting

- `npm: command not found`
  - Install Node.js and npm on the environment running the build.
- Styles do not update after Twig changes
  - Re-run `npm run build` and `drush cr`.
- Missing utility classes
  - Verify classes exist in `css/cud_sustainability.tailwind.css` after build.

## Assumptions

This module assumes:
- Content type machine name: `sustainability`
- Field machine name: `field_research_slug`

If these differ, update `src/Controller/ResearchController.php`.
