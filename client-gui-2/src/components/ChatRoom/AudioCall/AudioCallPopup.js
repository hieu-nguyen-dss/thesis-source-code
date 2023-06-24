import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase/config";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import { Avatar, Modal, Select, Row, Col, Typography } from "antd";
import { FiMicOff, FiLogOut } from "react-icons/fi";
import { BsFillMicFill } from "react-icons/bs";

let client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

const overwriteCss = `
.video-material {
  font-family: sans-serif;
  text-align: center;
}

.modal__bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(28, 28, 28, 0.19);
  backdrop-filter: blur(6px);
  opacity: 1;
  animation-timing-function: ease-out;
  animation-duration: 0.3s;
  animation-name: modal-video;
  -webkit-transition: opacity 0.3s ease-out;
  -moz-transition: opacity 0.3s ease-out;
  -ms-transition: opacity 0.3s ease-out;
  -o-transition: opacity 0.3s ease-out;
  transition: opacity 0.3s ease-out;
  z-index: 100;
}

.modal__align {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.modal__content {
  width: 800px;
  height: 700px;
  box-shadow: 0px 100px 80px rgba(184, 184, 184, 0.07),
    0px 25.8162px 19px 4px rgba(178, 178, 178, 0.0456112),
    0px 7.779px 7.30492px rgba(0, 0, 0, 0.035),
    0px 1.48838px 2.0843px rgba(0, 0, 0, 0.0243888);
  border-radius: 20px;
  background: whitesmoke;
  color: #000;
  margin: 0rem 4rem;
}

.modal__close {
  background-color: white;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  bottom: 50px;
  width: 32px;
  height: 32px;
  padding: 0;
}

.modal__video-align {
  display: flex;
  flex-direction: column;
  position: relative;
  bottom: 37px;

  article {
    
  }
}

.modal__video-style {
  border-radius: 20px;
  z-index: 100;
}

.modal__spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.modal__spinner {
  animation: spin 2s linear infinite;
  font-size: 40px;
  color: #1b6aae;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media screen and (max-width: 800px) {
  .modal__content {
    margin: 0rem 1rem;
    width: 100%;
  }
  .modal__video-style {
    width: 100%;
  }
}

@media screen and (max-width: 499px) {
  .modal__content {
    background: transparent;
    height: auto;
  }
  .modal__video-align {
    bottom: 0px;
  }
  .modal__video-style {
    height: auto;
  }
}  
`;

