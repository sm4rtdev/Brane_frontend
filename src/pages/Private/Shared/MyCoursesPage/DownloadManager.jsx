import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import SpecialCourseCard from "../../../../components/CourseCard/SpecialCourseCard";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

const DownloadManager = ({ filteredCourses }) => {
  const { dictionary, language } = useContext(DictionaryContext);
  useEffect(() => {
    const DDBB = "brane-storage";
    const request = window.indexedDB.open(DDBB, 1);

    request.onerror = (event) => {
      console.error(event);
      toast.error(dictionary.lessonDownloader[0][language]);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore("videos", { keyPath: "id" });
      console.log("Upgrade", objectStore);
    };
  }, []);

  const [updater, setUpdater] = useState(null);

  const triggerUpdate = () => {
    setUpdater(Date.now());
  };

  return (
    <div className="courses downloads">
      {filteredCourses
        .filter((course) => course.attributes.curso.data.attributes.tipo !== "conferencia")
        .map((course) => {
          return (
            <SpecialCourseCard
              key={course.id}
              id={course.attributes.curso.data.id}
              {...course}
              triggerUpdate={triggerUpdate}
              updater={updater}
            />
          );
        })}
    </div>
  );
};

export default DownloadManager;
