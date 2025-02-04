import React, { useState } from "react";

const AboutPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    details: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Quote request submitted! We’ll get back to you soon.");
    setFormData({ name: "", email: "", details: "" });
  };

  return (
    <div style={aboutContainerStyle}>
      <h1 style={headerStyle}>Shape Your Space, Sustain Your World</h1>
      <p style={paragraphStyle}>
        Meet AMOS—the Adaptable Modular Organization System, where storage meets
        intelligence. Our customizable, modular storage solutions eliminate
        clutter, maximize space, and evolve with your needs. With AMOS, you
        don’t just organize—you optimize. You don’t just store—you innovate. And
        most importantly, you’re shaping a smarter, more sustainable future.
        Navigate to the visualizer to visualize your custom Model Today! Or
        check out the catalogue to see soem of our curated pre designed models!
        Fill out the quote form to request a consultation once you're done!
      </p>

      {/* Quote Request Form */}
      <div style={formContainerStyle}>
        <h2 style={formHeaderStyle}>Request a Quote</h2>
        <p style={formDescriptionStyle}>
          Interested in a custom AMOS solution? Fill out the form below and
          we'll get back to you with a personalized quote.
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <textarea
            name="details"
            placeholder="Tell us about your storage needs..."
            value={formData.details}
            onChange={handleChange}
            required
            rows="4"
            style={{ ...inputStyle, resize: "none" }}
          ></textarea>
          <button
            type="submit"
            style={buttonStyle}
              onMouseOver={(e) => ((e.target as HTMLElement).style.backgroundColor = "#4e7f4c")}
              onMouseOut={(e) => ((e.target as HTMLElement).style.backgroundColor = "#64c261")}



          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

// 🔥 Styles for About Page
const aboutContainerStyle = {
  margin: "20px auto",
  padding: "30px",
  maxWidth: "800px",
  background: "linear-gradient(135deg, #1e1e1e, #2f2f2f)",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
  color: "#d3d3d3",
  textAlign: "center",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const headerStyle = {
  fontSize: "2rem",
  marginBottom: "20px",
  color: "#64c261",
};

const paragraphStyle = {
  fontSize: "1.1rem",
  lineHeight: "1.8",
  textAlign: "justify",
  color: "#d3d3d3",
};

// 📋 Form Styles
const formContainerStyle = {
  marginTop: "30px",
  padding: "25px",
  background: "#2f2f2f",
  borderRadius: "10px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const formHeaderStyle = {
  color: "#64c261",
  fontSize: "1.8rem",
  marginBottom: "10px",
};

const formDescriptionStyle = {
  fontSize: "1rem",
  color: "#d3d3d3",
  marginBottom: "15px",
};

const formStyle = {
  display: "grid",
  gap: "15px",
};

// 🖋 Input Fields
const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #64c261",
  borderRadius: "5px",
  background: "#1e1e1e",
  color: "white",
  fontSize: "16px",
  outline: "none",
  transition: "border 0.3s ease",
};

inputStyle[":focus"] = {
  border: "1px solid #81e071",
};

// ✅ Button Styles
const buttonStyle = {
  padding: "12px",
  backgroundColor: "#64c261",
  color: "white",
  fontSize: "16px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background 0.3s ease",
};

export default AboutPage;
