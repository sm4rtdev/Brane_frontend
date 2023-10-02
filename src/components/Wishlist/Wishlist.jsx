import React from "react";
import { Link } from "react-router-dom";

import "./Wishlist.scss";

import { ImageOutline } from "../../assets/icons";
import { getImageLinkFrom } from "../../helpers/getImageLinkFrom";

const Wishlist = ({ id, name, imagen, numWishlist }) => {
  return (
    <Link to={`/wishlist/${id}`} className="wishlist">
      <div className="wishlist-image">
        {imagen ? (
          <img src={getImageLinkFrom(imagen[0].url)} alt="" />
        ) : (
          <ImageOutline />
        )}
      </div>
      <div className="text-content">
        <strong>{name}</strong>
        <span>{`${numWishlist} Cursos`}</span>
      </div>
    </Link>
  );
};

export default Wishlist;
