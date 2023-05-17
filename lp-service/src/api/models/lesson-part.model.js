const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const LearningAction = require('./learning-action.model')

const lessonPartSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    learningActions: [{
      type: ObjectId,
      ref: 'learning-action'
    }]
  }
)
lessonPartSchema.post(/delete/i, async function (doc, next) {
  await LearningAction.deleteMany({ id: { $in: doc.learningActions } })
  next()
})
lessonPartSchema.indexes()
const LessonPart = mongoose.model('lesson-part', lessonPartSchema)

module.exports = LessonPart
