const notif = async (req, res, next) => {
  try {
    const { socket } = req
    const { to } = req.body
    socket.to(to).emit('new-notif', { data: 'any' })
    return res.status(200).send('OK')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  notif
}