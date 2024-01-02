import React, { useEffect } from "react";

const Meeting = () => {
  useEffect(() => {
    let data = JSON.parse(window.opener.joinDataTemp);

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
        var leaveUrl = "brane.es/my-courses";
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
  }, []);

  return <div>Loading Zoom Meeting...</div>;
};

export default Meeting;
