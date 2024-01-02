import React, { useContext, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { PersonOutline, ImageOutline, Settings } from "../../../../assets/icons";
import { BGProfile } from "../../../../assets/images";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import CourseCard from "../../../../components/CourseCard/CourseCard";
import FancyImage from "../../../../components/FancyImage/FancyImage";
import Tabulation from "../../../../components/Tabulation/Tabulation";
import { getOtherStudentCourses } from "../../../../api/getOtherStudentCourses";
import { getUserPurchaseHistory } from "../../../../api/getUserPurchaseHistory";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";
import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { getCurrentCredits } from "../../../../api/getCurrentCredits";
import { putUserMetadata } from "../../../../api/putUserMetadata";
import { calculateAge } from "../../../../helpers/calculateAge";
import { getMyCourses } from "../../../../api/getMyCourses";

const MyTable = ({ data }) => {
  const { dictionary, language } = useContext(DictionaryContext);

  const [rows, setRows] = useState(null);

  const columns = [
    { field: "id", headerName: "#" },
    { field: "courses", headerName: dictionary.studentProfile[0][language], flex: 4 },
    { field: "total", headerName: "Total", flex: 1 },
    { field: "discount", headerName: dictionary.studentProfile[1][language], flex: 1 },
    { field: "paymentMethod", headerName: dictionary.studentProfile[2][language], flex: 1 },
    { field: "date", headerName: dictionary.studentProfile[3][language], flex: 2 },
  ];

  useEffect(() => {
    let table = [];

    for (let i = 0; i < data.length; i++) {
      let courseNames = [];

      for (let j = 0; j < data[i].cursos.length; j++) {
        const element = data[i].cursos[j];

        courseNames.push(element.name);
      }

      if (courseNames.length === 0) continue;

      const obj = {
        id: i + 1,
        paymentMethod: data[i].metodo_de_pago,
        total: data[i].total,
        discount: data[i].descuento,
        date: new Date(data[i].fecha_de_creacion),
        courses: courseNames.join(", "),
      };

      table.push(obj);
    }

    setRows(table);
  }, [data]);

  return (
    <div style={{ height: 400, width: "100%" }} className="summary-data-table">
      {rows && <DataGrid autoHeight rows={rows} columns={columns} />}
    </div>
  );
};

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
  const { dictionary, language } = useContext(DictionaryContext);
  const { userData, setMetadataRefresh } = useContext(UserDataContext);

  const [courses, setCourses] = useState(null);

  const [notifications, setNotifications] = useState({
    messages: userData.meta.notificacion_mensajes,
    promotions: userData.meta.notificacion_promocion,
    instructorAnnouncement: userData.meta.notificacion_anuncios_instructores,
  });

  const [credits, setCredits] = useState(null);
  const [userPurchaseHistory, setUserPurchaseHistory] = useState(null);

  useEffect(() => {
    setCourses(null);
    setCredits(null);

    const getUserCourses = async () => {
      const { ok, data } = await getMyCourses(true);

      if (ok) {
        setCourses(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    const getUserCredits = async () => {
      const { ok, data } = await getCurrentCredits();

      if (ok) {
        setCredits(data.quantity);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    const getUserHistory = async () => {
      const { ok, data } = await getUserPurchaseHistory();

      if (ok) {
        setUserPurchaseHistory(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    const getOtherUserCourses = async () => {
      const { ok, data } = await getOtherStudentCourses(user.info.slug);

      if (ok) {
        setCourses(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    if (user.me) {
      getUserCourses();
      getUserCredits();
      getUserHistory();
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
      toast.success(dictionary.studentProfile[4][language]);
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

        <span>{dictionary.studentProfile[5][language]}</span>

        {user.me && (
          <Link to="/edit-profile" className="small-button">
            <Settings />
          </Link>
        )}
      </div>

      <div className="user">
        <div className="profile-picture">
          <input type="file" id="media" onChange={onFileChange} ref={inputFile} />

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
            <button className="action-button" onClick={uploadProfilePicture} disabled={isLoading}>
              {isLoading ? (
                <>
                  <SpinnerOfDoom /> {dictionary.spinnerOfDoom[language]}
                </>
              ) : (
                dictionary.studentProfile[6][language]
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
              <p>
                {dictionary.studentProfile[7][language]}: {calculateAge(user.meta.birthday)}
              </p>
              <p>
                {dictionary.studentProfile[8][language]}: {user.meta.address}
              </p>
              <p>
                {dictionary.studentProfile[9][language]}: {user.meta.profesion}
              </p>
            </>
          ) : (
            <>
              <p>
                {dictionary.studentProfile[7][language]}: {calculateAge(user.info.metaData.birthday)}
              </p>
              <p>
                {dictionary.studentProfile[8][language]}: {user.info.metaData.address}
              </p>
              <p>
                {dictionary.studentProfile[9][language]}: {user.info.metaData.profesion}
              </p>
            </>
          )}
        </div>

        {user.me && (
          <div className="quick-settings">
            <div className={`checkbox ${notifications.messages ? "checked" : ""}`}>
              <p>{dictionary.studentProfile[10][language]}</p>
              <button onClick={() => toggleSetting("messages")}></button>
            </div>
            <div className={`checkbox ${notifications.promotions ? "checked" : ""}`}>
              <p>{dictionary.studentProfile[11][language]}</p>
              <button onClick={() => toggleSetting("promotions")}></button>
            </div>
            <div className={`checkbox ${notifications.instructorAnnouncement ? "checked" : ""}`}>
              <p>{dictionary.studentProfile[12][language]}</p>
              <button onClick={() => toggleSetting("instructorAnnouncement")}></button>
            </div>
          </div>
        )}
      </div>

      {courses && (
        <div className="resume">
          <div className="stat">
            <strong>{courses.length}</strong>
            <span>{dictionary.studentProfile[13][language]}</span>
          </div>
          <div className="stat">
            <strong>{courses.filter((course) => course.attributes.completado).length}</strong>
            <span>{dictionary.studentProfile[14][language]}</span>
          </div>
          <div className="stat">
            <strong>
              {
                courses
                  .filter((course) => course.attributes.completado)
                  .filter((course) => course.attributes.certificado.data !== null).length
              }
            </strong>
            <span>{dictionary.studentProfile[15][language]}</span>
          </div>
        </div>
      )}

      <Tabulation tabs={[dictionary.studentProfile[16][language]]} options={{ type: "bubble", color: "black" }}>
        <>
          {courses ? (
            <>
              <div className="courses">
                {user.me ? (
                  courses.length > 0 ? (
                    <>
                      {courses.map((course) => {
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
                    <p className="no-data">{dictionary.studentProfile[17][language]}</p>
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
                  <p className="no-data">{dictionary.studentProfile[18][language]}</p>
                )}
              </div>
              {courses.length > 0 && (
                <Link to={"/my-courses"} className="action-button">
                  {dictionary.studentProfile[19][language]}
                </Link>
              )}
            </>
          ) : (
            <SpinnerOfDoom standalone />
          )}
        </>
      </Tabulation>

      {user.me && (
        <Tabulation
          tabs={[dictionary.studentProfile[23][language], dictionary.studentProfile[24][language]]}
          options={{ type: "bubble", color: "black" }}
        >
          <>
            <p className="credits no-data">
              {dictionary.studentProfile[20][language]}: <strong>{credits}</strong>{" "}
              {dictionary.studentProfile[21][language]}
            </p>
          </>
          <>
            {userPurchaseHistory !== null ? (
              <MyTable data={userPurchaseHistory} />
            ) : (
              <p className="no-data">{dictionary.studentProfile[22][language]}</p>
            )}
          </>
        </Tabulation>
      )}
    </div>
  );
};

export default StudentProfile;
