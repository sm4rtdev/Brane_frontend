import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import "./CourseCard.scss";

import { ChevronForward } from "../../assets/icons";

import LessonDownloader from "../LessonDownloader/LessonDownloader";
import SpinnerOfDoom from "../SpinnerOfDoom/SpinnerOfDoom";
import FancyImage from "../FancyImage/FancyImage";
import { DictionaryContext } from "../../contexts/DictionaryContext";
import { getImageLinkFrom } from "../../helpers/getImageLinkFrom";
import { getAllClasses } from "../../api/getAllClasses";

const SpecialCourseCard = ({ attributes, triggerUpdate, updater }) => {
  const { dictionary, language } = useContext(DictionaryContext);

  const temp = attributes.curso.data.attributes;

  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [lessons, setLessons] = useState(null);

  useEffect(() => {
    if (isManagerOpen) {
      setLessons(null);

      const getLessons = async () => {
        const { ok, data } = await getAllClasses(temp.slug);

        if (ok) {
          setLessons(data.data);
        } else {
          toast.error(`${data.error.message}`);
        }
      };

      setTimeout(() => {
        getLessons();
      }, 0);
    } else {
      setLessons(null);
    }
  }, [isManagerOpen, temp]);

  return (
    <div className={`course-card related download`}>
      <div className="container">
        <div className="inner-container">
          <div className="course-image">
            <FancyImage src={getImageLinkFrom(temp.imagen.data[0].attributes.url)} />
          </div>
          <div className="text">
            <strong>{temp.name}</strong>
            <p>{`${temp.instructor.data.attributes.nombre} ${temp.instructor.data.attributes.apellidos}`}</p>
          </div>
        </div>

        <div className="download-section">
          <button
            className="opener"
            onClick={() => {
              setIsManagerOpen((current) => !current);
            }}
          >
            <p>{dictionary.specialCourseCard[0][language]}</p>

            <span>
              <ChevronForward className={`${isManagerOpen ? "open" : ""}`} />
            </span>
          </button>

          {isManagerOpen && (
            <div className="manager">
              {lessons ? (
                <>
                  <h3>{dictionary.specialCourseCard[1][language]}:</h3>

                  <div className="lessons">
                    {lessons.length > 0 ? (
                      lessons.map((lesson, index) => {
                        return (
                          <LessonDownloader key={index} {...lesson} triggerUpdate={triggerUpdate} updater={updater} />
                        );
                      })
                    ) : (
                      <p className="no-data">{dictionary.specialCourseCard[2][language]}</p>
                    )}
                  </div>
                </>
              ) : (
                <SpinnerOfDoom standalone top />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialCourseCard;
