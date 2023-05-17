import * as React from "react";
import LoginGroupChat from "../../../../components/Login";
import ChatRoom from "../../../../components/ChatRoom";
import { AuthContext } from "../../../../contexts/AuthProvider";

const GroupActivity = () => {
  const {
    user: { uid },
  } = React.useContext(AuthContext);
  console.log("uid: ", uid);
  return uid ? <ChatRoom /> : <LoginGroupChat />;
};
export default GroupActivity;
