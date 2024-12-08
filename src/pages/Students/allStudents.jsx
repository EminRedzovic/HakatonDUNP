import React, { useEffect, useState } from "react";
import StarRating from "../../assets/StarRating";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./allStudents.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const Students = () => {
  const [selectedRating, setSelectedRating] = useState(0); // Initial rating (e.g., fetched from a database)
  const [students, setStudents] = useState([]);
  const coursesCollections = collection(db, "users");
  // Function to handle the rating change
  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    console.log("Selected Rating: ", rating); // Log the selected rating
  };
  const getStudents = async () => {
    const data = await getDocs(coursesCollections);
    const filteredData = data.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((doc) => !doc.isTeacher)
      .map(({ password, ...rest }) => rest);
    console.log(filteredData);
    setStudents(filteredData);
  };

  useEffect(() => {
    getStudents();
  }, []);
  return (
    <div className="students-page">
      <div className="sidebar-div">
        <Sidebar />
      </div>
      <div className="students-side">
        <h1 className="text">Svi ucenici</h1>
        <div className="all-students">
          {students.map((student) => {
            return (
              <div className="student">
                <div className="name-and-recension">
                  <h1>{student.fullName}</h1>
                  <h2>Recenzija: 4.7</h2>
                  <StarRating
                    initialRating={4}
                    totalStars={5}
                    isEditable={true} // Set to true for editable stars
                    onRatingChange={handleRatingChange}
                  />
                </div>
                <button className="activity-button">
                  Dodaj Vannastavnu aktivnost
                </button>
              </div>
            );
          })}
          {/* <div className="name-and-recension">
              <h1>Daris Mavric</h1>
              <h2>Recenzija: 4.7</h2>
              <StarRating
                initialRating={4}
                totalStars={5}
                isEditable={true} // Set to true for editable stars
                onRatingChange={handleRatingChange}
              />
            </div> */}
        </div>
      </div>
    </div>
  );
};

export default Students;
