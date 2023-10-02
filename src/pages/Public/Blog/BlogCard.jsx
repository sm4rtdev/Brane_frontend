import React from "react";
import { Link } from "react-router-dom";
import FancyImage from "../../../components/FancyImage/FancyImage";

const BlogCard = ({ id, imageURL, title, shortDescription, url }) => {
  return (
    <Link to={url} className="help-card">
      <FancyImage src={imageURL} />

      <strong>{title}</strong>
      <p>{shortDescription}</p>

      <button className="action-button">Leer más</button>
    </Link>
  );
};

export default BlogCard;
