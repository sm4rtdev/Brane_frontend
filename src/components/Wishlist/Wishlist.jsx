import React, { useContext } from "react";
import { Link } from "react-router-dom";

import "./Wishlist.scss";

import { ImageOutline } from "../../assets/icons";
import { getImageLinkFrom } from "../../helpers/getImageLinkFrom";
import { DictionaryContext } from "../../contexts/DictionaryContext";

const Wishlist = ({ id, name, imagen, numWishlist }) => {
  const { dictionary, language } = useContext(DictionaryContext);
  return (
    <Link to={`/wishlist/${id}`} className="wishlist">
      <div className="wishlist-image">
        {imagen ? <img src={getImageLinkFrom(imagen[0].url)} alt="" /> : <ImageOutline />}
      </div>
      <div className="text-content">
        <strong>{name}</strong>
        <span>{`${numWishlist} ${dictionary.wishlistModal[9][language]}`}</span>
      </div>
    </Link>
  );
};

export default Wishlist;
