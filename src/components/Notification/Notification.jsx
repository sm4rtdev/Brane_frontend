import { formatRelative } from "date-fns";
import React from "react";
import { Link } from "react-router-dom";

import "./Notification.scss";

const Notification = ({ descripcion, updatedAt, url }) => {
  return (
    <div className="notification">
      <div className="title">{descripcion}</div>

      {url && (
        <div className="content">
          <span>
            {formatRelative(new Date(Date.parse(updatedAt)), new Date(), {
              includeSeconds: true,
              addSuffix: true,
            })}
          </span>
          <Link to={url}>Ver más</Link>
        </div>
      )}
    </div>
  );
};

export default Notification;
