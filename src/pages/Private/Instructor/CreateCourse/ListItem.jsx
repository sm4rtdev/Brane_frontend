import React from "react";

import { Ellipse, TrashOutline } from "../../../../assets/icons";

const ListItem = ({ children, objectKey, deleteFromInputs }) => {
  return (
    <div className="list-item">
      <Ellipse />
      <p>{children}</p>
      <button
        className="small-button"
        onClick={() => {
          deleteFromInputs(objectKey, children);
        }}
      >
        <TrashOutline />
      </button>
    </div>
  );
};

export default ListItem;
