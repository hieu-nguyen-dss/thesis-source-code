const mongoose = require('mongoose')

const examSchema = new mongoose.Schema({
  subject: {
    type: String
  },
  category: {
    type: String
  },
  questions: {
    type: String
  },
  timeLimit: {
    type: Number
  },
  maxScore: {
    type: Number
  },
  file: {
    type: String
  }
})

const ExamSet = mongoose.model('exam', examSchema)

module.exports = ExamSet
