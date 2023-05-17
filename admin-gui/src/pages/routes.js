import { lazy } from 'react'

const LoginPage = lazy(() => import('./Login'))
const SignupPage = lazy(() => import('./Signup'))
const Dashboard = lazy(() => import('./Dashboard'))
const User = lazy(() => import('./User'))
const Learningpath = lazy(() => import('./Learningpath'))

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
    public: true,
    component: Dashboard
  },
  {
    path: '/users',
    public: true,
    component: User
  },
  {
    path: '/learningpaths',
    public: true,
    component: Learningpath
  }
]

export { publicRoutes, privateRoutes }
