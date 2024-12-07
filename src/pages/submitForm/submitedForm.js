import React, { useState } from "react";
import "./submitedForm.css";
import image from "../../assets/profile.png";

const SubmitedForm = () => {
  const [homework, setHomework] = useState([
    {
      submitted: true,
      image: "image_path_here",
      description: "Opis domaćeg zadatka...",
      teacherComment: "Odlično urađeno, ali obrati pažnju na zadatak 3.",
      recension: 5,
      approved: true,
      date: "2024-12-06",
      pdfLink: "path_to_pdf_here",
    },
    {
      submitted: true,
      image: "image_path_here",
      description: "Opis domaćeg zadatka...",
      teacherComment: "Odlično urađeno, ali obrati pažnju na zadatak 3.",
      recension: 5,
      approved: "Waiting",
      date: "2024-12-06",
      pdfLink: "path_to_pdf_here",
    },
  ]);

  return (
    <div className="submit-container">
      {homework.map((task, index) => (
        <div key={index} className="card">
          <div className="status">
            {task.submitted ? (
              <span className="status-submitted">Domaći je predat</span>
            ) : (
              <span className="status-not-submitted">Domaći nije predate</span>
            )}
          </div>

          <div className="card-body">
            <div className="card-header">
              <img className="task-image" src={image} alt="Task" />
              <div className="task-details">
                <p>
                  <strong>Opis:</strong> {task.description}
                </p>
                <p>
                  <strong>Datum:</strong> {task.date}
                </p>
              </div>
            </div>

            {task.approved !== "Waiting" && (
              <>
                <div className="teacher-feedback">
                  <p>
                    <strong>Komentar nastavnika:</strong> {task.teacherComment}
                  </p>
                  <p>
                    <strong>Ocena:</strong> {task.recension} zvezdica
                  </p>
                </div>
              </>
            )}

            <div className="approval-status">
              <p>
                {task.approved === "Waiting" ? (
                  <button
                    style={{
                      backgroundColor: "red",
                    }}
                  >
                    Nije odobreno
                  </button>
                ) : task.approved ? (
                  <button>Odobreno</button>
                ) : (
                  "Ne"
                )}
              </p>
            </div>
            <div className="pdf-link">
              {task.pdfLink && (
                <a
                  href={task.pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pdf-text-link"
                >
                  Pogledaj domaći PDF
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmitedForm;
