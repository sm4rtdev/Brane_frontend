import React, { useContext, useEffect, useRef, useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";

import { ImageOutline, TrashOutline, Videocam } from "../../../../assets/icons";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import LinkItem from "./LinkItem";
import { postUserProfileImage } from "../../../../api/postUserProfileImage";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";
import { postNewLesson } from "../../../../api/postNewLesson";
import { postSubtitle } from "../../../../api/postSubtitle";
import { goUp } from "../../../../helpers/ScrollToTop";

const initialState = {
  nombre: "",
  descripcion: "",
  duracion: "",
  additionalResources: "",
  subLabel: "EN",
};

const initialResources = {
  additionalResources: "",
};

const LessonAggregator = ({ courseID, setUpdater }) => {
  const { dictionary, language } = useContext(DictionaryContext);

  const [inputs, setInputs] = useState(initialState);
  const [internalInputs, setInternalInputs] = useState(initialResources);
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

  // ------------ Manage lesson media

  const [preview, setPreview] = useState(null);
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

  // ------------ Manage subtitles

  const inputSubs = useRef(null);
  const [subs, setSubs] = useState([]);
  const [tempSub, setTempSub] = useState(null);

  const openSubsSelection = () => {
    inputSubs.current.click();
  };

  const handleSubsChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setTempSub(e.target.files[0]);
    }
  };

  const addToSubs = () => {
    let obj = {
      id: Date.now(),
      filename: tempSub.name,
      label: inputs.subLabel,
      sub: tempSub,
    };

    setInputs((c) => {
      return { ...c, subLabel: "EN" };
    });

    setTempSub(null);

    setSubs((c) => {
      return [...c, obj];
    });
  };

  const deleteFromSubs = (id) => {
    let newArray = subs.filter((el) => el.id !== id);

    setSubs(newArray);
  };

  // ------------ Update lesson

  const [currentLessonID, setCurrentLessonID] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingSubs, setUploadingSubs] = useState(false);
  const [ongoingUpdate, setOngoingUpdate] = useState(false);

  useEffect(() => {
    if (currentLessonID && file) {
      const clearALL = () => {
        setInputs(initialState);
        setInternalInputs(initialResources);
        setPreview(null);
        setFile(null);
        setCurrentLessonID(null);
        setUpdater(Date.now());
        setTempSub(null);
        setSubs([]);
        goUp();
      };

      const uploadSubs = async () => {
        setUploadingSubs(true);

        const formData = new FormData();

        formData.append("clase", currentLessonID);

        subs.forEach((obj, index) => {
          formData.append(`subtitles[${index}][file]`, obj.sub);
          formData.append(`subtitles[${index}][lang]`, obj.label);
        });

        const { ok, data } = await postSubtitle(formData);

        if (ok) {
          toast.success(dictionary.privateInstructor.lessonAggregator[18][language]);
          setOngoingUpdate(false);
          clearALL();
        } else {
          toast.error(`${data.error.message}`);
        }

        setUploadingSubs(false);
      };

      const uploadFile = async () => {
        setUploadingFile(true);

        const formData = new FormData();

        formData.append("ref", "api::clase.clase");
        formData.append("refId", currentLessonID);
        formData.append("field", "clase");
        formData.append("files", file, file.name);

        const { ok, data } = await postUserProfileImage(formData);

        if (ok) {
          toast.success(dictionary.privateInstructor.lessonAggregator[0][language]);

          setUploadingFile(false);

          if (subs.length > 0) {
            uploadSubs();
          } else {
            setOngoingUpdate(false);
            clearALL();
          }
        } else {
          toast.error(`${data.error.message}`);
        }
      };

      uploadFile();
    }
  }, [currentLessonID, file]); //eslint-disable-line

  const createLesson = async () => {
    const obj = {
      data: {
        nombre: inputs.nombre,
        descripcion: inputs.descripcion,
        duracion: inputs.duracion,
        additionalResources: inputs.additionalResources !== "" ? JSON.parse(inputs.additionalResources) : [],
        curso: courseID,
      },
    };

    console.log(obj);

    const { ok, data } = await postNewLesson(obj);

    if (ok) {
      toast.success(dictionary.privateInstructor.lessonAggregator[1][language]);

      setCurrentLessonID(data.data.id);
    } else {
      toast.error(`${data.error.message}`);
      console.log(data.error);
      setOngoingUpdate(false);
    }
  };

  const checkEverything = () => {
    if (inputs.nombre.length < 3) {
      toast.error(dictionary.privateInstructor.lessonAggregator[2][language]);
    } else if (inputs.descripcion === "") {
      toast.error(dictionary.privateInstructor.lessonAggregator[3][language]);
    } else if (!file) {
      toast.error(dictionary.privateInstructor.lessonAggregator[4][language]);
    } else {
      setOngoingUpdate(true);

      createLesson();
    }
  };

  return (
    <div className="lesson-aggregator">
      <strong>{dictionary.privateInstructor.lessonAggregator[5][language]}</strong>

      <div className="inner-container">
        <div className="basic-stuff">
          <DynamicInput
            id={"nombre"}
            state={[inputs, setInputs]}
            label={dictionary.privateInstructor.lessonAggregator[6][language]}
            noIcon
          />
          <DynamicInput
            id={"descripcion"}
            state={[inputs, setInputs]}
            label={dictionary.privateInstructor.lessonAggregator[7][language]}
            multiline
            noIcon
          />
        </div>

        <div className="additional-resources">
          {moreIsOpen ? (
            <>
              <h2>{dictionary.privateInstructor.lessonAggregator[8][language]}</h2>
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
                  <p className="no-items">{dictionary.privateInstructor.lessonAggregator[9][language]}</p>
                )}
              </div>

              <DynamicInput
                id={"additionalResources"}
                state={[internalInputs, setInternalInputs]}
                label={dictionary.privateInstructor.lessonAggregator[10][language]}
                noIcon
              />
              <button
                className="action-button"
                onClick={() => {
                  addTextToATextArray("additionalResources");
                }}
              >
                {dictionary.privateInstructor.lessonAggregator[10][language]}
              </button>
            </>
          ) : (
            <button
              className="action-button"
              onClick={() => {
                setMoreIsOpen(true);
              }}
            >
              {dictionary.privateInstructor.lessonAggregator[11][language]}
            </button>
          )}
        </div>

        <div className="media-creation">
          <h2>{dictionary.privateInstructor.lessonAggregator[12][language]}</h2>

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
            {!preview
              ? dictionary.privateInstructor.lessonAggregator[13][language]
              : dictionary.privateInstructor.lessonAggregator[14][language]}
            <Videocam />
          </button>

          {/* ------------------------------------------------------------- */}

          <div className="subtitles-section">
            <h2>{dictionary.privateInstructor.lessonAggregator[19][language]}</h2>

            <div className="subtitles">
              {subs.length > 0 ? (
                subs.map((sub, index) => {
                  return (
                    <div className="subtitle-item" key={index}>
                      <p>
                        {sub.label} ({sub.filename})
                      </p>

                      <button
                        className="small-button"
                        onClick={() => {
                          deleteFromSubs(sub.id);
                        }}
                      >
                        <TrashOutline />
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="no-items">{dictionary.privateInstructor.lessonAggregator[20][language]}</p>
              )}
            </div>

            <input type="file" id="media" onChange={handleSubsChange} ref={inputSubs} accept="text/vtt" multiple />

            <div className="add-sub-box">
              <label htmlFor="select-subs-form">{dictionary.privateInstructor.lessonAggregator[21][language]}</label>

              <FormControl fullWidth style={{ maxWidth: "256px" }}>
                <Select
                  id="select-subs-form"
                  value={inputs.subLabel}
                  style={{
                    borderRadius: "50px",
                    fontFamily: "Inter",
                    fontSize: "0.875rem",
                    height: "2.5rem",
                    backgroundColor: "#fff",
                  }}
                  onChange={(e) => {
                    setInputs((c) => {
                      return { ...c, subLabel: e.target.value };
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
                  <MenuItem value={"ES"}>{dictionary.privateInstructor.lessonAggregator[22][language]}</MenuItem>
                  <MenuItem value={"EN"}>{dictionary.privateInstructor.lessonAggregator[23][language]}</MenuItem>
                  <MenuItem value={"PT"}>{dictionary.privateInstructor.lessonAggregator[24][language]}</MenuItem>
                </Select>
              </FormControl>

              <button className="action-button" onClick={openSubsSelection}>
                {tempSub
                  ? dictionary.privateInstructor.lessonAggregator[25][language]
                  : dictionary.privateInstructor.lessonAggregator[26][language]}
              </button>
            </div>

            {tempSub && inputs.subLabel !== "" && (
              <button className="action-button" onClick={addToSubs}>
                {dictionary.privateInstructor.lessonAggregator[27][language]}
              </button>
            )}
          </div>

          {/* ------------------------------------------------------------- */}

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
                  {dictionary.privateInstructor.lessonAggregator[15][language]}
                </>
              ) : uploadingSubs ? (
                <>{dictionary.privateInstructor.lessonAggregator[28][language]}</>
              ) : (
                <>
                  <SpinnerOfDoom />
                  {dictionary.privateInstructor.lessonAggregator[16][language]}
                </>
              )
            ) : (
              dictionary.privateInstructor.lessonAggregator[17][language]
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonAggregator;
