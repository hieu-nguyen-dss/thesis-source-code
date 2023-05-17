const httpStatus = require('http-status')
const getApiResponse = require('../utils/response')

const { analysisRepo, redisRepo } = require('../repo')

const countUsers = async (req, res, next) => {
  try {
    const rs = await analysisRepo.getAmountUser()
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const topStatistics = async (req, res, next) => {
  try {
    const cachedData = await redisRepo.getAnalysisData()
    if (cachedData) {
      return res.status(httpStatus.OK).json(
        getApiResponse({
          data: cachedData
        })
      )
    }
    const [
      topStarLpUser,
      topStarRoadmapUser,
      topStarCourse,
      topStarRms,
      topFollowRoadmap,
      totalCourse,
      totalRoadmap,
      totalLpTimeSr,
      totalUserTimeSr
    ] = await Promise.all([
      analysisRepo.topStarLpUser(),
      analysisRepo.topStarRoadmapUser(),
      analysisRepo.topStarLps(),
      analysisRepo.topStarRms(),
      analysisRepo.topFollowRoadmap(),
      analysisRepo.totalCourse(),
      analysisRepo.totalRoadmap(),
      analysisRepo.totalLpTimeSr(),
      analysisRepo.totalUserTimeSr()
    ])
    redisRepo.setAnalysisData({
      topStarLpUser,
      topStarRoadmapUser,
      topStarCourse,
      topStarRms,
      topFollowRoadmap,
      totalCourse,
      totalRoadmap,
      totalLpTimeSr,
      totalUserTimeSr
    })
    return res.status(httpStatus.OK).json(
      getApiResponse({
        data: {
          topStarLpUser,
          topStarRoadmapUser,
          topStarCourse,
          topStarRms,
          topFollowRoadmap,
          totalCourse,
          totalRoadmap,
          totalLpTimeSr,
          totalUserTimeSr
        }
      })
    )
  } catch (error) {
    next(error)
  }
}

module.exports = {
  countUsers,
  topStatistics
}
