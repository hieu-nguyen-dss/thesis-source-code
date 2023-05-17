const mongoose = require('mongoose')

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      index: true,
      unique: true,
      required: true,
      sparse: true
    },
    password: {
      type: String,
      required: true
    },
    specialized: [
      {
        Type: String
      }
    ],
    userType: {
      type: String,
      default: 'STUDENT',
      required: true // 0: normal/student, 1: teacher
    },
    totalLp: {
      type: Number,
      default: 0
    }
  }
)
userSchema.indexes()
/**
 * typedef user
 */
const User = mongoose.model('user', userSchema)

module.exports = User
