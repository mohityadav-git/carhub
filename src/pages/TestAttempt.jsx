import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { studentMockTests } from "../data/localData";

const fallbackQuestions = [
  {
    id: 1,
    question: "Which of the following Table Tennis World Championship events was held in India?",
    options: [
      "19th World Championships, 1952",
      "17th World Championships, 1950",
      "20th World Championships, 1953",
      "18th World Championships, 1951",
    ],
    correctIndex: 0,
  },
  {
    id: 2,
    question: "Mathematics sample 1 for Class 3: What is 2 + 3?",
    options: ["5", "6", "4", "7"],
    correctIndex: 0,
  },
  {
    id: 3,
    question: "Mathematics sample 2 for Class 3: What is 3 + 4?",
    options: ["7", "8", "6", "9"],
    correctIndex: 1,
  },
  {
    id: 4,
    question: "Mathematics sample 3 for Class 3: What is 4 + 5?",
    options: ["9", "10", "8", "11"],
    correctIndex: 0,
  },
];

const TEST_DURATION_MIN = 30;
const STUDENT_RECORDS_KEY = "studentTestRecords";

function TestAttempt() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const studentKey = useMemo(
    () => `${user?.name || "guest"}|${user?.className || "unknown"}`,
    [user]
  );

  const testMeta = useMemo(() => {
    const storedTests = localStorage.getItem("teacherTests");
    const teacherTests = storedTests ? JSON.parse(storedTests) : [];
    const teacherMatch = teacherTests.find((t) => t.id === testId);
    if (teacherMatch) return teacherMatch;
    return studentMockTests.find((t) => t.id === testId) || null;
  }, [testId]);

  const questions = useMemo(() => {
    const storedQuestions = localStorage.getItem("teacherQuestions");
    const parsed = storedQuestions ? JSON.parse(storedQuestions) : {};
    const qList = parsed[testId];
    if (Array.isArray(qList) && qList.length > 0) {
      return qList.map((q, idx) => ({
        id: q.id || idx + 1,
        question: q.question,
        options: q.options || [],
        correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
      }));
    }
    return fallbackQuestions;
  }, [testId]);

  const [answers, setAnswers] = useState({});
  const [reviewMarks, setReviewMarks] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(TEST_DURATION_MIN * 60);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (submitted) return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, submitted]);

  const handleChange = (qId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
    setReviewMarks((prev) => ({ ...prev, [qId]: false }));
  };

  const goTo = (idx) => {
    const next = Math.min(Math.max(idx, 0), questions.length - 1);
    setCurrentIndex(next);
  };

  const handleReviewNext = () => {
    const q = questions[currentIndex];
    setReviewMarks((prev) => ({ ...prev, [q.id]: true }));
    goTo(currentIndex + 1);
  };

  const handleSaveNext = () => {
    if (currentIndex === questions.length - 1) {
      handleSubmit();
    } else {
      goTo(currentIndex + 1);
    }
  };

  const handleSubmit = () => {
    if (submitted) return;

    let sc = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) sc += 1;
    });
    setScore(sc);
    setSubmitted(true);

    const storedRecords = localStorage.getItem(STUDENT_RECORDS_KEY);
    const parsedRecords = storedRecords ? JSON.parse(storedRecords) : {};
    const prev = parsedRecords[studentKey] || { completed: [] };
    const filtered = (prev.completed || []).filter((t) => t.id !== testId);

    const completion = {
      id: testId,
      subject: testMeta?.subject || "Unknown",
      className: testMeta?.className || user?.className || "",
      date: testMeta?.date || new Date().toISOString().slice(0, 10),
      time: testMeta?.time || "",
      durationMinutes: testMeta?.durationMinutes || 0,
      score: sc,
      outOf: questions.length,
      submittedAt: new Date().toISOString(),
    };

    parsedRecords[studentKey] = { completed: [...filtered, completion] };
    localStorage.setItem(STUDENT_RECORDS_KEY, JSON.stringify(parsedRecords));

    setTimeout(() => {
      navigate("/student");
    }, 2000);
  };

  const mm = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const ss = (secondsLeft % 60).toString().padStart(2, "0");

  const currentQuestion = questions[currentIndex];

  const paletteStatus = (q, idx) => {
    if (idx === currentIndex) return "current";
    if (reviewMarks[q.id]) return "review";
    if (answers[q.id] !== undefined) return "answered";
    return "unanswered";
  };

  const studentName = user?.name || "Student";
  const subjectLabel = testMeta?.subject || "General Awareness";

  return (
    <div className="mock-layout">
      <div className="mock-banner">
        <span className="mock-note">Good luck, {studentName}!</span>
        <div className="mock-badges">
          <span className="mock-badge">Duration: {testMeta?.durationMinutes || TEST_DURATION_MIN} min</span>
          <span className="mock-badge warning">
            Time Left: {mm}:{ss}
          </span>
        </div>
      </div>

      <div className="mock-body">
        <aside className="mock-sidebar">
          <div className="mock-section-title">{subjectLabel}</div>
          <div className="mock-palette">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                type="button"
                className={`mock-palette-btn ${paletteStatus(q, idx)}`}
                onClick={() => goTo(idx)}
              >
                {q.id}
              </button>
            ))}
          </div>
        </aside>

        <section className="mock-main">
          <div className="mock-toolbar">
            <div className="mock-question-label">
              Question : {currentQuestion.id}
            </div>
            <div className="mock-actions">
              <button
                type="button"
                className="mock-btn secondary"
                onClick={handleReviewNext}
                disabled={submitted}
              >
                Mark for Review & Next
              </button>
              <button
                type="button"
                className="mock-btn primary"
                onClick={handleSaveNext}
                disabled={submitted}
              >
                Save & Next
              </button>
            </div>
          </div>

          <div className="mock-question-card">
            <p className="mock-question-text">{currentQuestion.question}</p>
            <div className="mock-options">
              {currentQuestion.options.map((opt, idx) => {
                const label = typeof opt === "string" ? opt : opt.text;
                return (
                  <label key={idx} className="mock-option-row">
                    <input
                      type="radio"
                      name={`q-${currentQuestion.id}`}
                      value={idx}
                      disabled={submitted}
                      checked={answers[currentQuestion.id] === idx}
                      onChange={() => handleChange(currentQuestion.id, idx)}
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {submitted && (
        <div className="result-banner" style={{ maxWidth: "1120px", margin: "10px auto 0" }}>
          Your score: {score}/{questions.length}. Redirecting to dashboard...
        </div>
      )}
    </div>
  );
}

export default TestAttempt;
