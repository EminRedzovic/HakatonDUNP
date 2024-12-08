import React, { useEffect, useState } from "react";
import StarRating from "../../assets/StarRating";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./otherActivities.css";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import "../../components/modal.css";
import { ToastContainer, toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles

const OtherActivities = () => {
  const [activityData, setActivityData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [activityTitle, setActivityTitle] = useState("");
  const [uDescription, setUDescription] = useState("");
  const [uImage, setUImage] = useState(null);

  const token = localStorage.getItem("token"); // Token koji predstavlja trenutnog korisnika
  const activitiesCollection = collection(db, "activities");

  const openModal = (id, title) => {
    setSelectedActivityId(id);
    setActivityTitle(title);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const getAllActivities = async () => {
    try {
      const data = await getDocs(activitiesCollection);
      const filteredData = data.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        .filter(
          (activity) =>
            activity.email === token && activity.status !== "finished"
        ); // Filter to exclude finished activities
      setActivityData(filteredData); // Set filtered activities to state
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const activityRef = doc(db, "activities", selectedActivityId);
      await updateDoc(activityRef, {
        uDescription: uDescription,
        uImage: uImage ? uImage : null,
        status: "finished", // Mark as finished
      });
      setIsModalOpen(false);
      toast.success("Activity finished successfully!"); // Show toast success message
      getAllActivities();
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getAllActivities();
    }
  }, [token]);

  return (
    <div className="students-page">
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
                  <h2>{activity.aTitle}</h2>
                </div>
                <div className="activity-footer">
                  <p>{activity.aDescription}</p>
                  <p>Datum: {activity.timestamp || "Nije postavljen datum"}</p>
                  <button
                    className="activity-button"
                    onClick={() => openModal(activity.id, activity.aTitle)}
                  >
                    Zavrsi
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Nema dostupnih aktivnosti.</p>
          )}
        </div>
      </div>

      {/* Modal for finishing activity */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Finish Activity: {activityTitle}</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-input-group">
                <label htmlFor="uDescription">Opis završetka aktivnosti</label>
                <textarea
                  id="uDescription"
                  value={uDescription}
                  onChange={(e) => setUDescription(e.target.value)}
                  placeholder="Unesite opis završetka aktivnosti"
                  required
                />
              </div>

              <div className="modal-input-group">
                <label htmlFor="uImage">Dodajte sliku</label>
                <input
                  type="file"
                  id="uImage"
                  accept="image/*"
                  onChange={(e) =>
                    setUImage(URL.createObjectURL(e.target.files[0]))
                  }
                />
                {uImage && (
                  <img
                    src={uImage}
                    alt="Uploaded preview"
                    style={{ width: "100px", height: "auto" }}
                  />
                )}
              </div>

              <div className="modal-button-group">
                <button type="submit">Završi Aktivnost</button>
                <button type="button" onClick={closeModal}>
                  Zatvori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ToastContainer to display toast notifications */}
      <ToastContainer />
    </div>
  );
};

export default OtherActivities;
