import { UserAddOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button, Tooltip, Avatar } from "antd";
import TextField from "@mui/material/TextField";
import Message from "./Message";
import { AppContext } from "../../contexts/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../contexts/AuthProvider";
import useFirestore from "../../hooks/useFirestore";
import { storage } from "../../firebase/config";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { useParams } from "react-router-dom";

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 61px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgba(82, 38, 83);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100%;
`;

const ContentStyled = styled.div`
  height: calc(100% - 62px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: whitesmoke;
  box-sizing: border-box;
`;

const FormStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 2px 2px 2px 0;
  border-radius: 2px;
  position: relative;
  background: white;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }

  button {
    background-color: #7b96ec;
    color: white;
    padding: 10px;
    font-weight: bold;
    border: none;
    cursor: pointer;
  }

  label {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #8da4f1;
    font-size: 12px;
    cursor: pointer;

    img {
      width: 32px;
    }
  }

  .file-attach {
    position: absolute;
    display: flex;
    flex-direction: row;
    right: 0;
    widht: auto;
    top: 5px;
  }

  .css-wb57ya-MuiFormControl-root-MuiTextField-root {
    padding: 3px 0px;
    box-sizing: border-box;
  }
  .css-8ewcdo-MuiInputBase-root-MuiOutlinedInput-root {
    border-radius: 10px;
    padding: 6px 4px;
    width: 100%;
    margin: 0 auto;
    margin-right: 20px;
  }
  .file-display {
    position: absolute;
    left: 170px;
    cursor: pointer;
    border: 1px solid #495057;
    padding: 10px 0;
    padding-left: 10px;
    padding-right: 80px;
    border-radius: 10px;
    .close-icon {
      display: none;
      position: absolute;
      top: -10px;
      right: -10px;
      z-index: 1000;
      background-color: white;
      border: 1px solid transparent;
      border-radius: 30px;
    }
    &:hover .close-icon {
      display: block;
    }
  }
  .image-display {
    position: absolute;
    left: 150px;
    cursor: pointer;
    &:hover .background {
      display: block;
    }

    &:hover .close-icon {
      display: block;
    }

    .background {
      display: none;
      background-color: #4950576b;
      width: 100px;
      height: 60px;
      position: absolute;
      z-index: 700;
    }
    .close-icon {
      display: none;
      position: absolute;
      top: -10px;
      right: -10px;
      z-index: 1000;
      background-color: white;
      border: 1px solid transparent;
      border-radius: 30px;
    }
  }
`;

const MessageListStyled = styled.div`
  padding: 11px;
  height: 710px;
  overflow-y: scroll;
`;

export default function ChatWindow() {
  const { selectedRoom, setSelectedRoomId, members, setIsInviteMemberVisible } =
    useContext(AppContext);
  const { roomId } = useParams();
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [fileSelected, setFileSelected] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const messageListRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleChangeFile = async (e) => {
    inputRef.current.value = "";
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile?.type === "image/png") {
      const image = await readImage(selectedFile);
      setFileSelected(image);
    }
  };

  const handleUpload = async (status) => {
    setFile(null);
    if (file) {
      const storageRef = ref(storage);
      const fileRef = ref(storageRef, `${selectedRoom.id}/${uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
          setFileSelected(null);
        },
        (error) => {
          console.error(error);
        }
      );

      try {
        await uploadTask;
        const downloadURL = await getDownloadURL(fileRef);
        addDocument("messages", {
          text: "",
          fileUrl: downloadURL,
          fileName: file.name,
          uid,
          photoURL,
          roomId: selectedRoom.id,
          displayName,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      addDocument("messages", {
        text: status ? "like" : inputValue,
        file: "",
        fileName: "",
        uid,
        photoURL,
        roomId: selectedRoom.id,
        displayName,
      });
    }

    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };

  const readImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const condition = React.useMemo(
    () => ({
      fieldName: "roomId",
      operator: "==",
      compareValue: selectedRoom.id,
    }),
    [selectedRoom.id]
  );

  const messages = useFirestore("messages", condition);

  useEffect(() => {
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  useEffect(() => {
    setFile(null);
    setSelectedRoomId(roomId);
  }, [roomId]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleUpload();
    }
  };

  return (
    <WrapperStyled>
      {selectedRoom.id && (
        <>
          <HeaderStyled>
            <div className="header__info">
              <p className="header__title">{selectedRoom.name}</p>
              <span className="header__description">
                {selectedRoom.description}
              </span>
            </div>
            <ButtonGroupStyled>
              <Button
                icon={<UserAddOutlined />}
                type="text"
                onClick={() => setIsInviteMemberVisible(true)}
              >
                Mời
              </Button>
              <Avatar.Group size="small" maxCount={2}>
                {members.map((member) => (
                  <Tooltip title={member.displayName} key={member.id}>
                    <Avatar src={member.photoURL}>
                      {member.photoURL
                        ? ""
                        : member.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </ButtonGroupStyled>
          </HeaderStyled>
          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
              {messages.map((mes) => (
                <Message
                  key={mes.id}
                  text={
                    mes.text === "like" ? (
                      <ThumbUpIcon color="primary" />
                    ) : (
                      mes.text
                    )
                  }
                  fileUrl={mes.fileUrl}
                  fileName={mes.fileName}
                  photoURL={mes.photoURL}
                  displayName={mes.displayName}
                  createdAt={mes.createdAt}
                />
              ))}
            </MessageListStyled>
            <FormStyled>
              <div
                style={{
                  width: "150px",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  position: "relative",
                }}
              >
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image"
                  multiple
                  type="file"
                  onChange={(e) => handleChangeFile(e)}
                />
                <label htmlFor="image">
                  <PhotoLibraryIcon style={{ cursor: "pointer" }} />
                </label>
                <input
                  accept="text/*,application/*"
                  style={{ display: "none" }}
                  id="file"
                  multiple
                  type="file"
                  onChange={(e) => handleChangeFile(e)}
                />
                <label htmlFor="file">
                  <FileCopyIcon style={{ cursor: "pointer" }} />
                </label>
              </div>
              <TextField
                id="outlined-basic"
                variant="outlined"
                fullWidth
                multiline
                rows={fileSelected || file ? 3 : 1}
                maxRows={1}
                ref={inputRef}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              {fileSelected && (
                <div className="image-display">
                  <div className="background"></div>
                  <img
                    src={fileSelected}
                    alt="file choosen"
                    width={100}
                    height={60}
                    style={{ zIndex: "500" }}
                  />
                  <span className="close-icon">
                    <HighlightOffIcon
                      onClick={() => {
                        setFile(null);
                        setFileSelected(null);
                      }}
                    />
                  </span>
                </div>
              )}
              {file && file?.type !== "image/png" && (
                <div className="file-display">
                  <FileCopyIcon />
                  <span className="close-icon">
                    <HighlightOffIcon
                      onClick={() => {
                        setFile(null);
                      }}
                    />
                  </span>
                  <span style={{ marginLeft: "5px", fontWeight: "bold" }}>
                    {file.name}
                  </span>
                  <div style={{ marginLeft: "30px", color: "gray" }}>
                    {file.type}
                  </div>
                </div>
              )}
              <ThumbUpIcon
                onClick={() => handleUpload("like")}
                color="primary"
                style={{ marginRight: "15px", cursor: "pointer" }}
              />
            </FormStyled>
          </ContentStyled>
        </>
      )}
    </WrapperStyled>
  );
}
