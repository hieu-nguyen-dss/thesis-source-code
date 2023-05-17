const mongoose = require('mongoose')

const AnalysisSchema = new mongoose.Schema(
  {
    totalCourses: Number,
    totalRoadmaps: Number,
    timestamp: Date
  },
  {
    timeseries: {
      timeField: 'timestamp',
      granularity: 'hours'
    }
  }
)

const AnalysisLp = mongoose.model('analysis-lp', AnalysisSchema)

module.exports = AnalysisLp
