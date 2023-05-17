const { ObjectId } = require('mongoose').Types

const { Organization, LearningPath, OrganizationUser } = require('../models')

const createOrganization = async (data, creator) => {
  const newObId = new ObjectId()
  const [organization] = await Promise.all([
    new Organization({ _id: newObId, ...data }).save(),
    new OrganizationUser({
      ogz: newObId,
      inviting: false,
      accepted: true,
      user: creator,
      role: 'ADMIN'
    }).save()
  ])
  return organization
}

const updateOrganization = async (ogzId, data) => {
  return await Organization.findByIdAndUpdate(ogzId, data, { new: true })
}

const updateBackgroundImg = async (ogzId, data) => {
  return await Organization.findByIdAndUpdate(ogzId, data)
}

const createOgzLP = async (ogzId, data) => {
  const newLpId = new ObjectId()
  const createdOgzLP = new LearningPath({ ...data, _id: newLpId }).save()
  const updatedOgz = Organization.findByIdAndUpdate(
    ogzId,
    {
      $addToSet: { learningPaths: newLpId }
    },
    { new: true }
  )
  return await Promise.all([createdOgzLP, updatedOgz])
}

const deleteOgzLP = async (ogzId, learningPathId) => {
  await Promise.all([
    Organization.findByIdAndUpdate(ogzId, {
      $pull: { learningPaths: learningPathId }
    }),
    LearningPath.findByIdAndDelete(learningPathId)
  ])
}

const addMember = async (ogzId, user, role) => {
  const newOU = new OrganizationUser({ ogz: ogzId, user: user._id, role })
  return await (await newOU.save()).populate('ogz', 'name')
}

const removeMember = async (ogzId, user) => {
  return await OrganizationUser.findOneAndDelete({ ogz: ogzId, user: user })
}

const getMembers = async (ogzId) => {
  const members = await OrganizationUser.find({ ogz: ogzId, accepted: true }, { ogz: 0 })
    .populate('user', 'name email _id avatar')
    .lean()
  return members.map((member) => ({ ...member.user, role: member.role }))
}

const getOgzDetail = async (ogzId) => {
  const [ogzDetail, members] = await Promise.all([
    Organization.findById(ogzId)
      .populate('learningPaths')
      .lean(),
    OrganizationUser.find({ ogz: ogzId })
      .populate({
        path: 'user',
        select: '_id name email avatar role'
      })
      .lean()
  ])
  return { ogzDetail, members }
}

const getMyOgzs = async (userId) => {
  const myOgzs = await OrganizationUser.find({ user: userId }).populate('ogz').lean()
  const mOgz = myOgzs.map((ogz) => ogz.ogz)
  return mOgz
}

const acceptInvite = async (ogzId, user) => {
  return await OrganizationUser.findOneAndUpdate(
    { ogz: ogzId, user: user._id },
    { accepted: true, inviting: false },
    { new: true }
  )
}

const denyInvite = async (ogzId, user) => {
  return await OrganizationUser.findOneAndDelete({ ogz: ogzId, user: user._id })
}

const editRole = async (ogzId, user, role) => {
  return await OrganizationUser.findOneAndUpdate({ ogz: ogzId, user }, { role }, { new: true })
}

const getRole = async (ogz, user) => {
  return await OrganizationUser.findOne({ ogz, user })
}

module.exports = {
  createOrganization,
  createOgzLP,
  updateOrganization,
  deleteOgzLP,
  getOgzDetail,
  addMember,
  removeMember,
  getMembers,
  getMyOgzs,
  acceptInvite,
  denyInvite,
  updateBackgroundImg,
  editRole,
  getRole
}
