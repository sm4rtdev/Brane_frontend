import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "../CreateCourse/InstructorCourseInfo.scss";
import "./EditCoursePage.scss";

import InstructorHeader from "../../../../components/CustomHeaders/InstructorHeader";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import Tabulation from "../../../../components/Tabulation/Tabulation";
import Footer from "../../../../components/Footer/Footer";
import TabLessons from "./TabLessons";
import TabCourse from "./TabCourse";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";
import { getCourseForEdition } from "../../../../api/getCourseForEdition";
import { UserDataContext } from "../../../../contexts/UserDataContext";

const EditCoursePage = () => {
  const { dictionary, language } = useContext(DictionaryContext);
  const { userData } = useContext(UserDataContext);
  const [courseInfo, setCourseInfo] = useState(null);
  const { courseID } = useParams();

  // Get course info
  useEffect(() => {
    if (courseID) {
      (async () => {
        const { ok, data } = await getCourseForEdition(userData.info.id, courseID);

        if (ok) {
          setCourseInfo(data.data[0].attributes);
          console.log(data.data[0].attributes);
        } else {
          toast.error(`${data.error.message}`);
        }
      })();
    }
  }, [userData, courseID]);

  return (
    <div id="edit-course-page" className="page">
      <InstructorHeader />

      <div className="main">
        {courseInfo ? (
          <>
            <h1>
              {dictionary.privateInstructor.editCoursePage[0][language]}{" "}
              {courseInfo.tipo === "conferencia"
                ? dictionary.privateInstructor.editCoursePage[1][language]
                : dictionary.privateInstructor.editCoursePage[2][language]}
            </h1>
            <Tabulation
              {...(courseInfo.tipo === "conferencia"
                ? { tabs: ["Info"] }
                : { tabs: ["Info", dictionary.privateInstructor.editCoursePage[3][language]] })}
              options={{ type: "bubble", color: "yellow" }}
            >
              <TabCourse courseID={courseID} courseInfo={courseInfo} conference={courseInfo.tipo === "conferencia"} />
              <TabLessons courseID={courseID} />
            </Tabulation>
          </>
        ) : (
          <SpinnerOfDoom standalone center />
        )}
      </div>

      <Footer unique instructor />
    </div>
  );
};

export default EditCoursePage;
