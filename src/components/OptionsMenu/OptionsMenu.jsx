import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./OptionsMenu.scss";

import { AlertCircleOutline, ChevronForward, CreateOutline, LogOutOutline } from "../../assets/icons";

import { DictionaryContext } from "../../contexts/DictionaryContext";
import { UserDataContext } from "../../contexts/UserDataContext";
import { putUserMetadata } from "../../api/putUserMetadata";

const OptionsMenu = ({ closeOptionsMenu }) => {
  const { dictionary, language } = useContext(DictionaryContext);
  const { userData, closeSession, setMetadataRefresh } = useContext(UserDataContext);

  const [notifications, setNotifications] = useState({
    messages: userData.meta.notificacion_mensajes,
    promotions: userData.meta.notificacion_promocion,
    instructorAnnouncement: userData.meta.notificacion_anuncios_instructores,
  });

  const updateAll = async (noti) => {
    const obj = {
      data: {
        ...userData.meta,
        notificacion_mensajes: noti.messages,
        notificacion_promocion: noti.promotions,
        notificacion_anuncios_instructores: noti.instructorAnnouncement,
      },
    };

    const { ok, data } = await putUserMetadata(obj);

    if (ok) {
      setMetadataRefresh(Date.now());
      toast.success(dictionary.optionsMenu[0][language]);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  const toggleSetting = (setting) => {
    const obj = { ...notifications, [setting]: !notifications[setting] };

    setNotifications(obj);

    updateAll(obj);
  };

  return (
    <div id="options-menu" onClick={closeOptionsMenu}>
      <div className="container">
        <strong>{dictionary.optionsMenu[1][language]}</strong>

        {!userData.instructor && userData.company && userData.institution && (
          <button className="action-button">{dictionary.optionsMenu[2][language]}</button>
        )}

        <Link to="/edit-profile" className="link">
          <CreateOutline />
          <p>{dictionary.optionsMenu[3][language]}</p>
          <ChevronForward />
        </Link>

        <div className={`slider ${notifications.messages ? "checked" : ""}`}>
          <p>{dictionary.optionsMenu[4][language]}</p>
          <button onClick={() => toggleSetting("messages")}></button>
        </div>
        <div className={`slider ${notifications.promotions ? "checked" : ""}`}>
          <p>{dictionary.optionsMenu[5][language]}</p>
          <button onClick={() => toggleSetting("promotions")}></button>
        </div>
        <div className={`slider ${notifications.instructorAnnouncement ? "checked" : ""}`}>
          <p>{dictionary.optionsMenu[6][language]}</p>
          <button onClick={() => toggleSetting("instructorAnnouncement")}></button>
        </div>

        <Link to="/help" className="link">
          <AlertCircleOutline />
          <p>{dictionary.optionsMenu[7][language]}</p>
          <ChevronForward />
        </Link>

        <div className="link logout" onClick={closeSession}>
          <LogOutOutline />
          <p>{dictionary.optionsMenu[8][language]}</p>
        </div>
      </div>
    </div>
  );
};

export default OptionsMenu;
