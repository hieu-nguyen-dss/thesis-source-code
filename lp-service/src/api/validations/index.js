const userValidation = require('./user.validation')
const lpValidation = require('./learning-path.validation')
const partValidation = require('./part.validation')
const lessonValidation = require('./lesson.validation')
const lessonPartValidation = require('./lesson-part.validation')
const learningActionValidation = require('./learning-action.validation copy')
const commentValidation = require('./comment.validation')
const uploadValidation = require('./upload.validation')
const rubricValidation = require('./rubric.validation')
const organizationValidation = require('./organization.validation')
const roadmapValidation = require('./roadmap.validation')
const adminValidation = require('./admin.validation')
const notifValidation = require('./notif.validation')

module.exports = {
  userValidation,
  lpValidation,
  partValidation,
  lessonValidation,
  lessonPartValidation,
  learningActionValidation,
  commentValidation,
  uploadValidation,
  rubricValidation,
  organizationValidation,
  roadmapValidation,
  adminValidation,
  notifValidation
}
