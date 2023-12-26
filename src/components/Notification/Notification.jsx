import { formatRelative } from "date-fns";
import React, { useContext } from "react";
import { Link } from "react-router-dom";

import "./Notification.scss";

import { DictionaryContext } from "../../contexts/DictionaryContext";

const Notification = ({ descripcion, updatedAt, url }) => {
  const { dictionary, language } = useContext(DictionaryContext);

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
          <Link to={url}>{dictionary.notificationsPage[2][language]}</Link>
        </div>
      )}
    </div>
  );
};

export default Notification;
