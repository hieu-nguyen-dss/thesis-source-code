import { Col, Form, Input, Modal, Row, Select } from 'antd'
import React from 'react'
import { handleUpdateQuestionApi } from '../../../apis/questionService'
import { useSnackbar } from '../../../contexts'
import { HTTP_STATUS, SNACKBAR } from '../../../constants'

export const EditQuestion = (props) => {
  const { data } = props
  const [form] = Form.useForm()
  const { openSnackbar } = useSnackbar()
  return (
    <Modal {...props} okButtonProps={{ htmlType: 'submit', form: 'form_edit_question' }}>
      <Form
        name="form_edit_question"
        form={form}
        layout="vertical"
        onFinish={(data) => {
          handleUpdateQuestionApi(
            props.questionId,
            data.question_content,
            data.key,
            data.subject,
            data.category,
            data.level
          )
            .then((response) => {
              console.log('response: ', response)
              if (response.status === HTTP_STATUS.OK) {
                openSnackbar(SNACKBAR.SUCCESS, 'Update question successfully')
                props.onCancel()
                props.onRefreshList()
              }
            })
            .catch(() => {
              openSnackbar(SNACKBAR.ERROR, 'Try again')
            })
        }}>
        <Row gutter={[24, 0]}>
          <Col span={24}>
            <Form.Item
              label={<div>Nội dung câu hỏi</div>}
              name={'question_content'}
              rules={[{ required: true, message: 'Vui lòng điền nội dung!' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<div>Đáp án đúng</div>}
              name={'key'}
              rules={[{ required: true, message: 'Vui lòng điền nội dung!' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<div>Chủ đề</div>}
              name={'subject'}
              rules={[{ required: true, message: 'Vui lòng chọn chủ đề!' }]}>
              <Select>
                <Select.Option value="Tư tưởng Hồ Chí Minh">Tư tưởng Hồ Chí Minh</Select.Option>
                <Select.Option value="Nguyên lý Hệ điều hành">Nguyên lý Hệ điều hành</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<div>Thể loại</div>}
              name={'category'}
              rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}>
              <Select>
                <Select.Option value="Tự luận">Tự luận</Select.Option>
                <Select.Option value="Trắc nghiệm">Trắc nghiệm</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<div>Mức độ</div>}
              name={'level'}
              rules={[{ required: true, message: 'Vui lòng chọn mức độ!' }]}>
              <Select>
                <Select.Option value="Thông hiểu">Thông hiểu</Select.Option>
                <Select.Option value="Vận dụng">Vận dụng</Select.Option>
                <Select.Option value="Vận dụng cao">Vận dụng cao</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
