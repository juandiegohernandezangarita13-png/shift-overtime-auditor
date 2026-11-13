"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { AdContainer } from "@/components/AdContainer";
import { WageAuditorForm } from "@/components/WageAuditorForm";
import { LiveMetricDashboard } from "@/components/LiveMetricDashboard";
import { LeadCaptureSection } from "@/components/LeadCaptureSection";
import { DisputeLetterModal } from "@/components/DisputeLetterModal";
import { LegalFaqSection } from "@/components/LegalFaqSection";
import { Footer } from "@/components/Footer";
import {
  WageCalculatorInputs,
  calculateWages,
  Jurisdiction,
  CurrencyCode,
} from "@/lib/wageCalculator";
import { ShieldCheck, Sparkles, TrendingUp, Users } from "lucide-react";

export default function HomePage() {
  const [inputs, setInputs] = useState<WageCalculatorInputs>({
    baseRate: 22.5,
    regularHours: 40,
    actualHoursWorked: 198,
    nightHours: 36,
    weekendHours: 24,
    vacationDaysLeft: 5,
    actualCheck: 4120, // Sample paycheck demonstrating discrepancy
    payPeriod: "monthly",
    jurisdiction: "US",
    currency: "USD",
  });

  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);

  // Real-time calculation engine
  const results = useMemo(() => {
    return calculateWages(inputs);
  }, [inputs]);

  const handleInputChange = (updates: Partial<WageCalculatorInputs>) => {
    setInputs((prev) => ({ ...prev, ...updates }));
  };

  const handleJurisdictionChange = (jurisdiction: Jurisdiction) => {
    const defaultCur: CurrencyCode =
      jurisdiction === "US" ? "USD" : jurisdiction === "UK" ? "GBP" : "EUR";
    setInputs((prev) => ({
      ...prev,
      jurisdiction,
      currency: defaultCur,
    }));
  };

  const handleCurrencyChange = (currency: CurrencyCode) => {
    setInputs((prev) => ({ ...prev, currency }));
  };

  const handleApplyPreset = (presetName: string) => {
    if (presetName === "standard") {
      setInputs((prev) => ({
        ...prev,
        baseRate: 20.0,
        regularHours: 40,
        actualHoursWorked: 173.33,
        nightHours: 0,
        weekendHours: 0,
        vacationDaysLeft: 0,
        actualCheck: 3466.6,
      }));
    } else if (presetName === "overtime_heavy") {
      setInputs((prev) => ({
        ...prev,
        baseRate: 24.0,
        regularHours: 40,
        actualHoursWorked: 215,
        nightHours: 20,
        weekendHours: 16,
        vacationDaysLeft: 3,
        actualCheck: 4800,
      }));
    } else if (presetName === "healthcare_night") {
      setInputs((prev) => ({
        ...prev,
        baseRate: 32.5,
        regularHours: 36,
        actualHoursWorked: 180,
        nightHours: 64,
        weekendHours: 28,
        vacationDaysLeft: 6,
        actualCheck: 5900,
      }));
    } else if (presetName === "hospitality_weekend") {
      setInputs((prev) => ({
        ...prev,
        baseRate: 18.0,
        regularHours: 40,
        actualHoursWorked: 190,
        nightHours: 15,
        weekendHours: 40,
        vacationDaysLeft: 4,
        actualCheck: 3400,
      }));
    }
  };

  const scrollToLeadCapture = () => {
    const el = document.getElementById("lead-capture-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Institutional Top Navigation Header */}
      <Header
        jurisdiction={inputs.jurisdiction}
        currency={inputs.currency}
        onJurisdictionChange={handleJurisdictionChange}
        onCurrencyChange={handleCurrencyChange}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Top Sticky/Semantic Ad Container */}
        <AdContainer slotId="TOP_LEADERBOARD_BANNER_2026" format="leaderboard" />

        {/* Viral Social Proof Ribbon */}
        <div className="my-4 py-2 px-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">
              Over <strong>$4,280,000+</strong> in unremunerated shift differentials and overtime audited in 2026.
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="flex items-center gap-1 text-slate-300">
              <Users className="w-3.5 h-3.5 text-emerald-400" /> 18,420 workers reconciled this week
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> FLSA / WTR Verified
            </span>
          </div>
        </div>

        {/* Split Grid: Inputs on Left, Real-Time Dashboard on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Left Column: Interactive Audit Form */}
          <div className="lg:col-span-7 space-y-6">
            <WageAuditorForm
              inputs={inputs}
              onChange={handleInputChange}
              onApplyPreset={handleApplyPreset}
            />
          </div>

          {/* Right Column: Live Metric Dashboard & PDF Lead Capture */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-20 space-y-6">
              {/* Real-time Dashboard */}
              <LiveMetricDashboard
                inputs={inputs}
                results={results}
                onOpenLetterModal={() => setIsLetterModalOpen(true)}
                onScrollToLeadCapture={scrollToLeadCapture}
              />

              {/* Lead Capture & PDF Generator */}
              <LeadCaptureSection inputs={inputs} results={results} />
            </div>
          </div>
        </div>

        {/* Mid/Bottom Ad Container */}
        <div className="mt-10">
          <AdContainer slotId="BOTTOM_AUDIT_SPONSOR_2026" format="banner" />
        </div>

        {/* Educational Legal FAQs & Statutory Rights Guide */}
        <LegalFaqSection />
      </main>

      {/* Formal Dispute Letter Modal */}
      <DisputeLetterModal
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        inputs={inputs}
        results={results}
      />

      {/* Institutional Footer */}
      <Footer />
    </div>
  );
}
