const {
  AnalysisUser,
  User,
  LearningPath,
  Roadmap,
  UserFollowRoadmap,
  AnalysisLp
} = require('../models')

const getAmountUser = async () => {
  const rs = await AnalysisUser.find()
  return rs
}

const totalCourse = async () => {
  return await LearningPath.count()
}

const totalLpTimeSr = async () => {
  const rs = await AnalysisLp.find({}).sort({ timestamp: -1 }).limit(20).lean()
  return rs.reverse()
}

const totalRoadmap = async () => {
  return await Roadmap.count()
}

const insertAmountUser = async () => {
  const amountUser = await User.count({})
  await new AnalysisUser({ totalUsers: amountUser, timestamp: new Date() }).save()
  return true
}

const insertAmountLp = async () => {
  const [amountCourse, amountRoadmap] = await Promise.all([
    LearningPath.count({}),
    Roadmap.count({})
  ])
  await new AnalysisLp({
    totalCourses: amountCourse,
    totalRoadmaps: amountRoadmap,
    timestamp: new Date()
  }).save()
  return true
}

const topStarLpUser = async () => {
  const rs = await LearningPath.aggregate([
    {
      $match: {
        ownerType: {
          $ne: 'ORGANIZATION'
        }
      }
    },
    {
      $group: {
        _id: '$ownerId',
        count: {
          $sum: '$stars'
        }
      }
    },
    {
      $sort: {
        count: -1
      }
    },
    {
      $limit: 10
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'owner'
      }
    },
    {
      $unwind: {
        path: '$owner',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        'owner.password': 0,
        'owner._id': 0
      }
    }
  ])
  return rs
}

const topStarRoadmapUser = async () => {
  const rs = await Roadmap.aggregate([
    {
      $group: {
        _id: '$ownerId',
        count: {
          $sum: '$stars'
        }
      }
    },
    {
      $sort: {
        count: -1
      }
    },
    {
      $limit: 10
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'owner'
      }
    },
    {
      $unwind: {
        path: '$owner',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        'owner.password': 0,
        'owner._id': 0
      }
    }
  ])
  return rs
}

const topFollowRoadmap = async () => {
  const rs = await UserFollowRoadmap.aggregate([
    {
      $group: {
        _id: '$roadmap',
        followers: {
          $sum: 1
        }
      }
    },
    {
      $lookup: {
        from: 'roadmaps',
        localField: '_id',
        foreignField: 'id',
        as: 'roadmap'
      }
    },
    {
      $unwind: {
        path: '$roadmap'
      }
    },
    {
      $project: {
        _id: 1,
        'roadmap.name': 1,
        'roadmap.stars': 1,
        'roadmap.id': 1,
        followers: 1
      }
    },
    {
      $sort: {
        followers: -1
      }
    },
    {
      $limit: 10
    }
  ])
  return rs
}

const topStarLps = async () => {
  return await LearningPath.aggregate([
    {
      $sort: {
        stars: -1
      }
    },
    {
      $limit: 10
    },
    {
      $project: {
        name: 1,
        stars: 1,
        id: 1
      }
    }
  ])
}

const topStarRms = async () => {
  return await Roadmap.aggregate([
    {
      $sort: {
        stars: -1
      }
    },
    {
      $limit: 10
    },
    {
      $project: {
        name: 1,
        stars: 1,
        id: 1
      }
    }
  ])
}

const totalUserTimeSr = async () => {
  const rs = await AnalysisUser.find({}).sort({ timestamp: -1 }).limit(20).lean()
  return rs.reverse()
}

module.exports = {
  getAmountUser,
  insertAmountUser,
  topStarLps,
  topStarLpUser,
  topStarRoadmapUser,
  topFollowRoadmap,
  topStarRms,
  totalCourse,
  totalRoadmap,
  insertAmountLp,
  totalLpTimeSr,
  totalUserTimeSr
}
