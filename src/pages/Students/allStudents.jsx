import React, { useState } from "react";
import StarRating from "../../assets/StarRating";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./allStudents.css";

const Students = () => {
  const [selectedRating, setSelectedRating] = useState(3); // Initial rating (e.g., fetched from a database)

  // Function to handle the rating change
  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    console.log("Selected Rating: ", rating); // Log the selected rating
  };

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
            <StarRating 
        initialRating={selectedRating} 
        totalStars={5} 
        isEditable={true} // Set to true for editable stars
        onRatingChange={handleRatingChange} // Pass the function to log rating
      />
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
