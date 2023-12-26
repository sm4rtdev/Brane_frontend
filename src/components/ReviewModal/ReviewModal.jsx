import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import "./ReviewModal.scss";

import { Star } from "../../assets/icons";

import SpinnerOfDoom from "../SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../DynamicInput/DynamicInput";
import { ReviewModalContext } from "../../contexts/ReviewModalContext";
import { DictionaryContext } from "../../contexts/DictionaryContext";
import { UserDataContext } from "../../contexts/UserDataContext";
import { getSpecificReview } from "../../api/getSpecificReview";
import { postReview } from "../../api/postReview";
import { putReview } from "../../api/putReview";

const ReviewModal = ({ selectedCourseID, editMode }) => {
  const { dictionary, language } = useContext(DictionaryContext);
  const { closeModal, closeOnClick, stars } = useContext(ReviewModalContext);
  const { userData } = useContext(UserDataContext);

  const [previousReview, setPreviousReview] = useState(null);

  const [input, setInput] = useState({
    review: "",
  });
  const [loading, setLoading] = useState(false);

  const modalContainer = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      modalContainer.current.classList.add("visible");
    }, 0);

    if (editMode) {
      const getPrevious = async () => {
        const { ok, data } = await getSpecificReview(selectedCourseID, userData.info.id);

        if (ok) {
          setPreviousReview(data.data);
          setInput({
            review: data.data[0].attributes.comentario,
          });
        } else {
          toast.error(`${data.error.message}`);
        }
      };

      getPrevious();
    }
  }, [editMode, selectedCourseID, userData]);

  const sendReview = async () => {
    setLoading(true);

    if (!previousReview) {
      const obj = {
        data: {
          asunto: "Review",
          curso: selectedCourseID,
          comentario: input.review,
          valoracion: stars,
        },
      };

      const { ok, data } = await postReview(obj);

      if (ok) {
        setInput({ review: "" });
        closeModal();

        toast.success(dictionary.reviewModal[0][language]);
      } else {
        setLoading(false);
        toast.error(`${data.error.message}`);
      }
    } else {
      const obj = {
        data: {
          comentario: input.review,
          valoracion: stars,
        },
      };

      const { ok, data } = await putReview(previousReview[0].id, obj);

      if (ok) {
        setInput({ review: "" });
        closeModal();

        toast.success(dictionary.reviewModal[1][language]);
      } else {
        setLoading(false);
        toast.error(`${data.error.message}`);
      }
    }
  };

  return (
    <div id="review-modal-container" onClick={closeOnClick} ref={modalContainer}>
      <div className="modal">
        <strong>{editMode ? dictionary.reviewModal[2][language] : dictionary.reviewModal[3][language]}</strong>

        <div className="stars">
          {Array(stars)
            .fill("1")
            .map((el, index) => {
              return <Star key={index} />;
            })}
        </div>

        <div className="container">
          {editMode ? (
            previousReview ? (
              <DynamicInput
                id={"review"}
                state={[input, setInput]}
                noIcon
                label={dictionary.reviewModal[4][language]}
                multiline
              />
            ) : (
              <SpinnerOfDoom standalone />
            )
          ) : (
            <DynamicInput
              id={"review"}
              state={[input, setInput]}
              noIcon
              label={dictionary.reviewModal[4][language]}
              multiline
            />
          )}
        </div>

        <button className="action-button" onClick={sendReview} disabled={input.review.length === 0 || loading}>
          {loading ? (
            <>
              <SpinnerOfDoom /> {dictionary.spinnerOfDoom[language]}
            </>
          ) : editMode ? (
            dictionary.reviewModal[5][language]
          ) : (
            dictionary.reviewModal[6][language]
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
