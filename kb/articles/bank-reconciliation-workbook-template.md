---
id: bank-reconciliation-workbook-template
slug: bank-reconciliation-workbook-template
title: Bank reconciliation — workbook template (CSV + workflow)
summary: "Download a CSV you can use to mark timing vs error items and auto-foot to adjusted bank/book. Includes column layout and usage tips."
level: Beginner
audience: [Owner, Clerk, Accountant]
format: Guide
category_id: banking-reconciliation
tags: [bank reconciliation, CSV, template, timing differences, errors]
jurisdiction: [Guyana]
last_reviewed: '2025-09-10'
sources:
  - title: Bank reconciliations — timing items vs errors (guidance)
    url: https://sao.wa.gov/bars-annual-filing/bars-gaap-manual/accounting/accounting-principles-and-internal-control/bank-reconciliations
    publisher: Office of the Washington State Auditor
    date_accessed: '2025-09-10'
  - title: Bank reconciliation — step-by-step (concepts & examples)
    url: https://www.accountingcoach.com/bank-reconciliation/explanation
    publisher: AccountingCoach
    date_accessed: '2025-09-10'
kb_snippets:
  - question: Where is the bank rec CSV download?
    answer: "Download from /kb/templates/bank-reconciliation-template.csv. This page explains how to use it. For error classification and journals, see the deep dive."
    type: howto
---

This page provides a workbook template. For timing vs errors classification and journals, see `kb/articles/bank-reconciliation-timing-vs-errors-deep-dive.md`.

## Columns (copy into Sheets/Excel if you prefer)
`date, description, amount, side (bank/book), type (timing/error), subtype (deposit-in-transit|outstanding-cheque|bank-fee|interest|nsf|duplicate|miskey|other), cleared_date, notes`

**Rules**  
– Mark **timing** for deposits in transit/outstanding cheques; **error** for miskeys/duplicates.  
– Add separate lines for **bank fees/interest** (these will drive your journals).  
– Adjusted bank = statement + deposits in transit − outstanding cheques.  
– Adjusted book = ledger + interest − fees ± error corrections.  
– **Adjusted bank must equal adjusted book**.

**Download the CSV:** `/kb/templates/bank-reconciliation-template.csv`

## See also
– Deep dive (timing vs errors & journals): `kb/articles/bank-reconciliation-timing-vs-errors-deep-dive.md`

## Illustration
Square SVG: `/public/kb/illustrations/bank-rec-workbook.svg` (alt: "CSV columns mapped to adjusted bank/book").

