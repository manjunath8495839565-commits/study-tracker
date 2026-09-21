import React from "react";
import { ArrowLeft, Smartphone, Settings } from "lucide-react";

export const DashboardTopBar = ({ onBackToWelcome, onOpenInstallModal, onOpenNotifSettings }) => {
  return (
    <div className="bg-white border-b border-brown-200/80 py-2.5 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <button
          onClick={onBackToWelcome}
          className="px-3.5 py-1.5 bg-brown-100 hover:bg-brown-200 text-brown-950 border border-brown-300 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-2xs group"
        >
          <ArrowLeft className="w-4 h-4 text-brown-800 group-hover:-translate-x-1 transition-transform" />
          <span>← Back to Welcome Screen</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenNotifSettings && (
            <button
              onClick={onOpenNotifSettings}
              className="px-3 py-1.5 bg-brown-50 hover:bg-brown-100 text-brown-800 border border-brown-300/80 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Configure 5:00 PM Daily Reminders"
            >
              <Settings className="w-4 h-4 text-brown-700" />
              <span className="hidden sm:inline">Reminder Settings</span>
            </button>
          )}

          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="px-3 py-1.5 bg-gradient-to-r from-brown-800 to-espresso-950 hover:from-brown-700 hover:to-brown-800 text-amber-200 border border-brown-700 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <Smartphone className="w-4 h-4 text-amber-300" />
              <span>📲 Install App</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
