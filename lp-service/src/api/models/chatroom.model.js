const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const chatRoomSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      // eslint-disable-next-line no-useless-escape
      default: () => uuidv4().replace(/\-/g, '')
    },
    userIds: Array,
    name: String,
    chatInitiator: String,
    courseId: String
  },
  {
    timestamps: true
  }
)
chatRoomSchema.indexes()
const ChatRoom = mongoose.model('chat-room', chatRoomSchema)

module.exports = ChatRoom
