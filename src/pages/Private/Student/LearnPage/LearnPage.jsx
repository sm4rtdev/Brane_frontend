import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./LearnPage.scss";

import { ChevronForward } from "../../../../assets/icons";

import InternalHeader from "../../../../components/InternalHeader/InternalHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import HeaderToggler from "../../../../components/HeaderToggler/HeaderToggler";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import FancyImage from "../../../../components/FancyImage/FancyImage";
import Footer from "../../../../components/Footer/Footer";
import { getAllClasses } from "../../../../api/getAllClasses";
import { getCourseBySlug } from "../../../../api/getCourseBySlug";
import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";
import { UserDataContext } from "../../../../contexts/UserDataContext";

const LearnPage = () => {
  const { userData } = useContext(UserDataContext);
  const { slug } = useParams();

  const [lessons, setLessons] = useState(null);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const getCourse = async () => {
      const { ok, data } = await getCourseBySlug(slug);

      console.log(data.data);

      if (ok) {
        setCourse(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    const getLessons = async () => {
      const { ok, data } = await getAllClasses(slug);

      console.log(data.data);

      if (ok) {
        setLessons(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    getCourse();
    getLessons();
  }, [slug]);

  return (
    <>
      <div id="learn-page" className="page">
        {course && lessons ? (
          <PageTransition margin>
            <HeaderToggler>
              <InternalHeader
                options={{
                  backButton: true,
                  cart: true,
                  longTitle: true,
                }}
                title={course.curso.name}
              />
            </HeaderToggler>

            <div className="main">
              <div className="title">
                <h1>{course.curso.name}</h1>
              </div>

              <div className="lessons">
                {lessons.map((lesson, index) => {
                  return (
                    <div className="lesson" key={lesson.id}>
                      <h2>Lesson {index + 1}</h2>

                      <Link to={`lesson/${lesson.id}`} className="lesson-card">
                        <div className="left">
                          <FancyImage
                            src={getImageLinkFrom(course.curso.imagen[0].url)}
                          />
                        </div>
                        <div className="middle">
                          <strong>{lesson.attributes.nombre}</strong>
                          <span>{lesson.attributes.duracion} min</span>
                        </div>
                        <div className="right">
                          <span className="small-button">
                            <ChevronForward />
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            <Footer
              unique
              {...(userData.mode === "instructor" && { instructor: true })}
            />
          </PageTransition>
        ) : (
          <SpinnerOfDoom standalone center />
        )}
      </div>
    </>
  );
};

export default LearnPage;
