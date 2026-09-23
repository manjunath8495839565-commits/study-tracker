import { RAW_SYLLABUS } from "../data/syllabusData.js";

/**
 * Pure, deterministic generation logic for GATE study plan.
 * Zero hardcoded dates — everything derives from examDate - startDate.
 * 
 * @param {string} name - User's name
 * @param {number|string} targetYear - 2028, 2029, or 2030
 * @param {Date} [customStartDate] - Optional start date (defaults to today 00:00:00)
 * @returns {Object} studyPlan object
 */
export function generateStudyPlan(name, targetYear, customStartDate = null) {
  const year = parseInt(targetYear, 10);
  
  // startDate = today's date at midnight local time
  const startDate = customStartDate ? new Date(customStartDate) : new Date();
  startDate.setHours(0, 0, 0, 0);

  // examDate = Feb 1 of selected year at midnight
  const examDate = new Date(year, 1, 1, 0, 0, 0);

  // Calculate total days between startDate and examDate
  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.max(1, Math.floor((examDate.getTime() - startDate.getTime()) / msPerDay));

  const isCompressed = totalDays < 60;
  
  // Reserve last 30 days exclusively for Revision + Full PYQ Mock phase
  // If compressed (totalDays < 60), compress revision window appropriately
  const reservedRevisionDays = isCompressed ? Math.min(15, Math.max(5, Math.floor(totalDays * 0.25))) : 30;
  const syllabusDays = Math.max(10, totalDays - reservedRevisionDays);

  const totalTopics = 132; // Total topics in RAW_SYLLABUS across CS + DA

  const tasks = [];
  const deadlines = [];

  let globalTopicIndex = 0;

  RAW_SYLLABUS.forEach((subject) => {
    let lastTopicPyqDate = null;

    subject.topics.forEach((topic) => {
      const topicIndex = globalTopicIndex;
      globalTopicIndex++;

      // Compute topic start offset day in syllabus window
      const topicStartOffset = Math.floor((topicIndex / totalTopics) * syllabusDays);
      const nextTopicStartOffset = Math.floor(((topicIndex + 1) / totalTopics) * syllabusDays);
      const topicWindowDays = Math.max(1, nextTopicStartOffset - topicStartOffset);

      // 4 fixed sub-tasks in sequence for each topic:
      // 1. Reading
      // 2. Concept Notes
      // 3. Problem Practice
      // 4. PYQs
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
          // Space sub-tasks across consecutive days
          subTaskDayOffset = topicStartOffset + subIdx;
        }

        // Cap to syllabusDays - 1
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
          date: taskDate, // Actual Date object
          dateString: dateString, // YYYY-MM-DD string
          completed: false,
          completedAt: null,
          questionsLogged: 0,
          hoursSpent: 0,
          status: "pending" // "pending" | "completed" | "needs-revision"
        });
      });
    });

    // Deadline for subject = date when its last topic's PYQ task is due
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
