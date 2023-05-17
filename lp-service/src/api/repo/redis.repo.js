const { get, set } = require('../../config/redis')

const setAnalysisData = (data) => {
  set('analysis-data', data, 3600)
}

const getAnalysisData = async () => {
  return await get('analysis-data')
}

module.exports = {
  setAnalysisData,
  getAnalysisData
}
