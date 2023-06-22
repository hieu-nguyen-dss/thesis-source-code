import React from "react";
import { Avatar, Typography } from "antd";
import { Button } from "@mui/material";
import styled from "styled-components";

import { auth } from "../../firebase/config";
import { AuthContext } from "../../contexts/AuthProvider";
import { AppContext } from "../../contexts/AppProvider";

const WrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(82, 38, 83);
  height: 100%;
  .username {
    color: black;
    margin-left: 5px;
  }
`;

export default function UserInfo() {
  const {
    user: { displayName, photoURL },
  } = React.useContext(AuthContext);
  const { clearState } = React.useContext(AppContext);

  return (
    <WrapperStyled>
      <div>
        <Avatar src={photoURL}>
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className="username">{displayName}</Typography.Text>
      </div>
      <Button
        variant="outlined"
        onClick={() => {
          clearState();
          auth.signOut();
        }}
      >
        Logout
      </Button>
    </WrapperStyled>
  );
}
