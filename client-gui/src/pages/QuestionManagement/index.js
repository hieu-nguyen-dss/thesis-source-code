/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React, { useContext, useEffect, useState } from 'react'
import '../../css/question-management.css'
import { CloudUploadOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Input, Popconfirm, Table } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { handleDeleteQuestionApi, handleQuestionListApi } from '../../apis/questionService'
import { HTTP_STATUS, SNACKBAR } from '../../constants'
import { useSnackbar } from '../../contexts'

const { Search } = Input

const QuestionManagementComponent = () => {
  const [inputSearch, setInputSearch] = useState('')
  const { id } = useParams()
  const onSearch = (value) => setInputSearch(value)
  const { openSnackbar } = useSnackbar()

  const [listQuestionsData, setListQuestionsData] = useState()
  const navigate = useNavigate()
  const handleOnclickViewQuestion = (questionId, id) => {
    navigate(`/question-management/detail/${questionId}`, {
      state: {
        order: id
      }
    })
  }
  const handleOnClickTypeQuestion = () => {
    navigate('/question-management/type-question')
  }
  const [dataRow, setDataRow] = useState([])

  const getAllQuestion = async () => {
    const allQuestionsData = await handleQuestionListApi()
    setListQuestionsData(allQuestionsData?.data)
  }

  const handleDeleteQuestion = async (questionId) => {
    try {
      const res = await handleDeleteQuestionApi(questionId)
      if (res.status === HTTP_STATUS.OK) {
        await getAllQuestion()
        openSnackbar(SNACKBAR.SUCCESS, 'Delete question successfully')
      } else {
        openSnackbar(SNACKBAR.ERROR, 'Try again')
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Try again')
    }
  }

  useEffect(() => {
    getAllQuestion()
  }, [])

  useEffect(() => {
    let newDataRow = []
    listQuestionsData?.forEach((question, key) => {
      const questionContent = question.content.replace(/<[^>]+>/g, '')
      newDataRow.push({
        id: key + 1,
        questionId: question._id,
        question: questionContent,
        subject: question.subject,
        category: question.category,
        level: question.level
      })
    })
    newDataRow = newDataRow.filter((data) =>
      data.question.toLowerCase().includes(inputSearch.toLowerCase())
    )
    setDataRow(newDataRow)
  }, [listQuestionsData, inputSearch])

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id'
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'question',
      width: '30%'
    },
    {
      title: 'Chủ đề',
      dataIndex: 'subject',
      filters: [
        {
          text: 'Tư tưởng Hồ Chí Minh',
          value: 'Tư tưởng Hồ Chí Minh'
        },
        {
          text: 'Nguyên lý hệ điều hành',
          value: 'Nguyên lý hệ điều hành'
        }
      ],
      filterSearch: true,
      onFilter: (value, record) => record.subject.startsWith(value)
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
      filters: [
        {
          text: 'Tự luận',
          value: 'Tự luận'
        },
        {
          text: 'Trắc nghiệm',
          value: 'Trắc nghiệm'
        }
      ],
      filterSearch: true,
      onFilter: (value, record) => record.category.startsWith(value)
    },
    {
      title: 'Mức độ',
      dataIndex: 'level',
      filters: [
        {
          text: 'Thông hiểu',
          value: 'Thông hiểu'
        },
        {
          text: 'Vận dụng',
          value: 'Vận dụng'
        },
        {
          text: 'Vận dụng cao',
          value: 'Vận dụng cao'
        }
      ],
      onFilter: (value, record) => record.level.startsWith(value),
      filterSearch: true
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      render: (row) => (
        <div className="action">
          <EyeOutlined onClick={(e) => handleOnclickViewQuestion(row.questionId, row.id)} />
          <Popconfirm
            title="Bạn có muốn xóa câu hỏi này không?"
            onConfirm={(e) => handleDeleteQuestion(row.questionId)}
            onCancel={(e) => console.log('No')}
            okText="Đồng ý"
            cancelText="Không đồng ý"
            className="pop-confirm">
            <DeleteOutlined />
          </Popconfirm>
        </div>
      )
    }
  ]

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra)
  }
  return (
    <div className="questionContainer">
      <div className="uploadAndSearch">
        <div className="leftPath">
          <div className="upload">
            <Button icon={<CloudUploadOutlined />}>Tải file lên</Button>
          </div>
          <div className="writeQuestion">
            <Button icon={<EditOutlined />} onClick={handleOnClickTypeQuestion}>
              Nhập câu hỏi
            </Button>
          </div>
        </div>
        <div className="rightPath">
          <div className="search">
            <Search
              placeholder="Tìm kiếm câu hỏi"
              onSearch={onSearch}
              style={{
                width: 200
              }}
              onChange={(e) => console.log('value: ', e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="listQuestion">
        <Table columns={columns} dataSource={dataRow} onChange={onChange} />
      </div>
    </div>
  )
}

export default QuestionManagementComponent
