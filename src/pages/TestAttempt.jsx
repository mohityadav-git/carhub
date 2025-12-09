import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { studentMockTests } from "../data/localData";

/*
  Dummy questions for demo/fallback.
  In real app, fetch from backend using testId.
*/
const fallbackQuestions = [
  {
    id: 1,
    question: "What is 7 + 5?",
    options: ["10", "11", "12", "13"],
    correctIndex: 2, // index of "12"
  },
  {
    id: 2,
    question: "What is 9 × 3?",
    options: ["18", "21", "24", "27"],
    correctIndex: 1, // "21"
  },
  {
    id: 3,
    question: "What is 15 ÷ 6 (rounded)?",
    options: ["2", "3", "4", "5"],
    correctIndex: 2, // "4"
  },
];

const TEST_DURATION_MIN = 5; // demo timer
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
        correctIndex:
          typeof q.correctIndex === "number" ? q.correctIndex : 0,
      }));
    }
    return fallbackQuestions;
  }, [testId]);

  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(TEST_DURATION_MIN * 60);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

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
  };

  const handleSubmit = () => {
    if (submitted) return;

    let sc = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) sc += 1;
    });
    setScore(sc);
    setSubmitted(true);

    // Persist student-specific completion so it is removed from upcoming list
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
    }, 3000);
  };

  const mm = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const ss = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <div className="page-container">
      <h1>Test: {testMeta?.subject || testId}</h1>
      <p className="subtitle">
        {testMeta?.className ? `${testMeta.className} • ` : ""}
        Answer the questions below. The test will auto-submit when time is over.
      </p>

      <div className="test-header">
        <div className="badge">Duration: {TEST_DURATION_MIN} min</div>
        <div className="badge badge-timer">
          Time Left: {mm}:{ss}
        </div>
      </div>

      <form
        className="card test-card"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {questions.map((q) => (
          <div key={q.id} className="question-block">
            <h3>
              Q{q.id}. {q.question}
            </h3>
            <div className="options">
              {q.options.map((opt, idx) => {
                const label = typeof opt === "string" ? opt : opt.text;
                const imageUrl =
                  typeof opt === "string" ? null : opt.imageUrl;
                return (
                  <label key={idx} className="option-label">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={idx}
                      disabled={submitted}
                      checked={answers[q.id] === idx}
                      onChange={() => handleChange(q.id, idx)}
                    />
                    <span>{label}</span>
                    {imageUrl && (
                      <div className="option-image">
                        <img
                          src={imageUrl}
                          alt={`Option ${idx + 1} for ${q.id}`}
                          style={{ maxWidth: "160px" }}
                        />
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="btn btn-primary full-width"
          disabled={submitted}
        >
          {submitted ? "Submitted" : "Submit Test"}
        </button>

        {submitted && (
          <div className="result-banner">
            Your score: {score}/{questions.length}. Redirecting to dashboard...
          </div>
        )}
      </form>
    </div>
  );
}

export default TestAttempt;
