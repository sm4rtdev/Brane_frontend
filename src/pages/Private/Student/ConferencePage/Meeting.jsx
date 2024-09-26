import React, { useContext, useEffect } from "react";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

const Meeting = () => {
  const { dictionary, language } = useContext(DictionaryContext);
  const createZoomElement = (link, type) => {
    if (type === "style") {
      const styleElement = document.createElement("link");
      styleElement.type = "text/css";
      styleElement.rel = "stylesheet";
      styleElement.href = link;

      document.head.append(styleElement);

      return styleElement;
    } else {
      const scriptElement = document.createElement("script");
      scriptElement.src = link;
      scriptElement.async = false;

      document.body.append(scriptElement);

      return scriptElement;
    }
  };

  useEffect(() => {
    let data = JSON.parse(window.opener.joinDataTemp);

    const zzz1 = createZoomElement("https://source.zoom.us/2.18.2/css/bootstrap.css", "style");
    const zzz2 = createZoomElement("https://source.zoom.us/2.18.2/css/react-select.css", "style");

    const zzz3 = createZoomElement("https://source.zoom.us/2.18.2/lib/vendor/react.min.js");
    const zzz4 = createZoomElement("https://source.zoom.us/2.18.2/lib/vendor/react-dom.min.js");
    const zzz5 = createZoomElement("https://source.zoom.us/2.18.2/lib/vendor/redux.min.js");
    const zzz6 = createZoomElement("https://source.zoom.us/2.18.2/lib/vendor/redux-thunk.min.js");
    const zzz7 = createZoomElement("https://source.zoom.us/2.18.2/lib/vendor/lodash.min.js");

    if (data !== null) {
      import("@zoomus/websdk").then(({ ZoomMtg }) => {
        ZoomMtg.setZoomJSLib("https://source.zoom.us/2.18.2/lib", "/av");
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareWebSDK();
        // loads language files, also passes any error messages to the ui
        ZoomMtg.i18n.load("en-US");
        ZoomMtg.i18n.reload("en-US");
        var registrantToken = "";
        var zakToken = "";
        var leaveUrl = "/conference/exit";

        ZoomMtg.init({
          leaveUrl: leaveUrl,
          success: (success) => {
            console.log(success);
            ZoomMtg.join({
              signature: data.signature,
              sdkKey: data.sdkKey,
              meetingNumber: data.meetingNumber,
              passWord: data.meetingPassword,
              userName: data.userName,
              userEmail: data.userEmail,
              tk: registrantToken,
              zak: zakToken,
              success: (success) => {
                console.log("success", success);
              },
              error: (error) => {
                console.log(error);
              },
            });
          },
          error: (error) => {
            console.log(error);
          },
        });
      });
    }

    return () => {
      zzz1.remove();
      zzz2.remove();
      zzz3.remove();
      zzz4.remove();
      zzz5.remove();
      zzz6.remove();
      zzz7.remove();
    };
  }, []);

  return (
    <div className="full-center">
      <p className="no-data">{dictionary.conferencePage[14][language]}</p>
    </div>
  );
};

export default Meeting;
