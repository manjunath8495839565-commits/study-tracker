import React from "react";
import { Bell, Clock, X, Sparkles, CheckCircle2 } from "lucide-react";
import { requestNotificationPermission, getNotificationPermission } from "../utils/notifications";

export const AlarmModal = ({ isOpen, onClose, onPermissionGranted }) => {
  if (!isOpen) return null;

  const handleAllow = async () => {
    const permission = await requestNotificationPermission();
    if (permission === "granted" && onPermissionGranted) {
      onPermissionGranted();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-brown-300 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 text-brown-950 relative overflow-hidden text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-brown-500 hover:text-brown-900 bg-brown-100/60 hover:bg-brown-200 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex p-4 bg-amber-100 border border-amber-300 rounded-2xl shadow-sm text-amber-800">
          <Bell className="w-8 h-8 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-brown-950 flex items-center justify-center gap-1.5">
            <span>Enable 5:00 PM Daily Alarm?</span>
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
          </h3>
          <p className="text-xs font-medium text-brown-700 leading-relaxed px-2">
            Get an automatic lock-screen notification on your phone every evening at 5:00 PM if you have incomplete GATE focus tasks today.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleAllow}
            className="w-full py-3 px-4 bg-gradient-to-r from-brown-900 via-espresso-900 to-brown-950 hover:from-brown-800 hover:to-brown-900 text-amber-200 font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Bell className="w-4 h-4 text-amber-300" />
            <span>Allow 5 PM Alarm</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-brown-100 hover:bg-brown-200 text-brown-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Not Now / Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};
