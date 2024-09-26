import React, { useContext, useState } from "react";
import { toast } from "react-toastify";

import "./EditProfilePage.scss";

import InstructorHeader from "../../../../components/CustomHeaders/InstructorHeader";
import InternalHeader from "../../../../components/InternalHeader/InternalHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import HeaderToggler from "../../../../components/HeaderToggler/HeaderToggler";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import Footer from "../../../../components/Footer/Footer";
import { putInstitutionMetadata } from "../../../../api/putInstitutionMetadata";
import { putCompanyMetadata } from "../../../../api/putCompanyMetadata";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { putUserMetadata } from "../../../../api/putUserMetadata";
import { putUser } from "../../../../api/putUser";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

const EditProfilePage = ({ mode }) => {
  const { userData, setRefresh } = useContext(UserDataContext);
  const { dictionary, language } = useContext(DictionaryContext);

  const [isLoading, setIsLoading] = useState(false);

  const [inputsUser, setInputsUser] = useState({
    firstName: userData.info.nombre,
    lastName: userData.info.apellidos,
    headline: userData.info.headline || "",
    phone: userData.info.telefono || "",
  });
  const [inputsMeta, setInputsMeta] = useState({
    foundationDate: userData.meta.foundationDate || "",
    numberOfWorkers: userData.meta.numberOfWorkers,
    description: userData.meta.description || "",
    location: userData.meta.address,
    ocupation: userData.meta.profesion,
    birthdate: userData.meta.birthday,
    biography: userData.meta.biografia,
    facebook: userData.meta.facebook || "",
    instagram: userData.meta.instagram || "",
    linkedin: userData.meta.linkedin || "",
  });

  const updateAll = async () => {
    let obj = {};

    if (mode === "institution") {
      obj = {
        nombre: inputsUser.firstName,
        telefono: inputsUser.phone,
      };
    } else {
      obj = {
        nombre: inputsUser.firstName,
        apellidos: inputsUser.lastName,
        headline: inputsUser.headline,
      };
    }

    const { ok, data } = await putUser(userData.info.id, obj);

    console.log(data);

    if (ok) {
      let metaObj = {};

      if (mode === "institution") {
        metaObj = {
          data: {
            description: inputsMeta.description,
            foundationDate: inputsMeta.foundationDate,
            address: inputsMeta.location,
            facebook: inputsMeta.facebook,
            instagram: inputsMeta.instagram,
            linkedin: inputsMeta.linkedin,
          },
        };

        const { ok, data } = await putInstitutionMetadata(metaObj);

        if (ok) {
          setRefresh(Date.now());
          toast.success(dictionary.editProfilePage[0][language]);
        } else {
          toast.error(`${data.error.message}`);
        }
      } else if (mode === "company") {
        metaObj = {
          data: {
            numberOfWorkers: inputsMeta.numberOfWorkers,
            description: inputsMeta.description,
            foundationDate: inputsMeta.foundationDate,
            address: inputsMeta.location,
            facebook: inputsMeta.facebook,
            instagram: inputsMeta.instagram,
            linkedin: inputsMeta.linkedin,
          },
        };

        const { ok, data } = await putCompanyMetadata(metaObj);

        if (ok) {
          setRefresh(Date.now());
          toast.success(dictionary.editProfilePage[0][language]);
        } else {
          toast.error(`${data.error.message}`);
        }
      } else {
        metaObj = {
          data: {
            biografia: inputsMeta.biography,
            address: inputsMeta.location,
            profesion: inputsMeta.ocupation,
            birthday: inputsMeta.birthdate,
            facebook: inputsMeta.facebook,
            instagram: inputsMeta.instagram,
            linkedin: inputsMeta.linkedin,
          },
        };

        const { ok, data } = await putUserMetadata(metaObj);

        if (ok) {
          setRefresh(Date.now());
          toast.success(dictionary.editProfilePage[0][language]);
        } else {
          toast.error(`${data.error.message}`);
        }
      }

      setIsLoading(false);
    } else {
      toast.error(`${data.error.message}`);
      setIsLoading(false);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();

    setIsLoading(true);
    updateAll();
  };

  return (
    <div id="edit-profile-page" className="page">
      <PageTransition margin>
        {userData.mode !== "instructor" ? (
          <HeaderToggler>
            <InternalHeader
              options={{
                backButton: true,
                bigTitle: true,
              }}
              title={dictionary.editProfilePage[1][language]}
            />
          </HeaderToggler>
        ) : (
          <InstructorHeader />
        )}

        <div className="main">
          <div className="section-title-box">
            <h1>{dictionary.editProfilePage[1][language]}</h1>
          </div>

          <form>
            {mode === "company" ? (
              <>
                <h2>{dictionary.editProfilePage[2][language]}</h2>

                {/* Profile */}
                <DynamicInput
                  id={"firstName"}
                  state={[inputsUser, setInputsUser]}
                  placeholder="ACME"
                  noIcon
                  label={dictionary.editProfilePage[3][language]}
                />

                {/* Meta */}
                <DynamicInput
                  id={"foundationDate"}
                  state={[inputsMeta, setInputsMeta]}
                  noIcon
                  type="date"
                  label={dictionary.editProfilePage[4][language]}
                />
                <DynamicInput
                  id={"location"}
                  state={[inputsMeta, setInputsMeta]}
                  placeholder={dictionary.editProfilePage[5][language]}
                  noIcon
                  label={dictionary.editProfilePage[5][language]}
                />
                <DynamicInput
                  id={"numberOfWorkers"}
                  state={[inputsMeta, setInputsMeta]}
                  placeholder={dictionary.editProfilePage[6][language]}
                  type="number"
                  noIcon
                  number
                  label={dictionary.editProfilePage[6][language]}
                />
                <DynamicInput
                  id={"description"}
                  state={[inputsMeta, setInputsMeta]}
                  placeholder={dictionary.editProfilePage[7][language]}
                  noIcon
                  multiline
                  label={dictionary.editProfilePage[7][language]}
                />
                <p className="explanatory">
                  {dictionary.editProfilePage[8][language]}
                </p>
                <DynamicInput
                  id={"facebook"}
                  state={[inputsMeta, setInputsMeta]}
                  noIcon
                  label={"Facebook"}
                />
                <DynamicInput
                  id={"instagram"}
                  state={[inputsMeta, setInputsMeta]}
                  noIcon
                  label={"Instagram"}
                />
                <DynamicInput
                  id={"linkedin"}
                  state={[inputsMeta, setInputsMeta]}
                  noIcon
                  label={"Linkedin"}
                />

                <button
                  className="action-button"
                  onClick={handleClick}
                  disabled={
                    isLoading ||
                    (inputsUser.firstName === userData.info.nombre &&
                      inputsMeta.foundationDate ===
                        userData.meta.foundationDate &&
                      inputsMeta.numberOfWorkers ===
                        userData.meta.numberOfWorkers &&
                      inputsMeta.description === userData.meta.description &&
                      inputsMeta.location === userData.meta.address &&
                      inputsMeta.facebook === userData.meta.facebook &&
                      inputsMeta.instagram === userData.meta.instagram &&
                      inputsMeta.linkedin === userData.meta.linkedin)
                  }
                >
                  {isLoading && <SpinnerOfDoom />}{dictionary.editProfilePage[9][language]}
                </button>
              </>
            ) : mode === "institution" ? (
              <>
                <h2>{dictionary.editProfilePage[10][language]}</h2>

                {/* Profile */}
                <DynamicInput
                  id={"firstName"}
                  state={[inputsUser, setInputsUser]}
                  placeholder={dictionary.editProfilePage[11][language]}
                  noIcon
                  label={dictionary.editProfilePage[11][language]}
                />

                {/* Meta */}
                <DynamicInput
                  id={"foundationDate"}
                  state={[inputsMeta, setInputsMeta]}
                  noIcon
                  type="date"
                  label={dictionary.editProfilePage[4][language]}
                />
                <DynamicInput
                  id={"location"}
                  state={[inputsMeta, setInputsMeta]}
                  placeholder={dictionary.editProfilePage[5][language]}
                  noIcon
                  label={dictionary.editProfilePage[5][language]}
                />
                <DynamicInput
                  id={"description"}
                  state={[inputsMeta, setInputsMeta]}
                  placeholder={dictionary.editProfilePage[12][language]}
                  noIcon
                  multiline
                  label={dictionary.editProfilePage[12][language]}
                />
                <p className="explanatory">
                  {dictionary.editProfilePage[8][language]}
                </p>
                <DynamicInput
                  id={"facebook"}
                  state={[inputsMeta, setInputsMeta]}
                  noIcon
                  label={"Facebook"}
                />
                <DynamicInput
                  id={"instagram"}
                  state={[inputsMeta, setInputsMeta]}
                  noIcon
                  label={"Instagram"}
                />
                <DynamicInput
                  id={"linkedin"}
                  state={[inputsMeta, setInputsMeta]}
                  noIcon
                  label={"Linkedin"}
                />

                <h2 className="separator">{dictionary.editProfilePage[13][language]}</h2>
                <DynamicInput
                  id={"phone"}
                  state={[inputsUser, setInputsUser]}
                  noIcon
                  label={dictionary.editProfilePage[14][language]}
                />

                <button
                  className="action-button"
                  onClick={handleClick}
                  disabled={
                    isLoading ||
                    (inputsUser.firstName === userData.info.nombre &&
                      inputsUser.phone === userData.info.telefono &&
                      inputsMeta.foundationDate ===
                        userData.meta.foundationDate &&
                      inputsMeta.description === userData.meta.description &&
                      inputsMeta.location === userData.meta.address &&
                      inputsMeta.facebook === userData.meta.facebook &&
                      inputsMeta.instagram === userData.meta.instagram &&
                      inputsMeta.linkedin === userData.meta.linkedin)
                  }
                >
                  {isLoading && <SpinnerOfDoom />}{dictionary.editProfilePage[9][language]}
                </button>
              </>
            ) : (
              <>
                <h2>{dictionary.editProfilePage[15][language]}</h2>

                <DynamicInput
                  id={"firstName"}
                  state={[inputsUser, setInputsUser]}
                  placeholder="John"
                  noIcon
                  label={dictionary.editProfilePage[16][language]}
                />
                <DynamicInput
                  id={"lastName"}
                  state={[inputsUser, setInputsUser]}
                  placeholder="Doe"
                  noIcon
                  label={dictionary.editProfilePage[17][language]}
                />
                <DynamicInput
                  id={"birthdate"}
                  type="date"
                  state={[inputsMeta, setInputsMeta]}
                  noIcon
                  label={dictionary.editProfilePage[18][language]}
                />
                <DynamicInput
                  id={"location"}
                  state={[inputsMeta, setInputsMeta]}
                  placeholder={dictionary.editProfilePage[19][language]}
                  noIcon
                  label={dictionary.editProfilePage[5][language]}
                />
                <DynamicInput
                  id={"ocupation"}
                  state={[inputsMeta, setInputsMeta]}
                  placeholder={dictionary.editProfilePage[20][language]}
                  noIcon
                  label={dictionary.editProfilePage[21][language]}
                />

                {userData.mode === "instructor" && (
                  <div className="only">
                    <h2>{dictionary.editProfilePage[22][language]}</h2>

                    <DynamicInput
                      id={"headline"}
                      state={[inputsUser, setInputsUser]}
                      placeholder={dictionary.editProfilePage[23][language]}
                      noIcon
                      label={dictionary.editProfilePage[24][language]}
                      max={30}
                    />
                    <p className="explanatory">
                      {dictionary.editProfilePage[25][language]}
                    </p>

                    <DynamicInput
                      id={"biography"}
                      state={[inputsMeta, setInputsMeta]}
                      placeholder={dictionary.editProfilePage[26][language]}
                      noIcon
                      multiline
                      label={dictionary.editProfilePage[27][language]}
                    />
                    <p className="explanatory">
                      {dictionary.editProfilePage[28][language]}
                    </p>

                    <DynamicInput
                      id={"facebook"}
                      state={[inputsMeta, setInputsMeta]}
                      noIcon
                      label={"Facebook"}
                    />
                    <DynamicInput
                      id={"instagram"}
                      state={[inputsMeta, setInputsMeta]}
                      noIcon
                      label={"Instagram"}
                    />
                    <DynamicInput
                      id={"linkedin"}
                      state={[inputsMeta, setInputsMeta]}
                      noIcon
                      label={"Linkedin"}
                    />
                  </div>
                )}

                <button
                  className="action-button"
                  onClick={handleClick}
                  disabled={
                    isLoading ||
                    (inputsUser.firstName === userData.info.nombre &&
                      inputsUser.lastName === userData.info.apellidos &&
                      inputsUser.headline === userData.info.headline &&
                      inputsMeta.location === userData.meta.address &&
                      inputsMeta.ocupation === userData.meta.profesion &&
                      inputsMeta.birthdate === userData.meta.birthday &&
                      inputsMeta.biography === userData.meta.biografia &&
                      inputsMeta.facebook === userData.meta.facebook &&
                      inputsMeta.instagram === userData.meta.instagram &&
                      inputsMeta.linkedin === userData.meta.linkedin)
                  }
                >
                  {isLoading && <SpinnerOfDoom />}{dictionary.editProfilePage[9][language]}
                </button>
              </>
            )}
          </form>
        </div>

        <Footer
          unique
          {...(userData.mode === "instructor" && { instructor: true })}
        />
      </PageTransition>
    </div>
  );
};

export default EditProfilePage;
