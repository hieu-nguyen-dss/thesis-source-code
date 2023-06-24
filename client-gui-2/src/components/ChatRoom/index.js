import React from "react";
import { Row, Col } from "antd";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import styled from "styled-components";
import AudioCallPopup from "./AudioCall/AudioCallPopup";
import { useParams } from "react-router-dom";

const RowCustom = styled(Row)`
  width: 96%;
  margin: 0 auto;
  border: 1px solid gray;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  height: auto;
  overflow: hidden;
  box-sizing: border-box;
`;

const ChatRoom = () => {
  const { roomId } = useParams();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  return (
    <>
      <RowCustom>
        <Col span={6}>
          <Sidebar isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </Col>
        <Col span={18}>
          <ChatWindow />
        </Col>
      </RowCustom>
      {isModalOpen && (
        <AudioCallPopup selectedRoomId={roomId} setModal={setIsModalOpen} />
      )}
    </>
  );
};

export default ChatRoom;
