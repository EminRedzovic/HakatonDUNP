import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { useNavigate, Navigate } from "react-router-dom";
import logoSidebar from "../../photos/download-removebg-preview.png";
import { TbVocabulary } from "react-icons/tb";
import { BiMath } from "react-icons/bi";
import { FaEarthAmericas } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { IoPersonAddSharp } from "react-icons/io5";
import { PiExamFill } from "react-icons/pi";
import { MdNoteAdd } from "react-icons/md";
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

  if (!token) {
    return <Navigate to="/register" replace={true} />;
  }

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
        ) : (
          <h1 style={{ marginTop: "10px" }}>Loading...</h1>
        )}

        <button onClick={logout} className="signout-button">
          Izloguj se
        </button>
      </div>

      <div className="middle">
        {myProfile ? (
          myProfile[0].isTeacher ? (
            <ul>
              <li className="object-li-div">
                Domaci zadaci <PiExamFill />
              </li>
              <li className="object-li-div">
                Dodaj Dommaci zadatak <MdNoteAdd />
              </li>
              <li className="object-li-div">
                Ucenici <FaUserFriends />
              </li>
              <li className="object-li-div">
                Registruj ucenika <IoPersonAddSharp />
              </li>
            </ul>
          ) : (
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
          )
        ) : (
          <h1
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            Loading...
          </h1>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
