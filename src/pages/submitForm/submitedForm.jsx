import React, { useEffect, useState } from "react";
import "./submitedForm.css";
import image from "../../assets/profile.png";
import SubmitHomeworkModal from "../../components/modal";
import Sidebar from "../../components/Sidebar/Sidebar";
import StarRating from "../../assets/StarRating";
import { useParams } from "react-router-dom";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";

const SubmitedForm = () => {
  const { homeworkid } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const username = "Marko Marković";
  const taskTitle = "Matematika - Sabiranje";

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [homework, setHomework] = useState([]);

  const getHomework = async () => {
    // Use collection() to specify the collection you want to query
    const homeworkCollection = collection(db, "homework");
    const data = await getDocs(homeworkCollection);

    // Map the documents and extract the data
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Filter the homework by the id from the URL params
    const myHomework = filteredData.filter(
      (homework) => homework.id === homeworkid
    );

    setHomework(myHomework);
  };

  useEffect(() => {
    getHomework();
  }, [homeworkid]); // Adding homeworkid as a dependency to refetch when the ID changes

  return (
    <div className="sabmit-container">
      <div className="sidebar-div">
        <Sidebar />
      </div>

      <div className="submit-container">
        {homework.map((task, index) => (
          <div key={index} className="card">
            <div className="status">
              {task.submitted ? (
                <span className="status-submitted">Domaći je predat</span>
              ) : (
                <span className="status-not-submitted">Domaći nije predat</span>
              )}
            </div>

            <div className="card-body">
              <div className="card-header">
                <img className="task-image" src={image} alt="Task" />
                <div className="task-details">
                  <p>
                    <strong>Učenik:</strong> {task.work[0].fullName}
                  </p>
                  <p>
                    <strong>Datum:</strong> {task.date}
                  </p>
                  <p>
                    <strong>Opis:</strong> {task.description}
                  </p>
                </div>
              </div>

              {task.approved !== "Waiting" && (
                <>
                  <div className="teacher-feedback">
                    <p>
                      <strong>Komentar nastavnika:</strong>{" "}
                      {task.teacherComment}
                    </p>
                    <div className="grade">
                      <p
                        style={{
                          display: "inline",
                          width: "100%",
                        }}
                      >
                        <strong>
                          Ocena:
                          <StarRating
                            initialRating={4}
                            totalStars={5}
                            isEditable={false}
                          />
                        </strong>
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="approval-status">
                <p>
                  {task.approved === "Waiting" ? (
                    <button
                      style={{
                        backgroundColor: "#E66562",
                      }}
                    >
                      Nije odobreno
                    </button>
                  ) : task.approved ? (
                    <button onClick={openModal}>Odobreno</button>
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
            <SubmitHomeworkModal
              isOpen={isModalOpen}
              onClose={closeModal}
              username={username}
              taskTitle={taskTitle}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmitedForm;
