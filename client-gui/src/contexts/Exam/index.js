import React, { useState, useEffect } from 'react'
import { handleQuestionListApi } from '../../apis/questionService'
import { handleKeyListApi } from '../../apis/keyService'
import { useLocation } from 'react-router-dom'
const ExamContext = React.createContext({})

const ExamProvider = ({ children }) => {
  const [user, setUser] = useState([])
  const [questionsList, setQuestionsList] = useState([])
  const [key, setKey] = useState([])
  const { pathname } = useLocation()
  const getExamQuestionStatistics = async () => {
    if (pathname.includes('/exam-management') || pathname.includes('/question-management')) {
      try {
        const allQuestionsData = await handleQuestionListApi()
        setQuestionsList(allQuestionsData?.data)

        const allKeyData = await handleKeyListApi()
        setKey(allKeyData?.data)
      } catch (error) {
        console.log(error)
      }
    }
  }
  useEffect(() => {
    getExamQuestionStatistics()
  }, [])

  const value = { user, setUser, questionsList, setQuestionsList, key, setKey }
  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>
}

const useContextExam = () => React.useContext(ExamContext)
export { useContextExam, ExamProvider }
