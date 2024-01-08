import React, { useEffect } from "react";

const Close = () => {
  useEffect(() => {
    window.close();
  }, []);

  return (
    <div className="full-center">
      <p className="no-data">Leaving...</p>
    </div>
  );
};

export default Close;
