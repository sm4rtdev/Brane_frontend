import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LogoBrane } from "../../../../assets/icons";

import PageTransition from "../../../../components/PageTransition/PageTransition";
import { UserDataContext } from "../../../../contexts/UserDataContext";

import "./RoleSelection.scss";

const RoleSelection = () => {
  const { changeMode } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [array, setArray] = useState([1]);

  useEffect(() => {
    const interval = setInterval(() => {
      // You'd want an exit condition here
      setArray((arr) => {
        if (arr.length < 10) {
          return [...arr, arr.length + 1];
        } else {
          clearInterval(interval);
          return arr;
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const changeRole = (id) => {
    changeMode(id);
    navigate("/");
  };

  return (
    <div id="role-selection-page" className="page">
      <PageTransition>
        <div className="animation">
          {array.map((index) => {
            return (
              <div
                key={index}
                className="circle"
                style={{
                  width: `${10 * index}%`,
                  borderColor: `rgba(255,255,255,${
                    index < 5 ? 10 * index : 100 - index * 10
                  }%)`,
                }}
              ></div>
            );
          })}

          <div className="logo">
            <LogoBrane />
          </div>
        </div>

        <div className="main">
          <div className="logo">
            <LogoBrane />
          </div>

          <div className="center">
            <strong>Selecciona el perfil con el que quieres acceder</strong>

            <div className="selection">
              <button className="action-button" onClick={() => changeRole(0)}>
                Estudiante
              </button>
              <button className="action-button" onClick={() => changeRole(1)}>
                Instructor
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default RoleSelection;
