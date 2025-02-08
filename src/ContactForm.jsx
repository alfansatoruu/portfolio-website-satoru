import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import './form.css'; 

function ContactForm() {
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    emailjs.init("UCKKih5IQspVduNdt");
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      await emailjs.sendForm("service_2gfv57d", "template_n44fqg7", e.target);
      setConfirmationMessage("Message sent successfully!");

      setTimeout(() => {
        handleCloseForm();
        setConfirmationMessage("");
      }, 3000);

      e.target.reset();
    } catch (error) {
      console.error("Error:", error);
      setConfirmationMessage("Error sending message. Please try again.");
    }
  };

  const handleCloseForm = () => {
    window.history.back(); // Navigasi ke halaman sebelumnya
  };

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h2 className="modal-title">Let's Connect</h2>
        <button onClick={handleCloseForm} className="close-button">
          ×
        </button>
      </div>

      <form onSubmit={sendEmail}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="form-input"
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="form-input"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            className="form-textarea"
            placeholder="What would you like to say?"
          ></textarea>
        </div>

        <button type="submit" className="submit-button">
          Send Message
        </button>
      </form>

      {confirmationMessage && (
        <div className={`confirmation-message ${confirmationMessage.includes("Error") ? "error" : "success"}`}>
          {confirmationMessage}
        </div>
      )}
    </div>
  );
}

export default ContactForm;
