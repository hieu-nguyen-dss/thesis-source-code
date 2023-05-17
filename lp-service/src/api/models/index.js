const User = require('./user.model')
const EditPermission = require('./editPermission.model')
const LearningAction = require('./learning-action.model')
const LearningPath = require('./learning-path.model')
const LessonPart = require('./lesson-part.model')
const Lesson = require('./lesson.model')
const Notification = require('./notification.model')
const Organization = require('./organization.model')
const Part = require('./part.model')
const Setting = require('./setting.model')
const UserFollowRoadmap = require('./user-follow-roadmap')
const OrganizationUser = require('./organization-user.model')
const LessonUpdate = require('./lesson-update.model')
const Comment = require('./comment.model')
const Rubric = require('./rubric.model')
const AnalysisUser = require('./analysis-user.model')
const AnalysisLp = require('./analysis-lp.model')
const Roadmap = require('./roadmap.model')
const RoadmapStep = require('./roadmap-step.model')
const UserStarLp = require('./user-star-lp.model')
const UserStarRoadmap = require('./user-star-roadmap.model')
const Admin = require('./admin.model')
const Question = require('./question.model')
const Quizzes = require('./quiz.model')
const ResultQuizzes = require('./result-quiz.model')
const ChatRoom = require('./chatroom.model')
const QuestionSet = require('./question-set.model')
const Exam = require('./exam.model')
const ExamAnalyst = require('./exam-analyst.model')
const QuestionSetKey = require('./question-set-key.model')

module.exports = {
  EditPermission,
  LearningAction,
  LearningPath,
  LessonPart,
  Lesson,
  Notification,
  Organization,
  OrganizationUser,
  Part,
  Setting,
  User,
  UserFollowRoadmap,
  LessonUpdate,
  Comment,
  Rubric,
  AnalysisUser,
  Roadmap,
  RoadmapStep,
  UserStarRoadmap,
  UserStarLp,
  Admin,
  AnalysisLp,
  Question,
  Quizzes,
  ResultQuizzes,
  ChatRoom,
  QuestionSet,
  Exam,
  ExamAnalyst,
  QuestionSetKey
}
