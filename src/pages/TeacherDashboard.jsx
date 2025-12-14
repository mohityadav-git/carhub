import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

/*
 In a real app, these tests would come from backend.
 For now, we keep them in component state as demo.
*/
const initialTests = [
  {
    id: "T1",
    subject: "Mathematics",
    className: "Class 3",
    date: "2025-12-10",
    time: "09:00",
    durationMinutes: 30,
    difficulty: "Easy",
    status: "Scheduled",
  },
  {
    id: "T2",
    subject: "Science",
    className: "Class 5",
    date: "2025-12-12",
    time: "11:00",
    durationMinutes: 40,
    difficulty: "Medium",
    status: "Scheduled",
  },
];

const buildSampleQuestion = (subject, className, idx) => {
  const numA = idx + 2;
  const numB = idx + 3;
  const difficultyCycle = ["Easy", "Medium", "Hard"];
  return {
    id: `Q${idx + 1}`,
    question: `${subject} sample ${idx + 1} for ${className}: What is ${numA} + ${numB}?`,
    difficulty: difficultyCycle[idx % difficultyCycle.length],
    options: [
      { text: `${numA + numB}`, imageUrl: null },
      { text: `${numA + numB + 1}`, imageUrl: null },
      { text: `${numA + numB - 1}`, imageUrl: null },
      { text: `${numA + numB + 2}`, imageUrl: null },
    ],
    correctIndex: 0,
  };
};

const buildInitialQuestionBank = () => {
  const bank = {};
  subjectOptions.forEach((subj) => {
    bank[subj.name] = {};
    classOptions.forEach((cls) => {
      bank[subj.name][cls.name] = Array.from({ length: 30 }, (_, i) =>
        buildSampleQuestion(subj.name, cls.name, i)
      );
    });
  });
  return bank;
};

const hasBankData = (bank) =>
  Object.keys(bank).some((subj) => bank[subj] && Object.keys(bank[subj]).length > 0);

const subjectOptions = [
  { name: "All Subjects", color: "#2f6cab", desc: "Combine all subjects into a single paper." },
  { name: "Mathematics", color: "#59c27f", desc: "Numbers, algebra, geometry, and problem solving." },
  { name: "Science", color: "#4ca1d3", desc: "Physics, chemistry, biology basics, and experiments." },
  { name: "English", color: "#f2a457", desc: "Reading, grammar, writing, and comprehension." },
  { name: "Social Studies", color: "#9d6acb", desc: "History, civics, geography, culture." },
  { name: "Physics", color: "#5fa8d3", desc: "Mechanics, electricity, waves, and modern physics." },
  { name: "Chemistry", color: "#d36c5c", desc: "Atoms, reactions, organic basics, and lab skills." },
  { name: "Biology", color: "#3fb28a", desc: "Cells, plants, animals, genetics, and health." },
  { name: "Computer Science", color: "#d9903f", desc: "Programming basics, logic, and computing concepts." },
  { name: "History", color: "#c482f2", desc: "Civilizations, events, timelines, and analysis." },
  { name: "Geography", color: "#5bbd8a", desc: "Maps, climates, resources, and regions." },
  { name: "Economics", color: "#f29d52", desc: "Markets, money, trade, and basic finance." },
  { name: "Hindi", color: "#3e9c7a", desc: "Literature, grammar, and composition." },
];

const classOptions = [
  { name: "Class 1", tag: "1", color: "#59c27f", desc: "Basics of numbers, phonics, reading short stories, and shapes." },
  { name: "Class 2", tag: "2", color: "#4ca1d3", desc: "Two-digit arithmetic, simple grammar, and sentence building." },
  { name: "Class 3", tag: "3", color: "#f2a457", desc: "Measurement, possessives, conjunctions, and dictionary skills." },
  { name: "Class 4", tag: "4", color: "#9d6acb", desc: "Fractions, time, synonyms/antonyms, and homophones." },
  { name: "Class 5", tag: "5", color: "#3fb28a", desc: "Fractions, angles, prepositions, homographs, and compounds." },
  { name: "Class 6", tag: "6", color: "#d9903f", desc: "Multiples, fractions, prefixes/suffixes, complex sentences." },
  { name: "Class 7", tag: "7", color: "#3e9c7a", desc: "Rational numbers, clauses, connotations, and hyphens." },
  { name: "Class 8", tag: "8", color: "#5fa8d3", desc: "Linear equations, exponents, formal writing, and vocab." },
  { name: "Class 9", tag: "9", color: "#d36c5c", desc: "Polynomials, coordinate geometry, fiction analysis, grammar." },
  { name: "Class 10", tag: "10", color: "#5bbd8a", desc: "Trigonometry basics, statistics, essays, and literature themes." },
  { name: "Class 11", tag: "11", color: "#c482f2", desc: "Algebra, limits intro, advanced comprehension, report writing." },
  { name: "Class 12", tag: "12", color: "#f29d52", desc: "Calculus basics, probability, critical essays, and summaries." },
];

const normalizeBank = (raw) => {
  if (!raw) return {};
  if (Array.isArray(raw)) return { All: raw };
  const result = {};
  Object.entries(raw).forEach(([subj, val]) => {
    if (Array.isArray(val)) {
      result[subj] = { All: val };
    } else if (val && typeof val === "object") {
      result[subj] = val;
    }
  });
  return result;
};

// Prebuild a default bank so we can also seed sample tests with example questions
const defaultQuestionBank = normalizeBank(buildInitialQuestionBank());

