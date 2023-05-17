const { ChatRoom } = require('../models')
const getApiResponse = require('../utils/response')
const httpStatus = require('http-status')

const getListRoomChat = async (req, res, next) => {
  const { courseId } = req.params
  try {
    const rooms = await ChatRoom.find({
      courseId
    })
    return res.status(httpStatus.OK).json(
      getApiResponse({
        data: {
          rooms: rooms
        }
      })
    )
  } catch (error) {
    console.log('error on start chat method', error)
    next(error)
  }
}

const initiate = async (req, res, next) => {
  const { courseId } = req.params
  const { userIds, chatInitiator, name } = req.body
  const allUserIds = [...userIds, chatInitiator]
  try {
    const availableRoom = await ChatRoom.findOne({
      userIds: {
        $size: userIds.length,
        $all: [...userIds]
      },
      courseId,
      name
    })
    if (availableRoom) {
      return {
        isNew: false,
        message: 'retrieving an old chat room',
        chatRoomId: availableRoom._doc._id,
        type: availableRoom._doc.type
      }
    }
    const newRoom = new ChatRoom({
      userIds: allUserIds,
      courseId,
      chatInitiator,
      name
    })
    const createdNewRoom = await newRoom.save()
    return res.status(httpStatus.OK).json(
      getApiResponse({
        data: {
          room: {
            isNew: true,
            chatRoomId: createdNewRoom
          }
        }
      })
    )
  } catch (error) {
    console.log('error on start chat method', error)
    next(error)
  }
  // const chatRoom = await ChatRoom.initiateChat(allUserIds, params.courseId, chatInitiator, name)
}

module.exports = {
  initiate,
  getListRoomChat
}
