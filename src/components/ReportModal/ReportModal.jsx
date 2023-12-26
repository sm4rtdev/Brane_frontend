import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import "./ReportModal.scss";

import DynamicInput from "../DynamicInput/DynamicInput";
import SpinnerOfDoom from "../SpinnerOfDoom/SpinnerOfDoom";
import { ReportModalContext } from "../../contexts/ReportModalContext";
import { postLessonReport } from "../../api/postLessonReport";
import { DictionaryContext } from "../../contexts/DictionaryContext";

const ReportModal = ({ reportOrigin }) => {
  const { dictionary, language } = useContext(DictionaryContext);
  const { closeModal, closeOnClick } = useContext(ReportModalContext);
  const modalContainer = useRef(null);

  const [input, setInput] = useState({
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      modalContainer.current.classList.add("visible");
    }, 0);
  }, []);

  const sendReport = async () => {
    setIsLoading(true);

    const obj = {
      data: {
        type: "video_class",
        subject: input.subject,
        message: input.message,
        curso: reportOrigin.courseID,
        clase: reportOrigin.lessonID,
        path: "/video/curso",
      },
    };

    const { ok, data } = await postLessonReport(obj);

    if (ok) {
      toast.success(dictionary.login.done[0][language]);

      closeModal();
    } else {
      toast.error(`${data.error.message}`);
    }
  };

  return (
    <div id="report-modal-container" onClick={closeOnClick} ref={modalContainer}>
      <div className="modal">
        <strong>{dictionary.reportModal[0][language]}</strong>

        <DynamicInput id={"subject"} state={[input, setInput]} label={dictionary.reportModal[1][language]} noIcon />
        <DynamicInput
          id={"message"}
          state={[input, setInput]}
          label={dictionary.reportModal[2][language]}
          noIcon
          multiline
        />

        <div className="button-group">
          <button className="action-button gray" onClick={closeModal}>
            {dictionary.reportModal[3][language]}
          </button>

          <button className="action-button" onClick={() => sendReport()}>
            {isLoading ? (
              <>
                <SpinnerOfDoom /> {dictionary.spinnerOfDoom[language]}
              </>
            ) : (
              dictionary.reportModal[4][language]
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
