import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./MsgDropdown.scss";

import { SchoolOutline } from "../../assets/icons";
import { UserDataContext } from "../../contexts/UserDataContext";
import Tabulation from "../Tabulation/Tabulation";
import { DictionaryContext } from "../../contexts/DictionaryContext";

const MsgDropdown = () => {
  const navigate = useNavigate();
  const { dictionary, language } = useContext(DictionaryContext);
  const { userData, changeMode } = useContext(UserDataContext);

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isUserHovering, setIsUserHovering] = useState(false);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen((c) => !c);
  };
  const toggleHover = () => {
    setIsUserHovering((c) => !c);
  };

  return (
    <div
      id="msg-dropdown"
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
    >
      <button
        to="/notifications"
        className="small-button"
        onClick={toggleUserDropdown}
      >
        <SchoolOutline />
      </button>

      {(isUserHovering || isUserDropdownOpen) && (
        <div className="dropdown">
          <Tabulation
            tabs={
              userData.instructor
                ? [
                    dictionary.header.msgDropdown.tabs[0][language],
                    dictionary.header.msgDropdown.tabs[1][language],
                  ]
                : [dictionary.header.msgDropdown.tabs[0][language]]
            }
            options={{ type: "bubble", color: "yellow" }}
          >
            <>
              <p className="no-data">
                {dictionary.header.msgDropdown.text[language]}
              </p>
              <Link to="/chat" className="link">
                {dictionary.header.msgDropdown.button[language]}
              </Link>
            </>
            <>
              <p className="no-data">
                {dictionary.header.msgDropdown.text[language]}
              </p>
              <button
                className="link"
                onClick={() => {
                  changeMode(1);
                  navigate("/messages");
                }}
              >
                {dictionary.header.msgDropdown.button[language]}
              </button>
            </>
          </Tabulation>
        </div>
      )}
    </div>
  );
};

export default MsgDropdown;
