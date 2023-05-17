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

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
)

const AcessTimes = (props) => {
  const getUserAnalysis = async () => {
    try {
      const { status, data } = await analysisApi.getUserAnalysis()
      if (status === HTTP_STATUS) {
        console.log(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Paper
      sx={{
        width: '100%',
        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        borderRadius: '0.75rem',
        background: 'linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))'
      }}>
      <Line
        options={{
          plugins: {
            title: {
              display: true,
              text: 'Access times',
              color: 'rgb(214 214 215)',
              font: { size: 14 }
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
                borderDash: [5, 5]
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
          labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          datasets: [
            {
              label: 'User',
              data: [0, 20, 20, 60, 60, 120, 10, 180, 120, 125, 105, 110, 170],
              borderColor: 'rgb(214 214 215)',
              color: 'rgb(214 214 215)',
              fill: true,
              tension: 0.4,
              borderWidth: 4
            }
          ]
        }}
      />
    </Paper>
  )
}
export default AcessTimes
