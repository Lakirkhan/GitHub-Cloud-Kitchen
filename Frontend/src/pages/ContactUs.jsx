import React, { useState } from "react";
import "../styles/Contact.css"; // Make sure to style it accordingly

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setError("All fields are required!");
      return;
    }
    setError("");
    alert("Your message has been sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="contact-page">
      {/* Contact Information Section */}
      <div className="contact-content">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            We would love to hear from you! Reach out to us via email, phone, or
            visit our location.
          </p>

          <div className="contact-details">
            <div className="detail">
              <i className="fas fa-map-marker-alt"></i>
              <span>1234 Business Lane, City, Country</span>
            </div>
            <div className="detail">
              <i className="fas fa-envelope"></i>
              <span>support@yourcompany.com</span>
            </div>
            <div className="detail">
              <i className="fas fa-phone-alt"></i>
              <span>+1 (123) 456-7890</span>
            </div>
          </div>
          {/* Social Media Links */}
          <div className="social-icons">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>

      {/* Google Map Section */}
      <div className="map-container">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.8625788888857!2d-74.00594118459396!3d40.71277577933169!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a3160eabbcf%3A0x8fd749d5f1c2a43f!2s55%20Main%20St%2C%20New%20York%2C%20NY%2010005%2C%20USA!5e0!3m2!1sen!2sus!4v1708888888888!5m2!1sen!2sus"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