const mockStudentsByClass = {
  "Class 1": [
    { name: "Aarav Singh", roll: "1" },
    { name: "Mia Kapoor", roll: "2" },
    { name: "Vihaan Sharma", roll: "3" },
  ],
  "Class 2": [
    { name: "Ira Mehta", roll: "1" },
    { name: "Reyansh Das", roll: "2" },
    { name: "Zara Bedi", roll: "3" },
  ],
  "Class 3": [
    { name: "Kabir Iyer", roll: "1" },
    { name: "Anaya Patil", roll: "2" },
    { name: "Arjun Nair", roll: "3" },
  ],
  "Class 4": [
    { name: "Myra Saxena", roll: "1" },
    { name: "Dev Khanna", roll: "2" },
    { name: "Ayaan Pillai", roll: "3" },
  ],
  "Class 5": [
    { name: "Siya Reddy", roll: "1" },
    { name: "Rudra Jain", roll: "2" },
    { name: "Tara Bose", roll: "3" },
  ],
  "Class 6": [
    { name: "Ishaan Gupta", roll: "1" },
    { name: "Naina Rao", roll: "2" },
    { name: "Yuvan Kulkarni", roll: "3" },
  ],
  "Class 7": [
    { name: "Advika Sen", roll: "1" },
    { name: "Param Gill", roll: "2" },
    { name: "Kiara Dutta", roll: "3" },
  ],
  "Class 8": [
    { name: "Rhea Menon", roll: "1" },
    { name: "Vivaan Suri", roll: "2" },
    { name: "Aditi Malhotra", roll: "3" },
  ],
  "Class 9": [
    { name: "Aryan Verma", roll: "1" },
    { name: "Nisha Chawla", roll: "2" },
    { name: "Rohan Malik", roll: "3" },
  ],
  "Class 10": [
    { name: "Tanishq Batra", roll: "1" },
    { name: "Khushi Narang", roll: "2" },
    { name: "Arnav Goswami", roll: "3" },
  ],
  "Class 11": [
    { name: "Pranav Mehra", roll: "1" },
    { name: "Meera Kulkarni", roll: "2" },
    { name: "Samar Kohli", roll: "3" },
  ],
  "Class 12": [
    { name: "Ritika Anand", roll: "1" },
    { name: "Devansh Sethi", roll: "2" },
    { name: "Ishita Bawa", roll: "3" },
  ],
};

const getQuestionsForSubjectAndClass = (subject, className, bank) => {
  const safeClass = className?.trim();
  if (subject === "All Subjects") {
    return Object.values(bank || {}).flatMap((entry) => {
      if (!entry) return [];
      return (safeClass && entry[safeClass]) || entry.All || [];
    });
  }
  const subjectEntry = (bank || {})[subject] || {};
  return (safeClass && subjectEntry[safeClass]) || subjectEntry.All || [];
};

