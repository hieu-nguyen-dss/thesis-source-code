const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const lessonUpdateSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'user'
    },
    actionType: {
      type: String,
      required: true
    },
    subject: {
      type: String
    },
    object: {
      type: String
    },
    beforeValue: {
      type: String
    },
    afterValue: {
      type: String
    }
  },
  {
    timestamps: true
  }
)
lessonUpdateSchema.indexes()
const LessonUpdate = mongoose.model('lesson-update', lessonUpdateSchema)

module.exports = LessonUpdate
