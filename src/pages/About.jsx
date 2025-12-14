import React from "react";

function About() {
  return (
    <div className="page-container">
      <h1>About MDDM Inter College</h1>
      <p className="subtitle">
        Nurturing curiosity and excellence with a blend of academics, arts, and character building.
      </p>

      <div
        className="hero-banner"
        style={{
          marginBottom: "14px",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        <div className="hero-banner-content">
          <h2>Learning that lights up every classroom</h2>
          <p>
            Project-based learning, caring mentors, and a culture of curiosity help our students
            grow with confidence.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <h3>Our Vision</h3>
          <p>
            We aim to create a joyful, modern learning environment where students become confident,
            creative, and compassionate citizens ready to excel in higher studies and life.
          </p>
        </section>
        <section className="card">
          <h3>Academic Edge</h3>
          <ul className="footer-links">
            <li>Experienced faculty across science, commerce, humanities</li>
            <li>Weekly tests and analytics to track steady progress</li>
            <li>STEM, language labs, and curated digital resources</li>
            <li>Career guidance, olympiad prep, and remedial support</li>
          </ul>
        </section>
        <section className="card">
          <h3>Campus Life</h3>
          <p>
            Beyond classrooms, students engage in sports, arts, clubs, and community outreach to build
            teamwork, leadership, and empathy.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;
