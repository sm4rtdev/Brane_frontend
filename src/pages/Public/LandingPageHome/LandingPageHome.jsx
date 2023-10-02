import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./LandingPageHome.scss";

import {
  BGTeach,
  Dots,
  DotsVertical,
  QuotationMarks,
} from "../../../assets/images";

import bannerLandingHome from "../../../assets/images/banner-landing-home.jpg";
import communityRight from "../../../assets/images/community-right.png";
import communityLeft from "../../../assets/images/community-left.png";
import googlePlay from "../../../assets/images/google-play-badge.png";
import appStore from "../../../assets/images/app-store-badge.png";
import estudiante from "../../../assets/images/estudiante.png";

import lineas from "../../../assets/images/lineas.png";
import subhero from "../../../assets/images/subhero.jpg";
import instructor from "../../../assets/images/instructor.png";

import PageTransition from "../../../components/PageTransition/PageTransition";
import SpinnerOfDoom from "../../../components/SpinnerOfDoom/SpinnerOfDoom";
import PublicHeader from "../../../components/PublicHeader/PublicHeader";
import CourseCard from "../../../components/CourseCard/CourseCard";
import FancyImage from "../../../components/FancyImage/FancyImage";
import Footer from "../../../components/Footer/Footer";
import { getCoursesByCategory } from "../../../api/getCoursesByCategory";
import { Ellipse } from "../../../assets/icons";

