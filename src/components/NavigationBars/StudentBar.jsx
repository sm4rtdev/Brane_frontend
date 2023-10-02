import React from "react";
import { Link } from "react-router-dom";

import {
  PersonCircleOutline,
  PlayCircleOutline,
  HeartOutline,
  Discover,
  Search,
} from "../../assets/icons";

const StudentBar = ({ slug }) => {
  return (
    <div className="navigation-bar student">
      <div className="container">
        <Link to="/">
          <Discover />
          <span>Descubrir</span>
        </Link>
        <Link to="/search">
          <Search />
          <span>Buscar</span>
        </Link>
        <Link to="/my-courses">
          <PlayCircleOutline />
        </Link>
        <Link to="/wishlist">
          <HeartOutline />
          <span>Mis listas</span>
        </Link>
        <Link to={`/user/${slug}`}>
          <PersonCircleOutline />
          <span>Perfil</span>
        </Link>
      </div>
    </div>
  );
};

export default StudentBar;
