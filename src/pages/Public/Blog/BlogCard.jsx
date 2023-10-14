import React, { useContext } from "react";
import { Link } from "react-router-dom";

import FancyImage from "../../../components/FancyImage/FancyImage";
import { DictionaryContext } from "../../../contexts/DictionaryContext";

const BlogCard = ({ id, imageURL, title, shortDescription, url }) => {
  const { dictionary, language } = useContext(DictionaryContext);

  return (
    <Link to={url} className="help-card">
      <FancyImage src={imageURL} />

      <strong>{title}</strong>
      <p>{shortDescription}</p>

      <button className="action-button">{dictionary.blog[2][language]}</button>
    </Link>
  );
};

export default BlogCard;
