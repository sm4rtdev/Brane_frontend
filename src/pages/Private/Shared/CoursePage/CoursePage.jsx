import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import "./CoursePage.scss";

import {
  LogoClosedCaptioning,
  PersonOutline,
  HeartOutline,
  VolumeMedium,
  LockClosed,
  Checkmark,
  Videocam,
  Ellipse,
  People,
  Book,
  Cart,
  Star,
  ImageOutline,
} from "../../../../assets/icons";

import { WishlistModalContext } from "../../../../contexts/WishlistModalContext";
import { getCoursesByInstructor } from "../../../../api/getCoursesByInstructor";
import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { getCourseBySlug } from "../../../../api/getCourseBySlug";
import { CartContext } from "../../../../contexts/CartContext";
import { getUserBySlug } from "../../../../api/getUserBySlug";
import { getMyCourses } from "../../../../api/getMyCourses";

//Components
import PageTransition from "../../../../components/PageTransition/PageTransition";
import InternalHeader from "../../../../components/InternalHeader/InternalHeader";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import HeaderToggler from "../../../../components/HeaderToggler/HeaderToggler";
import Tabulation from "../../../../components/Tabulation/Tabulation";
import FancyImage from "../../../../components/FancyImage/FancyImage";
import Footer from "../../../../components/Footer/Footer";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

