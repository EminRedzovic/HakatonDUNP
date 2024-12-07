import React from "react";
import StarRating from "../../assets/StarRating";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./allStudents.css";

const Students = () => {
  return (
    <div className="students-page">
      <div className="sidebar-div">
        <Sidebar />
      </div>
      <div className="students-side">
        <h1 className="text">Svi ucenici</h1>
        <div className="all-students">
          <div className="student">
            <h1>Ime Ucenika</h1>
            <h2>Recenzija: 4.7</h2>
            <StarRating totalStars={5} />
            <button className="activity-button">
              Dodaj Vannastavnu aktivnost
            </button>
          </div>
          <div className="student">
            <h1>Ime Ucenika</h1>
            <h2>Recenzija: 4.7</h2>
            <StarRating totalStars={5} />
            <button className="activity-button">
              Dodaj Vannastavnu aktivnost
            </button>
          </div>
          <div className="student">
            <h1>Ime Ucenika</h1>
            <h2>Recenzija: 4.7</h2>
            <StarRating totalStars={5} />
            <button className="activity-button">
              Dodaj Vannastavnu aktivnost
            </button>
          </div>
          <div className="student">
            <h1>Ime Ucenika</h1>
            <h2>Recenzija: 4.7</h2>
            <StarRating totalStars={5} />
            <button className="activity-button">
              Dodaj Vannastavnu aktivnost
            </button>
          </div>
          <div className="student">
            <h1>Ime Ucenika</h1>
            <h2>Recenzija: 4.7</h2>
            <StarRating totalStars={5} />
            <button className="activity-button">
              Dodaj Vannastavnu aktivnost
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
