import * as React from 'react'
import { Paper } from '@mui/material'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js'
import { Line } from 'react-chartjs-2'

import { analysisApi } from '../../apis'
import { HTTP_STATUS } from '../../constants'
import { useAdmin } from '../../contexts'

ChartJS.register(
  Title,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
)

const Analysis = (props) => {
  const { dashboardData: data } = useAdmin()
  console.log(data)
  return (
    <Paper
      sx={{
        width: '100%',
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        borderRadius: '0.75rem',
        background:
          'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))'
      }}>
      <Line
        options={{
          plugins: {
            legend: {
              labels: {
                color: 'white',
                boxHeight: 0
              }
            },
            title: {
              display: true,
              text: 'Learningpath analysis',
              font: {
                size: 14
              },
              color: 'white'
            }
          },
          interaction: {
            intersect: false
          },
          scales: {
            y: {
              grid: {
                drawBorder: false,
                display: true,
                drawOnChartArea: true,
                drawTicks: false,
                borderDash: [5, 5],
                color: 'rgba(255, 255, 255, .2)'
              },
              ticks: {
                display: true,
                color: '#f8f9fa',
                padding: 10,
                font: {
                  size: 14,
                  weight: 300,
                  family: 'Roboto',
                  style: 'normal',
                  lineHeight: 2
                }
              }
            },
            x: {
              grid: {
                drawBorder: false,
                display: false,
                drawOnChartArea: false,
                drawTicks: false,
                borderDash: [5, 5],
                color: 'rgba(255, 255, 255, .2)'
              },
              ticks: {
                display: true,
                color: '#f8f9fa',
                padding: 10,
                font: {
                  size: 14,
                  weight: 300,
                  family: 'Roboto',
                  style: 'normal',
                  lineHeight: 2
                }
              }
            }
          }
        }}
        data={{
          labels: data.totalLpTimeSr.map(u => new Date(u.timestamp).getMinutes()),
          datasets: [
            {
              label: 'Courses',
              pointBackgroundColor: 'white',
              data: data.totalLpTimeSr.map(u => u.totalCourses),
              borderColor: 'white',
              borderWidth: 3,
              fill: true,
              tension: 0.4
            },
            {
              label: 'Roadmaps',
              pointBackgroundColor: 'black',
              data: data.totalLpTimeSr.map(u => u.totalRoadmaps),
              borderColor: 'black',
              borderWidth: 3,
              fill: true,
              tension: 0.4
            }
          ]
        }}
      />
    </Paper>
  )
}
export default Analysis
