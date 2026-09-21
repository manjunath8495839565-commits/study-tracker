import React from "react";
import { AlertTriangle, RotateCcw, X } from "lucide-react";

export const ResetModal = ({
  isOpen,
  onClose,
  onConfirmReset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-rose-900/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <h3 className="text-lg font-bold text-white">
              Confirm Progress Reset
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-300">
          Are you sure you want to reset all study progress? This will revert all task checkboxes, questions logged, study hours, and accuracy scores back to zero.
        </p>

        <div className="bg-rose-950/30 border border-rose-800/40 p-3 rounded-xl text-xs text-rose-300 font-medium">
          💡 Tip: You can click "Export CSV" to download a backup of your current study progress before resetting!
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-rose-600/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yes, Reset Everything</span>
          </button>
        </div>

      </div>
    </div>
  );
};
