import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ReactPlayer from "react-player";

import "./Comments.scss";

import { ChevronForward } from "../../../../../assets/icons";

import SpinnerOfDoom from "../../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../../components/DynamicInput/DynamicInput";
import CourseCard from "../../../../../components/CourseCard/CourseCard";
import { getCoursesByInstructor } from "../../../../../api/getCoursesByInstructor";
import { getCommentsFromLesson } from "../../../../../api/getCommentsFromLesson";
import { postCommentInLesson } from "../../../../../api/postCommentInLesson";
import { getImageLinkFrom } from "../../../../../helpers/getImageLinkFrom";
import { UserDataContext } from "../../../../../contexts/UserDataContext";
import { getAllClasses } from "../../../../../api/getAllClasses";
import { getClass } from "../../../../../api/getClass";

const Comments = () => {
  const { userData } = useContext(UserDataContext);
  const [courses, setCourses] = useState(null);
  const [lessons, setLessons] = useState(null);

  const [selectedCourseSlug, setSelectedCourseSlug] = useState(null);
  const [selectedLessonID, setSelectedLessonID] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [comments, setComments] = useState(null);

  const commentsContainer = useRef(null);

  const [inputs, setInputs] = useState({
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);

  useEffect(() => {
    const getCourse = async () => {
      const { ok, data } = await getCoursesByInstructor(userData.info.id);

      console.log("Courses", data.data);

      if (ok) {
        setCourses(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    getCourse();
  }, [userData]);

  useEffect(() => {
    if (selectedCourseSlug) {
      setLoadingLessons(true);

      const getLessons = async () => {
        const { ok, data } = await getAllClasses(selectedCourseSlug);

        console.log(data.data);

        if (ok) {
          setLessons(data.data);
        } else {
          toast.error(`${data.error.message}`);
        }
        setLoadingLessons(false);
      };

      getLessons();
    }
  }, [selectedCourseSlug]);

  const getComments = async () => {
    const { ok, data } = await getCommentsFromLesson(selectedLessonID);

    console.log(data.data);

    if (ok) {
      setComments(data.data);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  useEffect(() => {
    setLesson(null);
    setComments(null);

    if (selectedLessonID) {
      const getVideo = async () => {
        const { ok, data } = await getClass(selectedLessonID);

        // console.log(data.data);

        if (ok) {
          setLesson({
            name: data.data.attributes.nombre,
            video: data.data.attributes.clase.data.attributes.url,
          });
        } else {
          toast.error(`${data.error.message}`);
        }
      };

      getVideo();
      getComments();
    }
  }, [selectedLessonID]); //eslint-disable-line

  const sendComment = async () => {
    setLoading(true);

    const obj = {
      data: {
        clase: selectedLessonID,
        comentario: inputs.comment,
      },
    };

    const { ok, data } = await postCommentInLesson(obj);

    // console.log(data);

    if (ok) {
      getComments();
      setInputs({ comment: "" });

      toast.success(`Has enviado el comentario.`);
    } else {
      toast.warning(`${data.error.message}`);
    }

    setLoading(false);
  };

  return (
    <div id="comments-page">
      <h1>Comentarios</h1>

      {!lessons ? (
        courses ? (
          !loadingLessons ? (
            courses.length > 0 ? (
              <>
                <h2>Selecciona uno de tus cursos</h2>

                <div className="courses">
                  {courses.map((course) => {
                    return (
                      <div
                        key={course.id}
                        onClick={() => {
                          setSelectedCourseSlug(course.attributes.slug);
                        }}
                      >
                        <CourseCard {...course} type="standard other" noLink />
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="no-data">Sin datos</p>
            )
          ) : (
            <SpinnerOfDoom standalone center />
          )
        ) : (
          <SpinnerOfDoom standalone center />
        )
      ) : lessons.length > 0 ? (
        <>
          <h2>Selecciona una lección para ver sus comentarios</h2>

          <div className="lessons">
            {lessons.map((lesson, index) => {
              return (
                <div
                  className="lesson"
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLessonID(lesson.id);
                  }}
                >
                  <h2>Lección {index + 1}</h2>

                  <div className="lesson-card">
                    <div className="middle">
                      <strong>{lesson.attributes.nombre}</strong>
                      <span>{lesson.attributes.duracion} min</span>
                    </div>
                    <div className="right">
                      <span className="small-button">
                        <ChevronForward />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p>Sin datos</p>
      )}

      {selectedLessonID &&
        (lesson ? (
          <div className="general">
            <h2>Lección: {lesson.name}</h2>

            <div className="player">
              <ReactPlayer
                url={getImageLinkFrom(lesson.video)}
                width={"100%"}
                height={"100%"}
                controls
                config={{
                  youtube: {
                    playerVars: { modestbranding: 1 },
                  },
                  file: {
                    attributes: {
                      crossOrigin: "true",
                    },
                  },
                }}
              />
            </div>

            <div className="comments-section">
              <h2>Comentarios de la lección</h2>

              <div className="container" ref={commentsContainer}>
                {comments && comments.length > 0 ? (
                  comments.map((comment) => {
                    return (
                      <div className="comment" key={comment.id}>
                        <Link
                          to={`/user/${comment.attributes.autor.data.attributes.slug}`}
                        >
                          {`${comment.attributes.autor.data.attributes.nombre} ${comment.attributes.autor.data.attributes.apellidos}`}
                        </Link>
                        <span>{comment.attributes.createdAt}</span>
                        <p>{comment.attributes.comentario}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="no-comments">Sin comentarios aún</p>
                )}
              </div>

              <div className="add-new-comment">
                <DynamicInput
                  id={"comment"}
                  state={[inputs, setInputs]}
                  label="Deja un comentario"
                  noIcon
                />
                <button
                  className="action-button"
                  disabled={inputs.comment === "" || loading}
                  onClick={sendComment}
                >
                  {loading ? "Enviando..." : "Enviado"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <SpinnerOfDoom standalone center />
        ))}
    </div>
  );
};

export default Comments;
