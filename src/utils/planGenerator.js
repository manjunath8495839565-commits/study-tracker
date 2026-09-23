import { RAW_SYLLABUS } from "../data/syllabusData.js";

export function generateStudyPlan(name, targetYear, customStartDate = null) {
  const year = parseInt(targetYear, 10);
  
  const startDate = customStartDate ? new Date(customStartDate) : new Date();
  startDate.setHours(0, 0, 0, 0);

  const examDate = new Date(year, 1, 1, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.max(1, Math.floor((examDate.getTime() - startDate.getTime()) / msPerDay));

  const isCompressed = totalDays < 60;
  
  const reservedRevisionDays = isCompressed ? Math.min(15, Math.max(5, Math.floor(totalDays * 0.25))) : 30;
  const syllabusDays = Math.max(10, totalDays - reservedRevisionDays);

  const totalTopics = 132;

  const tasks = [];
  const deadlines = [];

  let globalTopicIndex = 0;

  RAW_SYLLABUS.forEach((subject) => {
    let lastTopicPyqDate = null;

    subject.topics.forEach((topic) => {
      const topicIndex = globalTopicIndex;
      globalTopicIndex++;

      const topicStartOffset = Math.floor((topicIndex / totalTopics) * syllabusDays);
      const nextTopicStartOffset = Math.floor(((topicIndex + 1) / totalTopics) * syllabusDays);
      const topicWindowDays = Math.max(1, nextTopicStartOffset - topicStartOffset);

      const subTasks = [
        { type: "reading", label: "Reading & Core Theory", weight: 0 },
        { type: "concept", label: "Concept Notes & Derivations", weight: 0.25 },
        { type: "solving", label: "Problem Practice Set", weight: 0.50 },
        { type: "pyq", label: "GATE Past Year Questions (PYQs)", weight: 0.75 }
      ];

      subTasks.forEach((sub, subIdx) => {
        let subTaskDayOffset;
        if (topicWindowDays >= 4) {
          subTaskDayOffset = topicStartOffset + Math.floor(subIdx * (topicWindowDays / 4));
        } else {
          subTaskDayOffset = topicStartOffset + subIdx;
        }

        subTaskDayOffset = Math.min(syllabusDays - 1, subTaskDayOffset);

        const taskDate = new Date(startDate.getTime() + subTaskDayOffset * msPerDay);
        
        const yyyy = taskDate.getFullYear();
        const mm = String(taskDate.getMonth() + 1).padStart(2, "0");
        const dd = String(taskDate.getDate()).padStart(2, "0");
        const dateString = `${yyyy}-${mm}-${dd}`;

        if (sub.type === "pyq") {
          lastTopicPyqDate = taskDate;
        }

        tasks.push({
          id: `${topic.id}_${sub.type}`,
          sequence: tasks.length,
          subjectId: subject.id,
          subjectName: subject.name,
          stream: subject.stream,
          topicId: topic.id,
          topicName: topic.name,
          topicSize: topic.size,
          type: sub.type,
          label: `${sub.label} — ${topic.name}`,
          date: taskDate,
          dateString: dateString,
          completed: false,
          completedAt: null,
          questionsLogged: 0,
          hoursSpent: 0,
          status: "pending"
        });
      });
    });

    const finalDeadlineDate = lastTopicPyqDate || new Date(startDate.getTime() + syllabusDays * msPerDay);
    
    deadlines.push({
      subjectId: subject.id,
      subject: subject.name,
      stream: subject.stream,
      deadlineDate: finalDeadlineDate
    });
  });

  return {
    name: name.trim(),
    targetYear: year,
    examDate,
    startDate,
    totalDays,
    syllabusDays,
    reservedRevisionDays,
    isCompressed,
    tasks,
    deadlines,
    customTasks: [],
    streakData: {
      currentStreak: 1,
      lastActiveDate: new Date().toISOString().split("T")[0],
      history: [new Date().toISOString().split("T")[0]]
    },
    googleSheetUrl: "",
    generatedAt: new Date()
  };
}
