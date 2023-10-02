import React, { useEffect, useState } from "react";

import "./CreateCoursePage.scss";

import InstructorHeader from "../../../../components/CustomHeaders/InstructorHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import Footer from "../../../../components/Footer/Footer";
import CreateCourseInfo from "./CreateCourseInfo";
import AddLessons from "./AddLessons";
import { goUp } from "../../../../helpers/ScrollToTop";

const CreateCoursePage = () => {
  const [openTab, setOpenTab] = useState(0);
  const [courseID, setCourseID] = useState(null);

  useEffect(() => {
    goUp();
  }, [openTab]);

  return (
    <div id="create-course" className="page">
      <PageTransition>
        <InstructorHeader />

        <div className="status-bar">
          <div className={`block ${openTab === 0 ? "current" : ""}`}>
            <p>Cuéntanos sobre tu curso</p>
          </div>
          <div className={`block ${openTab === 1 ? "current" : ""}`}>
            <p>Añade lecciones a tu curso</p>
          </div>
        </div>

        <div className="main">
          <div className="tab-indicator">
            <div className={`open ${openTab === 0 ? "current" : ""}`}></div>
          </div>

          {openTab === 0 ? (
            <CreateCourseInfo
              setOpenTab={setOpenTab}
              setCourseID={setCourseID}
            />
          ) : (
            <AddLessons setOpenTab={setOpenTab} courseID={courseID} />
          )}
        </div>

        <Footer unique instructor />
      </PageTransition>
    </div>
  );
};

export default CreateCoursePage;
