import React, { useContext } from "react";

import PageTransition from "../../../../components/PageTransition/PageTransition";
import Footer from "../../../../components/Footer/Footer";
import Header from "../../../../components/Header/Header";
import Chat from "./Chat";
import { UserDataContext } from "../../../../contexts/UserDataContext";

const ChatPage = () => {
  const { userData } = useContext(UserDataContext);

  return (
    <div id="chat-page" className="page">
      <PageTransition margin>
        <Header />
        <div className="main">
          <Chat />
        </div>
        <Footer
          unique
          {...(userData.mode === "instructor" && { instructor: true })}
        />
      </PageTransition>
    </div>
  );
};

export default ChatPage;
