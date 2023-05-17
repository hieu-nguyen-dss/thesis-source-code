const { ObjectId } = require('mongoose').Types

const { User, LearningPath, Roadmap, UserFollowRoadmap } = require('../models')
const { LP } = require('../constants')

const createUser = (email, hash, name, userType) => {
  const user = new User()
  user.email = email
  user.password = hash
  user.name = name
  user.userType = userType
  return user.save()
}

const getListUser = async (userType) => {
  const users = await User.find({
      userType
  })
  return users
}

const deleteUser = async (ids) => {
  const users = await User.deleteMany({
      _id: {
        $in: ids
      }
  })
  return users
}

const getUserByeEmail = async (email) => {
  const user = User.findOne({ email })
  return user
}

const getUsersByEmail = async (email) => {
  const users = await User.find(
    { email: new RegExp(email, 'i') },
    { password: 0, specialized: 0, userType: 0, __v: 0 }
  )
  return users
}

const getUser = async (userId, id) => {
  const user = User.findById(userId)
  let lps = LearningPath.find({ ownerId: userId, ownerType: { $ne: LP.ORGANIZATION } })
  if (userId !== id) {
    lps = LearningPath.find({ ownerId: userId, ownerType: { $ne: LP.ORGANIZATION }, public: true })
  }
  const rms = Roadmap.find({ ownerId: userId })
  const ufr = UserFollowRoadmap.aggregate([
    {
      $match: { user: new ObjectId(userId) }
    },
    {
      $lookup: {
        from: 'roadmaps',
        localField: 'roadmap',
        foreignField: 'id',
        as: 'followingRoadmaps'
      }
    },
    {
      $unwind: { path: '$followingRoadmaps' }
    },
    {
      $project: {
        'followingRoadmaps.id': 1,
        'followingRoadmaps.name': 1,
        'followingRoadmaps.stars': 1
      }
    }
  ])
  return await Promise.all([user, lps, rms, ufr])
}

const updateUser = async (userId, data) => {
  return await User.findByIdAndUpdate(userId, data)
}

module.exports = {
  createUser,
  getUser,
  getUserByeEmail,
  getUsersByEmail,
  updateUser,
  getListUser,
  deleteUser
}
