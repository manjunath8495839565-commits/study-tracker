import React from "react";
import { Zap, BookOpen, Calculator, BarChart3, Layers, CheckCircle } from "lucide-react";

export const NavigationBar = ({
  activeTab,
  setActiveTab,
  pendingFocusCount = 0,
  weakTopicsCount = 0
}) => {
  const tabs = [
    {
      id: "PREP",
      label: "Start Prep & Priority",
      icon: Zap,
      badge: pendingFocusCount > 0 ? `${pendingFocusCount}` : null,
      badgeColor: "bg-amber-500 text-slate-950 font-extrabold"
    },
    {
      id: "SUBJECTS",
      label: "All Subjects",
      icon: BookOpen
    },
    {
      id: "TIMELINE",
      label: "Timeline & Velocity",
      icon: Calculator
    },
    {
      id: "ANALYTICS",
      label: "Weak Topics & Analytics",
      icon: BarChart3,
      badge: weakTopicsCount > 0 ? `${weakTopicsCount}` : null,
      badgeColor: "bg-rose-500 text-white font-extrabold"
    },
    {
      id: "FULL",
      label: "Full Overview",
      icon: Layers
    }
  ];

  return (
    <nav className="bg-white border-b border-brown-200/80 shadow-xs sticky top-[73px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center gap-1 sm:gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? "bg-brown-900 text-white shadow-sm ring-1 ring-brown-950"
                      : "bg-brown-50/60 text-brown-800 hover:bg-brown-100 hover:text-brown-950 border border-brown-200/80"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-300" : "text-brown-700"}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${tab.badgeColor}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <span className="hidden md:inline-block text-[11px] text-brown-600 font-semibold italic shrink-0">
            Click tabs to navigate sections
          </span>
        </div>
      </div>
    </nav>
  );
};
