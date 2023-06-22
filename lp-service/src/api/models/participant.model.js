const mongoose = require('mongoose')
const { nanoid } = require('nanoid')

const participantSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => nanoid(10),
    index: true
  },
  lpId: {
    type: String
  },
  userId: {
    type: String
  },
  joinTime: {
    type: Date
  }
})

const Participant = mongoose.model('participant', participantSchema)

module.exports = Participant
