const { ObjectId } = require('mongoose').Types

const { Roadmap, RoadmapStep, UserFollowRoadmap, UserStarRoadmap } = require('../models')

const getRoadmapDetail = async (id) => {
  return await Roadmap.findOne({ id })
    .populate('steps')
    .populate('ownerId', 'avatar _id name')
    .lean()
}

const isStarred = async (roadmap, user) => {
  const usr = await UserStarRoadmap.findOne({ roadmap, user })
  return usr !== null
}

const isFollowing = async (roadmapId, userId) => {
  const ufr = await UserFollowRoadmap.findOne({ roadmap: roadmapId, user: userId })
  return ufr !== null
}

const getMyRoadmaps = async (ownerId) => {
  return await Roadmap.find({ ownerId })
}

const createRoadmap = async (data) => {
  return await new Roadmap(data).save()
}

const deleteRoadmap = async (id) => {
  const roadmap = await Roadmap.findOneAndDelete({ id })
  const steps = roadmap.steps
  await RoadmapStep.deleteMany({ _id: { $in: steps } })
  return true
}

const deleteStep = async (roadmapId, stepId) => {
  const deletedStep = await RoadmapStep.findByIdAndDelete(stepId)
  const updatedRoadmap = await Roadmap.findOneAndUpdate(
    { id: roadmapId },
    {
      $pull: { steps: stepId },
      $inc: { totalStep: -1, completedStep: deletedStep.completed ? -1 : 0 }
    }
  )
  return updatedRoadmap
}

const createStep = async (roadmapId, stepData) => {
  const stepId = new ObjectId()
  const createStep = new RoadmapStep({ _id: stepId, ...stepData }).save()
  const addStepToRoadmap = Roadmap.findOneAndUpdate(
    { id: roadmapId },
    {
      $addToSet: { steps: stepId },
      $inc: { totalStep: 1 }
    }
  )
  return await Promise.all([createStep, addStepToRoadmap])
}

const updateRoadmap = async (id, data) => {
  return await Roadmap.findOneAndUpdate({ id }, data, { new: true })
}

const updateStep = async (id, data) => {
  return await RoadmapStep.findByIdAndUpdate(id, data, { new: true })
}

const followRoadmap = async (roadmapId, userId) => {
  const followed = await UserFollowRoadmap.findOne({ roadmap: roadmapId, user: userId })
  if (followed !== null) return false
  const [, updatedRoadmap] = await Promise.all([
    new UserFollowRoadmap({ roadmap: roadmapId, user: userId }).save(),
    Roadmap.findOneAndUpdate({ id: roadmapId }, { $inc: { followers: 1 } }, { new: true })
  ])
  return updatedRoadmap
}

const unfollowRoadmap = async (roadmapId, userId) => {
  const followed = await UserFollowRoadmap.findOne({ roadmap: roadmapId, user: userId })
  if (followed === null) return false
  const [, updatedRoadmap] = await Promise.all([
    UserFollowRoadmap.findOneAndDelete({ roadmap: roadmapId, user: userId }),
    Roadmap.findOneAndUpdate({ id: roadmapId }, { $inc: { followers: -1 } }, { new: true })
  ])
  return updatedRoadmap
}

const turnOffNotifyFollow = async (roadmapId, userId) => {
  await UserFollowRoadmap.findOneAndUpdate({ roadmap: roadmapId, user: userId }, { notify: false })
  return true
}

const turnOnNotifyFollow = async (roadmapId, userId) => {
  await UserFollowRoadmap.findOneAndUpdate({ roadmap: roadmapId, user: userId }, { notify: true })
  return true
}

const starRm = async (roadmap, user) => {
  const exist = await UserStarRoadmap.findOne({ user, roadmap })
  if (exist) return false
  const [, updatedRm] = await Promise.all([
    new UserStarRoadmap({ user, roadmap }).save(),
    Roadmap.findOneAndUpdate({ id: roadmap }, { $inc: { stars: 1 } }, { new: true }).lean()
  ])
  console.log(updatedRm)
  return updatedRm.stars
}

const unStarRm = async (roadmap, user) => {
  const exist = await UserStarRoadmap.findOne({ user, roadmap })
  if (!exist) return false
  const [, updatedRm] = await Promise.all([
    UserStarRoadmap.findOneAndDelete({ user, roadmap }),
    Roadmap.findOneAndUpdate({ id: roadmap }, { $inc: { stars: -1 } }, { new: true }).lean()
  ])
  console.log(updatedRm)
  return updatedRm.stars
}

module.exports = {
  getRoadmapDetail,
  isFollowing,
  getMyRoadmaps,
  createRoadmap,
  deleteRoadmap,
  deleteStep,
  createStep,
  updateRoadmap,
  updateStep,
  followRoadmap,
  unfollowRoadmap,
  turnOffNotifyFollow,
  turnOnNotifyFollow,
  starRm,
  unStarRm,
  isStarred
}
