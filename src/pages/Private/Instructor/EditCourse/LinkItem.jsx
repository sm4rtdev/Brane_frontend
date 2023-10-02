import React from "react";

import { LinkOutline, TrashOutline } from "../../../../assets/icons";

const LinkItem = ({ index, text, objectKey, deleteFromInputs }) => {
  return (
    <div className="link">
      <p>
        <LinkOutline />
        {`Link ${index + 1}: `}
      </p>
      <a href={text} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
      <button
        className="small-button"
        onClick={() => {
          console.log(objectKey, text);
          deleteFromInputs(objectKey, text);
        }}
      >
        <TrashOutline />
      </button>
    </div>
  );
};

export default LinkItem;
