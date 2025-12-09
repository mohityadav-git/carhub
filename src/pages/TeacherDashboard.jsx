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
  return {
    id: `Q${idx + 1}`,
    question: `${subject} sample ${idx + 1} for ${className}: What is ${numA} + ${numB}?`,
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
    return hasBankData(parsed) ? parsed : defaultQuestionBank;
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
  const [optionAImage, setOptionAImage] = useState(null);
  const [optionBImage, setOptionBImage] = useState(null);
  const [optionCImage, setOptionCImage] = useState(null);
  const [optionDImage, setOptionDImage] = useState(null);
  const [correctOption, setCorrectOption] = useState("0");
  const [pendingTest, setPendingTest] = useState(null);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState(null); // create-class, create-subject, bank-class, bank-subject
  const [activePanel, setActivePanel] = useState(null); // 'create', 'add', 'bank'
  const [bankSubjectFilter, setBankSubjectFilter] = useState("All");
  const [bankClassFilter, setBankClassFilter] = useState("All");

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
    const subjectQuestions =
      (questionBank[subject] &&
        (questionBank[subject][className] || questionBank[subject].All)) ||
      [];

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
    const parsedIndex = Number.parseInt(correctOption, 10);
    const safeIndex = Number.isNaN(parsedIndex)
      ? 0
      : Math.min(optionList.length - 1, parsedIndex);

    const classKey = selectedQuestionClass.trim();
    const existingList =
      (questionBank[selectedQuestionSubject] &&
        (questionBank[selectedQuestionSubject][classKey] ||
          questionBank[selectedQuestionSubject].All)) ||
      [];

    const newQuestion = {
      id: `Q${existingList.length + 1}`,
      question: questionText.trim(),
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
    setOptionAImage(null);
    setOptionBImage(null);
    setOptionCImage(null);
    setOptionDImage(null);
    setCorrectOption("0");
  };

  useEffect(() => {
    localStorage.setItem("teacherTests", JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem("teacherQuestionBank", JSON.stringify(questionBank));
  }, [questionBank]);

  // If the bank was previously cleared in storage, reseed with local samples
  useEffect(() => {
    if (!hasBankData(questionBank)) {
      const seeded = normalizeBank(buildInitialQuestionBank());
      setQuestionBank(seeded);
      localStorage.setItem("teacherQuestionBank", JSON.stringify(seeded));
    }
  }, [questionBank]);

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
    const subjectEntry = questionBank[pendingTest.subject] || {};
    const list =
      subjectEntry[pendingTest.className] ||
      subjectEntry.All ||
      [];
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

  return (
    <div className="page-container">
      <h1>Teacher Dashboard</h1>
      <p className="subtitle">
        Welcome, <strong>{user?.name}</strong>. Here you can create and manage
        weekly tests.
      </p>

      <div className="card" style={{ marginBottom: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          className={`btn btn-primary btn-sm ${activePanel === "create" ? "active" : ""}`}
          type="button"
          onClick={() => setActivePanel("create")}
        >
          Create Test
        </button>
        <button
          className={`btn btn-primary btn-sm ${activePanel === "add" ? "active" : ""}`}
          type="button"
          onClick={() => setActivePanel("add")}
        >
          Add Questions
        </button>
        <button
          className={`btn btn-primary btn-sm ${activePanel === "bank" ? "active" : ""}`}
          type="button"
          onClick={() => setActivePanel("bank")}
        >
          Question Bank
        </button>
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
                  : "Question Bank"}
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
                        const entry = questionBank[pendingTest.subject] || {};
                        const list = entry[pendingTest.className] || entry.All || [];
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
                                    <strong>{q.id}.</strong> {q.question}
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
                    <input
                      type="text"
                      value={selectedQuestionSubject}
                      onChange={(e) => setSelectedQuestionSubject(e.target.value)}
                      placeholder="e.g. Mathematics, Science"
                    />
                  </label>
                  <label>
                    Question Class
                    <input
                      type="text"
                      value={selectedQuestionClass}
                      onChange={(e) => setSelectedQuestionClass(e.target.value)}
                      placeholder="e.g. Class 5"
                    />
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
                    Correct Option (0-3)
                    <input
                      type="number"
                      min="0"
                      max="3"
                      value={correctOption}
                      onChange={(e) => setCorrectOption(e.target.value)}
                    />
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
                                        <strong>{q.id}.</strong> {q.question}
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
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <section className="card">
          <h2>Upcoming Tests</h2>
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
      </div>
    </div>
  );
}

export default TeacherDashboard;
