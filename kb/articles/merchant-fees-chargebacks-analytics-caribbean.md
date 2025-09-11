---
id: merchant-fees-chargebacks-analytics-caribbean
slug: merchant-fees-chargebacks-analytics-caribbean
title: Merchant fees & chargebacks — analytics & template (Caribbean)
summary: "CSV template and patterns to monitor fees, net effective rate, and chargeback reasons across gateways and locations."
level: Beginner
audience: [Owner, Accountant, Controller]
format: Guide
category_id: cash
tags: [merchant fees, chargebacks, analytics, CSV]
jurisdiction: [Caribbean]
last_reviewed: '2025-09-10'
sources:
  - title: "Card network dispute overviews"
    url: https://www.visa.com/support/consumer/dispute-a-charge.html
    publisher: Visa
    date_accessed: '2025-09-10'
kb_snippets:
  - question: Where is the CSV?
    answer: "Download /kb/templates/merchant-fees-import.csv and compute effective rate = fees/gross sales."
    type: howto
---

This page provides analytics. For G$ postings, see `kb/articles/merchant-fees-chargebacks-journals-gyd.md`.

## CSV columns
`date, gateway, gross_sales, fees, refunds, chargebacks, net_settlement, location, notes`

**Download:** `/kb/templates/merchant-fees-import.csv`

## Patterns
Spikes in effective rate; higher disputes on specific SKUs; timing gaps between refunds and settlements.

## See also
– G$ journals: `kb/articles/merchant-fees-chargebacks-journals-gyd.md`

