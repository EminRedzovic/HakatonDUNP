import React from "react";
import "./submitForm.css";

const SubmitForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Homework submitted successfully!");
  };

  return (
    <div className="form-container">
      <h1>Submit Your Homework</h1>
      <form className="homework-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Homework Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter homework title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            rows="8"
            placeholder="Enter a brief description"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="file">Upload PDF:</label>
          <input type="file" id="file" name="file" accept=".pdf" required />
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubmitForm;
