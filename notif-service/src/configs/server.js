
const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')

const { port } = require('./vars')
const routes = require('../routes')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*', credentials: true }})

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
  req.socket = io
  next()
} )
app.use('/', routes)

const start = () => {
  io.on('connection', socket => {
    console.log(socket.id)
    socket.on('join-room', ({ roomId }) => {
      socket.join(roomId)
    })
  })
  httpServer.listen(port, () => {
    console.log('Server listen on ' + port)
  })
}

module.exports = start
