import React, { useEffect, useState } from "react";
import StarRating from "../../assets/StarRating";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./otherActivities.css";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../components/modal.css";


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

  /* const formik = useFormik({
    initialValues: {
      Opis: "",
      image: null,
      activityTitle: "",
      studentData: selectedStudent,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (selectedStudent) {
        const studentDocRef = doc(db, "activities", selectedStudent.id);
        try {
          console.log(selectedStudent.id);
          // Create an object to store the activity data
          const activityData = {
            title: values.activityTitle,
            description: values.activityDescription,
            image: values.activityImage, // Base64 encoded image
            email: selectedStudent.email,
            timestamp: new Date().toISOString(),
          };

          // Add the activity to the student's document
          await setDoc(
            studentDocRef,
            {
              activities: {
                [new Date().getTime()]: activityData, // Use timestamp as unique key
              },
            },
            { merge: true } // Merge new activity data with existing document
          );

          console.log("Activity added to Firebase:", activityData);
          closeModal();
        } catch (error) {
          console.error("Error adding activity to Firebase:", error);
        }
      }
    },
  });*/

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
                  <h2>{activity.aTitle}</h2>
                  <p>{activity.aDescription}</p>
                </div>
                <div className="activity-footer">
                  <p>Datum: {activity.timestamp || "Nije postavljen datum"}</p>
                  <button
                    className="activity-button"
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
    </div>
  );
};

export default OtherActivities;
