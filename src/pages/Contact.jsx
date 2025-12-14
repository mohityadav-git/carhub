import React from "react";

function Contact() {
  return (
    <div className="page-container">
      <h1>Contact Us</h1>
      <p className="subtitle">We are here to help with admissions, academics, and support.</p>

      <div
        className="hero-banner"
        style={{
          marginBottom: "14px",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        <div className="hero-banner-content">
          <h2>We’re ready to help</h2>
          <p>Reach out for admissions, academics, and support. We typically reply within one day.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="card">
          <h3>Reach Out</h3>
          <p>Email: info@mddmcollege.edu</p>
          <p>Phone: +91-90000-12345</p>
          <p>Campus: MDDM Inter College, Muzaffarpur</p>
        </section>

        <section className="card">
          <h3>Visit Hours</h3>
          <p>Monday - Friday: 9:00 AM - 4:00 PM</p>
          <p>Saturday: 9:00 AM - 1:00 PM</p>
          <p>PTM & events are communicated via circulars and SMS.</p>
        </section>

        <section className="card">
          <h3>Need Assistance?</h3>
          <p>
            Write to us for admissions, fee queries, or academic support. Teachers and admins respond
            within one working day.
          </p>
        </section>
      </div>
    </div>
  );
}

export default Contact;
