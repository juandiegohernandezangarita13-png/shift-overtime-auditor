"use client";

import React, { useEffect, useRef } from "react";

interface AdContainerProps {
  slotId?: string;
  adSlot?: string; // Numeric Google AdSense data-ad-slot ID
  format?: "leaderboard" | "banner" | "rectangle";
  className?: string;
}

const ADSENSE_CLIENT = "ca-pub-1165320002460420";

export const AdContainer: React.FC<AdContainerProps> = ({
  slotId = "default-slot",
  adSlot,
  format = "leaderboard",
  className = "",
}) => {
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!adSlot || pushedRef.current) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
      pushedRef.current = true;
    } catch {
      // Ignore AdSense push errors during development or ad-blocker runs
    }
  }, [adSlot]);

  if (adSlot) {
    return (
      <aside
        aria-label="Sponsored Advertisement"
        className={`ad-container w-full bg-slate-900/40 border border-slate-800/80 py-2 px-3 text-center rounded-xl overflow-hidden ${className}`}
      >
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Advertisement
        </div>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </aside>
    );
  }

  return (
    <aside
      aria-label="Sponsored Advertisement Slot"
      className={`ad-container w-full bg-slate-900/60 border border-dashed border-slate-700/80 py-3.5 px-4 text-center rounded-xl transition-all duration-200 hover:border-slate-600/90 ${className}`}
    >
      <div className="flex flex-col items-center justify-center space-y-1">
        <div className="flex items-center space-x-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70"></span>
          <span>Advertisement • Google AdSense Connected ({format})</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70"></span>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Verified Legal & Labor Dispute Representation Services • FLSA Claim Assessment
        </div>
        <div className="text-[10px] text-slate-500">
          Publisher: {ADSENSE_CLIENT} • Slot: {slotId}
        </div>
      </div>
    </aside>
  );
};
