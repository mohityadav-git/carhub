import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [mode, setMode] = useState("student"); // "student" or "teacher"

  const [studentName, setStudentName] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentError, setStudentError] = useState("");

  const [teacherName, setTeacherName] = useState("");
  const [teacherCode, setTeacherCode] = useState("");

  const { loginStudent, loginTeacher } = useAuth();
  const navigate = useNavigate();

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
    // For now, accept any code. Later you can validate with backend
    if (!teacherName || !teacherCode) return;
    loginTeacher(teacherName);
    navigate("/teacher");
  };

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <button
          className={`toggle-btn ${mode === "student" ? "active" : ""}`}
          onClick={() => setMode("student")}
        >
          Student Login
        </button>
        <button
          className={`toggle-btn ${mode === "teacher" ? "active" : ""}`}
          onClick={() => setMode("teacher")}
        >
          Teacher Login
        </button>
      </div>

      {mode === "student" ? (
        <form className="auth-form" onSubmit={handleStudentLogin}>
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
            Password (class@rollnumber, no sections)
            <input
              type="password"
              value={studentPassword}
              onChange={(e) => setStudentPassword(e.target.value)}
              placeholder="e.g. 8@21"
            />
          </label>
          {studentError && <div className="error-text">{studentError}</div>}
          <button type="submit" className="btn btn-primary">
            Login as Student
          </button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleTeacherLogin}>
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
          <button type="submit" className="btn btn-primary">
            Login as Teacher
          </button>
        </form>
      )}
    </div>
  );
}

export default Login;
