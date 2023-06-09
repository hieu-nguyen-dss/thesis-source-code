import React from "react";
import { Row, Col } from "antd";
import UserInfo from "./UserInfo";
import OperationList from "./OperationList";
import styled from "styled-components";

const SidebarStyled = styled.div`
  background: #eaded7;
  color: black;
  height: 85vh;
`;

export default function Sidebar({ isModalOpen, setIsModalOpen }) {
  return (
    <SidebarStyled>
      <Row>
        <Col span={24}>
          <UserInfo />
        </Col>
        <Col span={24}>
          <OperationList
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </Col>
      </Row>
    </SidebarStyled>
  );
}
