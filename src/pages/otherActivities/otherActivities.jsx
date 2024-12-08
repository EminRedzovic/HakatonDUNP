import React, { useEffect, useState } from "react";
import StarRating from "../../assets/StarRating";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./otherActivities.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import SubmitActivityModal from "../../components/modal";

const OtherActivities = () => {
  const [activityData, setActivityData] = useState([]); // Ovo sada sadrži sve aktivnosti
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [activityTitle, setActivityTitle] = useState([]);

  const token = localStorage.getItem("token");
  const activitiesCollection = collection(db, "activities");

  const openModal = (id) => {
    setSelectedActivityId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const getAllActivities = async () => {
    try {
      const data = await getDocs(activitiesCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Assuming that activities data is stored as an object with keys as IDs
      const activitiesArray = Object.values(filteredData[0]?.activities || []); // Convert to array

      setActivityData(activitiesArray); // Postavi sve aktivnosti u state
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getAllActivities(); // Pozivamo funkciju za učitavanje svih aktivnosti
    }
  }, [token]);

  return (
    <div className="other-activities">
      <div className="sidebar-div">
        <Sidebar />
      </div>

      <div className="activities-main">
        <div className="activities-header">
          <h1>Vannastavne Aktivnosti</h1>
        </div>

        <div className="all-activities">
          {activityData.length > 0 ? (
            activityData.map((activity) => (
              <div className="activity-card" key={activity.timestamp}>
                <div className="activity-header">
                  <h2>{activity.title}</h2>
                  <p>{activity.description}</p>
                </div>
                <div className="activity-footer">
                  <p>Datum: {activity.timestamp || "Nije postavljen datum"}</p>
                  <button
                    onClick={() => {
                      openModal(activity.timestamp); // Use timestamp as unique identifier
                      setActivityTitle(activity.title);
                    }}
                  >
                    Pridruži se
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Nema dostupnih aktivnosti.</p>
          )}
        </div>
      </div>

      <SubmitActivityModal
        isOpen={isModalOpen}
        onClose={closeModal}
        activityTitle={activityTitle}
        activityId={selectedActivityId}
      />
    </div>
  );
};

export default OtherActivities;
