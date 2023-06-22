const { Question, Lesson, Quizzes, ResultQuizzes } = require('../models')
const getApiResponse = require('../utils/response')
const httpStatus = require('http-status')
const { nanoid } = require('nanoid')

const getQuizz = async (req, res, next) => {
  const { params } = req
  try {
    const lesson = await Lesson.findById({ _id: params.lessonId })
    const quizzes = lesson?.quiz
    const quizzesList = await Quizzes.find({ _id: { $in: quizzes } }).populate({
      path: 'questions'
    })
    return res.status(httpStatus.OK).json(getApiResponse({ data: { quizzes: quizzesList } }))
  } catch (error) {
    next(error)
  }
}

const getQuestion = async (req, res, next) => {
  const { query } = req
  try {
    const question = await Question.findById(query.questionId)
    return res.status(httpStatus.OK).json(getApiResponse({ data: { question } }))
  } catch (error) {
    next(error)
  }
}

const updateQuestion = async (req, res, next) => {
  const { query, body } = req
  try {
    const question = await Question.findByIdAndUpdate(query.questionId, {
      questions: body.question,
      choices: body.choices,
      answer: body.answer
    })

    await Quizzes.findByIdAndUpdate(query.quizId, {
      updatedAt: Date.now()
    })
    return res.status(httpStatus.OK).json(getApiResponse({ data: { question } }))
  } catch (error) {
    next(error)
  }
}

/** insert all questinos */
const insertQuestions = async (req, res, next) => {
  const { params, body } = req
  try {
    const questions = new Question({
      questions: body.question,
      choices: body.choices,
      answer: body.answer
    })
    const createdQuestions = await questions.save()
    let createdQuizzes = null
    const existQuizzOfLesson = await Quizzes.find({ lessonId: params.lessonId })
    if (existQuizzOfLesson.length !== 0) {
      createdQuizzes = await Quizzes.findOneAndUpdate(
        { lessonId: params.lessonId },
        {
          updatedAt: Date.now()
        }
      )
      await Quizzes.findOneAndUpdate(
        { lessonId: params.lessonId },
        {
          $addToSet: {
            questions: createdQuestions._id
          }
        }
      )
    } else {
      const quizzes = new Quizzes({
        id: nanoid(10),
        questions: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        startAt: new Date('2023-03-12'),
        endAt: new Date('2023-03-22'),
        answer: body?.answer,
        author: body?.userId,
        lessonId: params.lessonId
      })
      createdQuizzes = await quizzes.save()
      await Lesson.findOneAndUpdate(
        { _id: params.lessonId },
        {
          $addToSet: {
            quiz: createdQuizzes._id
          }
        }
      )
      await Quizzes.findOneAndUpdate(
        { id: createdQuizzes.id },
        {
          $addToSet: {
            questions: createdQuestions._id
          }
        }
      )
    }
    return res.status(httpStatus.OK).json(getApiResponse({ data: { question: createdQuizzes } }))
  } catch (error) {
    next(error)
  }
}

/** Delete all Questions */
const deleteQuestion = async (req, res) => {
  const { query } = req
  try {
    const quiz = await Quizzes.findById(query.quizId)
    const questionsUpdate = quiz.questions.filter((q) => q.toString() !== query.questionId)
    await Quizzes.findByIdAndUpdate(query.quizId, {
      questions: questionsUpdate
    })
    await Question.findByIdAndDelete(query.questionId)
    return res.status(httpStatus.OK).json(getApiResponse({ msg: 'Delete successfully' }))
  } catch (error) {
    res.json({ error })
  }
}

function roundDecimal(number) {
  const roundedNumber = Math.round(number)
  if (number % 1 === 0.5) {
    return Math.ceil(number)
  }
  return roundedNumber
}

const storeResult = async (req, res) => {
  const { params } = req
  try {
    const { studentAnswers } = req.body
    const quiz = await Quizzes.find({ _id: params.quizzId }).populate({
      path: 'questions'
    })
    const questions = quiz[0]?.questions
    let score = 0
    let count = 0
    let achive = false
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].answer === studentAnswers[i].answer) {
        count++
      }
      studentAnswers[i].correctAnswer = questions[i].answer
    }
    if (count / questions.length > 5) {
      achive = true
    }

    score = roundDecimal((count / questions.length) * 10)
    const result = new ResultQuizzes({
      id: nanoid(10),
      studentId: params.studentId,
      quizId: params.quizzId,
      studentAnswers,
      timeSubmit: Date.now(),
      score,
      achive
    })

    const resultQuiz = await result.save()

    return res
      .status(httpStatus.OK)
      .json(getApiResponse({ data: { result: resultQuiz, answer: questions } }))
  } catch (error) {
    res.json({ error })
  }
}

const getAnswer = async (req, res) => {
  const { params } = req
  try {
    const answers = await ResultQuizzes.countDocuments({
      quizId: params.quizzId,
      studentId: params.studentId
    })
    const latestAnswer = await ResultQuizzes.findOne({
      quizId: params.quizzId,
      studentId: params.studentId
    }).sort({ $natural: 1 })
    return res
      .status(httpStatus.OK)
      .json(getApiResponse({ data: { result: latestAnswer, total: answers } }))
  } catch (error) {
    res.json({ error })
  }
}

// /** delete all result */
// export async function dropResult(req, res){
//     try {
//         await Results.deleteMany();
//         res.json({ msg : "Result Deleted Successfully...!"})
//     } catch (error) {
//         res.json({ error })
//     }
// }

module.exports = {
  insertQuestions,
  getQuizz,
  storeResult,
  getAnswer,
  deleteQuestion,
  getQuestion,
  updateQuestion
}
