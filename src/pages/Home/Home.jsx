import React, { useState } from "react";
import "./Home.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { MdMapsHomeWork } from "react-icons/md";
import { GiArmorUpgrade } from "react-icons/gi";
import { FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [selectedButton, setSelectedButton] = useState(null);
  const navigate = useNavigate();

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

  return (
    <div className="home">
      <div className="sidebar-div">
        <Sidebar />
      </div>

      <div className="home-main">
        <div className="all-homeworks">
          <div className="completed-work">
            <div className="complete">
              <p>Zavrseni Zadaci</p>
            </div>
            <div
              className="work"
              onClick={() => {
                navigate("/submitedForm");
              }}
            >
              <div className="work-name">
                <MdMapsHomeWork size={40} color="white" />
                <h1>Matematika - sabiranje</h1>
              </div>
              <div className="work-name">
                <GiArmorUpgrade size={40} color="#62b6a9" />
                <h1
                  style={{
                    color: "#62b6a9",
                  }}
                >
                  5 stars
                </h1>
              </div>
              <div className="work-name">
                <FaComment size={40} color="#D9CD65" />
                <p>
                  Moras vise poraditi na obradi brojeva o toku fotosinteze real
                  madrida kad mbappe
                </p>
              </div>
              <p
                style={{
                  textAlign: "center",
                }}
              >
                Klikni na karticu za vise informacija
              </p>
            </div>
            <div
              className="work"
              onClick={() => {
                navigate("/submitedForm");
              }}
            >
              <div className="work-name">
                <MdMapsHomeWork size={40} color="white" />
                <h1>Matematika - sabiranje</h1>
              </div>
              <div className="work-name">
                <GiArmorUpgrade size={40} color="#62b6a9" />
                <h1
                  style={{
                    color: "#62b6a9",
                  }}
                >
                  5 stars
                </h1>
              </div>
              <div className="work-name">
                <FaComment size={40} color="#D9CD65" />
                <p>
                  Moras vise poraditi na obradi brojeva o toku fotosinteze real
                  madrida kad mbappe
                </p>
              </div>
              <p
                style={{
                  textAlign: "center",
                }}
              >
                Klikni na karticu za vise informacija
              </p>
            </div>
            <div
              className="work"
              onClick={() => {
                navigate("/submitedForm");
              }}
            >
              <div className="work-name">
                <MdMapsHomeWork size={40} color="white" />
                <h1>Matematika - sabiranje</h1>
              </div>
              <div className="work-name">
                <GiArmorUpgrade size={40} color="#62b6a9" />
                <h1
                  style={{
                    color: "#62b6a9",
                  }}
                >
                  5 stars
                </h1>
              </div>
              <div className="work-name">
                <FaComment size={40} color="#D9CD65" />
                <p>
                  Moras vise poraditi na obradi brojeva o toku fotosinteze real
                  madrida kad mbappe
                </p>
              </div>
              <p
                style={{
                  textAlign: "center",
                }}
              >
                Klikni na karticu za vise informacija
              </p>
            </div>
          </div>
          <div className="incomplete-work">
            <div className="buttons">
              <div
                className={`incomplete-check ${
                  selectedButton === "incomplete" ? "selected" : ""
                }`}
                onClick={() => handleButtonClick("incomplete")}
              >
                Incomplete
              </div>
              <div
                className={`waiting-check ${
                  selectedButton === "waiting" ? "selected" : ""
                }`}
                onClick={() => handleButtonClick("waiting")}
              >
                Waiting for approval
              </div>
            </div>
            <div className="home-works">
              <div className="work">
                <h1>Work Name</h1>
                <h2>Work description</h2>
                <button className="incomplete-button">Completed</button>
              </div>
              <div className="work">
                <h1>Work Name</h1>
                <h2>Work description</h2>
                <button className="incomplete-button">Completed</button>
              </div>
              <div className="work">
                <h1>Work Name</h1>
                <h2>Work description</h2>
                <button className="incomplete-button">Completed</button>
              </div>
              <div className="work">
                <h1>Work Name</h1>
                <h2>Work description</h2>
                <button className="incomplete-button">Completed</button>
              </div>
              <div className="work">
                <h1>Work Name</h1>
                <h2>Work description</h2>
                <button className="incomplete-button">Completed</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
