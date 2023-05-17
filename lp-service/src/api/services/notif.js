const axios = require('axios')
const { socketServer } = require('../../config/vars')

const pushNotif = async (data) => {
  const response = await axios.default({
    method: 'POST',
    url: `${socketServer}/notifs/followers`,
    data
  })
  return response
}

const remindRoadmapNotif = async (data) => {
  const response = await axios.default({
    method: 'POST',
    url: `${socketServer}/notifs/roadmaps`,
    data
  })
  return response
}

module.exports = {
  pushNotif,
  remindRoadmapNotif
}