const AudioCallPopup = (props) => {
  const { selectedRoomId, setModal } = props;

  const [load, setLoad] = useState(false);
  const [conn_state, setConn_state] = useState("");
  const [mute, setMute] = useState(false);
  const [state, setState] = useState(false);
  const [profiles, setProfiles] = useState([
    "speech_low_quality",
    "speech_standard",
    "music_standard",
    "standard_stereo",
    "high_quality",
    "high_quality_stereo",
  ]);

  const [active, setActive] = useState([]);
  const [stream, setstream] = useState();
  const [stream_id, setStreamId] = useState(0);
  const [hostId, setHostId] = useState("");

  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);

  const join = async () => {
    setLoad(true);
    client
      .join("599eae65a4e64f5880b2fd803c5de24e", selectedRoomId, null, null)
      .then(async () => {
        setMute(false);
        setStreamId(uid);
        let new_active = active.filter((user) => user.uid !== uid);
        new_active.push({
          uid: uid,
          pic: photoURL,
          name: displayName,
        });
        await updateDoc(doc(db, "rooms", selectedRoomId), {
          membersCall: new_active,
        })
          .then(async () => {
            const localStream = await AgoraRTC.createMicrophoneAudioTrack();
            setstream(localStream);
            localStream.play("local-audio");
            setLoad(false);
            setConn_state(client.connectionState);
            setStreamId(uid);
          })
          .catch((e) => setLoad(false));
      });
  };
  useEffect(() => {
    join();
  }, []);

  useEffect(() => {
    window.onbeforeunload = (event) => {
      const e = event || window.event;
      e.preventDefault();
      if (e) {
        e.returnValue = "";
      }
      return "";
    };
    setstream(null);
    onSnapshot(doc(db, "rooms", selectedRoomId), (room) => {
      setActive(room?.data()?.membersCall);
      setHostId(room?.data()?.owner.uid);
    });

    return () =>
      client
        .leave()
        .then(() => {
          stream.stop();
          updateDoc(doc(db, "rooms", selectedRoomId), {
            membersCall: active.filter((member) => member.uid !== stream_id),
          })
            .then(() => {
              console.log("Close");
            })
            .catch((error) => {
              console.log("Error updating data in Firestore:", error);
            });
        })
        .catch((error) => {
          console.log("Leaving the channel failed:", error);
        });
  }, []);

  return (
    <div className="video-material">
      <section className="modal__bg">
        <div className="modal__align">
          <div className="modal__content" modal={true}>
            <IoCloseOutline
              className="modal__close"
              arial-label="Close modal"
              onClick={() => setModal(false)}
            />
            <div className="modal__video-align">
              {load ? (
                <div className="modal__spinner">
                  <BiLoaderAlt className="modal__spinner-style" fadeIn="none" />
                </div>
              ) : (
                <>
                  <Modal
                    title="Audio profile"
                    onOk={state}
                    onCancel={() => setState(false)}
                  >
                    <Select
                      placeholder="Choose profile"
                      onChange={(e) => stream.setAudioProfile(e)}
                    >
                      {profiles.map((profile, i) => (
                        <Select.Option key={i} value={profile}>
                          {profile.split("_").join(" ")}
                        </Select.Option>
                      ))}
                    </Select>
                  </Modal>
                  {conn_state === "CONNECTED" && (
                    <>
                      <Typography
                        style={{
                          fontSize: "18px",
                          padding: "20px",
                          textTransform: "capitalize",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        participants
                      </Typography>
                      <Row
                        style={{ height: "550px", marginTop: "20px" }}
                        gutter={{
                          xs: 8,
                          sm: 16,
                          md: 24,
                          lg: 32,
                        }}
                      >
                        {active.map((person, i) => (
                          <Col key={i} span={6}>
                            <div
                              style={{
                                margin: "0 auto",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Avatar
                                src={person.pic}
                                alt="pic"
                                size="medium"
                              />
                              <p style={{ textAlign: "center" }}>
                                {person?.name}
                              </p>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </>
                  )}
                  {stream && (
                    <div
                      style={{
                        marginBottom: "0px",
                        padding: 10,
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: "30px",
                      }}
                    >
                      <div>
                        {mute ? (
                          <FiMicOff
                            color="red"
                            onClick={() => {
                              stream.setEnabled(true);
                              setMute(false);
                            }}
                            size={32}
                          />
                        ) : (
                          <BsFillMicFill
                            onClick={() => {
                              stream.setEnabled(false);
                              setMute(true);
                            }}
                            size={32}
                          />
                        )}
                      </div>
                      <FiLogOut
                        size={32}
                        color="red"
                        onClick={() => {
                          client
                            .leave()
                            .then(() => {
                              stream.setEnabled(false);
                              stream.stop();
                              setstream(null);
                              setConn_state(undefined);
                              updateDoc(doc(db, "rooms", selectedRoomId), {
                                membersCall: active.filter(
                                  (member) => member.uid !== stream_id
                                ),
                              })
                                .then(() => {
                                  setModal(false);
                                })
                                .catch((error) => {
                                  console.log(
                                    "Error updating data in Firestore:",
                                    error
                                  );
                                });
                            })
                            .catch((error) => {
                              console.log("Leaving the channel failed:", error);
                            });
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <style type="text/css">{overwriteCss}</style>
    </div>
  );
};

export default AudioCallPopup;
