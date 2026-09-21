import React, { useState, useEffect } from "react";
import { HeaderBar } from "./components/HeaderBar";
import { SubjectFilterRow } from "./components/SubjectFilterRow";
import { ActionButtonsRow } from "./components/ActionButtonsRow";
import { SubjectList } from "./components/SubjectList";
import { TimelineCalculator } from "./components/TimelineCalculator";
import { TodaysTasksPanel } from "./components/TodaysTasksPanel";
import { WeakTopicAnalytics } from "./components/WeakTopicAnalytics";
import { GoogleSheetsModal } from "./components/GoogleSheetsModal";
import { ResetModal } from "./components/ResetModal";

import { getStoredState, saveStateToLocalStorage, resetStoredState, getDefaultState } from "./utils/storage";
import { computeOverallStats } from "./utils/timelineMath";
import { exportToCSV } from "./utils/csvExport";
import { syncToGoogleSheets } from "./utils/googleSheetsSync";

export default function App() {
  // Load initial persistent state
  const [appState, setAppState] = useState(() => getStoredState());
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modal open states
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Auto-save to LocalStorage whenever state updates
  useEffect(() => {
    saveStateToLocalStorage(appState);

    // Optional background sync with Google Sheets if configured
    if (appState.googleSheetUrl) {
      const timer = setTimeout(() => {
        syncToGoogleSheets(appState.googleSheetUrl, appState).catch(err => {
          console.warn("Background Google Sheets sync error:", err);
        });
      }, 3000); // 3-second debounce
      return () => clearTimeout(timer);
    }
  }, [appState]);

  // Overall statistics computed live
  const stats = computeOverallStats(appState.syllabus);

  // Handler: Toggle individual topic task
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

  // Handler: Toggle subject master tasks (Revision, Formula Sheet, Mock Test)
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

  // Handler: Update topic metrics (Questions, Hours, Accuracy)
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

          // Update metrics on the first task item of the topic for persistence
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

  // Handler: Daily capacity pace change
  const handleChangePace = (newPace) => {
    setAppState(prev => ({
      ...prev,
      dailyGoalPace: newPace
    }));
  };

  // Handler: Custom tasks for Today's Tasks panel
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

  // Handler: Save progress button click
  const handleSaveProgress = () => {
    saveStateToLocalStorage(appState);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Handler: Export CSV
  const handleExportCSV = () => {
    exportToCSV(appState.syllabus, appState.attemptsLog);
  };

  // Handler: Confirm Reset All
  const handleConfirmReset = () => {
    const fresh = resetStoredState();
    setAppState(fresh);
  };

  // Handler: Save Google Sheet URL
  const handleSaveSheetUrl = (url) => {
    setAppState(prev => ({
      ...prev,
      googleSheetUrl: url
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* SECTION 1: HEADER BAR */}
      <HeaderBar stats={stats} />

      {/* SECTION 2: SUBJECT FILTER ROW */}
      <SubjectFilterRow
        syllabus={appState.syllabus}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* SECTION 3: ACTION BUTTONS ROW */}
      <ActionButtonsRow
        onSaveProgress={handleSaveProgress}
        onExportCSV={handleExportCSV}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
        saveSuccess={saveSuccess}
      />

      {/* MAIN SINGLE SCROLLABLE PAGE CONTENT */}
      <main className="space-y-4">
        
        {/* SECTION 4: TODAY'S PRIORITY FOCUS TASKS (TOP OF SYLLABUS BREAKDOWN) */}
        <TodaysTasksPanel
          syllabus={appState.syllabus}
          customTasks={appState.customTasks || []}
          onToggleTask={handleToggleTask}
          onToggleMasterTask={handleToggleMasterTask}
          onAddCustomTask={handleAddCustomTask}
          onToggleCustomTask={handleToggleCustomTask}
        />

        {/* SECTION 5: SUBJECT LIST (SYLLABUS BREAKDOWN CARDS) */}
        <SubjectList
          syllabus={appState.syllabus}
          activeFilter={activeFilter}
          onToggleTask={handleToggleTask}
          onUpdateTopicMetric={handleUpdateTopicMetric}
          onToggleMasterTask={handleToggleMasterTask}
        />

        {/* SECTION 6: COMPLETION TIMELINE CALCULATOR */}
        <TimelineCalculator
          syllabus={appState.syllabus}
          dailyGoalPace={appState.dailyGoalPace}
          onChangePace={handleChangePace}
        />

        {/* SECTION 7: WEAK-TOPIC & ANALYTICS SECTION */}
        <WeakTopicAnalytics
          syllabus={appState.syllabus}
          streakData={appState.streakData}
        />

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>GATE Command Center 2028 • CS + DA Dual Stream • Target Exam: February 2028</p>
        <p className="mt-1">All data auto-saved to browser local storage and Google Sheets integration.</p>
      </footer>

      {/* MODALS */}
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

    </div>
  );
}
