import React, { useEffect, useState } from "react";

import "../CreateCourse/CreateCoursePage";

import InstructorHeader from "../../../../components/CustomHeaders/InstructorHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import Footer from "../../../../components/Footer/Footer";
import CreateConferenceInfo from "./CreateConferenceInfo";
// import AddLessons from "./AddLessons";
import { goUp } from "../../../../helpers/ScrollToTop";

const CreateConferencePage = () => {
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
            <p>Cuéntanos sobre tu conferencia</p>
          </div>
          {/* <div className={`block ${openTab === 1 ? "current" : ""}`}>
            <p>Add the to your course</p>
          </div> */}
        </div>

        <div className="main">
          <div className="tab-indicator">
            <div className={`open ${openTab === 0 ? "current" : ""}`}></div>
          </div>

          {openTab === 0 ? (
            <CreateConferenceInfo
              setOpenTab={setOpenTab}
              setCourseID={setCourseID}
            />
          ) : (
            // <AddLessons setOpenTab={setOpenTab} courseID={courseID} />
            <p className="no-data">Por definir</p>
          )}
        </div>

        <Footer unique instructor />
      </PageTransition>
    </div>
  );
};

export default CreateConferencePage;
