import * as React from 'react'
import { Box } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import { Pie, Doughnut } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'

import { COLOR_PALLETE } from '../../constants'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

const Statistics = (props) => {
  const { t } = useTranslation('common')
  const [pointData, setPointData] = React.useState({
    labels: [],
    datasets: [
      {
        label: '# of Vote',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }
    ]
  })
  const [questionData, setQuestionData] = React.useState({
    labels: [],
    datasets: [
      {
        label: '# of Vote',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }
    ]
  })
  const { leaves, rows, summary } = props
  const makeData = () => {
    try {
      const topicIds = leaves.filter((leaf) => leaf.isTopic === true)[0].id
      if (!topicIds) return
      let labels = []
      let dataPoint = []
      let dataQuestion = []
      let backgroundColor = []
      let borderColor = []
      Object.entries(rows).map(([rowId, rowValue], index) => {
        labels = [...labels, rows[rowId][topicIds].name || '']
        dataPoint = [...dataPoint, summary.rowPoints[rowId] || 0]
        dataQuestion = [...dataQuestion, summary.rowQuestions[rowId] || 0]
        backgroundColor = [...backgroundColor, COLOR_PALLETE[index % 7]]
        borderColor = [...borderColor, COLOR_PALLETE[index % 7]]
        return true
      })
      setPointData({
        labels,
        datasets: [
          {
            label: '# of Vote',
            data: dataPoint,
            backgroundColor,
            borderColor,
            borderWidth: 1
          }
        ]
      })
      setQuestionData({
        labels,
        datasets: [
          {
            label: '# of Points',
            data: dataQuestion,
            backgroundColor,
            borderColor,
            borderWidth: 1
          }
        ]
      })
    } catch (error) {
      return {
        labels: [],
        datasets: [
          {
            label: '# of Questions',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
          }
        ]
      }
    }
  }
  React.useEffect(() => {
    makeData()
  }, [rows, summary, leaves])
  return (
    <Box sx={{ height: 250, width: 500, display: 'flex', flexDirection: 'row' }}>
      <Box sx={{ height: 250, width: 250 }} >
        <Pie options={{
          plugins: {
            title: {
              display: true,
              text: t('rubrics.questionByTopic'),
              font: {
                size: 15,
                weight: 500
              },
              color: 'black'
            }
          }
        }} data={questionData} />
      </Box>
      <Box sx={{ height: 250, width: 250 }}>
        <Doughnut options={{
          plugins: {
            title: {
              display: true,
              text: t('rubrics.pointByTopic'),
              font: {
                size: 15,
                weight: 500
              },
              color: 'black'
            }
          }
        }} data={pointData} />
      </Box>
    </Box>
  )
}
export default Statistics
