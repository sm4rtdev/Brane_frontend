import React from "react";
import { Link } from "react-router-dom";

import { TrashOutline } from "../../../../assets/icons";

import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";

import "./Wish.scss";

const Wish = ({ addDelete, id, name, slug, imagen, instructor }) => {
  console.log(id);
  return (
    <Link to={`/course/${slug}`} className="wish">
      <div className="course-image">
        <img src={getImageLinkFrom(imagen[0].url)} alt="" />
      </div>
      <div className="text">
        <strong>{name}</strong>
        <span>{`${instructor.nombre} ${instructor.apellidos}`}</span>
      </div>

      <button
        className="small-button"
        onClick={(e) => {
          e.preventDefault();
          addDelete(id);
        }}
      >
        <TrashOutline />
      </button>
    </Link>
  );
};

export default Wish;
