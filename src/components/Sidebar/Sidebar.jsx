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
import { RiPsychotherapyFill } from "react-icons/ri";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { signOut } from "firebase/auth";

const Sidebar = () => {
  const [myProfile, setMyProfile] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const userCollection = collection(db, "users");

  // Funkcija za dobijanje profila korisnika
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

  // Funkcija za odjavljivanje
  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    navigate("/register");
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

  if (!token) {
    return <Navigate to="/register" replace={true} />;
  }

  return (
    <div className="sidebar">
      <div className="top">
        <img src={logoSidebar} className="logo-sidebar" alt="Logo" />
        {myProfile ? (
          myProfile.isTeacher ? (
            <div className="top-header-content">
              <p className="profesor-ucenik-sidebar">Profesor</p>
              <p className="ime-prezime-sidebar">
                {myProfile.name} {myProfile.lastName}
              </p>
            </div>
          ) : (
            <div className="top-header-content">
              <p className="profesor-ucenik-sidebar">Učenik</p>
              <p className="ime-prezime-sidebar">{myProfile.fullName}</p>
            </div>
          )
        ) : (
          <h1 style={{ marginTop: "10px" }}>Učitavanje...</h1>
        )}
      </div>

      <div className="middle">
        {myProfile ? (
          myProfile.isTeacher ? (
            <ul>
              <li
                className="object-li-div"
                onClick={() => {
                  navigate("/");
                }}
              >
                Domaći zadaci <PiExamFill />
              </li>
              <li
                className="object-li-div"
                onClick={() => {
                  navigate("/teacher/createhomework");
                }}
              >
                Dodaj Domaći zadatak <MdNoteAdd />
              </li>
              <li
                className="object-li-div"
                onClick={() => {
                  navigate("/teacher/students");
                }}
              >
                Učenici <FaUserFriends />
              </li>
              <li
                onClick={() => navigate("/teacher/createNewStudent")}
                className="object-li-div last-li"
              >
                Registruj učenika <IoPersonAddSharp />
              </li>
            </ul>
          ) : (
            <ul>
              <li
                className="object-li-div"
                onClick={() => {
                  navigate("/");
                  window.location.reload();
                }}
              >
                Domaci zadaci <PiExamFill />
              </li>
              <li
                className="object-li-div"
                onClick={() => {
                  navigate("/homeworks/srpski");
                  window.location.reload();
                }}
              >
                Srpski Jezik <TbVocabulary />
              </li>
              <li
                className="object-li-div"
                onClick={() => {
                  navigate("/homeworks/matematika");
                  window.location.reload();
                }}
              >
                Matematika <BiMath />
              </li>
              <li
                className="object-li-div"
                onClick={() => {
                  navigate("/homeworks/geografija");
                  window.location.reload();
                }}
              >
                Geografija <FaEarthAmericas />
              </li>
              <li
                className="object-li-div"
                onClick={() => {
                  navigate("/homeworks/istorija");
                  window.location.reload();
                }}
              >
                Istorija <FaHistory />
              </li>
              <li
                className="object-li-div"
                onClick={() => {
                  navigate("/homeworks/engleski");
                  window.location.reload();
                }}
              >
                Engleski Jezik <TbVocabulary />
              </li>
              <li
                className="object-li-div last-li"
                onClick={() => {
                  navigate("/psychologist");
                  window.location.reload();
                }}
              >
                Obrati se psihologu <RiPsychotherapyFill />
              </li>
            </ul>
          )
        ) : (
          <h1
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            Učitavanje...
          </h1>
        )}

        <div className="signout-button-div">
          <button onClick={logout} className="signout-button">
            Izloguj se
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
