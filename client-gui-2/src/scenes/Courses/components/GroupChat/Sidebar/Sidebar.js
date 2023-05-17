import React, { useState } from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CreateIcon from "@mui/icons-material/Create";
import SidebarOption from "./SidebarOption";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AppsIcon from "@mui/icons-material/Apps";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";

const overwriteCss = `
  .sidebar {
    color: white;
    flex: 0.3;
    background-color: var(--slack-color);
    border-top: 1px solid #49274b;
    max-width: 260px;
  }

  .sidebar > hr {
    margin-top: 10px;
    margin-bottom: 10px;
    border: 1px solid #49274b;
  }

  .sidebar_header {
    display: flex;
    border-bottom: 1px solid #49274b;
    padding-bottom: 10px;
    padding: 13px;
  }

  .sidebar_info {
    flex: 1;
  }

  .sidebar_info > h2 {
    font-size: 15px;
    font-weight: 900;
    margin-bottom: 5px;
  }

  .sidebar_info > h3 {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 400;
  }

  .sidebar_info > h3 > .MuiSvgIcon-root {
    font-size: 14px;
    margin-top: 1px;
    margin-right: 2px;
    color: green;
  }

  .sidebar_header > .MuiSvgIcon-root {
    padding: 8px;
    color: #49274b;
    font-size: 18px;
    background-color: white;
    border-radius: 999px;
  }
`;

function Sidebar() {
  const [channels, setChannels] = useState([]);
  const [user, setUser] = useState([]);

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <div className="sidebar_info">
          <h2>{user?.displayName}</h2>
          <h3>
            <FiberManualRecordIcon />
            {user?.displayName}
          </h3>
        </div>
        <CreateIcon />
      </div>
      <SidebarOption Icon={InsertCommentIcon} title={"Thread"} />
      <SidebarOption Icon={InboxIcon} title={"Mentions & reactions"} />
      <SidebarOption Icon={DraftsIcon} title={"Saved items"} />
      <SidebarOption Icon={BookmarkBorderIcon} title={"Channel browser"} />
      <SidebarOption Icon={PeopleAltIcon} title={"People & user groups"} />
      <SidebarOption Icon={AppsIcon} title={"Apps"} />
      <SidebarOption Icon={FileCopyIcon} title={"File browser"} />
      <SidebarOption Icon={ExpandLessIcon} title={"Show less"} />
      <hr />
      <SidebarOption Icon={ExpandMoreIcon} title={"Channels"} />
      <hr />
      <SidebarOption Icon={AddIcon} title={"Add Channel"} addChannelOption />
      {/* Connect db and list all the channels */}
      {channels.map((channel) => (
        <SidebarOption title={channel.name} id={channel.id} />
      ))}
      {/* SidebarOptions... */}
      <style type="text/css">{overwriteCss}</style>
    </div>
  );
}

export default Sidebar;
