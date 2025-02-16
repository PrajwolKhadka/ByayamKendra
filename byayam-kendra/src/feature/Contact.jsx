import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "../css/ContactUs.css";  // Import the custom CSS file

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    issueType: "",
    message: "",
  });

  const [status, setStatus] = useState({
    type: null,
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, issueType: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.contactNumber || !formData.issueType || !formData.message) {
      setStatus({ type: "error", message: "Please fill in all fields." });
      return;
    }

    try {
      const response = await emailjs.send(
        "service_i4moyir",
        "template_ikjkuey",
        {
          name: formData.name,
          email: formData.email,
          contactNumber: formData.contactNumber,
          issueType: formData.issueType,
          message: formData.message,
          reply_to: formData.email
        },
        "V5WDcXxxw6V_Pg0qV"
      );

      if (response.status === 200) {
        setStatus({ type: "success", message: "Message sent successfully!" });
        setFormData({ name: "", email: "", contactNumber: "", issueType: "", message: "" });
      }
    } catch (error) {
      console.error("Email sending error:", error);
      setStatus({ type: "error", message: "Failed to send message. Try again later." });
    }
  };

  return (
    <div className="contact-form-contact">
      <div className="card-header-contact">
        <h2>Contact Us</h2>
        <p>We're here to help. Send us a message and we'll get back to you as soon as possible.</p>
      </div>
      <div className="card-content-contact">
        <form onSubmit={handleSubmit} className="form-contact">
          <div className="form-group-contact">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group-contact">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              id="contactNumber"
              name="contactNumber"
              type="tel"
              placeholder="Your Contact Number"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group-contact">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <p className="text-muted-contact">If this is your first time sending an email, please verify it through your Gmail account.</p>
          <div className="form-group-contact">
            <label htmlFor="issueType">Issue Type</label>
            <select onChange={(e) => handleSelectChange(e.target.value)} value={formData.issueType}>
              <option value="">Select an Issue</option>
              <option value="Login Problem">Login Problem</option>
              <option value="Workout Issues">Workout Issue</option>
              <option value="Account Deletion">Account Deletion</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group-contact">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Describe your issue..."
              value={formData.message}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
        </form>
      </div>
      <div className="card-footer-contact">
        {status.type && (
          <div className={`alert-contact ${status.type === "error" ? "alert-error-contact" : "alert-success-contact"}`}>
            {status.type === "error" ? (
              <span className="alert-icon-contact">⚠️</span>
            ) : (
              <span className="alert-icon-contact">✔️</span>
            )}
            <strong>{status.type === "error" ? "Error" : "Success"}</strong>
            <p>{status.message}</p>
          </div>
        )}
        <button type="submit" className="btn-submit-contact" onClick={handleSubmit}>
          Send Message
        </button>
      </div>
    </div>
  );
};

export default ContactUs;
