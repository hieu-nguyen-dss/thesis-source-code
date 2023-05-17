import React from "react";
import { useNavigate } from "react-router-dom";

const overwriteCss = `
  .sidebarOption {
    display: flex;
    align-items: center;
    font-size: 12px;
    padding-left: 2px;
    cursor: pointer;
  }

  .sidebarOption:hover {
    opacity: 0.9;
    background-color: #340e26;
  }

  .sidebarOption_icon {
    padding: 10px;
    font-size: 15px !important;
  }

  .sidebarOption_channel {
    padding: 10px, 0;
  }

  .sidebarOption_hash {
    padding: 10px;
  }

  .sidebarOption > h3 {
    font-weight: 500;
  }
`;

function SidebarOption({ Icon, title, id, addChannelOption }) {
  const navigate = useNavigate();

  const selectChannel = () => {
    console.log("clicked on SelectChannel");
    if (id) {
      navigate(`/room/${id}`);
    } else {
      navigate.push("title");
    }
  };

  const addChannel = () => {
    console.log("clicked on addChannel");
    const channelName = prompt("Please enter the channel name!");
  };

  return (
    <div
      className="sidebarOption"
      // ternary condition will not executed in right way
      onClick={addChannelOption ? addChannel : selectChannel}
    >
      {Icon && <Icon className="sidebarOption_icon" />}
      {Icon ? (
        <h3>{title}</h3>
      ) : (
        <h3 className="sidebarOption_channel">
          <span className="sidebarOption_hash">#</span> {title}{" "}
        </h3>
      )}
      <style type="text/css">{overwriteCss}</style>
    </div>
  );
}
export default SidebarOption;
