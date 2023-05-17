const express = require('express')

const notifRoutes = require('./notfi.route')

const router = express.Router()

router.use('/notifs', notifRoutes)

module.exports = router