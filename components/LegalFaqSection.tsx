import React, { useState } from "react";
import { ChevronDown, ChevronUp, Scale, Shield, HelpCircle, BookOpen } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  statute: string;
}

const faqs: FAQItem[] = [
  {
    question: "How is the statutory 1.5x overtime multiplier calculated under FLSA § 7(a)?",
    answer:
      "Under the federal Fair Labor Standards Act (FLSA), non-exempt employees must receive overtime pay for all hours worked exceeding 40 hours in a 7-day workweek at a rate of no less than one and one-half times (1.5x) their 'regular rate' of pay. The regular rate is determined by dividing total non-overtime earnings by the total number of hours worked.",
    statute: "FLSA 29 U.S.C. § 207(a)(1) • 29 C.F.R. Part 778",
  },
  {
    question: "When does night shift differential (10:00 PM – 6:00 AM) apply?",
    answer:
      "A night shift differential compensates workers for non-standard nocturnal hours, commonly between 10:00 PM and 6:00 AM. In many industries, union agreements, and state/EU labor standards, this differential adds +10% to +25% (calibrated standard +20%) on top of the base hourly wage. Crucially, nocturnal premiums must be factored into the employee's regular rate when computing overtime multipliers.",
    statute: "29 C.F.R. § 778.207 • EU Working Time Directive 2003/88/EC Art. 8",
  },
  {
    question: "What are statutory liquidated damages for wage underpayment?",
    answer:
      "Under 29 U.S.C. § 216(b), an employer who fails to disburse required overtime or minimum wage compensation is strictly liable not only for the unpaid differential, but also for an equal amount in mandatory liquidated damages (effectively double or 200% restitution), plus reasonable attorney fees and court costs.",
    statute: "29 U.S.C. § 216(b) Liquidated Damages Recovery",
  },
  {
    question: "How does unused accrued PTO / Vacation settlement work?",
    answer:
      "Accrued paid time off (PTO) or vacation days represent earned deferred compensation. Upon separation or audit reconciliation, earned vacation days are valued at 8 standard working hours multiplied by the contracted base hourly rate. In multiple jurisdictions, employer 'use-it-or-lose-it' policies are legally invalid.",
    statute: "State Labor Codes & ERA 1996 Regulation 13-16",
  },
  {
    question: "Can an employer retaliate if I submit this wage audit statement?",
    answer:
      "No. Section 15(a)(3) of the FLSA makes it explicitly illegal for any employer to discharge, demote, suspend, or discriminate against an employee who has filed a complaint, initiated an inquiry, or instituted any proceeding related to fair wage compensation. Retaliation damages frequently exceed the underlying wage claim.",
    statute: "FLSA 29 U.S.C. § 215(a)(3) Anti-Retaliation Protection",
  },
];

export const LegalFaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mt-8">
      <div className="flex items-center space-x-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Labor Compliance Reference
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Statutory Overtime, Shift Differential & Wage Rights Guide (2026)
          </h3>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-6 max-w-3xl leading-relaxed">
        Understanding your rights under federal and international fair labor standards. This reference explains how standard hours, overtime multipliers, and nocturnal premiums are legally mandated and verified.
      </p>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-slate-800 rounded-xl bg-slate-950/60 overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-4 text-left flex items-center justify-between space-x-3 hover:bg-slate-800/40 transition"
              >
                <div className="flex items-center space-x-2.5">
                  <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">
                    {faq.question}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 bg-slate-900/40 space-y-2">
                  <p>{faq.answer}</p>
                  <div className="inline-block px-2.5 py-1 rounded bg-slate-800 text-[10px] font-mono text-emerald-400 border border-slate-700">
                    Citation: {faq.statute}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legal Disclaimer */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-400">Institutional Notice & Audit Disclaimer:</strong> This application provides automated computational auditing based on standard mathematical parameters of the Fair Labor Standards Act (FLSA), UK Working Time Regulations, and EU Directive 2003/88/EC. Results are intended for personal reconciliation and dispute documentation. While calibrated to standard statutory formulas, specific collective bargaining agreements (CBAs) or local municipal ordinances may provide superior wage protections.
        </div>
      </div>
    </section>
  );
};
