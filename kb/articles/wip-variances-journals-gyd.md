---
id: wip-variances-journals-gyd
slug: wip-variances-journals-gyd
title: WIP variances — overhead, scrap and yield (G$ journals)
summary: "Post over/under-absorbed overhead, scrap, and yield variances cleanly in G$. Includes a variance log CSV and tips for closing WIP."
level: Intermediate
audience: [Accountant, Owner, Controller]
format: Guide
category_id: inventory
tags: [WIP, variances, overhead, scrap, yield]
jurisdiction: [Guyana]
last_reviewed: '2025-09-10'
sources:
  - title: "IFRS for SMEs — Section 13 (costs of conversion; normal vs abnormal losses)"
    url: https://www.ifrs.org/content/dam/ifrs/supporting-implementation/smes/module-13.pdf
    publisher: IFRS Foundation
    date_accessed: '2025-09-10'
kb_snippets:
  - question: How do I treat under-absorbed overhead?
    answer: "Dr COGS (or variance account) / Cr Overhead control; analyze for rate reset."
    type: howto
---

This page covers G$ variance postings. For policy/KPIs, see `kb/articles/wip-variances-policy-kpi-caribbean.md`.

## G$ journals
Under-absorbed OH: Dr COGS (Overhead variance) / Cr Overhead control.  
Over-absorbed OH: Dr Overhead control / Cr COGS (Overhead variance).  
Abnormal scrap: Dr COGS (Scrap variance) / Cr WIP.  
Yield variance: Dr/Cr Yield variance vs WIP as applicable.

## Variance log CSV
`period, job_id, variance_type, amount, root_cause, action, owner, closed_on`  
[Click here to download the variance log](/kb/templates/wip-variance-log.csv)

## See also
– Overhead absorption (GY) — [click here](/kb/wip-overhead-absorption-gyd)  
– Policy & KPIs (regional practices) — [click here](/kb/wip-variances-policy-kpi-caribbean)

## Illustration
![Over/under OH; scrap; yield variances](/kb/illustrations/wip-variances.svg)
