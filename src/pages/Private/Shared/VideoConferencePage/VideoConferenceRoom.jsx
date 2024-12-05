import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "peerjs";
import "./VideoConferencePage.scss";
import { v4 } from "uuid";
import HoldingCard from "../../../../components/HoldingCard/HoldingCard";
import Video from "../../../../components/VideoChat/VideoChat";
import Chat from "../../../../components/Chat/Chat";
import { UserDataContext } from "../../../../contexts/UserDataContext";
import { PEERJS_SERVER, SOCKETIO_SERVER } from "../../../../api/settings";

const VideoConferenceRoom = () => {
  const { userData } = useContext(UserDataContext);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { state } = useLocation();
  const { host } = state || {};
  const [peer, setPeer] = useState();
  const socket = useRef();
  const [user, setUser] = useState({
    host, 
    name: ((userData.info?.nombre ?? "") + " " + (userData.info?.apellidos ?? "")).trim() || "Unknown",
    avatar: userData.avatar?.url
  });
  const [holdingUsers, setHoldingUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [joint, setJoint] = useState(false);
  const [chat, showChat] = useState(false);
  const [newMsg, setNewMsg] = useState(false);

  const allowToJoin = (holder) => {
    socket.current.emit('allow-join', holder);
    setHoldingUsers(holdingUsers.filter(h => h.socketId !== holder.socketId))
  }
  const rejectToJoin = (holder) => {
    socket.current.emit('reject-join', holder);
    setHoldingUsers(holdingUsers.filter(h => h.socketId !== holder.socketId))
  }
  const allowAll = () => {
    socket.current.emit('allow-all', {roomId, newUsers: holdingUsers.map(h => ({
      socketId: h.socketId,
      peerId: h.peerId,
      name: h.user.name
    }))});
    setHoldingUsers([]);
  }

  useEffect(() => {
    const socket_server = SOCKETIO_SERVER;
    socket.current = io(socket_server, {
      transports: ['websocket']
    });
    const peer = new Peer(host?roomId:v4(), { host: PEERJS_SERVER });
    setPeer(peer);
  }, []);

  useEffect(() => {
    if (peer) {
      socket.current.on("all-users", (users) => {
        setJoint(true);
        setMembers(users);
      })
      if (host) {
        socket.current.on('user-request-join', ({roomId, socketId, peerId, user}) => {
          setHoldingUsers(prev => [...prev, {roomId, socketId, peerId, user}]);
        })
        socket.current.emit('join-room', {
          roomId,
          peerId: peer.id,
          user
        })
      } else {
        socket.current.on('user-allow-join', ({roomId, token}) => {
          socket.current.emit('join-room', {roomId, peerId: peer.id, user, token})
        });
        socket.current.on('user-reject-join', (roomId) => {
          navigate('/');
          window.location.reload();
        })
        socket.current.on('host-not-found', (roomId) => {
          navigate('/');
          window.location.reload();
        });

        socket.current.emit('request-join', {roomId, peerId: peer.id, user});
      }
    }
  }, [peer])

  return (
    <div className="room">
      <HoldingCard holdingUsers={holdingUsers} allow={allowToJoin} reject={rejectToJoin} allowAll={allowAll}/>
      {host || joint ? (
        <>
          <div className="videos">
            <Video
              roomId={roomId}
              socket={socket}
              user={user}
              peer={peer}
              members={members}
              setMembers={setMembers}
              showChat={showChat}
              newMsg={!chat && newMsg}
            />
          </div>
          <div className="chat" style={{display: chat?"flex":"none"}}>
            <Chat user={user} roomId={roomId} peerId={peer?.id} socket={socket} setNewMsg={setNewMsg} />
          </div>
        </>
      ) : (
        <h2>Waiting to allow you to join the room...</h2>
      )}
    </div>
  )
}
export default VideoConferenceRoom;