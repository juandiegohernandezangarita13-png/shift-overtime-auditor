import React, { useState } from "react";
import { Copy, Check, X, FileText, Send, Scale } from "lucide-react";
import { WageCalculatorInputs, WageCalculationResults, formatCurrency, generateAuditId } from "@/lib/wageCalculator";

interface DisputeLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: WageCalculatorInputs;
  results: WageCalculationResults;
}

export const DisputeLetterModal: React.FC<DisputeLetterModalProps> = ({
  isOpen,
  onClose,
  inputs,
  results,
}) => {
  const [copied, setCopied] = useState(false);
  const currency = inputs.currency;

  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const letterText = `DATE: ${currentDate}
TO: Human Resources / Payroll Accounting Department
FROM: [Your Full Legal Name]
RE: Formal Notice of Wage & Overtime Discrepancy — Payroll Period Ending ${currentDate}
AUDIT TRACKING IDENTIFIER: WAGE-2026-DISPUTE-VERIFIED

Dear Payroll Administrator,

I am submitting this formal written notice regarding an unremunerated wage variance identified upon reconciliation of my logged working hours against my recent compensation disbursement.

Pursuant to the Fair Labor Standards Act (FLSA, 29 U.S.C. § 201 et seq.) and applicable statutory wage provisions:

1. CONTRACTED BASE: Contracted weekly baseline of ${inputs.regularHours} hours at the standard agreed rate of ${formatCurrency(inputs.baseRate, currency)}/hour.
2. REGULAR HOURS COMPENSATED: ${results.regularHoursPaid} hours (= ${formatCurrency(results.regularGrossPay, currency)}).
3. STATUTORY OVERTIME (1.5x MULTIPLIER): ${results.overtimeHours} hours exceeding contractual threshold @ ${formatCurrency(results.overtimeRate, currency)}/hour (= ${formatCurrency(results.overtimePay, currency)}).
4. NIGHT SHIFT DIFFERENTIAL (10:00 PM – 6:00 AM): ${inputs.nightHours || 0} nocturnal hours logged with mandatory differential (= ${formatCurrency(results.nightDifferentialPay, currency)}).
5. WEEKEND / STATUTORY HOLIDAY PREMIUMS: ${inputs.weekendHours || 0} unsocial hours logged (= ${formatCurrency(results.weekendPremiumPay, currency)}).
6. ACCRUED PTO / VACATION SETTLEMENT: ${inputs.vacationDaysLeft || 0} days accrued (= ${formatCurrency(results.vacationSettlementPay, currency)}).

AUDITED GROSS ENTITLEMENT DUE: ${formatCurrency(results.totalGrossDue, currency)}
${
  results.hasPaycheckInput
    ? `PAYCHECK DISBURSED: ${formatCurrency(results.actualCheckReceived, currency)}
UNREMUNERATED DEFICIT REMAINING: ${formatCurrency(results.discrepancyAmount, currency)}`
    : `Please compare the above itemized entitlement directly against gross compensation disbursed for this period.`
}

Under federal and statutory fair wage guidelines, willful failure to remit overtime and premium compensation may subject an employer to liability for the unpaid balance, mandatory liquidated damages (up to 100% additional under 29 U.S.C. § 216(b)), and attorney fees.

I respectfully request that you review your electronic timekeeping badge logs and disburse the outstanding differential in the immediate upcoming payroll cycle, or furnish an itemized written explanation.

Thank you for your prompt attention to maintaining compliant payroll records.

Sincerely,

___________________________________________________
[Employee Signature]
[Employee ID / SSN Last 4]
[Contact Phone & Email]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Formal Employer Wage Demand Letter
              </h3>
              <p className="text-[11px] text-slate-400">
                Pre-calibrated with your exact hours, multipliers, and discrepancy amount
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Box */}
        <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-300 bg-slate-950/60 leading-relaxed whitespace-pre-wrap selection:bg-emerald-500 selection:text-white border-b border-slate-800">
          {letterText}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ready for email submission or printed certified delivery</span>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-lg shadow-emerald-600/30"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Letter Excerpt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
