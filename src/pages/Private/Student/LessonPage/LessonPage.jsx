import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDistance, formatRelative } from "date-fns";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";

import "./LessonPage.scss";

import {
  AlertCircleOutline,
  PersonOutline,
  Checkmark,
  Star,
  LinkOutline,
  CheckmarkCircle,
} from "../../../../assets/icons";

import InternalHeader from "../../../../components/InternalHeader/InternalHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import HeaderToggler from "../../../../components/HeaderToggler/HeaderToggler";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import FancyImage from "../../../../components/FancyImage/FancyImage";
import Tabulation from "../../../../components/Tabulation/Tabulation";
import Footer from "../../../../components/Footer/Footer";
import { getCommentsFromLesson } from "../../../../api/getCommentsFromLesson";
import { ReportModalContext } from "../../../../contexts/ReportModalContext";
import { postCommentInLesson } from "../../../../api/postCommentInLesson";
import { getMyCourseProgress } from "../../../../api/getMyCourseProgress";
import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { getReviewByCourse } from "../../../../api/getReviewByCourse";
import { postCompleteClass } from "../../../../api/postCompleteClass";
import { getCourseBySlug } from "../../../../api/getCourseBySlug";
import { getCertificate } from "../../../../api/getCertificate";
import { getUserBySlug } from "../../../../api/getUserBySlug";
import { getClass } from "../../../../api/getClass";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

