const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { nanoid } = require('nanoid')

const roadmapSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => nanoid(10)
    },
    stars: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String
    },
    ownerId: {
      type: ObjectId,
      ref: 'user'
    },
    name: {
      type: String,
      required: true
    },
    steps: [{
      type: ObjectId,
      ref: 'roadmap-step'
    }],
    totalStep: {
      type: Number,
      default: 0
    },
    completedStep: {
      type: Number,
      default: 0
    },
    comments: [{
      type: ObjectId,
      ref: 'comment'
    }],
    followers: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)
roadmapSchema.indexes()
const LearningPath = mongoose.model('roadmap', roadmapSchema)

module.exports = LearningPath
