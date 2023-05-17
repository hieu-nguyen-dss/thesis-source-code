const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'user',
      required: true
    },
    content: {
      type: String
    },
    parent: {
      type: ObjectId,
      ref: 'comment'
    }
  },
  {
    timestamps: true
  }
)
commentSchema.indexes()
const Comment = mongoose.model('comment', commentSchema)

module.exports = Comment