const LessonPage = () => {
  const navigate = useNavigate();
  const { slug, lessonId } = useParams();

  const { openReportModal } = useContext(ReportModalContext);
  const { userData } = useContext(UserDataContext);
  const { dictionary, language } = useContext(DictionaryContext);
  const commentsContainer = useRef(null);

  const [inputs, setInputs] = useState({
    comment: "",
  });
  const [lessons, setLessons] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [simpleDisable, setSimpleDisable] = useState(false);
  const [reviews, setReviews] = useState(null);
  const [courseProgress, setCourseProgress] = useState(null);
  const [currentLessonVideoID, setCurrentLessonVideoID] = useState(null);
  const [localVideo, setLocalVideo] = useState(null);

  const [currentPositionInArrayOfLessons, setCurrentPositionInArrayOfLessons] = useState(null);

  const [captions, setCaptions] = useState([]);

  const getCourse = async () => {
    const { ok, data } = await getCourseBySlug(slug);

    if (ok) {
      const index = data.data.clases.findIndex((el) => el.id === Number(lessonId));
      setCurrentPositionInArrayOfLessons(index);

      setCourse(data.data.curso);
      setLessons(data.data.clases);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  useEffect(() => {
    setCourse(null);
    setLessons(null);
    setInstructor(null);
    setCurrentLesson(null);
    setSimpleDisable(false);
    setCourseProgress(null);

    const getCurrent = async () => {
      const { ok, data } = await getClass(lessonId);

      if (ok) {
        let { clase, subtitles } = data.data;

        setCurrentLesson(data.data);
        setCurrentLessonVideoID(clase ? clase.id : null);

        setCaptions(
          subtitles.map((sub) => {
            return { kind: "subtitles", src: getImageLinkFrom(sub.url), label: sub.lang };
          })
        );
      } else {
        toast.error(`${data.error.message}`);

        if (data.error.status) {
          navigate("/");
        }
      }
    };

    setTimeout(() => {
      getCourse();
      getCurrent();
    }, 10);
  }, [slug, lessonId]); //eslint-disable-line

  useEffect(() => {
    const consultVideo = (videoID) => {
      console.log(videoID);
      const request = window.indexedDB.open("brane-storage", 1);

      request.onerror = (event) => {
        console.error(event);
        toast.error(dictionary.lessonPage[0][language]);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;

        db.onerror = (event) => {
          console.error(`Database error: ${event.target.errorCode}`);
        };

        const transaction = db.transaction(["videos"], "readonly");
        const objectStore = transaction.objectStore("videos");
        const getRequest = objectStore.get(videoID);

        getRequest.onsuccess = () => {
          const obj = getRequest.result;
          if (obj) {
            const url = URL.createObjectURL(obj.videoBlob);
            setLocalVideo(url);
            console.log("The video exists in the database", obj);
          } else {
            console.log("The video does not exist in the database");
          }
        };
        transaction.oncomplete = () => {
          db.close();
        };
      };
    };

    if (currentLessonVideoID) {
      consultVideo(currentLessonVideoID);
    }
  }, [currentLessonVideoID]);

  useEffect(() => {
    return () => {
      console.log("URL removed");
      URL.revokeObjectURL(localVideo);
    };
  }, [localVideo]);

  useEffect(() => {
    if (course) {
      const getInstructor = async () => {
        const { ok, data } = await getUserBySlug(course.instructor.slug);

        if (ok) {
          setInstructor(data);
        } else {
          toast.warning(`${data.error.message}`);
        }
      };

      const getReviews = async () => {
        const { ok, data } = await getReviewByCourse(course.id);

        if (ok) {
          setReviews(data.data);
        } else {
          toast.error(`${data.error.message}`);
        }
      };

      const getProgress = async () => {
        const { ok, data } = await getMyCourseProgress(course.id);

        if (ok) {
          setCourseProgress(data.data[0].attributes);
        } else {
          toast.error(`${data.error.message}`);
        }
      };

      getProgress();
      getInstructor();
      getReviews();
    }
  }, [course]);

  const getComments = async () => {
    const { ok, data } = await getCommentsFromLesson(currentLesson.id);

    if (ok) {
      setComments(data.data);
    } else {
      toast.warning(`${data.error.message}`);
    }
  };

  useEffect(() => {
    if (currentLesson) {
      getComments();
    }
  }, [currentLesson]); //eslint-disable-line

  useEffect(() => {
    if (comments && commentsContainer.current) {
      commentsContainer.current.scrollTop = commentsContainer.current.scrollHeight;
    }
  }, [comments, commentsContainer]);

  const previousLesson = () => {
    if (currentPositionInArrayOfLessons > 0) {
      navigate(`/course/${course.slug}/learn/lesson/${lessons[currentPositionInArrayOfLessons - 1].id}`);
    }
  };
  const markAsCompleted = async () => {
    if (lessons[currentPositionInArrayOfLessons].status !== "finalizada") {
      const obj = {
        data: {
          curso: course.id,
          clase: currentLesson.id,
        },
      };

      const { ok, data } = await postCompleteClass(obj);

      if (ok) {
        setSimpleDisable(true);
        getCourse();
        toast.success(dictionary.lessonPage[1][language]);
      } else {
        toast.warning(`${data.error.message}`);
      }
    }
  };

  const nextLesson = () => {
    if (currentPositionInArrayOfLessons < lessons.length) {
      navigate(`/course/${course.slug}/learn/lesson/${lessons[currentPositionInArrayOfLessons + 1].id}`);
      markAsCompleted();
    }
  };

  const sendComment = async () => {
    setLoading(true);

    const obj = {
      data: {
        clase: currentLesson.id,
        comentario: inputs.comment,
      },
    };

    const { ok, data } = await postCommentInLesson(obj);

    if (ok) {
      getComments();
      setInputs({ comment: "" });

      toast.success(dictionary.lessonPage[2][language]);
    } else {
      toast.warning(`${data.error.message}`);
    }

    setLoading(false);
  };

  const [loadingCertificate, setLoadingCertificate] = useState(false);

  const loadCertificate = async () => {
    setLoadingCertificate(true);

    const { ok, data } = await getCertificate(course.id);

    if (ok) {
      window.open(data.url, "_blank");
    } else {
      toast.warning(`${data.error.message}`);
    }

    setLoadingCertificate(false);
  };

  return (
    <div className="page lesson-page-like">
      <PageTransition margin>
        {lessons && currentLesson ? (
          <>
            <HeaderToggler
              black
              title={currentLesson.nombre}
              progress={courseProgress ? courseProgress.progress : null}
            >
              <InternalHeader
                options={{
                  backButton: true,
                  cart: true,
                  longTitle: true,
                }}
                title={currentLesson.nombre}
              />
            </HeaderToggler>

            <div className="main">
              <div className="inner-container">
                <div className="player">
                  {currentLesson.clase ? (
                    <ReactPlayer
                      url={localVideo ? localVideo : getImageLinkFrom(currentLesson.clase.url)}
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
                          tracks: captions,
                        },
                      }}
                    />
                  ) : (
                    <AlertCircleOutline />
                  )}
                </div>

                {localVideo && (
                  <div className="offline-msg">
                    <CheckmarkCircle />
                    <p>{dictionary.lessonPage[3][language]}</p>
                  </div>
                )}

                <h1>{currentLesson.nombre}</h1>

                {courseProgress && courseProgress.completado && (
                  <div className="completed-course-box">
                    <strong>{dictionary.lessonPage[4][language]}</strong>

                    {course && course.certificado && (
                      <button className="action-button" onClick={loadCertificate} disabled={loadingCertificate}>
                        {loadingCertificate ? (
                          <>
                            <SpinnerOfDoom /> {dictionary.lessonPage[5][language]}
                          </>
                        ) : (
                          `${dictionary.lessonPage[6][language]}`
                        )}
                      </button>
                    )}
                  </div>
                )}

                <div className="buttons-bar">
                  {currentPositionInArrayOfLessons !== 0 ? (
                    <button
                      className="action-button black"
                      onClick={previousLesson}
                      disabled={currentPositionInArrayOfLessons === 0}
                    >
                      {dictionary.lessonPage[7][language]}
                    </button>
                  ) : (
                    <div></div>
                  )}
                  <button
                    className="action-button"
                    onClick={markAsCompleted}
                    disabled={lessons[currentPositionInArrayOfLessons].status === "finalizada" || simpleDisable}
                  >
                    {dictionary.lessonPage[8][language]}
                  </button>
                  {currentPositionInArrayOfLessons !== lessons.length - 1 ? (
                    <button
                      className="action-button black"
                      onClick={nextLesson}
                      disabled={currentPositionInArrayOfLessons === lessons.length - 1}
                    >
                      {dictionary.lessonPage[9][language]}
                    </button>
                  ) : (
                    <div></div>
                  )}
                </div>

                <Tabulation
                  tabs={[dictionary.lessonPage[25][language], dictionary.lessonPage[26][language], dictionary.lessonPage[27][language]]}
                  options={{ type: "bubble", color: "black" }}
                >
                  <>
                    {currentLesson.descripcion ? (
                      <p className="description">{currentLesson.descripcion}</p>
                    ) : (
                      <p className="no-data">{dictionary.lessonPage[10][language]}</p>
                    )}
                  </>
                  <>
                    {reviews ? (
                      reviews.length > 0 ? (
                        <div className="reviews">
                          <h2>{dictionary.lessonPage[11][language]}</h2>
                          <div className="inner-container">
                            {reviews.map((review) => {
                              return (
                                <div className="review" key={"review" + review.id}>
                                  <Link className="name" to={`/user/${review.attributes.usuario.data.attributes.slug}`}>
                                    {`${review.attributes.usuario.data.attributes.nombre} ${review.attributes.usuario.data.attributes.apellidos}`}
                                  </Link>
                                  <div className="gray">
                                    <div className="stars">
                                      {Array(review.attributes.valoracion)
                                        .fill(0)
                                        .map((el, index) => {
                                          return <Star key={index} />;
                                        })}
                                    </div>

                                    <span>
                                      {formatRelative(new Date(Date.parse(review.attributes.updatedAt)), new Date(), {
                                        includeSeconds: true,
                                        addSuffix: true,
                                      })}
                                    </span>
                                  </div>

                                  <p>{review.attributes.comentario}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <p className="no-data">{dictionary.lessonPage[12][language]}</p>
                      )
                    ) : (
                      <SpinnerOfDoom standalone />
                    )}
                  </>
                  <>
                    {currentLesson.additionalResources !== null ? (
                      <>
                        <div className="additional-resources">
                          <h2>{dictionary.lessonPage[13][language]}</h2>

                          <div className="links">
                            {currentLesson.additionalResources.map((el, index) => {
                              return (
                                <div key={index} className="link">
                                  <LinkOutline />

                                  <a href={el} target="_blank" rel="noopener noreferrer">
                                    {el}
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="no-data">{dictionary.lessonPage[14][language]}</p>
                    )}
                  </>
                </Tabulation>

                {instructor && (
                  <div className="instructor-card">
                    <div className="avatar">
                      {instructor.avatar && instructor.avatar.url ? (
                        <FancyImage src={getImageLinkFrom(instructor.avatar.url)} />
                      ) : (
                        <PersonOutline />
                      )}
                    </div>
                    <div className="text">
                      <div className="name">{`${instructor.nombre} ${instructor.apellidos}`}</div>
                      <span>{instructor.headline}</span>
                    </div>

                    <Link to={`/user/${instructor.slug}`} className="button">
                      {dictionary.lessonPage[15][language]}
                    </Link>
                  </div>
                )}

                <div className="report-section">
                  <strong>{dictionary.lessonPage[16][language]}</strong>

                  <button
                    className="report-button"
                    onClick={() =>
                      openReportModal({
                        courseID: course.id,
                        lessonID: currentLesson.id,
                      })
                    }
                  >
                    {dictionary.lessonPage[17][language]} <AlertCircleOutline />
                  </button>
                </div>

                <div className="comments-section">
                  <h2>{dictionary.lessonPage[18][language]}</h2>

                  <div className="container" ref={commentsContainer}>
                    {comments && comments.length > 0 ? (
                      comments.map((comment) => {
                        return (
                          <div className="comment" key={comment.id}>
                            <Link to={`/user/${comment.attributes.autor.data.attributes.slug}`}>
                              {`${comment.attributes.autor.data.attributes.nombre} ${comment.attributes.autor.data.attributes.apellidos}`}
                            </Link>
                            <span>
                              {formatDistance(new Date(Date.parse(comment.attributes.createdAt)), new Date(), {
                                includeSeconds: true,
                                addSuffix: true,
                              })}
                            </span>
                            <p>{comment.attributes.comentario}</p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="no-comments">{dictionary.lessonPage[19][language]}</p>
                    )}

                    {/* <div className="my-comment">

                  </div> */}
                  </div>

                  <div className="add-new-comment">
                    <DynamicInput id={"comment"} state={[inputs, setInputs]} label={dictionary.lessonPage[20][language]} noIcon />
                    <button className="action-button" disabled={inputs.comment === "" || loading} onClick={sendComment}>
                      {loading ? dictionary.lessonPage[21][language] : dictionary.lessonPage[22][language]}
                    </button>
                  </div>
                </div>
              </div>

              {lessons && (
                <div className="content-list">
                  <div className="report-section">
                    <strong>{dictionary.lessonPage[23][language]}</strong>

                    <button
                      className="report-button"
                      onClick={() =>
                        openReportModal({
                          courseID: course.id,
                          lessonID: currentLesson.id,
                        })
                      }
                    >
                      {dictionary.lessonPage[17][language]} <AlertCircleOutline />
                    </button>
                  </div>

                  <h2>{dictionary.lessonPage[24][language]}</h2>

                  <div className="list">
                    {lessons.map((lesson) => {
                      return (
                        <Link
                          to={`/course/${course.slug}/learn/lesson/${lesson.id}`}
                          className={`lesson ${lesson.id === Number(lessonId) ? "current" : ""} `}
                          key={lesson.id}
                        >
                          <p>{lesson.nombre}</p>

                          <div className="check-area">
                            <div className={`check ${lesson.status === "finalizada" ? "completed" : "·"}`}>
                              <Checkmark />
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Footer unique {...(userData.mode === "instructor" && { instructor: true })} />
          </>
        ) : (
          <SpinnerOfDoom standalone center />
        )}
      </PageTransition>
    </div>
  );
};

export default LessonPage;
