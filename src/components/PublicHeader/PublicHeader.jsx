import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LogoBlack } from "../../assets/images";

import "./PublicHeader.scss";
import { DictionaryContext } from "../../contexts/DictionaryContext";
import Languages from "../Languages/Languages";

const PublicHeader = () => {
  const { dictionary, language } = useContext(DictionaryContext);

  return (
    <div id="public-header" className="page-header">
      <Link to="/" className="logo">
        <LogoBlack />
      </Link>

      <nav>
        <Link to={"/"}>{dictionary.publicHeader[0][language]}</Link>
        <Link to={"/business"}>{dictionary.publicHeader[1][language]}</Link>
        <Link to={"/teach"}>{dictionary.publicHeader[2][language]}</Link>
        <Link to={"/institutions"}>{dictionary.publicHeader[3][language]}</Link>
      </nav>

      <div className="access">
        <Languages />
        <Link className="action-button" to={"/auth/login"}>
          {dictionary.publicHeader[4][language]}
        </Link>
        <Link className="action-button" to={"/auth/signup"}>
          {dictionary.publicHeader[5][language]}
        </Link>
      </div>
    </div>
  );
};

export default PublicHeader;
