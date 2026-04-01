# Drupal Menu Structure Draft

## Purpose
This file maps the proposed sustainability IA into Drupal-friendly menu structure with parent-child hierarchy, suggested path, and initial menu weight.

## Primary Menu Structure

| Parent | Child | Path | Weight |
|---|---|---|---:|
| Sustainability | Overview | /sustainability | 0 |
| Sustainability | Our Commitment | /sustainability/our-commitment | 10 |
| Sustainability | Education | /sustainability/education | 20 |
| Sustainability | Research and Innovation | /sustainability/research-innovation | 30 |
| Sustainability | Campus Operations | /sustainability/campus-operations | 40 |
| Sustainability | Social Responsibility | /sustainability/social-responsibility | 50 |
| Sustainability | Governance and Ethics | /sustainability/governance-ethics | 60 |
| Sustainability | Partnerships and Outreach | /sustainability/partnerships-outreach | 70 |
| Sustainability | News and Stories | /sustainability/news | 80 |
| Sustainability | Reports and Disclosures | /sustainability/reports-disclosures | 90 |

## Secondary Submenu Suggestions

### Our Commitment
| Parent | Child | Path | Weight |
|---|---|---|---:|
| Our Commitment | Vision, Mission and Strategy | /sustainability/our-commitment/vision-mission-strategy | 10 |
| Our Commitment | President Message | /sustainability/our-commitment/president-message | 20 |
| Our Commitment | Alignment and Frameworks | /sustainability/our-commitment/alignment-frameworks | 30 |
| Our Commitment | Sustainability Roadmap | /sustainability/our-commitment/roadmap | 40 |

### Education
| Parent | Child | Path | Weight |
|---|---|---|---:|
| Education | SDG-Integrated Curriculum | /sustainability/education/sdg-integrated-curriculum | 10 |
| Education | Sustainability Programs | /sustainability/education/sustainability-programs | 20 |
| Education | Literacy and Training | /sustainability/education/literacy-training | 30 |
| Education | Student-Led Sustainability | /sustainability/education/student-led-sustainability | 40 |

### Research and Innovation
| Parent | Child | Path | Weight |
|---|---|---|---:|
| Research and Innovation | Center for Sustainability and Innovation | /sustainability/research-innovation/center-for-sustainability-and-innovation | 10 |
| Research and Innovation | Research Pillars | /sustainability/research-innovation/research-pillars | 20 |
| Research and Innovation | Research Groups | /sustainability/research-innovation/research-groups | 30 |
| Research and Innovation | Publications and Projects | /sustainability/research-innovation/publications-projects | 40 |

### Campus Operations
| Parent | Child | Path | Weight |
|---|---|---|---:|
| Campus Operations | Path to Net Zero | /sustainability/campus-operations/path-to-net-zero | 10 |
| Campus Operations | Emissions and Energy | /sustainability/campus-operations/emissions-energy | 20 |
| Campus Operations | Water and Waste | /sustainability/campus-operations/water-waste | 30 |
| Campus Operations | Sustainable Infrastructure | /sustainability/campus-operations/sustainable-infrastructure | 40 |
| Campus Operations | Procurement and Investment | /sustainability/campus-operations/procurement-investment | 50 |

### Social Responsibility
| Parent | Child | Path | Weight |
|---|---|---|---:|
| Social Responsibility | EDI at CUD | /sustainability/social-responsibility/edi | 10 |
| Social Responsibility | People of Determination | /sustainability/social-responsibility/people-of-determination | 20 |
| Social Responsibility | Health and Wellbeing | /sustainability/social-responsibility/health-wellbeing | 30 |
| Social Responsibility | Student Support and Inclusion | /sustainability/social-responsibility/student-support-inclusion | 40 |
| Social Responsibility | Community Alliances | /sustainability/social-responsibility/community-alliances | 50 |

### Governance and Ethics
| Parent | Child | Path | Weight |
|---|---|---|---:|
| Governance and Ethics | Governance Structure | /sustainability/governance-ethics/governance-structure | 10 |
| Governance and Ethics | Sustainability Council | /sustainability/governance-ethics/sustainability-council | 20 |
| Governance and Ethics | Ethics and Conduct | /sustainability/governance-ethics/ethics-conduct | 30 |
| Governance and Ethics | Anti-Bribery and Anti-Corruption | /sustainability/governance-ethics/anti-bribery-anti-corruption | 40 |
| Governance and Ethics | Student Representation | /sustainability/governance-ethics/student-representation | 50 |
| Governance and Ethics | Governance Minutes | /sustainability/governance-ethics/governance-minutes | 60 |

### Reports and Disclosures
| Parent | Child | Path | Weight |
|---|---|---|---:|
| Reports and Disclosures | Sustainability Reports | /sustainability/reports-disclosures/sustainability-reports | 10 |
| Reports and Disclosures | Annual Report | /sustainability/reports-disclosures/annual-report | 20 |
| Reports and Disclosures | Indicator Dashboard | /sustainability/reports-disclosures/indicator-dashboard | 30 |
| Reports and Disclosures | Evidence Repository | /sustainability/reports-disclosures/evidence-repository | 40 |
| Reports and Disclosures | Submission Readiness Tracker | /sustainability/reports-disclosures/submission-readiness | 50 |

## Utility Menu Structure

| Menu | Item | Path | Weight |
|---|---|---|---:|
| Sustainability Utility | SDG Framework | /sustainability/sdg-framework | 10 |
| Sustainability Utility | Policies Library | /sustainability/policies | 20 |
| Sustainability Utility | Sustainability Team | /sustainability/team | 30 |
| Sustainability Utility | Contact | /sustainability/contact | 40 |
| Sustainability Utility | Collaborate With Us | /sustainability/collaborate | 50 |

## Build Notes
- Keep Sustainability as one root parent for predictable IA.
- Use menu_link_content for manual curation of external and campaign links.
- Treat News and Stories as list + detail pattern (view + node).
- Treat Reports and Disclosures as structured evidence hub.
