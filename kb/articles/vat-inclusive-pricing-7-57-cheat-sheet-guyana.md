---
id: vat-inclusive-pricing-7-57-cheat-sheet
slug: vat-inclusive-pricing-7-57-cheat-sheet-guyana
title: VAT-inclusive pricing — 7/57 cheat sheet (Guyana)
summary: "Quickly extract VAT from VAT-inclusive prices, handle rounding and multi-line invoices, and avoid common pitfalls. With G$ examples at 14%."
level: Beginner
audience: [Owner, Accountant, Clerk, Student]
format: Guide
category_id: vat
tags: [VAT, pricing, inclusive, 7/57, Guyana, invoices, GRA]
jurisdiction: [Guyana]
last_reviewed: '2025-09-09'
sources:
  - title: GRA — VAT Return Guide (14% rate; completing returns)
    url: https://www.gra.gov.gy/wp-content/uploads/2020/10/VAT-Return-Guide.pdf
    publisher: Guyana Revenue Authority
    date_accessed: '2025-09-09'
  - title: GRA — File your VAT return
    url: https://www.gra.gov.gy/business/tax-operations-and-services/value-add-tax-services/file-your-returns/
    publisher: Guyana Revenue Authority
    date_accessed: '2025-09-09'
kb_snippets:
  - question: "How do I extract VAT from a VAT-inclusive total?"
    answer: "Use gross × 14/114 (i.e., 7/57). Example: G$114,000 × 14/114 = G$14,000 VAT; net = G$100,000."
    type: howto
  - question: "How should I handle rounding?"
    answer: "Round consistently (line or invoice level per policy) and ensure VAT totals reconcile to return boxes."
    type: faq
---

## When to use inclusive math (context)
Use inclusive extraction when your selling prices are VAT‑inclusive (shelf/advertised prices include VAT) or when customers present invoices showing a single gross amount. If your system stores net prices and adds VAT, use the exclusive rate instead.

## Formula and quick example (GYD)
For VAT-inclusive prices at 14%:  
• VAT = Gross × 14/114 (same as 7/57).  
• Net = Gross − VAT.

Example: Gross **G$114,000** → VAT **G$14,000**; Net **G$100,000**.

## Multi-line invoices and discounts
– If you have multiple lines, calculate VAT per line then sum, or compute on the invoice total — just be consistent with rounding.  
– For VAT-inclusive discounts, apply the discount to gross first, then extract VAT using **14/114**.  
– For VAT-exclusive discounts, reduce the net first, then apply **14%**.

## Common pitfalls to avoid
– Mixing exclusive and inclusive math on the same invoice.  
– Rounding at both line and invoice level in ways that don’t tie.  
– Forgetting to show the VAT rate and the VAT amount on tax invoices.

## Illustration
Square SVG: `/public/kb/illustrations/vat-inclusive-7-57.svg` (alt: "Formula 14/114 = 7/57 with example split").
## See also
– Regional cheat sheet (r/(100+r)): `kb/articles/vat-inclusive-pricing-regional-cheat-sheet.md`
