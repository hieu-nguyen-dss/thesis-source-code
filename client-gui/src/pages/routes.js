import { lazy } from 'react'

const HomePage = lazy(() => import('./Home'))
const LoginPage = lazy(() => import('./Login'))
const Profile = lazy(() => import('./Profile'))
const SignupPage = lazy(() => import('./Signup'))
const SettingsPage = lazy(() => import('./Settings'))
const NewLP = lazy(() => import('./NewLP'))
const MyLPs = lazy(() => import('./MyLPs'))
const DetailLP = lazy(() => import('./DetailLP'))
const Lesson = lazy(() => import('./Lesson'))
const Organization = lazy(() => import('./Organization'))
const DetailOGZ = lazy(() => import('./DetailOGZ'))
const Outcomes = lazy(() => import('./Outcomes'))
const Rubric = lazy(() => import('./Rubric'))
const Discovery = lazy(() => import('./Discovery'))
const Roadmap = lazy(() => import('./Roadmap'))
const Dashboard = lazy(() => import('./Dashboard'))
const GuideOGZ = lazy(() => import('./GuiOGZ'))
const Quizzes = lazy(() => import('./Lesson/Quizzes'))
const QuestionManagement = lazy(() => import('./QuestionManagement'))
const ExamManagement = lazy(() => import('./ExamManagement'))
const AddQuestion = lazy(() => import('./QuestionManagement/add-question/AddQuestion'))
const QuestionDetail = lazy(() => import('./QuestionManagement/question-detail'))
const ExamDetail = lazy(() => import('./ExamManagement/exam-detail/ExamDetailWrapper'))
const StudentManagement = lazy(() => import('./DetailLP/StudentManagement'))
const QuizManagement = lazy(() => import('./DetailLP/QuizManagement'))
const publicRoutes = [
  {
    path: '/login',
    public: true,
    component: LoginPage
  },
  {
    path: '/signup',
    public: true,
    component: SignupPage
  }
]

const privateRoutes = [
  {
    path: '/',
    public: false,
    component: Dashboard,
    index: true
  },
  {
    path: '/home',
    public: false,
    component: HomePage,
    index: true
  },
  {
    path: '/profile/:userId',
    exact: false,
    public: false,
    component: Profile
  },
  {
    path: '/users/profile/:id',
    exact: false,
    public: false,
    component: Profile
  },
  {
    path: '/settings',
    public: false,
    component: SettingsPage
  },
  {
    path: '/new-lps',
    public: false,
    component: NewLP
  },
  {
    path: '/question-management',
    public: false,
    component: QuestionManagement
  },
  {
    path: '/question-management/type-question',
    public: false,
    component: AddQuestion
  },
  {
    path: '/question-management/detail/:id',
    public: false,
    component: QuestionDetail
  },
  {
    path: '/exam-management/exam-detail/:id',
    public: false,
    component: ExamDetail
  },
  {
    path: '/exam-management/exam-detail/:id/question-management/detail/:id',
    public: false,
    component: QuestionDetail
  },
  {
    path: '/exam-management',
    public: false,
    component: ExamManagement
  },
  {
    path: '/my-lps',
    public: false,
    component: MyLPs
  },
  {
    path: '/my-lps/courses/:id',
    public: false,
    component: DetailLP
  },
  {
    path: '/my-lps/courses/:id/student-management',
    public: false,
    component: StudentManagement
  },
  {
    path: '/my-lps/courses/:id/quiz-management',
    public: false,
    component: QuizManagement
  },
  {
    path: '/organizations/:ogzId/courses/:id/student-management',
    public: false,
    component: StudentManagement
  },
  {
    path: '/organizations/:ogzId/courses/:id/quiz-management',
    public: false,
    component: QuizManagement
  },
  {
    path: '/my-lps/courses/:id/outcomes',
    public: false,
    component: Outcomes
  },
  {
    path: '/organizations/:ogzId/courses/:id/outcomes',
    public: false,
    component: Outcomes
  },
  {
    path: '/my-lps/courses/:id/rubrics',
    public: false,
    component: Rubric
  },
  {
    path: '/organizations/:ogzId/courses/:id/rubrics',
    public: false,
    component: Rubric
  },
  {
    path: '/my-lps/courses/:id/:lesson',
    public: false,
    component: Lesson
  },
  {
    path: '/organizations/:ogzId/courses/:id/:lesson',
    public: false,
    component: Lesson
  },
  {
    path: 'organizations/:ogzId/courses/:id/:lesson/quizzes',
    public: false,
    component: Quizzes
  },
  {
    path: '/my-lps/courses/:id/:lesson/quizzes',
    public: false,
    component: Quizzes
  },
  {
    path: '/organizations',
    public: false,
    component: Organization
  },
  {
    path: '/organizations/information/:ogzId',
    public: false,
    component: GuideOGZ
  },
  {
    path: '/organizations/:ogzId',
    public: false,
    component: DetailOGZ
  },
  {
    path: '/organizations/:ogzId/courses/:id',
    public: false,
    component: DetailLP
  },
  {
    path: '/discovery',
    public: false,
    component: Discovery
  },
  {
    path: '/my-lps/roadmaps/:roadmapId',
    public: false,
    component: Roadmap
  }
]

export { publicRoutes, privateRoutes }
