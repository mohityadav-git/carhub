import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [mode, setMode] = useState("student");
  const [slideIndex, setSlideIndex] = useState(0);
  const [studentName, setStudentName] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentError, setStudentError] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherCode, setTeacherCode] = useState("");

  const { loginStudent, loginTeacher } = useAuth();
  const navigate = useNavigate();

  const loginImages = [
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1500&q=80",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % loginImages.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(timer);
  }, [loginImages.length]);

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

  const isStudent = mode === "student";

  return (
    <div className="login-shell">
      <div className="login-illustration">
        <div
          key={slideIndex}
          className="login-illustration-layer"
          style={{ backgroundImage: `url('${loginImages[slideIndex]}')` }}
        />
      </div>

      <div className="login-panel">
        <div className="login-brand-row">
          <span
            className="brand-icon large login-logo"
            aria-label="Saraswati Maa playing veena logo"
            style={{ backgroundImage: "url('/saraswati-maa.jpg')" }}
          >
            <span className="brand-fallback">M</span>
          </span>
          <div>
            <div className="brand-name">MDDM Inter College</div>
            <div className="brand-caption">Where every mind shines</div>
          </div>
        </div>

        <div className="login-heading">
          <h2>Log in to your account</h2>
          <p>Welcome back! Please log in to your account.</p>
        </div>

        <div className="auth-toggle login-toggle">
          <button
            className={`toggle-btn ${isStudent ? "active" : ""}`}
            onClick={() => handleModeChange("student")}
            type="button"
          >
            Student Login
          </button>
          <button
            className={`toggle-btn ${!isStudent ? "active" : ""}`}
            onClick={() => handleModeChange("teacher")}
            type="button"
          >
            Teacher Login
          </button>
        </div>

        {isStudent ? (
          <form className="login-form" onSubmit={handleStudentLogin}>
            <label>
              User ID
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
            <div className="login-actions">
              <a className="login-link" href="#">
                Forgot Password?
              </a>
            </div>
            <button type="submit" className="btn login-btn">
              LOGIN
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleTeacherLogin}>
            <label>
              User ID
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Enter your name"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={teacherCode}
                onChange={(e) => setTeacherCode(e.target.value)}
                placeholder="Enter teacher code"
              />
            </label>
            <div className="login-actions">
              <a className="login-link" href="#">
                Forgot Password?
              </a>
            </div>
            <button type="submit" className="btn login-btn">
              LOGIN
            </button>
          </form>
        )}

        <div className="login-help">
          <div>Helpline: +91 7065465400</div>
          <div>parents@mddmcollege.edu</div>
          <div>(9:00 AM to 5:30 PM, Monday - Saturday)</div>
        </div>
      </div>
    </div>
  );
}

export default Login;
