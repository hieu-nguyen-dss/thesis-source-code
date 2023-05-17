import React from 'react'
import '../../../css/exam-analyst.css'
import { Col, Form, Input, Modal, Row } from 'antd'
import { handleCreateAnalystApi } from '../../../apis/examAnalyst'
export const ExamAnalyst = (props) => {
  const [form] = Form.useForm()
  return (
    <Modal {...props} okButtonProps={{ htmlType: 'submit', form: 'form_create_analyst' }}>
      <Form
        name="form_create_analyst"
        form={form}
        layout="vertical"
        onFinish={(data) => {
          console.log('data: ', data)
          handleCreateAnalystApi(
            props.examId,
            data.high_grade,
            data.normal_grade,
            data.low_grade,
            data.comment
          )
            .then((response) => {
              props.onCancel()
              props.onRefreshList()
            })
            .catch((error) => {
              console.error(error)
            })
        }}>
        <Row gutter={[24, 0]}>
          <Col span={24}>
            <Form.Item
              label={<div>Phần trăm điểm cao</div>}
              name={'high_grade'}
              rules={[{ required: true, message: 'Vui lòng điền nội dung!' }]}>
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<div>Phần trăm điểm trung bình</div>}
              name={'normal_grade'}
              rules={[{ required: true, message: 'Vui lòng điền nội dung!' }]}>
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<div>Phần trăm điểm kém</div>}
              name={'low_grade'}
              rules={[{ required: true, message: 'Vui lòng điền nội dung!' }]}>
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={<div>Nhận xét</div>}
              name={'comment'}
              rules={[{ required: true, message: 'Vui lòng điền nội dung!' }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
