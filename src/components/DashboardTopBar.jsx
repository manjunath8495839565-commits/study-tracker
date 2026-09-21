import React from "react";
import { ArrowLeft } from "lucide-react";

export const DashboardTopBar = ({ onBackToWelcome }) => {
  return (
    <div className="bg-white border-b border-brown-200/80 py-2.5 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center">
        <button
          onClick={onBackToWelcome}
          className="px-3.5 py-1.5 bg-brown-100 hover:bg-brown-200 text-brown-950 border border-brown-300 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-2xs group"
        >
          <ArrowLeft className="w-4 h-4 text-brown-800 group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Welcome Screen</span>
        </button>
      </div>
    </div>
  );
};
