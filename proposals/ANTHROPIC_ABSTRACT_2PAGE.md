# Research Abstract

## Global AI Inequality Index (GAII): Measuring AI's Distributional Economic Impact Across 100 Countries

**Principal Investigator:** Ruca Lee | AlmaNEO Research Initiative | ruca@almaneo.org
**Live Platform:** https://almaneo.org/gaii | **Duration:** 6 months | **Requested:** $35,000 + $5,000 API credits

---

## 1. Research Question and Importance (300 words)

**Research Question:** How does asymmetric AI adoption create measurable economic stratification across income levels, geographic regions, and linguistic communities — and what quantitative framework can make this stratification visible, trackable, and actionable for policy?

The AI revolution is generating unprecedented economic value, yet its benefits are geographically concentrated. McKinsey projects AI will add $13 trillion to global GDP by 2030, but current data reveals a 3.5× adoption gap between the Global North (33.2% adoption) and Global South (9.5%). In the poorest countries, a standard AI subscription consumes 25–28% of average monthly income — effectively pricing out billions from the most economically transformative technology of our era.

Existing technology indices (ITU ICT Development Index, World Bank Digital Adoption Index) measure internet connectivity but fail to capture AI-specific inequalities: the economic *burden* of AI costs relative to income, the quality of language support for non-English speakers, and AI-specific skill gaps distinct from general digital literacy. This gap in measurement infrastructure prevents evidence-based policy responses.

This research is not speculative. The **Global AI Inequality Index (GAII) v1.0** is already deployed — a live, validated composite index covering 50 countries with four dimensions: Access (40%), Affordability (30%), Language Support (20%), and Skills (10%). The proposed grant funds the academic extension of this operational foundation: expanding to 100 countries, establishing longitudinal tracking, and conducting peer-reviewed econometric analysis correlating GAII scores with GDP growth, wage levels, and employment outcomes.

The core hypothesis is that AI adoption asymmetry functions as an economic multiplier — not merely a technology gap — creating self-reinforcing cycles where excluded populations fall further behind in labor markets, education, and entrepreneurial opportunity. Quantifying and publishing this mechanism is the first step toward correcting it.

---

## 2. Data and Empirical Methodology (400 words)

**GAII Composite Index Formula:**

```
GAII = 100 − (0.40 × Access + 0.30 × Affordability + 0.20 × Language + 0.10 × Skill)
```

Where GAII = 0 indicates near-perfect AI equity and GAII = 100 indicates total exclusion.

**Data Sources (existing pipeline, operational):**

| Dimension | Primary Sources | Sub-indicators |
|:----------|:---------------|:--------------|
| Access (40%) | Microsoft Global AI Report, ITU ICT Statistics | AI adoption rate, internet penetration, mobile connectivity, infrastructure quality |
| Affordability (30%) | World Bank WDI, PPP data, AI pricing surveys | AI cost-to-income ratio, free service accessibility, purchasing power |
| Language (20%) | Primary research, benchmark evaluations | Native language support quality, translation accuracy, local content availability |
| Skills (10%) | UNESCO Education Data, ITU Digital Skills Index | AI literacy, STEM enrollment, digital skills |

**Proposed Research Extensions:**

*Phase 1 (Months 1–2): Dataset expansion, 50 → 100 countries.*
Extend coverage using automated pipelines pulling from World Bank API, ITU DataHub, and UNESCO UIS. Claude API ($1,000 allocation) will cross-validate data across sources and flag anomalies for manual review.

*Phase 2 (Month 3): Econometric correlation analysis.*
OLS and panel regression analysis of GAII scores against GDP per capita growth (World Bank), Gini coefficient trajectories (WIID), and employment data (ILO ILOSTAT). Instrumental variable approach using geographic and historical connectivity measures to address endogeneity.

*Phase 3 (Month 4): Policy document analysis.*
Claude API ($1,500 allocation) will analyze AI policy documents and national AI strategies in 20 languages — classifying policy interventions by type (subsidy, regulation, infrastructure, education) and mapping them to GAII dimension outcomes.

