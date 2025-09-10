---
id: bank-rules-auto-categorize
slug: bank-rules-to-auto-categorize-common-transactions
title: Bank rules to auto-categorize common transactions (and when not to)
summary: Learn how to create precise bank rules that speed up reconciliation without breaking VAT and audit trails. Includes GYD examples and a monthly control checklist.
level: Beginner
audience: [Owner, Accountant, Clerk]
format: Guide
category_id: banking
tags: [bank, rules, reconciliation, automation, VAT, GYD]
jurisdiction: [Guyana]
last_reviewed: '2025-09-09'
sources:
  - title: Xero — About bank rules
    url: https://central.xero.com/s/article/About-bank-rules
    publisher: Xero Central
    date_accessed: '2025-09-09'
  - title: QuickBooks — Set up bank rules
    url: https://quickbooks.intuit.com/learn-support/en-uk/help-article/banking/set-bank-rules-categorise-online-banking-online/L0mjJl0nD_GB_en_GB
    publisher: Intuit
    date_accessed: '2025-09-09'
kb_snippets:
  - question: What are bank rules?
    answer: Bank rules automatically suggest or post categories, tax codes, and payees for repeating or similar bank-feed lines (for example, mobile top-ups or fuel). Used well, they reduce manual data entry while keeping a clear audit trail.
    type: definition
  - question: How do I add a bank rule in heroBooks?
    answer: Go to **Banking → Imports**, filter a repeating line, then create a rule with conditions (payee text, reference, amount range). Choose the **account**, **VAT code** (14%, zero-rated, exempt), and whether to auto-post or just suggest. Test on recent lines before enabling auto-post.
    type: howto
  - question: What are common mistakes with bank rules?
    answer: Over-broad text matches, missing VAT codes, ignoring split transactions (fuel + shop), and never reviewing exceptions. Use “suggest only” first; sample-test 10–20 lines monthly.
    type: faq
---

## Why bank rules matter
Bank rules turn repeat bank-feed lines into consistent ledger entries, saving time and improving period-end cut-off. They are most effective for **recurring** or **predictable** payments (utilities, mobile top-ups, bank charges) and **small cash-like receipts** (till deposits). Start with suggestions, then graduate to auto-post for truly stable patterns.

## Designing precise rules (GYD examples)
1. **Identify a stable pattern**: e.g., statements with “GTT TOPUP” in the description and amounts between **G$1,000–G$10,000**.  
2. **Conditions**: `contains: "GTT"` and `contains: "TOPUP"`; amount **between** `1000–10000`.  
3. **Outcome**: Account **“Phone & Internet”**, VAT **Exempt** (telecom top-ups) or as per invoice; payee **GTT**; **suggest only** for the first month.  
4. **Fuel**: Description contains “SHELL” or “GUYOIL”; amount **2,000–30,000** → Account **“Fuel”**, VAT **14%** (if documented), payee set; **no auto-post** if receipts often include shop items (split needed).  
5. **Bank fees**: Contains “SERVICE CHARGE” → Account **“Bank Fees”**, VAT **N/A**; safe to **auto-post** after a 2-week sample test.

> Tip: Prefer two or more conditions (e.g., text + amount range). Avoid rules that match a single common word (“market”, “food”). Keep net-of-VAT vs VAT-inclusive consistent with supplier documentation.

## Month-end control checklist
- Review an exceptions view for “no rule matched.”  
- Spot-check **10–20** auto-posted lines back to source statements/receipts.  
- Re-verify **VAT code** and **account** on the largest 10% of values.  
- Confirm your **bank balance** agrees after reconciliation and that no rule masked a timing difference (e.g., card holds).  

## Worked mini-example (GYD)
**Scenario:** 12 “MMG SERVICE CHARGE” lines, each **G$250** monthly.  
**Rule:** Text contains **“MMG”** + **“SERVICE CHARGE”**, exact amount `= 250`. Outcome **Bank Fees**, VAT **N/A**, **auto-post** ON.  
**Result:** 12 lines posted automatically; controller samples 2 lines, ties to bank e-statement.

## When not to auto-post
- Transactions needing **splits** (fuel + groceries).  
- Items where **VAT treatment varies** (e.g., mixed supplies depending on the receipt).  
- Cases with frequent **chargebacks** or **reversals**.

## Illustration
> Figure: see /public/kb/illustrations/bank-rules.svg (1:1)

