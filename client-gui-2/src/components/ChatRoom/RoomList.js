import React from "react";
import { Collapse, Typography, Button, Modal } from "antd";
import styled from "styled-components";
import { PlusSquareOutlined } from "@ant-design/icons";
import { AppContext } from "../../contexts/AppProvider";
import AudioCall from "./AudioCall";
const { Panel } = Collapse;

const PanelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: black;
    }

    .ant-collapse-content-box {
      padding: 0 40px;
    }

    .add-room {
      color: black;
      padding: 0;
    }
  }

  .box-room {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .toggle {
      cursor: pointer;
      display: inline-block;
    }

    .toggle-switch {
      display: inline-block;
      background: #ccc;
      border-radius: 16px;
      width: 58px;
      height: 32px;
      position: relative;
      vertical-align: middle;
      transition: background 0.25s;
    }
    .toggle-switch:before,
    .toggle-switch:after {
      content: "";
    }
    .toggle-switch:before {
      display: block;
      background: linear-gradient(to bottom, #fff 0%, #eee 100%);
      border-radius: 50%;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
      width: 24px;
      height: 24px;
      position: absolute;
      top: 4px;
      left: 4px;
      transition: left 0.25s;
    }
    .toggle:hover .toggle-switch:before {
      background: linear-gradient(to bottom, #fff 0%, #fff 100%);
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
    }
    .toggle-checkbox-checked {
      background: #56c080;
    }
    .toggle-checkbox-checked:before {
      left: 30px;
    }

    .toggle-checkbox {
      position: absolute;
      visibility: hidden;
    }

    .toggle-label {
      margin-left: 5px;
      position: relative;
      top: 2px;
    }
  }
  .ant-modal-footer {
    display: none;
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: black;
`;

export default function RoomList() {
  const { rooms, setIsAddRoomVisible, setSelectedRoomId, selectedRoomId } =
    React.useContext(AppContext);

  const handleAddRoom = () => {
    setIsAddRoomVisible(true);
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Collapse ghost defaultActiveKey={["1"]}>
      <PanelStyled header="Danh sách các phòng" key="1">
        {rooms.map((room, key) => (
          <div className="box-room" key={key}>
            <LinkStyled
              key={room.id}
              onClick={() => setSelectedRoomId(room.id)}
            >
              {"# " + room.name}
            </LinkStyled>
            {selectedRoomId === room.id && (
              <div key={key}>
                <label className="toggle">
                  <input className="toggle-checkbox" type="checkbox" />
                  <div
                    className={
                      isModalOpen
                        ? "toggle-switch toggle-checkbox-checked"
                        : "toggle-switch"
                    }
                    onClick={showModal}
                  ></div>
                </label>
              </div>
            )}
          </div>
        ))}
        <Button
          type="text"
          icon={<PlusSquareOutlined />}
          className="add-room"
          onClick={handleAddRoom}
        >
          Thêm phòng
        </Button>
        <Modal
          className="audio-call"
          title="Audio Call"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={"90%"}
        >
          <AudioCall
            setIsModalOpen={setIsModalOpen}
            selectedRoomId={selectedRoomId}
          />
        </Modal>
      </PanelStyled>
    </Collapse>
  );
}
