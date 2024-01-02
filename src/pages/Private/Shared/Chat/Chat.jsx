import React, { useContext, useEffect, useRef, useState } from "react";
import { formatRelative } from "date-fns";
import { toast } from "react-toastify";

import "./Chat.scss";

import { PersonOutline, Send } from "../../../../assets/icons";

import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import DynamicInput from "../../../../components/DynamicInput/DynamicInput";
import FancyImage from "../../../../components/FancyImage/FancyImage";
import { getStudentsByInstructor } from "../../../../api/getStudentsByInstructor";
import { getImageLinkFrom } from "../../../../helpers/getImageLinkFrom";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { getChatByUserID } from "../../../../api/getChatByUserID";
import { postChatMessage } from "../../../../api/postChatMessage";
import { getMyMessages } from "../../../../api/getMyMessages";
import { getMyTeachers } from "../../../../api/getMyTeachers";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";

const NewUserConversation = ({ handler, id, nombre, avatar }) => {
  return (
    <div
      className="user-conversation new"
      onClick={() => {
        handler({
          id,
          name: nombre,
          avatar: avatar ? (avatar.formats ? avatar.formats.thumbnail.url : avatar) : null,
        });
      }}
    >
      <div className="avatar">
        {avatar ? (
          <FancyImage
            src={getImageLinkFrom(avatar ? (avatar.formats ? avatar.formats.thumbnail.url : avatar) : null)}
          />
        ) : (
          <PersonOutline />
        )}
      </div>
      <div className="name">{nombre}</div>
    </div>
  );
};

const UserConversation = ({ handler, id, nombre, avatar, comentario, fecha_de_publicacion }) => {
  return (
    <div
      className="user-conversation"
      onClick={() => {
        handler({
          id,
          name: nombre,
          avatar: avatar ? avatar : null,
        });
      }}
    >
      <div className="avatar">{avatar ? <FancyImage src={getImageLinkFrom(avatar)} /> : <PersonOutline />}</div>

      <div className="preview-body">
        <div className="name">{nombre}</div>
        <div className="message">{comentario}</div>
        <div className="time">
          {formatRelative(new Date(Date.parse(fecha_de_publicacion)), new Date(), {
            includeSeconds: true,
            addSuffix: true,
          })}
        </div>
      </div>
    </div>
  );
};

const BubbleMessage = ({ ourUserID, comentario, fecha_de_publicacion, remitente }) => {
  return (
    <div className={`bubble-message ${remitente.id === ourUserID ? "own" : ""}`}>
      <p>{comentario}</p>
      <span>
        {formatRelative(new Date(Date.parse(fecha_de_publicacion)), new Date(), {
          includeSeconds: true,
          addSuffix: true,
        })}
      </span>
    </div>
  );
};

