# CUD Sustainability — Routing & Slug Reference

This document explains how URLs, routes, controller methods, Twig templates, and content slugs work together in the `cud_sustainability` module.

---

## How It Works

```
Browser URL
    │
    ▼
cud_sustainability.routing.yml  ←── static routes win over {slug} wildcard
    │
    ▼
SustainabilityController method
    │  loads node by field_research_slug
    ▼
Twig theme hook  →  templates/*.html.twig
```

### Key rule — route priority

Drupal evaluates routes in registration order **and** by specificity. Static paths like `/sustainability/our-commitment/governance` always win over the wildcard `{slug}` route. Always register specific routes **before** `cud_sustainability.sub_pages` in `cud_sustainability.routing.yml`.

### Key rule — `cud_sustainability_is_route()`

This function controls which routes get the module's page template (`page--cud-sustainability.html.twig`), HTML template, and asset-stripping. It currently accepts **any route whose name starts with `cud_sustainability.`**, so new routes added to the module are automatically included.

---

## Registered Routes

| Route name | Path | Controller method | Notes |
|---|---|---|---|
| `cud_sustainability.index` | `/sustainability` | `index()` | Landing page |
| `cud_sustainability.search` | `/sustainability/search` | `search()` | Search results |
| `cud_sustainability.governance` | `/sustainability/our-commitment/governance` | `renderGovernancePage()` | Static inner page |
| `cud_sustainability.sub_pages` | `/sustainability/{slug}` | `renderPage()` | Wildcard fallback |
| `cud_sustainability.settings` | `/admin/config/content/cud-sustainability` | SettingsForm | Admin only |

---

## Twig Templates

| Theme hook | Template file | Used by |
|---|---|---|
| `cud_sustainability_main` | `cud-sustainability-main.html.twig` | `index()`, `renderPage()` (mode=main) |
| `cud_sustainability_secondary` | `cud-sustainability-secondary.html.twig` | `renderPage()` (mode=secondary) |
| `cud_sustainability_governance` | `cud-sustainability-governance.html.twig` | `renderGovernancePage()` |
| `page__cud_sustainability` | `page--cud-sustainability.html.twig` | Page shell wrapper (header/footer/nav) for all routes |
| `html__cud_sustainability` | `html--cud-sustainability.html.twig` | HTML document wrapper for all routes |

Theme hooks are registered in `cud_sustainability_theme()` inside `cud_sustainability.module`.

---

## Content Node Slugs (`field_research_slug`)

Content is loaded by matching `field_research_slug` on published nodes of type `sustainability`.

### Generic wildcard route (`renderPage`)

The URL segment after `/sustainability/` is passed directly as the slug. Examples:

| URL | Slug queried |
|---|---|
| `/sustainability/our-commitment` | `our-commitment` |
| `/sustainability/campus/health-wellness` | `campus/health-wellness` |

→ If no node matches, the user is **redirected to `/sustainability`** (not a 404).

### Special static routes

Static routes use their own slug lookup chains in the controller method. This handles edge cases where the slug was saved with or without a leading slash.

#### Governance (`renderGovernancePage`)

Tries each slug in order until one matches:

1. `governance`
2. `our-commitment/governance`
3. `sustainability/our-commitment/governance`
4. `/sustainability/our-commitment/governance`

→ If none match, a fallback page is rendered using the governance template (no redirect).

---

## Adding a New Inner Page (Step-by-Step)

Example: adding `/sustainability/our-commitment/sustainability-committee`

### 1. Add the route (before `cud_sustainability.sub_pages`)

```yaml
# cud_sustainability.routing.yml
cud_sustainability.sustainability_committee:
  path: '/sustainability/our-commitment/sustainability-committee'
  defaults:
    _controller: 'Drupal\cud_sustainability\Controller\SustainabilityController::renderSustainabilityCommitteePage'
    _title: 'Sustainability Committee'
  requirements:
    _permission: 'access content'
```

### 2. Add the controller method

```php
// SustainabilityController.php
public function renderSustainabilityCommitteePage() {
  $node = $this->loadPublishedNodeBySlug('sustainability-committee')
    ?? $this->loadPublishedNodeBySlug('/sustainability/our-commitment/sustainability-committee');
  $mode = $this->resolveMode();

  return [
    '#theme' => 'cud_sustainability_governance',  // reuse governance template, or create a new one
    '#title' => $node ? $node->label() : $this->t('Sustainability Committee')->render(),
    '#content' => $node ? $this->nodeViewBuilder->view($node, 'full') : ['#markup' => $this->t('Content coming soon.')],
    '#carousel_items' => $node ? $this->getCarouselItems($node) : [],
    '#sections' => $node ? $this->getSections($node) : [],
    '#primary_nav' => static::getPrimaryMenuOverride(),
    '#secondary_nav' => static::getSecondaryMenuOverride(),
    '#mode' => $mode,
    '#cache' => ['contexts' => ['url.query_args:mode', 'url.path']],
  ];
}
```

### 3. Optionally create a dedicated template

If a unique layout is needed:

- Create `templates/cud-sustainability-sustainability-committee.html.twig`
- Register the theme hook in `cud_sustainability_theme()` inside `cud_sustainability.module`
- Change `#theme` in the controller to `'cud_sustainability_sustainability_committee'`

If the governance layout is sufficient, reuse `cud_sustainability_governance` (no new template needed).

### 4. Create the content node

- Content type: **Sustainability**
- `field_research_slug`: use one of the slugs the controller tries (e.g. `sustainability-committee` or `/sustainability/our-commitment/sustainability-committee`)

### 5. Clear the cache

```bash
drush cr
```

---

## Quick Decisions

| Situation | Action |
|---|---|
| New top-level page like `/sustainability/campus` | Just create a node with slug `campus` — handled by `sub_pages` wildcard |
| New nested page like `/sustainability/our-commitment/sdgs` | Option A: create node with slug `our-commitment/sdgs` (wildcard picks it up). Option B: add a static route + controller method for a custom template |
| Need a unique layout/template for a specific page | Add static route + controller method + new theme hook + new Twig template |
| Content exists but page shows "coming soon" | Check the stored slug value in the node — must match exactly what the controller queries |
| Page redirects to `/sustainability` unexpectedly | No published node matched the URL slug. Check `field_research_slug` on the node |
