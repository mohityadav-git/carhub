import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isLoginPage = location.pathname === "/";

  return (
    <header className="nav-shell">
      <div className="promo-bar">
        <span className="promo-text">
          ADMISSION OPEN FOR 2026-27! Enroll Now for a Bright Future at MDDM Inter College.
        </span>
        <button
          className="promo-close"
          type="button"
          aria-label="Hide promotion"
        >
          X
        </button>
      </div>

      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="brand">
            <span
              className="brand-icon"
              aria-label="Saraswati Maa playing veena logo"
              style={{ backgroundImage: "url('/saraswati-maa.jpg')" }}
            >
              <span className="brand-fallback"></span>
            </span>
            <div className="brand-text">
              <span className="brand-name">
                MDDM <span className="brand-highlight">Inter</span> College
              </span>
              <span className="brand-caption">Where every mind shines</span>
            </div>
          </Link>
        </div>

        <div className="navbar-center">
          <button type="button" className="nav-link active">
            Home
          </button>
          <button type="button" className="nav-link">
            About Us
          </button>
          <button type="button" className="nav-link">
            Contact Us
          </button>
          <button type="button" className="nav-link">
            Pages
          </button>
        </div>

        <div className="navbar-right">
          <div className="nav-actions">
            <button type="button" className="icon-chip" aria-label="Profile">
              P
            </button>
            <button type="button" className="icon-chip" aria-label="Cart">
              C
            </button>
            <button type="button" className="icon-chip" aria-label="Search">
              S
            </button>
          </div>

          {!user && !isLoginPage && (
            <Link to="/" className="btn btn-outline btn-sm">
              Login
            </Link>
          )}

          {user && (
            <>
              <span className="navbar-user">
                {user.role === "teacher" ? "Teacher" : "Student"}: {" "}
                <strong>{user.name}</strong>
              </span>
              {user.role === "student" && (
                <Link to="/student" className="btn btn-outline btn-sm">
                  Student Dashboard
                </Link>
              )}
              {user.role === "teacher" && (
                <Link to="/teacher" className="btn btn-outline btn-sm">
                  Teacher Dashboard
                </Link>
              )}
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
