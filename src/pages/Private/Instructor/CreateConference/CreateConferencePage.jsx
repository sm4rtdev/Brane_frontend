import React, { useContext, useEffect } from "react";

import "../CreateCourse/CreateCoursePage";

import InstructorHeader from "../../../../components/CustomHeaders/InstructorHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import Footer from "../../../../components/Footer/Footer";
import CreateConferenceInfo from "./CreateConferenceInfo";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";
import { goUp } from "../../../../helpers/ScrollToTop";

const CreateConferencePage = () => {
  const { dictionary, language } = useContext(DictionaryContext);

  useEffect(() => {
    goUp();
  }, []);

  return (
    <div id="create-course" className="page">
      <PageTransition>
        <InstructorHeader />

        <div className="status-bar">
          <div className={`block current`}>
            <p>{dictionary.privateInstructor.createConference[63][language]}</p>
          </div>
        </div>

        <div className="main">
          <div className="tab-indicator">
            <div className={`open current`}></div>
          </div>

          <CreateConferenceInfo />
        </div>

        <Footer unique instructor />
      </PageTransition>
    </div>
  );
};

export default CreateConferencePage;
