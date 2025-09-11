---
id: bank-rec-timing-vs-errors-deep-dive
slug: bank-reconciliation-timing-vs-errors-deep-dive
title: Bank reconciliation — timing vs errors (how to fix)
summary: "Distinguish normal timing items (deposits in transit, outstanding cheques) from true errors (book or bank). Includes a step-by-step G$ workflow and what to journal."
level: Beginner
audience: [Owner, Clerk, Accountant, Student]
format: Guide
category_id: banking-reconciliation
tags: [bank reconciliation, timing differences, errors, deposit in transit, outstanding cheques]
jurisdiction: [Guyana]
last_reviewed: '2025-09-09'
sources:
  - title: WA State Auditor — Bank reconciliations (timing differences, reconciling items)
    url: https://sao.wa.gov/bars-annual-filing/bars-gaap-manual/accounting/accounting-principles-and-internal-control/bank-reconciliations
    publisher: Office of the Washington State Auditor
    date_accessed: '2025-09-09'
  - title: Lumen Learning — Bank reconciliation (book errors)
    url: https://content.one.lumenlearning.com/financialaccounting/chapter/bank-reconciliation/
    publisher: Lumen Learning
    date_accessed: '2025-09-09'
  - title: Numeric — Reconciling items overview (deposits in transit, outstanding checks)
    url: https://www.numeric.io/blog/reconciling-items
    publisher: Numeric
    date_accessed: '2025-09-09'
kb_snippets:
  - question: Where is the downloadable workbook?
    answer: "Use the bank rec workbook template page for the CSV download and workflow. This deep dive focuses on classification and journals."
    type: howto
  - question: What are timing differences?
    answer: "Legitimate reconciling items (e.g., deposits in transit, outstanding cheques) that clear shortly after period end; no journal needed unless they don’t clear timely."
    type: definition
---

This page focuses on classification and journals. For the CSV workbook, see `kb/articles/bank-reconciliation-workbook-template.md`.

## Classify first
**Timing items** (normal): deposits in transit, outstanding cheques, cut-off deposits, bank’s after-hours batches.  
**Errors** (need action): wrong amounts keyed, duplicate postings, missing receipts/cheques, bank fees/interest not recorded.

## G$ month-end workflow
1) Start with the **bank statement** balance.  
2) Add **deposits in transit**; subtract **outstanding cheques** → **adjusted bank**.  
3) Take the **ledger cash**; add bank interest; subtract bank charges/NSFs → **adjusted book**.  
4) **Adjusted bank = adjusted book**; if not, investigate the difference.

### Journals you’ll likely need
• Record **bank charges** / **interest**.  
• Fix **book errors** (reverse and repost).  
• Investigate old items: stale cheques or deposits that never clear → reissue or void and reverse.

## Controls that keep it clean
– Reconcile **monthly** (or weekly for busy tills).  
– Keep deposit slips; tie **cash-to-bank** daily.  
– Block back-dated postings after close; document adjustments.

## Illustration
Square SVG: `/public/kb/illustrations/bank-rec-timing-vs-errors.svg` (alt: “Two columns: timing vs errors, with reconciliation flow”).

## See also
– Workbook template (CSV + workflow): `kb/articles/bank-reconciliation-workbook-template.md`
– Regional troubleshooting: `kb/articles/bank-reconciliation-timing-vs-errors-caribbean.md`
