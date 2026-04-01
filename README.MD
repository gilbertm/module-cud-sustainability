# CUD Research Module

## Overview

This module owns the `/research` route family and renders research content through custom Twig templates.

Routes:
- `/research` -> `ResearchController::index`
- `/research/{slug}` -> `ResearchController::renderPage`

## Chat workflow restrictions for this module

When using chat/AI assistance for this repository, apply these hard rules:

- Scope all code changes to this module only: `web/modules/custom/cud_research`.
- Do not modify Drupal core, contrib modules, themes, profiles, or site-wide code unless explicitly requested.
- During testing, run only the container cache clear command so module changes are reflected on hosting.
- Do not run install/update/uninstall commands unless explicitly requested.

Cache clear command policy:

- Use your project container command that runs `drush cr` inside the Drupal container.
- Example (adjust container/service name as needed):

```bash
docker compose exec <php-service> drush cr
```

This keeps testing safe and focused on `cud_research` development.

## Route ownership and conflict handling

This module is designed to keep `/research` owned by CUD Research even when other routes or content aliases exist.

How route conflicts are handled:
- `hook_route_alter()` marks non-`cud_research.*` routes under `/research` as inaccessible.
- This prevents other modules/themes from taking over `/research` or `/research/*` route paths.

Path alias note:
- This module does not use a custom inbound path processor.
- If a site-level alias rewrites `/research`, correct or remove that alias at the site level.

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
- `main` (default) -> `templates/cud-research-main.html.twig`
- `secondary` -> `templates/cud-research-secondary.html.twig`

## Standalone Tailwind setup

This module now uses a standalone Tailwind build inside the module itself.

Files used:
- `package.json`
- `tailwind.config.js`
- `assets/tailwind.input.css`
- `css/cud_research.tailwind.css` (generated output)

Library loading:
- `cud_research/page` now loads:
  - `css/cud_research.tailwind.css`
  - `css/cud_research.css`

No dependency on `tailwindcss/global-styling` is required.

## Theme behavior

The module does not force a specific Drupal theme anymore.

Theme negotiator cleanup:
- Removed `src/Theme/CudResearchThemeNegotiator.php`
- No custom service-based path processor is required

Research pages now render with whichever frontend theme is active for the site.

## Logo source priority

Research page header logo now resolves in this order:
1. Module asset file in `web/modules/custom/cud_research/assets/images/` using configured filename
2. Active theme logo (`theme_get_setting('logo.url')`)
3. `NULL` (template falls back to the `CR` badge)

Configure filename in Drupal admin:
- `Admin -> Configuration -> Content authoring -> CUD Research`
- Path: `/admin/config/content/cud-research`

Default filename is `logo.png`.

Example:
- Put your file at `web/modules/custom/cud_research/assets/images/logo.png`
- Keep `logo.png` in module settings

Or set a different filename like `cud-mark.svg` and place that file in the same folder.

## Research-specific page layout

The latest successful change gives research routes their own page frame instead of relying on the site's default page layout structure.

How it works:
- The module adds route-specific theme suggestions for `html` and `page` on `/research` routes.
- Research routes use dedicated templates:
  - `templates/html--cud-research.html.twig`
  - `templates/page--cud-research.html.twig`
- The research page template renders only `page.content` by default, so the visible layout is controlled by:
  - `templates/cud-research-main.html.twig`
  - `templates/cud-research-secondary.html.twig`

This gives full control over the research layout while keeping Drupal's required internals intact.

Why this still works for both user and admin areas:
- The minimal research `html` template still includes Drupal placeholders for CSS and JavaScript.
- It still renders `page_top` and `page_bottom`, so Drupal behaviors and admin integrations can attach correctly.
- The route keeps normal Drupal controller rendering, entity rendering, permissions, and cache behavior.
- The active site theme still exists, but its normal page-region layout is not driving the research presentation.

## Optional Drupal blocks and regions

Research routes are intentionally blank by default except for the content area.

There are two ways to selectively enable Drupal-controlled pieces when needed.

1. Module-controlled block slots
- Rendered block slots are intentionally disabled by default in this branch.
- Re-enable slot rendering only if specific Drupal blocks are required for this layout.
- Available slots:
  - `header`
  - `pre_content`
  - `footer`

2. Page-region hooks in the research page template
- `templates/page--cud-research.html.twig` contains commented examples for optional regions such as:
  - `page.header`
  - `page.primary_menu`
  - `page.secondary_menu`
  - `page.highlighted`
  - `page.breadcrumb`
  - `page.help`
  - `page.sidebar_first`
  - `page.sidebar_second`
  - `page.footer`

This setup keeps the research experience blank and controlled by the module, while allowing Drupal building blocks to be enabled at will.

## Recommended defaults

If you want a practical starting point, enable only the minimum Drupal blocks that help with usability and administration.

Recommended first set:
- `tailwindcss_messages`
  - Good for status, warning, and error feedback.
- `tailwindcss_breadcrumbs`
  - Useful if research pages need orientation inside a larger site structure.
- `tailwindcss_primary_local_tasks`
  - Helpful for admin users when tabs are relevant.
- `tailwindcss_secondary_local_tasks`
  - Helpful when secondary admin tabs are used.

Usually keep disabled unless intentionally needed:
- `tailwindcss_site_branding`
  - Keep disabled if the research template already owns the branding area.
