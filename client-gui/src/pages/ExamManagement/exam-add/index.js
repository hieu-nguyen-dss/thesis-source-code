import { Alert, Col, Form, Input, Modal, Row } from 'antd'
import { useState } from 'react'
import { useContextExam } from '../../../contexts'
import { handleCreateExamApi } from '../../../apis/examService'

export default function ExamCreate(props) {
  const { questionsList } = useContextExam()
  const listQuestions = questionsList
  console.log('questionsList: ', questionsList)
  const [error, setError] = useState('')
  function getRandom(arr, n) {
    const result = new Array(n)
    let len = arr.length
    const taken = new Array(len)
    if (n > len) {
      setError('Vượt quá số lượng câu hỏi sẵn có')
    }
    while (n--) {
      const x = Math.floor(Math.random() * len)
      result[n] = arr[x in taken ? taken[x] : x]
      taken[x] = --len in taken ? taken[len] : len
    }
    return result
  }
  const handleCreateExam = (
    listQuestions,
    category,
    subject,
    easyQuestion,
    normalQuestion,
    hardQuestion
  ) => {
    const questionIdList = []
    const filterSubject = listQuestions.filter(
      (question) => question.subject === subject && question.category === category
    )
    const allEasyQuestion = filterSubject.filter((question) => question.level === 'Thông hiểu')
    const allNormalQuestion = filterSubject.filter((question) => question.level === 'Vận dụng')
    const allHardQuestion = filterSubject.filter((question) => question.level === 'Vận dụng cao')
    const easyQuestionTarget = getRandom(allEasyQuestion, easyQuestion)
    const normalQuestionTarget = getRandom(allNormalQuestion, normalQuestion)
    const hardQuestionTarget = getRandom(allHardQuestion, hardQuestion)
    if (easyQuestion > 0) {
      easyQuestionTarget?.forEach((question) => questionIdList.push(question._id))
    }
    if (normalQuestion > 0) {
      normalQuestionTarget.length > 0 &&
        normalQuestionTarget?.forEach((question) => questionIdList.push(question._id))
    }
    if (hardQuestion > 0) {
      hardQuestionTarget.length > 0 &&
        hardQuestionTarget?.forEach((question) => questionIdList.push(question._id))
    }
    return questionIdList
  }
  const [form] = Form.useForm()
  return (
    <Modal {...props} okButtonProps={{ htmlType: 'submit', form: 'form_create_exam' }}>
      <Form
        name="form_create_exam"
        form={form}
        layout="vertical"
        onFinish={async (data) => {
          const subject = data?.subject
          const category = data?.category
          const timeLimit = 90
          const maxScore = 10
          const file = undefined
          const listQuestionIds = handleCreateExam(
            listQuestions,
            category,
            subject,
            data?.easyQuestion,
            data?.normalQuestion,
            data?.hardQuestion
          )
          await handleCreateExamApi(
            subject,
            category,
            listQuestionIds.toString(),
            timeLimit,
            maxScore,
            file
          )
          props.onCancel()
          props.onRefreshList()
        }}>
        <Row gutter={[24, 0]}>
          <Col span={24}>
            <Form.Item
              label={<div>Môn học</div>}
              name={'subject'}
              rules={[{ required: true, message: 'Vui lòng điền môn học' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<div>Thể loại</div>}
              name={'category'}
              rules={[{ required: true, message: 'Vui lòng điền thể loại' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<div>Số lượng câu hỏi thông hiểu</div>}
              name={'easyQuestion'}
              rules={[{ required: true, message: 'Vui lòng điền số lượng' }]}>
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<div>Số lượng câu hỏi vận dụng</div>}
              name={'normalQuestion'}
              rules={[{ required: true, message: 'Vui lòng điền số lượng' }]}>
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<div>Số lượng câu hỏi vận dụng cao</div>}
              name={'hardQuestion'}
              rules={[{ required: true, message: 'Vui lòng điền số lượng' }]}>
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {error && <Alert message={error} type="error" />}
    </Modal>
  )
}
