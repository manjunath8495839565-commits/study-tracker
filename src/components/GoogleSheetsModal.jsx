import React, { useState } from "react";
import { X, Cloud, Copy, Check, ExternalLink, RefreshCw } from "lucide-react";
import { GOOGLE_APPS_SCRIPT_CODE, syncToGoogleSheets } from "../utils/googleSheetsSync";

export const GoogleSheetsModal = ({
  isOpen,
  onClose,
  googleSheetUrl,
  onSaveSheetUrl,
  fullState
}) => {
  const [urlInput, setUrlInput] = useState(googleSheetUrl || "");
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState("");

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleTestAndSave = async () => {
    if (!urlInput.trim()) {
      onSaveSheetUrl("");
      onClose();
      return;
    }

    setIsSyncing(true);
    setSyncStatusMsg("Connecting to Google Sheets Web App...");

    try {
      await syncToGoogleSheets(urlInput.trim(), fullState);
      onSaveSheetUrl(urlInput.trim());
      setSyncStatusMsg("✅ Successfully synced data to Google Sheets!");
      setTimeout(() => {
        setIsSyncing(false);
        onClose();
      }, 1500);
    } catch (err) {
      setIsSyncing(false);
      setSyncStatusMsg("❌ Sync failed. Please verify Web App URL and deployment access ('Anyone').");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Cloud className="w-6 h-6" />
            <h3 className="text-lg font-bold text-white">
              Google Sheets Live Sync Integration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step-by-Step Setup Guide */}
        <div className="space-y-3 text-xs text-slate-300">
          <p className="text-slate-200 font-semibold text-sm">
            Setup Google Sheets database in 3 easy steps:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-400">
            <li>Open a new Google Sheet & click <strong>Extensions → Apps Script</strong>.</li>
            <li>Copy the script below and replace all existing code in the editor.</li>
            <li>Click <strong>Deploy → New deployment</strong>, select <strong>Web App</strong>, set Access to <strong>"Anyone"</strong>, and click Deploy.</li>
          </ol>
        </div>

        {/* Script Code Block */}
        <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48">
          <button
            onClick={handleCopyCode}
            className="absolute top-2 right-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
          </button>
          <pre>{GOOGLE_APPS_SCRIPT_CODE.trim()}</pre>
        </div>

        {/* Web App URL Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-200">
            Paste Web App URL:
          </label>
          <input
            type="url"
            placeholder="https://script.google.com/macros/s/.../exec"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
          />
          {syncStatusMsg && (
            <p className="text-xs font-semibold mt-1 text-emerald-400">
              {syncStatusMsg}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleTestAndSave}
            disabled={isSyncing}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
          >
            {isSyncing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>{isSyncing ? "Syncing..." : "Save & Sync Now"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
