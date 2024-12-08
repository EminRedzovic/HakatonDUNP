import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SubjectHomework.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { db } from "../../firebase";
import { getDocs, collection } from "firebase/firestore";

const SubjectHomeworks = () => {
  const { subject } = useParams();
  const homeworkCollection = collection(db, "homework");
  const userCollection = collection(db, "users");
  const [homeworks, setHomeworks] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const token = localStorage.getItem("token");

  const getMyProfile = async () => {
    try {
      const data = await getDocs(userCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, // Directly access doc.id, not doc.id()
      }));

      const userProfile = filteredData.find((user) => user.email === token);

      if (userProfile) {
        setMyProfile(userProfile);
      } else {
        console.error("Korisnik nije pronađen.");
        setMyProfile(null); // Osiguranje
      }
    } catch (error) {
      console.error("Greška prilikom učitavanja profila:", error);
    }
  };

  const getAllHomeWorks = async () => {
    if (myProfile) {
      const data = await getDocs(homeworkCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(), // Corrected to access doc.data() for homework data
        id: doc.id, // Access doc.id directly
      }));

      const thisSubjectHomeworks = filteredData.filter(
        (homework) => homework.predmet === subject
      );

      const myClassHomeworks = thisSubjectHomeworks.filter(
        (homework) => homework.odeljenje === myProfile.odeljenje
      );

      setHomeworks(myClassHomeworks);
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
        console.log(err);
      }
    };

    fetchProfile();
  }, [token]);

  useEffect(() => {
    getAllHomeWorks();
  }, [myProfile]);

  console.log(myProfile);
  console.log(homeworks);

  return (
    <div className="subject-homework">
      <div className="sidebar-div">
        <Sidebar />
      </div>

      <div className="subject-homeworks-div">
        <h1>Domaci {subject}</h1>

        <div className="homeworks">
          {homeworks.length > 0 ? (
            homeworks.map((homework) => (
              <div className="homework">
                <div className="homework-header">
                  <h2 className="homework-title">{homework.title}</h2>
                  <p className="homework-predmet">{homework.predmet}</p>
                </div>

                <div className="homework-down">
                  <p className="homework-description">{homework.description}</p>
                  <p className="homework-date">Rok: {homework.dueDate}</p>
                  <button className="homework-button">Otvori</button>
                </div>
              </div>
            ))
          ) : (
            <p className="ndz">Nema domacih zadataka :)</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectHomeworks;
