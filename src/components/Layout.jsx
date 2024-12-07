import React from "react";
import "./Layout.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="top">
        <div className="pfp"></div>
        <p className="username">username_1</p>
      </div>

      <div className="middle">
        <ul>
          <li>Kvizovi</li>
          <li>Prijatelji</li>
          <li className="o3">Takmicenja</li>
        </ul>
      </div>

      <div className="bottom"></div>
    </div>
  );
};

const Layout = (props) => {
  return (
    <div>
      <Sidebar />
      <div>{props.children}</div>
    </div>
  );
};

export default Layout;
