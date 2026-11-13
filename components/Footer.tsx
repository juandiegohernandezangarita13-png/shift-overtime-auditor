import React from "react";
import { Scale, ShieldCheck, Lock, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 py-10 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-200">
                Shift & Overtime Wage Auditor (2026 Edition)
              </div>
              <div className="text-[11px] text-slate-500">
                National Wage Accreditation & Labor Compliance Archive Protocol
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <Lock className="w-3.5 h-3.5" /> 100% Client-Side Privacy
            </span>
            <span>•</span>
            <span>FLSA § 207 Calibrated</span>
            <span>•</span>
            <span>WTR 1998 / EU 2003/88 Compliant</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div>
            © 2026 Shift & Overtime Wage Auditor. All rights reserved. Zero-friction computational utility.
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://www.dol.gov/agencies/whd/overtime"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 flex items-center gap-1"
            >
              <span>U.S. Dept of Labor (FLSA)</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a
              href="https://www.gov.uk/overtime-your-rights"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 flex items-center gap-1"
            >
              <span>UK Overtime Rights</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
