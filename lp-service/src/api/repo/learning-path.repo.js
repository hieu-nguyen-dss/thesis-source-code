const { nanoid } = require('nanoid')
const { ObjectId } = require('mongoose').Types

const {
  LearningPath,
  Part,
  Lesson,
  LessonPart,
  LearningAction,
  EditPermission,
  Roadmap,
  UserStarLp
} = require('../models')
const parseFilters = require('../utils/parse-filters')
const cloneLp = require('../utils/cloneLp')

const createLearningPath = async (data) => {
  const lp = new LearningPath(data)
  return await lp.save()
}

const getMyLP = async (ownerId) => {
  const courses = await LearningPath.aggregate([
    {
      $match: {
        ownerId: new ObjectId(ownerId),
        ownerType: { $ne: 'ORGANIZATION' }
      }
    },
    {
      $lookup: {
        from: 'user-star-lps',
        localField: 'id',
        foreignField: 'learningPath',
        as: 'userStars'
      }
    },
    {
      $addFields: {
        youStarred: {
          $in: [new ObjectId(ownerId), '$userStars.user']
        }
      }
    },
    {
      $project: {
        id: 1,
        name: 1,
        category: 1,
        public: 1,
        stars: 1,
        youStarred: 1
      }
    }
  ])
  const roadmaps = await Roadmap.aggregate([
    {
      $match: {
        ownerId: new ObjectId(ownerId)
      }
    },
    {
      $lookup: {
        from: 'user-star-roadmaps',
        localField: 'id',
        foreignField: 'roadmap',
        as: 'userStars'
      }
    },
    {
      $addFields: {
        youStarred: {
          $in: [new ObjectId(ownerId), '$userStars.user']
        }
      }
    },
    {
      $project: {
        id: 1,
        name: 1,
        category: 1,
        stars: 1,
        youStarred: 1
      }
    }
  ])
  return { courses, roadmaps }
}

const getMyLPAll = async () => {
  const courses = await LearningPath.aggregate([
    {
      $lookup: {
        from: 'user-star-lps',
        localField: 'id',
        foreignField: 'learningPath',
        as: 'userStars'
      }
    },
    {
      $project: {
        id: 1,
        name: 1,
        category: 1,
        public: 1,
        stars: 1,
        youStarred: 1
      }
    }
  ])
  return courses
}

const getLPDetail = async (id, userGetId) => {
  const [lp, starred] = await Promise.all([
    LearningPath.findOne({ id })
      .populate({
        path: 'parts',
        populate: {
          path: 'lessons',
          populate: {
            path: 'quiz',
            populate: {
              path: 'questions',
              select: ['_id', 'questions', 'choices', 'lessonId']
            }
          }
        }
      })
      .populate('rubrics')
      .populate('ownerId', 'avatar email _id name userType')
      .lean(),
    UserStarLp.findOne({ user: userGetId, learningPath: id })
  ])
  if (!lp) {
    return null
  }
  lp.starred = !!starred
  if (lp && lp.forkFrom) {
    const sourceLp = await LearningPath.findOne({ id: lp.forkFrom }, { name: 1 })
    lp.cloneFromName = sourceLp.name
  }
  return lp
}

const deleteLP = async (id) => {
  await LearningPath.findOneAndDelete({ id })
  return true
}

const updateLP = async (id, data) => {
  const updatedLP = await LearningPath.findOneAndUpdate({ id }, data)
  return updatedLP
}

