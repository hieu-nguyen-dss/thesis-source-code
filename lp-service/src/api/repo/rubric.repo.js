const { ObjectId } = require('mongoose').Types

const { Rubric, LearningPath } = require('../models')
const initRubric = require('../utils/rubrics')

const createRubric = async (learningPathId, data) => {
  const rbId = new ObjectId()
  const lp = await LearningPath.findOne({ id: learningPathId }, { parts: 1, _id: 0 })
    .populate({
      path: 'parts',
      populate: {
        path: 'lessons',
        select: 'name -_id'
      }
    })
    .lean()
  let lessons = []
  for (const part of lp.parts) {
    if (part.lessons) {
      for (const lesson of part.lessons) {
        lessons = [...lessons, lesson.name]
      }
    }
  }
  const { tree, rows } = initRubric(data.name, lessons)
  const [createdRubric] = await Promise.all([
    new Rubric({ _id: rbId, ...data, tree, rows }).save(),
    LearningPath.findOneAndUpdate(
      { id: learningPathId },
      {
        $addToSet: { rubrics: rbId }
      }
    )
  ])
  return createdRubric
}

const updateRubric = async (rubricId, data) => {
  return await Rubric.findByIdAndUpdate(rubricId, data, { new: true })
}

const getRubric = async (rubricId) => {
  return await Rubric.findById(rubricId)
}

const getLPRubrics = async (learningPathId) => {
  const rbs = await LearningPath.findOne(
    { id: learningPathId },
    { rubrics: 1, _id: 0, ownerId: 1, public: 1 }
  )
    .populate('rubrics')
    .lean()
  return rbs
}

const deleteRubric = async (learningPathId, rubricId) => {
  await Promise.all([
    LearningPath.findOneAndUpdate(
      { id: learningPathId },
      {
        $pull: { rubrics: rubricId }
      }
    ),
    Rubric.findByIdAndRemove(rubricId)
  ])
}

module.exports = {
  createRubric,
  updateRubric,
  deleteRubric,
  getRubric,
  getLPRubrics
}
