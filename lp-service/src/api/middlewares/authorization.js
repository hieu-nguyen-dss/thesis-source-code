const httpStatus = require('http-status')
// const mongoose = require('mongoose')

const { learningPathRepo } = require('../repo')
const getApiResponse = require('../utils/response')

// const { ObjectId } = mongoose.Types

exports.ownerAuth = async (req, res, next) => {
  const { id: ownerId } = req.payload
  const { learningPathId } = req.params
  try {
    const foundGroup = await learningPathRepo.getLPDetail(learningPathId)
    if (foundGroup.ownerId.toString() === ownerId) {
      next()
    } else {
      return res.status(httpStatus.UNAUTHORIZED).json(
        getApiResponse({
          ec: 1,
          msg: 'You are not owner'
        })
      )
    }
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).json(
      getApiResponse({
        ec: 1,
        msg: error.message
      })
    )
  }
}
