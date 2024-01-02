import React, { useContext, useEffect, useRef, useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "../CreateCourse/InstructorCourseInfo.scss";
import "./EditCoursePage.scss";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import FancyImage from "../../../../components/FancyImage/FancyImage";
import ListItem from "../CreateCourse/ListItem";
import { postUserProfileImage } from "../../../../api/postUserProfileImage";
import { getLessonsByCourseID } from "../../../../api/getLessonsByCourseID";
import { CategoriesContext } from "../../../../contexts/CategoriesContext";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";
import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";
import { deleteCourse } from "../../../../api/deleteCourse";
import { ImageOutline } from "../../../../assets/icons";
import { putCourse } from "../../../../api/putCourse";

const feePercentage = 5;

const TabCourse = ({ courseID, courseInfo, conference }) => {
  const { dictionary, language } = useContext(DictionaryContext);
  const { categories } = useContext(CategoriesContext);
  const navigate = useNavigate();

  // ------------ Manage course information

  const [inputs, setInputs] = useState({
    name: "",
    shortDescription: "",
    descripcion: "",
    idioma: "",
    subTitles: [],
    whatYouWillLearn: "",
    requirements: "",
    whoIsThisCourseFor: "",
    categoria: "",
    precio: "",
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
  const [savedImageID, setSavedImageID] = useState(null);

  // Update local info
  useEffect(() => {
    if (courseInfo) {
      let cat = courseInfo.categoria.data;

      setInputs({
        name: courseInfo.name ? courseInfo.name : "",
        shortDescription: courseInfo.shortDescription ? courseInfo.shortDescription : "",
        descripcion: courseInfo.descripcion ? courseInfo.descripcion : "",
        idioma: courseInfo.idioma ? courseInfo.idioma : "",
        subTitles: courseInfo.subTitles ? courseInfo.subTitles.map((obj) => obj.text) : [],
        whatYouWillLearn: courseInfo.whatYouWillLearn ? courseInfo.whatYouWillLearn.map((obj) => obj.text) : "",
        requirements: courseInfo.requeriments ? courseInfo.requeriments.map((obj) => obj.text) : "",
        whoIsThisCourseFor: courseInfo.whoIsThisCourseFor ? courseInfo.whoIsThisCourseFor.map((obj) => obj.text) : "",
        categoria: cat ? cat.id : null,
        precio: courseInfo.precio ? courseInfo.precio : "",
        status: courseInfo.status ? courseInfo.status : "draft",
        certificado: courseInfo.certificado ? courseInfo.certificado : false,
      });

      if (courseInfo.imagen.data) {
        setSavedImageID(courseInfo.imagen.data[0].id);
        setPreview(getImageLinkFrom(courseInfo.imagen.data[0].attributes.url));
      }
    }
  }, [courseInfo]);

  // Calculate fees
  useEffect(() => {
    if (inputs.price !== 0) {
      let price = inputs.precio;
      let result = ((feePercentage / 100) * Number(price)).toFixed(2);

      setFees({ fee: result, net: (price - result).toFixed(2) });
    }
  }, [inputs]);

  const deleteTextFromTextArray = (objectKey, text) => {
    let filteredArray = inputs[objectKey].filter((el) => el !== text);

    let value = null;

    if (filteredArray.length === 0) {
      value = "";
    } else {
      value = filteredArray;
    }

    setInputs((c) => {
      return { ...c, [objectKey]: value };
    });
  };

  const alreadyExists = (objectKey, text) => {
    if (inputs[objectKey] !== null && inputs[objectKey].length > 0) {
      let array = inputs[objectKey];

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
        newArray = inputs[objectKey];

        if (!alreadyExists(objectKey, text)) {
          newArray.push(text);
        }
      } else {
        newArray.push(text);
      }

      setInputs((c) => {
        return { ...c, [objectKey]: newArray };
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

  // ------------ Update course

  const [uploadingFile, setUploadingFile] = useState(false);
  const [ongoingUpdate, setOngoingUpdate] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const updateCourse = async (revision) => {
    const obj = {
      data: {
        name: inputs.name,
        shortDescription: inputs.shortDescription,
        descripcion: inputs.descripcion,
        idioma: inputs.idioma,
        subTitles: inputs.subTitles,
        whatYouWillLearn: inputs.whatYouWillLearn,
        requeriments: inputs.requirements,
        whoIsThisCourseFor: inputs.whoIsThisCourseFor,
        categoria: inputs.categoria,
        precio: inputs.precio,
        certificado: inputs.certificado,
        status: "draft",
      },
    };

    const { ok, data } = await putCourse(courseID, obj);

    if (ok) {
      if (!revision) {
        toast.success(`La información ${conference ? "de la conferencia" : "del curso"} ha sido actualizada.`);
      }

      setOngoingUpdate(false);

      if (revision) {
        setRequesting(true);
        checkLessons();
      }
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  const uploadFile = async (revision) => {
    setUploadingFile(true);

    const formData = new FormData();

    formData.append("ref", "api::curso.curso");
    formData.append("refId", courseID);
    formData.append("field", "imagen");
    formData.append("files", file, file.name);

    const { ok, data } = await postUserProfileImage(formData, savedImageID ? savedImageID : null);

    setUploadingFile(false);

    if (ok) {
      toast.success(`La imagen ${conference ? "de la conferencia" : "del curso"}  ha sido cargada.`);
      setFile(null);

      updateCourse(revision);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  const checkEverything = (revision) => {
    if (inputs.name.length < 3) {
      toast.error(
        `El nombre ${
          conference ? "de la conferencia" : "del curso"
        }  no puede estar vacío y debe tener al menos 3 letras`
      );
    } else if (inputs.shortDescription === "") {
      toast.error("Introduzca una breve descripción");
    } else if (inputs.descripcion === "") {
      toast.error("Introduce una descripción");
    } else if (inputs.idioma === "") {
      toast.error("Selecciona un idioma");
    } else if (inputs.whatYouWillLearn.length === 0) {
      toast.error(`Debes especificar qué aprenderás con ${conference ? "la conferencia" : "el curso"}`);
    } else if (inputs.requirements.length === 0) {
      toast.error(`Debes ingresar al menos 1 requerimiento`);
    } else if (inputs.whoIsThisCourseFor.length === 0) {
      toast.error(`Debes especificar para quién es ${conference ? "la conferencia" : "el curso"}`);
    } else if (inputs.categoria.length === null) {
      toast.error("Debes seleccionar una categoría");
    } else if (inputs.precio < 5) {
      toast.error(`El precio ${conference ? "de la conferencia" : "del curso"} no puede ser inferior a 5$`);
    } else if (preview === null) {
      toast.error("Falta una imagen");
    } else {
      setOngoingUpdate(true);

      if (file) {
        uploadFile(revision);
      } else {
        updateCourse(revision);
      }
    }
  };

  const eraseCourse = async () => {
    setDeleting(true);

    const { ok, data } = await deleteCourse(courseID);

    if (ok) {
      toast.success(`Se ha sido eliminado ${conference ? "la conferencia" : "el curso"}.`);

      navigate("/my-courses");
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  // ------------ Publish course

  const [requesting, setRequesting] = useState(false);
  const [published, setPublished] = useState(false);

  const checkLessons = () => {
    const updateCourseStatus = async () => {
      const obj = {
        data: {
          status: "published",
        },
      };

      const { ok, data } = await putCourse(courseID, obj);

      if (ok) {
        toast.success(`Se ha publicado ${conference ? "la conferencia" : "el curso"}.`);
        setPublished(true);
        setRequesting(false);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    const getLessons = async () => {
      const { ok, data } = await getLessonsByCourseID(courseID);

      if (ok) {
        // console.log("getLessons", data.data);
        const lessons = data.data;
        console.log(lessons);

        if (lessons.length > 0) {
          const error = lessons.filter((lesson) => lesson.attributes.clase.data === null);

          if (error.length === 0) {
            updateCourseStatus();
          } else {
            console.log(error);
            toast.error("Una de las lecciones del curso no tiene vídeo.");
            setRequesting(false);
          }
        } else {
          toast.error("El curso debe tener al menos una lección.");
          setRequesting(false);
        }
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    if (conference) {
      updateCourseStatus();
    } else {
      getLessons();
    }
  };

  return (
    <div className="instructor-course-info">
      <div className="section">
        <h2>Lo basico</h2>

        <>
          <h3>Título {conference ? "de la conferencia" : "del curso"}</h3>
          <DynamicInput id={"name"} state={[inputs, setInputs]} noIcon placeholder={"Cómo..."} />
          <p className="hint">
            Elija un título único que lo distinga de {conference ? "otras conferencias" : "otros cursos"}
          </p>
        </>

        <>
          <h3>Breve descripción {conference ? "de la conferencia" : "del curso"}</h3>
          <DynamicInput
            id={"shortDescription"}
            state={[inputs, setInputs]}
            multiline
            noIcon
            placeholder={"Larga historia corta..."}
          />
          <p className="hint">
            Una descripción que describe rápidamente de qué se trata {conference ? "la conferencia" : "el curso"}.
          </p>
        </>

        <>
          <h3>Descripción {conference ? "de la conferencia" : "del curso"}</h3>
          <DynamicInput
            id={"descripcion"}
            state={[inputs, setInputs]}
            noIcon
            multiline
            placeholder={"Once upon a time..."}
          />
          <p className="hint">Una descripción completa {conference ? "de la conferencia" : "del curso"}.</p>
        </>

        <>
          <h3>Idioma {conference ? "de la conferencia" : "del curso"}</h3>
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
          <p className="hint">El idioma hablado de {conference ? "la conferencia" : "las lecciones de tu curso"}.</p>
        </>

        {/* //------------- */}
        <>
          <h3>{dictionary.privateInstructor.createCourseInfo[53][language]}</h3>
          <FormControl fullWidth>
            <Select
              value={inputs.subTitles}
              style={{
                borderRadius: "50px",
                fontFamily: "Inter",
                fontSize: "0.875rem",
                height: "2.5rem",
              }}
              multiple
              onChange={(e) => {
                setInputs((c) => {
                  return { ...c, subTitles: e.target.value };
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
              <MenuItem value={"ES"}>Español</MenuItem>
              <MenuItem value={"PT"}>Português</MenuItem>
              <MenuItem value={"EN"}>English</MenuItem>
            </Select>
          </FormControl>
          <p className="hint">{dictionary.privateInstructor.createCourseInfo[54][language]}</p>
        </>

        {!conference && (
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
            <p className="hint">¿El curso debería emitir un certificado al finalizar?</p>
          </>
        )}
      </div>

      <div className="section">
        <h2>Información específica</h2>

        <>
          <h3>Lo que vas a aprender</h3>
          <div className="list-items">
            {inputs.whatYouWillLearn !== null && inputs.whatYouWillLearn.length > 0 ? (
              inputs.whatYouWillLearn.map((text, index) => {
                return (
                  <ListItem key={index} objectKey={"whatYouWillLearn"} deleteFromInputs={deleteTextFromTextArray}>
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
              {conference ? "esta conferencia" : "este curso"}.
            </p>
            <button
              className="action-button"
              disabled={
                internalInputs.whatYouWillLearn.length === 0 ||
                alreadyExists("whatYouWillLearn", internalInputs.whatYouWillLearn)
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
              inputs.requirements.map((text, index) => {
                return (
                  <ListItem key={index} objectKey={"requirements"} deleteFromInputs={deleteTextFromTextArray}>
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
              Dile a tu audiencia qué experiencia o requisitos necesitan para completar{" "}
              {conference ? "esta conferencia" : "este curso"}.
            </p>
            <button
              className="action-button"
              disabled={
                internalInputs.requirements.length === 0 || alreadyExists("requirements", internalInputs.requirements)
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
            {inputs.whoIsThisCourseFor !== null && inputs.whoIsThisCourseFor.length > 0 ? (
              inputs.whoIsThisCourseFor.map((text, index) => {
                return (
                  <ListItem key={index} objectKey={"whoIsThisCourseFor"} deleteFromInputs={deleteTextFromTextArray}>
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
            <p className="hint">¿Quién puede utilizar tu {conference ? "conferencia" : "curso"}?</p>
            <button
              className="action-button"
              disabled={
                internalInputs.whoIsThisCourseFor.length === 0 ||
                alreadyExists("whoIsThisCourseFor", internalInputs.whoIsThisCourseFor)
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
                      className={`cat ${inputs.categoria === cat.id ? "selected" : ""}`}
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
                {conference ? "conferencia" : "curso"}
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
            <DynamicInput id={"net"} state={[fees, setFees]} noIcon price disabled label={"Tus ganancias netas"} />
          </div>
          <p className="hint">
            Tus ganancias netas son las ganancias que obtendrás después de cada venta de{" "}
            {conference ? "esta conferencia" : "este curso"}.
          </p>
        </>
      </div>

      <div className="section">
        <div className="media-creation">
          <h2>Imagen {conference ? "de la conferencia" : "del curso"}</h2>

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
                Subiendo archivo...
              </>
            ) : (
              <>
                <SpinnerOfDoom />
                Salvando...
              </>
            )
          ) : (
            "Guardar"
          )}
        </button>

        {courseInfo && inputs.status === "draft" && !published && (
          <button
            className="action-button final request"
            onClick={() => {
              checkEverything(true);
            }}
            disabled={requesting}
          >
            {requesting ? (
              <>
                <SpinnerOfDoom />
                Comprobando {conference ? "la conferencia" : "el curso"}...
              </>
            ) : (
              "Publicar"
            )}
          </button>
        )}
      </div>

      <div className="section action">
        <h2>Eliminar (Acción No Reversible)</h2>

        <button className="action-button final red" onClick={eraseCourse} disabled={deleting}>
          {deleting ? (
            <>
              <SpinnerOfDoom />
              Eliminando...
            </>
          ) : (
            "Eliminar"
          )}
        </button>
      </div>
    </div>
  );
};

export default TabCourse;
