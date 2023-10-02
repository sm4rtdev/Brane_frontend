import React from "react";

import InstructorHeader from "../../../../components/CustomHeaders/InstructorHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import Tabulation from "../../../../components/Tabulation/Tabulation";
import Footer from "../../../../components/Footer/Footer";
import Comments from "./Comments/Comments";
import Chat from "../../Shared/Chat/Chat";

const Messages = () => {
  return (
    <div id="messages-page" className="page">
      <PageTransition>
        <InstructorHeader />

        <div className="main">
          <Tabulation
            tabs={["Comentarios", "Chat"]}
            options={{ color: "black", type: "bubble" }}
          >
            <Comments />
            <Chat />
          </Tabulation>
        </div>

        <Footer unique instructor />
      </PageTransition>
    </div>
  );
};

export default Messages;
