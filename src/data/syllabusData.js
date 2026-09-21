// GATE 2028 CS + DA Full Syllabus Data & Auto-Task Generator

export const MONTHS_SCHEDULE = [
  "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026",
  "Jan 2027", "Feb 2027", "Mar 2027", "Apr 2027", "May 2027",
  "Jun 2027", "Jul 2027", "Aug 2027", "Sep 2027", "Oct 2027",
  "Nov 2027", "Dec 2027"
];

// Helper to auto-generate task items for a topic
export const generateTopicTasks = (subjectId, topicId, topicName, size = "medium") => {
  let taskConfigs = [];
  
  if (size === "small") {
    taskConfigs = [
      { id: `${topicId}_reading`, type: "reading", label: "Reading & Concept Notes" },
      { id: `${topicId}_solving`, type: "solving", label: "Problem Solving & PYQs" }
    ];
  } else if (size === "medium") {
    taskConfigs = [
      { id: `${topicId}_reading`, type: "reading", label: "Standard Reading & Core Theory" },
      { id: `${topicId}_concept`, type: "concept", label: "Concept Notes & Derivations" },
      { id: `${topicId}_solving`, type: "solving", label: "Standard Problem Practice Set" },
      { id: `${topicId}_pyqs`, type: "pyq", label: "GATE Past Year Questions (PYQs)" }
    ];
  } else { // large
    taskConfigs = [
      { id: `${topicId}_reading`, type: "reading", label: "Comprehensive Theory Reading" },
      { id: `${topicId}_concept`, type: "concept", label: "Deep Concept Formulas & Proofs" },
      { id: `${topicId}_practice1`, type: "solving", label: "Basic & Intermediate Practice Set" },
      { id: `${topicId}_practice2`, type: "solving", label: "Advanced Conceptual Practice Set" },
      { id: `${topicId}_pyqs`, type: "pyq", label: "Comprehensive GATE PYQs (Last 20 Yrs)" },
      { id: `${topicId}_speed`, type: "speed", label: "Timed Test & Error Log Drill" }
    ];
  }

  return taskConfigs.map(t => ({
    ...t,
    subjectId,
    topicId,
    completed: false,
    questionsLogged: 0,
    hoursSpent: 0,
    completedAt: null
  }));
};

