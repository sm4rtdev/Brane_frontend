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
  Hammer,
  People,
  Book,
  Cart,
  Flag,
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

const CoursePage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { openWishlistModal } = useContext(WishlistModalContext);
  const { cart, addToCart } = useContext(CartContext);
  const { userData, changeMode } = useContext(UserDataContext);

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

      console.log(data.data);

      if (ok) {
        setCurrentCourse(data.data.curso);
        setCurrentCourseLessons(data.data.clases);
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
      // console.log(coursesAsInstructor);
      const coincidences = coursesAsInstructor.filter((course) => {
        return course.id === currentCourse.id;
      });

      // console.log(coincidences);

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
                          Precio actual: <strong>${currentCourse.precio}</strong>
                        </p>

                        {!userData.institution &&
                          (!courseMadeByMe ? (
                            <div className="buttons">
                              <button className="action-button black" onClick={() => addToCart(currentCourse.id)}>
                                <Cart />
                                Añadir a la cesta
                              </button>
                              <button
                                className="action-button"
                                onClick={() => {
                                  addToCart(currentCourse.id);
                                  navigate("/cart");
                                }}
                              >
                                Comprar ahora
                              </button>
                              {!userData.company && (
                                <button
                                  className="action-button border white wish-course-normal"
                                  onClick={() => openWishlistModal(currentCourse.id)}
                                >
                                  <HeartOutline />
                                  Añadir a la lista de deseos
                                </button>
                              )}
                            </div>
                          ) : (
                            <p className="no-data">
                              Eres el creador de{" "}
                              {currentCourse.tipo === "conferencia" ? "esta conferencia" : "este curso"}
                            </p>
                          ))}
                      </>
                    ) : (
                      <>
                        <strong className="message">
                          Ya tienes {currentCourse.tipo === "conferencia" ? "esta conferencia" : "este curso"}
                        </strong>
                        <button
                          className="action-button"
                          onClick={() => {
                            if (userData.company) {
                              navigate(`/my-courses`);
                            } else {
                              if (currentCourse.tipo === "conferencia") {
                                navigate(`/conference/${currentCourse.id}`);
                              } else {
                                navigate(`/course/${currentCourse.slug}/learn`);
                              }
                            }
                          }}
                        >
                          {userData.company
                            ? "Ver mis cursos"
                            : currentCourse.tipo === "conferencia"
                            ? "Ir a la conferencia"
                            : "Ir al curso"}
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
                      <span>{`Subtítulos: ${currentCourse.subTitles.join(", ")}`}</span>
                    </div>
                  )}
                  <div className="detail">
                    <Star />
                    <span>Estrellas: {currentCourse.averageScore ? currentCourse.averageScore : "(Sin reseñas)"}</span>
                  </div>
                  <div className="detail">
                    <People />
                    <span>{currentCourse.cantidadEstudiantes} Estudiantes</span>
                  </div>
                </div>

                <Tabulation tabs={["Detalles", "Contenido"]} options={{ type: "bubble", color: "black" }}>
                  <>
                    <h2>Lo que vas a aprender:</h2>
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
                    {/* <h2>Course projects</h2>
                      <div className="projects">
                        {course.projects.map((el, index) => {
                          return (
                            <div key={index} className="el">
                              <img src={el.img} alt="" />

                              <span>{el.description}</span>
                            </div>
                          );
                        })}
                      </div> */}
                    <h2>Requisitos:</h2>
                    <ul className="requirements">
                      {currentCourse.requirements.map((el, index) => {
                        return (
                          <li key={`requirement-${index}`}>
                            <Ellipse />
                            {el}
                          </li>
                        );
                      })}
                    </ul>

                    <h2>Descripción:</h2>
                    <p className="description">{currentCourse.descripcion}</p>

                    <h2>Para quién es {currentCourse.tipo === "conferencia" ? "esta conferencia" : "este curso"}:</h2>
                    <ul className="requirements">
                      {JSON.parse(currentCourse.whoIsThisCourseFor).map((el, index) => {
                        return (
                          <li key={`requirement-${index}`}>
                            <Ellipse />
                            {el}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                  <>
                    <h2>Resumen:</h2>
                    <ul className="summary">
                      {currentCourse.tipo === "conferencia" ? (
                        <>
                          <li>
                            <Videocam />
                            Duración estimada: {currentCourse.conference.ZoomDuration} min
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Videocam />
                            {currentCourse.summary[0].cantidadClases} Lecciones (
                            {currentCourse.summary[0].duracionTotal}min)
                          </li>
                          <li>
                            <Book />
                            {currentCourse.summary[0].additionalResources} Recursos adicionales
                          </li>
                          <li>
                            <Hammer />
                            {currentCourse.summary[0].cantidadProjects} Practicas
                          </li>
                          <li>
                            <Flag />
                            Proyecto final del curso
                          </li>
                        </>
                      )}
                    </ul>

                    {currentCourse.tipo !== "conferencia" && (
                      <>
                        <h2> Lecciones:</h2>
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
                              Eres el creador de{" "}
                              {currentCourse.tipo === "conferencia" ? "esta conferencia" : "este curso"}.
                            </strong>

                            <button
                              className="action-button"
                              onClick={() => {
                                changeMode(1);
                                navigate(`/edit-course/${currentCourse.id}`);
                              }}
                            >
                              Editar {currentCourse.tipo}
                            </button>
                          </>
                        ) : !courseIsOwned ? (
                          <>
                            <strong>
                              {cart.includes(currentCourse.id)
                                ? `${
                                    currentCourse.tipo === "conferencia" ? "Esta conferencia" : "Este curso"
                                  } ya está en tu carrito`
                                : `Compra ${
                                    currentCourse.tipo === "conferencia" ? "esta conferencia" : "este curso"
                                  } para ver su contenido`}
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
                              {cart.includes(currentCourse.id) ? "Ir al carrito" : "Añadir al carrito"}
                            </button>
                          </>
                        ) : (
                          <>
                            <strong>
                              Ya tienes {currentCourse.tipo === "conferencia" ? "esta conferencia" : "este curso"}
                            </strong>
                            <button
                              className="action-button"
                              onClick={() => {
                                if (userData.company) {
                                  navigate(`/my-courses`);
                                } else {
                                  if (currentCourse.tipo === "conferencia") {
                                    navigate(`/conference/${currentCourse.id}`);
                                  } else {
                                    navigate(`/course/${currentCourse.slug}/learn`);
                                  }
                                }
                              }}
                            >
                              {userData.company
                                ? "Ver mis cursos"
                                : `Ir ${currentCourse.tipo === "conferencia" ? "a la conferencia" : "al curso"}`}
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
                              navigate(`/conference/${currentCourse.id}`);
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
                          ? "Ver mis cursos"
                          : currentCourse.tipo === "conferencia"
                          ? "Ir a la conferencia"
                          : "Ir al curso"
                        : "Comprar ahora"}
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
