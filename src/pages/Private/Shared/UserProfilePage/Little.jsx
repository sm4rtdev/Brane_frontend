import React from "react";
import { Link } from "react-router-dom";

import { PersonOutline } from "../../../../assets/icons";

import FancyImage from "../../../../components/FancyImage/FancyImage";
import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";

const Little = ({ apellidos, nombre, avatar, slug }) => {
  return (
    <Link to={`/user/${slug}`} className="little">
      <div className="profile-picture">
        {avatar && avatar.url ? (
          <FancyImage src={getImageLinkFrom(avatar.url)} />
        ) : (
          <PersonOutline />
        )}
      </div>

      <strong>{`${nombre} ${apellidos}`}</strong>
    </Link>
  );
};

export default Little;
