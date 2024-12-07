import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { getMyProfile } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
        <div className="pfp"></div>
        <p
          className="username"
          onClick={() => {
            navigate("/profile");
          }}
        >
          username_1
        </p>
      </div>

      <div className="middle">
        <ul>
          <li onClick={() => navigate("/")}>Kvizovi</li>
          <li onClick={() => navigate("/friends")}>Prijatelji</li>
          <li className="o3">Takmicenja</li>
        </ul>
      </div>

      <div className="bottom"></div>
    </div>
  );
};

export default Sidebar;
