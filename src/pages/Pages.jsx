import React from "react";

function Pages() {
  return (
    <div className="page-container">
      <h1>Pages & Resources</h1>
      <p className="subtitle">Quick links for students, teachers, and parents.</p>

      <div
        className="hero-banner"
        style={{
          marginBottom: "14px",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        <div className="hero-banner-content">
          <h2>Key links in one place</h2>
          <p>Find academics, student corner, and parent support resources quickly.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <h3>Academics</h3>
          <ul className="footer-links">
            <li>Weekly Tests and Analytics</li>
            <li>Homework and Assignments</li>
            <li>Attendance Tracking</li>
            <li>Syllabus & Datesheets</li>
          </ul>
        </section>
        <section className="card">
          <h3>Student Corner</h3>
          <ul className="footer-links">
            <li>Upcoming Tests</li>
            <li>Past Results</li>
            <li>Download Prospectus</li>
            <li>Clubs & Activities</li>
          </ul>
        </section>
        <section className="card">
          <h3>Parent & Support</h3>
          <ul className="footer-links">
            <li>PTM Schedule</li>
            <li>Fee & Transport Queries</li>
            <li>Contact Administration</li>
            <li>Safety & Policies</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Pages;