const CoursePage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const { openWishlistModal } = useContext(WishlistModalContext);
  const { userData, changeMode } = useContext(UserDataContext);
  const { cart, addToCart } = useContext(CartContext);
  const { dictionary, language } = useContext(DictionaryContext);

  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentCourseLessons, setCurrentCourseLessons] = useState(null);
  const [currentCourseInstructor, setCurrentCourseInstructor] = useState(null);
  const [userPurchasedCourses, setUserPurchasedCourses] = useState(null);
  const [courseIsOwned, setCourseIsOwned] = useState(null);
  const [courseMadeByMe, setCourseMadeByMe] = useState(null);
  const [coursesAsInstructor, setCoursesAsInstructor] = useState(null);

  useEffect(() => {
    const getCurrentCourse = async () => {
      const { ok, data } = await getCourseBySlug(slug);

      if (ok) {
        setCurrentCourse(data.data.curso);
        setCurrentCourseLessons(data.data.clases);
        // console.log(data.data.curso);
      } else {
        toast.error(`${data.error.message}`);
      }
    };
    const getUserPurchasedCourses = async () => {
      const { ok, data } = await getMyCourses();

      if (ok) {
        setUserPurchasedCourses(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };
    const getCoursesAsAnInstructor = async () => {
      const { ok, data } = await getCoursesByInstructor(userData.info.id);

      if (ok) {
        setCoursesAsInstructor(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    getCurrentCourse();
    getUserPurchasedCourses();
    getCoursesAsAnInstructor();
  }, [slug, userData.info]);

  // Get instructor info
  useEffect(() => {
    const getCurrentCourseInstructor = async () => {
      const { ok, data } = await getUserBySlug(currentCourse.instructor.slug);

      if (ok) {
        setCurrentCourseInstructor(data);
      } else {
        toast.warning(`${data.error.message}`);
      }
    };

    if (currentCourse && !currentCourseInstructor) {
      getCurrentCourseInstructor();
    }
  }, [currentCourse, currentCourseInstructor]);

  useEffect(() => {
    if (currentCourse && userPurchasedCourses) {
      const coincidences = userPurchasedCourses.filter(
        (purchasedCourse) => purchasedCourse.attributes.curso.data.id === currentCourse.id
      ).length;

      setCourseIsOwned(coincidences);
    }
  }, [currentCourse, userPurchasedCourses]);

  useEffect(() => {
    if (currentCourse && coursesAsInstructor) {
      const coincidences = coursesAsInstructor.filter((course) => {
        return course.id === currentCourse.id;
      });

      setCourseMadeByMe(coincidences.length > 0);
    }
  }, [coursesAsInstructor, currentCourse]);

  return (
    <PageTransition {...(!userData.company && { margin: true })}>
      <div id="course-page" className="page">
        {currentCourse && userPurchasedCourses ? (
          <>
            <HeaderToggler>
              <InternalHeader
                options={{
                  backButton: true,
                  share: true,
                  cart: true,
                }}
                title={currentCourse.name}
              />
            </HeaderToggler>

            <div className="main">
              <div className="info-card">
                <div className="course-image">
                  {currentCourse.imagen ? (
                    <FancyImage src={getImageLinkFrom(currentCourse.imagen[0].url)} />
                  ) : (
                    <ImageOutline />
                  )}
                </div>

                <div className="vertical">
                  <h2>{currentCourse.name}</h2>

                  {courseIsOwned !== null &&
                    courseMadeByMe !== null &&
                    (!courseIsOwned ? (
                      <>
                        <p className="price">
                          {dictionary.coursePage[0][language]}: <strong>${currentCourse.precio}</strong>
                        </p>

                        {!userData.institution &&
                          (!courseMadeByMe ? (
                            <div className="buttons">
                              <button className="action-button black" onClick={() => addToCart(currentCourse.id)}>
                                <Cart />
                                {dictionary.coursePage[1][language]}
                              </button>
                              <button
                                className="action-button"
                                onClick={() => {
                                  addToCart(currentCourse.id);
                                  navigate("/cart");
                                }}
                              >
                                {dictionary.coursePage[2][language]}
                              </button>
                              {!userData.company && (
                                <button
                                  className="action-button border white wish-course-normal"
                                  onClick={() => openWishlistModal(currentCourse.id)}
                                >
                                  <HeartOutline />
                                  {dictionary.coursePage[3][language]}
                                </button>
                              )}
                            </div>
                          ) : (
                            <p className="no-data">
                              {dictionary.coursePage[4][language]}{" "}
                              {currentCourse.tipo === "conferencia" ? dictionary.coursePage[5][language] : dictionary.coursePage[6][language]}
                            </p>
                          ))}
                      </>
                    ) : (
                      <>
                        <strong className="message">
                          {dictionary.coursePage[7][language]}{" "}{currentCourse.tipo === "conferencia" ? dictionary.coursePage[5][language] : dictionary.coursePage[6][language]}
                        </strong>
                        <button
                          className="action-button"
                          onClick={() => {
                            if (userData.company) {
                              navigate(`/my-courses`);
                            } else {
                              if (currentCourse.tipo === "conferencia") {
                                navigate(`/conference/${currentCourse.slug}`);
                              } else {
                                navigate(`/course/${currentCourse.slug}/learn`);
                              }
                            }
                          }}
                        >
                          {userData.company
                            ? dictionary.coursePage[8][language]
                            : currentCourse.tipo === "conferencia"
                            ? dictionary.coursePage[9][language]
                            : dictionary.coursePage[10][language]}
                        </button>
                      </>
                    ))}
                </div>
              </div>

              <div className="container">
                <div className="title">
                  <h1>{currentCourse.name}</h1>
                  {!userData.company && !userData.institution && (
                    <button
                      className="small-button add-to-wishlist wish-course-normal"
                      onClick={() => openWishlistModal(currentCourse.id)}
                    >
                      <HeartOutline />
                    </button>
                  )}
                </div>

                <p className="short-description">{currentCourse.shortDescription}</p>

                {currentCourseInstructor && (
                  <Link to={`/user/${currentCourseInstructor.slug}`} className="instructor">
                    <div className="avatar">
                      {currentCourseInstructor.avatar ? (
                        <FancyImage src={getImageLinkFrom(currentCourseInstructor.avatar.formats.thumbnail.url)} />
                      ) : (
                        <PersonOutline />
                      )}
                    </div>
                    <div className="right">
                      <strong>{`${currentCourseInstructor.nombre} ${currentCourseInstructor.apellidos}`}</strong>
                      <p>{currentCourseInstructor.headline}</p>
                    </div>
                  </Link>
                )}

                <div className="technical-details">
                  <div className="detail">
                    <VolumeMedium />
                    <span>Audio: {currentCourse.idioma}</span>
                  </div>
                  {currentCourse.subTitles.length > 0 && (
                    <div className="detail">
                      <LogoClosedCaptioning />
                      <span>{`${dictionary.coursePage[13][language]}: ${currentCourse.subTitles.join(", ")}`}</span>
                    </div>
                  )}
                  <div className="detail">
                    <Star />
                    <span>{dictionary.coursePage[11][language]}: {currentCourse.averageScore ? currentCourse.averageScore : dictionary.coursePage[12][language]}</span>
                  </div>
                  <div className="detail">
                    <People />
                    <span>{currentCourse.cantidadEstudiantes} {dictionary.coursePage[14][language]}</span>
                  </div>
                </div>
                  {
                    currentCourse.conference && (
                      <div className="technical-details" style={{display: "flex"}}>
                        <Link className="detail" to={`/conference/join/${currentCourse.conference.ZoomMeetingID}`} target="_blank">
                          <Videocam />
                          <span>{dictionary.coursePage[33][language]}</span>
                        </Link>
                      </div>
                    )
                  }

                <Tabulation tabs={[dictionary.coursePage[15][language], dictionary.coursePage[16][language]]} options={{ type: "bubble", color: "black" }}>
                  <>
                    {currentCourse.whatYouWillLearn !== null && currentCourse.whatYouWillLearn.length > 0 && (
                      <>
                        <h2>{dictionary.coursePage[17][language]}:</h2>
                        <ul>
                          {currentCourse.whatYouWillLearn.map((el, index) => {
                            return (
                              <li key={`what-${index}`}>
                                <Checkmark />
                                {el}
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    )}

                    {currentCourse.requeriments !== null && currentCourse.requeriments.length > 0 && (
                      <>
                        <h2>{dictionary.coursePage[18][language]}:</h2>
                        <ul className="requirements">
                          {currentCourse.requeriments.map((el, index) => {
                            return (
                              <li key={`requirement-${index}`}>
                                <Ellipse />
                                {el}
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    )}

                    <h2>{dictionary.coursePage[19][language]}:</h2>
                    <p className="description">{currentCourse.descripcion}</p>

                    {currentCourse.whoIsThisCourseFor !== null && currentCourse.whoIsThisCourseFor.length > 0 && (
                      <>
                        <h2>
                          {currentCourse.tipo === "conferencia" ? dictionary.coursePage[20][language] : dictionary.coursePage[21][language]}:
                        </h2>
                        <ul className="requirements">
                          {currentCourse.whoIsThisCourseFor.map((el, index) => {
                            return (
                              <li key={`requirement-${index}`}>
                                <Ellipse />
                                {el}
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    )}
                  </>
                  <>
                    <h2>{dictionary.coursePage[22][language]}:</h2>
                    <ul className="summary">
                      {currentCourse.tipo === "conferencia" ? (
                        <>
                          <li>
                            <Videocam />
                            {dictionary.coursePage[23][language]}: {currentCourse.conference.ZoomDuration} min
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Videocam />
                            {currentCourse.summary[0].cantidadClases} {dictionary.coursePage[24][language]} (
                            {currentCourse.summary[0].duracionTotal}min)
                          </li>
                          <li>
                            <Book />
                            {currentCourse.summary[0].additionalResources} {dictionary.coursePage[25][language]}
                          </li>
                          {/* <li>
                            <Hammer />
                            {currentCourse.summary[0].cantidadProjects} Practicas
                          </li> */}
                          {/* <li>
                            <Flag />
                            Proyecto final del curso
                          </li> */}
                        </>
                      )}
                    </ul>

                    {currentCourse.tipo !== "conferencia" && (
                      <>
                        <h2> {dictionary.coursePage[24][language]}:</h2>
                        <div className="lessons">
                          {currentCourseLessons.map((lesson, index) => {
                            return (
                              <div className="lesson" key={`lesson-${index}`}>
                                <div className="locked">
                                  <LockClosed />
                                </div>
                                <div className="lesson-miniature">
                                  {currentCourse.imagen ? (
                                    <FancyImage src={getImageLinkFrom(currentCourse.imagen[0].url)} />
                                  ) : (
                                    <ImageOutline />
                                  )}
                                </div>
                                <div className="group">
                                  <strong>{lesson.nombre}</strong>
                                  <span>{lesson.duracion} min</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {!userData.institution && (
                      <div className="final">
                        {courseMadeByMe ? (
                          <>
                            <strong>
                              {dictionary.coursePage[4][language]}{" "}
                              {currentCourse.tipo === "conferencia" ? dictionary.coursePage[5][language] : dictionary.coursePage[6][language]}.
                            </strong>

                            <button
                              className="action-button"
                              onClick={() => {
                                changeMode(1);
                                navigate(`/edit-course/${currentCourse.id}`);
                              }}
                            >
                              {currentCourse.tipo === "conferencia" ? dictionary.coursePage[25][language] : dictionary.coursePage[26][language]}
                            </button>
                          </>
                        ) : !courseIsOwned ? (
                          <>
                            <strong>
                              {cart.includes(currentCourse.id)
                                ? currentCourse.tipo === "conferencia" ? dictionary.coursePage[27][language] : dictionary.coursePage[28][language]
                                : currentCourse.tipo === "conferencia" ? dictionary.coursePage[29][language] : dictionary.coursePage[30][language]}
                            </strong>
                            <button
                              className="action-button"
                              onClick={() => {
                                if (cart.includes(currentCourse.id)) {
                                  navigate("/cart");
                                } else {
                                  addToCart(currentCourse.id);
                                }
                              }}
                            >
                              {cart.includes(currentCourse.id) ? dictionary.coursePage[31][language] : dictionary.coursePage[32][language]}
                            </button>
                          </>
                        ) : (
                          <>
                            <strong>
                              {dictionary.coursePage[7][language]}{" "}{currentCourse.tipo === "conferencia" ? dictionary.coursePage[5][language] : dictionary.coursePage[6][language]}
                            </strong>
                            <button
                              className="action-button"
                              onClick={() => {
                                if (userData.company) {
                                  navigate(`/my-courses`);
                                } else {
                                  if (currentCourse.tipo === "conferencia") {
                                    navigate(`/conference/${currentCourse.slug}`);
                                  } else {
                                    navigate(`/course/${currentCourse.slug}/learn`);
                                  }
                                }
                              }}
                            >
                              {userData.company
                                ? dictionary.coursePage[8][language]
                                : currentCourse.tipo === "conferencia" ? dictionary.coursePage[9][language] : dictionary.coursePage[10][language]}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </>
                </Tabulation>

                {!courseMadeByMe && !userData.institution && (
                  <div className={`buy-now ${userData.company ? "company" : ""}`}>
                    {!courseIsOwned && <p>${currentCourse.precio}</p>}

                    <button
                      className="action-button"
                      onClick={() => {
                        if (courseIsOwned) {
                          if (userData.company) {
                            navigate(`/my-courses`);
                          } else {
                            if (currentCourse.tipo === "conferencia") {
                              navigate(`/conference/${currentCourse.slug}`);
                            } else {
                              navigate(`/course/${currentCourse.slug}/learn`);
                            }
                          }
                        } else {
                          if (!cart.includes(currentCourse.id)) {
                            addToCart(currentCourse.id);
                          }
                          navigate("/cart");
                        }
                      }}
                    >
                      {courseIsOwned
                        ? userData.company
                          ? dictionary.coursePage[8][language]
                          : currentCourse.tipo === "conferencia"
                          ? dictionary.coursePage[9][language] : dictionary.coursePage[10][language]
                        : dictionary.coursePage[2][language]}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <Footer
              unique
              {...(userData.company && { company: true })}
              {...(userData.mode === "instructor" && { instructor: true })}
            />
          </>
        ) : (
          <SpinnerOfDoom standalone center />
        )}
      </div>
    </PageTransition>
  );
};

export default CoursePage;
