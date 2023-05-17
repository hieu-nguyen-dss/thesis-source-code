const { Lesson, Part, LearningPath, EditPermission, OrganizationUser } = require('../models')

const getLesson = async (userId, learningPathId, lessonId) => {
  const lesson = Lesson.findById(lessonId)
    .populate({
      path: 'lessonParts',
      select: '_id name',
      populate: {
        path: 'learningActions'
      }
    })
    .populate({
      path: 'updateHistories',
      populate: {
        path: 'user',
        select: '_id name'
      }
    })
    .lean()
  const outcomes = LearningPath.findOne(
    { id: learningPathId },
    { outcomes: 1, _id: 0, ownerId: 1, public: 1 }
  ).lean()
  const editPermisson = EditPermission.findOne({ learningPathId, userId }).lean()
  return await Promise.all([lesson, outcomes, editPermisson])
}

const getOgzLesson = async (ogz, userId, learningPathId, lessonId) => {
  const lesson = Lesson.findById(lessonId)
    .populate({
      path: 'lessonParts',
      select: '_id name',
      populate: {
        path: 'learningActions'
      }
    })
    .populate({
      path: 'updateHistories',
      populate: {
        path: 'user',
        select: '_id name'
      }
    })
    .lean()
  const outcomes = LearningPath.findOne(
    { id: learningPathId },
    { outcomes: 1, _id: 0, ownerId: 1, public: 1 }
  ).lean()
  const isAdmin = OrganizationUser.findOne({
    ogz, user: userId
  })
  const editPermisson = EditPermission.findOne({ learningPathId, userId }).lean()
  return await Promise.all([lesson, outcomes, editPermisson, isAdmin])
}

const createLesson = async (partId, name) => {
  const newLesson = new Lesson({ name })
  const createdLesson = await newLesson.save()
  await Part.findByIdAndUpdate(partId, {
    $addToSet: { lessons: createdLesson._id }
  })
  return newLesson
}

const deleteLesson = async (partId, lessonId) => {
  const removeFromPart = Part.findByIdAndUpdate(partId, {
    $pull: { lessons: lessonId }
  })
  const deleteLesson = Lesson.findByIdAndDelete(lessonId)
  await Promise.all([removeFromPart, deleteLesson])
}

const updateLesson = async (lessonId, data) => {
  return await Lesson.findByIdAndUpdate(lessonId, data, { new: true }).lean()
}

module.exports = {
  getLesson,
  createLesson,
  deleteLesson,
  updateLesson,
  getOgzLesson
}
