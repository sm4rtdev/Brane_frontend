import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"
import VideoCard from "./VideoCard";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import { MdCheck, MdLogout, MdOutlineScreenShare, MdShare } from "react-icons/md";
import { TbMessage } from "react-icons/tb";
import Peer from "peerjs";
import "./VideoChat.scss";
import { PEERJS_SERVER } from "../../api/settings";

const Video = ({roomId, user, peer, socket, members, setMembers, showChat, newMsg}) => {
  const navigate = useNavigate();
  
  const [copied, setCopied] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const screenPeer = useRef();
  
  const mainStream = useRef();
  const screenStream =useRef();
  const mainDisplay = useRef();
  const [mainUsername, setMainUsername] = useState(null);
  const [mainPeerId, setMainPeerId] = useState("");
  const sharedScreen = useRef(false);
  const [mainState, setMainState] = useState(0);
  const videoRefs = useRef({});

  const checkDevices = async () => {
    return navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      const video = devices.filter(device => device.kind === 'videoinput').length > 0;
      const audio = devices.filter(device => device.kind === 'audioinput').length > 0;
      
      return {
        video: video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        } : false,
        audio: audio ? {
          noiseSuppression: false,
          echoCancellation: false,
        } : false
      };
    })
    .catch(err => {
      console.log(err);
      return null;
    })
  }

  const requestMedia = async() => {
    const checks = await checkDevices();
    navigator.mediaDevices
    .getUserMedia(checks)
    .then(stream => {
      setVideoOn(checks.video);
      setMicOn(checks.audio);
      mainStream.current = stream;
      if (!sharedScreen.current) setMainVideo(stream, user.name, 4, peer.id);
      setStream(peer.id, stream);
      
      members.map((m) => {
        if (m.peerId !== peer.id) {
          call(m.peerId, peer, stream);
        }
      })
    })
    .catch(reason => console.log("request media failed", reason));
  }

  const call = (peerId, p, stream) => {
    const c = (p || peer).call(peerId, stream || mainStream.current);
    c?.on('stream', remoteStream => {
      setStream(peerId, remoteStream, c, remoteStream.getVideoTracks().length > 0 ? 4 : 2);
    });
  }
  const shareScreen = (peerId, p, stream) => {
    const c = (p || screenPeer.current).call(peerId + "_screen", stream || screenStream.current);
    videoRefs.current[peerId].screenCall = c;
  }

  const requestScreenShare = () => {
    navigator.mediaDevices
    .getDisplayMedia({ video: true, audio: true})
    .then(stream => {
      screenStream.current = stream;
      sharedScreen.current = true;
      setMainVideo(stream, "", 5);
      
      members.forEach((m) => {
        if (peer.id !== m.peerId) {
          shareScreen(m.peerId, screenPeer.current, stream);
        }
      })
      stream.getVideoTracks()[0].addEventListener('ended', (track, e) => {
        screenStream.current = null;
        sharedScreen.current = false;
        setMainVideo(mainStream.current, user.name, 4, peer.id);
        Object.keys(videoRefs.current).forEach((key) => {
          videoRefs.current[key].screenCall?.close();
          delete videoRefs.current[key].screenCall;
        });
      })
    })
    .catch(reason => console.log("request screen share failed", reason))
  }

  const getScreenShare = (screen) => {
    screenStream.current?.getTracks().forEach(track => track.stop());
    sharedScreen.current = true;
    setMainVideo(screen, "", 5);
    screen.getVideoTracks()[0].addEventListener('ended', (track, e) => {
      sharedScreen.current = false;
      setMainVideo(mainStream.current, "", mainStream.current.getVideoTracks().length > 0 ? 4 : 2, peer.id);
    })
  }

  const setStream = (peerId, stream, call, state) => {
    if (stream || call || state) {
      setMembers(prev => prev.map((m) => {
        if (m.peerId === peerId) {
          if (stream && videoRefs.current[peerId]?.ref) {
            videoRefs.current[peerId].ref.current.srcObject = stream;
            if (peerId === peer.id) {
              videoRefs.current[peerId].ref.current.muted = true;
            }
          }
          if (call && videoRefs.current[peerId]?.call) {
            if (videoRefs.current[peerId].call) {
              videoRefs.current[peerId].call.close();
            }
            videoRefs.current[peerId].call = call;
          }
          if (state) m.state = state;
          if (!sharedScreen.current && stream) setMainVideo(stream, m.name, m.state, peerId);
        }
        return m;
      }))
    }
  }

  const setMainVideo = (stream, name, state, peerId) => {
    if (peerId !== mainPeerId) {
      if (stream !== undefined && mainDisplay.current) mainDisplay.current.srcObject = stream;
      name !== undefined && setMainUsername(name);
      state && setMainState(state);
      mainDisplay.current.muted = state !== 5;
      peerId && setMainPeerId(peerId);
    }
  }

  useEffect(() => {
    if (mainDisplay.current) {
      mainDisplay.current.srcObject?.getVideoTracks()[0].addEventListener("ended", () => {
        console.log("ended main display")
        setMainState(2);
      })
    }
  }, [mainDisplay.current])

  useEffect(() => {
    Object.keys(videoRefs.current).forEach(key => {
      if (!members.find(member => member.peerId === key)) {
        delete videoRefs.current[key];
      }
    })
  }, [members])

  useEffect(() => {
    if (peer) {
      screenPeer.current = new Peer(peer.id + "_screen", { host: PEERJS_SERVER });
      
      requestMedia();
      
      socket.current.on("user-joined", (user) => {
        setMembers(prev => [...prev, user]);
      })
      socket.current.on("multi-users-joined", (users) => {
        setMembers(prev => [...prev, ...users]);
      })
      socket.current.on("user-left", (user) => {
        setMembers(prev => prev.filter(u => u.peerId !== user.peerId));
      })
      socket.current.on('signals', (data) => {
        if (data.state < 5) {
          setStream(data.peerId, null, null, data.state);
        }
      });
      socket.current.on("user-ready", (user) => {
        call(user.peerId);
        if (screenStream.current) shareScreen(user.peerId);
      })
      peer.on('call', call => {
        call.answer(mainStream.current);
        call.on('stream', remoteStream => {
          setStream(call.peer, remoteStream, call, remoteStream.getVideoTracks().length > 0 ? 4 : 2);
        });
      });
      screenPeer.current.on('call', call => {
        call.answer();
        call.on('stream', screen => {
          getScreenShare(screen);
        })
      });
      socket.current.emit("am-ready", {roomId, peerId: peer.id, user});
    }
  }, [peer]);

  useEffect(() => {
    socket.current?.emit('send-signal', {
      state: micOn
            ? videoOn ? 4 : 2
            : videoOn ? 3 : 1,
      peerId: peer.id,
    });
  }, [videoOn, micOn]);

  const toggleMic = () => {
    try {
      if (mainStream.current) {
        const audioTrack = mainStream.current.getTracks().find((track) => track.kind === 'audio');
        if (audioTrack) {
          audioTrack.enabled = !audioTrack.enabled;
          setMicOn(audioTrack.enabled);
        }
      } else {
        requestMedia();
      }
    } catch (error) {
      console.log('Error in toggleMic', error);
    }
  };

  const toggleVideo = () => {
    try {
      if (mainStream.current) {
        const videoTrack = mainStream.current.getTracks().find((track) => track.kind === 'video');
        if (videoTrack) {
          videoTrack.enabled = !videoTrack.enabled;
          setVideoOn(videoTrack.enabled);
        }
      } else {
        requestMedia();
      }
    } catch (error) {
      console.log('Error in toggleVideo', error);
    }
  }

  const endCall = () => {
    navigate('/conference');
    window.location.reload();
  }

  return (
    <div className="meet">
      <div className="meet-video">
        <div className="empty-avatar" style={{display: mainState > 2?"none":"flex"}}>
          <p>{mainUsername ? mainUsername.toUpperCase()[0]: "U"}</p>
        </div>
        <video ref={mainDisplay} autoPlay muted style={{visibility: mainState > 2?"visible":"hidden"}}></video>
        <span className="user-name">{mainUsername}</span>
        <div className="meet-options">
          <div className="video-buttons">
            <button onClick={toggleMic} style={micOn?{background: "#e2e2e2"}:null}>{micOn? <AiOutlineAudio/>:<AiOutlineAudioMuted color="white"/>}</button>
            <button onClick={toggleVideo} style={videoOn?{background: "#e2e2e2"}:null}>{videoOn? <BsCameraVideo/>:<BsCameraVideoOff color="white"/>}</button>
            <button onClick={requestScreenShare} style={{background: "#e2e2e2"}}><MdOutlineScreenShare color="#1c1c1c"/></button>
          </div>
          <div className="end-button">
            <button onClick={() => showChat(prev => !prev)} style={{background: "#e2e2e2", position: "relative"}}>
              <TbMessage color="#1c1c1c"/>
              {
                newMsg && <i></i>
              }
            </button>
            <button onClick={() => {
              navigator.clipboard.writeText(window.location.origin + "/conference/" + roomId);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }} style={{background: "#e2e2e2"}}>{copied ? <MdCheck color="green" /> : <MdShare color="#1c1c1c"/>}</button>
            <button onClick={endCall}><MdLogout color="white"/></button>
          </div>
        </div>
      </div>
      <div className="meet-grid">
        {members.map((m, index) => {
          if (videoRefs.current[m.peerId] === undefined) {
            videoRefs.current[m.peerId] = {
              ref: null,
              call: null
            }
          }
          return (
            <VideoCard
              key={index}
              name={m.peerId === peer.id ? "You" : m.name}
              state={m.state}
              videoRef={videoRefs.current[m.peerId]}
              border={mainPeerId === m.peerId}
              onClickCard={() => {
                if (!sharedScreen.current) setMainVideo(videoRefs.current[m.peerId].ref.current.srcObject, m.peerId === peer.id ? "You" : m.name, m.state, m.peerId);
              }}
            />
          )
        })}
      </div>
    </div>
  );
}

export default Video;