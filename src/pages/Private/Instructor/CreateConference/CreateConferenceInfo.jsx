import React, { useContext, useEffect, useRef, useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { toast } from "react-toastify";

import "../CreateCourse/CreateCourseInfo";

import { ImageOutline } from "../../../../assets/icons";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import FancyImage from "../../../../components/FancyImage/FancyImage";
import ListItem from "../CreateCourse/ListItem";
import { postUserProfileImage } from "../../../../api/postUserProfileImage";
import { CategoriesContext } from "../../../../contexts/CategoriesContext";
import { postNewCourse } from "../../../../api/postNewCourse";

const feePercentage = 10;

const CreateConferenceInfo = ({ setOpenTab, setCourseID }) => {
  const { categories } = useContext(CategoriesContext);

  // ------------ Manage course information

  const [inputs, setInputs] = useState({
    name: "",
    shortDescription: "",
    descripcion: "",
    idioma: "Español",
    whatYouWillLearn: "",
    requirements: "",
    whoIsThisCourseFor: "",
    categoria: "",
    precio: 0,
    status: "",
    duration: 0,
    certificado: false,
    password: "",
    start: "",
  });
  const [internalInputs, setInternalInputs] = useState({
    whatYouWillLearn: "",
    requirements: "",
    whoIsThisCourseFor: "",
  });
  const [fees, setFees] = useState({ fee: 0, net: 0 });

  const [preview, setPreview] = useState(null);

  // Calculate fees
  useEffect(() => {
    if (inputs.price !== 0) {
      let price = inputs.precio;
      let result = ((feePercentage / 100) * Number(price)).toFixed(2);

      setFees({ fee: result, net: (price - result).toFixed(2) });
    }
  }, [inputs]);

  const deleteTextFromTextArray = (objectKey, text) => {
    let filteredArray = JSON.parse(inputs[objectKey]).filter(
      (el) => el !== text
    );

    let value = null;

    if (filteredArray.length === 0) {
      value = "";
    } else {
      value = JSON.stringify(filteredArray);
    }

    setInputs((c) => {
      return { ...c, [objectKey]: value };
    });
  };

  const alreadyExists = (objectKey, text) => {
    if (inputs[objectKey] !== null && inputs[objectKey].length > 0) {
      let array = JSON.parse(inputs[objectKey]);

      for (let i = 0; i < array.length; i++) {
        const element = array[i];

        if (element === text) {
          return true;
        }
      }
    }

    return false;
  };

  const addTextToATextArray = (objectKey) => {
    let newArray = [];
    let text = internalInputs[objectKey];

    if (text.length > 0) {
      if (inputs[objectKey] !== null && inputs[objectKey].length > 0) {
        newArray = JSON.parse(inputs[objectKey]);

        if (!alreadyExists(objectKey, text)) {
          newArray.push(text);
        }
      } else {
        newArray.push(text);
      }

      setInputs((c) => {
        return { ...c, [objectKey]: JSON.stringify(newArray) };
      });
      setInternalInputs((c) => {
        return { ...c, [objectKey]: "" };
      });
    }
  };

  const toggleCategory = (categoryID) => {
    if (inputs.categoria === categoryID) {
      setInputs((c) => {
        return { ...c, categoria: null };
      });
    } else {
      setInputs((c) => {
        return { ...c, categoria: categoryID };
      });
    }
  };

  // ------------ Manage course image

  const inputFile = useRef(null);
  const [file, setFile] = useState(null);

  const openFileSelection = () => {
    inputFile.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    let url = "";

    if (file) {
      url = URL.createObjectURL(file);
      setPreview(url);
    }

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // ------------ Create course

  const [uploadingFile, setUploadingFile] = useState(false);
  const [ongoingUpdate, setOngoingUpdate] = useState(false);

  const uploadFile = async (newID) => {
    setUploadingFile(true);

    const formData = new FormData();

    formData.append("ref", "api::curso.curso");
    formData.append("refId", newID);
    formData.append("field", "imagen");
    formData.append("files", file, file.name);

    const { ok, data } = await postUserProfileImage(formData);

    setUploadingFile(false);

    if (ok) {
      toast.success("La imagen de la conferencia ha sido cargada.");
      setFile(null);
      setOpenTab(1);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  const createConference = async () => {
    const obj = {
      data: {
        name: inputs.name,
        shortDescription: inputs.shortDescription,
        descripcion: inputs.descripcion,
        idioma: inputs.idioma,
        whatYouWillLearn: JSON.parse(inputs.whatYouWillLearn),
        requirements: JSON.parse(inputs.requirements),
        whoIsThisCourseFor: JSON.parse(inputs.whoIsThisCourseFor),
        categoria: inputs.categoria,
        precio: inputs.precio,
        certificado: false,
        duracion: inputs.duration,
        status: "draft",
        tipo: "conferencia",
        timezone: "America/Santo_Domingo",
        password: inputs.password,
        start: inputs.start,
      },
    };

    console.log(obj);

    const { ok, data } = await postNewCourse(obj);

    if (ok) {
      const newID = data.data.id;
      toast.success("La conferencia ha sido creada.");
      setCourseID(newID);
      uploadFile(newID);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  const checkEverything = () => {
    if (inputs.name.length < 3) {
      toast.error(
        "El nombre de la conferencia no puede estar vacío y debe tener al menos 3 letras."
      );
    } else if (inputs.shortDescription === "") {
      toast.error("Introduzca una breve descripción");
    } else if (inputs.descripcion === "") {
      toast.error("Introduce una descripción");
    } else if (inputs.idioma === "") {
      toast.error("Selecciona un idioma");
    } else if (inputs.duration === 0) {
      toast.error("Debes especificar la duración de la conferencia.");
    } else if (inputs.start === "") {
      toast.error("Debes especificar la fecha de la conferencia.");
    } else if (inputs.password === "") {
      toast.error("Debes especificar una contraseña.");
    } else if (inputs.whatYouWillLearn.length === 0) {
      toast.error("Debes especificar qué aprenderás con la conferencia.");
    } else if (inputs.requirements.length === 0) {
      toast.error(`Debes ingresar al menos 1 requerimiento`);
    } else if (inputs.whoIsThisCourseFor.length === 0) {
      toast.error("Debes especificar para quién es la conferencia.");
    } else if (inputs.categoria.length === null) {
      toast.error("Debes seleccionar una categoría.");
    } else if (inputs.precio < 5) {
      toast.error("El precio de la conferencia no puede ser inferior a 5$");
    } else if (file === null) {
      toast.error("Falta una imagen de la conferencia.");
    } else {
      setOngoingUpdate(true);

      createConference();
    }
  };

  return (
    <div className="instructor-course-info">
      <div className="section">
        <h2>Lo basico</h2>

        <>
          <h3>Título de la conferencia</h3>
          <DynamicInput
            id={"name"}
            state={[inputs, setInputs]}
            noIcon
            placeholder={"Cómo..."}
          />
          <p className="hint">
            Elija un título único que lo distinga de otras conferencias
          </p>
        </>

        <>
          <h3>Breve descripción de la conferencia</h3>
          <DynamicInput
            id={"shortDescription"}
            state={[inputs, setInputs]}
            multiline
            noIcon
            placeholder={"Larga historia corta..."}
          />
          <p className="hint">
            Una descripción que describe rápidamente de qué se trata la
            conferencia.
          </p>
        </>

        <>
          <h3>Descripción de la conferencia</h3>
          <DynamicInput
            id={"descripcion"}
            state={[inputs, setInputs]}
            noIcon
            multiline
            placeholder={"Érase una vez..."}
          />
          <p className="hint">Una descripción completa de la conferencia.</p>
        </>

        <>
          <h3>Idioma del curso</h3>
          <FormControl fullWidth>
            <Select
              value={inputs.idioma}
              style={{
                borderRadius: "50px",
                fontFamily: "Inter",
                fontSize: "0.875rem",
                height: "2.5rem",
              }}
              onChange={(e) => {
                setInputs((c) => {
                  return { ...c, idioma: e.target.value };
                });
              }}
              elevation={0}
              inputProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      boxShadow: "0 0 8px #0f0e0e20",
                      borderRadius: "1rem",
                    },
                  },
                },
              }}
            >
              <MenuItem value={"Español"}>Español</MenuItem>
              <MenuItem value={"Português"}>Portugués</MenuItem>
              <MenuItem value={"English"}>Inglés</MenuItem>
            </Select>
          </FormControl>
          <p className="hint">El idioma hablado de su conferencia.</p>
        </>

        {/* <>
          <h3>Certificado</h3>
          <FormControl fullWidth>
            <Select
              value={inputs.certificado}
              style={{
                borderRadius: "50px",
                fontFamily: "Inter",
                fontSize: "0.875rem",
                height: "2.5rem",
              }}
              onChange={(e) => {
                setInputs((c) => {
                  return { ...c, certificado: e.target.value };
                });
              }}
              elevation={0}
              inputProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      boxShadow: "0 0 8px #0f0e0e20",
                      borderRadius: "1rem",
                    },
                  },
                },
              }}
            >
              <MenuItem value={true}>Sí</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
          <p className="hint">
            ¿Debería la conferencia emitir un certificado al finalizar?
          </p>
        </> */}
      </div>

      <div className="section">
        <h2>Información específica</h2>

        <>
          <h3>Duración</h3>
          <DynamicInput
            id={"duration"}
            state={[inputs, setInputs]}
            type="number"
            number
          />
          <p className="hint">La duración en minutos de su conferencia.</p>
        </>

        <>
          <h3>Inicio</h3>
          <DynamicInput
            id={"start"}
            state={[inputs, setInputs]}
            type="date"
            min
          />
          <p className="hint">La fecha en la que empezara su conferencia.</p>
        </>

        <>
          <h3>Contraseña</h3>
          <DynamicInput id={"password"} state={[inputs, setInputs]} noIcon />
          <p className="hint">
            La contraseña con la que sus estudiantes podrán acceder a la
            conferencia.
          </p>
        </>

        <>
          <h3>Lo que vas a aprender</h3>
          <div className="list-items">
            {inputs.whatYouWillLearn !== null &&
            inputs.whatYouWillLearn.length > 0 ? (
              JSON.parse(inputs.whatYouWillLearn).map((text, index) => {
                return (
                  <ListItem
                    key={index}
                    objectKey={"whatYouWillLearn"}
                    deleteFromInputs={deleteTextFromTextArray}
                  >
                    {text}
                  </ListItem>
                );
              })
            ) : (
              <p className="no-items">Añadir algo</p>
            )}
          </div>
          <div className="aggregator">
            <DynamicInput
              id={"whatYouWillLearn"}
              state={[internalInputs, setInternalInputs]}
              noIcon
              placeholder={"Aprenderás..."}
            />
            <p className="hint">
              Dígale a su audiencia lo que aprenderán después de completar esta
              conferencia.
            </p>
            <button
              className="action-button"
              disabled={
                internalInputs.whatYouWillLearn.length === 0 ||
                alreadyExists(
                  "whatYouWillLearn",
                  internalInputs.whatYouWillLearn
                )
              }
              onClick={() => {
                addTextToATextArray("whatYouWillLearn");
              }}
            >
              Agregar
            </button>
          </div>
        </>

        <>
          <h3>Requerimientos</h3>
          <div className="list-items">
            {inputs.requirements !== null && inputs.requirements.length > 0 ? (
              JSON.parse(inputs.requirements).map((text, index) => {
                return (
                  <ListItem
                    key={index}
                    objectKey={"requirements"}
                    deleteFromInputs={deleteTextFromTextArray}
                  >
                    {text}
                  </ListItem>
                );
              })
            ) : (
              <p className="no-items">Añadir algo</p>
            )}
          </div>
          <div className="aggregator">
            <DynamicInput
              id={"requirements"}
              state={[internalInputs, setInternalInputs]}
              noIcon
              placeholder={"Necesitará..."}
            />
            <p className="hint">
              Dígale a su audiencia qué experiencia o requisitos necesitan para
              completar esta conferencia.
            </p>
            <button
              className="action-button"
              disabled={
                internalInputs.requirements.length === 0 ||
                alreadyExists("requirements", internalInputs.requirements)
              }
              onClick={() => {
                addTextToATextArray("requirements");
              }}
            >
              Agregar
            </button>
          </div>
        </>

        <>
          <h3>Para quién es este curso</h3>
          <div className="list-items">
            {inputs.whoIsThisCourseFor !== null &&
            inputs.whoIsThisCourseFor.length > 0 ? (
              JSON.parse(inputs.whoIsThisCourseFor).map((text, index) => {
                return (
                  <ListItem
                    key={index}
                    objectKey={"whoIsThisCourseFor"}
                    deleteFromInputs={deleteTextFromTextArray}
                  >
                    {text}
                  </ListItem>
                );
              })
            ) : (
              <p className="no-items">Añadir algo</p>
            )}
          </div>
          <div className="aggregator">
            <DynamicInput
              id={"whoIsThisCourseFor"}
              state={[internalInputs, setInternalInputs]}
              noIcon
              placeholder={"Para todos..."}
            />
            <p className="hint">¿Quién puede utilizar su conferencia?</p>
            <button
              className="action-button"
              disabled={
                internalInputs.whoIsThisCourseFor.length === 0 ||
                alreadyExists(
                  "whoIsThisCourseFor",
                  internalInputs.whoIsThisCourseFor
                )
              }
              onClick={() => {
                addTextToATextArray("whoIsThisCourseFor");
              }}
            >
              Agregar
            </button>
          </div>
        </>

        <>
          <h3>Categorías</h3>

          {categories ? (
            <>
              <div className="categories">
                {categories.map((cat) => {
                  return (
                    <button
                      key={cat.id}
                      className={`cat ${
                        inputs.categoria === cat.id ? "selected" : ""
                      }`}
                      onClick={() => {
                        toggleCategory(cat.id);
                      }}
                    >
                      {cat.attributes.nombre}
                    </button>
                  );
                })}
              </div>
              <p className="hint">
                Selecciona la categoría que mejor defina el contenido de tu
                conferencia
              </p>
            </>
          ) : (
            <SpinnerOfDoom standalone />
          )}
        </>
      </div>

      <div className="section">
        <h2>El precio</h2>

        <>
          <div className="price-section">
            <DynamicInput
              id={"precio"}
              type="number"
              state={[inputs, setInputs]}
              noIcon
              price
              label={"El precio para el público"}
            />
            <DynamicInput
              id={"fee"}
              state={[fees, setFees]}
              noIcon
              price
              disabled
              label={`Nuestra tarifa de servicio (${feePercentage}%)`}
            />
            <DynamicInput
              id={"net"}
              state={[fees, setFees]}
              noIcon
              price
              disabled
              label={"Tus ganancias netas"}
            />
          </div>
          <p className="hint">
            Sus ganancias netas son las ganancias que obtendrá después de cada
            venta de esta conferencia
          </p>
        </>
      </div>

      <div className="section">
        <div className="media-creation">
          <h2>Imagen de la conferencia</h2>

          <input
            type="file"
            id="media"
            onChange={handleFileChange}
            ref={inputFile}
            accept="image/png, image/gif, image/jpeg"
          />

          <div className="media" onClick={openFileSelection}>
            {preview ? <FancyImage src={preview} /> : <ImageOutline />}
          </div>

          <button className="action-button" onClick={openFileSelection}>
            {!preview ? "Añadir imagen" : "Cambiar imagen"}
            <ImageOutline />
          </button>
        </div>
      </div>

      <div className="section action">
        <h2>Guardar cambios</h2>

        <button
          className="action-button final"
          onClick={() => {
            checkEverything();
          }}
          disabled={ongoingUpdate}
        >
          {ongoingUpdate ? (
            uploadingFile ? (
              <>
                <SpinnerOfDoom />
                Subiendo imagen...
              </>
            ) : (
              <>
                <SpinnerOfDoom />
                Guardando...
              </>
            )
          ) : (
            "Guardar"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateConferenceInfo;
