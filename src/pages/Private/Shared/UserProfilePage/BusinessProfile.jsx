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
import FancyImage from "../../../../components/FancyImage/FancyImage";
import Tabulation from "../../../../components/Tabulation/Tabulation";
import Little from "./Little";
import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { getCompanyUsers } from "../../../../api/getCompanyUsers";
import { BGProfileIns } from "../../../../assets/images";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

const BusinessProfile = ({
  user,
  onFileChange,
  inputFile,
  image,
  openInputFile,
  uploadProfilePicture,
  isLoading,
  file,
}) => {
  const { userData } = useContext(UserDataContext);
  const { dictionary, language } = useContext(DictionaryContext);

  const [employees, setEmployees] = useState(null);

  useEffect(() => {
    const getEmployees = async () => {
      const { ok, data } = await getCompanyUsers(userData.info.id);

      console.log(data);
      if (ok) {
        setEmployees(data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    getEmployees();
  }, []); //eslint-disable-line

  return (
    <div className="main">
      <div className="banner">
        <BGProfileIns />

        <span>{dictionary.businessProfile[0][language]}</span>

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
                  <SpinnerOfDoom /> {dictionary.businessProfile[1][language]}
                </>
              ) : (
                `${dictionary.businessProfile[2][language]}`
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
                <p>{dictionary.businessProfile[3][language]}: {user.meta.numberOfWorkers}</p>
                <p>{dictionary.businessProfile[4][language]}: {user.meta.address}</p>
              </>
            ) : (
              <>
                <p>
                  {dictionary.businessProfile[3][language]}: {user.info.metaData.numberOfWorkers}
                </p>
                <p>{dictionary.businessProfile[4][language]}: {user.info.metaData.address}</p>
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
        tabs={[dictionary.businessProfile[5][language]]}
        options={{ type: "bubble", color: "black" }}
      >
        <>
          {employees ? (
            employees.length > 0 ? (
              <div className="students">
                {employees.map((user) => {
                  console.log(user);
                  return <Little {...user} key={user.id} />;
                })}
              </div>
            ) : (
              <p className="no-data">{dictionary.businessProfile[6][language]}</p>
            )
          ) : (
            <SpinnerOfDoom standalone />
          )}
        </>
        <></>
      </Tabulation>
    </div>
  );
};
export default BusinessProfile;
