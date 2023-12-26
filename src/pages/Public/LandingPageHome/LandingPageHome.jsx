import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./LandingPageHome.scss";

import { BGTeach, Dots, DotsVertical, QuotationMarks } from "../../../assets/images";

import { Ellipse } from "../../../assets/icons";

import bannerLandingHome from "../../../assets/images/banner-landing-home.jpg";
import googlePlayEN from "../../../assets/images/google-play-badgeEN.png";
import communityLeft from "../../../assets/images/community-left.png";
import googlePlay from "../../../assets/images/google-play-badge.png";
import appStoreEN from "../../../assets/images/app-store-badgeEN.png";
import appStore from "../../../assets/images/app-store-badge.png";
import estudiante from "../../../assets/images/estudiante.png";
import instructor from "../../../assets/images/instructor.png";
import subhero from "../../../assets/images/subhero.jpg";
import lineas from "../../../assets/images/lineas.png";

import PageTransition from "../../../components/PageTransition/PageTransition";
import SpinnerOfDoom from "../../../components/SpinnerOfDoom/SpinnerOfDoom";
import PublicHeader from "../../../components/PublicHeader/PublicHeader";
import CourseCard from "../../../components/CourseCard/CourseCard";
import FancyImage from "../../../components/FancyImage/FancyImage";
import Footer from "../../../components/Footer/Footer";
import { getCoursesByCategory } from "../../../api/getCoursesByCategory";
import { DictionaryContext } from "../../../contexts/DictionaryContext";

const LandingPageHome = () => {
  const { dictionary, language } = useContext(DictionaryContext);

  const [courses, setCourses] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Design");

  useEffect(() => {
    setCourses(null);

    const getCourses = async () => {
      const { ok, data } = await getCoursesByCategory(selectedCategory);

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
        let scrollMax = boxContainer.current.scrollHeight - boxContainer.current.clientHeight;
        let top = boxContainer.current.scrollTop + boxContainer.current.clientHeight * 2;

        setDotFillingState((top / scrollMax) * 2);

        if (boxContainer.current.scrollTop === scrollMax) {
          boxContainer.current.scrollBy({
            top: -scrollMax,
            left: 0,
            behavior: "smooth",
          });
        } else {
          boxContainer.current.scrollBy({
            top: boxContainer.current.scrollTop + boxContainer.current.clientHeight,
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
              <h1>{dictionary.landingPage.banner[0][language]}</h1>

              <p>{dictionary.landingPage.banner[1][language]}</p>

              <Link to="/auth/signup" className="action-button">
                {dictionary.landingPage.banner[2][language]}
              </Link>
            </div>
          </div>

          <div className="about">
            <div className="about-image">
              <FancyImage src={subhero} noEffect />
            </div>
            <div className="about-text">
              <p>{dictionary.landingPage.about[0][language]}</p>
            </div>
          </div>

          <div className="courses">
            <div className="background">
              <img src={lineas} alt="" />
              <img src={lineas} alt="" />
            </div>

            <h2>{dictionary.landingPage.courses[0][language]}</h2>

            <div className="categories">
              <span
                onClick={() => {
                  setSelectedCategory("Design");
                }}
                className={selectedCategory === "Design" ? "selected" : ""}
              >
                {dictionary.landingPage.courses[1][language]}
              </span>
              <span
                onClick={() => {
                  setSelectedCategory("Development");
                }}
                className={selectedCategory === "Development" ? "selected" : ""}
              >
                {dictionary.landingPage.courses[2][language]}
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
                  return <CourseCard key={course.id} {...course} type="standard landing" landing />;
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
                <h2>{dictionary.landingPage.teach[0][language]}</h2>
                <p>{dictionary.landingPage.teach[1][language]}</p>

                <Link to="/teach" className="action-button">
                  {dictionary.landingPage.teach[2][language]}
                </Link>
              </div>
            </div>
            <div className="group">
              <div className="teach-image">
                <FancyImage src={estudiante} noEffect />
              </div>
              <div className="teach-text">
                <h2>{dictionary.landingPage.teach[3][language]}</h2>
                <p>{dictionary.landingPage.teach[4][language]}</p>

                <Link to="/auth/signup" className="action-button">
                  {dictionary.landingPage.teach[5][language]}
                </Link>
              </div>
            </div>
          </div>

          <div className="community">
            <h2>{dictionary.landingPage.testimonials[0][language]}</h2>

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

                    <p>{dictionary.landingPage.testimonials[1][language]}</p>
                  </div>
                  <div className="box">
                    <QuotationMarks />

                    <p>{dictionary.landingPage.testimonials[2][language]}</p>
                  </div>
                  <div className="box">
                    <QuotationMarks />

                    <p>{dictionary.landingPage.testimonials[3][language]}</p>
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
                {dictionary.landingPage.call[0][language]}
              </Link>

              <strong> {dictionary.landingPage.call[1][language]}</strong>
              <strong>{dictionary.landingPage.call[2][language]}</strong>

              <div className="phones">
                <FancyImage src={language === "es" ? googlePlay : googlePlayEN} noEffect={true} />
                <FancyImage src={language === "es" ? appStore : appStoreEN} noEffect={true} />
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
