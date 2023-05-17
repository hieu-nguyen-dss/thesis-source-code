/* eslint-disable multiline-ternary */
import { CloudDownloadOutlined, EditOutlined, CommentOutlined } from '@ant-design/icons'
import { Button, Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import '../../../css/exam-detail.css'
import { handleGetExamByIdApi } from '../../../apis/examService'
import { jsPDF } from 'jspdf'
import { useContextExam } from '../../../contexts'
import { font } from './common'
import { Document, Page, pdfjs } from 'react-pdf'
import { ExamAnalyst } from '../exam-analyst'
import { hanldeGetAnalystByIdApi } from '../../../apis/examAnalyst'
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const ExamDetail = () => {
  const { questionsList, key } = useContextExam()
  const { state } = useLocation()
  const { order } = state
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pdfFile, setPdfFile] = useState()
  const [isOpenModalCreateAnalyst, setIsOpenModalCreateAnalyst] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = (id) => {
    setIsModalOpen(false)
    navigate(`question-management/detail/${id}`)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const { id } = useParams()
  const [examByIdData, setExamByIdData] = useState()
  const [analystByIdData, setAnalystByIdData] = useState()
  const [questionsToRender, setQuestionsToRender] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [numPages, setNumPages] = useState(null)

  const getExam = async (examId) => {
    const examData = await handleGetExamByIdApi(examId)
    setExamByIdData(examData?.data)
    if (examData?.file) {
      const file = require(`uploads/${examData.file}`)
      setPdfFile(file)
    }
  }

  const getAnalyst = async (examId) => {
    const analyst = await hanldeGetAnalystByIdApi(examId)
    setAnalystByIdData(analyst?.data)
  }
  const createPDF = async (examId) => {
    // eslint-disable-next-line new-cap
    const pdf = new jsPDF('portrait', 'pt', 'a4')
    const data = await document.querySelector(examId)
    const cloneData = data.cloneNode(true)
    cloneData.style.width = '600px'
    pdf.addFileToVFS('times-normal.ttf', font)
    pdf.addFont('times-normal.ttf', 'times', 'normal')
    pdf.setFont('times')
    pdf.html(cloneData).then(() => {
      pdf.save(`De_thi_so_${order}.pdf`)
    })
  }

  useEffect(() => {
    getExam(id)
    getAnalyst(id)
  }, [])

  useEffect(() => {
    const questionAllContext = questionsList
    const keyAllContext = key
    if (examByIdData && examByIdData?.questions && questionAllContext) {
      const listQuestions = examByIdData
      const questionIdList = listQuestions?.questions.split(',')
      const questions = questionIdList?.map((questionId) => {
        const questionContent = questionAllContext.find((question) => question._id === questionId)
        if (questionContent.category === 'Trắc nghiệm') {
          questionContent.answer = keyAllContext.find((key) => key.questionId === questionId)
        }
        return questionContent
      })
      setQuestionsToRender(questions)
    }
  }, [examByIdData])

  const QuestionDetail = ({ question, index }) => {
    const answers = question.answer !== undefined ? question.answer.keyAnswer.split('|') : []
    return (
      <div>
        <h4>{`Câu ${index + 1}: ${question.content.replace(/<[^>]+>/g, '')}`}</h4>
        {question.category === 'Trắc nghiệm' ? (
          answers.map((answer) => (
            <>
              <span>{answer.replace(/<[^>]+>/g, '')}</span>
              <br />
            </>
          ))
        ) : (
          <br />
        )}
      </div>
    )
  }

  const KeyDetail = ({ question, index }) => {
    return (
      <div>
        <h4>{`Câu ${index + 1}: ${question.key.replace(/<[^>]+>/g, '')}`}</h4>
      </div>
    )
  }

  const AnalystDetail = ({ analyst, index }) => {
    return (
      <div>
        <h4 style={{ margin: 20 }}>{`Đánh giá thứ ${index}`}</h4>
        <span style={{ margin: 20 }}>{`Số điểm cao: ${analyst?.highGrade}`}</span>
        <span style={{ margin: 20 }}>{`Số điểm trung bình: ${analyst?.commonGrade}`}</span>
        <span style={{ margin: 20 }}>{`Số điểm thấp: ${analyst?.lowGrade}`}</span> <br />
        <span style={{ margin: 20 }}>{`Nhận xét: ${analyst?.comments}`}</span>
      </div>
    )
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  return (
    <div>
      <div className="action-exam">
        <div className="upload">
          <Button icon={<CloudDownloadOutlined />} onClick={() => createPDF('#pdf-container')}>
            Xuất file đề thi
          </Button>
          <Button icon={<CloudDownloadOutlined />} onClick={() => createPDF('#pdf-key')}>
            Xuất file đáp án
          </Button>
        </div>
        <div className="edit-exam">
          <Button icon={<EditOutlined />} onClick={showModal}>
            Chỉnh sửa đề thi
          </Button>
          <Modal
            title="Chỉnh sửa đề thi"
            open={isModalOpen}
            onOk={() => handleOk(1)}
            onCancel={handleCancel}>
            <div>
              Câu hỏi bạn muốn chỉnh sửa là
              <Input type="number" />
            </div>
          </Modal>
        </div>
        <div className="analyst-exam">
          <Button icon={<CommentOutlined />} onClick={() => setIsOpenModalCreateAnalyst(true)}>
            Đánh giá đề thi
          </Button>
        </div>
      </div>

      {examByIdData?.file ? (
        <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={1} renderTextLayer={false} />
        </Document>
      ) : (
        <div>
          <div
            className="exam-detail"
            id="pdf-container"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            <header className="headerContainer">
              <h2>.....................................................................</h2>
              <h2>Đề thi số {order}</h2>
              <h2>Môn học: {examByIdData?.subject}</h2>
              <h3>Thời gian: {examByIdData?.timeLimit} phút</h3>
            </header>
            <main className="mainExamContainer">
              {questionsToRender?.map((question, index) => (
                <QuestionDetail question={question} index={index} />
              ))}
            </main>
          </div>
          <h2 style={{ margin: 20 }}>Đáp án</h2>
          <div
            className="key-answer"
            id="pdf-key"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            {questionsToRender?.map((question, index) => (
              <KeyDetail question={question} index={index} />
            ))}
          </div>
          <h2 style={{ margin: 20 }}>Đánh giá</h2>
          {analystByIdData?.keyAnswer.map((analyst, index) => (
            <AnalystDetail analyst={analyst} index={index + 1} />
          ))}
        </div>
      )}
      {isOpenModalCreateAnalyst && (
        <ExamAnalyst
          examId={id}
          title={<h2 className="mb-[32px] underline">Tạo đánh giá đề thi</h2>}
          open={isOpenModalCreateAnalyst}
          rootClassName="modal-upload-file-exam"
          onCancel={() => {
            setIsOpenModalCreateAnalyst(false)
          }}
          getContainer={false}
          isEdit={false}
          okText="Tạo đánh giá"
          cancelText="Hủy bỏ"
          onRefreshList={async () => {
            const examData = await handleGetExamByIdApi(id)
            setExamByIdData(examData?.data)
            const analyst = await hanldeGetAnalystByIdApi(id)
            setAnalystByIdData(analyst)
          }}
        />
      )}
    </div>
  )
}

export default ExamDetail
