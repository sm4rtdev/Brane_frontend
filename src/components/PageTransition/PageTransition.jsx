import React, { useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { UserDataContext } from "../../contexts/UserDataContext";

import "./PageTransition.scss";

const PageTransition = ({ children, margin }) => {
  const { userData } = useContext(UserDataContext);
  const { pathname } = useLocation();
  const page = useRef(null);

  useEffect(() => {
    if (page.current) {
      if (page.current.classList.contains("full-opacity")) {
        page.current.classList.remove("full-opacity");

        setTimeout(() => {
          page.current.classList.add("full-opacity");
        }, 0);
      } else {
        page.current.classList.add("full-opacity");
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (page.current) {
      page.current.classList.remove("full-opacity");

      setTimeout(() => {
        if (page.current) {
          page.current.classList.add("full-opacity");
        }
      }, 0);
    }
  }, [userData]);

  return (
    <div
      className={`page-transition ${margin ? "margin" : ""} ${
        userData.mode === "instructor" ? "instructor" : ""
      }`}
      ref={page}
    >
      {children}
    </div>
  );
};

export default PageTransition;
