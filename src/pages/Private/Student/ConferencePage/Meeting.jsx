import React, { useEffect, useRef } from "react";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";

const client = ZoomMtgEmbedded.createClient();

const Meeting = ({ joinData }) => {
  const element = useRef(null);

  console.log(joinData);

  useEffect(() => {
    if (element.current !== null) {
      client.init({ zoomAppRoot: element.current, language: "en-US" });
    }
  }, [element]);

  useEffect(() => {
    client.join({
      role: 0,
      sdkKey: joinData.sdkKey,
      signature: joinData.signature,
      meetingNumber: joinData.meetingNumber,
      password: joinData.meetingPassword,
      userName: joinData.userName,
      // userEmail: joinData.userEmail,
    });
  }, [joinData]);

  return (
    <div id="meetingSDKElement" ref={element}>
      Zoom Meeting SDK Rendered Here
    </div>
  );
};

export default Meeting;
