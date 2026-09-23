import React, { useState, useEffect } from "react";
import { Screen1Setup } from "./components/Screen1Setup";
import { Screen2Stats } from "./components/Screen2Stats";
import { DashboardTopBar } from "./components/DashboardTopBar";
import { NavigationBar } from "./components/NavigationBar";
import { SubjectFilterRow } from "./components/SubjectFilterRow";
import { ActionButtonsRow } from "./components/ActionButtonsRow";
import { SubjectList } from "./components/SubjectList";
import { TimelineCalculator } from "./components/TimelineCalculator";
import { TodaysTasksPanel } from "./components/TodaysTasksPanel";
import { WeakTopicAnalytics } from "./components/WeakTopicAnalytics";
import { GoogleSheetsModal } from "./components/GoogleSheetsModal";
import { ResetModal } from "./components/ResetModal";
import { InstallAppModal } from "./components/InstallAppModal";
import { BrowserPermissionPrompt } from "./components/BrowserPermissionPrompt";

import { generateStudyPlan } from "./utils/planGenerator";
import { getStoredStudyPlan, saveStudyPlanToStorage, resetStoredStudyPlan } from "./utils/storage";
import { computeOverallStats, getWeakTasksList, getTodaysTasksList } from "./utils/timelineMath";
import { exportToCSV } from "./utils/csvExport";
import { syncToGoogleSheets } from "./utils/googleSheetsSync";
import { checkAndTrigger5pmReminder, checkAndTriggerStreakBrokenAlert } from "./utils/notifications";
import { RAW_SYLLABUS } from "./data/syllabusData";

