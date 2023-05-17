const httpStatus = require('http-status')

const getApiResponse = require('../utils/response')
const { notifRepo } = require('../repo')

const getNotifs = async (req, res, next) => {
  const { id } = req.payload
  try {
    const notifs = await notifRepo.getNotifs(id, req.query)
    return res.status(httpStatus.OK).json(getApiResponse({ data: notifs }))
  } catch (error) {
    next(error)
  }
}

const seenNotif = async (req, res, next) => {
  const { notifId } = req.params
  try {
    const notif = await notifRepo.seenNotif(notifId)
    return res.status(httpStatus.OK).json(getApiResponse({ data: notif }))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getNotifs,
  seenNotif
}
