import React from "react";
import { ArrowLeft } from "lucide-react";

export const DashboardTopBar = ({ onBackToWelcome }) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 py-2.5 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center">
        <button
          onClick={onBackToWelcome}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs group"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Welcome Screen</span>
        </button>
      </div>
    </div>
  );
};
