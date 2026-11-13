# Shift & Overtime Wage Auditor (2026 Edition)
### Institutional Shift & Overtime Pay Reconciliation Protocol

A modern, viral, zero-friction client-side web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. It provides automated mathematical auditing for regular wages, FLSA 1.5x statutory overtime, night shift differentials (+20%), weekend/holiday premiums (+50%), and accrued unused PTO/vacation settlement.

---

## ⚡ Core Architecture & Engineering Highlights

- **100% Client-Side Execution:** Zero backend database or server runtime dependencies. Calculations, state updates, and PDF compilation run entirely inside the user's browser in sub-second time.
- **Privacy & Security First:** No sensitive wage or email data is sent to external servers. All personal compensation data remains strictly in browser memory.
- **Institutional 2-Page jsPDF Generator (`lib/generateWageReportPDF.ts`):**
  - **Page 1: Official Wage & Overtime Audit Credential:** Outer formal border, header of the *National Wage Accreditation & Labor Compliance Archive*, unique verification ID (`WAGE-2026-XXXX`), itemized compensation breakdown table, and certified digital compliance seal.
  - **Page 2: Statutory Discrepancy & Dispute Protocol:** Side-by-side entitlement comparison, federal restitution precedents (FLSA 29 U.S.C. § 216(b) liquidated double damages), pre-drafted formal employer dispute notice letter ready to deliver, and high-value legal representation case evaluation container.
- **Multi-Jurisdiction Calibrated:**
  - **United States:** Fair Labor Standards Act (FLSA) 1.5x overtime threshold beyond 40 contracted hours.
  - **United Kingdom:** Employment Rights Act 1996 & Working Time Regulations 1998.
  - **European Union:** Directive 2003/88/EC on Working Time.
- **Real-Time Discrepancy Alert:** Dynamic delta calculation detecting when an employer's pay stub is short (`underpaidAmount = estimatedGross - actualCheck`).
- **AdSense Compliant Layout:** Integrated semantic `<aside className="ad-container ...">` slots ready for programmatic monetization.

---

## 📐 Mathematical Formulation

1. **Contracted Base Threshold:**
   $$\text{Contracted Hours} = \text{weeklyHours} \times \text{periodWeeks}$$
   - Monthly: $52 / 12 \approx 4.3333$ weeks
   - Bi-Weekly: $2.0$ weeks
   - Weekly: $1.0$ week

2. **Regular Pay:**
   $$\text{Regular Hours} = \min(\text{actualHours}, \text{contractedHours})$$
   $$\text{Regular Gross} = \text{Regular Hours} \times \text{baseRate}$$

3. **Statutory Overtime (1.5x):**
   $$\text{Overtime Hours} = \max(0, \text{actualHours} - \text{contractedHours})$$
   $$\text{Overtime Pay} = \text{Overtime Hours} \times (\text{baseRate} \times 1.50)$$

4. **Night Shift Differential (10:00 PM – 6:00 AM):**
   $$\text{Night Differential Pay} = \text{nightHours} \times (\text{baseRate} \times 0.20)$$

5. **Weekend / Statutory Holiday Premium:**
   $$\text{Weekend Premium Pay} = \text{weekendHours} \times (\text{baseRate} \times 0.50)$$

6. **Accrued PTO / Vacation Settlement:**
   $$\text{Vacation Settlement Pay} = \text{vacationDays} \times 8 \times \text{baseRate}$$

7. **Total Audited Gross Entitlement:**
   $$\text{Total Gross Due} = \text{Regular Gross} + \text{Overtime Pay} + \text{Night Diff} + \text{Weekend Premium} + \text{PTO Settlement}$$

8. **Paycheck Discrepancy Detection:**
   $$\text{Underpaid Amount} = \max(0, \text{Total Gross Due} - \text{actualCheckReceived})$$

---

## 🚀 Deployment Instructions

### Vercel / Cloudflare Pages / Netlify

This repository is configured as a purely static or hybrid Next.js web application.

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Create optimized production build
npm run build

# Start production server
npm run start
```

For Cloudflare Pages or static export, Next.js can be deployed with zero backend adapters.
