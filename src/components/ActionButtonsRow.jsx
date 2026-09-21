import React from "react";
import { Save, Download, RotateCcw, Cloud, Check } from "lucide-react";

export const ActionButtonsRow = ({
  onSaveProgress,
  onExportCSV,
  onOpenResetModal,
  onOpenSheetsModal,
  saveSuccess
}) => {
  return (
    <div className="bg-white border-b border-brown-200/80 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Save Progress Button */}
          <button
            onClick={onSaveProgress}
            className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all shadow-sm cursor-pointer flex items-center gap-2 ${
              saveSuccess
                ? "bg-emerald-700 hover:bg-emerald-600 ring-2 ring-emerald-400"
                : "bg-brown-800 hover:bg-brown-900 ring-2 ring-brown-700/50 shadow-brown-950/10"
            }`}
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? "Saved to Browser!" : "Save Progress"}</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={onExportCSV}
            className="px-3.5 py-2 rounded-xl text-sm font-semibold bg-brown-50 text-brown-900 hover:bg-brown-100/90 hover:text-brown-950 transition-all cursor-pointer flex items-center gap-2 border border-brown-300/80 shadow-sm"
          >
            <Download className="w-4 h-4 text-brown-700" />
            <span>Export CSV</span>
          </button>

          {/* Google Sheets Sync Button */}
          <button
            onClick={onOpenSheetsModal}
            className="px-3.5 py-2 rounded-xl text-sm font-semibold bg-brown-50 text-brown-900 hover:bg-brown-100/90 hover:text-brown-950 transition-all cursor-pointer flex items-center gap-2 border border-brown-300/80 shadow-sm"
          >
            <Cloud className="w-4 h-4 text-brown-700" />
            <span>Google Sheets Sync</span>
          </button>

          {/* Reset All Button */}
          <button
            onClick={onOpenResetModal}
            className="px-3 py-2 rounded-xl text-sm font-semibold bg-rose-50 text-rose-800 hover:bg-rose-100 hover:text-rose-900 transition-all cursor-pointer flex items-center gap-1.5 border border-rose-200"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset All</span>
          </button>

        </div>

        {/* Right Side: Status Color Legend */}
        <div className="flex items-center gap-4 bg-brown-50/80 border border-brown-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-brown-800 self-start md:self-auto overflow-x-auto shadow-sm">
          <span className="text-brown-600 font-bold uppercase tracking-wider text-[11px]">Legend:</span>
          
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>Not Started</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>In Progress</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Done</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Need Revision</span>
          </div>
        </div>

      </div>
    </div>
  );
};

