**

---

# Impact of Climate Change on Agricultural Productivity in the Midwest United States  
*Research Report – September 2023*  

**Authors:** Dr. Emily J. Thompson (University of Illinois), Prof. Michael L. Garcia (Purdue University), Dr. Sarah K. Lee (Indiana University)  

---

## Executive Summary
- **Scope:** 1990‑2020 analysis of climate trends and their relationship with corn, soybean, and wheat yields across ten Midwestern states.  
- **Key Climate Findings:**  
  - Growing‑season temperature rose **+1.3 °C** (1990‑2020) with heat‑wave days (>35 °C) increasing from **4 to 9 days/season** (p < 0.01).  
  - Total precipitation increased modestly **+5 mm**, but variability grew (coefficient of variation 0.18 → 0.27).  
  - Drought frequency (SPEI ≤ –1.5) rose from **12 %** to **22 %** of counties.  
- **Yield Impacts:**  
  - **Corn:** Average yield fell **5 %** (174 → 165 bu/acre; p < 0.05).  
  - **Soybean:** Average yield fell **9 %** (48 → 44 bu/acre; p < 0.01).  
  - **Wheat:** No statistically significant change (≈62 bu/acre; p = 0.21).  
- **Regression Results (fixed‑effects panel):** Temperature and heat‑wave days are the strongest negative predictors; irrigation, soil quality, and fertilizer use are positive.  
- **Adaptation Successes:**  
  - **Adjusted planting dates** adopted by **68 %** (corn) & **73 %** (soybean).  
  - **Drought‑resistant hybrids** used on **45 %** (corn) & **52 %** (soybean).  
  - **Precision irrigation** employed by **38 %** of farms, delivering a **6 % yield gain** (p < 0.05).  
- **Policy Implications:** Targeted funding for heat‑tolerant varieties, subsidies for precision irrigation, and expanded extension services are essential to sustain Midwestern productivity under continued warming.

---

## 1. Introduction
Agriculture contributes **>30 % of the Midwest’s GDP** and employs roughly **1.2 million workers** (USDA, 2022). The region’s “Corn Belt” is highly dependent on rain‑fed crops and flat terrain, making it especially sensitive to climate variability. This study:

1. Quantifies **temperature, precipitation, and extreme‑event trends** (1990‑2020).  
2. Links these climate variables to **county‑level yields** of corn, soybean, and wheat.  
3. Evaluates **farm‑level adaptation practices** reported in a 2022‑2023 survey.

**Research Questions**  

- How have temperature and precipitation changed across Illinois, Indiana, Iowa, Kansas, Michigan, Minnesota, Missouri, Nebraska, Ohio, and Wisconsin?  
- What is the magnitude of climate‑change impact on the yields of the three major crops?  
- Which adaptation practices most effectively mitigate yield losses?

---

## 2. Literature Review
- Global meta‑analyses (Lobell et al., 2011; Schlenker & Roberts, 2009) confirm that rising temperatures generally depress yields.  
- Midwest‑specific work (Basso et al., 2019) highlights the interplay of heat, precipitation shifts, and crop phenology.  
- **Yield sensitivity estimates:**  
  - **Corn:** 5–10 % decline per +1 °C without adaptation (Rosenzweig et al., 2020).  
  - **Wheat:** Potential modest gains under moderate warming (Fischer et al., 2015).  
- Adaptation tactics—earlier planting, drought‑resistant hybrids, precision irrigation—show promise but adoption is uneven (Gao et al., 2020; Miller & Jones, 2021).

---

## 3. Data and Methodology  

### 3.1. Data Sources
| Source | Content | Temporal/Spatial Resolution |
|--------|---------|-----------------------------|
| **NOAA NCEI** | Daily max/min temperature, precipitation | 0.25° grid, 1990‑2020 |
| **MODIS** | NDVI (vegetation greenness) | 500 m, seasonal composites |
| **USDA NASS** | County‑level yields (corn, soybean, wheat) | Annual, adjusted for inflation |
| **Farm Survey** | Management practices, tech adoption, perceived climate impacts | 1,200 farms, 2022‑2023 |

### 3.2. Statistical Model
A **panel data fixed‑effects regression** isolates climate impacts while controlling for time‑invariant county characteristics:

\[
Y_{i,t}= \alpha_i + \beta_1 Temp_{i,t} + \beta_2 Prec_{i,t} + \beta_3 HeatWaves_{i,t}
+ \beta_4 Drought_{i,t} + \gamma X_{i,t} + \epsilon_{i,t}
\]

- \(Y_{i,t}\): Yield (bushels/acre) for crop *c* in county *i*, year *t*.  
- \(Temp_{i,t}\): Avg. growing‑season temperature (°C).  
- \(Prec_{i,t}\): Total growing‑season precipitation (mm).  
- \(HeatWaves_{i,t}\): Days > 35 °C during the season.  
- \(Drought_{i,t}\): SPEI ≤ –1.5.  
- \(X_{i,t}\): Soil quality index, fertilizer use (kg/ha), irrigation dummy.  
- \(\alpha_i\): County fixed effect.  

**Diagnostics:** VIF < 3 (no multicollinearity); Breusch‑Pagan test indicates homoskedasticity after robust clustering at the county level.

---

## 4. Results  

### 4.1. Climate Trends
- **Temperature:** +1.3 °C mean increase; post‑2010 rise of +0.6 °C.  
- **Heat‑wave Days:** From 4 days (1990s) → 9 days (2010s) per season (**p < 0.01**).  
- **Precipitation:** +5 mm total, but variability up (CV 0.18 → 0.27).  
- **Extreme Events:** Drought incidence ↑ from 12 % to 22 % of counties.

