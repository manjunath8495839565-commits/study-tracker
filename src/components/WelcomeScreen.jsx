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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-12 relative overflow-hidden font-sans">
      
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full space-y-8 my-auto relative z-10">
        
        {/* TOP BRANDING & LIVE CLOCK */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-amber-500/10 border border-amber-500/30 rounded-3xl shadow-xl shadow-amber-500/5 mb-2">
            <Target className="w-12 h-12 text-amber-400 animate-pulse" />
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              GATE Command Center 2028
            </h1>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-sm">
              CS + DA Dual Stream
            </span>
          </div>

          {/* Real-time Date & Time Bar */}
          <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-slate-400 flex-wrap pt-1">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-amber-300 px-3.5 py-1.5 rounded-xl font-extrabold shadow-inner">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
              <span>{formattedTime}</span>
              <span className="text-slate-600">•</span>
              <span>{formattedDate}</span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl text-slate-300 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Target Exam: <strong className="text-white font-bold">February 2028</strong>
            </span>
          </div>
        </div>

        {/* 4 STAT CARDS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: Topics Done */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>Topics Done</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-3">
              {stats.topicsDone} <span className="text-xs text-slate-500 font-normal">/ {stats.totalTopics}</span>
            </div>
          </div>

          {/* Card 2: Qs Practiced */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>Qs Practiced</span>
              <HelpCircle className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-3">
              {stats.totalQuestionsPracticed.toLocaleString()}
            </div>
          </div>

          {/* Card 3: Study Hours */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>Study Hours</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-3">
              {stats.totalStudyHours} <span className="text-xs text-slate-500 font-normal">hrs</span>
            </div>
          </div>

          {/* Card 4: Revisions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>Revisions</span>
              <RotateCcw className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-3">
              {stats.totalRevisions}
            </div>
          </div>

        </div>

        {/* OVERALL % PROGRESS BAR CARD */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-slate-300">
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Syllabus Completion Progress
            </span>
            <span className="text-amber-400 font-black text-base sm:text-lg">
              {stats.overallPercentage}%
            </span>
          </div>
          
          <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 transition-all duration-700 shadow-sm"
              style={{ width: `${stats.overallPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
            <span>0%</span>
            <span>GATE CS + DA 2028 Comprehensive Preparation Target</span>
            <span>100%</span>
          </div>
        </div>

        {/* PROMINENT FULL-WIDTH "START PREPARATION" BUTTON */}
        <div className="pt-2">
          <button
            onClick={onStartPrep}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-base sm:text-lg font-black py-4 sm:py-5 px-8 rounded-2xl shadow-2xl shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Zap className="w-6 h-6 text-slate-950 fill-slate-950 group-hover:scale-110 transition-transform" />
            <span>START PREPARATION</span>
            <ArrowRight className="w-6 h-6 text-slate-950 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

      </div>

      {/* FOOTER METADATA */}
      <div className="text-center text-xs text-slate-600 font-medium pt-6">
        GATE Command Center 2028 • Dual Stream Exam Optimizer • All data auto-saved
      </div>

    </div>
  );
};
