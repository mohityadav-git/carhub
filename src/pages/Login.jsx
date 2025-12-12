import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [mode, setMode] = useState("student");
  const [studentName, setStudentName] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentError, setStudentError] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherCode, setTeacherCode] = useState("");

  const { loginStudent, loginTeacher } = useAuth();
  const navigate = useNavigate();

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setStudentError("");
    setStudentName("");
    setStudentPassword("");
    setTeacherName("");
    setTeacherCode("");
  };

  const handleStudentLogin = (e) => {
    e.preventDefault();
    setStudentError("");
    const name = studentName.trim();
    const pass = studentPassword.trim();
    if (!name || !pass) {
      setStudentError("Please enter name and password.");
      return;
    }

    const [clsRaw, roll] = pass.split("@");
    if (!clsRaw || !roll) {
      setStudentError("Password format must be class@rollnumber (e.g., 8@21).");
      return;
    }
    const classNumber = clsRaw.replace(/^class\s*/i, "").trim();
    const normalizedClass = classNumber ? `Class ${classNumber}` : "";
    loginStudent(name, normalizedClass, roll);
    navigate("/student");
  };

  const handleTeacherLogin = (e) => {
    e.preventDefault();
    if (!teacherName || !teacherCode) return;
    loginTeacher(teacherName);
    navigate("/teacher");
  };

  return (
    <div className="auth-hero-wrap">
      <div className="auth-hero-card">
        <div className="auth-hero-left">
          <div className="auth-hero-brand">
            <div className="brand-icon small" aria-hidden="true" />
            <div>
              <div className="brand-name">MDDM Inter College</div>
              <div className="brand-caption">Where every mind shines</div>
            </div>
          </div>

          <div className="auth-hero-body">
            <p className="auth-hero-kicker">Welcome back</p>
            <h1 className="auth-hero-title">Access your account</h1>
            <p className="auth-hero-sub">
              Choose your role and continue to your dashboard.
            </p>

            <div className="auth-toggle">
              <button
                className={`toggle-btn ${mode === "student" ? "active" : ""}`}
                onClick={() => handleModeChange("student")}
                type="button"
              >
                Student Login
              </button>
              <button
                className={`toggle-btn ${mode === "teacher" ? "active" : ""}`}
                onClick={() => handleModeChange("teacher")}
                type="button"
              >
                Teacher Login
              </button>
            </div>

            {mode === "student" ? (
              <form className="auth-form auth-hero-form" onSubmit={handleStudentLogin}>
                <h2>Student Login</h2>
                <label>
                  Full Name
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </label>
                <label>
                  Password 
                  <input
                    type="password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="e.g. 8@21"
                  />
                </label>
                {studentError && <div className="error-text">{studentError}</div>}
                <button type="submit" className="btn btn-primary full-width">
                  Login as Student
                </button>
              </form>
            ) : (
              <form className="auth-form auth-hero-form" onSubmit={handleTeacherLogin}>
                <h2>Teacher Login</h2>
                <label>
                  Full Name
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </label>
                <label>
                  Teacher Code
                  <input
                    type="password"
                    value={teacherCode}
                    onChange={(e) => setTeacherCode(e.target.value)}
                    placeholder="Enter teacher code"
                  />
                </label>
                <button type="submit" className="btn btn-primary full-width">
                  Login as Teacher
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="auth-hero-right">
          <div className="auth-hero-visual">
            <div className="auth-hero-bubble top"></div>
            <div className="auth-hero-bubble mid"></div>
            <div className="auth-hero-bubble bottom"></div>

            

            <div className="auth-hero-calendar">
              <div className="cal-header">
                <span>Week</span>
                <strong>22 - 28</strong>
              </div>
              <div className="cal-days">
                <span>Mon</span>
                <span>Tue</span>
                <span className="active">Wed</span>
                <span>Thu</span>
                <span>Fri</span>
              </div>
              <div className="cal-footer">Reminder set for Friday PTM</div>
            </div>

            <div className="auth-hero-report">
              <div className="report-header">
                <span className="dot green"></span>
                Weekly Report Ready
              </div>
              <div className="report-metrics">
                <div>
                  <div className="metric-value">92%</div>
                  <div className="metric-label">Completion</div>
                </div>
                <div>
                  <div className="metric-value">8.4</div>
                  <div className="metric-label">Avg Score</div>
                </div>
                <div>
                  <div className="metric-value">3</div>
                  <div className="metric-label">Pending</div>
                </div>
              </div>
              <div className="report-bar">
                <span style={{ width: "80%" }} />
              </div>
            </div>

            <div className="auth-hero-schedule">
              <div className="schedule-header">
                <span className="dot amber"></span>
                PTM Schedule
              </div>
              <div className="schedule-body">
                <div>
                  <strong>Friday</strong>
                  <span>4:00 PM</span>
                </div>
                <div>
                  <strong>Room 102</strong>
                  <span>Class 8 & 9</span>
                </div>
              </div>
            </div>

            <div className="auth-hero-student">
              <div className="student-header">
                <span className="dot blue"></span>
                Best Student of the Month
              </div>
              <div className="student-card">
                <div className="avatar a4" />
                <div>
                  <div className="student-name">Aarav Kumar</div>
                  <div className="student-meta">Class 8 · 98% avg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
