import React, { useState } from "react";
import "./modal.css";

const SubmitHomeworkModal = ({ isOpen, onClose, username, taskTitle }) => {
  const [formData, setFormData] = useState({
    title: taskTitle,
    homeworkFile: null,
    description: "",
  });

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      homeworkFile: e.target.files[0],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Domaći je uspešno predat!");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-header">Postavite domaći zadatak</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Naslov zadatka</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              disabled
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Opis zadatka</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Unesite opis zadatka..."
              className="textarea-field"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="homeworkFile">Priložite domaći PDF</label>
            <input
              type="file"
              id="homeworkFile"
              onChange={handleFileChange}
              accept=".pdf"
              className="file-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Korisničko ime</label>
            <input
              type="text"
              id="username"
              value={username}
              disabled
              className="input-field"
            />
          </div>

          <div className="modal-buttons">
            <button type="submit" className="submit-button">
              Pošaljite domaći
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Zatvori
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitHomeworkModal;
