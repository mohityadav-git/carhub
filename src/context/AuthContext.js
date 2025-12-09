import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // user = { name, role, className }

  const loginStudent = (name, className, rollNumber) => {
    setUser({ name, role: "student", className, rollNumber });
  };

  const loginTeacher = (name) => {
    setUser({ name, role: "teacher" });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginStudent, loginTeacher, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
