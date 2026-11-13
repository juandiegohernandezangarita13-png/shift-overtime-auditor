import React from "react";
import { ShieldCheck, Scale, Sparkles } from "lucide-react";
import { Jurisdiction, CurrencyCode, JURISDICTION_LABELS } from "@/lib/wageCalculator";

interface HeaderProps {
  jurisdiction: Jurisdiction;
  currency: CurrencyCode;
  onJurisdictionChange: (j: Jurisdiction) => void;
  onCurrencyChange: (c: CurrencyCode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  jurisdiction,
  currency,
  onJurisdictionChange,
  onCurrencyChange,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                2026 Edition Calibrated
              </span>
              <span className="text-[10px] font-medium text-slate-400 border-l border-slate-700 pl-2">
                100% Client-Side Privacy
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5">
              Official Wage, Shift & Overtime Audit Protocol (2026)
            </h1>
          </div>
        </div>

        {/* Global Selectors: Jurisdiction & Currency */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          {/* Jurisdiction Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700/80 rounded-lg p-1 text-xs">
            <span className="text-slate-400 pl-1.5 hidden sm:inline text-[11px] font-medium">Standard:</span>
            <button
              type="button"
              onClick={() => onJurisdictionChange("US")}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                jurisdiction === "US"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="United States FLSA 1.5x Overtime standard"
            >
              US (FLSA 1.5x)
            </button>
            <button
              type="button"
              onClick={() => onJurisdictionChange("UK")}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                jurisdiction === "UK"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="UK Employment Rights Act 1996"
            >
              UK (WTR)
            </button>
            <button
              type="button"
              onClick={() => onJurisdictionChange("EU")}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                jurisdiction === "EU"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="EU Working Time Directive 2003/88/EC"
            >
              EU (2003/88)
            </button>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700/80 rounded-lg p-1 text-xs">
            {(["USD", "GBP", "EUR"] as CurrencyCode[]).map((cur) => (
              <button
                key={cur}
                type="button"
                onClick={() => onCurrencyChange(cur)}
                className={`px-2 py-1 rounded font-bold transition-all ${
                  currency === cur
                    ? "bg-slate-700 text-emerald-400 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {cur === "USD" ? "$ USD" : cur === "GBP" ? "£ GBP" : "€ EUR"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
