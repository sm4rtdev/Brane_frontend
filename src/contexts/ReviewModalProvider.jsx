import React, { useState } from "react";

import ReviewModal from "../components/ReviewModal/ReviewModal";
import { ReviewModalContext } from "./ReviewModalContext";

const ReviewModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseID, setSelectedCourseID] = useState(null);
  const [stars, setStars] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourseID(null);
    setStars(null);
    setEditMode(false);
  };

  const closeOnClick = (e) => {
    if (e.target.id === "review-modal-container") {
      closeModal();
    }
  };

  const openReviewModal = (courseID, index, edit) => {
    setSelectedCourseID(courseID);
    setStars(index);
    setIsModalOpen(true);
    if (edit) {
      setEditMode(true);
    }
  };

  return (
    <ReviewModalContext.Provider
      value={{
        isModalOpen,
        openReviewModal,
        closeModal,
        closeOnClick,
        stars,
      }}
    >
      {children}

      {isModalOpen && <ReviewModal selectedCourseID={selectedCourseID} editMode={editMode} />}
    </ReviewModalContext.Provider>
  );
};

export default ReviewModalProvider;
