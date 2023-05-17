const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userFollowRoadmapSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'user',
      required: true
    },
    roadmap: {
      type: String,
      required: true
    },
    notify: {
      type: Boolean,
      default: true
    }
  }
)
userFollowRoadmapSchema.indexes()
const UserFollowRoadmap = mongoose.model('user-follow-roadmap', userFollowRoadmapSchema)

module.exports = UserFollowRoadmap
