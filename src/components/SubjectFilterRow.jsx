import React from "react";
import { Filter } from "lucide-react";

export const SubjectFilterRow = ({ syllabus, activeFilter, setActiveFilter }) => {
  return (
    <div className="bg-white/95 backdrop-blur border-b border-brown-200 py-3 sticky top-[73px] sm:top-[81px] z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        
        {/* Filter Label Icon */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-brown-700 uppercase tracking-wider shrink-0">
          <Filter className="w-4 h-4 text-brown-800" />
          <span className="hidden sm:inline">Filter:</span>
        </div>

        {/* Scrollable Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth w-full">
          
          {/* Option: All Subjects */}
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === "ALL"
                ? "bg-brown-800 text-white shadow-sm ring-2 ring-brown-700"
                : "bg-brown-100/80 text-brown-900 hover:bg-brown-200 hover:text-brown-950"
            }`}
          >
            All Subjects ({syllabus.length})
          </button>

          {/* Stream Quick Filters */}
          <button
            onClick={() => setActiveFilter("CS_ONLY")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === "CS_ONLY"
                ? "bg-brown-700 text-white shadow-sm ring-2 ring-brown-600"
                : "bg-brown-100/80 text-brown-900 hover:bg-brown-200 hover:text-brown-950"
            }`}
          >
            GATE CS (12)
          </button>

          <button
            onClick={() => setActiveFilter("DA_ONLY")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === "DA_ONLY"
                ? "bg-espresso-800 text-white shadow-sm ring-2 ring-espresso-700"
                : "bg-espresso-100/80 text-espresso-950 hover:bg-espresso-200"
            }`}
          >
            GATE DA (8)
          </button>

          <div className="h-4 w-px bg-brown-300 mx-1 shrink-0" />

          {/* Individual Subject Pills */}
          {syllabus.map((subject, idx) => {
            const isSelected = activeFilter === subject.id;
            const isCS = subject.stream === "CS";
            
            return (
              <button
                key={subject.id}
                onClick={() => setActiveFilter(subject.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-brown-800 text-white font-bold ring-2 ring-brown-700 shadow-sm"
                    : "bg-brown-50 text-brown-900 hover:bg-brown-100 border border-brown-200"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isCS ? "bg-brown-600" : "bg-espresso-600"}`} />
                <span>{idx + 1}. {subject.name.split("—")[0].trim()}</span>
              </button>
            );
          })}

        </div>

      </div>
    </div>
  );
};

