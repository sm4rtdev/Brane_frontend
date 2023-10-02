import React from "react";
import { Link } from "react-router-dom";
import { LogoBlack } from "../../assets/images";

import "./PublicHeader.scss";

const PublicHeader = () => {
  return (
    <div id="public-header" className="page-header">
      <Link to="/" className="logo">
        <LogoBlack />
      </Link>

      <nav>
        <Link to={"/"}>Inicio</Link>
        <Link to={"/business"}>Empresas</Link>
        <Link to={"/teach"}>Instructores</Link>
        <Link to={"/institutions"}>Instituciones</Link>
      </nav>

      <div className="access">
        <Link className="action-button" to={"/auth/login"}>
          Iniciar sesión
        </Link>
        <Link className="action-button" to={"/auth/signup"}>
          Regístrate gratis
        </Link>
      </div>
    </div>
  );
};

export default PublicHeader;
