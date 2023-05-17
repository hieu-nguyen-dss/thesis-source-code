const mongoose = require('mongoose')

const roadmapStepSchema = new mongoose.Schema(
  {
    completed: {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['Required', 'Optional']
    },
    outcomes: [{
      type: Object
    }],
    checklist: {
      type: Object,
      default: {}
    },
    startDate: {
      type: Date,
      default: new Date()
    },
    finishDate: {
      type: Date,
      default: () => {
        const d = new Date()
        d.setDate(d.getDate() + 30)
        return d
      }
    },
    notify: {
      type: Boolean,
      default: true
    },
    resources: [{
      type: Object
    }],
    referenceLinks: [{
      type: Object
    }],
    reminderBefore: {
      type: Number,
      default: 5
    }
  },
  {
    timestamps: true
  }
)
roadmapStepSchema.indexes()
const RoadmapStep = mongoose.model('roadmap-step', roadmapStepSchema)

module.exports = RoadmapStep
