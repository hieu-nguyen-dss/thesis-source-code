const httpStatus = require('http-status')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')
const { nanoid } = require('nanoid')

const getApiResponse = require('../utils/response')
const { lessonRepo, userRepo, roadmapRepo, organizationRepo } = require('../repo')

const uploadFile = async (req, res, next) => {
  const { lessonId } = req.params
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse({ msg: 'No files were uploaded' }))
    }
    const uploadFolder = path.join(__dirname, '..', '..', 'resources', lessonId)
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true })
    }
    const prefixes = new Array(Object.keys(req.files).length).fill(nanoid(6))
    const mvFiles = Object.entries(req.files).map(([name, file], index) =>
      file.mv(`${uploadFolder}/${prefixes[index]}-${file.name}`)
    )
    const resData = Object.entries(req.files).map(([name, file], index) => ({
      name: `${prefixes[index]}-${file.name}`,
      type: file.mimetype
    }))
    const addLinkToLesson = lessonRepo.updateLesson(lessonId, {
      $addToSet: {
        resources: {
          $each: Object.entries(req.files).map(([name, file], index) => ({
            name: `${prefixes[index]}-${file.name}`,
            type: file.mimetype
          }))
        }
      }
    })
    await Promise.all([...mvFiles, addLinkToLesson])
    return res.status(httpStatus.OK).json(getApiResponse({ data: resData }))
  } catch (error) {
    next(error)
  }
}

const deleteFile = async (req, res, next) => {
  const { lessonId } = req.params
  const { name, type } = req.body
  try {
    fs.unlinkSync(path.join(__dirname, '..', '..', 'resources', lessonId, name))
    await lessonRepo.updateLesson(lessonId, {
      $pull: { resources: { name, type } }
    })
    return res.status(httpStatus.OK).json(getApiResponse({ msg: 'Deleted' }))
  } catch (error) {
    next(error)
  }
}

const changeAvatar = async (req, res, next) => {
  const { id } = req.payload
  try {
    const avatarFolder = path.join(__dirname, '..', '..', 'resources', 'avatars', id)
    if (!fs.existsSync(avatarFolder)) {
      fs.mkdirSync(avatarFolder, { recursive: true })
    }
    const file = req.files.avatar
    const [, , user] = await Promise.all([
      file.mv(`${avatarFolder}/${file.name}`),
      sharp(file.data).resize(64, 64).toFile(`${avatarFolder}/64x64${file.name}`),
      userRepo.updateUser(id, { avatar: file.name })
    ])
    if (user.avatar && user.avatar !== file.name) {
      if (fs.existsSync(`${avatarFolder}/${user.avatar}`)) {
        fs.unlinkSync(`${avatarFolder}/${user.avatar}`)
      }
      if (fs.existsSync(`${avatarFolder}/64x64${user.avatar}`)) {
        fs.unlinkSync(`${avatarFolder}/64x64${user.avatar}`)
      }
    }
    return res.status(httpStatus.OK).json(getApiResponse({ data: file.name }))
  } catch (error) {
    next(error)
  }
}

const uploadFileRoadmap = async (req, res, next) => {
  const { roadmapId, roadmapStepId } = req.params
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse({ msg: 'No files were uploaded' }))
    }
    const uploadFolder = path.join(__dirname, '..', '..', 'resources', roadmapId, roadmapStepId)
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true })
    }
    const prefixes = new Array(Object.keys(req.files).length).fill(nanoid(6))
    const mvFiles = Object.entries(req.files).map(([name, file], index) =>
      file.mv(`${uploadFolder}/${prefixes[index]}-${file.name}`)
    )
    const resData = Object.entries(req.files).map(([name, file], index) => ({
      name: `${prefixes[index]}-${file.name}`,
      type: file.mimetype
    }))
    const addLinkToRoadmapStep = roadmapRepo.updateStep(roadmapStepId, {
      $addToSet: {
        resources: {
          $each: Object.entries(req.files).map(([name, file], index) => ({
            name: `${prefixes[index]}-${file.name}`,
            type: file.mimetype
          }))
        }
      }
    })
    await Promise.all([...mvFiles, addLinkToRoadmapStep])
    return res.status(httpStatus.OK).json(getApiResponse({ data: resData }))
  } catch (error) {
    next(error)
  }
}

const deleteFileRoadmap = async (req, res, next) => {
  const { roadmapId, roadmapStepId } = req.params
  const { name, type } = req.body
  try {
    fs.unlinkSync(path.join(__dirname, '..', '..', 'resources', roadmapId, roadmapStepId, name))
    await roadmapRepo.updateStep(roadmapStepId, {
      $pull: { resources: { name, type } }
    })
    return res.status(httpStatus.OK).json(getApiResponse({ msg: 'Deleted' }))
  } catch (error) {
    next(error)
  }
}

const uploadBackgroundOgz = async (req, res, next) => {
  const { ogzId: id } = req.params
  try {
    const bgFolder = path.join(__dirname, '..', '..', 'resources', 'organizations', id)
    if (!fs.existsSync(bgFolder)) {
      fs.mkdirSync(bgFolder, { recursive: true })
    }
    const file = req.files.ogzBg
    const [, ogz] = await Promise.all([
      file.mv(`${bgFolder}/${file.name}`),
      organizationRepo.updateBackgroundImg(id, { backgroundImg: file.name })
    ])
    if (ogz.backgroundImg && ogz.backgroundImg !== file.name) {
      if (fs.existsSync(`${bgFolder}/${ogz.backgroundImg}`)) {
        fs.unlinkSync(`${bgFolder}/${ogz.backgroundImg}`)
      }
    }
    return res.status(httpStatus.OK).json(getApiResponse({ data: file.name }))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  uploadFile,
  deleteFile,
  changeAvatar,
  uploadFileRoadmap,
  deleteFileRoadmap,
  uploadBackgroundOgz
}
