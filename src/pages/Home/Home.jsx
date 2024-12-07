import React from "react";
import "./Home.css";
import Sidebar from "../../components/Sidebar/Sidebar";

const Home = () => {
  return (
    <div className="home">
      <div className="sidebar-div">
        <Sidebar />
      </div>

      <div className="home-main">
        <h1 className="text">Domaci Zadaci: Matematika</h1>
        <div className="all-homeworks">
          <div className="completed-work">
            <div className="complete">
              <p>Zavrseni Zadaci</p>
            </div>
            <div className="work">
              <h1>Work Name</h1>
              <h2>Work descriptionasdsadasdasdassdasdasasdasdasdasdas</h2>
              <button className="complete-button">Completed</button>
            </div>
            <div className="work">
              <h1>Work Name</h1>
              <h2>Work description</h2>
              <button>Completed</button>
            </div>
            <div className="work">
              <h1>Work Name</h1>
              <h2>Work description</h2>
              <button>Completed</button>
            </div>
          </div>
          <div className="incomplete-work">
            <div className="buttons">
              <button className="incomplete-check">Incomplete</button>
              <button className="waiting-check">Waiting for approval</button>
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
  );
};

export default Home;
