import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./UserProfilePage.scss";

import InstructorHeader from "../../../../components/CustomHeaders/InstructorHeader";
import InternalHeader from "../../../../components/InternalHeader/InternalHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import HeaderToggler from "../../../../components/HeaderToggler/HeaderToggler";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import OptionsMenu from "../../../../components/OptionsMenu/OptionsMenu";
import Footer from "../../../../components/Footer/Footer";
import InstructorProfile from "./InstructorProfile";
import StudentProfile from "./StudentProfile";
import { postUserProfileImage } from "../../../../api/postUserProfileImage";
import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { getUserBySlug } from "../../../../api/getUserBySlug";
import BusinessProfile from "./BusinessProfile";
import InstitutionProfile from "./InstitutionProfile";

const UserProfilePage = () => {
  const { slug } = useParams();

  const { userData, setRefresh } = useContext(UserDataContext);

  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputFile = useRef(null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(null);

    setTimeout(() => {
      if (userData && userData.info) {
        if (userData.info.slug === slug) {
          setUser({ me: true, ...userData });
        } else {
          setUser(null);

          const getUser = async () => {
            const { ok, data } = await getUserBySlug(slug);

            console.log(data);

            if (ok) {
              setUser({
                me: false,
                info: data,
                avatar: data.avatar ? data.avatar : null,
              });
            } else {
              setUser({
                me: false,
                info: null,
                avatar: null,
              });
            }
          };

          getUser();
        }
      }
    }, 10);
  }, [userData, slug]); //eslint-disable-line

  const uploadProfilePicture = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();

    formData.append("ref", "plugin::users-permissions.user");
    formData.append("refId", userData.info.id);
    formData.append("field", "avatar");
    formData.append("files", file, file.name);

    const { ok, data } = await postUserProfileImage(formData);

    setIsLoading(false);

    if (ok) {
      toast.success("La foto del perfil ha sido actualizada.");

      setImage(getImageLinkFrom(data[0].formats.thumbnail.url));
      setRefresh(Date.now());
    } else {
      console.log(data.error);
      toast.error(`${data.error.message}`);
    }
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const openInputFile = () => {
    inputFile.current.click();
  };

  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

  const openOptionsMenu = () => {
    setIsOptionsMenuOpen(true);
  };

  const closeOptionsMenu = (e) => {
    if (e.target.id === "options-menu") {
      setIsOptionsMenuOpen(false);
    }
  };

  console.log(user, userData);

  return (
    <div id="user-profile" className="page">
      <PageTransition margin>
        {userData && userData.info && (
          <>
            {userData.mode === "instructor" ? (
              <InstructorHeader profile openOptionsMenu={openOptionsMenu} />
            ) : (
              <HeaderToggler>
                {user && user.info ? (
                  <InternalHeader
                    options={{
                      backButton: true,
                      bigTitle: true,
                      settings: slug === userData.info.slug,
                    }}
                    title={
                      user.info.role.id === 1
                        ? "Student profile"
                        : user.info.role.id === 3
                        ? "Instructor profile"
                        : user.info.role.id === 4
                        ? "Business profile"
                        : "Institution profile"
                    }
                    {...(user.me && {
                      openOptionsMenu,
                    })}
                  />
                ) : (
                  <InternalHeader
                    options={{
                      backButton: true,
                      bigTitle: true,
                      settings: false,
                    }}
                    title={"User profile"}
                  />
                )}
              </HeaderToggler>
            )}
            {isOptionsMenuOpen && (
              <OptionsMenu closeOptionsMenu={closeOptionsMenu} />
            )}

            {user ? (
              // User exists
              user.info ? (
                // User is me
                user.me ? (
                  // Dual mode
                  user.info.role.id === 1 || user.info.role.id === 3 ? (
                    userData.mode === "instructor" ? (
                      <InstructorProfile
                        user={user}
                        onFileChange={onFileChange}
                        inputFile={inputFile}
                        image={image}
                        openInputFile={openInputFile}
                        uploadProfilePicture={uploadProfilePicture}
                        isLoading={isLoading}
                        file={file}
                      />
                    ) : (
                      <StudentProfile
                        user={user}
                        onFileChange={onFileChange}
                        inputFile={inputFile}
                        image={image}
                        openInputFile={openInputFile}
                        uploadProfilePicture={uploadProfilePicture}
                        isLoading={isLoading}
                        file={file}
                      />
                    )
                  ) : // Single Mode
                  // Business
                  user.info.role.id === 4 ? (
                    <BusinessProfile
                      user={user}
                      onFileChange={onFileChange}
                      inputFile={inputFile}
                      image={image}
                      openInputFile={openInputFile}
                      uploadProfilePicture={uploadProfilePicture}
                      isLoading={isLoading}
                      file={file}
                    />
                  ) : // Institution
                  user.info.role.id === 6 ? (
                    <InstitutionProfile
                      user={user}
                      onFileChange={onFileChange}
                      inputFile={inputFile}
                      image={image}
                      openInputFile={openInputFile}
                      uploadProfilePicture={uploadProfilePicture}
                      isLoading={isLoading}
                      file={file}
                    />
                  ) : (
                    <div className="no-user">
                      <strong>Error</strong>
                    </div>
                  )
                ) : // User is not me
                // Student
                user.info.role.id === 1 ? (
                  <StudentProfile
                    user={user}
                    onFileChange={onFileChange}
                    inputFile={inputFile}
                    image={image}
                    openInputFile={openInputFile}
                    uploadProfilePicture={uploadProfilePicture}
                    isLoading={isLoading}
                    file={file}
                  />
                ) : // Instructor
                user.info.role.id === 3 ? (
                  <InstructorProfile
                    user={user}
                    onFileChange={onFileChange}
                    inputFile={inputFile}
                    image={image}
                    openInputFile={openInputFile}
                    uploadProfilePicture={uploadProfilePicture}
                    isLoading={isLoading}
                    file={file}
                  />
                ) : // Business
                user.info.role.id === 4 ? (
                  <BusinessProfile
                    user={user}
                    onFileChange={onFileChange}
                    inputFile={inputFile}
                    image={image}
                    openInputFile={openInputFile}
                    uploadProfilePicture={uploadProfilePicture}
                    isLoading={isLoading}
                    file={file}
                  />
                ) : // Institution
                user.info.role.id === 6 ? (
                  <InstitutionProfile
                    user={user}
                    onFileChange={onFileChange}
                    inputFile={inputFile}
                    image={image}
                    openInputFile={openInputFile}
                    uploadProfilePicture={uploadProfilePicture}
                    isLoading={isLoading}
                    file={file}
                  />
                ) : (
                  <div className="no-user">
                    <strong>Error</strong>
                  </div>
                )
              ) : (
                <div className="no-user">
                  <strong>Error 404</strong>
                  <p>El usuario "{slug}" no existe</p>
                </div>
              )
            ) : (
              <SpinnerOfDoom standalone center />
            )}
            <Footer
              unique
              {...(userData.mode === "instructor" && { instructor: true })}
            />
          </>
        )}
      </PageTransition>
    </div>
  );
};

export default UserProfilePage;
