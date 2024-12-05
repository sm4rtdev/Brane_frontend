import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import "./VideoConferencePage.scss";

const uuid = v4();

const VideoConference = () => {
  const [id, setId] = useState("");
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <button
        onClick={() => {
          navigate(`/conference/${uuid}`, {state:{host:true}});
        }}
      >Create conference</button>
      <input type="text" placeholder="Enter conference ID" onChange={(e) => setId(e.target.value)} value={id} />
      <button
        onClick={() => {
          navigate(`/conference/${id}`, {state:{host:false}});
        }}
      >Join conference</button>
    </div>
  )
}
export default VideoConference;