const searchLP = async (query) => {
  const { star, type, page, records, ...rest } = query
  rest.public = true
  const sortStar = star && star === 'desc' ? { stars: -1 } : {}
  const parsedFilters = parseFilters(rest)
  const filterRoadmap = { ...rest }
  delete filterRoadmap.public
  const parsedFiltersRoadmap = parseFilters(filterRoadmap)
  let rs
  if (type === 'course') {
    rs = await LearningPath.aggregate([
      {
        $match: { ...parsedFilters, ownerType: { $ne: 'ORGANIZATION' } }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner'
        }
      },
      {
        $unwind: {
          path: '$owner'
        }
      },
      {
        $sort: {
          ...sortStar,
          createdAt: -1
        }
      },
      {
        $project: {
          'owner.password': 0,
          'owner.userType': 0,
          'owner.id': 0
        }
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
    const total = totalCount[0] ? totalCount[0].count : 0
    return { lps: { result, total }, rms: { result: [], total: 0 } }
  } else {
    rs = await Roadmap.aggregate([
      {
        $match: parsedFiltersRoadmap
      },
      {
        $lookup: {
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owner'
        }
      },
      {
        $unwind: {
          path: '$owner'
        }
      },
      {
        $sort: {
          ...sortStar,
          createdAt: -1
        }
      },
      {
        $project: {
          'owner.password': 0,
          'owner.userType': 0,
          'owner.id': 0
        }
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
    const total = totalCount[0] ? totalCount[0].count : 0
    return { rms: { result, total }, lps: { result: [], total: 0 } }
  }
}

const forkLP = async (id, userFork) => {
  const lp = await LearningPath.findOne({ id })
    .populate({
      path: 'parts',
      populate: {
        path: 'lessons',
        populate: {
          path: 'lessonParts',
          populate: {
            path: 'learningActions'
          }
        }
      }
    })
    .lean()
  const rs = cloneLp(lp)
  rs.clonedLp.forkFrom = id
  rs.clonedLp.id = nanoid(10)
  rs.clonedLp.ownerId = ObjectId(userFork)
  const insertRs = await Promise.all([
    new LearningPath(rs.clonedLp).save(),
    Part.insertMany(rs.clonedParts),
    Lesson.insertMany(rs.clonedLessons),
    LessonPart.insertMany(rs.clonedLessonParts),
    LearningAction.insertMany(rs.clonedLearningActions)
  ])
  return insertRs
}

const addEditor = async (learningPathId, userId) => {
  await new EditPermission({ learningPathId, userId }).save()
  return true
}

const removeEditor = async (learningPathId, userId) => {
  await EditPermission.findOneAndDelete({ learningPathId, userId })
  return true
}

const getLPEditors = async (learningPathId) => {
  const editors = await EditPermission.find({ learningPathId }).populate(
    'userId',
    '_id name email avatar'
  )
  return editors.map((editor) => editor.userId)
}

const checkEditPermission = async (learningPathId, userId) => {
  const ex = await EditPermission.findOne({ learningPathId, userId })
  return ex !== null
}

const starLP = async (user, learningPath) => {
  const exist = await UserStarLp.findOne({ user, learningPath })
  if (exist) return false
  const [, lp] = await Promise.all([
    new UserStarLp({ user, learningPath }).save(),
    LearningPath.findOneAndUpdate(
      { id: learningPath },
      { $inc: { stars: 1 } },
      { new: true }
    ).lean()
  ])
  return lp.stars
}

const unStarLP = async (user, learningPath) => {
  const exist = await UserStarLp.findOne({ user, learningPath })
  if (!exist) return false
  const [, lp] = await Promise.all([
    UserStarLp.findOneAndDelete({ user, learningPath }),
    LearningPath.findOneAndUpdate(
      { id: learningPath },
      { $inc: { stars: -1 } },
      { new: true }
    ).lean()
  ])
  return lp.stars
}

const getCourseData = async (id) => {
  const rs = await LearningPath.findOne({ id })
    .populate({
      path: 'parts',
      populate: {
        path: 'lessons',
        populate: {
          path: 'lessonParts',
          populate: {
            path: 'learningActions'
          }
        }
      }
    })
    .populate('ownerId', '_id name email avatar')
    .populate('rubrics')
    .lean()
  return rs
}

module.exports = {
  createLearningPath,
  getMyLP,
  getLPDetail,
  deleteLP,
  forkLP,
  updateLP,
  searchLP,
  addEditor,
  removeEditor,
  getLPEditors,
  starLP,
  unStarLP,
  getMyLPAll,
  getCourseData,
  checkEditPermission
}
