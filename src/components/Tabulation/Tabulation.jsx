import React from "react";
import { useState } from "react";

const Tabulation = ({ tabs, options, children }) => {
  const [openTab, setOpenTab] = useState(0);

  const { type, color } = options;

  return (
    <div className="tabulation">
      <div className="tabs">
        {tabs.map((option, index) => {
          return (
            <div
              className={`tab ${openTab === index ? "selected" : ""} ${
                type ? type : ""
              } ${color ? color : ""}`}
              key={index}
            >
              <button
                onClick={() => {
                  setOpenTab(index);
                }}
              >
                {option}
              </button>
            </div>
          );
        })}
      </div>
      <div className="content">{children[openTab]}</div>
    </div>
  );
};

export default Tabulation;
