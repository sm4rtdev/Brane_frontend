import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./CustomHeaders.scss";

import {
  NotificationsOutline,
  PersonCircleOutline,
  LogOutOutline,
  PersonOutline,
  LogoBrane,
  Settings,
} from "../../assets/icons";

import FancyImage from "../FancyImage/FancyImage";
import { getImageLinkFrom } from "../../helpers/getImageLinkFrom";
import { UserDataContext } from "../../contexts/UserDataContext";
import { DictionaryContext } from "../../contexts/DictionaryContext";
import Languages from "../Languages/Languages";

const InstitutionHeader = ({ openOptionsMenu }) => {
  const navigate = useNavigate();

  const { dictionary, language } = useContext(DictionaryContext);
  const { userData, closeSession } = useContext(UserDataContext);

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isUserHovering, setIsUserHovering] = useState(false);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen((c) => !c);
  };
  const toggleHover = () => {
    setIsUserHovering((c) => !c);
  };

  return (
    <div className="page-header custom-header">
      <Link to="/" className="logo">
        <LogoBrane />
      </Link>

      <div className="buttons-section">
        <Link to="/notifications" className="small-button">
          <NotificationsOutline />
        </Link>

        <Languages border={false}/>

        <div className="user" onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
          <button className="profile-picture" onClick={toggleUserDropdown}>
            {userData.avatar ? (
              <FancyImage src={getImageLinkFrom(userData.avatar.formats.thumbnail.url)} />
            ) : (
              <PersonOutline />
            )}
          </button>

          {userData.info && (
            <>
              <div className="vertical">
                <strong>{`${userData.info.nombre}`}</strong>
              </div>

              {(isUserHovering || isUserDropdownOpen) && (
                <div className="dropdown">
                  <strong>{`${userData.info.nombre}`}</strong>
                  <span>{userData.info.email}</span>

                  <div className="links">
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
      </div>

      <div className="buttons-section mobile">
        <Link to="/notifications" className="small-button">
          <NotificationsOutline />
        </Link>
        {openOptionsMenu && (
          <button className="small-button" onClick={openOptionsMenu}>
            <Settings />
          </button>
        )}
      </div>
    </div>
  );
};

export default InstitutionHeader;
