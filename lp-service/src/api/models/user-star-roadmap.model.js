const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userStarRoadmapSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'user',
      required: true,
      index: true
    },
    roadmap: {
      type: String,
      required: true,
      index: true
    }
  }
)

const UserStarRoadmap = mongoose.model('user-star-roadmap', userStarRoadmapSchema)

module.exports = UserStarRoadmap
