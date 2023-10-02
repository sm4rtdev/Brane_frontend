import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./CustomHeaders.scss";

import {
  NotificationsOutline,
  PersonCircleOutline,
  PlayCircleOutline,
  LogOutOutline,
  PersonOutline,
  IdCardOutline,
  LogoBrane,
  Settings,
} from "../../assets/icons";

import FancyImage from "../FancyImage/FancyImage";
import { getImageLinkFrom } from "../../helpers/getImageLinkFrom";
import { UserDataContext } from "../../contexts/UserDataContext";

const InstructorHeader = ({ openOptionsMenu }) => {
  const navigate = useNavigate();

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
    <div className="page-header custom-header">
      <Link to="/" className="logo">
        <LogoBrane />
      </Link>

      <div className="buttons-section">
        <Link to="/notifications" className="small-button">
          <NotificationsOutline />
        </Link>

        <div
          className="user"
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
                <strong>{`${userData.info.nombre} ${userData.info.apellidos}`}</strong>
              </div>

              {(isUserHovering || isUserDropdownOpen) && (
                <div className="dropdown">
                  <strong>{`${userData.info.nombre} ${userData.info.apellidos}`}</strong>
                  <span>{userData.info.email}</span>

                  <div className="links">
                    <Link to={"/my-courses"} className="option">
                      <PlayCircleOutline />
                      Mis cursos
                    </Link>
                    <Link to={`/user/${userData.info.slug}`} className="option">
                      <PersonCircleOutline />
                      Perfil
                    </Link>
                    <button className="option" onClick={() => changeMode(0)}>
                      <IdCardOutline />
                      Volver al modo Estudiante
                    </button>
                  </div>

                  <button onClick={() => closeSession(navigate)}>
                    <LogOutOutline />
                    Cerrar sesión
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
        {openOptionsMenu !== undefined && (
          <button className="small-button" onClick={openOptionsMenu}>
            <Settings />
          </button>
        )}
      </div>
    </div>
  );
};

export default InstructorHeader;
