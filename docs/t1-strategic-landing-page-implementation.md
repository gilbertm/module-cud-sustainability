# T1 - Strategic Landing Page Implementation

## Overview
The T1 - Strategic Landing Page template has been implemented in `cud-sustainability-main.html.twig` for pages requiring:
- **Our Commitment**
- **Governance and Ethics**
- **Campus Operations** (top level)

This template combines hero/carousel, priority themes, and four specialized strategic blocks designed to showcase institutional commitment, KPI progress, policy frameworks, and collaboration pathways.

## Template Structure

### Page-Level Flow
1. **Carousel** (existing) — Full-width hero with optional overlay
2. **Priority Sustainability Themes** (existing) — 3-column card grid
3. **→ T1 BLOCK 0: CUD Commitment Hero** ← NEW
4. **→ T1 BLOCK 1: KPI Snapshot** ← NEW
5. **→ T1 BLOCK 2: Pillar Cards** ← NEW
6. **→ T1 BLOCK 3: Policy and Framework Strip** ← NEW
7. **Explore Our Sustainability Navigation** (existing)
8. **SDG Alignments** (existing)
9. **→ T1 BLOCK 4: Collaboration CTA** ← NEW (inserted before SDG)
10. **Upcoming Events** (existing)

---

## T1 Block 0: CUD Commitment Hero

### Purpose
Introductory commitment block establishing CUD's institutional sustainability direction using the same visual language as `#template-section`.

### Location
Immediately after "Priority Sustainability Themes" section, before KPI Snapshot.

### Current Data
```
Headline: "Leading Sustainable Development Through Institutional Integration"
Message: "CUD integrates sustainability across education, research and innovation, campus 
operations, social responsibility, governance and ethics, and partnerships. We foster a 
holistic, evidence-based approach to sustainable development that creates meaningful 
impact for our region and the world."
Primary CTA: "Our Strategy and Roadmap" → {{ research_link_strategy }}
Secondary CTA: "Learn About Our Mission" → {{ research_link_overview }}

Four Pillar Cards:
1. Education - SDG-integrated curriculum, literacy, student-led initiatives
2. Research - Innovation, evidence-based solutions
3. Operations - Net-zero, resource stewardship
4. Partnerships - Regional and global collaboration
```

### Customization Points
- **Headline** — Institutional commitment tagline
- **Main message** — Strategic focus areas and value proposition
- **CTA text and links** — Update to actual strategy and mission pages
- **Pillar cards** — Edit titles, icons, descriptions
- **Icons** — FontAwesome classes (e.g., `fa-graduation-cap`, `fa-flask`, `fa-building`, `fa-handshake`)

### CSS Classes Used
- Section shell: `mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-4 lg:py-6`
- Heading style: `cud-color-blue` with compact utility label
- Content surface: `rounded-2xl border-b border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.07)]`
- Accent actions: slate text + CUD red icon/button accents (`#b13634`)

### Data Source
**Menu Structure** from `SustainabilityController.php`:
- Reflects CUD's 9 primary strategic sections
- Commitment message derived from institutional mission and menu coverage

---

## T1 Block 1: KPI Snapshot

### Purpose
Display 3-6 key performance indicators with metrics, achievement status, and reporting dates. Establishes institutional credibility and progress toward sustainability targets.

### Location
After "Priority Sustainability Themes" section, before pillar cards.

### Current Data (Template Placeholder)
```
1. 92% - Renewable Energy Transition (Target: 100% by 2030 | Q4 2025)
2. 28 - Sustainability Frameworks (Policies covering operations, governance | Jan 2026)
3. 8.4 tons CO₂e - Emissions Per FTE (Down from 9.2 | Baseline: 2020)
4. 312 - Active Sustainability Projects (Spanning 7 strategic pillars)
5. 1,247 - Researchers engaged in Sustainability (Faculty and students)
```

### Customization Points
- **KPI Value** — Primary metric (e.g., "92%", "28", "8.4")
- **Achievement Color** — Tailwind color classes (`text-sky-600`, `text-emerald-600`, `text-amber-600`, etc.)
- **Label** — Metric name (e.g., "Renewable Energy Transition")
- **Context** — Target, unit, baseline, or descriptive text
- **Last Updated** — Reporting period and date