const Chat = () => {
  const { dictionary, language } = useContext(DictionaryContext);
  const { userData } = useContext(UserDataContext);

  const [students, setStudents] = useState(null);
  const [myTeachers, setMyTeachers] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [myChats, setMyChats] = useState(null);
  const [searchInput, setSearchInput] = useState({ search: "" });
  const [msgInput, setMsgInput] = useState({ message: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [localRefresh, setLocalRefresh] = useState(null);
  const messageContainer = useRef(null);

  // Para iniciar chat
  useEffect(() => {
    const getStudents = async () => {
      const { ok, data } = await getStudentsByInstructor(userData.info.slug);

      if (ok) {
        const withoutMe = data.data.filter((obj) => obj.id !== userData.info.id);

        setStudents(withoutMe);
      } else {
        toast.error(`${data.error.message}`);
      }
    };
    const getTeachers = async () => {
      const { ok, data } = await getMyTeachers();

      if (ok) {
        const withoutMe = data.data.filter((obj) => obj.id !== userData.info.id);

        setMyTeachers(withoutMe);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    const getPreviousChats = async () => {
      const { ok, data } = await getMyMessages();

      if (ok) {
        setMyChats(data);
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    getStudents();
    getTeachers();
    getPreviousChats();
  }, []); //eslint-disable-line

  useEffect(() => {
    if (students) {
      if (searchInput.search && myTeachers) {
        const newData = students.map((item) => ({
          // combina nombre y apellidos en una sola propiedad
          ...item,
          nombre: `${item.nombre} ${item.apellidos}`,
        }));

        const filteredData = newData
          .concat(myTeachers) // combina los dos arreglos
          .reduce((acc, current) => {
            // construye un nuevo arreglo sin duplicados
            const x = acc.find((item) => item.id === current.id);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, [])
          .filter((item) => item.nombre.toLowerCase().includes(searchInput.search.toLowerCase()));

        setSearchResults(filteredData);
      } else {
        setSearchResults(null);
      }
    }
  }, [searchInput, students, myTeachers]);

  const [loadingConver, setLoadingConver] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      const getConversation = async () => {
        const { ok, data } = await getChatByUserID(selectedUser.id);

        if (ok) {
          const orderedMessages = [...data].sort((a, b) => {
            const fechaA = new Date(a.fecha_de_publicacion);
            const fechaB = new Date(b.fecha_de_publicacion);

            if (fechaA < fechaB) {
              return -1;
            } else if (fechaA > fechaB) {
              return 1;
            } else {
              return 0;
            }
          });

          setConversation(orderedMessages);
          if (messageContainer.current) {
            messageContainer.current.scrollTop = messageContainer.current.scrollHeight;

            setTimeout(() => {
              console.log(messageContainer.current);
              messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
            }, 300);
          }
          setLoadingConver(false);
        } else {
          toast.error(`${data.error.message}`);
        }
      };

      getConversation();
    }
  }, [selectedUser, localRefresh]);

  const [sendingMesg, setSendingMesg] = useState(false);

  const sendMessage = async () => {
    if (msgInput.message !== "") {
      setSendingMesg(true);

      const obj = {
        data: {
          comentario: msgInput.message,
          destinatario: selectedUser.id,
          tipo: "mensaje",
        },
      };

      const { ok, data } = await postChatMessage(obj);

      if (ok) {
        setMsgInput({ message: "" });
        toast.success(dictionary.chat[0][language]);
        setLocalRefresh(Date.now());
      } else {
        toast.error(`${data.error.message}`);
      }

      setSendingMesg(false);
    }
  };

  return (
    <div id="chat-page">
      <h1>Chat</h1>

      <p className="hint">
        {userData.mode === "student" ? dictionary.chat[1][language] : dictionary.chat[2][language]}
      </p>

      <div className="the-chat">
        <div className="users">
          <div className="search">
            <div className="searchbar">
              <DynamicInput
                id={"search"}
                state={[searchInput, setSearchInput]}
                label={dictionary.chat[3][language]}
                type="search"
              />
            </div>

            {searchResults !== null && (
              <div className="results">
                <span>{dictionary.chat[4][language]}</span>

                {searchResults.length > 0 ? (
                  <div className="inner-container">
                    {searchResults.map((user) => {
                      return (
                        <NewUserConversation
                          key={user.id}
                          {...user}
                          handler={(id) => {
                            setSelectedUser(id);
                            setLoadingConver(true);
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="no-data">{dictionary.chat[5][language]}</p>
                )}
              </div>
            )}
          </div>
          {searchResults === null &&
            (myChats !== null ? (
              <div className="my-chats">
                <strong>{dictionary.chat[6][language]}</strong>

                <div className="inner-container">
                  {myChats.length > 0 ? (
                    myChats.map((user) => {
                      return (
                        <UserConversation
                          key={user.id}
                          {...user}
                          handler={(id) => {
                            setSelectedUser(id);
                            setLoadingConver(true);
                          }}
                        />
                      );
                    })
                  ) : (
                    <p className="no-data">{dictionary.chat[5][language]}</p>
                  )}
                </div>
              </div>
            ) : (
              <SpinnerOfDoom standalone center />
            ))}
        </div>
        {selectedUser && (
          <div className="the-conversation">
            <div className="conversation-header">
              <div className="avatar">
                {selectedUser.avatar ? <FancyImage src={getImageLinkFrom(selectedUser.avatar)} /> : <PersonOutline />}
              </div>
              <strong>{selectedUser.name}</strong>
            </div>
            {!loadingConver ? (
              <>
                <div className="messages" ref={messageContainer}>
                  {conversation &&
                    conversation.map((message) => {
                      return <BubbleMessage key={message.id} {...message} ourUserID={userData.info.id} />;
                    })}
                </div>
                <div className="send-message">
                  <DynamicInput
                    id={"message"}
                    state={[msgInput, setMsgInput]}
                    noIcon
                    placeholder={dictionary.chat[7][language]}
                  />
                  <button className="small-button" onClick={sendMessage} disabled={!msgInput.message || sendingMesg}>
                    <Send />
                  </button>
                </div>
              </>
            ) : (
              <SpinnerOfDoom standalone center />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
