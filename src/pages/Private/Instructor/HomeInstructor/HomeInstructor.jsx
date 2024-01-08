import React, { useContext } from "react";
import { Link } from "react-router-dom";

import {
  ForegroundCtaInstructor,
  Conferences,
  Instructors,
  CtaVector1,
  CtaVector2,
  Audience,
  Camera,
  Faster,
  News,
} from "../../../../assets/images";

import InstructorHeader from "../../../../components/CustomHeaders/InstructorHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import Footer from "../../../../components/Footer/Footer";
import { UserDataContext } from "../../../../contexts/UserDataContext";

import "./HomeInstructor.scss";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

const HomeInstructor = () => {
  const { dictionary, language } = useContext(DictionaryContext);
  const { userData } = useContext(UserDataContext);

  return (
    <div id="home-instructor" className="page">
      <PageTransition>
        <InstructorHeader />

        <div className="main">
          <h1>
            {dictionary.privateInstructor.home[0][language]} <strong>{userData.info.nombre}.</strong>{" "}
            {dictionary.privateInstructor.home[1][language]}
          </h1>

          <div className="cta">
            <div className="background">
              <CtaVector1 />
              <CtaVector2 />
              <ForegroundCtaInstructor />
            </div>

            <div className="container">
              <strong>{dictionary.privateInstructor.home[2][language]}</strong>
              <p>{dictionary.privateInstructor.home[3][language]}</p>

              <Link to={"/create-course"} className={"action-button black"}>
                {dictionary.privateInstructor.home[4][language]}
              </Link>
            </div>
          </div>

          <div className="section">
            <h2>{dictionary.privateInstructor.home[5][language]}</h2>

            <div className="grid">
              <Link className="resource" to={"/courses"}>
                <div className="icon">
                  <Camera />
                </div>
                <p>{dictionary.privateInstructor.home[6][language]}</p>
              </Link>
              <Link className="resource" to={"/blog"}>
                <div className="icon">
                  <Audience />
                </div>
                <p>{dictionary.privateInstructor.home[7][language]}</p>
              </Link>
              <Link className="resource" to={"/blog"}>
                <div className="icon">
                  <Faster />
                </div>
                <p>{dictionary.privateInstructor.home[8][language]}</p>
              </Link>
              <Link className="resource" to={"/blog"}>
                <div className="icon">
                  <News />
                </div>
                <p>{dictionary.privateInstructor.home[9][language]}</p>
              </Link>
              <Link className="resource" to={"conferences"}>
                <div className="icon">
                  <Conferences />
                </div>
                <p>{dictionary.privateInstructor.home[10][language]}</p>
              </Link>
              <Link className="resource" to={"/courses"}>
                <div className="icon">
                  <Instructors />
                </div>
                <p>{dictionary.privateInstructor.home[11][language]}</p>
              </Link>
            </div>
          </div>
        </div>

        <Footer unique instructor />
      </PageTransition>
    </div>
  );
};

export default HomeInstructor;
