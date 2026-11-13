/**
 * Wage, Shift & Overtime Calculation Engine (2026 Standard)
 * Supports US FLSA 1.5x Standard, UK Working Time Regulations, and EU Directives.
 */

export type Jurisdiction = "US" | "UK" | "EU";
export type PayPeriod = "monthly" | "biweekly" | "weekly";
export type CurrencyCode = "USD" | "GBP" | "EUR";

export interface WageCalculatorInputs {
  baseRate: number; // e.g. 18.50
  regularHours: number; // contracted weekly hours (e.g. 40)
  actualHoursWorked: number; // actual hours worked in the period
  nightHours: number; // hours between 10:00 PM and 6:00 AM (+20% standard differential)
  weekendHours: number; // weekend / statutory holiday hours (+50% standard premium)
  vacationDaysLeft: number; // accrued unused PTO days (8 hrs/day @ base rate)
  actualCheck?: number; // optional actual net or gross pay received from pay stub
  payPeriod: PayPeriod; // monthly, biweekly, weekly
  jurisdiction: Jurisdiction;
  currency: CurrencyCode;
  customOtMultiplier?: number; // default 1.5
  customNightPremiumRate?: number; // default 0.20 (+20%)
  customWeekendPremiumRate?: number; // default 0.50 (+50%)
}

export interface WageCalculationResults {
  // Period metrics
  periodWeeks: number;
  contractedPeriodHours: number;
  regularHoursPaid: number;
  overtimeHours: number;
  
  // Monetary Breakdown
  regularGrossPay: number;
  overtimePay: number;
  nightDifferentialPay: number;
  weekendPremiumPay: number;
  vacationSettlementPay: number;
  totalGrossDue: number;

  // Comparison & Discrepancy
  hasPaycheckInput: boolean;
  actualCheckReceived: number;
  discrepancyAmount: number; // positive = underpaid (owed money), negative = overpaid
  isUnderpaid: boolean;
  underpaidPercentage: number;

  // Effective hourly metrics
  effectiveHourlyRate: number;
  overtimeRate: number;
  nightDifferentialRate: number;
  weekendPremiumRate: number;

  // Regulatory context
  jurisdictionCode: Jurisdiction;
  currencySymbol: string;
  auditRuleSummary: string;
}

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
};

export const JURISDICTION_LABELS: Record<Jurisdiction, { name: string; standard: string; defaultCurrency: CurrencyCode }> = {
  US: {
    name: "United States (FLSA 1.5x)",
    standard: "Fair Labor Standards Act 29 U.S.C. § 207 • 40-hr threshold",
    defaultCurrency: "USD",
  },
  UK: {
    name: "United Kingdom (WTR / ERA)",
    standard: "Employment Rights Act 1996 & Working Time Regulations 1998",
    defaultCurrency: "GBP",
  },
  EU: {
    name: "European Union (WTD 2003/88/EC)",
    standard: "EU Working Time Directive 2003/88/EC & Collective Agreements",
    defaultCurrency: "EUR",
  },
};

/**
 * Calculates standard weeks per pay period.
 * Monthly = 52 weeks / 12 months = ~4.3333 weeks
 * Biweekly = 2 weeks
 * Weekly = 1 week
 */
export function getPeriodWeeks(period: PayPeriod): number {
  switch (period) {
    case "monthly":
      return 52 / 12; // ~4.3333
    case "biweekly":
      return 2;
    case "weekly":
      return 1;
    default:
      return 4.3333;
  }
}

/**
 * Core mathematical engine for wage and shift compensation audit
 */