export default function App() {
  const [studyPlan, setStudyPlan] = useState(() => getStoredStudyPlan());
  
  const [currentScreen, setCurrentScreen] = useState(() => {
    const stored = getStoredStudyPlan();
    return stored ? "SCREEN_3" : "SCREEN_1";
  });

  const [activeFilter, setActiveFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("PREP");
  const [dailyGoalPace, setDailyGoalPace] = useState(3);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isNotifPromptOpen, setIsNotifPromptOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [notifPermissionState, setNotifPermissionState] = useState(() => 
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported"
  );

  useEffect(() => {
    const choice = localStorage.getItem("gate_notification_prompt_choice");
    if (!choice && typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      const timer = setTimeout(() => {
        setIsNotifPromptOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const checkStandalone = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(standalone);
    };

    checkStandalone();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e) => setIsStandalone(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, []);

  const handleOpenInstallModal = isStandalone ? null : () => setIsInstallModalOpen(true);

  useEffect(() => {
    if (!studyPlan) return;
    const todaysTasks = getTodaysTasksList(studyPlan, studyPlan.customTasks || []);
    checkAndTrigger5pmReminder(todaysTasks);
    checkAndTriggerStreakBrokenAlert(studyPlan.streakData);
    const interval = setInterval(() => {
      checkAndTrigger5pmReminder(todaysTasks);
      checkAndTriggerStreakBrokenAlert(studyPlan.streakData);
    }, 60000);
    return () => clearInterval(interval);
  }, [studyPlan]);

  const handleGeneratePlan = (name, targetYear) => {
    const newPlan = generateStudyPlan(name, targetYear);
    saveStudyPlanToStorage(newPlan);
    setStudyPlan(newPlan);
    setCurrentScreen("SCREEN_2");
  };

  const handleToggleTask = (taskId) => {
    if (!studyPlan) return;
    setStudyPlan(prevPlan => {
      const updatedTasks = prevPlan.tasks.map(t => {
        if (t.id !== taskId) return t;
        const nowCompleted = !t.completed;
        return {
          ...t,
          completed: nowCompleted,
          completedAt: nowCompleted ? new Date().toISOString() : null,
          status: nowCompleted ? "completed" : "pending"
        };
      });

      const updatedPlan = {
        ...prevPlan,
        tasks: updatedTasks
      };

      saveStudyPlanToStorage(updatedPlan);
      return updatedPlan;
    });
  };

  const handleToggleTaskRevisionStatus = (taskId) => {
    if (!studyPlan) return;
    setStudyPlan(prevPlan => {
      const updatedTasks = prevPlan.tasks.map(t => {
        if (t.id !== taskId) return t;
        const newStatus = t.status === "needs-revision" ? (t.completed ? "completed" : "pending") : "needs-revision";
        return {
          ...t,
          status: newStatus
        };
      });

      const updatedPlan = {
        ...prevPlan,
        tasks: updatedTasks
      };

      saveStudyPlanToStorage(updatedPlan);
      return updatedPlan;
    });
  };

  const handleAddCustomTask = (label) => {
    if (!studyPlan) return;
    const newTask = {
      id: `custom_${Date.now()}`,
      label,
      completed: false,
      completedAt: null
    };

    setStudyPlan(prevPlan => {
      const updatedPlan = {
        ...prevPlan,
        customTasks: [...(prevPlan.customTasks || []), newTask]
      };
      saveStudyPlanToStorage(updatedPlan);
      return updatedPlan;
    });
  };

  const handleToggleCustomTask = (taskId) => {
    if (!studyPlan) return;
    setStudyPlan(prevPlan => {
      const updatedCustom = (prevPlan.customTasks || []).map(ct => {
        if (ct.id !== taskId) return ct;
        return { ...ct, completed: !ct.completed };
      });

      const updatedPlan = {
        ...prevPlan,
        customTasks: updatedCustom
      };
      saveStudyPlanToStorage(updatedPlan);
      return updatedPlan;
    });
  };

  const handleSaveProgress = () => {
    if (studyPlan) {
      saveStudyPlanToStorage(studyPlan);
      if (studyPlan.googleSheetUrl) {
        syncToGoogleSheets(studyPlan.googleSheetUrl, studyPlan).catch(err => {
          console.warn("Background Google Sheets sync error:", err);
        });
      }
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportCSV = () => {
    if (studyPlan) {
      exportToCSV(studyPlan);
    }
  };

  const handleConfirmReset = () => {
    resetStoredStudyPlan();
    setStudyPlan(null);
    setIsResetModalOpen(false);
    setCurrentScreen("SCREEN_1");
  };

  const handleSaveSheetUrl = (url) => {
    if (!studyPlan) return;
    setStudyPlan(prevPlan => {
      const updated = { ...prevPlan, googleSheetUrl: url };
      saveStudyPlanToStorage(updated);
      return updated;
    });
  };

  const handleNotifChoice = (result) => {
    setNotifPermissionState(typeof window !== "undefined" && "Notification" in window ? Notification.permission : result);
  };

  if (currentScreen === "SCREEN_1" || !studyPlan) {
    return (
      <div className="transition-opacity duration-300 ease-in-out">
        <Screen1Setup
          onGeneratePlan={handleGeneratePlan}
          onOpenInstallModal={handleOpenInstallModal}
        />
        <InstallAppModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
        />
        <BrowserPermissionPrompt
          isOpen={isNotifPromptOpen}
          onClose={() => setIsNotifPromptOpen(false)}
          onPermissionChoice={handleNotifChoice}
        />
      </div>
    );
  }

  if (currentScreen === "SCREEN_2") {
    return (
      <div className="transition-opacity duration-300 ease-in-out">
        <Screen2Stats
          studyPlan={studyPlan}
          onGoToDashboard={() => setCurrentScreen("SCREEN_3")}
        />
      </div>
    );
  }

  const weakTasks = getWeakTasksList(studyPlan);
  const todaysTasks = getTodaysTasksList(studyPlan, studyPlan.customTasks || []);
  const pendingFocusCount = todaysTasks.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-[#faf6f0] text-brown-950 font-sans selection:bg-brown-700 selection:text-white transition-opacity duration-300 ease-in-out">
      <DashboardTopBar
        studyPlan={studyPlan}
        onBackToStats={() => setCurrentScreen("SCREEN_2")}
        onOpenInstallModal={handleOpenInstallModal}
        onOpenNotifSettings={() => setIsNotifPromptOpen(true)}
      />

      <NavigationBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingFocusCount={pendingFocusCount}
        weakTopicsCount={weakTasks.length}
      />

      {(activeTab === "PREP" || activeTab === "FULL" || activeTab === "SUBJECTS") && (
        <ActionButtonsRow
          onSaveProgress={handleSaveProgress}
          onExportCSV={handleExportCSV}
          onOpenResetModal={() => setIsResetModalOpen(true)}
          onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
          saveSuccess={saveSuccess}
        />
      )}

      <main className="space-y-4">
        {(activeTab === "PREP" || activeTab === "FULL") && (
          <TodaysTasksPanel
            studyPlan={studyPlan}
            onToggleTask={handleToggleTask}
            onAddCustomTask={handleAddCustomTask}
            onToggleCustomTask={handleToggleCustomTask}
          />
        )}

        {(activeTab === "SUBJECTS" || activeTab === "FULL") && (
          <>
            <SubjectFilterRow
              syllabus={RAW_SYLLABUS}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />

            <SubjectList
              studyPlan={studyPlan}
              activeFilter={activeFilter}
              onToggleTask={handleToggleTask}
              onToggleTaskRevisionStatus={handleToggleTaskRevisionStatus}
            />
          </>
        )}

        {(activeTab === "TIMELINE" || activeTab === "FULL") && (
          <TimelineCalculator
            studyPlan={studyPlan}
            dailyGoalPace={dailyGoalPace}
            onChangePace={(pace) => setDailyGoalPace(pace)}
          />
        )}

        {(activeTab === "ANALYTICS" || activeTab === "FULL") && (
          <WeakTopicAnalytics
            studyPlan={studyPlan}
            onToggleTask={handleToggleTask}
            onToggleTaskRevisionStatus={handleToggleTaskRevisionStatus}
          />
        )}
      </main>

      <footer className="border-t border-brown-200 bg-white py-6 text-center text-xs text-brown-700">
        <p className="font-extrabold text-brown-950">
          GATE Command Center • Target Exam: February {studyPlan.targetYear} ({studyPlan.name})
        </p>
        <p className="mt-1 font-medium">
          CS + DA Dual Stream • All data auto-saved to browser local storage.
        </p>
      </footer>

      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        googleSheetUrl={studyPlan.googleSheetUrl || ""}
        onSaveSheetUrl={handleSaveSheetUrl}
        fullState={studyPlan}
      />

      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
      />

      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      <BrowserPermissionPrompt
        isOpen={isNotifPromptOpen}
        onClose={() => setIsNotifPromptOpen(false)}
        onPermissionChoice={handleNotifChoice}
      />
    </div>
  );
}