export const RAW_SYLLABUS = [
  // ------------------- GATE CS SUBJECTS (1 to 12) -------------------
  {
    id: "cs-1",
    name: "Engineering Mathematics — Discrete Math",
    stream: "CS",
    targetMonth: "Aug 2026",
    topics: [
      { id: "dm-1", name: "Mathematical Logic & Propositional Calculus", size: "medium" },
      { id: "dm-2", name: "Set Theory, Relations & Equivalence Classes", size: "medium" },
      { id: "dm-3", name: "Functions, Partial Orders & Lattices", size: "medium" },
      { id: "dm-4", name: "Group Theory & Algebraic Structures", size: "small" },
      { id: "dm-5", name: "Combinatorics, Permutations & Generating Functions", size: "medium" },
      { id: "dm-6", name: "Recurrence Relations & Solving Techniques", size: "small" },
      { id: "dm-7", name: "Graph Theory — Connectivity, Planarity & Coloring", size: "large" },
      { id: "dm-8", name: "Linear Algebra — Matrices, Systems of Equations & Determinants", size: "medium" },
      { id: "dm-9", name: "Linear Algebra — Eigenvalues, Eigenvectors & Vector Spaces", size: "medium" },
      { id: "dm-10", name: "Calculus — Limits, Continuity & Differentiability", size: "small" },
      { id: "dm-11", name: "Calculus — Maxima/Minima, Integration & Definite Integrals", size: "medium" },
      { id: "dm-12", name: "Probability — Random Variables & Distributions (Binomial, Poisson, Normal)", size: "medium" },
      { id: "dm-13", name: "Probability — Conditional Probability, Bayes Theorem & Mean/Variance", size: "medium" }
    ]
  },
  {
    id: "cs-2",
    name: "Digital Logic",
    stream: "CS",
    targetMonth: "Sep 2026",
    topics: [
      { id: "dl-1", name: "Boolean Algebra, Logic Gates & canonical forms", size: "small" },
      { id: "dl-2", name: "Karnaugh Maps (K-Maps) & Boolean Minimization", size: "medium" },
      { id: "dl-3", name: "Combinational Circuits (Multiplexers, Decoders, Adders)", size: "medium" },
      { id: "dl-4", name: "Sequential Circuits (Flip-Flops, Latches & Excitation Tables)", size: "medium" },
      { id: "dl-5", name: "Counters (Synchronous/Asynchronous) & Shift Registers", size: "medium" },
      { id: "dl-6", name: "Number Representations (Signed Numbers, 1s/2s Complement)", size: "small" },
      { id: "dl-7", name: "Computer Arithmetic (Fixed & Floating Point IEEE 754 Format)", size: "medium" }
    ]
  },
  {
    id: "cs-3",
    name: "Computer Organization & Architecture",
    stream: "CS",
    targetMonth: "Oct 2026",
    topics: [
      { id: "coa-1", name: "Machine Instructions & Addressing Modes", size: "medium" },
      { id: "coa-2", name: "ALU, Data Path & Control Unit (Hardwired & Microprogrammed)", size: "large" },
      { id: "coa-3", name: "Instruction Pipelining, Hazards & Speedup Calculation", size: "large" },
      { id: "coa-4", name: "Memory Hierarchy — Main Memory & Cache Mapping (Direct, Set-Associative)", size: "large" },
      { id: "coa-5", name: "Cache Replacement Policies, Write Policies & Performance Metrics", size: "medium" },
      { id: "coa-6", name: "Secondary Storage — Disk Organization & Access Time", size: "small" },
      { id: "coa-7", name: "I/O Interfacing — Programmed I/O, Interrupt-Driven I/O & DMA", size: "medium" }
    ]
  },
  {
    id: "cs-4",
    name: "Programming & Data Structures",
    stream: "CS",
    targetMonth: "Nov 2026",
    topics: [
      { id: "pds-1", name: "C Programming — Data Types, Operators & Control Flow", size: "medium" },
      { id: "pds-2", name: "Functions, Scope, Parameter Passing & Recursion Analysis", size: "large" },
      { id: "pds-3", name: "Pointers, Dynamic Memory Allocation & Structs in C", size: "large" },
      { id: "pds-4", name: "Arrays, Stacks, Queues & Circular Queues", size: "medium" },
      { id: "pds-5", name: "Singly & Doubly Linked Lists (Implementation & Operations)", size: "medium" },
      { id: "pds-6", name: "Binary Trees & Tree Traversals (Inorder, Preorder, Postorder)", size: "medium" },
      { id: "pds-7", name: "Binary Search Trees (BST) — Search, Insertion & Deletion", size: "medium" },
      { id: "pds-8", name: "Binary Heaps & Priority Queues", size: "medium" },
      { id: "pds-9", name: "Graph Representation (Adjacency Matrix & List)", size: "small" }
    ]
  },
  {
    id: "cs-5",
    name: "Algorithms",
    stream: "CS",
    targetMonth: "Dec 2026",
    topics: [
      { id: "algo-1", name: "Asymptotic Notation & Recurrence Relations (Master Theorem)", size: "medium" },
      { id: "algo-2", name: "Searching Algorithms (Linear, Binary & Search Variations)", size: "small" },
      { id: "algo-3", name: "Sorting Algorithms (Merge, Quick, Heap, Counting & Analysis)", size: "large" },
      { id: "algo-4", name: "Hashing Techniques — Hash Tables, Collision Resolution & Chaining", size: "medium" },
      { id: "algo-5", name: "Greedy Algorithms (Knapsack, Huffman Coding, Job Sequencing)", size: "medium" },
      { id: "algo-6", name: "Dynamic Programming (LCS, Matrix Chain, 0/1 Knapsack, Bellman-Ford)", size: "large" },
      { id: "algo-7", name: "Divide & Conquer Paradigm", size: "small" },
      { id: "algo-8", name: "Graph Traversals — BFS & DFS, Topological Sorting", size: "medium" },
      { id: "algo-9", name: "Minimum Spanning Trees (Kruskal's & Prim's Algorithms)", size: "medium" },
      { id: "algo-10", name: "Single Source & All-Pairs Shortest Paths (Dijkstra, Bellman-Ford, Floyd-Warshall)", size: "large" }
    ]
  },
  {
    id: "cs-6",
    name: "Theory of Computation",
    stream: "CS",
    targetMonth: "Jan 2027",
    topics: [
      { id: "toc-1", name: "Finite Automata (DFA, NFA, NFA to DFA Conversion & Minimization)", size: "large" },
      { id: "toc-2", name: "Regular Expressions, Regular Languages & Closure Properties", size: "medium" },
      { id: "toc-3", name: "Pumping Lemma for Regular Languages", size: "small" },
      { id: "toc-4", name: "Context-Free Grammars (CFG), Derivation Trees & Ambiguity", size: "medium" },
      { id: "toc-5", name: "Pushdown Automata (PDA) & Context-Free Languages (CFL)", size: "medium" },
      { id: "toc-6", name: "Pumping Lemma for CFLs & Closure Properties of CFLs", size: "small" },
      { id: "toc-7", name: "Turing Machines — Definition, Variants & Language Acceptors", size: "medium" },
      { id: "toc-8", name: "Undecidability, Halting Problem & Reduction Techniques", size: "large" }
    ]
  },
  {
    id: "cs-7",
    name: "Compiler Design",
    stream: "CS",
    targetMonth: "Feb 2027",
    topics: [
      { id: "cd-1", name: "Lexical Analysis & Token Generation (Lex)", size: "small" },
      { id: "cd-2", name: "Syntax Analysis — Top-Down Parsing (LL(1), Recursive Descent)", size: "large" },
      { id: "cd-3", name: "Syntax Analysis — Bottom-Up Parsing (LR(0), SLR, LALR, CLR)", size: "large" },
      { id: "cd-4", name: "Syntax-Directed Translation (SDT) & Attribute Grammars", size: "medium" },
      { id: "cd-5", name: "Intermediate Code Generation (Three-Address Code, DAGs)", size: "medium" },
      { id: "cd-6", name: "Runtime Environments & Activation Records", size: "small" },
      { id: "cd-7", name: "Code Optimization & Basic Data Flow Analysis", size: "medium" }
    ]
  },
  {
    id: "cs-8",
    name: "Operating System",
    stream: "CS",
    targetMonth: "Mar 2027",
    topics: [
      { id: "os-1", name: "Process Concept, Process States & Threads (User/Kernel)", size: "medium" },
      { id: "os-2", name: "CPU Scheduling Algorithms (FCFS, SJF, SRTF, RR, Priority)", size: "large" },
      { id: "os-3", name: "Process Synchronization — Critical Section, Semaphores & Monitors", size: "large" },
      { id: "os-4", name: "Classical Synchronization Problems (Producer-Consumer, Dining Philosophers)", size: "medium" },
      { id: "os-5", name: "Deadlocks — Characterization, Prevention, Avoidance (Banker's) & Detection", size: "medium" },
      { id: "os-6", name: "Memory Management — Paging, Segmentation & Address Translation", size: "large" },
      { id: "os-7", name: "Virtual Memory — Demand Paging & Page Replacement Algorithms (FIFO, LRU, Optimal)", size: "medium" },
      { id: "os-8", name: "File Systems, Disk Scheduling (FCFS, SSTF, SCAN, C-SCAN) & I/O Systems", size: "medium" }
    ]
  },
  {
    id: "cs-9",
    name: "Databases (DBMS)",
    stream: "CS",
    targetMonth: "Apr 2027",
    topics: [
      { id: "dbms-1", name: "ER-Model, Entity Sets, Attributes & Key Constraints", size: "medium" },
      { id: "dbms-2", name: "Relational Model & Relational Algebra (Select, Project, Join, Division)", size: "large" },
      { id: "dbms-3", name: "Relational Calculus (Tuple & Domain Relational Calculus)", size: "small" },
      { id: "dbms-4", name: "SQL Queries — DDL, DML, Joins, Subqueries & Aggregations", size: "large" },
      { id: "dbms-5", name: "Functional Dependencies & Normalization (1NF, 2NF, 3NF, BCNF)", size: "large" },
      { id: "dbms-6", name: "File Organization, Indexing & B/B+ Trees", size: "medium" },
      { id: "dbms-7", name: "Transactions & ACID Properties", size: "small" },
      { id: "dbms-8", name: "Concurrency Control — Serializability, 2PL, Lock Protocols & Deadlocks", size: "large" }
    ]
  },
  {
    id: "cs-10",
    name: "Computer Networks",
    stream: "CS",
    targetMonth: "May 2027",
    topics: [
      { id: "cn-1", name: "ISO/OSI & TCP/IP Layering Models & Throughput Calculations", size: "medium" },
      { id: "cn-2", name: "Data Link Layer — Framing, Error Control (CRC, Hamming) & Flow Control (Stop-and-Wait, Go-Back-N, Selective Repeat)", size: "large" },
      { id: "cn-3", name: "LAN Technologies (Ethernet, CSMA/CD, Switching)", size: "medium" },
      { id: "cn-4", name: "Network Layer — IPv4/IPv6 Addressing & Subnetting", size: "large" },
      { id: "cn-5", name: "Routing Protocols (Distance Vector, Link State & RIP/OSPF/BGP)", size: "medium" },
      { id: "cn-6", name: "Transport Layer — TCP/UDP Protocols, Flow Control & Congestion Control", size: "large" },
      { id: "cn-7", name: "Application Layer Protocols (DNS, HTTP, FTP, SMTP, DHCP)", size: "medium" }
    ]
  },
  {
    id: "cs-11",
    name: "Software Engineering",
    stream: "CS",
    targetMonth: "Jun 2027",
    topics: [
      { id: "se-1", name: "SDLC Models — Waterfall, Agile, Spiral & Incremental", size: "medium" },
      { id: "se-2", name: "Requirements Engineering & SRS Documentation", size: "small" },
      { id: "se-3", name: "Software Design Principles, Coupling & Cohesion", size: "medium" },
      { id: "se-4", name: "Software Testing Basics — Black Box, White Box & Testing Metrics", size: "medium" }
    ]
  },
  {
    id: "cs-12",
    name: "General Aptitude",
    stream: "CS",
    targetMonth: "Jul 2027",
    topics: [
      { id: "ga-1", name: "Verbal Ability — English Grammar, Vocabulary & Reading Comprehension", size: "medium" },
      { id: "ga-2", name: "Quantitative Aptitude — Ratios, Percentages, Profit/Loss, Time & Work", size: "large" },
      { id: "ga-3", name: "Quantitative Aptitude — Geometry, Mensuration & Number Systems", size: "medium" },
      { id: "ga-4", name: "Analytical Reasoning — Logical Deduction, Series & Puzzles", size: "medium" },
      { id: "ga-5", name: "Spatial Reasoning — Paper Folding, Rotations & Pattern Recognition", size: "medium" }
    ]
  },

  // ------------------- GATE DA SUBJECTS (13 to 20) -------------------
  {
    id: "da-13",
    name: "Probability & Statistics (DA Depth)",
    stream: "DA",
    targetMonth: "Aug 2027",
    topics: [
      { id: "daps-1", name: "Joint, Marginal & Conditional Probability Distributions", size: "large" },
      { id: "daps-2", name: "Covariance, Correlation & Expectation Properties", size: "medium" },
      { id: "daps-3", name: "Sampling Distributions & Central Limit Theorem (CLT)", size: "large" },
      { id: "daps-4", name: "Point Estimation & Maximum Likelihood Estimation (MLE)", size: "medium" },
      { id: "daps-5", name: "Hypothesis Testing (z-test, t-test, Chi-square & ANOVA)", size: "large" },
      { id: "daps-6", name: "Confidence Intervals & Statistical Power Analysis", size: "medium" }
    ]
  },
  {
    id: "da-14",
    name: "Linear Algebra (DA Depth)",
    stream: "DA",
    targetMonth: "Aug 2027",
    topics: [
      { id: "dala-1", name: "Vector Spaces, Subspaces & Basis Sets", size: "medium" },
      { id: "dala-2", name: "Linear Transformations, Rank-Nullity Theorem & Change of Basis", size: "large" },
      { id: "dala-3", name: "Projections, Orthogonality & Gram-Schmidt Process", size: "medium" },
      { id: "dala-4", name: "Eigenvalues, Eigenvectors & Symmetric Matrices", size: "large" },
      { id: "dala-5", name: "Singular Value Decomposition (SVD) & Low-Rank Approximations", size: "large" }
    ]
  },
  {
    id: "da-15",
    name: "Calculus & Optimization",
    stream: "DA",
    targetMonth: "Sep 2027",
    topics: [
      { id: "daco-1", name: "Multivariate Calculus — Partial Derivatives, Gradient & Hessian", size: "medium" },
      { id: "daco-2", name: "Unconstrained Optimization & Gradient Descent Variants", size: "large" },
      { id: "daco-3", name: "Convex Sets, Convex Functions & Local/Global Minima", size: "medium" },
      { id: "daco-4", name: "Constrained Optimization & Lagrange Multipliers (KKT Conditions)", size: "large" }
    ]
  },
  {
    id: "da-16",
    name: "Programming, Data Structures & Algorithms (Python)",
    stream: "DA",
    targetMonth: "Sep 2027",
    topics: [
      { id: "dapy-1", name: "Python Core Data Structures (Lists, Dicts, Sets, Tuples, Comprehensions)", size: "medium" },
      { id: "dapy-2", name: "Object-Oriented Programming in Python & Exception Handling", size: "medium" },
      { id: "dapy-3", name: "Time/Space Complexity Analysis in Python", size: "medium" },
      { id: "dapy-4", name: "Searching, Sorting & Hash-based Structures in Python", size: "medium" }
    ]
  },
  {
    id: "da-17",
    name: "Database Management & Warehousing",
    stream: "DA",
    targetMonth: "Oct 2027",
    topics: [
      { id: "dadb-1", name: "Advanced SQL Queries & Window Functions for Data Analysis", size: "large" },
      { id: "dadb-2", name: "Data Warehousing Architecture & Dimensional Modeling", size: "medium" },
      { id: "dadb-3", name: "Star Schema, Snowflake Schema & Fact/Dimension Tables", size: "medium" },
      { id: "dadb-4", name: "OLAP Operations (Roll-up, Drill-down, Slice & Dice) & ETL Pipelines", size: "large" }
    ]
  },
  {
    id: "da-18",
    name: "Machine Learning",
    stream: "DA",
    targetMonth: "Oct 2027",
    topics: [
      { id: "daml-1", name: "Supervised Learning — Linear & Logistic Regression, Regularization (L1/L2)", size: "large" },
      { id: "daml-2", name: "Decision Trees, Random Forests & Boosting (XGBoost/AdaBoost)", size: "large" },
      { id: "daml-3", name: "K-Nearest Neighbors (KNN) & Support Vector Machines (SVM)", size: "medium" },
      { id: "daml-4", name: "Unsupervised Learning — K-Means, Hierarchical Clustering & DBSCAN", size: "large" },
      { id: "daml-5", name: "Dimensionality Reduction — Principal Component Analysis (PCA) & t-SNE", size: "large" },
      { id: "daml-6", name: "Neural Networks Intro — Perceptrons, Backpropagation & Activation Functions", size: "medium" },
      { id: "daml-7", name: "Model Evaluation Metrics — Precision, Recall, F1, ROC-AUC, Bias-Variance Tradeoff", size: "large" }
    ]
  },
  {
    id: "da-19",
    name: "Artificial Intelligence",
    stream: "DA",
    targetMonth: "Nov 2027",
    topics: [
      { id: "daai-1", name: "Uninformed & Informed Search Strategies (BFS, DFS, A*, Heuristics)", size: "large" },
      { id: "daai-2", name: "Adversarial Search & Minimax with Alpha-Beta Pruning", size: "medium" },
      { id: "daai-3", name: "Constraint Satisfaction Problems (CSP) & Backtracking Search", size: "medium" },
      { id: "daai-4", name: "Propositional Logic & First-Order Logic Inference", size: "medium" },
      { id: "daai-5", name: "Reasoning Under Uncertainty & Bayesian Belief Networks", size: "large" }
    ]
  },
  {
    id: "da-20",
    name: "Data Science Fundamentals",
    stream: "DA",
    targetMonth: "Dec 2027",
    topics: [
      { id: "dads-1", name: "Data Handling, Cleaning & Missing Value Imputation", size: "medium" },
      { id: "dads-2", name: "Exploratory Data Analysis (EDA) & Summary Statistics", size: "medium" },
      { id: "dads-3", name: "Data Visualization Best Practices & Distribution Analysis", size: "medium" },
      { id: "dads-4", name: "Feature Scaling, Encoding & Feature Selection Techniques", size: "large" }
    ]
  }
];