const LandingPageHome = () => {
  const [courses, setCourses] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Design");

  useEffect(() => {
    setCourses(null);

    const getCourses = async () => {
      const { ok, data } = await getCoursesByCategory(selectedCategory);

      // console.log(data.data);

      if (ok) {
        setCourses(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    getCourses();
  }, [selectedCategory]);

  const boxContainer = useRef(null);
  const [dotFillingState, setDotFillingState] = useState(1);

  useEffect(() => {
    let timer = null;

    if (boxContainer) {
      timer = setInterval(() => {
        let scrollMax =
          boxContainer.current.scrollHeight - boxContainer.current.clientHeight;
        let top =
          boxContainer.current.scrollTop +
          boxContainer.current.clientHeight * 2;

        setDotFillingState((top / scrollMax) * 2);
        // console.log((top / scrollMax) * 2);

        if (boxContainer.current.scrollTop === scrollMax) {
          boxContainer.current.scrollBy({
            top: -scrollMax,
            left: 0,
            behavior: "smooth",
          });
        } else {
          boxContainer.current.scrollBy({
            top:
              boxContainer.current.scrollTop +
              boxContainer.current.clientHeight,
            left: 0,
            behavior: "smooth",
          });
        }
      }, 3000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [boxContainer]);

  return (
    <div id="landing-page-home" className="page">
      <PageTransition margin>
        <PublicHeader />

        <div className="main">
          <div className="banner">
            <div className="banner-image">
              <FancyImage src={bannerLandingHome} noEffect />
            </div>

            <div className="banner-text">
              <h1>Comienza a impulsar tu carrera profesional hoy</h1>

              <p>
                Prepárate para el éxito y obtén las herramientas necesarias para
                triunfar en un mundo cada vez más competitivo.
              </p>

              <Link to="/auth/signup" className="action-button">
                Empieza hoy!
              </Link>
            </div>
          </div>

          <div className="about">
            <div className="about-image">
              <FancyImage src={subhero} noEffect />
            </div>
            <div className="about-text">
              <p>
                Con Brane lograr Mejorar tus habilidades y conocimientos para el
                mercado laboral está a tu alcance, certificándote en nuestros
                cursos y talleres especializados y en colaboración con
                prestigiosas universidades de toda la región.
              </p>
            </div>
          </div>

          <div className="courses">
            <div className="background">
              <img src={lineas} alt="" />
              <img src={lineas} alt="" />
            </div>

            <h2>Descubre nuevas habilidades</h2>

            <div className="categories">
              <span
                onClick={() => {
                  setSelectedCategory("Design");
                }}
                className={selectedCategory === "Design" ? "selected" : ""}
              >
                Diseño
              </span>
              <span
                onClick={() => {
                  setSelectedCategory("Development");
                }}
                className={selectedCategory === "Development" ? "selected" : ""}
              >
                Desarrollo
              </span>
              <span
                onClick={() => {
                  setSelectedCategory("Marketing");
                }}
                className={selectedCategory === "Marketing" ? "selected" : ""}
              >
                Marketing
              </span>
            </div>

            {courses ? (
              <div className="grid">
                {courses.map((course) => {
                  return (
                    <CourseCard
                      key={course.id}
                      {...course}
                      type="standard landing"
                      landing
                    />
                  );
                })}
              </div>
            ) : (
              <SpinnerOfDoom standalone center />
            )}
          </div>

          <div className="teach">
            <BGTeach />

            <div className="group">
              <div className="teach-image">
                <FancyImage src={instructor} noEffect />
              </div>
              <div className="teach-text">
                <h2>Vuélvete un instructor</h2>
                <p>
                  Profesionales de todo el mundo pueden ser parte de Brane
                  aportando sus conocimientos y habilidades para mejorar la vida
                  profesional millones de personas.
                </p>

                <Link to="/teach" className="action-button">
                  Empieza hoy mismo!
                </Link>
              </div>
            </div>
            <div className="group">
              <div className="teach-image">
                <FancyImage src={estudiante} noEffect />
              </div>
              <div className="teach-text">
                <h2>Mejora y desarróllate</h2>
                <p>
                  {`En Brane podrás desarrollar nuevas habilidades y conocimientos prácticos  para el mercado laboral.\n\nComplementamos tu formación profesional y técnica con habilidades y conocimientos prácticos en las áreas de marketing, negocios y emprendimiento, diseño, ciberseguridad y programación.\n\nTe brindamos el espacio ideal para transformar tu carrera profesional.`}
                </p>

                <Link to="/auth/signup" className="action-button">
                  Quiero registrarme!
                </Link>
              </div>
            </div>
          </div>

          {/* <div className="services">
            <h2>Our services</h2>

            <div className="cards">
              <div className="card">
                <div className="card-image">
                  <Service1 />
                </div>
                <strong>Special plans</strong>
              </div>
              <div className="card">
                <div className="card-image">
                  <Service2 />
                </div>
                <strong>Conferences</strong>
              </div>
              <div className="card">
                <div className="card-image">
                  <Service3 />
                </div>
                <strong>Courses</strong>
              </div>
              <div className="card">
                <div className="card-image">
                  <Service4 />
                </div>
                <strong>Remote friendly</strong>
              </div>
            </div>
          </div> */}

          <div className="community">
            <h2>Testimonios</h2>

            <div className="center">
              <div className="img-container">
                <FancyImage src={communityLeft} noEffect />
              </div>

              <div className="inner">
                <div className="bottom-dots">
                  {Array(3)
                    .fill(1, 0, dotFillingState === 4 ? 1 : dotFillingState)
                    .fill(0, dotFillingState === 4 ? 1 : dotFillingState)
                    .map((item, index) => {
                      if (item === 0) {
                        return <Ellipse key={index} className="empty" />;
                      } else {
                        return <Ellipse key={index} />;
                      }
                    })}
                </div>

                <div className="box-container" ref={boxContainer}>
                  <div className="box">
                    <QuotationMarks />

                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor in cididunt ut labore et dolore
                      magna aliqua. Quis ipsum suspendisse ultrices gravida.
                    </p>
                  </div>
                  <div className="box">
                    <QuotationMarks />

                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor in cididunt ut labore et dolore
                      magna aliqua. Quis ipsum suspendisse ultrices gravida.
                    </p>
                  </div>
                  <div className="box">
                    <QuotationMarks />

                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor in cididunt ut labore et dolore
                      magna aliqua. Quis ipsum suspendisse ultrices gravida.
                    </p>
                  </div>
                </div>
              </div>

              <div className="img-container">
                <FancyImage src={lineas} noEffect />
              </div>
            </div>
          </div>
          <div className="call">
            <Dots />
            <DotsVertical />

            <div className="container">
              <Link to={"/auth/signup"} className={"action-button black"}>
                Regístrate hoy
              </Link>

              <strong>Prueba Brane sin costo</strong>
              <strong>
                Crea tu cuenta y descubre todo lo que puedes lograr
              </strong>

              <div className="phones">
                <FancyImage src={googlePlay} noEffect={true} />
                <FancyImage src={appStore} noEffect={true} />
              </div>
            </div>
          </div>
        </div>

        <Footer unique />
      </PageTransition>
    </div>
  );
};

export default LandingPageHome;
