import React from "react";
import { Link } from "react-router-dom";

import {
  PeopleCircleOutline,
  HelpCircleOutline,
  AppsOutline,
  StatsChart,
} from "../../assets/icons";

const BusinessBar = () => {
  return (
    <div className="navigation-bar business">
      <div className="container">
        <Link to="/">
          <AppsOutline />
          <span>Catálogo</span>
        </Link>
        <Link to="/add-users">
          <PeopleCircleOutline />
          <span>Agregar usuarios</span>
        </Link>
        <Link to={`/statistics`}>
          <StatsChart />
          <span>Estadísticas</span>
        </Link>
        <Link to={`/faq`}>
          <HelpCircleOutline />
          <span>FAQ</span>
        </Link>
      </div>
    </div>
  );
};

export default BusinessBar;
