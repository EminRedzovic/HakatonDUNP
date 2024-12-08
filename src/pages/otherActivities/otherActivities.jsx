import React, { useEffect, useState } from "react";
import StarRating from "../../assets/StarRating";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./otherActivities.css";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import SubmitActivityModal from "../../components/modal";

const OtherActivities = () => {
  const [unassignedActivities, setUnassignedActivities] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const activitiesCollection = collection(db, "activities");
  const userCollection = collection(db, "users");

  const [myProfile, setMyProfile] = useState(null);
  const [activityTitle, setActivityTitle] = useState("");
  const [activityData, setActivityData] = useState([]);

  const openModal = (id) => {
    setSelectedActivityId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const getMyProfile = async () => {
    try {
      const data = await getDocs(userCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const userProfile = filteredData.find((user) => user.email === token);

      if (userProfile) {
        setMyProfile(userProfile);
      } else {
        console.error("User not found.");
        setMyProfile(null);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const getAllActivities = async () => {
    if (myProfile) {
      const data = await getDocs(activitiesCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const myClassActivities = filteredData.filter(
        (activity) => activity.class === myProfile.class
      );

      const completedActivities = filteredData.filter((item) =>
        item.participants.some((participant) => participant.email === token)
      );

      const unassignedActivities = filteredData.filter(
        (item) => !item.participants.some((participant) => participant.email === token)
      );

      setUnassignedActivities(unassignedActivities);
      setCompletedActivities(completedActivities);
      setActivityData(myClassActivities);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchProfile = async () => {
      try {
        await getMyProfile();
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [token]);

  useEffect(() => {
    getAllActivities();
  }, [myProfile]);

  return (
    <div className="other-activities">
      <div className="sidebar-div">
        <Sidebar />
      </div>

      <div className="activities-main">
        {myProfile ? (
          <div>
            <div className="activities-header">
              <h1>Vannastavne Aktivnosti</h1>
            </div>

            <div className="all-activities">
              <div className="unassigned-activities">
                <h2>Nepridružene Aktivnosti</h2>
                {unassignedActivities.length > 0 ? (
                  unassignedActivities.map((activity) => (
                    <div className="activity-card" key={activity.id}>
                      <div className="activity-header">
                        <h2>{activity.title}</h2>
                        <p>{activity.description}</p>
                      </div>
                      <div className="activity-footer">
                        <p>Datum: {activity.date}</p>
                        <button
                          onClick={() => {
                            openModal(activity.id);
                            setActivityTitle(activity.title);
                          }}
                        >
                          Pridruži se
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Nema nepridruženih aktivnosti.</p>
                )}
              </div>

              <div className="completed-activities">
                <h2>Završene Aktivnosti</h2>
                {completedActivities.map((activity) => (
                  <div className="activity-card" key={activity.id}>
                    <div className="activity-header">
                      <h2>{activity.title}</h2>
                      <p>{activity.description}</p>
                    </div>
                    <StarRating
                      initialRating={activity.rating}
                      totalStars={5}
                      isEditable={false}
                    />
                    <div className="activity-footer">
                      <p>Datum: {activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
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
