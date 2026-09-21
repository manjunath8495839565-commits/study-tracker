import React, { useState, useEffect } from "react";
import { Smartphone, Download, Share, PlusSquare, CheckCircle2, X, Sparkles, ExternalLink } from "lucide-react";

export const InstallAppModal = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iosDevice);

    // Check if already running in standalone mode (PWA installed)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brown-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-brown-300 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-brown-950 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-brown-500 hover:text-brown-900 bg-brown-100/60 hover:bg-brown-200 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-brown-800 to-espresso-950 text-amber-200 rounded-2xl shadow-md">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-brown-950 flex items-center gap-1.5">
              GATE 2028 App
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
            </h3>
            <p className="text-xs font-semibold text-brown-600">
              No Play Store or App Store needed!
            </p>
          </div>
        </div>

        {isInstalled ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-extrabold text-emerald-950 text-base">App Already Installed!</h4>
            <p className="text-xs text-emerald-800 font-medium">
              GATE Command Center 2028 is installed on your device home screen. Open it directly from your app drawer!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Direct 1-Click Install Button (Android / Chrome) */}
            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-brown-800 via-espresso-900 to-brown-950 hover:from-brown-700 hover:to-brown-800 text-amber-200 font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Download className="w-5 h-5 text-amber-300" />
                <span>Download & Install App on Mobile</span>
              </button>
            )}

            {/* Step-by-Step Mobile Instructions */}
            <div className="bg-brown-50/80 border border-brown-200 rounded-2xl p-4 space-y-3">
              <h4 className="font-extrabold text-sm text-brown-900 flex items-center gap-2">
                <span>📱 How to install on your Mobile Device:</span>
              </h4>

              {isIOS ? (
                <div className="space-y-2.5 text-xs text-brown-800 font-semibold">
                  <div className="flex items-start gap-2.5">
                    <span className="bg-brown-800 text-amber-100 font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <span>Open this website link in <strong>Safari</strong> on your iPhone or iPad.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-brown-800 text-amber-100 font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <span className="flex items-center gap-1 flex-wrap">
                      Tap the <Share className="w-4 h-4 text-brown-800 inline" /> <strong>Share button</strong> in Safari's bottom toolbar.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-brown-800 text-amber-100 font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <span className="flex items-center gap-1 flex-wrap">
                      Scroll down & tap <PlusSquare className="w-4 h-4 text-brown-800 inline" /> <strong>"Add to Home Screen"</strong>.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs text-brown-800 font-semibold">
                  <div className="flex items-start gap-2.5">
                    <span className="bg-brown-800 text-amber-100 font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <span>Tap the <strong>3 dots (⋮)</strong> menu at top right of Chrome/Samsung browser.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-brown-800 text-amber-100 font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <span className="flex items-center gap-1 flex-wrap">
                      Tap <Download className="w-4 h-4 text-brown-800 inline" /> <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="bg-brown-800 text-amber-100 font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <span>Confirm install — the app will appear on your phone home screen!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Live Web Link Box for Mobile Sharing */}
            <div className="bg-white border border-brown-300 rounded-xl p-3 flex items-center justify-between text-xs gap-2 shadow-2xs">
              <div className="truncate font-mono text-brown-700">
                https://manjunath8495839565-commits.github.io/study-tracker/
              </div>
              <a
                href="https://manjunath8495839565-commits.github.io/study-tracker/"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-brown-100 hover:bg-brown-200 text-brown-900 rounded-lg font-bold flex items-center gap-1 text-[11px] shrink-0"
              >
                <span>Open Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-brown-200/60 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-brown-600 hover:text-brown-950 underline cursor-pointer"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
