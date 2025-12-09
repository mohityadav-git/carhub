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
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">MDDM Inter College</span>
      </div>
      <div className="navbar-right">
        {!user && !isLoginPage && (
          <Link to="/" className="btn btn-outline">
            Login
          </Link>
        )}

        {user && (
          <>
            <span className="navbar-user">
              {user.role === "teacher" ? "Teacher" : "Student"}:{" "}
              <strong>{user.name}</strong>
            </span>
            {user.role === "student" && (
              <Link to="/student" className="btn btn-outline">
                Student Dashboard
              </Link>
            )}
            {user.role === "teacher" && (
              <Link to="/teacher" className="btn btn-outline">
                Teacher Dashboard
              </Link>
            )}
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
