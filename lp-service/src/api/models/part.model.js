const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const Lesson = require('./lesson.model')

const partSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    lessons: [{
      type: ObjectId,
      ref: 'lesson'
    }]
  }
)
partSchema.post(/delete/i, async function (doc, next) {
  console.log('delete part')
  const dels = doc.lessons.map(lId => Lesson.findByIdAndDelete(lId))
  await Promise.all(dels)
  next()
})
partSchema.indexes()
const Part = mongoose.model('part', partSchema)

module.exports = Part
