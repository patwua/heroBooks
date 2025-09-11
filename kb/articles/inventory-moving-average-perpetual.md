---
id: inventory-moving-average-perpetual
slug: inventory-moving-average-perpetual
title: Inventory costing — perpetual moving average with G$ examples
summary: "How to run a perpetual moving-average ledger (updates after every receipt) and compare it with periodic weighted-average and FIFO. Includes NRV check and disclosures."
level: Intermediate
audience: [Accountant, Owner, Clerk, Student]
format: Guide
category_id: inventory
tags: [inventory, moving average, weighted average, FIFO, NRV, IFRS for SMEs, IAS 2]
jurisdiction: [Guyana]
last_reviewed: '2025-09-09'
sources:
  - title: IFRS for SMEs (3rd ed., 2025) Section 13 — cost formulas (FIFO/weighted average)
    url: https://www.ifrs.org/content/dam/ifrs/publications/html-standards/english/2025/issued/html-ifrs-for-smes.html
    publisher: IFRS Foundation
    date_accessed: '2025-09-09'
  - title: IAS 2 — Inventories (lower of cost and NRV; cost formulas)
    url: https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/
    publisher: IFRS Foundation
    date_accessed: '2025-09-09'
  - title: IAS 2 overview (LIFO not permitted)
    url: https://www.iasplus.com/en/standards/ias/ias2
    publisher: IAS Plus (Deloitte)
    date_accessed: '2025-09-09'
kb_snippets:
  - question: Is moving average allowed under IFRS?
    answer: IFRS/SMEs allow **weighted-average** and **FIFO** cost formulas. A **perpetual moving-average** is an implementation of weighted-average that updates after each receipt.
    type: faq
---

## Concept
Perpetual moving-average keeps a **running average unit cost** that updates immediately with each **purchase receipt**. Issues (sales) in between use the current average cost. It’s practical for high-volume, indistinguishable items and gives a smoother COGS than FIFO during price swings.

## Mini ledger (GYD)
Starting: **0 units**.  
1) Receive **100 @ 1,000** → Avg cost **1,000**; On-hand **100**.  
2) Sell **60** → COGS **60 × 1,000 = 60,000**; On-hand **40 @ 1,000**.  
3) Receive **80 @ 1,200** → New average = (40×1,000 + 80×1,200) / 120 = **1,133.33**.  
4) Sell **50** → COGS **50 × 1,133.33 ≈ 56,666**; On-hand **70 @ 1,133.33**.

## Compare to periodic weighted-average (month end)
Periodically, average = total cost ÷ total units for the period. Numbers will differ slightly from the **perpetual** method because receipts/sales timing affects the running average.

## NRV check (IAS 2/IFRS-SMEs)
At period end, compare on-hand cost to **NRV**; write down to NRV if lower. Disclose the **cost formula** used and your **write-down** policy.

## Controls & tips
– Keep **SKU** granularity consistent; no mixing unlike items.  
– Lock the cost formula in settings; disclose any change (and reason).  
– Investigate **negative on-hand** events; they can distort averages.

## Illustration
Square SVG: `/public/kb/illustrations/moving-average.svg` (alt: “Running cost line vs FIFO bars”).
