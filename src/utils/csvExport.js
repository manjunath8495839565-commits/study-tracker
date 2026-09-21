// CSV Export Generator for GATE 2028 Study Tracker

import { calculateTopicSchedule } from "./timelineMath";

export const exportToCSV = (syllabus, attemptsLog = []) => {
  const rows = [];
  
  // Header row
  rows.push([
    "Subject ID",
    "Subject Name",
    "Stream",
    "Target Month",
    "Topic ID",
    "Topic Name",
    "Topic Size",
    "Min Required Hours",
    "Best Target Completion Date",
    "Accuracy (%)",
    "Task ID",
    "Task Type",
    "Task Description",
    "Status",
    "Questions Logged",
    "Hours Spent",
    "Completed At"
  ]);

  // Extract all tasks
  syllabus.forEach(subject => {
    subject.topics.forEach((topic, topicIdx) => {
      const schedule = calculateTopicSchedule(topic, subject.targetMonth, topicIdx, subject.topics.length);
      topic.tasks.forEach(task => {
        rows.push([
          subject.id,
          `"${subject.name.replace(/"/g, '""')}"`,
          subject.stream,
          subject.targetMonth,
          topic.id,
          `"${topic.name.replace(/"/g, '""')}"`,
          topic.size,
          schedule.minHours,
          `"${schedule.formattedTargetDate}"`,
          topic.accuracy || 0,
          task.id,
          task.type,
          `"${task.label.replace(/"/g, '""')}"`,
          task.completed ? "Done" : "Pending",
          task.questionsLogged || 0,
          task.hoursSpent || 0,
          task.completedAt || ""
        ]);
      });
    });

    // Add subject master tasks
    subject.masterTasks.forEach(masterTask => {
      rows.push([
        subject.id,
        `"${subject.name.replace(/"/g, '""')}"`,
        subject.stream,
        subject.targetMonth,
        "MASTER_TASK",
        "Subject Master Milestone",
        "N/A",
        "N/A",
        "N/A",
        "N/A",
        masterTask.id,
        masterTask.type,
        `"${masterTask.label.replace(/"/g, '""')}"`,
        masterTask.completed ? "Done" : "Pending",
        0,
        0,
        masterTask.completedAt || ""
      ]);
    });
  });

  const csvContent = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `GATE_Command_Center_2028_Export_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
