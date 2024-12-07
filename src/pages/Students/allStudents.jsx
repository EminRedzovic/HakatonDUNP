import React, { useState } from "react";
import StarRating from "../../assets/StarRating";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./allStudents.css";

const Students = () => {
  const [selectedRating, setSelectedRating] = useState(0); // Initial rating (e.g., fetched from a database)

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
            <div className="name-and-recension">
              <h1>Daris Mavric</h1>
              <h2>Recenzija: 4.7</h2>
              <StarRating  
              initialRating={selectedRating} 
              totalStars={5} 
              isEditable={true} // Set to true for editable stars
              onRatingChange={handleRatingChange}
              />
            </div>
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
