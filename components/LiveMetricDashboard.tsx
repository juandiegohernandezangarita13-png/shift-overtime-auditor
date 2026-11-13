import React from "react";
import {
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileText,
  Clock,
  Moon,
  Calendar,
  Briefcase,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import {
  WageCalculatorInputs,
  WageCalculationResults,
  formatCurrency,
} from "@/lib/wageCalculator";

interface LiveMetricDashboardProps {
  inputs: WageCalculatorInputs;
  results: WageCalculationResults;
  onOpenLetterModal: () => void;
  onScrollToLeadCapture: () => void;
}

export const LiveMetricDashboard: React.FC<LiveMetricDashboardProps> = ({
  inputs,
  results,
  onOpenLetterModal,
  onScrollToLeadCapture,
}) => {
  const currency = inputs.currency;

  // Percentage shares for visual distribution bar
  const total = results.totalGrossDue > 0 ? results.totalGrossDue : 1;
  const regPct = Math.min(100, (results.regularGrossPay / total) * 100);
  const otPct = Math.min(100, (results.overtimePay / total) * 100);
  const nightPct = Math.min(100, (results.nightDifferentialPay / total) * 100);
  const weekendPct = Math.min(100, (results.weekendPremiumPay / total) * 100);
  const ptoPct = Math.min(100, (results.vacationSettlementPay / total) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Metric Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Real-Time Audit Computation
          </span>
          <h3 className="text-sm font-semibold text-slate-300 mt-0.5">
            Total Estimated Gross Compensation Due
          </h3>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1 text-emerald-400 flex items-baseline gap-2">
            <span>{formatCurrency(results.totalGrossDue, currency)}</span>
            <span className="text-xs font-semibold text-slate-400 font-mono">
              ({results.periodWeeks.toFixed(1)} wks • {inputs.payPeriod})
            </span>
          </div>
        </div>

        {/* Quick Audit Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onOpenLetterModal}
            className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-semibold transition shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Dispute Letter</span>
          </button>
          <button
            type="button"
            onClick={onScrollToLeadCapture}
            className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30"
          >
            <span>Download Audit PDF</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DISCREPANCY CALLOUT CARD */}
      {results.hasPaycheckInput && (
        <div className="mt-5">
          {results.isUnderpaid ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/60 to-amber-950/40 border border-red-500/50 shadow-lg">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-400 shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-red-400 flex items-center gap-1.5">
                      Potential Unpaid Balance Detected: {formatCurrency(results.discrepancyAmount, currency)}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold self-start">
                      {results.underpaidPercentage}% Underpaid
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Your disbursed paycheck of{" "}
                    <span className="font-bold text-white">
                      {formatCurrency(results.actualCheckReceived, currency)}
                    </span>{" "}
                    falls short of your audited statutory entitlement of{" "}
                    <span className="font-bold text-white">
                      {formatCurrency(results.totalGrossDue, currency)}
                    </span>
                    . Under FLSA 29 U.S.C. § 216(b), employees may be entitled to recover the unpaid balance plus 100% liquidated damages.
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onOpenLetterModal}
                      className="text-xs font-bold text-amber-300 hover:text-amber-200 underline flex items-center gap-1"
                    >
                      Copy Formal Wage Demand Notice →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-400">
                    Paycheck Reconciled In Full
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Your disbursed paycheck of{" "}
                    <span className="font-semibold text-white">
                      {formatCurrency(results.actualCheckReceived, currency)}
                    </span>{" "}
                    meets or exceeds your baseline audited gross entitlement (
                    {formatCurrency(results.totalGrossDue, currency)}).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Visual Composition Bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
          <span>Earnings Composition Breakdown</span>
          <span className="text-[11px] text-slate-500">Hover segments for details</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
          <div
            style={{ width: `${regPct}%` }}
            title={`Base Pay: ${formatCurrency(results.regularGrossPay, currency)} (${regPct.toFixed(1)}%)`}
            className="bg-emerald-500 h-full transition-all duration-500"
          ></div>
          <div
            style={{ width: `${otPct}%` }}
            title={`Overtime (1.5x): ${formatCurrency(results.overtimePay, currency)} (${otPct.toFixed(1)}%)`}
            className="bg-teal-400 h-full transition-all duration-500"
          ></div>
          <div
            style={{ width: `${nightPct}%` }}
            title={`Night Differential (+20%): ${formatCurrency(results.nightDifferentialPay, currency)} (${nightPct.toFixed(1)}%)`}
            className="bg-indigo-500 h-full transition-all duration-500"
          ></div>
          <div
            style={{ width: `${weekendPct}%` }}
            title={`Weekend Bonus (+50%): ${formatCurrency(results.weekendPremiumPay, currency)} (${weekendPct.toFixed(1)}%)`}
            className="bg-amber-400 h-full transition-all duration-500"
          ></div>
          <div
            style={{ width: `${ptoPct}%` }}
            title={`PTO Settlement: ${formatCurrency(results.vacationSettlementPay, currency)} (${ptoPct.toFixed(1)}%)`}
            className="bg-cyan-400 h-full transition-all duration-500"
          ></div>
        </div>
      </div>

      {/* 5-Item Grid Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5">
        {/* 1. Base Pay */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Regular Base Pay</span>
          </div>
          <div className="text-base font-bold text-white">
            {formatCurrency(results.regularGrossPay, currency)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {results.regularHoursPaid} hrs @ {formatCurrency(inputs.baseRate, currency)}
          </div>
        </div>

        {/* 2. Overtime Pay */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span>Overtime (1.5x)</span>
          </div>
          <div className="text-base font-bold text-teal-400">
            {formatCurrency(results.overtimePay, currency)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {results.overtimeHours} hrs @ {formatCurrency(results.overtimeRate, currency)}
          </div>
        </div>

        {/* 3. Night Differential */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>Night Premium (+20%)</span>
          </div>
          <div className="text-base font-bold text-indigo-400">
            {formatCurrency(results.nightDifferentialPay, currency)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {inputs.nightHours || 0} hrs differential
          </div>
        </div>

        {/* 4. Weekend / Holiday */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Weekend Bonus (+50%)</span>
          </div>
          <div className="text-base font-bold text-amber-400">
            {formatCurrency(results.weekendPremiumPay, currency)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {inputs.weekendHours || 0} hrs premium
          </div>
        </div>

        {/* 5. PTO Settlement */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 col-span-2 sm:col-span-1">
          <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>PTO Settlement</span>
          </div>
          <div className="text-base font-bold text-cyan-400">
            {formatCurrency(results.vacationSettlementPay, currency)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {inputs.vacationDaysLeft || 0} days accrued
          </div>
        </div>
      </div>
    </div>
  );
};
