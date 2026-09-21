import React, { useState, useEffect } from "react";
import { DashboardTopBar } from "./components/DashboardTopBar";
import { NavigationBar } from "./components/NavigationBar";
import { SubjectFilterRow } from "./components/SubjectFilterRow";
import { ActionButtonsRow } from "./components/ActionButtonsRow";
import { SubjectList } from "./components/SubjectList";
import { TimelineCalculator } from "./components/TimelineCalculator";
import { TodaysTasksPanel } from "./components/TodaysTasksPanel";
import { WeakTopicAnalytics } from "./components/WeakTopicAnalytics";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { GoogleSheetsModal } from "./components/GoogleSheetsModal";
import { ResetModal } from "./components/ResetModal";
import { InstallAppModal } from "./components/InstallAppModal";
import { BrowserPermissionPrompt } from "./components/BrowserPermissionPrompt";

import { getStoredState, saveStateToLocalStorage, resetStoredState, getDefaultState } from "./utils/storage";
import { computeOverallStats, getWeakTopicsList, getTodaysTasksList } from "./utils/timelineMath";
import { exportToCSV } from "./utils/csvExport";
import { syncToGoogleSheets } from "./utils/googleSheetsSync";
import { checkAndTrigger5pmReminder, checkAndTriggerStreakBrokenAlert, requestNotificationPermission } from "./utils/notifications";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("WELCOME");
  const [appState, setAppState] = useState(() => getStoredState());
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("PREP");
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

  const stats = computeOverallStats(appState.syllabus);
  const weakTopics = getWeakTopicsList(appState.syllabus);
  const todaysTasks = getTodaysTasksList(appState.syllabus, appState.customTasks || []);
  const pendingFocusCount = todaysTasks.filter(t => !t.completed).length;

  useEffect(() => {
    checkAndTrigger5pmReminder(todaysTasks);
    checkAndTriggerStreakBrokenAlert(appState.streakData);
    const interval = setInterval(() => {
      checkAndTrigger5pmReminder(todaysTasks);
      checkAndTriggerStreakBrokenAlert(appState.streakData);
    }, 60000);
    return () => clearInterval(interval);
  }, [todaysTasks, appState.streakData]);

  useEffect(() => {
    saveStateToLocalStorage(appState);

    if (appState.googleSheetUrl) {
      const timer = setTimeout(() => {
        syncToGoogleSheets(appState.googleSheetUrl, appState).catch(err => {
          console.warn("Background Google Sheets sync error:", err);
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleToggleTask = (subjectId, topicId, taskId) => {
    setAppState(prevState => {
      const updatedSyllabus = prevState.syllabus.map(subject => {
        if (subject.id !== subjectId) return subject;

        const updatedTopics = subject.topics.map(topic => {
          if (topic.id !== topicId) return topic;

          const updatedTasks = topic.tasks.map(task => {
            if (task.id !== taskId) return task;
            return {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null
            };
          });

          return { ...topic, tasks: updatedTasks };
        });

        return { ...subject, topics: updatedTopics };
      });

      return { ...prevState, syllabus: updatedSyllabus };
    });
  };

  const handleToggleMasterTask = (subjectId, masterTaskId) => {
    setAppState(prevState => {
      const updatedSyllabus = prevState.syllabus.map(subject => {
        if (subject.id !== subjectId) return subject;

        const updatedMasterTasks = subject.masterTasks.map(mt => {
          if (mt.id !== masterTaskId) return mt;
          return {
            ...mt,
            completed: !mt.completed,
            completedAt: !mt.completed ? new Date().toISOString() : null
          };
        });

        return { ...subject, masterTasks: updatedMasterTasks };
      });

      return { ...prevState, syllabus: updatedSyllabus };
    });
  };

  const handleUpdateTopicMetric = (subjectId, topicId, metricKey, value) => {
    setAppState(prevState => {
      const updatedSyllabus = prevState.syllabus.map(subject => {
        if (subject.id !== subjectId) return subject;

        const updatedTopics = subject.topics.map(topic => {
          if (topic.id !== topicId) return topic;

          if (metricKey === "accuracy") {
            return { ...topic, accuracy: value };
          }
          if (metricKey === "minHours") {
            return { ...topic, minHours: Math.max(1, value) };
          }

          const updatedTasks = topic.tasks.map((task, idx) => {
            if (idx === 0) {
              return { ...task, [metricKey]: value };
            }
            return task;
          });

          return { ...topic, tasks: updatedTasks };
        });

        return { ...subject, topics: updatedTopics };
      });

      return { ...prevState, syllabus: updatedSyllabus };
    });
  };

  const handleChangePace = (newPace) => {
    setAppState(prev => ({
      ...prev,
      dailyGoalPace: newPace
    }));
  };

  const handleAddCustomTask = (label) => {
    const newTask = {
      id: `custom_${Date.now()}`,
      label,
      completed: false,
      completedAt: null
    };

    setAppState(prev => ({
      ...prev,
      customTasks: [...(prev.customTasks || []), newTask]
    }));
  };

  const handleToggleCustomTask = (taskId) => {
    setAppState(prev => ({
      ...prev,
      customTasks: (prev.customTasks || []).map(ct => {
        if (ct.id !== taskId) return ct;
        return { ...ct, completed: !ct.completed };
      })
    }));
  };

  const handleSaveProgress = () => {
    saveStateToLocalStorage(appState);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportCSV = () => {
    exportToCSV(appState.syllabus, appState.attemptsLog);
  };

  const handleConfirmReset = () => {
    const fresh = resetStoredState();
    setAppState(fresh);
  };

  const handleSaveSheetUrl = (url) => {
    setAppState(prev => ({
      ...prev,
      googleSheetUrl: url
    }));
  };

  const handleNotifChoice = (result) => {
    setNotifPermissionState(typeof window !== "undefined" && "Notification" in window ? Notification.permission : result);
  };

  if (currentScreen === "WELCOME") {
    return (
      <div className="transition-opacity duration-300 ease-in-out">
        <WelcomeScreen
          stats={stats}
          onStartPrep={() => setCurrentScreen("DASHBOARD")}
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

  return (
    <div className="min-h-screen bg-[#faf6f0] text-brown-950 font-sans selection:bg-brown-700 selection:text-white transition-opacity duration-300 ease-in-out">
      
      <DashboardTopBar
        onBackToWelcome={() => setCurrentScreen("WELCOME")}
        onOpenInstallModal={handleOpenInstallModal}
        onOpenNotifSettings={() => setIsNotifPromptOpen(true)}
      />

      <NavigationBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingFocusCount={pendingFocusCount}
        weakTopicsCount={weakTopics.length}
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
            syllabus={appState.syllabus}
            customTasks={appState.customTasks || []}
            onToggleTask={handleToggleTask}
            onToggleMasterTask={handleToggleMasterTask}
            onAddCustomTask={handleAddCustomTask}
            onToggleCustomTask={handleToggleCustomTask}
          />
        )}

        {(activeTab === "SUBJECTS" || activeTab === "FULL") && (
          <>
            <SubjectFilterRow
              syllabus={appState.syllabus}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />

            <SubjectList
              syllabus={appState.syllabus}
              activeFilter={activeFilter}
              onToggleTask={handleToggleTask}
              onUpdateTopicMetric={handleUpdateTopicMetric}
              onToggleMasterTask={handleToggleMasterTask}
            />
          </>
        )}

        {(activeTab === "TIMELINE" || activeTab === "FULL") && (
          <TimelineCalculator
            syllabus={appState.syllabus}
            dailyGoalPace={appState.dailyGoalPace}
            onChangePace={handleChangePace}
          />
        )}

        {(activeTab === "ANALYTICS" || activeTab === "FULL") && (
          <WeakTopicAnalytics
            syllabus={appState.syllabus}
            streakData={appState.streakData}
          />
        )}

      </main>

      <footer className="border-t border-brown-200 bg-white py-6 text-center text-xs text-brown-700">
        <p className="font-extrabold text-brown-950">GATE Command Center 2028 • CS + DA Dual Stream • Target Exam: February 2028</p>
        <p className="mt-1 font-medium">All data auto-saved to browser local storage and Google Sheets integration.</p>
      </footer>

      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        googleSheetUrl={appState.googleSheetUrl}
        onSaveSheetUrl={handleSaveSheetUrl}
        fullState={appState}
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
