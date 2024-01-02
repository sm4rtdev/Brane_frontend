import React, { useContext } from "react";

import InstructorHeader from "../../../../components/CustomHeaders/InstructorHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import Tabulation from "../../../../components/Tabulation/Tabulation";
import Footer from "../../../../components/Footer/Footer";
import Comments from "./Comments/Comments";
import Chat from "../../Shared/Chat/Chat";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

const Messages = () => {
  const { dictionary, language } = useContext(DictionaryContext);

  return (
    <div id="messages-page" className="page">
      <PageTransition>
        <InstructorHeader />

        <div className="main">
          <Tabulation
            tabs={[dictionary.privateInstructor.messages[0][language], "Chat"]}
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
