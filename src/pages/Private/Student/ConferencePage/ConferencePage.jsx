import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDistance, formatRelative } from "date-fns";

import "../LessonPage/LessonPage.scss";

import { AlertCircleOutline, LinkOutline, PersonOutline, Star } from "../../../../assets/icons";

import InternalHeader from "../../../../components/InternalHeader/InternalHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import HeaderToggler from "../../../../components/HeaderToggler/HeaderToggler";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import FancyImage from "../../../../components/FancyImage/FancyImage";
import Tabulation from "../../../../components/Tabulation/Tabulation";
import Footer from "../../../../components/Footer/Footer";
import Meeting from "./Meeting";
import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { getReviewByCourse } from "../../../../api/getReviewByCourse";
import { getJoinConference } from "../../../../api/getJoinConference";
import { getMyConference } from "../../../../api/getMyConference";
import { getUserBySlug } from "../../../../api/getUserBySlug";

function ConferencePage() {
  const { conferenceID } = useParams();
  const navigate = useNavigate();

  const { userData } = useContext(UserDataContext);

  const [conference, setConference] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [joinData, setJoinData] = useState(null);

  useEffect(() => {
    // Main data
    (async () => {
      const { ok, data } = await getMyConference(conferenceID);

      if (ok) {
        if (data.data.length === 1) {
          let response = data.data[0].attributes.curso.data.attributes;

          // console.log(response);
          setConference(response);
        } else {
          navigate("/", { replace: true });
        }
      } else {
        toast.error(`${data.error.message}`);
        navigate("/", { replace: true });
      }
    })();

    // Reviews
    (async () => {
      const { ok, data } = await getReviewByCourse(conferenceID);

      if (ok) {
        setReviews(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    })();

    // Join conference
    (async () => {
      const { ok, data } = await getJoinConference(conferenceID);

      if (ok) {
        setJoinData(data);
      } else {
        toast.error(`${data.error.message}`);
      }
    })();

    //eslint-disable-next-line
  }, [conferenceID]);

  useEffect(() => {
    if (conference) {
      // Get instructor
      (async () => {
        const { ok, data } = await getUserBySlug(conference.instructor.data.attributes.slug);

        if (ok) {
          setInstructor(data);
        } else {
          toast.error(`${data.error.message}`);
        }
      })();
    }
  }, [conference]);

  // ----------------------------------------------

  return (
    <div className="lesson-page-like page">
      {conference ? (
        <PageTransition margin>
          <>
            <HeaderToggler black title={conference.name}>
              <InternalHeader
                options={{
                  backButton: true,
                  cart: true,
                  longTitle: true,
                }}
                title={conference.name}
              />
            </HeaderToggler>

            <div className="main">
              <div className="inner-container">
                <div className="player">{joinData && <Meeting joinData={joinData} />}</div>

                <h1>{conference.name}</h1>

                <Tabulation tabs={["Description", "Reviews"]} options={{ type: "bubble", color: "black" }}>
                  <>
                    {conference.descripcion ? (
                      <p className="description">{conference.descripcion}</p>
                    ) : (
                      <p className="no-data">Esta conferencia no tiene descripción</p>
                    )}
                  </>
                  <>
                    {reviews ? (
                      reviews.length > 0 ? (
                        <div className="reviews">
                          <h2>Reseñas</h2>
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
                        <p className="no-data">Aún no hay reseñas</p>
                      )
                    ) : (
                      <SpinnerOfDoom standalone />
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
                      Ver perfil
                    </Link>
                  </div>
                )}

                <div className="report-section">
                  <strong>¿Algún problema con el vídeo?</strong>

                  {/* <button
                  className="report-button"
                  onClick={() =>
                    openReportModal({
                      courseID: course.id,
                      lessonID: currentLesson.id,
                    })
                  }
                >
                  Informar de un problema <AlertCircleOutline />
                </button> */}
                </div>

                {/* <div className="comments-section">
                <h2>Comentarios de la lección</h2>

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
                    <p className="no-comments">Sin comentarios aún</p>
                  )}
                </div>

                <div className="add-new-comment">
                  <DynamicInput id={"comment"} state={[inputs, setInputs]} label="Leave a comment" noIcon />
                  <button className="action-button" disabled={inputs.comment === "" || loading} onClick={sendComment}>
                    {loading ? "Sending..." : "Send"}
                  </button>
                </div>
              </div> */}
              </div>

              <div className="content-list">
                <div className="report-section">
                  {/* <strong>¿Algún problema con el vídeo?</strong> */}

                  {/* <button
                  className="report-button"
                  onClick={() =>
                    openReportModal({
                      courseID: course.id,
                      lessonID: currentLesson.id,
                    })
                  }
                >
                  Informar de un problema <AlertCircleOutline />
                </button> */}
                </div>
              </div>
            </div>

            <Footer unique {...(userData.mode === "instructor" && { instructor: true })} />
          </>
        </PageTransition>
      ) : (
        <SpinnerOfDoom standalone center />
      )}
    </div>
  );
}

export default ConferencePage;
