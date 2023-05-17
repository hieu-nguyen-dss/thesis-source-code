import * as rest from "./base";

const createRoomChat = (courseId, data) =>
  rest.post(`/chatroom/${courseId}/initiate`, data);
const getlistRoomChat = (courseId) =>
  rest.get(`/chatroom/${courseId}/initiate`);

export default {
  createRoomChat,
  getlistRoomChat,
};
