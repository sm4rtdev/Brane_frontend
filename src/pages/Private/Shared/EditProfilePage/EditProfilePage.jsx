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

const EditProfilePage = ({ mode }) => {
  const { userData, setRefresh } = useContext(UserDataContext);

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
          toast.success("Your data has been successfully updated");
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
          toast.success("Tus datos han sido actualizados exitosamente");
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
          toast.success("Tus datos han sido actualizados exitosamente");
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
              title={"Edit Profile"}
            />
          </HeaderToggler>
        ) : (
          <InstructorHeader />
        )}

        <div className="main">
          <div className="section-title-box">
            <h1>Editar perfil</h1>
          </div>

          <form>
            {mode === "company" ? (
              <>
                <h2>Información de la empresa</h2>

                {/* Profile */}
                <DynamicInput
                  id={"firstName"}
                  state={[inputsUser, setInputsUser]}
                  placeholder="ACME"
                  noIcon
                  label={"Nombre de empresa"}
                />

                {/* Meta */}
                <DynamicInput
                  id={"foundationDate"}
                  state={[inputsMeta, setInputsMeta]}
                  noIcon
                  type="date"
                  label={"Fecha de fundación"}
                />
                <DynamicInput
                  id={"location"}
                  state={[inputsMeta, setInputsMeta]}
                  placeholder="Dirección"
                  noIcon
                  label={"Dirección"}
                />
                <DynamicInput
                  id={"numberOfWorkers"}
                  state={[inputsMeta, setInputsMeta]}
                  placeholder="Numero de Trabajadores"
                  type="number"
                  noIcon
                  number
                  label={"Numero de Trabajadores"}
                />
                <DynamicInput
                  id={"description"}
                  state={[inputsMeta, setInputsMeta]}
                  placeholder="Descripción de la empresa"
                  noIcon
                  multiline
                  label={"Descripción de la empresa"}
                />
                <p className="explanatory">
                  La descripción será visible en tu perfil.
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
                  {isLoading && <SpinnerOfDoom />}Actualizars
                </button>
              </>
            ) : mode === "institution" ? (
              <>
                <h2>Información de la institución</h2>

                {/* Profile */}
                <DynamicInput
                  id={"firstName"}
                  state={[inputsUser, setInputsUser]}
                  placeholder="Nombre de la Institución"
                  noIcon
                  label={"Nombre de la Institución"}
                />

                {/* Meta */}
                <DynamicInput
                  id={"foundationDate"}
                  state={[inputsMeta, setInputsMeta]}
                  noIcon
                  type="date"
                  label={"Fecha de fundación"}
                />
                <DynamicInput
                  id={"location"}
                  state={[inputsMeta, setInputsMeta]}
                  placeholder="Dirección"
                  noIcon
                  label={"Dirección"}
                />
                <DynamicInput
                  id={"description"}
                  state={[inputsMeta, setInputsMeta]}
                  placeholder="Descripción de la Institución"
                  noIcon
                  multiline
                  label={"Descripción de la Institución"}
                />
                <p className="explanatory">
                  La descripción será visible en tu perfil.
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

                <h2 className="separator">Contact information</h2>
                <DynamicInput
                  id={"phone"}
                  state={[inputsUser, setInputsUser]}
                  noIcon
                  label={"Phone number"}
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
                  {isLoading && <SpinnerOfDoom />}Actualizar
                </button>
              </>
            ) : (
              <>
                <h2>Información del estudiante</h2>

                <DynamicInput
                  id={"firstName"}
                  state={[inputsUser, setInputsUser]}
                  placeholder="John"
                  noIcon
                  label={"Nombre"}
                />
                <DynamicInput
                  id={"lastName"}
                  state={[inputsUser, setInputsUser]}
                  placeholder="Doe"
                  noIcon
                  label={"Apellido"}
                />
                <DynamicInput
                  id={"birthdate"}
                  type="date"
                  state={[inputsMeta, setInputsMeta]}
                  noIcon
                  label={"Fecha de nacimiento"}
                />
                <DynamicInput
                  id={"location"}
                  state={[inputsMeta, setInputsMeta]}
                  placeholder="España"
                  noIcon
                  label={"Dirección"}
                />
                <DynamicInput
                  id={"ocupation"}
                  state={[inputsMeta, setInputsMeta]}
                  placeholder="Diseñador"
                  noIcon
                  label={"Ocupación"}
                />

                {userData.mode === "instructor" && (
                  <div className="only">
                    <h2>Información del instructor</h2>

                    <DynamicInput
                      id={"headline"}
                      state={[inputsUser, setInputsUser]}
                      placeholder="Enseñando desde el 99"
                      noIcon
                      label={"Titular"}
                      max={30}
                    />
                    <p className="explanatory">
                      El título aparecerá junto a su nombre en sus cursos y
                      resultados de búsqueda.
                    </p>

                    <DynamicInput
                      id={"biography"}
                      state={[inputsMeta, setInputsMeta]}
                      placeholder="Instructor en Brane"
                      noIcon
                      multiline
                      label={"Biografía"}
                    />
                    <p className="explanatory">
                      La Bio será visible en tu perfil.
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
                  {isLoading && <SpinnerOfDoom />}Actualizar
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
