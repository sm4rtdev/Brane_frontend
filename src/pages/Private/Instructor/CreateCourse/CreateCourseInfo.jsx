import React, { useContext, useEffect, useRef, useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { toast } from "react-toastify";

import "./InstructorCourseInfo.scss";

import { ImageOutline } from "../../../../assets/icons";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import FancyImage from "../../../../components/FancyImage/FancyImage";
import ListItem from "./ListItem";
import { postUserProfileImage } from "../../../../api/postUserProfileImage";
import { CategoriesContext } from "../../../../contexts/CategoriesContext";
import { postNewCourse } from "../../../../api/postNewCourse";

const feePercentage = 5;

const CreateCourseInfo = ({ setOpenTab, setCourseID }) => {
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
    certificado: false,
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
      toast.success("La imagen del curso ha sido cargada.");
      setFile(null);
      setOpenTab(1);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  const createCourse = async () => {
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
        certificado: inputs.certificado,
        status: "draft",
      },
    };

    const { ok, data } = await postNewCourse(obj);

    if (ok) {
      const newID = data.data.id;
      toast.success("El curso ha sido creado.");
      setCourseID(newID);
      uploadFile(newID);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  const checkEverything = () => {
    if (inputs.name.length < 3) {
      toast.error(
        "El nombre del curso no puede estar vacío y debe tener al menos 3 letras"
      );
    } else if (inputs.shortDescription === "") {
      toast.error("Introduzca una breve descripción");
    } else if (inputs.descripcion === "") {
      toast.error("Introduce una descripción");
    } else if (inputs.idioma === "") {
      toast.error("Selecciona un idioma");
    } else if (inputs.whatYouWillLearn.length === 0) {
      toast.error("Debes especificar qué aprenderás con el curso");
    } else if (inputs.requirements.length === 0) {
      toast.error(`Debes ingresar al menos 1 requerimiento`);
    } else if (inputs.whoIsThisCourseFor.length === 0) {
      toast.error("Debes especificar para quién es el curso");
    } else if (inputs.categoria.length === null) {
      toast.error("Debes seleccionar una categoría");
    } else if (inputs.precio < 5) {
      toast.error("El precio del curso no puede ser inferior a 5$");
    } else if (file === null) {
      toast.error("Falta una imagen del curso");
    } else {
      setOngoingUpdate(true);

      createCourse();
    }
  };

  return (
    <div className="instructor-course-info">
      <div className="section">
        <h2>Lo basico</h2>

        <>
          <h3>Título del curso</h3>
          <DynamicInput
            id={"name"}
            state={[inputs, setInputs]}
            noIcon
            placeholder={"Cómo..."}
          />
          <p className="hint">
            Elija un título único que lo distinga de otros cursos
          </p>
        </>

        <>
          <h3>Breve descripción del curso.</h3>
          <DynamicInput
            id={"shortDescription"}
            state={[inputs, setInputs]}
            multiline
            noIcon
            placeholder={"Larga historia corta..."}
          />
          <p className="hint">
            Una descripción que describe rápidamente de qué se trata el curso.
          </p>
        </>

        <>
          <h3>Descripción del curso</h3>
          <DynamicInput
            id={"descripcion"}
            state={[inputs, setInputs]}
            noIcon
            multiline
            placeholder={"Érase una vez..."}
          />
          <p className="hint">Una descripción completa del curso.</p>
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
              <MenuItem value={"Português"}>Português</MenuItem>
              <MenuItem value={"English"}>English</MenuItem>
            </Select>
          </FormControl>
          <p className="hint">
            El idioma hablado de las lecciones de tu curso.
          </p>
        </>

        <>
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
            ¿El curso debería emitir un certificado al finalizar?
          </p>
        </>
      </div>

      <div className="section">
        <h2>Información específica</h2>

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
              Cuéntale a tu audiencia lo que aprenderán después de completar
              este curso.
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
              Añadir
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
              Dile a tu audiencia qué experiencia o requisitos necesitan para
              completar este curso.
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
              Añadir
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
              placeholder={"Una persona..."}
            />
            <p className="hint">¿Quién puede utilizar tu curso?</p>
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
              Añadir
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
                Selecciona la categoría que mejor define el contenido de tu
                curso
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
              label={"El precio para el público."}
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
            Tus ganancias netas son las ganancias que obtendrás después de cada
            venta de este curso.
          </p>
        </>
      </div>

      <div className="section">
        <div className="media-creation">
          <h2>Imagen del curso</h2>

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
        <h2>Salvar cambios</h2>

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
                Subiendo archivo...
              </>
            ) : (
              <>
                <SpinnerOfDoom />
                Guardando...
              </>
            )
          ) : (
            "Salvar"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateCourseInfo;
