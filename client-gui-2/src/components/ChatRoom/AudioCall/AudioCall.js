import { useEffect } from "react";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../../firebase/config";
import { Avatar, Modal, Select, Row, Col, Typography, Button } from "antd";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import AgoraRTC from "agora-rtc-sdk-ng";
import { FiMicOff, FiLogOut } from "react-icons/fi";
import { BsFillMicFill } from "react-icons/bs";

const AudioCall = ({
  setIsModalOpen,
  selectedRoomId,
  stream,
  setstream,
  stream_id,
  setStreamId,
  active,
  setActive,
  client,
}) => {
  const id = selectedRoomId;
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

  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);

  const join = async () => {
    setLoad(true);
    client
      .join("599eae65a4e64f5880b2fd803c5de24e", id, null, null)
      .then(async () => {
        setMute(false);
        setStreamId(uid);
        let new_active = active.filter((user) => user.uid !== uid);
        new_active.push({
          uid: uid,
          pic: photoURL,
          name: displayName,
        });
        await updateDoc(doc(db, "rooms", id), {
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

  return (
    <div>
      <Modal
        title="Audio profile"
        onOk={state}
        onCancel={() => setState(false)}
      >
        <Select
          placeholder="Choose profile"
          onChange={(e) => stream.setAudioProfile(e)}
        >
          {console.log("TADA profiles", profiles)}
          {profiles.map((profile, i) => (
            <Select.Option key={i} value={profile}>
              {profile.split("_").join(" ")}
            </Select.Option>
          ))}
        </Select>
      </Modal>
      {console.log("TADA conn_state", conn_state)}
      {conn_state === "CONNECTED" && (
        <div>
          <Typography
            style={{
              textTransform: "capitalize",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            participants
          </Typography>
          <div id="me"></div>
          <div id="remote"></div>
          <Row
            style={{ marginTop: "50px" }}
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
                  <Avatar src={person.pic} alt="pic" size="medium" />
                  <p style={{ textAlign: "center" }}>
                    {person?.name?.split(" ")[0]}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}
      {console.log("TADA stream", stream)}
      {stream && (
        <div>
          <div
            style={{
              marginTop: "100px",
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
                    updateDoc(doc(db, "rooms", id), {
                      membersCall: active.filter(
                        (member) => member.uid !== stream_id
                      ),
                    })
                      .then(() => {
                        setIsModalOpen(false);
                      })
                      .catch((error) => {
                        console.log("Error updating data in Firestore:", error);
                      });
                  })
                  .catch((error) => {
                    console.log("Leaving the channel failed:", error);
                  });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioCall;
