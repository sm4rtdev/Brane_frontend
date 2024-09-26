import React, { useContext, useEffect } from "react";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

const Close = () => {
  const { dictionary, language } = useContext(DictionaryContext);
  useEffect(() => {
    window.close();
  }, []);

  return (
    <div className="full-center">
      <p className="no-data">{dictionary.conferencePage[13][language]}</p>
    </div>
  );
};

export default Close;
