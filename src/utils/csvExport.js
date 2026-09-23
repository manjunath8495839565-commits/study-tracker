export const exportToCSV = (studyPlan) => {
  if (!studyPlan || !studyPlan.tasks) return;

  const rows = [];
  
  rows.push([
    "Sequence",
    "Subject ID",
    "Subject Name",
    "Stream",
    "Scheduled Date",
    "Topic ID",
    "Topic Name",
    "Task Type",
    "Task Label",
    "Status",
    "Completed At",
    "Questions Logged",
    "Hours Spent"
  ]);

  studyPlan.tasks.forEach(task => {
    const dateStr = task.date ? new Date(task.date).toISOString().split("T")[0] : task.dateString;
    rows.push([
      task.sequence,
      task.subjectId,
      `"${(task.subjectName || "").replace(/"/g, '""')}"`,
      task.stream,
      dateStr,
      task.topicId,
      `"${(task.topicName || "").replace(/"/g, '""')}"`,
      task.type,
      `"${(task.label || "").replace(/"/g, '""')}"`,
      task.completed ? "Done" : (task.status === "needs-revision" ? "Needs Revision" : "Pending"),
      task.completedAt || "",
      task.questionsLogged || 0,
      task.hoursSpent || 0
    ]);
  });

  const csvContent = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `GATE_Command_Center_${studyPlan.targetYear}_Plan_${studyPlan.name}_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
