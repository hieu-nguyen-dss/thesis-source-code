const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { nanoid } = require('nanoid')

const quizSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => nanoid(10),
        index: true
    },
    questions: [{
        type: ObjectId,
        ref: 'question',
        required: true,
    }],
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    startAt: {
        type: Date,
    },
    endAt: {
        type: Date,
    },
    author: {
        type: String,
        required: true,
    },
    lessonId: {
        type: String,
        require: true
    }
})

const Quizzes = mongoose.model('quizze', quizSchema)

module.exports = Quizzes