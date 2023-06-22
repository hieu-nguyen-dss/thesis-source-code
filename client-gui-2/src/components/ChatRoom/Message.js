import React from "react";
import { Avatar, Typography } from "antd";
import styled from "styled-components";
import { formatRelative } from "date-fns/esm";

const WrapperStyled = styled.div`
  margin-bottom: 10px;

  .author {
    margin-left: 5px;
    font-weight: bold;
  }

  .date {
    margin-left: 10px;
    font-size: 11px;
    color: #a7a7a7;
  }

  .content {
    margin-left: 30px;
  }
`;

function formatDate(seconds) {
  let formattedDate = "";

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());

    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
}

export default function Message({
  text,
  displayName,
  createdAt,
  photoURL,
  fileUrl,
  fileName,
}) {
  return (
    <WrapperStyled>
      <div>
        <Avatar size="small" src={photoURL}>
          {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className="author">{displayName}</Typography.Text>
        <Typography.Text className="date">
          {formatDate(createdAt?.seconds)}
        </Typography.Text>
      </div>
      <div>
        {text && <Typography.Text className="content">{text}</Typography.Text>}
        {fileUrl && fileName && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: "30px" }}
          >
            <img
              src={`${fileUrl}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${fileUrl}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={fileName}
              loading="lazy"
              width={150}
              height={100}
            />
          </a>
        )}
      </div>
    </WrapperStyled>
  );
}
