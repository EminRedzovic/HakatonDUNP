import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { getMyProfile } from "../../firebase";
import { useNavigate } from "react-router-dom";
import logoSidebar from "../../photos/download-removebg-preview.png";
import { TbVocabulary } from "react-icons/tb";
import { BiMath } from "react-icons/bi";
import { FaEarthAmericas } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";

const Sidebar = () => {
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const predmeti = [
    "Srpski Jezik",
    "Matematika",
    "Geografija",
    "Istorija",
    "Engleski Jezik",
  ];

  useEffect(() => {
    if (!token) {
      return;
    }
    const fetchProfile = async () => {
      try {
        await getMyProfile(token, setMyProfile);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, [token]);

  console.log(myProfile);

  return (
    <div className="sidebar">
      <div className="top">
        <img src={logoSidebar} className="logo-sidebar" alt="" />
        {myProfile ? (
          myProfile[0].isTeacher ? (
            <div className="top-header-content">
              <p className="profesor-ucenik-sidebar">Profesor</p>
              <p className="ime-prezime-sidebar">
                {myProfile[0].name} {myProfile[0].lastName}
              </p>
            </div>
          ) : (
            <div className="top-header-content">
              <p className="profesor-ucenik-sidebar">Ucenik</p>
              <p className="ime-prezime-sidebar">
                {myProfile[0].name} {myProfile[0].lastName}
              </p>
            </div>
          )
        ) : null}
      </div>

      <div className="middle">
        <ul>
          {predmeti.map((predmet) => (
            <li className="object-li-div">{predmet}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
