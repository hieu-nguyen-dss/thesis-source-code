const { Notification, UserFollowRoadmap } = require('../models')
const { NOTIF } = require('../constants')
const { notifService } = require('../services')
const { ObjectId } = require('mongoose').Types

const cmtRoadmapNotif = async (userCmt, roadmapId, roadmapOwner) => {
  if (userCmt === roadmapOwner) return
  const notif = new Notification({
    notifType: NOTIF.CMT_RM,
    from: userCmt,
    to: roadmapOwner,
    roadmap: roadmapId
  })
  notifService.pushNotif({
    notifType: NOTIF.CMT_RM,
    from: roadmapOwner,
    to: [roadmapOwner],
    roadmap: roadmapId
  }).then((res) => console.log(res.status))
  return await notif.save()
}

const cmtLpNotif = async (userCmt, lpId, courseOwner) => {
  if (userCmt === courseOwner) return
  const notif = new Notification({
    notifType: NOTIF.CMT_LP,
    from: userCmt,
    to: courseOwner,
    learningPath: lpId
  })
  notifService.pushNotif({
    notifType: NOTIF.CMT_LP,
    from: courseOwner,
    to: [courseOwner],
    roadmap: lpId
  }).then((res) => console.log(res.status))
  return await notif.save()
}

const cmtLessonNotif = async (userCmt, lpId, lessonId, courseOwner) => {
  if (userCmt === courseOwner) return
  const notif = new Notification({
    notifType: NOTIF.CMT_LS,
    from: userCmt,
    to: courseOwner,
    learningPath: lpId,
    lesson: lessonId
  })
  notifService.pushNotif({
    notifType: NOTIF.CMT_LS,
    from: courseOwner,
    to: [courseOwner],
    roadmap: lpId
  }).then((res) => console.log(res.status))
  return await notif.save()
}

const addOutcomeRmNotif = async (roadmapId, roadmapOwner, content) => {
  const followers = await UserFollowRoadmap.find({ roadmap: roadmapId }).lean()
  const notifs = followers.map((follower) => ({
    notifType: NOTIF.ADD_RM_CL,
    from: roadmapOwner,
    to: follower.user,
    content,
    roadmap: roadmapId
  }))
  notifService.pushNotif({
    notifType: NOTIF.DONE_RM_CL,
    from: roadmapOwner,
    to: followers.map(flw => flw.user),
    roadmap: roadmapId
  }).then((res) => console.log(res.status))
  return await Notification.insertMany(notifs)
}

const doneOutcomeRmNotif = async (roadmapId, roadmapOwner, content) => {
  const followers = await UserFollowRoadmap.find({ roadmap: roadmapId }).lean()
  const notifs = followers.map((follower) => ({
    notifType: NOTIF.DONE_RM_CL,
    from: roadmapOwner,
    to: follower.user,
    content,
    roadmap: roadmapId
  }))
  notifService.pushNotif({
    notifType: NOTIF.DONE_RM_CL,
    from: roadmapOwner,
    to: followers.map(flw => flw.user),
    roadmap: roadmapId
  }).then((res) => console.log(res.status))
  return await Notification.insertMany(notifs)
}

const followRoadmapNotif = async (roadmapId, followerId, roadmapOwner) => {
  const notif = new Notification({
    notifType: NOTIF.FOLLOW_RM,
    from: followerId,
    to: roadmapOwner,
    roadmap: roadmapId
  })
  notifService.pushNotif({
    notifType: NOTIF.FOLLOW_RM,
    from: followerId,
    to: [roadmapOwner],
    roadmap: roadmapId
  }).then((res) => console.log(res.status))
  return await notif.save()
}

const starRmNotif = async (roadmapId, userStar, roadmapOwner) => {
  if (userStar === roadmapOwner) return
  const notif = new Notification({
    notifType: NOTIF.STAR_RM,
    from: userStar,
    to: roadmapOwner,
    roadmap: roadmapId
  })
  notifService.pushNotif({
    to: [roadmapOwner]
  }).then((res) => console.log(res.status))
  return await notif.save()
}

const starLpNotif = async (learningPathId, userStar, courseOwner) => {
  if (userStar === courseOwner) return
  const notif = new Notification({
    notifType: NOTIF.STAR_LP,
    from: userStar,
    to: courseOwner,
    learningPath: learningPathId
  })
  notifService.pushNotif({
    to: [courseOwner]
  }).then((res) => console.log(res.status))
  return await notif.save()
}

const remindRoadmapNotif = async (roadmapId, roadmapOwner) => {
  const notif = new Notification({
    notifType: NOTIF.REMIND_ROADMAP,
    from: 'Roadmap system',
    to: roadmapOwner,
    roadmap: roadmapId
  })
  notifService.pushNotif({
    notifType: NOTIF.REMIND_ROADMAP,
    from: 'Roadmap system',
    to: [roadmapOwner],
    roadmap: roadmapId
  }).then((res) => console.log(res.status))
  return await notif.save()
}

const seenNotif = async (notifId) => {
  return await Notification.findByIdAndUpdate(notifId, { seen: true }, { new: true })
}

const getNotifs = async (userId, query) => {
  const { page, records } = query
  const rs = await Notification.aggregate([
    {
      $match: { to: new ObjectId(userId) }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'from',
        foreignField: '_id',
        as: 'sender'
      }
    },
    {
      $lookup: {
        from: 'roadmaps',
        localField: 'roadmap',
        foreignField: 'id',
        as: 'roadmap'
      }
    },
    {
      $lookup: {
        from: 'learning-paths',
        localField: 'learningPath',
        foreignField: 'id',
        as: 'learningPath'
      }
    },
    {
      $addFields: {
        lesson: { $toObjectId: '$lesson' }
      }
    },
    {
      $lookup: {
        from: 'lessons',
        localField: 'lesson',
        foreignField: '_id',
        as: 'lesson'
      }
    },
    {
      $unwind: { path: '$roadmap', preserveNullAndEmptyArrays: true }
    },
    {
      $unwind: { path: '$sender', preserveNullAndEmptyArrays: true }
    },
    {
      $unwind: { path: '$learningPath', preserveNullAndEmptyArrays: true }
    },
    {
      $unwind: { path: '$lesson', preserveNullAndEmptyArrays: true }
    },
    {
      $project: {
        'sender.name': 1,
        'sender.avatar': 1,
        'sender._id': 1,
        'roadmap.name': 1,
        'learningPath.name': 1,
        'roadmap.id': 1,
        'learningPath.id': 1,
        'lesson._id': 1,
        'lesson.name': 1,
        seen: 1,
        notifType: 1,
        content: 1,
        createdAt: 1
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $facet: {
        result: [
          {
            $skip: (page - 1) * records
          },
          {
            $limit: records
          }
        ],
        totalCount: [
          {
            $count: 'count'
          }
        ]
      }
    }
  ])
  const { result, totalCount } = rs[0]
  return { result, total: totalCount[0] ? totalCount[0].count : 0 }
}

module.exports = {
  cmtRoadmapNotif,
  cmtLpNotif,
  addOutcomeRmNotif,
  doneOutcomeRmNotif,
  followRoadmapNotif,
  starRmNotif,
  starLpNotif,
  seenNotif,
  getNotifs,
  remindRoadmapNotif,
  cmtLessonNotif
}
