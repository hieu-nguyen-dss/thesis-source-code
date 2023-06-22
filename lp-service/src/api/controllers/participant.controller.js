const { LearningPath, User } = require('../models')
const getApiResponse = require('../utils/response')
const httpStatus = require('http-status')

const addStudentToCourse = async (req, res, next) => {
  const { learningPathId } = req.params
  const { users } = req.body
  try {
    const existedLp = await LearningPath.findOne({ id: learningPathId }, { participants: true })
    const userIds = existedLp.participants
    users.map((id) => {
      if (!userIds.includes(id)) {
        userIds.push(id)
      }
    })
    const lp = await LearningPath.findOneAndUpdate(
      { id: learningPathId },
      { participants: userIds }
    )
    return res.status(httpStatus.OK).json(getApiResponse({ data: lp }))
  } catch (error) {
    next(error)
  }
}

const getStudentInCourse = async (req, res, next) => {
  const { learningPathId } = req.params
  const { name } = req.query
  try {
    const lp = await LearningPath.findOne({ id: learningPathId }, { participants: true })
    const userIds = lp?.participants
    let users = []
    if (name) {
      users = await User.find({
        _id: {
          $in: userIds
        },
        name: { $regex: name }
      })
    } else {
      users = await User.find({
        _id: {
          $in: userIds
        }
      })
    }
    return res.status(httpStatus.OK).json(getApiResponse({ data: users }))
  } catch (error) {
    next(error)
  }
}

const deleteStudentInCourse = async (req, res, next) => {
  const { learningPathId } = req.params
  const { users } = req.body
  try {
    const existedLp = await LearningPath.findOne({ id: learningPathId }, { participants: true })
    const userIds = existedLp.participants
    const updateUserIds = userIds.filter((id) => !users.includes(id.toString()))
    const lp = await LearningPath.findOneAndUpdate(
      { id: learningPathId },
      { participants: updateUserIds }
    )
    return res.status(httpStatus.OK).json(getApiResponse({ data: lp }))
  } catch (error) {
    next(error)
  }
}

module.exports = { addStudentToCourse, getStudentInCourse, deleteStudentInCourse }
