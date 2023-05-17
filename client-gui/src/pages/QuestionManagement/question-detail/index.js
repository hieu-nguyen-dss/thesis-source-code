import { EditOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import '../../../css/question-detail.css'
import { handleGetKeyByIdApi } from '../../../apis/keyService'
import { handleGetQuestionByIdApi } from '../../../apis/questionService'
import { EditQuestion } from '../edit-question'

const QuestionDetail = () => {
  const { state } = useLocation()
  const { order } = state
  const { id } = useParams()
  const [questionDetailData, setQuestionDetailData] = useState()
  const [keyDetailData, setKeyDetailData] = useState()
  const navigate = useNavigate()
  const [loading, setLoading] = useState()
  const [key, setKey] = useState()
  const [isOpen, setIsOpen] = useState(false)

  const getQuestionById = async (questionId) => {
    setLoading(true)
    const questionData = await handleGetQuestionByIdApi(questionId)
    if (questionData.status === 200) {
      setQuestionDetailData(questionData?.data)
    }
    setLoading(false)
  }
  const getKeyById = async (questionId) => {
    const keyData = await handleGetKeyByIdApi(questionId)
    if (keyData.status === 200) {
      setKeyDetailData(keyData?.data)
    }
  }
  const handleOnclickDone = () => {
    navigate('/question-management')
  }

  useEffect(() => {
    getQuestionById(id)
    getKeyById(id)
  }, [])

  useEffect(() => {
    if (keyDetailData) {
      const keys = keyDetailData?.keyAnswer
      const answer = keys.split('|')
      setKey(answer)
    }
  }, [keyDetailData])

  return (
    <div className="container-add-question">
      <div className="edit-question">
        <Button icon={<EditOutlined />} onClick={() => setIsOpen(true)}>
          Chỉnh sửa câu hỏi
        </Button>
      </div>
      <div className="question-detail">
        <h4>
          {!loading && `Câu ${order}: ${questionDetailData?.content.replace(/<[^>]+>/g, '')}`}
        </h4>
        {questionDetailData?.category === 'Trắc nghiệm' && (
          <>
            <span>{key && key[0].replace(/<[^>]+>/g, '')}</span> <br />
            <span>{key && key[1].replace(/<[^>]+>/g, '')}</span>
            <br />
            <span>{key && key[2].replace(/<[^>]+>/g, '')}</span>
            <br />
            <span>{key && key[3].replace(/<[^>]+>/g, '')}</span>
            <br />
          </>
        )}
      </div>
      {isOpen && (
        <EditQuestion
          data={questionDetailData}
          questionId={id}
          title={<h2 className="mb-[32px] underline">Chỉnh sửa câu hỏi</h2>}
          open={isOpen}
          rootClassName="modal-edit-question"
          onCancel={() => {
            setIsOpen(false)
          }}
          getContainer={false}
          isEdit={false}
          okText="Hoàn thành"
          cancelText="Hủy bỏ"
          onRefreshList={async () => {
            const questionData = await handleGetQuestionByIdApi(id)
            setQuestionDetailData(questionData?.data)
            const keyData = await handleGetKeyByIdApi(id)
            setKeyDetailData(keyData?.data)
          }}
        />
      )}
    </div>
  )
}
export default QuestionDetail
