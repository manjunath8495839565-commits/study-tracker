import React, { useState, useEffect } from "react";
import { CheckCircle2, HelpCircle, Clock, RotateCcw, Award, Target, Calendar, ArrowLeft } from "lucide-react";

export const HeaderBar = ({ stats, onBackToWelcome }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const formattedDate = now.toLocaleDateString([], { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  return (
    <header className="header-bar bg-white text-brown-950 shadow-sm sticky top-0 z-40 border-b border-brown-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Left Side: Back Button, Title & Subtitle */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {onBackToWelcome && (
            <button
              onClick={onBackToWelcome}
              className="px-3 py-2 bg-brown-100 hover:bg-brown-200 text-brown-950 border border-brown-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs group"
              title="Return to Welcome Screen"
            >
              <ArrowLeft className="w-4 h-4 text-brown-800 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
          )}

          <div className="p-2.5 bg-brown-100/80 rounded-xl border border-brown-300/80 shadow-sm shrink-0">
            <Target className="w-7 h-7 text-brown-800 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-brown-950">
                GATE Command Center 2028
              </h1>
              <span className="bg-brown-800 text-brown-50 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                CS + DA Dual Stream
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-brown-700 font-medium mt-1 flex-wrap">
              {/* Real-time live date & time pill */}
              <div className="flex items-center gap-1.5 bg-amber-100/90 border border-amber-300 text-amber-950 px-2.5 py-0.5 rounded-lg text-xs font-extrabold shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-amber-800 animate-spin" style={{ animationDuration: "6s" }} />
                <span>{formattedTime}</span>
                <span className="text-amber-400">•</span>
                <span>{formattedDate}</span>
              </div>
              <span className="hidden sm:inline text-brown-400">•</span>
              <span className="text-brown-700 font-semibold">Target Exam: Feb 2028</span>
            </div>
          </div>
        </div>

        {/* Right Side: 5 Live Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
          
          {/* Pill 1: Topics Done */}
          <div className="stat-pill bg-brown-50/70 border border-brown-200 rounded-xl px-3 py-2 flex flex-col justify-center transition-all hover:border-brown-400 hover:shadow-sm">
            <div className="flex items-center gap-1.5 text-brown-700 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Topics Done</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-brown-950 mt-0.5">
              {stats.topicsDone} <span className="text-xs font-normal text-brown-600">/ {stats.totalTopics}</span>
            </div>
          </div>

          {/* Pill 2: Qs Practiced */}
          <div className="stat-pill bg-brown-50/70 border border-brown-200 rounded-xl px-3 py-2 flex flex-col justify-center transition-all hover:border-brown-400 hover:shadow-sm">
            <div className="flex items-center gap-1.5 text-brown-700 text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-brown-600" />
              <span>Qs Practiced</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-brown-950 mt-0.5">
              {stats.totalQuestionsPracticed.toLocaleString()}
            </div>
          </div>

          {/* Pill 3: Study Hours */}
          <div className="stat-pill bg-brown-50/70 border border-brown-200 rounded-xl px-3 py-2 flex flex-col justify-center transition-all hover:border-brown-400 hover:shadow-sm">
            <div className="flex items-center gap-1.5 text-brown-700 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Study Hours</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-brown-950 mt-0.5">
              {stats.totalStudyHours} <span className="text-xs font-normal text-brown-600">hrs</span>
            </div>
          </div>

          {/* Pill 4: Revisions */}
          <div className="stat-pill bg-brown-50/70 border border-brown-200 rounded-xl px-3 py-2 flex flex-col justify-center transition-all hover:border-brown-400 hover:shadow-sm">
            <div className="flex items-center gap-1.5 text-brown-700 text-xs font-semibold">
              <RotateCcw className="w-3.5 h-3.5 text-brown-700" />
              <span>Revisions</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-brown-950 mt-0.5">
              {stats.totalRevisions}
            </div>
          </div>

          {/* Pill 5: Overall % */}
          <div className="stat-pill col-span-2 sm:col-span-1 bg-gradient-to-br from-brown-800 to-brown-950 text-white border border-brown-700 rounded-xl px-3 py-2 flex flex-col justify-center transition-all hover:scale-105 shadow-md shadow-brown-900/10">
            <div className="flex items-center gap-1.5 text-brown-200 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Overall %</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-white mt-0.5">
              {stats.overallPercentage}%
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

