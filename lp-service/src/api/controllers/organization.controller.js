const httpStatus = require('http-status')

const getApiResponse = require('../utils/response')
const genToken = require('../utils/gen-token')
const sendInviteMail = require('../utils/node-mailer')
const { organizationRepo: ogzRepo } = require('../repo')

const createOrganization = async (req, res, next) => {
  const { id: admin } = req.payload
  try {
    const createdOgz = await ogzRepo.createOrganization(req.body, admin)
    return res.status(httpStatus.OK).json(getApiResponse({ data: createdOgz }))
  } catch (error) {
    next(error)
  }
}

const editOrganization = async (req, res, next) => {
  const { ogzId } = req.params
  try {
    const editedOgz = await ogzRepo.updateOrganization(ogzId, req.body)
    return res.status(httpStatus.OK).json(getApiResponse({ data: editedOgz }))
  } catch (error) {
    next(error)
  }
}

const addMember = async (req, res, next) => {
  const { ogzId } = req.params
  const { user, role } = req.body
  const {
    authConfig: { secretKey }
  } = req
  try {
    const token = genToken({ ogzId, user, role }, secretKey)
    const updatedOgz = await ogzRepo.addMember(ogzId, user, role)
    const sendMailRes = await sendInviteMail(
      'kien.tv.1999@gmail.com',
      updatedOgz.ogz.name,
      ogzId,
      token
    )
    return res.status(httpStatus.OK).json(getApiResponse({ data: { updatedOgz, sendMailRes } }))
  } catch (error) {
    next(error)
  }
}

const removeMember = async (req, res, next) => {
  const { ogzId } = req.params
  const { userId } = req.body
  try {
    const updatedOgz = await ogzRepo.removeMember(ogzId, userId)
    return res.status(httpStatus.OK).json(getApiResponse({ data: updatedOgz }))
  } catch (error) {
    next(error)
  }
}

const getMembers = async (req, res, next) => {
  const { ogzId } = req.params
  try {
    const members = await ogzRepo.getMembers(ogzId)
    return res.status(httpStatus.OK).json(getApiResponse({ data: members }))
  } catch (error) {
    next(error)
  }
}

const getOrganization = async (req, res, next) => {
  const { id } = req.payload
  const { ogzId } = req.params
  try {
    const rs = await ogzRepo.getOgzDetail(ogzId)
    if (rs.members) {
      for (const member of rs.members) {
        if (member.user._id.toString() === id && member.role === 'ADMIN') {
          rs.ogzDetail.youAreAdmin = true
          break
        }
      }
    }
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const deleteOrganization = async (req, res, next) => {
  // const { ogzId } = req.params
  try {
  } catch (error) {
    next(error)
  }
}

const createLearningPath = async (req, res, next) => {
  const { id } = req.payload
  const { ogzId } = req.params
  try {
    const rs = await ogzRepo.createOgzLP(ogzId, { ...req.body, ownerId: id })
    return res.status(httpStatus.OK).json(getApiResponse({ data: rs }))
  } catch (error) {
    next(error)
  }
}

const deleteLearningPath = async (req, res, next) => {
  const { ogzId, learningPathId } = req.params
  try {
    await ogzRepo.deleteOgzLP(ogzId, learningPathId)
    return res.status(httpStatus.OK).json(getApiResponse({ msg: 'Deleted' }))
  } catch (error) {
    next(error)
  }
}

const getMyOgzs = async (req, res, next) => {
  const { id } = req.payload
  try {
    const myOgzs = await ogzRepo.getMyOgzs(id)
    return res.status(httpStatus.OK).json(getApiResponse({ data: myOgzs }))
  } catch (error) {
    next(error)
  }
}

const acceptInvite = async (req, res, next) => {
  const { ogzId, user } = req.payload
  try {
    const accepted = await ogzRepo.acceptInvite(ogzId, user)
    return res.status(httpStatus.OK).json(getApiResponse({ data: accepted }))
  } catch (error) {
    next(error)
  }
}

const editRole = async (req, res, next) => {
  const { ogzId } = req.params
  const { userId, role } = req.body
  try {
    const edited = await ogzRepo.editRole(ogzId, userId, role)
    return res.status(httpStatus.OK).json(getApiResponse({ data: edited }))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createOrganization,
  editOrganization,
  addMember,
  removeMember,
  getMembers,
  deleteOrganization,
  getOrganization,
  createLearningPath,
  deleteLearningPath,
  getMyOgzs,
  acceptInvite,
  editRole
}
