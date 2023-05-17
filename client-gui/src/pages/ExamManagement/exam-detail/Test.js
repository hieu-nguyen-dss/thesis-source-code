/* eslint-disable multiline-ternary */
import { CloudDownloadOutlined, EditOutlined, CommentOutlined } from '@ant-design/icons'
import { Button, Input, Modal } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../../../css/exam-detail.css'
import { handleGetExamByIdApi } from '../../../apis/examService'
import { jsPDF } from 'jspdf'
import { Context } from '../../../contexts/Exam'
export const Test = () => {
  const context = useContext(Context)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const { id } = useParams()
  const [examByIdData, setExamByIdData] = useState()
  const [questionsToRender, setQuestionsToRender] = useState([])

  const getExam = async (examId) => {
    const examData = await handleGetExamByIdApi(examId)
    setExamByIdData(examData)
  }
  const createPDF = async () => {
    // eslint-disable-next-line new-cap
    const pdf = new jsPDF('portrait', 'pt', 'a4')
    const data = await document.querySelector('#pdf-container')
    const cloneData = data.cloneNode(true)
    cloneData.style.width = '600px'
    // pdf.addFileToVFS("times-normal.ttf", font);
    pdf.addFont('times-normal.ttf', 'times', 'normal')
    pdf.setFont('times')
    pdf.html(cloneData).then(() => {
      pdf.save(`De_thi_so_${id}.pdf`)
    })
  }
  useEffect(() => {
    getExam(id)
  }, [])

  useEffect(() => {
    const questionAllContext = context?.questionsList?.questions
    const keyAllContext = context?.key.keys
    if (examByIdData && questionAllContext) {
      const listQuestions = examByIdData?.exam

      const questionIdList = listQuestions?.questions.split(',')
      const questions = questionIdList.map((questionId) => {
        const questionContent = questionAllContext.find((question) => question.id === questionId)
        if (questionContent.category === 'Trắc nghiệm') {
          questionContent.answer = keyAllContext.find((key) => key.questionId === questionId)
        }
        return questionContent
      })
      console.log('questions to render: ', questions)
      setQuestionsToRender(questions)
    }
  }, [examByIdData])

  const QuestionDetail = ({ question, index }) => {
    const answers = question.answer !== undefined ? question.answer.keyAnswer.split('|') : []
    return (
      <div>
        <h4>{`Câu ${index + 1}: ${question.content}`}</h4>
        {question.category === 'Trắc nghiệm' ? (
          answers.map((answer) => (
            <>
              <span>{answer}</span>
              <br />
            </>
          ))
        ) : (
          <br />
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="action-exam">
        <div className="upload">
          <Button icon={<CloudDownloadOutlined />} onClick={() => createPDF()}>
            Xuất file
          </Button>
        </div>
        <div className="edit-exam">
          <Button icon={<EditOutlined />} onClick={showModal}>
            Chỉnh sửa đề thi
          </Button>
          <Modal
            title="Chỉnh sửa đề thi"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}>
            <div>
              Câu hỏi bạn muốn chỉnh sửa là
              <Input type="number" />
            </div>
          </Modal>
        </div>
        <div className="analyst-exam">
          <Button icon={<CommentOutlined />}>Đánh giá đề thi</Button>
        </div>
      </div>
      <div
        className="exam-detail"
        id="pdf-container"
        style={{ fontFamily: '"Times New Roman", Times, serif' }}>
        <header className="headerContainer">
          <h2>.....................................................................</h2>
          <h2>Đề thi số {id}</h2>
          <h2>Môn học: {examByIdData?.exam.subject}</h2>
          <h3>Thời gian: {examByIdData?.exam.timeLimit} phút</h3>
        </header>
        <main className="mainExamContainer">
          {questionsToRender.map((question, index) => (
            <QuestionDetail question={question} index={index} />
          ))}
        </main>
      </div>
    </div>
  )
}
