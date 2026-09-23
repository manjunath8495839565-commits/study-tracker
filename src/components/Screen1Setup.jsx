import React, { useState } from "react";
import { Target, Sparkles, ArrowRight, AlertTriangle, Calendar, Clock, CheckCircle2, User } from "lucide-react";

export const Screen1Setup = ({ initialName = "", initialTargetYear = "", onGeneratePlan, onOpenInstallModal }) => {
  const [name, setName] = useState(() => initialName || "");
  const [targetYear, setTargetYear] = useState(() => initialTargetYear || "");

  const isValidName = name.trim().length > 0;
  const isValidYear = !!targetYear;
  const isFormValid = isValidName && isValidYear;

  let totalDays = 0;
  let isCompressed = false;
  if (targetYear) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const examDate = new Date(parseInt(targetYear, 10), 1, 1, 0, 0, 0);
    totalDays = Math.max(1, Math.floor((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    isCompressed = totalDays < 60;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    onGeneratePlan(name.trim(), parseInt(targetYear, 10));
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] text-brown-950 flex flex-col justify-between p-4 sm:p-6 lg:p-12 relative overflow-hidden font-sans select-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brown-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto w-full space-y-8 my-auto relative z-10">
        <div className="text-center space-y-3">
          <div className="flex justify-center items-center gap-3">
            <div className="inline-flex p-4 bg-brown-100 border border-brown-300 rounded-3xl shadow-sm">
              <Target className="w-10 h-10 sm:w-12 sm:h-12 text-brown-800 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brown-950">
              GATE Command Center
            </h1>
            <span className="bg-brown-800 text-brown-50 text-xs sm:text-sm font-extrabold px-3 py-1 rounded-full shadow-sm">
              CS + DA Dual Stream
            </span>
          </div>

          <p className="text-xs sm:text-sm text-brown-700 font-semibold max-w-md mx-auto">
            Personalized Scheduling Engine • 132 Topics Weighted Allocation • Zero Mock Data
          </p>
        </div>

        <div className="bg-white border border-brown-200/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="user-name-input" className="block text-xs font-extrabold text-brown-900 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-brown-700" />
                <span>Your Name <span className="text-rose-600">*</span></span>
              </label>
              <input
                id="user-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name..."
                className="w-full bg-brown-50/70 border border-brown-300 focus:border-brown-800 rounded-2xl px-4 py-3.5 text-base font-extrabold text-brown-950 placeholder-brown-400 focus:outline-none focus:ring-2 focus:ring-brown-600/30 transition-all shadow-inner"
                autoComplete="off"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-brown-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brown-700" />
                <span>Select Target GATE Year <span className="text-rose-600">*</span></span>
              </label>

              <div className="grid grid-cols-3 gap-3">
                {[2028, 2029, 2030].map((year) => {
                  const isSelected = targetYear === year;
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => setTargetYear(year)}
                      className={`py-3.5 px-4 rounded-2xl border text-base font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? "bg-brown-900 border-brown-950 text-amber-200 shadow-md ring-2 ring-brown-400 scale-[1.02]"
                          : "bg-brown-50/60 border-brown-200 text-brown-900 hover:border-brown-400 hover:bg-brown-100/60"
                      }`}
                    >
                      <span>{year}</span>
                      <span className={`text-[10px] font-bold ${isSelected ? "text-amber-300" : "text-brown-600"}`}>
                        Feb 1, {year}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {targetYear && (
              <div className={`p-4 rounded-2xl border transition-all ${
                isCompressed
                  ? "bg-amber-50 border-amber-300 text-amber-950"
                  : "bg-brown-50 border-brown-200 text-brown-950"
              }`}>
                {isCompressed ? (
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wide">
                        Timeline Warning
                      </h4>
                      <p className="text-xs font-bold text-amber-950 mt-0.5">
                        Timeline too short for full syllabus — plan will be compressed
                      </p>
                      <p className="text-[11px] font-medium text-amber-800 mt-1">
                        Only {totalDays} days remaining until Feb 1, {targetYear}. Daily pace will automatically scale to fit all 132 topics.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs font-bold text-brown-900">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-700" />
                      Days until GATE {targetYear} Exam:
                    </span>
                    <span className="text-base font-black text-brown-950 bg-white border border-brown-300 px-3 py-1 rounded-xl shadow-2xs">
                      {totalDays} days
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full text-base sm:text-lg font-black py-4 sm:py-4.5 px-8 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                  isFormValid
                    ? "bg-gradient-to-r from-brown-900 via-brown-800 to-espresso-950 hover:from-brown-950 hover:to-espresso-950 text-amber-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ring-2 ring-brown-300/50"
                    : "bg-brown-200 text-brown-400 border border-brown-300/50 cursor-not-allowed opacity-60"
                }`}
              >
                <Sparkles className={`w-5 h-5 ${isFormValid ? "text-amber-300" : "text-brown-400"}`} />
                <span>Start Preparation</span>
                <ArrowRight className={`w-5 h-5 ${isFormValid ? "text-amber-300" : "text-brown-400"}`} />
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-xs text-brown-700 font-semibold">
          GATE Command Center • Dual Stream Exam Optimizer
        </div>
      </div>
    </div>
  );
};
