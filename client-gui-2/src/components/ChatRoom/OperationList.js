import React from "react";
import { Collapse } from "antd";
import styled from "styled-components";
import { AppContext } from "../../contexts/AppProvider";
import { BiNote } from "react-icons/bi";
import { useParams, useLocation } from "react-router-dom";

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
  .box {
    display: flex,
    flex-direction: column;
    align-items: center;
    .box-room {
      margin-bottom: 5px;
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
        width: 40px;
        height: 20px;
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
        width: 15px;
        height: 15px;
        position: absolute;
        top: 2px;
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
        left: 20px;
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
  }
`;

export default function OperationList({ isModalOpen, setIsModalOpen }) {
  const location = useLocation();
  const { name, courseName } = location.state;
  console.log("name: ", location.state);
  const { id } = useParams();
  const { selectedRoomId } = React.useContext(AppContext);
  const showModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <Collapse ghost defaultActiveKey={["1"]}>
      <PanelStyled header="Operations" key="1">
        <div className="box">
          <div className="box-room">
            <span>Voice call</span>
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
          <div className="box-room">
            <span>Taking note</span>
            <BiNote
              size="20"
              style={{
                marginLeft: "10px",
                cursor: "pointer",
                color: "#7b96ec",
                fontWeight: "700",
              }}
              onClick={() =>
                window.open(
                  `/courses/${id}/note-sharing?courseName=${courseName}&name=${name}&room=${selectedRoomId}`,
                  "_blank"
                )
              }
            />
          </div>
        </div>
      </PanelStyled>
    </Collapse>
  );
}
