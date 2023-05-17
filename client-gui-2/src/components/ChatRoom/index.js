import React from "react";
import { Row, Col } from "antd";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

export default function ChatRoom() {
  return (
    <>
      <Row
        style={{
          border: "1px solid transparent",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
        }}
      >
        <Col span={6}>
          <Sidebar />
        </Col>
        <Col span={18}>
          <ChatWindow />
        </Col>
      </Row>
    </>
  );
}
