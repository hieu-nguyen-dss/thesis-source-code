import { Typography, Box } from "@mui/material";
import vars from "../config/vars";

const notifType = {
  CMT_RM: "Comment roadmap",
  CMT_LP: "Comment learningpath",
  ADD_RM_CL: "Add roadmap outcome",
  DONE_RM_CL: "Done roadmap outcome",
  FOLLOW_RM: "Follow roadmap",
  STAR_RM: "Star roadmap",
  STAR_LP: "Star learning path",
};

const parseNotif = (data) => {
  const primary = data.notifType;
  let secondary = (
    <>
      <label style={{ fontWeight: "bold", marginRight: 4 }}>
        {data.sender.name}
      </label>
      <label style={{ marginRight: 4 }}>{data.notifType}</label>
      <label style={{ fontWeight: "bold", marginRight: 4 }}>
        {data.roadmap ? data.roadmap.name : ""}
      </label>
      <label style={{ fontWeight: "bold", marginRight: 4 }}>
        {data.learningPath ? data.learningPath.name : ""}
      </label>
    </>
  );
  if (
    data.notifType === notifType.ADD_RM_CL ||
    data.notifType === notifType.DONE_RM_CL
  ) {
    secondary = (
      <>
        <label style={{ fontWeight: "bold", marginRight: 4 }}>
          {data.sender.name}
        </label>
        <label style={{ marginRight: 4 }}>{data.notifType}</label>
        <label style={{ fontWeight: "bold", marginRight: 4 }}>
          {data.content.itemName}
        </label>
        <label style={{ marginRight: 4 }}>for step</label>
        <label style={{ marginRight: 4, fontWeight: "bold" }}>
          {" "}
          {data.content.stepName}
        </label>
        <label style={{ marginRight: 4 }}>of roadmap</label>
        <label style={{ fontWeight: "bold" }}> {data.roadmap.name}</label>
      </>
    );
  }
  const date = new Date(data.createdAt).toLocaleString();
  const avatarSrc = `${vars.server}/resources/avatars/${data.sender._id}/64x64${data.sender.avatar}`;
  return {
    sender: data.sender,
    primary,
    secondary,
    date,
    avatarSrc,
  };
};

export default parseNotif;
