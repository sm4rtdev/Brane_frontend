import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import "../CreateCourse/InstructorCourseLessons.scss";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import LessonAggregator from "./LessonAggregator";
import SingleLesson from "./SingleLesson";
import { getLessonsByCourseID } from "../../../../api/getLessonsByCourseID";
import { deleteLesson } from "../../../../api/deleteLesson";

const TabLessons = ({ courseID }) => {
  const [lessons, setLessons] = useState(null);
  const [updater, setUpdater] = useState(null);

  // ------------------- Get info

  const getLessons = async () => {
    const { ok, data } = await getLessonsByCourseID(courseID);

    if (ok) {
      setLessons(data.data);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  // Get course lessons
  useEffect(() => {
    if (courseID) {
      getLessons();
    }
  }, [courseID, updater]); //eslint-disable-line

  // ------------------- Add new lessons

  const [moreIsOpen, setMoreIsOpen] = useState(false);

  const requestLessonRemoval = async (lessonID) => {
    const { ok, data } = await deleteLesson(lessonID);
    if (ok) {
      toast.success(`Lección eliminada exitosamente`);
      setLessons(null);
      getLessons();
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  return (
    <div className="instructor-course-lessons">
      <div className="section">
        {lessons ? (
          lessons.length > 0 ? (
            lessons.map((lesson, index) => {
              return <SingleLesson key={lesson.id} {...lesson} index={index} deleteLesson={requestLessonRemoval} />;
            })
          ) : (
            <p className="no-data">Sin datos</p>
          )
        ) : (
          <SpinnerOfDoom standalone center />
        )}
      </div>

      <div className="section">
        {!moreIsOpen ? (
          <>
            <button
              className="action-button"
              onClick={() => {
                setMoreIsOpen(true);
              }}
            >
              Añadir otra lección
            </button>
          </>
        ) : (
          <LessonAggregator courseID={courseID} setUpdater={setUpdater} />
        )}
      </div>
    </div>
  );
};

export default TabLessons;
