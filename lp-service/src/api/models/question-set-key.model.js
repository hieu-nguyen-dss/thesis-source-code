const mongoose = require('mongoose')

const questionSetKeySchema = new mongoose.Schema({
  questionId: {
    type: String
  },
  keyAnswer: {
    type: String
  }
})

const QuestionSetKey = mongoose.model('question-set-key', questionSetKeySchema)

module.exports = QuestionSetKey