### CSS Classes Used
- Section shell: `mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-4 lg:py-6`
- Card hover: `hover:border-sky-300 hover:shadow-[0_12px_32px...]`
- Metrics color-coded by pillar (sky, emerald, amber, indigo, rose)

### Data Source
**Excel Sheet**: "CUD Sustainability Website Structure v2 - 30 03 26.xlsx"
- Expected columns: Metric Name | Current Value | Target | Unit | Reporting Period

---

## T1 Block 2: Pillar Cards

### Purpose
Present 3 core strategic pillars as interactive cards linking to child pages. Each pillar includes icon, description, and link affordance.

### Location
Immediately after KPI Snapshot block.

### Current Pillars Implemented
1. **Education and Learning**
   - Icon: `fa-graduation-cap`
   - Color: sky-blue
   - Description: SDG-integrated curriculum, sustainability literacy, student-led initiatives, faculty development
   - Link: `{{ research_link_clusters }}` (update to `/sustainability/education`)

2. **Research and Innovation**
   - Icon: `fa-flask-vial`
   - Color: emerald
   - Description: Center for Sustainability, research pillars, publications, evidence-based solutions
   - Link: `{{ research_link_clusters }}` (update to `/sustainability/research-innovation`)

3. **Campus Operations and Stewardship**
   - Icon: `fa-leaf`
   - Color: violet
   - Description: Net-zero pathway, renewable energy, water/waste, sustainable infrastructure, procurement
   - Link: `{{ research_link_clusters }}` (update to `/sustainability/campus-operations`)

### Customization Points
- **Pillar Icon** — FontAwesome icon class (e.g., `fa-leaf`, `fa-people-group`, `fa-scale-balanced`)
- **Pillar Title** — Strategic pillar name
- **Description** — 1-2 sentence summary
- **Link Destination** — CUSTOMIZE: Replace `{{ research_link_clusters }}` with actual pillar page URLs
- **Color Scheme** — Tailwind color family (sky, emerald, violet, etc.)

### CSS Classes Used
- Gradient accent: `bg-gradient-to-br from-sky-50 to-sky-100/0` (repeat for each color)
- Icon background: `bg-sky-50 group-hover:bg-sky-100`
- Link color: `text-sky-600 group-hover:text-sky-700`
- Card hover: `hover:border-sky-300 hover:shadow-[0_20px_40px...]`

### Data Source
**Menu Structure** from `SustainabilityController.php`:
- Maps to primary nav items with children (e.g., "Our Commitment" → strategic pillars)
- Future: populate pillar links from Drupal menu tree or structured field

---

## T1 Block 3: Policy and Framework Summary

### Purpose
Policy and governance summary highlighting institutional accountability, latest policy update, compliance standards, and supporting CTAs.

### Location
After Pillar Cards block, before Explore Navigation.

### Current Data (Template Placeholder)
```
Heading: "Governance and Accountability"
Description: CUD's sustainability commitment is governed by a Sustainability Council and reinforced 
by institutional policies spanning environmental stewardship, social equity, operational efficiency, 
governance transparency, and alignment with international frameworks (ISO 14001, GRI, UN SDGs).
Policy Count: 28
Latest Update: "Sustainability Policy Framework v2.1 | March 15, 2026"
Compliance: "7 International Standards | ISO 14001 • GRI • SASB • UN SDGs"
Primary CTA: "View All Policies" → {{ research_link_overview }}
Secondary CTA: "Strategic Roadmap" → {{ research_link_strategy }}
```

### Customization Points
- **Policy Count** — Total institutional policies
- **Latest Update Title** — Framework or policy name
- **Update Date** — Approval or effective date
- **Compliance Standards** — ISO codes, acronyms
- **CTA Links** — Update to actual policy list and strategy URLs

### CSS Classes Used
- Section shell: `mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-4 lg:py-6`
- Main content card: `rounded-2xl border-b border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.07)]`
- Metadata cards: `rounded-xl border border-slate-200 bg-white`
- Buttons: neutral outline for secondary + CUD red filled primary (`bg-[#b13634]`)

### Data Source
**Excel Sheet**:
- Expected columns: Policy Name | Approval Date | Standards Alignment | Category

---

## T1 Block 4: Collaboration and Contact CTA

### Purpose
Encourage engagement through team connections, partnerships, and student opportunities. Final call-to-action before SDG/event sections.

### Location
Before Explore Navigation, and above SDG Alignments section.

