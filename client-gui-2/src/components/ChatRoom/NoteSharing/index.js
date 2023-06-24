import React, { useContext, useState, useEffect } from "react";
import { firebaseDb } from "../../../firebase/config";
import styled from "styled-components";
import { ref, push, update, remove, onValue, child } from "firebase/database";
import SectionMenu from "../../../components/SectionMenu";
import { AuthContext } from "../../../contexts/AuthProvider";

const AddCard = styled.button`
  position: fixed;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: bold;
  z-index: 1000;
  background: white;
  margin: 12px;
`;

const Card = styled.div`
  border: 1px solid #bdbdbd;
  padding: 20px;
  position: absolute;
  min-width: 200px;
  min-height: 200px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background-color: white;
  border-radius: 15px;
  transition: 0.07s;
  opacity: 0.99;

  .DeleteBtn {
    position: absolute;
    top: 8px;
    right: 5px;
    opacity: 0.5;
    border: none;
    background: transparent;
  }

  .EditableText {
    min-width: 80px;
    min-height: 80px;
    margin-top: 12px;
    border: none;
    cursor: pointer;
    font-size: 0.92rem;
    line-height: 1rem;
    font-family: "M PLUS Rounded 1c";
    background: transparent;
    overflow: hidden;
  }

  .Text {
    padding-right: 12px;
    font-size: 1rem;
    line-height: 1rem;
    font-family: "M PLUS Rounded 1c";
  }

  textarea:focus {
    outline: 0;
  }

  .ColorSelector {
    position: absolute;
    top: 30px;
    right: 9px;
  }
  .ColorCircle {
    width: 10px;
    height: 10px;
    margin: 2px;
    padding: 2px;
    border: solid 1px #dedede;
    border-radius: 50%;
  }
`;
const Board = styled.div`
  width: 100%;
  height: 100vh;
  border: 1px solid #333;
  position: relative;
`;
let db1 = null;
// let db2 = null;
const CORLORS = ["#ffe1b4", "#FFF9D5", "#ECFAF5", "#CBF5E4", "#A5DEC8", "#FFF"];

const NotSharing = () => {
  const {
    user: { uid, displayName },
  } = useContext(AuthContext);

  const [items, setItems] = useState(null);
  const [dragging, setDragging] = useState({ key: "", x: 0, y: 0 });
  const [nameCourse, setNameCourse] = useState("");
  const [nameRoom, setNameRoom] = useState("");
  const [input, setInput] = useState("");
  const [editMode, setEditMode] = useState({ key: "", w: 0, h: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [usersCursor, setUsersCursors] = useState("");

  useEffect(() => {
    let searchParams = new URLSearchParams(document.location.search);
    const roomId = searchParams.get("room");
    const nameCourse = searchParams.get("name");
    const nameRoom = searchParams.get("courseName");
    setNameCourse(nameCourse);
    setNameRoom(nameRoom);
    let dbParent = ref(firebaseDb, roomId);
    db1 = child(dbParent, "notes");
    // db2 = child(dbParent, "users");
    onValue(db1, (snapshot) => setItems(snapshot.val()));
    // onValue(db2, (snapshot) => setUsersCursors(snapshot.val()));
  }, []);

  const add = () => {
    const newPostRef = push(db1);
    const newPostKey = newPostRef.key;
    update(db1, {
      [newPostKey]: {
        t: "text here",
        x: window.scrollX + Math.floor(Math.random() * (200 - 80) + 80),
        y: window.scrollY + Math.floor(Math.random() * (200 - 80) + 80),
        c: 5,
        author: displayName,
      },
    });
  };

  // const addUser = () => {
  //   const newPostRef = push(db2);
  //   const newPostKey = newPostRef.key;
  //   update(db2, {
  //     [newPostKey]: {
  //       x: window.scrollX,
  //       y: window.scrollY,
  //       author: displayName,
  //       uid,
  //     },
  //   });
  // };

  const updateItem = (key, item) => {
    const childRef = child(db1, key);
    update(childRef, item);
  };

  // const updateUser = (userId, item) => {
  //   const childRef = child(db2, userId);
  //   update(childRef, item);
  // };

  const removeItem = (key) => {
    const childRef = child(db1, key);
    remove(childRef);
  };

  const handleMouseMove = (event) => {};

  window.addEventListener("mousemove", handleMouseMove);
  return (
    <>
      <SectionMenu menuCurrent={`Course/${nameRoom}/${nameCourse}`} />
      <Board
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          if (!dragging || !items) return;
          updateItem(dragging.key, {
            ...items[dragging.key],
            x: e.clientX - dragging.x,
            y: e.clientY - dragging.y,
          });
        }}
        style={{
          border: "none",
        }}
      >
        <AddCard className="AddCard" onClick={() => add()}>
          ＋ add card
        </AddCard>
        <div>
          {items &&
            Object.keys(items).map((key) => (
              <Card
                key={key}
                style={{
                  left: items[key].x + "px",
                  top: items[key].y + "px",
                  background: CORLORS[items[key].c],
                }}
                draggable
                onDrag={(event) => {
                  const { clientX, clientY } = event;
                  // Kiểm tra xem ticket có nằm ngoài kích thước màn hình không
                  if (
                    clientX > window.innerWidth ||
                    clientY > window.innerHeight
                  ) {
                    // Mở rộng kích thước màn hình
                    window.resizeTo(clientX + 100, clientY + 100);
                  }
                }}
                onDragStart={(e) => {
                  setDragging({
                    key,
                    x: e.clientX - items[key].x,
                    y: e.clientY - items[key].y,
                  });
                }}
              >
                <button className="DeleteBtn" onClick={() => removeItem(key)}>
                  ×
                </button>
                <div className="ColorSelector">
                  {CORLORS.map((c, i) => (
                    <div
                      key={c}
                      className="ColorCircle"
                      onClick={() => {
                        updateItem(key, { ...items[key], c: i });
                      }}
                      style={{ background: c }}
                    />
                  ))}
                </div>
                {editMode.key === key ? (
                  <textarea
                    className="EditableText"
                    style={{ width: editMode.w, height: editMode.h }}
                    onChange={(e) => setInput(e.target.value)}
                    defaultValue={items[key].t}
                    autoFocus
                    onFocus={(e) => e.target.select()}
                    onBlur={() => {
                      setInput("");
                      setEditMode({ key: "", w: 0, h: 0 });
                      input && updateItem(key, { ...items[key], t: input });
                    }}
                  />
                ) : (
                  <pre
                    className="Text"
                    onClick={(e) =>
                      setEditMode({
                        key,
                        w: e.currentTarget.clientWidth,
                        h: e.currentTarget.clientHeight,
                      })
                    }
                  >
                    {items[key].t}
                  </pre>
                )}
                <p
                  style={{
                    textAlign: "center",
                    position: "absolute",
                    bottom: 0,
                    marginBottom: 0,
                    width: "100%",
                    left: 0,
                    color: "gray",
                    fontSize: "12px",
                  }}
                >
                  {items[key].author}
                </p>
              </Card>
            ))}
          {/* <div
            style={{
              position: "fixed",
              left: cursorPosition.x,
              top: cursorPosition.y,
              fontStyle: "italic",
              color: "#F99B7D",
            }}
          >
            <span role="img" aria-label="cursor">
              {displayName}
            </span>
          </div> */}
        </div>
      </Board>
    </>
  );
};

export default NotSharing;
