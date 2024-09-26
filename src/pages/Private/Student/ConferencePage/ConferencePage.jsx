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
import { getCourseBySlug } from "../../../../api/getCourseBySlug";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

function ConferencePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { openReportModal } = useContext(ReportModalContext);
  const { userData } = useContext(UserDataContext);
  const { dictionary, language } = useContext(DictionaryContext);

  const [conference, setConference] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [joinData, setJoinData] = useState(null);

  useEffect(() => {
    // Main data
    (async () => {
      const { ok, data } = await getCourseBySlug(slug);

      if (ok) {
        let response = data.data.curso;

        setConference(response);
      } else {
        toast.error(`${data.error.message}`);
        navigate("/", { replace: true });
      }
    })();

    // Reviews
    (async () => {
      const { ok, data } = await getReviewByCourse(slug);

      if (ok) {
        setReviews(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    })();

    //eslint-disable-next-line
  }, [slug]);

  useEffect(() => {
    if (conference) {
      // Set instructor
      setInstructor(conference.instructor);

      // Join conference
      (async () => {
        const { ok, data } = await getJoinConference(conference.id);

        if (ok) {
          console.log(data);
          setJoinData(data);
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
                      <strong>{dictionary.conferencePage[0][language]}:</strong>
                      <ul>
                        <li>
                          {dictionary.conferencePage[1][language]}: <span>{Date(joinData.meetingStartTime)}</span>
                        </li>
                        <li>
                          {dictionary.conferencePage[2][language]}: <span>{joinData.meetingDuration}</span>
                        </li>
                        <li>
                          {dictionary.conferencePage[3][language]}: <span>{joinData.userName}</span>
                        </li>
                        <li>
                          Role: <span>{joinData.role === "instructor" ? "Instructor" : dictionary.conferencePage[4][language]}</span>
                        </li>
                      </ul>

                      <button
                        className="action-button"
                        onClick={() => {
                          window.joinDataTemp = JSON.stringify(joinData);

                          let win = window.open(
                            "/conference/join",
                            "_blank",
                            {
                              popup: true,
                            },
                            "width=" + window.screen.availWidth + ",height=" + window.screen.availHeight
                          );

                          win.focus();
                        }}
                      >
                        {dictionary.conferencePage[5][language]}
                      </button>

                      <span>{dictionary.conferencePage[6][language]}</span>
                    </div>
                  </div>
                ) : (
                  <SpinnerOfDoom standalone />
                )}

                <Tabulation tabs={["Description", "Reviews"]} options={{ type: "bubble", color: "black" }}>
                  <>
                    {conference.descripcion ? (
                      <p className="description">{conference.descripcion}</p>
                    ) : (
                      <p className="no-data">{dictionary.conferencePage[7][language]}</p>
                    )}
                  </>
                  <>
                    {reviews ? (
                      reviews.length > 0 ? (
                        <div className="reviews">
                          <h2>{dictionary.conferencePage[8][language]}</h2>
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
                        <p className="no-data">{dictionary.conferencePage[9][language]}</p>
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
                      {dictionary.conferencePage[10][language]}
                    </Link>
                  </div>
                )}

                <div className="report-section">
                  <strong>{dictionary.conferencePage[11][language]}</strong>

                  <button
                    className="report-button"
                    onClick={() =>
                      openReportModal({
                        courseID: conference.id,
                        lessonID: 0,
                      })
                    }
                  >
                    {dictionary.conferencePage[12][language]} <AlertCircleOutline />
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
