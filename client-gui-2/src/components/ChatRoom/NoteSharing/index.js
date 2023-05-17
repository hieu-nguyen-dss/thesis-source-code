import React, { useState, useEffect } from "react";
import { firebaseDb } from "../../../firebase/config";
import styled from "styled-components";
import { ref, push, update, remove, onValue, set } from "firebase/database";

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
  min-width: 110px;
  min-height: 110px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  background-color: white;
  border-radius: 15px;
  transition: 0.07s;
  opacity: 0.99;

  .DeleteBtn {
    position: absolute;
    top: 8px;
    right: 8px;
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
  width: 2000px;
  height: 2000px;
  border: 1px solid #333;
  position: relative;
`;
let db = null;

const CORLORS = ["#ffe1b4", "#FFF9D5", "#ECFAF5", "#CBF5E4", "#A5DEC8", "#FFF"];

const NotSharing = () => {
  const [items, setItems] = useState(null);
  const [dragging, setDragging] = useState({ key: "", x: 0, y: 0 });

  const [input, setInput] = useState("");
  const [editMode, setEditMode] = useState({ key: "", w: 0, h: 0 });

  useEffect(() => {
    let roomName = "room1";
    db = ref(firebaseDb, roomName);
    onValue(db, (snapshot) => setItems(snapshot.val()));
  }, []);

  const add = () => {
    const newPostRef = push(db);
    const newPostKey = newPostRef.key;
    update(db, {
      [newPostKey]: {
        t: "text here",
        x: window.scrollX + Math.floor(Math.random() * (200 - 80) + 80),
        y: window.scrollY + Math.floor(Math.random() * (200 - 80) + 80),
        c: 5,
      },
    });
  };

  const updateItem = (key, item) => {
    console.log("key: ", `room1/${key}`);
    const db = null;
    const itemRef = ref(db, `room1/${key}`);
    console.log("firebaseDb: ", itemRef);
    update(itemRef, item);
  };
  const removeItem = (key) => {
    const itemRef = ref(db, `/${key}`);
    remove(itemRef);
  };

  if (!items)
    return (
      <button className="AddCard" onClick={() => add()}>
        ＋ add card
      </button>
    );

  return (
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
    >
      <AddCard className="AddCard" onClick={() => add()}>
        ＋ add card
      </AddCard>
      <div>
        {Object.keys(items).map((key) => (
          <Card
            key={key}
            style={{
              left: items[key].x + "px",
              top: items[key].y + "px",
              background: CORLORS[items[key].c],
            }}
            draggable
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
          </Card>
        ))}
      </div>
    </Board>
  );
};

export default NotSharing;
