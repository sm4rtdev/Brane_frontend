import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./CourseCard.scss";

import {
  ChevronForward,
  HeartOutline,
  ImageOutline,
  TrashOutline,
  StarOutline,
  Star,
} from "../../assets/icons";

import FancyImage from "../FancyImage/FancyImage";
import { WishlistModalContext } from "../../contexts/WishlistModalContext";
import { ReviewModalContext } from "../../contexts/ReviewModalContext";
import { getImageLinkFrom } from "../../helpers/getImageLinkFrom";
import { UserDataContext } from "../../contexts/UserDataContext";
import { CartContext } from "../../contexts/CartContext";

const CourseCard = ({
  type = "vertical",
  attributes,
  id,
  noLink,
  landing,
  currentUserID,
  company,
  selectedCourse,
  openEdit,
}) => {
  const { userData } = useContext(UserDataContext);
  const { openReviewModal } = useContext(ReviewModalContext);
  const { openWishlistModal } = useContext(WishlistModalContext);

  const handleUserRating = (index, alreadyExists) => {
    // console.log(index);

    openReviewModal(id, index, alreadyExists);
  };

  const { removeFromCart } = useContext(CartContext);

  const [stars, setStars] = useState(
    attributes.valoracion
      ? Array(5)
          .fill("1", 0, attributes.valoracion)
          .fill("0", attributes.valoracion)
      : Array(5).fill("0")
  );

  const [temp, setTemp] = useState(null);

  useEffect(() => {
    setTemp(null);

    if (type.includes("other")) {
      setTemp(attributes);
    } else if (type.includes("big") || type.includes("small")) {
      // console.log(attributes);
      setTemp(attributes.curso.data.attributes);
    } else {
      setTemp(attributes);
    }
  }, [attributes]); //eslint-disable-line

  return (
    <div
      className={`course-card ${type} ${
        selectedCourse === id ? "selected" : ""
      }`}
    >
      {!type.includes("big") &&
        !type.includes("download") &&
        !type.includes("cart") &&
        !userData.company &&
        !userData.institution && (
          <button
            className="save-to-wish-list small-button"
            onClick={() => openWishlistModal(id)}
          >
            <HeartOutline />
          </button>
        )}

      {type.includes("cart") && (
        <button
          className="cart-button small-button"
          onClick={() => {
            console.log(id);
            removeFromCart(id);
          }}
        >
          <TrashOutline />
        </button>
      )}

      {temp && (
        <Link
          to={
            landing
              ? "/auth/login"
              : company
              ? "#"
              : openEdit
              ? `/edit-course/${id}`
              : `/course/${temp.slug}${type.includes("big") ? "/learn" : ""}`
          }
          {...(noLink && { onClick: (e) => e.preventDefault() })}
          {...(company && {
            onClick: (e) => {
              e.preventDefault();
              company(id);
            },
          })}
          className="container"
        >
          <div className="inner-container">
            <div className="course-image">
              {temp.logo_institucion ? (
                <FancyImage
                  src={getImageLinkFrom(temp.logo_institucion)}
                  alt=""
                />
              ) : (
                temp.imagen &&
                (temp.imagen.data === null ? (
                  <ImageOutline />
                ) : (
                  <FancyImage
                    src={getImageLinkFrom(
                      temp.imagen.data
                        ? temp.imagen.data[0].attributes.url
                        : temp.imagen[0].url
                    )}
                    alt=""
                  />
                ))
              )}
            </div>
            <div className="text">
              <strong>{temp.name}</strong>
              {!type.includes("other") &&
              (type.includes("big") || type.includes("small")) ? (
                <p>{`${temp.instructor.data.attributes.nombre} ${temp.instructor.data.attributes.apellidos}`}</p>
              ) : (
                <p>{`${temp.instructor.nombre} ${temp.instructor.apellidos}`}</p>
              )}

              {!type.includes("download") && (
                <div className="bottom">
                  {!type.includes("big") && (
                    <div className="group">
                      <div className="rating">
                        <Star />
                        <span>
                          {temp.averageScore ? temp.averageScore : "NEW"}
                        </span>
                      </div>

                      {temp.precio && (
                        <div className="price">
                          <span>${temp.precio}</span>

                          <ChevronForward />
                        </div>
                      )}
                    </div>
                  )}
                  {type.includes("big") && (
                    <div className="extra">
                      <div className="progress">
                        <p>Progreso de finalización: {attributes.progress}%</p>

                        <div className="bar">
                          <div
                            className="bar-filler"
                            style={{ width: `${attributes.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {!type.includes("other") && (
                        <div className="user-rating">
                          {currentUserID !== temp.instructor.data.id ? (
                            <>
                              <p>
                                {attributes.valoracion
                                  ? "Your rating"
                                  : "Leave a rating"}
                              </p>

                              <div className="stars">
                                {stars.map((value, index) => {
                                  return (
                                    <button
                                      className="small-button"
                                      key={index}
                                      onClick={(e) => {
                                        e.preventDefault();

                                        handleUserRating(
                                          index + 1,
                                          attributes.valoracion
                                        );
                                      }}
                                      {...(!attributes.valoracion && {
                                        onMouseEnter: () => {
                                          let newStars = Array(5).fill(
                                            "1",
                                            0,
                                            index
                                          );
                                          newStars.fill("0", index);

                                          setStars(newStars);
                                        },
                                      })}
                                      {...(!attributes.valoracion && {
                                        onMouseLeave: () => {
                                          setStars(Array(5).fill("0"));
                                        },
                                      })}
                                    >
                                      {value === "1" ? (
                                        <Star />
                                      ) : (
                                        <StarOutline />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <p className="is-my-course">
                              Eres el autor de este curso
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default CourseCard;
