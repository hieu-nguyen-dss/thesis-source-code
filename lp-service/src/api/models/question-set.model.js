const mongoose = require('mongoose')

const questionSetSchema = new mongoose.Schema({
  content: {
    type: String
  },
  key: {
    type: String
  },
  subject: {
    type: String
  },
  category: {
    type: String
  },
  level: {
    type: String
  },
  author: {
    type: String
  }
})

const QuestionSet = mongoose.model('question-set', questionSetSchema)

module.exports = QuestionSet
