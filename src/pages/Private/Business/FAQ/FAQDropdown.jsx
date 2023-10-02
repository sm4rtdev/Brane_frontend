import React, { useEffect, useState } from "react";

import { ChevronForward } from "../../../../assets/icons";

const FAQDropdown = ({
  id,
  title,
  text,
  setDropdownListener,
  dropdownListener,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (dropdownListener !== id) {
      setIsOpen(false);
    }
  }, [dropdownListener]); //eslint-disable-line

  return (
    <div className={`faq-dropdown ${isOpen ? "open" : ""}`}>
      <div
        className="title"
        onClick={() => {
          setIsOpen((c) => {
            if (!c) {
              setDropdownListener(id);
            }

            return !c;
          });
        }}
      >
        <strong>{title}</strong>
        <ChevronForward />
      </div>
      {isOpen && (
        <div className="desc">
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default FAQDropdown;
