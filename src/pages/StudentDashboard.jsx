import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { studentMockTests } from "../data/localData";

const STUDENT_RECORDS_KEY = "studentTestRecords";

function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAttendance, setShowAttendance] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [showHomework, setShowHomework] = useState(false);
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [showDatesheet, setShowDatesheet] = useState(false);

  const studentKey = useMemo(
    () => `${user?.name || "guest"}|${user?.className || "unknown"}`,
    [user]
  );

  const studentRecords = useMemo(() => {
    const stored = localStorage.getItem(STUDENT_RECORDS_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    return parsed[studentKey] || { completed: [] };
  }, [studentKey]);

  const teacherTests = useMemo(() => {
    const stored = localStorage.getItem("teacherTests");
    if (stored) return JSON.parse(stored);
    return studentMockTests;
  }, []);

  const relevantTests = useMemo(() => {
    const classNorm = (user?.className || "").trim().toLowerCase();
    return teacherTests.filter((t) => {
      if (!t.className || !classNorm) return true;
      return t.className.trim().toLowerCase() === classNorm;
    });
  }, [teacherTests, user]);

  const completedIds = useMemo(
    () => new Set((studentRecords.completed || []).map((t) => t.id)),
    [studentRecords]
  );

  const upcomingTests = useMemo(
    () =>
      relevantTests.filter(
        (t) => t.status === "Scheduled" && !completedIds.has(t.id)
      ),
    [relevantTests, completedIds]
  );

  const pastTests = useMemo(() => {
    const list = studentRecords.completed || [];
    return [...list].sort((a, b) => {
      const aDate = new Date(a.submittedAt || a.date || 0).getTime();
      const bDate = new Date(b.submittedAt || b.date || 0).getTime();
      return bDate - aDate;
    });
  }, [studentRecords]);

  const homework = useMemo(() => {
    const stored = localStorage.getItem("teacherHomework");
    const list = stored ? JSON.parse(stored) : [];
    if (!user?.className) return list;
    const cls = user.className.trim().toLowerCase();
    return list.filter((h) => (h.className || "").trim().toLowerCase() === cls);
  }, [user]);

  const handleStartTest = (id) => {
    navigate(`/test/${id}`);
  };

  // Attendance view
  const attendanceData = useMemo(() => {
    const store = localStorage.getItem("teacherAttendance");
    if (!store || !user?.className || !user?.rollNumber) return {};
    const parsed = JSON.parse(store);
    const entries = Object.entries(parsed).filter(([key]) =>
      key.startsWith(`${user.className}|`)
    );
    const byDate = {};
    entries.forEach(([key, rec]) => {
      const [, date] = key.split("|");
      byDate[date] = rec[user.rollNumber];
    });
    return byDate;
  }, [user]);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-index
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayCells = [];
  for (let i = 0; i < startWeekday; i++) dayCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month, d).toISOString().slice(0, 10);
    dayCells.push({
      day: d,
      status: attendanceData[dateStr], // true/false/undefined
    });
  }
  const presentCount = Object.values(attendanceData).filter((v) => v === true).length;
  const absentCount = Object.values(attendanceData).filter((v) => v === false).length;
  const totalMarked = presentCount + absentCount;
  const presentPct = totalMarked ? ((presentCount / totalMarked) * 100).toFixed(1) : "0.0";
  const absentPct = totalMarked ? ((absentCount / totalMarked) * 100).toFixed(1) : "0.0";

  const upcomingCount = upcomingTests.length;
  const pastCount = pastTests.length;
  const homeworkCount = homework.length;
  const upcomingSummary = upcomingTests[0];
  const pastSummary = pastTests[0];

  return (
    <div className="page-container student-page student-dashboard">
      <div className="student-hero-card">
        <div className="hero-copy">
          <div className="hero-tags">
            {user?.className && <span className="pill hero-pill">Class {user.className}</span>}
            {user?.rollNumber && <span className="pill hero-pill">Roll {user.rollNumber}</span>}
          </div>
          <h1>Hi, {user?.name || "Student"} 👋</h1>
          <p className="subtitle">Track your weekly progress and jump into the next task.</p>
          <div className="hero-stats-grid">
            <div className="hero-stat">
              <span className="stat-label">Attendance</span>
              <span className="stat-value">{presentPct}%</span>
              <span className="stat-sub">
                {presentCount} present / {absentCount} absent
              </span>
            </div>
            <div className="hero-stat">
              <span className="stat-label">Upcoming tests</span>
              <span className="stat-value">{upcomingCount}</span>
              <span className="stat-sub">Scheduled</span>
            </div>
            <div className="hero-stat">
              <span className="stat-label">Homework</span>
              <span className="stat-value">{homeworkCount}</span>
              <span className="stat-sub">Assigned</span>
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
                {upcomingSummary
                  ? `${upcomingSummary.subject} - ${upcomingSummary.date}`
                  : "Nothing scheduled"}
              </div>
            </div>
          </div>
          <div className="panel-bubble">
            <div className="bubble-icon">🎯</div>
            <div>
              <div className="bubble-title">Latest result</div>
              <div className="bubble-sub">
                {pastSummary
                  ? `${pastSummary.subject} - ${pastSummary.score}/${pastSummary.outOf}`
                  : "Not attempted yet"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card student-action-card">
        <div className="section-header">
          <div>
            <div className="section-title">Quick actions</div>
            <div className="section-sub">Open a module to see details</div>
          </div>
          <span className="mini-pill">Updated daily</span>
        </div>
        <div className="student-action-grid">
          <button
            type="button"
            className={`action-tile ${showAttendance ? "active" : ""}`}
            onClick={() => setShowAttendance(true)}
          >
            <span className="tile-icon present">📊</span>
            <div className="tile-body">
              <div className="tile-title">Attendance</div>
              <div className="tile-sub">Monthly calendar and stats</div>
            </div>
            <span className="tile-chip">{presentPct}%</span>
          </button>
          <button
            type="button"
            className={`action-tile ${showUpcoming ? "active" : ""}`}
            onClick={() => setShowUpcoming(true)}
          >
            <span className="tile-icon upcoming">🚀</span>
            <div className="tile-body">
              <div className="tile-title">Upcoming Tests</div>
              <div className="tile-sub">Start or review schedule</div>
            </div>
            <span className="tile-chip">{upcomingCount}</span>
          </button>
          <button
            type="button"
            className={`action-tile ${showPast ? "active" : ""}`}
            onClick={() => setShowPast(true)}
          >
            <span className="tile-icon results">🎯</span>
            <div className="tile-body">
              <div className="tile-title">Past Results</div>
              <div className="tile-sub">See scores and percentages</div>
            </div>
            <span className="tile-chip">{pastCount}</span>
          </button>
          <button
            type="button"
            className={`action-tile ${showHomework ? "active" : ""}`}
            onClick={() => setShowHomework(true)}
          >
            <span className="tile-icon homework">📚</span>
            <div className="tile-body">
              <div className="tile-title">Homework</div>
              <div className="tile-sub">Tasks, links, due dates</div>
            </div>
            <span className="tile-chip">{homeworkCount}</span>
          </button>
          <button
            type="button"
            className={`action-tile ${showSyllabus ? "active" : ""}`}
            onClick={() => setShowSyllabus(true)}
          >
            <span className="tile-icon syllabus">🗂️</span>
            <div className="tile-body">
              <div className="tile-title">Syllabus</div>
              <div className="tile-sub">Latest shared outline</div>
            </div>
            <span className="tile-chip">View</span>
          </button>
          <button
            type="button"
            className={`action-tile ${showDatesheet ? "active" : ""}`}
            onClick={() => setShowDatesheet(true)}
          >
            <span className="tile-icon datesheet">📆</span>
            <div className="tile-body">
              <div className="tile-title">Datesheet</div>
              <div className="tile-sub">Exam plan at a glance</div>
            </div>
            <span className="tile-chip">Open</span>
          </button>
        </div>
      </div>

      {showAttendance && (
        <div className="modal-backdrop picker" onClick={() => setShowAttendance(false)}>
          <div
            className="modal-panel picker-panel"
            style={{ maxWidth: "900px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>
                Attendance for{" "}
                {today.toLocaleString("default", { month: "long", year: "numeric" })}
              </h2>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowAttendance(false)}
              >
                Close
              </button>
            </div>
            <p className="subtitle">
              {user?.className} | Roll {user?.rollNumber}
            </p>
            <div className="attendance-grid">
              {dayCells.map((cell, idx) =>
                cell ? (
                  <div
                    key={idx}
                    className={`attendance-cell ${
                      cell.status === true
                        ? "present"
                        : cell.status === false
                        ? "absent"
                        : "unknown"
                    }`}
                  >
                    {cell.day}
                  </div>
                ) : (
                  <div key={idx} className="attendance-cell empty" />
                )
              )}
            </div>
            <div className="attendance-legend">
              <span className="dot present" /> Present ({presentCount}, {presentPct}%)
              <span className="dot absent" /> Absent ({absentCount}, {absentPct}%)
              <span className="dot unknown" /> Not marked
            </div>
          </div>
        </div>
      )}

      {showUpcoming && (
        <div className="modal-backdrop picker" onClick={() => setShowUpcoming(false)}>
          <div
            className="modal-panel picker-panel"
            style={{ maxWidth: "900px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Upcoming Weekly Tests</h2>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowUpcoming(false)}
              >
                Close
              </button>
            </div>
            {upcomingTests.length === 0 ? (
              <p>No upcoming tests.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Duration</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingTests.map((test) => (
                    <tr key={test.id}>
                      <td>{test.subject}</td>
                      <td>{test.date}</td>
                      <td>{test.time}</td>
                      <td>{test.durationMinutes} min</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleStartTest(test.id)}
                        >
                          Start Test
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {showPast && (
        <div className="modal-backdrop picker" onClick={() => setShowPast(false)}>
          <div
            className="modal-panel picker-panel"
            style={{ maxWidth: "900px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Past Results</h2>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowPast(false)}
              >
                Close
              </button>
            </div>
            {pastTests.length === 0 ? (
              <p>No past test records yet.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {pastTests.map((test) => (
                    <tr key={test.id}>
                      <td>{test.subject}</td>
                      <td>{test.date}</td>
                      <td>
                        {test.score}/{test.outOf}
                      </td>
                      <td>
                        {test.outOf
                          ? ((test.score / test.outOf) * 100).toFixed(1)
                          : "0.0"}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {showHomework && (
        <div className="modal-backdrop picker" onClick={() => setShowHomework(false)}>
          <div
            className="modal-panel picker-panel"
            style={{ maxWidth: "900px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Homework</h2>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowHomework(false)}
              >
                Close
              </button>
            </div>
            {homework.length === 0 ? (
              <p>No homework assigned yet.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Title</th>
                    <th>Due Date</th>
                    <th>Notes</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {homework.map((hw) => (
                    <tr key={hw.id}>
                      <td>{hw.subject}</td>
                      <td>{hw.title}</td>
                      <td>{hw.dueDate || "-"}</td>
                      <td>{hw.description || "-"}</td>
                      <td>
                        {hw.link ? (
                          <a href={hw.link} target="_blank" rel="noreferrer">
                            Open
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {showSyllabus && (
        <div className="modal-backdrop picker" onClick={() => setShowSyllabus(false)}>
          <div
            className="modal-panel picker-panel"
            style={{ maxWidth: "780px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Syllabus</h2>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowSyllabus(false)}
              >
                Close
              </button>
            </div>
            <p className="subtitle">
              {user?.className || "Class"} | {user?.name || "Student"}
            </p>
            <p>Upload or share your class syllabus here.</p>
          </div>
        </div>
      )}

      {showDatesheet && (
        <div className="modal-backdrop picker" onClick={() => setShowDatesheet(false)}>
          <div
            className="modal-panel picker-panel"
            style={{ maxWidth: "780px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Datesheet</h2>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowDatesheet(false)}
              >
                Close
              </button>
            </div>
            <p className="subtitle">
              Upcoming exams for {user?.className || "your class"} will appear here.
            </p>
            <p>No datesheet available yet.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
