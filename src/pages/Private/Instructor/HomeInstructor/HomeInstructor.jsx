import React, { useContext } from "react";
import { Link } from "react-router-dom";

import {
  Audience,
  Camera,
  Conferences,
  CtaVector1,
  CtaVector2,
  Faster,
  ForegroundCtaInstructor,
  Instructors,
  News,
} from "../../../../assets/images";

import InstructorHeader from "../../../../components/CustomHeaders/InstructorHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import Footer from "../../../../components/Footer/Footer";
import { UserDataContext } from "../../../../contexts/UserDataContext";

import "./HomeInstructor.scss";

const HomeInstructor = () => {
  const { userData } = useContext(UserDataContext);
  return (
    <div id="home-instructor" className="page">
      <PageTransition>
        <InstructorHeader />

        <div className="main">
          <h1>
            Hola <strong>{userData.info.nombre}.</strong> ¡Que bueno verte!
          </h1>

          <div className="cta">
            <div className="background">
              <CtaVector1 />
              <CtaVector2 />
              <ForegroundCtaInstructor />
            </div>

            <div className="container">
              <strong>¿Qué curso vamos a crear hoy?</strong>
              <p>Enseña y benefíciate de ello.</p>

              <Link to={"/create-course"} className={"action-button black"}>
                Crear un nuevo curso
              </Link>
            </div>
          </div>

          <div className="section">
            <h2>Creemos que estos recursos te serán útiles</h2>

            <div className="grid">
              <div className="resource">
                <div className="icon">
                  <Camera />
                </div>
                <p>Cursos</p>
              </div>
              <div className="resource">
                <div className="icon">
                  <Audience />
                </div>
                <p>Cómo construir tu audiencia</p>
              </div>
              <div className="resource">
                <div className="icon">
                  <Faster />
                </div>
                <p>¡Cómo lanzar tu primer curso más rápido!</p>
              </div>
              <div className="resource">
                <div className="icon">
                  <News />
                </div>
                <p>Noticias</p>
              </div>
              <div className="resource">
                <div className="icon">
                  <Conferences />
                </div>
                <p>Conferencias</p>
              </div>
              <div className="resource">
                <div className="icon">
                  <Instructors />
                </div>
                <p>Instructores</p>
              </div>
            </div>
          </div>
        </div>

        <Footer unique instructor />
      </PageTransition>
    </div>
  );
};

export default HomeInstructor;