// Helper to get minimum search-based time requirement (in hours) based on topic size
export const getTopicMinHours = (size = "medium") => {
  if (size === "small") return 4;
  if (size === "large") return 20;
  return 10; // medium
};

// Helper to generate full initial syllabus structure with master tasks
export const buildInitialSyllabusState = () => {
  return RAW_SYLLABUS.map(sub => {
    const formattedTopics = sub.topics.map(t => ({
      ...t,
      subjectId: sub.id,
      accuracy: 0, // 0 to 100
      notes: "",
      minHours: getTopicMinHours(t.size),
      tasks: generateTopicTasks(sub.id, t.id, t.name, t.size)
    }));

    const masterTasks = [
      {
        id: `${sub.id}_master_revision`,
        subjectId: sub.id,
        type: "master_revision",
        label: `Master Revision — ${sub.name}`,
        completed: false,
        completedAt: null
      },
      {
        id: `${sub.id}_master_formula`,
        subjectId: sub.id,
        type: "master_formula",
        label: `Formula & Short Notes Sheet — ${sub.name}`,
        completed: false,
        completedAt: null
      },
      {
        id: `${sub.id}_master_mock`,
        subjectId: sub.id,
        type: "master_mock",
        label: `Subject Test / Mini Mock — ${sub.name}`,
        completed: false,
        completedAt: null
      }
    ];

    return {
      ...sub,
      topics: formattedTopics,
      masterTasks
    };
  });
};
