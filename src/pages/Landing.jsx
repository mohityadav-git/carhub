import React from "react";
import { Link } from "react-router-dom";

const classes = [
  "Pre-Nursery",
  "Nursery",
  "KG",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

function Landing() {
  return (
    <div className="landing-page">
      <section
        className="landing-hero"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="landing-hero-overlay" />
        <div className="landing-hero-content">
          <div>
            <div className="hero-topbar">
              <span className="hero-kicker">Day, Weekly & Full Boarding</span>
              <span className="hero-call">
                Call us on <strong>+91 98-109-10000</strong>
              </span>
            </div>
            <h1 className="hero-title">
              Admissions Open <span className="hero-highlight">Pre-Nur - XII</span>
            </h1>
            <div className="hero-sub">
              Premium CBSE education with expansive campus life, sports, and modern learning.
            </div>
            <div className="hero-pill-row">
              <span className="hero-pill">CBSE</span>
              <span className="hero-pill">Sohna Road Gurugram</span>
            </div>
          </div>

          <div className="enquiry-card">
            <div className="enquiry-header">
              <h3>Enquire Now</h3>
              <Link to="/login" className="enquiry-close" aria-label="Go to login">
                ×
              </Link>
            </div>
            <form className="enquiry-form">
              <input type="text" placeholder="Student Full Name*" required />
              <input type="email" placeholder="Email ID*" required />
              <input type="tel" placeholder="Mobile Number*" required />
              <select defaultValue="">
                <option value="" disabled>
                  Class applying for
                </option>
                {classes.map((cls) => (
                  <option key={cls}>{cls}</option>
                ))}
              </select>
              <input type="text" placeholder="Your City*" required />
              <textarea rows="3" placeholder="Query*" />
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="landing-enquiry-row">
        <div className="landing-enquiry-text">
          <h2>Enquire Now</h2>
          <p>Share your details and our admissions team will call you back.</p>
        </div>
        <form className="landing-enquiry-inline">
          <input type="text" placeholder="Student Full Name*" />
          <input type="tel" placeholder="Mobile Number*" />
          <input type="text" placeholder="Your City*" />
          <input type="email" placeholder="Email ID*" />
          <select defaultValue="">
            <option value="" disabled>
              Class applying for
            </option>
            {classes.map((cls) => (
              <option key={`inline-${cls}`}>{cls}</option>
            ))}
          </select>
          <input type="text" placeholder="Query*" />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </section>

      <section className="landing-welcome">
        <div className="welcome-image">
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80"
            alt="Student sports"
          />
        </div>
        <div className="welcome-copy">
          <p className="subtitle">Welcome to</p>
          <h2>MDDM Inter College</h2>
          <p className="subtitle">Best school in Muzaffarpur with day, weekly, and full boarding.</p>
          <p>
            MDDM Inter College offers an expansive campus, modern labs, and a vibrant cultural hub
            for music, dance, and arts. With dedicated faculty, olympiad prep, and the largest indoor
            sports complex in the region, we blend academics with holistic growth.
          </p>
        </div>
      </section>

      <section className="landing-features">
        <h3 className="feature-heading">Why MDDM Inter College?</h3>
        <div className="feature-grid">
          <div className="feature-card">
            <h4>20 Acre Campus</h4>
            <p>Sprawling green spaces with modern classrooms and labs.</p>
          </div>
          <div className="feature-card">
            <h4>Boarding Options</h4>
            <p>Day, weekly, and full boarding with guided study hours.</p>
          </div>
          <div className="feature-card">
            <h4>Cultural Hub</h4>
            <p>Dedicated studios for music, dance, arts, and theatre.</p>
          </div>
          <div className="feature-card">
            <h4>Sports Complex</h4>
            <p>Indoor arenas and coaching for football, badminton, and more.</p>
          </div>
          <div className="feature-card">
            <h4>Curriculum</h4>
            <p>Real-world projects, olympiad prep, and language labs.</p>
          </div>
          <div className="feature-card">
            <h4>Design & Tech</h4>
            <p>Robotics, 3D printing, and carpentry labs to spark innovation.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
