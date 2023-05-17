const { Router } = require('express')

const { notifHandler } = require('../handlers')

const router = Router()

router.route('/followers').post(notifHandler.notif)
router.route('/roadmaps').post(notifHandler.notif)

module.exports = router
