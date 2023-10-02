import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "../CreateCourse/InstructorCourseInfo.scss";
import "./EditCoursePage.scss";

import InstructorHeader from "../../../../components/CustomHeaders/InstructorHeader";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import Tabulation from "../../../../components/Tabulation/Tabulation";
import Footer from "../../../../components/Footer/Footer";
import TabCourse from "./TabCourse";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { getCourseForEdition } from "../../../../api/getCourseForEdition";
import TabLessons from "./TabLessons";

const EditCoursePage = () => {
  const { userData } = useContext(UserDataContext);
  const [courseInfo, setCourseInfo] = useState(null);
  const { courseID } = useParams();

  // Get course info
  useEffect(() => {
    if (courseID) {
      const getCourseInfo = async () => {
        const { ok, data } = await getCourseForEdition(
          userData.info.id,
          courseID
        );

        if (ok) {
          console.log("getCourseInfo", data.data[0]);
          setCourseInfo(data.data[0].attributes);
        } else {
          toast.error(`${data.error.message}`);
        }
      };

      getCourseInfo();
    }
  }, [userData, courseID]);

  // const publish = async () => {
  //   setIsPublishing(true);

  //   const obj = {
  //     data: { status: "published" },
  //   };

  //   const { ok, data } = await putCourse(courseID, obj);

  //   console.log(data);

  //   if (ok) {
  //     toast.success("The course has been published");
  //     navigate("/");
  //   } else {
  //     toast.error(`${data.error.message}`);
  //   }

  //   setIsPublishing(false);
  // };

  return (
    <div id="edit-course-page" className="page">
      <InstructorHeader />

      <div className="main">
        {courseInfo ? (
          <>
            <h1>
              Editar{" "}
              {courseInfo.tipo === "conferencia" ? "conferencia" : "curso"}
            </h1>
            <Tabulation
              {...(courseInfo.tipo === "conferencia"
                ? { tabs: ["Info"] }
                : { tabs: ["Info", "Lessons"] })}
              options={{ type: "bubble", color: "yellow" }}
            >
              <TabCourse
                courseID={courseID}
                courseInfo={courseInfo}
                conference={courseInfo.tipo === "conferencia"}
              />
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
