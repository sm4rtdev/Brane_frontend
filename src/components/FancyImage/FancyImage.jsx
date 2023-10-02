import React, { useEffect, useState } from "react";

const FancyImage = ({ src, noEffect }) => {
  const [localURL, setLocalURL] = useState(null);
  const [hasBeenLoaded, setHasBeenLoaded] = useState(false);

  useEffect(() => {
    setLocalURL(null);
    setHasBeenLoaded(false);

    setTimeout(() => {
      setLocalURL(src);
    }, 20);
  }, [src]);

  const handleLoad = () => {
    setHasBeenLoaded(true);
  };

  return (
    <div
      className={`fancy-container ${hasBeenLoaded ? "loaded" : ""} ${
        noEffect ? "no-effect" : ""
      }`}
    >
      {localURL && (
        <img
          src={localURL}
          alt=""
          loading="lazy"
          onLoad={handleLoad}
          width="100%"
          heigth="100%"
        />
      )}
    </div>
  );
};

export default FancyImage;
