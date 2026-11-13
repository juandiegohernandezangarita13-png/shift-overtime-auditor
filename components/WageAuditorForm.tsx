import React from "react";
import {
  DollarSign,
  Clock,
  Moon,
  Calendar,
  Briefcase,
  AlertCircle,
  HelpCircle,
  Zap,
} from "lucide-react";
import {
  WageCalculatorInputs,
  CURRENCY_SYMBOLS,
  PayPeriod,
} from "@/lib/wageCalculator";

interface WageAuditorFormProps {
  inputs: WageCalculatorInputs;
  onChange: (updates: Partial<WageCalculatorInputs>) => void;
  onApplyPreset: (presetName: string) => void;
}

export const WageAuditorForm: React.FC<WageAuditorFormProps> = ({
  inputs,
  onChange,
  onApplyPreset,
}) => {
  const symbol = CURRENCY_SYMBOLS[inputs.currency] || "$";

  const handleNumberInput = (field: keyof WageCalculatorInputs, value: string) => {
    const parsed = value === "" ? 0 : parseFloat(value);
    onChange({ [field]: isNaN(parsed) ? 0 : parsed });
  };

  return (
    <div className="space-y-6">
      {/* Quick Scenario Presets */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Quick Industry Presets:</span>
          </div>
          <span className="text-[11px] text-slate-500">Click to autofill sample shift profiles</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => onApplyPreset("standard")}
            className="px-2.5 py-2 text-left bg-slate-800/80 hover:bg-slate-750 hover:border-emerald-500/50 border border-slate-700/60 rounded-xl transition text-xs group"
          >
            <div className="font-semibold text-slate-200 group-hover:text-emerald-400">Standard 40h</div>
            <div className="text-[10px] text-slate-400">Baseline 160h/mo</div>
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset("overtime_heavy")}
            className="px-2.5 py-2 text-left bg-slate-800/80 hover:bg-slate-750 hover:border-emerald-500/50 border border-slate-700/60 rounded-xl transition text-xs group"
          >
            <div className="font-semibold text-slate-200 group-hover:text-emerald-400">High Overtime</div>
            <div className="text-[10px] text-slate-400">210h/mo + Overtime</div>
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset("healthcare_night")}
            className="px-2.5 py-2 text-left bg-slate-800/80 hover:bg-slate-750 hover:border-emerald-500/50 border border-slate-700/60 rounded-xl transition text-xs group"
          >
            <div className="font-semibold text-slate-200 group-hover:text-emerald-400">Night Shift</div>
            <div className="text-[10px] text-slate-400">Healthcare / Logistics</div>
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset("hospitality_weekend")}
            className="px-2.5 py-2 text-left bg-slate-800/80 hover:bg-slate-750 hover:border-emerald-500/50 border border-slate-700/60 rounded-xl transition text-xs group"
          >
            <div className="font-semibold text-slate-200 group-hover:text-emerald-400">Weekend & PTO</div>
            <div className="text-[10px] text-slate-400">Holidays + 5 days PTO</div>
          </button>
        </div>
      </div>

      {/* SECTION A: BASE PAY & CONTRACT SETUP */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Section A
            </div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              Base Pay & Contract Setup
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Step 1 of 3</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Base Hourly Rate */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Base Hourly Rate ({symbol}/hr)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">
                {symbol}
              </span>
              <input
                type="number"
                min="0"
                step="0.25"
                value={inputs.baseRate || ""}
                onChange={(e) => handleNumberInput("baseRate", e.target.value)}
                placeholder="18.50"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Your contract base wage before overtime or bonuses</p>
          </div>

          {/* Contracted Weekly Hours */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Standard Contracted Weekly Hours
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1"
                value={inputs.regularHours || ""}
                onChange={(e) => handleNumberInput("regularHours", e.target.value)}
                placeholder="40"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-medium">
                hrs/wk
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Default 40 hrs. Hours beyond this qualify for 1.5x OT</p>
          </div>

          {/* Pay Period Frequency */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Audit Pay Period
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 border border-slate-700 p-1 rounded-xl">
              {(["monthly", "biweekly", "weekly"] as PayPeriod[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onChange({ payPeriod: p })}
                  className={`py-1 text-xs font-semibold rounded-lg capitalize transition ${
                    inputs.payPeriod === p
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {p === "biweekly" ? "Bi-Weekly" : p}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {inputs.payPeriod === "monthly"
                ? "Standard calendar month (~4.33 weeks = 173.3h base)"
                : inputs.payPeriod === "biweekly"
                ? "Two consecutive weeks (80h base)"
                : "Single calendar week (40h base)"}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION B: OVERTIME, NIGHT & HOLIDAY HOURS LOG */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500"></div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
              Section B
            </div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              Hours Logged: Overtime, Night & Weekend Shifts
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Step 2 of 3</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Actual Hours Worked */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-200">
                Total Actual Hours
              </label>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                1.5x OT Trigger
              </span>
            </div>
            <div className="relative mt-1">
              <input
                type="number"
                min="0"
                step="0.5"
                value={inputs.actualHoursWorked || ""}
                onChange={(e) => handleNumberInput("actualHoursWorked", e.target.value)}
                placeholder="190"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-teal-500 transition"
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs">hrs</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">
              Total hours clocked in this {inputs.payPeriod}
            </p>
          </div>

          {/* Night Shift Hours (10 PM - 6 AM) */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                Night Shift Hours
              </label>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                +20% Premium
              </span>
            </div>
            <div className="relative mt-1">
              <input
                type="number"
                min="0"
                step="0.5"
                value={inputs.nightHours || ""}
                onChange={(e) => handleNumberInput("nightHours", e.target.value)}
                placeholder="32"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-indigo-500 transition"
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs">hrs</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">
              Logged between 10:00 PM and 6:00 AM
            </p>
          </div>

          {/* Weekend / Statutory Holiday Hours */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Weekend / Holidays
              </label>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                +50% Premium
              </span>
            </div>
            <div className="relative mt-1">
              <input
                type="number"
                min="0"
                step="0.5"
                value={inputs.weekendHours || ""}
                onChange={(e) => handleNumberInput("weekendHours", e.target.value)}
                placeholder="16"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-500 transition"
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs">hrs</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">
              Saturday, Sunday or official public holidays
            </p>
          </div>

          {/* Accrued Vacation / PTO Settlement Days */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-200">
                Unused PTO Days
              </label>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                8 hrs @ Base
              </span>
            </div>
            <div className="relative mt-1">
              <input
                type="number"
                min="0"
                step="0.5"
                value={inputs.vacationDaysLeft || ""}
                onChange={(e) => handleNumberInput("vacationDaysLeft", e.target.value)}
                placeholder="4"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-cyan-500 transition"
              />
              <span className="absolute right-3 top-2.5 text-slate-400 text-xs">days</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">
              Accrued vacation balance owed upon settlement
            </p>
          </div>
        </div>
      </section>

      {/* SECTION C: FINAL PAYCHECK COMPARISON (OPTIONAL PAY STUB) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Section C • Reconciliation
            </div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              Final Paycheck Comparison (Optional: What Did Your Pay Stub Say?)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Step 3 of 3</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Gross or Net Paycheck Actually Disbursed by Employer
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">
                {symbol}
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={inputs.actualCheck !== undefined ? inputs.actualCheck || "" : ""}
                onChange={(e) => handleNumberInput("actualCheck", e.target.value)}
                placeholder="e.g. 2850.00"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Check your pay stub / direct deposit slip. Entering this triggers real-time discrepancy detection.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              Why compare?
            </div>
            According to the Department of Labor, over 70% of audited wage violations stem from miscalculated overtime multipliers and omitted nocturnal differentials.
          </div>
        </div>
      </section>
    </div>
  );
};
