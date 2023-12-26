import React, { useContext } from "react";
import { Link } from "react-router-dom";

import {
  ChatboxEllipsesOutline,
  PlayCircleOutline,
  PricetagOutline,
  CashOutline,
  VideocamOutline,
} from "../../assets/icons";

import { DictionaryContext } from "../../contexts/DictionaryContext";

const InstructorBar = () => {
  const { dictionary, language } = useContext(DictionaryContext);

  return (
    <div className="navigation-bar instructor">
      <div className="container">
        <Link to="/create-course">
          <PlayCircleOutline />
          <span>{dictionary.navigationBars.instructor[0][language]}</span>
        </Link>
        <Link to="/create-conference">
          <VideocamOutline />
          <span>{dictionary.navigationBars.instructor[1][language]}</span>
        </Link>
        <Link to="/messages">
          <ChatboxEllipsesOutline />
          <span>{dictionary.navigationBars.instructor[2][language]}</span>
        </Link>
        <Link to={`/coupons`}>
          <PricetagOutline />
          <span>{dictionary.navigationBars.instructor[3][language]}</span>
        </Link>
        <Link to={`/payments`}>
          <CashOutline />
          <span>{dictionary.navigationBars.instructor[4][language]}</span>
        </Link>
      </div>
    </div>
  );
};

export default InstructorBar;
