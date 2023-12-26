import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { PersonCircleOutline, PlayCircleOutline, HeartOutline, Discover, Search } from "../../assets/icons";

import { DictionaryContext } from "../../contexts/DictionaryContext";

const StudentBar = ({ slug }) => {
  const { dictionary, language } = useContext(DictionaryContext);

  return (
    <div className="navigation-bar student">
      <div className="container">
        <Link to="/">
          <Discover />
          <span>{dictionary.navigationBars.student[0][language]}</span>
        </Link>
        <Link to="/search">
          <Search />
          <span>{dictionary.navigationBars.student[1][language]}</span>
        </Link>
        <Link to="/my-courses">
          <PlayCircleOutline />
        </Link>
        <Link to="/wishlist">
          <HeartOutline />
          <span>{dictionary.navigationBars.student[2][language]}</span>
        </Link>
        <Link to={`/user/${slug}`}>
          <PersonCircleOutline />
          <span>{dictionary.navigationBars.student[3][language]}</span>
        </Link>
      </div>
    </div>
  );
};

export default StudentBar;
