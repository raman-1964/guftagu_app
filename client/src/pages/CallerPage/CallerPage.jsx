import React, { useEffect, useRef, useState } from "react";
import styles from "./CallerPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import phone from "../../assets/img/phone.png";
import mic from "../../assets/img/mic.png";
import muteIcon from "../../assets/img/muteIcon.png";
import camera from "../../assets/img/camera.png";
import cameraClosed from "../../assets/img/VideoClosedIcon.png";
import { ReactComponent as Close } from "../../assets/svg/close.svg";
import { useNavigate, useParams } from "react-router-dom";
import { destroyConnection } from "../../store/Actions/socket-call";
import { toast } from "react-toastify";
import { defaultToastSetting } from "../../utils/constants";

const CallerPage = () => {
  const { user } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const localRef = useRef(null);
  const remoteRef = useRef(null);

  const [audioTrack, setAudioTrack] = useState(true);
  const [videoTrack, setVideoTrack] = useState(true);
  const [callDeclined, setCallDeclined] = useState(false);
  const [waitToJoin, setWaitToJoin] = useState(true);

  const { socket, connection, remoteStream } = useSelector(
    (state) => state.socketCallReducer
  );

  const toggleCamera = () => {
    let vidTrack = localRef.current.srcObject
      .getTracks()
      .find((track) => track.kind === "video");
    if (vidTrack.enabled) {
      vidTrack.enabled = false;
      setVideoTrack(false);
    } else {
      vidTrack.enabled = true;
      setVideoTrack(true);
    }
  };

  const toggleAudio = () => {
    let audioTrack = localRef.current.srcObject
      .getTracks()
      .find((track) => track.kind === "audio");
    if (audioTrack.enabled) {
      audioTrack.enabled = false;
      setAudioTrack(false);
    } else {
      audioTrack.enabled = true;
      setAudioTrack(true);
    }
  };

  const cutCall = () => {
    dispatch(destroyConnection());
    connection.destroy();
    socket.emit("cut-call", { room: user });
    navigate("/chat");
  };

  useEffect(() => {
    if (connection) localRef.current.srcObject = connection.getLocalStream();
  }, []);

  useEffect(() => {
    if (socket) {
      async function recieveAnswer(answer) {
        setWaitToJoin(false);
        if (connection) await connection.answeRecieved(answer);
      }

      function offerDeclined() {
        toast.warning("call declined", defaultToastSetting);
        setWaitToJoin(false);
        setCallDeclined(true);
      }

      function callCuted() {
        dispatch(destroyConnection());
        connection.destroy();
        toast.warning("call ended", defaultToastSetting);
        navigate("/chat");
      }

      socket.on("answer", recieveAnswer);
      socket.on("decline-offer", offerDeclined);
      socket.on("cut-call", callCuted);

      return () => {
        socket.off("answer", recieveAnswer);
        socket.off("decline-offer", offerDeclined);
        socket.off("cut-call", callCuted);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (remoteRef.current) remoteRef.current.srcObject = remoteStream;
  }, [remoteStream?.id]);

  return (
    <div className={styles.callerContainer}>
      <div className={styles.videoCont}>
        {connection?.callConfig?.video ? (
          <>
            <video
              className={styles.localVideo}
              width="250px"
              height="250px"
              ref={localRef}
              autoPlay={true}
            ></video>
            <video
              className={styles.remoteVideo}
              width="250px"
              height="250px"
              ref={remoteRef}
              autoPlay={true}
            ></video>
          </>
        ) : (
          <>
            <audio
              className={styles.remoteVideo}
              autoPlay={true}
              ref={localRef}
            ></audio>
            <div className={styles.userImg}></div>
            <audio
              className={styles.remoteVideo}
              autoPlay={true}
              ref={remoteRef}
            ></audio>
          </>
        )}
      </div>

      <div className={styles.controlCont}>
        {!callDeclined ? (
          <>
            {connection?.callConfig?.video ? (
              <img
                src={videoTrack ? camera : cameraClosed}
                className={`${styles.camera} ${styles.icon} ${
                  !videoTrack && styles.offIcon
                }`}
                onClick={() => toggleCamera()}
              />
            ) : null}

            <img
              src={audioTrack ? mic : muteIcon}
              className={`${styles.mic} ${styles.icon} ${
                !audioTrack && styles.offIcon
              }`}
              onClick={() => toggleAudio()}
            />
            <img
              src={phone}
              className={`${styles.phone} ${styles.icon}`}
              onClick={() => cutCall()}
            />
          </>
        ) : (
          <>
            <div className={styles.iconCont}>
              <img
                src={phone}
                className={` ${styles.icon}`}
                onClick={() => {
                  setCallDeclined(false);
                  connection.callAgain();
                }}
              />
              <p>call again</p>
            </div>
            <div className={styles.iconCont}>
              <Close
                className={`${styles.phone} ${styles.icon}`}
                onClick={() => {
                  connection.destroy();
                  dispatch(destroyConnection());
                  navigate("/chat");
                }}
              />
              <p>cancel</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CallerPage;
