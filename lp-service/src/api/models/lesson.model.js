const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const { nanoid } = require('nanoid')

const LessonPart = require('./lesson-part.model')
const LessonUpdate = require('./lesson-update.model')

const lessonSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => nanoid()
    },
    name: {
      type: String,
      required: true,
      index: true
    },
    content: {
      type: String
    },
    preparation: {
      type: String
    },
    description: {
      type: String
    },
    designedTime: {
      type: Number,
      required: true,
      default: 0
    },
    estimateTime: {
      type: Number,
      required: true,
      default: 0
    },
    outcomes: {
      type: String
    },
    lessonParts: [{
      type: ObjectId,
      required: true,
      ref: 'lesson-part'
    }],
    updateHistories: [{
      type: ObjectId,
      ref: 'lesson-update'
    }],
    comments: [{
      type: ObjectId,
      ref: 'comment'
    }],
    resources: [{
      type: Object
    }],
    quiz: [{
      type: ObjectId,
      ref: 'quizze'
    }],
    totalActions: {
      type: Number,
      default: 0
    },
    completedActions: {
      type: Number,
      default: 0
    }
  }
)
lessonSchema.post(/delete/i, async function (doc, next) {
  console.log('Delete leson part')
  const dels = doc.lessonParts.map((pId) => LessonPart.findByIdAndDelete(pId))
  const delsHistory = LessonUpdate.deleteMany({ _id: { $in: doc.updateHistories } })
  await Promise.all([...dels, delsHistory])
  next()
})
lessonSchema.indexes()
const Lesson = mongoose.model('lesson', lessonSchema)

module.exports = Lesson
