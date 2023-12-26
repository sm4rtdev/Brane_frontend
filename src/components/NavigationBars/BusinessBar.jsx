import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { PeopleCircleOutline, HelpCircleOutline, AppsOutline, StatsChart } from "../../assets/icons";

import { DictionaryContext } from "../../contexts/DictionaryContext";

const BusinessBar = () => {
  const { dictionary, language } = useContext(DictionaryContext);

  return (
    <div className="navigation-bar business">
      <div className="container">
        <Link to="/">
          <AppsOutline />
          <span>{dictionary.navigationBars.business[0][language]}</span>
        </Link>
        <Link to="/add-users">
          <PeopleCircleOutline />
          <span>{dictionary.navigationBars.business[1][language]}</span>
        </Link>
        <Link to={`/statistics`}>
          <StatsChart />
          <span>{dictionary.navigationBars.business[2][language]}</span>
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
