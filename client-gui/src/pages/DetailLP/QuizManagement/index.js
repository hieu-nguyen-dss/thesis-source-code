import * as React from 'react'
import { Box } from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useParams, useLocation } from 'react-router-dom'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { lpApi } from '../../../apis'
import { useSnackbar } from '../../../contexts'
import { HTTP_STATUS, SNACKBAR } from '../../../constants'
import faker from 'faker'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const QuizzManagement = (props) => {
  const { id } = useParams()
  const [data, setData] = React.useState([])
  const { openSnackbar } = useSnackbar()
  const location = useLocation()
  const lessons = location.state.lessons
  const lessonId = Object.values(lessons)?.map((l) => l._id)

  const [lesson, setLesson] = React.useState(lessonId[0])
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: lessons[lesson].name
      }
    }
  }

  const labels = [1, 2, 3, 4, 5, 6, 7.5, 8, 9, 10]

  const handleChange = (event, name) => {
    setLesson(event.target.value)
  }

  const countElements = (arr) => {
    const counts = {}
    const result = []

    for (let i = 0; i < arr.length; i++) {
      const element = arr[i]
      if (counts[element]) {
        counts[element]++
      } else {
        counts[element] = 1
      }
    }

    for (const key in counts) {
      result.push({ element: parseFloat(key), count: counts[key] })
    }
    result.sort((a, b) => a.element - b.element)
    return result
  }

  const getQuizResult = async () => {
    try {
      const { status, data } = await lpApi.quizResult(id, lessons[lesson]?.quiz[0]._id)
      if (status === HTTP_STATUS.OK && data.length !== 0) {
        const points = data.map((d) => d.score)
        setData({
          labels,
          datasets: [
            {
              label: 'Number scores',
              data: labels.map((l) => {
                if (!points.includes(l)) {
                  return 0
                } else {
                  const ele = countElements(points).find((p) => p.element === l)
                  return ele.count
                }
              }),
              backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }
          ]
        })
      }
    } catch (error) {
      openSnackbar(SNACKBAR.ERROR, 'Error')
    }
  }

  React.useEffect(() => {
    getQuizResult()
  }, [lessons[lesson]?.quiz[0]._id])

  return (
    <React.Fragment>
      <Box
        sx={{
          background: 'white',
          p: 2,
          mt: 2,
          borderRadius: 3,
          minHeight: 'calc(100vh - 140px)'
        }}>
        <Box sx={{ width: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Lesson quizz</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={lesson}
              label="Lesson quizz"
              onChange={handleChange}>
              {Object.values(lessons)?.map((ln, key) => {
                return (
                  <MenuItem key={key} value={ln._id}>
                    {ln.name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Box>
        {data.length !== 0 && <Bar options={options} data={data} />}
      </Box>
    </React.Fragment>
  )
}
export default QuizzManagement
