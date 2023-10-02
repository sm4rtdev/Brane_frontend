import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import LessonAggregator from "../EditCourse/LessonAggregator";
import { getLessonsByCourseID } from "../../../../api/getLessonsByCourseID";
import { putCourse } from "../../../../api/putCourse";

const AddLessons = ({ courseID }) => {
  const navigate = useNavigate();

  const [lessons, setLessons] = useState(null);
  const [updater, setUpdater] = useState(null);

  // ------------------- Get info

  const getLessons = async () => {
    const { ok, data } = await getLessonsByCourseID(courseID);

    if (ok) {
      // console.log("getLessons", data.data);
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

  // ------------------ Publish course

  const [requesting, setRequesting] = useState(false);

  const checkLessons = () => {
    setRequesting(true);

    const updateCourseStatus = async () => {
      const obj = {
        data: {
          status: "published",
        },
      };

      const { ok, data } = await putCourse(courseID, obj);

      if (ok) {
        toast.success("El curso ha sido publicado.");
        setRequesting(false);
        navigate("/my-courses");
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    const getLessons = async () => {
      const { ok, data } = await getLessonsByCourseID(courseID);

      if (ok) {
        // console.log("getLessons", data.data);
        const lessons = data.data;
        console.log(lessons);

        if (lessons.length > 0) {
          const error = lessons.filter(
            (lesson) => lesson.attributes.clase.data === null
          );

          if (error.length === 0) {
            updateCourseStatus();
          } else {
            console.log(error);
            toast.error("Una de las lecciones del curso no tiene vídeo.");
            setRequesting(false);
          }
        } else {
          toast.error("El curso debe tener al menos una lección.");
          setRequesting(false);
        }
      } else {
        toast.error(`${data.error.message}`);
        setRequesting(false);
      }
    };

    getLessons();
  };

  return (
    <div className="instructor-course-lessons">
      <h1>Agregar lecciones</h1>

      <div className="section">
        <LessonAggregator courseID={courseID} setUpdater={setUpdater} />
      </div>

      {lessons && (
        <div className="section">
          <h2>Lecciones creadas</h2>
          {lessons.map((lesson, index) => {
            return (
              <div className="individual" key={index}>
                <strong>{`Lesson ${index + 1}: `}</strong>

                <p>{lesson.attributes.nombre}</p>
              </div>
            );
          })}
        </div>
      )}

      {lessons && lessons.length > 0 && (
        <div className="section final">
          <h2>Acciones</h2>

          <button
            className="action-button extended"
            onClick={checkLessons}
            disabled={requesting}
          >
            {requesting ? (
              <>
                <SpinnerOfDoom />
                Publicando...
              </>
            ) : (
              "Finalizar y publicar el curso"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddLessons;
