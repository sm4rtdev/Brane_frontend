import React, { useState } from "react";

import { ReportModalContext } from "./ReportModalContext";
import ReportModal from "../components/ReportModal/ReportModal";

const ReportModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportOrigin, setReportOrigin] = useState(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setReportOrigin(null);
  };

  const closeOnClick = (e) => {
    if (e.target.id === "report-modal-container") {
      closeModal();
    }
  };

  const openReportModal = (data) => {
    setReportOrigin(data);
    setIsModalOpen(true);
  };

  return (
    <ReportModalContext.Provider value={{ isModalOpen, openReportModal, closeModal, closeOnClick }}>
      {children}

      {isModalOpen && <ReportModal reportOrigin={reportOrigin} />}
    </ReportModalContext.Provider>
  );
};

export default ReportModalProvider;
