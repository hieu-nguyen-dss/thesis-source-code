const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  questions: {
    type: String
  },
  choices: {
    type: Array,
    default: []
  },
  answer: {
    type: String
  }
})

const Questions = mongoose.model('question', questionSchema)

module.exports = Questions
