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
import { DictionaryContext } from "../../../../../contexts/DictionaryContext";
import { postCommentInLesson } from "../../../../../api/postCommentInLesson";
import { getImageLinkFrom } from "../../../../../helpers/getImageLinkFrom";
import { UserDataContext } from "../../../../../contexts/UserDataContext";
import { getAllClasses } from "../../../../../api/getAllClasses";
import { getClass } from "../../../../../api/getClass";

const Comments = () => {
  const { dictionary, language } = useContext(DictionaryContext);
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
    (async () => {
      const { ok, data } = await getCoursesByInstructor(userData.info.id);

      if (ok) {
        setCourses(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    })();
  }, [userData]);

  useEffect(() => {
    if (selectedCourseSlug) {
      setLoadingLessons(true);

      const getLessons = async () => {
        const { ok, data } = await getAllClasses(selectedCourseSlug);

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

    if (ok) {
      getComments();
      setInputs({ comment: "" });

      toast.success(dictionary.privateInstructor.messages[1][language]);
    } else {
      toast.warning(`${data.error.message}`);
    }

    setLoading(false);
  };

  return (
    <div id="comments-page">
      <h1>{dictionary.privateInstructor.messages[0][language]}</h1>

      {!lessons ? (
        courses ? (
          !loadingLessons ? (
            courses.length > 0 ? (
              <>
                <h2>{dictionary.privateInstructor.messages[2][language]}</h2>

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
              <p className="no-data">{dictionary.privateInstructor.messages[3][language]}</p>
            )
          ) : (
            <SpinnerOfDoom standalone center />
          )
        ) : (
          <SpinnerOfDoom standalone center />
        )
      ) : lessons.length > 0 ? (
        <>
          <h2>{dictionary.privateInstructor.messages[4][language]}</h2>

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
                  <h2>
                    {dictionary.privateInstructor.messages[5][language]} {index + 1}
                  </h2>

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
        <p>{dictionary.privateInstructor.messages[3][language]}</p>
      )}

      {selectedLessonID &&
        (lesson ? (
          <div className="general">
            <h2>
              {dictionary.privateInstructor.messages[5][language]}: {lesson.name}
            </h2>

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
              <h2>{dictionary.privateInstructor.messages[6][language]}</h2>

              <div className="container" ref={commentsContainer}>
                {comments && comments.length > 0 ? (
                  comments.map((comment) => {
                    return (
                      <div className="comment" key={comment.id}>
                        <Link to={`/user/${comment.attributes.autor.data.attributes.slug}`}>
                          {`${comment.attributes.autor.data.attributes.nombre} ${comment.attributes.autor.data.attributes.apellidos}`}
                        </Link>
                        <span>{comment.attributes.createdAt}</span>
                        <p>{comment.attributes.comentario}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="no-comments">{dictionary.privateInstructor.messages[7][language]}</p>
                )}
              </div>

              <div className="add-new-comment">
                <DynamicInput
                  id={"comment"}
                  state={[inputs, setInputs]}
                  label={dictionary.privateInstructor.messages[8][language]}
                  noIcon
                />
                <button className="action-button" disabled={inputs.comment === "" || loading} onClick={sendComment}>
                  {loading
                    ? dictionary.privateInstructor.messages[9][language]
                    : dictionary.privateInstructor.messages[10][language]}
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
