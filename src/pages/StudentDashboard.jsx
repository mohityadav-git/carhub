import React, { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { studentMockTests } from "../data/localData";

const STUDENT_RECORDS_KEY = "studentTestRecords";

function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleStartTest = (id) => {
    navigate(`/test/${id}`);
  };

  return (
    <div className="page-container">
      <h1>Student Dashboard</h1>
      <p className="subtitle">
        Hello, <strong>{user?.name}</strong>
        {user?.className ? ` (${user.className})` : ""}
      </p>

      <div className="dashboard-grid">
        <section className="card">
          <h2>Upcoming Weekly Tests</h2>
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
        </section>

        <section className="card">
          <h2>Past Results</h2>
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
        </section>
      </div>
    </div>
  );
}

export default StudentDashboard;
