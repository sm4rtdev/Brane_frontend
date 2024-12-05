import { useEffect, useRef } from "react";
import './VideoChat.scss';

const VideoCard = ({name, state, videoRef, onClickCard, border}) => {
  const ref = useRef();

  useEffect(() => {
    videoRef.ref = ref;
  }, [])

  return (
    <div className="video-card" style={border?{border: "2px solid #00adfd"}:{}} onClick={onClickCard}>
      <div className="empty-avatar" style={{display: state > 2?"none":"flex"}}>
        <p>{name ? name.toUpperCase()[0]: "U"}</p>
      </div>
      <video ref={ref} autoPlay style={{visibility: state > 2?"visible":"hidden"}}></video>
      <span className="user-name">{name}</span>
    </div>
  )
}

export default VideoCard;