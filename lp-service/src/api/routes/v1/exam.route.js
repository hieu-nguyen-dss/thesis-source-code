const { Router } = require('express')
const {
  questionController,
  examController,
  keyController,
  examAnalystController
} = require('../../controllers')
const examService = require('../../services/examService')
const multer = require('multer')
const { verifyToken } = require('../../middlewares')

let router = Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const uploadFile = multer({ storage: storage })

//Question
router.route('/create-question').post(verifyToken, questionController.handleAddQuestionController)
router.route('/list-questions').get(verifyToken, questionController.handleGetAllQuestionController)
router.route('/get-question').get(verifyToken, questionController.handleGetQuestionByIdController)
router
  .route('/delete-question')
  .delete(verifyToken, questionController.handleDeleteQuestionController)
router
  .route('/update-question')
  .patch(verifyToken, questionController.handleUpdateQuestionController)

// Exam
router.route(`/get-exam`).get(verifyToken, examController.handleGetExamByIdController)
router.route('/list-exams').get(verifyToken, examController.handleGetAllExamsController)

//Exam Upload file
router.post('/upload-exam', uploadFile.single('file'), async function (req, res) {
  let subject = req.body.subject
  let category = req.body.category
  let questions = req.body.questions
  let timeLimit = req.body.timeLimit
  let maxScore = req.body.maxScore
  let file = req.file
  if (file) res.send(file)
  let newExamData = await examService.handleCreateExamService(
    subject,
    category,
    questions,
    timeLimit,
    maxScore,
    file.originalname
  )
  const result = {
    errorCode: newExamData.errCode,
    message: newExamData.errMessage,
    exam: newExamData.exam ? newExamData.exam : ''
  }
  console.log('result: ', result)

  //   return result;
})
router.route('/create-exam').post(verifyToken, examController.handleCreateExamController)

// Key Answer
router.route('/create-key').post(verifyToken, keyController.handleCreateKeyController)
router.route('/update-question-key').patch(verifyToken, keyController.handleUpdateKeyController)
router.route('/get-key-by-id').get(verifyToken, keyController.handleGetKeyByIdController)

router.route('/list-keys').get(verifyToken, keyController.handleGetAllKeyController)

// Exam Analyst
router
  .route('/create-exam-analyst')
  .post(verifyToken, examAnalystController.handleCreateExamAnalystController)

router
  .route('/get-analyst-by-id')
  .get(verifyToken, examAnalystController.handleGetAnalystByIdController)

module.exports = router