### Current Data (Template Placeholder)
```
Heading: "Join Our Sustainability Journey"
Description: Pathways for researchers, students, partners to contribute
Primary CTA: "Meet the Team" → {{ research_link_researchers }}
Secondary CTA: "Contact Us" → {{ research_link_overview }}

Quick Links (2-column):
1. Icon: fa-handshake | Partnerships | Industry collaborations and research consortia
2. Icon: fa-graduation-cap | Student Programs | Internships, projects, research opportunities
```

### Customization Points
- **Headings and CTAs** — Linked to team pages, contact forms
- **Quick Links** — Add/remove opportunities (volunteer, internships, advisory roles, etc.)
- **Icons** — FontAwesome classes for each opportunity
- **Link Destinations** — Update to actual team directory, contact form URLs

### CSS Classes Used
- Container: `rounded-2xl border-b border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.07)]`
- CTA buttons: `bg-sky-600 hover:bg-sky-700` (primary), `border border-slate-300` (secondary)
- Quick link boxes: `rounded-2xl border border-sky-200 bg-sky-50`, etc.

### Data Source
**Excel Sheet** or **Controller**:
- Expected columns: Opportunity Type | Icon | Title | Description | Link

---

## Template Variables Used

### From Controller Render Context
These variables are passed from `SustainabilityController.php`:
- `{{ primary_nav }}` — Full primary navigation with children
- `{{ secondary_nav }}` — Utility links (used for fallback URLs)
- `{{ research_link_overview }}` — Homepage/overview link
- `{{ research_link_strategy }}` — Sustainability strategy page link
- `{{ research_link_clusters }}` — Research/initiatives cluster page link
- `{{ research_link_researchers }}` — Researcher/team directory link
- `{{ research_link_publications }}` — Publications/evidence page link
- `{{ mode }}` — Page mode indicator (main, secondary, etc.)

### Required for Customization
Each block references these Twig variables; ensure they're correctly populated in `cud_sustainability_preprocess_page()` hook.

---

## Integration Checklist

- [ ] KPI values confirmed from Excel sheet
- [ ] Pillar page URLs identified and added to menu structure
- [ ] Policy count validated against institutional records
- [ ] Compliance standards reviewed and confirmed
- [ ] Team contact page URL updated
- [ ] Student opportunities page URL updated
- [ ] Cache rebuilt (`drush cr`)
- [ ] Template tested on mobile/tablet/desktop
- [ ] Links tested and verified

---

## Styling Notes

### Responsive Breakpoints
- **Mobile** (`< 640px`): Single-column layout, full-width cards
- **Tablet** (`640px - 1023px`): 2-column grids where applicable
- **Desktop** (`≥ 1024px`): 3-column grids, optimized spacing

### Color Palette
- **KPI Cards**: Sky (blue), Emerald (green), Amber (warning), Indigo (secondary), Rose (accent)
- **Pillars**: Sky (blue), Emerald (green), Violet (purple)
- **Policy Summary**: White cards + slate typography + CUD red primary CTA
- **Contact Box**: White card surfaces with accent tiles

### Hover Effects
- Cards: Border color change + shadow elevation
- Icons: Subtle background color shift
- Links: Color transition + underline or arrow emphasis
- Buttons: Translate-y lift on hover (primary CTA only)

---

## Future Enhancements

1. **Dynamically load KPI data** from Drupal custom fields or external API
2. **Pillar filtration** — Add secondary KPI breakdown by pillar
3. **Evidence modal** — Click-through to PDF/document links from KPI cards
4. **Testimonials carousel** — Add student/researcher quotes in collaboration section
5. **Policy timeline** — Interactive timeline of policy approvals and reviews
6. **SDG mapping visual** — Explicit icon linkage between KPIs and UN SDG goals

---

## Related Documentation
- [Page Template Matrix](page-template-matrix.md)
- [Drupal Menu Structure](drupal-menu-structure.md)
- [Navigation Condensed](navigation-condensed.md)
- [SustainabilityController.php](../src/Controller/SustainabilityController.php)
- [Template: cud-sustainability-main.html.twig](../templates/cud-sustainability-main.html.twig)

---

## Questions / Iterations
Update this file as:
- KPI values change
- Pillar names/descriptions are refined
- New collaboration opportunities are added
- Links/CTAs are confirmed with actual page URLs
