const httpStatus = require('http-status')
const schedule = require('node-schedule')

const getApiResponse = require('../utils/response')
const { roadmapRepo, notifRepo } = require('../repo')

const getRoadmapDetail = async (req, res, next) => {
  const { id: userId } = req.payload
  const { roadmapId } = req.params
  try {
    const [rs, isFollowing, youStarred] = await Promise.all([
      roadmapRepo.getRoadmapDetail(roadmapId),
      roadmapRepo.isFollowing(roadmapId, userId),
      roadmapRepo.isStarred(roadmapId, userId)
    ])
    if (rs) {
      rs.yours = rs.ownerId._id.toString() === userId
      rs.following = isFollowing
      rs.youStarred = youStarred
    }
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const getMyRoadmaps = async (req, res, next) => {
  const { id: ownerId } = req.payload
  try {
    const rs = await roadmapRepo.getMyRoadmaps(ownerId)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const createRoadmap = async (req, res, next) => {
  const { id: ownerId } = req.payload
  try {
    const rs = await roadmapRepo.createRoadmap({ ownerId, ...req.body })
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const updateRoadmap = async (req, res, next) => {
  const { roadmapId } = req.params
  try {
    const rs = await roadmapRepo.updateRoadmap(roadmapId, req.body)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const deleteRoadmap = async (req, res, next) => {
  const { roadmapId } = req.params
  try {
    const rs = await roadmapRepo.deleteRoadmap(roadmapId)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const createStep = async (req, res, next) => {
  const { roadmapId } = req.params
  try {
    const rs = await roadmapRepo.createStep(roadmapId, req.body)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs[0] }))
  } catch (error) {
    next(error)
  }
}

const updateStep = async (req, res, next) => {
  const { roadmapId, stepId } = req.params
  try {
    const rs = await roadmapRepo.updateStep(stepId, req.body)
    if (req.body.reminderBefore) {
      schedule.cancelJob(`roadmap-step-${stepId}`)
      const reminderAt = new Date()
      reminderAt.setDate(new Date(rs.finishDate).getDate() - parseInt(req.body.reminderBefore))
      schedule.scheduleJob(`roadmap-step-${stepId}`, reminderAt, async () => {
        await notifRepo.remindRoadmapNotif(roadmapId, req.body.ownerId)
      })
    }
    if (req.body.checklist) {
      if (req.body.updateChecklistType === 'ADD') {
        await notifRepo.addOutcomeRmNotif(roadmapId, req.body.ownerId, req.body.content)
      }
      if (req.body.updateChecklistType === 'DONE') {
        await notifRepo.doneOutcomeRmNotif(roadmapId, req.body.ownerId, req.body.content)
      }
    }
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const deleteStep = async (req, res, next) => {
  const { roadmapId, stepId } = req.params
  try {
    const rs = await roadmapRepo.deleteStep(roadmapId, stepId)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const followRoadmap = async (req, res, next) => {
  const { roadmapId } = req.params
  const { id } = req.payload
  const { ownerId } = req.body
  try {
    // eslint-disable-next-line comma-dangle, array-bracket-spacing
    const [rs, ] = await Promise.all([
      roadmapRepo.followRoadmap(roadmapId, id),
      notifRepo.followRoadmapNotif(roadmapId, id, ownerId)
    ])
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const unfollowRoadmap = async (req, res, next) => {
  const { roadmapId } = req.params
  const { id } = req.payload
  try {
    const rs = await roadmapRepo.unfollowRoadmap(roadmapId, id)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const turnOffNotifyFollow = async (req, res, next) => {
  const { roadmapId } = req.params
  const { id } = req.payload
  try {
    const rs = await roadmapRepo.turnOffNotifyFollow(roadmapId, id)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const turnOnNotifyFollow = async (req, res, next) => {
  const { roadmapId } = req.params
  const { id } = req.payload
  try {
    const rs = await roadmapRepo.turnOnNotifyFollow(roadmapId, id)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const starRoadmap = async (req, res, next) => {
  const { roadmapId } = req.params
  const { id } = req.payload
  try {
    const rs = await roadmapRepo.starRm(roadmapId, id)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const unStarRoadmap = async (req, res, next) => {
  const { roadmapId } = req.params
  const { id } = req.payload
  try {
    const rs = await roadmapRepo.unStarRm(roadmapId, id)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getRoadmapDetail,
  getMyRoadmaps,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
  createStep,
  updateStep,
  deleteStep,
  followRoadmap,
  unfollowRoadmap,
  turnOffNotifyFollow,
  turnOnNotifyFollow,
  starRoadmap,
  unStarRoadmap
}
