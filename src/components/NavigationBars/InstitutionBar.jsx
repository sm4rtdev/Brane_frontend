import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { AppsOutline, PeopleCircleOutline } from "../../assets/icons";

import { DictionaryContext } from "../../contexts/DictionaryContext";

const InstitutionBar = () => {
  const { dictionary, language } = useContext(DictionaryContext);

  return (
    <div className="navigation-bar institution">
      <div className="container">
        <Link to="/">
          <AppsOutline />
          <span>{dictionary.navigationBars.institution[0][language]}</span>
        </Link>
        <Link to="/manage-instructors">
          <PeopleCircleOutline />
          <span>{dictionary.navigationBars.business[1][language]}</span>
        </Link>
      </div>
    </div>
  );
};

export default InstitutionBar;
