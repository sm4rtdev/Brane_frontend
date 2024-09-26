import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  PersonOutline,
  LogoInstagram,
  ImageOutline,
  LogoFacebook,
  LogoLinkedin,
  Settings,
} from "../../../../assets/icons";
import { BGProfileIns } from "../../../../assets/images";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import FancyImage from "../../../../components/FancyImage/FancyImage";
import Tabulation from "../../../../components/Tabulation/Tabulation";
import CourseCard from "../../../../components/CourseCard/CourseCard";
import Little from "./Little";
import { getCoursesFromInstitution } from "../../../../api/getCoursesFromInstitution";
import { getInstitutionUsers } from "../../../../api/getInstitutionUsers";
import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

const InstitutionProfile = ({
  uploadProfilePicture,
  openInputFile,
  onFileChange,
  inputFile,
  isLoading,
  image,
  file,
  user,
}) => {
  const [instructors, setInstructors] = useState(null);
  const [courses, setCourses] = useState(null);
  const { dictionary, language } = useContext(DictionaryContext);

  useEffect(() => {
    const getCourses = async () => {
      const { ok, data } = await getCoursesFromInstitution();

      console.log(data);
      if (ok) {
        if (data.length === 0) {
          setCourses([]);
        } else if (data[0].length === 0) {
          setCourses([]);
        } else {
          let temp = [];

          for (let i = 0; i < data.length; i++) {
            const index = data[i];

            for (let j = 0; j < index.length; j++) {
              const element = index[j];

              temp.push(element);
            }
          }

          // console.log(temp);
          setCourses(temp);
        }
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    const getInstructors = async () => {
      const { ok, data } = await getInstitutionUsers();

      // console.log(data);
      if (ok) {
        setInstructors(data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    getCourses();
    getInstructors();
  }, []); //eslint-disable-line

  return (
    <div className="main">
      <div className="banner">
        <BGProfileIns />

        <span>{dictionary.institutionProfile[0][language]}</span>

        {user.me && (
          <Link to="/edit-profile" className="small-button">
            <Settings />
          </Link>
        )}
      </div>

      <div className="instructor">
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
                  <SpinnerOfDoom /> {dictionary.institutionProfile[1][language]}
                </>
              ) : (
                `${dictionary.institutionProfile[2][language]}`
              )}
            </button>
          )}
        </div>

        <div className="basic">
          <div className="mega">
            <h1>{`${user.info.nombre}`}</h1>

            {user.me ? (
              <strong className="email">{user.info.email}</strong>
            ) : (
              <strong className="email">@{user.info.slug}</strong>
            )}
          </div>

          <div className="meta">
            {user.meta && user.me ? (
              <>
                <p>{dictionary.institutionProfile[3][language]}: {user.meta.foundationDate}</p>
                <p>{dictionary.institutionProfile[4][language]}: {user.meta.address}</p>
              </>
            ) : (
              <>
                <p>{dictionary.institutionProfile[3][language]}: {user.info.metaData.foundationDate}</p>
                <p>{dictionary.institutionProfile[4][language]}: {user.info.metaData.address}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="description">
        {user.me
          ? user.meta && (
              <>
                <p>{user.meta.description}</p>
                <div className="social">
                  {user.meta.facebook && (
                    <a
                      href={user.meta.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LogoFacebook />
                    </a>
                  )}
                  {user.meta.instagram && (
                    <a
                      href={user.meta.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LogoInstagram />
                    </a>
                  )}
                  {user.meta.linkedin && (
                    <a
                      href={user.meta.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LogoLinkedin />
                    </a>
                  )}
                </div>
              </>
            )
          : user.info.metaData && (
              <>
                <p>{user.info.metaData.description}</p>
                <div className="social">
                  {user.info.metaData.facebook && (
                    <a
                      href={user.info.metaData.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LogoFacebook />
                    </a>
                  )}
                  {user.info.metaData.instagram && (
                    <a
                      href={user.info.metaData.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LogoInstagram />
                    </a>
                  )}
                  {user.info.metaData.linkedin && (
                    <a
                      href={user.info.metaData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LogoLinkedin />
                    </a>
                  )}
                </div>
              </>
            )}
      </div>

      <Tabulation
        tabs={["Cursos", "Instructores"]}
        options={{ type: "bubble", color: "black" }}
      >
        <>
          {courses ? (
            courses.length > 0 ? (
              <div className="courses">
                {courses.map((course) => {
                  console.log(course);
                  return (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      attributes={course}
                      type="standard"
                    />
                  );
                })}
              </div>
            ) : (
              <p className="no-data">{dictionary.institutionProfile[5][language]}</p>
            )
          ) : (
            <SpinnerOfDoom standalone />
          )}
        </>
        <>
          {instructors ? (
            instructors.length > 0 ? (
              <div className="students">
                {instructors.map((user) => {
                  // console.log(user);
                  return <Little {...user} key={user.id} />;
                })}
              </div>
            ) : (
              <p className="no-data">{dictionary.institutionProfile[5][language]}</p>
            )
          ) : (
            <SpinnerOfDoom standalone />
          )}
        </>
      </Tabulation>
    </div>
  );
};
export default InstitutionProfile;
