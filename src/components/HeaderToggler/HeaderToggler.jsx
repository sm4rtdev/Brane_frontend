import React, { useEffect, useState } from "react";

import Header from "../Header/Header";

const tabletSM = 744;

const HeaderToggler = ({ children, black, title, progress }) => {
  const [mobile, setMobile] = useState(true);

  function checkScreenSize() {
    let w = window.innerWidth;

    if (w > tabletSM) {
      setMobile(false);
    } else {
      setMobile(true);
    }
  }

  useEffect(() => {
    // First time
    checkScreenSize();

    // On resize
    const resize = window.addEventListener("resize", () => {
      checkScreenSize();
    });

    // For bugs related to scroll
    const scroll = window.addEventListener("scroll", () => {
      checkScreenSize();
    });

    // For bugs related to DOM loading
    const load = window.addEventListener("load", () => {
      checkScreenSize();
    });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("load", load);
    };
  }, []);

  return (
    <>
      {mobile ? (
        children
      ) : (
        <Header
          type={"discover"}
          black={black}
          title={title}
          progress={progress}
        />
      )}
    </>
  );
};

export default HeaderToggler;
