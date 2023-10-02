import React from "react";
import { Link } from "react-router-dom";

import { AppsOutline, PeopleCircleOutline } from "../../assets/icons";

const InstitutionBar = () => {
  return (
    <div className="navigation-bar institution">
      <div className="container">
        <Link to="/">
          <AppsOutline />
          <span>Inicio</span>
        </Link>
        <Link to="/manage-instructors">
          <PeopleCircleOutline />
          <span>Agregar usuarios</span>
        </Link>
      </div>
    </div>
  );
};

export default InstitutionBar;
