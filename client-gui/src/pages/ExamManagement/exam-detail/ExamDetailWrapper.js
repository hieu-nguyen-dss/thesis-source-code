import React from 'react'
import { useParams } from 'react-router-dom'
import ExamDetail from './ExamDetail'

const ExamDetailWrapper = () => {
  const { id } = useParams()
  return <ExamDetail id={id} />
}

export default ExamDetailWrapper
