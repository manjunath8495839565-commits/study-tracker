import React, { useState, useEffect } from "react";
import { Target, CheckCircle2, HelpCircle, Clock, RotateCcw, Award, ArrowRight, Zap, Calendar, Sparkles } from "lucide-react";

export const WelcomeScreen = ({ stats, onStartPrep }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const formattedDate = now.toLocaleDateString([], { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="min-h-screen bg-[#faf6f0] text-brown-950 flex flex-col justify-between p-4 sm:p-6 lg:p-12 relative overflow-hidden font-sans">
      
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brown-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full space-y-8 my-auto relative z-10">
        
        {/* TOP BRANDING & LIVE CLOCK */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-brown-100 border border-brown-300 rounded-3xl shadow-sm mb-2">
            <Target className="w-12 h-12 text-brown-800 animate-pulse" />
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brown-950">
              GATE Command Center 2028
            </h1>
            <span className="bg-brown-800 text-brown-50 text-xs sm:text-sm font-extrabold px-3.5 py-1 rounded-full shadow-sm">
              CS + DA Dual Stream
            </span>
          </div>

          {/* Real-time Date & Time Bar */}
          <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-brown-700 flex-wrap pt-1 font-medium">
            <div className="flex items-center gap-2 bg-white border border-brown-300 text-brown-950 px-3.5 py-1.5 rounded-xl font-extrabold shadow-2xs">
              <Clock className="w-4 h-4 text-amber-700 animate-spin" style={{ animationDuration: "6s" }} />
              <span>{formattedTime}</span>
              <span className="text-brown-400">•</span>
              <span>{formattedDate}</span>
            </div>
            <span className="text-brown-400">•</span>
            <span className="bg-white border border-brown-300 px-3 py-1 rounded-xl text-brown-900 font-extrabold flex items-center gap-1.5 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-brown-800" />
              Target Exam: <strong className="text-brown-950 font-black">February 2028</strong>
            </span>
          </div>
        </div>

        {/* 4 STAT CARDS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: Topics Done */}
          <div className="bg-white border border-brown-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-brown-400 transition-all shadow-sm">
            <div className="flex items-center justify-between text-xs text-brown-700 font-bold">
              <span>Topics Done</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-brown-950 mt-3">
              {stats.topicsDone} <span className="text-xs text-brown-600 font-normal">/ {stats.totalTopics}</span>
            </div>
          </div>

          {/* Card 2: Qs Practiced */}
          <div className="bg-white border border-brown-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-brown-400 transition-all shadow-sm">
            <div className="flex items-center justify-between text-xs text-brown-700 font-bold">
              <span>Qs Practiced</span>
              <HelpCircle className="w-4 h-4 text-brown-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-brown-950 mt-3">
              {stats.totalQuestionsPracticed.toLocaleString()}
            </div>
          </div>

          {/* Card 3: Study Hours */}
          <div className="bg-white border border-brown-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-brown-400 transition-all shadow-sm">
            <div className="flex items-center justify-between text-xs text-brown-700 font-bold">
              <span>Study Hours</span>
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-brown-950 mt-3">
              {stats.totalStudyHours} <span className="text-xs text-brown-600 font-normal">hrs</span>
            </div>
          </div>

          {/* Card 4: Revisions */}
          <div className="bg-white border border-brown-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-brown-400 transition-all shadow-sm">
            <div className="flex items-center justify-between text-xs text-brown-700 font-bold">
              <span>Revisions</span>
              <RotateCcw className="w-4 h-4 text-brown-800" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-brown-950 mt-3">
              {stats.totalRevisions}
            </div>
          </div>

        </div>

        {/* OVERALL % PROGRESS BAR CARD */}
        <div className="bg-white border border-brown-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-brown-950">
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-700" />
              Syllabus Completion Progress
            </span>
            <span className="text-brown-950 font-black text-base sm:text-lg">
              {stats.overallPercentage}%
            </span>
          </div>
          
          <div className="w-full h-3.5 bg-brown-100 rounded-full overflow-hidden border border-brown-200 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brown-700 via-amber-600 to-emerald-600 transition-all duration-700 shadow-xs"
              style={{ width: `${stats.overallPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-[11px] text-brown-700 font-semibold">
            <span>0%</span>
            <span>GATE CS + DA 2028 Comprehensive Preparation Target</span>
            <span>100%</span>
          </div>
        </div>

        {/* PROMINENT FULL-WIDTH "START PREPARATION" BUTTON */}
        <div className="pt-2">
          <button
            onClick={onStartPrep}
            className="w-full bg-gradient-to-r from-brown-900 via-brown-800 to-espresso-950 hover:from-brown-950 hover:to-espresso-950 text-white text-base sm:text-lg font-black py-4 sm:py-5 px-8 rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer group ring-2 ring-brown-300/50"
          >
            <Zap className="w-6 h-6 text-amber-300 fill-amber-300 group-hover:scale-110 transition-transform" />
            <span>START PREPARATION</span>
            <ArrowRight className="w-6 h-6 text-amber-300 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

      </div>

      {/* FOOTER METADATA */}
      <div className="text-center text-xs text-brown-700 font-semibold pt-6">
        GATE Command Center 2028 • Dual Stream Exam Optimizer • All data auto-saved
      </div>

    </div>
  );
};
