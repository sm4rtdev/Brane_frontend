import React, { useState } from "react";

import { WishlistModalContext } from "./WishlistModalContext";
import WishlistModal from "../components/WishlistModal/WishlistModal";

const WishlistModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourseID, setSelectedCourseID] = useState(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourseID(null);
  };

  const closeOnClick = (e) => {
    if (e.target.id === "wishlist-modal-container") {
      closeModal();
    }
  };

  const openWishlistModal = (courseID) => {
    setSelectedCourseID(courseID);
    setIsModalOpen(true);
  };

  return (
    <WishlistModalContext.Provider value={{ isModalOpen, openWishlistModal, closeModal, closeOnClick }}>
      {children}

      {isModalOpen && <WishlistModal selectedCourseID={selectedCourseID} />}
    </WishlistModalContext.Provider>
  );
};

export default WishlistModalProvider;
