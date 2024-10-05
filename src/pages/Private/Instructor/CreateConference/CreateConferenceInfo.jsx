import React, { useContext, useEffect, useRef, useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "../CreateCourse/CreateCourseInfo";

import { ImageOutline } from "../../../../assets/icons";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import FancyImage from "../../../../components/FancyImage/FancyImage";
import ListItem from "../CreateCourse/ListItem";
import { postUserProfileImage } from "../../../../api/postUserProfileImage";
import { CategoriesContext } from "../../../../contexts/CategoriesContext";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";
import { postNewCourse } from "../../../../api/postNewCourse";
import { putCourse } from "../../../../api/putCourse";

const feePercentage = 10;

const CreateConferenceInfo = () => {
  const { dictionary, language } = useContext(DictionaryContext);
  const navigate = useNavigate();
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

  const publishConference = async (id) => {
    const obj = {
      data: {
        status: "published",
      },
    };

    const { ok, data } = await putCourse(id, obj);

    if (ok) {
      toast.success(dictionary.privateInstructor.createConference[0][language]);
      navigate("/my-courses");
    } else {
      toast.error(`${data.error.message}`);
    }

    setOngoingUpdate(false);
  };

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
      toast.success(dictionary.privateInstructor.createConference[1][language]);
      setFile(null);
      publishConference(newID);
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
        requeriments: JSON.parse(inputs.requirements),
        whoIsThisCourseFor: JSON.parse(inputs.whoIsThisCourseFor),
        categoria: inputs.categoria,
        precio: inputs.precio,
        certificado: false,
        duracion: inputs.duration,
        status: "draft",
        tipo: "conferencia",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        password: inputs.password,
        start: inputs.start + ":00Z",
      },
    };

    const { ok, data } = await postNewCourse(obj);

    if (ok) {
      const newID = data.data.id;
      toast.success(dictionary.privateInstructor.createConference[2][language]);
      uploadFile(newID);
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  const validPassword = (pass) => {
    const regex = /^[a-zA-Z0-9@\-_.]{1,10}$/;
    return regex.test(pass);
  };

  const checkEverything = () => {
    if (inputs.name.length < 3) {
      toast.error(dictionary.privateInstructor.createConference[3][language]);
    } else if (inputs.shortDescription === "") {
      toast.error(dictionary.privateInstructor.createConference[4][language]);
    } else if (inputs.descripcion === "") {
      toast.error(dictionary.privateInstructor.createConference[5][language]);
    } else if (inputs.idioma === "") {
      toast.error(dictionary.privateInstructor.createConference[6][language]);
    } else if (inputs.duration === 0) {
      toast.error(dictionary.privateInstructor.createConference[7][language]);
    } else if (inputs.start === "") {
      toast.error(dictionary.privateInstructor.createConference[8][language]);
    } else if (inputs.password === "") {
      toast.error(dictionary.privateInstructor.createConference[9][language]);
    } else if (!validPassword(inputs.password)) {
      toast.error(dictionary.privateInstructor.createConference[64][language]);
    } else if (inputs.whatYouWillLearn.length === 0) {
      toast.error(dictionary.privateInstructor.createConference[10][language]);
    } else if (inputs.requirements.length === 0) {
      toast.error(dictionary.privateInstructor.createConference[11][language]);
    } else if (inputs.whoIsThisCourseFor.length === 0) {
      toast.error(dictionary.privateInstructor.createConference[12][language]);
    } else if (inputs.categoria.length === null) {
      toast.error(dictionary.privateInstructor.createConference[13][language]);
    } else if (inputs.precio < 5) {
      toast.error(dictionary.privateInstructor.createConference[14][language]);
    } else if (file === null) {
      toast.error(dictionary.privateInstructor.createConference[15][language]);
    } else {
      setOngoingUpdate(true);

      createConference();
    }
  };

  return (
    <div className="instructor-course-info">
      <div className="section">
        <h2>{dictionary.privateInstructor.createConference[16][language]}</h2>

        <>
          <h3>{dictionary.privateInstructor.createConference[17][language]}</h3>
          <DynamicInput
            id={"name"}
            state={[inputs, setInputs]}
            noIcon
            placeholder={dictionary.privateInstructor.createConference[18][language]}
          />
          <p className="hint">{dictionary.privateInstructor.createConference[19][language]}</p>
        </>

        <>
          <h3>{dictionary.privateInstructor.createConference[20][language]}</h3>
          <DynamicInput
            id={"shortDescription"}
            state={[inputs, setInputs]}
            multiline
            noIcon
            placeholder={dictionary.privateInstructor.createConference[21][language]}
          />
          <p className="hint">{dictionary.privateInstructor.createConference[22][language]}</p>
        </>

        <>
          <h3>{dictionary.privateInstructor.createConference[23][language]}</h3>
          <DynamicInput
            id={"descripcion"}
            state={[inputs, setInputs]}
            noIcon
            multiline
            placeholder={dictionary.privateInstructor.createConference[24][language]}
          />
          <p className="hint">{dictionary.privateInstructor.createConference[25][language]}</p>
        </>

        <>
          <h3>{dictionary.privateInstructor.createConference[26][language]}</h3>
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
              <MenuItem value={"Español"}>{dictionary.privateInstructor.createConference[27][language]}</MenuItem>
              <MenuItem value={"Português"}>{dictionary.privateInstructor.createConference[28][language]}</MenuItem>
              <MenuItem value={"English"}>{dictionary.privateInstructor.createConference[29][language]}</MenuItem>
            </Select>
          </FormControl>
          <p className="hint">{dictionary.privateInstructor.createConference[30][language]}</p>
        </>
      </div>

      <div className="section">
        <h2>{dictionary.privateInstructor.createConference[31][language]}</h2>

        <>
          <h3>{dictionary.privateInstructor.createConference[32][language]}</h3>
          <DynamicInput id={"duration"} state={[inputs, setInputs]} type="number" number />
          <p className="hint">{dictionary.privateInstructor.createConference[33][language]}</p>
        </>

        <>
          <h3>{dictionary.privateInstructor.createConference[34][language]}</h3>
          <DynamicInput id={"start"} state={[inputs, setInputs]} type="datetime-local" min />
          <p className="hint">{dictionary.privateInstructor.createConference[35][language]}</p>
        </>

        <>
          <h3>{dictionary.privateInstructor.createConference[36][language]}</h3>
          <DynamicInput id={"password"} state={[inputs, setInputs]} noIcon />
          <p className="hint">{dictionary.privateInstructor.createConference[37][language]}</p>
        </>

        <>
          <h3>{dictionary.privateInstructor.createConference[38][language]}</h3>
          <div className="list-items">
            {inputs.whatYouWillLearn !== null && inputs.whatYouWillLearn.length > 0 ? (
              JSON.parse(inputs.whatYouWillLearn).map((text, index) => {
                return (
                  <ListItem key={index} objectKey={"whatYouWillLearn"} deleteFromInputs={deleteTextFromTextArray}>
                    {text}
                  </ListItem>
                );
              })
            ) : (
              <p className="no-items">{dictionary.privateInstructor.createConference[39][language]}</p>
            )}
          </div>
          <div className="aggregator">
            <DynamicInput
              id={"whatYouWillLearn"}
              state={[internalInputs, setInternalInputs]}
              noIcon
              placeholder={dictionary.privateInstructor.createConference[40][language]}
            />
            <p className="hint">{dictionary.privateInstructor.createConference[41][language]}</p>
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
              {dictionary.privateInstructor.createConference[42][language]}
            </button>
          </div>
        </>

        <>
          <h3>{dictionary.privateInstructor.createConference[43][language]}</h3>
          <div className="list-items">
            {inputs.requirements !== null && inputs.requirements.length > 0 ? (
              JSON.parse(inputs.requirements).map((text, index) => {
                return (
                  <ListItem key={index} objectKey={"requirements"} deleteFromInputs={deleteTextFromTextArray}>
                    {text}
                  </ListItem>
                );
              })
            ) : (
              <p className="no-items">{dictionary.privateInstructor.createConference[39][language]}</p>
            )}
          </div>
          <div className="aggregator">
            <DynamicInput
              id={"requirements"}
              state={[internalInputs, setInternalInputs]}
              noIcon
              placeholder={dictionary.privateInstructor.createConference[44][language]}
            />
            <p className="hint">{dictionary.privateInstructor.createConference[45][language]}</p>
            <button
              className="action-button"
              disabled={
                internalInputs.requirements.length === 0 || alreadyExists("requirements", internalInputs.requirements)
              }
              onClick={() => {
                addTextToATextArray("requirements");
              }}
            >
              {dictionary.privateInstructor.createConference[42][language]}
            </button>
          </div>
        </>

        <>
          <h3>{dictionary.privateInstructor.createConference[46][language]}</h3>
          <div className="list-items">
            {inputs.whoIsThisCourseFor !== null && inputs.whoIsThisCourseFor.length > 0 ? (
              JSON.parse(inputs.whoIsThisCourseFor).map((text, index) => {
                return (
                  <ListItem key={index} objectKey={"whoIsThisCourseFor"} deleteFromInputs={deleteTextFromTextArray}>
                    {text}
                  </ListItem>
                );
              })
            ) : (
              <p className="no-items">{dictionary.privateInstructor.createConference[39][language]}</p>
            )}
          </div>
          <div className="aggregator">
            <DynamicInput
              id={"whoIsThisCourseFor"}
              state={[internalInputs, setInternalInputs]}
              noIcon
              placeholder={dictionary.privateInstructor.createConference[47][language]}
            />
            <p className="hint">{dictionary.privateInstructor.createConference[48][language]}</p>
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
              {dictionary.privateInstructor.createConference[42][language]}
            </button>
          </div>
        </>

        <>
          <h3>{dictionary.privateInstructor.createConference[49][language]}</h3>

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
                      {language === 'es' ? cat.attributes.nombre : cat.attributes.descripcion}
                    </button>
                  );
                })}
              </div>
              <p className="hint">{dictionary.privateInstructor.createConference[50][language]}</p>
            </>
          ) : (
            <SpinnerOfDoom standalone />
          )}
        </>
      </div>

      <div className="section">
        <h2>{dictionary.privateInstructor.createConference[51][language]}</h2>

        <>
          <div className="price-section">
            <DynamicInput
              id={"precio"}
              type="number"
              state={[inputs, setInputs]}
              noIcon
              price
              label={dictionary.privateInstructor.createConference[52][language]}
            />
            <DynamicInput
              id={"fee"}
              state={[fees, setFees]}
              noIcon
              price
              disabled
              label={`${dictionary.privateInstructor.createConference[53][language]} (${feePercentage}%)`}
            />
            <DynamicInput
              id={"net"}
              state={[fees, setFees]}
              noIcon
              price
              disabled
              label={dictionary.privateInstructor.createConference[54][language]}
            />
          </div>
          <p className="hint">{dictionary.privateInstructor.createConference[55][language]}</p>
        </>
      </div>

      <div className="section">
        <div className="media-creation">
          <h2>{dictionary.privateInstructor.createConference[56][language]}</h2>

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
            {!preview
              ? dictionary.privateInstructor.createConference[57][language]
              : dictionary.privateInstructor.createConference[58][language]}
            <ImageOutline />
          </button>
        </div>
      </div>

      <div className="section action">
        <h2>{dictionary.privateInstructor.createConference[59][language]}</h2>

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
                {dictionary.privateInstructor.createConference[60][language]}
              </>
            ) : (
              <>
                <SpinnerOfDoom />
                {dictionary.privateInstructor.createConference[61][language]}
              </>
            )
          ) : (
            dictionary.privateInstructor.createConference[62][language]
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateConferenceInfo;
