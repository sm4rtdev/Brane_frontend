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
import { DictionaryContext } from "../../../../contexts/DictionaryContext";
import { postNewCourse } from "../../../../api/postNewCourse";

const feePercentage = 5;

const CreateCourseInfo = ({ setOpenTab, setCourseID }) => {
  const { dictionary, language } = useContext(DictionaryContext);
  const { categories } = useContext(CategoriesContext);

  // ------------ Manage course information

  const [inputs, setInputs] = useState({
    name: "",
    shortDescription: "",
    descripcion: "",
    idioma: "Español",
    subTitles: [],
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
      toast.success(dictionary.privateInstructor.createCourseInfo[0][language]);
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
        subTitles: inputs.subTitles,
        whatYouWillLearn: JSON.parse(inputs.whatYouWillLearn),
        requeriments: JSON.parse(inputs.requirements),
        whoIsThisCourseFor: JSON.parse(inputs.whoIsThisCourseFor),
        categoria: inputs.categoria,
        precio: inputs.precio,
        certificado: inputs.certificado,
        status: "draft",
      },
    };

    console.log(obj);

    const { ok, data } = await postNewCourse(obj);

    if (ok) {
      const newID = data.data.id;
      toast.success(dictionary.privateInstructor.createCourseInfo[1][language]);
      setCourseID(newID);
      uploadFile(newID);
    } else {
      toast.error(`${data.error.message}`);
      console.log(data.error);
      setOngoingUpdate(false);
    }
  };

  const checkEverything = () => {
    if (inputs.name.length < 3) {
      toast.error(dictionary.privateInstructor.createCourseInfo[2][language]);
    } else if (inputs.shortDescription === "") {
      toast.error(dictionary.privateInstructor.createCourseInfo[3][language]);
    } else if (inputs.descripcion === "") {
      toast.error(dictionary.privateInstructor.createCourseInfo[4][language]);
    } else if (inputs.idioma === "") {
      toast.error(dictionary.privateInstructor.createCourseInfo[5][language]);
    } else if (inputs.whatYouWillLearn.length === 0) {
      toast.error(dictionary.privateInstructor.createCourseInfo[6][language]);
    } else if (inputs.requirements.length === 0) {
      toast.error(dictionary.privateInstructor.createCourseInfo[7][language]);
    } else if (inputs.whoIsThisCourseFor.length === 0) {
      toast.error(dictionary.privateInstructor.createCourseInfo[8][language]);
    } else if (!inputs.categoria) {
      toast.error(dictionary.privateInstructor.createCourseInfo[9][language]);
    } else if (inputs.precio < 5) {
      toast.error(dictionary.privateInstructor.createCourseInfo[10][language]);
    } else if (file === null) {
      toast.error(dictionary.privateInstructor.createCourseInfo[11][language]);
    } else {
      setOngoingUpdate(true);

      createCourse();
    }
  };

  return (
    <div className="instructor-course-info">
      <div className="section">
        <h2>{dictionary.privateInstructor.createCourseInfo[12][language]}</h2>

        <>
          <h3>{dictionary.privateInstructor.createCourseInfo[13][language]}</h3>
          <DynamicInput
            id={"name"}
            state={[inputs, setInputs]}
            noIcon
            placeholder={dictionary.privateInstructor.createCourseInfo[14][language]}
          />
          <p className="hint">{dictionary.privateInstructor.createCourseInfo[15][language]}</p>
        </>

        <>
          <h3>{dictionary.privateInstructor.createCourseInfo[16][language]}</h3>
          <DynamicInput
            id={"shortDescription"}
            state={[inputs, setInputs]}
            multiline
            noIcon
            placeholder={dictionary.privateInstructor.createCourseInfo[17][language]}
          />
          <p className="hint">{dictionary.privateInstructor.createCourseInfo[18][language]}</p>
        </>

        <>
          <h3>{dictionary.privateInstructor.createCourseInfo[19][language]}</h3>
          <DynamicInput
            id={"descripcion"}
            state={[inputs, setInputs]}
            noIcon
            multiline
            placeholder={dictionary.privateInstructor.createCourseInfo[20][language]}
          />
          <p className="hint">{dictionary.privateInstructor.createCourseInfo[21][language]}</p>
        </>

        <>
          <h3>{dictionary.privateInstructor.createCourseInfo[22][language]}</h3>
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
          <p className="hint">{dictionary.privateInstructor.createCourseInfo[23][language]}</p>
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

        <>
          <h3>{dictionary.privateInstructor.createCourseInfo[24][language]}</h3>
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
              <MenuItem value={true}>{dictionary.privateInstructor.createCourseInfo[25][language]}</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
          <p className="hint">{dictionary.privateInstructor.createCourseInfo[26][language]}</p>
        </>
      </div>

      <div className="section">
        <h2>{dictionary.privateInstructor.createCourseInfo[27][language]}</h2>

        <>
          <h3>{dictionary.privateInstructor.createCourseInfo[28][language]}</h3>
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
              <p className="no-items">{dictionary.privateInstructor.createCourseInfo[29][language]}</p>
            )}
          </div>
          <div className="aggregator">
            <DynamicInput
              id={"whatYouWillLearn"}
              state={[internalInputs, setInternalInputs]}
              noIcon
              placeholder={dictionary.privateInstructor.createCourseInfo[30][language]}
            />
            <p className="hint">{dictionary.privateInstructor.createCourseInfo[31][language]}</p>
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
              {dictionary.privateInstructor.createCourseInfo[32][language]}
            </button>
          </div>
        </>

        <>
          <h3>{dictionary.privateInstructor.createCourseInfo[33][language]}</h3>
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
              <p className="no-items">{dictionary.privateInstructor.createCourseInfo[29][language]}</p>
            )}
          </div>
          <div className="aggregator">
            <DynamicInput
              id={"requirements"}
              state={[internalInputs, setInternalInputs]}
              noIcon
              placeholder={dictionary.privateInstructor.createCourseInfo[34][language]}
            />
            <p className="hint">{dictionary.privateInstructor.createCourseInfo[35][language]}</p>
            <button
              className="action-button"
              disabled={
                internalInputs.requirements.length === 0 || alreadyExists("requirements", internalInputs.requirements)
              }
              onClick={() => {
                addTextToATextArray("requirements");
              }}
            >
              {dictionary.privateInstructor.createCourseInfo[32][language]}
            </button>
          </div>
        </>

        <>
          <h3>{dictionary.privateInstructor.createCourseInfo[36][language]}</h3>
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
              <p className="no-items">{dictionary.privateInstructor.createCourseInfo[29][language]}</p>
            )}
          </div>
          <div className="aggregator">
            <DynamicInput
              id={"whoIsThisCourseFor"}
              state={[internalInputs, setInternalInputs]}
              noIcon
              placeholder={dictionary.privateInstructor.createCourseInfo[37][language]}
            />
            <p className="hint">{dictionary.privateInstructor.createCourseInfo[38][language]}</p>
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
              {dictionary.privateInstructor.createCourseInfo[32][language]}
            </button>
          </div>
        </>

        <>
          <h3>{dictionary.privateInstructor.createCourseInfo[39][language]}</h3>

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
              <p className="hint">{dictionary.privateInstructor.createCourseInfo[40][language]}</p>
            </>
          ) : (
            <SpinnerOfDoom standalone />
          )}
        </>
      </div>

      <div className="section">
        <h2>{dictionary.privateInstructor.createCourseInfo[41][language]}</h2>

        <>
          <div className="price-section">
            <DynamicInput
              id={"precio"}
              type="number"
              state={[inputs, setInputs]}
              noIcon
              price
              label={dictionary.privateInstructor.createCourseInfo[42][language]}
            />
            <DynamicInput
              id={"fee"}
              state={[fees, setFees]}
              noIcon
              price
              disabled
              label={`${dictionary.privateInstructor.createCourseInfo[43][language]} (${feePercentage}%)`}
            />
            <DynamicInput
              id={"net"}
              state={[fees, setFees]}
              noIcon
              price
              disabled
              label={dictionary.privateInstructor.createCourseInfo[44][language]}
            />
          </div>
          <p className="hint">{dictionary.privateInstructor.createCourseInfo[45][language]}</p>
        </>
      </div>

      <div className="section">
        <div className="media-creation">
          <h2>{dictionary.privateInstructor.createCourseInfo[46][language]}</h2>

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
              ? dictionary.privateInstructor.createCourseInfo[47][language]
              : dictionary.privateInstructor.createCourseInfo[48][language]}
            <ImageOutline />
          </button>
        </div>
      </div>

      <div className="section action">
        <h2>{dictionary.privateInstructor.createCourseInfo[49][language]}</h2>

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
                {dictionary.privateInstructor.createCourseInfo[50][language]}
              </>
            ) : (
              <>
                <SpinnerOfDoom />
                {dictionary.privateInstructor.createCourseInfo[51][language]}
              </>
            )
          ) : (
            dictionary.privateInstructor.createCourseInfo[52][language]
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateCourseInfo;
