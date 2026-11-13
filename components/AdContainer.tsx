import React from "react";

interface AdContainerProps {
  slotId?: string;
  format?: "leaderboard" | "banner" | "rectangle";
  className?: string;
}

export const AdContainer: React.FC<AdContainerProps> = ({
  slotId = "default-slot",
  format = "leaderboard",
  className = "",
}) => {
  return (
    <aside
      aria-label="Sponsored Advertisement Slot"
      className={`ad-container w-full bg-slate-900/60 border border-dashed border-slate-700/80 py-3.5 px-4 text-center rounded-xl transition-all duration-200 hover:border-slate-600/90 ${className}`}
    >
      <div className="flex flex-col items-center justify-center space-y-1">
        <div className="flex items-center space-x-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
          <span>Advertisement • AdSense Compliant Placement ({format})</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Verified Legal & Labor Dispute Representation Services • FLSA Claim Assessment
        </div>
        <div className="text-[10px] text-slate-500">
          Slot ID: {slotId} • High-yield programmatic partner reservation
        </div>
      </div>
    </aside>
  );
};
