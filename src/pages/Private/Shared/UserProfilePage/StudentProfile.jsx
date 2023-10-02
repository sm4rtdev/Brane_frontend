import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  PersonOutline,
  ImageOutline,
  Settings,
} from "../../../../assets/icons";
import { BGProfile } from "../../../../assets/images";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import CourseCard from "../../../../components/CourseCard/CourseCard";
import FancyImage from "../../../../components/FancyImage/FancyImage";
import Tabulation from "../../../../components/Tabulation/Tabulation";
import { getOtherStudentCourses } from "../../../../api/getOtherStudentCourses";
import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";
import { calculateAge } from "../../../../helpers/calculateAge";
import { getMyCourses } from "../../../../api/getMyCourses";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { putUserMetadata } from "../../../../api/putUserMetadata";

const StudentProfile = ({
  user,
  onFileChange,
  inputFile,
  image,
  openInputFile,
  uploadProfilePicture,
  isLoading,
  file,
}) => {
  const { userData, setMetadataRefresh } = useContext(UserDataContext);
  const [courses, setCourses] = useState(null);
  const [notifications, setNotifications] = useState({
    messages: userData.meta.notificacion_mensajes,
    promotions: userData.meta.notificacion_promocion,
    instructorAnnouncement: userData.meta.notificacion_anuncios_instructores,
  });

  useEffect(() => {
    setCourses(null);

    const getUserCourses = async () => {
      const { ok, data } = await getMyCourses(true);

      // console.log(data.data);

      if (ok) {
        setCourses(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    const getOtherUserCourses = async () => {
      const { ok, data } = await getOtherStudentCourses(user.info.slug);

      // console.log(data.data);

      if (ok) {
        setCourses(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    if (user.me) {
      getUserCourses();
    } else {
      getOtherUserCourses();
    }
  }, [user]);

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
      toast.success("Your notification settings have been updated");
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
    <div className="main">
      <div className="banner">
        <BGProfile />

        <span>Perfil de estudiante</span>

        {user.me && (
          <Link to="/edit-profile" className="small-button">
            <Settings />
          </Link>
        )}
      </div>

      <div className="user">
        <div className="profile-picture">
          <input
            type="file"
            id="media"
            onChange={onFileChange}
            ref={inputFile}
          />

          <div className="container">
            <div className="img-container">
              {user.me ? (
                image ? (
                  <FancyImage src={image} />
                ) : user.avatar ? (
                  <FancyImage src={getImageLinkFrom(user.avatar.url)} />
                ) : (
                  <PersonOutline />
                )
              ) : user.avatar ? (
                <FancyImage src={getImageLinkFrom(user.avatar.url)} />
              ) : (
                <PersonOutline />
              )}
            </div>
            {user.me && (
              <button className="small-button" onClick={openInputFile}>
                <ImageOutline />
              </button>
            )}
          </div>

          {file && (
            <button
              className="action-button"
              onClick={uploadProfilePicture}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <SpinnerOfDoom /> Cargando
                </>
              ) : (
                "Cambiar avatar"
              )}
            </button>
          )}
        </div>

        <div className="basic">
          <h1>{`${user.info.nombre} ${user.info.apellidos}`}</h1>

          {user.me ? (
            <strong className="email">{user.info.email}</strong>
          ) : (
            <strong className="email">@{user.info.slug}</strong>
          )}

          {user.meta && user.me ? (
            <>
              <p>Edad: {calculateAge(user.meta.birthday)}</p>
              <p>Dirección: {user.meta.address}</p>
              <p>Ocupación: {user.meta.profesion}</p>
            </>
          ) : (
            <>
              <p>Edad: {calculateAge(user.info.metaData.birthday)}</p>
              <p>Dirección: {user.info.metaData.address}</p>
              <p>Ocupación: {user.info.metaData.profesion}</p>
            </>
          )}
        </div>

        {user.me && (
          <div className="quick-settings">
            <div
              className={`checkbox ${notifications.messages ? "checked" : ""}`}
            >
              <p>Notificaciones de mensajes</p>
              <button onClick={() => toggleSetting("messages")}></button>
            </div>
            <div
              className={`checkbox ${
                notifications.promotions ? "checked" : ""
              }`}
            >
              <p>Notificación de promociones</p>
              <button onClick={() => toggleSetting("promotions")}></button>
            </div>
            <div
              className={`checkbox ${
                notifications.instructorAnnouncement ? "checked" : ""
              }`}
            >
              <p>Notificaciones de anuncios del instructor</p>
              <button
                onClick={() => toggleSetting("instructorAnnouncement")}
              ></button>
            </div>
          </div>
        )}
      </div>

      {courses && (
        <div className="resume">
          <div className="stat">
            <strong>{courses.length}</strong>
            <span>Cursos inscritos</span>
          </div>
          <div className="stat">
            <strong>
              {courses.filter((course) => course.attributes.completado).length}
            </strong>
            <span>Cursos completados</span>
          </div>
          <div className="stat">
            <strong>0</strong>
            <span>Certificados obtenidos</span>
          </div>
        </div>
      )}

      <Tabulation
        tabs={["Cursos", "Proyectos"]}
        options={{ type: "bubble", color: "black" }}
      >
        <>
          {courses ? (
            <>
              <div className="courses">
                {user.me ? (
                  courses.length > 0 ? (
                    <>
                      {courses.map((course) => {
                        console.log(course);
                        return (
                          <CourseCard
                            key={`me-${course.id}`}
                            {...course}
                            type="standard big"
                            id={course.attributes.curso.data.id}
                          />
                        );
                      })}
                    </>
                  ) : (
                    <p className="no-data">Aún no has comprado cursos</p>
                  )
                ) : courses.length > 0 ? (
                  courses.map((course) => {
                    let tempCourse = course;
                    tempCourse.curso.progress = course.attributes.progress;
                    tempCourse.curso.instructor = course.instructor;

                    return (
                      <CourseCard
                        key={`other-${tempCourse.id}`}
                        attributes={tempCourse.curso}
                        type="standard big other"
                      />
                    );
                  })
                ) : (
                  <p className="no-data">El usuario no ha comprado cursos.</p>
                )}
              </div>
              {courses.length > 0 && (
                <Link to={"/my-courses"} className="action-button">
                  Ver más
                </Link>
              )}
            </>
          ) : (
            <SpinnerOfDoom standalone />
          )}
        </>
        <>
          <div className="projects">
            {user.me ? (
              <p className="no-data">No has completado ningún proyecto</p>
            ) : (
              <p className="no-data">
                Este usuario no ha completado ningún proyecto.
              </p>
            )}
          </div>
        </>
      </Tabulation>

      {user.me && (
        <Tabulation
          tabs={["Historial de compras", "Créditos U"]}
          options={{ type: "bubble", color: "black" }}
        >
          <>
            <p className="no-data">Sin datos</p>
          </>
          <>
            <p className="no-data">Sin datos</p>
          </>
        </Tabulation>
      )}
    </div>
  );
};

export default StudentProfile;
