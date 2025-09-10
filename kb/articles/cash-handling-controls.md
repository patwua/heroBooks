---
id: cash-handling-controls
slug: cash-handling-controls
title: Cash-handling controls (day open, day close, deposit) — practical checklist
summary: A COSO-aligned routine to open tills, log floats, capture refunds/voids, perform surprise counts, reconcile to POS and bank, and post VAT-inclusive sales in GYD.
level: Beginner
audience: [Owner, Clerk, Accountant]
format: Guide
category_id: cash
tags: [cash, internal control, reconciliation, VAT, deposit, GYD]
jurisdiction: [Guyana]
last_reviewed: '2025-09-09'
sources:
  - title: COSO — Internal Control (Integrated Framework) overview
    url: https://www.coso.org/guidance-on-ic
    publisher: COSO
    date_accessed: '2025-09-09'
  - title: AuditBoard — COSO framework fundamentals (5 components; 17 principles)
    url: https://auditboard.com/blog/coso-framework-fundamentals
    publisher: AuditBoard
    date_accessed: '2025-09-09'
  - title: IFC — Internal Control Handbook (cash management tools)
    url: https://www.ifc.org/en/insights-reports/2022/internal-control-handbook
    publisher: International Finance Corporation
    date_accessed: '2025-09-09'
kb_snippets:
  - question: What’s a solid day-close routine?
    answer: Count each till, reconcile to POS Z-report (sales, refunds, VAT), prepare the bank deposit, and log over/short with a second person observing. Post a single summary journal for the day.
    type: howto
  - question: How should VAT be handled for cash sales?
    answer: If prices are VAT-inclusive, extract output VAT using the 14/114 fraction (i.e., 7/57 of the gross) before posting revenue. Keep Z-reports and tax-invoice ranges.
    type: faq
---

## Day open (set control baseline)
1) Float per till (e.g., G$10,000), logged and signed.  
2) Drawer assignment (named user), passworded POS.  
3) Petty cash kept separate from tills (own log).

## During the day
– Use POS for every sale; no manual receipts except if POS down (document outage).  
– Refunds/voids require manager PIN and reason.  
– No mixing of private money; store cheques separately.

## Day close (five steps)
1) Physical count of each till (cash + cheques).  
2) Print Z-report (gross, refunds, VAT, net).  
3) Prepare bank deposit; attach Z-report.  
4) Complete over/short log (investigate ±G$500 and above).  
5) Post the summary journal.

### Worked example (GYD, VAT-inclusive)
Z-report: Gross cash sales G$228,000; refunds G$8,000; net G$220,000.  
VAT portion (14% inclusive) = net × 14/114 = G$27,018 (≈7/57).  
Revenue (net of VAT) = G$192,982.  
Banking: Till count G$230,000 less float G$10,000 ⇒ Deposit G$220,000.  

Journal:  
Dr Cash at bank 220,000  
 Cr VAT Output 27,018  
 Cr Sales (ex‑VAT) 192,982

> Tip: Keep floats unchanged day‑to‑day; variances stay visible in the over/short log.

## Controls that catch problems early
• Segregation: different people for till use, approval of refunds, and daily posting.  
• Surprise counts: once per week per till; document result.  
• Deposit timeliness: banking next business day; match bank credit to deposit slip.  
• Video at cash‑up area (if feasible) + locked drop safe.

## Common pitfalls in small shops
– Deposits that don’t match POS Z‑report cash.  
– Mixing floats and petty cash.  
– Refunds without paper trail (scan/store slips).  
– VAT not separated from VAT‑inclusive totals in the ledger.

## Illustration
> Figure: see /public/kb/illustrations/cash-controls-day-close.svg (1:1)