- `tailwindcss_main_menu`
  - Keep disabled if navigation is custom inside the research Twig templates.
- `tailwindcss_search_form_narrow`
  - Enable only if research pages need theme-level search in the header.
- `tailwindcss_account_menu`
  - Enable only if user account shortcuts must appear inside the research shell.
- `tailwindcss_search_form_wide`
  - Enable only if a footer or utility-search area is needed.
- `tailwindcss_syndicate`
  - Enable only if RSS is part of the research experience.

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
drush en cud_research -y
drush updb -y
drush cr
drush pml --status=enabled --type=module --format=json | grep -o '"cud_research"'
```

Expected result:
- Last command prints `"cud_research"` when the module is enabled.
- If Drush reports `Already enabled: cud_research`, the module is already installed.

### Full install

1. Build module CSS assets:

```bash
cd web/modules/custom/cud_research
npm install
npm run build
cd /var/www/devcontainers/cud.staging.local
```

2. Enable the module, run pending updates, rebuild cache:

```bash
drush en cud_research -y
drush updb -y
drush cr
```

What install creates automatically:
- Content type `research` (CUD Research)
- Field `field_research_slug` — URL path identifier
- Field `field_research_carousel_images` — unlimited media references (image)
- Field `field_research_carousel_content` — unlimited HTML overlay text, paired with images by position
- Menu `cud-research-primary` (CUD Research Primary) with 3 starter links
- Menu `cud-research-secondary` (CUD Research Secondary) with 3 starter links
- One starter published node with slug `main` → `/research`
- DB tables: `node__field_research_slug`, `node__field_research_carousel_images`, `node__field_research_carousel_content` (plus revision variants)

3. Add content:
- Edit the auto-created `main` node for `/research`.
- Add more `CUD Research` nodes with unique slugs for `/research/{slug}`.

4. Verify CUD Research menus and starter links:

```bash
drush php:eval "foreach (['cud-research-primary', 'cud-research-secondary'] as $id) { $menu = \Drupal\system\Entity\Menu::load($id); echo $id . ': ' . ($menu ? 'exists' : 'missing') . PHP_EOL; }"

drush php:eval '$storage = \Drupal::entityTypeManager()->getStorage("menu_link_content"); foreach (["cud-research-primary", "cud-research-secondary"] as $menu_name) { echo $menu_name . PHP_EOL; $links = $storage->loadByProperties(["menu_name" => $menu_name]); foreach ($links as $link) { $uri = $link->get("link")->first()?->getUrl()->toString() ?? ""; echo " - " . $link->label() . " => " . $uri . PHP_EOL; } }'
```

### Reinstall module

Use this sequence to wipe and recreate everything cleanly:

```bash
drush pm:uninstall cud_research -y
drush en cud_research -y
drush updb -y
drush cr
```

What this does:
- Uninstall deletes all research nodes, all field instances, all field storage tables, both CUD research menus, and the content type.
- Re-enable runs install hooks, recreates the content type, fields, both menus (with starter links), and the starter `main` node.

Rebuild CSS after reinstall if needed:

```bash
cd web/modules/custom/cud_research
npm run build
cd /var/www/devcontainers/cud.staging.local
drush cr
```

For existing installs that only need new update hooks applied (no full wipe):

```bash
drush updb -y
drush cr
```

This applies menu provisioning update hooks as well (including `cud_research_update_10005`).

Compatibility note:
- This module uses `preview_mode: 1` for node type creation, which is compatible with current Drupal core where `NodeType::NODE_PREVIEW_OPTIONAL` is not defined.

### Remove module

Always back up first:

```bash
drush sql:dump --result-file=../backup-before-cud-research-uninstall.sql
```

Then uninstall:

```bash
drush pm:uninstall cud_research -y
drush cr
```

What uninstall removes automatically:
- All published and unpublished `research` nodes and their revision data
- Field instance `field_research_slug` on `research`
- Field instance `field_research_carousel_images` on `research`
- Field instance `field_research_carousel_content` on `research`
- Field storage + DB tables for each field above (only if no other bundle uses it)
- Menu links in `cud-research-primary` and `cud-research-secondary`
- Menus `cud-research-primary` and `cud-research-secondary`
- Content type `research` (CUD Research)

Verify cleanup — confirm tables are gone:

```bash
drush sql:query "SHOW TABLES LIKE 'node__field_research%';"
drush sql:query "SELECT COUNT(*) FROM node WHERE type='research';" 2>/dev/null || echo "Table clean"
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
rm -rf web/modules/custom/cud_research
```

## Daily development workflow

When you edit utility classes in either Twig template:

```bash
cd web/modules/custom/cud_research
npm run build
cd /var/www/devcontainers/cud.staging.local
drush cr
```

Optional watch mode during development:

```bash
cd web/modules/custom/cud_research
npm run watch
```

## Validation checklist

After a build, check:
- `/research`
- `/research?mode=secondary`
- `/research/{slug}?mode=main`
- `/research/{slug}?mode=secondary`

## Troubleshooting

- `npm: command not found`
  - Install Node.js and npm on the environment running the build.
- Styles do not update after Twig changes
  - Re-run `npm run build` and `drush cr`.
- Missing utility classes
  - Verify classes exist in `css/cud_research.tailwind.css` after build.

## Assumptions

This module assumes:
- Content type machine name: `research`
- Field machine name: `field_research_slug`

If these differ, update `src/Controller/ResearchController.php`.
