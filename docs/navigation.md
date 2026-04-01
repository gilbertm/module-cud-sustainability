# CUD Sustainability Navigation (Draft)

## Purpose
This document proposes a sustainability-first navigation for the `cud_sustainability` architecture, based on:
- The workbook: `CUD Sustainability Website Structure v2 - 30 03 26.xlsx`
- Reference sites reviewed:
  - https://newinti.edu.my/esg/
  - https://www.cud.ac.ae/sdg/home/home.php
- The previous IA direction already discussed in this thread.

It is designed to be easy to tweak later.

## Companion Docs
- `navigation-condensed.md` for production-ready short menu labels.
- `drupal-menu-structure.md` for parent-child menu hierarchy, path draft, and weights.
- `page-template-matrix.md` for reusable section page blueprints.
- `sustainability-architecture-decision-log.md` for significance and baseline governance notes.

## What We Learned From INTI ESG
Observed content architecture patterns worth adopting:
- Clear institutional commitment page and strategy narrative.
- Four practical action pillars highlighted for users: Education, Research, Campus, Engagement.
- Strong visibility of partnerships and media/news updates.
- Sustainability as an institutional operating model, not a single campaign page.

## What We Learned From Your XLSX
The workbook is strongly organized by reporting logic and evidence readiness:
- Top dimensions:
  - Environmental Impact
  - Social Impact
  - Governance
- Key recurring content/evidence themes:
  - Policies and strategy
  - Curriculum and programs
  - Research centers and research groups
  - Operations (emissions, energy, water, net zero)
  - EDI, accessibility, health and wellbeing, community outreach
  - Governance structure, ethics, student representation, transparency
- The "CUD Website Draft" sheet already suggests practical sections that can become site navigation.

## Recommended Navigation (Primary)
1. Our Commitment
2. Education for Sustainability
3. Research and Innovation
4. Sustainable Campus Operations
5. Social Responsibility
6. Governance and Ethics
7. Partnerships and Outreach
8. Media, News and Stories
9. Data, Reports and Disclosures

## Recommended Navigation (Secondary / Utility)
1. SDG Framework
2. Policies Library
3. Sustainability Team
4. Contact the Sustainability Office
5. Submit Initiative / Collaboration Request

## Detailed IA Tree (Draft)

### 1) Our Commitment
- Vision, Mission and Strategy
- President Message
- Alignment and Frameworks
  - UAE Net Zero 2050
  - UAE Vision 2031
  - UAE Centennial 2071
  - UN SDGs
  - CUD ASPIRE values
- Sustainability Roadmap and Priorities

### 2) Education for Sustainability
- SDG-Integrated Curriculum
- Sustainability-Focused Programs
- Sustainability Literacy and Training
  - Student training
  - Staff training
- Student-Led Sustainability (Eco-lution Club)
- Course and Syllabus Evidence

### 3) Research and Innovation
- Center for Sustainability and Innovation
- Research Pillars
- Research Groups
  - Eco-Health Innovation
  - Innovative Health Systems and Technologies
  - Wellbeing and Performance
- Publications, Projects and Impact

### 4) Sustainable Campus Operations
- Path to Net Zero
  - Commitment year
  - Baseline and target progress
- Emissions and Energy
  - Scope 1/2 (and Scope 3 if available)
  - Renewable energy generation
- Water and Waste
- Sustainable Infrastructure
  - Green building standards
  - Campus environmental initiatives
- Procurement and Investment

### 5) Social Responsibility
- EDI at CUD
- People of Determination
  - Accessibility and accommodations
  - Disability support services
- Health and Wellbeing Services
- Student Support and Inclusion
- Community Alliances and Impact Programs

### 6) Governance and Ethics
- Governing Body, Management and Structure
- Sustainability Council
- Ethics and Conduct
- Anti-Bribery and Anti-Corruption
- Non-Discrimination and Safeguarding
- Student Council and Representation in Governance
- Governance Minutes and Accountability

### 7) Partnerships and Outreach
- Government and Industry Partnerships
- NGO and Community Partnerships
- Outreach Projects
- Engagement Calendar and Initiatives

### 8) Media, News and Stories
- Highlights
- Projects
- Latest News
- Announcements and Events

### 9) Data, Reports and Disclosures
- Sustainability Reports
- Annual Report and Financial Transparency
- Indicator Dashboard (QS-oriented)
- Evidence Repository (Policies, URLs, PDFs)
- Submission Readiness Tracker

## Suggested Mega-Menu Grouping (User-Friendly)
- Discover
  - Our Commitment
  - SDG Framework
  - Sustainability Team
- Learn
  - Education for Sustainability
  - Research and Innovation
- Act
  - Sustainable Campus Operations
  - Social Responsibility
  - Partnerships and Outreach
- Measure
  - Data, Reports and Disclosures
- News
  - Media, News and Stories

## Mapping to QS Hub Structure (So IA Supports Reporting)
- Environmental Impact:
  - Education for Sustainability
  - Research and Innovation
  - Sustainable Campus Operations
- Social Impact:
  - Social Responsibility
  - Partnerships and Outreach
  - Education for Sustainability (impact/literacy)
- Governance:
  - Governance and Ethics
  - Data, Reports and Disclosures

## Suggested URL Slug Draft
- `/sustainability`
- `/sustainability/our-commitment`
- `/sustainability/education`
- `/sustainability/research-innovation`
- `/sustainability/campus-operations`
- `/sustainability/social-responsibility`
- `/sustainability/governance-ethics`
- `/sustainability/partnerships-outreach`
- `/sustainability/news`
- `/sustainability/reports-disclosures`

## Drupal Architecture Notes (For Later Build)
- Keep top-level sections as stable parent nodes/pages.
- Model frequently updated content as structured entities/lists:
  - News, events, projects, reports, policies, indicators.
- Add a reusable "Evidence" component on relevant pages:
  - Source link, policy file, indicator code, reporting year, status.
- Add one "QS Indicator Index" page that links each indicator to its evidence page.

## First-Pass Build Priority
1. Our Commitment
2. Governance and Ethics
3. Sustainable Campus Operations
4. Education for Sustainability
5. Social Responsibility
6. Research and Innovation
7. Data, Reports and Disclosures
8. Partnerships and Outreach
9. Media, News and Stories

## Open Items To Finalize In Next Revision
- Confirm final labels for "Social Responsibility" vs "People and Community".
- Decide whether "Policies Library" stays utility-level or becomes primary nav.
- Confirm if Partnerships should be primary or nested under Social Responsibility.
- Confirm whether to expose QS indicator codes publicly or keep internal-only.
