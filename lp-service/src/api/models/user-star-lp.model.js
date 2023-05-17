const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userStarLpSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'user',
      required: true,
      index: true
    },
    learningPath: {
      type: String,
      required: true,
      index: true
    }
  }
)

const UserStarLp = mongoose.model('user-star-lp', userStarLpSchema)

module.exports = UserStarLp
