import React from "react";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";

export const ToastNotification = ({ toast, onClose }) => {
  if (!toast) return null;

  const isWarning = toast.type === "warning";
  const isSuccess = toast.type === "success";

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-slide-up">
      <div
        className={`p-4 rounded-2xl border shadow-xl flex items-start gap-3 transition-all ${
          isWarning
            ? "bg-amber-900 text-amber-100 border-amber-700 ring-2 ring-amber-500/30"
            : isSuccess
            ? "bg-emerald-950 text-emerald-100 border-emerald-700 ring-2 ring-emerald-500/30"
            : "bg-brown-950 text-brown-100 border-brown-700 ring-2 ring-brown-500/30"
        }`}
      >
        {isWarning && <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />}
        {isSuccess && <CheckCircle className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />}
        {!isWarning && !isSuccess && <Info className="w-5 h-5 text-brown-300 shrink-0 mt-0.5" />}

        <div className="flex-1 text-xs font-semibold leading-relaxed">
          {toast.message}
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-brown-300 hover:text-white hover:bg-brown-800/60 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
