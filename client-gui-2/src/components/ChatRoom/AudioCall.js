import { useEffect } from "react";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase/config";
import {
  Spin,
  Avatar,
  Modal,
  Select,
  Row,
  Col,
  Typography,
  Button,
} from "antd";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import AgoraRTC from "agora-rtc-sdk-ng";
import { FiMicOff, FiLogOut } from "react-icons/fi";
import { BsFillMicFill } from "react-icons/bs";
let client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

const AudioCall = ({ setIsModalOpen, selectedRoomId }) => {
  const id = selectedRoomId;
  const [load, setLoad] = useState(false);
  const [active, setActive] = useState([]);
  const [conn_state, setConn_state] = useState("");
  const [stream_id, setStreamId] = useState(0);
  const [mute, setMute] = useState(false);
  const [stream, setstream] = useState();
  const [state, setState] = useState(false);
  const [profiles, setProfiles] = useState([
    "speech_low_quality",
    "speech_standard",
    "music_standard",
    "standard_stereo",
    "high_quality",
    "high_quality_stereo",
  ]);
  const [hostId, setHostId] = useState("");

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
    window.onbeforeunload = (event) => {
      const e = event || window.event;
      console.log("hey");
      e.preventDefault();
      if (e) {
        e.returnValue = "";
        console.log("ehy");
      }
      return "";
    };
    setstream(null);
    onSnapshot(doc(db, "rooms", id), (room) => {
      setActive(room?.data()?.membersCall);
      setHostId(room?.data()?.owner.uid);
    });
    // AgoraRTC.getDevices((devices) => {
    //   setAudio_input([]);
    //   setaudio_output([]);
    //   devices.forEach((device) => {
    //     if (device.kind === "audioinput") {
    //       setAudio_input((p) => [...p, device]);
    //     } else if (device.kind === "audiooutput") {
    //       setaudio_output((p) => [...p, device]);
    //     }
    //   });
    // });
    // client.on("stream-added", function (evt) {
    //   client.subscribe(evt.stream, handleError);
    // });
    // client.on("stream-subscribed", function (evt) {
    //   let stream = evt.stream;
    //   let streamId = String(stream?.getId());
    //   addVideoStream(streamId);
    //   stream.play(streamId);
    // });
    // client.on("connection-state-change", (evt) => {
    //   setConn_state(evt.curState);
    // });
    // client.on("stream-removed", async function (evt) {
    //   let stream = evt.stream;
    //   let streamId = String(stream?.getId());
    //   stream.close();
    //   const data = await getDoc(doc(db, "rooms", localStorage.getItem("ID")));
    //   updateDoc(doc(db, "rooms", localStorage.getItem("ID")), {
    //     membersCall: data
    //       .data()
    //       ?.members.filter(
    //         (member) =>
    //           member.uid !== parseInt(localStorage.getItem("streamId"))
    //       ),
    //   })
    //     .then(() => localStorage.removeItem("streamId"))
    //     .catch((e) => console.log(e));
    //   removeVideoStream(streamId);
    // });
    // client.on("peer-leave", async function (evt) {
    //   let stream = evt.stream;
    //   let streamId = String(stream.getId());
    //   stream.close();
    //   const data = await getDoc(doc(db, "rooms", localStorage.getItem("ID")));
    //   updateDoc(doc(db, "rooms", localStorage.getItem("ID")), {
    //     membersCall: data
    //       .data()
    //       ?.members.filter(
    //         (member) =>
    //           member.uid !== parseInt(localStorage.getItem("streamId"))
    //       ),
    //   })
    //     .then(() => localStorage.removeItem("streamId"))
    //     .catch((e) => console.log(e));
    //   removeVideoStream(streamId);
    // });
    return () =>
      client
        .leave()
        .then(() => {
          stream.stop();
          updateDoc(doc(db, "rooms", id), {
            membersCall: active.filter((member) => member.uid !== stream_id),
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
  }, []);

  if (load) return <Spin size="large">Joining</Spin>;

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
          {profiles.map((profile, i) => (
            <Select.Option key={i} value={profile}>
              {profile.split("_").join(" ")}
            </Select.Option>
          ))}
        </Select>
      </Modal>
      {conn_state === "CONNECTED" ? (
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
      ) : (
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button onClick={() => join()} type="primary">
            Join
          </Button>
        </div>
      )}
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