export function calculateWages(inputs: WageCalculatorInputs): WageCalculationResults {
  const baseRate = Math.max(0, inputs.baseRate || 0);
  const contractedWeeklyHours = Math.max(0, inputs.regularHours || 0);
  const actualHours = Math.max(0, inputs.actualHoursWorked || 0);
  const nightHours = Math.max(0, inputs.nightHours || 0);
  const weekendHours = Math.max(0, inputs.weekendHours || 0);
  const vacationDays = Math.max(0, inputs.vacationDaysLeft || 0);
  const actualCheck = inputs.actualCheck !== undefined && !isNaN(inputs.actualCheck) ? Math.max(0, inputs.actualCheck) : 0;
  const hasPaycheck = inputs.actualCheck !== undefined && inputs.actualCheck !== null && !isNaN(inputs.actualCheck) && inputs.actualCheck > 0;

  const otMultiplier = inputs.customOtMultiplier ?? 1.5;
  const nightBonusRatio = inputs.customNightPremiumRate ?? 0.20; // +20%
  const weekendBonusRatio = inputs.customWeekendPremiumRate ?? 0.50; // +50%

  const periodWeeks = getPeriodWeeks(inputs.payPeriod);
  const contractedPeriodHours = contractedWeeklyHours * periodWeeks;

  // Regular hours vs overtime hours
  let regularHoursPaid = 0;
  let overtimeHours = 0;

  if (actualHours <= contractedPeriodHours) {
    regularHoursPaid = actualHours;
    overtimeHours = 0;
  } else {
    regularHoursPaid = contractedPeriodHours;
    overtimeHours = actualHours - contractedPeriodHours;
  }

  // 1. Regular gross pay
  const regularGrossPay = regularHoursPaid * baseRate;

  // 2. Overtime pay (1.5x base rate)
  const overtimeRate = baseRate * otMultiplier;
  const overtimePay = overtimeHours * overtimeRate;

  // 3. Night differential premium (+20% of base rate for logged night hours)
  const nightDifferentialRate = baseRate * nightBonusRatio;
  const nightDifferentialPay = nightHours * nightDifferentialRate;

  // 4. Weekend / Holiday premium (+50% of base rate for logged weekend/holiday hours)
  const weekendPremiumRate = baseRate * weekendBonusRatio;
  const weekendPremiumPay = weekendHours * weekendPremiumRate;

  // 5. Accrued unused vacation settlement (8 hours per day at standard base rate)
  const vacationSettlementPay = vacationDays * 8 * baseRate;

  // Total Estimated Gross Due
  const totalGrossDue =
    regularGrossPay +
    overtimePay +
    nightDifferentialPay +
    weekendPremiumPay +
    vacationSettlementPay;

  // Discrepancy analysis
  const discrepancyAmount = hasPaycheck ? Math.max(0, totalGrossDue - actualCheck) : 0;
  const isUnderpaid = hasPaycheck && discrepancyAmount > 0.5; // threshold of 50 cents to avoid floating point noise
  const underpaidPercentage = hasPaycheck && totalGrossDue > 0
    ? (discrepancyAmount / totalGrossDue) * 100
    : 0;

  // Effective overall hourly rate
  const effectiveHourlyRate = actualHours > 0 ? (totalGrossDue - vacationSettlementPay) / actualHours : baseRate;

  const currencySymbol = CURRENCY_SYMBOLS[inputs.currency] || "$";
  const jurisdictionInfo = JURISDICTION_LABELS[inputs.jurisdiction] || JURISDICTION_LABELS.US;

  return {
    periodWeeks,
    contractedPeriodHours: Number(contractedPeriodHours.toFixed(2)),
    regularHoursPaid: Number(regularHoursPaid.toFixed(2)),
    overtimeHours: Number(overtimeHours.toFixed(2)),

    regularGrossPay: Number(regularGrossPay.toFixed(2)),
    overtimePay: Number(overtimePay.toFixed(2)),
    nightDifferentialPay: Number(nightDifferentialPay.toFixed(2)),
    weekendPremiumPay: Number(weekendPremiumPay.toFixed(2)),
    vacationSettlementPay: Number(vacationSettlementPay.toFixed(2)),
    totalGrossDue: Number(totalGrossDue.toFixed(2)),

    hasPaycheckInput: hasPaycheck,
    actualCheckReceived: Number(actualCheck.toFixed(2)),
    discrepancyAmount: Number(discrepancyAmount.toFixed(2)),
    isUnderpaid,
    underpaidPercentage: Number(underpaidPercentage.toFixed(1)),

    effectiveHourlyRate: Number(effectiveHourlyRate.toFixed(2)),
    overtimeRate: Number(overtimeRate.toFixed(2)),
    nightDifferentialRate: Number(nightDifferentialRate.toFixed(2)),
    weekendPremiumRate: Number(weekendPremiumRate.toFixed(2)),

    jurisdictionCode: inputs.jurisdiction,
    currencySymbol,
    auditRuleSummary: jurisdictionInfo.standard,
  };
}

/**
 * Format currency with code or symbol
 */
export function formatCurrency(amount: number, currency: CurrencyCode = "USD"): string {
  const symbol = CURRENCY_SYMBOLS[currency] || "$";
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Generates an institutional audit unique ID
 */
export function generateAuditId(): string {
  const year = 2026;
  const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
  const sequence = Math.floor(1000 + Math.random() * 9000);
  return `WAGE-${year}-${randomHex}-${sequence}`;
}
