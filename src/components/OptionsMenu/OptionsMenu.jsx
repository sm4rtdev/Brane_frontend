import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import "./OptionsMenu.scss";

import {
  AlertCircleOutline,
  ChevronForward,
  CreateOutline,
  LogOutOutline,
} from "../../assets/icons";

import { putUserMetadata } from "../../api/putUserMetadata";
import { UserDataContext } from "../../contexts/UserDataContext";

const OptionsMenu = ({ closeOptionsMenu }) => {
  const { userData, closeSession, setMetadataRefresh } =
    useContext(UserDataContext);

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
      toast.success("Tu configuración de notificaciones ha sido actualizada.");
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
        <strong>Ajustes</strong>

        {!userData.instructor && userData.company && userData.institution && (
          <button className="action-button">Conviértete en instructor</button>
        )}

        <Link to="/edit-profile" className="link">
          <CreateOutline />
          <p>Editar perfil</p>
          <ChevronForward />
        </Link>

        <div className={`slider ${notifications.messages ? "checked" : ""}`}>
          <p>Notificaciones de mensajes</p>
          <button onClick={() => toggleSetting("messages")}></button>
        </div>
        <div className={`slider ${notifications.promotions ? "checked" : ""}`}>
          <p>Notificación de promociones</p>
          <button onClick={() => toggleSetting("promotions")}></button>
        </div>
        <div
          className={`slider ${
            notifications.instructorAnnouncement ? "checked" : ""
          }`}
        >
          <p>Notificaciones de anuncios del instructor</p>
          <button
            onClick={() => toggleSetting("instructorAnnouncement")}
          ></button>
        </div>

        <Link to="/help" className="link">
          <AlertCircleOutline />
          <p>Centro de ayuda</p>
          <ChevronForward />
        </Link>

        <div className="link logout" onClick={closeSession}>
          <LogOutOutline />
          <p>Cerrar sesión</p>
        </div>
      </div>
    </div>
  );
};

export default OptionsMenu;
