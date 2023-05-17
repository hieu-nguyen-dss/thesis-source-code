const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    learningPaths: [{
      type: ObjectId,
      ref: 'learning-path'
    }],
    ogzType: {
      type: String,
      required: true
    },
    address: {
      type: String
    },
    email: {
      type: String
    },
    phone: {
      type: String
    },
    category: {
      type: String
    },
    foundDate: {
      type: Date
    },
    backgroundImg: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

const Organization = mongoose.model('organization', organizationSchema)

module.exports = Organization
