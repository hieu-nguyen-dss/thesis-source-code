const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const RubricSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String
    },
    lpId: {
      type: ObjectId,
      ref: 'learning-path',
      index: true
    },
    tree: {
      type: Object
    },
    rows: {
      type: Object
    }
  }
)
RubricSchema.indexes()
const Rubric = mongoose.model('rubric', RubricSchema)

module.exports = Rubric
