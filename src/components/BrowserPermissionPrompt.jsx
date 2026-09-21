import React, { useEffect } from "react";
import { Bell, X } from "lucide-react";
import { requestNotificationPermission } from "../utils/notifications";

export const BrowserPermissionPrompt = ({ isOpen, onClose, onPermissionChoice }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAllow = async () => {
    const permission = await requestNotificationPermission();
    localStorage.setItem("gate_notification_prompt_choice", permission === "granted" ? "allowed" : "blocked");
    if (onPermissionChoice) {
      onPermissionChoice(permission);
    }
    onClose();
  };

  const handleBlock = () => {
    localStorage.setItem("gate_notification_prompt_choice", "blocked");
    if (onPermissionChoice) {
      onPermissionChoice("blocked");
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-labelledby="notif-prompt-title"
      aria-describedby="notif-prompt-desc"
      className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-50 animate-in slide-in-from-top duration-300 max-w-sm w-[92vw] sm:w-full"
    >
      <div className="bg-white border border-brown-300 rounded-2xl p-4 shadow-2xl space-y-3 text-brown-950 relative overflow-hidden">
        
        <button
          onClick={handleBlock}
          aria-label="Close notification permission prompt"
          className="absolute top-3 right-3 p-1 text-brown-400 hover:text-brown-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="p-2.5 bg-amber-100 border border-amber-300 rounded-xl text-brown-900 shrink-0 mt-0.5">
            <Bell className="w-5 h-5 text-amber-800" />
          </div>

          <div className="space-y-1">
            <h3 id="notif-prompt-title" className="text-sm font-extrabold text-brown-950 tracking-tight">
              Enable 5:00 PM daily reminders?
            </h3>
            <p id="notif-prompt-desc" className="text-xs font-medium text-brown-700 leading-snug">
              Get a reminder if today's priority tasks aren't finished.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1 border-t border-brown-100">
          <button
            onClick={handleBlock}
            className="px-3.5 py-1.5 bg-brown-50 hover:bg-brown-100 text-brown-800 border border-brown-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Not now
          </button>

          <button
            onClick={handleAllow}
            className="px-4 py-1.5 bg-brown-900 hover:bg-brown-950 text-amber-100 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer active:scale-95"
          >
            Allow
          </button>
        </div>

      </div>
    </div>
  );
};
