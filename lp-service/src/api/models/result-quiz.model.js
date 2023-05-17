const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

const answer = new mongoose.Schema({
  questionId: String,
  answer: String,
  correctAnswer: String
})

const resultQuizSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => nanoid(10),
    index: true
  },
  studentId: {
    type: String,
    require: true
  },
  quizId: {
    type: String,
    require: true
  },
  studentAnswers: [answer],
  timeSubmit: {
    type: Date,
    require: true
  },
  score: {
    type: Number,
    require: true
  },
  achive: {
    type: Boolean,
    require: true
  }
})

const resultQuizzes = mongoose.model('result-quizzes', resultQuizSchema)

module.exports = resultQuizzes