*Phase 4 (Month 5): Primary survey component.*
1,000 structured interviews across 10 high-GAII countries (Bangladesh, Nigeria, Pakistan, Ethiopia, Cambodia, Bolivia, Myanmar, Tanzania, Nepal, Laos) via online platforms and NGO field partners. Survey instruments validated against GAII indicators.

*Phase 5 (Month 6): Publication and open data release.*
GAII Report v2.0 (PDF + web), academic paper draft (target: *Journal of Economic Perspectives*), 100-country open dataset (CC-BY-4.0), 4-page policy brief.

**Robustness checks:** Weight sensitivity analysis (±10% variation), regional sub-index validation, cross-referencing with Anthropic Economic Index occupation-level data where applicable.

---

## 3. Expected Contributions to Literature (300 words)

**Gap in existing literature:** Technology inequality research (Dewan & Riggins, 2005; van Dijk, 2020) focuses on internet access binaries. AI-specific inequality has no established composite measurement framework. The closest proxies — Stanford AI Index (2025), OECD Going Digital — track adoption rates but not the multi-dimensional economic burden of exclusion.

**Contribution 1 — Measurement framework.** GAII provides the first validated, multi-dimensional composite index for AI inequality, analogous to the Human Development Index for human capability measurement. The open methodology enables replication, extension, and critique — contributing a durable instrument to the inequality research toolkit.

**Contribution 2 — Causal evidence on economic stratification.** The econometric analysis (Phase 2) will produce the first systematic evidence on whether AI adoption asymmetry *causes* divergent economic trajectories, or merely correlates with existing inequalities. This distinction is critical for policy design: redistribution vs. direct access intervention.

**Contribution 3 — Language dimension quantification.** Over 3 billion people speak languages where AI support quality averages below 40/100 in our preliminary data. No existing study quantifies the economic value of linguistic AI exclusion at this scale. Our language sub-index and its correlation with economic outcomes fills this gap.

**Contribution 4 — Complementarity with Anthropic Economic Index.** The Anthropic Economic Index documents AI's occupation-level impacts within high-adoption economies. GAII documents the *absence* of those impacts in low-adoption economies. Cross-referencing the two datasets will illuminate whether the productivity gains documented in the Anthropic Index correlate with widening GAII disparities — directly testing the distributional consequences of AI-driven productivity growth.

All data and code will be released under CC-BY-4.0. The live dashboard (almaneo.org/gaii) will be updated to v2.0 upon completion, maintaining open access for subsequent researchers.

---

## 4. Timeline and Deliverables (200 words)

| Month | Activity | Deliverable |
|:-----:|:---------|:-----------|
| 1 | Dataset expansion: 50 → 75 countries; pipeline validation | Expanded dataset v2.0-alpha |
| 2 | Dataset expansion: 75 → 100 countries; survey instrument design | Complete 100-country dataset |
| 3 | Econometric correlation analysis (GAII vs. GDP, Gini, employment) | Statistical analysis draft |
| 4 | Policy document analysis (Claude API, 20 languages); survey fielding | Policy analysis report; survey data |
| 5 | GAII Report v2.0 draft; academic paper draft; peer review | Report draft; paper submitted |
| 6 | Publication; open data release; dashboard update; symposium presentation | All final deliverables |

**Final Deliverables:**

- GAII Report v2.0 — open-access PDF + interactive web (almaneo.org/gaii)
- Academic paper — submitted to peer-reviewed journal (*Journal of Economic Perspectives* or equivalent)
- 100-country open dataset — CSV + JSON, CC-BY-4.0 (GitHub + Zenodo DOI)
- Policy brief — 4-page PDF for policymakers and multilateral organizations
- Presentation — available for Anthropic Economic Futures symposium or workshop

**Budget summary:** Data collection $12K | Research assistant $10K | Surveys $5K | Design $3K | Publication fees $2K | Travel $3K | **Total $35,000**

---

*AlmaNEO Research Initiative | almaneo.org | contact@almaneo.org*
