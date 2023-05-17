import * as React from 'react'
import { Box } from '@mui/material'
import {} from '@mui/material/colors'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'

import { useDesigner } from '../../contexts'
import { ACTION, ACTION_COLOR } from '../../constants'

ChartJS.register(ArcElement, Tooltip, Legend)

const TimeChart = (props) => {
  const { t } = useTranslation('common')
  const { tasks } = useDesigner()
  const [data, setData] = React.useState(null)
  const makeData = () => {
    let countTaskByAction = {}
    const splitTasks = Object.entries(tasks)
    for (const [id, task] of splitTasks) {
      countTaskByAction = {
        ...countTaskByAction,
        [task.action]: (countTaskByAction[task.action] || 0) + 1
      }
    }
    const { labels, data, backgroundColor, borderColor } = Object.entries(countTaskByAction).reduce(
      (res, [action, count]) => ({
        labels: [...res.labels, t(`learningAction.${action}`)],
        data: [...res.data, count],
        backgroundColor: [...res.backgroundColor, ACTION_COLOR[action]],
        borderColor: [...res.borderColor, ACTION_COLOR[action]]
      }),
      { labels: [], data: [], backgroundColor: [], borderColor: [] }
    )
    setData({
      labels,
      datasets: [
        {
          label: '# of vote',
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1
        }
      ]
    })
  }
  React.useEffect(() => {
    makeData()
  }, [tasks])
  return <Box sx={{ width: 300 }}>{data && <Doughnut data={data} />}</Box>
}
export default TimeChart
