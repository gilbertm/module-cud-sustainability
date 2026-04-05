# Sustainability Architecture Decision Log

## Why This Is Significant
This navigation and IA package is a foundational architecture artifact, not only a content draft.

It aligns three critical needs in one structure:
1. User-facing sustainability storytelling.
2. Institutional governance and policy transparency.
3. Reporting and evidence readiness for QS-style indicators.

## Decision Summary
Date: 2026-04-01
Scope: `web/modules/custom/cud_sustainability/docs`

Decisions recorded:
1. Use a sustainability-first top-level navigation rather than SDG-number-first navigation.
2. Keep reporting-heavy material discoverable but not dominant in top menu labels.
3. Introduce Reports and Disclosures as a dedicated hub for evidence and indicator linkage.
4. Separate architecture docs into focused markdown files for easier iteration.

## Document Set (Baseline)
1. navigation.md
2. navigation-condensed.md
3. drupal-menu-structure.md
4. page-template-matrix.md
5. sustainability-architecture-decision-log.md

## Governance of This Baseline
- Treat this set as the initial IA baseline for the module.
- Any future changes should update this log with:
  - Date
  - What changed
  - Why it changed
  - Impacted pages or menu items

## Change Log
### 2026-04-05
- Fixed carousel not rendering on inner pages served via Drupal path aliases.
  - Root cause: `hook_preprocess_page()` in `cud_sustainability.module` was hardcoding `'#carousel_items' => []` instead of calling the controller.
  - Fix: `SustainabilityController::getCarouselItems()` changed from `protected` to `public`; `hook_preprocess_page()` now instantiates the controller via `\Drupal::classResolver()` and calls `getCarouselItems($matched_node)`.
  - Templates affected: `cud-sustainability--our-commitment--governance.html.twig` and `cud-sustainability--normal.html.twig` had their carousel blocks incorrectly commented out with broken `{# % ... % #}` syntax; both are now active.
- Updated tab bar in governance template: responsive sizing (`text-xs`/`text-sm` mobile→desktop), improved icons per tab title (`fa-people-group`, `fa-landmark`, `fa-graduation-cap`, `fa-user-tie`, `fa-scale-balanced`).
- Mobile sub-nav strip changed from horizontal scroll to `flex-wrap` so labels are always readable.

### 2026-04-01
- Created initial sustainability IA baseline package from:
  - INTI ESG reference structure
  - CUD SDG framing
  - CUD workbook structure and indicator readiness requirements
