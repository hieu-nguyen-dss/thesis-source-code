const mongoose = require('mongoose')

const AnalysisSchema = new mongoose.Schema(
  {
    totalUsers: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date
    }
  },
  {
    timeseries: {
      timeField: 'timestamp',
      granularity: 'hours'
    },
    autoCreate: false,
    autoIndex: false
  }
)

const AnalysisUser = mongoose.model('analysis-user', AnalysisSchema)

module.exports = AnalysisUser
