import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { formatRelative } from "date-fns";

import "../LessonPage/LessonPage.scss";

import { AlertCircleOutline, PersonOutline, Star } from "../../../../assets/icons";

import InternalHeader from "../../../../components/InternalHeader/InternalHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import HeaderToggler from "../../../../components/HeaderToggler/HeaderToggler";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import FancyImage from "../../../../components/FancyImage/FancyImage";
import Tabulation from "../../../../components/Tabulation/Tabulation";
import Footer from "../../../../components/Footer/Footer";

import { ReportModalContext } from "../../../../contexts/ReportModalContext";
import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { getReviewByCourse } from "../../../../api/getReviewByCourse";
import { getJoinConference } from "../../../../api/getJoinConference";
import { getMyConference } from "../../../../api/getMyConference";
import { getUserBySlug } from "../../../../api/getUserBySlug";

// import Meeting from "./Meeting";

function ConferencePage() {
  const { conferenceID } = useParams();
  const navigate = useNavigate();

  const { openReportModal } = useContext(ReportModalContext);
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
        console.log(data);
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

            <div className="main conference">
              <div className="inner-container">
                <h1>{conference.name}</h1>

                {joinData ? (
                  <div className="conference-box">
                    <div className="box">
                      <strong>Detalles de la conferencia:</strong>
                      <ul>
                        <li>
                          Fecha y hora de inicio: <span>8929829</span>
                        </li>
                        <li>
                          Duración estimada: <span>asdasdasd min</span>
                        </li>
                        <li>
                          Tu nombre como participante: <span>asasd</span>
                        </li>
                      </ul>

                      <button
                        className="action-button"
                        onClick={() => {
                          window.joinDataTemp = JSON.stringify(joinData);

                          let win = window.open("/conference/join", "_blank", {
                            popup: true,
                          });

                          win.focus();
                        }}
                      >
                        Entrar a la conferencia
                      </button>

                      <span>Tras hacer clic en el botón se te abrirá una ventana emergente.</span>
                    </div>
                  </div>
                ) : (
                  <SpinnerOfDoom />
                )}

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
                  <strong>¿Algún problema con la conferencia?</strong>

                  <button
                    className="report-button"
                    onClick={() =>
                      openReportModal({
                        courseID: conferenceID,
                        lessonID: 0,
                      })
                    }
                  >
                    Informar de un problema <AlertCircleOutline />
                  </button>
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
