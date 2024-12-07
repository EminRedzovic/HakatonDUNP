import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import logoSidebar from "../../photos/download-removebg-preview.png";
import { TbVocabulary } from "react-icons/tb";
import { BiMath } from "react-icons/bi";
import { FaEarthAmericas } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { signOut } from "firebase/auth";

const Sidebar = () => {
  const [myProfile, setMyProfile] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const userCollection = collection(db, "users");

  const getMyProfile = async () => {
    const data = await getDocs(userCollection);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const myProfile = filteredData.filter(
      (user) => user.email === auth.currentUser.email
    );

    setMyProfile(myProfile);
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    navigate("/register");
  };

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

        <button onClick={logout} className="signout-button">
          Izloguj se
        </button>
      </div>

      <div className="middle">
        <ul>
          <li className="object-li-div">
            Srpski Jezik <TbVocabulary />
          </li>
          <li className="object-li-div">
            Matematika <BiMath />
          </li>
          <li className="object-li-div">
            Geografija <FaEarthAmericas />
          </li>
          <li className="object-li-div">
            Istorija <FaHistory />
          </li>
          <li className="object-li-div">
            Engleski Jezik <TbVocabulary />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
