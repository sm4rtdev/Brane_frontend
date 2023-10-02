import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./HeaderDropdown.scss";

import {
  ChatboxEllipsesOutline,
  PersonCircleOutline,
  PlayCircleOutline,
  IdCardOutline,
  LogOutOutline,
  PersonOutline,
  HeartOutline,
} from "../../assets/icons";

import { getImageLinkFrom } from "../../helpers/getImageLinkFrom";
import { UserDataContext } from "../../contexts/UserDataContext";
import FancyImage from "../FancyImage/FancyImage";
import { DictionaryContext } from "../../contexts/DictionaryContext";

const HeaderDropdown = ({ greetingText, company, institution }) => {
  const navigate = useNavigate();
  const { dictionary, language } = useContext(DictionaryContext);
  const { userData, closeSession, changeMode } = useContext(UserDataContext);

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
      id="header-dropdown"
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
    >
      <button className="profile-picture" onClick={toggleUserDropdown}>
        {userData.avatar ? (
          <FancyImage
            src={getImageLinkFrom(userData.avatar.formats.thumbnail.url)}
          />
        ) : (
          <PersonOutline />
        )}
      </button>

      {userData.info && (
        <>
          <div className="vertical">
            {greetingText && <strong>{greetingText}!</strong>}

            <p>{`${userData.info.nombre} ${
              !company ? userData.info.apellidos : ""
            }`}</p>
          </div>

          {(isUserHovering || isUserDropdownOpen) && (
            <div className="dropdown">
              <strong>{`${userData.info.nombre} ${
                !company ? userData.info.apellidos : ""
              }`}</strong>
              <span>{userData.info.email}</span>

              <div className="links">
                {!institution && (
                  <Link to={"/my-courses"} className="option">
                    <PlayCircleOutline />
                    {dictionary.header.dropdown[0][language]}
                  </Link>
                )}
                {!company && (
                  <>
                    <Link to={"/wishlist"} className="option">
                      <HeartOutline />
                      {dictionary.header.dropdown[1][language]}
                    </Link>
                    <Link to={"/chat"} className="option">
                      <ChatboxEllipsesOutline />
                      {dictionary.header.dropdown[2][language]}
                    </Link>
                    {userData.instructor &&
                      (userData.mode === "instructor" ? (
                        <button
                          onClick={() => changeMode(0)}
                          className="option"
                        >
                          <IdCardOutline />
                          {dictionary.header.dropdown[3][language]}
                        </button>
                      ) : (
                        <button
                          onClick={() => changeMode(1)}
                          className="option"
                        >
                          <IdCardOutline />
                          {dictionary.header.dropdown[4][language]}
                        </button>
                      ))}
                  </>
                )}
                <Link to={`/user/${userData.info.slug}`} className="option">
                  <PersonCircleOutline />
                  {dictionary.header.dropdown[5][language]}
                </Link>
              </div>

              <button onClick={() => closeSession(navigate)}>
                <LogOutOutline />
                {dictionary.header.dropdown[6][language]}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HeaderDropdown;
