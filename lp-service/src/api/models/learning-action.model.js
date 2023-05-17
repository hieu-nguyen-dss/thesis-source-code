const mongoose = require('mongoose')

const learningActionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    time: {
      type: Number,
      required: true
    },
    students: {
      type: Number
    },
    online: {
      type: Boolean,
      default: false
    },
    resources: {
      type: Object
    },
    description: {
      type: String
    },
    completed: {
      type: Boolean,
      default: false
    }
  }
)

const LearningAction = mongoose.model('learning-action', learningActionSchema)

module.exports = LearningAction
