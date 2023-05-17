const httpStatus = require('http-status')

const getApiResponse = require('../utils/response')
const { rubricRepo, organizationRepo, learningPathRepo } = require('../repo')

const createRubric = async (req, res, next) => {
  const { learningPathId } = req.params
  try {
    const createdRubric = await rubricRepo.createRubric(learningPathId, req.body)
    return res.status(httpStatus.OK).json(getApiResponse({ data: createdRubric }))
  } catch (error) {
    next(error)
  }
}

const updateRubric = async (req, res, next) => {
  const { rubricId } = req.params
  try {
    const updatedRubric = await rubricRepo.updateRubric(rubricId, req.body)
    return res.status(httpStatus.OK).json(getApiResponse({ data: updatedRubric }))
  } catch (error) {
    next(error)
  }
}

const getRubric = async (req, res, next) => {
  const { rubricId } = req.params
  try {
    const rubric = await rubricRepo.getRubric(rubricId)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rubric }))
  } catch (error) {
    next(error)
  }
}

const getLPRubrics = async (req, res, next) => {
  const { learningPathId } = req.params
  const { id } = req.payload
  try {
    const rubric = await rubricRepo.getLPRubrics(learningPathId)
    if (rubric) {
      rubric.yours = false
      if (rubric.ownerId.toString() === id) {
        rubric.yours = true
      }
      if (!rubric.public && !rubric.yours) {
        return res.status(httpStatus.NOT_FOUND).json(getApiResponse({ data: null }))
      }
      return res.status(httpStatus.OK).json(getApiResponse({ data: rubric }))
    } else {
      return res.status(httpStatus.NOT_FOUND).json(getApiResponse({ data: rubric }))
    }
  } catch (error) {
    next(error)
  }
}

const getOgzLPRubrics = async (req, res, next) => {
  const { learningPathId, ogzId } = req.params
  const { id } = req.payload
  try {
    const [rubric, permission, ou] = await Promise.all([
      rubricRepo.getLPRubrics(learningPathId),
      learningPathRepo.checkEditPermission(learningPathId, id),
      organizationRepo.getRole(ogzId, id)
    ])
    if (rubric) {
      rubric.yours = false
      if (ou && ou.role === 'ADMIN') {
        rubric.yours = true
      }
      if (permission) {
        rubric.editable = true
      }
      if (!rubric.public && !(rubric.yours || rubric.editable)) {
        return res.status(httpStatus.NOT_FOUND).json(getApiResponse({ data: null }))
      }
      return res.status(httpStatus.OK).json(getApiResponse({ data: rubric }))
    } else {
      return res.status(httpStatus.NOT_FOUND).json(getApiResponse({ data: null }))
    }
  } catch (error) {
    next(error)
  }
}

const deleteRubric = async (req, res, next) => {
  const { learningPathId, rubricId } = req.params
  try {
    await rubricRepo.deleteRubric(learningPathId, rubricId)
    return res.status(httpStatus.OK).json(getApiResponse({ msg: 'Deleted' }))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createRubric,
  updateRubric,
  deleteRubric,
  getRubric,
  getLPRubrics,
  getOgzLPRubrics
}
