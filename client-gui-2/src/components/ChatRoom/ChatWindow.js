import { UserAddOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button, Tooltip, Avatar, Form, Input, Alert } from "antd";
import Message from "./Message";
import { AppContext } from "../../contexts/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../contexts/AuthProvider";
import useFirestore from "../../hooks/useFirestore";
import Img from "../../assets/images/img.png";
import Attach from "../../assets/images/attach.png";
import { storage } from "../../firebase/config";
import { FilePdfOutlined } from "@ant-design/icons";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
  background: whitesmoke;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;
  position: relative;

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
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export default function ChatWindow() {
  const { selectedRoom, members, setIsInviteMemberVisible } =
    useContext(AppContext);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileIcon, setFileIcon] = useState(null);

  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext);

  const [inputValue, setInputValue] = useState("");
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleChangeFile = (e) => {
    const selectedFile = e.target.files[0];
    setFileIcon(getFileIcon(selectedFile.type));
    setFile(selectedFile);
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("application/pdf")) {
      return <FilePdfOutlined />;
    }
    return null;
  };

  const handleUpload = async () => {
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
        console.log("Tải lên thành công");
      } catch (error) {
        console.error(error);
      }
    } else {
      addDocument("messages", {
        text: inputValue,
        file: "",
        fileName: "",
        uid,
        photoURL,
        roomId: selectedRoom.id,
        displayName,
      });
    }
    form.resetFields(["message"]);

    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
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
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  return (
    <WrapperStyled>
      {selectedRoom.id ? (
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
                  text={mes.text}
                  fileUrl={mes.fileUrl}
                  fileName={mes.fileName}
                  photoURL={mes.photoURL}
                  displayName={mes.displayName}
                  createdAt={mes.createdAt}
                />
              ))}
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item name="message">
                <Input.TextArea
                  ref={inputRef}
                  onChange={handleInputChange}
                  onPressEnter={handleUpload}
                  placeholder="Nhập tin nhắn..."
                  bordered={false}
                  autoComplete="off"
                  rows={4}
                />
                <div className="file-attach">
                  <img src={Img} alt="" width="25px" height="25px" />
                  <input
                    type="file"
                    style={{ display: "none" }}
                    id="file"
                    onChange={(e) => handleChangeFile(e)}
                  />
                  <label htmlFor="file">
                    <img src={Attach} alt="" width="25px" height="25px" />
                  </label>
                </div>
              </Form.Item>
              <Button
                type="primary"
                onClick={handleUpload}
                style={{ marginTop: "-65px", padding: "0px 10px" }}
              >
                Gửi
              </Button>
            </FormStyled>
          </ContentStyled>
        </>
      ) : (
        <Alert
          message="Hãy chọn phòng"
          type="info"
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}
    </WrapperStyled>
  );
}
