import React, { useState, useEffect } from "react";
import "./Home.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { MdMapsHomeWork } from "react-icons/md";
import { GiArmorUpgrade } from "react-icons/gi";
import { FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const Home = () => {
  const [selectedButton, setSelectedButton] = useState(null);
  const navigate = useNavigate();
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
        id: doc.id,
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

      const myClassHomeworks = filteredData.filter(
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

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

  return (
    <div className="home">
      <div className="sidebar-div">
        <Sidebar />
      </div>

      <div className="home-main">
        <h1 className="home-h1">Domaci zadaci</h1>

        <div className="all-homeworks">
          <div className="nezavrseni-domaci">
            {homeworks.length > 0 ? (
              homeworks.map((homework) => (
                <div className="homework-home">
                  <div className="homework-home-header">
                    <h2 className="homework-home-title">{homework.title}</h2>
                    <p className="homework-home-predmet">{homework.predmet}</p>
                  </div>

                  <div className="homework-home-down">
                    <p className="homework-home-description">
                      {homework.description}
                    </p>
                    <p className="homework-home-date">
                      Rok: {homework.dueDate}
                    </p>

                    <div className="homework-home-buttons-div">
                      <button className="homework-home-button">Otvori</button>
                      <button className="homework-home-button-resi">
                        Resi
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="ndz">Nema domacih zadataka :)</p>
            )}
          </div>

          <div className="complited-homeworks">
            <h2 className="zdz">Zavrseni domaci zadaci</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
