import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Settings,
  PersonOutline,
  ImageOutline,
  LogoFacebook,
  LogoInstagram,
  LogoLinkedin,
} from "../../../../assets/icons";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import CourseCard from "../../../../components/CourseCard/CourseCard";
import FancyImage from "../../../../components/FancyImage/FancyImage";
import Tabulation from "../../../../components/Tabulation/Tabulation";
import Little from "./Little";
import { getStudentsByInstructor } from "../../../../api/getStudentsByInstructor";
import { getCoursesByInstructor } from "../../../../api/getCoursesByInstructor";
import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";
import { calculateAge } from "../../../../helpers/calculateAge";
import { BGProfileIns } from "../../../../assets/images";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

const InstructorProfile = ({
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
  const [courses, setCourses] = useState(null);
  const [students, setStudents] = useState(null);

  useEffect(() => {
    const getCourse = async () => {
      const { ok, data } = await getCoursesByInstructor(user.info.id);

      if (ok) {
        setCourses(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };
    const getStudents = async () => {
      const { ok, data } = await getStudentsByInstructor(user.info.slug);

      if (ok) {
        setStudents(data.data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    getCourse();
    getStudents();
  }, []); //eslint-disable-line

  return (
    <div className="main">
      <div className="banner">
        <BGProfileIns />

        <span>Perfil del instructor</span>

        {user.me && (
          <Link to="/edit-profile" className="small-button">
            <Settings />
          </Link>
        )}
      </div>

      <div className="instructor">
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
                  <SpinnerOfDoom /> Cargando
                </>
              ) : (
                "Cambiar avatar"
              )}
            </button>
          )}
        </div>

        <div className="basic">
          <div className="mega">
            <h1>{`${user.info.nombre} ${user.info.apellidos}`}</h1>

            {user.me ? (
              <strong className="email">{user.info.email}</strong>
            ) : (
              <strong className="email">@{user.info.slug}</strong>
            )}
          </div>

          <div className="meta">
            {user.meta && user.me ? (
              <>
                <p>Edad: {calculateAge(user.meta.birthday)}</p>
                <p>Dirección: {user.meta.address}</p>
                <p>Ocupación: {user.meta.profesion}</p>
              </>
            ) : (
              <>
                <p>Age: {calculateAge(user.info.metaData.birthday)}</p>
                <p>Dirección: {user.info.metaData.address}</p>
                <p>Ocupación: {user.info.metaData.profesion}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="description">
        {user.me
          ? user.meta && (
              <>
                <p>{user.meta.biografia}</p>
                <div className="social">
                  {user.meta.facebook && (
                    <a href={user.meta.facebook} target="_blank" rel="noopener noreferrer">
                      <LogoFacebook />
                    </a>
                  )}
                  {user.meta.instagram && (
                    <a href={user.meta.instagram} target="_blank" rel="noopener noreferrer">
                      <LogoInstagram />
                    </a>
                  )}
                  {user.meta.linkedin && (
                    <a href={user.meta.linkedin} target="_blank" rel="noopener noreferrer">
                      <LogoLinkedin />
                    </a>
                  )}
                </div>
              </>
            )
          : user.info.metaData && (
              <>
                <p>{user.info.metaData.biografia}</p>
                <div className="social">
                  {user.info.metaData.facebook && (
                    <a href={user.info.metaData.facebook} target="_blank" rel="noopener noreferrer">
                      <LogoFacebook />
                    </a>
                  )}
                  {user.info.metaData.instagram && (
                    <a href={user.info.metaData.instagram} target="_blank" rel="noopener noreferrer">
                      <LogoInstagram />
                    </a>
                  )}
                  {user.info.metaData.linkedin && (
                    <a href={user.info.metaData.linkedin} target="_blank" rel="noopener noreferrer">
                      <LogoLinkedin />
                    </a>
                  )}
                </div>
              </>
            )}
      </div>

      <Tabulation tabs={["Cursos", "Estudiantes"]} options={{ type: "bubble", color: "black" }}>
        <>
          {courses ? (
            courses.length > 0 ? (
              courses.map((course, index) => {
                return <CourseCard key={index} {...course} type="related download" />;
              })
            ) : (
              <p className="no-data">Sin datos</p>
            )
          ) : (
            <SpinnerOfDoom standalone />
          )}
        </>
        <>
          {students ? (
            students.length > 0 ? (
              <div className="students">
                {students.map((student) => {
                  return <Little {...student} key={student.id} />;
                })}
              </div>
            ) : (
              <p className="no-data">Sin datos</p>
            )
          ) : (
            <SpinnerOfDoom standalone />
          )}
        </>
      </Tabulation>
    </div>
  );
};
export default InstructorProfile;