function TeacherDashboard() {
  const { user } = useAuth();
  const [tests, setTests] = useState(() => {
    const stored = localStorage.getItem("teacherTests");
    return stored ? JSON.parse(stored) : initialTests;
  });
  const [questions, setQuestions] = useState(() => {
    const stored = localStorage.getItem("teacherQuestions");
    if (stored) return JSON.parse(stored);
    return initialTests.reduce((acc, test) => {
      const subjectEntry = defaultQuestionBank[test.subject] || {};
      const sampleList =
        subjectEntry[test.className] ||
        subjectEntry.All ||
        [];
      return { ...acc, [test.id]: sampleList.slice(0, 5) };
    }, {});
  });
  const [questionBank, setQuestionBank] = useState(() => {
    const stored = localStorage.getItem("teacherQuestionBank");
    const parsed = stored ? normalizeBank(JSON.parse(stored)) : {};
    return hasBankData(parsed) ? parsed : {};
  });

  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [difficulty, setDifficulty] = useState("Easy");

  const [selectedQuestionSubject, setSelectedQuestionSubject] = useState(
    initialTests[0]?.subject ?? ""
  );
  const [selectedQuestionClass, setSelectedQuestionClass] = useState(
    initialTests[0]?.className ?? ""
  );
  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [questionDifficulty, setQuestionDifficulty] = useState("Easy");
  const [optionAImage, setOptionAImage] = useState(null);
  const [optionBImage, setOptionBImage] = useState(null);
  const [optionCImage, setOptionCImage] = useState(null);
  const [optionDImage, setOptionDImage] = useState(null);
  const [correctOption, setCorrectOption] = useState("A");
  const [pendingTest, setPendingTest] = useState(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState(null); // create-class, create-subject, bank-class, bank-subject
  const [activePanel, setActivePanel] = useState(null); // 'create', 'add', 'bank'
  const [bankSubjectFilter, setBankSubjectFilter] = useState("All");
  const [bankClassFilter, setBankClassFilter] = useState("All");
  const [attendanceClass, setAttendanceClass] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const stored = localStorage.getItem("teacherAttendance");
    return stored ? JSON.parse(stored) : {};
  });
  const [homework, setHomework] = useState(() => {
    const stored = localStorage.getItem("teacherHomework");
    return stored ? JSON.parse(stored) : [];
  });
  const [homeworkClass, setHomeworkClass] = useState("");
  const [homeworkSubject, setHomeworkSubject] = useState("");
  const [homeworkTitle, setHomeworkTitle] = useState("");
  const [homeworkDescription, setHomeworkDescription] = useState("");
  const [homeworkDue, setHomeworkDue] = useState("");
  const [homeworkLink, setHomeworkLink] = useState("");
  const [syllabusEntries, setSyllabusEntries] = useState(() => {
    const stored = localStorage.getItem("teacherSyllabus");
    return stored ? JSON.parse(stored) : [];
  });
  const [syllabusClass, setSyllabusClass] = useState("");
  const [syllabusSubject, setSyllabusSubject] = useState("");
  const [syllabusNotes, setSyllabusNotes] = useState("");
  const [syllabusLink, setSyllabusLink] = useState("");
  const [datesheetEntries, setDatesheetEntries] = useState(() => {
    const stored = localStorage.getItem("teacherDatesheet");
    return stored ? JSON.parse(stored) : [];
  });
  const [datesheetClass, setDatesheetClass] = useState("");
  const [datesheetSubject, setDatesheetSubject] = useState("");
  const [datesheetDate, setDatesheetDate] = useState("");
  const [datesheetTime, setDatesheetTime] = useState("");
  const [datesheetNotes, setDatesheetNotes] = useState("");
  const [datesheetLink, setDatesheetLink] = useState("");

  const fileToDataUrl = (file) =>
    new Promise((resolve) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });

  const handleCreateTest = (e) => {
    e.preventDefault();
    if (!subject || !className || !date || !time) return;

    const newTestId = "T" + (tests.length + 1);
    const subjectQuestions = getQuestionsForSubjectAndClass(subject, className, questionBank);

    const newTest = {
      id: newTestId,
      subject,
      className,
      date,
      time,
      durationMinutes: Number(durationMinutes),
      difficulty,
      status: "Scheduled",
    };

    setTests((prev) => [...prev, newTest]);
    setQuestions((prev) => ({ ...prev, [newTestId]: subjectQuestions }));
    setSelectedQuestionSubject(subject);
    setSelectedQuestionClass(className);

    setSubject("");
    setClassName("");
    setDate("");
    setTime("");
    setDurationMinutes(30);
    setDifficulty("Easy");
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (
      !selectedQuestionSubject.trim() ||
      !selectedQuestionClass.trim() ||
      !questionText.trim() ||
      !optionA.trim() ||
      !optionB.trim()
    ) {
      return;
    }

    const imageUrls = await Promise.all([
      fileToDataUrl(optionAImage),
      fileToDataUrl(optionBImage),
      fileToDataUrl(optionCImage),
      fileToDataUrl(optionDImage),
    ]);

    const optionList = [
      { text: optionA.trim(), imageUrl: imageUrls[0] },
      { text: optionB.trim(), imageUrl: imageUrls[1] },
      { text: optionC.trim(), imageUrl: imageUrls[2] },
      { text: optionD.trim(), imageUrl: imageUrls[3] },
    ].filter((opt) => opt.text);
    const letter = (correctOption || "A").trim().toUpperCase();
    const letterIndexMap = { A: 0, B: 1, C: 2, D: 3 };
    const letterIndex = letterIndexMap[letter] ?? 0;
    const safeIndex = Math.min(optionList.length - 1, Math.max(0, letterIndex));

    const classKey = selectedQuestionClass.trim();
    const existingList =
      (questionBank[selectedQuestionSubject] &&
        (questionBank[selectedQuestionSubject][classKey] ||
          questionBank[selectedQuestionSubject].All)) ||
      [];

    const newQuestion = {
      id: `Q${existingList.length + 1}`,
      question: questionText.trim(),
      // Persist difficulty per question so teachers can see/filter later.
      difficulty: questionDifficulty,
      options: optionList,
      correctIndex: safeIndex,
    };

    setQuestionBank((prev) => {
      const bank = normalizeBank(prev);
      const subjectEntry = bank[selectedQuestionSubject] || {};
      const list = subjectEntry[classKey] || [];
      return {
        ...bank,
        [selectedQuestionSubject]: {
          ...subjectEntry,
          [classKey]: [...list, newQuestion],
        },
      };
    });

    setQuestionText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setQuestionDifficulty("Easy");
    setOptionAImage(null);
    setOptionBImage(null);
    setOptionCImage(null);
    setOptionDImage(null);
    setCorrectOption("A");
  };

  useEffect(() => {
    localStorage.setItem("teacherTests", JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem("teacherQuestionBank", JSON.stringify(questionBank));
  }, [questionBank]);

  // If the bank was previously cleared in storage, reseed with local samples
  // No auto-seed; keep question bank empty until teacher adds

  useEffect(() => {
    localStorage.setItem("teacherQuestions", JSON.stringify(questions));
  }, [questions]);

  const handleToggleQuestion = (id) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (!pendingTest) return;
    const list = getQuestionsForSubjectAndClass(
      pendingTest.subject,
      pendingTest.className,
      questionBank
    );
    setSelectedQuestionIds(list.map((q) => q.id));
  };

  const handleDeleteQuestionFromBank = (subjectKey, classKey, questionId) => {
    setQuestionBank((prev) => {
      const bank = normalizeBank(prev);
      const subjectEntry = bank[subjectKey];
      if (!subjectEntry) return bank;

      const currentList = subjectEntry[classKey] || [];
      const filtered = currentList.filter((q) => q.id !== questionId);

      const nextSubject =
        filtered.length === 0
          ? (() => {
              const { [classKey]: _, ...rest } = subjectEntry;
              return rest;
            })()
          : { ...subjectEntry, [classKey]: filtered };

      const nextBank = { ...bank };
      if (Object.keys(nextSubject).length === 0) {
        delete nextBank[subjectKey];
      } else {
        nextBank[subjectKey] = nextSubject;
      }
      return nextBank;
    });

    setSelectedQuestionIds((prev) => prev.filter((id) => id !== questionId));
  };

  const handleConfirmQuestions = () => {
    if (!pendingTest) return;
    const subjectEntry = questionBank[pendingTest.subject] || {};
    const list =
      subjectEntry[pendingTest.className] ||
      subjectEntry.All ||
      [];
    const chosen = list.filter((q) => selectedQuestionIds.includes(q.id));

    setTests((prev) => [...prev, pendingTest]);
    setQuestions((prev) => ({
      ...prev,
      [pendingTest.id]: chosen,
    }));

    setPendingTest(null);
    setSelectedQuestionIds([]);
    setSubject("");
    setClassName("");
    setDate("");
    setTime("");
    setDurationMinutes(30);
  };

  const openClassPicker = (target) => {
    setPickerTarget(target);
    setShowClassPicker(true);
  };

  const openSubjectPicker = (target) => {
    setPickerTarget(target);
    setShowSubjectPicker(true);
  };

  const closePickers = () => {
    setPickerTarget(null);
    setShowClassPicker(false);
    setShowSubjectPicker(false);
  };

  const handleCancelSelection = () => {
    setPendingTest(null);
    setSelectedQuestionIds([]);
  };

  const handleAttendanceToggle = (student, present) => {
    if (!attendanceClass) return;
    const key = `${attendanceClass}|${attendanceDate}`;
    setAttendanceRecords((prev) => {
      const record = prev[key] || {};
      return { ...prev, [key]: { ...record, [student]: present } };
    });
  };

  useEffect(() => {
    localStorage.setItem("teacherAttendance", JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem("teacherHomework", JSON.stringify(homework));
  }, [homework]);

  useEffect(() => {
    localStorage.setItem("teacherSyllabus", JSON.stringify(syllabusEntries));
  }, [syllabusEntries]);

  useEffect(() => {
    localStorage.setItem("teacherDatesheet", JSON.stringify(datesheetEntries));
  }, [datesheetEntries]);

  const handleResetData = () => {
    localStorage.removeItem("teacherTests");
    localStorage.removeItem("teacherQuestions");
    localStorage.removeItem("teacherQuestionBank");
    localStorage.removeItem("studentTestRecords");
    localStorage.removeItem("teacherHomework");
    localStorage.removeItem("teacherSyllabus");
    localStorage.removeItem("teacherDatesheet");

    setTests(initialTests);
    setQuestionBank(defaultQuestionBank);
    const seededQuestions = initialTests.reduce((acc, test) => {
      const subjectEntry = defaultQuestionBank[test.subject] || {};
      const sampleList = subjectEntry[test.className] || subjectEntry.All || [];
      return { ...acc, [test.id]: sampleList.slice(0, 5) };
    }, {});
    setQuestions(seededQuestions);
    setActivePanel(null);
    setPendingTest(null);
    setSelectedQuestionIds([]);
    setHomework([]);
    setSyllabusEntries([]);
    setDatesheetEntries([]);
  };

  const handleCreateHomework = (e) => {
    e.preventDefault();
    if (!homeworkSubject || !homeworkClass || !homeworkTitle) return;
    const newItem = {
      id: "HW" + (homework.length + 1),
      subject: homeworkSubject,
      className: homeworkClass,
      title: homeworkTitle.trim(),
      description: homeworkDescription.trim(),
      dueDate: homeworkDue,
      link: homeworkLink.trim(),
    };
    setHomework((prev) => [...prev, newItem]);
    setHomeworkSubject("");
    setHomeworkClass("");
    setHomeworkTitle("");
    setHomeworkDescription("");
    setHomeworkDue("");
    setHomeworkLink("");
    setActivePanel(null);
  };

  const bankQuestionCount = Object.values(questionBank || {}).reduce((total, subjEntry) => {
    if (!subjEntry) return total;
    return (
      total +
      Object.values(subjEntry).reduce(
        (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
        0
      )
    );
  }, 0);

  const attendanceMarkedCount = Object.keys(attendanceRecords || {}).length;

  const nextTest = [...tests]
    .filter((t) => t.status === "Scheduled")
    .sort((a, b) => {
      const aDate = new Date(`${a.date || ""}T${a.time || "00:00"}`).getTime();
      const bDate = new Date(`${b.date || ""}T${b.time || "00:00"}`).getTime();
      return aDate - bDate;
    })[0];

  return (
    <div className="page-container teacher-page teacher-dashboard">
      <div className="teacher-hero-card student-hero-card">
        <div className="hero-copy">
          <div className="hero-tags">
            <span className="pill hero-pill">Teacher</span>
            {user?.name && <span className="pill hero-pill">{user.name}</span>}
          </div>
          <h1>Welcome back, {user?.name || "Teacher"} 👋</h1>
          <p className="subtitle">
            Plan weekly tests, assign homework, track attendance—all in one glance.
          </p>
          <div className="hero-stats-grid">
            <div className="hero-stat">
              <span className="stat-label">Tests planned</span>
              <span className="stat-value">{tests.length}</span>
              <span className="stat-sub">Scheduled and draft</span>
            </div>
            <div className="hero-stat">
              <span className="stat-label">Question bank</span>
              <span className="stat-value">{bankQuestionCount}</span>
              <span className="stat-sub">Reusable questions</span>
            </div>
            <div className="hero-stat">
              <span className="stat-label">Homework</span>
              <span className="stat-value">{homework.length}</span>
              <span className="stat-sub">Assigned items</span>
            </div>
          </div>
        </div>
        <div className="hero-panel">
          <div className="panel-label">Weekly overview</div>
          <div className="panel-bubble">
            <div className="bubble-icon">📅</div>
            <div>
              <div className="bubble-title">Next test</div>
              <div className="bubble-sub">
                {nextTest
                  ? `${nextTest.subject} - ${nextTest.className} (${nextTest.date})`
                  : "No tests scheduled"}
              </div>
            </div>
          </div>
          <div className="panel-bubble">
            <div className="bubble-icon">✅</div>
            <div>
              <div className="bubble-title">Attendance sheets</div>
              <div className="bubble-sub">
                {attendanceMarkedCount ? `${attendanceMarkedCount} records saved` : "Not marked yet"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card student-action-card teacher-action-card">
        <div className="section-header">
          <div>
            <div className="section-title">Quick actions</div>
            <div className="section-sub">Jump to a workflow</div>
          </div>
          <span className="mini-pill">Daily tools</span>
        </div>
        <div className="student-action-grid teacher-action-grid">
          <button
            className={`action-tile ${activePanel === "create" ? "active" : ""}`}
            type="button"
            onClick={() => setActivePanel("create")}
          >
            <span className="tile-icon upcoming">🚀</span>
            <div className="tile-body">
              <div className="tile-title">Create Test</div>
              <div className="tile-sub">Plan a new weekly test</div>
            </div>
            <span className="tile-chip">{tests.length}</span>
          </button>
          <button
            className={`action-tile ${activePanel === "add" ? "active" : ""}`}
            type="button"
            onClick={() => setActivePanel("add")}
          >
            <span className="tile-icon results">✏️</span>
            <div className="tile-body">
              <div className="tile-title">Add Questions</div>
              <div className="tile-sub">Write or upload items</div>
            </div>
            <span className="tile-chip">Bank</span>
          </button>
          <button
            className={`action-tile ${activePanel === "bank" ? "active" : ""}`}
            type="button"
            onClick={() => setActivePanel("bank")}
          >
            <span className="tile-icon present">📚</span>
            <div className="tile-body">
              <div className="tile-title">Question Bank</div>
              <div className="tile-sub">Curate and manage</div>
            </div>
            <span className="tile-chip">{bankQuestionCount}</span>
          </button>
          <button
            className={`action-tile ${activePanel === "homework" ? "active" : ""}`}
            type="button"
            onClick={() => setActivePanel("homework")}
          >
            <span className="tile-icon homework">📝</span>
            <div className="tile-body">
              <div className="tile-title">Assign Homework</div>
              <div className="tile-sub">Tasks and links</div>
            </div>
            <span className="tile-chip">{homework.length}</span>
          </button>
          <button
            className={`action-tile ${activePanel === "attendance" ? "active" : ""}`}
            type="button"
            onClick={() => setActivePanel("attendance")}
          >
            <span className="tile-icon present">📊</span>
            <div className="tile-body">
              <div className="tile-title">Mark Attendance</div>
              <div className="tile-sub">Save daily presence</div>
            </div>
            <span className="tile-chip">{attendanceMarkedCount}</span>
          </button>
          <button
            className={`action-tile ${activePanel === "syllabus" ? "active" : ""}`}
            type="button"
            onClick={() => setActivePanel("syllabus")}
          >
            <span className="tile-icon syllabus">🗂️</span>
            <div className="tile-body">
              <div className="tile-title">Syllabus</div>
              <div className="tile-sub">Share outlines</div>
            </div>
            <span className="tile-chip">{syllabusEntries.length}</span>
          </button>
          <button
            className={`action-tile ${activePanel === "datesheet" ? "active" : ""}`}
            type="button"
            onClick={() => setActivePanel("datesheet")}
          >
            <span className="tile-icon datesheet">📆</span>
            <div className="tile-body">
              <div className="tile-title">Datesheet</div>
              <div className="tile-sub">Exam calendar</div>
            </div>
            <span className="tile-chip">{datesheetEntries.length}</span>
          </button>
          <button
            className={`action-tile ${activePanel === "upcoming" ? "active" : ""}`}
            type="button"
            onClick={() => setActivePanel("upcoming")}
          >
            <span className="tile-icon results">🔔</span>
            <div className="tile-body">
              <div className="tile-title">Upcoming Tests</div>
              <div className="tile-sub">Schedule overview</div>
            </div>
            <span className="tile-chip">{tests.length}</span>
          </button>
        </div>
      </div>

      {showClassPicker && (
          <div
            className="modal-backdrop picker"
            onClick={closePickers}
          >
            <div
              className="modal-panel picker-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Select Class</h2>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={closePickers}
                >
                  Close
                </button>
              </div>
            <p className="subtitle">
              Pick a class for the new test. This replaces manual typing.
            </p>
            <div className="class-grid">
                {classOptions.map((opt) => (
                  <button
                    key={opt.name}
                    type="button"
                    className="class-card"
                    onClick={() => {
                      if (pickerTarget === "create-class") setClassName(opt.name);
                      if (pickerTarget === "bank-class") setBankClassFilter(opt.name);
                      closePickers();
                    }}
                  >
                  <div
                    className="class-card-badge"
                    style={{ background: opt.color }}
                  >
                    {opt.tag}
                  </div>
                  <div className="class-card-body">
                    <h3>{opt.name}</h3>
                    <p>{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSubjectPicker && (
        <div
          className="modal-backdrop picker"
          onClick={closePickers}
        >
          <div
            className="modal-panel picker-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Select Subject</h2>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={closePickers}
              >
                Close
              </button>
            </div>
            <p className="subtitle">
              Pick a subject for the new test. This replaces manual typing.
            </p>
            <div className="class-grid">
              {subjectOptions.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  className="class-card"
                  onClick={() => {
                    if (pickerTarget === "create-subject") setSubject(opt.name);
                    if (pickerTarget === "bank-subject") {
                      setBankSubjectFilter(opt.name);
                      setBankClassFilter("All");
                    }
                    closePickers();
                  }}
                >
                  <div
                    className="class-card-badge"
                    style={{ background: opt.color }}
                  >
                    {opt.name[0]}
                  </div>
                  <div className="class-card-body">
                    <h3>{opt.name}</h3>
                    <p>{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activePanel && (
        <div
          className="modal-backdrop"
          onClick={() => setActivePanel(null)}
        >
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {activePanel === "create"
                  ? "Create New Test"
                  : activePanel === "add"
                  ? "Add Questions"
                  : activePanel === "bank"
                  ? "Question Bank"
                  : activePanel === "homework"
                  ? "Assign Homework"
                  : activePanel === "attendance"
                  ? "Mark Attendance"
                  : activePanel === "syllabus"
                  ? "Syllabus"
                  : activePanel === "datesheet"
                  ? "Datesheet"
                  : "Upcoming Tests"}
                </h2>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setActivePanel(null)}
                >
                  Close
                </button>
              </div>
              {activePanel === "create" && (
              <>
                <form className="form-grid" onSubmit={handleCreateTest}>
                  <label>
                    Subject
                    <div className="class-picker-trigger">
                      <span className="pill pill-soft">
                        {subject || "Select a subject"}
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => openSubjectPicker("create-subject")}
                      >
                        Choose
                      </button>
                    </div>
                  </label>
                  <label>
                    Class / Section
                    <div className="class-picker-trigger">
                      <span className="pill pill-soft">
                        {className || "Select a class"}
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => openClassPicker("create-class")}
                      >
                        Choose
                      </button>
                    </div>
                  </label>
                  <label>
                    Date
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </label>
                  <label>
                    Start Time
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </label>
                  <label>
                    Duration (minutes)
                    <input
                      type="number"
                      min="5"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                    />
                  </label>
                  <label>
                    Difficulty
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </label>
                  <button type="submit" className="btn btn-primary full-width full-row">
                    {pendingTest ? "Select questions to finish" : "Create Test"}
                  </button>
                </form>

                {pendingTest && (
                  <section className="card" style={{ marginTop: "14px" }}>
                    <h3>
                      Select Questions for {pendingTest.subject} ({pendingTest.className})
                    </h3>
                    <p className="subtitle">
                      Choose questions from the bank below. You can add more questions first if
                      needed, then return here.
                    </p>
                    <div className="question-preview">
                      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                        <button className="btn btn-outline" type="button" onClick={handleSelectAll}>
                          Select All
                        </button>
                        <button className="btn btn-outline" type="button" onClick={() => setSelectedQuestionIds([])}>
                          Clear Selection
                        </button>
                      </div>
                      {(() => {
                        const list = getQuestionsForSubjectAndClass(
                          pendingTest.subject,
                          pendingTest.className,
                          questionBank
                        );
                        return list.length === 0 ? (
                          <p>No questions in this subject/class yet.</p>
                        ) : (
                          <ul className="question-list">
                            {list.map((q) => (
                              <li key={q.id}>
                                <label className="option-label">
                                  <input
                                    type="checkbox"
                                    checked={selectedQuestionIds.includes(q.id)}
                                    onChange={() => handleToggleQuestion(q.id)}
                                  />
                                  <div>
                                    <strong>{q.id}.</strong> {q.question}{" "}
                                    <span className="pill pill-soft" style={{ marginLeft: "6px" }}>
                                      {q.difficulty || "Difficulty not set"}
                                    </span>
                                    <ol className="option-list" type="A">
                                      {q.options.map((opt, idx) => (
                                        <li key={`${q.id}-${idx}`}>
                                          <div>
                                            {opt.text || opt}
                                            {idx === q.correctIndex ? " (answer)" : ""}
                                          </div>
                                        </li>
                                      ))}
                                    </ol>
                                  </div>
                                </label>
                              </li>
                            ))}
                          </ul>
                        );
                      })()}
                    </div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button className="btn btn-primary" type="button" onClick={handleConfirmQuestions}>
                        Save Test with Selected Questions
                      </button>
                      <button className="btn btn-outline" type="button" onClick={handleCancelSelection}>
                        Cancel
                      </button>
                    </div>
                  </section>
                )}
              </>
            )}

            {activePanel === "add" && (
              <>
                <form className="form-grid add-question-grid" onSubmit={handleAddQuestion}>
                  <label>
                    Question Subject
                    <select
                      value={selectedQuestionSubject}
                      onChange={(e) => setSelectedQuestionSubject(e.target.value)}
                    >
                      {subjectOptions.map((opt) => (
                        <option key={opt.name} value={opt.name}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Question Class
                    <select
                      value={selectedQuestionClass}
                      onChange={(e) => setSelectedQuestionClass(e.target.value)}
                    >
                      {classOptions.map((opt) => (
                        <option key={opt.name} value={opt.name}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Difficulty
                    <select
                      value={questionDifficulty}
                      onChange={(e) => setQuestionDifficulty(e.target.value)}
                    >
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </label>
              <label>
                Question
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Type the question here"
                />
              </label>
              <div className="option-pair">
                <label>
                  Option A
                  <input
                    type="text"
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    placeholder="Required"
                  />
                </label>
                <label>
                  Option A Image (optional)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setOptionAImage(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </label>
              </div>
              <div className="option-pair">
                <label>
                  Option B
                  <input
                    type="text"
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    placeholder="Required"
                  />
                </label>
                <label>
                  Option B Image (optional)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setOptionBImage(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </label>
              </div>
              <div className="option-pair">
                <label>
                  Option C
                  <input
                    type="text"
                    value={optionC}
                    onChange={(e) => setOptionC(e.target.value)}
                    placeholder="Optional"
                  />
                </label>
                <label>
                  Option C Image (optional)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setOptionCImage(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </label>
              </div>
              <div className="option-pair">
                <label>
                  Option D
                  <input
                    type="text"
                    value={optionD}
                    onChange={(e) => setOptionD(e.target.value)}
                    placeholder="Optional"
                  />
                </label>
                <label>
                  Option D Image (optional)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setOptionDImage(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </label>
              </div>
                  <label>
                    Correct Option (A-D)
                    <select
                      value={correctOption}
                      onChange={(e) => setCorrectOption(e.target.value)}
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </label>
                  <button
                    type="submit"
                    className="btn btn-primary full-width full-row"
                  >
                    Add Question
                  </button>
                </form>

              </>
            )}

            {activePanel === "attendance" && (
              <>
                <div className="form-grid" style={{ marginTop: "8px" }}>
                  <label>
                    Class
                    <select
                      value={attendanceClass}
                      onChange={(e) => setAttendanceClass(e.target.value)}
                    >
                      <option value="">Select class</option>
                      {classOptions.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Date
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                    />
                  </label>
                </div>
                {attendanceClass ? (
                  <div style={{ marginTop: "10px" }}>
                    <strong>Mark attendance for {attendanceClass}</strong>
                    <div className="class-grid" style={{ marginTop: "8px" }}>
                      {(mockStudentsByClass[attendanceClass] || []).map((student) => {
                        const key = `${attendanceClass}|${attendanceDate}`;
                        const status = attendanceRecords[key]?.[student.roll];
                        return (
                          <div
                            key={`${student.roll}-${student.name}`}
                            className="class-card"
                            style={{ alignItems: "center" }}
                          >
                            <div className="class-card-body">
                              <h3 style={{ marginBottom: "4px" }}>
                                {student.name} (Roll: {student.roll})
                              </h3>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                  type="button"
                                  className={`btn btn-sm ${status === true ? "btn-primary" : "btn-outline"}`}
                                  onClick={() => handleAttendanceToggle(student.roll, true)}
                                >
                                  Present
                                </button>
                                <button
                                  type="button"
                                  className={`btn btn-sm ${status === false ? "btn-danger" : "btn-outline"}`}
                                  onClick={() => handleAttendanceToggle(student.roll, false)}
                                >
                                  Absent
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {(mockStudentsByClass[attendanceClass] || []).length === 0 && (
                        <p style={{ gridColumn: "1 / -1" }}>No students listed for this class.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p style={{ marginTop: "10px" }}>Select a class to mark attendance.</p>
                )}
              </>
            )}

            {activePanel === "syllabus" && (
              <section className="card" style={{ boxShadow: "none", padding: 0 }}>
                <h3>Add Syllabus</h3>
                <form
                  className="form-grid"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!syllabusSubject || !syllabusClass) return;
                    const newItem = {
                      id: "SYL" + (syllabusEntries.length + 1),
                      subject: syllabusSubject,
                      className: syllabusClass,
                      notes: syllabusNotes.trim(),
                      link: syllabusLink.trim(),
                    };
                    setSyllabusEntries((prev) => [...prev, newItem]);
                    setSyllabusSubject("");
                    setSyllabusClass("");
                    setSyllabusNotes("");
                    setSyllabusLink("");
                    setActivePanel(null);
                  }}
                >
                  <label>
                    Subject
                    <select
                      value={syllabusSubject}
                      onChange={(e) => setSyllabusSubject(e.target.value)}
                    >
                      <option value="">Select subject</option>
                      {subjectOptions
                        .filter((s) => s.name !== "All Subjects")
                        .map((s) => (
                          <option key={s.name} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Class
                    <select
                      value={syllabusClass}
                      onChange={(e) => setSyllabusClass(e.target.value)}
                    >
                      <option value="">Select class</option>
                      {classOptions.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Notes
                    <textarea
                      rows="3"
                      value={syllabusNotes}
                      onChange={(e) => setSyllabusNotes(e.target.value)}
                      placeholder="Topics covered, chapters, PDFs, etc."
                    />
                  </label>
                  <label>
                    Resource Link (optional)
                    <input
                      type="url"
                      value={syllabusLink}
                      onChange={(e) => setSyllabusLink(e.target.value)}
                      placeholder="https://..."
                    />
                  </label>
                  <button type="submit" className="btn btn-primary full-width full-row">
                    Save Syllabus
                  </button>
                </form>

                <div style={{ marginTop: "12px" }}>
                  <h4>Recent Syllabus</h4>
                  {syllabusEntries.length === 0 ? (
                    <p>No syllabus added yet.</p>
                  ) : (
                    <ul className="question-list">
                      {syllabusEntries.slice(-5).reverse().map((item) => (
                        <li key={item.id}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                            <div>
                              <strong>{item.subject}</strong> — {item.className}
                              <div className="subtitle">{item.notes || "No notes"}</div>
                              {item.link ? (
                                <div style={{ marginTop: "4px" }}>
                                  <a href={item.link} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                                    Open Resource
                                  </a>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            )}

            {activePanel === "datesheet" && (
              <section className="card" style={{ boxShadow: "none", padding: 0 }}>
                <h3>Add Datesheet Entry</h3>
                <form
                  className="form-grid"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!datesheetSubject || !datesheetClass) return;
                    const newItem = {
                      id: "DS" + (datesheetEntries.length + 1),
                      subject: datesheetSubject,
                      className: datesheetClass,
                      date: datesheetDate,
                      time: datesheetTime,
                      notes: datesheetNotes.trim(),
                      link: datesheetLink.trim(),
                    };
                    setDatesheetEntries((prev) => [...prev, newItem]);
                    setDatesheetSubject("");
                    setDatesheetClass("");
                    setDatesheetDate("");
                    setDatesheetTime("");
                    setDatesheetNotes("");
                    setDatesheetLink("");
                    setActivePanel(null);
                  }}
                >
                  <label>
                    Subject
                    <select
                      value={datesheetSubject}
                      onChange={(e) => setDatesheetSubject(e.target.value)}
                    >
                      <option value="">Select subject</option>
                      {subjectOptions
                        .filter((s) => s.name !== "All Subjects")
                        .map((s) => (
                          <option key={s.name} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Class
                    <select
                      value={datesheetClass}
                      onChange={(e) => setDatesheetClass(e.target.value)}
                    >
                      <option value="">Select class</option>
                      {classOptions.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Exam Date
                    <input
                      type="date"
                      value={datesheetDate}
                      onChange={(e) => setDatesheetDate(e.target.value)}
                    />
                  </label>
                  <label>
                    Time
                    <input
                      type="time"
                      value={datesheetTime}
                      onChange={(e) => setDatesheetTime(e.target.value)}
                    />
                  </label>
                  <label>
                    Notes
                    <textarea
                      rows="3"
                      value={datesheetNotes}
                      onChange={(e) => setDatesheetNotes(e.target.value)}
                      placeholder="Venue, instructions, materials, etc."
                    />
                  </label>
                  <label>
                    Attachment Link (optional)
                    <input
                      type="url"
                      value={datesheetLink}
                      onChange={(e) => setDatesheetLink(e.target.value)}
                      placeholder="https://..."
                    />
                  </label>
                  <button type="submit" className="btn btn-primary full-width full-row">
                    Save Datesheet
                  </button>
                </form>

                <div style={{ marginTop: "12px" }}>
                  <h4>Recent Datesheet</h4>
                  {datesheetEntries.length === 0 ? (
                    <p>No datesheet entries yet.</p>
                  ) : (
                    <ul className="question-list">
                      {datesheetEntries.slice(-5).reverse().map((item) => (
                        <li key={item.id}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                            <div>
                              <strong>{item.subject}</strong> — {item.className}
                              <div className="subtitle">
                                {item.date || "Date TBA"} {item.time ? `at ${item.time}` : ""}
                              </div>
                              <div className="subtitle">{item.notes || "No notes"}</div>
                              {item.link ? (
                                <div style={{ marginTop: "4px" }}>
                                  <a href={item.link} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                                    Open Attachment
                                  </a>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            )}

            {activePanel === "upcoming" && (
              <section className="card" style={{ boxShadow: "none", padding: 0 }}>
                <h3>Upcoming Tests</h3>
                {tests.length === 0 ? (
                  <p>No tests created yet.</p>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Subject</th>
                        <th>Class</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Duration</th>
                        <th>Difficulty</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tests.map((test) => (
                        <tr key={test.id}>
                          <td>{test.id}</td>
                          <td>{test.subject}</td>
                          <td>{test.className}</td>
                          <td>{test.date}</td>
                          <td>{test.time}</td>
                          <td>{test.durationMinutes} min</td>
                          <td>{test.difficulty || "Not set"}</td>
                          <td>{test.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            )}

            {activePanel === "bank" && (
              <section className="card">
                <h3>Question Bank</h3>
                <div className="form-grid" style={{ marginBottom: "10px" }}>
                  <label>
                    Filter by Subject
                    <div className="class-picker-trigger">
                      <span className="pill pill-soft">
                        {bankSubjectFilter}
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => openSubjectPicker("bank-subject")}
                      >
                        Choose
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setBankSubjectFilter("All");
                          setBankClassFilter("All");
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </label>
                  <label>
                    Filter by Class
                    <div className="class-picker-trigger">
                      <span className="pill pill-soft">
                        {bankClassFilter}
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => openClassPicker("bank-class")}
                        disabled={bankSubjectFilter === "All"}
                      >
                        Choose
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => setBankClassFilter("All")}
                      >
                        Clear
                      </button>
                    </div>
                  </label>
                 
                </div>
                {Object.keys(questionBank).length === 0 ? (
                  <p>No questions in the bank yet. Add some above.</p>
                ) : (
                  Object.keys(questionBank)
                    .filter((subj) => bankSubjectFilter === "All" || subj === bankSubjectFilter)
                    .map((subj) => {
                      const classes = questionBank[subj];
                      const classKeys = Object.keys(classes).filter(
                        (cls) => bankClassFilter === "All" || cls === bankClassFilter
                      );
                      if (classKeys.length === 0) return null;
                      return (
                        <div key={subj} style={{ marginBottom: "12px" }}>
                          <h4 style={{ marginBottom: "6px" }}>{subj}</h4>
                          {classKeys.map((cls) => (
                            <div key={`${subj}-${cls}`} style={{ marginLeft: "10px", marginBottom: "6px" }}>
                              <strong>{cls}</strong>
                              <ul className="question-list">
                                {questionBank[subj][cls].map((q) => (
                                  <li key={`${subj}-${cls}-${q.id}`}>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "10px",
                                      }}
                                    >
                                      <div>
                                        <strong>{q.id}.</strong> {q.question}{" "}
                                        <span className="pill pill-soft" style={{ marginLeft: "6px" }}>
                                          {q.difficulty || "Difficulty not set"}
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        className="btn btn-outline btn-sm"
                                        onClick={() =>
                                          handleDeleteQuestionFromBank(
                                            subj,
                                            cls,
                                            q.id
                                          )
                                        }
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      );
                    })
                )}
              </section>
            )}

            {activePanel === "homework" && (
              <section className="card">
                <h3>Assign Homework</h3>
                <form className="form-grid" onSubmit={handleCreateHomework}>
                  <label>
                    Subject
                    <select
                      value={homeworkSubject}
                      onChange={(e) => setHomeworkSubject(e.target.value)}
                    >
                      <option value="">Select subject</option>
                      {subjectOptions
                        .filter((s) => s.name !== "All Subjects")
                        .map((s) => (
                          <option key={s.name} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Class
                    <select
                      value={homeworkClass}
                      onChange={(e) => setHomeworkClass(e.target.value)}
                    >
                      <option value="">Select class</option>
                      {classOptions.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Title
                    <input
                      type="text"
                      value={homeworkTitle}
                      onChange={(e) => setHomeworkTitle(e.target.value)}
                      placeholder="e.g., Algebra practice set"
                    />
                  </label>
                  <label>
                    Description
                    <textarea
                      rows="3"
                      value={homeworkDescription}
                      onChange={(e) => setHomeworkDescription(e.target.value)}
                      placeholder="Short notes or instructions"
                    />
                  </label>
                  <label>
                    Due Date
                    <input
                      type="date"
                      value={homeworkDue}
                      onChange={(e) => setHomeworkDue(e.target.value)}
                    />
                  </label>
                  <label>
                    Resource Link (optional)
                    <input
                      type="url"
                      value={homeworkLink}
                      onChange={(e) => setHomeworkLink(e.target.value)}
                      placeholder="https://..."
                    />
                  </label>
                  <button type="submit" className="btn btn-primary full-width full-row">
                    Assign Homework
                  </button>
                </form>

                <div style={{ marginTop: "12px" }}>
                  <h4>Recent Homework</h4>
                  {homework.length === 0 ? (
                    <p>No homework assigned yet.</p>
                  ) : (
                    <ul className="question-list">
                      {homework.slice(-5).reverse().map((hw) => (
                        <li key={hw.id}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                            <div>
                              <strong>{hw.title}</strong> — {hw.subject} ({hw.className})
                              <div className="subtitle">
                                {hw.description || "No description"} {hw.dueDate ? `· Due: ${hw.dueDate}` : ""}
                                {hw.link ? ` · Link available` : ""}
                              </div>
                              {hw.link ? (
                                <div style={{ marginTop: "4px" }}>
                                  <a href={hw.link} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                                    Open Resource
                                  </a>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default TeacherDashboard;
