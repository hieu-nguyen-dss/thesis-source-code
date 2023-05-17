import * as React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
const GroupChat = () => {
  const { id } = useParams();
  return (
    <>
      <Sidebar />
    </>
  );
};

export default GroupChat;
