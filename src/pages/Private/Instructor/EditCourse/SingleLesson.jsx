import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import { postUserProfileImage } from "../../../../api/postUserProfileImage";
import { putLesson } from "../../../../api/putLesson";
import { ImageOutline, Videocam } from "../../../../assets/icons";

import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";
import LinkItem from "./LinkItem";

const SingleLesson = ({ id, index, attributes, deleteLesson }) => {
  // ------------ Manage lesson info
  const [inputs, setInputs] = useState({
    nombre: "",
    descripcion: "",
    duracion: "",
    additionalResources: null,
  });
  const [internalInputs, setInternalInputs] = useState({
    additionalResources: "",
  });
  const [moreIsOpen, setMoreIsOpen] = useState(false);

  const deleteTextFromTextArray = (objectKey, text) => {
    let filteredArray = JSON.parse(inputs[objectKey]).filter((el) => el !== text);

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

  // Update local info
  useEffect(() => {
    if (attributes) {
      setInputs((c) => ({
        ...c,
        nombre: attributes.nombre ? attributes.nombre : "",
        descripcion: attributes.descripcion ? attributes.descripcion : "",
        duracion: attributes.duracion ? attributes.duracion : "",
        additionalResources: attributes.additionalResources,
      }));

      if (attributes.clase.data) {
        setSavedMediaID(attributes.clase.data.id);
        setPreview(getImageLinkFrom(attributes.clase.data.attributes.url));
      }

      if (attributes.additionalResources) {
        setMoreIsOpen(true);
      }
    }
  }, [attributes]);

  // ------------ Manage lesson media

  const [preview, setPreview] = useState(null);
  const [savedMediaID, setSavedMediaID] = useState(null);
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

  // ------------ Update course

  const [uploadingFile, setUploadingFile] = useState(false);
  const [ongoingUpdate, setOngoingUpdate] = useState(false);

  const updateLesson = async () => {
    const obj = {
      data: {
        nombre: inputs.nombre,
        descripcion: inputs.descripcion,
        duracion: inputs.duracion,
        additionalResources: JSON.parse(inputs.additionalResources),
      },
    };

    // console.log(obj);
    // setOngoingUpdate(false);

    const { ok, data } = await putLesson(id, obj);

    if (ok) {
      toast.success("La información de la lección ha sido actualizada.");

      setOngoingUpdate(false);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  const uploadFile = async () => {
    setUploadingFile(true);

    const formData = new FormData();

    formData.append("ref", "api::clase.clase");
    formData.append("refId", id);
    formData.append("field", "clase");
    formData.append("files", file, file.name);

    const { ok, data } = await postUserProfileImage(formData, savedMediaID ? savedMediaID : null);

    setUploadingFile(false);

    if (ok) {
      toast.success("Se han subido los medios de la lección.");
      setFile(null);

      updateLesson();
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  const checkEverything = () => {
    if (inputs.nombre.length < 3) {
      toast.error(`El nombre de la lección Nº${index + 1} no puede estar vacío y debe tener al menos 3 letras`);
    } else if (inputs.descripcion === "") {
      toast.error(`Falta descripción en la lección: ${inputs.nombre}`);
    } else if (preview === null) {
      toast.error(`Falta el video de la lección para: ${inputs.nombre}`);
    } else {
      setOngoingUpdate(true);

      if (file) {
        uploadFile();
      } else {
        updateLesson();
      }
    }
  };

  return (
    <div className="lesson-aggregator">
      <strong>Lección Nº{index + 1}</strong>

      <button
        className="action-button"
        onClick={() => {
          deleteLesson(id);
        }}
      >
        Eliminar lección
      </button>

      <div className="inner-container">
        <div className="basic-stuff">
          <DynamicInput id={"nombre"} state={[inputs, setInputs]} label="Título" noIcon />
          <DynamicInput id={"descripcion"} state={[inputs, setInputs]} label="Descripción" multiline noIcon />
        </div>

        <div className="additional-resources">
          {moreIsOpen ? (
            <>
              <h3>Recursos adicionales</h3>
              <div className="links">
                {inputs.additionalResources !== null && inputs.additionalResources.length > 0 ? (
                  JSON.parse(inputs.additionalResources).map((text, index) => {
                    return (
                      <LinkItem
                        key={index}
                        index={index}
                        text={text}
                        objectKey={"additionalResources"}
                        deleteFromInputs={deleteTextFromTextArray}
                      />
                    );
                  })
                ) : (
                  <p className="no-items">Añadir algo</p>
                )}
              </div>

              <DynamicInput
                id={"additionalResources"}
                state={[internalInputs, setInternalInputs]}
                label="Agregar recurso"
                noIcon
              />
              <button
                className="action-button"
                onClick={() => {
                  addTextToATextArray("additionalResources");
                }}
              >
                Agregar recurso
              </button>
            </>
          ) : (
            <button
              className="action-button"
              onClick={() => {
                setMoreIsOpen(true);
              }}
            >
              Agregar recursos adicionales
            </button>
          )}
        </div>

        <div className="media-creation">
          <h2>Medio de lección</h2>

          <input type="file" id="media" onChange={handleFileChange} ref={inputFile} accept="video/*" />

          <div className="media" onClick={openFileSelection}>
            {preview ? (
              <ReactPlayer
                url={preview}
                width={"100%"}
                height={"100%"}
                controls
                config={{
                  file: {
                    attributes: {
                      crossOrigin: "true",
                    },
                  },
                }}
              />
            ) : (
              <ImageOutline />
            )}
          </div>

          <button className="action-button" onClick={openFileSelection}>
            {!preview ? "Añadir medio" : "Cambiar medio"}
            <Videocam />
          </button>

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
                  Salvando...
                </>
              )
            ) : (
              "Salvar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleLesson;
