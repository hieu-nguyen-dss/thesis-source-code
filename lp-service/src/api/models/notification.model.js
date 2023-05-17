const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const notificationSchema = new mongoose.Schema(
  {
    notifType: {
      type: String
    },
    learningPath: {
      type: String
    },
    roadmap: {
      type: String
    },
    lesson: {
      type: String
    },
    from: {
      type: ObjectId,
      ref: 'user',
      index: true
    },
    to: {
      type: ObjectId,
      ref: 'user',
      required: true,
      index: true
    },
    content: {
      type: Object
    },
    seen: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
)
notificationSchema.indexes()
const Notification = mongoose.model('notification', notificationSchema)

module.exports = Notification