### 4.2. Yield Trends
- **Corn:** 174 → 165 bu/acre (‑5 %; **p < 0.05**).  
- **Soybean:** 48 → 44 bu/acre (‑9 %; **p < 0.01**).  
- **Wheat:** No significant change (≈62 bu/acre; **p = 0.21**).

### 4.3. Regression Analysis  

| Variable | Corn (β) | Soybean (β) | Wheat (β) |
|----------|----------|-------------|----------|
| Temp (°C) | **–4.2*** | **–3.8*** | **–1.1*** |
| Prec (mm) | +0.03 | +0.02 | +0.04 |
| HeatWaves (days) | **–0.7*** | **–0.5*** | –0.2 |
| Drought (SPEI) | **–2.1** | **–1.9** | –0.6 |
| Soil Quality Index | **+1.5*** | **+1.2*** | **+1.4*** |
| Fertilizer Use (kg/ha) | **+0.04*** | **+0.03*** | **+0.02*** |
| Irrigation (dummy) | **+2.8*** | **+2.1*** | **+1.5*** |

\* p < 0.10 ** p < 0.05 *** p < 0.01  

**Interpretation:**  
- A 1 °C rise cuts corn yields by ~4.2 bu/acre, soybean by ~3.8 bu/acre.  
- Each additional heat‑wave day reduces corn yield by ~0.7 bu/acre.  
- Irrigation offsets temperature stress, adding ~2.8 bu/acre to corn yields.  

---

## 5. Discussion  

### 5.1. Interpretation of Findings
- **Temperature‑driven losses** dominate the negative yield trends for corn and soybean, aligning with IPCC (2021) projections.  
- **Wheat’s stability** reflects its shorter growing period and inherent heat tolerance.  
- The non‑significant precipitation coefficient suggests **offsetting effects**: some counties receive excess rain, others suffer droughts, diluting a net effect at the aggregate level.  

### 5.2. Adaptation Strategies (Survey Results)
- **Adjusted Planting Dates:** 68 % (corn) & 73 % (soybean) of growers now plant 5‑10 days earlier.  
- **Drought‑Resistant Varieties:** Adopted on 45 % (corn) & 52 % (soybean) of fields.  
- **Precision Irrigation:** 38 % of farms use sensor‑based scheduling; yields are **6 % higher** than non‑users (**p < 0.05**).  
- **Economic Assessment:** Precision irrigation costs ≈ $1,200 ha⁻¹ upfront, yielding a **NPV of $3,500 ha⁻¹** over ten years under current climate scenarios.  

### 5.3. Limitations
- **Spatial Aggregation:** County‑level yields mask intra‑county heterogeneity (soil, micro‑climate).  
- **Omitted Variables:** Unobserved management practices (e.g., crop rotation) could bias estimates.  
- **No Future Projections:** The analysis is descriptive; it does not incorporate climate model forecasts (e.g., CMIP6).  

---

## 6. Conclusions and Recommendations  

### Conclusions
- **Climate change has materially reduced corn and soybean productivity** in the Midwest via higher temperatures and more frequent heatwaves.  
- **Wheat remains comparatively resilient**, but its stability does not guarantee immunity under future warming.  
- **Adaptation measures—earlier planting, drought‑tolerant hybrids, and especially precision irrigation—have demonstrably mitigated yield losses**.

### Recommendations
1. **Policy Support:**  
   - Expand federal and state grants for research on heat‑tolerant crop genetics.  
   - Provide subsidies or low‑interest loans for precision irrigation equipment, targeting mid‑size farms.  
2. **Extension Services:**  
   - Strengthen outreach on climate‑smart practices (e.g., optimal planting windows, water‑use efficiency).  
   - Facilitate farmer networks for sharing successful adaptation experiences.  
3. **Infrastructure Investment:**  
   - Develop regional water storage and conveyance projects to buffer precipitation variability.  
4. **Future Research:**  
   - Couple observed trends with **CMIP6 climate scenarios** and crop simulation models (e.g., DSSAT) to generate forward‑looking productivity forecasts.  
   - Conduct finer‑scale (field‑level) analyses to capture heterogeneity in climate exposure and management.

---

## 7. References  

- Basso, B., Cammarano, D., & Raggi, M. (2019). *Climate variability and agricultural yields in the US Midwest*. **Journal of Agricultural Economics**, 70(3), 567‑585.  
- Fischer, R. A., et al. (2015). *Assessing the impacts of climate change on wheat yields in the United States*. **Nature Climate Change**, 5, 398‑402.  
- Gao, Y., et al. (2020). *Precision irrigation and crop yield under drought stress*. **Agricultural Water Management**, 236, 106107.  
- IPCC. (2021). *Climate Change 2021: The Physical Science Basis*. Contribution of Working Group I to the Sixth Assessment Report.  
- Lobell, D. B., et al. (2011). *Climate trends and global crop productivity*. **Science**, 333, 616‑620.  
- Miller, J., & Jones, A. (2021). *Economic constraints on adoption of climate‑smart agriculture in the US Midwest*. **Agricultural Economics**, 52(4), 623‑637.  
- Rosenzweig, C., et al. (2020). *Temperature impacts on US corn yields: a meta‑analysis*. **Environmental Research Letters**, 15, 054001.  
- Schlenker, W., & Roberts, M. (2009). *Nonlinear temperature effects indicate severe damages to US crop yields under climate change*. **Proceedings of the National