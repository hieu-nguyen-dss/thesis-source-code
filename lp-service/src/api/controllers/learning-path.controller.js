const httpStatus = require('http-status')
const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

const getApiResponse = require('../utils/response')
const { learningPathRepo, editPermissionRepo, organizationRepo } = require('../repo')

const searchLearningPath = async (req, res, next) => {
  try {
    const rs = await learningPathRepo.searchLP(req.query)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const createLearningPath = async (req, res, next) => {
  const { id: ownerId } = req.payload
  const data = req.body
  try {
    const createdLearningPath = await learningPathRepo.createLearningPath({ ownerId, ...data })
    await editPermissionRepo.createEditPermission(createdLearningPath._id, ownerId)
    return res.status(httpStatus.OK).json(getApiResponse({ data: createdLearningPath }))
  } catch (error) {
    next(error)
  }
}

const getMyLPs = async (req, res, next) => {
  const { id, userType } = req.payload
  try {
    const myLPs = await learningPathRepo.getMyLP(id, userType)
    return res.status(httpStatus.OK).json(getApiResponse({ data: myLPs }))
  } catch (error) {
    next(error)
  }
}

const getMyLPsAll = async (req, res, next) => {
  try {
    const myLPs = await learningPathRepo.getMyLPAll()
    return res.status(httpStatus.OK).json(getApiResponse({ data: myLPs }))
  } catch (error) {
    next(error)
  }
}

const getLPDetail = async (req, res, next) => {
  const { learningPathId } = req.params
  const { id } = req.payload
  try {
    const [lp, permission] = await Promise.all([
      learningPathRepo.getLPDetail(learningPathId, id),
      learningPathRepo.checkEditPermission(learningPathId, id)
    ])
    if (lp) {
      lp.yours = false
      if (lp.ownerId) {
        lp.yours = lp.ownerId._id.toString() === id
      }
      if (permission) {
        lp.editable = true
      }
    }
    if (!lp.public && !(lp.yours || lp.editable)) {
      return res.status(httpStatus.NOT_FOUND).json(getApiResponse({ data: null }))
    }
    return res.status(httpStatus.OK).json(getApiResponse({ data: lp }))
  } catch (error) {
    next(error)
  }
}

const getOgzLPDetail = async (req, res, next) => {
  const { ogzId, learningPathId } = req.params
  const { id } = req.payload
  try {
    const [lp, permission, ou] = await Promise.all([
      learningPathRepo.getLPDetail(learningPathId, id),
      learningPathRepo.checkEditPermission(learningPathId, id),
      organizationRepo.getRole(ogzId, id)
    ])
    if (lp) {
      lp.yours = false
      if (ou && ou.role === 'ADMIN') {
        lp.yours = true
      }
      if (permission) {
        lp.editable = true
      }
    }
    const outGroup = ou === null
    if (!lp.public && outGroup) {
      return res.status(httpStatus.NOT_FOUND).json(getApiResponse({ data: null }))
    }
    if (!lp.public && !(lp.yours || lp.editable || outGroup)) {
      return res.status(httpStatus.NOT_FOUND).json(getApiResponse({ data: null }))
    }
    return res.status(httpStatus.OK).json(getApiResponse({ data: lp }))
  } catch (error) {
    next(error)
  }
}

const deleteLP = async (req, res, next) => {
  const { learningPathId } = req.params
  try {
    await learningPathRepo.deleteLP(learningPathId)
    return res.status(httpStatus.OK).json(getApiResponse({ msg: 'Deleted' }))
  } catch (error) {
    next(error)
  }
}

const forkLP = async (req, res, next) => {
  const { learningPathId } = req.params
  const { id } = req.payload
  try {
    const rs = await learningPathRepo.forkLP(learningPathId, id)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const updateLP = async (req, res, next) => {
  const { learningPathId } = req.params
  try {
    const rs = await learningPathRepo.updateLP(learningPathId, req.body)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const addEditor = async (req, res, next) => {
  const { learningPathId } = req.params
  const { userId } = req.body
  try {
    const rs = await learningPathRepo.addEditor(learningPathId, userId)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const removeEditor = async (req, res, next) => {
  const { learningPathId } = req.params
  const { userId } = req.body
  try {
    const rs = await learningPathRepo.removeEditor(learningPathId, userId)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const getLPEditors = async (req, res, next) => {
  const { learningPathId } = req.params
  try {
    const rs = await learningPathRepo.getLPEditors(learningPathId)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const starLP = async (req, res, next) => {
  const { learningPathId } = req.params
  const { id } = req.payload
  try {
    const rs = await learningPathRepo.starLP(id, learningPathId)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const unStarLP = async (req, res, next) => {
  const { learningPathId } = req.params
  const { id } = req.payload
  try {
    const rs = await learningPathRepo.unStarLP(id, learningPathId)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const getCourseData = async (req, res, next) => {
  const { learningPathId } = req.params
  try {
    const rs = await learningPathRepo.getCourseData(learningPathId)
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const exportCourse = async (req, res, next) => {
  const { learningPathId } = req.params
  try {
    // write data
    const courseData = await learningPathRepo.getCourseData(learningPathId)
    const jsonData = JSON.stringify(courseData)
    const scormPath = path.join(__dirname, '..', '..', 'asset', 'scorm/')
    const dataPath = path.join(__dirname, '..', '..', 'asset', 'scorm', 'data', 'data.json')
    fs.writeFileSync(dataPath, jsonData)
    // change scorm name
    const imsmanifestPath = path.join(__dirname, '..', '..', 'asset')
    const imsData = fs
      .readFileSync(`${imsmanifestPath}/changes/imsmanifest.xml`, { encoding: 'utf8' })
      .toString()
    fs.writeFileSync(
      `${imsmanifestPath}/scorm/imsmanifest.xml`,
      imsData.replace(/COURSE_NAME/g, courseData.name),
      { encoding: 'utf8' }
    )

    // zip
    const archive = archiver('zip')
    archive.directory(scormPath, false)
    archive.pipe(res)
    archive.finalize()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  searchLearningPath,
  createLearningPath,
  forkLP,
  getMyLPs,
  getLPDetail,
  getOgzLPDetail,
  deleteLP,
  updateLP,
  getMyLPsAll,
  addEditor,
  removeEditor,
  getLPEditors,
  starLP,
  unStarLP,
  getCourseData,
  exportCourse
}
