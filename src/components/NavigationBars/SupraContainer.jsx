import React, { useContext } from "react";
import { Outlet } from "react-router-dom";

import "./NavigationBar.scss";

import { UserDataContext } from "../../contexts/UserDataContext";
import SpinnerOfDoom from "../SpinnerOfDoom/SpinnerOfDoom";
import InstitutionBar from "./InstitutionBar";
import InstructorBar from "./InstructorBar";
import BusinessBar from "./BusinessBar";
import StudentBar from "./StudentBar";

const SupraContainer = ({ mode }) => {
  const { userData } = useContext(UserDataContext);

  return (
    <div className={mode !== "student" ? "supra-container" : ""}>
      {userData.info ? (
        mode === "institution" ? (
          <InstitutionBar />
        ) : mode === "business" ? (
          <BusinessBar />
        ) : mode === "instructor" ? (
          <InstructorBar slug={userData.info.slug} />
        ) : (
          <StudentBar slug={userData.info.slug} />
        )
      ) : (
        <SpinnerOfDoom />
      )}

      <Outlet />
    </div>
  );
};

export default SupraContainer;
